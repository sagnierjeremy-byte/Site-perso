// /api/youtube — Agrégateur YouTube RSS public.
// Fetch les flux YouTube de ~34 chaînes en parallèle, agrège par date desc.
// Cache Edge 30 min.

import { XMLParser } from 'fast-xml-parser';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANNELS_PATH = resolve(__dirname, '..', 'data', 'youtube-channels.json');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
});

const UA = 'Mozilla/5.0 (compatible; Jerwis-YouTube/1.0; +https://jerwis.fr)';
const TIMEOUT_MS = 8_000;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  let channelsData;
  try {
    channelsData = JSON.parse(await readFile(CHANNELS_PATH, 'utf8'));
  } catch (e) {
    return res.status(500).json({ error: 'channels data missing' });
  }

  const channels = channelsData.channels || [];
  if (!channels.length) return res.status(200).json([]);

  const results = await Promise.allSettled(channels.map(fetchChannel));

  const videos = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, 200);  // cap to top 200 most recent videos across all channels

  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=300');
  return res.status(200).json(videos);
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
