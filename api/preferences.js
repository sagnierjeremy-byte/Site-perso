// Endpoint Vercel serverless pour mettre à jour les préférences d'abonnement.
// POST {email, subscriptions: {segmentId: boolean}}
// Pour chaque segment · true = upsert contact dans audience, false = delete contact.

// Map segments → audiences Resend.
// Pour ajouter une newsletter · ajouter une ligne ici + ajouter l'env var RESEND_AUDIENCE_XXX sur Vercel.
const SEGMENTS = [
  { id: "ai-playbook", audienceId: process.env.RESEND_AUDIENCE_ID },
  // Futur · { id: "cours-semaine-1", audienceId: process.env.RESEND_AUDIENCE_COURS_ID },
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, subscriptions } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Email invalide" });
  }
  if (!subscriptions || typeof subscriptions !== "object") {
    return res.status(400).json({ error: "Subscriptions manquantes" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "RESEND_API_KEY manquante dans les env vars Vercel" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const errors = [];
  const updates = [];

  for (const seg of SEGMENTS) {
    if (!seg.audienceId) continue; // segment non configuré côté env vars
    const wantsSubscribed = Boolean(subscriptions[seg.id]);

    try {
      if (wantsSubscribed) {
        // Upsert contact (API Resend retourne 409 si existe déjà, traité comme success)
        const r = await fetch(
          `https://api.resend.com/audiences/${seg.audienceId}/contacts`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: cleanEmail, unsubscribed: false }),
          }
        );
        if (!r.ok && r.status !== 409) {
          const txt = await r.text();
          if (!txt.toLowerCase().includes("already exists")) {
            errors.push({ segment: seg.id, error: txt });
            continue;
          }
        }
        updates.push({ segment: seg.id, action: "subscribed" });
      } else {
        // Find contact, then delete
        const findRes = await fetch(
          `https://api.resend.com/audiences/${seg.audienceId}/contacts/${encodeURIComponent(
            cleanEmail
          )}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );
        if (findRes.status === 404) {
          // Pas inscrit, pas d'action
          updates.push({ segment: seg.id, action: "not-found" });
          continue;
        }
        if (!findRes.ok) {
          errors.push({ segment: seg.id, error: "find-failed " + findRes.status });
          continue;
        }
        const contact = await findRes.json();
        const contactId = contact?.data?.id || contact?.id;
        if (!contactId) {
          errors.push({ segment: seg.id, error: "no-contact-id" });
          continue;
        }
        const delRes = await fetch(
          `https://api.resend.com/audiences/${seg.audienceId}/contacts/${contactId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${apiKey}` },
          }
        );
        if (!delRes.ok) {
          errors.push({ segment: seg.id, error: "delete-failed " + delRes.status });
          continue;
        }
        updates.push({ segment: seg.id, action: "unsubscribed" });
      }
    } catch (e) {
      errors.push({ segment: seg.id, error: String(e) });
    }
  }

  if (errors.length > 0) {
    return res.status(500).json({
      error: "Certaines préférences n'ont pas pu être sauvées",
      details: errors,
      applied: updates,
    });
  }

  return res.status(200).json({ ok: true, applied: updates });
}
