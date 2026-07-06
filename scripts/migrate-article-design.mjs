#!/usr/bin/env node
/**
 * scripts/migrate-article-design.mjs — Migration design v2 (docs/design-articles-v2.md)
 *
 * Migre chaque articles/*.html et en/articles/*.html (hors _TEMPLATE.html / _PROTO-design.html) vers :
 *   1. <link rel="stylesheet" href="../assets/article.css?v=20260706"> à la place du <style> inline
 *   2. <script src="../assets/article-reading.js" defer> avant </body>
 *   3. Ancres <!-- ARTICLE_BODY:START/END --> + mini-marquees dans le corps
 *
 * Idempotent : chaque étape est indépendamment guardée (skip si déjà fait).
 *
 * Détection de conformité : le critère "littéral" du plan (§2 — présence de
 * '--fuchsia: #EF426F;' ET '.tldr {') s'est avéré ne RIEN filtrer : les 35 articles FR
 * (et leurs 35 miroirs EN) contiennent tous les deux tokens, y compris karpathy.html et
 * jerwis-finance-tracker.html que le plan cite explicitement comme hand-made à SKIPPER.
 * Test réel utilisé ici : le bloc <style> de l'article doit contenir le CSS baseline du
 * _TEMPLATE.html d'ORIGINE (avant cette migration, capturé ci-dessous) comme sous-séquence
 * ordonnée exacte. Si oui → conforme (article généré depuis le template, éventuellement
 * enrichi de CSS custom qu'on préserve). Si non → divergent → SKIP + log (hand-made /
 * template historique différent — ne pas forcer, cf §2 du plan).
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const log = {
  info: (m) => console.log(`\x1b[36m•\x1b[0m ${m}`),
  ok:   (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`),
  warn: (m) => console.log(`\x1b[33m!\x1b[0m ${m}`),
  err:  (m) => console.error(`\x1b[31m×\x1b[0m ${m}`),
  section: (m) => console.log(`\n\x1b[1m${m}\x1b[0m`),
};

// Les pages en/articles/*.html sont générées par scripts/i18n/gen-en-page.mjs avec des
// chemins d'assets ABSOLUS (/assets/...), alors que articles/*.html (FR) utilise des
// chemins RELATIFS (../assets/...). Les deux conventions coexistent déjà dans chaque
// famille de fichiers (cf <link href="/assets/fonts.css"> en tête des EN) — on les respecte.
const cssLink = (isEN) => `<link rel="stylesheet" href="${isEN ? '/assets' : '../assets'}/article.css?v=20260706">`;
const readingJsTag = (isEN) => `<script src="${isEN ? '/assets' : '../assets'}/article-reading.js" defer></script>`;
const ANCHOR_START = '<!-- ARTICLE_BODY:START -->';
const ANCHOR_END = '<!-- ARTICLE_BODY:END -->';

// --- Baseline CSS du _TEMPLATE.html d'origine (avant migration design v2, 330 lignes) ---
const TEMPLATE_BASELINE_CSS = "  :root {\n    --fuchsia: #EF426F;\n    --teal:    #00B2A9;\n    --orange:  #FF8200;\n  }\n  [data-theme=\"light\"] {\n    --bg:      #FBF7F0; --bg-2: #F2EDE2; --surface: #FFFFFF;\n    --ink:     #0A0A0A; --ink-soft: #3A3A3A; --ink-muted: #6E6E6E;\n    --line:    rgba(10,10,10,.10); --line-strong: rgba(10,10,10,.18);\n    --code-bg: #F4EFE6; --code-ink: #0A0A0A;\n  }\n  [data-theme=\"dark\"] {\n    --bg:      #0A0A0A; --bg-2: #141414; --surface: #141414;\n    --ink:     #F4EFE6; --ink-soft: #D4D4D4; --ink-muted: #9A9A9A;\n    --line:    rgba(255,255,255,.10); --line-strong: rgba(255,255,255,.22);\n    --code-bg: #1A1A1A; --code-ink: #F4EFE6;\n  }\n\n  * { box-sizing: border-box; margin: 0; padding: 0 }\n  html { scroll-behavior: smooth }\n  body {\n    font-family: 'Archivo', sans-serif; background: var(--bg); color: var(--ink);\n    line-height: 1.6; font-size: 16px; min-height: 100vh;\n    transition: background .3s, color .3s;\n  }\n  body::before {\n    content: \"\"; position: fixed; inset: 0; pointer-events: none; z-index: 100;\n    opacity: .3; mix-blend-mode: multiply;\n    background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .25 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\");\n  }\n  [data-theme=\"dark\"] body::before { mix-blend-mode: screen; opacity: .08 }\n\n  .container { max-width: 880px; margin: 0 auto; padding: 0 28px }\n  @media (min-width: 900px) { .container { padding: 0 48px } }\n  .container-wide { max-width: 1320px; margin: 0 auto; padding: 0 28px }\n  @media (min-width: 900px) { .container-wide { padding: 0 48px } }\n\n  /* Top stripe */\n  .triple-stripe { display: flex; height: 6px; width: 100% }\n  .triple-stripe span { flex: 1 }\n\n  /* Header */\n  .header {\n    position: sticky; top: 0; z-index: 50;\n    background: color-mix(in srgb, var(--bg) 85%, transparent);\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border-bottom: 1px solid var(--line);\n  }\n  .header-inner {\n    max-width: 1320px; margin: 0 auto; padding: 16px 28px;\n    display: flex; align-items: center; justify-content: space-between;\n  }\n  @media (min-width: 900px) { .header-inner { padding: 16px 48px } }\n  .logo {\n    font-family: 'Archivo Black', sans-serif;\n    font-size: 20px; letter-spacing: -.02em; text-transform: uppercase;\n    text-decoration: none; color: var(--ink);\n    display: flex; align-items: center; gap: 10px;\n  }\n  .logo-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--fuchsia) }\n  .back-link {\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .15em; font-weight: 700; text-transform: uppercase;\n    color: var(--ink-soft); text-decoration: none;\n    display: inline-flex; align-items: center; gap: 6px;\n    transition: color .2s;\n  }\n  .back-link:hover { color: var(--fuchsia) }\n  .theme-toggle {\n    width: 40px; height: 40px; border-radius: 999px;\n    border: 1px solid var(--line-strong); background: var(--surface);\n    color: var(--ink); cursor: pointer;\n    display: flex; align-items: center; justify-content: center;\n    transition: transform .2s, border-color .2s; margin-left: 16px;\n  }\n  .theme-toggle:hover { transform: rotate(15deg); border-color: var(--fuchsia) }\n  .theme-toggle svg { width: 16px; height: 16px }\n  [data-theme=\"light\"] .theme-toggle .icon-moon { display: block }\n  [data-theme=\"light\"] .theme-toggle .icon-sun { display: none }\n  [data-theme=\"dark\"] .theme-toggle .icon-moon { display: none }\n  [data-theme=\"dark\"] .theme-toggle .icon-sun { display: block }\n\n  /* Hero */\n  .hero {\n    padding: 64px 0 88px;\n    background:\n      radial-gradient(ellipse at 90% 20%, rgba(0,178,169,.25), transparent 50%),\n      radial-gradient(ellipse at 10% 90%, rgba(239,66,111,.2), transparent 55%),\n      #0A0A0A;\n    color: #F4EFE6;\n    position: relative; overflow: hidden;\n    border-top: 1px solid rgba(255,255,255,.08);\n  }\n  .kicker {\n    display: inline-flex; align-items: center; gap: 10px;\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .2em; font-weight: 700; text-transform: uppercase;\n    color: #F4EFE6; padding: 8px 14px; border-radius: 999px;\n    background: rgba(10,10,10,.4); border: 1px solid rgba(255,255,255,.22);\n    margin-bottom: 28px;\n  }\n  .kicker .dot {\n    width: 8px; height: 8px; border-radius: 50%;\n    background: var(--teal); box-shadow: 0 0 10px var(--teal);\n    animation: pulse 2s infinite;\n  }\n  @keyframes pulse {\n    0%   { box-shadow: 0 0 0 0 rgba(0,178,169,.5) }\n    70%  { box-shadow: 0 0 0 12px rgba(0,178,169,0) }\n    100% { box-shadow: 0 0 0 0 rgba(0,178,169,0) }\n  }\n  .hero h1 {\n    font-family: 'Archivo Black', sans-serif;\n    font-size: clamp(36px, 6vw, 72px);\n    line-height: .95; letter-spacing: -.03em;\n    text-transform: uppercase; color: #F4EFE6;\n    margin-bottom: 24px; max-width: 820px;\n  }\n  .hero h1 em { font-style: normal; color: var(--teal) }\n  .hero p.hero-lead {\n    font-size: 17.5px; color: #C4CED4;\n    max-width: 640px; margin-bottom: 32px; line-height: 1.6;\n  }\n  .hero-meta {\n    display: flex; flex-wrap: wrap; gap: 10px;\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .15em; font-weight: 700; text-transform: uppercase;\n    color: #C4CED4;\n  }\n  .hero-meta-item {\n    padding: 8px 14px; border-radius: 999px;\n    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.15);\n  }\n  .hero-meta-item strong { color: var(--teal); margin-right: 6px }\n\n  /* TL;DR */\n  .tldr {\n    max-width: 880px; margin: -40px auto 0;\n    background: var(--surface);\n    border: 1px solid var(--line-strong);\n    border-radius: 22px;\n    padding: 28px 32px;\n    position: relative;\n    z-index: 2;\n    box-shadow: 0 30px 60px -30px rgba(0,0,0,.3);\n  }\n  .tldr::before {\n    content: \"\"; position: absolute; top: 0; left: 32px;\n    height: 4px; width: 80px;\n    background: linear-gradient(90deg, var(--teal), var(--fuchsia), var(--orange));\n    border-radius: 4px;\n  }\n  .tldr-label {\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .2em; font-weight: 700; text-transform: uppercase;\n    color: var(--fuchsia); margin-bottom: 12px; margin-top: 8px;\n  }\n  .tldr h2 {\n    font-family: 'Archivo Black', sans-serif;\n    font-size: 24px; letter-spacing: -.02em; text-transform: uppercase;\n    margin-bottom: 16px;\n  }\n  .tldr ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px }\n  .tldr li {\n    padding-left: 28px; position: relative; font-size: 15.5px; line-height: 1.55;\n    color: var(--ink-soft);\n  }\n  .tldr li strong { color: var(--ink) }\n  .tldr li::before {\n    content: \"→\"; position: absolute; left: 0; top: 0;\n    color: var(--teal); font-weight: 700;\n  }\n\n  /* Sections */\n  section.block { padding: 72px 0; border-top: 1px solid var(--line) }\n  section.block:first-of-type { border-top: none }\n  .section-kicker {\n    display: inline-flex; align-items: center; gap: 10px;\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .2em; font-weight: 700; text-transform: uppercase;\n    margin-bottom: 20px; padding: 6px 14px; border-radius: 999px;\n  }\n  .section-kicker.k-teal    { background: rgba(0,178,169,.12);  color: var(--teal) }\n  .section-kicker.k-fuchsia { background: rgba(239,66,111,.12); color: var(--fuchsia) }\n  .section-kicker.k-orange  { background: rgba(255,130,0,.12);  color: var(--orange) }\n  h2 {\n    font-family: 'Archivo Black', sans-serif;\n    font-size: clamp(28px, 4vw, 44px);\n    line-height: .98; letter-spacing: -.03em; text-transform: uppercase;\n    margin-bottom: 20px;\n  }\n  h2 em { font-style: normal }\n  h2 em.teal    { color: var(--teal) }\n  h2 em.fuchsia { color: var(--fuchsia) }\n  h2 em.orange  { color: var(--orange) }\n  h3 {\n    font-family: 'Archivo Black', sans-serif;\n    font-size: clamp(20px, 2.3vw, 26px);\n    line-height: 1.05; letter-spacing: -.02em; text-transform: uppercase;\n    margin: 32px 0 14px;\n  }\n  h4 {\n    font-family: 'Archivo Black', sans-serif;\n    font-size: 17px; letter-spacing: -.01em; text-transform: uppercase;\n    margin: 24px 0 10px;\n  }\n  p {\n    font-size: 16.5px; line-height: 1.75; color: var(--ink-soft);\n    margin-bottom: 18px;\n  }\n  p strong { color: var(--ink); font-weight: 700 }\n  ul, ol { margin: 0 0 18px 22px; color: var(--ink-soft) }\n  li { margin-bottom: 8px; line-height: 1.7 }\n  a { color: var(--fuchsia); text-decoration: underline; text-underline-offset: 3px }\n  a:hover { color: var(--orange) }\n\n  /* Step cards */\n  .step {\n    display: flex; gap: 20px; padding: 26px 30px;\n    border-radius: 20px; background: var(--surface);\n    border: 1px solid var(--line-strong);\n    margin-bottom: 18px;\n    transition: box-shadow .2s, border-color .2s;\n  }\n  .step:hover {\n    box-shadow: 0 20px 40px -20px rgba(0,0,0,.15);\n    border-color: var(--fuchsia);\n  }\n  .step-num {\n    flex-shrink: 0; width: 52px; height: 52px;\n    border-radius: 14px;\n    display: flex; align-items: center; justify-content: center;\n    font-family: 'Archivo Black', sans-serif; font-size: 20px; letter-spacing: -.02em;\n  }\n  .step:nth-of-type(3n+1) .step-num { background: rgba(0,178,169,.14);  color: var(--teal) }\n  .step:nth-of-type(3n+2) .step-num { background: rgba(239,66,111,.14); color: var(--fuchsia) }\n  .step:nth-of-type(3n+3) .step-num { background: rgba(255,130,0,.14);  color: var(--orange) }\n  .step-body { flex: 1; min-width: 0 }\n  .step-body h3 { margin-top: 0; margin-bottom: 8px }\n  .step-body p:last-child { margin-bottom: 0 }\n\n  /* Code blocks */\n  pre {\n    font-family: 'JetBrains Mono', monospace; font-size: 13.5px;\n    background: var(--code-bg); color: var(--code-ink);\n    padding: 14px 18px; border-radius: 10px;\n    overflow-x: auto; line-height: 1.5;\n    margin: 12px 0 20px;\n    border: 1px solid var(--line-strong);\n  }\n  code {\n    font-family: 'JetBrains Mono', monospace; font-size: .88em;\n    background: var(--code-bg); padding: 2px 6px; border-radius: 4px;\n    color: var(--code-ink);\n  }\n  pre code { background: transparent; padding: 0 }\n\n  /* Callouts */\n  .callout {\n    padding: 20px 24px; border-radius: 14px;\n    margin: 20px 0; position: relative; padding-left: 52px;\n  }\n  .callout::before {\n    content: \"\"; position: absolute;\n    left: 20px; top: 22px;\n    width: 16px; height: 16px; border-radius: 50%;\n  }\n  .callout.ok    { background: rgba(0,178,169,.08);  border: 1px solid rgba(0,178,169,.25) }\n  .callout.ok::before    { background: var(--teal) }\n  .callout.warn  { background: rgba(255,130,0,.08); border: 1px solid rgba(255,130,0,.25) }\n  .callout.warn::before  { background: var(--orange) }\n  .callout.tip   { background: rgba(239,66,111,.08); border: 1px solid rgba(239,66,111,.25) }\n  .callout.tip::before   { background: var(--fuchsia) }\n  .callout h4 { margin: 0 0 6px; font-size: 15px }\n  .callout p  { margin: 0; font-size: 14.5px }\n\n  /* Use case box */\n  .usecase {\n    background: linear-gradient(135deg, rgba(0,178,169,.05), rgba(239,66,111,.05));\n    border: 1px solid var(--line-strong);\n    border-radius: 20px;\n    padding: 24px 28px;\n    margin: 20px 0;\n  }\n  .usecase-label {\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .2em; font-weight: 700; text-transform: uppercase;\n    color: var(--fuchsia); margin-bottom: 12px;\n  }\n  .usecase h4 { margin-top: 0 }\n\n  /* Fin d'article (signature auteur) */\n  .article-end { padding: 60px 0 36px; border-top: 1px solid var(--line); background: var(--bg); }\n  .article-end-card {\n    max-width: 720px; margin: 0 auto; display: flex; gap: 24px; align-items: flex-start;\n    background: var(--bg-2); border: 1px solid var(--line); border-radius: 20px;\n    padding: 30px 32px; position: relative; overflow: hidden;\n  }\n  .article-end-card::before {\n    content: \"\"; position: absolute; left: 0; top: 0; bottom: 0; width: 5px;\n    background: linear-gradient(180deg, var(--teal), var(--fuchsia) 55%, var(--orange));\n  }\n  .article-end-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid var(--line-strong); flex-shrink: 0; }\n  .article-end-kicker { display:inline-block; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color: var(--teal); margin-bottom: 6px; }\n  .article-end-title { font-size: clamp(20px,3vw,25px); line-height:1.12; margin: 0 0 10px; letter-spacing:-.02em; color: var(--ink); }\n  .article-end-body p { color: var(--ink-muted); font-size: 15.5px; line-height:1.65; margin: 0 0 20px; max-width: 54ch; }\n  .article-end-actions { display:flex; gap:12px; flex-wrap:wrap; }\n  .article-end-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border-radius:999px; font-family:'Archivo',sans-serif; font-weight:700; font-size:14px; text-decoration:none; transition:transform .15s, background .2s, color .2s, border-color .2s; }\n  .article-end-btn.primary { background: var(--fuchsia); color:#fff; }\n  .article-end-btn.primary:hover { transform:translateY(-2px); }\n  .article-end-btn.ghost { background:transparent; color: var(--ink); border:1.5px solid var(--line-strong); }\n  .article-end-btn.ghost:hover { border-color: var(--ink); transform:translateY(-2px); }\n  @media (max-width:600px){ .article-end-card{ flex-direction:column; gap:18px; padding:24px; } .article-end-avatar{ width:60px; height:60px; } }\n\n  /* Footer */\n  .footer {\n    background: var(--bg); padding: 48px 0 40px;\n    border-top: 1px solid var(--line); position: relative;\n  }\n  .footer::before {\n    content: \"\"; position: absolute; top: 0; left: 0; right: 0;\n    height: 6px;\n    background: linear-gradient(90deg, var(--teal) 0% 33.33%, var(--fuchsia) 33.33% 66.66%, var(--orange) 66.66% 100%);\n  }\n  .footer-bottom {\n    text-align: center;\n    font-family: 'JetBrains Mono', monospace; font-size: 11px;\n    letter-spacing: .15em; font-weight: 700; text-transform: uppercase;\n    color: var(--ink-muted);\n  }\n";
const BASELINE_LINES = TEMPLATE_BASELINE_CSS.split('\n').map((l) => l.trim()).filter(Boolean);

// --- Mini-marquees (§4 du plan) ---
const MARQUEE_FR_START = ["Zéro jargon","Testé d'abord pour moi","Sources dans le texte","Prompts à copier","Réponds si tu n'es pas d'accord"];
const MARQUEE_FR_END = ["Comprendre avant d'appliquer","À ton rythme","Pas de pub","Désinscription en 1 clic","Je lis toutes les réponses"];
const MARQUEE_EN_START = ["No jargon","Tested on myself first","Sources in the text","Prompts to copy","Reply if you disagree"];
const MARQUEE_EN_END = ["Understand before you apply","At your own pace","No ads","Unsubscribe in one click","I read every reply"];

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderMarquee(items) {
  const spans = items.map((t) => `<span>${escapeHtml(t)}</span>`).join('');
  return `<div class="mini-marquee" aria-hidden="true"><div class="mini-marquee-track">\n  ${spans}\n  ${spans}\n</div></div>`;
}

// --- LCS (longest common subsequence) entre les lignes du template baseline et
// celles du bloc <style> de l'article, pour extraire précisément le CSS "extra"
// (custom, ajouté par-dessus le template) à préserver, sans confondre une ligne
// courte répétée (ex: une simple "}") avec une vraie ligne du baseline. ---
function diffExtraLines(baseline, articleLines) {
  const n = baseline.length, m = articleLines.length;
  // dp[i][j] = longueur de la LCS entre baseline[i:] et articleLines[j:]
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = baseline[i] === articleLines[j].trim()
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const matchedCount = dp[0][0];
  const extra = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (baseline[i] === articleLines[j].trim()) { i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { i++; }
    else { extra.push(articleLines[j]); j++; }
  }
  while (j < m) { extra.push(articleLines[j]); j++; }
  return { matchedCount, extra };
}

function analyzeConformance(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) return { conformant: false, reason: 'aucun <style> inline trouvé', extra: [] };
  const articleLines = m[1].split('\n');
  const { matchedCount, extra } = diffExtraLines(BASELINE_LINES, articleLines);
  const conformant = matchedCount === BASELINE_LINES.length;
  return {
    conformant,
    reason: conformant ? null : `CSS baseline incomplet (${matchedCount}/${BASELINE_LINES.length} lignes du template retrouvées) — hand-made / template historique divergent`,
    extra,
    styleBlockMatch: m[0],
  };
}

function buildReplacementStyleTag(extraLines, isEN) {
  const link = cssLink(isEN);
  const extraTrimmedNonEmpty = extraLines.map((l) => l.replace(/\s+$/, '')).join('\n').trim();
  if (!extraTrimmedNonEmpty) return link;
  return `${link}\n<style>\n${extraTrimmedNonEmpty}\n</style>`;
}

function migrateStyle(html, isEN) {
  if (html.includes('article.css?v=')) return { html, changed: false, note: 'déjà migré (link présent)' };
  const analysis = analyzeConformance(html);
  if (!analysis.conformant) return { html, changed: false, skip: true, reason: analysis.reason };
  const replacement = buildReplacementStyleTag(analysis.extra, isEN);
  const newHtml = html.replace(analysis.styleBlockMatch, replacement);
  const extraCount = analysis.extra.filter((l) => l.trim()).length;
  return { html: newHtml, changed: true, note: extraCount > 0 ? `CSS custom préservé (${extraCount} lignes)` : 'style swap propre (0 extra)' };
}

function migrateReadingJs(html, isEN) {
  if (html.includes('article-reading.js')) return { html, changed: false };
  if (!html.includes('</body>')) return { html, changed: false, skip: true, reason: 'pas de </body> trouvé' };
  const newHtml = html.replace('</body>', `${readingJsTag(isEN)}\n</body>`);
  return { html: newHtml, changed: true };
}

function migrateBodyAnchors(html, isEN) {
  if (html.includes(ANCHOR_START)) return { html, changed: false, note: 'ancres déjà présentes' };

  const tldrMatch = html.match(/<div class="tldr">[\s\S]*?<\/div>\s*<\/div>/);
  if (!tldrMatch) return { html, changed: false, skip: true, reason: 'bloc TL;DR introuvable (pattern <div class="tldr">...</div></div>)' };

  const ctaIdx = (() => {
    const finalCta = html.indexOf('<!-- Final CTA -->');
    if (finalCta !== -1) return { idx: finalCta, marker: '<!-- Final CTA -->' };
    const fin = html.indexOf("<!-- Fin d'article");
    if (fin !== -1) return { idx: fin, marker: "<!-- Fin d'article" };
    return null;
  })();
  if (!ctaIdx) return { html, changed: false, skip: true, reason: 'ancre de fin introuvable (ni Final CTA ni Fin d\'article)' };

  const tldrEnd = tldrMatch.index + tldrMatch[0].length;
  if (ctaIdx.idx < tldrEnd) return { html, changed: false, skip: true, reason: 'position TL;DR/CTA incohérente (CTA avant la fin du TL;DR)' };

  const hasExistingMarquee = html.includes('class="mini-marquee"');
  const startItems = isEN ? MARQUEE_EN_START : MARQUEE_FR_START;
  const endItems = isEN ? MARQUEE_EN_END : MARQUEE_FR_END;

  const openTag = hasExistingMarquee
    ? `${ANCHOR_START}\n`
    : `${ANCHOR_START}\n${renderMarquee(startItems)}\n`;
  const closeTag = hasExistingMarquee
    ? `\n${ANCHOR_END}`
    : `\n${renderMarquee(endItems)}\n${ANCHOR_END}`;

  const before = html.slice(0, tldrEnd);
  const middle = html.slice(tldrEnd, ctaIdx.idx);
  const after = html.slice(ctaIdx.idx);

  const newHtml = `${before}\n${openTag}${middle}${closeTag}\n${after}`;
  return {
    html: newHtml,
    changed: true,
    note: hasExistingMarquee ? 'ancres seules (marquees existantes préservées, pas de doublon)' : 'ancres + 2 marquees insérées',
  };
}

async function migrateFile(filePath, isEN, dryRun) {
  const rel = path.relative(ROOT, filePath);
  let html = await readFile(filePath, 'utf8');
  const original = html;
  const notes = [];

  const styleResult = migrateStyle(html, isEN);
  if (styleResult.skip) return { rel, status: 'SKIP', reason: styleResult.reason };
  html = styleResult.html;
  if (styleResult.changed) notes.push(`style: ${styleResult.note}`);

  const jsResult = migrateReadingJs(html, isEN);
  if (jsResult.skip) return { rel, status: 'SKIP', reason: jsResult.reason };
  html = jsResult.html;
  if (jsResult.changed) notes.push('article-reading.js injecté');

  const anchorResult = migrateBodyAnchors(html, isEN);
  if (anchorResult.skip) return { rel, status: 'SKIP', reason: anchorResult.reason };
  html = anchorResult.html;
  if (anchorResult.changed) notes.push(`corps: ${anchorResult.note}`);

  if (html === original) return { rel, status: 'UP_TO_DATE' };

  if (!dryRun) await writeFile(filePath, html, 'utf8');
  return { rel, status: 'MIGRATED', notes };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const dirs = [
    { dir: path.join(ROOT, 'articles'), isEN: false },
    { dir: path.join(ROOT, 'en', 'articles'), isEN: true },
  ];

  const results = [];
  for (const { dir, isEN } of dirs) {
    const files = (await readdir(dir))
      .filter((f) => f.endsWith('.html') && !f.startsWith('_'))
      .sort();
    for (const f of files) {
      const r = await migrateFile(path.join(dir, f), isEN, dryRun);
      results.push(r);
    }
  }

  log.section(`📦 Migration design v2 — rapport${dryRun ? ' (DRY RUN — aucun fichier écrit)' : ''}`);
  const migrated = results.filter((r) => r.status === 'MIGRATED');
  const skipped = results.filter((r) => r.status === 'SKIP');
  const upToDate = results.filter((r) => r.status === 'UP_TO_DATE');

  log.section(`✓ Migrés (${migrated.length})`);
  for (const r of migrated) log.ok(`${r.rel} — ${r.notes.join(' · ')}`);

  log.section(`○ Déjà à jour (${upToDate.length})`);
  for (const r of upToDate) log.info(r.rel);

  log.section(`⨯ Skippés (${skipped.length})`);
  for (const r of skipped) log.warn(`${r.rel} — ${r.reason}`);

  log.section('Résumé');
  log.info(`Total traité : ${results.length} · Migrés : ${migrated.length} · Déjà à jour : ${upToDate.length} · Skippés : ${skipped.length}`);
}

main().catch((e) => {
  log.err(e.stack || e.message);
  process.exit(1);
});
