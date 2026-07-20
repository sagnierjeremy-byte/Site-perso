#!/usr/bin/env node
/**
 * translate-article-en.mjs — traduit un article FR publié en anglais US (en/articles/<slug>.html).
 *
 * Flux : lit articles/<slug>.html → protège <style>/<script> (sauf JSON-LD, dont le texte
 * doit être traduit) → transcréation LLM (Claude, fallback OpenRouter) guidée par le
 * termbase → gate francité (un body encore majoritairement FR = recopie, on rejette) →
 * écrit en/articles/<slug>.html → gen-en-page.mjs fait toute la plomberie (canonical,
 * hreflang, liens /en/, assets absolus) et valide.
 *
 * Usage : node scripts/i18n/translate-article-en.mjs <slug>
 * Sort 0 si OK, 1 si échec (rien d'écrit en cas de gate KO).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { claude, openrouter, hasClaude, hasOpenRouter } from '../blog/llm.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const slug = process.argv[2];
if (!slug) { console.error('Usage : translate-article-en.mjs <slug>'); process.exit(2); }

const frPath = path.join(ROOT, 'articles', `${slug}.html`);
if (!existsSync(frPath)) { console.error(`✗ article FR introuvable : articles/${slug}.html`); process.exit(1); }
const frHtml = await readFile(frPath, 'utf8');

// ── 1. Skeleton : placeholder les <style> et <script> NON JSON-LD (le LLM n'y touche pas) ──
const skels = [];
const skeletonize = (html) => html
  .replace(/<style[\s\S]*?<\/style>/gi, m => { skels.push(m); return `<!--__SKEL_${skels.length - 1}__-->`; })
  .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, m => { skels.push(m); return `<!--__SKEL_${skels.length - 1}__-->`; });
const restore = (html) => html.replace(/<!--__SKEL_(\d+)__-->/g, (_, i) => skels[Number(i)]);

const skeleton = skeletonize(frHtml);

// ── 2. Prompt de transcréation (voice + glossaire du termbase) ──
const termbase = JSON.parse(await readFile(path.join(ROOT, 'scripts', 'i18n', 'termbase.json'), 'utf8'));
const glossary = ['nav', 'footer', 'ui', 'glossary_pref'].flatMap(k =>
  Object.entries(termbase[k] || {}).map(([fr, en]) => `- "${fr}" → "${en}"`)
).join('\n');
const doNotTranslate = (termbase.doNotTranslate || []).join(', ');

const system = `You translate pages of jerwis.fr (AI for non-developer entrepreneurs) from French into US English.
${termbase.voice || ''}

ABSOLUTE RULES:
1. Output the COMPLETE translated HTML file, nothing else — no fences, no commentary.
2. Preserve the HTML structure EXACTLY: every tag, attribute, class, id, data-*, href, src stays byte-identical. Only translate human-visible French text: element text content, <title>, meta content (description, og:*, twitter:*), alt, aria-label, title attributes, and the text values inside <script type="application/ld+json"> (headline, description… — keep its structure and URLs untouched).
3. Placeholders like <!--__SKEL_0__--> must be kept exactly where they are.
4. Transcreate, don't translate literally: US English, "Leo" tone (warm direct "you", first person "I test, I share", zero unexplained jargon, no consultant-speak). Keep all numbers, dates, sources, product names exactly as they are.
5. Keep slugs and all URLs unchanged (the plumbing is handled elsewhere).
6. Never translate these names: ${doNotTranslate}
7. Fixed terminology (nav/footer/UI must match the rest of the site):
${glossary}
${termbase.seo_rules ? '8. SEO rules: ' + JSON.stringify(termbase.seo_rules) : ''}`;

async function translate(input) {
  const opts = { system, temperature: 0.3, max_tokens: 32000 };
  if (await hasClaude()) {
    try { return (await claude(input, { ...opts, model: 'claude-sonnet-4-6' })).text; }
    catch (e) { console.error(`  ⟳ Claude KO (${e.message.slice(0, 80)}) → fallback OpenRouter…`); }
  }
  if (await hasOpenRouter()) return (await openrouter(input, opts)).text;
  throw new Error('Aucune clé LLM disponible (CLAUDE/ANTHROPIC_API_KEY ou OPENROUTER_API_KEY)');
}

// ── 3. Gate francité : % de mots-fonction FR dans le texte visible (>8 % = recopie du FR) ──
const FR_STOP = new Set(['le','la','les','des','une','un','du','de','et','est','sont','pour','avec','dans','sur','pas','que','qui','ce','cette','ces','tes','ton','ta','mais','ou','où','donc','si','plus','moins','très','être','avoir','fait','faire','tout','tous','toute','aussi','comme','même','sans','sous','entre','vers','chez','leur','leurs','nous','vous','ils','elles','était','sera','peut','peux','veux','veut','quand','comment','pourquoi','alors','ça','cela','celui','celle','aux','au']);
function francite(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const words = text.match(/[a-z']+/g) || [];
  if (!words.length) return 100;
  const fr = words.filter(w => FR_STOP.has(w)).length;
  return Math.round((fr / words.length) * 1000) / 10;
}

// ── 4. Traduction (2 essais max si la gate francité échoue) ──
let enHtml = null;
for (let attempt = 1; attempt <= 2 && !enHtml; attempt++) {
  console.error(`• Traduction EN de "${slug}" (essai ${attempt}/2)…`);
  let out = (await translate(skeleton)).trim()
    .replace(/^```html?\s*/i, '').replace(/```\s*$/, '');
  out = restore(out);
  const pct = francite(out);
  const nSkel = (out.match(/__SKEL_\d+__/g) || []).length;
  if (nSkel > 0) { console.error(`  ✗ ${nSkel} placeholder(s) __SKEL__ non restauré(s) — sortie LLM corrompue`); continue; }
  if (pct > 8) { console.error(`  ✗ gate francité : ${pct}% de mots-fonction FR (max 8%) — le LLM a recopié du français`); continue; }
  console.error(`  ✓ gate francité : ${pct}% FR`);
  enHtml = out;
}
if (!enHtml) { console.error('✗ Traduction échouée après 2 essais.'); process.exit(1); }

// ── 5. Écriture + plomberie gen-en-page (canonical, hreflang, liens /en/, validation) ──
const enPath = path.join(ROOT, 'en', 'articles', `${slug}.html`);
await writeFile(enPath, enHtml, 'utf8');
const gen = spawnSync('node', [path.join(ROOT, 'scripts', 'i18n', 'gen-en-page.mjs'), `articles/${slug}.html`], { cwd: ROOT, stdio: 'inherit' });
if (gen.status !== 0) { console.error('✗ gen-en-page.mjs a rejeté la page (voir ci-dessus).'); process.exit(1); }
console.error(`✓ en/articles/${slug}.html traduit et normalisé`);
