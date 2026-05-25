// /api/youtube — Agrégateur YouTube RSS public.
// Fetch les flux YouTube des chaînes inlinées en parallèle, agrège par date desc.
// Cache Edge 30 min.
// Channels inlinés (et pas lus depuis data/youtube-channels.json) car Vercel
// serverless ne peut pas accéder aux fichiers hors du dossier api/ sans config
// includeFiles. Source canonique : data/youtube-channels.json (build via
// scripts/build-youtube-channels.mjs). Sync ces channels avec le JSON après
// chaque update.

import { XMLParser } from 'fast-xml-parser';

const CHANNELS = [
  { id: 'UC6HUl-TjEB0iq0hExXrpjog', handle: '@GrandAnglePodcast', name: 'Grand Angle', category: 'IA', tag: 'Podcast · Tech', avatar: '/photos/channels/c06.jpg' },
  { id: 'UCkNZ-QtRIj0VepSoliDl_Bw', handle: '@grandanglenova', name: 'Grand Angle Nova', category: 'IA', tag: 'Podcast · IA', avatar: '/photos/channels/c07.jpg' },
  { id: 'UC2UmrCDeb8CEB7t6v6Kqt7A', handle: '@SamouraiDansant', name: 'IA et Stratégie', category: 'IA', tag: 'IA · Stratégie', avatar: '/photos/channels/c02.jpg' },
  { id: 'UC5HDIVwuqoIuKKw-WbQ4CvA', handle: '@melvynxdev', name: 'Melvynx', category: 'IA', tag: 'Dev · SaaS', avatar: '/photos/channels/c05.jpg' },
  { id: 'UCt11zYNefnunOkgCrsO9UYg', handle: '@siliconcarnepod', name: 'Silicon Carne 🌶️', category: 'IA', tag: 'Tech · Startups', avatar: '/photos/channels/c01.jpg' },
  { id: 'UCWedHS9qKebauVIK2J7383g', handle: '@Underscore_', name: 'Underscore_', category: 'IA', tag: 'Tech · Interviews', avatar: '/photos/channels/c04.jpg' },
  { id: 'UCyc03X3uRuxM9n7fyRH_gIw', handle: '@VisionIA-FR', name: 'Vision IA', category: 'IA', tag: 'IA · Vulgarisation', avatar: '/photos/channels/c03.jpg' },
  { id: 'UCUyDOdBWhC1MCxEjC46d-zw', handle: '@AlexHormozi', name: 'Alex Hormozi', category: 'Business', tag: 'Scaling · Sales', avatar: '/photos/channels/c30.jpg' },
  { id: 'UC_P8I2rEujg7njykwVonHlQ', handle: '@antoineblanco99', name: 'Antoine Blanco', category: 'Business', tag: 'Entrepreneur · Mindset', avatar: '/photos/channels/c16.jpg' },
  { id: 'UCctXZhXmG-kf3tlIXgVZUlw', handle: '@garyvee', name: 'GaryVee', category: 'Business', tag: 'Marketing · Mindset', avatar: '/photos/channels/c32.jpg' },
  { id: 'UCdlNK1xcy-Sn8liq7feNxWw', handle: '@GrantCardone', name: 'Grant Cardone', category: 'Business', tag: 'Sales · Mindset', avatar: '/photos/channels/c11.jpg' },
  { id: 'UChlTcWDE8gd4tsl_L727NrQ', handle: '@Hasheur', name: 'Hasheur', category: 'Business', tag: 'Crypto · Business', avatar: '/photos/channels/c13.jpg' },
  { id: 'UCQ4FNww3XoNgqIlkBqEAVCg', handle: '@ImanGadzhi', name: 'Iman Gadzhi', category: 'Business', tag: 'Agency · Mindset', avatar: '/photos/channels/c10.jpg' },
  { id: 'UC1X7tWfy1hnm9LoAKIwanig', handle: '@PodcastLeDéclic', name: 'Le Déclic par Alec Henry', category: 'Business', tag: 'Podcast · Entrepreneurs', avatar: '/photos/channels/c14.jpg' },
  { id: 'UCIh7PDUAP226Pa_NtjN9Jqw', handle: '@legendmedia', name: 'LEGEND', category: 'Business', tag: 'Podcast · Business', avatar: '/photos/channels/c12.jpg' },
  { id: 'UCxCcu9pet4dljrBLf8R5nwA', handle: '@leilahormozi', name: 'Leila Hormozi', category: 'Business', tag: 'Leadership · Business', avatar: '/photos/channels/c08.jpg' },
  { id: 'UCxH-b8b2SX4kGSHSVj3NGzA', handle: '@oussamaammaroff', name: 'Oussama Ammar', category: 'Business', tag: 'Startup · Mindset', avatar: '/photos/channels/c09.jpg' },
  { id: 'UCaybrunQi8xWgPMgv1AYBHw', handle: '@TheiCollection', name: 'TheiCollection', category: 'Business', tag: 'Lifestyle · Business', avatar: '/photos/channels/c18.jpg' },
  { id: 'UChgE6R4QauGAJAlYiJOcCGw', handle: '@YomiDenzel', name: 'Yomi Denzel', category: 'Business', tag: 'E-commerce · Mindset', avatar: '/photos/channels/c17.jpg' },
  { id: 'UCRCCAnVyzDTcqNYh0pDcq7Q', handle: '@Finary', name: 'Finary', category: 'Finance', tag: 'Patrimoine · Invest', avatar: '/photos/channels/c15.jpg' },
  { id: 'UCrwiAaMJv2vSSIpvC710MBw', handle: '@InteractivTrading', name: 'Interactiv Trading', category: 'Finance', tag: 'Trading · Marchés', avatar: '/photos/channels/c20.jpg' },
  { id: 'UCUfXGbq1NnA-DogpIFQpWtw', handle: '@thamikabbaj1', name: 'Thami Kabbaj', category: 'Finance', tag: 'Trading · Patrimoine', avatar: '/photos/channels/c22.jpg' },
  { id: 'UCRDafCFB27KOBXvgc6kgS0A', handle: '@7jourssurTerre', name: '7 jours sur Terre', category: 'Actu', tag: 'Géopolitique · Actu', avatar: '/photos/channels/c23.jpg' },
  { id: 'UCSKdvgqdnj72_SLggp7BDTg', handle: '@BrutFR', name: 'Brut', category: 'Actu', tag: 'Actu · Format court', avatar: '/photos/channels/c25.jpg' },
  { id: 'UCvg4_wSz4Cmo4xRPXaKU47A', handle: '@Cdanslairofficiel', name: "C dans l'air", category: 'Actu', tag: 'Débat · France TV', avatar: '/photos/channels/c19.jpg' },
  { id: 'UCPHLvIgDTxzYwSiXDfBYhsQ', handle: '@CHAQUEJOURSURTERRE', name: 'Chaque Jour sur Terre', category: 'Actu', tag: 'Géopolitique · Actu', avatar: '/photos/channels/c26.jpg' },
  { id: 'UC8jSdiTfai1PFwjQ9MrkkBg', handle: '@Geopolitis', name: 'Géopolitis', category: 'Actu', tag: 'Géopolitique · Analyse', avatar: '/photos/channels/c24.jpg' },
  { id: 'UCAcAnMF0OrCtUep3Y4M-ZPw', handle: '@hugodecrypteactus', name: 'HugoDécrypte', category: 'Actu', tag: 'Actu · Vulgarisation', avatar: '/photos/channels/c21.jpg' },
  { id: 'UC75Gw0NC9bRIKmAixxbLe1g', handle: '@margo_cunego', name: 'Margo Cunego', category: 'Lifestyle', tag: 'Lifestyle · Wellness', avatar: '/photos/channels/c33.jpg' },
  { id: 'UCX6OQ3DkcsbYNE6H8uQQuVA', handle: '@MrBeast', name: 'MrBeast', category: 'Lifestyle', tag: 'Divertissement', avatar: '/photos/channels/c27.jpg' },
  { id: 'UC181vPr4uyc8SqXnpZAJeZQ', handle: '@Najbfit', name: 'Naj B Fit', category: 'Lifestyle', tag: 'Fitness · Lifestyle', avatar: '/photos/channels/c29.jpg' },
  { id: 'UCchpwieM3DswmDEnJ0MRq1A', handle: '@RomainLanéry', name: 'Romain Lanéry', category: 'Lifestyle', tag: 'Inspiration · Mindset', avatar: '/photos/channels/c34.jpg' },
  { id: 'UC_XbQDgf-WFegqWdYmqIdgA', handle: '@soustensionpodcast', name: 'Sous Tension', category: 'Lifestyle', tag: 'Podcast · Interviews', avatar: '/photos/channels/c28.jpg' },
  { id: 'UCsGsjobmhhnLVLJE9S0DuxQ', handle: '@taylorchiche', name: 'Taylor Chiche', category: 'Lifestyle', tag: 'Lifestyle · Inspiration', avatar: '/photos/channels/c31.jpg' },
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
});

const UA = 'Mozilla/5.0 (compatible; Jerwis-YouTube/1.0; +https://jerwis.fr)';
const TIMEOUT_MS = 8_000;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const results = await Promise.allSettled(CHANNELS.map(fetchChannel));

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
