// Convertit les PNG générés en JPG (1200×630, qual 88) + WebP (1600×840, qual 82)
// Usage : node scripts/convert-og-root.mjs
import sharp from "sharp";
import { unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OG_DIR = resolve(ROOT, "photos/og");

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

let ok = 0;
for (const slug of SLUGS) {
  const png = resolve(OG_DIR, `${slug}.png`);
  const jpg = resolve(OG_DIR, `${slug}.jpg`);
  const webp = resolve(OG_DIR, `${slug}.webp`);
  if (!existsSync(png)) {
    console.error(`MISS ${slug}.png`);
    continue;
  }
  await sharp(png).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toFile(jpg);
  await sharp(png).resize(1600, 840).webp({ quality: 82 }).toFile(webp);
  await unlink(png);
  console.log(`OK  ${slug}`);
  ok++;
}
console.log(`\nTotal : ${ok} converted`);
