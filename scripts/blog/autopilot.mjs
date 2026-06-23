#!/usr/bin/env node
/**
 * autopilot.mjs — Orchestrateur du cron (Phase 3, MODE 1 : brouillon + validation humaine).
 *
 * 1. Sélectionne le prochain sujet (data/topic-queue.json)
 * 2. Lance le pipeline : recherche → génération → gate (+ régénération)
 * 3. Laisse le draft dans drafts/, passe le sujet à 'in_review' (PAS 'done' : done = publié)
 * 4. Écrit un résumé machine dans /tmp/autopilot-status.txt pour le workflow GitHub Actions
 *
 * NE PUBLIE JAMAIS (pas de npm run publish). La publication = action humaine 1-clic.
 *
 * Usage (cron) : node scripts/blog/autopilot.mjs
 * Sortie : STATUS=<publishable|review|reject> SLUG=<slug> SCORE=<n/70> sur stdout.
 */

import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const node = (args) => spawnSync('node', args, { cwd: ROOT, encoding: 'utf8' });

// 1) Sélection
const sel = node(['scripts/blog/select-topic.mjs']);
process.stderr.write(sel.stderr || '');
if (sel.status === 3) { console.log('STATUS=empty'); process.exit(0); }  // file vide = rien à faire, pas une erreur
if (sel.status !== 0) { console.error('select-topic a échoué'); process.exit(1); }
const chosen = JSON.parse(sel.stdout.trim().split('\n').pop());
const { id: slug, topic, type } = chosen;

// 2) Pipeline complet (recherche → génération → gate → régén) via run.mjs
const num = String(Date.now()).slice(-2); // numéro indicatif
const run = spawnSync('node', ['scripts/blog/run.mjs', topic, `--type=${type}`, `--slug=${slug}`, `--num=${num}`],
  { cwd: ROOT, stdio: 'inherit' });

const draftPath = path.join(ROOT, 'drafts', `${slug}.md`);
const draftExists = existsSync(draftPath);
const passed = run.status === 0;

// 3) Met à jour la file : in_review si un draft a été produit (qu'il passe ou non,
//    car en mode 1 l'humain tranche). Si aucun draft → reste pending (réessayer plus tard).
if (draftExists) {
  const QUEUE = path.join(ROOT, 'data', 'topic-queue.json');
  const data = JSON.parse(await readFile(QUEUE, 'utf8'));
  const t = data.topics.find(x => x.id === slug);
  if (t) { t.status = 'in_review'; t.drafted_at = new Date().toISOString().slice(0, 10); t.gate_passed = passed; }
  await writeFile(QUEUE, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// 4) Statut machine
const status = !draftExists ? 'error' : (passed ? 'publishable' : 'review');
const summary = `STATUS=${status} SLUG=${slug} TYPE=${type}`;
console.log('\n' + summary);
await writeFile('/tmp/autopilot-status.txt', `${status}\n${slug}\n${type}\n${topic}\n`, 'utf8').catch(() => {});
process.exit(0);
