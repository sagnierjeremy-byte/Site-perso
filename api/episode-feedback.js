// Endpoint feedback podcast Guerres d'IA — vote 👍/👎 + commentaire + suggestion ép 4
// Pas de stockage : tout est envoyé par email à l'admin via Resend (même pattern que /api/subscribe.js)

import { Resend } from 'resend';

const FROM_EMAIL = 'Jérémy Sagnier <jeremy@jerwis.fr>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'jeremy.sagnier@eurofiscalis.com';

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { kind, episode, vote, comment, source } = req.body || {};

  // 2 types de feedback : "vote" (sous épisode) ou "suggestion" (ép 4 global)
  if (kind !== 'vote' && kind !== 'suggestion') {
    return res.status(400).json({ error: 'kind must be "vote" or "suggestion"' });
  }

  if (kind === 'vote') {
    if (!episode) return res.status(400).json({ error: 'episode required for vote' });
    if (!vote && !comment) return res.status(400).json({ error: 'vote or comment required' });
    if (vote && vote !== 'up' && vote !== 'down') {
      return res.status(400).json({ error: 'vote must be "up" or "down"' });
    }
  }

  if (kind === 'suggestion') {
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'comment required for suggestion' });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY missing');
    return res.status(500).json({ error: 'Server config error' });
  }

  const resend = new Resend(apiKey);
  const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  let subject;
  let html;

  if (kind === 'vote') {
    const voteEmoji = vote === 'up' ? '👍' : (vote === 'down' ? '👎' : '💬');
    const voteLabel = vote === 'up' ? 'Aimé' : (vote === 'down' ? 'Pas aimé' : 'Commentaire seul');
    subject = `${voteEmoji} Podcast · ${episode} · ${voteLabel}`;
    html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 580px; padding: 24px;">
        <h2 style="margin: 0 0 16px; font-size: 18px;">Nouveau feedback podcast</h2>
        <p style="margin: 0 0 8px;"><strong>Épisode</strong> · ${escapeHtml(episode)}</p>
        ${vote ? `<p style="margin: 0 0 8px;"><strong>Vote</strong> · ${voteEmoji} ${voteLabel}</p>` : ''}
        ${comment ? `<p style="margin: 16px 0 6px;"><strong>Commentaire</strong> :</p>
          <blockquote style="margin: 0; padding: 12px 16px; background: #FBF7F0; border-left: 3px solid #EF426F; border-radius: 6px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(comment)}</blockquote>` : ''}
        <p style="margin: 24px 0 0; color: #6E6E6E; font-size: 12px;">
          Source · ${escapeHtml(source || 'guerres-d-ia-podcast')}<br>
          ${escapeHtml(now)}
        </p>
      </div>
    `;
  } else {
    // suggestion ép 4
    subject = `💡 Podcast · Suggestion sujet ép 4`;
    html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 580px; padding: 24px;">
        <h2 style="margin: 0 0 16px; font-size: 18px;">Suggestion sujet épisode 4</h2>
        <blockquote style="margin: 0; padding: 12px 16px; background: #FBF7F0; border-left: 3px solid #00B2A9; border-radius: 6px; white-space: pre-wrap; font-size: 14px;">${escapeHtml(comment)}</blockquote>
        <p style="margin: 24px 0 0; color: #6E6E6E; font-size: 12px;">
          Source · ${escapeHtml(source || 'guerres-d-ia-podcast')}<br>
          ${escapeHtml(now)}
        </p>
      </div>
    `;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend send error', err);
    return res.status(500).json({ error: 'Send failed' });
  }
}
