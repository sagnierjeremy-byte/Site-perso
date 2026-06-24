#!/usr/bin/env node
/**
 * make-default-og.mjs — génère l'image OG par défaut (charte FIESTA), sans navigateur.
 *
 * Sortie : photos/og/default.jpg (1200×630) + photos/og/default.webp
 * Utilisée comme aperçu social de tous les articles auto-publiés (décision : visuel unique).
 *
 * Usage : node scripts/blog/make-default-og.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const W = 1200, H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0A0A0A"/>
  <!-- halos colorés discrets -->
  <circle cx="1050" cy="120" r="260" fill="#EF426F" opacity="0.16"/>
  <circle cx="160"  cy="560" r="240" fill="#00B2A9" opacity="0.12"/>
  <!-- triple-stripe signature (teal → fuchsia → orange) -->
  <rect x="0"   y="0" width="400" height="16" fill="#00B2A9"/>
  <rect x="400" y="0" width="400" height="16" fill="#EF426F"/>
  <rect x="800" y="0" width="400" height="16" fill="#FF8200"/>

  <!-- kicker -->
  <text x="80" y="170" font-family="'JetBrains Mono','Courier New',monospace" font-size="30"
        letter-spacing="8" fill="#00B2A9" font-weight="700">JERWIS.FR — ARTICLES</text>

  <!-- titre -->
  <text x="76" y="312" font-family="'Archivo Black','Arial Black','Helvetica',sans-serif" font-size="104"
        fill="#FBF7F0" font-weight="900" letter-spacing="-3">L'IA, C'EST</text>
  <text x="76" y="426" font-family="'Archivo Black','Arial Black','Helvetica',sans-serif" font-size="104"
        fill="#FBF7F0" font-weight="900" letter-spacing="-3">AUSSI POUR <tspan fill="#EF426F">NOUS.</tspan></text>

  <!-- sous-titre -->
  <text x="80" y="520" font-family="'Archivo','Helvetica',sans-serif" font-size="34" fill="#FBF7F0" opacity="0.78">
    Comprendre et utiliser l'IA, sans être développeur.</text>

  <!-- triple-stripe basse -->
  <rect x="80"  y="556" width="120" height="10" fill="#00B2A9"/>
  <rect x="200" y="556" width="120" height="10" fill="#EF426F"/>
  <rect x="320" y="556" width="120" height="10" fill="#FF8200"/>
</svg>`;

const buf = Buffer.from(svg);
const out = path.join(ROOT, 'photos', 'og');
await sharp(buf).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(out, 'default.jpg'));
await sharp(buf).webp({ quality: 84 }).toFile(path.join(out, 'default.webp'));
console.log('✓ photos/og/default.jpg + default.webp générés');
