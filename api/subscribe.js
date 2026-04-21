// Endpoint Vercel serverless pour inscrire un email à une audience Resend.
// Déploiement : Vercel → ajoute RESEND_API_KEY et RESEND_AUDIENCE_ID en env vars.
// Pas de fallback d'audience pour éviter toute fuite vers une audience tierce.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, source, firstName } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Email invalide" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "RESEND_API_KEY manquante dans les env vars Vercel" });
  }
  if (!audienceId) {
    return res
      .status(500)
      .json({ error: "RESEND_AUDIENCE_ID manquante dans les env vars Vercel" });
  }

  try {
    const resendRes = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          first_name: firstName || undefined,
          unsubscribed: false,
        }),
      }
    );

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      // Contact déjà existant = pas une erreur bloquante
      if (errText.includes("already exists") || resendRes.status === 409) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      return res
        .status(500)
        .json({ error: "Inscription échouée", details: errText });
    }

    const data = await resendRes.json();
    return res.status(200).json({ ok: true, contactId: data.id, source });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: String(err) });
  }
}
