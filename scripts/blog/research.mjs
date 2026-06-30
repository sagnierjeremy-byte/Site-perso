#!/usr/bin/env node
/**
 * research.mjs — Étape 1 du pipeline : un sujet → un brief de recherche grounded.
 *
 * Utilise Gemini + Google Search grounding natif (gratuit) pour rassembler
 * des faits DATÉS et SOURCÉS, qui serviront de socle anti-hallucination à la
 * génération (le générateur n'a le droit d'affirmer que ce qui est dans le brief).
 *
 * Usage : node scripts/blog/research.mjs "<sujet>" [--type=A|B] [--out=research/<slug>.json]
 * Sortie : un JSON { topic, type, angle, intent, keywords, facts[], sources[], internal_links[] }
 */

import { writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gemini } from './llm.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const topic = process.argv[2];
const type = (process.argv.find(a => a.startsWith('--type=')) || '--type=A').split('=')[1].toUpperCase();
const outArg = (process.argv.find(a => a.startsWith('--out=')) || '').split('=')[1];
if (!topic) { console.error('Usage : node scripts/blog/research.mjs "<sujet>" [--type=A|B]'); process.exit(2); }

const slug = (outArg ? path.basename(outArg, '.json') : topic)
  .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// Liste des articles + fiches lexique existants → suggestions de maillage interne
async function existingSlugs() {
  const out = [];
  try { (await readdir(path.join(ROOT, 'articles'))).filter(f => f.endsWith('.html') && !f.startsWith('_')).forEach(f => out.push('/articles/' + f.replace('.html', ''))); } catch {}
  try { (await readdir(path.join(ROOT, 'lexique'))).filter(f => f.endsWith('.html') && !f.startsWith('_')).forEach(f => out.push('/lexique/' + f.replace('.html', ''))); } catch {}
  return out;
}

const internal = await existingSlugs();

const prompt = `Tu es un assistant de recherche éditoriale pour le blog jerwis.fr (IA pour entrepreneurs non-développeurs, en français).

SUJET À RECHERCHER : "${topic}"
TYPE : ${type === 'B' ? 'B — making-of d\'un projet vécu (récit, pas SEO pur)' : 'A — article SEO sur un mot-clé recherché'}

Ta mission : rassembler la MATIÈRE FACTUELLE pour écrire cet article, en t'appuyant sur des sources web réelles et récentes (2025-2026). NE rédige PAS l'article. Donne-moi un brief.

Réponds UNIQUEMENT en JSON valide, sans texte autour, au format :
{
  "angle": "l'angle éditorial en 1 phrase (ce qui rend l'article utile et différent)",
  "intent": "l'intention de recherche du lecteur (ce qu'il veut vraiment savoir)",
  "keywords": ["mot-clé principal", "3-5 variantes longue traîne"],
  "facts": [
    {"claim": "un fait précis, daté si possible", "source_url": "https://...", "date": "2026 ou AAAA-MM si connu"}
  ],
  "stats": [
    {"stat": "une statistique chiffrée + son contexte", "source_url": "https://...", "date": "AAAA"}
  ],
  "internal_links": [
    {"url": "/articles/... ou /lexique/...", "why": "pourquoi lier ici"}
  ],
  "outline": ["H2 proposé 1", "H2 proposé 2", "..."],
  "faq": ["question fréquente 1", "question 2", "..."],
  "pitfalls": ["piège factuel ou nuance à ne pas rater"]
}

Règles :
- 6 à 12 "facts" solides, chacun avec une source web réelle. Si tu n'es pas sûr d'un fait, ne l'inclus PAS.
- FRAÎCHEUR — pour CHAQUE outil, modèle ou app que l'article devra citer (ChatGPT, Gemini, Midjourney, Claude, etc.), inclus un "fact" dédié donnant sa DERNIÈRE version connue à ce jour + sa date de sortie (ex. {"claim":"Midjourney V8.1 est la version par défaut depuis juin 2026","source_url":"...","date":"2026-06"}). Vérifie via la recherche, ne te fie pas à ta mémoire : c'est ce qui évite de recommander une version périmée.
- Au moins 2 "stats" chiffrées + sourcées + datées (levier de citation par les IA).
- "internal_links" : choisis 3-6 URLs PERTINENTES parmi cette liste de pages existantes du site (ne les invente pas) :
${internal.slice(0, 120).join(', ')}
- "outline" : 4-7 sections H2 logiques.
- "faq" : 4-6 vraies questions que se pose un entrepreneur non-dev.
- Français, factuel, daté.`;

console.error(`• Recherche Gemini (grounding) sur : "${topic}" …`);
const { text, sources } = await gemini(prompt, { grounding: true, temperature: 0.4, model: 'gemini-2.5-flash' });

// Parse le JSON (tolère un éventuel fence ```json)
let brief;
try {
  const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  brief = JSON.parse(clean);
} catch (e) {
  console.error('⚠️ Réponse non-JSON, dump brut :');
  console.error(text.slice(0, 800));
  process.exit(1);
}

// Fusionne les sources de grounding Gemini avec celles citées dans les facts
const allSources = [...new Set([
  ...sources,
  ...(brief.facts || []).map(f => f.source_url).filter(Boolean),
  ...(brief.stats || []).map(s => s.source_url).filter(Boolean),
])];

const result = { topic, slug, type, generated_at: new Date().toISOString().slice(0, 10), ...brief, grounding_sources: allSources };

const outDir = path.join(ROOT, 'research');
await mkdir(outDir, { recursive: true });
const outPath = outArg ? path.join(ROOT, outArg) : path.join(outDir, `${slug}.json`);
await writeFile(outPath, JSON.stringify(result, null, 2), 'utf8');

console.error(`✓ Brief écrit : ${path.relative(ROOT, outPath)}`);
console.error(`  ${(brief.facts || []).length} faits · ${(brief.stats || []).length} stats · ${allSources.length} sources · ${(brief.internal_links || []).length} liens internes`);
console.log(outPath);
