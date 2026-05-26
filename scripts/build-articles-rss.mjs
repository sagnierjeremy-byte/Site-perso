#!/usr/bin/env node
// Génère feed/articles.xml (RSS 2.0) à partir de articles/*.html.
// Source de vérité par article : <title>, <link rel="canonical">,
// <meta name="description">, et "datePublished" du JSON-LD.
// Usage : node scripts/build-articles-rss.mjs  (ou npm run articles:rss)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "articles");
const OUTPUT = path.join(ROOT, "feed", "articles.xml");

const SITE = "https://jerwis.fr";
const FEED_TITLE = "Jerwis — Articles & tutos IA";
const FEED_DESC =
  "Les tutos, opinions et making-of de Jérémy Sagnier sur l'IA, Claude Code et les agents. Ce que je teste et ce qui m'a servi.";
const AUTHOR = "Jérémy Sagnier";

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function cleanTitle(raw) {
  if (!raw) return null;
  // Strip d'éventuelles balises inline dans le <title> (ex: <a class="lex-link">)
  const stripped = raw.replace(/<[^>]+>/g, "");
  // Retire les suffixes de marque : " · Jerwis", " | Jerwis", " — Jerwis"
  return stripped.replace(/\s*[·|—-]\s*Jerwis.*$/i, "").trim();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(dateStr) {
  const d = new Date(dateStr + "T09:00:00+02:00");
  return isNaN(d) ? new Date().toUTCString() : d.toUTCString();
}

export function buildArticlesRss() {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".html") && f !== "_TEMPLATE.html");

  const items = [];
  for (const f of files) {
    const html = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
    const canonical =
      pick(html, /<link rel="canonical"[^>]*href="([^"]+)"/i) ||
      `${SITE}/articles/${f.replace(".html", "")}`;
    const title = cleanTitle(
      decodeEntities(pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || "")
    );
    const description = decodeEntities(
      pick(html, /<meta name="description"[^>]*content="([^"]+)"/i) || ""
    );
    const datePublished = pick(html, /"datePublished":\s*"([^"]+)"/);
    if (!title || !datePublished) {
      console.warn(`[rss] skip ${f} (title ou datePublished manquant)`);
      continue;
    }
    items.push({ canonical, title, description, datePublished });
  }

  items.sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  const lastBuild = items.length ? rfc822(items[0].datePublished) : new Date().toUTCString();
  const itemsXml = items
    .map(
      (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.canonical)}</link>
      <guid isPermaLink="true">${escapeXml(it.canonical)}</guid>
      <description>${escapeXml(it.description)}</description>
      <pubDate>${rfc822(it.datePublished)}</pubDate>
      <dc:creator>${escapeXml(AUTHOR)}</dc:creator>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE}/articles</link>
    <atom:link href="${SITE}/feed/articles.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESC)}</description>
    <language>fr</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${itemsXml}
  </channel>
</rss>
`;

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, xml);
  console.log(`feed/articles.xml généré · ${items.length} articles`);
  return items.length;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildArticlesRss();
}
