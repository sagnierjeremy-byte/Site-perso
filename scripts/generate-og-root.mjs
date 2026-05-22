// Génère les OG images PNG (1200×630) pour les pages root via Puppeteer
// Usage : node scripts/generate-og-root.mjs
// Prérequis : un serveur HTTP local servant la racine du repo sur OG_HOST (defaut 127.0.0.1:8765)
import puppeteer from "puppeteer";
import { mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "photos/og");
const HOST = process.env.OG_HOST || "http://127.0.0.1:8765";

const SLUGS = [
  "lexique",
  "claude-code",
  "apprendre",
  "modeles-ia",
  "modeles-image-ia",
  "workflows",
  "podcast",
  "outils"
];

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

let ok = 0, fail = 0;
for (const slug of SLUGS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const url = `${HOST}/scripts/og-root.html?slug=${encodeURIComponent(slug)}`;
  try {
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 250));
    const out = resolve(OUT_DIR, `${slug}.png`);
    await page.screenshot({ path: out, type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log(`OK  ${slug}`);
    ok++;
  } catch (e) {
    console.error(`FAIL ${slug} :`, e.message);
    fail++;
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\nTotal : ${ok} OK / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
