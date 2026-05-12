// Endpoint Vercel serverless · reçoit les webhooks Stripe.
// Traite uniquement `checkout.session.completed` pour livrer la précommande
// (invitation GitHub + URL ZIP + email Resend) + envoie l'event Purchase
// à Meta Conversions API (CAPI server-side, dédupliqué avec le pixel client
// via `event_id = session.id`).
// Idempotency via Vercel Blob `deliveries/{session.id}.json`.

import Stripe from "stripe";
import crypto from "node:crypto";
import { put, head } from "@vercel/blob";

// IMPORTANT : Vercel parse le body par défaut. Pour vérifier la signature
// Stripe, on a besoin du body brut. Désactiver le bodyParser ici.
export const config = {
  api: { bodyParser: false },
};

const FROM_EMAIL = "Jérémy Sagnier <jeremy@jerwis.fr>";

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function inviteGithubCollaborator(username) {
  if (!username) return { ok: true, skipped: true };
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
  if (r.status === 201 || r.status === 204) {
    return { ok: true, alreadyMember: r.status === 204 };
  }
  const detail = await r.text();
  return { ok: false, status: r.status, detail };
}

function buildZipDownloadUrl(sessionId, origin) {
  // Le store Blob est en mode `private` → on ne peut pas exposer une URL Blob
  // signée publiquement. À la place, on donne une URL vers notre route
  // `/api/download-zip?session=cs_xxx` qui vérifie le paiement Stripe puis
  // streame le ZIP server-side. URL stable, valide tant que le paiement reste.
  return `${origin}/api/download-zip?session=${encodeURIComponent(sessionId)}`;
}

async function sendDeliveryEmail({ to, sessionId, zipUrl, githubUsername, githubInviteOk, lateInviteUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const replyTo = process.env.RESEND_REPLYTO || "jeremy.sagnier@jerwis.fr";
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  const githubBlock = githubUsername && githubInviteOk
    ? `<div style="background:#f3f3f3;padding:18px 22px;border-radius:8px;margin:12px 0">
         <p style="margin:0 0 8px 0"><strong>2. Accepter l'invitation GitHub</strong></p>
         <p style="margin:0;font-size:14px">Tu as été invité au repo privé <code>${repo}</code>.</p>
         <p style="margin:8px 0 0 0"><a href="https://github.com/${owner}/${repo}/invitations" style="color:#ef426f;font-weight:600;text-decoration:none">→ Accepter sur GitHub</a></p>
       </div>`
    : `<div style="background:#fff8e0;padding:18px 22px;border-radius:8px;margin:12px 0;border:1px solid #f0c040">
         <p style="margin:0 0 8px 0"><strong>2. Donner ton GitHub username</strong></p>
         <p style="margin:0;font-size:14px">Tu n'as pas donné ton username GitHub au paiement. Donne-le ici pour rejoindre le repo privé :</p>
         <p style="margin:8px 0 0 0"><a href="${lateInviteUrl}" style="color:#ef426f;font-weight:600;text-decoration:none">→ Donner mon username</a></p>
       </div>`;

  const html = `<!doctype html>
<html><body style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:auto;padding:24px">
  <h1 style="font-size:26px;margin:0 0 12px 0">Merci pour ta précommande !</h1>
  <p style="color:#555">Commande <code>${sessionId}</code> · 39 € TTC · paiement unique</p>
  <h2 style="font-size:18px;margin:28px 0 12px 0">Ton accès</h2>
  <div style="background:#f3f3f3;padding:18px 22px;border-radius:8px;margin:12px 0">
    <p style="margin:0 0 8px 0"><strong>1. Télécharger le code source (ZIP)</strong></p>
    <p style="margin:0;font-size:14px">Lien valide 30 jours, dispo immédiatement.</p>
    <p style="margin:8px 0 0 0"><a href="${zipUrl}" style="display:inline-block;background:#ef426f;color:white;padding:10px 18px;border-radius:6px;font-weight:600;text-decoration:none">Télécharger le ZIP</a></p>
  </div>
  ${githubBlock}
  <h2 style="font-size:18px;margin:28px 0 12px 0">Pour démarrer en 15 minutes</h2>
  <ol style="font-size:14px;line-height:1.7">
    <li>Décompresse le ZIP</li>
    <li><strong>Deploy</strong> : pousse le repo sur ton GitHub puis « Import Project » sur Vercel (1 click, gratuit). Ou en local : <code>npm install</code> + <code>npm run dev</code> sur <code>localhost:3000</code></li>
    <li>Récupère tes clés sur <a href="https://fal.ai" style="color:#ef426f">fal.ai</a> + <a href="https://openrouter.ai" style="color:#ef426f">OpenRouter</a></li>
    <li>Ouvre l'app sur <code>/settings</code> · l'interface te guide pour coller les 3 clés (<code>FAL_KEY</code>, <code>OPENROUTER_API_KEY</code>, <code>ADMIN_TOKEN</code>) et te confirme en vert que tout marche</li>
  </ol>
  <h2 style="font-size:18px;margin:28px 0 12px 0">Tes coûts variables</h2>
  <ul style="font-size:14px;line-height:1.7">
    <li><strong>fal.ai</strong> : ~4 € pour 100 photos sur Seedream (par défaut), ~20 € sur FLUX Pro · <a href="https://fal.ai" style="color:#ef426f">créer un compte</a></li>
    <li><strong>OpenRouter</strong> : ~1 € pour 50 sessions · <a href="https://openrouter.ai" style="color:#ef426f">créer un compte</a></li>
  </ul>
  <p style="font-size:14px;color:#555;margin-top:32px;border-top:1px solid #ddd;padding-top:18px">
    <strong>Garantie remboursement 7 jours</strong> · si ça ne marche pas chez toi ou ne te convient pas, réponds à cet email, je rembourse les 39 € en 24h. Sans question.<br>
    Pour toute question, écris à <a href="mailto:${replyTo}" style="color:#ef426f">${replyTo}</a>.
  </p>
  <p style="font-size:12px;color:#999;margin-top:18px">— Jérémy Sagnier · jerwis.fr</p>
</body></html>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      reply_to: replyTo,
      subject: "Ton accès au générateur de photos personal branding",
      html,
    }),
  });
  if (!r.ok) {
    const detail = await r.text();
    return { ok: false, status: r.status, detail };
  }
  return { ok: true };
}

// ────────────────────────────────────────────────────────────────────
// Meta Conversions API · event Purchase server-side
// ────────────────────────────────────────────────────────────────────
// Hash SHA-256 lowercase trimmed (norme CAPI pour PII).
function sha256Lower(value) {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(String(value).trim().toLowerCase())
    .digest("hex");
}

async function sendMetaCapiPurchase({ session, sessionId, email, clientIp, userAgent, sourceUrl }) {
  const pixelId = process.env.META_PIXEL_ID;
  // Token CAPI dédié OU System User token avec permission ads_management
  const token = process.env.META_CAPI_TOKEN || process.env.META_ADS_ACCESS_TOKEN;

  if (!pixelId || !token) {
    return { ok: false, skipped: true, reason: "META_PIXEL_ID or META_CAPI_TOKEN missing" };
  }

  // Récupération des cookies fbp/fbc (passés via metadata depuis le client)
  const fbp = session.metadata?.fbp || undefined;
  const fbc = session.metadata?.fbc || undefined;

  // Montant facturé (en EUR, déduit du total Stripe)
  const valueEur = (session.amount_total ?? 3900) / 100;

  // EMQ enrichi · plus on push de user_data hashés, mieux Meta match (cible EMQ ≥ 8)
  const cd = session.customer_details || {};
  const addr = cd.address || {};
  const [firstName, ...rest] = (cd.name || "").trim().split(/\s+/);
  const lastName = rest.join(" ");
  const phoneE164 = cd.phone ? cd.phone.replace(/[^\d+]/g, "") : undefined;
  // external_id = Stripe customer.id si dispo, sinon fallback session.id (sha256 lowercase)
  const externalIdRaw = typeof session.customer === "string"
    ? session.customer
    : session.customer?.id || sessionId;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: sessionId, // dédup avec pixel client si jamais event aussi envoyé côté navigateur
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: {
          em: email ? [sha256Lower(email)] : undefined,
          fn: firstName ? [sha256Lower(firstName)] : undefined,
          ln: lastName ? [sha256Lower(lastName)] : undefined,
          ph: phoneE164 ? [sha256Lower(phoneE164)] : undefined,
          ct: addr.city ? [sha256Lower(addr.city)] : undefined,
          zp: addr.postal_code ? [sha256Lower(addr.postal_code)] : undefined,
          st: addr.state ? [sha256Lower(addr.state)] : undefined,
          country: addr.country ? [sha256Lower(addr.country)] : undefined,
          external_id: externalIdRaw ? [sha256Lower(externalIdRaw)] : undefined,
          fbp,
          fbc,
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
        custom_data: {
          currency: (session.currency || "eur").toUpperCase(),
          value: valueEur,
          content_ids: ["workflow-genpics-team-v1"],
          content_type: "product",
          content_name: "Personal Branding Studio — code source",
          num_items: 1,
        },
      },
    ],
  };

  try {
    const r = await fetch(`https://graph.facebook.com/v24.0/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await r.json();
    if (!r.ok) return { ok: false, status: r.status, detail: j };
    // j contient typiquement { events_received: 1, messages: [], fbtrace_id: "..." }
    return { ok: true, eventsReceived: j.events_received, fbtrace: j.fbtrace_id };
  } catch (err) {
    return { ok: false, detail: err?.message || String(err) };
  }
}

async function sendAlertEmail(subject, body) {
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail || !apiKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [alertEmail],
      subject: `[Générateur photos IA] ${subject}`,
      html: `<pre style="font-family:monospace;font-size:13px">${body}</pre>`,
    }),
  }).catch((err) => console.error("[stripe-webhook] alert email failed:", err.message));
}

async function sendSaleNotificationEmail({ session, sessionId, email, githubUsername, emailDeliveryOk, githubInviteOk }) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL || "jeremy.sagnier@jerwis.fr";
  if (!apiKey || !notifyEmail) return { ok: false, skipped: true };

  const cd = session.customer_details || {};
  const addr = cd.address || {};
  const amountEur = ((session.amount_total ?? 3900) / 100).toFixed(2);
  const currency = (session.currency || "eur").toUpperCase();
  const name = cd.name || "(nom non fourni)";
  const country = addr.country || "?";
  const city = addr.city || "?";
  const phone = cd.phone || "(non fourni)";
  const stripeUrl = `https://dashboard.stripe.com/payments/${sessionId}`;

  const statusLine = (label, ok) => `<li style="margin:4px 0">${ok ? "✅" : "❌"} ${label}</li>`;

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FBF7F0;padding:24px;color:#0A0A0A;line-height:1.5">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,.06)">
  <div style="display:inline-block;padding:6px 12px;background:#EF426F;color:#fff;font-weight:700;font-size:13px;border-radius:6px;margin-bottom:18px">💰 ${amountEur} ${currency}</div>
  <h1 style="margin:0 0 18px;font-size:24px;letter-spacing:-.02em">Nouvelle vente · Générateur photos IA</h1>

  <table style="width:100%;border-collapse:collapse;margin-bottom:22px">
    <tr><td style="padding:8px 0;color:#6E6E6E;font-size:13px;width:140px">Email</td><td style="padding:8px 0;font-weight:500"><a href="mailto:${email}" style="color:#EF426F">${email}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6E6E6E;font-size:13px">Nom</td><td style="padding:8px 0;font-weight:500">${name}</td></tr>
    <tr><td style="padding:8px 0;color:#6E6E6E;font-size:13px">Pays / Ville</td><td style="padding:8px 0;font-weight:500">${country} · ${city}</td></tr>
    <tr><td style="padding:8px 0;color:#6E6E6E;font-size:13px">Téléphone</td><td style="padding:8px 0;font-weight:500">${phone}</td></tr>
    <tr><td style="padding:8px 0;color:#6E6E6E;font-size:13px">GitHub</td><td style="padding:8px 0;font-weight:500">${githubUsername || "(non fourni)"}</td></tr>
    <tr><td style="padding:8px 0;color:#6E6E6E;font-size:13px">Session</td><td style="padding:8px 0;font-family:'JetBrains Mono',monospace;font-size:12px;color:#6E6E6E">${sessionId}</td></tr>
  </table>

  <div style="background:#F2EDE2;padding:14px 18px;border-radius:6px;margin-bottom:22px">
    <strong style="font-size:13px;color:#3A3A3A">Livraison automatique</strong>
    <ul style="list-style:none;padding:0;margin:8px 0 0;font-size:14px">
      ${statusLine("Email Resend envoyé (ZIP + invite)", emailDeliveryOk)}
      ${statusLine(`Invitation GitHub${githubUsername ? ` à ${githubUsername}` : ""}`, githubInviteOk)}
    </ul>
  </div>

  <a href="${stripeUrl}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px">Voir dans Stripe →</a>
</div>
</body></html>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [notifyEmail],
        subject: `💰 Vente Générateur photos IA · ${amountEur} ${currency} · ${email}`,
        html,
      }),
    });
    const j = await r.json();
    return { ok: r.ok, id: j.id, detail: r.ok ? undefined : j };
  } catch (err) {
    return { ok: false, detail: err?.message || String(err) };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error("[stripe-webhook] STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET manquant");
    return res.status(503).json({ error: "Service indisponible" });
  }

  const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });
  const signature = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature invalide:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Filtre · seul l'event checkout.session.completed nous intéresse
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const sessionId = session.id;
  const deliveryKey = `deliveries/${sessionId}.json`;

  // Idempotency : si on a déjà traité cette session, on ignore (Stripe peut retry)
  try {
    const existing = await head(deliveryKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (existing) {
      console.log(`[stripe-webhook] session ${sessionId} déjà livrée, skip`);
      return res.status(200).json({ received: true, alreadyDelivered: true });
    }
  } catch (err) {
    // 404 = pas encore livrée, on continue. Toute autre erreur = on log + continue
    if (!err.message?.includes("not found") && !err.message?.includes("404")) {
      console.warn("[stripe-webhook] head check failed:", err.message);
    }
  }

  // Extraction des données de session
  const email = session.customer_details?.email;
  const githubUsername = session.custom_fields?.find((f) => f.key === "github_username")?.text?.value || null;

  if (!email) {
    console.error(`[stripe-webhook] session ${sessionId} sans email`);
    await sendAlertEmail(`Session ${sessionId} sans email`, JSON.stringify(session, null, 2));
    return res.status(200).json({ received: true, error: "no email" });
  }

  // Livraison · 2 ops en parallèle (URL ZIP + invite GitHub)
  const origin = process.env.SITE_ORIGIN || "https://jerwis.fr";
  const lateInviteUrl = `${origin}/api/github-invite-late?session=${sessionId}`;

  // URL stable vers notre route auth (pas d'erreur possible · construction string)
  const zipUrl = buildZipDownloadUrl(sessionId, origin);

  // Invite GitHub en parallèle (ne bloque pas l'envoi email)
  const githubResult = await inviteGithubCollaborator(githubUsername).catch((err) => ({
    ok: false,
    detail: String(err?.message || err),
  }));
  const githubInviteOk = githubResult.ok === true;

  // Envoi email de livraison
  const emailResult = await sendDeliveryEmail({
    to: email,
    sessionId,
    zipUrl,
    githubUsername,
    githubInviteOk,
    lateInviteUrl,
  });

  if (!emailResult.ok) {
    console.error(`[stripe-webhook] email échoué pour ${email}:`, emailResult.detail);
    await sendAlertEmail(
      `Email livraison échoué pour ${email} (session ${sessionId})`,
      JSON.stringify(emailResult, null, 2)
    );
  }

  if (!githubInviteOk && githubUsername && !githubResult.skipped) {
    await sendAlertEmail(
      `GitHub invite échoué pour ${githubUsername} (session ${sessionId})`,
      JSON.stringify(githubResult, null, 2)
    );
  }

  // Notification admin · email à chaque vente réussie (best-effort, ne bloque pas)
  sendSaleNotificationEmail({
    session,
    sessionId,
    email,
    githubUsername,
    emailDeliveryOk: emailResult.ok,
    githubInviteOk,
  })
    .then((r) => {
      if (!r.ok && !r.skipped) {
        console.warn("[stripe-webhook] sale notification failed:", JSON.stringify(r));
      }
    })
    .catch((err) => console.warn("[stripe-webhook] sale notification error:", err.message));

  // Meta Conversions API · best-effort, ne bloque jamais la livraison.
  // Si les env vars META_PIXEL_ID + META_CAPI_TOKEN ne sont pas posées,
  // sendMetaCapiPurchase retourne `skipped: true` sans erreur.
  const clientIp = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || undefined;
  const userAgent = req.headers["user-agent"] || undefined;
  const capiResult = await sendMetaCapiPurchase({
    session,
    sessionId,
    email,
    clientIp,
    userAgent,
    sourceUrl: `${origin}/precommande-merci.html?session=${sessionId}`,
  }).catch((err) => ({ ok: false, detail: err?.message || String(err) }));

  if (!capiResult.ok && !capiResult.skipped) {
    console.warn("[stripe-webhook] Meta CAPI failed:", JSON.stringify(capiResult));
    // On alerte uniquement si l'event était attendu (env vars posées) mais a échoué
    await sendAlertEmail(
      `Meta CAPI Purchase échoué (session ${sessionId})`,
      JSON.stringify(capiResult, null, 2)
    );
  } else if (capiResult.ok) {
    console.log(`[stripe-webhook] Meta CAPI Purchase OK · session=${sessionId} fbtrace=${capiResult.fbtrace}`);
  }

  // Audit + idempotency : écrit le delivery log
  try {
    await put(
      deliveryKey,
      JSON.stringify({
        sessionId,
        email,
        githubUsername,
        ts: new Date().toISOString(),
        zipUrl,
        githubInviteOk,
        emailSentOk: emailResult.ok,
        capi: {
          ok: capiResult.ok,
          skipped: capiResult.skipped || false,
          fbtrace: capiResult.fbtrace || null,
        },
        errors: {
          github: githubInviteOk ? null : githubResult.detail || null,
          email: emailResult.ok ? null : emailResult.detail,
          capi: capiResult.ok || capiResult.skipped ? null : capiResult.detail || capiResult.reason,
        },
      }),
      { access: "private", contentType: "application/json", token: process.env.BLOB_READ_WRITE_TOKEN, allowOverwrite: true }
    );
  } catch (err) {
    console.error("[stripe-webhook] delivery log write failed:", err.message);
    await sendAlertEmail(
      `Delivery log non écrit pour session ${sessionId}`,
      `Erreur : ${err.message}\n\nLes ops ont été tentées : email=${emailResult.ok}, github=${githubInviteOk}`
    );
  }

  return res.status(200).json({
    received: true,
    sessionId,
    githubInviteOk,
    emailSentOk: emailResult.ok,
  });
}
