#!/usr/bin/env node
/**
 * Auto-link glossary terms in articles → /lexique/<slug>.
 *
 * - Lit data/lexique.json, ne garde que les termes `page === true`.
 * - Pour chaque articles/*.html (sauf _TEMPLATE.html) :
 *     - Trouve la PREMIÈRE occurrence (titre OU alias) de chaque terme, casse insensible, word-boundary.
 *     - Ignore les occurrences à l'intérieur de <a>, <code>, <pre>, <script>, <style>, <h1>, <h2>, <h3>.
 *     - Wrappe avec <a class="lex-link" href="/lexique/<slug>" title="<term> — voir la définition"><match></a>.
 *     - Conserve la casse originale du texte matché.
 * - Écrit le fichier modifié (sauf en --dry-run).
 * - Affiche un rapport.
 *
 * Usage :
 *   node scripts/auto-link-glossary.js [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

// Tags dont le contenu textuel ne doit JAMAIS être linké.
const PROTECTED_TAGS = new Set(['a', 'code', 'pre', 'script', 'style', 'h1', 'h2', 'h3', 'head', 'title']);

// Tokenize en alternant tags HTML / segments de texte.
// L'ordre des alternatives importe :
//   1. Commentaire HTML
//   2. DOCTYPE
//   3. Tag ouvrant/fermant (lettre obligatoire après <)
//   4. Run de texte (1+ chars qui ne sont PAS <)
//   5. Fallback : un < isolé (ex. `if (a < b)` dans un <script>) — sinon il est perdu.
const TOKEN_RE = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*>|[^<]+|</g;
const TAG_NAME_RE = /^<\/?\s*([a-zA-Z][a-zA-Z0-9]*)/;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtmlAttr(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Construit un index : pour chaque terme on a un objet { slug, title, surface }
 * où `surface` est la forme exacte à chercher (titre ou alias).
 * Retourne la liste triée par longueur DESC (les plus longs en premier
 * → évite que "MCP" mange "Model Context Protocol").
 */
function buildTermIndex(terms) {
  const entries = [];
  for (const t of terms) {
    if (t.page !== true) continue;
    if (t.link === false) continue; // hook futur si on veut désactiver certains termes
    const surfaces = new Set();
    if (t.title) surfaces.add(t.title);
    if (Array.isArray(t.aliases)) {
      for (const a of t.aliases) {
        if (a && typeof a === 'string') surfaces.add(a);
      }
    }
    for (const surface of surfaces) {
      entries.push({
        slug: t.slug,
        title: t.title,
        surface,
        // Identifiant unique pour la dédup "first occurrence per term".
        // On dédupe par SLUG (pas par surface) — si "LLM" et "large language model"
        // pointent vers /lexique/llm, on ne linke que le PREMIER des deux.
        dedupeKey: t.slug,
      });
    }
  }
  // Trie par longueur DESC pour matcher les expressions longues en priorité.
  entries.sort((a, b) => b.surface.length - a.surface.length);
  return entries;
}

/**
 * Word boundary "Unicode-aware" : on n'utilise pas \b parce qu'il ne gère pas
 * bien l'accentué français (é, è, à...). On force : avant/après le match,
 * il doit y avoir soit le début/fin de chaîne, soit un caractère NON-lettre.
 *
 * Lookbehind/lookahead Unicode property escapes : pris en charge par Node ≥ 18.
 */
function buildSurfaceRegex(surfaces) {
  if (surfaces.length === 0) return null;
  const alt = surfaces.map(escapeRegex).join('|');
  // (?<![\p{L}\p{N}_]) : pas de lettre/chiffre/_ juste avant
  // (?![\p{L}\p{N}_])  : pas de lettre/chiffre/_ juste après
  // 'i' pour case-insensitive, 'u' pour Unicode property escapes.
  return new RegExp(`(?<![\\p{L}\\p{N}_])(${alt})(?![\\p{L}\\p{N}_])`, 'giu');
}

/**
 * Process un fichier HTML. Retourne { html, linksAdded, termsLinked: Map<slug, count> }.
 */
function processHtml(html, termIndex) {
  // Map { surfaceLowerCase → entry } pour retrouver vite l'entry à partir d'un match.
  const surfaceToEntries = new Map();
  for (const e of termIndex) {
    const key = e.surface.toLowerCase();
    if (!surfaceToEntries.has(key)) surfaceToEntries.set(key, []);
    surfaceToEntries.get(key).push(e);
  }

  const surfaces = termIndex.map(e => e.surface);
  const surfaceRe = buildSurfaceRegex(surfaces);
  if (!surfaceRe) return { html, linksAdded: 0, termsLinked: new Map() };

  // Slugs déjà linkés dans CE fichier — pour appliquer "first occurrence only".
  // On amorce avec les liens .lex-link déjà présents (idempotence multi-runs).
  const linkedSlugs = new Set();
  const existingLinkRe = /<a[^>]*class=["'][^"']*\blex-link\b[^"']*["'][^>]*href=["']\/lexique\/([\w-]+)["']/gi;
  let existingMatch;
  while ((existingMatch = existingLinkRe.exec(html)) !== null) {
    linkedSlugs.add(existingMatch[1]);
  }
  const termsLinked = new Map(); // slug → count (toujours 0 ou 1 ici)

  // Tokenize.
  const tokens = [];
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(html)) !== null) {
    tokens.push(m[0]);
  }
  // Sanity check : la concaténation doit ré-égaler le source.
  // (Sinon le tokenizer a perdu des octets — typiquement sur du HTML cassé.)
  if (tokens.join('') !== html) {
    throw new Error('Tokenizer lossy — la concaténation ne correspond pas au source');
  }

  // Walk les tokens en maintenant un compteur de profondeur des tags protégés.
  let protectedDepth = 0;
  let linksAdded = 0;
  const out = [];

  for (const tok of tokens) {
    if (tok.startsWith('<')) {
      // C'est un tag (ou un commentaire, ou un DOCTYPE).
      const tagMatch = tok.match(TAG_NAME_RE);
      if (tagMatch) {
        const tagName = tagMatch[1].toLowerCase();
        const isClosing = tok.startsWith('</');
        // Détecte les self-closing (<br/>, <img/>, etc.) ou les void elements.
        const isSelfClosing = /\/\s*>$/.test(tok);
        const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
        if (PROTECTED_TAGS.has(tagName)) {
          if (isClosing) {
            protectedDepth = Math.max(0, protectedDepth - 1);
          } else if (!isSelfClosing && !VOID.has(tagName)) {
            protectedDepth++;
          }
        }
      }
      out.push(tok);
      continue;
    }

    // Texte. Si on est dans un tag protégé, on ne touche pas.
    if (protectedDepth > 0) {
      out.push(tok);
      continue;
    }

    // Remplacement avec callback sur chaque match.
    surfaceRe.lastIndex = 0;
    const replaced = tok.replace(surfaceRe, (match, captured) => {
      const lookup = surfaceToEntries.get(captured.toLowerCase()) || [];
      // S'il y a plusieurs entries pour la même surface (collision), on prend
      // la première dont le slug n'est pas encore linké.
      for (const entry of lookup) {
        if (linkedSlugs.has(entry.dedupeKey)) continue;
        linkedSlugs.add(entry.dedupeKey);
        linksAdded++;
        termsLinked.set(entry.slug, (termsLinked.get(entry.slug) || 0) + 1);
        const titleAttr = escapeHtmlAttr(`${entry.title} — voir la définition`);
        // On préserve la casse originale via `captured`.
        return `<a class="lex-link" href="/lexique/${entry.slug}" title="${titleAttr}">${captured}</a>`;
      }
      // Tous déjà linkés → on rend le texte tel quel.
      return captured;
    });

    out.push(replaced);
  }

  return { html: out.join(''), linksAdded, termsLinked };
}

function main() {
  const lexiquePath = path.join(ROOT, 'data', 'lexique.json');
  const lex = JSON.parse(fs.readFileSync(lexiquePath, 'utf8'));
  const termIndex = buildTermIndex(lex.terms);

  const articlesDir = path.join(ROOT, 'articles');
  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.html') && f !== '_TEMPLATE.html')
    .map(f => path.join(articlesDir, f));

  console.log(`Lexique : ${termIndex.length} surfaces (titres+aliases) à partir de ${new Set(termIndex.map(t => t.slug)).size} termes page=true.`);
  console.log(`Articles : ${files.length} fichiers à scanner.`);
  if (DRY_RUN) console.log('Mode : DRY RUN (aucune écriture).');
  console.log('');

  const perTermNew = new Map();       // slug → liens AJOUTÉS dans ce run
  const perTermExisting = new Map();  // slug → liens déjà présents avant le run
  const perTermTitles = new Map();    // slug → titre humain
  for (const e of termIndex) perTermTitles.set(e.slug, e.title);

  const EXISTING_LINK_RE = /<a[^>]*class=["'][^"']*\blex-link\b[^"']*["'][^>]*href=["']\/lexique\/([\w-]+)["']/gi;

  let modifiedFiles = 0;
  let totalLinks = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');

    // Compte les liens déjà présents.
    EXISTING_LINK_RE.lastIndex = 0;
    let em;
    while ((em = EXISTING_LINK_RE.exec(original)) !== null) {
      perTermExisting.set(em[1], (perTermExisting.get(em[1]) || 0) + 1);
    }

    let result;
    try {
      result = processHtml(original, termIndex);
    } catch (err) {
      console.warn(`[SKIP] ${path.basename(file)} : ${err.message}`);
      continue;
    }
    if (result.linksAdded === 0) continue;

    modifiedFiles++;
    totalLinks += result.linksAdded;

    for (const [slug, count] of result.termsLinked) {
      perTermNew.set(slug, (perTermNew.get(slug) || 0) + count);
    }

    const rel = path.relative(ROOT, file);
    const terms = [...result.termsLinked.keys()].join(', ');
    console.log(`  + ${rel} : ${result.linksAdded} lien(s) [${terms}]`);

    if (!DRY_RUN) {
      fs.writeFileSync(file, result.html, 'utf8');
    }
  }

  console.log('');
  console.log('────────────────────────────────────────');
  console.log(`${modifiedFiles} article(s) modifié(s), ${totalLinks} nouveau(x) lien(s) ajouté(s)${DRY_RUN ? ' (dry-run)' : ''}.`);

  // Cumul : liens nouveaux + déjà présents avant le run.
  const perTermAll = new Map();
  for (const [s, c] of perTermNew) perTermAll.set(s, (perTermAll.get(s) || 0) + c);
  for (const [s, c] of perTermExisting) perTermAll.set(s, (perTermAll.get(s) || 0) + c);

  const topTerms = [...perTermAll.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (topTerms.length > 0) {
    console.log('');
    console.log('Termes les + linkés (cumul, nouveaux + existants) :');
    for (const [slug, count] of topTerms) {
      const nb = perTermNew.get(slug) || 0;
      const ex = perTermExisting.get(slug) || 0;
      console.log(`  ${count}× ${perTermTitles.get(slug) || slug} (/lexique/${slug})  [nouveau: ${nb}, déjà: ${ex}]`);
    }
  }

  // Termes jamais linkés (couverture).
  const allPageSlugs = new Set(termIndex.map(e => e.slug));
  const linkedSlugsAll = new Set(perTermAll.keys());
  const orphans = [...allPageSlugs].filter(s => !linkedSlugsAll.has(s));
  if (orphans.length > 0) {
    console.log('');
    console.log(`Termes page=true jamais linkés depuis aucun article (${orphans.length}/${allPageSlugs.size}) :`);
    for (const s of orphans) console.log(`  - ${perTermTitles.get(s) || s} (/lexique/${s})`);
  }
}

main();
