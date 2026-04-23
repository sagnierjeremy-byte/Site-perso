# Spec · Intégration podcast sur jerwis.fr

> Design validé le 2026-04-23 après brainstorm. Feu vert pour rédiger le plan d'implémentation.

---

## 1. Contexte

Jérémy produit des podcasts narratifs dans `~/Projets/podcast-wondery/` (stack ElevenLabs v3 + REAPER + Auphonic, mastering -16 LUFS, MP3 192 kbps). **3 épisodes prêts** dans `exports/`:

| # | Titre | Durée | Poids | Fichier |
|---|---|---|---|---|
| 01 | La Fracture | 17m16s | 24 Mo | `episode-01-la-fracture-MASTER.mp3` |
| 02 | Les Quatre Jours | 17m24s | 24 Mo | `episode-02-les-quatre-jours-MASTER.mp3` |
| 03 | Frères Ennemis | ~15m | 22 Mo | `episode-03-freres-ennemis-MASTER.mp3` |

Les 3 forment la **Saison 01 "Guerres d'IA"**, série narrative FR sur la guerre des labos IA (OpenAI vs Anthropic, coup d'état OpenAI, schismes idéologiques).

Aujourd'hui, aucune intégration sur `jerwis.fr`. Les MP3 existent mais ne sont pas diffusés.

## 2. Objectifs

1. **Diffuser sur plateformes** · Apple Podcasts + Spotify + Pocket Casts + Overcast via un flux RSS iTunes-conforme
2. **Intégrer au site** · nouvelle page `/podcast.html` avec lecteur custom, cohérente avec l'expérience jerwis.fr
3. **Poser le label** · `Jerwis Productions` comme maison de production (permet d'héberger d'autres séries plus tard)
4. **Identité visuelle moderne** · pochette Direction 4 (duotone glitch éditorial), système décliné par épisode
5. **Convertir vers newsletter** · CTA visible pour transformer les auditeurs podcast en abonnés AI Playbook

## 3. Non-objectifs

- **Pas de lecteur Spotify embed** · on garde le contrôle de l'UI (Direction 4 Fiesta cohérente)
- **Pas de host payant** (Buzzsprout, Transistor) · Cloudflare R2 suffit, zéro abonnement mensuel
- **Pas de tracker d'écoutes avancé** en V1 · Apple et Spotify fournissent les stats côté plateforme, ça suffit au démarrage
- **Pas de transcription automatique** en V1 · à évaluer plus tard si l'audience grandit
- **Pas de catalogue multi-séries** en V1 · on code pour UNE série (Guerres d'IA), l'architecture permet d'en ajouter plus tard sans refacto
- **Pas de waveform visuelle** dans le lecteur V1 · Plyr/Wavesurfer pour V2 si demandé

## 4. Architecture système

```
┌────────────────────────────────────────────────────────────────┐
│   Source de vérité unique · data/episodes.json                  │
│   (title, slug, description, duration, audio_url, cover, accent) │
└─────────────────┬──────────────────────────────────────────────┘
                  │ lu par
                  ├────────────────────────────────────────────┐
                  │                                             │
        ┌─────────▼──────────┐              ┌──────────────────▼─────────┐
        │  scripts/build-    │              │  scripts/build-            │
        │  podcast-page.js   │              │  podcast-rss.js            │
        └─────────┬──────────┘              └──────────────────┬─────────┘
                  │                                             │
         génère   │                                   génère    │
         ▼                                            ▼
   /podcast.html                                /feed/podcast.xml
   (Layout A · Direction 4)                     (iTunes conforme)

┌────────────────────────────────────────────────────────────────┐
│   scripts/build-podcast-covers.js                               │
│   Lit episodes.json + templates HTML → rend en PNG 3000×3000    │
└─────────────────┬──────────────────────────────────────────────┘
                  │ écrit
                  ▼
           /podcast/covers/
             serie.png, ep01.png, ep02.png, ep03.png

┌────────────────────────────────────────────────────────────────┐
│   Hébergement audio · Cloudflare R2                             │
│   Bucket : jerwis-podcast-audio                                 │
│   Public URL : https://podcast-audio.jerwis.fr/                 │
│   (custom domain via CNAME vers R2 public bucket)               │
└────────────────────────────────────────────────────────────────┘
```

**Flux auditeur**:
- **Web** · visiteur ouvre `/podcast.html` → HTML5 `<audio>` stream depuis R2 via CDN Cloudflare
- **Apple/Spotify** · plateforme lit `/feed/podcast.xml`, fetch les MP3 depuis R2

## 5. Composants

### 5.1 Données · `data/episodes.json`

Source de vérité unique. Format:

```json
{
  "series": {
    "title": "Guerres d'IA",
    "season": 1,
    "subtitle": "Saison 01",
    "description_short": "Série narrative FR. Les batailles qui définissent l'écosystème IA.",
    "description_long": "Sam Altman contre Dario Amodei, les schismes idéologiques, les coups d'état. Série narrative FR style Wondery, 15 min par épisode, mastering studio.",
    "cover": "/podcast/covers/serie.png",
    "cover_3000": "/podcast/covers/serie-3000.png",
    "author": "Jérémy Sagnier",
    "publisher": "Jerwis Productions",
    "language": "fr-FR",
    "explicit": false,
    "categories_itunes": ["Technology", "News"],
    "copyright": "© 2026 Jerwis Productions",
    "itunes_type": "episodic"
  },
  "episodes": [
    {
      "id": "01",
      "slug": "la-fracture",
      "title": "La Fracture",
      "description_short": "Novembre 2023. Altman et Amodei au sommet. Un désaccord qui casse la fraternité OpenAI/Anthropic.",
      "description_long": "Texte complet 300-500 mots avec les casts voix utilisées + sources.",
      "duration": 1036,
      "published": "2026-04-22T09:00:00+02:00",
      "audio_url": "https://podcast-audio.jerwis.fr/episode-01-la-fracture-MASTER.mp3",
      "audio_size_bytes": 24869451,
      "cover": "/podcast/covers/ep01.png",
      "cover_3000": "/podcast/covers/ep01-3000.png",
      "accent_color": "fuchsia",
      "guests_voices": ["Paul K · Narrateur", "Simon · Sam Altman", "Mathieu · Dario Amodei", "Camille Martin · Daniela Amodei"]
    },
    { "...": "ep 02 et 03 idem" }
  ]
}
```

**Règle** : tout nouvel épisode = ajouter une entrée dans `episodes[]` et pousser le MP3 sur R2. Les scripts de build lisent ce JSON et regénèrent tout.

### 5.2 Pochettes · Direction 4 validée

**Style** : duotone radial gradient teal+fuchsia+orange flouté + noise SVG fractalNoise + scanlines CRT + titre JetBrains Mono 700 uppercase avec chromatic aberration (text-shadow fuchsia/teal décalé 2px) + `//` en teal comme séparateur.

**Déclinaisons par épisode** (même DNA visuel, couleurs dominantes différentes):

| Pochette | Dominante | Logique narrative |
|---|---|---|
| Série master | teal + fuchsia + orange équilibrées | Identité de la série globale |
| Ép. 01 "La Fracture" | fuchsia dominant | Tension, schisme, opposition |
| Ép. 02 "Les Quatre Jours" | orange dominant | Urgence, chaos, 4 jours frénétiques |
| Ép. 03 "Frères Ennemis" | fuchsia + teal (froid) | Dualité, conflit intime |

**Labels sur la pochette**:
- Top-left : `JERWIS PRODUCTIONS`
- Top-right : `S01` (série) ou `ÉP. XX` (épisode)
- Bottom-left : titre en grand (`GUERRES // D'IA` pour série, titre ep pour épisodes)
- Bottom sous-titre : sous-titre narratif (`Altman · Amodei · Sutskever · Brockman` pour série, pitch ep court pour épisodes)

**Tailles livrées**:
- `1400×1400 PNG` · min Apple
- `3000×3000 PNG` · recommandé Apple (max 4000)
- `512×512 PNG` · page site (OG image fallback)

Générées par le script `build-podcast-covers.js` depuis un template HTML paramétré + Puppeteer (voir 5.6).

### 5.3 Page `/podcast.html` · Layout A validé

Structure éditoriale magazine, cohérente avec `apprendre.html`:

1. **Header** identique au site (sticky, triple-stripe teal-fuchsia-orange en haut)
2. **Nav top** · ajouter `Podcasts` entre `Newsletters` et `Télécharger` (décision à appliquer aussi sur `index.html`, `apprendre.html`, `workflows.html`, `outils.html`, `github.html`, `claude-code.html`, `debutant.html`, `lexique.html`, `quiz.html`, `preferences.html`)
3. **Hero série** (dark, gradients Fiesta subtiles):
   - Colonne gauche : pochette série 400px
   - Colonne droite : kicker `JERWIS PRODUCTIONS · SAISON 01`, H1 `GUERRES // D'IA` (JetBrains Mono 700), lead description longue, bouton `▶ Écouter l'épisode 01`, meta `3 épisodes · 50 min · FR`
4. **Badges plateformes** sous hero : Apple Podcasts · Spotify · RSS · YouTube (liens directs vers feed ou embed)
5. **CTA newsletter #1** · mini-card après hero : "La newsletter AI Playbook complète le podcast · chaque vendredi 9h"
6. **Section "Tous les épisodes"** (corps cream):
   - Pour chaque épisode : card horizontale grid `120px 1fr`
   - Colonne gauche : pochette ep 120px
   - Colonne droite : num (`ÉPISODE 01 · 17 MIN`), h3 titre, description courte, **player inline** (play/pause + timeline + vitesse + temps)
7. **Mini-marquee** (règle site CLAUDE.md — cohérence Fiesta) avec contenu thématique : "Narration FR · Stack ElevenLabs · Mastering studio · Zéro IA générique"
8. **CTA newsletter #2** · card pleine largeur en bas : "Reçois la newsletter de Jérémy · inscription 1 clic"
9. **Footer** identique site

**Ton** · titre en JetBrains Mono (cohérent pochette), descriptions en Archivo body (cohérent site). Pas de triple-stripe dans le hero de cette page (pas cohérent avec Direction 4 moderne). Garder triple-stripe sur la bande top uniquement.

### 5.4 Lecteur audio · HTML5 custom

**Design**:
- Pill horizontal noir `#0A0A0A`, border-radius 999px
- Bouton play/pause 36px · fond fuchsia `#EF426F` · SVG icons play/pause
- Timeline · barre 4px `rgba(255,255,255,0.15)` avec remplissage teal `#00B2A9`, interactive (click pour seek)
- Affichage temps JetBrains Mono 11px `{current} / {total}`
- Bouton vitesse `1×` (cycle 1 → 1.25 → 1.5 → 2 → 1)

**Comportement**:
- Un seul épisode joue à la fois (si user clique play sur ep 02 pendant que ep 01 joue, ep 01 se met en pause)
- Pas de préchargement auto (`preload="metadata"` seulement, lit la durée sans download)
- Persistance position · `localStorage[podcast-ep-XX-position]` pour reprendre où on a arrêté
- Events analytics minimaux V1 · `play`, `pause`, `complete` (log console pour l'instant, future intégration Plausible)
- Accessibility · label ARIA, raccourcis clavier (`space` pour play/pause, `←/→` ±5 s)

**Performance** · 1 seul fichier JS (~200 lignes), 0 dépendance, lazy loaded en bas de page.

### 5.5 RSS feed · `/feed/podcast.xml`

**Structure iTunes conforme** (Apple Podcasts + Spotify):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Guerres d'IA</title>
    <link>https://jerwis.fr/podcast</link>
    <description>...</description>
    <language>fr-FR</language>
    <itunes:author>Jérémy Sagnier</itunes:author>
    <itunes:owner>
      <itunes:name>Jerwis Productions</itunes:name>
      <itunes:email>jeremy@jerwis.fr</itunes:email>
    </itunes:owner>
    <itunes:image href="https://jerwis.fr/podcast/covers/serie-3000.png"/>
    <itunes:category text="Technology"/>
    <itunes:category text="News">
      <itunes:category text="Tech News"/>
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>

    <item>
      <title>Épisode 01 · La Fracture</title>
      <description><![CDATA[...]]></description>
      <itunes:duration>17:16</itunes:duration>
      <itunes:image href="https://jerwis.fr/podcast/covers/ep01-3000.png"/>
      <enclosure url="https://podcast-audio.jerwis.fr/episode-01-la-fracture-MASTER.mp3"
                 length="24869451"
                 type="audio/mpeg"/>
      <pubDate>Wed, 22 Apr 2026 09:00:00 +0200</pubDate>
      <guid isPermaLink="false">jerwis-podcast-ep-01</guid>
      <itunes:episode>1</itunes:episode>
      <itunes:season>1</itunes:season>
      <itunes:episodeType>full</itunes:episodeType>
    </item>
    <!-- ep 02, ep 03 idem -->
  </channel>
</rss>
```

**Génération** · script `scripts/build-podcast-rss.js` (Node) qui lit `data/episodes.json`, produit le XML, écrit dans `feed/podcast.xml`. À lancer manuellement après ajout d'épisode, ou via `npm run podcast:build`.

**Validation** · après build, vérifier le flux sur `https://castfeedvalidator.com/` avant submission Apple/Spotify.

### 5.6 Script `build-podcast-covers.js` · HTML → PNG

Stack : Node + Puppeteer (déjà disponible via npm) ou `satori` + `resvg`.

**Workflow**:
1. Lit `data/episodes.json`
2. Pour chaque élément (série + 3 eps): rend un template HTML paramétré (Direction 4) en taille 3000×3000
3. Screenshot via Puppeteer → PNG
4. Sauvegarde dans `podcast/covers/{serie|ep01|ep02|ep03}-3000.png`
5. Optionnellement resize en 1400×1400 et 512×512 via `sharp`

**Template HTML** · 1 fichier `templates/podcast-cover.html` avec placeholders `{{title_top}}`, `{{title_bot}}`, `{{subtitle}}`, `{{accent_c1}}`, `{{accent_c2}}`, `{{accent_c3}}`. Le script injecte les valeurs par ep.

**Temps d'exécution attendu** · 4 images × 2 sec = 8 sec. Chaque nouveau ep ajouté = 2 sec de plus.

### 5.7 Host audio · Cloudflare R2

**Setup 1x**:
1. Créer compte Cloudflare (déjà pour le DNS jerwis.fr ?)
2. Créer bucket `jerwis-podcast-audio`
3. Activer public access ou via custom domain `podcast-audio.jerwis.fr` (CNAME vers bucket R2)
4. Générer clé S3 (`access_key_id` + `secret_access_key`) · stockée dans `.env.local`

**Upload workflow**:
- Script `scripts/podcast-upload.js` avec AWS SDK S3-compatible
- Commande : `npm run podcast:upload <chemin-mp3>`
- Upload + affichage URL publique résultante

**Coût attendu** : 3 × 24 Mo = 72 Mo stockage = dans le 10 Go gratuit. Egress illimité gratuit.

## 6. Fichiers nouveaux

```
jerwis-sagnier-site/
├── podcast.html                         [NEW] page principale Layout A
├── feed/
│   └── podcast.xml                      [NEW] RSS iTunes-conforme (généré)
├── podcast/
│   └── covers/
│       ├── serie.png                    [NEW] 512×512 page site
│       ├── serie-3000.png               [NEW] 3000×3000 Apple/Spotify
│       ├── ep01.png, ep01-3000.png     [NEW]
│       ├── ep02.png, ep02-3000.png     [NEW]
│       └── ep03.png, ep03-3000.png     [NEW]
├── data/
│   └── episodes.json                    [NEW] source de vérité
├── templates/
│   └── podcast-cover.html               [NEW] template Direction 4 paramétré
├── scripts/
│   ├── build-podcast-page.js            [NEW] génère podcast.html
│   ├── build-podcast-rss.js             [NEW] génère feed/podcast.xml
│   ├── build-podcast-covers.js          [NEW] génère PNG via Puppeteer
│   └── podcast-upload.js                [NEW] upload MP3 vers R2
├── assets/
│   └── podcast-player.js                [NEW] lecteur HTML5 custom (~200 lignes)
└── .env.local                           [MODIFIÉ] + R2_ACCOUNT_ID + R2_ACCESS_KEY + R2_SECRET
```

## 7. Fichiers modifiés

| Fichier | Modification |
|---|---|
| `index.html` | nav top : ajouter `Podcasts` entre `Newsletters` et `Télécharger` |
| `apprendre.html` | idem nav |
| `workflows.html`, `outils.html`, `github.html`, `claude-code.html`, `debutant.html`, `lexique.html`, `quiz.html`, `preferences.html` | idem nav |
| `sitemap.xml` | ajouter `<url>` pour `/podcast.html` + `/podcast` (cleanUrl) |
| `package.json` | ajouter scripts `podcast:build`, `podcast:covers`, `podcast:upload`, `podcast:rss` + dep `puppeteer`, `@aws-sdk/client-s3`, `sharp` |
| `.gitignore` | vérifier que `.env.local` est déjà ignoré · **committer** les PNG générés de `podcast/covers/` (pas de gitignore) pour éviter de les regénérer à chaque build Vercel. Les MP3 ne sont jamais dans le repo (R2). |
| `vercel.json` | rien à changer (cleanUrls fait déjà le job) |
| `CLAUDE.md` | nouvelle section "Section Podcast · Jerwis Productions" avec règles (voir 11) |

## 8. Nav site · `Podcasts` en 3e position

Ordre validé : `Apprendre · Newsletters · Podcasts · Télécharger · Projets · Opinions · Sources · L'histoire`

Raison : juste après `Newsletters` parce que c'est la 2e brique "contenu produit par Jérémy". Avant `Télécharger` qui est plus utilitaire.

## 9. Métadonnées des 3 épisodes · à renseigner par Jérémy

Avant build, Jérémy doit fournir pour chaque épisode. Les cellules `À FOURNIR` bloquent la phase P2 (génération RSS) :

| Champ | Ép. 01 | Ép. 02 | Ép. 03 |
|---|---|---|---|
| Titre court | La Fracture | Les Quatre Jours | Frères Ennemis |
| Description courte (150 chars max, Spotify) | À FOURNIR | À FOURNIR | À FOURNIR |
| Description longue (300-500 mots, Apple) | À FOURNIR | À FOURNIR | À FOURNIR |
| Date publication | 2026-04-22 09:00 | 2026-04-23 09:00 | À FOURNIR |
| Durée exacte | 17:16 (1036s) | 17:24 (1044s) | À MESURER (ffprobe) |
| Voix utilisées (cast) | Paul K, Simon, Mathieu, Camille | idem + Maxime, Marc Aurèle, Stephyra, Olivier 50s | À FOURNIR |

**Action Jérémy** : remplir ces champs avant la phase P2. Peut être fait dans un brief de 30 min (descriptions courtes faciles, description longue = agent rédacteur possible avec brief).

## 10. Plateformes · submissions après V1 live

1. **Apple Podcasts Connect** · `https://podcastsconnect.apple.com/` → submit RSS URL → review 2-3 jours
2. **Spotify for Podcasters** · `https://podcasters.spotify.com/` → submit RSS URL → review 24h
3. **Pocket Casts, Overcast, Castro** · automatique une fois Apple validé (ils scrapent Apple)
4. **YouTube** · optionnel · upload manuel en unlisted avec image fixe pour audience qui cherche là

## 11. Règles projet · ajouter au `CLAUDE.md` du site

Nouvelle section dédiée:

```markdown
## Section Podcast · Jerwis Productions

- **Source de vérité** · `data/episodes.json` uniquement. Jamais hardcoder les infos épisode ailleurs.
- **Nouveaux épisodes** · ajouter entrée dans `episodes[]` + uploader MP3 sur R2 + `npm run podcast:build` (régénère page + RSS + covers).
- **Pochettes** · Direction 4 (duotone glitch) générées par `build-podcast-covers.js`. Ne pas modifier manuellement.
- **Label** · "Jerwis Productions" partout. Jamais "par Jérémy Sagnier" seul sur les artefacts podcast (site, RSS, covers).
- **Typo titres podcast** · JetBrains Mono 700 uppercase avec `//` en teal comme séparateur. Contrairement au reste du site (Archivo Black Fiesta), les pochettes et le titre podcast utilisent cette typo tech moderne. Volontaire · casse avec la 90s Fiesta pour un ton narratif futuriste.
- **Player audio** · 1 seul à la fois (pause des autres au click play), position persistée en localStorage.
```

## 12. Phases de livraison

Phase par phase, chacune testable en autonomie:

| # | Phase | Livrable | Dépendances |
|---|---|---|---|
| **P1** | Setup Cloudflare R2 | Bucket + custom domain + clés .env.local + 3 MP3 uploadés | Jérémy crée compte R2 |
| **P2** | Data + génération RSS | `data/episodes.json` + `scripts/build-podcast-rss.js` + `/feed/podcast.xml` généré + validé sur castfeedvalidator | P1 (URLs audio) |
| **P3** | Template + script covers | `templates/podcast-cover.html` + `scripts/build-podcast-covers.js` + 8 PNG générés (serie + 3 eps × 2 tailles) | Aucune (peut se faire en // de P1/P2) |
| **P4** | Lecteur HTML5 custom | `assets/podcast-player.js` + CSS inline · testable en standalone | Aucune |
| **P5** | Page `/podcast.html` | Layout A complet avec données depuis JSON + player intégré + CTAs newsletter | P2 + P3 + P4 |
| **P6** | Mise à jour nav + sitemap | `Podcasts` ajouté aux 10 pages + sitemap MAJ + CLAUDE.md MAJ | P5 (lien existe) |
| **P7** | Submission plateformes | Apple + Spotify + test lecture sur 2-3 apps | P5 déployé en prod |

Chaque phase = 1 commit + push. Vercel redéploie à chaque push.

## 13. Open questions

Questions laissées ouvertes pour le moment, à trancher au fil du plan d'implémentation :

1. **Custom domain R2** · `podcast-audio.jerwis.fr` ou `audio.jerwis.fr` ou chemin direct R2 ? → à décider quand on crée le bucket
2. **Cover photo auteur** pour RSS `<itunes:author>` · est-ce qu'on réutilise une des photos existantes `photos/A7*.jpg` ? → probable oui, à choisir
3. **Description longue EP 01-02-03** · à rédiger par Jérémy en ton Leo (ou agent rédacteur avec brief)
4. **Dates publication** EP 02 et 03 · réelles ou rétrodatées ? → préférence Jérémy
5. **CTA newsletter #1** · formulaire email inline ou lien vers `/#newsletters` ? → recommandation : formulaire inline (pas de friction)

Ces questions n'empêchent pas de commencer l'implémentation, elles se résolvent en cours de route.
