#!/usr/bin/env node
/**
 * Upload (overwrite) le ZIP source du produit `workflow-genpics-team`
 * sur Vercel Blob sous la clé `releases/workflow-genpics-team-v1.0.zip`.
 *
 * Pré-requis :
 *   - BLOB_READ_WRITE_TOKEN défini dans process.env, ou dans un fichier
 *     .env / .env.local à la racine (chargé via dotenv).
 *
 * Usage :
 *   node scripts/upload-genpics-zip.js <chemin-absolu-du-zip>
 *
 * Le script overwrite le blob existant (allowOverwrite: true).
 */

import { put } from "@vercel/blob";
import { readFileSync, statSync } from "node:fs";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env.local" });
dotenvConfig({ path: ".env" });

const ZIP_BLOB_KEY = "releases/workflow-genpics-team-v1.0.zip";

const zipPath = process.argv[2];
if (!zipPath) {
  console.error("Usage : node scripts/upload-genpics-zip.js <chemin-absolu-du-zip>");
  process.exit(1);
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error(
    "BLOB_READ_WRITE_TOKEN absent. Fournis-le via process.env ou via dotenv."
  );
  console.error(
    "Astuce : depuis ~/Projets/jeremy-sagnier-site, lance d'abord 'npx vercel env pull .env.local' (auth Vercel requise) pour récupérer le token, puis relance ce script."
  );
  process.exit(1);
}

let stats;
try {
  stats = statSync(zipPath);
} catch (err) {
  console.error(`Impossible de lire ${zipPath} : ${err.message}`);
  process.exit(1);
}
console.log(
  `Upload de ${zipPath} (${(stats.size / 1024 / 1024).toFixed(2)} Mo) vers blob://${ZIP_BLOB_KEY}…`
);

const buffer = readFileSync(zipPath);

try {
  const blob = await put(ZIP_BLOB_KEY, buffer, {
    access: "public",
    token,
    contentType: "application/zip",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log("Upload OK.");
  console.log(`  URL publique : ${blob.url}`);
  console.log(`  Clé pathname : ${blob.pathname}`);
  console.log(
    `  L'endpoint /api/download-zip continue de lire 'releases/workflow-genpics-team-v1.0.zip' via 'get()' avec ton token, donc rien à changer côté code.`
  );
} catch (err) {
  console.error("Upload KO :", err?.message ?? err);
  process.exit(1);
}
