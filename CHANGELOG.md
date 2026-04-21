# CHANGELOG — Site perso Jérémy Sagnier

## 2026-04-22 (nuit+++++++) · Veille enrichie · rapatriement depuis newsletter-dashboard

### Pourquoi
Mon projet `newsletter-dashboard` (Content Machine Eurofiscalis) a une bibliothèque de ~60 flux RSS structurés. J'ai rapatrié ceux pertinents pour ma veille perso (IA, Claude Code, entrepreneuriat) sans dupliquer · gardé les 2 projets découplés.

### Livré
**`scripts/brainstorm.js`** ·
- `SUBREDDITS` · +3 nouveaux (`MachineLearning`, `artificial`, `SaaS`)
- `RSS_FEEDS` · +4 médias tech (`TechCrunch AI`, `The Verge AI`, `MIT Technology Review`, `Hacker News Best`)
- Nouvelle fonction `googleNewsFeeds(keywords)` · génère dynamiquement des flux Google News FR+EN sur `GOOGLE_NEWS_KEYWORDS` (Claude Code, Anthropic, Superpowers plugin, agents IA, AI skills) · 10 flux générés
- Intégration dans `main()` · le fetch parallèle inclut maintenant Google News

**`downloads/jeremy-ai-sources.opml`** ·
- +1 catégorie "Médias tech IA (4 flux RSS)"
- +1 catégorie "Google News dynamique (5 keywords)" · 5 flux représentatifs (1 FR + 1 EN selon pertinence)

### Résultat mesuré (run 2026-04-22 · test après enrichissement)
| Métrique | Avant | Après | Δ |
|---|---|---|---|
| Items bruts collectés | 476 | **694** | **+46%** |
| Idées scorées | 111 | **167** | **+50%** |
| Clusters actifs dans le top | 4 | **6** | · |
| Nouvelles idées au backlog | 9 | **11** | · |

### Top 10 enrichi (exemples qui viennent des nouvelles sources)
- `[8.8]` "Claude Code, Gemini CLI, and GitHub Copilot Vulnerable to Prompt Injection" · probablement Google News
- `[8.5]` "Mondoo Launches World's First Free AI Skills Security Checker" · Google News
- `[8.3]` "I lost half my agency's pipeline to Claude Code in 2025" · Reddit r/SaaS ou Entrepreneur

### Fichiers touchés
- `scripts/brainstorm.js` · +3 subreddits, +4 RSS, +1 fonction googleNewsFeeds + intégration main
- `downloads/jeremy-ai-sources.opml` · +2 catégories, +9 flux au total

### Architecture retenue
- **Découlage volontaire** · pas de module RSS centralisé entre `newsletter-dashboard` et `jeremy-sagnier-site`
- Raison · les 2 projets ont des audiences différentes (Eurofiscalis pros Amazon/e-com vs entrepreneurs curieux IA). Leurs sources doivent rester indépendantes pour éviter qu'une évolution d'un côté casse l'autre
- Futur · si la duplication devient pénible, extraire dans un package npm commun

### À venir
- [ ] Monitorer la qualité des Google News pendant 2 semaines · si bruit > signal, réduire ou retirer
- [ ] Évaluer si ajouter `r/LocalLLaMA` (déjà là) + `r/OpenAI` (déjà là) suffit ou si `r/stablediffusion` / `r/LLMDevs` apporteraient

---

## 2026-04-22 (nuit++++++) · Freebies · 5 nouvelles ressources (Phases 1+2+3)

### Pourquoi
Après audit croisé (recherche lead magnets 2026 + audit interne artéfacts), j'ai identifié 5 freebies à fort impact pour compléter la section « Les outils, tout de suite ». Appliqué la méthode Superpowers · brainstorm → plan 3 phases → execute.

### Phase 1 · Quick wins (2h30)
**3 nouveaux freebies sans email requis**

- **#06 · OPML veille IA** · `downloads/jeremy-ai-sources.opml` · 34 chaînes YouTube (IA/Business/Finance/Actu/Lifestyle) + 4 RSS officiels (OpenAI, Google AI, Hugging Face, Simon Willison) · import 1 clic dans Feedly/Inoreader
- **#07 · 3 prompts que j'utilise vraiment** · `downloads/jeremy-prompts-pack.md` · Prompt 1 (explainer idées) + Prompt 2 (décliner article social) + Prompt 3 (ton Leo ruleset) · mode d'emploi et exemples
- **#08 · Cheat-sheet A4 imprimable** · `downloads/cheatsheet-claude-code.html` · commandes Claude Code + git + plugins + 3 réflexes jour 1 · format A4 portrait, imprimable en Cmd+P

### Phase 2 · Quiz interactif (2h)
- **Nouvelle page `/quiz.html`** · 8 questions sur métier/usage/tech/temps/objectif/budget/frein/préférence
- **Algorithme de recommandation** · scoring cumulatif sur 5 profils (découvreur, builder, créateur, growth, explorer)
- **Résultat personnalisé** · outils à installer + prompts ciblés + articles à lire
- **Email capture en fin** (optionnel, pour recevoir newsletter)
- Nav « Quiz » ajoutée en fuchsia sur /quiz.html
- **Carte Freebie #09** ajoutée

### Phase 3 · Mini-cours email 5 jours (3h)
- **5 templates email** dans `downloads/cours-email/`
  - `day-1-install.md` · Installer Claude Code (10 min)
  - `day-2-claude-md.md` · Ton premier CLAUDE.md
  - `day-3-skill.md` · Lancer un skill sur une vraie tâche
  - `day-4-automation.md` · Automatiser un workflow simple
  - `day-5-next.md` · Récap + roadmap mois 1 + question feedback
- **`sequence-resend.md`** · guide technique pour configurer la séquence (3 options · Broadcasts Resend, endpoint Vercel+Supabase, n8n workflow) avec code complet prêt à déployer
- **`README.md`** · mode d'emploi pour Jérémy
- Handler JS `#freebie-download-form` mis à jour pour gérer le cas "pas de fichier" (cours arrive par email)
- **Carte Freebie #10** ajoutée

### Résumé section Freebies
Passage de **5 → 10 ressources** · texte intro mis à jour · "Soyons transparents" passé à "sur les 10, 3 demandent ton email" (CLAUDE.md + skills pack + cours 5 jours).

### Fichiers touchés
- `index.html` · +3 cartes (06 OPML, 07 prompts, 08 cheat-sheet) · +2 cartes (09 quiz, 10 cours) · intro 5→10 · transparency 5→10 · handler JS étendu
- `downloads/jeremy-ai-sources.opml` · nouveau · 38 sources
- `downloads/jeremy-prompts-pack.md` · nouveau · 3 prompts + exemples
- `downloads/cheatsheet-claude-code.html` · nouveau · A4 imprimable
- `quiz.html` · nouveau · page interactive 8 questions
- `downloads/cours-email/*.md` · 6 fichiers (5 emails + README + sequence-resend)

### À venir (à ta main)
- [ ] Configurer la séquence Resend pour le cours 5 jours (guide complet dans `downloads/cours-email/sequence-resend.md`)
- [ ] Ajouter nav « Quiz » dans les autres pages principales
- [ ] Commit/push Vercel et vérifier que les 10 téléchargements fonctionnent en prod (cache zip)
- [ ] Tester le quiz de bout en bout en prod (5 profils)

### Mesures à suivre après déploiement
- Taux de clic sur chaque carte Freebie
- Taux d'inscription via quiz vs inscription directe newsletter
- Taux d'ouverture des 5 emails du cours (objectif · >60% sur J5)

---

## 2026-04-22 (nuit+++++) · Fix dark mode + GitHub intégré au parcours

### Pourquoi
User a spotté un bug d'affichage en dark mode sur `outils.html` tier2-intro · texte cream sur fond cream, illisible. Diagnostic · les blocs utilisaient `background: var(--ink)` avec `color: #FBF7F0` · en dark mode, `--ink` devient cream donc texte cream sur fond cream. Même bug sur `github.html` (gh-hero + gh-final) et `outils.html` (outils-cta).

### Méthode Superpowers appliquée
- **Brainstorm** · diagnostic des 3 problèmes (dark mode cassé, GitHub pas fini, vérif croisée)
- **Plan écrit** · 4 phases (A audit, B fix CSS, C nav GitHub, D vérif finale)
- **Exécution avec checkpoints** · screenshots dark mode avant/après

### Fix dark mode (Phase B)
- **`outils.html`** · `.tier2-intro { background: #0A0A0A }` au lieu de `var(--ink)` · `.outils-cta { background: #0A0A0A }`
- **`github.html`** · `.gh-hero { background: #0A0A0A }` · `.gh-final { background: #0A0A0A }`
- Tous textes blancs/cream déjà hardcodés `#FBF7F0` et rgba blanc · restent lisibles sur fond noir fixe peu importe le thème
- Les 3 couleurs accent Fiesta (teal/fuchsia/orange) restent inchangées quel que soit le thème

### GitHub intégré au parcours (Phase C)
- **`apprendre.html` étape 02** · 3 cards → **4 cards** · nouvelle carte `02.4 · GitHub pour les non-devs` (orange-ink) · step-facts passés à "4 lectures · ~41 min au total" · step-intro enrichi pour mentionner GitHub en « filet de sécurité »
- **`debutant.html` Porte 3** · nouveau paragraphe *« Deuxième plus · GitHub · le coffre-fort où Claude sauvegarde ton travail »* avec lien vers `github.html`
- **`outils.html`** · lien GitHub déjà présent dans la nav (fuchsia)

### Fichiers touchés
- `outils.html` · 2 blocs CSS corrigés (tier2-intro + outils-cta)
- `github.html` · 2 blocs CSS corrigés (gh-hero + gh-final)
- `apprendre.html` · 4ème carte GitHub + step-facts + intro
- `debutant.html` · paragraphe Porte 3 enrichi

### Vérifications dark mode
- ✅ `outils.html#tier2-intro` · fond noir pur, "4 OUTILS POUR ALLER PLUS" lisible (blanc/orange)
- ✅ `github.html` hero · noir pur, "GITHUB EXPLIQUÉ POUR LES NON-DEVS" bien rendu
- ✅ `github.html` gh-final CTA · noir pur
- ✅ Nav GitHub en fuchsia visible sur outils.html et github.html
- ✅ Apprendre étape 02 · 4 cards alignées en desktop

### À venir
- [ ] Navs des autres pages (lexique, claude-code, workflows) · elles n'ont pas de nav verbose, pas critique
- [ ] Si d'autres sections sombres apparaissent, utiliser systématiquement `#0A0A0A` au lieu de `var(--ink)` quand le texte reste blanc fixe

---

## 2026-04-22 (nuit++++) · Page /github.html dédiée non-devs

### Pourquoi
GitHub est l'outil transversal manquant · ni dans la stack outils (format cartes trop court), ni dans un article (trop narratif, disparaît dans le fil). Les lecteurs non-devs ont besoin d'une page de référence à laquelle revenir.

### Livré
- **Nouvelle page `/github.html`** · 714 lignes · format guide complet type `/claude-code.html`
- **Structure** · Hero noir avec triple-stripe + H1 "GITHUB EXPLIQUÉ POUR LES NON-DEVS" en orange/blanc · 7 sections :
  1. Avant de commencer · analogie Dropbox + 3 particularités
  2. **4 cas d'usage concrets** · Déployer Vercel · Backup Claude Code · Outils open-source · Collaborer avec dev
  3. Comment démarrer · 5 étapes en 10 min
  4. **Les 5 commandes à connaître** (table) · `status · add · commit · push · pull` + bonus `clone` et `checkout`
  5. 3 pièges · clé API pushée · force push · public vs privé
  6. **Combo GitHub + Claude Code** · workflow type de la journée en 6 étapes
  7. Pour aller plus loin · 5 liens internes/externes
- **Schema.org Article** + meta OG + Twitter Card
- **CTA newsletter** final sur fond sombre
- **Nav "GitHub" en fuchsia** · ajoutée dans `outils.html` + déjà dans `github.html`
- **Footer complet** · liens Direct + Suivre
- Ton Leo respecté · 0 mot banni

### Points pédagogiques clés
- **Angle "filet de sécurité"** · pas "pour coder" · pour ne pas perdre son travail + déployer automatiquement
- **Astuce Claude Code** dans un callout · *« tu n'as même pas besoin de mémoriser les commandes, Claude les exécute »*
- **Règle de fin de session** · commit + push avant de fermer, prend 5 secondes

### Fichiers touchés
- `github.html` · nouveau · 714 lignes
- `outils.html` · +1 lien nav vers GitHub

### Vérifications visuelles
- ✅ Hero rendu propre · H1 orange + triple-stripe Fiesta
- ✅ Section cas d'usage · kicker orange + cartes bordées par couleur (teal/fuchsia/orange/ink)
- ✅ Section commandes · kicker fuchsia + table stylée
- ✅ Nav sticky fonctionne · GitHub en fuchsia (page courante)

### À venir
- [ ] Ajouter lien GitHub dans les navs de `apprendre.html`, `debutant.html`, `lexique.html`, `claude-code.html`
- [ ] Article éventuel "Comment j'ai mis mon site sur GitHub + Vercel en 10 min" si demande lecteurs
- [ ] Mentionner GitHub dans étape 02 de `apprendre.html` ? (Setup Claude Code → Git + GitHub)

---

## 2026-04-22 (nuit+++) · Tier 2 "Stack avancée" · 4 nouveaux outils

### Pourquoi
La page outils commençait à devenir un catalogue fourre-tout avec l'ajout de Supabase. User a proposé de différencier · **stack essentielle** (pour tous) vs **stack avancée** (pour cas d'usage précis). Excellente idée pédagogique qui évite l'effet "top 20".

### Architecture retenue
- **Tier 1 (7 outils)** · Claude Code, dev-browser, Vercel, Resend, n8n, Ghostty, Supabase
- **Tier 2 (4 outils)** · Sanity, Zernio, fal.ai, Remotion · règle explicite *"ne pas installer tant qu'un projet ne le justifie"*
- Séparateur visuel entre les deux · mini-marquee "Tu as la base → voici ce qui vient après" + bloc noir `tier2-intro` (triple-stripe Fiesta top, règle fuchsia encadrée)
- Cartes tier 2 **plus compactes** (3 rows : Quand l'ajouter / Démarrage / Mon usage) vs 4 rows du tier 1

### Livré
- **`outils.html`**
  - Hero repositionné · "Ma stack, du basique à l'avancé" · meta/OG/JSON-LD passés à "11 outils"
  - Nouvelle intro tier 2 (`.tier2-intro`) + 2ème table récap
  - 4 cartes complètes · Sanity (#08 teal) · Zernio (#09 fuchsia) · fal.ai (#10 orange) · Remotion (#11 ink)
  - Section "Pas dans la liste" nettoyée · Zernio retiré (monté en tier 2), Hedra/ElevenLabs mentionnés comme compagnons de fal.ai/Remotion
  - Mini-marquee final passé à "7 essentiels · 4 avancés"
- **`downloads/stack-jeremy.md`**
  - Introduction refondée · 2 tableaux distincts (tier 1 / tier 2)
  - 4 sections détaillées ajoutées (Sanity, Zernio, fal.ai, Remotion) · commandes `npm create sanity@latest` / `npx create-video` etc.
  - Fichier passé de 6 250 à 9 786 octets (+56 %)
- **`downloads/jeremy-claude-pack.zip`** régénéré · 713 Ko
- **`index.html`** · carte freebie 05 · liste repensée essentiels / avancés

### Fichiers touchés
- `outils.html` · +280 lignes (intro + 2 table + 4 cartes + CSS tier2)
- `downloads/stack-jeremy.md` · +~115 lignes
- `downloads/jeremy-claude-pack.zip` · régénéré
- `index.html` · carte 05 réécrite

### Vérifications visuelles
- ✅ Intro tier 2 · bloc noir avec triple-stripe Fiesta en haut, règle fuchsia encadrée lisible
- ✅ Carte Sanity (#08) · teal, bien structurée, numéro 09 Zernio visible à la suite
- ✅ Les 4 cartes ont la classe `.tier2` qui réduit le padding

### À venir
- [ ] Articles dédiés éventuels sur fal.ai ou Remotion (si Jérémy livre un projet réel)
- [ ] Envisager un tier 3 si d'autres outils spécialisés émergent (Stripe, Airtable, etc.)

---

## 2026-04-22 (nuit++) · Supabase ajouté comme 7ème outil

### Pourquoi
J'avais mis Supabase dans la section "pas dans la liste volontairement" avec l'argument qu'il était trop dev pour un non-dev. User a demandé à le réinsérer comme outil principal. Effectivement justifié : dès qu'un site ou agent a besoin de stocker des données (formulaires, leads, mémoire longue), c'est la solution la plus simple pour un non-dev.

### Livré
- **`outils.html`** · nouvelle 7ème carte `c-fuchsia` complète (pourquoi lui · installation 4 étapes · usage Eurofiscalis/Leads · pour qui c'est) · table récap étendue · hero passé de 6 à 7 outils (méta + JSON-LD + marquees)
- **`outils.html`** · Supabase retiré de la section "Pas dans la liste" (évite la contradiction)
- **`downloads/stack-jeremy.md`** · section 7 "Supabase" ajoutée · tableau récap à 7 lignes · commandes env + SQL à demander à Claude
- **`downloads/jeremy-claude-pack.zip`** · régénéré 712 Ko (stack-jeremy.md v2 de 6250 octets)
- **`index.html`** · carte freebie 05 · liste des outils mise à jour, mention des 7

### Fichiers touchés
- `outils.html` · +73 lignes · carte Supabase + hero/meta/marquee/JSON-LD mis à jour
- `downloads/stack-jeremy.md` · section 7 ajoutée + tableau
- `downloads/jeremy-claude-pack.zip` · régénéré
- `index.html` · carte 05 freebie

### À venir
- [ ] Écrire éventuellement un article dédié "Supabase pour un non-dev · comment je stocke mes données"
- [ ] Publier le commit et vérifier le ZIP en prod (cache Vercel)

---

## 2026-04-22 (nuit+) · Article Superpowers avec recherche sous-agents

### Pourquoi
Le plugin Superpowers qu'on a installé en début de session mérite un article dédié. Le user voulait que j'utilise la méthodologie Superpowers (brainstorm → plan → execute) et que je déploie des sous-agents pour la recherche.

### Méthode appliquée (Superpowers-style)
- **Brainstorm implicite** · angle retenu : Jérémy vient d'installer, angle honnête "ce que j'ai compris + retours utilisateurs externes"
- **2 sous-agents de recherche en parallèle**
  - Agent Explore · lecture du plugin local (`~/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.7/`) → rapport des 14 skills + philosophie + avis pragmatique pour non-dev
  - Agent general-purpose · recherche web (GitHub stats + HN + Threads + blogs tech) → citations verbatim de 6 sources (Evan Schwartz, Simon Willison, Mejba Ahmed benchmark, rodskagg critique, d--b HN, Jesse Vincent lui-même)
- **Synthèse** des 2 rapports dans un article original, ton Leo

### Livré
- **`drafts/superpowers.md`** · 1977 mots · slug `superpowers-claude-code`
- **`articles/superpowers.html`** · 32 Ko · publié via `npm run publish`
- Structure : hero + TL;DR + avant (avec critiques honnêtes dès l'intro) + concept (3 piliers) + 14 skills regroupés en 4 familles + 3 cas concrets + problèmes réels (overkill, activation agressive, bug subagents) + installation + pour aller plus loin (5 sources externes citées)

### Sources externes citées
- [Jesse Vincent · blog fondateur](https://blog.fsck.com/2025/10/09/superpowers/) · source primaire
- [Simon Willison](https://simonwillison.net/2025/Oct/10/superpowers/) · caution d'autorité
- [Mejba Ahmed · benchmark 12 sessions](https://www.mejba.me/blog/superpowers-plugin-claude-code-review) · +10-15% tokens sur small tasks
- [Issue #237 · bug subagents contexte](https://github.com/obra/superpowers/issues/237)
- Threads @rodskagg · critique "changer CSS prend des plombes"

### Chiffres clés validés
- 163 000 stars GitHub, 14 200 forks (au 2026-04-22)
- 4e plugin le plus installé du marketplace officiel Anthropic
- Créé 9 octobre 2025 par Jesse Vincent

### Fichiers touchés
- `drafts/superpowers.md` · nouveau
- `articles/superpowers.html` · nouveau (32 Ko)
- `sitemap.xml` · entrée superpowers ajoutée

### À venir
- [ ] Ajouter l'article Superpowers dans étape 02 de `apprendre.html` (devient 4 cartes)
- [ ] Éventuellement ajouter dans le cluster `claude-code` du brainstorm pour qu'il remonte naturellement

---

## 2026-04-22 (nuit) · Audit + article dev-browser + page outils + freebie stack

### Pourquoi
3 objectifs combinés · vérifier la mémoire du projet entre sessions · documenter publiquement les outils qu'on utilise vraiment · offrir une porte d'entrée pour qui veut copier la stack.

### Phase 1 · Audit CLAUDE.md + mémoires
- **Synchronisation 100%** vérifiée entre CLAUDE.md site / plugins installés (7) / modules BO (13) / données data/ (2 fichiers JSON valides)
- **Gap critique corrigé** · `claude-code-workflow-tips-after-6-months-of-daily-` déplacé de `chosen` → `published` dans BACKLOG via API (1 article présent dans `articles/` mais non reflété dans le backlog)
- **Gaps mineurs identifiés** (non corrigés, à faire à l'occasion) · pas de `.claude.local.md` pour règles perso · CHANGELOG approche 520 lignes (archiver vers `CHANGELOG-2025.md` quand ça passe 600)

### Phase 2 · Article dev-browser + page outils.html
- **`drafts/dev-browser.md`** + **`articles/dev-browser.html`** · 2000+ mots · 4 cas d'usage chiffrés · 3 limites · ton Leo respecté · publié via `npm run publish dev-browser` (29 Ko)
- **Nouvelle page `/outils.html`** · 831 lignes · hero « Les 6 outils que j'utilise vraiment » · table récap + 6 cartes détaillées (Claude Code Max · dev-browser · Vercel · Resend · n8n · Ghostty) · section « Ce qui n'est pas dans la liste (volontairement) » · CTA newsletter final
- **Schema.org** `CollectionPage` pour le SEO
- Nav « Outils » en fuchsia dans le header de `outils.html`

### Phase 3 · Freebie stack-jeremy.md
- **Nouveau `downloads/stack-jeremy.md`** · récapitulatif des 6 outils en 1 fichier (4 Ko) · chaque outil avec prix, commande d'install, usage perso, alternatives
- **5ème carte Freebies** `fb-teal` ajoutée à la section du site (sans email requis, téléchargement direct · lien vers `outils.html` pour le détail)
- **Intro Freebies** · 4 → 5 ressources · tableau de transparence réécrit (2 emails sur 5)
- **Pack zip régénéré** · 711 Ko · inclut `stack-jeremy.md` en plus

### Fichiers touchés
- `BACKLOG.md` · entrée migrée chosen → published
- `drafts/dev-browser.md` · nouveau
- `articles/dev-browser.html` · nouveau (via publish.js)
- `sitemap.xml` · entrée dev-browser ajoutée automatiquement
- `outils.html` · nouveau · page complète
- `downloads/stack-jeremy.md` · nouveau
- `downloads/jeremy-claude-pack.zip` · régénéré 711 Ko
- `index.html` · 5ème carte freebie + intro 4→5 + transparence réécrite

### Vérifications end-to-end
- ✅ Article dev-browser rendu propre (screenshot pris)
- ✅ Page outils.html · hero + toutes les 6 cartes OK (screenshots)
- ✅ publish.js n'a pas cassé sitemap ni apprendre.html
- ✅ BACKLOG cohérent · 23 proposées · 2 choisies · 1 publiée · 8 rejetées

### À venir
- [ ] Ajouter nav « Outils » dans toutes les pages (apprendre, debutant, claude-code, etc.)
- [ ] Article Superpowers (demandé par user à l'instant)
- [ ] Audit manuel détaillé via `/revise-claude-md` une fois Claude Code restart

---

## 2026-04-22 (suite) · Section Freebies · 4ème carte plugins installables

### Pourquoi
L'user voulait que les 6 plugins Anthropic soient **installables depuis le site**, pas juste mentionnés. Un lecteur qui passe sur la home doit pouvoir récupérer les commandes ou le script en 1 clic.

### Livré
- **Nouveau `downloads/install-plugins.sh`** · script bash 2.6 Ko · installe les 6 plugins via `claude plugin install` · vérifie présence du CLI · feedback coloré · bilan des échecs · messages d'usage · `set -e` pour sûreté
- **Nouvelle 4ème carte** Freebies `fb-ink` (style sombre · gradient triple-stripe teal/fuchsia/orange au top) · **sans email requis** (commandes publiques Anthropic) · 2 CTA :
  - **`Télécharger le script`** · lien direct `downloads/install-plugins.sh` (download attribute)
  - **`⎘ Copier les 6 commandes`** · clipboard API · toast « ✓ 6 commandes copiées · colle-les dans ton terminal »
- **Intro Freebies** · "3 ressources" → "**4 ressources**"
- **CSS `fb-ink`** dans `assets/main.css` · triple-stripe au top + numéro sombre sur cream
- **`downloads/README.md`** enrichi · nouvelle **Étape 4 "Installer mes 6 plugins officiels"** · avec la commande `bash install-plugins.sh` et la liste des 6 plugins · renumérotation Étape 5 pour le test
- **Pack zip régénéré** · 709 Ko · inclut `install-plugins.sh` + README v2 + CLAUDE.md v2

### Fichiers touchés
- `downloads/install-plugins.sh` · nouveau (exécutable, chmod +x)
- `downloads/README.md` · +Étape 4 plugins + renumérotation + mention dans tableau pack
- `downloads/jeremy-claude-pack.zip` · régénéré 709 Ko
- `index.html` · 4ème carte `fb-ink` · bouton copy + handler JS clipboard · intro 3→4
- `assets/main.css` · `.fb-ink::before` + `.fb-ink .freebie-num`

### Vérifications end-to-end
- ✅ `bash -n install-plugins.sh` · syntaxe OK
- ✅ Bouton copy : 6 commandes copiées dans le clipboard (testé via mock)
- ✅ Toast feedback : « ✓ 6 commandes copiées · colle-les dans ton terminal »
- ✅ Lien download : `downloads/install-plugins.sh` résolu
- ✅ 4 cards rendues, fb-ink en dernier, triple-stripe visible

### Workflow utilisateur final
1. Lecteur arrive sur la home, scroll jusqu'à la section Freebies
2. Voit les 4 ressources (Claude Code / CLAUDE.md / 26 skills / **6 plugins**)
3. Sur la 4ème : clique "Copier les 6 commandes" → va dans son terminal → paste → 6 plugins installés en 30 sec
4. OU clique "Télécharger le script" → l'exécute via `bash install-plugins.sh` avec feedback coloré

---

## 2026-04-22 · Site public synchronisé avec les plugins Claude Code (Options A + B)

### Pourquoi
Les 6 plugins officiels Anthropic ont été installés en session interne, mais le site public ne les mentionnait nulle part. Un lecteur qui télécharge le pack ou lit les tutos était en retard d'une étape.

### Option A · Socle public (livré)
- **`downloads/CLAUDE.md`** enrichi · nouvelle section "Plugins Claude Code installés (scope user)" · tableau des 6 plugins + commandes slash utiles + gestion via `claude plugin`
- **`downloads/jeremy-claude-pack.zip`** régénéré · 707 Ko · CLAUDE.md passé de 5231 à 7204 octets
- **`lexique.html`** · nouvelle entrée #08 "Plugin & Marketplace" complète (analogie, usage, 6 plugins en tableau, mockup terminal, pas à pas, bloc "tu peux l'ignorer si") · TOC mis à jour · meta/h1/share passés de "7 mots" à "8 mots" partout
- **`claude-code.html`** · nouvelle section "Les plugins officiels à connaître" (kicker teal · après "Ma routine", avant "Dépannage") · id `#plugins` pour ancrage · callout install des 6 en une fois · 6 steps colorés détaillant chaque plugin · mini-marquee après · lien vers `lexique.html#plugin`

### Option B · Parcours cohérent (livré à la foulée)
- **`apprendre.html`** · étape 02 passe de 2 à **3 cartes** · nouvelle `02.3` teal "Les 6 plugins officiels à installer" (5 min) · step-facts mis à jour (`3 lectures · ~27 min au total`) · step-intro enrichi pour mentionner les plugins
- **`debutant.html`** · Porte 3 "Claude Code" complétée d'un paragraphe "Un plus à connaître" avec l'analogie *"applications pour ton téléphone"* · ton rassurant pour débutants (« ne te prends pas la tête au début »)

### Fichiers touchés
- `downloads/CLAUDE.md` · `downloads/jeremy-claude-pack.zip` (régénéré)
- `lexique.html` · `claude-code.html` · `apprendre.html` · `debutant.html`

### Vérifications visuelles faites
- ✅ `apprendre.html#etape-02` · 3 cartes alignées (Setup fuchsia · Loops teal-fuchsia · Plugins teal)
- ✅ `debutant.html` Porte 3 · paragraphe plugins lisible, ton Leo respecté
- ✅ `claude-code.html#plugins` · callout install + 6 steps rendus
- ✅ `lexique.html#plugin` · entrée #08 ancrée, nav OK

### À venir (Option C pas faite)
- [ ] Passer sur 4 articles Claude Code pour ajouter un encart "📦 Plugins officiels" (loops-claude, agents-ia-guide, tuto-agent-gmail, construit-avec-claude-code-gmf)
- [ ] Vérifier en prod une fois déployé sur Vercel que le ZIP téléchargeable est la nouvelle version (cache Vercel)

---

## 2026-04-21 (nuit) · Plugins Claude Code officiels + CLAUDE.md enrichi

### Pourquoi
Deux vides à combler : (1) le CLAUDE.md n'avait pas bougé depuis la création du back-office, il ne mentionnait ni les 11 modules, ni le brainstorm multi-sources, ni les règles découvertes en cours de route · (2) aucun plugin Claude Code installé en dehors de `telegram`, alors que le store officiel Anthropic expose 140 plugins dont plusieurs pile dans l'usage.

### Livré

**6 plugins Anthropic officiels installés** (scope user, dispo dans tous les projets) :
| Plugin | Version | Apporte |
|---|---|---|
| `superpowers` | 5.0.7 | 14 skills · 3 commandes (`/brainstorm`, `/write-plan`, `/execute-plan`) · 1 agent `code-reviewer` |
| `claude-md-management` | 1.0.0 | 1 skill `claude-md-improver` · 1 commande `/revise-claude-md` |
| `frontend-design` | latest | 1 skill `frontend-design` (auto-déclenche sur refontes UI) |
| `context7` | latest | 1 MCP server (docs à jour de n'importe quel framework) |
| `code-review` | latest | 1 commande `/code-review` |
| `code-simplifier` | latest | 1 agent `code-simplifier` |

Commande : `claude plugin install <nom>` · marketplace `claude-plugins-official`.

**CLAUDE.md enrichi de 5 ajouts** (fichier passé de 319 à 373 lignes) :
- Nouvelle section complète `## Back-office local (port 3001)` · architecture modules + 11 modules en place + flux éditorial + fichiers data + plugins installés
- Nouvelle sous-section `### Brainstorm d'idées (scripts/brainstorm.js)` · sources parallèles + scoring 5 axes + boost cluster + filtre anti-bruit
- Nouvelle sous-section `### Slug backlog vs draft` · les `id` BACKLOG sont moches, mettre un slug court dans le frontmatter du draft
- Nouvelle sous-section `### CHANGELOG.md obligatoire` · format 5 parties (date, pourquoi, livré, fichiers, à venir)
- Exception dans ton Leo · citer un mot banni entre guillemets français est OK

**2 drafts écrits** (non encore publiés) :
- `drafts/claude-code-workflow-tips-after-6-months-of-daily-.md` · slug `claude-code-6-mois-non-dev` · 2012 mots · angle "non-dev vs dev senior"
- `drafts/tuto-cours-skills-tout-comprendre-sur-les-skills-a.md` · slug `skills-claude-code-non-dev` · 1786 mots · angle "Skills Claude Code expliqués par un non-dev" (crédite Melvynx)

### Fichiers touchés
- `CLAUDE.md` · 5 éditions ponctuelles (lignes 132, 291, 303, 341, 353)
- `drafts/claude-code-workflow-tips-after-6-months-of-daily-.md` · nouveau
- `drafts/tuto-cours-skills-tout-comprendre-sur-les-skills-a.md` · nouveau
- `~/.claude/plugins/installed_plugins.json` · +6 plugins (fichier hors repo, info seulement)

### À venir
- [ ] **Restart Claude Code** pour que les 3 commandes slash des plugins soient reconnues (`/brainstorm`, `/write-plan`, `/execute-plan`, `/revise-claude-md`, `/code-review`)
- [ ] Relire + publier les 2 drafts (`npm run publish <slug>`)
- [ ] Lancer `/revise-claude-md` post-restart pour comparer avec les 5 ajouts manuels et compléter si le skill propose plus
- [ ] Tester `context7` sur une requête Next.js 16 ou Resend v3 pour valider le MCP

---

## 2026-04-21 (soirée+) · Liens croisés entre modules (cohérence BO)

### Pourquoi
Les 11 modules étaient 11 îlots. Aucun ne pointait vers l'autre. Pour planifier la publication d'une idée, il fallait : ouvrir le backlog · copier le slug · ouvrir le calendrier · créer manuellement un slot · retaper le slug. 5 clics, 3 écrans.

### Livré (30 min pile)

**Depuis Backlog** :
- État "À écrire" : nouveau bouton `📅 Planifier` · ouvre `/calendar/#plan-<slug>` qui auto-ouvre le modal avec : prochain mardi/vendredi, slug pré-rempli, note pré-remplie
- État "Publiées" : bouton `📅 Planifier` (pour programmer une relance sociale ou newsletter)

**Depuis Pipeline** :
- Chaque ligne devient un `<a>` cliquable
- Routing intelligent selon l'étape :
  - stage = `published` ou `shared` → ouvre l'article dans nouvel onglet
  - stage = `drafted` ou `audited` → ouvre le module Drafts avec query `?slug=`
  - sinon → ouvre le backlog avec `#<slug>` (scroll auto)
- Hover fuchsia + bordure gauche 3px pour signaler l'interactivité

**Depuis Alerts** :
- Chaque alerte a désormais un lien `📊 Pipeline` en dessous de `Re-auditer`

**Depuis Calendar (modal)** :
- Quand un slug est sélectionné, 3 liens contextuels apparaissent en bas du modal : `💡 Voir l'idée` (backlog) · `✏ Draft` (éditeur) · `📰 Article ↗` (si publié, le site)
- Mise à jour live quand on change le slug dans le dropdown

### Fichiers touchés
- `admin/modules/backlog/page.html` · +bouton Planifier en chosen & published
- `admin/modules/pipeline/page.html` · rows → `<a>` · routing intelligent selon stage
- `admin/modules/alerts/page.html` · +lien Pipeline à côté de Re-auditer
- `admin/modules/calendar/page.html` · `handleHashShortcut()` pour auto-ouverture modal · `updateModalLinks()` pour liens contextuels live

### Vérifications end-to-end (dev-browser)
- ✅ backlog.chosen → bouton Planifier détecté
- ✅ pipeline → 48 lignes `.clickable` détectées
- ✅ `/calendar/#plan-loops-claude` → modal ouvert + slug pré-rempli `loops-claude` + 3 liens contextuels
- ✅ alerts → 15 liens Pipeline (1 par alerte)

---

## 2026-04-21 (soirée) · Brainstorm · source YouTube (16 chaînes RSS)

### Pourquoi
Reddit + HN + GitHub + RSS = du contenu IA en **anglais technique**. Résultat : 90% du top 10 était en anglais, verbeux, peu actionnable pour le cluster `entrepreneuriat-ia` et `outils-ia`. Les meilleures ressources FR de Jérémy (Melvynx, Grand Angle, Oussama Ammar, Silicon Carne) étaient absentes des sources.

### Livré
- Nouveau fichier `scripts/youtube-channels.js` · 16 chaînes sélectionnées (IA/Tech + Business & Entrepreneuriat) sur les 34 listées sur le site. Exclu : Lifestyle, Actu généraliste, Finance pure (aucun cluster actif)
- **Résolution auto handle→channelId** · scrape la page `/youtube.com/@handle` et extrait `channelId` via 4 patterns · cache persistant dans `data/youtube-cache.json` (TTL 90j, les channelId ne changent jamais)
- **Fetch RSS Atom** par chaîne · parse entries (videoId, title, published, description, stars, views) sans dépendance XML
- **Filtre signal** strict · liste `YT_SIGNAL_KEYWORDS` (35+ keywords IA/business/workflow) vérifiée dans `title + description` — sinon la vidéo est skippée. Crucial : Silicon Carne et Vision IA publient aussi du contenu lifestyle qui aurait pollué le backlog
- **Filtre fraîcheur** · vidéos < 45 jours uniquement
- **Boost chaîne** · multiplicateur 1.10-1.15 pour les chaînes-phares (Silicon Carne, IA et Stratégie, Vision IA, Underscore_) · appliqué après multiplicateur cluster
- Label source amélioré · `YouTube · Melvynx` au lieu de `www.youtube.com`

### Résultat mesuré (run 2026-04-21 14:42)
- 16/16 chaînes résolues · cache sauvé
- **84 items YouTube collectés** sur 476 total (+18%)
- **9 nouvelles idées** ajoutées au backlog · dont **5 depuis YouTube** (55%)
- Top 10 désormais dominé par YouTube FR :
  - `[9.6]` TUTO / COURS Skills : tout comprendre sur les skills avec Claude Code (Melvynx)
  - `[9.2]` Ça change tout : OpenClaw ne va plus supporter tes tokens Claude Code
  - `[8.9]` Apprends en quelques minutes à Claude Skills comment tu travailles
  - `[8.4]` Claude code change tout pour les créateurs de contenu
  - `[8.1]` Claude Code remplace Lovable pour $20 / mois

### Fichiers touchés
- `scripts/youtube-channels.js` · nouveau · 16 handles + 35 signal keywords
- `scripts/brainstorm.js` · fonctions `resolveChannelId`, `fetchYouTube`, `loadYtCache`, `saveYtCache`, intégration dans `main()`, propagation `channel_boost` à travers cluster+score final
- `data/youtube-cache.json` · créé automatiquement au 1er run

### À venir
- [ ] X (Twitter) — plan léger (paste-URL manuel) ou plan stack (RSSHub Docker) à décider
- [ ] Ajouter compteur d'items YouTube dans le log CLI

---

## 2026-04-21 (fin de journée) · BO Niveau 3 — Pipeline + Alertes + Calendrier

### Feature 1 · Module Pipeline (idée → publication en une vue)
- Nouvel endpoint `GET /api/pipeline` · pour chaque idée du backlog + chaque article orphelin (pas en backlog), calcule les 6 étapes franchies : `proposed → chosen → drafted → audited → published → shared`
- État dérivé du filesystem (pas de stockage) : draft = `drafts/<id>.md` existe · audité = `audits/<id>/` existe · publié = `articles/<id>.html` existe · partagé = `social-drafts/<id>/` existe
- Module UI `admin/modules/pipeline/` · timeline horizontale 6 points par idée, filtres par stade, détection orphelins (articles sans entrée backlog)

### Feature 2 · Module Alertes fraîcheur
- Nouvel endpoint `GET /api/alerts` · scanne tous les articles, compare date article vs date dernier audit vs date audit précédent
- Règles de détection :
  - `no_audit` · jamais audité (warn)
  - `modified_since_audit` · mtime article > audited_at (err)
  - `stale` · audit > 14 jours (warn)
  - `score_drop` · score_core a chuté de ≥5 points vs audit précédent (err)
- Module UI `admin/modules/alerts/` · 3 cards résumé (err/warn/ok), table tri par sévérité, bouton "Re-auditer" qui copie le prompt Claude Code

### Feature 3 · Module Calendrier éditorial
- Nouveaux endpoints `GET /api/calendar`, `POST /api/calendar/slot`, `DELETE /api/calendar/slot/:id`
- Stockage JSON plat dans `data/calendar.json` (gitignored potentiellement)
- Module UI `admin/modules/calendar/` · grille 5 semaines (semaine courante + 4 à venir), 5 types de créneau (newsletter / linkedin / twitter / article / note), modal ajout/édition, **drag-drop** pour déplacer un slot, suggestions auto mardi/vendredi pour newsletter
- `api.del` ajouté dans `admin/shared/admin.js`

### Fichiers touchés
- `scripts/admin-server.js` · +5 endpoints (pipeline, alerts, calendar GET/POST/DELETE), +2 PATHS (dataDir, calendar)
- `admin/modules.json` · +3 modules enregistrés (pipeline, alerts, calendar)
- `admin/modules/pipeline/page.html` · nouveau · ~280 lignes
- `admin/modules/alerts/page.html` · nouveau · ~230 lignes
- `admin/modules/calendar/page.html` · nouveau · ~390 lignes (drag-drop inclus)
- `admin/shared/admin.js` · +fonction `api.del()`
- `data/calendar.json` · créé au premier POST, persistant

### UX workflow
- **Pipeline** : j'ouvre et je vois en 2 secondes laquelle de mes 32 idées est coincée à quelle étape
- **Alertes** : tous les 15 jours, un coup d'œil me dit lesquels des 14 articles ont besoin d'un re-audit
- **Calendrier** : je clique sur une case, je sais ce qui part quand, je drag-drop pour réorganiser

### À venir éventuellement
- [ ] Cron léger pour alerter automatiquement quand `err` apparaît (desktop notif)
- [ ] Corréler slots calendrier avec Zernio (publish planifié qui bascule en `done` automatique)
- [ ] Lignes pipeline cliquables → scroll vers la section concernée dans un drawer latéral

---

## 2026-04-21 (soir) · Backlog explainer — bouton "Explique-moi le top 10"

### Problème
Les idées brainstormées arrivent en anglais, parfois très techniques (`speckit-companion · VS Code extension for spec-driven…`, `webiny-js · Open-source, self-hosted CMS…`). Impossible pour Jérémy de trancher "je prends / pas pour moi" sans comprendre de quoi ça parle et en quoi c'est pertinent pour lui.

### Feature livrée
- **Nouveau bouton** fuchsia "✨ Explique-moi le top 10" à côté du bouton brainstorm
- **1 clic = 1 prompt Claude Code copié** (5800 char) contenant : contexte Jérémy, règles ton Leo, les 10 idées non expliquées, format d'édition strict pour `BACKLOG.md`
- Claude Code Max local reçoit le prompt, édite `BACKLOG.md` et remplit 3 champs par idée :
  - `**Résumé**` · 1 phrase FR (12 mots max, ce que c'est)
  - `**Pour toi**` · 1 phrase (pourquoi dans le cluster, quel angle possible)
  - `**Verdict**` · commence par `prendre` / `hésiter` / `passer` + raison
- **Affichage UI** : bloc coloré sous chaque carte (teal si prendre, orange si hésiter, gris si passer) avec badge verdict + 3 lignes d'explication

### Fichiers touchés
- `scripts/admin-server.js` · parser étendu (3 champs), formatEntry met à jour `BACKLOG.md`, nouvel endpoint `GET /api/backlog/explain-prompt?top=N`
- `admin/modules/backlog/page.html` · bouton + fonction `explainHTML` + CSS blocs colorés
- `BACKLOG.md` · migré (3 lignes vides `—` ajoutées à chaque entry existante)

### Workflow
1. J'ouvre la page Idées
2. Je clique "✨ Explique-moi le top 10"
3. Le prompt atterrit dans mon presse-papier
4. Je le colle dans Claude Code Max local
5. Claude édite `BACKLOG.md` (3 edits par idée × 10)
6. Je refresh la page → les 10 idées sont expliquées, je peux trancher au premier coup d'œil

### À tester
- [ ] Lancer le prompt sur le top 10 actuel et vérifier que Claude respecte bien le format `**prendre|hésiter|passer** — raison`
- [ ] Que le ton Leo tient (pas de "kif", "taf", "mec")

---

## 2026-04-21 · Back-office V2 — architecture modules + sidebar FIESTA

### Refonte complète
- **Nouvelle archi modules** : chaque page est un dossier `admin/modules/<id>/page.html` autonome, enregistré dans `admin/modules.json`. Ajouter un module = créer 1 dossier, pas de refactor.
- **Sidebar fixe sombre** (inspiration #REF d'Oussama Ammar) + **triple-stripe vertical Fiesta** (signature identité) + accents fuchsia/teal/orange (pas de jaune copié)
- Sections sidebar : Ma production · Mon audience · Mes réseaux · Mes stats · Système
- **Shell partagé** : `admin/shared/admin.css` (800 lignes) + `admin/shared/admin.js` (render sidebar dynamique depuis `/api/modules`)
- **Serveur admin refactorisé** : loader `.env.local` natif, route `/admin/modules/<id>/` automatique, redirect `/` → dashboard
- Responsive : sidebar drawer sur mobile, topbar hamburger

### 9 modules en place
| Module | Statut | Fonction |
|---|---|---|
| **Dashboard** | Live | Stats + top 5 backlog + drafts/articles récents + carte "Comment on fonctionne" |
| **Idées (Backlog)** | Live | Tabs À trier / À écrire / Publiées / Écartées · actions Je prends/Rejeter/Demander à Claude |
| **Drafts** | Live | Liste + éditeur markdown + preview live · Sauvegarder/Publier |
| **Articles** | Live | **Table SEO** façon Oussama · colonnes Cluster · Status · Score · Mots · Date (score heuristique depuis taille) |
| **Newsletter** | Live (API-dépend) | Stats Resend/Brevo · sources de trafic · liste contacts · search · export CSV |
| **Social (Zernio)** | Stub V3 | Preview LinkedIn/X/Instagram/Threads + workflow 5 étapes expliqué |
| **Analytics** | Stub V3 | Preview Vercel Analytics + funnel visiteur→abonné |
| **Agents** | Stub V3 | 1 agent actif (Brainstorm) + 4 prévus (Social-poster, SEO-scorer, Newsletter-writer, Refresh-articles) |
| **Réglages** | Stub V3 | Doc des variables env (Resend, Brevo, Zernio, Vercel, Anthropic) |

### API ajoutées
- `GET /api/modules` → registre modules depuis `modules.json`
- `GET /api/newsletter/stats` → total/new7d/new30d/unsub depuis Resend ou Brevo (priorité Brevo si les deux clés présentes)
- `GET /api/newsletter/contacts` → liste contacts avec source/firstName/createdAt
- Loader `.env.local` natif (plus besoin de dotenv)

### Décisions tranchées post-recherche
- **Brevo > Resend** pour CRM (contacts illimités free, rate limits 50-200× plus généreux, API contacts plus riche, multicanal SMS/WhatsApp)
- **Zernio** validé pour V3 social (API first-class pour devs/agents, 15 canaux, plan Build 16 $/mois suffit)
- Resend gardé pour l'instant (migration Brevo documentée en Réglages, à faire en V2c)

### Fichiers supprimés
- `admin/backlog.html`, `admin/drafts.html`, `admin/articles.html`, `admin/admin.css`, `admin/admin.js` (remplacés par l'arbo modules)

### Ton Leo appliqué partout
- Toutes les pages : kickers chaleureux, sous-titres explicatifs, pageNote rappel contextuel, empty states bienveillants, toasts "Ça a coincé" vs "Erreur"
- Dashboard : carte "Comment on fonctionne ensemble" à relire à chaque session, 5 étapes colorées

---

## 2026-04-21 · Back-office admin local (V1)

### Ajouté
- **`scripts/admin-server.js`** — serveur HTTP Node natif (0 dep nouvelle, port 3001)
  - Sert les fichiers statiques `admin/*` + `assets/*`
  - API REST : stats · backlog · drafts · articles · publish · brainstorm
  - Redirect `/` → `/admin/` pour que les chemins relatifs marchent
  - Lance les scripts existants via `child_process.spawn` (brainstorm.js, publish.js)
- **`admin/`** — 4 pages HTML + CSS + JS (charte FIESTA complète en dual-theme) :
  - `index.html` · Dashboard avec 4 stat cards + top 5 backlog + drafts récents + articles récents + placeholder Social
  - `backlog.html` · Tabs Proposées/Choisies/Publiées/Rejetées + cards scorables + actions choose/reject/write/back
  - `drafts.html` · Liste cards + éditeur MD textarea + preview HTML live (debounced)
  - `articles.html` · Liste des 13 articles publiés avec métadonnées
- **`admin.css`** · complément ciblé pour l'admin (stat-cards, idea-cards, tabs, editor, toast, loader)
- **`admin.js`** · helpers partagés (theme toggle, fetch api wrapper, toasts, fmtDate/fmtRelative, nextWeekday)
- **`npm run admin`** dans package.json

### Workflow complet opérationnel
```
1. npm run admin        → ouvre http://localhost:3001
2. Dashboard            → vue globale + bouton Brainstorm
3. Clic Brainstorm      → lance brainstorm.js, BACKLOG.md mis à jour
4. Backlog              → clic "Choisir" sur une idée → status=chosen
5. Clic "Claude Code →" → copie prompt dans presse-papier
6. (Claude Code écrit drafts/xxx.md en local)
7. Drafts               → éditeur MD + preview + bouton Publier
8. Publier              → génère articles/xxx.html + MAJ sitemap
9. git commit + push    → Vercel redéploie
```

### Test en réel validé
- Dashboard : 4 stat cards (13 articles · 1 draft · 10 backlog · 28 avr.) · top 5 backlog · articles récents ✓
- Backlog : 10 idées affichées avec scores · actions fonctionnelles ✓
- Drafts : 1 draft (demo-pipeline-publish) listé ✓
- Articles : 13 articles listés avec taille + date ✓
- Light + dark mode OK sur toutes les pages ✓
- Endpoint `/api/brainstorm` POST : relance le script et retourne l'output ✓

### Ce qui est intentionnellement pas fait (V2+)
- Auth (tournement local only)
- Social LinkedIn/Twitter : placeholder "Coming soon" visible sur le dashboard
- Édition de `index.html` / `apprendre.html` / copy home
- Git commit/push depuis l'admin
- Analytics Vercel

---

## 2026-04-21 · Phase 1.5 — Brainstorm sujets auto

### Ajouté
- **`scripts/brainstorm.js`** — fetch signaux externes + scoring règles + MAJ backlog (~380 lignes, 0 dep externe)
  - **Sources** : Reddit (5 subs), Hacker News Algolia, RSS (OpenAI + Google AI + Hugging Face + Simon Willison)
  - **Scoring 5 axes** : demande (engagement) · pertinence (keywords site) · evergreen (tuto vs news) · vécu (neutre 5, Jérémy ajuste) · gap (anti-doublon vs articles/*)
  - **Filtres** : anti-bruit Reddit (memes, shitposts, drama) · pertinence min 4 · score final min 5
  - **Top 10** inséré dans BACKLOG.md, max 30 idées en proposed
  - **Auto-rejet** après 60j sans être chosen
- **`BACKLOG.md`** — format lisible humain + parsable par script :
  - Sections : 📊 Proposées · ✏️ Choisies · ✅ Publiées · 🗑️ Rejetées
  - Par entrée : score, id, status, proposed_date, scores détaillés, angle suggéré, sources liées
- **`npm run brainstorm`** ajouté dans package.json

### Workflow éditorial complet
```
1. npm run brainstorm          → backlog auto-mis à jour (10 nouvelles idées scorées)
2. Jérémy lit BACKLOG.md       → choisit 1 sujet, passe status=chosen + angle personnel
3. "Claude Code, écris le draft pour id <xxx>"  → drafts/xxx.md
4. Jérémy relit + édite
5. npm run publish <xxx>       → articles/xxx.html + sitemap MAJ
6. git commit + push           → Vercel deploy auto
```

### Premier test en réel
- 275 items collectés (5 sources actives · Anthropic RSS 404 retiré)
- 259 clusters après déduplication (Jaccard 0.5)
- 113 clusters scorés ≥ 5.0
- Top 5 : Claude Code workflow tips · Claude Design by Anthropic · Claude Pro vs ChatGPT 30 jours · etc.
- **Filtres anti-memes fonctionnent** : "Me when Claude...", "Friends outside of tech..." correctement écartés

### MAJ AGENT_BRIEF.md
- Nouvelle **section 7** "Comment choisir le sujet d'un article" : workflow backlog → draft complet
- Règles : ne pas doublonner, prendre l'angle vécu, demander validation si vécu faible

---

## 2026-04-21 · Phase 1 pipeline agent IA (Ghostwriter)

### Ajouté
- **`AGENT_BRIEF.md`** — contrat complet entre Jérémy et l'agent rédacteur (ton Leo, exclusions, structure type, règles SEO, checklist)
- **`scripts/publish.js`** — script Node de publication (~290 lignes) :
  - Lit `drafts/<slug>.md` avec frontmatter YAML
  - Parse markdown → HTML via `marked`
  - Injecte dans `articles/_TEMPLATE.html` (hero, TL;DR, sections block, final CTA)
  - Met à jour `sitemap.xml` (ajout ou update `lastmod`)
  - Affiche le bloc card à ajouter manuellement dans `apprendre.html` si `parcours_etape` défini
- **`drafts/_TEMPLATE.md`** — template d'article markdown avec frontmatter complet et structure type
- **`drafts/demo-pipeline-publish.md`** — article de démo qui raconte le pipeline lui-même (méta)
- **`package.json`** avec deps : `marked` (parser MD), `gray-matter` (frontmatter YAML)
- Article généré : **`articles/demo-pipeline-publish.html`** (23 Ko) · 5 sections · 2 callouts · 3 usecases

### Workflow agent IA activé
```
Claude Code écrit draft → drafts/*.md
Jérémy relit/édite
npm run publish <slug>
Relecture HTML (optionnel : dev-browser)
git commit + push → Vercel redéploie auto
```

### Pourquoi Phase 1
Inspiration déclenchée par Oussama Ammar (tweet du 8 avril 2026 sur "Steve/Hermes" pilotant houseofouss.com).
Analyse : 70% storytelling Ammar / 30% automation légitime. Plan Jérémy plus ambitieux (site entier vs communauté), mais démarre L1 (assistant) pour valider le workflow avant d'automatiser.

**Phase 2 planifiée** (2-3 mois) : GitHub Actions + `anthropics/claude-code-action@v1` pour que l'agent ouvre des PRs automatiquement sur issue "idée article : X".

---

## 2026-04-21 · Refonte copy lecteur + section "Pour qui"

### Ajouté
- **Section `.whoisitfor`** (`#whoisitfor`) — nouvelle section "Tu te reconnais ?" juste après le hero avec 3 profils :
  - Profil 01 · **L'entrepreneur qui veut avancer** (teal)
  - Profil 02 · **Le pro qui n'a pas 2h par jour** (fuchsia)
  - Profil 03 · **Celui qui hésite à ouvrir ChatGPT** (orange)
  - Bloc "Ce que tu ne trouveras PAS ici" pour filtrer les mauvais profils
- **Nouveau hero 4 lignes** : "Suis l'IA. / Sans être dev. / Sans y passer / tes soirées." (impératif, centré lecteur)

### Modifié
- **Copywriting intégral** de la home, chaque section commence par la question du lecteur :
  - Hero : "Tu sens que l'IA bouge fort. Tu ne veux pas être dépassé..."
  - Apprendre : "Tu ne sais pas par où commencer ? Prends ça."
  - Newsletters : "Tu veux suivre l'IA sans y passer tes soirées ? Bonne nouvelle."
  - Freebies : "Tu n'as pas envie de t'abonner avant d'avoir vu ce que vaut la maison ?"
  - Projets : "Tu veux voir que ça marche vraiment, pas juste des promesses ?"
  - Opinions : "Tu veux savoir ce qui se cache derrière le parcours et la newsletter ?"
  - Sources : "Tu cherches du bon contenu ?"
  - Story : "Tu te demandes peut-être pourquoi je partage tout ça gratuitement."
- **Nouvel ordre logique lecteur** (11 sections) :
  ```
  Hero → Pour qui → Apprendre → Newsletters → Freebies
  → Projets (preuves) → Opinions → Sources → Mini-bio → Story → CTA
  ```
  Mini-bio redescend à la 9e position — "qui je suis" n'arrive qu'après avoir donné la valeur.
- **CTAs hero inversés** : "Voir le parcours" (primary) > "Ou la newsletter" (ghost). Apprendre devient l'action principale.
- **Nav** réorganisée : Apprendre en tête, suivi de Newsletters/Télécharger/Projets/Opinions/Sources/L'histoire.
- **6 mini-marquees** réécrits avec enchaînement narratif ("Peut-être comme toi · Peut-être pas" → "Le chemin posé · Maintenant la veille" → ...).
- **Meta SEO** : title + description recentrés sur bénéfice lecteur.

### Architecture du ton
- **Haut de page** (hero, pour qui, apprendre) : 100% centré lecteur, empathique
- **Milieu** (newsletters, freebies, projets, opinions) : équilibre "voici ce que je fais, tu peux prendre"
- **Bas** (story) : pitch "d'abord pour moi" comme garantie finale
- Pitch "pour moi" dit **une seule fois** (Story), reformulé en "Ta garantie"

---

## 2026-04-21 · Refonte storytelling + parcours dédié

### Ajouté
- **`apprendre.html`** — nouvelle page parcours structuré en 4 étapes :
  - 01 · Poser les bases (`debutant.html` + `lexique.html`)
  - 02 · Passer à Claude Code (`claude-code.html` + `loops-claude`)
  - 03 · Construire des agents (`agents-ia-guide` + `tuto-gmail` + `tuto-contrats` + `hermes-agent`)
  - 04 · Aller plus loin (`gmf` + `veille-pour-demain` + 3× Karpathy)
  - Progress bar sticky 01→04 avec auto-highlight via IntersectionObserver
  - CTA fin de parcours → `index.html#newsletters`
- **`assets/main.css`** — externalisation du CSS commun (3615 lignes), partagé entre `index.html` et `apprendre.html`
- **Section "Qui je suis"** (Mini-bio) — nouvelle section juste après le hero sur la home

### Modifié
- **`index.html`** — refonte copy + réorganisation sections selon nouveau storytelling :
  - Fil rouge **peur → machine → don** : "L'IA va vite. Moi aussi."
  - Nouvel ordre : Hero → Mini-bio → Projets → Opinions → Newsletters → Apprendre (teaser) → Freebies → Sources → Story → CTA
  - Section `#learn` allégée : 13 articles éclatés → 4 cartes d'étapes + CTA vers `apprendre.html`
  - Hero : nouveau H1 "L'IA va vite. Moi aussi." + lead recentré sur le système (veilles, agents, outils)
  - CTAs hero : "Voir la newsletter" + "Découvrir le parcours →"
  - Opinions remontées avant Newsletters (voix avant promesse)
  - Story raccourcie (6 paragraphes → 3 + highlight unique)
  - Suppression du bloc `transparency-grid` dans Newsletters (redondance avec Story)
  - 6 mini-marquees réécrits avec progression narrative cohérente
  - Nav mise à jour avec lien `apprendre.html` en tête
- **`sitemap.xml`** — ajout de `apprendre.html`, `workflows.html`, 5 articles manquants (tuto-gmail, tuto-contrats, agents-ia-guide, veille-pour-demain, better-call-vs-associe, limova-vs-claude-code)
- **Meta SEO** `index.html` + og + twitter — nouveau pitch "L'IA va vite. Moi aussi."

### Retiré
- Section `#learn` avec 13 articles inline (déplacée vers `apprendre.html`)
- 3 notes de transparence redondantes dans Newsletters
- CSS inline dans `index.html` (extrait vers `assets/main.css`)

### Ton de voix
- Un seul "Je fais tout ça d'abord pour moi" sur toute la page (vs 4 avant)
- Registre naturel mais pas familier (règle renforcée 2026-04-20 respectée)
- Pitch central préservé : "Si ça arrive jusqu'à toi, c'est parce que ça m'a servi à moi en premier"

### À faire après cette refonte
- [ ] Test navigateur : dev-browser sur light + dark mode
- [ ] Vérifier les scroll-snap et l'IntersectionObserver du progress rail sur mobile
- [ ] Valider la new audience Resend dédiée à AI Playbook (cf. CLAUDE.md TODOs)
- [ ] Rédiger l'article `veille-pour-demain.html` référencé dans étape 04

---

## 2026-04-20 · Création initiale

- Site HTML standalone créé : `index.html`, `debutant.html`, `lexique.html`, `claude-code.html`, `workflows.html`
- 13 articles dans `articles/`
- API Resend `/api/subscribe.js`
- Downloads : `CLAUDE.md` anonymisé + pack ZIP 26 skills (690 Ko)
- Design system FIESTA / 89 appliqué partout
- 55 photos optimisées + 29 avatars YouTube
