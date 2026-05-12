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

    return res.status(200).json({
      clientSecret: session.client_secret,
      publishableKey,
    });
  } catch (err) {
    console.error("[checkout-create] Stripe error:", err.type, err.message);
    return res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
}
