#!/usr/bin/env node
/**
 * qa-gate.mjs — Gate qualité d'un draft d'article avant publication.
 *
 * Usage : node scripts/blog/qa-gate.mjs <slug> [--type=A|B] [--json]
 *
 * Deux couches :
 *  1) MÉCANIQUE (zéro API, gratuit, instantané) — filtre 80% des rejets évidents :
 *     frontmatter, mots bannis, SEO on-page, lisibilité, maillage, FAQ, stat sourcée.
 *  2) JUGES LLM (nécessite ANTHROPIC_API_KEY) — factualité, ton Leo, cohérence.
 *     Si la clé est absente, la couche 2 est SKIP et signalée (la couche 1 suffit
 *     pour un premier verdict en local).
 *
 * Sortie : rapport lisible + score /70 partiel + décision (publish / queue / reject).
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import {
  TON_LEO, MOTS_BANNIS, DEV_PERSONNE, FRONTMATTER_REQUIRED,
  SEO_RULES, RUBRIC, SITE_URL,
} from './config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const DRAFTS = path.join(ROOT, 'drafts');
const ARTICLES = path.join(ROOT, 'articles');

const C = { red:'\x1b[31m', grn:'\x1b[32m', yel:'\x1b[33m', cyn:'\x1b[36m', dim:'\x1b[2m', b:'\x1b[1m', x:'\x1b[0m' };
const ok = (m) => console.log(`${C.grn}✓${C.x} ${m}`);
const ko = (m) => console.log(`${C.red}✗ ${m}${C.x}`);
const warn = (m) => console.log(`${C.yel}!${C.x} ${m}`);
const info = (m) => console.log(`${C.cyn}•${C.x} ${m}`);

const words = (s) => (s.trim().match(/\S+/g) || []).length;

// ── chargement ──
const slug = process.argv[2];
const typeArg = (process.argv.find(a => a.startsWith('--type=')) || '--type=A').split('=')[1].toUpperCase();
const asJson = process.argv.includes('--json');
if (!slug) { console.error('Usage : node scripts/blog/qa-gate.mjs <slug> [--type=A|B]'); process.exit(2); }

const draftPath = path.join(DRAFTS, `${slug}.md`);
if (!existsSync(draftPath)) { console.error(`Draft introuvable : ${draftPath}`); process.exit(2); }

const raw = await readFile(draftPath, 'utf8');
const { data: fm, content: body } = matter(raw);

const issues = [];      // { level:'block'|'warn', msg }
const block = (m) => issues.push({ level:'block', msg:m });
const flag  = (m) => issues.push({ level:'warn',  msg:m });
const scores = {};      // par critère

// ─────────────────────────────────────────────────────────────
// C3 — MOTS BANNIS (bloquant absolu)
// ─────────────────────────────────────────────────────────────
{
  const found = [];
  for (const pat of MOTS_BANNIS) {
    const re = new RegExp(pat, 'gi');
    const m = body.match(re);
    if (m) found.push(...m);
  }
  for (const pat of DEV_PERSONNE) {
    const re = new RegExp(pat, 'gi');
    const m = body.match(re);
    if (m) found.push(...m);
  }
  if (found.length) { block(`Mots bannis détectés : ${[...new Set(found)].join(', ')}`); scores.C3_mots_bannis = 0; }
  else scores.C3_mots_bannis = 10;
}

// ─────────────────────────────────────────────────────────────
// FRONTMATTER — complétude (pré-requis publish.js)
// ─────────────────────────────────────────────────────────────
{
  const missing = FRONTMATTER_REQUIRED.filter(k => !fm[k]);
  if (missing.length) block(`Frontmatter manquant : ${missing.join(', ')}`);
}

// ─────────────────────────────────────────────────────────────
// C6 — SEO ON-PAGE (mécanique)
// ─────────────────────────────────────────────────────────────
{
  let s = 10;
  const titre_seo = fm.titre_seo || `${fm.titre || ''} — par Jérémy Sagnier`;
  const tlen = titre_seo.length;
  if (tlen < SEO_RULES.titre_seo_min || tlen > SEO_RULES.titre_seo_max) { flag(`<title> ${tlen} car. (cible ${SEO_RULES.titre_seo_min}-${SEO_RULES.titre_seo_max})`); s -= 1.5; }

  const dlen = (fm.description || '').length;
  if (dlen < SEO_RULES.description_min || dlen > SEO_RULES.description_max) { flag(`meta description ${dlen} car. (cible ${SEO_RULES.description_min}-${SEO_RULES.description_max})`); s -= 1.5; }

  const leadW = words(fm.lead || '');
  if (leadW < SEO_RULES.lead_words_min || leadW > SEO_RULES.lead_words_max) { flag(`lead ${leadW} mots (cible ${SEO_RULES.lead_words_min}-${SEO_RULES.lead_words_max})`); s -= 1; }

  // corps : H2 count, words/H2, body length
  const h2 = (body.match(/^##\s+/gm) || []).length;
  if (h2 < SEO_RULES.h2_min) { flag(`${h2} sections H2 (min ${SEO_RULES.h2_min})`); s -= 1.5; }
  const bodyW = words(body.replace(/```[\s\S]*?```/g, ''));
  const minW = typeArg === 'B' ? SEO_RULES.body_words_min_B : SEO_RULES.body_words_min_A;
  if (bodyW < minW) { flag(`corps ${bodyW} mots (min ${minW} pour Type ${typeArg})`); s -= 1.5; }
  if (typeArg === 'A' && bodyW > SEO_RULES.body_words_max_A) { flag(`corps ${bodyW} mots (> max ${SEO_RULES.body_words_max_A} pour Type A)`); s -= 0.5; }
  if (h2 > 0 && bodyW / h2 > SEO_RULES.words_per_h2_max) { flag(`~${Math.round(bodyW/h2)} mots/H2 (max ${SEO_RULES.words_per_h2_max})`); s -= 0.5; }

  // maillage interne (liens vers /articles/, /lexique/, pages internes)
  const internal = (body.match(/\]\((?:\.?\/)?(?:articles|lexique|modeles|apprendre|claude-code|outils|podcast|index)[^)]*\)/gi) || []).length
                 + (body.match(/href="(?:\.?\/)?(?:articles|lexique|modeles|apprendre)[^"]*"/gi) || []).length;
  if (internal < SEO_RULES.internal_links_min) { flag(`${internal} liens internes (min ${SEO_RULES.internal_links_min})`); s -= 1.5; }
  if (internal > SEO_RULES.internal_links_max) { flag(`${internal} liens internes (> max ${SEO_RULES.internal_links_max})`); s -= 0.5; }

  // TL;DR points
  const tldrN = Array.isArray(fm.tldr) ? fm.tldr.length : 0;
  if (tldrN < SEO_RULES.tldr_points_min || tldrN > SEO_RULES.tldr_points_max) { flag(`TL;DR ${tldrN} points (cible ${SEO_RULES.tldr_points_min}-${SEO_RULES.tldr_points_max})`); s -= 0.5; }

  // FAQ (bloc Q/R) — recherché par "## FAQ" ou "Questions"
  if (SEO_RULES.require_faq && !/##\s*(faq|questions)/i.test(body)) { flag('pas de bloc FAQ/Questions détecté'); s -= 1; }

  // statistique sourcée + datée : présence d'un lien + d'une année 20xx à proximité d'un chiffre
  const hasSourcedStat = /\[[^\]]*\d[^\]]*\]\(https?:\/\/[^)]+\)/.test(body) || /\d+\s*%[^.\n]*\((20\d\d)\)/.test(body) || /\b20\d\d\b[^.\n]*https?:\/\//.test(body);
  if (SEO_RULES.require_stat_sourcee && !hasSourcedStat) { flag('aucune statistique sourcée + datée détectée (levier GEO)'); s -= 1; }

  scores.C6_seo = Math.max(0, Math.round(s * 10) / 10);
}

// ─────────────────────────────────────────────────────────────
// C7 — LISIBILITÉ (mécanique)
// ─────────────────────────────────────────────────────────────
{
  let s = 10;
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/^#.*$/gm, '').replace(/<[^>]+>/g, '');
  const sentences = prose.split(/(?<=[.!?])\s+/).filter(x => x.trim().length > 0);
  const long = sentences.filter(x => words(x) > SEO_RULES.sentence_words_warn);
  const ratioLong = sentences.length ? long.length / sentences.length : 0;
  if (ratioLong > 0.25) { flag(`${long.length}/${sentences.length} phrases > ${SEO_RULES.sentence_words_warn} mots (${Math.round(ratioLong*100)}%)`); s -= 2; }
  else if (ratioLong > 0.15) { flag(`${long.length} phrases longues (lisibilité)`); s -= 1; }
  scores.C7_lisibilite = Math.max(0, s);
}

// ─────────────────────────────────────────────────────────────
// C4 — ORIGINALITÉ (mécanique légère : chevauchement de titre/slug)
//   La version embeddings (cosine vs 27 articles) viendra avec la couche LLM.
// ─────────────────────────────────────────────────────────────
{
  let s = 10;
  try {
    const files = (await readdir(ARTICLES)).filter(f => f.endsWith('.html') && f !== '_TEMPLATE.html');
    const slugTokens = new Set(slug.split('-').filter(t => t.length > 3));
    let maxOverlap = 0, twin = '';
    for (const f of files) {
      const fSlug = f.replace('.html', '');
      const fTokens = new Set(fSlug.split('-').filter(t => t.length > 3));
      const inter = [...slugTokens].filter(t => fTokens.has(t)).length;
      const overlap = slugTokens.size ? inter / slugTokens.size : 0;
      if (overlap > maxOverlap) { maxOverlap = overlap; twin = fSlug; }
    }
    if (maxOverlap >= 0.6) { flag(`slug proche d'un article existant (${twin}, ${Math.round(maxOverlap*100)}% tokens communs) — vérifier la cannibalisation`); s -= 3; }
  } catch {}
  scores.C4_originalite = s;
  info('C4 originalité : check léger (titre/slug). Le check embeddings vs corpus complet arrive avec la couche LLM.');
}

// ─────────────────────────────────────────────────────────────
// COUCHE LLM (factualité, ton, cohérence) — nécessite ANTHROPIC_API_KEY
// ─────────────────────────────────────────────────────────────
// On charge .env.local via l'adaptateur, puis on lance le juge si une clé est dispo.
const { judge, hasGemini } = await import('./llm.mjs');
const hasKey = await hasGemini();
let llmScores = null;
if (!hasKey) {
  warn('GEMINI_API_KEY absente → couche juges LLM SKIP (C1 factualité, C2 ton Leo, C5 cohérence non notés).');
  warn('Verdict ci-dessous = MÉCANIQUE uniquement.');
} else {
  // Charge le brief de recherche s'il existe (socle factuel pour le fact-check)
  let brief = null;
  const briefPath = path.join(ROOT, 'research', `${slug}.json`);
  if (existsSync(briefPath)) brief = JSON.parse(await readFile(briefPath, 'utf8'));
  const factsCtx = brief ? (brief.facts || []).map((f,i)=>`[F${i+1}] ${f.claim} (${f.date||'n.d.'})`).join('\n') + '\n' +
                           (brief.stats || []).map((s,i)=>`[S${i+1}] ${s.stat} (${s.date||'n.d.'})`).join('\n')
                         : '(aucun brief de recherche trouvé — juge la plausibilité)';

  const jp = `Tu es un juge qualité ADVERSARIAL pour un article de blog en français (jerwis.fr, IA pour entrepreneurs non-dev).
Ta mission : TROUVER LES DÉFAUTS, pas complimenter. Sois sévère et précis.

=== MATIÈRE FACTUELLE DE RÉFÉRENCE (ce que l'article a le droit d'affirmer) ===
${factsCtx}

=== TON LEO (règles du site) ===
${TON_LEO}

=== ARTICLE À JUGER (markdown, complet) ===
${body.slice(0, 30000)}

Note 3 critères de 0 à 10 (entiers) et liste les défauts concrets. Réponds UNIQUEMENT en JSON :
{
  "C1_factualite": {"score": 0-10, "claims_refutes": ["affirmation non soutenue par la matière OU chiffre invraisemblable"], "raisons": ["..."]},
  "C2_ton_leo": {"score": 0-10, "violations": ["formulation qui casse le ton Leo, ex: citation moche (source: ...), Title Case anglo, ton consultant"], "raisons": ["..."]},
  "C5_coherence": {"score": 0-10, "contradictions": ["chiffres ou affirmations qui se contredisent"], "raisons": ["..."]}
}
Règles de notation :
- C1 FACTUALITÉ — ne pénalise QUE les faits VÉRIFIABLES inventés : chiffres/statistiques/pourcentages/dates absents de la matière OU invraisemblables (ex: 98% d'adoption), noms propres/citations/événements fabriqués. Un chiffre inventé ou invraisemblable = claim_refute, score ≤ 5.
- NE PÉNALISE PAS l'explication de concepts généraux bien connus (RAG, agent, prompt, LLM, fine-tuning, etc.) même s'ils ne sont pas dans la matière : ce sont des connaissances communes, pas des hallucinations. Un article a le droit d'expliquer un concept sans source. Si l'article ne contient AUCUN chiffre/nom inventé, C1 ≥ 8.
- C2 : "(source: ...)" en clair dans le texte, Title Case sur les titres, ou ton "fiche produit" = violations, score ≤ 6.
- C5 : si deux chiffres se contredisent = score ≤ 5.`;

  try {
    process.stderr.write('• Juge LLM (Gemini, posture adversariale)…\n');
    const { text: jt } = await judge(jp, { model: 'gemini-2.5-flash' });
    const clean = jt.replace(/^```json\s*/i,'').replace(/```\s*$/,'').trim();
    llmScores = JSON.parse(clean);
    scores.C1_factualite = llmScores.C1_factualite?.score ?? null;
    scores.C2_ton_leo    = llmScores.C2_ton_leo?.score ?? null;
    scores.C5_coherence  = llmScores.C5_coherence?.score ?? null;
    // bloquants issus des juges
    if (scores.C1_factualite != null && scores.C1_factualite < 6) block(`Factualité ${scores.C1_factualite}/10 — ${(llmScores.C1_factualite.claims_refutes||[]).slice(0,3).join(' | ')}`);
    if (scores.C2_ton_leo    != null && scores.C2_ton_leo    < 6) block(`Ton Leo ${scores.C2_ton_leo}/10 — ${(llmScores.C2_ton_leo.violations||[]).slice(0,3).join(' | ')}`);
    if (scores.C5_coherence  != null && scores.C5_coherence  < 5) flag(`Cohérence ${scores.C5_coherence}/10 — ${(llmScores.C5_coherence.contradictions||[]).slice(0,2).join(' | ')}`);
  } catch (e) {
    warn(`Juge LLM indisponible (${e.message.slice(0,80)}) → verdict mécanique seul.`);
  }
}

// ─────────────────────────────────────────────────────────────
// VERDICT
// ─────────────────────────────────────────────────────────────
const blocks = issues.filter(i => i.level === 'block');
const warns  = issues.filter(i => i.level === 'warn');
const mechMax = (scores.C3_mots_bannis!=null?10:0)+(scores.C4_originalite!=null?10:0)+(scores.C6_seo!=null?10:0)+(scores.C7_lisibilite!=null?10:0);
const mechScore = ['C3_mots_bannis','C4_originalite','C6_seo','C7_lisibilite'].reduce((a,k)=>a+(scores[k]||0),0);

console.log(`\n${C.b}━━━ Gate qualité · ${slug} · Type ${typeArg} ━━━${C.x}`);
console.log(`${C.dim}draft : drafts/${slug}.md · corps ${words(body)} mots${C.x}\n`);

const order = ['C1_factualite','C2_ton_leo','C3_mots_bannis','C4_originalite','C5_coherence','C6_seo','C7_lisibilite'];
console.log(`${C.b}Scores :${C.x}`);
for (const k of order) {
  if (scores[k]==null) { console.log(`  ${C.dim}  —/10  ${RUBRIC.criteria.find(c=>c.key===k).label} (non noté)${C.x}`); continue; }
  const v = scores[k];
  const bar = v>=8?C.grn:v>=5?C.yel:C.red;
  console.log(`  ${bar}${String(v).padStart(4)}/10${C.x}  ${RUBRIC.criteria.find(c=>c.key===k).label}`);
}
const noted = order.filter(k => scores[k]!=null);
const total = noted.reduce((a,k)=>a+scores[k],0);
const totalMax = noted.length * 10;
console.log(`  ${C.dim}────────${C.x}`);
const full = noted.length === 7;
console.log(`  ${C.b}${total}/${totalMax}${C.x} ${full ? '(/70 complet)' : `(${noted.length}/7 critères notés)`}\n`);

if (blocks.length) { console.log(`${C.b}${C.red}BLOQUANTS (${blocks.length}) :${C.x}`); blocks.forEach(i=>ko(i.msg)); console.log(''); }
if (warns.length)  { console.log(`${C.b}${C.yel}Avertissements (${warns.length}) :${C.x}`); warns.forEach(i=>warn(i.msg)); console.log(''); }
if (!blocks.length && !warns.length) ok('Aucun bloquant, aucun avertissement mécanique.\n');

// Décision (mécanique → indicative tant que la couche LLM n'a pas tourné)
let verdict, vcolor;
if (blocks.length) { verdict = 'REJET (bloquant) → corriger ou régénérer'; vcolor = C.red; }
else if (warns.length > 3) { verdict = 'FILE DE RELECTURE (≥4 avertissements)'; vcolor = C.yel; }
else if (!hasKey) { verdict = 'MÉCANIQUE OK → reste à passer les juges LLM (C1/C2/C5)'; vcolor = C.cyn; }
else { verdict = 'À SCORER /70 (couche LLM)'; vcolor = C.cyn; }
console.log(`${C.b}Verdict : ${vcolor}${verdict}${C.x}\n`);

if (asJson) {
  console.log(JSON.stringify({ slug, type:typeArg, scores, blocks:blocks.map(b=>b.msg), warns:warns.map(w=>w.msg), mechScore, hasKey, verdict }, null, 2));
}

process.exit(blocks.length ? 1 : 0);
