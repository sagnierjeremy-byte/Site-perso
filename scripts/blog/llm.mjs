/**
 * llm.mjs — Adaptateur LLM minimal pour le système de blog auto.
 *
 * Charge .env.local, expose gemini() et claude(), + un helper pickGenerator()
 * qui choisit Claude si la clé est là (voix calibrée), sinon Gemini (gratuit).
 *
 * Zéro dépendance externe : appels REST via fetch natif (Node 20+).
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

// ── charge .env.local dans process.env (sans écraser l'existant) ──
let _loaded = false;
async function loadEnv() {
  if (_loaded) return;
  _loaded = true;
  const p = path.join(ROOT, '.env.local');
  if (!existsSync(p)) return;
  const raw = await readFile(p, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v] = m;
    if (!process.env[k]) process.env[k] = v.replace(/^["']|["']$/g, '');
  }
}

// ── retry avec backoff sur 429/500/503 (tier gratuit = pics de charge) ──
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function withRetry(label, doFetch, { tries = 5, base = 2000 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await doFetch();
      if (res.ok) return await res.json();
      const status = res.status;
      const txt = (await res.text()).slice(0, 300);
      if (status === 429 || status === 500 || status === 503) {
        lastErr = new Error(`${label} ${status} : ${txt}`);
        const wait = base * Math.pow(2, i) + Math.random() * 800;
        process.stderr.write(`  ⟳ ${label} ${status}, retry ${i + 1}/${tries} dans ${Math.round(wait/1000)}s…\n`);
        await sleep(wait);
        continue;
      }
      throw new Error(`${label} ${status} : ${txt}`); // 4xx non-retryable
    } catch (e) {
      lastErr = e;
      if (i === tries - 1) break;
      if (!/\b(429|500|503|fetch failed|ECONNRESET|ETIMEDOUT)\b/.test(e.message)) throw e;
      await sleep(base * Math.pow(2, i));
    }
  }
  throw lastErr;
}

// ── Gemini (REST) ──
export async function gemini(prompt, { model = 'gemini-2.5-flash', system = '', grounding = false, temperature = 0.7, json = false } = {}) {
  await loadEnv();
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY absente (.env.local)');

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature, ...(json ? { responseMimeType: 'application/json' } : {}) },
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  if (grounding) body.tools = [{ google_search: {} }];

  const data = await withRetry('Gemini', () => fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    { method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  ));
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('') || '';
  const sources = (data.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .map(c => c.web?.uri).filter(Boolean);
  return { text, sources, raw: data };
}

// ── Claude (REST) — utilisé seulement si ANTHROPIC_API_KEY présente ──
export async function claude(prompt, { model = 'claude-sonnet-4-6', system = '', temperature = 0.7, max_tokens = 8000 } = {}) {
  await loadEnv();
  const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE; // tolère le secret nommé CLAUDE
  if (!key) throw new Error('ANTHROPIC_API_KEY (ou CLAUDE) absente');

  const data = await withRetry('Claude', () => fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, max_tokens, temperature, ...(system ? { system } : {}), messages: [{ role: 'user', content: prompt }] }),
  }));
  const text = data.content?.map(c => c.text).filter(Boolean).join('') || '';
  return { text, sources: [], raw: data };
}

// ── le bon générateur selon les clés dispo ──
export async function hasClaude() { await loadEnv(); return !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE); }
export async function hasGemini() { await loadEnv(); return !!process.env.GEMINI_API_KEY; }

// Mapping tier → modèle réel par provider (évite de passer un nom Claude à Gemini)
const TIER = {
  seo:      { claude: 'claude-sonnet-4-6', gemini: 'gemini-2.5-flash' },
  makingof: { claude: 'claude-opus-4-8',   gemini: 'gemini-2.5-pro'   },
};

/** Génère avec Claude si dispo (voix), sinon Gemini (gratuit). opts.tier = 'seo'|'makingof'. */
export async function generate(prompt, { tier = 'seo', ...opts } = {}) {
  const map = TIER[tier] || TIER.seo;
  if (await hasClaude()) return { provider: 'claude', ...(await claude(prompt, { ...opts, model: map.claude })) };
  return { provider: 'gemini', ...(await gemini(prompt, { ...opts, model: map.gemini })) };
}

/** Juge = Gemini de préférence (cross-family si générateur = Claude ; gratuit). */
export async function judge(prompt, opts = {}) {
  return { provider: 'gemini', ...(await gemini(prompt, { temperature: 0.2, json: true, ...opts })) };
}
