#!/usr/bin/env node
/**
 * linkedin-carousel.mjs — décline un post LinkedIn en carrousel PDF (design FIESTA validé).
 *
 * SÉLECTIF par design : le LLM juge d'abord si le post mérite un carrousel
 * (un chiffre fort OU une démonstration séquencée). Opinion pure = skip (exit 0).
 * Un slide = UN message. Le carrousel déroule l'argument du post, il ne résume pas l'article.
 *
 * Usage : node scripts/blog/linkedin-carousel.mjs <slug> [--force]
 * Sortie : linkedin/carousels/<slug>/slide_N.png + linkedin/carousels/<slug>.pdf (gitignorés).
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { claude, openrouter, hasClaude, hasOpenRouter } from './llm.mjs';
import { MOTS_BANNIS } from './config.mjs';
import { renderCarousel } from './carousel-render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const slug = process.argv[2];
const FORCE = process.argv.includes('--force');
if (!slug) { console.error('Usage : linkedin-carousel.mjs <slug> [--force]'); process.exit(2); }

const pdfPath = path.join(ROOT, 'linkedin', 'carousels', `${slug}.pdf`);
if (existsSync(pdfPath) && !FORCE) { console.error(`• carrousel déjà rendu : ${slug} (--force pour refaire)`); console.log(pdfPath); process.exit(0); }

const postPath = path.join(ROOT, 'linkedin', `${slug}.md`);
if (!existsSync(postPath)) { console.error(`✗ linkedin/${slug}.md introuvable (génère d'abord le post)`); process.exit(1); }
const post = (await readFile(postPath, 'utf8')).match(/## Post\n\n([\s\S]*?)\n\n## 1er commentaire/)?.[1] || '';
const { data: fm, content: body } = matter(await readFile(path.join(ROOT, 'drafts', `${slug}.md`), 'utf8'));
const shortUrl = `jerwis.fr/articles/${slug}`;

const system = `Tu transformes un post LinkedIn de Jérémy Sagnier (jerwis.fr) en carrousel de 6 à 8 slides. Le carrousel déroule UNE SEULE idée du post en séquence visuelle — il ne résume jamais l'article.

D'ABORD, JUGE : un carrousel n'est pertinent que si le post porte un chiffre percutant OU une démonstration/méthode séquençable. Une opinion pure sans chiffre ni étapes = pas de carrousel.

FORMAT DE SORTIE : UNIQUEMENT ce JSON, rien autour.
{
  "pertinent": true|false,
  "raison": "1 phrase",
  "slides": [
    { "kicker": "Jerwis · Décryptage", "type": "hook", "accent": "fuchsia", "swipe": "Glisse →",
      "lines": ["L'IA t'a", "peut-être", "**menti**", "ce matin."], "sub": "Et elle ne le sait pas." },
    { "kicker": "Le chiffre", "type": "stat", "accent": "teal", "stat": "47 %", "sub": "des dirigeants ont pris des décisions majeures sur du contenu IA jamais vérifié (2024)." },
    { "kicker": "Le mécanisme", "type": "idea", "accent": "orange", "lines": ["Quand elle", "ne sait pas,", "elle **devine**."], "sub": "Avec le même aplomb que pour une vraie information." },
    { "kicker": "Jerwis.fr", "type": "cta", "accent": "fuchsia", "lines": ["Le mode", "d'emploi", "complet :"], "badge": "${shortUrl}", "sub": "le bénéfice concret de l'article en 1 phrase." }
  ]
}

RÈGLES ABSOLUES :
- 6 à 8 slides. Slide 1 = type "hook" : reprend le hook du post (mêmes mots ou presque), swipe "Glisse →".
- Dernier slide = type "cta" : badge = "${shortUrl}" exactement, kicker "Jerwis.fr".
- UN message par slide. "lines" = le titre découpé en 2-4 lignes de 1 à 3 mots, MAX 13 caractères par ligne (gros corps typographique — un mot long comme « commercial » occupe sa propre ligne).
- EXACTEMENT un segment **accentué** par slide hook/idea (le mot qui porte le message). Jamais sur les slides stat/cta.
- "accent" tourne entre teal, fuchsia, orange — jamais deux slides consécutifs avec le même.
- 1 slide "stat" maximum, uniquement avec un chiffre PRÉSENT dans le post ou l'article (n'invente JAMAIS un chiffre). "stat" = MAX 7 caractères (ex "47 %", "20", "×2") — l'unité et le contexte vont dans "sub", jamais dans "stat".
- "sub" : 1 phrase courte (max 90 caractères), tutoiement, ton chaleureux jamais familier.
- Cliffhanger bienvenu entre deux slides (question sur l'un, réponse sur le suivant).
- kickers : 1-3 mots, sobres (Le chiffre, Le piège, Le mécanisme, La leçon…).`;

const prompt = `POST LINKEDIN (la matière principale — le carrousel déroule SON idée) :
${post}

ARTICLE SOURCE (uniquement pour vérifier les chiffres, ne pas élargir le sujet) :
Titre : ${fm.titre}
${body.slice(0, 8000)}

Produis le JSON du carrousel.`;

async function generer() {
  const opts = { system, temperature: 0.6, max_tokens: 3000 };
  if (await hasClaude()) {
    try { return (await claude(prompt, { ...opts, model: 'claude-sonnet-4-6' })).text; }
    catch (e) { console.error(`  ⟳ Claude KO (${e.message.slice(0, 80)}) → fallback OpenRouter…`); }
  }
  if (await hasOpenRouter()) return (await openrouter(prompt, opts)).text;
  throw new Error('Aucune clé LLM disponible');
}

// Re-coupe les lignes trop longues à l'espace le plus proche du milieu (hors segments **)
function normaliser(d) {
  for (const s of d.slides || []) {
    if (!s.lines) continue;
    const out = [];
    for (const l of s.lines) {
      if (l.replace(/\*\*/g, '').length <= 14 || !l.includes(' ')) { out.push(l); continue; }
      const words = l.split(' ');
      let a = '', b = '';
      for (const w of words) ((a.replace(/\*\*/g, '').length <= l.replace(/\*\*/g, '').length / 2) ? (a += (a ? ' ' : '') + w) : (b += (b ? ' ' : '') + w));
      // ne pas couper au milieu d'un segment ** (nombre de ** impair d'un côté = coupure invalide)
      if ((a.match(/\*\*/g) || []).length % 2 !== 0) { out.push(l); continue; }
      out.push(a); if (b) out.push(b);
    }
    s.lines = out;
  }
}

function verifier(d) {
  const errs = [];
  if (!Array.isArray(d.slides) || d.slides.length < 6 || d.slides.length > 8) errs.push(`${d.slides?.length || 0} slides (attendu 6-8)`);
  const txt = JSON.stringify(d.slides);
  for (const m of MOTS_BANNIS) if (new RegExp(m, 'i').test(txt)) errs.push(`mot banni : ${m}`);
  d.slides?.forEach((s, i) => {
    const hl = (s.lines || []).join(' ').match(/\*\*(.+?)\*\*/g) || [];
    if (['hook', 'idea'].includes(s.type) && hl.length !== 1) errs.push(`slide ${i + 1} : ${hl.length} accent(s) (attendu 1)`);
    if (['stat', 'cta'].includes(s.type) && hl.length > 0) errs.push(`slide ${i + 1} : accent interdit sur ${s.type}`);
    for (const l of s.lines || []) if (l.replace(/\*\*/g, '').length > 14) errs.push(`slide ${i + 1} : ligne trop longue « ${l} »`);
    if (i > 0 && s.accent === d.slides[i - 1].accent) errs.push(`slides ${i}-${i + 1} : même accent consécutif`);
    if ((s.sub || '').length > 110) errs.push(`slide ${i + 1} : sub trop long`);
    if (s.type === 'stat' && String(s.stat || '').length > 7) errs.push(`slide ${i + 1} : stat trop long « ${s.stat} » (max 7 car.)`);
  });
  const last = d.slides?.[d.slides.length - 1];
  if (last?.type !== 'cta' || last?.badge !== shortUrl) errs.push('dernier slide : cta/badge incorrect');
  if (d.slides?.[0]?.type !== 'hook') errs.push('slide 1 : doit être un hook');
  return errs;
}

let data = null;
for (let i = 1; i <= 2 && !data; i++) {
  console.error(`• Carrousel "${slug}" (essai ${i}/2)…`);
  const raw = (await generer()).trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  let d; try { d = JSON.parse(raw); } catch { console.error('  ✗ JSON invalide'); continue; }
  if (d.pertinent === false) { console.error(`• Carrousel non pertinent pour ce post — skip. (${d.raison || ''})`); process.exit(0); }
  normaliser(d);
  const errs = verifier(d);
  if (errs.length) { console.error(`  ✗ gate : ${errs.slice(0, 4).join(' · ')}`); continue; }
  data = d;
}
if (!data) { console.error('✗ Génération carrousel échouée après 2 essais.'); process.exit(1); }

const outdir = path.join(ROOT, 'linkedin', 'carousels', slug);
const { pngs, pdf } = await renderCarousel({ slug, slides: data.slides }, outdir);
// slides.json conservé pour retouche manuelle + re-rendu via carousel-render.mjs
const { writeFile: wf, mkdir: mk } = await import('node:fs/promises');
await mk(outdir, { recursive: true });
await wf(path.join(outdir, 'slides.json'), JSON.stringify({ slug, slides: data.slides }, null, 2));
console.error(`✓ ${pngs.length} slides + ${path.relative(ROOT, pdf)}`);
console.log(pdf);
