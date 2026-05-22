import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalize, tokenize, jaccard, buildClusters,
  timeBucket, capFifo, STOPWORDS, BUCKET_ORDER,
} from '../scripts/news-helpers.mjs';

test('normalize strips accents and lowercases', () => {
  assert.equal(normalize('Été à Paris'), 'ete a paris');
  assert.equal(normalize('  héllo  '), 'hello');
  assert.equal(normalize(null), '');
});

test('tokenize filters stopwords and short words', () => {
  const tokens = tokenize('Comment OpenAI a lancé GPT-5 hier');
  assert.deepEqual(new Set(tokens), new Set(['openai', 'lance', 'gpt', 'hier']));
});

test('STOPWORDS contains common FR + EN words', () => {
  assert.ok(STOPWORDS.has('the'));
  assert.ok(STOPWORDS.has('avec'));
  assert.ok(!STOPWORDS.has('openai'));
});

test('jaccard returns 0 for disjoint, 1 for identical', () => {
  assert.equal(jaccard(new Set(['a']), new Set(['b'])), 0);
  assert.equal(jaccard(new Set(['a', 'b']), new Set(['a', 'b'])), 1);
  assert.equal(jaccard(new Set(), new Set()), 0);
});

test('buildClusters detects 3+ source clusters', () => {
  const articles = [
    { title: 'OpenAI lance GPT-5 contexte étendu',    sourceName: 'TechCrunch' },
    { title: 'GPT-5 contexte étendu OpenAI nouveauté', sourceName: 'Numerama' },
    { title: 'OpenAI GPT-5 contexte étendu annonce',   sourceName: 'The Verge' },
    { title: 'Anthropic lève 5 milliards de dollars',  sourceName: 'Wired' },
  ];
  const clusters = buildClusters(articles);
  assert.equal(clusters.length, 1);
  assert.equal(clusters[0].sourceCount, 3);
});

test('buildClusters requires unique sources for threshold', () => {
  // 3 articles, but only 2 distinct sources → no cluster
  const articles = [
    { title: 'OpenAI lance GPT-5 contexte étendu', sourceName: 'TechCrunch' },
    { title: 'OpenAI GPT-5 contexte étendu',       sourceName: 'TechCrunch' },
    { title: 'OpenAI GPT-5 contexte annonce',      sourceName: 'Numerama' },
  ];
  const clusters = buildClusters(articles);
  assert.equal(clusters.length, 0);
});

test('timeBucket categorizes correctly', () => {
  const now = new Date('2026-05-22T15:00:00Z');
  assert.equal(timeBucket('2026-05-22T10:00:00Z', now), 'today');
  assert.equal(timeBucket('2026-05-21T12:00:00Z', now), 'yesterday');
  assert.equal(timeBucket('2026-05-18T12:00:00Z', now), 'this_week');
  assert.equal(timeBucket('2026-05-10T12:00:00Z', now), 'older');
  assert.equal(timeBucket(null, now), 'older');
  assert.equal(timeBucket('not-a-date', now), 'older');
});

test('BUCKET_ORDER is today, yesterday, this_week, older', () => {
  assert.deepEqual(BUCKET_ORDER, ['today', 'yesterday', 'this_week', 'older']);
});

test('capFifo keeps last N items', () => {
  assert.deepEqual(capFifo([1, 2, 3, 4, 5], 3), [3, 4, 5]);
  assert.deepEqual(capFifo([1, 2, 3], 5), [1, 2, 3]);
  assert.deepEqual(capFifo([], 3), []);
});
