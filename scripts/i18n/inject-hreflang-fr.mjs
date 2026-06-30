/**
 * inject-hreflang-fr.mjs — prépare les pages FR pour le bilingue.
 * Pour chaque page FR <rel> dont l'équivalent en/<rel> EXISTE :
 *   - injecte hreflang (fr / en / x-default) dans le <head>
 *   - ajoute le <script src="/assets/lang-toggle.js" defer> (sélecteur de langue)
 * Idempotent. N'ajoute RIEN si l'EN n'existe pas encore (évite un hreflang cassé).
 *
 * Usage : node scripts/i18n/inject-hreflang-fr.mjs <rel> [<rel> ...]
 *   ex. node scripts/i18n/inject-hreflang-fr.mjs index.html articles/karpathy.html
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://jerwis.fr';
const cleanPath = (r) => (r === 'index.html' ? '' : r.replace(/\/index\.html$/, '/').replace(/\.html$/, ''));

const rels = process.argv.slice(2);
if (!rels.length) { console.error('Usage: node inject-hreflang-fr.mjs <rel> [<rel> ...]'); process.exit(2); }

let done = 0, noEn = 0, miss = 0;
for (const rel of rels) {
  if (!fs.existsSync(rel)) { console.error(`✗ FR introuvable: ${rel}`); miss++; continue; }
  if (!fs.existsSync(path.join('en', rel))) { console.log(`⏭ pas d'EN pour ${rel} → ignoré`); noEn++; continue; }

  let h = fs.readFileSync(rel, 'utf8');
  const before = h;
  const cp = cleanPath(rel);
  const frUrl = `${SITE}/${cp}`;
  const enUrl = `${SITE}/en/${cp}`;

  if (!/hreflang=/.test(h)) {
    const block = `\n<link rel="alternate" hreflang="fr" href="${frUrl}">\n<link rel="alternate" hreflang="en" href="${enUrl}">\n<link rel="alternate" hreflang="x-default" href="${frUrl}">`;
    if (/<link rel="canonical"[^>]*>/i.test(h)) h = h.replace(/(<link rel="canonical"[^>]*>)/i, `$1${block}`);
    else h = h.replace(/<\/head>/i, `${block}\n</head>`);
  }
  if (!/assets\/lang-toggle\.js/.test(h)) {
    h = h.replace(/<\/body>/i, '<script src="/assets/lang-toggle.js" defer></script>\n</body>');
  }

  if (h !== before) { fs.writeFileSync(rel, h); done++; console.log(`✓ ${rel}`); }
  else console.log(`= ${rel} (déjà à jour)`);
}
console.log(`\n${done} pages FR mises à jour · ${noEn} sans EN (ignorées) · ${miss} introuvables.`);
