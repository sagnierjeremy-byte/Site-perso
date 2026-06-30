/**
 * notify-publish.mjs — envoie une notif email à Jérémy quand un article est publié par l'autopilot.
 * Appelé par le workflow GitHub Actions UNIQUEMENT si status == 'published'.
 *
 * Usage : node scripts/blog/notify-publish.mjs <slug> <url>
 * Env   : RESEND_API_KEY (secret GitHub à ajouter) · NOTIFY_EMAIL (destinataire, optionnel)
 *
 * Best-effort : si la clé manque ou que l'envoi échoue, on log et on sort en 0
 * (une notif ratée ne doit JAMAIS faire échouer la publication).
 */
import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2] || '';
const url = process.argv[3] || (slug ? `https://jerwis.fr/articles/${slug}` : 'https://jerwis.fr/articles');

const FROM = 'Jerwis (blog auto) <jeremy@jerwis.fr>';
const TO = process.env.NOTIFY_EMAIL || 'jeremy.sagnier@jerwis.fr';
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('[notify] RESEND_API_KEY absente → notif email non envoyée (ajoute le secret GitHub pour activer).');
  process.exit(0);
}

// Récupère titre + description depuis l'article publié (pour un mail propre)
function meta() {
  try {
    const file = path.join(process.cwd(), 'articles', `${slug}.html`);
    const h = fs.readFileSync(file, 'utf8');
    const og = (h.match(/<meta property="og:title" content="([^"]*)"/) || [])[1];
    const title = (og || (h.match(/<title>([^<]*)<\/title>/) || [])[1] || slug)
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/ ·.*$/, '').trim();
    const desc = ((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '')
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
    return { title, desc };
  } catch {
    return { title: slug || 'Nouvel article', desc: '' };
  }
}

const { title, desc } = meta();
const today = new Date().toISOString().slice(0, 10);

const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#0A0A0A">
    <p style="font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:#00B2A9;margin:0 0 8px">📝 Blog auto · ${today}</p>
    <h1 style="font-size:22px;line-height:1.2;margin:0 0 6px">Nouvel article en ligne</h1>
    <p style="font-size:18px;font-weight:700;margin:14px 0 4px">${title}</p>
    ${desc ? `<p style="color:#555;font-size:14px;margin:0 0 18px">${desc}</p>` : ''}
    <p style="margin:18px 0"><a href="${url}" style="display:inline-block;background:#EF426F;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px">Lire l'article →</a></p>
    <p style="color:#888;font-size:12px;margin-top:24px">Publié automatiquement par le pilote de blog (gate qualité ≥ 56/70). Tu reçois ce mail parce que tu as demandé une notif à chaque publication.</p>
  </div>`;

const text = `Nouvel article publié : ${title}\n${desc ? desc + '\n' : ''}\n${url}\n\n(Publié automatiquement par le pilote de blog, ${today}.)`;

try {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [TO], subject: `📝 Nouvel article : ${title}`, html, text }),
  });
  if (!res.ok) {
    console.error('[notify] échec Resend:', res.status, await res.text());
    process.exit(0);
  }
  console.error(`[notify] ✓ email envoyé à ${TO} pour "${title}"`);
} catch (e) {
  console.error('[notify] erreur:', String(e));
  process.exit(0);
}
