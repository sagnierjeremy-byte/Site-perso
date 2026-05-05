# Spec · Refonte admin jerwis.fr (jerwis-admin)

> Design validé le 2026-05-05 après brainstorm. Feu vert pour rédiger le plan d'implémentation.

---

## 1. Contexte

L'admin actuel de `jerwis.fr` (`~/Projets/jeremy-sagnier-site/admin/`) est un shell vanilla (`admin/index.html` + `shared/admin.css|.js`) servi par `scripts/admin-server.js` sur `localhost:3001`, avec **14 modules** répartis en 5 sections (Production, Audience, Réseaux, Stats, Système). L'orchestration s'appuie sur `scripts/brainstorm.js` qui scrappe Reddit / HN / GitHub / RSS / YouTube et applique un scoring 5 axes × clusters (`editorial-clusters.js`).

**Problème** : Jérémy ne s'en sert plus. Le sourcing automatique remonte des sujets non pertinents (trop techniques, hors-cible). La seule donnée encore utile est le compteur d'inscrits Resend. Le reste est devenu du bruit.

**Décision** : on **supprime tout** (les 14 modules + `admin/`, `scripts/admin-server.js`, `scripts/brainstorm.js`, `scripts/editorial-clusters.js`, `scripts/youtube-channels.js` côté brainstorm) et on **fork** `~/Projets/newsletter-dashboard/` (Next.js 16 · React 19 · Tailwind 4 · Supabase · Resend) pour construire un admin dédié `jerwis-admin` avec **Jérémy aux commandes** du sourcing.

## 2. Objectifs

1. **Pilotage humain des sources** · Jérémy choisit les sources, active/désactive, ajoute/retire à la main. Pas de magie noire.
2. **Pertinence** · cible affirmée = entrepreneur curieux d'IA, mix IA + business pratique. Pas de jargon, pas de deep tech, ton Leo.
3. **Workflow linéaire complet** · Sources → Scan auto → Propositions → Curation → Rédaction → Envoi → Déclinaison réseaux. Un seul flux, pas 14 modules éparpillés.
4. **Réutilisation maximum de newsletter-dashboard** · l'outil Eurofiscalis fait déjà 90 % du job, on le porte avec adaptations.
5. **Déclinaison réseaux 1 clic** · 5 sujets × 3 réseaux (X · LinkedIn · Insta) = 15 posts générés et programmés via Zernio.

## 3. Non-objectifs

- **Pas de page Léo / mascotte interne** · l'admin est un outil sec, pas un compagnon
- **Pas d'A/B tests sujets** en V1 · on commence par publier proprement avant d'optimiser
- **Pas d'analytics fines** en V1 · Resend + Plausible (déjà branché sur le site public) suffisent
- **Pas de learnings IA loop 2** · trop tôt, pas assez de données
- **Pas de history détaillée** · les broadcasts envoyés sont visibles dans Resend
- **Pas de feedback page publique** · le CTA "réponds à l'email" reste le canal feedback
- **Pas de templates HTML multiples** · UN template propre suffit
- **Pas de scraping X / Twitter** · friction technique non compensée par la valeur (on retombe sur les YT et la presse)
- **Pas de Reddit / Hacker News / podcasts / blogs RSS génériques** · trop de bruit dev/tech, pas la cible
- **Pas de charte FIESTA dans l'admin** · l'admin est un outil interne avec son propre design (sombre, dense, pro). Le site public garde sa charte.

## 4. Architecture système

```
┌─────────────────────────────────────────────────────────────────┐
│  Repo : ~/Projets/jerwis-admin/  (GitHub dédié)                  │
│  Stack : Next.js 16 · React 19 · Tailwind 4 · TypeScript        │
│  Déploiement : Vercel projet séparé · admin.jerwis.fr           │
│  DB : nouveau projet Supabase dédié (eu-west-3)                 │
│  Auth : middleware mot de passe basique (cookie httpOnly 7j)    │
└────────┬────────────────────────────────────────────────────────┘
         │
         │ lit / écrit
         │
┌────────▼────────────────────────────┐    ┌───────────────────────┐
│  Supabase tables                    │    │  APIs externes        │
│  - sources (yt / press / gnews)     │    │  - Resend (broadcasts │
│  - source_runs (logs scan)          │◄───┤    + audience UUID    │
│  - items (articles / vidéos brutes) │    │    AI Playbook réutil)│
│  - proposals (top scoré, curé)      │    │  - Anthropic (Claude  │
│  - newsletters (drafts → envoyés)   │    │    Sonnet rédaction · │
│  - social_posts (15/sem · 3 réseaux)│    │    Haiku scoring)     │
│  - settings (clés API, mdp admin)   │    │  - Zernio (program-   │
└─────────────────────────────────────┘    │    mation 3 réseaux)  │
                                           └───────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Crons Vercel                                                     │
│  - /api/cron/veille (toutes les 6h)                              │
│      → scrape sources actives → dédup → scoring → upsert items   │
│  - /api/cron/send-scheduled (toutes les heures)                  │
│      → envoie les newsletters programmées dont l'heure est passée│
└──────────────────────────────────────────────────────────────────┘
```

## 5. Pipeline éditorial cible

```
┌────────────┐    ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ 1. Sources │───►│ 2. Scan auto│───►│ 3. Propositi-│───►│ 4. Curation  │
│  (Jérémy   │    │ (cron veille│    │    ons       │    │  manuelle    │
│   pilote)  │    │  + scoring) │    │ (top dédupé) │    │ (Jérémy coche│
└────────────┘    └─────────────┘    └──────────────┘    │   5 sujets)  │
                                                          └───────┬──────┘
                                                                  │
┌─────────────────┐    ┌────────────────┐    ┌────────────────┐  │
│ 7. Programmation│◄───│ 6. Envoi       │◄───│ 5. Rédaction   │◄─┘
│   réseaux       │    │   newsletter   │    │   ton Leo      │
│   (Zernio · 15  │    │   (Resend ·    │    │   (Claude      │
│    posts auto)  │    │    vendredi 9h)│    │    Sonnet)     │
└─────────────────┘    └────────────────┘    └────────────────┘
```

## 6. Sources

### Stratégie

L'admin part de la **liste existante** déjà triée par Jérémy (34 chaînes YouTube + médias presse définis ci-dessous + queries Google News). Tout est éditable depuis la page `/sources` (cases à cocher actif/inactif, suppression, ajout).

### Liste exhaustive V1

#### YouTube (34 chaînes existantes)

Reprises de `~/Projets/jeremy-sagnier-site/scripts/youtube-channels.js` :
- IA & Tech (7) : Silicon Carne, IA et Stratégie, Vision IA, Underscore_, Melvynx, Grand Angle, Grand Angle Nova
- Business & Entrepreneuriat (12) : Alex Hormozi, Leila Hormozi, GaryVee, Iman Gadzhi, Grant Cardone, LEGEND, Oussama Ammar, Hasheur, Le Déclic par Alec Henry, Antoine Blanco, Yomi Denzel, TheiCollection
- Finance & Marchés (3) : Finary, Interactiv Trading, Thami Kabbaj
- Actu & Géopolitique (6) : 7 jours sur Terre, C dans l'air, Géopolitis, HugoDécrypte, Brut, Chaque Jour sur Terre
- Lifestyle & Inspiration (6) : Naj B Fit, Taylor Chiche, Margo Cunego, MrBeast, Sous Tension, Romain Lanéry

Ingestion : RSS Atom (`https://www.youtube.com/feeds/videos.xml?channel_id=...`).

#### Presse FR (6 médias)

| Média | RSS | Paywall | Note |
|---|---|---|---|
| Les Echos | `https://www.lesechos.fr/rss/rss_la_une.xml` | Partiel (titre + chapô) | Business / éco |
| Le Monde | `https://www.lemonde.fr/rss/une.xml` | Partiel | Sociétal IA |
| L'Usine Digitale | `https://www.usine-digitale.fr/rss` | Gratuit | IA business FR |
| Maddyness | `https://www.maddyness.com/feed/` | Gratuit | Startup FR |
| Numerama | `https://www.numerama.com/feed/` | Gratuit | Vulgarisation tech |
| Korben | `https://korben.info/feed` | Gratuit | Vulgarisation tech |

#### Presse EN (1 média optionnel)

| Média | RSS | Note |
|---|---|---|
| Sifted | `https://sifted.eu/feed` | Startup Europe (à évaluer après 1 mois, vire si bruit) |

#### Google News (8 queries FR)

Format URL : `https://news.google.com/rss/search?q={query}&hl=fr&gl=FR&ceid=FR:fr`

| # | Query | Angle |
|---|---|---|
| 1 | `"intelligence artificielle" entreprise` | Adoption IA en boîte |
| 2 | `"IA générative" PME` | Cas d'usage petites entreprises |
| 3 | `"outils IA" productivité` | Outils concrets |
| 4 | `entrepreneur IA France` | Cas d'usage tricolore |
| 5 | `automatisation "no-code"` | Public non-dev |
| 6 | `"IA" travail emploi métier` | Impact social/pro |
| 7 | `startup IA France levée` | Écosystème local |
| 8 | `OpenAI Anthropic Mistral lancement` | Actu labs |

### Dédup

- Clé : URL canonique (suppression UTM, fragments, redirections)
- Window : 30 jours
- Logique portée depuis `lib/veille.ts` de newsletter-dashboard

### Scoring

Modèle : Claude Haiku scoring 0-100 sur 3 axes :
1. **Pertinence cible** (entrepreneur curieux IA) — pondération 50 %
2. **Accessibilité** (pas trop technique, pas de jargon) — pondération 30 %
3. **Fraîcheur** (date publication < 7j) — pondération 20 %

Items < 40 sont écartés du top. Top 30 affiché dans `/inspiration`.

## 7. Newsletter

### Identité

| Champ | Valeur |
|---|---|
| Nom | **Vendredi 9h** |
| Cadence | 1×/semaine · vendredi 9h |
| Durée lecture | ~8 min |
| Audience Resend | Réutilisation de l'audience AI Playbook existante (`RESEND_AUDIENCE_ID` dans env du site actuel) |
| Sender | Réutilise `DEFAULT_SENDER` actuel jerwis.fr |

### Format type

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│   Logo Jerwis + numéro édition + date                      │
├─────────────────────────────────────────────────────────────┤
│ ÉDITO (3-5 lignes · ton Leo · 1ère personne)                │
│   "Cette semaine j'ai vu passer X / je suis tombé sur Y..." │
├─────────────────────────────────────────────────────────────┤
│ 5 SUJETS CURÉS (chacun = 80-120 mots)                      │
│   Sujet 1 · Titre clair                                    │
│     Pourquoi je le partage (1-2 lignes)                    │
│     [Lire] → lien source                                   │
│   ... × 5                                                   │
├─────────────────────────────────────────────────────────────┤
│ 🛠️ L'OUTIL QUE J'AI TESTÉ CETTE SEMAINE (100-150 mots)     │
│   Outil / méthode / prompt / agent                         │
│   Pourquoi ça t'intéresse                                  │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
│   "Réponds à l'email, je lis tout."                        │
│   [Désinscription]                                          │
└─────────────────────────────────────────────────────────────┘
```

### Ton Leo (règles dures)

Copiées depuis `~/Projets/jeremy-sagnier-site/CLAUDE.md` :

- 1ère personne directe, chaleureux, pas familier
- Hyper transparent (assumer l'IA, désinscription 1 clic)
- Simple, pas de jargon
- Montrer le travail (chiffres, sources, processus)
- Assumer les limites
- Appel à réponse à chaque édition
- Pitch central UNE seule fois maximum, pas dans chaque édition

À bannir : "kif", "taf", "mec", "ouais", "y'a", "ça sert pas", argot oral. À utiliser : naturel d'un dimanche soir, pas naturel du bar.

### Génération

`lib/newsletter-writer.ts` (porté de newsletter-dashboard, prompt adapté). Modèle : Claude Sonnet (qualité rédactionnelle critique). Temperature : 0.7. Cache : prompt caching activé sur les règles ton Leo (gros bloc statique).

## 8. Déclinaison réseaux sociaux

### Volume

5 sujets × 3 réseaux = **15 posts** générés par newsletter, programmables en 1 clic via Zernio.

### Format par réseau

| Réseau | Format · longueur | Spécificités |
|---|---|---|
| **X / Twitter** | 1 tweet par sujet (≤ 280 chars) ou thread 5 tweets si pertinent | Hook fort + lien source · pas de hashtag spam (max 1) |
| **LinkedIn** | 1 post par sujet (~200-400 mots, ton Leo) | Hook ligne 1 + insight + question fin · pas de bullet emoji-spam |
| **Instagram** | 1 post simple par sujet (image + caption ton Leo) | Police FIESTA cohérente charte site (Archivo Black + JetBrains Mono) · couleurs teal/fuchsia/orange en accent · 5 posts programmés sur la semaine |

### Programmation

API Zernio (mêmes credentials que newsletter-dashboard). 1 bouton "Programmer cette semaine" depuis `/social` qui crée les 15 entrées dans Zernio aux jours/heures configurés dans `/settings` (ex: thread X dimanche 18h, posts LinkedIn lun-ven 8h, carrousel Insta mardi 19h).

### Génération

`lib/social-writer.ts` (à créer, n'existe pas dans newsletter-dashboard). Reprend les 5 sujets validés, déclinaison par réseau via Claude Sonnet. Cache prompt sur règles de format.

## 9. Auth

### Mécanisme

- 1 page `/login` (formulaire mot de passe)
- 1 middleware `middleware.ts` qui check le cookie `jerwis_admin_session` sur toutes les routes sauf `/login`, `/api/cron/*`, `/api/health`
- Vérification : `cookie === hash(ADMIN_PASSWORD + ADMIN_SECRET)` (pas le password brut en cookie)
- Cookie httpOnly · Secure · SameSite=Strict · expire 7 jours
- Logout = clear cookie + redirect `/login`

### Variables d'env

```
ADMIN_PASSWORD=...        # mot de passe Jérémy (rotable via Vercel UI)
ADMIN_SECRET=...          # secret pour hash cookie (random 32 bytes)
```

### Crons

Les crons Vercel (`/api/cron/*`) sont protégés par `Authorization: Bearer ${CRON_SECRET}` en plus du middleware (Vercel Cron envoie ce header automatiquement). Pas d'auth user sur les crons.

## 10. Scope MVP — 8 pages

| # | Route | Rôle | Source dans newsletter-dashboard |
|---|---|---|---|
| 1 | `/` (Dashboard) | Compteur inscrits Resend + dernière newsletter envoyée + bouton "lancer la veille" + nb propositions en attente | `page.tsx` adapté |
| 2 | `/sources` | Liste éditable des sources (YT + presse + Google News). Toggle actif/inactif, ajout, retrait, test scan source | Nouveau (s'inspirer `segments/`) |
| 3 | `/inspiration` | Top 30 items remontés par les agents, scorés, dédupés. Filtres (source, score min, date). Cases à cocher → marquer 5 sujets curés | `inspiration/` |
| 4 | `/generate` | À partir des 5 sujets cochés : génération newsletter ton Leo (édito + 5 sujets + outil testé). Édition inline du draft | `generate/` |
| 5 | `/newsletters` | Liste broadcasts (draft / programmé / envoyé). Programmer ou envoyer maintenant | `newsletters/` |
| 6 | `/audience` | Inscrits Resend (compteur + liste paginée). Désinscriptions. Pas de segments en V1 | `audiences/` simplifié |
| 7 | `/social` | Pour la newsletter sélectionnée : 15 posts générés (5 × 3 réseaux), édition inline, bouton "Programmer dans Zernio" | Nouveau (n'existe pas dans newsletter-dashboard) |
| 8 | `/settings` | Clés API (Anthropic, Resend, Zernio, Supabase service role), `ADMIN_PASSWORD`, audience UUID, planning Zernio (jours/heures par réseau) | `settings/` |

### Reporté V2 (pas dans le MVP)

- A/B tests sujets · `ab-tests/`
- Analytics performance détaillée · `analytics/`
- Learnings auto · `learnings/`
- History par segment · `history/`
- Feedback page publique · `feedback/`
- Templates HTML multiples · `templates/`
- Page Leo / mascotte interne · `leo/`
- Inscription page publique sur le site (l'inscription continue via les forms Resend du site jerwis.fr existant)

## 11. Schéma DB Supabase (V1)

```sql
-- Sources actives et pilotables par Jérémy
create table sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('youtube', 'rss', 'gnews')),
  name text not null,                       -- "Silicon Carne" / "Les Echos" / "IA générative PME"
  url text not null,                        -- RSS feed ou URL Google News query
  category text,                            -- "ia_tech" / "business" / etc. (optionnel)
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_scanned_at timestamptz,
  last_error text
);

-- Items bruts scrappés (avant scoring)
create table items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  url_canonical text not null,              -- URL nettoyée (UTM stripped) pour dédup
  title text not null,
  excerpt text,
  published_at timestamptz,
  scraped_at timestamptz not null default now(),
  -- Scoring
  score int,                                -- 0-100
  score_reasoning text,                     -- explication Claude Haiku
  -- Curation
  status text not null default 'pending'    -- pending / kept / dismissed / used
    check (status in ('pending', 'kept', 'dismissed', 'used')),
  unique (url_canonical)                    -- dédup
);

-- Newsletters (drafts → envoyés)
create table newsletters (
  id uuid primary key default gen_random_uuid(),
  edition_number int not null,              -- #001, #002...
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  resend_broadcast_id text,
  subject text,
  edito text,                               -- 3-5 lignes ton Leo
  curated_item_ids uuid[],                  -- 5 items cochés
  outil_section text,                       -- bonus "outil testé"
  html_body text,
  text_body text,
  created_at timestamptz not null default now()
);

-- Posts sociaux (15 par newsletter)
create table social_posts (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid not null references newsletters(id) on delete cascade,
  item_id uuid references items(id),        -- null si post de synthèse (thread X par ex)
  platform text not null check (platform in ('x', 'linkedin', 'instagram')),
  content text not null,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at timestamptz,
  zernio_post_id text,
  created_at timestamptz not null default now()
);

-- Logs scans (debug + observabilité)
create table source_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  items_found int,
  items_new int,
  error text
);

-- Settings (clé/valeur pour planning Zernio, etc.)
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
```

RLS désactivée (admin solo, accès via service role uniquement côté serveur).

## 12. Plan de migration

1. **Nouveau repo** · `~/Projets/jerwis-admin/` créé en clonant + repackageant `~/Projets/newsletter-dashboard/` avec rebranding (nom, README, package.json, env vars).
2. **Nouveau projet Supabase** · `jerwis-admin-prod` (eu-west-3), schéma ci-dessus appliqué via migration SQL.
3. **Nouveau projet Vercel** · `jerwis-admin`, lié au repo, env vars configurées.
4. **DNS** · `admin.jerwis.fr` CNAME vers Vercel (Hostinger) + ajout du domaine dans le projet Vercel.
5. **Audience Resend** · réutilisation de l'audience AI Playbook existante (UUID copié depuis `~/Projets/jeremy-sagnier-site` env Vercel).
6. **Crons Vercel** · `vercel.json` avec `/api/cron/veille` (toutes les 6h) + `/api/cron/send-scheduled` (toutes les heures).
7. **Suppression admin actuel** · une fois le nouvel admin opérationnel (et UNIQUEMENT après) : suppression de `~/Projets/jeremy-sagnier-site/admin/`, `scripts/admin-server.js`, `scripts/brainstorm.js`, `scripts/editorial-clusters.js`, `scripts/youtube-channels.js`, `data/youtube-cache.json`, `BACKLOG.md`. CHANGELOG mis à jour.

## 13. Open questions (à trancher en planif ou à l'implémentation)

| # | Question | Quand trancher |
|---|---|---|
| 1 | **Sifted (EN)** : on garde après 1 mois ou on vire si bruit ? | Après 1 mois |
| 2 | **Workflow brainstorm (`scripts/brainstorm.js`) du site** : on garde tant que l'admin actuel tourne en parallèle, ou on coupe direct ? | Avant suppression admin actuel |
| 3 | **Logo / identité Jerwis admin** : on reprend l'identité jerwis.fr ou on crée une mini-identité interne (logo monochrome, fond `#0d1a1b`) ? | Phase implémentation UI |

## 14. Risks & mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Sources presse changent leur RSS | Scan plante silencieusement | `source_runs.error` loggé + alerte Telegram (réutiliser pattern newsletter-dashboard `lib/veille.ts`) |
| Quota Anthropic explose (scoring × N items × 6h) | Facture salée | Limite 100 items scorés par run, modèle Haiku (cheap), prompt caching agressif |
| Zernio API down au moment du clic | 15 posts perdus | Retry 3× avec backoff · status `failed` visible dans `/social` · refaire à la main si besoin |
| Mot de passe admin compromis | Accès complet à l'admin | Rotation rapide via env Vercel + `ADMIN_SECRET` invalide tous les cookies |
| Nouvelle audience Resend = perte des inscrits | Newsletter envoyée à 0 personne | Réutilisation de l'audience AI Playbook existante (Q5 §13) |
| Charge cron `/api/cron/veille` trop longue (timeout Vercel 60s sur Hobby, 300s sur Pro) | Scan partiel | Découper en queue : 1 cron toutes les 30 min qui traite N sources max par run · OU passer Vercel Pro si volume nécessaire |

## 15. Définition de "fait" (V1 livrée)

- [ ] Repo `~/Projets/jerwis-admin/` créé, lié à GitHub, déployé sur `admin.jerwis.fr` (mot de passe protégé)
- [ ] Supabase dédié provisionné, schéma appliqué
- [ ] 8 pages MVP fonctionnelles : Dashboard · Sources · Inspiration · Generate · Newsletters · Audience · Social · Settings
- [ ] Cron `/api/cron/veille` tourne toutes les 6h, scrape les 34 YT + 6 médias FR + 8 queries Google News + Sifted, scoring Haiku, dédup
- [ ] Première newsletter générée, validée, envoyée vendredi 9h via Resend
- [ ] 15 posts sociaux générés, programmés via Zernio (vérifiés visibles dans Zernio)
- [ ] CHANGELOG `~/Projets/jeremy-sagnier-site/CHANGELOG.md` + `PROJECT_NOTES.md` mis à jour
- [ ] Admin actuel `~/Projets/jeremy-sagnier-site/admin/` + scripts brainstorm supprimés, vérifié que le site public ne référence plus rien de cassé
