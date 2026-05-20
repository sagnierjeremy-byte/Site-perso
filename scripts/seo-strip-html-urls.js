#!/usr/bin/env node
// Patche tous les .html dans les URLs internes pour aligner avec vercel cleanUrls.
// Cible : href, og:url, twitter:url, JSON-LD (url/@id/mainEntityOfPage).
// Préserve : liens externes, ancres, query strings.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKIP_DIRS = new Set(['node_modules', '.git', 'audits', 'drafts', '_internal', 'photos', 'downloads', 'feed']);
const SKIP_FILES = new Set(['contact-sheet.html', 'classify-channels.html']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.html') && !SKIP_FILES.has(entry)) out.push(full);
  }
  return out;
}

const PATTERNS = [
  // href="https://jerwis.fr/X.html..." → drop .html
  {
    name: 'href absolu jerwis.fr',
    re: /href="(https:\/\/(?:www\.)?jerwis\.fr\/[^"]*?)\.html(["#?])/g,
    sub: 'href="$1$2',
  },
  // href="/X.html..." → drop .html
  {
    name: 'href absolu racine',
    re: /href="(\/[^"]*?)\.html(["#?])/g,
    sub: 'href="$1$2',
  },
  // href="X.html..." (relatif, pas http/mailto/tel/#/javascript)
  {
    name: 'href relatif',
    re: /href="(?!https?:|mailto:|tel:|#|javascript:|\/)([^"]+?)\.html(["#?])/g,
    sub: 'href="$1$2',
  },
  // og:url, twitter:url, msapplication-starturl, etc. dans des meta content=
  {
    name: 'meta content jerwis.fr',
    re: /content="(https:\/\/(?:www\.)?jerwis\.fr\/[^"]*?)\.html(["#?])/g,
    sub: 'content="$1$2',
  },
  // JSON-LD : "url": "https://jerwis.fr/X.html"
  {
    name: 'JSON-LD url jerwis.fr',
    re: /"(url|@id|mainEntityOfPage|item)":\s*"(https:\/\/(?:www\.)?jerwis\.fr\/[^"]*?)\.html(["#?])/g,
    sub: '"$1": "$2$3',
  },
];

const files = walk(ROOT);
let totalChanges = 0;
const fileReport = [];

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  let content = original;
  const changes = {};
  for (const { name, re, sub } of PATTERNS) {
    const before = content;
    content = content.replace(re, sub);
    if (before !== content) {
      // Compte les occurrences modifiées en re-runnant le pattern sur l'original
      const matches = (before.match(re) || []).length;
      changes[name] = matches;
    }
  }
  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    const rel = relative(ROOT, file);
    const sum = Object.values(changes).reduce((a, b) => a + b, 0);
    totalChanges += sum;
    fileReport.push({ file: rel, changes, sum });
  }
}

console.log(`\n✓ ${fileReport.length} fichiers modifiés · ${totalChanges} remplacements\n`);
for (const { file, sum, changes } of fileReport) {
  const detail = Object.entries(changes).map(([k, v]) => `${k}: ${v}`).join(', ');
  console.log(`  ${sum.toString().padStart(4)}  ${file}  (${detail})`);
}
