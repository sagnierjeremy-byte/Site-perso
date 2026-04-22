# Ma stack complète — Jérémy Sagnier

> 11 outils : 7 essentiels (tier 1) + 4 avancés (tier 2). Avec les commandes d'install et mon avis honnête.
> Version publiée : 2026-04-22.
> Site de référence : https://jerwis.fr/outils.html

---

## Tier 1 · Stack essentielle (7 outils)

Pour démarrer un site, une newsletter, piloter Claude. **Tout le monde devrait l'avoir.**

| # | Outil | Rôle | Prix | Lien direct |
|---|---|---|---|---|
| 1 | **Claude Code Max** | IA dans le terminal | 200 $/mois | https://claude.com/download |
| 2 | **dev-browser** | Navigateur piloté par l'IA | Gratuit | via npm (voir §2) |
| 3 | **Vercel** | Hébergement + déploiement | Gratuit (Hobby) | https://vercel.com |
| 4 | **Resend** | Envoi d'emails / newsletter | Gratuit < 3k/mois | https://resend.com |
| 5 | **n8n** | Workflows no-code | Gratuit (self-host) · 20 $/mois (cloud) | https://n8n.io |
| 6 | **Ghostty** | Terminal Mac | Gratuit | https://ghostty.org |
| 7 | **Supabase** | Base de données + auth | Gratuit < 500 Mo | https://supabase.com |

## Tier 2 · Stack avancée (4 outils)

**Tu n'en as pas besoin tant que tu n'as pas un projet qui les justifie.**

| # | Outil | Rôle | Prix | Lien direct |
|---|---|---|---|---|
| 8 | **Sanity** | CMS headless (contenu structuré) | Gratuit < 3 users | https://sanity.io |
| 9 | **Zernio** | Planificateur de posts sociaux | 20-50 €/mois | https://zernio.com |
| 10 | **fal.ai** | API IA images/vidéos | Pay-as-you-go | https://fal.ai |
| 11 | **Remotion** | Vidéos programmatiques (code → mp4) | Gratuit (solo) | https://remotion.dev |

Détails complets, pourquoi je les ai choisis, alternatives que j'ai écartées : https://jerwis.fr/outils.html

---

## 1 — Claude Code Max

**Ce que c'est** : Anthropic dans ton terminal. Il lit tes fichiers, écrit du code, lance des commandes, corrige ses erreurs.

**Install** :
1. Va sur https://claude.com/download
2. Télécharge l'app pour Mac ou Windows
3. Connecte ton compte Anthropic (plan Max à 200 $/mois recommandé pour usage intensif)

**Post-install recommandée** : installe mes 6 plugins officiels (voir fin de ce document).

---

## 2 — dev-browser

**Ce que c'est** : un navigateur sans fenêtre que Claude pilote en écrivant un petit script. Scraping, tests de pages, screenshots, formulaires automatiques.

**Install** :
Ouvre Claude Code dans n'importe quel dossier et tape :

```
installe dev-browser pour moi
```

Claude te donnera la commande exacte (généralement `npm install -g @anthropic-ai/dev-browser`). Pré-requis : Node.js installé (`node --version` doit répondre).

**Test** : demande à Claude « va sur jerwis.fr et dis-moi le titre de la page ». Si ça marche, tu es équipé.

**Article complet** : https://jerwis.fr/articles/dev-browser.html

---

## 3 — Vercel

**Ce que c'est** : hébergement serverless + déploiement auto depuis GitHub. Mon site entier tourne dessus gratuitement.

**Install** :
1. Compte sur https://vercel.com (gratuit, 30 secondes)
2. Connecte ton compte GitHub
3. Clique « Import Project » → sélectionne ton repo
4. Vercel détecte la techno, build, déploie

Tu peux aussi installer la CLI Vercel localement :

```bash
npm install -g vercel
vercel login
```

Ensuite, `vercel` dans n'importe quel dossier déploie un preview.

---

## 4 — Resend

**Ce que c'est** : API d'envoi d'emails orientée dev. 3 000 emails gratuits / mois. Parfait pour newsletters et transactionnels.

**Install** :
1. Compte sur https://resend.com
2. Vérifie ton domaine d'envoi (ajoute les DNS fournis)
3. Crée une clé API dans le dashboard
4. Ajoute la clé dans `.env.local` de ton projet

```env
RESEND_API_KEY=re_...
```

5. Demande à Claude « écris un endpoint d'inscription newsletter avec Resend » — il te pond le code complet.

---

## 5 — n8n

**Ce que c'est** : alternative open-source à Zapier / Make. Workflows visuels pour relier des services entre eux.

**Option facile — Cloud** :
1. Compte sur https://n8n.io (plan à 20 $/mois, première semaine gratuite)
2. Tu crées des workflows via l'interface web

**Option économique — Self-host** :

```bash
# Sur un VPS (Hetzner, DigitalOcean, Railway, etc.)
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

Ou demande à Claude « installe n8n sur mon serveur avec Docker », il te tient la main.

---

## 6 — Ghostty

**Ce que c'est** : terminal moderne pour Mac. C'est dans Ghostty que je lance Claude Code chaque jour.

**Install** :
1. Télécharge sur https://ghostty.org
2. Glisse l'app dans Applications
3. Ouvre-le, utilise-le

Alternative payante avec IA intégrée : **Warp** (https://www.warp.dev, 20 $/mois).

---

## 7 — Supabase

**Ce que c'est** : base de données PostgreSQL managée + authentification + stockage de fichiers + fonctions serverless. Un seul dashboard pour tout. Parfait dès que ton site ou ton agent a besoin de retenir quelque chose.

**Install** :
1. Compte gratuit sur https://supabase.com (GitHub ou email, 20 s)
2. Crée un projet (région Europe si tu es en France)
3. Récupère l'URL + la clé API dans `Project Settings → API`
4. Ajoute-les dans ton `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
```

5. Demande à Claude « connecte ce projet à Supabase, crée une table `users` avec email et date_inscription ». Il installe la bibliothèque, écrit le SQL, te génère le code d'accès.

**Plan gratuit** : 500 Mo de base, 1 Go de stockage fichiers, 50 000 utilisateurs actifs/mois. Suffit largement pour un premier projet ou un MVP.

**Mon usage** : formulaires Eurofiscalis, leads entrants, mémoire longue des agents IA. Dès que ton projet passe de vitrine statique à application qui retient quelque chose, Supabase entre en jeu.

---

# Tier 2 · Stack avancée

**Rappel** : tu n'en as pas besoin tant que tu n'as pas un projet qui les justifie. Si tu as juste envie de tester, fais-le en bac à sable · pas dans ta stack de prod.

---

## 8 — Sanity

**Ce que c'est** : CMS headless pour gérer du contenu structuré · articles, pages, catégories, auteurs. Interface propre, API excellente, tu gardes la main sur la présentation.

**Quand l'ajouter** : quand tu dépasses ~20 articles et que tu veux une interface pour les gérer sans toucher au code. Ou si tu as du multi-langues sérieux (3+ langues).

**Démarrage** :

```bash
npm create sanity@latest
```

Crée un projet, choisis un template, Claude te guide sur le schéma. Plan gratuit tient pour 3 utilisateurs + 10 000 documents.

**Mon usage** : blog Eurofiscalis · 7 langues, 14 catégories, articles traduits via translation.metadata.

---

## 9 — Zernio

**Ce que c'est** : SaaS français de planification/publication sur LinkedIn, X, Instagram, Threads. Alternative française à Buffer ou Hootsuite.

**Quand l'ajouter** : quand tu publies régulièrement sur 2+ réseaux et que tu passes plus de 30 min/semaine à le faire à la main.

**Démarrage** : compte sur https://zernio.com, connecte tes réseaux, plan à 20 €/mois pour 2 réseaux ou 50 €/mois pour les 4. API disponible avec clé Bearer pour l'intégrer dans ton workflow.

**Mon usage** : mon back-office génère des drafts LinkedIn + X via un bouton "Social-poster", je programme ensuite dans Zernio.

---

## 10 — fal.ai

**Ce que c'est** : plateforme qui expose des dizaines de modèles IA (images, vidéos, voix, animations) derrière une API unifiée. Plus simple que d'assembler Replicate + HuggingFace à la main.

**Quand l'ajouter** : quand tu veux intégrer de la génération d'images ou vidéos IA dans un workflow automatisé. Pour un usage ponctuel, Midjourney ou ChatGPT image suffit.

**Démarrage** : compte sur https://fal.ai, 10 $ de crédits offerts. Clé API dans le dashboard. Claude Code sait appeler l'API · tu demandes, il code l'appel.

**Mon usage** : projet Leo Reels Pipeline · génération de visuels et avatars assemblés dans un pipeline automatique.

---

## 11 — Remotion

**Ce que c'est** : framework pour écrire des vidéos en code (React). Textes, images, animations, transitions · Remotion exporte en MP4.

**Quand l'ajouter** : quand tu veux industrialiser la production de vidéos courtes (reels IG, TikTok) avec 50 variantes d'un même template.

**Démarrage** :

```bash
npx create-video
```

Tu écris la vidéo en JSX, preview en local, build en MP4. Gratuit pour usage solo, payant si tu l'utilises dans un produit commercial à 3+ devs.

**Mon usage** : partie cruciale du Leo Reels Pipeline · assemble les scripts ElevenLabs + avatars Hedra + visuels fal.ai en reels prêts à publier.

---

## Bonus — Mes 6 plugins Claude Code

Une fois Claude Code installé, ajoute mes 6 plugins officiels Anthropic pour décupler ses capacités. Lance `install-plugins.sh` (fourni dans le pack) ou colle ces 6 commandes :

```bash
claude plugin install superpowers
claude plugin install context7
claude plugin install claude-md-management
claude plugin install frontend-design
claude plugin install code-review
claude plugin install code-simplifier
```

Chaque plugin est détaillé dans https://jerwis.fr/claude-code.html#plugins

---

## Ma règle d'ajout d'outils

**N'ajoute jamais un outil à ta stack tant que tu n'as pas buté sur une limite réelle du précédent.**

90 % des entrepreneurs que je vois ont trop d'outils et pas assez de clients. L'outil vient après le besoin, jamais avant.

---

## Tu as une question ?

Réponds à ma newsletter du vendredi, elle arrive directement dans ma boîte. Je lis tout, je réponds, je peux me tromper — tes retours m'aident à corriger.

https://jerwis.fr/#newsletters
