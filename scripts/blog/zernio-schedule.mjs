#!/usr/bin/env node
/**
 * zernio-schedule.mjs — programme un post LinkedIn (linkedin/<slug>.md) via l'API Zernio.
 *
 * Le post part avec son 1er commentaire (champ firstComment de Zernio) : le lien
 * jerwis.fr n'est JAMAIS dans le corps (l'algo LinkedIn coupe la portée de 40-50 %).
 *
 * Usage :
 *   node scripts/blog/zernio-schedule.mjs <slug> "<YYYY-MM-DDTHH:MM>" --account=<accountId>
 *   node scripts/blog/zernio-schedule.mjs <slug> tomorrow@08:30 --account=<accountId>  # J+1 (date Paris)
 *   node scripts/blog/zernio-schedule.mjs <slug> now --account=<accountId>   # publication immédiate
 *   … ajouter --dry-run pour voir le payload sans rien envoyer.
 *
 * Heure LOCALE Paris (le payload passe timezone: Europe/Paris à Zernio).
 * Clé : ZERNIO_API_KEY dans .env.local (sinon reprise de ~/Projets/content-factory/.env).
 */
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const [slug, when] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const opt = (k) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const DRY = process.argv.includes('--dry-run');
const accountId = opt('account');

if (!slug || !when || !accountId) {
  console.error('Usage : zernio-schedule.mjs <slug> "<YYYY-MM-DDTHH:MM>"|now --account=<accountId> [--dry-run]');
  process.exit(2);
}

function apiKey() {
  // 1) Variable d'environnement AVANT les fichiers : en CI (GitHub Actions) il n'existe
  //    ni .env.local ni le .env de content-factory, seul le secret est injecté en env.
  //    Sans ça, l'étape « programmation Zernio » du workflow échouait sur
  //    « ✗ ZERNIO_API_KEY introuvable » alors que le secret était bien passé — aucun
  //    post n'a donc été programmé automatiquement du 21-07 au 29-07 2026.
  if (process.env.ZERNIO_API_KEY?.trim()) {
    return process.env.ZERNIO_API_KEY.trim().replace(/^["']|["']$/g, '');
  }
  // 2) Sinon les fichiers locaux (usage en local, hors CI).
  for (const p of [path.join(ROOT, '.env.local'), path.join(os.homedir(), 'Projets', 'content-factory', '.env')]) {
    if (!existsSync(p)) continue;
    const m = readFileSync(p, 'utf8').match(/^ZERNIO_API_KEY=(.*)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  console.error('✗ ZERNIO_API_KEY introuvable (env, .env.local ici, ou .env de content-factory)');
  process.exit(1);
}

// tomorrow@HH:MM → date de demain en heure de Paris (le runner CI est en UTC)
let whenResolved = when;
const tm = when.match(/^tomorrow@(\d{2}:\d{2})$/);
if (tm) {
  const parisNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  parisNow.setDate(parisNow.getDate() + 1);
  const d = `${parisNow.getFullYear()}-${String(parisNow.getMonth() + 1).padStart(2, '0')}-${String(parisNow.getDate()).padStart(2, '0')}`;
  whenResolved = `${d}T${tm[1]}`;
}

const mdPath = path.join(ROOT, 'linkedin', `${slug}.md`);
if (!existsSync(mdPath)) { console.error(`✗ linkedin/${slug}.md introuvable`); process.exit(1); }
const raw = await readFile(mdPath, 'utf8');
const post = (raw.match(/## Post\n\n([\s\S]*?)\n\n## 1er commentaire/) || [])[1]?.trim();
const comment = (raw.match(/## 1er commentaire\n\n([\s\S]*?)\s*$/) || [])[1]?.trim();
if (!post || !comment) { console.error('✗ sections « ## Post » / « ## 1er commentaire » introuvables'); process.exit(1); }
if (/https?:\/\//.test(post)) { console.error('✗ lien détecté dans le corps du post — interdit, corrige le fichier'); process.exit(1); }

// Carrousel PDF : s'il existe, upload presign puis attache en mediaItems type "document"
// (vérifié le 21-07 : le PUT/POST accepte {type:'document', url} et LinkedIn le publie en carrousel).
let mediaItems = [];
const carPdf = path.join(ROOT, 'linkedin', 'carousels', `${slug}.pdf`);
if (existsSync(carPdf) && !DRY) {
  try {
    const key = apiKey();
    const pres = await (await fetch('https://zernio.com/api/v1/media/presign', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: `carrousel-${slug}.pdf`, contentType: 'application/pdf' }),
    })).json();
    if (!pres.uploadUrl) throw new Error(pres.error || 'presign sans uploadUrl');
    const buf = await readFile(carPdf);
    const up = await fetch(pres.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: buf });
    if (!up.ok) throw new Error(`upload ${up.status}`);
    mediaItems = [{ type: 'document', url: pres.publicUrl }];
    console.error(`  ✓ carrousel PDF uploadé (${Math.round(buf.length / 1024)} Ko) — sera attaché au post`);
  } catch (e) { console.error(`  ⚠ carrousel non attaché (${String(e.message).slice(0, 80)}) — le post part sans`); }
}

const payload = {
  content: post,
  ...(mediaItems.length ? { mediaItems } : {}),
  platforms: [{ platform: 'linkedin', accountId, platformSpecificData: { firstComment: comment } }],
  ...(whenResolved === 'now'
    ? { publishNow: true }
    : { scheduledFor: whenResolved.length === 16 ? `${whenResolved}:00` : whenResolved, timezone: 'Europe/Paris' }),
};

if (DRY) { console.log(JSON.stringify(payload, null, 2)); process.exit(0); }

const res = await fetch('https://zernio.com/api/v1/posts', {
  method: 'POST',
  headers: { Authorization: `Bearer ${apiKey()}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const body = await res.text();
if (!res.ok) { console.error(`✗ Zernio ${res.status} : ${body.slice(0, 400)}`); process.exit(1); }
console.log(`✓ "${slug}" ${whenResolved === 'now' ? 'publié' : `programmé pour ${whenResolved} (Europe/Paris)`} — 1er commentaire inclus`);
console.log(body.slice(0, 300));
