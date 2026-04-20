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
- **Stack** : HTML/CSS/JS vanilla · 1 API Vercel serverless (Resend)
- **Chemin local** : `~/Desktop/jeremy-sagnier-site/`

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

### Typo
- Display H1-H2 : `Archivo Black` UPPERCASE · `letter-spacing: -0.03em à -0.04em`
- Body : `Archivo` 400/500/600/700/900
- Labels/kickers : `JetBrains Mono` UPPERCASE · `letter-spacing: 0.1em à 0.2em`

### Effets
- Grain overlay SVG (fractalNoise) en mode multiply (light) / screen (dark)
- Radial gradients colorés sur les hero
- Dual-theme via `data-theme="light|dark"` sur `<html>` + localStorage

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

### PITCH CENTRAL (à préserver à tout prix)
> "Je fais tout ça d'abord pour moi. Si ça arrive jusqu'à toi, c'est parce que ça m'a servi à moi en premier."

Les newsletters sont **des veilles automatiques** que Jérémy se produit à lui-même. Il propose au lecteur de recevoir la même. **Jamais** dire "j'ai créé ce contenu pour toi" — toujours "je te partage ce que je consomme".

### À ne JAMAIS dire / écrire
- ❌ "Dev fullstack", "développeur", "codeur" → Jérémy N'EST PAS dev
- ❌ "Inscrivez-vous pour recevoir du contenu exclusif" → pose commerciale
- ❌ Mentions de projets Eurofiscalis/Kevin internes si pas pertinent
- ❌ Disclaimer consultant "il est important de noter que..."

---

## Structure de la home (`index.html`)

Ordre des sections (ne pas changer sans raison) :

1. **Hero** (dark forcé) — "1 semaine d'avance. Chaque semaine."
2. **Freebies** — 3 cards téléchargement (Claude Code guide + CLAUDE.md + skills pack)
3. **Mini-marquee 1** — Gratuit · Zéro spam · Juste ce qui sert
4. **Apprendre** (#learn) — 5 articles tutos, filtres par catégorie
5. **Newsletters** (#newsletters) — 2 cards veilles (AI Playbook + Business Radar) + 3 notes de transparence
6. **Sources** (#content) — Ce que Jérémy regarde : tabs YouTube (34 chaînes catégorisées) · X · Newsletters (Hormozi)
7. **Mini-marquee 2** — Opinions tranchées · Sans filtre · Écris-moi
8. **Opinions** (#opinions) — 6 cards style magazine cover (photos + overlay coloré)
9. **Showcase** — Bandeau photo plein largeur "Deux frères. Un même cap. Zéro filtre."
10. **Moments** (#moments) — 8 polaroids (vidéos YouTube + photos)
11. **Mini-marquee 3** — Transparence · Veilles auto · Jamais dépassé
12. **Story** (#story) — "Je fais tout ça d'abord pour moi." (en bas, juste avant CTA final)
13. **CTA Drop** — "Elle part vendredi. Tu veux être dedans ?"
14. **Marquee principal** + Footer (6px stripe teal/fuchsia/orange top)

### Nav (ordre)
`Claude Code · Apprendre · Newsletters · Chaînes · Opinions · L'histoire`

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

### Env vars à configurer sur Vercel
```
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=304eb520-82fc-4e4c-be09-cbdaf1a3127f
```

L'audience par défaut est "Vendeurs Amazon" d'Eurofiscalis (119 contacts). **À MIGRER** vers une audience dédiée "AI Playbook" à créer côté Resend dashboard.

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

---

## Discipline de dev

### Conventions
- Pas de comments inutiles dans le code
- Pas de refactoring non demandé
- Pas de fichier README créé automatiquement
- Chemins **relatifs** partout (`articles/...`, `photos/...`, `downloads/...`) pour fonctionner en local `file://` ET en prod Vercel
- Le dev-browser est installé globalement et disponible pour scraper

### Avant toute modif
- Lire ce CLAUDE.md en entier
- Si changement > 3 fichiers ou touche données/API → présenter un plan et attendre "go"
- Vérifier que le ton Leo est respecté

### Après chaque session
- Ce fichier + CHANGELOG (à créer) doivent être mis à jour

---

## TODOs / À faire

- [ ] Créer audience dédiée "AI Playbook" sur Resend (pas réutiliser "Vendeurs Amazon")
- [ ] Déployer sur Vercel avec env vars Resend
- [ ] Scraper liste X following de `@JeremySagnier` (credentials requis)
- [ ] Valider URL LinkedIn exacte (actuellement `linkedin.com/in/jeremy-sagnier/` par défaut)
- [ ] Remplacer placeholder LinkedIn dans follow-card si slug différent
- [ ] Ajouter d'autres articles Apprendre quand matière dispo
- [ ] Potentiellement créer un CHANGELOG.md pour tracer l'évolution
