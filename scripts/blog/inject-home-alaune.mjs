#!/usr/bin/env node
/**
 * inject-home-alaune.mjs — ajoute un article à la section "À la une" de index.html.
 *
 * Insère une carte .alaune-card en TÊTE de .alaune-grid (le plus récent d'abord) et
 * garde au plus MAX cartes (retire les plus anciennes en fin de grille). Idempotent.
 * Lit drafts/<slug>.md (titre, description, duree, categorie, published).
 *
 * Usage : node scripts/blog/inject-home-alaune.mjs <slug> [--date=YYYY-MM-DD]
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAX = 8; // nombre de cartes gardées dans "À la une"
const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

const args = process.argv.slice(2);
const slug = args.find(a => !a.startsWith('--'));
const opt = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
if (!slug) { console.error('Usage : inject-home-alaune.mjs <slug> [--date=…]'); process.exit(2); }

const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const fm = matter(await readFile(path.join(ROOT, 'drafts', `${slug}.md`), 'utf8')).data || {};
const date = opt('date', fm.published || new Date().toISOString().slice(0, 10));
const [y, m, d] = date.split('-').map(Number);
const titre = String(fm.titre || slug).replace(/[.!?]+$/, '') + '.';
const punch = String(fm.description || '').trim();
const duree = (String(fm.duree || '').match(/\d+/) || ['8'])[0] + ' min';
const cat = fm.categorie || 'Décryptage';
const dd = String(d).padStart(2, '0'), mm = String(m).padStart(2, '0');

const card = `      <a class="alaune-card type-article" href="articles/${slug}" data-published="${date}">
        <div class="alaune-cover">
          <picture><source srcset="photos/og/${slug}.webp" type="image/webp"><img width="1200" height="630" src="photos/og/${slug}.jpg" alt="${esc(titre)}" loading="lazy"></picture>
        </div>
        <div class="alaune-stub">
          <span class="alaune-stub-type">${esc(cat)}</span>
          <span class="alaune-stub-num">${dd}/${mm}</span>
        </div>
        <div class="alaune-bar"></div>
        <div class="alaune-body">
          <h3 class="alaune-title">${esc(titre)}</h3>
          <p class="alaune-punch">${esc(punch)}</p>
          <div class="alaune-foot">
            <span class="alaune-date">${d} ${MONTHS[m - 1]} · ${duree}</span>
            <span class="alaune-cta">Lire →</span>
          </div>
        </div>
      </a>`;

const file = path.join(ROOT, 'index.html');
let h = await readFile(file, 'utf8');

if (new RegExp(`href="articles/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*data-published`).test(h)) {
  console.error(`• déjà dans "À la une" : ${slug} (aucune insertion)`);
  process.exit(0);
}

const anchor = '<div class="alaune-grid">\n';
if (!h.includes(anchor)) { console.error('✗ ancre .alaune-grid introuvable dans index.html'); process.exit(1); }
h = h.replace(anchor, anchor + '\n' + card + '\n');

// trim : garde les MAX premières cartes (les plus récentes, le neuf est en tête)
const cardRe = /\n? *<a class="alaune-card[\s\S]*?<\/a>\n?/g;
const matches = [...h.matchAll(cardRe)];
if (matches.length > MAX) {
  // supprime les cartes au-delà de MAX (de la dernière vers la MAX+1, pour ne pas décaler les index)
  for (let i = matches.length - 1; i >= MAX; i--) {
    h = h.slice(0, matches[i].index) + h.slice(matches[i].index + matches[i][0].length);
  }
  console.error(`  trim : ${matches.length} → ${MAX} cartes`);
}

await writeFile(file, h, 'utf8');
console.error(`✓ "À la une" : ${slug} ajouté en tête`);
