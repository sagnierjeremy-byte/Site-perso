// Endpoint Vercel serverless · crée une Stripe Checkout Session pour la précommande
// du générateur de photos personal branding (39 € TTC, paiement unique).
// Retourne { url } pour redirection client-side.

import Stripe from "stripe";

const PRODUCT_AMOUNT_CENTS = 3900; // 39 € TTC fixe
const PRODUCT_CURRENCY = "eur";
const PRODUCT_NAME = "workflow-genpics-team — code source";
const PRODUCT_DESCRIPTION =
  "Générateur de photos personal branding · code source complet, repo GitHub privé + ZIP. Précommande, livraison sous quelques semaines.";

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
  if (!stripeKey) {
    console.error("[checkout-create] STRIPE_SECRET_KEY manquante");
    return res.status(503).json({ error: "Service indisponible" });
  }

  const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });
  const requestedOrigin = req.headers.origin;
  const origin = ALLOWED_ORIGINS.has(requestedOrigin) ? requestedOrigin : DEFAULT_ORIGIN;

  try {
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${origin}/precommande-merci.html?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/precommande-photos-personal-branding.html`,
      metadata: { product: "workflow-genpics-team-v1" },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[checkout-create] Stripe error:", err.type || err.message);
    return res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
}
