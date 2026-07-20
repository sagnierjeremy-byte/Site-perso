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

// ── retry avec backoff sur 429/5xx (tier gratuit = pics de charge ; 529 = Anthropic overloaded) ──
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function withRetry(label, doFetch, { tries = 5, base = 2000 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await doFetch();
      if (res.ok) return await res.json();
      const status = res.status;
      const txt = (await res.text()).slice(0, 300);
      if (status === 429 || status === 500 || status === 502 || status === 503 || status === 529) {
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
      if (!/\b(429|500|502|503|529|fetch failed|ECONNRESET|ETIMEDOUT)\b/.test(e.message)) throw e;
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

// ── OpenRouter (REST, API OpenAI-compatible) — juges + fallback génération ──
// Kimi K2.6 : ~0,66 $/M in · 3,41 $/M out, 262k contexte. Coût juge ≈ 0,03 $/appel.
const OPENROUTER_JUDGE_MODEL = 'moonshotai/kimi-k2.6';
export async function openrouter(prompt, { model = OPENROUTER_JUDGE_MODEL, system = '', temperature = 0.7, max_tokens = 8000, json = false } = {}) {
  await loadEnv();
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY absente (.env.local)');

  const messages = [...(system ? [{ role: 'system', content: system }] : []), { role: 'user', content: prompt }];
  const data = await withRetry('OpenRouter', () => fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://jerwis.fr', 'X-Title': 'jerwis blog autopilot' },
    body: JSON.stringify({ model, temperature, max_tokens, ...(json ? { response_format: { type: 'json_object' } } : {}), messages }),
  }));
  const choice = data.choices?.[0];
  const text = choice?.message?.content || '';
  if (!text) throw new Error(`OpenRouter réponse vide (finish: ${choice?.finish_reason || '?'} ; ${data.error?.message || 'sans détail'})`);
  return { text, sources: [], raw: data };
}

// ── le bon générateur selon les clés dispo ──
export async function hasClaude() { await loadEnv(); return !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE); }
export async function hasGemini() { await loadEnv(); return !!process.env.GEMINI_API_KEY; }
export async function hasOpenRouter() { await loadEnv(); return !!process.env.OPENROUTER_API_KEY; }

// Mapping tier → modèle réel par provider (évite de passer un nom Claude à Gemini)
const TIER = {
  seo:      { claude: 'claude-sonnet-4-6', gemini: 'gemini-2.5-flash' },
  makingof: { claude: 'claude-opus-4-8',   gemini: 'gemini-2.5-pro'   },
};

/** Génère avec Claude si dispo (voix), sinon Gemini (gratuit).
 *  Si Claude tombe malgré les retries (529 Overloaded…), fallback OpenRouter (Kimi K2.6). */
export async function generate(prompt, { tier = 'seo', ...opts } = {}) {
  const map = TIER[tier] || TIER.seo;
  if (await hasClaude()) {
    try {
      return { provider: 'claude', ...(await claude(prompt, { ...opts, model: map.claude })) };
    } catch (e) {
      if (!(await hasOpenRouter())) throw e;
      process.stderr.write(`  ⟳ Claude KO après retries (${e.message.slice(0, 80)}) → fallback OpenRouter Kimi K2.6…\n`);
      return { provider: 'openrouter', ...(await openrouter(prompt, { ...opts, model: OPENROUTER_JUDGE_MODEL })) };
    }
  }
  return { provider: 'gemini', ...(await gemini(prompt, { ...opts, model: map.gemini })) };
}

/** Juge = OpenRouter (Kimi K2.6, cross-family vs générateur Claude, fiable) si clé dispo,
 *  sinon Gemini (gratuit mais free tier fragile). Fallback croisé en cas de panne. */
export async function judge(prompt, opts = {}) {
  if (await hasOpenRouter()) {
    const { model: _geminiModel, ...rest } = opts; // le model passé par qa-gate est un nom Gemini
    // 2 essais : Kimi K2.6 réfléchit avant de répondre → sur un gros prompt, un budget
    // trop court peut rendre un content vide (finish: length). 16k tokens + retry absorbent ça.
    for (let i = 1; i <= 2; i++) {
      try {
        return { provider: 'openrouter', ...(await openrouter(prompt, { ...rest, model: OPENROUTER_JUDGE_MODEL, temperature: 0.2, json: true, max_tokens: 16000 })) };
      } catch (e) {
        process.stderr.write(`  ⟳ Juge OpenRouter KO ${i}/2 (${e.message.slice(0, 80)})${i === 2 ? ' → fallback Gemini…' : ''}\n`);
      }
    }
  }
  return { provider: 'gemini', ...(await gemini(prompt, { temperature: 0.2, json: true, ...opts })) };
}
