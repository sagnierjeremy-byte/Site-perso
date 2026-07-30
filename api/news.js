// Agrégateur RSS public — fetch les flux directement, sans base de données.
// Cache Vercel Edge 30 min pour ne pas marteler les sources à chaque visite.

import { XMLParser } from 'fast-xml-parser';

const FEEDS = [
  // ── IA & Tech — fenêtres mondiales (les seules encore vivantes ; The Verge,
  //    Wired et VentureBeat retirés le 2026-07-30 : flux 404 ou moribonds) ────
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch', category: 'IA' },
  // ── IA & Tech — sources françaises (originales) ──────────────────────────
  { url: 'https://www.numerama.com/feed/', name: 'Numerama', category: 'IA' },
  { url: 'https://siecledigital.fr/feed/', name: 'Siècle Digital', category: 'IA' },
  { url: 'https://www.usine-digitale.fr/rss/', name: "L'Usine Digitale", category: 'IA' },
  // ── IA & Tech — sources françaises (nouvelles 2026-05-22) ─────────────────
  { url: 'https://next.ink/feed/', name: 'Next', category: 'IA' },
  { url: 'https://www.blogdumoderateur.com/feed/', name: 'Blog du Modérateur', category: 'IA' },
  { url: 'https://www.01net.com/feed/', name: '01net', category: 'IA' },
  { url: 'https://www.presse-citron.net/feed/', name: 'Presse-citron', category: 'IA' },
  { url: 'https://www.actuia.com/feed/', name: 'Actu IA', category: 'IA' },
  { url: 'https://www.silicon.fr/feed', name: 'Silicon.fr', category: 'IA' },
  { url: 'https://korben.info/feed', name: 'Korben', category: 'IA' },
  { url: 'https://www.lemonde.fr/pixels/rss_full.xml', name: 'Le Monde Pixels', category: 'IA' },
  // ── IA — sources spécialisées + expertes (nouvelles 2026-05-25) ───────────
  { url: 'https://www.frandroid.com/marques/intelligence-artificielle/feed', name: 'Frandroid IA', category: 'IA' },
  { url: 'https://intelligence-artificielle.com/feed/', name: 'Intelligence Artificielle', category: 'IA' },
  { url: 'https://simonwillison.net/atom/everything/', name: 'Simon Willison', category: 'IA' },
  // ── IA & Tech — sources françaises (nouvelles 2026-07-30, testées : 200,
  //    fraîcheur < 24 h, cadence relevée dans le CHANGELOG) ──────────────────
  { url: 'https://www.zdnet.fr/feeds/rss/actualites/', name: 'ZDNet France', category: 'IA' },
  { url: 'https://www.lebigdata.fr/feed', name: 'Le Big Data', category: 'IA' },
  { url: 'https://www.lemagit.fr/rss/ContentSyndication.xml', name: 'LeMagIT', category: 'IA' },
  { url: 'https://www.itforbusiness.fr/feed', name: 'IT for Business', category: 'IA' },
  { url: 'https://www.larevuedudigital.com/feed/', name: 'La Revue du Digital', category: 'IA' },
  { url: 'https://www.bfmtv.com/rss/tech/', name: 'Tech&Co', category: 'IA' },
  // ── Business — sources françaises ─────────────────────────────────────────
  { url: 'https://www.maddyness.com/feed/', name: 'Maddyness', category: 'Business' },
  { url: 'https://www.journaldunet.com/rss/', name: 'Journal du Net', category: 'Business' },
  { url: 'https://www.frenchweb.fr/feed', name: 'Frenchweb', category: 'Business' },
  { url: 'https://www.bfmtv.com/rss/economie/entreprises/', name: 'BFM Business', category: 'Business' },
  { url: 'https://www.lefigaro.fr/rss/figaro_economie.xml', name: 'Le Figaro Économie', category: 'Business' },
  { url: 'https://feed.prismamediadigital.com/v1/cap/rss', name: 'Capital', category: 'Business' },
  { url: 'https://www.challenges.fr/rss.xml', name: 'Challenges', category: 'Business' },
  { url: 'https://www.lexpress.fr/rss/economie.xml', name: "L'Express Économie", category: 'Business' },
  { url: 'https://www.latribune.fr/rss/homepage', name: 'La Tribune', category: 'Business' },
  { url: 'https://www.lemonde.fr/economie/rss_full.xml', name: 'Le Monde Économie', category: 'Business' },
  { url: 'https://www.franceinfo.fr/economie.rss', name: 'France Info Éco', category: 'Business' },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
  stopNodes: ['*.script', '*.style'],
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

  const rss = doc.rss;
  if (rss?.channel?.item) {
    const items = Array.isArray(rss.channel.item) ? rss.channel.item : [rss.channel.item];
    return items.map((i) => rssItem(i, sourceName, category)).filter(Boolean);
  }

  const feed = doc.feed;
  if (feed?.entry) {
    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
    return entries.map((e) => atomEntry(e, sourceName, category)).filter(Boolean);
  }

  return [];
}

function rssItem(item, sourceName, category) {
  const title = decodeEntities(str(item.title));
  const url = str(item.link) || str(item.guid);
  if (!title || !url || !url.startsWith('http')) return null;
  return {
    title,
    url,
    sourceName,
    category,
    excerpt: item.description ? decodeEntities(stripHtml(str(item.description))).slice(0, 300) : null,
    publishedAt: item.pubDate ? safeDate(str(item.pubDate)) : null,
    image: extractImage(item),
  };
}

function atomEntry(entry, sourceName, category) {
  const title = decodeEntities(str(entry.title));
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
    excerpt: rawExcerpt ? decodeEntities(stripHtml(str(rawExcerpt))).slice(0, 300) : null,
    publishedAt: safeDate(str(entry.published ?? entry.updated ?? '')),
    image: extractImage(entry),
  };
}

function extractImage(node) {
  // media:thumbnail (le plus courant)
  const thumb = node['media:thumbnail'];
  if (thumb) {
    const u = pickUrl(thumb);
    if (u) return u;
  }

  // media:group > media:thumbnail (YouTube et certains feeds)
  const group = node['media:group'];
  if (group && typeof group === 'object') {
    const gt = group['media:thumbnail'];
    if (gt) { const u = pickUrl(gt); if (u) return u; }
    const gc = group['media:content'];
    if (gc) { const u = pickUrl(gc); if (u) return u; }
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

  // premier <img> dans le HTML du contenu
  const html = str(node['content:encoded'] ?? node.description ?? node.content ?? node.summary ?? '');
  if (html) {
    const m = html.match(/<img[^>]+src=["']([^"']{10,})["']/i);
    if (m?.[1] && !m[1].includes('pixel') && !m[1].includes('1x1')) return m[1];
  }

  return null;
}

function pickUrl(v) {
  if (!v) return null;
  if (Array.isArray(v)) {
    for (const item of v) { const u = item?.['@_url']; if (typeof u === 'string' && u) return u; }
    return null;
  }
  if (typeof v === 'object') {
    const u = v['@_url'];
    return typeof u === 'string' && u ? u : null;
  }
  return null;
}

function safeDate(s) {
  if (!s) return null;
  try { const d = new Date(s); return isNaN(d.getTime()) ? null : d.toISOString(); } catch { return null; }
}

function str(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return v['#text'] ? String(v['#text']) : '';
  return String(v);
}

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”');
}

function stripHtml(s) {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
}
