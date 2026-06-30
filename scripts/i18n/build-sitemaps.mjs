/**
 * build-sitemaps.mjs — génère sitemap-en.xml (pages EN existantes) + sitemap-index.xml.
 * La version FR reste dans sitemap.xml (maintenu par scripts/publish.js). Les images
 * restent dans sitemap-images.xml. robots.txt doit pointer sitemap-index.xml.
 *
 * Usage : node scripts/i18n/build-sitemaps.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://jerwis.fr';
const today = new Date().toISOString().slice(0, 10);

function walk(d) {
  let r = [];
  if (!fs.existsSync(d)) return r;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) r = r.concat(walk(p));
    else if (e.name.endsWith('.html') && e.name !== '_TEMPLATE.html') r.push(p);
  }
  return r;
}

// URL propre pour une page EN : en/articles/x.html → /en/articles/x ; en/index.html → /en/
function enUrl(file) {
  const rel = file.replace(/^en\//, '');
  const clean = rel === 'index.html' ? '' : rel.replace(/\.html$/, '');
  return clean === '' ? `${SITE}/en` : `${SITE}/en/${clean}`;
}

const enFiles = walk('en').sort();
const urls = enFiles.map(enUrl);

const enXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync('sitemap-en.xml', enXml);

const idxXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-en.xml</loc></sitemap>
  <sitemap><loc>${SITE}/sitemap-images.xml</loc></sitemap>
</sitemapindex>
`;
fs.writeFileSync('sitemap-index.xml', idxXml);

console.log(`✓ sitemap-en.xml (${urls.length} pages EN) + sitemap-index.xml générés`);
