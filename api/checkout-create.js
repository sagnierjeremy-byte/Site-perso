// Endpoint Vercel serverless · crée une Stripe Checkout Session pour la précommande
// du générateur de photos personal branding (39 € TTC, paiement unique).
// Retourne { url } pour redirection client-side.

import Stripe from "stripe";

const PRODUCT_AMOUNT_CENTS = 3900; // 39 € TTC fixe
const PRODUCT_CURRENCY = "eur";
const PRODUCT_NAME = "Générateur photos IA";
const PRODUCT_DESCRIPTION =
  "Livraison auto en 2 min · repo GitHub privé + ZIP · garantie remboursement 7 jours · achat unique sans abonnement.";

// Whitelist d'origines autorisées pour les redirects Stripe
// Empêche un attaquant de forger un Origin pour rediriger vers un domaine arbitraire
const ALLOWED_ORIGINS = new Set([
  "https://jerwis.fr",
  "https://www.jerwis.fr",
  "http://localhost:3000",
  "http://localhost:3001",
]);
const DEFAULT_ORIGIN = "https://jerwis.fr";

// Meta Conversions API · fire InitiateCheckout en server-side au moment du click CTA.
// Le pixel client fire déjà IC côté navigateur, mais sur iOS dans le webview Instagram
// (≈ 80% du trafic de l'ad) le pixel est bloqué par ATT ou par le consent banner.
// L'event server-side passe par-dessus ces limitations · Meta dédoublonne via event_id.
async function sendMetaCapiInitiateCheckout({ fbp, fbc, clientIp, userAgent, sourceUrl, eventId }) {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN || process.env.META_ADS_ACCESS_TOKEN;
  if (!pixelId || !token) return { ok: false, skipped: true };

  const payload = {
    data: [
      {
        event_name: "InitiateCheckout",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: {
          fbp,
          fbc,
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
        custom_data: {
          currency: "EUR",
          value: PRODUCT_AMOUNT_CENTS / 100,
          content_ids: ["workflow-genpics-team-v1"],
          content_type: "product",
          content_name: PRODUCT_NAME,
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
    return { ok: true, eventsReceived: j.events_received, fbtrace: j.fbtrace_id };
  } catch (err) {
    return { ok: false, detail: err?.message || String(err) };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!stripeKey || !publishableKey) {
    console.error("[checkout-create] STRIPE_SECRET_KEY ou STRIPE_PUBLISHABLE_KEY manquante");
    return res.status(503).json({ error: "Service indisponible" });
  }

  const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });
  const requestedOrigin = req.headers.origin;
  const origin = ALLOWED_ORIGINS.has(requestedOrigin) ? requestedOrigin : DEFAULT_ORIGIN;

  // Récupère les cookies fbp/fbc passés par le client (capturés depuis le pixel Meta
  // côté navigateur, transmis dans le body de la requête de checkout). Ils servent
  // au matching server-side dans Meta Conversions API (event Purchase, déclenché
  // depuis stripe-webhook après paiement confirmé). Optionnels · si absents, la
  // conversion remontera quand même côté Meta mais avec un matching moins précis.
  let fbp, fbc;
  try {
    const body = req.body || {};
    if (typeof body.fbp === "string" && body.fbp.length > 0 && body.fbp.length < 200) fbp = body.fbp;
    if (typeof body.fbc === "string" && body.fbc.length > 0 && body.fbc.length < 500) fbc = body.fbc;
  } catch {
    // ignore · les cookies sont best-effort
  }

  try {
    const metadata = { product: "workflow-genpics-team-v1" };
    if (fbp) metadata.fbp = fbp;
    if (fbc) metadata.fbc = fbc;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: PRODUCT_CURRENCY,
            unit_amount: PRODUCT_AMOUNT_CENTS,
            product_data: {
              name: PRODUCT_NAME,
              description: PRODUCT_DESCRIPTION,
            },
          },
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: "github_username",
          label: {
            type: "custom",
            custom: "GitHub username (optionnel)",
          },
          optional: true,
          type: "text",
        },
      ],
      return_url: `${origin}/precommande-merci.html?session={CHECKOUT_SESSION_ID}`,
      metadata,
    });

    // Fire InitiateCheckout en server-side · best-effort, ne bloque jamais Stripe.
    // event_id = Stripe session.id → dédoublonné avec le fbq client (qui devra envoyer
    // le même event_id côté browser pour matcher). À défaut de dédup, Meta gardera
    // les deux mais ne double-comptera pas si l'event_id matche.
    const clientIp = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || undefined;
    const userAgent = req.headers["user-agent"] || undefined;
    sendMetaCapiInitiateCheckout({
      fbp,
      fbc,
      clientIp,
      userAgent,
      sourceUrl: req.headers.referer || origin,
      eventId: session.id,
    })
      .then((r) => {
        if (!r.ok && !r.skipped) {
          console.warn("[checkout-create] Meta CAPI IC failed:", JSON.stringify(r));
        } else if (r.ok) {
          console.log(`[checkout-create] Meta CAPI IC OK · session=${session.id} fbtrace=${r.fbtrace}`);
        }
      })
      .catch((err) => console.warn("[checkout-create] Meta CAPI IC error:", err.message));

    return res.status(200).json({
      clientSecret: session.client_secret,
      publishableKey,
      checkoutEventId: session.id, // pour dédoublonnage côté pixel client
    });
  } catch (err) {
    console.error("[checkout-create] Stripe error:", err.type, err.message);
    return res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
}
