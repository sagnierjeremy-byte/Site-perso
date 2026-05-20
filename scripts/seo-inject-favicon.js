#!/usr/bin/env node
// Injecte le bloc favicon + theme-color dans le <head> de toutes les pages HTML.
// Insert juste avant <link rel="canonical"> si présent, sinon juste avant </head>.
// Idempotent : ne ré-injecte pas si déjà présent.

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

// Bloc à injecter (depuis articles/, doit utiliser /favicon.svg absolu — fonctionne car même domaine)
const SENTINEL = '<!-- Favicon set -->';
const BLOCK = `
<!-- Favicon set -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0A0A0A">
`;

const files = walk(ROOT);
let injected = 0;
let skipped = 0;

for (const file of files) {
  // Skip le template articles (placeholders)
  if (file.endsWith('_TEMPLATE.html')) { skipped++; continue; }

  const original = readFileSync(file, 'utf8');
  if (original.includes(SENTINEL)) { skipped++; continue; }

  let content;
  // Préférer l'insertion juste avant <link rel="canonical">
  const canonicalIdx = original.search(/<link\s+rel="canonical"/);
  if (canonicalIdx !== -1) {
    content = original.slice(0, canonicalIdx) + BLOCK.trimEnd() + '\n\n' + original.slice(canonicalIdx);
  } else {
    // Fallback : juste avant </head>
    const headIdx = original.search(/<\/head>/);
    if (headIdx === -1) { skipped++; continue; }
    content = original.slice(0, headIdx) + BLOCK.trimEnd() + '\n' + original.slice(headIdx);
  }

  writeFileSync(file, content, 'utf8');
  injected++;
}

console.log(`✓ ${injected} fichiers · ${skipped} skip (template ou déjà injecté)`);
