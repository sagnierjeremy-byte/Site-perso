#!/usr/bin/env node
/**
 * Auto-link cross-references between articles → /articles/<slug>.
 *
 * - Pour chaque articles/*.html (sauf _TEMPLATE.html), cherche dans le texte
 *   des phrases-déclencheurs qui correspondent à un autre article du site.
 * - Sur la PREMIÈRE occurrence trouvée (par article cible), wrap dans
 *   <a class="cross-link" href="/articles/<target>">anchor</a>.
 * - Ignore les occurrences dans <a>, <code>, <pre>, <script>, <style>, <h1-h3>.
 * - Idempotent : si un lien vers /articles/<target> existe déjà dans la page,
 *   ne pas ré-ajouter.
 * - Ne linke jamais un article à lui-même.
 *
 * Réutilise le tokenizer streaming de auto-link-glossary.js (pas de cheerio).
 *
 * Usage :
 *   node scripts/auto-link-articles.mjs [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

const PROTECTED_TAGS = new Set(['a', 'code', 'pre', 'script', 'style', 'h1', 'h2', 'h3']);
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const TOKEN_RE = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*>|[^<]+|</g;
const TAG_NAME_RE = /^<\/?\s*([a-zA-Z][a-zA-Z0-9]*)/;

// =============================================================================
// CONFIG : topic → target article
// =============================================================================
// triggers = phrases déclencheuses (case-insensitive, word-boundary Unicode).
// anchor = texte d'ancre affiché (la casse originale du match est préservée).
// =============================================================================
const CROSS_LINKS = [
  {
    target: 'loops-claude',
    triggers: ['loops claude code', 'loop claude code', "boucle d'exécution claude", "boucle d'exécution", 'les loops', 'la loop'],
    anchor: 'loops Claude Code',
  },
  {
    target: 'karpathy',
    triggers: ['andrej karpathy', 'karpathy'],
    anchor: 'Andrej Karpathy',
  },
  {
    target: 'hermes-agent',
    triggers: ['hermes agent', 'agent hermès', 'agent hermes', 'hermès'],
    anchor: 'Hermes Agent',
  },
  {
    target: 'tuto-agent-gmail',
    triggers: ['agent gmail', 'automatisation gmail', 'automatiser gmail', 'créer un agent gmail', 'tuto gmail'],
    anchor: 'agent Gmail',
  },
  {
    target: 'tuto-agent-contrats',
    triggers: ['agent contrats', 'automatiser contrats', 'agent contrat', 'tuto contrats'],
    anchor: 'agent contrats',
  },
  {
    target: 'agents-ia-guide',
    triggers: ['guide agent ia', 'créer un agent ia', 'construire un agent ia', 'créer un agent', 'construire un agent', 'comment fonctionne un agent', "qu'est-ce qu'un agent ia", 'à quoi sert un agent'],
    anchor: 'guide agent IA',
  },
  {
    target: 'llm-wiki-karpathy',
    triggers: ['llm wiki', 'wiki karpathy', 'llm wiki karpathy', 'deuxième cerveau'],
    anchor: 'LLM Wiki Karpathy',
  },
  {
    target: 'autoresearch-karpathy',
    triggers: ['agents auto-améliorants', 'agent auto-améliorant', 'auto-améliorant', 'autoresearch', 'self-improving', 'eureka labs', "ia qui s'améliore toute seule"],
    anchor: 'agents auto-améliorants',
  },
  {
    target: 'superpowers',
    triggers: ['superpowers claude code', 'plugin superpowers', 'les superpowers'],
    anchor: 'Superpowers Claude Code',
  },
  {
    target: 'claude-code-workflow-tips',
    triggers: ['workflow claude code', 'workflows claude code', 'claude code après 6 mois', '6 mois de claude code', 'tips claude code', 'astuces claude code'],
    anchor: 'workflows Claude Code',
  },
  {
    target: 'dev-browser',
    triggers: ['dev-browser', 'dev browser', 'navigateur piloté par'],
    anchor: 'dev-browser',
  },
  {
    target: 'outil-vente-claude-code',
    triggers: ['outil de vente claude code', 'outil de vente', 'outil vente claude code', "l'outil de vente"],
    anchor: 'outil de vente Claude Code',
  },
  {
    target: 'open-source-pour-non-dev',
    triggers: ['open source pour non-dev', 'open source pour entrepreneur', "open source pour ceux qui ne sont pas dev", "l'open source"],
    anchor: 'open source pour non-devs',
  },
  {
    target: 'llm-local-pour-non-dev',
    triggers: ['llm en local', 'llm local pour non-dev', 'modèle en local', "modèle d'ia chez toi", 'ollama', 'lm studio', 'faire tourner un llm', 'faire tourner un modèle'],
    anchor: 'LLM en local',
  },
  {
    target: 'monde-ia-5-10-20-ans',
    triggers: ['monde ia 5 10 20 ans', "monde avec l'ia dans 5", 'dans 5, 10, 20 ans', "futur de l'ia", "l'ia dans 5 ans", "l'ia dans 10 ans", "l'ia dans 20 ans"],
    anchor: "futur de l'IA",
  },
  {
    target: 'plan-chine-2026-2030',
    triggers: ['plan chine 2026', 'plan chinois 2026', 'pékin ia', 'plan ia chinois', 'plan chinois', 'ia en chine'],
    anchor: 'plan IA chinois',
  },
  {
    target: 'musk-vs-openai-le-proces',
    triggers: ['musk vs openai', 'musk contre openai', 'procès openai', 'procès du siècle', 'elon musk contre'],
    anchor: 'procès Musk vs OpenAI',
  },
  {
    target: 'better-call-vs-associe',
    triggers: ['oussama ammar', 'better call', 'associé virtuel'],
    anchor: 'Better Call (vs associé)',
  },
  {
    target: 'limova-vs-claude-code',
    triggers: ['limova', 'limova vs claude'],
    anchor: 'Limova vs Claude Code',
  },
  {
    target: 'booking-eurofiscalis-making-of',
    triggers: ['booking eurofiscalis', 'booking making of', 'calendly et letsignit', 'on a viré calendly', 'making-of booking'],
    anchor: 'making-of Booking Eurofiscalis',
  },
  {
    target: 'photos-airbnb-nano-banana',
    triggers: ['photos airbnb', 'nano banana airbnb', 'airbnb nano banana', "photos d'airbnb", 'airbnb avec nano banana', 'airbnb retravaillées'],
    anchor: 'photos Airbnb avec Nano Banana',
  },
  {
    target: 'photos-perso-ia',
    triggers: ['photos perso ia', 'personal branding photos', 'personal branding ia', 'shooting ia', 'personal branding', 'photos personal branding', 'shooting à 0,04'],
    anchor: 'photos personal branding IA',
  },
  {
    target: 'podcast-ia-pour-enfants',
    triggers: ['podcast enfants', 'petites lanternes', 'podcast pour enfants', 'podcast ia pour enfants', '3 petites lanternes'],
    anchor: 'podcast IA pour enfants',
  },
  {
    target: 'guerres-d-ia-podcast',
    triggers: ["guerres d'ia", 'altman vs amodei', 'guerres d ia', "podcast guerres d'ia", '33 $', '33$'],
    anchor: "podcast Guerres d'IA",
  },
  {
    target: 'veille-pour-demain',
    triggers: ['veille pour demain', 'veille auto ia', 'veille automatique ia', 'newsletter ai playbook', "outil de veille"],
    anchor: 'veille IA pour demain',
  },
  {
    target: 'jerwis-finance-tracker',
    triggers: ['jerwis finance', 'finance tracker', 'suivre mes positions', 'jerwis finance tracker'],
    anchor: 'Jerwis Finance Tracker',
  },
];

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
 * Word boundary Unicode-aware : pas \b (qui ne gère pas l'accentué),
 * mais lookbehind/lookahead sur [\p{L}\p{N}_].
 * Trigger longest-first → "agent gmail" mange avant "agent" (si on en avait).
 */
function buildTriggerRegex(triggers) {
  const sorted = [...triggers].sort((a, b) => b.length - a.length);
  const alt = sorted.map(escapeRegex).join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}_])(${alt})(?![\\p{L}\\p{N}_])`, 'iu');
}

/**
 * Process un fichier HTML pour un article source donné.
 * Retourne { html, linksAdded, targetsLinked: Set<slug> }.
 */
function processHtml(html, currentSlug) {
  // Cibles actives : on exclut l'article courant.
  const targets = CROSS_LINKS
    .filter(c => c.target !== currentSlug)
    .map(c => ({ ...c, regex: buildTriggerRegex(c.triggers) }));

  if (targets.length === 0) {
    return { html, linksAdded: 0, targetsLinked: new Set() };
  }

  // Idempotence : on amorce uniquement avec les .cross-link déjà présents.
  // Les autres liens vers /articles/<slug> (TL;DR cards, final CTA, etc.) ne
  // bloquent PAS un nouveau lien contextuel inline dans le corps de l'article :
  // un lien dans une card "À lire ensuite" remplit un rôle différent d'un
  // lien souligné en pleine phrase narrative.
  // En revanche, si on a déjà inséré un .cross-link vers cette target, on
  // n'en réinsère pas (idempotence multi-runs).
  const linkedTargets = new Set();
  const existingCrossLinkRe = /<a[^>]*class=["'][^"']*\bcross-link\b[^"']*["'][^>]*href=["'](?:https?:\/\/[^"']+)?(?:\/?articles\/)?([\w-]+?)(?:\.html)?["']/gi;
  let existingMatch;
  while ((existingMatch = existingCrossLinkRe.exec(html)) !== null) {
    linkedTargets.add(existingMatch[1]);
  }

  // Tokenize.
  const tokens = [];
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(html)) !== null) {
    tokens.push(m[0]);
  }
  if (tokens.join('') !== html) {
    throw new Error('Tokenizer lossy — la concaténation ne correspond pas au source');
  }

  const targetsLinked = new Set();
  let protectedDepth = 0;
  let linksAdded = 0;
  const out = [];

  for (const tok of tokens) {
    if (tok.startsWith('<')) {
      const tagMatch = tok.match(TAG_NAME_RE);
      if (tagMatch) {
        const tagName = tagMatch[1].toLowerCase();
        const isClosing = tok.startsWith('</');
        const isSelfClosing = /\/\s*>$/.test(tok);
        if (PROTECTED_TAGS.has(tagName)) {
          if (isClosing) {
            protectedDepth = Math.max(0, protectedDepth - 1);
          } else if (!isSelfClosing && !VOID_TAGS.has(tagName)) {
            protectedDepth++;
          }
        }
      }
      out.push(tok);
      continue;
    }

    if (protectedDepth > 0) {
      out.push(tok);
      continue;
    }

    // Pour ce segment texte, on essaye chaque target dans l'ordre.
    // Sur le premier match trouvé, on remplace et on marque la target comme linkée.
    let text = tok;
    let mutated = true;
    while (mutated) {
      mutated = false;
      for (const target of targets) {
        if (linkedTargets.has(target.target)) continue;
        const match = target.regex.exec(text);
        if (!match) continue;
        const captured = match[1];
        const start = match.index;
        const end = start + captured.length;
        const before = text.slice(0, start);
        const after = text.slice(end);
        const titleAttr = escapeHtmlAttr(`${target.anchor} — lire l'article`);
        const replacement = `<a class="cross-link" href="/articles/${target.target}" title="${titleAttr}">${captured}</a>`;
        text = before + replacement + after;
        linkedTargets.add(target.target);
        targetsLinked.add(target.target);
        linksAdded++;
        // Le remplacement contient désormais du HTML (<a>), donc on doit
        // re-pousser le résultat dans le pipeline. On ne touche plus à ce
        // segment pour ce target (already linked), mais on peut continuer
        // avec d'autres targets sur le texte restant.
        // → On break + restart : redonne une chance aux autres targets
        //   sur le `after` (mais via le run suivant de la boucle while).
        // ATTENTION : la nouvelle string `text` contient maintenant un
        // morceau `<a>...</a>` qui SERA re-matché par la regex sur
        // certains triggers. C'est pourquoi on note la cible comme
        // linkée → elle est skippée. Mais d'autres triggers pourraient
        // mordre sur l'anchor → on segmente : on push `before + replacement`
        // dans out, et on continue d'analyser uniquement `after`.
        out.push(before + replacement);
        text = after;
        mutated = true;
        break;
      }
    }
    out.push(text);
  }

  return { html: out.join(''), linksAdded, targetsLinked };
}

function main() {
  const articlesDir = path.join(ROOT, 'articles');
  const files = fs.readdirSync(articlesDir)
    .filter(f => f.endsWith('.html') && f !== '_TEMPLATE.html')
    .map(f => path.join(articlesDir, f));

  console.log(`Cross-links config : ${CROSS_LINKS.length} cibles d'articles.`);
  console.log(`Articles : ${files.length} fichiers à scanner.`);
  if (DRY_RUN) console.log('Mode : DRY RUN (aucune écriture).');
  console.log('');

  const perTargetNew = new Map();      // slug → liens ajoutés ce run
  const perTargetExisting = new Map(); // slug → liens déjà présents
  const targetAnchors = new Map();
  for (const c of CROSS_LINKS) targetAnchors.set(c.target, c.anchor);

  const EXISTING_LINK_RE = /<a[^>]*class=["'][^"']*\bcross-link\b[^"']*["'][^>]*href=["']\/articles\/([\w-]+)["']/gi;

  let modifiedFiles = 0;
  let totalLinks = 0;

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const currentSlug = path.basename(file, '.html');

    EXISTING_LINK_RE.lastIndex = 0;
    let em;
    while ((em = EXISTING_LINK_RE.exec(original)) !== null) {
      perTargetExisting.set(em[1], (perTargetExisting.get(em[1]) || 0) + 1);
    }

    let result;
    try {
      result = processHtml(original, currentSlug);
    } catch (err) {
      console.warn(`[SKIP] ${path.basename(file)} : ${err.message}`);
      continue;
    }
    if (result.linksAdded === 0) continue;

    modifiedFiles++;
    totalLinks += result.linksAdded;

    for (const slug of result.targetsLinked) {
      perTargetNew.set(slug, (perTargetNew.get(slug) || 0) + 1);
    }

    const rel = path.relative(ROOT, file);
    const tlist = [...result.targetsLinked].join(', ');
    console.log(`  + ${rel} : ${result.linksAdded} lien(s) [${tlist}]`);

    if (!DRY_RUN) {
      fs.writeFileSync(file, result.html, 'utf8');
    }
  }

  console.log('');
  console.log('────────────────────────────────────────');
  console.log(`${modifiedFiles} article(s) modifié(s), ${totalLinks} nouveau(x) lien(s) ajouté(s)${DRY_RUN ? ' (dry-run)' : ''}.`);

  const perTargetAll = new Map();
  for (const [s, c] of perTargetNew) perTargetAll.set(s, (perTargetAll.get(s) || 0) + c);
  for (const [s, c] of perTargetExisting) perTargetAll.set(s, (perTargetAll.get(s) || 0) + c);

  const topTargets = [...perTargetAll.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (topTargets.length > 0) {
    console.log('');
    console.log('Articles cibles les + linkés (cumul) :');
    for (const [slug, count] of topTargets) {
      const nb = perTargetNew.get(slug) || 0;
      const ex = perTargetExisting.get(slug) || 0;
      console.log(`  ${count}× ${targetAnchors.get(slug) || slug} (/articles/${slug})  [nouveau: ${nb}, déjà: ${ex}]`);
    }
  }

  const allTargets = new Set(CROSS_LINKS.map(c => c.target));
  const linkedTargetsAll = new Set(perTargetAll.keys());
  const orphans = [...allTargets].filter(s => !linkedTargetsAll.has(s));
  if (orphans.length > 0) {
    console.log('');
    console.log(`Articles cibles jamais linkés (${orphans.length}/${allTargets.size}) :`);
    for (const s of orphans) console.log(`  - ${targetAnchors.get(s) || s} (/articles/${s})`);
  }
}

main();
