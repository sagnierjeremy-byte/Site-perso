/**
 * gen-en-page.mjs — normalisation déterministe d'une page EN.
 *
 * Flux : un agent traduit la page FR (texte uniquement, structure HTML préservée)
 * et écrit le résultat dans en/<rel>. Ce script fait ENSUITE toute la plomberie
 * mécanique (zéro créativité), pour que les agents n'aient pas à gérer les URLs,
 * le hreflang, les chemins, etc.
 *
 * Usage : node scripts/i18n/gen-en-page.mjs <rel>
 *   <rel> = chemin relatif à la racine, ex. "articles/karpathy.html", "index.html",
 *           "lexique/llm.html". Le fichier en/<rel> doit déjà exister (traduit).
 *
 * Fait, en place, sur en/<rel> :
 *   1. <html lang="en">  + og:locale en_US
 *   2. canonical + og:url  → URL /en/...
 *   3. réécrit href/src : liens de page internes → /en/... (absolu) ; assets → /assets|/photos|/data|... (absolu) ; externes/ancre/mailto inchangés
 *   4. réécrit les URLs internes du JSON-LD → /en/...
 *   5. injecte hreflang (fr / en / x-default) — idempotent
 *   6. valide : JSON-LD parse OK, 0 placeholder {{...}}, 0 lien de page non-/en/ résiduel
 *
 * Sort 0 si OK, 1 si une validation échoue (et n'écrit pas).
 */
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://jerwis.fr';
const ASSET_DIRS = ['assets', 'photos', 'data', 'downloads', 'fonts'];
const ASSET_EXT = /\.(css|js|mjs|jpe?g|png|webp|gif|svg|ico|pdf|xml|txt|zip|woff2?|ttf|json|mp3|mp4|webm|webmanifest)(\?[^"#]*)?(#[^"]*)?$/i;

const rel = process.argv[2];
if (!rel) { console.error('Usage: node gen-en-page.mjs <rel> (ex: articles/karpathy.html)'); process.exit(2); }
const enFile = path.join('en', rel);
if (!fs.existsSync(enFile)) { console.error(`✗ ${enFile} introuvable (l'agent doit l'écrire d'abord)`); process.exit(2); }

// URLs FR/EN propres (cleanUrls : sans .html ; index → racine)
function cleanPath(r) { return r === 'index.html' ? '' : r.replace(/\/index\.html$/, '/').replace(/\.html$/, ''); }
const cp = cleanPath(rel);
const frUrl = SITE + '/' + cp;
const enUrl = SITE + '/en/' + cp;

let h = fs.readFileSync(enFile, 'utf8');
const warn = [];

// 1. lang + locale
h = h.replace(/<html lang="fr"/i, '<html lang="en"');
h = h.replace(/(og:locale" content=")fr_FR(")/i, '$1en_US$2');

// 2. canonical + og:url
h = h.replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1${enUrl}$2`);
h = h.replace(/(<meta property="og:url" content=")[^"]*(")/i, `$1${enUrl}$2`);

// 3. réécriture href/src (hors JSON-LD : les attributs HTML)
// dossier de la page courante (pour résoudre les liens relatifs : "" pour la racine, "lexique", "articles"…)
const pageDir = (() => { const d = path.dirname(rel); return d === '.' ? '' : d; })();

// la page EN <resolved> existe-t-elle ? (fallback progressif : sinon on lie vers le FR)
function enExists(resolved) {
  const f = (resolved === '' || resolved === 'index') ? 'en/index.html' : 'en/' + resolved + '.html';
  return fs.existsSync(f);
}
// préfixe la cible en /en/ si la page EN existe, sinon en / (FR) — lancement progressif sans 404
function langPrefix(resolved, anchor) {
  if (resolved === '' || resolved === 'index') return enExists('') ? `/en/${anchor}` : `/${anchor}`;
  return enExists(resolved) ? `/en/${resolved}${anchor}` : `/${resolved}${anchor}`;
}

function rewriteAttr(url) {
  if (/^(mailto:|tel:|data:|javascript:)/i.test(url)) return url;
  if (/^#/.test(url)) return url; // ancre pure
  // lien absolu http(s)
  if (/^https?:/i.test(url)) {
    const m = url.match(/^https?:\/\/(www\.)?jerwis\.fr\/(.*)$/i);
    if (!m) return url; // externe
    let p = m[2].replace(/^en\//, '').split('#'); const anc = p[1] ? '#' + p[1] : '';
    let r = p[0].replace(/\.html$/, '').replace(/\/$/, '');
    return SITE + langPrefix(r, anc).replace(/^\//, '/'); // garde absolu
  }
  // asset (par extension ou dossier connu) → chemin absolu /assets|/photos|/data…
  const noDots = url.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '').replace(/^\/en\//, '/').replace(/^en\//, '');
  const isAsset = ASSET_EXT.test(noDots.split('#')[0]) || ASSET_DIRS.some(d => new RegExp(`(^|/)${d}/`).test(noDots));
  if (isAsset) return '/' + noDots.replace(/^\//, '');
  // lien de page interne → résolution (strip /en/ éventuel, relatif vs dossier de la page), puis /en/ ou /FR selon existence
  let anchor = ''; let u = url;
  const hi = u.indexOf('#'); if (hi >= 0) { anchor = u.slice(hi); u = u.slice(0, hi); }
  let resolved;
  if (u.startsWith('/')) {
    resolved = u.replace(/^\//, '').replace(/^en\//, '');
  } else {
    const stack = pageDir ? pageDir.split('/').filter(Boolean) : [];
    for (const part of u.split('/')) {
      if (part === '..') stack.pop();
      else if (part === '.' || part === '') continue;
      else stack.push(part);
    }
    resolved = stack.join('/');
  }
  resolved = resolved.replace(/\.html$/, '');
  return langPrefix(resolved, anchor);
}
h = h.replace(/\b(href|src)="([^"]*)"/g, (m, attr, url) => `${attr}="${rewriteAttr(url)}"`);
// srcset (images responsive)
h = h.replace(/\bsrcset="([^"]*)"/g, (m, val) => {
  const out = val.split(',').map(part => {
    const seg = part.trim().split(/\s+/);
    seg[0] = rewriteAttr(seg[0]);
    return seg.join(' ');
  }).join(', ');
  return `srcset="${out}"`;
});
// imagesrcset (preload)
h = h.replace(/\bimagesrcset="([^"]*)"/g, (m, val) => `imagesrcset="${val.split(',').map(p => { const s = p.trim().split(/\s+/); s[0] = rewriteAttr(s[0]); return s.join(' '); }).join(', ')}"`);

// 4. URLs internes du JSON-LD → /en/  (jerwis.fr/X → jerwis.fr/en/X, hors sameAs externes)
h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (m, json) => {
  const fixed = json.replace(/https:\/\/jerwis\.fr\/(?!en\/)([^"]*)/g, (mm, p) => `https://jerwis.fr/en/${p}`);
  return `<script type="application/ld+json">${fixed}</script>`;
});

// 5. hreflang (idempotent) — inséré juste après le canonical
if (!/hreflang=/.test(h)) {
  const block = `\n<link rel="alternate" hreflang="fr" href="${frUrl}">\n<link rel="alternate" hreflang="en" href="${enUrl}">\n<link rel="alternate" hreflang="x-default" href="${frUrl}">`;
  if (/<link rel="canonical"[^>]*>/i.test(h)) h = h.replace(/(<link rel="canonical"[^>]*>)/i, `$1${block}`);
  else h = h.replace(/<\/head>/i, `${block}\n</head>`);
}

// 5b. sélecteur de langue (idempotent)
if (!/assets\/lang-toggle\.js/.test(h)) {
  h = h.replace(/<\/body>/i, '<script src="/assets/lang-toggle.js" defer></script>\n</body>');
}

// 6. validation
// 6a JSON-LD parse
for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  try { JSON.parse(m[1]); } catch (e) { console.error(`✗ JSON-LD invalide dans ${enFile}: ${e.message}`); process.exit(1); }
}
// 6b placeholders
const ph = h.match(/\{\{[A-Z_]+\}\}/g);
if (ph) { console.error(`✗ placeholders résiduels: ${[...new Set(ph)].join(', ')}`); process.exit(1); }
// 6c info : liens en fallback FR (pages EN pas encore traduites) — VOULU (lancement progressif), pas une erreur
const frFallback = new Set();
for (const m of h.matchAll(/\bhref="(\/(?:articles|lexique|apprendre|outils|podcast|news|videos|workflows|modeles-ia|modeles-image-ia|modeles-ia-monde|github|claude-code|debutant|jeremy-sagnier|lexique-essentiels|mcp|agents-ia|quiz|presse|preferences|mentions-legales|cgv|politique-confidentialite|suppression-donnees)(?:\/[^"]*)?)"/g)) {
  if (!m[1].startsWith('/en/')) frFallback.add(m[1].split('#')[0]);
}

fs.writeFileSync(enFile, h);
console.log(`✓ ${enFile} → ${enUrl}` + (frFallback.size ? ` · ${frFallback.size} liens fallback FR (pages EN à venir)` : ''));
if (warn.length) { console.log('  ⚠️ ' + warn.join('\n  ⚠️ ')); }
