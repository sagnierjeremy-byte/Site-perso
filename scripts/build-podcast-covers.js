// Génère les pochettes PNG 3000×3000 (+ resizes 512×512) depuis templates/podcast-cover.html
// Lit data/episodes.json, rend chaque cover via Puppeteer, sauvegarde dans podcast/covers/
// Usage : npm run podcast:covers

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { accentColorToCss } from './test-helpers.js';

const ROOT = process.cwd();
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'templates/podcast-cover.html'), 'utf8');
const EPISODES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/episodes.json'), 'utf8'));
const OUT_DIR = path.join(ROOT, 'podcast/covers');

fs.mkdirSync(OUT_DIR, { recursive: true });

function render(html, vars) {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
    html
  );
}

function splitTitle(title) {
  // Coupe le titre en 2 lignes équilibrées. Si 1 seul mot, on le laisse en ligne 2 avec "//"
  const words = title.split(' ');
  if (words.length === 1) return { line1: '', line2: title };
  if (words.length === 2) return { line1: words[0], line2: words[1] };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  };
}

function computeTitleSize(line1, line2) {
  const longest = Math.max(line1.length, line2.length);
  // 3000px de large, 360px de marge = 2640px de texte utilisable
  // JetBrains Mono 700 ~0.55em de width par char → size ≈ 2640 / (longest * 0.55)
  return Math.min(480, Math.floor(2640 / Math.max(4, longest) / 0.55));
}

async function renderCover(browser, htmlContent, outPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 3000, height: 3000, deviceScaleFactor: 1 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  // Attendre les fonts Google
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 3000, height: 3000 }, omitBackground: false });
  await page.close();
  console.log(`[covers] ✓ ${path.basename(outPath)}`);
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const covers = [
    {
      out: 'serie',
      accent: 'serie',
      label_tl: 'JERWIS PRODUCTIONS',
      label_tr: `S${String(EPISODES.series.season).padStart(2, '0')}`,
      title: EPISODES.series.title,
      subtitle: EPISODES.series.description_short,
    },
    ...EPISODES.episodes.map((ep) => ({
      out: `ep${ep.id}`,
      accent: ep.accent_color,
      label_tl: 'JERWIS PRODUCTIONS',
      label_tr: `ÉP. ${ep.id}`,
      title: ep.title,
      subtitle: ep.description_short,
    })),
  ];

  for (const cov of covers) {
    const { c1, c2, c3 } = accentColorToCss(cov.accent);
    const { line1, line2 } = splitTitle(cov.title);
    const titleSize = computeTitleSize(line1, line2);
    const html = render(TEMPLATE, {
      C1: c1,
      C2: c2,
      C3: c3,
      TITLE_SIZE: titleSize,
      LABEL_TOP_LEFT: cov.label_tl,
      LABEL_TOP_RIGHT: cov.label_tr,
      TITLE_LINE_1: line1,
      TITLE_LINE_2: line2,
      SUBTITLE: cov.subtitle,
    });

    const outPath3000 = path.join(OUT_DIR, `${cov.out}-3000.png`);
    await renderCover(browser, html, outPath3000);

    // Resize en 512×512 pour la page site
    await sharp(outPath3000)
      .resize(512, 512, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, `${cov.out}.png`));
    console.log(`[covers] ✓ ${cov.out}.png (512×512 resize)`);
  }

  await browser.close();
  console.log('[covers] Done.');
}

main().catch((err) => {
  console.error('[covers] FATAL:', err);
  process.exit(1);
});
