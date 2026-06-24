#!/usr/bin/env node
/**
 * inject-card.mjs — insère la carte d'un article publié dans le listing articles.html
 * (tableau `const ALL_ARTICLES = [ … ]`, le plus récent en premier).
 *
 * publish.js NE touche PAS articles.html → ce script comble le trou pour l'auto-publication.
 * Idempotent : si le slug est déjà présent, ne fait rien.
 *
 * Usage : node scripts/blog/inject-card.mjs <slug> [--type=A|B] [--date=YYYY-MM-DD] [--dry-run]
 * Lit le frontmatter de drafts/<slug>.md (titre, description, duree, categorie).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// ── args ──
const args = process.argv.slice(2);
const slug = args.find(a => !a.startsWith('--'));
const opt = (k, def) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : def; };
const DRY = args.includes('--dry-run');
const TYPE = (opt('type', 'A') || 'A').toUpperCase(); // A = SEO, B = making-of
const DATE = opt('date', new Date().toISOString().slice(0, 10));

if (!slug) { console.error('Usage : inject-card.mjs <slug> [--type=A|B] [--date=…] [--dry-run]'); process.exit(2); }

// ── catégories valides du listing + scene par défaut ──
const VALID_CAT = new Set(['opinion', 'tuto', 'makingof', 'vulgarisation', 'podcast']);
const SCENE_BY_CAT = { tuto: 'desk', vulgarisation: 'minimal', makingof: 'office', opinion: 'corp', podcast: 'studio' };

// ── lecture du draft ──
const draftPath = path.join(ROOT, 'drafts', `${slug}.md`);
if (!existsSync(draftPath)) { console.error(`✗ draft introuvable : drafts/${slug}.md`); process.exit(1); }
const fm = matter(await readFile(draftPath, 'utf8')).data || {};

// ── dérivation des champs de carte ──
let cat = String(fm.categorie || '').toLowerCase();
if (!VALID_CAT.has(cat)) cat = TYPE === 'B' ? 'makingof' : 'vulgarisation';
const scene = SCENE_BY_CAT[cat] || 'minimal';

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();

let title = String(fm.titre || slug).trim().toUpperCase();
if (!/[.!?»]$/.test(title)) title += '.';

const excerpt = esc(fm.description || '');
const dureeRaw = String(fm.duree || '').match(/\d+/);
const read = dureeRaw ? `${dureeRaw[0]} MIN` : '8 MIN';

// ── carte au format exact du fichier ──
const card = `    { slug:'${slug}', type:'${cat}', title:"${esc(title)}", excerpt:"${excerpt}", date:'${DATE}', read:'${read}', scene:'${scene}', size:'m' },`;

// ── insertion ──
const file = path.join(ROOT, 'articles.html');
let html = await readFile(file, 'utf8');

if (new RegExp(`slug:'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`).test(html)) {
  console.log(`• déjà présent dans le listing : ${slug} (aucune insertion)`);
  process.exit(0);
}

const anchor = 'const ALL_ARTICLES = [';
const idx = html.indexOf(anchor);
if (idx === -1) { console.error('✗ ancre `const ALL_ARTICLES = [` introuvable dans articles.html'); process.exit(1); }
const insertAt = idx + anchor.length;
const updated = html.slice(0, insertAt) + '\n' + card + html.slice(insertAt);

if (DRY) {
  console.log('— DRY RUN — carte qui serait insérée en tête de ALL_ARTICLES :');
  console.log(card);
  process.exit(0);
}

await writeFile(file, updated, 'utf8');
console.log(`✓ carte insérée dans articles.html : ${slug} (${cat}/${scene})`);
