#!/usr/bin/env node
// Pour chaque article : extrait datePublished du JSON-LD, trouve la date affichée
// en français dans le HTML hors JSON-LD, et la wrappe en <time datetime="YYYY-MM-DD">.
// Idempotent : skip si <time datetime déjà présent.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ARTICLE_DIR = join(ROOT, 'articles');

const MONTHS = {
  '01': ['janvier'], '02': ['février', 'fevrier'], '03': ['mars'],
  '04': ['avril'],   '05': ['mai'],                '06': ['juin'],
  '07': ['juillet'], '08': ['août', 'aout'],       '09': ['septembre'],
  '10': ['octobre'], '11': ['novembre'],           '12': ['décembre', 'decembre'],
};

function extractDatePublished(html) {
  // Cherche datePublished dans tous les blocs JSON-LD
  const scripts = html.match(/<script\s+type="application\/ld\+json">([\s\S]+?)<\/script>/g) || [];
  for (const script of scripts) {
    const m = script.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (m) return m[1];
  }
  return null;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildDateRegex(isoDate) {
  // isoDate: "2026-05-13"
  const [year, mm, dd] = isoDate.split('-');
  const dayNum = parseInt(dd, 10).toString(); // "13" (sans 0 leading)
  const monthNames = MONTHS[mm] || [];
  if (monthNames.length === 0) return null;
  const monthAlt = monthNames.map(escapeRegex).join('|');
  // Match "13 mai 2026", "13 MAI 2026", "13 Mai 2026", avec espaces variables
  return new RegExp(`\\b(${dayNum})\\s+(${monthAlt})\\s+(${year})\\b`, 'i');
}

function wrapFirstMatchOutsideJsonLd(html, regex, isoDate) {
  // Trouve les positions des blocs <script type="application/ld+json"> à exclure
  const excludeRanges = [];
  const scriptRe = /<script\s+type="application\/ld\+json">[\s\S]+?<\/script>/g;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    excludeRanges.push([m.index, m.index + m[0].length]);
  }

  // Aussi exclure les <head>...meta tags...</head> ? Non, on veut wrapper dans body uniquement.
  // Plus simple : on cherche la première occurrence dans le body uniquement.
  const bodyStart = html.indexOf('<body');
  if (bodyStart === -1) return null;

  // Recherche la première occurrence dans le body, hors JSON-LD
  let searchFrom = bodyStart;
  while (true) {
    const slice = html.slice(searchFrom);
    const match = slice.match(regex);
    if (!match) return null;
    const absPos = searchFrom + match.index;
    const absEnd = absPos + match[0].length;

    // Vérifier qu'on est hors d'un range JSON-LD
    const inJsonLd = excludeRanges.some(([s, e]) => absPos >= s && absPos < e);
    if (!inJsonLd) {
      // Vérifier qu'on n'est pas dans un attribut HTML (entre " et > sans <)
      const before = html.slice(Math.max(0, absPos - 200), absPos);
      const lastLt = before.lastIndexOf('<');
      const lastGt = before.lastIndexOf('>');
      if (lastLt > lastGt) {
        // On est dans un attribut HTML, skip
        searchFrom = absEnd;
        continue;
      }

      // Wrap
      const original = match[0];
      const wrapped = `<time datetime="${isoDate}">${original}</time>`;
      return html.slice(0, absPos) + wrapped + html.slice(absEnd);
    }
    // Sinon, continuer après cette occurrence
    searchFrom = absEnd;
  }
}

const files = readdirSync(ARTICLE_DIR)
  .filter(n => n.endsWith('.html') && n !== '_TEMPLATE.html')
  .map(n => join(ARTICLE_DIR, n));

let okCount = 0;
let skipCount = 0;
const report = [];

for (const file of files) {
  const html = readFileSync(file, 'utf8');

  // Skip si déjà un <time datetime dans le body
  if (/<time\s+datetime=/.test(html)) {
    skipCount++;
    report.push({ file: relative(ROOT, file), status: 'skip (déjà time)' });
    continue;
  }

  const date = extractDatePublished(html);
  if (!date) {
    skipCount++;
    report.push({ file: relative(ROOT, file), status: 'skip (pas de datePublished)' });
    continue;
  }

  const regex = buildDateRegex(date);
  if (!regex) {
    skipCount++;
    report.push({ file: relative(ROOT, file), status: `skip (mois invalide ${date})` });
    continue;
  }

  const updated = wrapFirstMatchOutsideJsonLd(html, regex, date);
  if (!updated) {
    skipCount++;
    report.push({ file: relative(ROOT, file), status: `skip (pattern ${date} introuvable dans body)` });
    continue;
  }

  writeFileSync(file, updated, 'utf8');
  okCount++;
  report.push({ file: relative(ROOT, file), status: `ok ${date}` });
}

console.log(`\n=== Time datetime injection ===`);
for (const { file, status } of report) {
  console.log(`  ${status.startsWith('ok') ? '✓' : '·'} ${file}  (${status})`);
}
console.log(`\n✓ ${okCount} ok · ${skipCount} skip / ${files.length} articles`);
