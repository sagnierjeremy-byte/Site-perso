#!/usr/bin/env node
/**
 * publish.js — Convertit drafts/*.md en articles/*.html
 *
 * Usage :
 *   npm run publish <slug>     → publie un draft précis (ex: npm run publish mon-article)
 *   npm run publish:all        → publie tous les drafts présents dans drafts/
 *
 * Flux :
 *   1. Lit le draft markdown + frontmatter
 *   2. Injecte dans le template _TEMPLATE.html
 *   3. Écrit articles/<slug>.html
 *   4. Met à jour sitemap.xml (ajout ou update)
 *   5. (optionnel) Ajoute le teaser dans l'étape correspondante de apprendre.html si `parcours_etape` défini
 *   6. Affiche un résumé clair
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PATHS = {
  drafts:   path.join(ROOT, 'drafts'),
  template: path.join(ROOT, 'articles', '_TEMPLATE.html'),
  articles: path.join(ROOT, 'articles'),
  sitemap:  path.join(ROOT, 'sitemap.xml'),
  apprendre:path.join(ROOT, 'apprendre.html'),
};

const SITE_URL = 'https://jeremysagnier.com';

// --- Utils ---
const log = {
  info:    (m) => console.log(`\x1b[36m•\x1b[0m ${m}`),
  ok:      (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`),
  warn:    (m) => console.log(`\x1b[33m!\x1b[0m ${m}`),
  err:     (m) => console.error(`\x1b[31m×\x1b[0m ${m}`),
  section: (m) => console.log(`\n\x1b[1m${m}\x1b[0m`),
};

const escapeAttr = (s) => String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- Core ---

async function readDraft(slug) {
  const filePath = path.join(PATHS.drafts, `${slug}.md`);
  if (!existsSync(filePath)) {
    throw new Error(`Draft introuvable : ${filePath}`);
  }
  const raw = await readFile(filePath, 'utf8');
  const { data, content } = matter(raw);

  // Validations minimales
  const required = ['slug', 'titre', 'description', 'hero_ligne_1', 'lead', 'duree', 'niveau', 'published'];
  for (const key of required) {
    if (!data[key]) throw new Error(`Frontmatter manquant : ${key} (dans ${slug}.md)`);
  }
  if (data.slug !== slug) {
    log.warn(`Le frontmatter slug (${data.slug}) diffère du nom de fichier (${slug}). J'utilise le nom de fichier.`);
    data.slug = slug;
  }
  return { data, content };
}

function renderTLDR(tldr) {
  if (!Array.isArray(tldr) || tldr.length === 0) return '';
  const items = tldr.map((t) => `      <li>${t}</li>`).join('\n');
  return `
<!-- TL;DR -->
<div class="container">
  <div class="tldr">
    <div class="tldr-label">En 30 secondes</div>
    <h2>Ce que tu repars avec</h2>
    <ul>
${items}
    </ul>
  </div>
</div>
`.trim();
}

function renderBody(mdContent) {
  // marked avec options sécurisées
  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
  // Wrap sections : l'agent peut utiliser `<!-- section k-teal -->` comme séparateur de block
  // Chaque section détectée devient un <section class="block">
  const parts = mdContent.split(/<!--\s*section\s+(k-(?:teal|fuchsia|orange))\s*-->/g);
  // parts[0] = contenu avant toute section (peut être vide)
  // puis alternance : class | contenu
  let html = '';
  if (parts[0].trim()) {
    html += renderSection('k-fuchsia', parts[0]);
  }
  for (let i = 1; i < parts.length; i += 2) {
    const cls = parts[i];
    const body = parts[i + 1] || '';
    html += renderSection(cls, body);
  }
  return html;
}

function renderSection(cls, mdBody) {
  const html = marked.parse(mdBody.trim());
  return `
<section class="block">
  <div class="container">
${html.split('\n').map(l => '    ' + l).join('\n')}
  </div>
</section>
`;
}

function fillTemplate(template, data, body) {
  const tldrHTML = renderTLDR(data.tldr);
  const kickerMeta = `${data.categorie || 'Article'} · ${data.numero || ''}`.trim().replace(/\s·\s$/, '');

  let html = template;

  // ---- HEAD ----
  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(data.titre_seo || `${data.titre} — par Jérémy Sagnier`)}</title>`);

  // Meta description
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttr(data.description)}">`);

  // ---- HERO (remplacement complet du contenu .container du hero) ----
  const h1Line1 = escapeHtml(data.hero_ligne_1 || data.titre);
  const h1Line2 = data.hero_ligne_2 ? `<br>${escapeHtml(data.hero_ligne_2)}` : '';
  const h1Line3 = data.hero_ligne_3 ? `<br><em>${escapeHtml(data.hero_ligne_3)}</em>` : '';

  const heroInner = `    <div class="kicker"><span class="dot"></span>${escapeHtml(kickerMeta)}</div>
    <h1>${h1Line1}${h1Line2}${h1Line3}</h1>
    <p class="hero-lead">
      ${escapeHtml(data.lead)}
    </p>
    <div class="hero-meta">
      <span class="hero-meta-item"><strong>${escapeHtml(data.duree)}</strong> de lecture</span>
      <span class="hero-meta-item"><strong>Niveau</strong> ${escapeHtml(data.niveau)}</span>
      <span class="hero-meta-item"><strong>Outils</strong> ${escapeHtml(data.outils || 'Claude')}</span>
    </div>`;

  html = html.replace(
    /(<section class="hero">\s*<div class="container">\s*)([\s\S]*?)(\s*<\/div>\s*<\/section>)/,
    `$1\n${heroInner}\n  $3`
  );

  // ---- TL;DR (remplace le bloc entier `<!-- TL;DR -->` ... fin de son container) ----
  // Le bloc suit le pattern : <!-- TL;DR --> <div class="container"><div class="tldr">...</div></div>
  html = html.replace(
    /<!-- TL;DR -->\s*<div class="container">\s*<div class="tldr">[\s\S]*?<\/div>\s*<\/div>/,
    tldrHTML
  );

  // ---- BODY : supprime toutes les sections block entre fin TL;DR et Final CTA, injecte nouveau body ----
  const bodyBlock = renderBody(body);
  // Utilise le marqueur `<!-- Final CTA -->` comme ancre stable
  // Stratégie : on capture toute la zone entre la fin du bloc TL;DR et "<!-- Final CTA -->",
  // puis on la remplace par notre bodyBlock.
  // La TL;DR est maintenant insérée (nouvelle), puis on remplace ce qui suit jusqu'à Final CTA.
  const bodyZoneRegex = /(<\/div>\s*<\/div>\s*)((?:<!--\s*[A-Za-zÀ-ÿ\d\s·.,\/]+?\s*-->\s*<section class="block">[\s\S]*?<\/section>\s*)+)(<!-- Final CTA -->)/;
  html = html.replace(bodyZoneRegex, `$1\n${bodyBlock}\n$3`);

  // Final CTA — adapter le titre
  html = html.replace(/<h2>Tu reçois mes <em class="fuchsia">prochains tutos\.<\/em><\/h2>/,
    `<h2>Tu veux <em class="fuchsia">les prochains ?</em></h2>`);

  return html;
}

async function updateSitemap(data) {
  const xml = await readFile(PATHS.sitemap, 'utf8');
  const articleUrl = `${SITE_URL}/articles/${data.slug}.html`;
  const lastmod = data.published;
  const priority = '0.8';

  if (xml.includes(`<loc>${articleUrl}</loc>`)) {
    // update lastmod
    const updated = xml.replace(
      new RegExp(`(<loc>${articleUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[\\s\\S]*?<lastmod>)[^<]+(</lastmod>)`),
      `$1${lastmod}$2`
    );
    await writeFile(PATHS.sitemap, updated, 'utf8');
    log.ok(`sitemap.xml — lastmod mis à jour (${lastmod})`);
  } else {
    const entry = `
  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    const updated = xml.replace('</urlset>', `${entry}</urlset>`);
    await writeFile(PATHS.sitemap, updated, 'utf8');
    log.ok(`sitemap.xml — nouvelle entrée ajoutée`);
  }
}

async function updateApprendre(data) {
  if (!data.parcours_etape) {
    log.info('Pas de parcours_etape défini → apprendre.html non modifié');
    return;
  }
  const etape = String(data.parcours_etape).padStart(2, '0');
  log.info(`parcours_etape=${etape} — MAJ manuelle de apprendre.html recommandée (ajout card dans #etape-${etape})`);
  log.info(`   Ajoute ce bloc dans la section #etape-${etape} de apprendre.html :`);
  console.log(`
  <a class="article-card c-teal" href="articles/${data.slug}.html">
    <div class="article-top">
      <span class="article-badge"><span class="pulse"></span>${data.categorie} · ${etape}.X</span>
      <span class="article-pill">${data.duree}</span>
    </div>
    <div class="article-middle">
      <h3 class="article-title">${data.hero_ligne_1}<br>${data.hero_ligne_2 || ''}${data.hero_ligne_3 ? '<br><em>' + data.hero_ligne_3 + '</em>' : ''}</h3>
      <div class="article-subtitle">— ${data.niveau}</div>
    </div>
    <div class="article-preview">
      <div class="article-preview-label">Ce que tu repars avec</div>
      <p class="article-preview-text">${data.description}</p>
    </div>
  </a>
  `);
}

async function publishOne(slug) {
  log.section(`📝 Publication : ${slug}`);

  const { data, content } = await readDraft(slug);
  const template = await readFile(PATHS.template, 'utf8');
  const html = fillTemplate(template, data, content);

  const outPath = path.join(PATHS.articles, `${data.slug}.html`);
  await writeFile(outPath, html, 'utf8');
  log.ok(`articles/${data.slug}.html généré (${Buffer.byteLength(html, 'utf8')} octets)`);

  await updateSitemap(data);
  await updateApprendre(data);

  log.section('✨ Terminé');
  log.info(`Ouvre : file://${outPath}`);
  log.info(`URL prod : ${SITE_URL}/articles/${data.slug}.html`);
  log.info(`Next step : git add . && git commit -m "Add article: ${data.slug}" && git push`);
  log.info(`Puis ping IndexNow : npm run indexnow ${SITE_URL}/articles/${data.slug}.html`);
}

async function publishAll() {
  const files = (await readdir(PATHS.drafts)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  log.section(`📚 Publication en batch (${files.length} draft${files.length > 1 ? 's' : ''})`);
  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    try {
      await publishOne(slug);
    } catch (e) {
      log.err(`Erreur sur ${slug} : ${e.message}`);
    }
  }
}

// --- CLI ---
const args = process.argv.slice(2);
if (args.length === 0) {
  log.err('Usage : npm run publish <slug>  OU  npm run publish:all');
  log.info(`Drafts disponibles dans ${PATHS.drafts} :`);
  try {
    const files = (await readdir(PATHS.drafts)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    if (files.length === 0) log.info('  (aucun)');
    else files.forEach(f => log.info(`  • ${f.replace(/\.md$/, '')}`));
  } catch {}
  process.exit(1);
}

try {
  if (args[0] === '--all') {
    await publishAll();
  } else {
    await publishOne(args[0]);
  }
} catch (e) {
  log.err(e.message);
  if (process.env.DEBUG) console.error(e.stack);
  process.exit(1);
}
