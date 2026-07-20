#!/usr/bin/env node
/**
 * scripts/migrate-handmade-extras.mjs — confort de lecture pour les 18 articles
 * "hand-made" volontairement exclus de scripts/migrate-article-design.mjs
 * (CSS custom trop divergent du _TEMPLATE.html pour un remplacement sûr).
 *
 * Approche additive et sans risque : injecte
 *   1. <link rel="stylesheet" href=".../assets/article-extras.css?v=20260720">
 *      juste après le </style> existant (ne remplace rien)
 *   2. <script src=".../assets/article-reading.js" defer></script> avant </body>
 * Idempotent. Ne touche PAS au <style> existant ni au corps (pas d'ancres,
 * pas de marquees insérées — ces articles ne sont pas re-générés par publish.js).
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const log = {
  ok:   (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`),
  info: (m) => console.log(`\x1b[36m•\x1b[0m ${m}`),
  warn: (m) => console.log(`\x1b[33m!\x1b[0m ${m}`),
};

const SLUGS = [
  'agents-ia-guide', 'autoresearch-karpathy', 'better-call-vs-associe',
  'booking-eurofiscalis-making-of', 'guerres-d-ia-podcast', 'hermes-agent',
  'jerwis-finance-tracker', 'karpathy', 'limova-vs-claude-code',
  'llm-local-pour-non-dev', 'llm-wiki-karpathy', 'open-source-pour-non-dev',
  'outil-vente-claude-code', 'photos-airbnb-nano-banana', 'podcast-ia-pour-enfants',
  'tuto-agent-contrats', 'tuto-agent-gmail', 'veille-pour-demain',
];

const extrasLink = (isEN) => `<link rel="stylesheet" href="${isEN ? '/assets' : '../assets'}/article-extras.css?v=20260720">`;
const readingJsTag = (isEN) => `<script src="${isEN ? '/assets' : '../assets'}/article-reading.js" defer></script>`;

async function migrateFile(filePath, isEN) {
  const rel = path.relative(ROOT, filePath);
  let html = await readFile(filePath, 'utf8');
  const original = html;
  const notes = [];

  if (!html.includes('article-extras.css')) {
    if (!html.includes('</style>')) return { rel, status: 'SKIP', reason: 'pas de </style> trouvé' };
    // insère après la DERNIÈRE occurrence de </style> (au cas où il y aurait plusieurs blocs style)
    const idx = html.lastIndexOf('</style>');
    html = html.slice(0, idx + 8) + `\n${extrasLink(isEN)}` + html.slice(idx + 8);
    notes.push('article-extras.css lié');
  }

  if (!html.includes('article-reading.js')) {
    if (!html.includes('</body>')) return { rel, status: 'SKIP', reason: 'pas de </body> trouvé' };
    html = html.replace('</body>', `${readingJsTag(isEN)}\n</body>`);
    notes.push('article-reading.js injecté');
  }

  if (html === original) return { rel, status: 'UP_TO_DATE' };
  await writeFile(filePath, html, 'utf8');
  return { rel, status: 'MIGRATED', notes };
}

async function main() {
  const results = [];
  for (const slug of SLUGS) {
    for (const { dir, isEN } of [{ dir: 'articles', isEN: false }, { dir: 'en/articles', isEN: true }]) {
      const filePath = path.join(ROOT, dir, `${slug}.html`);
      try {
        results.push(await migrateFile(filePath, isEN));
      } catch (e) {
        results.push({ rel: path.join(dir, `${slug}.html`), status: 'SKIP', reason: e.message });
      }
    }
  }

  const migrated = results.filter((r) => r.status === 'MIGRATED');
  const skipped = results.filter((r) => r.status === 'SKIP');
  const upToDate = results.filter((r) => r.status === 'UP_TO_DATE');

  console.log(`\n\x1b[1m✓ Migrés (${migrated.length})\x1b[0m`);
  for (const r of migrated) log.ok(`${r.rel} — ${r.notes.join(' · ')}`);
  console.log(`\n\x1b[1m○ Déjà à jour (${upToDate.length})\x1b[0m`);
  for (const r of upToDate) log.info(r.rel);
  console.log(`\n\x1b[1m⨯ Skippés (${skipped.length})\x1b[0m`);
  for (const r of skipped) log.warn(`${r.rel} — ${r.reason}`);
  console.log(`\n\x1b[1mRésumé\x1b[0m : ${results.length} traités · ${migrated.length} migrés · ${upToDate.length} déjà à jour · ${skipped.length} skippés`);
}

main();
