#!/usr/bin/env node
/**
 * make-app-icons.mjs — icônes de la PWA /app (news).
 *
 * Reprend l'identité du favicon.svg : carré noir, « J » en Archivo Black cream,
 * point fuchsia en haut à droite. Rendu via satori (pour avoir la vraie police)
 * puis resvg, comme carousel-render.mjs.
 *
 * Sortie : photos/app-icons/{icon-192,icon-512,icon-maskable-512,apple-touch-icon}.png
 * Idempotent — relancer écrase les fichiers.
 *
 *   node scripts/make-app-icons.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'photos', 'app-icons');

const INK = '#FBF7F0';
const BG = '#0A0A0A';
const FUCHSIA = '#EF426F';

/**
 * @param {number} size  côté du canvas
 * @param {boolean} maskable  true → contenu réduit dans la safe zone (cercle 80 %)
 *                            imposée par Android pour les icônes masquables
 */
function icon(size, maskable) {
  const scale = maskable ? 0.42 : 0.62;       // hauteur du « J » relative au canvas
  const dotSize = size * (maskable ? 0.11 : 0.14);
  const inset = maskable ? size * 0.2 : size * 0.13;

  return {
    type: 'div',
    props: {
      style: {
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: BG, position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Archivo Black',
              fontSize: size * scale,
              color: INK,
              lineHeight: 1,
              // léger décalage optique : le « J » d'Archivo Black penche à gauche
              transform: `translateX(${size * 0.02}px)`,
            },
            children: 'J',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: inset, right: inset,
              width: dotSize, height: dotSize,
              borderRadius: '50%',
              background: FUCHSIA,
            },
          },
        },
      ],
    },
  };
}

async function render(name, size, maskable = false) {
  const fontData = await readFile(path.join(ROOT, 'scripts', 'blog', 'fonts', 'ArchivoBlack.ttf'));
  const svg = await satori(icon(size, maskable), {
    width: size,
    height: size,
    fonts: [{ name: 'Archivo Black', data: fontData, weight: 900, style: 'normal' }],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  const file = path.join(OUT, name);
  await writeFile(file, png);
  console.log(`✓ ${path.relative(ROOT, file)}  (${size}×${size}${maskable ? ' maskable' : ''}, ${Math.round(png.length / 1024)} Ko)`);
}

await mkdir(OUT, { recursive: true });
await render('icon-192.png', 192);
await render('icon-512.png', 512);
await render('icon-maskable-512.png', 512, true);
await render('apple-touch-icon.png', 180);   // iOS applique lui-même l'arrondi
