// scripts/news-helpers.mjs
// Pure helper functions shared between scripts/build-news-summary.js (cron)
// and tests/news.test.mjs. No DOM, no fetch — pure functions only.
//
// /!\ These helpers are also duplicated inline in assets/news-page.js
// (browser runtime). Keep them in sync. Tests import from this file.

export function normalize(s) {
  if (s == null) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // strip accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const STOPWORDS = new Set([
  // FR
  'avec','sans','sous','sur','pour','dans','mais','comment','pourquoi','quand',
  'quel','quels','quelle','quelles','cette','cet','ces','son','ses','leur','leurs',
  'plus','moins','aussi','tout','tous','toute','toutes','rien','tres','aux',
  'qui','que','quoi','dont','ainsi','lui','elle','ils','elles','nous','vous',
  'des','les','une','est','sont','etre','par','pas','peu',
  // EN
  'the','and','for','with','this','that','from','have','has','was','were',
  'are','will','would','could','should','can','may','about','into','than',
  'just','very','also','only','then','when','where','what','how','why','its',
  'new','old','one','two','top','any','all','our','your','their','his','her',
]);

export function tokenize(title) {
  return normalize(title)
    .split(' ')
    .filter(w => w.length >= 3 && !STOPWORDS.has(w));
}

export function jaccard(setA, setB) {
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

const SIM_THRESHOLD = 0.35;
const MIN_COMMON   = 3;

export function buildClusters(articles, opts = {}) {
  const minSources = opts.minSources ?? 3;
  const tokensArr = articles.map(a => new Set(tokenize(a.title)));
  const visited = new Array(articles.length).fill(false);
  const clusters = [];

  for (let i = 0; i < articles.length; i++) {
    if (visited[i]) continue;
    const indices = [i];
    visited[i] = true;
    for (let j = i + 1; j < articles.length; j++) {
      if (visited[j]) continue;
      let inter = 0;
      for (const t of tokensArr[i]) if (tokensArr[j].has(t)) inter++;
      if (inter >= MIN_COMMON && jaccard(tokensArr[i], tokensArr[j]) >= SIM_THRESHOLD) {
        indices.push(j);
        visited[j] = true;
      }
    }
    const uniqSources = new Set(indices.map(idx => articles[idx].sourceName));
    if (uniqSources.size >= minSources) {
      clusters.push({ indices, sourceCount: uniqSources.size });
    }
  }
  clusters.sort((a, b) => b.sourceCount - a.sourceCount);
  return clusters;
}

export function timeBucket(publishedAt, now = new Date()) {
  if (!publishedAt) return 'older';
  const d = new Date(publishedAt);
  if (isNaN(d.getTime())) return 'older';
  const startToday     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday.getTime() - 24*3600*1000);
  const startWeek      = new Date(startToday.getTime() - 7*24*3600*1000);
  if (d >= startToday)     return 'today';
  if (d >= startYesterday) return 'yesterday';
  if (d >= startWeek)      return 'this_week';
  return 'older';
}

export const BUCKET_LABELS = {
  today:     'Aujourd\'hui',
  yesterday: 'Hier',
  this_week: 'Cette semaine',
  older:     'Plus ancien',
};
export const BUCKET_ORDER = ['today', 'yesterday', 'this_week', 'older'];

export function capFifo(arr, max) {
  if (arr.length <= max) return arr;
  return arr.slice(arr.length - max);
}
