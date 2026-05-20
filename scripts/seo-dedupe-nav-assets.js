#!/usr/bin/env node
// Déduplique les inclusions nav-v2.css et nav-dropdown.js dans toutes les pages.
// Pour chaque page : garde la PREMIÈRE occurrence de chaque ressource, supprime les autres.
// Idempotent.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.superpowers',
  'audits', 'drafts', '_internal',
  'photos', 'downloads', 'feed',
  'templates', 'scripts',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

// Pattern : <link ... nav-v2.css ...> (toute ligne, n'importe quel src/query)
// On utilise des lookarounds simples : tag <link> complet OU <script> complet contenant le path
function dedupe(content, resourcePattern, tagPattern) {
  // tagPattern : regex qui capture une balise entière (incluant attributs, jusqu'au > final)
  // resourcePattern : regex pour identifier le path (ex: /nav-v2\.css/)
  const matches = [];
  let m;
  const re = new RegExp(tagPattern, 'gi');
  while ((m = re.exec(content)) !== null) {
    if (resourcePattern.test(m[0])) {
      matches.push({ index: m.index, length: m[0].length, content: m[0] });
    }
  }
  if (matches.length <= 1) return { content, removed: 0 };

  // On garde la première occurrence, on supprime les autres
  // On parcourt de droite à gauche pour ne pas invalider les indices
  let updated = content;
  for (let i = matches.length - 1; i >= 1; i--) {
    const { index, length } = matches[i];
    // Supprime la balise complète + le retour à la ligne suivant
    let end = index + length;
    if (updated[end] === '\n') end++;
    updated = updated.slice(0, index) + updated.slice(end);
  }
  return { content: updated, removed: matches.length - 1 };
}

const files = walk(ROOT);
let totalRemoved = 0;
const report = [];

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  let content = original;
  const ops = [];

  // Dédupe nav-v2.css (balises <link>)
  const r1 = dedupe(content, /nav-v2\.css/, /<link[^>]*>/);
  if (r1.removed > 0) {
    content = r1.content;
    ops.push(`-${r1.removed} nav-v2.css`);
  }

  // Dédupe nav-dropdown.js (balises <script>)
  const r2 = dedupe(content, /nav-dropdown\.js/, /<script[^>]*><\/script>|<script[^>]*\/>/);
  if (r2.removed > 0) {
    content = r2.content;
    ops.push(`-${r2.removed} nav-dropdown.js`);
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    const removed = r1.removed + r2.removed;
    totalRemoved += removed;
    report.push({ file: relative(ROOT, file), ops });
  }
}

console.log(`\n=== Dédup nav assets ===\n`);
console.log(`  ${report.length} fichiers patchés · ${totalRemoved} doublons supprimés\n`);
for (const { file, ops } of report) {
  console.log(`  · ${file}  [${ops.join(', ')}]`);
}
