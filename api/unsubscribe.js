// Endpoint Vercel serverless pour désabonnement total + feedback par email + goodbye email au user.
// POST {email, reason, comment}
// 1. Supprime le contact de toutes les audiences connues
// 2. Envoie un email à Jérémy avec la raison + commentaire (feedback interne)
// 3. Envoie un email goodbye au user qui se désabonne (confirmation + ton Leo)

import fs from "node:fs";
import path from "node:path";

// Liste des audiences dont on retire le contact au désabonnement complet.
const AUDIENCE_IDS = [
  process.env.RESEND_AUDIENCE_ID,
  // Futur · ajouter d'autres audiences ici (cours, events, etc.)
].filter(Boolean);

const ADMIN_EMAIL = "sagnier.jeremy@gmail.com";
// Revert temporaire · repasse sur onboarding@resend.dev tant que jerwis.fr n'est pas Verified sur Resend
const FROM_EMAIL = "Jérémy Sagnier <onboarding@resend.dev>";

const REASON_LABELS = {
  "trop-emails": "Trop d'emails",
  "pas-interessant": "Contenu plus intéressant",
  "trop-technique": "Trop technique",
  "pas-assez-technique": "Pas assez technique",
  "ton-ne-colle-plus": "Ton qui ne correspond pas",
  "inscription-par-erreur": "Inscription par erreur",
  autre: "Autre raison",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, reason, comment } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Email invalide" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "RESEND_API_KEY manquante dans les env vars Vercel" });
  }
  if (AUDIENCE_IDS.length === 0) {
    return res
      .status(500)
      .json({ error: "Aucune audience configurée (RESEND_AUDIENCE_ID manquante)" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const removed = [];
  const errors = [];

  // 1. Supprimer de toutes les audiences
  for (const audienceId of AUDIENCE_IDS) {
    try {
      // Find contact
      const findRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(cleanEmail)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      if (findRes.status === 404) {
        removed.push({ audienceId, status: "not-in-audience" });
        continue;
      }
      if (!findRes.ok) {
        errors.push({ audienceId, stage: "find", status: findRes.status });
        continue;
      }
      const contact = await findRes.json();
      const contactId = contact?.data?.id || contact?.id;
      if (!contactId) {
        errors.push({ audienceId, stage: "no-id" });
        continue;
      }
      // Delete contact
      const delRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${contactId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      if (!delRes.ok) {
        errors.push({ audienceId, stage: "delete", status: delRes.status });
        continue;
      }
      removed.push({ audienceId, status: "deleted" });
    } catch (e) {
      errors.push({ audienceId, error: String(e) });
    }
  }

  // 2. Envoyer un email de feedback à Jérémy (best-effort · on ignore les erreurs pour ne pas bloquer le désabonnement)
  const reasonLabel = REASON_LABELS[reason] || reason || "(non renseignée)";
  const commentText = (comment && comment.trim()) || "(aucun)";
  const subject = `Désabonnement · ${cleanEmail}`;
  const text =
    `Un contact vient de se désabonner.\n\n` +
    `Email · ${cleanEmail}\n` +
    `Raison · ${reasonLabel}\n` +
    `Commentaire · ${commentText}\n\n` +
    `Audiences touchées · ${removed.map((r) => r.status).join(", ")}\n` +
    `Date · ${new Date().toISOString()}\n`;
  const html =
    `<h2>Désabonnement</h2>` +
    `<p><strong>Email</strong> · ${escapeHtml(cleanEmail)}</p>` +
    `<p><strong>Raison</strong> · ${escapeHtml(reasonLabel)}</p>` +
    `<p><strong>Commentaire</strong> · ${escapeHtml(commentText)}</p>` +
    `<p style="color:#888; font-size:12px;">Date · ${new Date().toISOString()}</p>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject,
        text,
        html,
      }),
    });
  } catch (e) {
    console.error("[unsubscribe] admin notif email failed:", e);
  }

  // 3. Envoyer le goodbye email au user (best-effort aussi)
  try {
    await sendGoodbyeEmail(apiKey, cleanEmail);
  } catch (e) {
    console.error("[unsubscribe] goodbye email failed:", e);
  }

  if (errors.length > 0 && removed.filter((r) => r.status === "deleted").length === 0) {
    return res.status(500).json({
      error: "Désabonnement échoué",
      details: errors,
    });
  }

  return res.status(200).json({ ok: true, removed, errors });
}

async function sendGoodbyeEmail(apiKey, email) {
  const templatePath = path.join(process.cwd(), "templates", "email-goodbye.html");
  let html;
  try {
    html = fs.readFileSync(templatePath, "utf8");
  } catch (e) {
    console.error("[unsubscribe] goodbye template read failed:", e);
    return;
  }
  html = html.replace(/\{\{email\}\}/g, encodeURIComponent(email));

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: "Désabonnement confirmé · bonne route",
      html,
    }),
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
