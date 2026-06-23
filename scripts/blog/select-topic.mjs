#!/usr/bin/env node
/**
 * select-topic.mjs — choisit le prochain sujet à traiter par le pilote auto.
 *
 * Type A (mots-clés SEO) : pioche dans data/topic-queue.json le 'pending' de plus
 * haute priorité (puis le plus ancien). C'est ce que le cron utilise.
 *
 * Type B (making-of) : déclenché en local par Jérémy via
 *   node scripts/blog/run.mjs "making-of de <projet>" --type=B
 * (les CHANGELOG des autres repos ne sont pas accessibles dans le runner CI).
 *
 * Usage : node scripts/blog/select-topic.mjs            → affiche le JSON du sujet choisi
 *         node scripts/blog/select-topic.mjs --mark-done <id>  → passe un id à 'done'
 * Sortie : ligne JSON {id, topic, type, priority} sur stdout, ou exit 3 si file vide.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const QUEUE = path.join(ROOT, 'data', 'topic-queue.json');

const markDone = process.argv.includes('--mark-done') ? process.argv[process.argv.indexOf('--mark-done') + 1] : null;

const data = JSON.parse(await readFile(QUEUE, 'utf8'));

if (markDone) {
  const t = data.topics.find(x => x.id === markDone);
  if (t) { t.status = 'done'; t.published_at = new Date().toISOString().slice(0, 10); }
  await writeFile(QUEUE, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.error(`✓ ${markDone} → done`);
  process.exit(0);
}

const pending = data.topics.filter(t => t.status === 'pending');
if (!pending.length) {
  console.error('File vide : aucun sujet pending. Ajoute des sujets dans data/topic-queue.json.');
  process.exit(3);
}

// tri : priorité asc (1 d'abord), puis date d'ajout asc (le plus ancien d'abord)
pending.sort((a, b) => (a.priority - b.priority) || String(a.added).localeCompare(String(b.added)));
const chosen = pending[0];

console.error(`• Sujet choisi : [${chosen.id}] "${chosen.topic}" (Type ${chosen.type}, prio ${chosen.priority})`);
console.log(JSON.stringify({ id: chosen.id, topic: chosen.topic, type: chosen.type, priority: chosen.priority }));
