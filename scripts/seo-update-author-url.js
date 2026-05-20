#!/usr/bin/env node
// Met à jour les author.url et publisher.url des JSON-LD Person Jérémy Sagnier
// pour pointer vers la nouvelle page bio /jeremy-sagnier.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKIP_DIRS = new Set(['node_modules', '.git', 'audits', 'drafts', '_internal', 'photos', 'downloads', 'feed']);

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

// Pattern : @type Person + name Jérémy Sagnier + url root → url bio page
// Whitespace tolérant : matche les sauts de ligne et l'indentation variable
const PATTERNS = [
  {
    name: 'Person Jérémy url → /jeremy-sagnier',
    re: /("@type":\s*"Person",\s*"name":\s*"Jérémy Sagnier",\s*"url":\s*)"https:\/\/jerwis\.fr\/?"/g,
    sub: '$1"https://jerwis.fr/jeremy-sagnier"',
  },
];

const files = walk(ROOT);
let totalChanges = 0;
const fileReport = [];

for (const file of files) {
  // Skip la page bio elle-même
  if (file.endsWith('jeremy-sagnier.html')) continue;
  // Skip la home (l'@id Person reste sur la home pour le knowledge graph)
  if (file.endsWith('/index.html')) continue;

  const original = readFileSync(file, 'utf8');
  let content = original;
  const changes = {};
  for (const { name, re, sub } of PATTERNS) {
    const before = content;
    content = content.replace(re, sub);
    if (before !== content) {
      const matches = (before.match(re) || []).length;
      changes[name] = matches;
    }
  }
  if (content !== original) {
    writeFileSync(file, content, 'utf8');
    const rel = relative(ROOT, file);
    const sum = Object.values(changes).reduce((a, b) => a + b, 0);
    totalChanges += sum;
    fileReport.push({ file: rel, sum });
  }
}

console.log(`\n✓ ${fileReport.length} fichiers · ${totalChanges} author.url mis à jour\n`);
for (const { file, sum } of fileReport) {
  console.log(`  ${sum.toString().padStart(2)}  ${file}`);
}
