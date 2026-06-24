#!/usr/bin/env node
/**
 * publish-auto.mjs — publication complète d'un draft, sans intervention humaine.
 *
 * Enchaîne ce que `publish.js` ne couvre pas, pour une vraie auto-publication :
 *   1. node scripts/publish.js <slug>     → articles/<slug>.html + sitemap.xml + feed/articles.xml
 *   2. image OG : copie photos/og/default.jpg|webp → photos/og/<slug>.jpg|webp (visuel unique, décision actée)
 *   3. node scripts/blog/inject-card.mjs  → carte dans le listing articles.html
 *
 * Volontairement HORS périmètre (blast radius maîtrisé en non-supervisé) :
 *   - pas de re-maillage sitewide (articles:link/lexique:link réécrivent des dizaines de fichiers)
 *   - pas de modif index.html / apprendre.html (placements éditoriaux curés à la main)
 *
 * Usage : node scripts/blog/publish-auto.mjs <slug> [--type=A|B] [--date=YYYY-MM-DD]
 * Sortie : "PUBLISHED <url>" sur stdout, exit 0. Toute étape critique en échec → exit 1.
 */
import { spawnSync } from 'node:child_process';
import { copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const slug = args.find(a => !a.startsWith('--'));
const opt = (k, def) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : def; };
const TYPE = (opt('type', 'A') || 'A').toUpperCase();
const DATE = opt('date', new Date().toISOString().slice(0, 10));

if (!slug) { console.error('Usage : publish-auto.mjs <slug> [--type=A|B] [--date=…]'); process.exit(2); }

const run = (label, argv) => {
  const r = spawnSync('node', argv, { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) { console.error(`✗ ${label} a échoué (code ${r.status})`); process.exit(1); }
};

// 1) publication de base (article HTML + sitemap + RSS)
run('publish.js', ['scripts/publish.js', slug]);

// 2) image OG par défaut → copiée au nom du slug (le <meta og:image> pointe sur /photos/og/<slug>.jpg)
const og = path.join(ROOT, 'photos', 'og');
try {
  await access(path.join(og, 'default.jpg'));
  await copyFile(path.join(og, 'default.jpg'), path.join(og, `${slug}.jpg`));
  await copyFile(path.join(og, 'default.webp'), path.join(og, `${slug}.webp`)).catch(() => {});
  console.error(`✓ OG : default → ${slug}.jpg/.webp`);
} catch {
  console.error('⚠️ photos/og/default.jpg absente — aperçu social non généré (article OK quand même)');
}

// 3) carte dans le listing (idempotent)
run('inject-card.mjs', ['scripts/blog/inject-card.mjs', slug, `--type=${TYPE}`, `--date=${DATE}`]);

console.log(`PUBLISHED https://jerwis.fr/articles/${slug}`);
