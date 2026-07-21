#!/usr/bin/env node
/**
 * carousel-render.mjs — rend un carrousel LinkedIn jerwis (charte FIESTA) en PNG + PDF.
 * Pur Node (satori → SVG → resvg → PNG → pdf-lib) : aucun navigateur, compatible CI.
 *
 * Design validé par Jérémy le 21-07 (proto _preview-carousel-linkedin.html) :
 * fond noir fixe, Archivo Black uppercase serré, UN mot accentué par slide
 * (teal/fuchsia/orange en rotation), kickers JetBrains Mono, triple-stripe
 * teal→fuchsia→orange en pied, halo radial discret. 1080×1350.
 *
 * Usage : node scripts/blog/carousel-render.mjs <slides.json> <outdir>
 *   slides.json = { slug, slides: [{ kicker, type: 'hook'|'stat'|'idea'|'cta',
 *     lines: ["Quand elle", "ne sait pas,", "elle **devine**."], accent: 'teal'|'fuchsia'|'orange',
 *     sub, stat, badge, swipe }] }
 * Export : renderCarousel(data, outdir) → { pngs: [...], pdf }
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { PDFDocument } from 'pdf-lib';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = 1080, H = 1350;
const C = { fuchsia: '#EF426F', teal: '#00B2A9', orange: '#FF8200', ink: '#0A0A0A', cream: '#FBF7F0' };

let _fonts = null;
async function fonts() {
  if (_fonts) return _fonts;
  const f = async (n) => await readFile(path.join(__dirname, 'fonts', n));
  _fonts = [
    { name: 'Archivo Black', data: await f('ArchivoBlack.ttf'), weight: 400, style: 'normal' },
    { name: 'Archivo', data: await f('Archivo-400.ttf'), weight: 400, style: 'normal' },
    { name: 'Archivo', data: await f('Archivo-600.ttf'), weight: 600, style: 'normal' },
    { name: 'JetBrains Mono', data: await f('JetBrainsMono-700.ttf'), weight: 700, style: 'normal' },
  ];
  return _fonts;
}

const el = (type, style, children) => ({ type, props: { style, ...(children != null ? { children } : {}) } });

// "elle **devine**." → spans, segment accentué coloré.
// Espaces insécables UNIQUEMENT en multi-segments (satori mange les espaces en bordure
// de span) — sur une ligne simple ils empêcheraient le retour à la ligne de secours.
function lineSpans(line, accent) {
  const parts = String(line).split(/\*\*(.+?)\*\*/);
  const multi = parts.filter(Boolean).length > 1;
  return parts.map((p, i) => el('span', { color: i % 2 ? C[accent] : C.cream }, multi ? p.toUpperCase().replace(/ /g, ' ') : p.toUpperCase())).filter(s => s.props.children !== '');
}

function slideTree(s, i, total) {
  const accent = C[s.accent] || C.teal;
  const halos = [C.fuchsia, C.orange, C.teal];
  const kids = [];

  // halo radial discret (positions alternées)
  kids.push(el('div', {
    position: 'absolute', width: 900, height: 900, borderRadius: 450, opacity: 0.14, display: 'flex',
    ...(i % 2 ? { bottom: -280, left: -280 } : { top: -280, right: -280 }),
    backgroundImage: `radial-gradient(circle at 50% 50%, ${halos[i % 3]} 0%, rgba(10,10,10,0) 68%)`,
  }));

  // kicker
  kids.push(el('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.teal }, [
    el('span', {}, String(s.kicker || 'Jerwis').toUpperCase()),
    el('span', { color: 'rgba(251,247,240,0.45)', marginLeft: 18 }, `— 0${i + 1}/0${total}`),
  ]));

  // corps centré
  const mid = [];
  if (s.type === 'stat' && s.stat) {
    mid.push(el('div', { display: 'flex', fontFamily: 'Archivo Black', fontSize: 290, letterSpacing: -11, color: accent, lineHeight: 0.95 }, String(s.stat)));
  }
  if (s.lines?.length && s.type !== 'stat') {
    mid.push(el('div', { display: 'flex', flexDirection: 'column' },
      s.lines.map(l => el('div', { display: 'flex', flexWrap: 'wrap', fontFamily: 'Archivo Black', fontSize: 104, lineHeight: 1.06, letterSpacing: -3 }, lineSpans(l, s.accent)))));
  }
  if (s.badge) {
    mid.push(el('div', {
      display: 'flex', marginTop: 64, backgroundColor: C.fuchsia, color: C.cream, borderRadius: 14,
      fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 31, letterSpacing: 1, padding: '26px 34px', alignSelf: 'flex-start',
    }, s.badge));
  }
  if (s.sub) {
    mid.push(el('div', { display: 'flex', marginTop: 54, fontFamily: 'Archivo', fontWeight: 600, fontSize: 44, lineHeight: 1.4, color: 'rgba(251,247,240,0.82)', maxWidth: 830 }, s.sub));
  }
  kids.push(el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }, mid));

  // flèche de swipe
  if (s.type !== 'cta') {
    kids.push(el('div', { position: 'absolute', right: 84, bottom: 66, display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 34, letterSpacing: 4, color: 'rgba(251,247,240,0.85)' }, (s.swipe || '→').toUpperCase()));
  }

  // triple-stripe (ordre canonique immuable)
  kids.push(el('div', { position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, display: 'flex' }, [
    el('div', { flexGrow: 1, backgroundColor: C.teal, display: 'flex' }),
    el('div', { flexGrow: 1, backgroundColor: C.fuchsia, display: 'flex' }),
    el('div', { flexGrow: 1, backgroundColor: C.orange, display: 'flex' }),
  ]));

  return el('div', {
    width: W, height: H, display: 'flex', flexDirection: 'column', position: 'relative',
    backgroundColor: C.ink, padding: '90px 84px', overflow: 'hidden',
  }, kids);
}

export async function renderCarousel(data, outdir) {
  await mkdir(outdir, { recursive: true });
  // purge les slides d'un rendu précédent (un carrousel passé de 8 à 7 slides laisserait un PNG orphelin)
  const { readdir, unlink } = await import('node:fs/promises');
  for (const f of await readdir(outdir)) if (/^slide_\d+\.png$/.test(f)) await unlink(path.join(outdir, f));
  const total = data.slides.length;
  const pngs = [];
  for (let i = 0; i < total; i++) {
    const svg = await satori(slideTree(data.slides[i], i, total), { width: W, height: H, fonts: await fonts() });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
    const p = path.join(outdir, `slide_${i + 1}.png`);
    await writeFile(p, png);
    pngs.push(p);
  }
  const pdf = await PDFDocument.create();
  for (const p of pngs) {
    const img = await pdf.embedPng(await readFile(p));
    const page = pdf.addPage([W, H]);
    page.drawImage(img, { x: 0, y: 0, width: W, height: H });
  }
  const pdfPath = path.join(path.dirname(outdir), `${data.slug}.pdf`);
  await writeFile(pdfPath, await pdf.save());
  return { pngs, pdf: pdfPath };
}

// CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [jsonPath, outdir] = process.argv.slice(2);
  if (!jsonPath || !outdir) { console.error('Usage : carousel-render.mjs <slides.json> <outdir>'); process.exit(2); }
  const data = JSON.parse(await readFile(jsonPath, 'utf8'));
  const { pngs, pdf } = await renderCarousel(data, outdir);
  console.error(`✓ ${pngs.length} slides PNG + ${path.basename(pdf)}`);
  console.log(pdf);
}
