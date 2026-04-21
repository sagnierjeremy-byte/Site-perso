# Site perso Jérémy Sagnier

> Site HTML statique (+ Vercel serverless) de Jérémy Sagnier. Vitrine perso, deux veilles IA/Business auto-générées, bibliothèque de tutos Claude Code, téléchargements gratuits.
>
> **Toujours lire ce fichier en début de session.**

---

## Contexte projet

- **Propriétaire** : Jérémy Sagnier (`sagnier.jeremy@gmail.com`)
- **Positionnement** : entrepreneur curieux de l'IA, frère jumeau de Kevin (fondateur Eurofiscalis en 2017), père d'un fils. **PAS dev, PAS codeur.** Juste quelqu'un qui refuse d'être dépassé par l'IA.
- **Objectif site** : vitrine + acquisition newsletter + bibliothèque tutos
- **Créé** : 2026-04-20
- **Déployé prod** : 2026-04-22 sur `https://jerwis.fr` (redirect → `www.jerwis.fr`)
- **Stack** : HTML/CSS/JS vanilla · 1 API Vercel serverless (Resend) · ZÉRO framework
- **Chemin local** : `~/Projets/jeremy-sagnier-site/`
- **Repo GitHub** : `git@github.com:sagnierjeremy-byte/Site-perso.git` · branche `main`
- **Hébergement** : Vercel (plan Hobby) · projet `site-perso` · auto-deploy sur push main
- **Domaine** : jerwis.fr (DNS chez Hostinger, pointe déjà vers Vercel · A `76.76.21.21` + CNAME www)

---

## Stack technique

| Couche | Techno |
|---|---|
| Frontend | HTML standalone + CSS custom + JS vanilla |
| Hébergement | Vercel (config `vercel.json` fournie) |
| Inscription email | Resend API via `/api/subscribe.js` (serverless) |
| Pas de framework | Pas de React, Next, rien. Juste HTML/CSS/JS pur. |
| Polices | Google Fonts : Archivo Black · Archivo · Bebas Neue · JetBrains Mono |
| Design system | Charte **FIESTA / 89** (voir section suivante) |
| CSS partagé | `assets/main.css` (3615 lignes) importé par `index.html` + `apprendre.html` |

---

## Charte graphique FIESTA / 89

Inspirée San Antonio Spurs (1989). Streetwear, heritage, jamais corporate.

### Palette
- `--fuchsia: #EF426F` · CTA principal, énergie
- `--teal: #00B2A9` · Success, heritage
- `--orange: #FF8200` · Heat, alertes
- `--ink: #0A0A0A` · Base dominante
- `--bg: #FBF7F0` (light) / `#0A0A0A` (dark)

### Règle d'or
**Noir/cream dominant (50%) > surfaces (30%) > 3 couleurs accent (20%).**
Jamais les 3 couleurs Fiesta en aplat à taille égale.

### Signature triple-stripe
Ordre canonique **immuable** : `teal → fuchsia → orange`. Utilisée en headers, footers, dividers.

### Mini-marquees (signature Fiesta, RÈGLE À APPLIQUER PARTOUT)

Les **mini-marquees dividers** sont un élément identitaire. **Chaque nouvelle page doit en contenir au minimum 2-3**, placés entre les grandes sections pour rythmer le scroll et marquer les transitions.

**CSS obligatoire** (à copier dans le `<style>` de chaque nouvelle page) :
```css
.mini-marquee {
  overflow: hidden; padding: 14px 0;
  background: linear-gradient(90deg, var(--teal) 0%, var(--fuchsia) 50%, var(--orange) 100%);
  color: #fff; position: relative;
  border-top: 1px solid rgba(255,255,255,.1);
  border-bottom: 1px solid rgba(0,0,0,.15);
}
.mini-marquee::before {
  content: ""; position: absolute; inset: 0;
  background: rgba(10,10,10,.18); mix-blend-mode: multiply; pointer-events: none;
}
.mini-marquee-track {
  display: flex; gap: 40px; white-space: nowrap;
  animation: mini-marquee-scroll 50s linear infinite;
  font-family: 'Archivo Black', sans-serif; font-size: 17px;
  text-transform: uppercase; letter-spacing: -.01em;
  position: relative; z-index: 1;
}
.mini-marquee-track span {
  display: inline-flex; align-items: center; gap: 40px;
}
.mini-marquee-track span::after {
  content: "◆"; color: rgba(10,10,10,.5); font-size: 11px;
}
@keyframes mini-marquee-scroll { to { transform: translateX(-50%) } }
```

**HTML type** (le contenu est à dupliquer 2× pour boucle infinie fluide) :
```html
<div class="mini-marquee" aria-hidden="true">
  <div class="mini-marquee-track">
    <span>Mot 1</span><span>Mot 2</span><span>Mot 3</span><span>Mot 4</span><span>Mot 5</span><span>Mot 6</span>
    <span>Mot 1</span><span>Mot 2</span><span>Mot 3</span><span>Mot 4</span><span>Mot 5</span><span>Mot 6</span>
  </div>
</div>
```

**Contenu** : 5-7 mots/expressions courtes, cohérentes avec le thème de la section qui suit. Règles : zéro familier (pas de "pique", "truc", "perso"), phrases courtes, ton Leo, mots en français (pas d'anglicismes type "free" ou "scroll"). Exemples validés : *"Gratuit · Zéro spam · Juste ce qui sert · Désinscription 1 clic · Fait pour moi d'abord · Inspire-toi"*.

### Typo
- Display H1-H2 : `Archivo Black` UPPERCASE · `letter-spacing: -0.03em à -0.04em`
- Body : `Archivo` 400/500/600/700/900
- Labels/kickers : `JetBrains Mono` UPPERCASE · `letter-spacing: 0.1em à 0.2em`

### Effets
- Grain overlay SVG (fractalNoise) en mode multiply (light) / screen (dark)
- Radial gradients colorés sur les hero
- Dual-theme via `data-theme="light|dark"` sur `<html>` + localStorage

### Dark mode · piège à éviter (RÈGLE)

Les variables `--ink` et `--bg` sont **sémantiques** (texte / fond adaptatifs), pas **chromatiques**.
- `--ink` = `#0A0A0A` en light, `#F4EFE6` en dark (**s'inverse**)
- `--bg` = `#FBF7F0` en light, `#0A0A0A` en dark (**s'inverse aussi**)

**Quand un bloc doit rester sombre peu importe le thème** (hero noir, CTA noir, bloc d'intro toujours sombre), NE PAS utiliser `background: var(--ink)` · ça donne cream sur cream en dark = illisible.

**À la place, utiliser les couleurs fixes** :
```css
.bloc-toujours-sombre {
  background: #0A0A0A;   /* fond fixe noir */
  color: #FBF7F0;         /* texte fixe cream */
}
```
Les 3 couleurs accent (`--teal`, `--fuchsia`, `--orange`) restent OK à utiliser · elles ne changent pas selon le thème.

**Incident fondateur** · 2026-04-22 · `outils.html` tier2-intro + `github.html` hero/final étaient illisibles en dark mode.

---

## Ton de voix — "Ton Leo" (RÈGLE ABSOLUE)

Ton Leo = ton de la mascotte IA Leo d'Eurofiscalis. Appliqué **partout** sur ce site.

### Règles non-négociables
- **1ère personne directe** : "Salut, moi c'est Jérémy", "Je teste", "Je lis tout"
- **Chaleureux + bienveillant** : pas de pitch commercial, conversation
- **Hyper transparent** : assumer l'usage de l'IA, promettre désinscription 1 clic
- **Simple** : pas de jargon, mots courants, phrases courtes
- **Montrer le travail** : chiffres concrets, sources, processus détaillé
- **Assumer les limites** : "je peux me tromper, écris-moi si tu n'es pas d'accord"
- **Appel à réponse** partout : "Réponds à l'email, je lis tout"

### Registre : naturel, PAS familier (règle renforcée 2026-04-20)

Chaleureux ≠ familier. Jamais d'argot ni de langage "de pote" sur le site public.

**À BANNIR :** "je te file", "tu piques", "prêt à piquer", "des trucs", "c'est de la daube", "qui marchent" (parlé), "1 clic pour sortir", "kif", "taf", "mec", "ouais", élisions orales ("ça sert pas", "y'a").

**À UTILISER :** "je t'envoie" / "je partage", "prêt à appliquer" / "prêt à utiliser", "erreurs" / "ressources", "qui fonctionnent", "désinscription en 1 clic", "sans pub".

**Test :** relire à voix haute. Si ça sonne comme un copain au bar → trop familier. Si ça sonne comme un ami qui t'écrit un mail un dimanche soir → bon niveau.

**Exception** : tu peux citer un mot banni **entre guillemets français** comme exemple explicite de ce qui est interdit (ex: `« kif »`, `« taf »` en liste de mots à ne pas employer). Un audit grep remontera ces occurrences comme faux positifs — c'est normal.

### PITCH CENTRAL (à préserver à tout prix)
> "Je fais tout ça d'abord pour moi. Si ça arrive jusqu'à toi, c'est parce que ça m'a servi à moi en premier."

Les newsletters sont **des veilles automatiques** que Jérémy se produit à lui-même. Il propose au lecteur de recevoir la même. **Jamais** dire "j'ai créé ce contenu pour toi" — toujours "je te partage ce que je consomme".

### À ne JAMAIS dire / écrire
- ❌ "Dev fullstack", "développeur", "codeur" → Jérémy N'EST PAS dev
- ❌ "Inscrivez-vous pour recevoir du contenu exclusif" → pose commerciale
- ❌ Mentions de projets Eurofiscalis/Kevin internes si pas pertinent
- ❌ Disclaimer consultant "il est important de noter que..."

---

## Structure de la home (`index.html`) — refonte 2026-04-21 (v2 lecteur)

**Fil rouge v2 — centré lecteur** : haut bienveillant pour le lecteur, bas "d'abord pour moi" comme garantie.

H1 : "Suis l'IA. Sans être dev. Sans y passer tes soirées." (4 lignes, impératif)

Ordre des sections (ne pas changer sans raison) :

1. **Hero** (dark) — H1 4 lignes + lead lecteur ("Tu sens que l'IA bouge...") + CTAs `apprendre.html` (primary) + `#newsletters` (ghost)
2. **Mini-marquee 01** — Peut-être comme toi · Peut-être pas
3. **Pour qui** (`.whoisitfor` · `#whoisitfor`) — 3 profils : Entrepreneur curieux (teal) · Pro pressé (fuchsia) · Débutant qui hésite (orange). Bloc "Ce que tu ne trouveras PAS ici" en bas.
4. **Apprendre** (`#learn`) — teaser 4 cards étapes + CTA `apprendre.html`
5. **Mini-marquee 02** — Le chemin posé · Maintenant la veille
6. **Newsletters** (`#newsletters`) — pipeline + 2 cards + formulaire unifié
7. **Mini-marquee 03** — Pas envie de t'abonner ? · Normal · Prends déjà ces 3 outils
8. **Freebies** (`#freebies`) — 3 cards téléchargement
9. **Mini-marquee 04** — Tu as la méthode · Les outils · Voilà les preuves
10. **Projets** (`#projects`) — 3 cards : live (GMF) · construction (veille) · recherche (agent qualif)
11. **Opinions** (`#opinions`) — 6 cards style magazine cover
12. **Mini-marquee 05** — Ma voix · Ce qui la nourrit
13. **Sources** (`#content`) — tabs YouTube (34 chaînes) · X · Newsletters
14. **Mini-bio** (`.minibio`) — "Entrepreneur. Pas dev. Pas dépassé." Photo + 4 tags (position : après valeur donnée, avant garantie)
15. **Mini-marquee 06** — Une dernière chose · Pour qu'on se comprenne · Ma vraie garantie
16. **Story** (`#story`) — "Je fais tout ça d'abord pour moi" + highlight "Ta garantie"
17. **CTA Drop** — "Tu veux être dedans ?"
18. **Marquee principal** + Footer

### Nav (ordre)
`Apprendre · Newsletters · Télécharger · Projets · Opinions · Sources · L'histoire`

### Règle "pitch central" — ton à 3 niveaux
- **Haut** (hero, pour qui, apprendre) : 100% bienveillant, centré lecteur. "Tu sens que...", "Tu veux...", "Tu cherches...".
- **Milieu** (newsletters, freebies, projets, opinions, sources) : équilibre "je partage ce qui m'a servi". "J'ai monté pour moi → tu reçois la même chose".
- **Bas** (story) : pitch **"Je fais tout ça d'abord pour moi"** — reformulé en **"Ta garantie"**. Dit UNE seule fois. Ne jamais le redire ailleurs.

## Page parcours (`apprendre.html`) — créée 2026-04-21

Page dédiée au parcours pédagogique. Structure :

1. Hero parcours (dark) — "Apprendre l'IA. Dans l'ordre où je l'ai appris."
2. **Progress rail sticky** 01→04 avec auto-highlight (IntersectionObserver)
3. **Étape 01 · Poser les bases** (teal) — 2 cards : debutant.html + lexique.html
4. **Étape 02 · Passer à Claude Code** (fuchsia) — 2 cards : claude-code.html + loops-claude
5. **Étape 03 · Construire tes agents** (orange) — 4 cards : agents-ia-guide + gmail + contrats + hermes
6. **Étape 04 · Aller plus loin** (ink) — 5 cards : GMF + veille + 3× Karpathy
7. **Parcours-end** (gradient teal→fuchsia→orange) — CTA vers `index.html#newsletters`
8. Footer identique à la home

Entre étapes : mini-marquees narratifs (Bases posées → Claude Code → Agents → Plus loin).

---

## Articles (`articles/`)

5 articles actifs + 1 template :

| # | Slug | Titre | Durée | Couleur |
|---|---|---|---|---|
| 01 | `loops-claude.html` | Les loops Claude Code, expliqués | 7 min | teal |
| 02 | `hermes-agent.html` | Construire un Hermes Agent pas à pas | 10 min | fuchsia |
| 03 | `karpathy.html` | Les travaux de Karpathy, vulgarisés | 15 min | orange |
| 04 | `autoresearch-karpathy.html` | Les agents auto-améliorants | 12 min | teal |
| 05 | `llm-wiki-karpathy.html` | Le LLM Wiki, ton deuxième cerveau | 12 min | fuchsia |
| — | `_TEMPLATE.html` | Template réutilisable avec placeholders | — | — |

### Structure d'un article type
1. Header sticky identique à la home
2. Hero dark avec kicker pulse + H1 3 lignes + lead + meta (durée/niveau/outils)
3. TL;DR (card -40px remontée sur le hero, avec bordure gradient 80px en haut)
4. Sections avec `.section-kicker` (k-teal / k-fuchsia / k-orange rotent)
5. Step cards (.step avec .step-num colorés qui rotent teal→fuchsia→orange)
6. Callouts (ok/warn/tip) avec bullet coloré à gauche
7. CTA final (back-btn noir) → inscription newsletter
8. Footer identique home

### Pour ajouter un nouvel article
1. Copier `articles/_TEMPLATE.html` → `articles/mon-sujet.html`
2. Remplacer placeholders `{{TITRE}}`, `{{CATEGORIE}}`, etc.
3. Ajouter la card dans `#learn` de `index.html` (bloc `.article-card`)

---

## Assets

### Photos
- `photos/` : 55 optimisées (1600px, qual 82) — **7 sélectionnées utilisées** :
  - Card #4, #20 (A7100670, A7109652) : portraits Jérémy
  - Card #22, #28 (Kev et Jé Nice 1, 7) : Jérémy + Kevin
  - Card #41, #46, #50 (Kev Nice variants) : Kevin
- `photos/channels/` : 29 avatars YouTube 176×176

### Downloads
- `downloads/CLAUDE.md` — version **anonymisée** du global de Jérémy
- `downloads/skills/` — 26 skills custom (officiels Anthropic exclus)
- `downloads/README.md` — guide install
- `downloads/jeremy-claude-pack.zip` — 690 Ko, pack complet

### Outils internes
- `contact-sheet.html` — galerie des 55 photos pour sélection (ne pas déployer)
- `classify-channels.html` — drag-drop pour classer les chaînes YT (ne pas déployer)

---

## API — Inscription Resend

### Endpoint
`/api/subscribe.js` (Vercel serverless function)

### Env vars **obligatoires** sur Vercel (aucun fallback hardcodé)
```
RESEND_API_KEY=re_...           # clé Resend avec Full access (audiences.contacts.write requis)
RESEND_AUDIENCE_ID=<uuid>        # audience AI Playbook dédiée jerwis.fr
```

**Audience** : dédiée AI Playbook (créée 2026-04-22 sur le compte Resend perso de Jérémy, pas le compte Eurofiscalis).

**Sécurité** : pas de `DEFAULT_AUDIENCE_ID` hardcodé dans le code (retiré 2026-04-22, commit `1a36574`). Si les env vars manquent → erreur 500 explicite. Évite toute fuite vers une audience tierce.

### Clé Resend · permissions requises
- Resend requiert **Full access** (ou Sending + Audiences access) pour l'appel `/audiences/{id}/contacts`
- Une clé "Sending only" renvoie `restricted_api_key` (401)

### Comportement
- POST `/api/subscribe` avec `{email, source}`
- Gère les 409 (déjà inscrit) comme success avec `alreadySubscribed: true`
- Forms frontaux : `.newsletter-form`, `.freebie-download-form`, `.cta-form`, `.download-form`

---

## Sections détaillées

### Newsletters (2 veilles auto)
- **AI Playbook** · 1×/semaine vendredi 9h · IA pure
- **Business Radar** · 2×/mois 1er & 3e mardi · Business/éco

Les 2 sont présentées comme **veilles automatiques pilotées par sous-agents** scanning 100+ sources. Jérémy reçoit le brief → partage le même email au lecteur. **JAMAIS** dire "newsletter pour toi" — toujours "ma veille que je te partage".

### Sources YouTube catégorisées (34 chaînes)
- IA & Tech (7) : Silicon Carne, IA et Stratégie, Vision IA, Underscore_, Melvynx, Grand Angle, Grand Angle Nova
- Business & Entrepreneuriat (12) : **Alex Hormozi, Leila Hormozi, GaryVee, Iman Gadzhi, Grant Cardone**, LEGEND, Oussama Ammar, Hasheur, Le Déclic par Alec Henry, Antoine Blanco, Yomi Denzel, TheiCollection
- Finance & Marchés (3) : Finary, Interactiv Trading, Thami Kabbaj
- Actu & Géopolitique (6) : 7 jours sur Terre, C dans l'air, Géopolitis, HugoDécrypte, Brut, Chaque Jour sur Terre
- Lifestyle & Inspiration (6) : Naj B Fit, Taylor Chiche, Margo Cunego, MrBeast, Sous Tension, Romain Lanéry

### Newsletter suivie (1 seule)
- Alex Hormozi Newsletter (`acquisition.com/newsletter`)

### X / Twitter
Handle Jérémy : `@JeremySagnier`. Liste following **non scrapée** (X bloque sans login, `twitter-mcp-server` en local non configuré). À compléter quand credentials dispo.

### Brainstorm d'idées (`scripts/brainstorm.js`)
Lancer : `npm run brainstorm` (ou bouton back-office).

Sources parallèles · ~476 items/run :
- Reddit (8 subs) · Hacker News Algolia · GitHub Search · RSS (OpenAI / Google AI / Hugging Face / Simon Willison) · YouTube RSS Atom (16 chaînes, cf. `scripts/youtube-channels.js`)

Scoring 5 axes (demande / pertinence / evergreen / vécu / gap) × multiplicateur cluster (`editorial-clusters.js`, 6 clusters de 1.0 à 1.25) × boost chaîne YouTube (1.0 à 1.15).

Filtre anti-bruit : `KEYWORDS_NOISE` + `YT_SIGNAL_KEYWORDS` strict pour éviter que Silicon Carne remonte du contenu non-IA.

---

## Back-office local (port 3001)

Lancer : `node scripts/admin-server.js` (ou `npm run admin`). Navigateur : `http://localhost:3001/`.

### Architecture modules
- Chaque module est `admin/modules/<id>/page.html` autonome, enregistré dans `admin/modules.json`.
- Shell partagé : `admin/shared/admin.css` + `admin/shared/admin.js` (render sidebar dynamique via `/api/modules`).
- Ajouter un module = créer un dossier + entrée JSON. Aucun refactor nécessaire.

### 11 modules en place
| Module | Rôle |
|---|---|
| `dashboard` · `backlog` · `pipeline` · `drafts` · `articles` · `calendar` | Production éditoriale |
| `newsletter` · `social` · `seo-audit` · `alerts` | Audience + qualité |
| `analytics` · `agents` · `settings` | Stubs (pas encore actifs) |

### Flux éditorial
Idée (`backlog`) → Explainer Claude (bouton "✨ Explique-moi le top 10") → Verdict `prendre/hésiter/passer` → `chosen` → Draft (`drafts/<id>.md`) → Publish (`articles/<slug>.html`) → Audit SEO (`audits/<slug>/`) → Social drafts (`social-drafts/<slug>/`) → Calendrier.

### Fichiers data persistants
- `BACKLOG.md` · source de vérité idées (parsing markdown, champs `Résumé`/`Pour toi`/`Verdict`)
- `data/calendar.json` · slots planifiés
- `data/youtube-cache.json` · channelId résolus (TTL 90j)

### Plugins Claude Code installés (scope user)
`superpowers` · `claude-md-management` · `frontend-design` · `context7` · `code-review` · `code-simplifier` · `telegram`. Gestion via `claude plugin <install|list|disable>`. Commandes slash dispo après restart.

---

## Discipline de dev

### Conventions
- Pas de comments inutiles dans le code
- Pas de refactoring non demandé
- Pas de fichier README créé automatiquement
- Chemins **relatifs** partout (`articles/...`, `photos/...`, `downloads/...`) pour fonctionner en local `file://` ET en prod Vercel
- Le dev-browser est installé globalement et disponible pour scraper

### Slug backlog vs draft
Les `id` du `BACKLOG.md` sont tronqués à 50 chars et parfois moches (`tuto-cours-skills-tout-comprendre-sur-les-skills-a`).
**Dans le frontmatter du draft, utilise un `slug` court et propre** (ex: `skills-claude-code-non-dev`). Le fichier draft porte le nom du `id` backlog pour matcher l'idée ; le slug publié est celui du frontmatter.

### Avant toute modif
- Lire ce CLAUDE.md en entier
- Si changement > 3 fichiers ou touche données/API → présenter un plan et attendre "go"
- Vérifier que le ton Leo est respecté

### Après chaque session
- Ce fichier + `CHANGELOG.md` doivent être mis à jour

### CHANGELOG.md obligatoire
Après chaque session non-triviale, ajouter une entrée en haut :
- **Date + titre court**
- **Pourquoi** (problème résolu)
- **Livré** (liste des changements concrets)
- **Fichiers touchés**
- **À venir** (TODOs découverts en chemin)

Le CHANGELOG sert de mémoire entre sessions et de preuve de ce qu'on a décidé. S'il dépasse ~200 lignes des 6 derniers mois, archiver le reste dans `CHANGELOG-2025.md`.

---

## Vercel config · `vercel.json`

Syntaxe **moderne** (pas de `builds`/`routes` legacy · détection auto).

```json
{
  "public": true,
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    { "source": "/(.*)\\.zip",  "headers": [{ "key": "Content-Disposition", "value": "attachment" }] },
    { "source": "/(.*)\\.opml", "headers": [{ "key": "Content-Type", "value": "text/xml; charset=utf-8" }] }
  ]
}
```

**Pourquoi** · la syntaxe legacy `version: 2 + builds: [...]` ne buildait pas `api/*.js` comme serverless functions sur certains projets → `/api/subscribe` retournait 404. La syntaxe moderne laisse Vercel détecter auto (package.json `"type": "module"` + fichiers dans `/api/` = serverless).

**cleanUrls: true** · `/claude-code` résout `/claude-code.html` automatiquement. Tous les liens internes peuvent omettre l'extension.

**Extensions statiques servies** · détection auto par Vercel · pas besoin de liste explicite (avant, `.opml` était 404 car hors liste manuelle).

---

## TODOs / À faire

### Techniques
- [ ] Kill l'ancien projet Vercel qui hébergeait jerwis.fr avant (safe maintenant, domaine libre)
- [ ] Ajouter Vercel Analytics ou Plausible pour suivre les visiteurs
- [ ] Configurer la séquence cours 5 jours côté Resend (guide dans `downloads/cours-email/sequence-resend.md`)

### Contenu
- [ ] Scraper liste X following de `@JeremySagnier` (credentials requis)
- [ ] Valider URL LinkedIn exacte (actuellement `linkedin.com/in/jeremy-sagnier/` par défaut)
- [ ] Remplacer placeholder LinkedIn dans follow-card si slug différent
- [ ] Ajouter d'autres articles Apprendre quand matière dispo
- [ ] Potentiellement créer un CHANGELOG.md pour tracer l'évolution
