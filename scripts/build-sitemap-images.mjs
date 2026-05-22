import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname || path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = 'https://jerwis.fr';

async function extractTitle(htmlPath) {
  try {
    const html = await fs.readFile(htmlPath, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      return titleMatch[1].replace(/\s*[·|—].*$/, '').trim();
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function main() {
  const entries = [];

  // Scan photos/og/ for article OGs
  const ogDir = path.join(ROOT, 'photos', 'og');
  const files = await fs.readdir(ogDir).catch(() => []);

  for (const file of files.filter(f => f.endsWith('.jpg'))) {
    const slug = file.replace('.jpg', '');
    let pageUrl = null;
    let title = null;

    // Try article first
    const articlePath = path.join(ROOT, 'articles', `${slug}.html`);
    try {
      title = await extractTitle(articlePath);
      if (title) {
        pageUrl = `${SITE}/articles/${slug}`;
      }
    } catch {
      // article not found, try root page
    }

    // If no article, try root page
    if (!pageUrl) {
      const rootPath = path.join(ROOT, `${slug}.html`);
      try {
        title = await extractTitle(rootPath);
        if (title) {
          pageUrl = `${SITE}/${slug}`;
        }
      } catch {
        // page not found either
      }
    }

    if (pageUrl && title) {
      entries.push({
        pageUrl,
        imageUrl: `${SITE}/photos/og/${file}`,
        title
      });
    }
  }

  // Build XML
  const urls = entries
    .map(
      e => `  <url>
    <loc>${e.pageUrl}</loc>
    <image:image>
      <image:loc>${e.imageUrl}</image:loc>
      <image:title>${escapeXml(e.title)}</image:title>
    </image:image>
  </url>`
    )
    .join('\n\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urls}

</urlset>
`;

  await fs.writeFile(path.join(ROOT, 'sitemap-images.xml'), xml, 'utf8');
  console.log(`Wrote sitemap-images.xml with ${entries.length} images`);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
