// Agrégateur RSS public — fetch les flux directement, sans base de données.
// Cache Vercel Edge 30 min pour ne pas marteler les sources à chaque visite.

import { XMLParser } from 'fast-xml-parser';

const FEEDS = [
  // ── IA & Tech ──────────────────────────────────────────────────────────────
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch', category: 'IA' },
  { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat', category: 'IA' },
  { url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', name: 'The Verge', category: 'IA' },
  { url: 'https://www.wired.com/feed/category/artificial-intelligence/latest/rss', name: 'Wired', category: 'IA' },
  { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'Ars Technica', category: 'IA' },
  // ── Business & Startups ───────────────────────────────────────────────────
  { url: 'https://hbr.org/feed', name: 'Harvard Business Review', category: 'Business' },
  { url: 'https://www.inc.com/rss.xml', name: 'Inc Magazine', category: 'Business' },
  { url: 'https://www.fastcompany.com/latest/rss/feed', name: 'Fast Company', category: 'Business' },
  { url: 'https://www.maddyness.com/feed/', name: 'Maddyness', category: 'Business' },
  // ── Tech francophone ──────────────────────────────────────────────────────
  { url: 'https://www.usine-digitale.fr/rss/', name: "L'Usine Digitale", category: 'IA' },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
});

const UA = 'Mozilla/5.0 (compatible; Jerwis-Veille/1.0; +https://jerwis.fr)';
const TIMEOUT_MS = 8_000;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const results = await Promise.allSettled(FEEDS.map(fetchAndParse));

  const articles = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 60);

  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300');
  return res.status(200).json(articles);
}

async function fetchAndParse(feed) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(feed.url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/atom+xml, */*' },
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseXml(xml, feed.name, feed.category);
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

function parseXml(xml, sourceName, category) {
  let doc;
  try { doc = parser.parse(xml); } catch { return []; }

  // RSS 2.0
  const rss = doc.rss;
  if (rss?.channel?.item) {
    const items = Array.isArray(rss.channel.item) ? rss.channel.item : [rss.channel.item];
    return items.map((i) => rssItem(i, sourceName, category)).filter(Boolean);
  }

  // Atom
  const feed = doc.feed;
  if (feed?.entry) {
    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
    return entries.map((e) => atomEntry(e, sourceName, category)).filter(Boolean);
  }

  return [];
}

function rssItem(item, sourceName, category) {
  const title = str(item.title);
  const url = str(item.link) || str(item.guid);
  if (!title || !url || !url.startsWith('http')) return null;
  return {
    title,
    url,
    sourceName,
    category,
    excerpt: item.description ? stripHtml(str(item.description)).slice(0, 300) : null,
    publishedAt: item.pubDate ? new Date(str(item.pubDate)).toISOString() : null,
    image: extractImage(item),
  };
}

function atomEntry(entry, sourceName, category) {
  const title = str(entry.title);
  let url = '';
  const link = entry.link;
  if (Array.isArray(link)) {
    const alt = link.find((l) => !l['@_rel'] || l['@_rel'] === 'alternate');
    url = alt?.['@_href'] ?? link[0]?.['@_href'] ?? '';
  } else if (link && typeof link === 'object') {
    url = link['@_href'] ?? '';
  } else {
    url = str(link);
  }
  if (!title || !url || !url.startsWith('http')) return null;
  const rawExcerpt = entry.summary ?? entry.content ?? entry['content:encoded'];
  return {
    title,
    url,
    sourceName,
    category,
    excerpt: rawExcerpt ? stripHtml(str(rawExcerpt)).slice(0, 300) : null,
    publishedAt: entry.published
      ? new Date(str(entry.published)).toISOString()
      : entry.updated ? new Date(str(entry.updated)).toISOString() : null,
    image: extractImage(entry),
  };
}

function extractImage(node) {
  // media:thumbnail
  const thumb = node['media:thumbnail'];
  if (thumb && typeof thumb === 'object') {
    const u = thumb['@_url'];
    if (typeof u === 'string' && u) return u;
  }
  // media:content
  const mc = node['media:content'];
  if (mc) {
    const list = Array.isArray(mc) ? mc : [mc];
    for (const c of list) {
      const medium = c['@_medium'], type = c['@_type'], u = c['@_url'];
      if (typeof u === 'string' && u && (medium === 'image' || (typeof type === 'string' && type.startsWith('image/')))) return u;
    }
    const u = list[0]?.['@_url'];
    if (typeof u === 'string' && u) return u;
  }
  // enclosure image
  const enc = node.enclosure;
  if (enc && typeof enc === 'object') {
    const type = enc['@_type'], u = enc['@_url'];
    if (typeof u === 'string' && u && typeof type === 'string' && type.startsWith('image/')) return u;
  }
  // first <img> in HTML content
  const html = str(node.description ?? node['content:encoded'] ?? node.content ?? node.summary ?? '');
  if (html) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m?.[1]) return m[1];
  }
  return null;
}

function str(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return v['#text'] ? String(v['#text']) : '';
  return String(v);
}

function stripHtml(s) {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
}
