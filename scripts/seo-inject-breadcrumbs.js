#!/usr/bin/env node
// Injecte un BreadcrumbList JSON-LD dans chaque article + chaque hub.
// Articles : Accueil > Articles > [titre article]
// Hubs : Accueil > [nom hub]
// Skip si BreadcrumbList déjà présent (sentinel).

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SENTINEL = 'BreadcrumbList';

// Mapping hub slug → label affiché dans le breadcrumb
const HUBS = {
  'apprendre': 'Apprendre',
  'debutant': 'Débuter avec l\'IA',
  'claude-code': 'Claude Code',
  'lexique': 'Lexique IA',
  'workflows': 'Workflows',
  'outils': 'Outils',
  'github': 'GitHub pour non-devs',
  'podcast': 'Podcast',
  'modeles-ia': 'Modèles IA',
  'modeles-image-ia': 'Modèles image IA',
  'precommande-photos-personal-branding': 'Générateur photos',
  'jeremy-sagnier': 'Jérémy Sagnier',
  'articles': 'Articles',
  'news': 'Veille',
};

function extractTitleFromHtml(html) {
  // Préférer og:title qui est souvent plus propre
  const og = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/);
  if (og) return cleanTitle(og[1]);
  const t = html.match(/<title>([^<]+)<\/title>/);
  if (t) return cleanTitle(t[1]);
  return null;
}

function cleanTitle(s) {
  // Retire les suffixes courants : " — par Jérémy Sagnier", " · Jerwis", etc.
  return s
    .replace(/\s*[—·|]\s*(par\s+)?J[ée]r[ée]my\s+Sagnier\s*$/i, '')
    .replace(/\s*[—·|]\s*Jerwis\s*$/i, '')
    .replace(/\s*[—·|]\s*Le Journal.*$/i, '')
    .trim();
}

function extractCanonical(html) {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  return m ? m[1] : null;
}

function escapeJsonString(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildBreadcrumb(items) {
  const list = items.map((it, i) =>
    `    { "@type": "ListItem", "position": ${i + 1}, "name": "${escapeJsonString(it.name)}", "item": "${it.url}" }`
  ).join(',\n');
  return `<!-- Schema.org : BreadcrumbList -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
${list}
  ]
}
</script>`;
}

function injectAfterCanonical(html, block) {
  // Insertion juste après la ligne canonical
  const m = html.match(/(<link\s+rel="canonical"[^>]+>)/);
  if (!m) return null;
  return html.replace(m[1], m[1] + '\n\n' + block);
}

function processArticle(file) {
  const slug = file.replace(/^.*\/articles\//, '').replace(/\.html$/, '');
  if (slug === '_TEMPLATE') return { skipped: 'template' };
  const html = readFileSync(file, 'utf8');
  if (html.includes(SENTINEL)) return { skipped: 'déjà présent' };
  const canonical = extractCanonical(html);
  const title = extractTitleFromHtml(html);
  if (!canonical || !title) return { skipped: 'pas de canonical ou title' };

  const block = buildBreadcrumb([
    { name: 'Accueil', url: 'https://jerwis.fr/' },
    { name: 'Articles', url: 'https://jerwis.fr/articles' },
    { name: title, url: canonical },
  ]);
  const updated = injectAfterCanonical(html, block);
  if (!updated) return { skipped: 'pas de canonical' };
  writeFileSync(file, updated, 'utf8');
  return { ok: true, title };
}

function processHub(file) {
  const slug = file.replace(/^.*\//, '').replace(/\.html$/, '');
  if (!HUBS[slug]) return { skipped: 'pas dans la liste hubs' };
  const html = readFileSync(file, 'utf8');
  if (html.includes(SENTINEL)) return { skipped: 'déjà présent' };
  const canonical = extractCanonical(html);
  if (!canonical) return { skipped: 'pas de canonical' };

  const block = buildBreadcrumb([
    { name: 'Accueil', url: 'https://jerwis.fr/' },
    { name: HUBS[slug], url: canonical },
  ]);
  const updated = injectAfterCanonical(html, block);
  if (!updated) return { skipped: 'pas de canonical' };
  writeFileSync(file, updated, 'utf8');
  return { ok: true };
}

// === Articles ===
const articleDir = join(ROOT, 'articles');
const articleFiles = readdirSync(articleDir)
  .filter(n => n.endsWith('.html'))
  .map(n => join(articleDir, n));

console.log(`\n=== Articles ===`);
let articlesOk = 0, articlesSkip = 0;
for (const file of articleFiles) {
  const r = processArticle(file);
  if (r.ok) { articlesOk++; console.log(`  ✓ ${relative(ROOT, file)}`); }
  else { articlesSkip++; console.log(`  · skip (${r.skipped}) ${relative(ROOT, file)}`); }
}

// === Hubs ===
console.log(`\n=== Hubs ===`);
let hubsOk = 0, hubsSkip = 0;
for (const slug of Object.keys(HUBS)) {
  const file = join(ROOT, `${slug}.html`);
  let r;
  try { r = processHub(file); }
  catch (e) { r = { skipped: e.message }; }
  if (r.ok) { hubsOk++; console.log(`  ✓ ${slug}.html`); }
  else { hubsSkip++; console.log(`  · skip (${r.skipped}) ${slug}.html`); }
}

console.log(`\n✓ Articles: ${articlesOk}/${articleFiles.length} · Hubs: ${hubsOk}/${Object.keys(HUBS).length}`);
