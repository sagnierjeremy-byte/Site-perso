// /api/youtube — Agrégateur YouTube RSS public.
// Fetch les flux YouTube des chaînes inlinées en parallèle, agrège par date desc,
// puis enrichit chaque vidéo avec durée + view count (scrape /watch).
// Cache Edge 30 min.
// Channels inlinés (et pas lus depuis data/youtube-channels.json) car Vercel
// serverless ne peut pas accéder aux fichiers hors du dossier api/ sans config
// includeFiles. Source canonique : data/youtube-channels.json (build via
// scripts/build-youtube-channels.mjs + scripts/fetch-youtube-avatars.mjs).
// Sync ces channels avec le JSON après chaque update.
//
// Avatars : URLs YouTube CDN (yt3.googleusercontent.com), résolus une fois via
// scripts/fetch-youtube-avatars.mjs. Stable plusieurs mois. Fallback frontend
// via onerror → /photos/og-jerwis.jpg.

import { XMLParser } from 'fast-xml-parser';

const CHANNELS = [
  { id: 'UC6HUl-TjEB0iq0hExXrpjog', handle: '@GrandAnglePodcast', name: "Grand Angle", category: 'IA', tag: "Podcast · Tech", avatar: 'https://yt3.googleusercontent.com/iW9fPiaMUtOJ0qoCSnmqUNBNly4bzrvfGBDkJN4zEX6wt05iLrxoyMzoOcjh5_vOCjd0JoiqqQ=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UCkNZ-QtRIj0VepSoliDl_Bw', handle: '@grandanglenova', name: "Grand Angle Nova", category: 'IA', tag: "Podcast · IA", avatar: 'https://yt3.googleusercontent.com/n6Jarsn3odnxzX2wS5cgBwYHVbCf8CFLfodtUnZKY0t3rxTsvc7IemOg4QsHFKsJ9W87nL2DSw=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UC2UmrCDeb8CEB7t6v6Kqt7A', handle: '@SamouraiDansant', name: "IA et Stratégie", category: 'IA', tag: "IA · Stratégie", avatar: 'https://yt3.googleusercontent.com/8K3hgzb2OzJpW5ZmcjopsJdP02wci1gJOHuRGqpA7Wd0bncWEcs0MkJXq0ESXVK6JTi7prX3FQ=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UC5HDIVwuqoIuKKw-WbQ4CvA', handle: '@melvynxdev', name: "Melvynx", category: 'IA', tag: "Dev · SaaS", avatar: 'https://yt3.googleusercontent.com/FfaLdHpU5x7SKmc3u4y-x7SyJKILB95rVQOePc3s_xVYNIxk21V3vDboqfRsvbk5Eqd3ZHE28A=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UCt11zYNefnunOkgCrsO9UYg', handle: '@siliconcarnepod', name: "Silicon Carne 🌶️", category: 'IA', tag: "Tech · Startups", avatar: 'https://yt3.googleusercontent.com/HBH01jNMhS6dMa5rD9X8GdOFWn6IpKp6whIz2w1Y-qXjsDChlrtsgozwnF1UbnwJjtQn3iPHv10=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UCWedHS9qKebauVIK2J7383g', handle: '@Underscore_', name: "Underscore_", category: 'IA', tag: "Tech · Interviews", avatar: 'https://yt3.googleusercontent.com/RUb9pWwhDr8-uv4WTOOvn_c6cc1K5yHa2dPrOx7nqT8K2Ez1wYnVUQO_4PCJwMxOtZGg9vvZbw=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UCyc03X3uRuxM9n7fyRH_gIw', handle: '@VisionIA-FR', name: "Vision IA", category: 'IA', tag: "IA · Vulgarisation", avatar: 'https://yt3.googleusercontent.com/OnGeEJrbr1WV3x5xeC5zqOu8ew6EBzLlufq2KLggu7GhOAQhc8ZQrzkGWDqtdqwpBDVMGGN7=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UChlTcWDE8gd4tsl_L727NrQ', handle: '@Hasheur', name: "Hasheur", category: 'Business', tag: "Crypto · Business", avatar: 'https://yt3.googleusercontent.com/cbu-FEdBIY0FmCmYZON-6mYOqi_23EppDKm8gEjIZmwVgNN_riRVJNEjY-HlJl-mFVQ7XQNUgg=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UCxH-b8b2SX4kGSHSVj3NGzA', handle: '@oussamaammaroff', name: "Oussama Ammar", category: 'Business', tag: "Startup · Mindset", avatar: 'https://yt3.googleusercontent.com/hNsTpQ79LVEwg_h2LEmU1nqHGnIvJccwgEzPKONuHruq9P5n-BaU6E5xBDKt6Nmx6H__mhvLiQ=s240-c-k-c0x00ffffff-no-rj' },
  { id: 'UCaybrunQi8xWgPMgv1AYBHw', handle: '@TheiCollection', name: "TheiCollection", category: 'Business', tag: "Lifestyle · Business", avatar: 'https://yt3.googleusercontent.com/YOY2CmBga44F7Mja5HmH0exD6JTwAiETthp3OOrR9KgM4tsb04KzGroSw8cQ0Y30GL0uT85BCg=s240-c-k-c0x00ffffff-no-rj' },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
});

const UA = 'Mozilla/5.0 (compatible; Jerwis-YouTube/1.0; +https://jerwis.fr)';
const TIMEOUT_MS = 8_000;
const ENRICH_TIMEOUT_MS = 4_000;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const results = await Promise.allSettled(CHANNELS.map(fetchChannel));

  const videos = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 80);  // cap to 80 most recent to leave headroom for enrichment

  // Enrich each video in parallel with duration + view count.
  // 80 × 4s timeout en parallèle = ~4s total, marge confortable sous le 10s Vercel.
  const enriched = await Promise.allSettled(videos.map(enrichVideo));
  const final = enriched
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300');
  return res.status(200).json(final);
}

async function fetchChannel(channel) {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channel.id)}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'application/atom+xml, */*' },
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    return parseFeed(xml, channel);
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

// Scrape https://www.youtube.com/watch?v=<id> pour extraire durée + viewCount.
// Defensive : tout échec/timeout → on garde la vidéo sans enrichissement.
async function enrichVideo(video) {
  if (!video || !video.videoId) return video;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ENRICH_TIMEOUT_MS);
  try {
    const resp = await fetch(`https://www.youtube.com/watch?v=${video.videoId}`, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
    });
    if (!resp.ok) return video;
    const html = await resp.text();
    const dur = html.match(/"lengthSeconds":"(\d+)"/)?.[1];
    const views = html.match(/"viewCount":"(\d+)"/)?.[1];
    return {
      ...video,
      duration_seconds: dur ? parseInt(dur, 10) : null,
      view_count: views ? parseInt(views, 10) : null,
    };
  } catch {
    return video;
  } finally {
    clearTimeout(t);
  }
}

function parseFeed(xml, channel) {
  let doc;
  try { doc = parser.parse(xml); } catch { return []; }

  const feed = doc?.feed;
  if (!feed?.entry) return [];
  const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];

  return entries.map(e => atomEntry(e, channel)).filter(Boolean);
}

function atomEntry(entry, channel) {
  const videoId = str(entry['yt:videoId']);
  if (!videoId) return null;
  const title = str(entry.title);
  if (!title) return null;

  // URL canonique
  let videoUrl = '';
  const link = entry.link;
  if (Array.isArray(link)) {
    const alt = link.find(l => !l['@_rel'] || l['@_rel'] === 'alternate');
    videoUrl = alt?.['@_href'] || link[0]?.['@_href'] || '';
  } else if (link && typeof link === 'object') {
    videoUrl = link['@_href'] || '';
  }
  if (!videoUrl) videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Skip YouTube Shorts (verticales) — URL contient /shorts/
  if (videoUrl.includes('/shorts/')) return null;

  // Thumbnail
  const media = entry['media:group'];
  let thumbnail = null;
  if (media) {
    const t = media['media:thumbnail'];
    if (t) {
      if (Array.isArray(t)) thumbnail = t[0]?.['@_url'] || null;
      else thumbnail = t['@_url'] || null;
    }
  }
  if (!thumbnail) thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // Description
  let description = '';
  if (media) {
    const d = media['media:description'];
    description = str(d).slice(0, 300);
  }

  return {
    videoId,
    title,
    url: videoUrl,
    publishedAt: safeDate(str(entry.published ?? entry.updated)),
    thumbnail,
    description,
    channel: {
      id: channel.id,
      name: channel.name,
      avatar: channel.avatar,
      category: channel.category,
      handle: channel.handle,
    },
  };
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
