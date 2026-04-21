#!/usr/bin/env node
/**
 * brainstorm.js — Propose des sujets d'articles à partir de signaux externes.
 *
 * Sources fouillées :
 *   - Reddit : r/ClaudeAI, r/LocalLLaMA, r/Entrepreneur, r/ChatGPT, r/OpenAI
 *   - Hacker News (Algolia API) : stories IA récentes
 *   - RSS officiels : Anthropic news, OpenAI blog, Google AI blog
 *
 * Scoring règles (pas de LLM pour éviter coût API + rester transparent) :
 *   - demande    : volume d'engagement (upvotes, points)
 *   - pertinence : match avec keywords du site (Claude, Claude Code, agent, tuto...)
 *   - evergreen  : tuto/guide boost · news/release décote
 *   - vécu       : neutral 5 (Jérémy ajuste après)
 *   - gap        : anti-doublon vs articles/*.html
 *
 * Sortie :
 *   - BACKLOG.md mis à jour (top 10 ajoutés, >60j rejetés auto)
 *   - Console : top 5 affiché
 *
 * Usage : npm run brainstorm
 */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CLUSTERS, detectCluster, NO_CLUSTER_MULTIPLIER } from './editorial-clusters.js';
import { YT_CHANNELS, YT_SIGNAL_KEYWORDS } from './youtube-channels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PATHS = {
  backlog:  path.join(ROOT, 'BACKLOG.md'),
  articles: path.join(ROOT, 'articles'),
  dataDir:  path.join(ROOT, 'data'),
  ytCache:  path.join(ROOT, 'data', 'youtube-cache.json'),
};

// --- Config ---
// Subs classés par priorité éditoriale · plus en haut = plus de poids
const SUBREDDITS = [
  'ClaudeAI',        // cluster 1 · Claude Code
  'ChatGPTCoding',   // cluster 1+2 · tutos coding AI
  'Cursor',          // cluster 4 · compétiteur direct Claude Code
  'LocalLLaMA',      // cluster 6 · frontier
  'MachineLearning', // cluster 6 · frontier (papers, recherche)
  'artificial',      // cluster 6 · frontier généraliste (bruit modéré)
  'Entrepreneur',    // cluster 5
  'SaaS',            // cluster 5 · produits IA solopreneurs
  'ChatGPT',         // cluster 4
  'OpenAI',          // cluster 4
  'singularity',     // cluster 6 · frontier (beaucoup de bruit, filtre renforcé)
];
const HN_QUERIES = ['claude code', 'anthropic', 'ai agent', 'mcp', 'llm tutorial'];
const RSS_FEEDS = [
  // Blogs IA officiels
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml' },
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/' },
  // Médias tech IA (rapatriés du newsletter-dashboard)
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/' },
  { name: 'Hacker News Best', url: 'https://hnrss.org/best' },
];
// Flux Google News générés dynamiquement sur des keywords qui me tiennent à cœur
// Avantage · couvre des milliers de sources FR+EN en une requête par keyword
function googleNewsFeeds(keywords) {
  const feeds = [];
  for (const kw of keywords) {
    const encoded = encodeURIComponent(kw);
    feeds.push({ name: `Google News FR · "${kw}"`, url: `https://news.google.com/rss/search?q=${encoded}&hl=fr&gl=FR&ceid=FR:fr` });
    feeds.push({ name: `Google News EN · "${kw}"`, url: `https://news.google.com/rss/search?q=${encoded}&hl=en&gl=US&ceid=US:en` });
  }
  return feeds;
}
const GOOGLE_NEWS_KEYWORDS = ['Claude Code', 'Anthropic', 'Superpowers plugin', 'agents IA', 'AI skills'];
const GITHUB_QUERIES = [
  { q: 'claude code in:name,description', name: 'Claude Code' },
  { q: 'mcp server in:name,description', name: 'MCP servers' },
];

const MAX_BACKLOG = 40;      // plus large car on filtre par cluster
const REJECT_AFTER_DAYS = 60;
const TOP_N = 15;            // top 15 proposées

const KEYWORDS_RELEVANT = [
  'claude', 'claude code', 'anthropic', 'agent', 'agents', 'agentic',
  'mcp', 'skills', 'subagents', 'sous-agent', 'subagent',
  'prompt', 'llm', 'rag', 'chatbot', 'copilot',
  'automat', 'workflow', 'pipeline', 'no-code', 'nocode',
  'entrepreneur', 'solopreneur', 'productivity', 'productivité',
];
const KEYWORDS_NEWS_DECAY = [
  'released', 'release', 'announce', 'announced', 'launched',
  'new version', 'update', 'coming soon', 'beta',
];
const KEYWORDS_EVERGREEN_BOOST = [
  'how to', 'how i', 'tutorial', 'guide', 'explained',
  'building', 'built', 'pattern', 'anti-pattern', 'deep dive',
  'lessons learned', 'ma config', 'je teste', 'my setup',
];

// Anti-bruit : memes, shitposts, drama, doomer, news pures
const KEYWORDS_NOISE = [
  // Memes / shitposts
  'me when', 'me irl', 'tfw', 'lol', 'wtf', 'vs friends',
  'friends outside', 'just bought', 'iodine tablets',
  'trauma', 'i cried', 'depressed', 'rage',
  // Drama
  'jailbreak', 'uncensored', 'nsfw',
  'scam', 'lawsuit', 'fired', 'quit', 'leaves', 'resigns',
  'drama', 'feud', 'exposed',
  // Doomer / AGI hype vide
  'agi coming', 'p(doom)', 'we\'re cooked', 'we are cooked',
  'end of software', 'software engineers dead', 'developers dead',
  'it\'s over', 'singularity soon',
  // Questions génériques low-value
  'am i the only', 'anyone else', 'is it just me',
  'help me choose', 'should i buy',
];

// --- Utils ---
const log = {
  info:    (m) => console.log(`\x1b[36m•\x1b[0m ${m}`),
  ok:      (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`),
  warn:    (m) => console.log(`\x1b[33m!\x1b[0m ${m}`),
  err:     (m) => console.error(`\x1b[31m×\x1b[0m ${m}`),
  section: (m) => console.log(`\n\x1b[1m${m}\x1b[0m`),
};

const slug = (s) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

// Fuzzy similarity (Jaccard on tokens)
const tokens = (s) => new Set(
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/[\s\-_./]+/)
    .filter(w => w.length > 3)
);
const jaccard = (a, b) => {
  const A = tokens(a), B = tokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return inter / union;
};

// --- Fetchers ---

async function fetchReddit(sub) {
  const url = `https://www.reddit.com/r/${sub}/top.json?t=week&limit=25`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'jeremysagnier-brainstorm/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data?.data?.children || []).map(({ data: d }) => ({
      source: `reddit/r/${sub}`,
      title: d.title,
      url: `https://reddit.com${d.permalink}`,
      score: d.score,
      comments: d.num_comments,
      created: new Date(d.created_utc * 1000),
      raw_engagement: d.score + d.num_comments * 2,
    }));
  } catch (e) {
    log.warn(`Reddit r/${sub} : ${e.message}`);
    return [];
  }
}

async function fetchHN(query) {
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i%3E${sevenDaysAgo}&hitsPerPage=30`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data?.hits || []).map(h => ({
      source: 'hackernews',
      title: h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      score: h.points || 0,
      comments: h.num_comments || 0,
      created: new Date((h.created_at_i || 0) * 1000),
      raw_engagement: (h.points || 0) + (h.num_comments || 0) * 2,
    }));
  } catch (e) {
    log.warn(`HN "${query}" : ${e.message}`);
    return [];
  }
}

async function fetchGitHub(query) {
  // GitHub search API · sans auth on a 60 req/h/IP · ça suffit
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query.q)}&sort=updated&order=desc&per_page=20`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'jeremysagnier-brainstorm/1.0',
        'Accept': 'application/vnd.github+json',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data.items || []).slice(0, 15).map(r => ({
      source: `github/${query.name}`,
      title: `${r.name} · ${r.description || 'Sans description'}`.slice(0, 200),
      url: r.html_url,
      score: r.stargazers_count,
      comments: r.forks_count,
      created: new Date(r.pushed_at),
      raw_engagement: r.stargazers_count + (r.forks_count * 3),
    }));
  } catch (e) {
    log.warn(`GitHub "${query.name}" : ${e.message}`);
    return [];
  }
}

async function fetchRSS(feed) {
  try {
    const res = await fetch(feed.url, { headers: { 'User-Agent': 'jeremysagnier-brainstorm/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    // Parser minimal : regex sur <item> ou <entry>
    const items = [];
    const itemRegex = /<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/g;
    let m;
    while ((m = itemRegex.exec(xml)) !== null) {
      const block = m[2];
      const title = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1]?.trim();
      const link = (block.match(/<link[^>]*(?:href="([^"]+)"[^>]*>|>([^<]+)<\/link>)/) || [])[1] || (block.match(/<link[^>]*>([^<]+)<\/link>/) || [])[1];
      const pubDate = (block.match(/<(?:pubDate|published|updated)[^>]*>([^<]+)<\/(?:pubDate|published|updated)>/) || [])[1];
      if (title && link) {
        const cleanTitle = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        items.push({
          source: `rss/${feed.name}`,
          title: cleanTitle,
          url: link.trim(),
          score: 0,
          comments: 0,
          created: pubDate ? new Date(pubDate) : new Date(),
          raw_engagement: 50, // baseline pour release officielle
        });
      }
    }
    return items.slice(0, 15);
  } catch (e) {
    log.warn(`RSS ${feed.name} : ${e.message}`);
    return [];
  }
}

// --- YouTube (RSS Atom par chaîne, gratuit, sans clé) ---

const YT_CACHE_TTL_MS = 90 * 86400e3; // 90 jours · les channelId ne changent jamais, cache très long

async function loadYtCache() {
  if (!existsSync(PATHS.ytCache)) return {};
  try { return JSON.parse(await readFile(PATHS.ytCache, 'utf8')); } catch { return {}; }
}

async function saveYtCache(cache) {
  if (!existsSync(PATHS.dataDir)) await mkdir(PATHS.dataDir, { recursive: true });
  await writeFile(PATHS.ytCache, JSON.stringify(cache, null, 2));
}

async function resolveChannelId(handle, cache) {
  // Vérifie le cache
  const entry = cache[handle];
  if (entry && entry.channelId && (Date.now() - entry.resolvedAt < YT_CACHE_TTL_MS)) {
    return entry.channelId;
  }
  // Scrape la page HTML pour trouver le channelId (pattern standard YouTube 2026)
  const url = `https://www.youtube.com/@${handle}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) jeremysagnier-brainstorm/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    // Cherche le channelId dans plusieurs patterns (YouTube change parfois)
    const patterns = [
      /"channelId":"(UC[\w-]{22})"/,
      /"externalId":"(UC[\w-]{22})"/,
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/,
      /<meta property="og:url" content="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})"/,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) {
        cache[handle] = { channelId: m[1], resolvedAt: Date.now() };
        return m[1];
      }
    }
    throw new Error('channelId introuvable dans le HTML');
  } catch (e) {
    log.warn(`YouTube @${handle} resolve : ${e.message}`);
    return null;
  }
}

async function fetchYouTube(channel, cache) {
  const channelId = await resolveChannelId(channel.handle, cache);
  if (!channelId) return [];

  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'jeremysagnier-brainstorm/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    // Parse chaque <entry> · format Atom YouTube très stable
    const items = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let m;
    while ((m = entryRegex.exec(xml)) !== null) {
      const block = m[1];
      const videoId = (block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
      const title = (block.match(/<title>([^<]+)<\/title>/) || [])[1];
      const published = (block.match(/<published>([^<]+)<\/published>/) || [])[1];
      const description = (block.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1] || '';
      const stars = parseInt((block.match(/<media:starRating[^>]*count="(\d+)"/) || [])[1] || '0', 10);
      const views = parseInt((block.match(/<media:statistics[^>]*views="(\d+)"/) || [])[1] || '0', 10);

      if (!videoId || !title) continue;

      // Filtre : < 45 jours (sinon vieille vidéo)
      const createdAt = published ? new Date(published) : new Date();
      const ageDays = (Date.now() - createdAt.getTime()) / 86400e3;
      if (ageDays > 45) continue;

      // Filtre signal : le titre OU la description doit contenir un keyword IA/business
      const text = `${title} ${description}`.toLowerCase();
      const hasSignal = YT_SIGNAL_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
      if (!hasSignal) continue;

      // Engagement : views + stars×10 (stars ≈ likes sur YouTube)
      const rawEngagement = Math.floor((views || 0) / 100) + (stars * 10);

      // Cleanup titre · retire le @ParDefaut des chaînes si présent
      const cleanTitle = title
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

      items.push({
        source: `youtube/${channel.label}`,
        title: cleanTitle,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        score: views,
        comments: stars,
        created: createdAt,
        raw_engagement: rawEngagement,
        channel_boost: channel.boost || 1.0,
      });
    }
    return items.slice(0, 10); // max 10 par chaîne pour éviter inflation
  } catch (e) {
    log.warn(`YouTube ${channel.label} (${channelId}) : ${e.message}`);
    return [];
  }
}

// --- Scoring ---

function scoreDemand(item) {
  // Normalise l'engagement brut sur échelle 1-10
  // Reddit : 50 points = 5, 500 = 8, 2000 = 10
  // HN : 30 = 5, 100 = 8, 500 = 10
  // RSS : baseline 5-6 (officiel récent)
  const eng = item.raw_engagement;
  if (eng >= 2000) return 10;
  if (eng >= 1000) return 9;
  if (eng >= 500)  return 8;
  if (eng >= 200)  return 7;
  if (eng >= 100)  return 6;
  if (eng >= 50)   return 5;
  if (eng >= 20)   return 4;
  if (eng >= 10)   return 3;
  return 2;
}

function scoreRelevance(item) {
  const t = item.title.toLowerCase();
  let score = 3; // baseline
  for (const kw of KEYWORDS_RELEVANT) {
    if (t.includes(kw)) score += 1.5;
  }
  // Malus anti-bruit : memes, shitposts
  for (const kw of KEYWORDS_NOISE) {
    if (t.includes(kw)) score -= 4;
  }
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
}

function scoreEvergreen(item) {
  const t = item.title.toLowerCase();
  let score = 5;
  for (const kw of KEYWORDS_EVERGREEN_BOOST) {
    if (t.includes(kw)) score += 1.5;
  }
  for (const kw of KEYWORDS_NEWS_DECAY) {
    if (t.includes(kw)) score -= 1.5;
  }
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

async function scoreGap(item, existingTitles) {
  // Check titre vs articles existants (seuil Jaccard 0.25 → doublon)
  let maxSim = 0;
  for (const existing of existingTitles) {
    const sim = jaccard(item.title, existing);
    if (sim > maxSim) maxSim = sim;
  }
  // 0 sim → gap 10 · 0.5 sim → gap 4 · >0.6 → gap 1
  return Math.max(1, Math.round((10 - maxSim * 18) * 10) / 10);
}

function computeFinalScore(scores) {
  // Moyenne pondérée
  const w = { demand: 0.25, relevance: 0.30, evergreen: 0.15, vecu: 0.10, gap: 0.20 };
  return Math.round(
    (scores.demand * w.demand +
     scores.relevance * w.relevance +
     scores.evergreen * w.evergreen +
     scores.vecu * w.vecu +
     scores.gap * w.gap) * 10
  ) / 10;
}

// --- Clustering / déduplication ---

function cluster(items) {
  // Regroupe les items dont le titre est très similaire (Jaccard > 0.5)
  const clusters = [];
  for (const item of items) {
    const found = clusters.find(c => jaccard(c.title, item.title) > 0.5);
    if (found) {
      found.items.push(item);
      // garde le titre du plus engageant
      if (item.raw_engagement > found.raw_engagement) {
        found.title = item.title;
        found.raw_engagement = item.raw_engagement;
      }
    } else {
      clusters.push({ title: item.title, raw_engagement: item.raw_engagement, items: [item] });
    }
  }
  return clusters.map(c => {
    const totalEng = c.items.reduce((a, i) => a + i.raw_engagement, 0);
    const sources = [...new Set(c.items.map(i => i.source))];
    const urls = [...new Set(c.items.map(i => i.url))].slice(0, 3);
    // Channel boost : max parmi les items (au cas où vidéo cross-postée)
    const channelBoost = Math.max(1.0, ...c.items.map(i => i.channel_boost || 1.0));
    return {
      title: c.title,
      raw_engagement: totalEng,
      sources,
      urls,
      count: c.items.length,
      channel_boost: channelBoost,
      created: new Date(Math.max(...c.items.map(i => i.created.getTime()))),
    };
  });
}

// --- BACKLOG parser/writer ---

function parseBacklog(content) {
  if (!content) return { proposed: [], chosen: [], published: [], rejected: [] };
  const sections = { proposed: [], chosen: [], published: [], rejected: [] };
  let current = null;
  const lines = content.split('\n');
  let block = [];

  const flushBlock = () => {
    if (block.length === 0 || !current) { block = []; return; }
    const raw = block.join('\n').trim();
    if (!raw) { block = []; return; }

    const titleMatch = raw.match(/^### \[([\d.]+)\]\s+(.+)$/m);
    if (!titleMatch) { block = []; return; }

    const entry = {
      score: parseFloat(titleMatch[1]),
      title: titleMatch[2].trim(),
      id: (raw.match(/\*\*id:\*\*\s*`([^`]+)`/) || [])[1] || slug(titleMatch[2]),
      cluster: (raw.match(/\*\*cluster:\*\*\s*`([^`]+)`/) || [])[1] || null,
      status: (raw.match(/\*\*status:\*\*\s*`([^`]+)`/) || [])[1] || current,
      proposed: (raw.match(/\*\*proposed:\*\*\s*([\d-]+)/) || [])[1] || new Date().toISOString().slice(0, 10),
      angle: (raw.match(/\*\*Angle suggéré\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      scores: (raw.match(/\*\*Scores\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      sources: (raw.match(/\*\*Sources\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      raw,
    };
    sections[current].push(entry);
    block = [];
  };

  for (const line of lines) {
    if (/^##\s+.*Proposées/i.test(line))  { flushBlock(); current = 'proposed'; continue; }
    if (/^##\s+.*Choisies/i.test(line))   { flushBlock(); current = 'chosen'; continue; }
    if (/^##\s+.*Publiées/i.test(line))   { flushBlock(); current = 'published'; continue; }
    if (/^##\s+.*Rejetées/i.test(line))   { flushBlock(); current = 'rejected'; continue; }
    if (/^### \[/.test(line)) { flushBlock(); block.push(line); continue; }
    if (current && block.length > 0) block.push(line);
  }
  flushBlock();
  return sections;
}

function formatEntry(e) {
  const clusterLine = e.cluster ? `**cluster:** \`${e.cluster}\` · ` : '';
  return `### [${e.score.toFixed(1)}] ${e.title}
**id:** \`${e.id}\` · ${clusterLine}**status:** \`${e.status}\` · **proposed:** ${e.proposed}
**Scores** : ${e.scores}
**Angle suggéré** : ${e.angle}
**Sources** : ${e.sources}
`;
}

function writeBacklog(sections) {
  const now = new Date().toISOString().slice(0, 10);
  const body = `# BACKLOG d'articles — Jérémy Sagnier

> Auto-généré par \`scripts/brainstorm.js\` · Édité manuellement quand tu choisis un sujet.
> **Pour démarrer l'écriture** : passe le \`status\` de l'idée choisie de \`proposed\` → \`chosen\` dans ce fichier.
> Dernière MAJ : ${now}

---

## 📊 Proposées (${sections.proposed.length})

Triées par score décroissant. Ajuste le score \`vécu\` toi-même en éditant la ligne \`Scores\` (plus précis qu'une estimation externe).

${sections.proposed.length === 0 ? '*(aucune idée proposée)*' : sections.proposed.map(formatEntry).join('\n')}

---

## ✏️ Choisies (${sections.chosen.length})

En cours d'écriture. Quand l'article est publié, passe le \`status\` à \`published\` et déplace manuellement dans la section Publiées.

${sections.chosen.length === 0 ? '*(aucune)*' : sections.chosen.map(formatEntry).join('\n')}

---

## ✅ Publiées (${sections.published.length})

${sections.published.length === 0 ? '*(aucune)*' : sections.published.map(formatEntry).join('\n')}

---

## 🗑️ Rejetées (${sections.rejected.length})

Auto-rejetées après ${REJECT_AFTER_DAYS} jours sans être choisies, ou manuellement.

${sections.rejected.length === 0 ? '*(aucune)*' : sections.rejected.map(formatEntry).join('\n')}
`;
  return body;
}

// --- Main ---

async function getExistingTitles() {
  try {
    const files = await readdir(PATHS.articles);
    const titles = [];
    for (const f of files.filter(f => f.endsWith('.html'))) {
      const html = await readFile(path.join(PATHS.articles, f), 'utf8');
      const t = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
      if (t) titles.push(t);
    }
    return titles;
  } catch { return []; }
}

async function main() {
  log.section('🧠 Brainstorm · collecte signaux externes');

  // 1. Fetch sources en parallèle
  const ytCache = await loadYtCache();
  const googleNewsRss = googleNewsFeeds(GOOGLE_NEWS_KEYWORDS);
  const fetches = [
    ...SUBREDDITS.map(s => fetchReddit(s)),
    ...HN_QUERIES.map(q => fetchHN(q)),
    ...RSS_FEEDS.map(f => fetchRSS(f)),
    ...googleNewsRss.map(f => fetchRSS(f)),
    ...GITHUB_QUERIES.map(q => fetchGitHub(q)),
    ...YT_CHANNELS.map(c => fetchYouTube(c, ytCache)),
  ];
  const results = await Promise.all(fetches);
  await saveYtCache(ytCache); // sauve les channelId résolus
  const allItems = results.flat();

  // Log par source
  const bySource = {};
  for (const it of allItems) {
    bySource[it.source] = (bySource[it.source] || 0) + 1;
  }
  for (const [src, n] of Object.entries(bySource)) {
    log.ok(`${src} : ${n} items`);
  }
  log.info(`Total brut : ${allItems.length} items collectés`);

  // 2. Clusterise les titres similaires
  const clusters = cluster(allItems);
  log.ok(`${clusters.length} clusters après déduplication`);

  // 3. Scoring · inclut détection de cluster éditorial + multiplicateur
  const existingTitles = await getExistingTitles();
  const scored = [];
  for (const c of clusters) {
    const demand = scoreDemand({ raw_engagement: c.raw_engagement });
    const relevance = scoreRelevance({ title: c.title });
    const evergreen = scoreEvergreen({ title: c.title });
    const vecu = 5; // neutre, à ajuster par Jérémy
    const gap = await scoreGap({ title: c.title }, existingTitles);
    const scores = { demand, relevance, evergreen, vecu, gap };
    const baseScore = computeFinalScore(scores);

    // Détection cluster éditorial Jérémy
    const cluster = detectCluster(c.title);
    const multiplier = cluster ? cluster.multiplier : NO_CLUSTER_MULTIPLIER;
    // Boost chaîne YouTube (si applicable) : 1.0 par défaut, jusqu'à 1.15 pour les chaînes-phares
    const channelBoost = c.channel_boost || 1.0;
    const finalScore = Math.round(baseScore * multiplier * channelBoost * 10) / 10;

    // Filtres :
    //  - dans cluster : score ≥ 5 ET pertinence ≥ 4
    //  - hors cluster : score ≥ 7 (gros engagement requis pour passer sans cluster)
    const passesClusterThreshold = cluster
      ? (finalScore >= 5 && relevance >= 4)
      : (finalScore >= 7 && relevance >= 5);

    if (passesClusterThreshold) {
      scored.push({
        title: c.title,
        id: slug(c.title).slice(0, 50),
        score: finalScore,
        baseScore,
        multiplier,
        cluster: cluster ? cluster.id : null,
        scores,
        sources: c.sources,
        urls: c.urls,
        count: c.count,
        created: c.created,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);

  // Stats par cluster
  const byCluster = {};
  for (const s of scored) {
    const k = s.cluster || 'autre';
    byCluster[k] = (byCluster[k] || 0) + 1;
  }
  log.ok(`${scored.length} idées scorées · répartition :`);
  for (const [k, n] of Object.entries(byCluster).sort((a,b) => b[1] - a[1])) {
    const cl = CLUSTERS.find(c => c.id === k);
    const label = cl ? `${cl.icon} ${cl.label}` : '(hors cluster)';
    console.log(`    ${label.padEnd(32)} ${n}`);
  }

  // 4. Charge BACKLOG existant
  let existingBacklog = { proposed: [], chosen: [], published: [], rejected: [] };
  if (existsSync(PATHS.backlog)) {
    existingBacklog = parseBacklog(await readFile(PATHS.backlog, 'utf8'));
  }

  // 5. Auto-reject les proposées > REJECT_AFTER_DAYS
  const cutoff = new Date(Date.now() - REJECT_AFTER_DAYS * 24 * 3600 * 1000);
  const stillProposed = [];
  const autoRejected = [];
  for (const p of existingBacklog.proposed) {
    const proposedDate = new Date(p.proposed);
    if (proposedDate < cutoff) {
      autoRejected.push({ ...p, status: 'rejected' });
    } else {
      stillProposed.push(p);
    }
  }
  if (autoRejected.length > 0) log.info(`${autoRejected.length} idée(s) auto-rejetée(s) (> ${REJECT_AFTER_DAYS}j)`);

  // 6. Ajoute nouvelles idées (pas déjà dans proposed/chosen/published)
  const existingIds = new Set([
    ...stillProposed.map(p => p.id),
    ...existingBacklog.chosen.map(p => p.id),
    ...existingBacklog.published.map(p => p.id),
  ]);
  const existingTitlesLower = new Set([
    ...stillProposed, ...existingBacklog.chosen, ...existingBacklog.published, ...existingBacklog.rejected
  ].map(p => p.title.toLowerCase()));

  const today = new Date().toISOString().slice(0, 10);
  const added = [];
  for (const s of scored.slice(0, TOP_N)) {
    // Check anti-doublon par id OU par titre similaire
    if (existingIds.has(s.id)) continue;
    let alreadySimilar = false;
    for (const t of existingTitlesLower) {
      if (jaccard(s.title, t) > 0.5) { alreadySimilar = true; break; }
    }
    if (alreadySimilar) continue;

    const entry = {
      score: s.score,
      title: s.title,
      id: s.id,
      status: 'proposed',
      proposed: today,
      cluster: s.cluster || 'autre',
      multiplier: s.multiplier,
      scores: `demande ${s.scores.demand} · pertinence ${s.scores.relevance} · evergreen ${s.scores.evergreen} · vécu ${s.scores.vecu} · gap ${s.scores.gap}${s.multiplier !== 1 ? ` · ×${s.multiplier}` : ''}`,
      angle: '(à compléter manuellement quand tu choisis)',
      sources: s.urls.map(u => {
        const host = new URL(u).hostname.replace(/^www\./, '');
        // Label enrichi pour YouTube : "YouTube · Nom chaîne" si on trouve le channel dans les sources du cluster
        if (host === 'youtube.com') {
          const ytSource = s.sources.find(src => src.startsWith('youtube/'));
          if (ytSource) return `[YouTube · ${ytSource.replace('youtube/', '')}](${u})`;
        }
        return `[${host}](${u})`;
      }).join(' · '),
    };
    added.push(entry);
  }

  // 7. Limite la taille du backlog proposed à MAX_BACKLOG
  const mergedProposed = [...added, ...stillProposed]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_BACKLOG);

  const newBacklog = {
    proposed: mergedProposed,
    chosen: existingBacklog.chosen,
    published: existingBacklog.published,
    rejected: [...autoRejected, ...existingBacklog.rejected].slice(0, 50),
  };

  await writeFile(PATHS.backlog, writeBacklog(newBacklog), 'utf8');
  log.ok(`BACKLOG.md — ${added.length} nouvelle(s) idée(s) ajoutée(s)`);

  // 8. Affichage top 5 avec cluster
  log.section('🏆 Top 10 propositions');
  for (const e of mergedProposed.slice(0, 10)) {
    const cl = CLUSTERS.find(c => c.id === e.cluster);
    const tag = cl ? `${cl.icon} ${cl.label.split(' ')[0]}` : '❔ autre';
    console.log(`  \x1b[1m[${e.score.toFixed(1)}]\x1b[0m  ${tag.padEnd(22)}  ${truncate(e.title, 78)}`);
  }

  log.section('✨ Suite');
  log.info(`Ouvre BACKLOG.md → édite le \`status\` en \`chosen\` sur ton article préféré`);
  log.info(`Ajuste le champ \`Angle suggéré\` pour préciser ton angle perso`);
  log.info(`Puis demande à Claude Code : "écris le draft pour l'article <id> du BACKLOG"`);
}

main().catch((e) => {
  log.err(e.message);
  if (process.env.DEBUG) console.error(e.stack);
  process.exit(1);
});
