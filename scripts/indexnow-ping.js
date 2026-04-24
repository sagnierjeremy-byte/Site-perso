#!/usr/bin/env node
// IndexNow ping pour Bing/Yandex : notifie instantanément les moteurs qu'une URL a été publiée/mise à jour.
// Usage :
//   node scripts/indexnow-ping.js                    → ping toutes les URLs du sitemap
//   node scripts/indexnow-ping.js https://jerwis.fr/articles/mon-article.html
//   node scripts/indexnow-ping.js --file urls.txt    → ping une liste d'URLs (une par ligne)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const HOST = "jerwis.fr";
const KEY = "76175249428d4264cf750e4158fdb5c9";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function getUrlsFromSitemap() {
  const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

function getUrlsFromFile(filePath) {
  return fs.readFileSync(filePath, "utf8").split("\n").map(s => s.trim()).filter(Boolean);
}

async function pingIndexNow(urls) {
  if (urls.length === 0) {
    console.error("Aucune URL à ping");
    process.exit(1);
  }
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  console.log(`Ping IndexNow : ${urls.length} URL(s)`);
  urls.slice(0, 5).forEach(u => console.log(`  - ${u}`));
  if (urls.length > 5) console.log(`  ... et ${urls.length - 5} autres`);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (res.status === 200 || res.status === 202) {
    console.log(`✓ OK (HTTP ${res.status}) — Bing/Yandex notifiés`);
  } else {
    const text = await res.text();
    console.error(`✗ Erreur HTTP ${res.status} : ${text}`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
let urls = [];

if (args.length === 0) {
  urls = getUrlsFromSitemap();
} else if (args[0] === "--file" && args[1]) {
  urls = getUrlsFromFile(args[1]);
} else {
  urls = args.filter(a => a.startsWith("http"));
}

pingIndexNow(urls);
