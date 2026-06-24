#!/usr/bin/env node
/**
 * publish-auto.mjs — publication complète d'un draft, sans intervention humaine.
 *
 * Enchaîne ce que `publish.js` ne couvre pas, pour une vraie auto-publication :
 *   1. node scripts/publish.js <slug>     → articles/<slug>.html + sitemap.xml + feed/articles.xml
 *   2. image OG : cover de la bibliothèque (pick par thème) recadrée → photos/og/<slug>.jpg|webp
 *   3. node scripts/blog/inject-card.mjs       → carte dans le listing articles.html
 *   4. node scripts/blog/inject-home-alaune.mjs → carte en tête de "À la une" (home), garde 8 max (non-bloquant)
 *
 * Volontairement HORS périmètre (blast radius maîtrisé en non-supervisé) :
 *   - pas de re-maillage sitewide (articles:link/lexique:link réécrivent des dizaines de fichiers)
 *   - pas de modif apprendre.html (placement éditorial curé à la main)
 *
 * Usage : node scripts/blog/publish-auto.mjs <slug> [--type=A|B] [--date=YYYY-MM-DD]
 * Sortie : "PUBLISHED <url>" sur stdout, exit 0. Toute étape critique en échec → exit 1.
 */
import { spawnSync } from 'node:child_process';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import matter from 'gray-matter';
import { pickCover } from './pick-cover.mjs';

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

// 2) image OG = cover de la bibliothèque (style rétro FIESTA) choisie par thème,
//    recadrée en 1200×630 → photos/og/<slug>.jpg|webp (le <meta og:image> y pointe).
const og = path.join(ROOT, 'photos', 'og');
const covers = path.join(ROOT, 'photos', 'covers');
try {
  let categorie = '', titre = '';
  try { const fm = matter(await readFile(path.join(ROOT, 'drafts', `${slug}.md`), 'utf8')).data || {}; categorie = fm.categorie || ''; titre = fm.titre || ''; } catch {}
  const theme = pickCover(slug, categorie, titre);
  let src = path.join(covers, `${theme}.jpg`);
  try { await access(src); } catch { src = path.join(covers, 'default.jpg'); }
  const buf = await sharp(src).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
  await sharp(buf).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(og, `${slug}.jpg`));
  await sharp(buf).webp({ quality: 82 }).toFile(path.join(og, `${slug}.webp`));
  console.error(`✓ OG : cover "${theme}" → ${slug}.jpg/.webp (1200×630)`);
} catch (e) {
  console.error(`⚠️ OG non générée (${e.message}) — article OK quand même`);
}

// 3) carte dans le listing (idempotent)
run('inject-card.mjs', ['scripts/blog/inject-card.mjs', slug, `--type=${TYPE}`, `--date=${DATE}`]);

// 4) "À la une" de la home (non-bloquant : si ça échoue, l'article reste publié)
{
  const r = spawnSync('node', ['scripts/blog/inject-home-alaune.mjs', slug, `--date=${DATE}`], { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) console.error('⚠️ "À la une" home non mise à jour (non bloquant)');
}

console.log(`PUBLISHED https://jerwis.fr/articles/${slug}`);
