// Helpers purs pour les scripts podcast + tests node:test.
// Run : npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';

export function formatDurationMMSS(seconds) {
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function formatDurationHHMMSS(seconds) {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

export function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// RFC 2822 date format for RSS <pubDate>
export function rfc2822Date(isoString) {
  const d = new Date(isoString);
  return d.toUTCString();
}

export function accentColorToCss(name) {
  const map = {
    fuchsia: { c1: '#EF426F', c2: '#EF426F', c3: '#FF8200' },
    orange: { c1: '#00B2A9', c2: '#FF8200', c3: '#FF8200' },
    teal: { c1: '#00B2A9', c2: '#00B2A9', c3: '#EF426F' },
    'fuchsia-teal': { c1: '#EF426F', c2: '#00B2A9', c3: '#EF426F' },
    serie: { c1: '#00B2A9', c2: '#EF426F', c3: '#FF8200' },
  };
  return map[name] || map.serie;
}

// === Tests ===
test('formatDurationMMSS handles 17m16s', () => {
  assert.equal(formatDurationMMSS(1036), '17:16');
});

test('formatDurationHHMMSS < 1h returns MM:SS zero-padded', () => {
  assert.equal(formatDurationHHMMSS(1036), '17:16');
});

test('formatDurationHHMMSS > 1h returns HH:MM:SS', () => {
  assert.equal(formatDurationHHMMSS(3725), '01:02:05');
});

test('escapeXml protects all 5 chars', () => {
  assert.equal(escapeXml(`a&b<c>d"e'f`), 'a&amp;b&lt;c&gt;d&quot;e&apos;f');
});

test('escapeHtml does not double-escape', () => {
  assert.equal(escapeHtml('&amp;'), '&amp;amp;');
});

test('rfc2822Date returns GMT format', () => {
  const result = rfc2822Date('2026-04-22T09:00:00+02:00');
  assert.match(result, /^Wed, 22 Apr 2026/);
  assert.match(result, /GMT$/);
});

test('accentColorToCss fuchsia returns 3 hex colors', () => {
  const { c1, c2, c3 } = accentColorToCss('fuchsia');
  assert.ok(c1.startsWith('#') && c1.length === 7);
  assert.ok(c2.startsWith('#') && c2.length === 7);
  assert.ok(c3.startsWith('#') && c3.length === 7);
});

test('accentColorToCss unknown name falls back to serie', () => {
  const result = accentColorToCss('unknown-name');
  assert.deepEqual(result, accentColorToCss('serie'));
});
