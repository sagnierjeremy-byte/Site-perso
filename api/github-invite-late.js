// Endpoint Vercel serverless · permet à un acheteur d'ajouter son username GitHub
// après le paiement (s'il ne l'a pas donné dans le custom field au checkout).
// Vérifie via la session Stripe que le paiement est bien `paid`.

import Stripe from "stripe";
import { put, head } from "@vercel/blob";

async function inviteGithubCollaborator(username) {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;
  const cleanUsername = String(username).trim().replace(/^@/, "");
  const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${encodeURIComponent(cleanUsername)}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ permission: "pull" }),
  });
  if (r.status === 201 || r.status === 204) return { ok: true };
  const detail = await r.text();
  return { ok: false, status: r.status, detail };
}

function renderPage({ title, body, status = 200 }) {
  return {
    status,
    body: `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:60px auto;padding:24px;color:#1a1a1a}
h1{font-size:28px;margin:0 0 16px 0}
p{font-size:16px;line-height:1.6;color:#555}
form{margin:24px 0;display:flex;gap:8px}
input{flex:1;padding:12px 14px;border:1px solid #ddd;border-radius:6px;font-size:15px}
button{padding:12px 22px;background:#ef426f;color:white;border:none;border-radius:6px;font-weight:600;font-size:15px;cursor:pointer}
.error{background:#fee;border:1px solid #f88;color:#a00;padding:14px;border-radius:6px;margin:18px 0}
.ok{background:#eef9e0;border:1px solid #5a5;color:#262;padding:14px;border-radius:6px;margin:18px 0}
.kicker{font-family:monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#999;margin-bottom:12px}
code{font-family:monospace;background:#f3f3f3;padding:2px 6px;border-radius:4px;font-size:14px}
a{color:#ef426f}</style></head>
<body>${body}</body></html>`,
  };
}

export default async function handler(req, res) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(503).send("<h1>Service indisponible</h1>");
  }
  const stripe = new Stripe(stripeKey);

  const sessionId = req.query?.session || req.body?.session;
  if (!sessionId || !String(sessionId).startsWith("cs_")) {
    const page = renderPage({
      title: "Lien invalide",
      body: `<div class="kicker">— Erreur</div><h1>Lien invalide</h1>
        <p>Le lien que tu as utilisé est invalide ou expiré. Contacte <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a> avec ton numéro de session Stripe.</p>`,
      status: 400,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(page.status).send(page.body);
  }

  // Vérification que le paiement est bien `paid`
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    const page = renderPage({
      title: "Session introuvable",
      body: `<div class="kicker">— Erreur</div><h1>Session introuvable</h1>
        <p>Stripe ne reconnaît pas cette session. Contacte le support.</p>`,
      status: 404,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(page.status).send(page.body);
  }

  if (session.payment_status !== "paid") {
    const page = renderPage({
      title: "Paiement non confirmé",
      body: `<div class="kicker">— Erreur</div><h1>Paiement non confirmé</h1>
        <p>Cette session n'a pas encore été payée. Si tu viens de payer, attends 1 minute et recharge cette page.</p>`,
      status: 403,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(page.status).send(page.body);
  }

  // Check si la livraison existe déjà avec un username
  const deliveryKey = `deliveries/${sessionId}.json`;
  let existing = null;
  try {
    const meta = await head(deliveryKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (meta?.url) {
      const r = await fetch(meta.url);
      if (r.ok) existing = await r.json();
    }
  } catch (err) {
    // 404 = on continue
  }

  if (existing?.githubUsername && existing?.githubInviteOk) {
    const page = renderPage({
      title: "Déjà invité",
      body: `<div class="kicker">— Déjà fait</div><h1>Déjà invité</h1>
        <p>Tu as déjà été invité au repo en tant que <code>${existing.githubUsername}</code>. Vérifie tes emails GitHub ou va sur <a href="https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/invitations">tes invitations GitHub</a>.</p>`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(page.body);
  }

  // GET = afficher le form
  if (req.method === "GET") {
    const page = renderPage({
      title: "Donne ton username GitHub",
      body: `<div class="kicker">— Précommande livraison</div><h1>Donne ton username GitHub</h1>
        <p>Pour qu'on t'invite au repo privé <code>${process.env.GITHUB_REPO_NAME}</code>, donne-nous ton username GitHub (le nom dans <code>github.com/TON_USERNAME</code>).</p>
        <form method="POST" action="/api/github-invite-late?session=${encodeURIComponent(sessionId)}">
          <input type="text" name="username" placeholder="ton-username-github" required autofocus>
          <button type="submit">M'inviter</button>
        </form>
        <p style="font-size:13px;color:#999">Le ZIP du code reste téléchargeable depuis le mail que tu as reçu. Cette étape est juste pour le repo GitHub.</p>`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(page.body);
  }

  // POST = traiter le form
  if (req.method === "POST") {
    const username = req.body?.username;
    if (!username || typeof username !== "string" || username.trim().length < 1) {
      const page = renderPage({
        title: "Username manquant",
        body: `<div class="error">Username manquant ou invalide.</div>
          <p><a href="/api/github-invite-late?session=${encodeURIComponent(sessionId)}">← Retour</a></p>`,
        status: 400,
      });
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(page.status).send(page.body);
    }

    const result = await inviteGithubCollaborator(username);

    // Update delivery log si possible
    if (existing) {
      try {
        await put(
          deliveryKey,
          JSON.stringify({
            ...existing,
            githubUsername: username.trim(),
            githubInviteOk: result.ok,
            githubInviteLateAt: new Date().toISOString(),
          }),
          { access: "public", contentType: "application/json", token: process.env.BLOB_READ_WRITE_TOKEN }
        );
      } catch (err) {
        console.error("[github-invite-late] delivery log update failed:", err.message);
      }
    }

    if (!result.ok) {
      const page = renderPage({
        title: "Échec invitation",
        body: `<div class="error">L'invitation a échoué (${result.status}). Détail : <code>${(result.detail || "?").slice(0, 200)}</code>.</div>
          <p>Vérifie que ton username GitHub est correct, ou écris à <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a>.</p>
          <p><a href="/api/github-invite-late?session=${encodeURIComponent(sessionId)}">← Réessayer</a></p>`,
      });
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(page.body);
    }

    const page = renderPage({
      title: "Invitation envoyée",
      body: `<div class="ok">Invitation envoyée à <code>${username}</code> !</div>
        <p>Vérifie tes <a href="https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/invitations">invitations GitHub</a> dans une minute.</p>
        <p>Si tu as une question, réponds au mail de livraison.</p>`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(page.body);
  }

  return res.status(405).send("Method not allowed");
}
