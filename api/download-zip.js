// Endpoint Vercel serverless · streame le ZIP source au client après vérification
// que la session Stripe associée est `paid`. Le ZIP vit en mode private sur
// Vercel Blob, donc on doit authentifier le download server-side.

import Stripe from "stripe";
import { get } from "@vercel/blob";

const ZIP_BLOB_KEY = "releases/workflow-genpics-team-v1.0.zip";
const ZIP_FILENAME = "workflow-genpics-team-v1.0.zip";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(405).send("Method not allowed");
  }

  const sessionId = req.query?.session;
  if (!sessionId || !String(sessionId).startsWith("cs_")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(400).send("Lien invalide. Vérifie l'URL ou contacte jeremy.sagnier@jerwis.fr.");
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[download-zip] STRIPE_SECRET_KEY manquante");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(503).send("Service indisponible");
  }

  const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });

  // Vérification que le paiement est bien `paid`
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.warn("[download-zip] session retrieve failed:", err.message);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(404).send("Session introuvable. Contacte jeremy.sagnier@jerwis.fr avec ton numéro de session.");
  }

  if (session.payment_status !== "paid") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(403).send("Cette session n'a pas encore été payée. Si tu viens de payer, attends 1 minute et recharge.");
  }

  // Récupère et streame le blob privé
  let result;
  try {
    result = await get(ZIP_BLOB_KEY, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (err) {
    console.error("[download-zip] blob get failed:", err.message);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(500).send("ZIP introuvable. Contacte le support.");
  }

  if (!result || result.statusCode !== 200 || !result.stream) {
    console.error("[download-zip] blob get unexpected:", result?.statusCode);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(500).send("ZIP indisponible. Contacte le support.");
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${ZIP_FILENAME}"`);
  if (result.blob?.size) res.setHeader("Content-Length", String(result.blob.size));
  res.setHeader("Cache-Control", "private, no-store");

  // Stream le contenu vers le client
  const reader = result.stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!res.write(value)) {
        await new Promise((resolve) => res.once("drain", resolve));
      }
    }
  } catch (err) {
    console.error("[download-zip] stream error:", err.message);
  } finally {
    reader.releaseLock();
    res.end();
  }
}
