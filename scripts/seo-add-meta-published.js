#!/usr/bin/env node
// Ajoute <meta property="article:published_time"> aux articles qui n'ont ni <time
// datetime> dans le body, ni cette meta dans le head. Source: datePublished JSON-LD.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ARTICLE_DIR = join(ROOT, 'articles');

function extractDate(html, field) {
  const scripts = html.match(/<script\s+type="application\/ld\+json">([\s\S]+?)<\/script>/g) || [];
  for (const script of scripts) {
    const m = script.match(new RegExp(`"${field}"\\s*:\\s*"(\\d{4}-\\d{2}-\\d{2})"`));
    if (m) return m[1];
  }
  return null;
}

const files = readdirSync(ARTICLE_DIR)
  .filter(n => n.endsWith('.html') && n !== '_TEMPLATE.html')
  .map(n => join(ARTICLE_DIR, n));

let ok = 0, skip = 0;
const report = [];

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const hasMetaPublished = /article:published_time/.test(html);
  const hasTime = /<time\s+datetime=/.test(html);

  if (hasMetaPublished || hasTime) {
    skip++;
    continue;
  }

  const datePublished = extractDate(html, 'datePublished');
  const dateModified = extractDate(html, 'dateModified');
  if (!datePublished) {
    skip++;
    report.push({ file: relative(ROOT, file), status: 'skip (pas de datePublished)' });
    continue;
  }

  const block = `<meta property="article:published_time" content="${datePublished}">` +
    (dateModified ? `\n<meta property="article:modified_time" content="${dateModified}">` : '');

  // Insertion après le canonical, ou avant </head>
  let updated;
  const canonical = html.match(/<link\s+rel="canonical"[^>]+>/);
  if (canonical) {
    updated = html.replace(canonical[0], canonical[0] + '\n\n' + block);
  } else {
    updated = html.replace(/<\/head>/, block + '\n</head>');
  }

  writeFileSync(file, updated, 'utf8');
  ok++;
  report.push({ file: relative(ROOT, file), status: `ok ${datePublished}` });
}

console.log(`\n=== article:published_time meta ===`);
for (const { file, status } of report) console.log(`  ${status.startsWith('ok') ? '✓' : '·'} ${file}  (${status})`);
console.log(`\n✓ ${ok} ajoutés · ${skip} déjà OK / ${files.length} articles`);
