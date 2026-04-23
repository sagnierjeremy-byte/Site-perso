# Podcast Integration · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Intégrer 3 épisodes de podcast "Guerres d'IA" (Jerwis Productions) sur jerwis.fr avec diffusion Apple/Spotify via RSS feed, pochettes Direction 4 générées par script, lecteur HTML5 custom, et host audio Cloudflare R2.

**Architecture:** Source de vérité unique `data/episodes.json` consommée par 3 scripts Node de build (page, RSS, covers). Audio hébergé sur Cloudflare R2 public bucket. Page `/podcast.html` Layout A éditorial magazine + lecteur vanilla `<audio>` + CSS inline Direction 4.

**Tech Stack:** Node.js 20+ (scripts build), HTML5 + CSS vanilla + Fetch (site), Puppeteer (HTML→PNG), @aws-sdk/client-s3 (R2 upload), sharp (resize). Zéro framework front. Validation RSS via castfeedvalidator.

**Spec reference:** `docs/superpowers/specs/2026-04-23-podcast-integration-design.md`

---

## Pré-requis bloquants · actions utilisateur avant Task 1

1. **Créer un compte Cloudflare** (si pas déjà) · gratuit · https://dash.cloudflare.com/sign-up
2. **Créer un bucket R2** nommé `jerwis-podcast-audio` · dashboard Cloudflare → R2 → Create bucket
3. **Activer le public access** du bucket · Settings → Public URL Access → Allow
4. **(Optionnel) Configurer custom domain** `podcast-audio.jerwis.fr` · Settings → Custom Domains → Connect Domain (nécessite CNAME côté Hostinger)
5. **Générer une API token S3** avec permission Read/Write sur ce bucket · R2 → Manage R2 API Tokens → Create API Token
6. **Récupérer** : `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, public URL bucket

L'agent d'implémentation **ne peut pas** faire ces étapes (il n'a pas accès au dashboard Cloudflare). Si ces 6 points ne sont pas remplis, suspendre le plan à Task 1.

---

## File Structure

| Fichier | Rôle |
|---|---|
| `data/episodes.json` | Source de vérité unique · metadata série + 3 épisodes |
| `templates/podcast-cover.html` | Template paramétré pour rendu cover 3000×3000 (Direction 4) |
| `scripts/build-podcast-rss.js` | Lit JSON → écrit `feed/podcast.xml` conforme iTunes |
| `scripts/build-podcast-covers.js` | Lit JSON + template → PNG via Puppeteer + resize via sharp |
| `scripts/build-podcast-page.js` | Lit JSON → écrit `podcast.html` Layout A |
| `scripts/podcast-upload.js` | CLI upload MP3 vers R2 avec @aws-sdk/client-s3 |
| `scripts/test-helpers.js` | Helpers de validation (format duration, escape XML) + tests node:test |
| `assets/podcast-player.js` | Lecteur HTML5 custom (~200 lignes, 0 dep) |
| `podcast.html` | Page publique (générée par build-podcast-page.js) |
| `feed/podcast.xml` | RSS feed (généré par build-podcast-rss.js) |
| `podcast/covers/{serie,ep01,ep02,ep03}.png` | Covers 512×512 (site) |
| `podcast/covers/{serie,ep01,ep02,ep03}-3000.png` | Covers 3000×3000 (Apple/Spotify) |
| `.env.local` | + R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY |
| `package.json` | + 4 scripts npm + deps puppeteer, @aws-sdk/client-s3, sharp |
| `CLAUDE.md` | + section "Podcast · Jerwis Productions" |
| `sitemap.xml` | + 1 entrée `/podcast.html` |
| 10 pages HTML (`index`, `apprendre`, `workflows`, `outils`, `github`, `claude-code`, `debutant`, `lexique`, `quiz`, `preferences`) | + item `Podcasts` dans nav |

---

## Task 1 · Pré-flight check et dépendances

**Files:**
- Modify: `package.json`
- Modify: `.env.local`

- [ ] **Step 1.1: Vérifier Node version**

Run: `node --version`
Expected: `v20.x.x` ou supérieur (pour AbortController natif et node:test). Si < v20, l'utilisateur doit upgrader avant de continuer.

- [ ] **Step 1.2: Vérifier que l'utilisateur a fourni les creds R2**

Run: `grep -E "^R2_" .env.local || echo "MISSING"`
Expected: 3 lignes `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. Si `MISSING`, demander à l'utilisateur de les ajouter manuellement à `.env.local` et stopper la task.

- [ ] **Step 1.3: Ajouter les dépendances npm**

Run:
```bash
npm install --save-dev puppeteer @aws-sdk/client-s3 sharp dotenv
```
Expected: installation sans erreur, `package-lock.json` créé/mis à jour.

- [ ] **Step 1.4: Ajouter les scripts npm**

Modifier `package.json`, section `scripts` :

```json
{
  "name": "jeremy-sagnier-site",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "publish": "node scripts/publish.js",
    "publish:all": "node scripts/publish.js --all",
    "brainstorm": "node scripts/brainstorm.js",
    "seo:improve": "node scripts/seo-improve.js",
    "admin": "node scripts/admin-server.js",
    "podcast:rss": "node scripts/build-podcast-rss.js",
    "podcast:covers": "node scripts/build-podcast-covers.js",
    "podcast:page": "node scripts/build-podcast-page.js",
    "podcast:build": "npm run podcast:covers && npm run podcast:rss && npm run podcast:page",
    "podcast:upload": "node scripts/podcast-upload.js",
    "test": "node --test scripts/"
  }
}
```

- [ ] **Step 1.5: Commit pre-flight**

```bash
git add package.json package-lock.json
git commit -m "chore: add deps podcast (puppeteer, aws-sdk-s3, sharp, dotenv) + scripts npm"
```

---

## Task 2 · Upload des 3 MP3 sur Cloudflare R2

**Files:**
- Create: `scripts/podcast-upload.js`

- [ ] **Step 2.1: Créer le script d'upload**

Create `scripts/podcast-upload.js`:

```js
// Upload un fichier MP3 vers Cloudflare R2 avec @aws-sdk/client-s3.
// Usage : node scripts/podcast-upload.js <chemin-local-mp3>
// R2 est compatible API S3, on pointe juste endpoint sur *.r2.cloudflarestorage.com.

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = 'jerwis-podcast-audio';
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE || `https://pub-${ACCOUNT_ID}.r2.dev`;

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
  console.error('[upload] Manque R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY dans .env.local');
  process.exit(1);
}

const localPath = process.argv[2];
if (!localPath) {
  console.error('Usage : node scripts/podcast-upload.js <chemin-local.mp3>');
  process.exit(1);
}
if (!fs.existsSync(localPath)) {
  console.error(`[upload] Fichier introuvable : ${localPath}`);
  process.exit(1);
}

const filename = path.basename(localPath);
const size = fs.statSync(localPath).size;

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

const body = fs.readFileSync(localPath);

console.log(`[upload] ${filename} (${(size / 1024 / 1024).toFixed(1)} Mo) → R2 bucket ${BUCKET}...`);

await client.send(new PutObjectCommand({
  Bucket: BUCKET,
  Key: filename,
  Body: body,
  ContentType: 'audio/mpeg',
  CacheControl: 'public, max-age=31536000, immutable',
}));

const publicUrl = `${PUBLIC_URL_BASE}/${filename}`;
console.log(`[upload] OK ✓`);
console.log(`[upload] URL publique : ${publicUrl}`);
console.log(`[upload] Taille : ${size} bytes`);
```

- [ ] **Step 2.2: Tester le script avec l'épisode 01**

Run:
```bash
node scripts/podcast-upload.js ~/Projets/podcast-wondery/exports/episode-01-la-fracture-MASTER.mp3
```
Expected:
- Log `[upload] episode-01-la-fracture-MASTER.mp3 (23.7 Mo) → R2 bucket jerwis-podcast-audio...`
- Log `[upload] OK ✓`
- Log `[upload] URL publique : https://pub-XXX.r2.dev/episode-01-la-fracture-MASTER.mp3`

**Noter cette URL**, elle sera utilisée dans `data/episodes.json` Task 3. Si le custom domain `podcast-audio.jerwis.fr` est configuré, utiliser cette URL plutôt que `pub-*.r2.dev`.

- [ ] **Step 2.3: Vérifier que le MP3 est accessible publiquement**

Run:
```bash
curl -I https://pub-XXX.r2.dev/episode-01-la-fracture-MASTER.mp3
```
Expected: `HTTP/2 200` avec `content-type: audio/mpeg` et `content-length: 24869451`.

Si 403/404 : le bucket n'est pas en public access. Revenir au pré-requis 3.

- [ ] **Step 2.4: Uploader les épisodes 02 et 03**

Run:
```bash
node scripts/podcast-upload.js ~/Projets/podcast-wondery/exports/episode-02-les-quatre-jours-MASTER.mp3
node scripts/podcast-upload.js ~/Projets/podcast-wondery/exports/episode-03-freres-ennemis-MASTER.mp3
```
Expected: 2 uploads OK, 2 URLs publiques loggées. **Les noter aussi**.

- [ ] **Step 2.5: Commit le script upload**

```bash
git add scripts/podcast-upload.js
git commit -m "feat(podcast): script upload MP3 vers Cloudflare R2 via aws-sdk-s3"
```

---

## Task 3 · Créer `data/episodes.json` source de vérité

**Files:**
- Create: `data/episodes.json`

- [ ] **Step 3.1: Mesurer la durée exacte de l'ép. 03**

Run:
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 ~/Projets/podcast-wondery/exports/episode-03-freres-ennemis-MASTER.mp3
```
Expected: nombre de secondes en float (ex. `892.42...`). Noter cette valeur arrondie en entier.

- [ ] **Step 3.2: Récupérer la taille en bytes de chaque MP3**

Run:
```bash
stat -f '%N %z' ~/Projets/podcast-wondery/exports/episode-0{1,2,3}-*.mp3
```
Expected: 3 lignes `<chemin> <bytes>`. Noter `size_bytes` pour chaque épisode.

- [ ] **Step 3.3: Écrire episodes.json**

Create `data/episodes.json` (remplacer les URL R2 par celles obtenues Task 2.2/2.4, et les `size_bytes` par ceux de 3.2, et la `duration` ép. 03 par la valeur de 3.1) :

```json
{
  "series": {
    "title": "Guerres d'IA",
    "season": 1,
    "subtitle": "Saison 01",
    "description_short": "Série narrative FR. Les batailles qui définissent l'écosystème IA.",
    "description_long": "Sam Altman contre Dario Amodei. Les schismes idéologiques entre OpenAI et Anthropic. Les coups d'état qui ont fait trembler la Silicon Valley. Série narrative française style Wondery, 15 minutes par épisode, mastering studio, voix ElevenLabs. Une production Jerwis Productions.",
    "cover": "/podcast/covers/serie.png",
    "cover_3000": "/podcast/covers/serie-3000.png",
    "author": "Jérémy Sagnier",
    "publisher": "Jerwis Productions",
    "owner_email": "jeremy@jerwis.fr",
    "language": "fr-FR",
    "explicit": false,
    "categories_itunes": ["Technology", "News"],
    "copyright": "© 2026 Jerwis Productions",
    "itunes_type": "episodic",
    "site_url": "https://jerwis.fr/podcast.html",
    "feed_url": "https://jerwis.fr/feed/podcast.xml"
  },
  "episodes": [
    {
      "id": "01",
      "slug": "la-fracture",
      "title": "La Fracture",
      "description_short": "Novembre 2023. Altman et Amodei au sommet. Un désaccord qui casse la fraternité OpenAI/Anthropic.",
      "description_long": "À RÉDIGER par Jérémy (300-500 mots, ton Leo, contexte + insights + sources).",
      "duration_seconds": 1036,
      "duration_formatted": "17:16",
      "published": "2026-04-22T09:00:00+02:00",
      "audio_url": "REMPLACER_PAR_URL_R2_EP01",
      "audio_size_bytes": 24869451,
      "cover": "/podcast/covers/ep01.png",
      "cover_3000": "/podcast/covers/ep01-3000.png",
      "accent_color": "fuchsia",
      "guests_voices": [
        "Paul K · Narrateur",
        "Simon · Sam Altman",
        "Mathieu · Dario Amodei",
        "Camille Martin · Daniela Amodei"
      ]
    },
    {
      "id": "02",
      "slug": "les-quatre-jours",
      "title": "Les Quatre Jours",
      "description_short": "Le coup d'état OpenAI, minute par minute. Sutskever vote, Brockman part, Satya ramasse.",
      "description_long": "À RÉDIGER par Jérémy.",
      "duration_seconds": 1044,
      "duration_formatted": "17:24",
      "published": "2026-04-23T09:00:00+02:00",
      "audio_url": "REMPLACER_PAR_URL_R2_EP02",
      "audio_size_bytes": 25068191,
      "cover": "/podcast/covers/ep02.png",
      "cover_3000": "/podcast/covers/ep02-3000.png",
      "accent_color": "orange",
      "guests_voices": [
        "Paul K · Narrateur",
        "Simon · Sam Altman",
        "Mathieu · Dario Amodei",
        "Maxime · Greg Brockman",
        "Marc Aurèle · Ilya Sutskever",
        "Stephyra · Helen Toner",
        "Olivier 50s · Satya Nadella"
      ]
    },
    {
      "id": "03",
      "slug": "freres-ennemis",
      "title": "Frères Ennemis",
      "description_short": "À RÉDIGER (150 chars max).",
      "description_long": "À RÉDIGER par Jérémy.",
      "duration_seconds": 0,
      "duration_formatted": "0:00",
      "published": "2026-04-24T09:00:00+02:00",
      "audio_url": "REMPLACER_PAR_URL_R2_EP03",
      "audio_size_bytes": 22033807,
      "cover": "/podcast/covers/ep03.png",
      "cover_3000": "/podcast/covers/ep03-3000.png",
      "accent_color": "fuchsia-teal",
      "guests_voices": []
    }
  ]
}
```

Remplacer `duration_seconds` et `duration_formatted` pour l'ép. 03 avec la valeur mesurée en 3.1 (format MM:SS si < 60 min).

- [ ] **Step 3.4: Valider que le JSON parse**

Run:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('data/episodes.json')).series.title)"
```
Expected: `Guerres d'IA`. Si erreur JSON, corriger la syntaxe avant de continuer.

- [ ] **Step 3.5: Commit le JSON**

```bash
git add data/episodes.json
git commit -m "feat(podcast): data/episodes.json source de verite (3 episodes Guerres d'IA)"
```

---

## Task 4 · Helpers + tests unitaires

**Files:**
- Create: `scripts/test-helpers.js`

- [ ] **Step 4.1: Créer les helpers + tests**

Create `scripts/test-helpers.js`:

```js
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
```

- [ ] **Step 4.2: Exécuter les tests**

Run: `npm test`
Expected: 8 tests passent, 0 failures.

- [ ] **Step 4.3: Commit les helpers + tests**

```bash
git add scripts/test-helpers.js
git commit -m "feat(podcast): helpers + 8 tests unitaires (format duration, escape xml/html, accent colors)"
```

---

## Task 5 · Template HTML cover (Direction 4)

**Files:**
- Create: `templates/podcast-cover.html`

- [ ] **Step 5.1: Créer le template paramétré**

Create `templates/podcast-cover.html`:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --teal: #00B2A9;
    --fuchsia: #EF426F;
    --orange: #FF8200;
    --ink-deep: #050507;
    --cream: #FBF7F0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 3000px;
    height: 3000px;
    overflow: hidden;
    background: var(--ink-deep);
  }
  .cover {
    position: relative;
    width: 3000px;
    height: 3000px;
    overflow: hidden;
    background: var(--ink-deep);
  }
  .shape {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 35%, {{C1}} 0%, transparent 35%),
      radial-gradient(circle at 70% 45%, {{C2}} 0%, transparent 38%),
      radial-gradient(circle at 50% 72%, {{C3}} 0%, transparent 30%);
    filter: blur(30px) contrast(1.45) saturate(1.4);
    opacity: 0.88;
    mix-blend-mode: screen;
  }
  .noise {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
    background-size: 600px 600px;
    mix-blend-mode: overlay;
  }
  .scanlines {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 24px,
      rgba(0,0,0,0.22) 24.5px,
      rgba(0,0,0,0.22) 32px
    );
    z-index: 2;
  }
  .top {
    position: absolute;
    top: 0; left: 0; right: 0;
    padding: 180px 180px 0;
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 42px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cream);
  }
  .bot {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 0 180px 200px;
    z-index: 4;
  }
  .title {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: {{TITLE_SIZE}}px;
    line-height: 0.92;
    letter-spacing: -0.035em;
    color: var(--cream);
    text-transform: uppercase;
    text-shadow:
      12px 0 0 rgba(239,66,111,0.65),
      -12px 0 0 rgba(0,178,169,0.65);
  }
  .title .slash {
    color: var(--teal);
    font-weight: 400;
    text-shadow: none;
  }
  .sub {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 500;
    font-size: 48px;
    color: rgba(251,247,240,0.75);
    letter-spacing: 0.02em;
    margin-top: 48px;
    max-width: 2100px;
    line-height: 1.4;
  }
</style>
</head>
<body>
<div class="cover">
  <div class="shape"></div>
  <div class="noise"></div>
  <div class="scanlines"></div>
  <div class="top">
    <span>{{LABEL_TOP_LEFT}}</span>
    <span>{{LABEL_TOP_RIGHT}}</span>
  </div>
  <div class="bot">
    <div class="title">{{TITLE_LINE_1}}<br><span class="slash">//</span> {{TITLE_LINE_2}}</div>
    <div class="sub">{{SUBTITLE}}</div>
  </div>
</div>
</body>
</html>
```

Les placeholders `{{C1}}`, `{{C2}}`, `{{C3}}`, `{{TITLE_SIZE}}`, `{{LABEL_TOP_LEFT}}`, `{{LABEL_TOP_RIGHT}}`, `{{TITLE_LINE_1}}`, `{{TITLE_LINE_2}}`, `{{SUBTITLE}}` seront injectés par le script Task 6.

- [ ] **Step 5.2: Commit template**

```bash
git add templates/podcast-cover.html
git commit -m "feat(podcast): template HTML cover 3000x3000 Direction 4 parametre"
```

---

## Task 6 · Script build-podcast-covers.js · HTML → PNG

**Files:**
- Create: `scripts/build-podcast-covers.js`
- Create: `podcast/covers/` (répertoire)

- [ ] **Step 6.1: Créer le répertoire covers**

Run:
```bash
mkdir -p podcast/covers
```

- [ ] **Step 6.2: Créer le script de génération**

Create `scripts/build-podcast-covers.js`:

```js
// Génère les pochettes PNG 3000×3000 (+ resizes) depuis templates/podcast-cover.html
// Lit data/episodes.json, rend chaque cover via Puppeteer, sauvegarde dans podcast/covers/
// Usage : npm run podcast:covers

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { accentColorToCss } from './test-helpers.js';

const ROOT = process.cwd();
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'templates/podcast-cover.html'), 'utf8');
const EPISODES = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/episodes.json'), 'utf8'));
const OUT_DIR = path.join(ROOT, 'podcast/covers');

fs.mkdirSync(OUT_DIR, { recursive: true });

function render(html, vars) {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{{${k}}}`, String(v)),
    html
  );
}

function splitTitle(title) {
  // Coupe le titre en 2 lignes équilibrées. Si 1 seul mot, on le laisse en ligne 2 avec "//"
  const words = title.split(' ');
  if (words.length === 1) return { line1: '', line2: title };
  if (words.length === 2) return { line1: words[0], line2: words[1] };
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  };
}

function computeTitleSize(line1, line2) {
  const longest = Math.max(line1.length, line2.length);
  // 3000px de large, 360px de marge = 2640px de texte utilisable
  // JetBrains Mono 700 ~0.55em de width par char → size ≈ 2640 / (longest * 0.55)
  return Math.min(480, Math.floor(2640 / Math.max(4, longest) / 0.55));
}

async function renderCover(browser, htmlContent, outPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 3000, height: 3000, deviceScaleFactor: 1 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  // Attendre les fonts Google
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 3000, height: 3000 }, omitBackground: false });
  await page.close();
  console.log(`[covers] ✓ ${path.basename(outPath)}`);
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const covers = [
    {
      out: 'serie',
      accent: 'serie',
      label_tl: 'JERWIS PRODUCTIONS',
      label_tr: `S${String(EPISODES.series.season).padStart(2, '0')}`,
      title: EPISODES.series.title,
      subtitle: EPISODES.series.description_short,
    },
    ...EPISODES.episodes.map((ep) => ({
      out: `ep${ep.id}`,
      accent: ep.accent_color,
      label_tl: 'JERWIS PRODUCTIONS',
      label_tr: `ÉP. ${ep.id}`,
      title: ep.title,
      subtitle: ep.description_short,
    })),
  ];

  for (const cov of covers) {
    const { c1, c2, c3 } = accentColorToCss(cov.accent);
    const { line1, line2 } = splitTitle(cov.title);
    const titleSize = computeTitleSize(line1, line2);
    const html = render(TEMPLATE, {
      C1: c1,
      C2: c2,
      C3: c3,
      TITLE_SIZE: titleSize,
      LABEL_TOP_LEFT: cov.label_tl,
      LABEL_TOP_RIGHT: cov.label_tr,
      TITLE_LINE_1: line1,
      TITLE_LINE_2: line2,
      SUBTITLE: cov.subtitle,
    });

    const outPath3000 = path.join(OUT_DIR, `${cov.out}-3000.png`);
    await renderCover(browser, html, outPath3000);

    // Resize en 512×512 pour la page site
    await sharp(outPath3000)
      .resize(512, 512, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, `${cov.out}.png`));
    console.log(`[covers] ✓ ${cov.out}.png (512×512 resize)`);
  }

  await browser.close();
  console.log('[covers] Done.');
}

main().catch((err) => {
  console.error('[covers] FATAL:', err);
  process.exit(1);
});
```

- [ ] **Step 6.3: Lancer la génération**

Run: `npm run podcast:covers`
Expected (logs):
```
[covers] ✓ serie-3000.png
[covers] ✓ serie.png (512×512 resize)
[covers] ✓ ep01-3000.png
[covers] ✓ ep01.png (512×512 resize)
[covers] ✓ ep02-3000.png
[covers] ✓ ep02.png (512×512 resize)
[covers] ✓ ep03-3000.png
[covers] ✓ ep03.png (512×512 resize)
[covers] Done.
```

Durée : ~15-20 sec.

- [ ] **Step 6.4: Vérifier les dimensions**

Run:
```bash
for f in podcast/covers/*-3000.png; do
  sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | grep -E "pixel(Width|Height)"
done
```
Expected: chaque fichier `pixelWidth: 3000` et `pixelHeight: 3000`.

Run:
```bash
for f in podcast/covers/serie.png podcast/covers/ep0*.png; do
  sips -g pixelWidth "$f" 2>/dev/null
done
```
Expected: `pixelWidth: 512` pour les 4 fichiers sans `-3000`.

- [ ] **Step 6.5: Ouvrir les PNG pour validation visuelle**

Run: `open podcast/covers/serie-3000.png`
Expected: pochette Direction 4, titre "Guerres // d'IA" bien lisible, teal/fuchsia/orange mélangés, noise + scanlines visibles.

Run: `open podcast/covers/ep01-3000.png podcast/covers/ep02-3000.png podcast/covers/ep03-3000.png`
Expected: 3 pochettes avec titres différents, dominante fuchsia pour ep01, orange pour ep02, fuchsia+teal pour ep03.

Si une pochette est cassée (texte tronqué, couleurs ratées, police manquante) : ajuster `computeTitleSize()` ou le template CSS et relancer 6.3.

- [ ] **Step 6.6: Commit script + PNG générés**

```bash
git add scripts/build-podcast-covers.js podcast/covers/
git commit -m "feat(podcast): script build-podcast-covers + 8 PNG generes (4 series/ep x 512 et 3000)"
```

---

## Task 7 · Script build-podcast-rss.js · Feed iTunes

**Files:**
- Create: `scripts/build-podcast-rss.js`
- Create: `feed/podcast.xml`

- [ ] **Step 7.1: Créer le répertoire feed**

Run: `mkdir -p feed`

- [ ] **Step 7.2: Créer le script RSS**

Create `scripts/build-podcast-rss.js`:

```js
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
```

- [ ] **Step 7.3: Lancer la génération**

Run: `npm run podcast:rss`
Expected: `[rss] ✓ /Users/.../feed/podcast.xml (4800+ chars, 3 épisodes)`.

- [ ] **Step 7.4: Vérifier que le XML est bien formé**

Run:
```bash
xmllint --noout feed/podcast.xml && echo "XML OK"
```
Expected: `XML OK`. Si erreur, corriger le script et relancer.

- [ ] **Step 7.5: Valider la structure iTunes**

Le validateur Apple officiel est en ligne : https://castfeedvalidator.com/. Il faut un feed publiquement accessible. Pour cette étape préliminaire, on vérifie manuellement les éléments obligatoires :

Run:
```bash
grep -E "<itunes:(author|owner|image|category|explicit|type)|<channel>|<item>|<enclosure" feed/podcast.xml
```
Expected: au moins 1 match de chaque balise itunes obligatoire. Si une balise manque : fix le script.

- [ ] **Step 7.6: Commit script + feed**

```bash
git add scripts/build-podcast-rss.js feed/podcast.xml
git commit -m "feat(podcast): RSS feed iTunes-conforme (3 episodes, validation xmllint OK)"
```

---

## Task 8 · Lecteur audio HTML5 custom

**Files:**
- Create: `assets/podcast-player.js`

- [ ] **Step 8.1: Créer le lecteur**

Create `assets/podcast-player.js`:

```js
// Lecteur podcast HTML5 custom · zéro dépendance · ~200 lignes
// Attache un player à chaque <div data-podcast-player data-src="..." data-ep="XX">.
// Style Direction 4 : pilule noire + play fuchsia + timeline teal.
// Features : play/pause, seek, vitesse 1/1.25/1.5/2, persistance position localStorage,
// 1 seul player à la fois, raccourcis clavier, ARIA.

(function() {
  if (typeof window === 'undefined') return;

  // Singleton pour garantir 1 player actif à la fois
  let currentPlaying = null;

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function initPlayer(container) {
    const src = container.dataset.src;
    const epId = container.dataset.ep || '';
    const storageKey = `podcast-ep-${epId}-position`;

    if (!src) {
      console.warn('[podcast-player] missing data-src on', container);
      return;
    }

    // HTML structure
    container.innerHTML = `
      <button class="pp-play" aria-label="Lire l'épisode" type="button">
        <svg class="pp-icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <svg class="pp-icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
      </button>
      <div class="pp-timeline" role="slider" aria-label="Progression" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
        <div class="pp-timeline-fill"></div>
      </div>
      <div class="pp-time"><span class="pp-current">0:00</span> / <span class="pp-total">--:--</span></div>
      <button class="pp-speed" aria-label="Vitesse de lecture" type="button">1×</button>
      <audio preload="metadata" src="${src}"></audio>
    `;

    const audio = container.querySelector('audio');
    const playBtn = container.querySelector('.pp-play');
    const timeline = container.querySelector('.pp-timeline');
    const fill = container.querySelector('.pp-timeline-fill');
    const currentEl = container.querySelector('.pp-current');
    const totalEl = container.querySelector('.pp-total');
    const speedBtn = container.querySelector('.pp-speed');

    const SPEEDS = [1, 1.25, 1.5, 2];
    let speedIdx = 0;

    // Restore position
    const saved = Number(localStorage.getItem(storageKey) || 0);
    if (saved > 0) {
      audio.addEventListener('loadedmetadata', () => {
        if (saved < audio.duration - 5) audio.currentTime = saved;
      }, { once: true });
    }

    audio.addEventListener('loadedmetadata', () => {
      totalEl.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      fill.style.width = pct + '%';
      currentEl.textContent = fmt(audio.currentTime);
      timeline.setAttribute('aria-valuenow', Math.round(pct));
      // Save every 5s
      if (Math.floor(audio.currentTime) % 5 === 0) {
        localStorage.setItem(storageKey, String(audio.currentTime));
      }
    });

    audio.addEventListener('ended', () => {
      container.dataset.state = 'idle';
      localStorage.removeItem(storageKey);
      currentPlaying = null;
    });

    audio.addEventListener('play', () => {
      if (currentPlaying && currentPlaying !== audio) {
        currentPlaying.pause();
      }
      currentPlaying = audio;
      container.dataset.state = 'playing';
    });

    audio.addEventListener('pause', () => {
      if (!audio.ended) container.dataset.state = 'paused';
    });

    playBtn.addEventListener('click', () => {
      if (audio.paused) audio.play();
      else audio.pause();
    });

    timeline.addEventListener('click', (e) => {
      const rect = timeline.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = pct * audio.duration;
    });

    timeline.addEventListener('keydown', (e) => {
      if (!audio.duration) return;
      if (e.key === 'ArrowLeft') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        e.preventDefault();
      }
    });

    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % SPEEDS.length;
      audio.playbackRate = SPEEDS[speedIdx];
      speedBtn.textContent = SPEEDS[speedIdx] + '×';
    });

    container.dataset.state = 'idle';
  }

  function initAll() {
    document.querySelectorAll('[data-podcast-player]').forEach(initPlayer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
```

- [ ] **Step 8.2: Commit le lecteur**

```bash
git add assets/podcast-player.js
git commit -m "feat(podcast): lecteur HTML5 custom (~200 lignes, 0 dep, Direction 4)"
```

---

## Task 9 · Script build-podcast-page.js · Layout A

**Files:**
- Create: `scripts/build-podcast-page.js`
- Create: `podcast.html`

- [ ] **Step 9.1: Créer le script page**

Create `scripts/build-podcast-page.js`:

```js
// Génère podcast.html (Layout A éditorial magazine) depuis data/episodes.json
// Usage : npm run podcast:page

import fs from 'node:fs';
import path from 'node:path';
import { escapeHtml, formatDurationMMSS } from './test-helpers.js';

const ROOT = process.cwd();
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/episodes.json'), 'utf8'));
const OUT = path.join(ROOT, 'podcast.html');
const SITE = 'https://jerwis.fr';

function episodeCard(ep, idx) {
  const duration = formatDurationMMSS(ep.duration_seconds);
  return `
      <article class="pod-ep" id="${ep.slug}" data-accent="${ep.accent_color}">
        <a class="pod-ep-cover" href="#${ep.slug}">
          <img src="${ep.cover}" alt="Pochette ${escapeHtml(ep.title)}" width="120" height="120" loading="${idx === 0 ? 'eager' : 'lazy'}">
        </a>
        <div class="pod-ep-body">
          <div class="pod-ep-num">Épisode ${ep.id} · ${duration}</div>
          <h3 class="pod-ep-title">${escapeHtml(ep.title)}</h3>
          <p class="pod-ep-desc">${escapeHtml(ep.description_short)}</p>
          <div class="pod-player" data-podcast-player data-src="${escapeHtml(ep.audio_url)}" data-ep="${ep.id}"></div>
          ${ep.guests_voices.length > 0 ? `<details class="pod-ep-cast"><summary>Casting voix</summary><ul>${ep.guests_voices.map((v) => `<li>${escapeHtml(v)}</li>`).join('')}</ul></details>` : ''}
        </div>
      </article>`;
}

const s = DATA.series;
const totalMinutes = Math.round(DATA.episodes.reduce((acc, e) => acc + e.duration_seconds, 0) / 60);
const firstEp = DATA.episodes[0];

const html = `<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(s.title)} · Podcast par Jerwis Productions — Jérémy Sagnier</title>
<meta name="description" content="${escapeHtml(s.description_short)} Série narrative FR produite par Jerwis Productions. ${DATA.episodes.length} épisodes, ${totalMinutes} minutes, mastering studio.">

<meta property="og:title" content="${escapeHtml(s.title)} · Podcast par Jerwis Productions">
<meta property="og:description" content="${escapeHtml(s.description_short)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${s.site_url}">
<meta property="og:image" content="${SITE}${s.cover_3000}">
<meta property="og:locale" content="fr_FR">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@JeremySagnier">
<meta name="twitter:creator" content="@JeremySagnier">
<meta name="twitter:title" content="${escapeHtml(s.title)} · Podcast par Jerwis Productions">
<meta name="twitter:description" content="${escapeHtml(s.description_short)}">
<meta name="twitter:image" content="${SITE}${s.cover_3000}">

<link rel="canonical" href="${s.site_url}">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(s.title)} RSS" href="${s.feed_url}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "name": "${s.title}",
  "description": ${JSON.stringify(s.description_long)},
  "inLanguage": "${s.language}",
  "url": "${s.site_url}",
  "image": "${SITE}${s.cover_3000}",
  "author": { "@type": "Person", "name": "${s.author}" },
  "publisher": { "@type": "Organization", "name": "${s.publisher}" },
  "webFeed": "${s.feed_url}"
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/main.css">

<style>
  /* ===== Page podcast · Layout A éditorial magazine ===== */
  .pod-hero {
    padding: 64px 0 80px;
    background:
      radial-gradient(ellipse at 85% 15%, rgba(255,130,0,.15), transparent 50%),
      radial-gradient(ellipse at 10% 90%, rgba(0,178,169,.15), transparent 55%),
      radial-gradient(ellipse at 55% 55%, rgba(239,66,111,.12), transparent 60%),
      #0A0A0A;
    color: #F4EFE6;
    border-top: 1px solid rgba(255,255,255,.08);
  }
  .pod-hero-inner {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 60px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .pod-hero-cover {
    width: 400px;
    aspect-ratio: 1/1;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(239,66,111,0.18), 0 10px 30px rgba(0,0,0,0.5);
  }
  .pod-hero-cover img { width: 100%; height: 100%; display: block; }
  .pod-hero-kicker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: #00B2A9;
    margin-bottom: 16px;
  }
  .pod-hero h1 {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: clamp(48px, 7vw, 80px);
    line-height: 0.92;
    letter-spacing: -0.035em;
    color: #F4EFE6;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .pod-hero h1 .slash { color: #00B2A9; font-weight: 400; }
  .pod-hero-lead {
    font-size: 17px;
    color: rgba(244,239,230,0.8);
    line-height: 1.55;
    margin-bottom: 26px;
    max-width: 560px;
  }
  .pod-cta-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .pod-cta {
    padding: 12px 20px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: .15em;
    text-transform: uppercase;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .pod-cta.primary { background: #EF426F; color: #F4EFE6; }
  .pod-cta.primary:hover { background: #F4EFE6; color: #0A0A0A; }
  .pod-cta.ghost { background: transparent; color: #F4EFE6; border: 1px solid rgba(255,255,255,.3); }
  .pod-cta.ghost:hover { border-color: #F4EFE6; }
  .pod-hero-meta {
    display: flex;
    gap: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.12);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(244,239,230,0.55);
  }
  .pod-hero-meta strong { color: #F4EFE6; }

  /* ===== Plateformes ===== */
  .pod-platforms {
    background: var(--bg);
    padding: 36px 0;
    border-bottom: 1px solid var(--line);
  }
  .pod-platforms-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .pod-platforms-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--ink-soft);
    font-weight: 700;
    margin-right: 12px;
  }
  .pod-platform {
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: .12em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--ink);
    text-decoration: none;
    transition: all .15s;
  }
  .pod-platform:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }

  /* ===== CTA newsletter (après hero) ===== */
  .pod-cta-nl {
    background: var(--bg-2);
    padding: 28px 0;
    border-bottom: 1px solid var(--line);
  }
  .pod-cta-nl-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .pod-cta-nl-text strong {
    font-family: 'Archivo', sans-serif;
    font-weight: 900;
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
  }
  .pod-cta-nl-text span { font-size: 13px; color: var(--ink-soft); }
  .pod-cta-nl a {
    padding: 11px 22px;
    border-radius: 6px;
    background: #EF426F;
    color: #F4EFE6;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: .15em;
    text-transform: uppercase;
    font-weight: 700;
    text-decoration: none;
  }

  /* ===== Liste épisodes ===== */
  .pod-episodes {
    padding: 60px 0;
    background: var(--bg);
  }
  .pod-episodes-inner {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .pod-section-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 22px;
    text-transform: uppercase;
    letter-spacing: -.01em;
    margin-bottom: 28px;
    color: var(--ink);
  }
  .pod-ep {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    padding: 28px 0;
    border-top: 1px solid var(--line);
    align-items: flex-start;
  }
  .pod-ep:first-of-type { border-top: none; padding-top: 0; }
  .pod-ep-cover img {
    width: 120px;
    height: 120px;
    border-radius: 6px;
    display: block;
  }
  .pod-ep-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #EF426F;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .pod-ep-title {
    font-family: 'Archivo', sans-serif;
    font-weight: 900;
    font-size: 20px;
    line-height: 1.15;
    letter-spacing: -.015em;
    color: var(--ink);
    margin-bottom: 8px;
  }
  .pod-ep-desc {
    font-size: 14.5px;
    line-height: 1.55;
    color: var(--ink-soft);
    margin-bottom: 14px;
  }
  .pod-ep-cast {
    margin-top: 12px;
    font-size: 13px;
    color: var(--ink-soft);
  }
  .pod-ep-cast summary { cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; font-weight: 700; }
  .pod-ep-cast ul { margin: 10px 0 0 20px; }
  .pod-ep-cast li { line-height: 1.5; }

  /* ===== Player ===== */
  [data-podcast-player] {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 14px 8px 8px;
    background: #0A0A0A;
    border-radius: 999px;
    max-width: 440px;
  }
  .pp-play {
    width: 34px; height: 34px;
    border: none;
    border-radius: 50%;
    background: #EF426F;
    color: #F4EFE6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .15s;
    flex-shrink: 0;
  }
  .pp-play:hover { background: #FF8200; }
  .pp-play svg { width: 14px; height: 14px; }
  [data-podcast-player] .pp-icon-pause { display: none; }
  [data-podcast-player][data-state="playing"] .pp-icon-play { display: none; }
  [data-podcast-player][data-state="playing"] .pp-icon-pause { display: block; }
  .pp-timeline {
    flex: 1;
    height: 5px;
    background: rgba(255,255,255,0.12);
    border-radius: 3px;
    position: relative;
    cursor: pointer;
  }
  .pp-timeline:focus { outline: 2px solid #00B2A9; outline-offset: 4px; }
  .pp-timeline-fill {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: #00B2A9;
    border-radius: 3px;
    width: 0%;
  }
  .pp-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(244,239,230,0.75);
    letter-spacing: .05em;
    flex-shrink: 0;
  }
  .pp-speed {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: .1em;
    font-weight: 700;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: #F4EFE6;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .pp-speed:hover { background: rgba(255,255,255,0.08); }

  /* ===== Mini marquee ===== */
  .pod-marquee {
    overflow: hidden;
    padding: 14px 0;
    background: linear-gradient(90deg, #00B2A9 0%, #EF426F 50%, #FF8200 100%);
    color: #fff;
    position: relative;
    border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid rgba(0,0,0,.15);
  }
  .pod-marquee::before {
    content: ""; position: absolute; inset: 0;
    background: rgba(10,10,10,.18); mix-blend-mode: multiply; pointer-events: none;
  }
  .pod-marquee-track {
    display: flex; gap: 40px; white-space: nowrap;
    animation: pod-marquee-scroll 50s linear infinite;
    font-family: 'Archivo Black', sans-serif;
    font-size: 17px;
    text-transform: uppercase;
    letter-spacing: -.01em;
    position: relative; z-index: 1;
  }
  .pod-marquee-track span {
    display: inline-flex; align-items: center; gap: 40px;
  }
  .pod-marquee-track span::after {
    content: "◆"; color: rgba(10,10,10,.5); font-size: 11px;
  }
  @keyframes pod-marquee-scroll { to { transform: translateX(-50%) } }

  /* ===== Responsive ===== */
  @media (max-width: 760px) {
    .pod-hero { padding: 44px 0 56px; }
    .pod-hero-inner { grid-template-columns: 1fr; gap: 32px; padding: 0 20px; text-align: center; }
    .pod-hero-cover { width: min(280px, 80vw); margin: 0 auto; }
    .pod-hero h1 { font-size: clamp(38px, 9vw, 56px); }
    .pod-cta-row { justify-content: center; }
    .pod-ep { grid-template-columns: 80px 1fr; gap: 16px; }
    .pod-ep-cover img { width: 80px; height: 80px; }
    [data-podcast-player] { max-width: 100%; flex-wrap: wrap; }
  }
</style>
</head>
<body>

<!-- Triple-stripe signature Fiesta (top du site) -->
<div class="triple-stripe" aria-hidden="true">
  <span style="background:#00B2A9"></span>
  <span style="background:#EF426F"></span>
  <span style="background:#FF8200"></span>
</div>

<header class="header">
  <!-- Nav identique aux autres pages · sera MAJ dans Task 11 -->
  <div class="header-inner">
    <a class="brand" href="index.html">jerwis<em>.fr</em></a>
    <nav class="nav">
      <a href="apprendre.html">Apprendre</a>
      <a href="index.html#newsletters">Newsletters</a>
      <a href="podcast.html" class="active">Podcasts</a>
      <a href="index.html#freebies">Télécharger</a>
      <a href="index.html#projects">Projets</a>
      <a href="index.html#content">Sources</a>
      <a href="index.html#story">L'histoire</a>
    </nav>
  </div>
</header>

<main>

  <section class="pod-hero">
    <div class="pod-hero-inner">
      <div class="pod-hero-cover">
        <img src="${s.cover}" alt="Pochette ${escapeHtml(s.title)}" width="400" height="400">
      </div>
      <div class="pod-hero-text">
        <div class="pod-hero-kicker">${escapeHtml(s.publisher)} · ${escapeHtml(s.subtitle)}</div>
        <h1>${escapeHtml(s.title.split(' ')[0])}<br><span class="slash">//</span> ${escapeHtml(s.title.split(' ').slice(1).join(' '))}</h1>
        <p class="pod-hero-lead">${escapeHtml(s.description_long)}</p>
        <div class="pod-cta-row">
          <a class="pod-cta primary" href="#${firstEp.slug}">▶ Écouter l'épisode 01</a>
          <a class="pod-cta ghost" href="${s.feed_url}">Flux RSS</a>
        </div>
        <div class="pod-hero-meta">
          <span><strong>${DATA.episodes.length}</strong> épisodes</span>
          <span><strong>${totalMinutes}</strong> minutes</span>
          <span>FR · ${s.language}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="pod-platforms">
    <div class="pod-platforms-inner">
      <span class="pod-platforms-label">Écouter sur</span>
      <a class="pod-platform" href="https://podcasts.apple.com/" rel="noopener">Apple Podcasts</a>
      <a class="pod-platform" href="https://open.spotify.com/" rel="noopener">Spotify</a>
      <a class="pod-platform" href="${s.feed_url}">RSS</a>
      <a class="pod-platform" href="https://www.youtube.com/" rel="noopener">YouTube</a>
    </div>
  </section>

  <section class="pod-cta-nl">
    <div class="pod-cta-nl-inner">
      <div class="pod-cta-nl-text">
        <strong>La newsletter AI Playbook complète le podcast</strong>
        <span>Chaque vendredi 9h. Veille IA, outils, insights. Pas de spam. Désinscription 1 clic.</span>
      </div>
      <a href="index.html#newsletters">S'inscrire →</a>
    </div>
  </section>

  <section class="pod-episodes">
    <div class="pod-episodes-inner">
      <h2 class="pod-section-title">Tous les épisodes · ${DATA.episodes.length}</h2>
      ${DATA.episodes.map(episodeCard).join('\n')}
    </div>
  </section>

  <div class="pod-marquee" aria-hidden="true">
    <div class="pod-marquee-track">
      <span>Narration FR</span><span>Stack ElevenLabs</span><span>Mastering studio -16 LUFS</span><span>Zéro IA générique</span><span>15 min par épisode</span>
      <span>Narration FR</span><span>Stack ElevenLabs</span><span>Mastering studio -16 LUFS</span><span>Zéro IA générique</span><span>15 min par épisode</span>
    </div>
  </div>

  <section class="pod-cta-nl" style="border-bottom: none">
    <div class="pod-cta-nl-inner">
      <div class="pod-cta-nl-text">
        <strong>Reçois la newsletter de Jérémy</strong>
        <span>AI Playbook · veille automatique que Jérémy se produit d'abord pour lui. 1 clic pour sortir.</span>
      </div>
      <a href="index.html#newsletters">S'inscrire →</a>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="footer-inner">
    <p>© 2026 <strong>Jerwis Productions</strong> · par Jérémy Sagnier</p>
    <p class="footer-sub">Podcast · Newsletter · Articles · Téléchargements gratuits</p>
  </div>
</footer>

<script src="assets/podcast-player.js" defer></script>

</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log(`[page] ✓ ${OUT} (${html.length} chars)`);
```

- [ ] **Step 9.2: Lancer la génération**

Run: `npm run podcast:page`
Expected: `[page] ✓ /Users/.../podcast.html (20000+ chars)`.

- [ ] **Step 9.3: Valider visuellement en local**

Run:
```bash
python3 -m http.server 8000 &
open http://localhost:8000/podcast.html
```
Expected:
- Page chargée avec hero dark, pochette série 400px à gauche, titre "Guerres // d'IA" à droite
- 3 cards épisodes avec pochettes 120px chacune
- Player clique play → audio démarre (streamé depuis R2)
- Timeline progresse, vitesse cyclable, détails casting dépliables
- Mini-marquee qui scroll

**Arrêter le serveur** avec `kill %1` après test.

- [ ] **Step 9.4: Tester "1 seul player à la fois"**

Avec la page ouverte, cliquer play sur ép. 01. Après 5 secondes, cliquer play sur ép. 02. Expected: ép. 01 se met en pause automatiquement.

- [ ] **Step 9.5: Commit script + page générée**

```bash
git add scripts/build-podcast-page.js podcast.html
git commit -m "feat(podcast): script build-podcast-page + podcast.html Layout A editorial"
```

---

## Task 10 · Ajouter "Podcasts" dans la nav des 10 pages

**Files (à modifier):** `index.html`, `apprendre.html`, `workflows.html`, `outils.html`, `github.html`, `claude-code.html`, `debutant.html`, `lexique.html`, `quiz.html`, `preferences.html`

- [ ] **Step 10.1: Identifier le pattern nav dans index.html**

Run:
```bash
grep -n "Newsletter\|Télécharger\|Download\|Apprendre" index.html | head -10
```
Expected: voir la ligne type `<a href="...#newsletters">Newsletters</a>` ou similaire pour chaque entrée.

- [ ] **Step 10.2: Modifier la nav dans chaque page**

Pour chaque fichier de la liste, insérer `<a href="podcast.html">Podcasts</a>` entre `Newsletters` et `Télécharger`.

Run (script batch avec sed) :
```bash
for f in index.html apprendre.html workflows.html outils.html github.html claude-code.html debutant.html lexique.html quiz.html preferences.html; do
  # Le pattern exact peut varier — vérifier manuellement le résultat
  grep -l "Newsletters</a>" "$f" && echo "Fichier $f trouvé"
done
```

**Note** : chaque page a sa propre structure de nav. Ne PAS faire un sed brutal. Pour chaque fichier :

1. Ouvrir le fichier
2. Chercher le bloc nav (généralement sous `<header class="header">` ou `.nav`)
3. Ajouter `<a href="podcast.html">Podcasts</a>` entre l'entrée `Newsletters` et l'entrée suivante (`Télécharger` ou similaire)

Si la page est la page `podcast.html` (Task 9), on a déjà marqué `Podcasts` comme `class="active"`. Sur les autres pages, pas de `active`.

- [ ] **Step 10.3: Vérifier chaque page après modif**

Run:
```bash
for f in index.html apprendre.html workflows.html outils.html github.html claude-code.html debutant.html lexique.html quiz.html preferences.html; do
  count=$(grep -c 'href="podcast.html"' "$f")
  echo "$f: $count"
done
```
Expected: chaque ligne `<file>: 1`. Si 0, la modif n'a pas été faite pour ce fichier. Si >1, il y a un doublon.

- [ ] **Step 10.4: Smoke test visual**

Run: `python3 -m http.server 8000 &` puis `open http://localhost:8000/`.
Expected: nav top affiche `Apprendre · Newsletters · Podcasts · Télécharger · ...` dans l'ordre.

Cliquer sur `Podcasts` → arrive sur `/podcast.html`.

- [ ] **Step 10.5: Commit nav updates**

```bash
git add index.html apprendre.html workflows.html outils.html github.html claude-code.html debutant.html lexique.html quiz.html preferences.html
git commit -m "feat(nav): ajout entree 'Podcasts' dans la nav des 10 pages (entre Newsletters et Telecharger)"
```

---

## Task 11 · Mise à jour sitemap + CLAUDE.md

**Files:**
- Modify: `sitemap.xml`
- Modify: `CLAUDE.md`

- [ ] **Step 11.1: Ajouter /podcast.html au sitemap**

Editer `sitemap.xml` pour ajouter une entrée (à la fin des `<url>` existantes, avant `</urlset>`):

```xml
  <url>
    <loc>https://jerwis.fr/podcast.html</loc>
    <lastmod>2026-04-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
```

Run pour vérifier:
```bash
xmllint --noout sitemap.xml && echo "OK"
```
Expected: `OK`.

- [ ] **Step 11.2: Ajouter une section Podcast au CLAUDE.md**

Dans `CLAUDE.md`, après la section existante `## API — Inscription Resend`, ajouter :

```markdown
## Section Podcast · Jerwis Productions

- **Source de vérité** · `data/episodes.json` uniquement. Jamais hardcoder les infos épisode ailleurs.
- **Workflow nouvel épisode** :
  1. Ajouter entrée dans `episodes[]` de `data/episodes.json` (titre, description courte/longue, duration, date, accent_color, casting voix)
  2. Uploader le MP3 sur R2 · `npm run podcast:upload <chemin-mp3>`
  3. Copier l'URL publique R2 retournée dans `episodes[N].audio_url`
  4. Rebuild global · `npm run podcast:build` (régénère covers + RSS + page)
  5. Commit + push → Vercel redéploie, Apple/Spotify scannent le RSS dans les 24h
- **Pochettes** · Direction 4 (duotone glitch) générées par `build-podcast-covers.js`. Ne pas modifier manuellement les PNG. Pour changer le style, modifier `templates/podcast-cover.html` + regénérer.
- **Label partout** · "Jerwis Productions" (pluriel). Jamais "par Jérémy Sagnier" seul sur les artefacts podcast (site, RSS, covers).
- **Typo titres podcast** · JetBrains Mono 700 uppercase avec `//` en teal comme séparateur. Volontaire · casse avec la 90s Fiesta pour un ton narratif moderne.
- **Player audio** · 1 seul joue à la fois (pause des autres au click play), position persistée en localStorage.
- **Host audio** · Cloudflare R2 bucket `jerwis-podcast-audio`. Credentials dans `.env.local` (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY). Free tier 10 Go stockage + 0 egress.
- **RSS feed** · `https://jerwis.fr/feed/podcast.xml` soumis à Apple Podcasts Connect + Spotify for Podcasters.
```

- [ ] **Step 11.3: Commit sitemap + CLAUDE.md**

```bash
git add sitemap.xml CLAUDE.md
git commit -m "feat(podcast): sitemap + section 'Podcast · Jerwis Productions' dans CLAUDE.md"
```

---

## Task 12 · Mise à jour CHANGELOG

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 12.1: Ajouter une entrée en haut du CHANGELOG**

Insérer après `# CHANGELOG — Site perso Jérémy Sagnier` :

```markdown
## 2026-04-23 · intégration podcast "Guerres d'IA" · Jerwis Productions

### Pourquoi
Trois épisodes de podcast narratif prêts dans `~/Projets/podcast-wondery/exports/` (La Fracture, Les Quatre Jours, Frères Ennemis). Fallait les diffuser publiquement · Apple Podcasts + Spotify + section dédiée sur jerwis.fr. Plus : poser la marque "Jerwis Productions" comme maison de production, pour héberger d'autres séries plus tard.

### Livré
- **Direction visuelle** · pochette "Direction 4" (duotone glitch éditorial, JetBrains Mono + chromatic aberration + scanlines CRT). Palette Fiesta conservée mais typo et effets modernisés (s'éloigne du heritage 90s du reste du site).
- **Pochettes générées automatiquement** · script `build-podcast-covers.js` avec Puppeteer · 8 PNG produites (série + 3 eps × 512 et 3000 px). Template paramétré `templates/podcast-cover.html`. Chaque ep a une teinte dominante (fuchsia pour ep01, orange pour ep02, fuchsia+teal pour ep03).
- **Page `/podcast.html`** · Layout A éditorial magazine (hero série + liste épisodes + player inline + 2 CTAs newsletter + mini-marquee).
- **Lecteur HTML5 custom** · 0 dépendance, 200 lignes JS + CSS inline. Features : play/pause, seek, vitesse 1/1.25/1.5/2, persistance position localStorage, 1 seul player actif à la fois, raccourcis clavier ←/→ ±5s.
- **Host audio** · Cloudflare R2 (free tier 10 Go + 0 egress). 3 MP3 uploadés via `scripts/podcast-upload.js` (aws-sdk-s3 compatible).
- **RSS feed iTunes-conforme** · `feed/podcast.xml` avec toutes les balises `<itunes:*>` requises par Apple/Spotify. Généré par `build-podcast-rss.js`.
- **Nav site** · entrée `Podcasts` ajoutée dans les 10 pages existantes (entre `Newsletters` et `Télécharger`).
- **Scripts npm** · `podcast:build` (covers + rss + page), `podcast:upload`, `podcast:rss`, `podcast:covers`, `podcast:page`.
- **Tests unitaires** · 8 tests sur helpers (format duration, escape XML/HTML, accent colors) via `node:test` · `npm test`.
- **Documentation** · section "Podcast · Jerwis Productions" dans CLAUDE.md.

### Architecture
Source de vérité unique : `data/episodes.json`. Trois scripts de build (covers, rss, page) consomment ce JSON. Audio stocké hors repo sur R2 (CDN Cloudflare gratuit). Pas de base de données, pas de framework, pas de backend dédié.

### Fichiers nouveaux
- `podcast.html`, `feed/podcast.xml`
- `data/episodes.json`
- `podcast/covers/{serie,ep01,ep02,ep03}.png` (512×512) + `-3000.png` (3000×3000)
- `templates/podcast-cover.html`
- `scripts/build-podcast-page.js`, `build-podcast-rss.js`, `build-podcast-covers.js`, `podcast-upload.js`, `test-helpers.js`
- `assets/podcast-player.js`
- `docs/superpowers/specs/2026-04-23-podcast-integration-design.md`
- `docs/superpowers/plans/2026-04-23-podcast-integration.md`

### Fichiers modifiés
- `index.html`, `apprendre.html`, `workflows.html`, `outils.html`, `github.html`, `claude-code.html`, `debutant.html`, `lexique.html`, `quiz.html`, `preferences.html` (nav)
- `sitemap.xml`, `CLAUDE.md`, `package.json`, `.env.local`

### À venir
- [ ] Rédiger descriptions longues (300-500 mots) des 3 épisodes en ton Leo · à faire par Jérémy avant submission plateformes
- [ ] Soumettre le feed RSS à Apple Podcasts Connect + Spotify for Podcasters
- [ ] Valider le feed sur https://castfeedvalidator.com/ une fois en prod
- [ ] (Optionnel V2) Configurer custom domain `podcast-audio.jerwis.fr` CNAME vers bucket R2
- [ ] (Optionnel V2) Ajouter Wavesurfer.js pour waveform visuelle dans le player
- [ ] (Optionnel V2) Page par épisode `/podcast/<slug>.html` avec transcript si audience grandit

---

```

- [ ] **Step 12.2: Commit CHANGELOG**

```bash
git add CHANGELOG.md
git commit -m "docs: CHANGELOG integration podcast Guerres d'IA + Jerwis Productions"
```

---

## Task 13 · Smoke test global + push en prod

- [ ] **Step 13.1: Run tous les tests**

Run: `npm test`
Expected: 8 tests passent.

- [ ] **Step 13.2: Rebuild global final**

Run: `npm run podcast:build`
Expected: 3 builds successifs (covers, rss, page) sans erreur. Durée ~20-30 sec.

- [ ] **Step 13.3: Vérifier qu'il n'y a pas de fichier oublié**

Run: `git status --short`
Expected: aucun fichier non committé (sinon commit ce qui manque).

Run: `ls -la podcast/covers/ feed/ data/ templates/ scripts/ assets/ podcast.html`
Expected:
- 8 PNG dans `podcast/covers/`
- `podcast.xml` dans `feed/`
- `episodes.json` dans `data/`
- `podcast-cover.html` dans `templates/`
- 5 scripts podcast dans `scripts/`
- `podcast-player.js` dans `assets/`
- `podcast.html` à la racine

- [ ] **Step 13.4: Push vers prod**

Run:
```bash
git push origin main
```
Expected: push OK. Vercel lance un déploiement automatique (~1-2 min).

- [ ] **Step 13.5: Smoke test prod**

Après 2 min, tester en prod :
```bash
curl -I https://jerwis.fr/podcast.html
curl -I https://jerwis.fr/feed/podcast.xml
curl -I https://jerwis.fr/podcast/covers/serie-3000.png
```
Expected: 3× `HTTP/2 200`. Si 404 : vérifier `.vercelignore` (peut-être que `podcast/` ou `feed/` est exclu du déploiement).

Run: `open https://jerwis.fr/podcast.html`
Expected: page podcast fonctionnelle en prod, pochettes visibles, player clique play → audio démarre depuis R2.

- [ ] **Step 13.6: Valider le RSS en prod**

Ouvrir https://castfeedvalidator.com/ dans un navigateur, coller `https://jerwis.fr/feed/podcast.xml`, cliquer Validate.
Expected: 0 erreur critique. Des warnings non-critiques (`<itunes:new-feed-url>`) sont OK pour une v1.

- [ ] **Step 13.7: Commit et push ajustement .vercelignore si besoin**

Si Task 13.5 a révélé un 404 sur `feed/` ou `podcast/covers/`, éditer `.vercelignore` pour les autoriser explicitement et push.

---

## Task 14 · Submissions plateformes (action manuelle Jérémy, post-V1)

**Cette task n'est pas automatisable** — elle nécessite des comptes tiers et des actions manuelles.

- [ ] **Step 14.1: Apple Podcasts Connect**

Aller sur https://podcastsconnect.apple.com/. Login avec Apple ID. Cliquer `New Show` → `Add RSS Feed URL`. Coller `https://jerwis.fr/feed/podcast.xml`. Soumettre. **Délai review : 24-72h**.

- [ ] **Step 14.2: Spotify for Podcasters**

Aller sur https://podcasters.spotify.com/. Login. `Add podcast` → `I already have a podcast` → coller l'URL RSS. Vérification email (code envoyé à jeremy@jerwis.fr — doit correspondre à `itunes:owner email` dans le feed). **Délai review : < 24h**.

- [ ] **Step 14.3: Pocket Casts, Overcast, Castro**

Rien à faire · une fois validé sur Apple, ces apps scrappent automatiquement Apple Podcasts.

- [ ] **Step 14.4: Finaliser**

Une fois les 2 plateformes validées, copier les URLs `apple.com` et `open.spotify.com` et les coller dans `podcast.html` (remplacer les `href="https://podcasts.apple.com/"` et `href="https://open.spotify.com/"` par les vraies URLs). Commit + push.

---

## Self-Review

### Spec coverage

| Spec section | Task |
|---|---|
| 5.1 `data/episodes.json` | Task 3 |
| 5.2 Pochettes Direction 4 | Task 5 + Task 6 |
| 5.3 Page `/podcast.html` Layout A | Task 9 |
| 5.4 Lecteur HTML5 custom | Task 8 |
| 5.5 RSS feed iTunes | Task 7 |
| 5.6 Script HTML → PNG | Task 6 |
| 5.7 Host audio R2 | Task 2 |
| 6 Fichiers nouveaux | Tasks 3, 5, 6, 7, 8, 9, 11 |
| 7 Fichiers modifiés | Tasks 1, 10, 11, 12 |
| 8 Nav "Podcasts" 3e position | Task 10 |
| 9 Métadonnées 3 eps | Task 3 (placeholders "À RÉDIGER") |
| 10 Submissions plateformes | Task 14 |
| 11 Règles CLAUDE.md | Task 11 |
| 12 Phases de livraison | Tasks 1-13 (séquentielles) |

Gaps identifiés : aucun. Tous les éléments du spec sont couverts par au moins une task.

### Placeholder scan

- "À RÉDIGER" dans `data/episodes.json` (Task 3) → intentionnel, marqué dans le spec section 9 comme action Jérémy avant submission plateformes. Documenté dans CHANGELOG "À venir" Task 12.1.
- "REMPLACER_PAR_URL_R2_EPXX" dans Task 3 → intentionnel, résolu au runtime Task 2 (les URLs R2 sont générées par l'upload et à recopier manuellement).
- Aucun "TBD", "TODO later", "similar to Task N", "fill in details".
- Tout le code est complet, aucun stub.

### Type consistency

- `accentColorToCss()` défini Task 4, utilisé Task 6 : signature cohérente (prend string name, retourne `{c1,c2,c3}`).
- `formatDurationMMSS()` / `formatDurationHHMMSS()` : 2 fonctions distinctes, usage cohérent (MMSS pour UI courte, HHMMSS pour RSS).
- `escapeXml()` / `escapeHtml()` : distinctes (XML échappe `'` → `&apos;`, HTML → `&#39;`), usage cohérent (XML pour RSS, HTML pour page).
- `data-podcast-player` et `data-src`, `data-ep` : cohérents entre Task 8 (JS) et Task 9 (HTML).
- Variable CSS `--teal` `#00B2A9`, `--fuchsia` `#EF426F`, `--orange` `#FF8200`, `--cream` `#FBF7F0`, `--ink-deep` `#050507` : identiques dans toutes les tasks (cover + page).
- Chemins `/podcast/covers/`, `/feed/podcast.xml`, `/podcast.html` : identiques partout.

Aucune incohérence.

---

**Plan complet · 14 tasks, ~52 steps, estimation ~5-7h de dev + 24-72h d'attente pour submissions plateformes.**
