#!/usr/bin/env node
/**
 * admin-server.js — Back-office local Jérémy Sagnier
 *
 * Usage : npm run admin  →  http://localhost:3001
 *
 * Architecture modules :
 *   /admin/                       → redirect dashboard
 *   /admin/modules/<id>/          → sert admin/modules/<id>/page.html
 *   /admin/shared/*               → CSS/JS partagés
 *   /admin/modules.json           → registre des modules
 *
 * API :
 *   GET  /api/modules             → registre modules
 *   GET  /api/stats               → stats globales (backlog + drafts + articles)
 *   GET  /api/backlog             → idées
 *   POST /api/backlog/:id/status  → change status
 *   POST /api/brainstorm          → lance brainstorm.js
 *   GET  /api/drafts              → liste drafts
 *   GET  /api/drafts/:slug        → contenu draft
 *   PUT  /api/drafts/:slug        → édite draft
 *   POST /api/drafts/:slug/preview → render markdown → HTML
 *   POST /api/publish/:slug       → lance publish.js
 *   GET  /api/articles            → liste articles
 *   GET  /api/newsletter/stats    → stats Resend/Brevo
 *   GET  /api/newsletter/contacts → liste contacts
 */

import http from 'node:http';
import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';
import matter from 'gray-matter';
import { marked } from 'marked';
import { CLUSTERS, getClusterById } from './editorial-clusters.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PORT = 3001;

const PATHS = {
  admin:       path.join(ROOT, 'admin'),
  modulesDir:  path.join(ROOT, 'admin', 'modules'),
  modulesFile: path.join(ROOT, 'admin', 'modules.json'),
  backlog:     path.join(ROOT, 'BACKLOG.md'),
  drafts:      path.join(ROOT, 'drafts'),
  articles:    path.join(ROOT, 'articles'),
  audits:      path.join(ROOT, 'audits'),
  socialDrafts:path.join(ROOT, 'social-drafts'),
  sitemap:     path.join(ROOT, 'sitemap.xml'),
  dataDir:     path.join(ROOT, 'data'),
  calendar:    path.join(ROOT, 'data', 'calendar.json'),
};

const SOCIAL_CHANNELS = ['linkedin', 'twitter'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
};

// Load .env.local si présent (pour RESEND_API_KEY / BREVO_API_KEY)
try {
  const envPath = path.join(ROOT, '.env.local');
  if (existsSync(envPath)) {
    const content = await readFile(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
} catch {}

// ---- Helpers ----
const log = {
  info: (m) => console.log(`\x1b[36m•\x1b[0m ${m}`),
  ok:   (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`),
  warn: (m) => console.log(`\x1b[33m!\x1b[0m ${m}`),
  err:  (m) => console.error(`\x1b[31m×\x1b[0m ${m}`),
};

const sendJSON = (res, data, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};
const sendError = (res, msg, status = 500) => sendJSON(res, { error: msg }, status);

const readBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => { data += chunk; if (data.length > 10 * 1024 * 1024) reject(new Error('body too large')); });
  req.on('end', () => {
    try { resolve(data ? JSON.parse(data) : {}); }
    catch (e) { reject(e); }
  });
  req.on('error', reject);
});

const runScript = (script, args = []) => new Promise((resolve, reject) => {
  const child = spawn('node', [path.join(ROOT, 'scripts', script), ...args], {
    cwd: ROOT,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  let stdout = '', stderr = '';
  child.stdout.on('data', d => { stdout += d.toString(); });
  child.stderr.on('data', d => { stderr += d.toString(); });
  child.on('close', code => {
    if (code === 0) resolve({ stdout, stderr });
    else reject(new Error(`${script} exited ${code}: ${stderr || stdout}`));
  });
});

// ---- BACKLOG parsing/writing ----
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

    const urls = [...raw.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g)].map(m => ({ label: m[1], url: m[2] }));
    const entry = {
      score: parseFloat(titleMatch[1]),
      title: titleMatch[2].trim(),
      id: (raw.match(/\*\*id:\*\*\s*`([^`]+)`/) || [])[1] || '',
      cluster: (raw.match(/\*\*cluster:\*\*\s*`([^`]+)`/) || [])[1] || null,
      status: (raw.match(/\*\*status:\*\*\s*`([^`]+)`/) || [])[1] || current,
      proposed: (raw.match(/\*\*proposed:\*\*\s*([\d-]+)/) || [])[1] || '',
      angle: (raw.match(/\*\*Angle suggéré\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      summary: (raw.match(/\*\*Résumé\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      relevance: (raw.match(/\*\*Pour toi\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      verdict: (raw.match(/\*\*Verdict\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      scores: (raw.match(/\*\*Scores\*\*\s*:\s*(.+?)(?:\n|$)/) || [])[1]?.trim() || '',
      sources: urls,
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
  const sourcesStr = Array.isArray(e.sources)
    ? e.sources.map(s => `[${s.label}](${s.url})`).join(' · ')
    : (e.sources || '');
  const clusterLine = e.cluster ? `**cluster:** \`${e.cluster}\` · ` : '';
  return `### [${e.score.toFixed(1)}] ${e.title}
**id:** \`${e.id}\` · ${clusterLine}**status:** \`${e.status}\` · **proposed:** ${e.proposed}
**Scores** : ${e.scores}
**Résumé** : ${e.summary || '—'}
**Pour toi** : ${e.relevance || '—'}
**Verdict** : ${e.verdict || '—'}
**Angle suggéré** : ${e.angle}
**Sources** : ${sourcesStr}
`;
}

function writeBacklogMarkdown(sections) {
  const now = new Date().toISOString().slice(0, 10);
  return `# BACKLOG d'articles — Jérémy Sagnier

> Auto-généré par \`scripts/brainstorm.js\` · Édité via le back-office \`/admin\` ou directement dans ce fichier.
> Dernière MAJ : ${now}

---

## 📊 Proposées (${sections.proposed.length})

${sections.proposed.length === 0 ? '*(aucune)*' : sections.proposed.map(formatEntry).join('\n')}

---

## ✏️ Choisies (${sections.chosen.length})

${sections.chosen.length === 0 ? '*(aucune)*' : sections.chosen.map(formatEntry).join('\n')}

---

## ✅ Publiées (${sections.published.length})

${sections.published.length === 0 ? '*(aucune)*' : sections.published.map(formatEntry).join('\n')}

---

## 🗑️ Rejetées (${sections.rejected.length})

${sections.rejected.length === 0 ? '*(aucune)*' : sections.rejected.map(formatEntry).join('\n')}
`;
}

async function updateBacklogEntry(id, newStatus) {
  const content = existsSync(PATHS.backlog) ? await readFile(PATHS.backlog, 'utf8') : '';
  const sections = parseBacklog(content);
  let entry = null, fromSection = null;
  for (const sec of Object.keys(sections)) {
    const idx = sections[sec].findIndex(e => e.id === id);
    if (idx !== -1) { entry = sections[sec][idx]; fromSection = sec; sections[sec].splice(idx, 1); break; }
  }
  if (!entry) throw new Error(`id ${id} introuvable dans le backlog`);
  entry.status = newStatus;
  sections[newStatus].push(entry);
  await writeFile(PATHS.backlog, writeBacklogMarkdown(sections), 'utf8');
  return { from: fromSection, to: newStatus, entry };
}

// ---- Newsletter provider (Resend or Brevo) ----
async function fetchNewsletterContacts() {
  // Priorité Brevo si configuré, sinon Resend
  if (process.env.BREVO_API_KEY) {
    return fetchBrevoContacts();
  }
  if (process.env.RESEND_API_KEY) {
    return fetchResendContacts();
  }
  throw new Error('Aucune clé API newsletter configurée (RESEND_API_KEY ou BREVO_API_KEY)');
}

async function fetchResendContacts() {
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || '58ebf8b3-6200-451d-ad82-998c8fd6e483';
  const r = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  if (!r.ok) throw new Error(`Resend API HTTP ${r.status}`);
  const data = await r.json();
  const contacts = (data?.data || []).map(c => ({
    email: c.email,
    firstName: c.first_name || '',
    source: 'resend-audience',
    createdAt: c.created_at,
    unsubscribed: c.unsubscribed || false,
  }));
  return { provider: 'Resend', contacts };
}

async function fetchBrevoContacts() {
  const r = await fetch(`https://api.brevo.com/v3/contacts?limit=500`, {
    headers: { 'api-key': process.env.BREVO_API_KEY, Accept: 'application/json' },
  });
  if (!r.ok) throw new Error(`Brevo API HTTP ${r.status}`);
  const data = await r.json();
  const contacts = (data?.contacts || []).map(c => ({
    email: c.email,
    firstName: (c.attributes && c.attributes.FIRSTNAME) || '',
    source: (c.attributes && c.attributes.SOURCE) || 'direct',
    createdAt: c.createdAt || c.modifiedAt,
    unsubscribed: c.emailBlacklisted || false,
  }));
  return { provider: 'Brevo', contacts };
}

// ---- Social-poster prompt builder ----
function buildSocialPrompt(slug) {
  const now = new Date().toISOString();
  return `Décline l'article \`articles/${slug}.html\` en 2 posts sociaux (LinkedIn + X).

**Objectif capital** : ces posts ne doivent JAMAIS ressembler à de l'IA. 50-61 % des posts LinkedIn FR sont détectés comme IA en 2025, l'algo les pénalise (-36 % de vues). Jérémy écrit comme un ami qui raconte, pas comme un consultant LinkedIn. Pas comme un copain au bar non plus. Entre les deux : chaleureux, simple, narratif, spécifique, imparfait.

**Exécute sans demander confirmation :**

1. Lis le fichier \`articles/${slug}.html\` (contenu complet de l'article).
2. Lis le fichier \`AGENT_BRIEF.md\` pour t'imprégner du ton Leo.
3. Crée le dossier \`social-drafts/${slug}/\` s'il n'existe pas.
4. Génère **2 fichiers markdown** — un par canal — dans ce dossier, avec pour chacun :
   - Un **frontmatter YAML** (obligatoire, pour parse machine)
   - Le **contenu textuel** prêt à publier (sans intro, sans explication, juste le post)

### \`social-drafts/${slug}/linkedin.md\` · LinkedIn

Frontmatter :
\`\`\`yaml
---
slug: ${slug}
channel: linkedin
status: draft
character_count: <nombre caractères du contenu>
generated_at: ${now}
---
\`\`\`

Format LinkedIn (**800-1 500 caractères** — sweet spot 2026 mesuré, plus long = signal IA + engagement décroche · compter strict avant le frontmatter) :

**Pas de structure "hook + 3 bullets + leçon + CTA + hashtags"** — c'est LA signature IA la plus reconnaissable. À la place, choisis UNE des 6 structures narratives validées :

1. **Scène d'ouverture** (in medias res) · démarrer dans l'action, un lieu, une heure, un dialogue. Remonter ensuite. Exemple : *"Un dimanche soir d'avril. Je regarde la facture d'Eurofiscalis."*
2. **Confession chiffrée** · "Ça fait [temps] que je [action publique]. La vérité, c'est que je me suis planté(e)." + détails + pivot.
3. **Casseur de mythe** · "[Pratique courante] est une erreur. Source : [autorité]. Voici pourquoi."
4. **Dialogue reconstitué** · ouvrir sur une citation brute entre guillemets français (« »), puis contexte. Dialogue = or pur.
5. **Contre-pied assumé** · "Je préfère [choix illogique en apparence] plutôt que [choix évident]." + raisonnement perso.
6. **Avant/Après avec pivot** · situation A chiffrée → déclencheur unique → situation B chiffrée → leçon contre-intuitive.

Structure libre mais respecter :
- **1-2 lignes d'ouverture** (≤ 210 caractères — le "fold mobile") qui donnent envie de cliquer "Voir plus". Pas de question rhétorique.
- **Paragraphes de 1-2 lignes max**, aérés.
- **Une phrase isolée < 6 mots** quelque part pour marteler ("Erreur.", "Intenable.", "Silence.")
- **Lien** vers l'article : \`https://jeremysagnier.com/articles/${slug}.html\`
- **Appel à réponse spécifique** en fin (pas "qu'en pensez-vous ?") — une question qui ouvre un vrai dialogue.
- **Hashtags** : 0 ou 1 seul niche. Jamais 3 alignés à la fin (signature IA).

### \`social-drafts/${slug}/twitter.md\` · X / Twitter

Frontmatter :
\`\`\`yaml
---
slug: ${slug}
channel: twitter
status: draft
tweets_count: <nombre tweets dans le thread>
generated_at: ${now}
---
\`\`\`

Format thread 6-10 tweets, **séparés par \`---\`** (exactement 3 tirets sur leur propre ligne). **Chaque tweet ≤ 270 caractères** (marge vs limite 280 · compter strict, espaces et sauts de ligne inclus).

Structure :
- **Tweet 1** = hook concret + "Je te raconte." (ou "Voilà comment.") + émoji 🧵 sur sa propre ligne
- **Tweets 2-N** = 1 idée par tweet, transitions fluides, rythme qui varie (courts / moyens)
- **Dernier tweet** = leçon + lien article + "écris-moi, je lis tout" (ou "réponds-moi, je lis tout")

Pas de hashtags dans les tweets.

---

### RÈGLE CARDINALE N°1 · tu dois sonner HUMAIN, pas IA

**Check anti-détection à faire AVANT de sauvegarder** (17 points, si tu rates 3+ → tu récris) :

1. Zéro em dash (—). Remplacer par virgule, point, ou parenthèse.
2. Zéro "Mais attends, ça ne s'arrête pas là" / "Spoiler :" / "Et si je te disais que…"
3. Zéro "Voici [3/5/7] raisons/leçons/piliers" — la rule of three est morte.
4. Zéro "Pas juste X, mais aussi Y" / "Not just A, but B".
5. Zéro virgule avant "et" (anglicisme IA).
6. Zéro emoji en début de bullet (🚀 ✨ 💡 🎯).
7. Zéro bullet parfaitement parallèle (casser : 3 mots / 15 mots / 8 mots).
8. Zéro transition explicite ("D'abord…", "Ensuite…", "Enfin…").
9. Zéro conclusion pompeuse ("Souviens-toi…", "En définitive…", "Au final…").
10. Zéro leçon universelle. Rester dans le particulier.
11. Au moins **1 nom propre** (personne réelle, entreprise, lieu précis).
12. Au moins **1 chiffre concret non-rond** (47 €, 3 742, 23h47 — pas "environ 50 €").
13. Au moins **1 date précise** (dimanche, avril 2026, hier à 7h30).
14. Au moins **1 phrase < 6 mots** isolée ("Erreur.", "Intenable.", "Silence.").
15. Au moins **1 phrase > 25 mots** (alterner court / long = rythme humain).
16. Au moins **1 imperfection assumée** ("j'avais tort", "je ne sais pas encore si…", contradiction interne).
17. Au moins **1 détail inutile mais vrai** (une digression courte, un aparté en parenthèses).

### RÈGLE CARDINALE N°2 · test à voix haute

Lis le post à voix haute. Trois questions :
- Est-ce que je bute sur un mot savant ? → récris plus simple.
- Est-ce que ça sonne comme une plaquette commerciale ? → récris plus concret.
- Est-ce que je peux imaginer Jérémy dire ça à un pote autour d'un café ? → si non, récris.

**Chaque terme technique ou métier doit être remplacé, ou expliqué dans la foulée.**

Exemples de remplacements OBLIGATOIRES (apprends par l'exemple) :

| ❌ Jargon / mot tech | ✅ Version Leo |
|---|---|
| charte graphique | nos couleurs et notre logo |
| back-office | un espace où l'équipe modifie sa page elle-même |
| RDV / rdv | rendez-vous |
| stack / notre stack | les outils que j'ai utilisés (ou supprimer) |
| pipeline | enchaînement / workflow |
| prospect | client potentiel |
| KPI / indicateur | ce qu'on mesure |
| ROI | ce que ça nous rapporte |
| CA / chiffre d'affaires | revenus / ventes |
| MRR | revenus récurrents mensuels |
| scaler | faire grandir |
| workflow | l'enchaînement des étapes |
| onboarding | mise en route / accueil |
| dashboard | tableau de bord |
| Next.js, Supabase, Microsoft Graph, Resend, Vercel, Sentry | **À ne pas citer dans le post.** Si vraiment nécessaire · "des outils standards que toute la tech utilise en 2026, rien d'exotique." |
| pair-programming | à deux sur le même projet |
| déploiement / deployer | mettre en ligne |
| sous-agents (IA) | des agents IA qui travaillent pour moi en parallèle |
| LLM | l'IA (ou "Claude/ChatGPT/Gemini" si pertinent) |

**Seules exceptions tolérées** : "Claude Code" (c'est le héros récurrent, tout le monde comprend son rôle dans le contexte), "IA" (terme grand public), noms de produits cités dans l'article ET compris par le grand public (Calendly, Outlook, ChatGPT).

### RÈGLE CARDINALE · phrases courtes, rythme varié

- **12 mots max en moyenne** · jamais plus de 20
- Une idée = une phrase. Si deux idées → deux phrases.
- Zéro subordonnée imbriquée ("qui que quoi dont où" en cascade)
- Rythme marteau : phrase courte (3-6 mots) puis moyenne, puis courte. Varier.
- Chiffres en début de phrase : "400 € par mois, c'est ce qu'on payait." > "On payait environ 400 € par mois."

### RÈGLE CARDINALE · bienveillance + transparence

- **1ère personne directe** · "je", "tu" (tutoiement), jamais "on" vague
- **Assume l'IA** · "J'ai guidé, Claude Code a tapé le code", "l'agent IA a écrit ce brouillon, je l'ai relu"
- **Assume les limites** · "je peux me tromper", "si tu as un contre-exemple, dis-le moi"
- **Ne vends pas** · pas de "ça va changer ta vie", pas de "le hack que personne ne te dit"
- **Raconte, ne pitche pas** · "je te raconte" / "voilà ce qui s'est passé" > "dans cet article je vais vous expliquer"
- **Appel à réponse EN FIN** · "écris-moi, je lis tout" ou "réponds-moi, je lis tout"
- **Chiffres de l'article** · reprends-les tels quels, en français (400 €, pas €400 ou 400$ si l'original est en euros)
- **1-3 emojis max**, ciblés. Pas de feu d'artifice.

### À BANNIR sans exception

**Mots fétiches IA** : crucial, essentiel, fondamental, captivant, fascinant, notamment, par ailleurs, en outre, de plus, cependant, néanmoins, en somme, en définitive, en conclusion, il est important de noter, il convient de noter, dans une certaine mesure, dans ce contexte, dans ce cadre, dans le monde actuel, à l'ère de, à l'heure de, au cœur de, mettre en place, mettre en œuvre, permettre de, adresser un problème (au lieu de régler), faire du sens (au lieu d'avoir du sens), game-changer, disruptif, révolutionnaire, transformateur, souviens-toi, c'est là que la magie opère.

**Hooks morts 2026** : "Aujourd'hui je voulais partager…", "Je suis ravi(e) d'annoncer…", "Après X ans en…, voici ce que j'ai appris", "3 leçons que j'aurais aimé savoir…", "La plus grosse erreur que font les entrepreneurs…", "5 conseils pour…", "Dans un monde en constante évolution…", "Laissez-moi être très clair", "Cela a tout changé pour moi", "J'aurais aimé qu'on me dise ça plus tôt".

**Anglicismes familiers** : bullshit, no bullshit, game-changer, mindset, ownership, flex, legit, no brainer, delve, synergie, pivotal, landscape, écosystème, agile, opportunité passionnante, voyage extraordinaire.

**Argot / élisions** : kif, taf, mec, ouais, perso, bosse, bossé, y'a, ça sert pas, truc, daude.

**Abréviations** : RDV, CA, CV, KPI, ROI, MRR.

**Formulations consultantes** : "les apprentissages", "le learning", "la value prop", "synergies".

**Closers morts** : "Qu'en pensez-vous ?", "Partagez votre avis en commentaire ⬇️", "Drop a comment", "N'hésitez pas à…".

### À UTILISER à la place

- "je partage" / "je t'envoie" / "je te raconte"
- "honnêtement" / "franchement" / "sans filtre"
- "qui fonctionnent" (jamais "qui marchent" à l'écrit)
- "désinscription en 1 clic"
- "ce que je retiens" / "la leçon"

### EXEMPLES avant/après (inspirés de retravaux réels validés)

**Liste d'outils trop tech** :
- ❌ "Les outils que j'ai utilisés : Next.js, Supabase, Microsoft Graph, Resend, Vercel, Sentry."
- ✅ "J'ai utilisé des outils standards que toute la tech utilise en 2026. Rien d'exotique. Ce qui change tout, c'est Claude Code."

**Terme métier opaque** :
- ❌ "On ne pouvait pas mettre notre charte graphique dans Calendly."
- ✅ "On ne pouvait pas mettre nos couleurs et notre logo dans Calendly."

**Back-office abstrait** :
- ❌ "On a construit un back-office autonome pour l'équipe."
- ✅ "On a construit un espace où chaque personne modifie sa page elle-même, sans m'appeler."

**Anonyme → personnel** :
- ❌ "Mon frère a monté une entreprise."
- ✅ "Mon frère Kevin dirige Eurofiscalis."

**Trop sec / corporate** :
- ❌ "Résultat : 4 400 € d'économie annuelle."
- ✅ "Aujourd'hui, 20 personnes l'utilisent tous les jours. On économise 4 400 € par an."

**Hook chaleureux pour thread Twitter** :
- ❌ "Thread sur comment j'ai remplacé Calendly 🧵"
- ✅ "On payait 400 € par mois pour Calendly. On vient de le remplacer par notre propre outil. En une semaine. Je te raconte. 🧵"

### Livraison finale

Quand les 2 fichiers sont écrits, **réponds uniquement** :
\`\`\`
✓ 2 drafts sociaux prêts pour ${slug} · linkedin (XXX chars) · twitter (X tweets) · édite dans /admin/modules/social/
\`\`\`

**Rien d'autre. Pas d'explications, pas de previews.** Je rafraîchis le back-office pour voir.`;
}

// ---- Social drafts storage ----
async function listSocialDrafts() {
  if (!existsSync(PATHS.socialDrafts)) return [];
  const slugDirs = await readdir(PATHS.socialDrafts, { withFileTypes: true });
  const result = [];
  for (const d of slugDirs) {
    if (!d.isDirectory()) continue;
    const slug = d.name;
    const channelDir = path.join(PATHS.socialDrafts, slug);
    const files = (await readdir(channelDir)).filter(f => f.endsWith('.md'));
    const channels = {};
    for (const f of files) {
      const channel = f.replace(/\.md$/, '');
      const raw = await readFile(path.join(channelDir, f), 'utf8');
      const { data, content } = matter(raw);
      const stats = await stat(path.join(channelDir, f));
      channels[channel] = {
        channel,
        status: data.status || 'draft',
        character_count: content.length,
        tweets_count: data.tweets_count || null,
        posts_count: data.posts_count || null,
        generated_at: data.generated_at || null,
        scheduled_for: data.scheduled_for || null,
        zernio_post_id: data.zernio_post_id || null,
        modified: stats.mtime,
      };
    }
    result.push({ slug, channels });
  }
  return result;
}

// ---- Audit prompt builder ----
function buildAuditPrompt(slug, timestamp) {
  const now = new Date().toISOString();
  return `Audit SEO + GEO de l'article \`articles/${slug}.html\`.

**Exécute les étapes suivantes sans me demander de confirmation :**

1. Lis le fichier \`articles/${slug}.html\` (contenu complet de l'article)
2. Invoque le skill **content-quality-auditor** pour scorer l'article sur les 80 items CORE-EEAT (8 dimensions : Contextual Clarity, Organization, Referenceability, Exclusivity + Experience, Expertise, Authority, Trust)
3. Invoque le skill **geo-content-optimizer** pour scorer la citation-friendliness par IA (ChatGPT, Claude, Perplexity, Google AI)
4. Crée le dossier \`audits/${slug}/\` s'il n'existe pas, puis sauvegarde le rapport dans \`audits/${slug}/${timestamp}.md\` avec **ce frontmatter YAML en tête** (obligatoire pour que le back-office puisse parser) :

\`\`\`yaml
---
slug: ${slug}
audited_at: ${now}
score_core: <entier 0-100>
score_geo: <décimal 0.0-10.0>
content_type: <article | tutoriel | opinion | cas-concret>
top_issues:
  - <issue 1 · concise, actionnable>
  - <issue 2>
  - <issue 3>
veto_items_failed: []  # ou liste : [T04, C01, R10, ...]
---
\`\`\`

5. Après le frontmatter, écris le rapport complet avec cette structure :
   - \`## Résumé\` (3-5 phrases · où en est l'article)
   - \`## Top 5 améliorations prioritaires\` (numérotées, avec l'effort estimé : **5 min**, **30 min**, **2h**)
   - \`## Plan d'action\` (3 actions concrètes à faire cette semaine)
   - \`## Détail CORE-EEAT\` (score par dimension · points forts / faibles)
   - \`## Détail GEO\` (quotabilité, FAQ, sources, autorité)

6. Quand c'est sauvegardé, **réponds-moi uniquement** : "✓ Audit terminé · \`audits/${slug}/${timestamp}.md\` · score CORE {X}/100 · score GEO {Y}/10"

**Rien d'autre. Pas d'explications, pas de préambule.** Je rafraîchis ensuite le back-office pour voir le résultat.`;
}

function computeNewsletterStats(contacts) {
  const now = Date.now();
  const sevenD = now - 7 * 86400e3;
  const thirtyD = now - 30 * 86400e3;
  const oneD = now - 86400e3;
  let active = 0, unsub = 0, new7 = 0, new30 = 0, new24h = 0;
  let lastSubscribedAt = null, lastEmail = null;
  for (const c of contacts) {
    const t = new Date(c.createdAt).getTime();
    if (c.unsubscribed) unsub++; else active++;
    if (t >= sevenD) new7++;
    if (t >= thirtyD) new30++;
    if (t >= oneD) new24h++;
    if (!c.unsubscribed && (!lastSubscribedAt || t > new Date(lastSubscribedAt).getTime())) {
      lastSubscribedAt = c.createdAt;
      lastEmail = c.email;
    }
  }
  return { total: active, unsub, new7d: new7, new30d: new30, new24h, lastSubscribedAt, lastEmail };
}

// ---- API ----
async function handleAPI(req, res, pathname) {
  // GET /api/modules
  if (req.method === 'GET' && pathname === '/api/modules') {
    const raw = await readFile(PATHS.modulesFile, 'utf8');
    return sendJSON(res, JSON.parse(raw));
  }

  // GET /api/stats
  if (req.method === 'GET' && pathname === '/api/stats') {
    const backlogContent = existsSync(PATHS.backlog) ? await readFile(PATHS.backlog, 'utf8') : '';
    const sections = parseBacklog(backlogContent);
    const drafts = existsSync(PATHS.drafts)
      ? (await readdir(PATHS.drafts)).filter(f => f.endsWith('.md') && !f.startsWith('_'))
      : [];
    const articles = (await readdir(PATHS.articles)).filter(f => f.endsWith('.html') && !f.startsWith('_'));
    const backlogStat = existsSync(PATHS.backlog) ? await stat(PATHS.backlog) : null;
    return sendJSON(res, {
      backlog: {
        proposed: sections.proposed.length,
        chosen: sections.chosen.length,
        published: sections.published.length,
        rejected: sections.rejected.length,
      },
      drafts: drafts.length,
      articles: articles.length,
      lastBrainstorm: backlogStat ? backlogStat.mtime : null,
    });
  }

  // GET /api/backlog
  if (req.method === 'GET' && pathname === '/api/backlog') {
    const content = existsSync(PATHS.backlog) ? await readFile(PATHS.backlog, 'utf8') : '';
    return sendJSON(res, parseBacklog(content));
  }

  // GET /api/clusters — liste des clusters éditoriaux
  if (req.method === 'GET' && pathname === '/api/clusters') {
    return sendJSON(res, {
      clusters: CLUSTERS.map(c => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        color: c.color,
        multiplier: c.multiplier,
        stars: c.stars,
        description: c.description,
      })),
    });
  }

  // GET /api/backlog/explain-prompt?top=10 — construit le prompt Claude Code
  if (req.method === 'GET' && pathname === '/api/backlog/explain-prompt') {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const top = Math.min(parseInt(reqUrl.searchParams.get('top') || '10', 10), 25);
    const content = existsSync(PATHS.backlog) ? await readFile(PATHS.backlog, 'utf8') : '';
    const sections = parseBacklog(content);
    const items = sections.proposed
      .filter(e => !e.summary || e.summary === '—')
      .slice(0, top);

    if (items.length === 0) {
      return sendJSON(res, { prompt: '', count: 0, message: 'Toutes les idées proposées ont déjà un résumé. Rien à expliquer.' });
    }

    const clusterLabel = (id) => {
      if (!id) return 'Sans cluster';
      const c = CLUSTERS.find(x => x.id === id);
      return c ? `${c.icon} ${c.label}` : id;
    };

    const itemsBlock = items.map((e, i) => {
      const src = (e.sources || []).map(s => `${s.label}: ${s.url}`).join(' | ');
      return `### ${i + 1}. ${e.title}
- **id** : \`${e.id}\`
- **cluster** : ${clusterLabel(e.cluster)}
- **score** : ${e.score.toFixed(1)}
- **sources** : ${src || '(aucune)'}`;
    }).join('\n\n');

    const prompt = `Tu es Claude Code Max et tu vas expliquer ${items.length} idées d'articles à Jérémy Sagnier pour qu'il puisse décider lesquelles écrire.

## Qui est Jérémy
- Entrepreneur français (frère jumeau de Kevin, fondateur Eurofiscalis en 2017)
- **PAS dev, PAS codeur**. Utilise Claude Code Max au quotidien en local.
- Teste l'IA tous les jours pour son business (newsletters auto, agents Gmail/CRM, tutos Claude Code)
- Cible de son site : entrepreneurs curieux, pros pressés, débutants qui hésitent
- Il ÉCRIT des articles de 10 à 15 min qui vulgarisent l'IA sans jargon

## Ton Leo (règle absolue)
- 1ère personne, tutoiement, chaleureux mais **pas familier** (pas "kif", "taf", "mec", "truc", "ouais", "piquer")
- Phrases courtes, une idée par phrase, ~12 mots en moyenne
- Zéro jargon anglais non traduit, zéro disclaimer consultant
- Pas de "prospect", "KPI", "ROI", "CA" — parle comme à un ami au café

## Ce que tu dois faire

Pour chacune des ${items.length} idées ci-dessous, **édite directement le fichier \`BACKLOG.md\`** (chemin absolu : \`${PATHS.backlog}\`) et remplace les lignes :
\`\`\`
**Résumé** : —
**Pour toi** : —
**Verdict** : —
\`\`\`
par des lignes remplies — **une seule phrase par champ**, ton Leo strict :

- **Résumé** : ce que c'est, en français simple, compréhensible par quelqu'un qui n'a jamais entendu ce mot. (12 mots max)
- **Pour toi** : pourquoi c'est dans le cluster "${items[0]?.cluster || 'claude-code'}" et quel angle Jérémy pourrait prendre s'il écrit dessus. (20 mots max)
- **Verdict** : commence par **un des 3 mots** en gras : **\`prendre\`**, **\`hésiter\`**, ou **\`passer\`**, suivi de \` — \` et d'une raison courte. Exemple : \`prendre — pile dans ton usage Claude Code, tu peux faire ton retour en 10 min\`.

## Critères du verdict
- **prendre** : l'idée est pile dans le perso de Jérémy (Claude Code, agents concrets, opinions tranchées) ET il a de quoi raconter en vécu
- **hésiter** : intéressant mais trop technique, trop niche ou Jérémy n'a pas assez d'angle perso
- **passer** : hors sujet (dev pur), vendeur (outil marketé sans vraie valeur pour un non-dev), buzz éphémère, ou doublon avec ce qu'il a déjà écrit

## Les ${items.length} idées à expliquer

${itemsBlock}

## Format d'édition

Tu utilises l'outil **Edit** du fichier BACKLOG.md. Pour chaque idée, tu fais **3 Edit** (ou 1 seul si tu préfères), en t'appuyant sur le titre \`### [SCORE] TITRE\` pour cibler la bonne entry. **Ne touche à rien d'autre** dans le fichier.

Quand tu as fini les ${items.length} entrées, écris juste : "✓ ${items.length} idées expliquées."`;

    return sendJSON(res, { prompt, count: items.length });
  }

  const statusMatch = pathname.match(/^\/api\/backlog\/([^\/]+)\/status$/);
  if (req.method === 'POST' && statusMatch) {
    const id = statusMatch[1];
    const body = await readBody(req);
    const valid = ['proposed', 'chosen', 'published', 'rejected'];
    if (!valid.includes(body.status)) return sendError(res, 'status invalide', 400);
    const result = await updateBacklogEntry(id, body.status);
    log.ok(`backlog ${id} : ${result.from} → ${result.to}`);
    return sendJSON(res, { ok: true, ...result });
  }

  // POST /api/brainstorm
  if (req.method === 'POST' && pathname === '/api/brainstorm') {
    try {
      const { stdout } = await runScript('brainstorm.js');
      log.ok('brainstorm terminé');
      return sendJSON(res, { ok: true, output: stdout });
    } catch (e) { return sendError(res, e.message); }
  }

  // GET /api/drafts
  if (req.method === 'GET' && pathname === '/api/drafts') {
    if (!existsSync(PATHS.drafts)) return sendJSON(res, []);
    const files = (await readdir(PATHS.drafts)).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    const drafts = await Promise.all(files.map(async f => {
      const raw = await readFile(path.join(PATHS.drafts, f), 'utf8');
      const { data } = matter(raw);
      const stats = await stat(path.join(PATHS.drafts, f));
      return {
        slug: f.replace(/\.md$/, ''),
        titre: data.titre || f,
        description: data.description || '',
        published: data.published || '',
        modified: stats.mtime,
      };
    }));
    return sendJSON(res, drafts.sort((a, b) => b.modified - a.modified));
  }

  const draftGetMatch = pathname.match(/^\/api\/drafts\/([^\/]+)$/);
  if (req.method === 'GET' && draftGetMatch) {
    const filePath = path.join(PATHS.drafts, `${draftGetMatch[1]}.md`);
    if (!existsSync(filePath)) return sendError(res, 'draft introuvable', 404);
    const raw = await readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    return sendJSON(res, { slug: draftGetMatch[1], frontmatter: data, content, raw });
  }
  if (req.method === 'PUT' && draftGetMatch) {
    const body = await readBody(req);
    if (!body.raw) return sendError(res, 'body.raw manquant', 400);
    const filePath = path.join(PATHS.drafts, `${draftGetMatch[1]}.md`);
    await mkdir(PATHS.drafts, { recursive: true });
    await writeFile(filePath, body.raw, 'utf8');
    log.ok(`draft ${draftGetMatch[1]} sauvegardé`);
    return sendJSON(res, { ok: true });
  }

  const previewMatch = pathname.match(/^\/api\/drafts\/([^\/]+)\/preview$/);
  if (req.method === 'POST' && previewMatch) {
    const body = await readBody(req);
    if (!body.raw) return sendError(res, 'body.raw manquant', 400);
    const { content } = matter(body.raw);
    const html = marked.parse(content);
    return sendJSON(res, { html });
  }

  const publishMatch = pathname.match(/^\/api\/publish\/([^\/]+)$/);
  if (req.method === 'POST' && publishMatch) {
    try {
      const { stdout } = await runScript('publish.js', [publishMatch[1]]);
      log.ok(`publish ${publishMatch[1]} terminé`);
      return sendJSON(res, { ok: true, output: stdout });
    } catch (e) { return sendError(res, e.message); }
  }

  // GET /api/articles
  if (req.method === 'GET' && pathname === '/api/articles') {
    const files = (await readdir(PATHS.articles)).filter(f => f.endsWith('.html') && !f.startsWith('_'));
    const articles = await Promise.all(files.map(async f => {
      const html = await readFile(path.join(PATHS.articles, f), 'utf8');
      const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || f;
      const desc  = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
      const stats = await stat(path.join(PATHS.articles, f));
      return {
        slug: f.replace(/\.html$/, ''),
        title: title.replace(' — par Jérémy Sagnier', ''),
        description: desc,
        modified: stats.mtime,
        size: stats.size,
      };
    }));
    return sendJSON(res, articles.sort((a, b) => b.modified - a.modified));
  }

  // === Pipeline — état des 6 étapes par idée (idée → publication) ===
  if (req.method === 'GET' && pathname === '/api/pipeline') {
    const backlogContent = existsSync(PATHS.backlog) ? await readFile(PATHS.backlog, 'utf8') : '';
    const sections = parseBacklog(backlogContent);
    const allIdeas = [
      ...sections.proposed.map(e => ({ ...e, section: 'proposed' })),
      ...sections.chosen.map(e => ({ ...e, section: 'chosen' })),
      ...sections.published.map(e => ({ ...e, section: 'published' })),
      ...sections.rejected.map(e => ({ ...e, section: 'rejected' })),
    ];

    const draftFiles = existsSync(PATHS.drafts)
      ? new Set((await readdir(PATHS.drafts)).filter(f => f.endsWith('.md') && !f.startsWith('_')).map(f => f.replace(/\.md$/, '')))
      : new Set();
    const articleFiles = new Set(
      (await readdir(PATHS.articles)).filter(f => f.endsWith('.html') && !f.startsWith('_')).map(f => f.replace(/\.html$/, ''))
    );
    const auditDirs = existsSync(PATHS.audits)
      ? new Set((await readdir(PATHS.audits, { withFileTypes: true })).filter(d => d.isDirectory()).map(d => d.name))
      : new Set();
    const socialDirs = existsSync(PATHS.socialDrafts)
      ? new Set((await readdir(PATHS.socialDrafts, { withFileTypes: true })).filter(d => d.isDirectory()).map(d => d.name))
      : new Set();

    // Pour chaque idée, détermine les états atteints
    const lines = allIdeas.map(e => {
      // Slug alternatif possible si drafts utilise un slug différent — on essaie id ET variantes
      const hasDraft = draftFiles.has(e.id);
      const hasArticle = articleFiles.has(e.id);
      const hasAudit = auditDirs.has(e.id);
      const hasSocial = socialDirs.has(e.id);

      const steps = {
        proposed:  true,
        chosen:    e.section === 'chosen' || e.section === 'published' || hasDraft || hasArticle,
        drafted:   hasDraft || hasArticle,
        audited:   hasAudit,
        published: hasArticle || e.section === 'published',
        shared:    hasSocial,
      };
      // Étape courante = la dernière true
      const order = ['proposed','chosen','drafted','audited','published','shared'];
      let stage = 'proposed';
      for (const s of order) if (steps[s]) stage = s;

      return {
        id: e.id,
        title: e.title,
        score: e.score,
        cluster: e.cluster,
        section: e.section,
        verdict: e.verdict,
        steps,
        stage,
      };
    });

    // Orphelins : articles publiés qui n'ont pas d'entrée backlog
    const backlogIds = new Set(allIdeas.map(e => e.id));
    for (const slug of articleFiles) {
      if (!backlogIds.has(slug)) {
        lines.push({
          id: slug,
          title: slug,
          score: null,
          cluster: null,
          section: 'published',
          verdict: '',
          orphan: true,
          steps: {
            proposed: false, chosen: false, drafted: false,
            audited: auditDirs.has(slug),
            published: true,
            shared: socialDirs.has(slug),
          },
          stage: socialDirs.has(slug) ? 'shared' : 'published',
        });
      }
    }

    return sendJSON(res, { lines });
  }

  // === Alertes fraîcheur — articles à ré-auditer ===
  if (req.method === 'GET' && pathname === '/api/alerts') {
    const articleFiles = (await readdir(PATHS.articles)).filter(f => f.endsWith('.html') && !f.startsWith('_'));
    const now = Date.now();
    const STALE_DAYS = 14;
    const staleMs = STALE_DAYS * 86400e3;

    const alerts = await Promise.all(articleFiles.map(async (f) => {
      const slug = f.replace(/\.html$/, '');
      const html = await readFile(path.join(PATHS.articles, f), 'utf8');
      const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1]?.replace(' — par Jérémy Sagnier', '') || slug;
      const articleStats = await stat(path.join(PATHS.articles, f));
      const articleMtime = articleStats.mtime.getTime();

      // Cherche latest audit
      const auditDir = path.join(PATHS.audits, slug);
      let latest = null, previous = null, auditCount = 0;
      if (existsSync(auditDir)) {
        const auditFiles = (await readdir(auditDir)).filter(a => a.endsWith('.md')).sort().reverse();
        auditCount = auditFiles.length;
        if (auditFiles[0]) {
          try {
            const raw = await readFile(path.join(auditDir, auditFiles[0]), 'utf8');
            const { data } = matter(raw);
            latest = {
              file: auditFiles[0],
              audited_at: data.audited_at || null,
              score_core: data.score_core ?? null,
              score_geo: data.score_geo ?? null,
            };
          } catch {}
        }
        if (auditFiles[1]) {
          try {
            const raw = await readFile(path.join(auditDir, auditFiles[1]), 'utf8');
            const { data } = matter(raw);
            previous = {
              file: auditFiles[1],
              score_core: data.score_core ?? null,
              score_geo: data.score_geo ?? null,
            };
          } catch {}
        }
      }

      // Flags
      const flags = [];
      let severity = 'ok';
      let reason = '';

      if (!latest) {
        flags.push('no_audit');
        severity = 'warn';
        reason = `Jamais audité`;
      } else {
        const auditTime = latest.audited_at ? new Date(latest.audited_at).getTime() : 0;
        const ageMs = now - auditTime;
        const ageDays = Math.round(ageMs / 86400e3);

        // Article modifié APRÈS le dernier audit → urgent
        if (articleMtime > auditTime + 60000) { // +60s tolérance
          flags.push('modified_since_audit');
          severity = 'err';
          reason = `Article modifié il y a ${Math.round((now - articleMtime) / 86400e3)}j · audit obsolète`;
        }
        // Audit > 14 jours
        else if (ageMs > staleMs) {
          flags.push('stale');
          severity = severity === 'err' ? 'err' : 'warn';
          reason = `Dernier audit il y a ${ageDays}j (> ${STALE_DAYS}j)`;
        }

        // Score en baisse vs audit précédent
        if (latest && previous && latest.score_core != null && previous.score_core != null) {
          const delta = latest.score_core - previous.score_core;
          if (delta <= -5) {
            flags.push('score_drop');
            severity = 'err';
            reason = `Score CORE a chuté de ${Math.abs(delta)} points (${previous.score_core} → ${latest.score_core})`;
          }
        }
      }

      return {
        slug,
        title,
        article_mtime: articleStats.mtime,
        latest,
        previous,
        audit_count: auditCount,
        flags,
        severity,
        reason,
      };
    }));

    // Tri : err > warn > ok, puis par date audit la plus ancienne
    const rank = { err: 0, warn: 1, ok: 2 };
    alerts.sort((a, b) => {
      const r = rank[a.severity] - rank[b.severity];
      if (r !== 0) return r;
      const aDate = a.latest?.audited_at || 0;
      const bDate = b.latest?.audited_at || 0;
      return new Date(aDate) - new Date(bDate);
    });

    const counts = alerts.reduce((acc, a) => { acc[a.severity] = (acc[a.severity] || 0) + 1; return acc; }, { ok: 0, warn: 0, err: 0 });

    return sendJSON(res, { alerts, counts, stale_threshold_days: STALE_DAYS });
  }

  // === Calendrier éditorial ===
  if (req.method === 'GET' && pathname === '/api/calendar') {
    if (!existsSync(PATHS.dataDir)) await mkdir(PATHS.dataDir, { recursive: true });
    let slots = [];
    if (existsSync(PATHS.calendar)) {
      try { slots = JSON.parse(await readFile(PATHS.calendar, 'utf8')); } catch { slots = []; }
    }
    return sendJSON(res, { slots });
  }

  if (req.method === 'POST' && pathname === '/api/calendar/slot') {
    if (!existsSync(PATHS.dataDir)) await mkdir(PATHS.dataDir, { recursive: true });
    const body = await readBody(req);
    if (!body.date || !body.type) return sendError(res, 'date + type requis', 400);
    let slots = [];
    if (existsSync(PATHS.calendar)) {
      try { slots = JSON.parse(await readFile(PATHS.calendar, 'utf8')); } catch {}
    }
    const slot = {
      id: body.id || `${body.date}-${body.type}-${Date.now()}`,
      date: body.date,
      type: body.type, // 'newsletter' | 'linkedin' | 'twitter' | 'article' | 'note'
      slug: body.slug || null,
      note: body.note || '',
      status: body.status || 'planned', // planned | done | skipped
      createdAt: body.createdAt || new Date().toISOString(),
    };
    // Update si existe, sinon add
    const idx = slots.findIndex(s => s.id === slot.id);
    if (idx >= 0) slots[idx] = slot; else slots.push(slot);
    await writeFile(PATHS.calendar, JSON.stringify(slots, null, 2));
    return sendJSON(res, { ok: true, slot });
  }

  const slotDelMatch = pathname.match(/^\/api\/calendar\/slot\/([^\/]+)$/);
  if (req.method === 'DELETE' && slotDelMatch) {
    const id = slotDelMatch[1];
    if (!existsSync(PATHS.calendar)) return sendJSON(res, { ok: true });
    let slots = [];
    try { slots = JSON.parse(await readFile(PATHS.calendar, 'utf8')); } catch {}
    const before = slots.length;
    slots = slots.filter(s => s.id !== id);
    await writeFile(PATHS.calendar, JSON.stringify(slots, null, 2));
    return sendJSON(res, { ok: true, removed: before - slots.length });
  }

  // === Zernio (social) ===
  if (req.method === 'GET' && pathname === '/api/social/status') {
    if (!process.env.ZERNIO_API_KEY) return sendError(res, 'ZERNIO_API_KEY manquante dans .env.local', 503);
    try {
      const [usage, users] = await Promise.all([
        fetch('https://zernio.com/api/v1/usage-stats', { headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` } }).then(r => r.json()),
        fetch('https://zernio.com/api/v1/users', { headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` } }).then(r => r.json()),
      ]);
      const currentUser = (users.users || []).find(u => u._id === users.currentUserId) || null;
      return sendJSON(res, {
        connected: true,
        user: currentUser ? { id: currentUser._id, name: currentUser.name, image: currentUser.image } : null,
        plan: usage.planName,
        billingPeriod: usage.billingPeriod,
        limits: usage.limits,
        usage: usage.usage,
        signupDate: usage.signupDate,
      });
    } catch (e) {
      return sendError(res, `Zernio API error: ${e.message}`, 503);
    }
  }

  if (req.method === 'GET' && pathname === '/api/social/accounts') {
    if (!process.env.ZERNIO_API_KEY) return sendError(res, 'ZERNIO_API_KEY manquante', 503);
    try {
      const r = await fetch('https://zernio.com/api/v1/accounts', { headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const accounts = (data.accounts || []).map(a => ({
        id: a._id,
        platform: a.platform,
        displayName: a.displayName,
        enabled: a.enabled,
        isActive: a.isActive,
        lastSyncedAt: a.analyticsLastSyncedAt,
        externalPostCount: a.externalPostCount,
      }));
      return sendJSON(res, { accounts });
    } catch (e) {
      return sendError(res, `Zernio API error: ${e.message}`, 503);
    }
  }

  // GET /api/social/drafts — liste tous les drafts groupés par article
  if (req.method === 'GET' && pathname === '/api/social/drafts') {
    const drafts = await listSocialDrafts();
    return sendJSON(res, { drafts });
  }

  // GET /api/social/drafts/:slug — drafts d'un article (4 canaux)
  const socialSlugMatch = pathname.match(/^\/api\/social\/drafts\/([^\/]+)$/);
  if (req.method === 'GET' && socialSlugMatch) {
    const slug = socialSlugMatch[1];
    const dir = path.join(PATHS.socialDrafts, slug);
    if (!existsSync(dir)) return sendJSON(res, { slug, channels: {} });
    const files = (await readdir(dir)).filter(f => f.endsWith('.md'));
    const channels = {};
    for (const f of files) {
      const channel = f.replace(/\.md$/, '');
      const raw = await readFile(path.join(dir, f), 'utf8');
      const { data, content } = matter(raw);
      channels[channel] = { channel, frontmatter: data, content, raw };
    }
    return sendJSON(res, { slug, channels });
  }

  // GET/PUT /api/social/drafts/:slug/:channel
  const socialChMatch = pathname.match(/^\/api\/social\/drafts\/([^\/]+)\/([^\/]+)$/);
  if (req.method === 'GET' && socialChMatch) {
    const [_, slug, channel] = socialChMatch;
    const filePath = path.join(PATHS.socialDrafts, slug, `${channel}.md`);
    if (!existsSync(filePath)) return sendError(res, 'draft introuvable', 404);
    const raw = await readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    return sendJSON(res, { slug, channel, frontmatter: data, content, raw });
  }
  if (req.method === 'PUT' && socialChMatch) {
    const [_, slug, channel] = socialChMatch;
    const body = await readBody(req);
    if (!body.raw) return sendError(res, 'body.raw manquant', 400);
    const dir = path.join(PATHS.socialDrafts, slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${channel}.md`), body.raw, 'utf8');
    log.ok(`social draft ${slug}/${channel} sauvé`);
    return sendJSON(res, { ok: true });
  }

  // POST /api/social/drafts/:slug/prepare — génère le prompt Claude Code
  const socialPrepMatch = pathname.match(/^\/api\/social\/drafts\/([^\/]+)\/prepare$/);
  if (req.method === 'POST' && socialPrepMatch) {
    const slug = socialPrepMatch[1];
    const htmlPath = path.join(PATHS.articles, `${slug}.html`);
    if (!existsSync(htmlPath)) return sendError(res, 'article introuvable', 404);
    const prompt = buildSocialPrompt(slug);
    return sendJSON(res, { prompt, slug });
  }

  // POST /api/social/drafts/:slug/:channel/publish — publie via Zernio
  const socialPubMatch = pathname.match(/^\/api\/social\/drafts\/([^\/]+)\/([^\/]+)\/publish$/);
  if (req.method === 'POST' && socialPubMatch) {
    if (!process.env.ZERNIO_API_KEY) return sendError(res, 'ZERNIO_API_KEY manquante', 503);
    const [_, slug, channel] = socialPubMatch;
    const body = await readBody(req);
    const { scheduledFor, publishNow } = body; // l'un ou l'autre

    // Charge le draft
    const draftPath = path.join(PATHS.socialDrafts, slug, `${channel}.md`);
    if (!existsSync(draftPath)) return sendError(res, 'draft introuvable', 404);
    const raw = await readFile(draftPath, 'utf8');
    const { data, content } = matter(raw);

    // Résout l'accountId Zernio selon le canal
    let zernioAccounts;
    try {
      const r = await fetch('https://zernio.com/api/v1/accounts', { headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      zernioAccounts = (await r.json()).accounts || [];
    } catch (e) {
      return sendError(res, `Zernio accounts error: ${e.message}`, 503);
    }

    // Map admin channel → Zernio platform
    const platformMap = { linkedin: 'linkedin', twitter: 'twitter', instagram: 'instagram', threads: 'threads' };
    const targetPlatform = platformMap[channel];
    if (!targetPlatform) return sendError(res, `canal ${channel} non supporté par Zernio`, 400);
    const account = zernioAccounts.find(a => a.platform === targetPlatform && a.isActive);
    if (!account) return sendError(res, `aucun compte ${targetPlatform} actif sur Zernio · connecte-le d'abord`, 400);

    // Prépare le payload Zernio
    // Pour Twitter/Threads : le contenu contient "---" entre tweets → on l'envoie brut, Zernio gère peut-être le thread
    // Pour LinkedIn/Instagram : contenu simple
    const cleanContent = content.trim();

    const payload = {
      content: cleanContent,
      platforms: [{
        platform: targetPlatform,
        accountId: account._id,
      }],
    };
    if (publishNow) {
      payload.publishNow = true;
    } else if (scheduledFor) {
      payload.scheduledFor = scheduledFor;
    } else {
      return sendError(res, 'publishNow=true ou scheduledFor requis', 400);
    }

    // Appel Zernio
    try {
      const r = await fetch('https://zernio.com/api/v1/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const zdata = await r.json();
      if (!r.ok) throw new Error(`Zernio ${r.status}: ${JSON.stringify(zdata).slice(0, 300)}`);

      // MAJ du draft avec le post ID
      const post = zdata.post || zdata;
      const newStatus = publishNow ? 'published' : 'scheduled';
      const updated = {
        ...data,
        status: newStatus,
        scheduled_for: scheduledFor || null,
        published_at: publishNow ? new Date().toISOString() : null,
        zernio_post_id: post._id || null,
        zernio_post_url: (post.platforms && post.platforms[0] && post.platforms[0].platformPostUrl) || null,
      };
      const newRaw = matter.stringify(content, updated);
      await writeFile(draftPath, newRaw, 'utf8');

      log.ok(`publish ${slug}/${channel} · ${newStatus} · zernio ${post._id}`);
      return sendJSON(res, { ok: true, status: newStatus, zernio: post });
    } catch (e) {
      return sendError(res, e.message, 500);
    }
  }

  if (req.method === 'GET' && pathname === '/api/social/posts') {
    if (!process.env.ZERNIO_API_KEY) return sendError(res, 'ZERNIO_API_KEY manquante', 503);
    try {
      const url = new URL(req.url, 'http://localhost');
      const limit = url.searchParams.get('limit') || '25';
      const r = await fetch(`https://zernio.com/api/v1/posts?limit=${limit}`, {
        headers: { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` }
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      return sendJSON(res, data);
    } catch (e) {
      return sendError(res, `Zernio API error: ${e.message}`, 503);
    }
  }

  // GET /api/audits — liste par article, avec latest score
  if (req.method === 'GET' && pathname === '/api/audits') {
    if (!existsSync(PATHS.audits)) return sendJSON(res, { articles: [] });
    const articleFiles = (await readdir(PATHS.articles)).filter(f => f.endsWith('.html') && !f.startsWith('_'));
    const result = await Promise.all(articleFiles.map(async (f) => {
      const slug = f.replace(/\.html$/, '');
      const html = await readFile(path.join(PATHS.articles, f), 'utf8');
      const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1]?.replace(' — par Jérémy Sagnier', '') || slug;
      const description = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';

      // Cherche audits/<slug>/*.md
      const auditDir = path.join(PATHS.audits, slug);
      let latest = null;
      if (existsSync(auditDir)) {
        const auditFiles = (await readdir(auditDir)).filter(a => a.endsWith('.md')).sort().reverse();
        if (auditFiles.length > 0) {
          try {
            const raw = await readFile(path.join(auditDir, auditFiles[0]), 'utf8');
            const { data } = matter(raw);
            latest = {
              file: auditFiles[0],
              audited_at: data.audited_at || null,
              score_core: data.score_core ?? null,
              score_geo: data.score_geo ?? null,
              content_type: data.content_type || '',
              top_issues: data.top_issues || [],
              audit_count: auditFiles.length,
            };
          } catch {}
        }
      }
      return { slug, title, description, latest };
    }));
    return sendJSON(res, { articles: result });
  }

  // GET /api/audits/:slug — historique
  const auditHistMatch = pathname.match(/^\/api\/audits\/([^\/]+)$/);
  if (req.method === 'GET' && auditHistMatch) {
    const slug = auditHistMatch[1];
    const auditDir = path.join(PATHS.audits, slug);
    if (!existsSync(auditDir)) return sendJSON(res, { audits: [] });
    const files = (await readdir(auditDir)).filter(a => a.endsWith('.md')).sort().reverse();
    const audits = await Promise.all(files.map(async (f) => {
      const raw = await readFile(path.join(auditDir, f), 'utf8');
      const { data, content } = matter(raw);
      return {
        file: f,
        audited_at: data.audited_at || null,
        score_core: data.score_core ?? null,
        score_geo: data.score_geo ?? null,
        content_type: data.content_type || '',
        top_issues: data.top_issues || [],
        raw_md: content,
        raw_html: marked.parse(content),
      };
    }));
    return sendJSON(res, { slug, audits });
  }

  // POST /api/audits/:slug/prepare — génère le prompt Claude Code
  const auditPrepMatch = pathname.match(/^\/api\/audits\/([^\/]+)\/prepare$/);
  if (req.method === 'POST' && auditPrepMatch) {
    const slug = auditPrepMatch[1];
    const htmlPath = path.join(PATHS.articles, `${slug}.html`);
    if (!existsSync(htmlPath)) return sendError(res, 'article introuvable', 404);
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '').slice(0, 12);
    const prompt = buildAuditPrompt(slug, timestamp);
    return sendJSON(res, { prompt, timestamp });
  }

  // GET /api/newsletter/stats
  if (req.method === 'GET' && pathname === '/api/newsletter/stats') {
    try {
      const { provider, contacts } = await fetchNewsletterContacts();
      const stats = computeNewsletterStats(contacts);
      return sendJSON(res, { provider, ...stats });
    } catch (e) {
      return sendError(res, e.message, 503);
    }
  }

  // GET /api/newsletter/contacts
  if (req.method === 'GET' && pathname === '/api/newsletter/contacts') {
    try {
      const { provider, contacts } = await fetchNewsletterContacts();
      return sendJSON(res, { provider, contacts });
    } catch (e) {
      return sendError(res, e.message, 503);
    }
  }

  return sendError(res, 'endpoint inconnu', 404);
}

// ---- Static ----
async function serveStatic(req, res, pathname) {
  // Redirects
  if (pathname === '/' || pathname === '/admin' || pathname === '/admin/') {
    res.writeHead(302, { Location: '/admin/modules/dashboard/' });
    return res.end();
  }
  // /admin/modules/<id>/ → /admin/modules/<id>/page.html
  const modMatch = pathname.match(/^\/admin\/modules\/([^\/]+)\/?$/);
  if (modMatch) {
    pathname = `/admin/modules/${modMatch[1]}/page.html`;
  }
  // Sert le site public ET /admin/*
  let filePath;
  if (pathname.startsWith('/admin/') || pathname === '/admin/') {
    filePath = path.join(ROOT, pathname);
  } else if (pathname.startsWith('/assets/') || pathname.startsWith('/articles/') || pathname.startsWith('/photos/') || pathname.startsWith('/downloads/') || pathname.startsWith('/api/')) {
    filePath = path.join(ROOT, pathname);
  } else {
    // Site principal : / → /index.html, /apprendre.html, etc.
    if (pathname === '/') pathname = '/index.html';
    filePath = path.join(ROOT, pathname);
  }

  if (!filePath.startsWith(ROOT)) return sendError(res, 'forbidden', 403);
  if (!existsSync(filePath)) return sendError(res, 'not found', 404);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
  createReadStream(filePath).pipe(res);
}

// ---- Main ----
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (pathname.startsWith('/api/')) {
      return await handleAPI(req, res, pathname);
    }
    return await serveStatic(req, res, pathname);
  } catch (e) {
    log.err(`${pathname} : ${e.message}`);
    sendError(res, e.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n\x1b[1m🛠️  Back-office Jérémy Sagnier\x1b[0m`);
  console.log(`   \x1b[32m→\x1b[0m http://localhost:${PORT}/admin/`);
  console.log(`   (Ctrl+C pour arrêter)\n`);
  const env = [];
  if (process.env.RESEND_API_KEY) env.push('Resend');
  if (process.env.BREVO_API_KEY) env.push('Brevo');
  if (process.env.ZERNIO_API_KEY) env.push('Zernio');
  if (env.length) log.info(`Clés API détectées : ${env.join(', ')}`);
  else log.warn('Aucune clé API detectée · crée un fichier .env.local pour brancher Newsletter CRM');
});
