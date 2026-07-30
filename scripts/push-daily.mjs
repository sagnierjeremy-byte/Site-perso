#!/usr/bin/env node
/**
 * push-daily.mjs — notification push du résumé du jour vers la PWA /app.
 *
 * Appelé par .github/workflows/daily-news-summary.yml juste après la génération
 * de data/news-summary.json : une seule notification par jour, au moment où le
 * contenu vient d'être écrit.
 *
 * Env : VAPID_PRIVATE_KEY (secret) · VAPID_PUBLIC_KEY · PUSH_SUBSCRIPTION (JSON)
 *       VAPID_SUBJECT (optionnel, « mailto:… »)
 *
 * App perso mono-utilisateur → l'abonnement est un simple secret GitHub, pas une
 * base de données. Si l'abonnement expire (rotation d'endpoint par Apple/Google),
 * le script le dit explicitement : il suffit de rappuyer sur « Activer la notif »
 * dans l'app et de recoller la valeur.
 *
 * Sorties : 0 si non configuré (rien à faire) · 0 si envoyé · 1 si ÉCHEC réel
 * (l'étape du workflow est en continue-on-error : le résumé n'est jamais bloqué,
 * mais un échec reste visible au lieu de disparaître).
 *
 *   node scripts/push-daily.mjs --dry-run   → affiche le payload, n'envoie rien
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webpush from 'web-push';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUMMARY = path.join(ROOT, 'data', 'news-summary.json');
// Assez large pour que les 5 titres tiennent (l'OS tronque l'aperçu, mais le texte
// complet reste lisible en dépliant la notification). Borne de sécurité seulement.
const MAX_BODY = 520;

// Clé PUBLIQUE en dur : elle n'est pas secrète (elle est déjà dans app/app.js côté
// client) et surtout elle DOIT être identique de part et d'autre — un secret GitHub
// divergent produirait des envois rejetés difficiles à diagnostiquer.
// ⚠️ Si tu la changes, change-la AUSSI dans app/app.js (constante VAPID_PUBLIC).
const PUB_FALLBACK = 'BARW0J86y6KH6KLOgXJnwUqnJVBWostlStEgRIhZ76dMJAxVRcEy1mIyULzZlX2YmUme2jGcf78bXXX6N2Qhg7Y';

const priv = process.env.VAPID_PRIVATE_KEY;
const pub = process.env.VAPID_PUBLIC_KEY || PUB_FALLBACK;
const rawSub = process.env.PUSH_SUBSCRIPTION;

if (!priv || !rawSub) {
  const missing = [!priv && 'VAPID_PRIVATE_KEY', !rawSub && 'PUSH_SUBSCRIPTION']
    .filter(Boolean).join(', ');
  console.error(`[push] non configuré (${missing} absent) → aucune notification envoyée.`);
  process.exit(0);
}

let sub;
try {
  sub = JSON.parse(rawSub);
  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) throw new Error('champs endpoint/keys manquants');
} catch (e) {
  console.error(`[push] ✗ PUSH_SUBSCRIPTION illisible : ${e.message}`);
  console.error('[push]   → réactive les notifications dans /app et recolle la valeur du secret.');
  process.exit(1);
}

let summary;
try {
  summary = JSON.parse(await readFile(SUMMARY, 'utf8'));
} catch (e) {
  console.error(`[push] ✗ ${path.relative(ROOT, SUMMARY)} illisible : ${e.message}`);
  process.exit(1);
}

const items = Array.isArray(summary.items) ? summary.items : [];
if (!items.length) {
  console.error('[push] résumé vide → aucune notification.');
  process.exit(0);
}

// Corps : les titres, numérotés, tronqués proprement au dernier titre entier.
let body = '';
for (let i = 0; i < items.length; i++) {
  const line = `${i + 1}. ${items[i].title}`;
  if (body && (body + '\n' + line).length > MAX_BODY) break;
  body = body ? `${body}\n${line}` : line;
}

const payload = JSON.stringify({
  title: `◆ ${items.length} actus à retenir — ${summary.day_label || 'aujourd’hui'}`,
  body,
  tag: 'jerwis-digest',
  url: '/app',
});

if (process.argv.includes('--dry-run')) {
  console.error('[push] --dry-run : rien n’est envoyé. Payload qui partirait :');
  console.log(JSON.stringify(JSON.parse(payload), null, 2));
  process.exit(0);
}

webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:jeremy.sagnier@eurofiscalis.com', pub, priv);

try {
  const res = await webpush.sendNotification(sub, payload, { TTL: 6 * 3600 });
  console.error(`[push] ✓ notification envoyée (HTTP ${res.statusCode}) — ${items.length} actus, ${body.length} car.`);
} catch (e) {
  const code = e.statusCode;
  if (code === 404 || code === 410) {
    // le service push a révoqué l'endpoint : ce n'est pas un bug, mais il faut agir
    console.error(`[push] ✗ abonnement expiré (HTTP ${code}).`);
    console.error('[push]   → ouvre /app, appuie sur « Activer la notif du matin », recolle PUSH_SUBSCRIPTION.');
  } else {
    console.error(`[push] ✗ échec d’envoi (HTTP ${code || '?'}) : ${e.body || e.message}`);
  }
  process.exit(1);
}
