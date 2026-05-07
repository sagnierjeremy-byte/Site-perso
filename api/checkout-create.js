// Endpoint Vercel serverless · crée une Stripe Checkout Session pour la précommande
// du générateur de photos personal branding (99 € TTC, paiement unique).
// Retourne { url } pour redirection client-side.

import Stripe from "stripe";

const PRODUCT_AMOUNT_CENTS = 9900; // 99 € TTC fixe
const PRODUCT_CURRENCY = "eur";
const PRODUCT_NAME = "workflow-genpics-team — code source";
const PRODUCT_DESCRIPTION =
  "Générateur de photos personal branding · code source complet, repo GitHub privé + ZIP. Précommande, livraison sous quelques semaines.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[checkout-create] STRIPE_SECRET_KEY manquante");
    return res.status(503).json({ error: "Service indisponible" });
  }

  const stripe = new Stripe(stripeKey);
  const origin = req.headers.origin || "https://jerwis.fr";

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
            custom: "GitHub username (optionnel — pour invitation au repo privé)",
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
    console.error("[checkout-create] Stripe error:", err.message);
    return res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
}
