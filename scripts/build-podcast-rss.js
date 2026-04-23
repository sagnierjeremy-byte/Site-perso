// Génère feed/podcast.xml conforme iTunes/Apple Podcasts depuis data/episodes.json
// Usage : npm run podcast:rss

import fs from 'node:fs';
import path from 'node:path';
import { escapeXml, rfc2822Date, formatDurationHHMMSS } from './test-helpers.js';

const ROOT = process.cwd();
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/episodes.json'), 'utf8'));
const OUT = path.join(ROOT, 'feed/podcast.xml');
const SITE = 'https://jerwis.fr';

function episodeItem(ep) {
  const title = `Épisode ${ep.id} · ${ep.title}`;
  const guid = `jerwis-podcast-ep-${ep.id}`;
  return `
    <item>
      <title>${escapeXml(title)}</title>
      <description><![CDATA[${ep.description_long}]]></description>
      <itunes:summary><![CDATA[${ep.description_long}]]></itunes:summary>
      <itunes:subtitle>${escapeXml(ep.description_short)}</itunes:subtitle>
      <itunes:duration>${formatDurationHHMMSS(ep.duration_seconds)}</itunes:duration>
      <itunes:image href="${SITE}${ep.cover_3000}"/>
      <itunes:episode>${Number(ep.id)}</itunes:episode>
      <itunes:season>${DATA.series.season}</itunes:season>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>${DATA.series.explicit ? 'true' : 'false'}</itunes:explicit>
      <enclosure url="${escapeXml(ep.audio_url)}" length="${ep.audio_size_bytes}" type="audio/mpeg"/>
      <pubDate>${rfc2822Date(ep.published)}</pubDate>
      <guid isPermaLink="false">${guid}</guid>
      <link>${SITE}/podcast.html#${ep.slug}</link>
    </item>`;
}

function categoriesXml(cats) {
  // Apple supporte catégories + sous-catégories
  return cats.map((c) => `<itunes:category text="${escapeXml(c)}"/>`).join('\n    ');
}

const s = DATA.series;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(s.title)}</title>
    <link>${s.site_url}</link>
    <language>${s.language}</language>
    <copyright>${escapeXml(s.copyright)}</copyright>
    <description>${escapeXml(s.description_long)}</description>
    <itunes:author>${escapeXml(s.author)}</itunes:author>
    <itunes:owner>
      <itunes:name>${escapeXml(s.publisher)}</itunes:name>
      <itunes:email>${escapeXml(s.owner_email)}</itunes:email>
    </itunes:owner>
    <itunes:image href="${SITE}${s.cover_3000}"/>
    ${categoriesXml(s.categories_itunes)}
    <itunes:explicit>${s.explicit ? 'true' : 'false'}</itunes:explicit>
    <itunes:type>${s.itunes_type}</itunes:type>
    <itunes:summary>${escapeXml(s.description_long)}</itunes:summary>
    <itunes:subtitle>${escapeXml(s.description_short)}</itunes:subtitle>
    <atom:link href="${s.feed_url}" rel="self" type="application/rss+xml"/>
${DATA.episodes.map(episodeItem).join('\n')}
  </channel>
</rss>
`;

fs.writeFileSync(OUT, xml, 'utf8');
console.log(`[rss] ✓ ${OUT} (${xml.length} chars, ${DATA.episodes.length} épisodes)`);
