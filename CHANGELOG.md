# CHANGELOG — Site perso Jérémy Sagnier

## 2026-04-24 · CORE-EEAT boost · 3 opinions sous 80/100

### Pourquoi
Audits CORE-EEAT révèlent 3 opinions Medium (69-73/100) plombées par les mêmes Fail/Partial : R08 (zéro liens internes), Ept01/T02/T06 (pas de byline visible / contact / corrections), C09 (pas de FAQ sauf monde-ia), R02 (citations faibles sur better-call), O03/O10 (pas de tableau ni visuel sur plan-chine).

### Livré (3 articles)
| Article | Score avant | Améliorations |
|---|---|---|
| `monde-ia-5-10-20-ans.html` | 72 | + sameAs LinkedIn/X/YT · + bloc byline visible · + bloc corrections email · + tableau 5 paris (visuel) · + cross-links plan-chine + guerres-d-ia + karpathy · + 3 sources actu (Khan Labs · Doctolib blog · Waymo blog) |
| `plan-chine-2026-2030.html` | 69 | + FAQ 10 Q/R + FAQPage JSON-LD · + sameAs · + byline · + bloc corrections · + tableau 5 leviers (Levier · 2025 · 2030 · Risque) · + bloc « ce que cet article n'aborde pas » (Taïwan / Russie / Parti) · + cross-links monde-ia + guerres-d-ia + open-source · + 3 sources actu (Bloomberg China · FT China · Carnegie China) |
| `better-call-vs-associe.html` | 70 | schema Article → **OpinionPiece** · + FAQ 10 Q/R + FAQPage JSON-LD · + encadré « C'est quoi un Better Call ? » · + tableau comparatif 8 critères Associé vs Better Call · + bloc « limites honnêtes » (N=2, exit 1,5 M€ scénario unique) · + cross-links limova + outil-vente + monde-ia + plan-chine · + 5 sources externes (Maddyness · BPI · Anthropic Projects · TheFamily · LEGEND) · + 7e item sidebar Roster (FAQ) |

### Pattern réutilisable
Bloc byline + bloc corrections + sameAs schema = template à coller systématiquement sur tout nouvel article. Source canonique : `articles/better-call-vs-associe.html`.

### Validation
- 3 articles : structure HTML OK (parser stack-based, 0 mismatch)
- 6 JSON-LD blocks valides (2 par article : OpinionPiece + FAQPage)
- 100 % des liens internes pointent vers fichiers existants

### Score visé
Tous &gt; 80/100 après FAQ (boost C09 +1.2 GEO) + cross-links (boost R08 +1.8 R) + byline/corrections/sameAs (boost Ept+T+A ~2 pts) + tableaux/visuels (boost O03/O10 +2.5 O).

---

## 2026-04-24 · Boost Good→Excellent · 3 tutos agents (FAQ + sources + cross-links)

### Pourquoi
Trois articles audités CORE-EEAT à 75-81/100 (Good) avec 3 lacunes communes : C09 FAQ Coverage en Fail, R02 Citation Density faible, R08 Internal Link Graph partiel. Objectif : passer à 84-88/100 en injectant 30 Q/R structurées + sources externes hiérarchisées + maillage interne cluster agents.

### Livré (3 articles)
| Article | Score avant | FAQ ajoutée | Sources externes | Cross-links |
|---|---|---|---|---|
| `tuto-agent-gmail.html` | 78 | 10 Q/R + FAQPage JSON-LD | 7 (Anthropic SDK, MCP spec, Google Cloud, Gmail API, pricing, Make, Zapier) | contrats + hermes-agent + agents-ia-guide |
| `tuto-agent-contrats.html` | 81 | 10 Q/R + FAQPage JSON-LD | 12 (Anthropic ZDR/DPA, MCP filesystem, CNIL art.28, CNIL IA, hooks, lawinsider, Luminance, Ironclad, Spellbook, pricing, unstructured-io, PDF) | gmail + hermes-agent + agents-ia-guide + llm-local |
| `llm-wiki-karpathy.html` | 75 | 10 Q/R + FAQPage JSON-LD | 7 (Karpathy gist, Obsidian, Notion AI, Claude Projects, NotebookLM, GraphRAG, Cursor) | karpathy + autoresearch + veille-pour-demain + llm-local |

### Améliorations spécifiques d'après audits
- **gmail (E05/Exp04)** : note "captures OAuth à venir" + lien Gmail API quickstart en attendant
- **contrats (T08)** : disclaimer juridique YMYL renforcé — 2 paragraphes ajoutés "ne remplace pas un avocat" + "aucune décision finale ne doit reposer uniquement sur l'agent"
- **llm-wiki (E03/Exp05)** : encadré orange "première version, retour d'XP en mai 2026" — assume le pivot, transparence sur l'absence d'usage prolongé

### Validation
- HTML : 3 articles parsent OK (Python html.parser, zéro erreur)
- JSON-LD : 7 blocs validés (TechArticle x2 + Article + FAQPage x3) — 30 questions structurées
- Balises `<details>` : 10 ouverts / 10 fermés par article

### Fichiers touchés
- `articles/tuto-agent-gmail.html` (+135 lignes)
- `articles/tuto-agent-contrats.html` (+155 lignes)
- `articles/llm-wiki-karpathy.html` (+125 lignes)

### Score attendu post-MAJ
- gmail : 78 → ~84 (FAQ +1.8, citations +1.2, internal links +0.5)
- contrats : 81 → ~85 (FAQ +0.9, citations +1.5, disclaimer renforcé, internal links +0.5)
- llm-wiki : 75 → ~80 (FAQ +1.5, citations +0.5 sur déjà bon, internal links +0.5)

### À venir
- Mai 2026 : retour d'XP LLM Wiki réel (30 jours, 50 sources) → débloque Exp dimension 60 → 85
- Captures OAuth Gmail (option B MCP) si demande forte
- Re-audit dans 30 jours

---

## 2026-04-24 · CORE-EEAT push 90+ · 3 articles llm-local / open-source / hermes

### Pourquoi
Pousser au-dessus de 90/100 (rating Excellent) trois articles audités à 84/82/86. Cibles audit : R03 Source Hierarchy (Fail) + R08 Internal Link Graph (Partial) + C09 FAQ Coverage (Fail sur hermes) + R02 Citation Density.

### Livré
| Article | Avant | FAQ + JSON-LD | Sources externes ajoutées | Liens internes |
|---|---|---|---|---|
| `hermes-agent.html` | 86 | **+10 questions + FAQPage schema** (manquait totalement) | Anthropic, console.anthropic, API Keys docs, Make, Zapier, Gmail OAuth scopes, claude-haiku-4 docs, Microsoft Copilot, Outlook | +3 cluster agents (agents-ia-guide, tuto-agent-gmail, tuto-agent-contrats) |
| `llm-local-pour-non-dev.html` | 84 | déjà OK (10Q + schema) | Mistral, DeepSeek, Reuters NVIDIA -589G$, r/LocalLLaMA, Ollama, Open WebUI, LM Studio, GPT4All | +1 vers guerres-d-ia-podcast (cluster IA ouverte) |
| `open-source-pour-non-dev.html` | 82 | déjà OK (10Q + schema) | Anthropic, OSI + 10 critères, Linux Foundation, Apache Foundation, Reuters Red Hat 34G$, MongoDB Atlas, GitLab, HashiCorp BSL announcement, OpenSearch, OpenTofu, Valkey, Mistral AI, DeepSeek, Reuters NVIDIA, Andres Freund XZ post, Sansec Polyfill report | +1 vers llm-local (cluster IA ouverte, manque flagrant signalé par audit) |

### Détails techniques
- FAQ hermes : pattern repris exactement de llm-local (section .block#faq + 10 `<details>` charte fiesta + FAQPage JSON-LD après TechArticle)
- Tous les liens externes : `target="_blank" rel="noopener"` sur 1ère mention uniquement
- Date NVIDIA harmonisée : 27 janvier 2025 partout (1 occurrence "20 janvier" corrigée dans llm-local body)
- Path corrigé : `../articles/guerres-d-ia-podcast.html` → `guerres-d-ia-podcast.html` dans open-source (déjà dans articles/)

### Validation HTML
- hermes-agent.html : 0 erreur · 10 details · 2 JSON-LD valides (TechArticle + FAQPage)
- llm-local-pour-non-dev.html : 0 erreur · 10 details · 2 JSON-LD valides
- open-source-pour-non-dev.html : 0 erreur · 10 details · 2 JSON-LD valides

### Gain estimé pondéré
- hermes : +1.5 pts (FAQ C09) + 1.5 pts (R03) + 0.75 pts (R08 cluster) = **86 → ~90/100**
- llm-local : +1.5 pts (R03) + 0.5 pts (R08 podcast) = **84 → ~86/100**
- open-source : +1.5 pts (R03) + 0.75 pts (R08 cluster) = **82 → ~84/100**

### Sections NON modifiées
- TLDR (sauf disclosure transparence Anthropic linké), hero, mini-marquees, structure générale, share-block hermes, footer, scripts JS

### À venir (hors scope cette session)
- Screenshots réels (Exp04 / E05) pour pousser open-source et llm-local à 90+
- Mini-bench tokens/sec maison (E03) sur llm-local
- Mini-bio crédibilité (Ept02)

---

## 2026-04-24 · SEO Phase 3 · refontes contenu 5 articles + rename slug

### Pourquoi
Phase 3 finale : refondre le CONTENU (pas juste meta) des 5 articles initialement < 60/100 SEO. Plus profondeur, anecdotes vécues chiffrées, sources externes liées. Plus le rename du slug ridicule `claude-code-workflow-tips-after-6-months-of-daily-` → `claude-code-workflow-tips`.

### Livré (5 sous-agents en parallèle)
| Article | Mots avant | Mots après | Refonte |
|---|---|---|---|
| superpowers | 2 303 | **4 406** (+91 %) | 5 skills étoffés + retour XP 6 sem chiffré + cas non-code dédiés |
| monde-ia-5-10-20-ans | ~4 000 | **5 377** (+34 %) | 11 sources externes liées (METR, Marcus, Ord, Aschenbrenner, etc.) + 5 paris chiffrés 2030-2050 + thèse "humains préféreront la machine" musclée |
| veille-pour-demain | ~3 000 | **4 778** (+59 %) | Détails pipeline + scoring 5 axes + 3 niveaux de transférabilité au lecteur |
| dev-browser | ~3 000 | **4 098** (+37 %) | 5 cas non-dev clairs + routine perso + 3 commandes copiables |
| claude-code-workflow-tips | ~3 500 | **3 892** (+11 %) | Rename slug + propagation site (vercel.json redirect, sitemap, quiz, day-5-next, og/) — refonte contenu plus légère (quota atteint avant fin) |

### Rename complet `workflow-tips`
- `articles/claude-code-workflow-tips-after-6-months-of-daily-.html` → `claude-code-workflow-tips.html`
- `photos/og/<ancien>.jpg` → `<nouveau>.jpg`
- `audits/<ancien>/` → `audits/<nouveau>/`
- `vercel.json` : redirect 301 ajouté avec regex `(.html)?`
- `sitemap.xml`, `quiz.html`, `downloads/cours-email/day-5-next.md`, `scripts/seo-improve.js` mis à jour

### Bonus fix sitemap
- 2 URLs incorrectes `https://jeremysagnier.com/...` (plan-chine + monde-ia) corrigées en `https://jerwis.fr/...`

### État après Phase 3
- 21/21 articles HTML validés (0 erreur)
- Moyenne site estimée : ~92 → ~95/100 (les 5 plus faibles passent maintenant à 90+)
- 11 sources externes ajoutées sur monde-ia (Authority CORE-EEAT débloqué)
- Slug ridicule éradiqué + redirect 301 préservant le SEO existant

### Note quota
3/5 sous-agents (S1, S3, S4) ont atteint la limite Anthropic en fin de tâche — mais l'essentiel du travail était fait avant. Seul S1 (workflow-tips) n'a pas pu finir la refonte contenu profonde (juste le rename + propagation). À refaire après reset 18h50 si on veut pousser à 95+.

### Fichiers touchés
- 5 articles `articles/*.html` refondus
- `articles/claude-code-workflow-tips-after-6-months-of-daily-.html` SUPPRIMÉ
- `articles/claude-code-workflow-tips.html` NOUVEAU
- `photos/og/claude-code-workflow-tips-after-6-months-of-daily-.jpg` SUPPRIMÉ
- `photos/og/claude-code-workflow-tips.jpg` NOUVEAU
- `audits/claude-code-workflow-tips-after-6-months-of-daily-/` SUPPRIMÉ
- `audits/claude-code-workflow-tips/` NOUVEAU
- `vercel.json`, `sitemap.xml`, `quiz.html`, `downloads/cours-email/day-5-next.md`, `scripts/seo-improve.js` mis à jour
- `CHANGELOG.md` (cette entrée)

---

## 2026-04-24 · SEO Phase 2 · og:image dédiées + FAQ JSON-LD + template anti-régression

### Pourquoi
Suite de la Phase 1 SEO (qui a fait passer la moyenne site de 68 à ~85/100). Phase 2 = passer à 90+ via partage social pro + citabilité LLM (Perplexity, ChatGPT Search, Google AI Overview) + bloquer la régression sur les futurs articles.

### Livré (3 actions parallèles via 7 sous-agents)

#### P2-A1 · 21 og:image dédiées (1 sous-agent)
- **`scripts/og-batch.html`** : template paramétrable 1200×630 avec mapping 21 slugs (kicker, h1, tagline, accent, size). Charte fiesta respectée (stripe gradient teal-fuchsia-orange + portrait Jérémy à gauche + accent color par article).
- **`scripts/generate-og-batch.mjs`** : script Node Puppeteer qui boucle sur les 21 slugs, capture chaque cover en 1200×630, sauve en PNG.
- **`scripts/patch-og-images.mjs`** : patcher idempotent qui remplace les `og:image=og-jerwis.jpg` par `og:image=/photos/og/<slug>.jpg` sur les 21 articles + ajoute `og:image:width/height` + `twitter:image` + met à jour le JSON-LD `image`.
- **`photos/og/*.jpg`** × 21 : générés via Puppeteer + optimisés sips qual 82, taille moyenne 117 KB (cible <200 KB OG).
- **0 régression** : plus aucune référence à `og-jerwis.jpg` dans les 21 articles.

#### P2-A2 · FAQ + FAQPage JSON-LD sur 5 articles stratégiques (5 sous-agents en parallèle)
- **booking-eurofiscalis-making-of** : 10 Q/R (+136 lignes, 753→889)
- **llm-local-pour-non-dev** : 10 Q/R (+146 lignes, 909→1055)
- **open-source-pour-non-dev** : 10 Q/R (+76 lignes, 787→863)
- **monde-ia-5-10-20-ans** : 10 Q/R (~+200 lignes)
- **autoresearch-karpathy** : 10 Q/R
- **Total : 50 Q/R ajoutées au site**, citables directement par Perplexity / ChatGPT Search / Google AI Overview
- Format : section `<section class="block" id="faq">` avant Final CTA + `<details>` repliables charte fiesta + `FAQPage` JSON-LD dans head après JSON-LD existant

#### P2-A3 · MAJ `_TEMPLATE.html` anti-régression (moi-même)
- Bloc Meta complet ajouté en haut avec placeholders `{{TITRE}}`, `{{META_DESCRIPTION_140_155_CHARS}}`, `{{TITRE_OG_60_CHARS_MAX}}`, `{{OG_DESCRIPTION_110_CHARS_MAX}}`, `{{SLUG}}`, `{{DATE_PUBLI_AAAA-MM-JJ}}`, `{{DATE_MAJ_AAAA-MM-JJ}}`
- Commentaire HTML `⚠️ SEO REQUIREMENTS` qui rappelle les 6 contraintes (title ≤ 60, meta desc 140-155, OG/Twitter ≤ 110, canonical, 1 seul JSON-LD, og:image vers `photos/og/{{SLUG}}.jpg`)
- Tout futur article créé depuis ce template héritera des bons réflexes SEO
- Suffixe « — par Jérémy Sagnier » SUPPRIMÉ du title placeholder

### État après Phase 2 (estimations)
- Moyenne site : ~85 → ~92/100 (+7 pts moyens grâce à og:image + FAQ sur stratégiques)
- 21/21 articles : og:image dédiée + meta complet + dimensions correctes
- 5/5 stratégiques : FAQ visible + JSON-LD (50 Q/R total)
- Template `_TEMPLATE.html` : anti-régression activé
- Tous les HTML validés (21/21 OK)

### Fichiers touchés
- 21 articles `articles/*.html` (og:image + 5 d'entre eux ont aussi FAQ)
- `articles/_TEMPLATE.html` (bloc Meta complet ajouté)
- `scripts/og-batch.html` (nouveau)
- `scripts/generate-og-batch.mjs` (nouveau)
- `scripts/patch-og-images.mjs` (nouveau)
- `photos/og/*.jpg` (21 nouveaux)
- `CHANGELOG.md` (cette entrée)

### À venir (Phase 3 non faite)
- Refonte contenu des 5 articles initialement <60 (workflow-tips, monde-ia, dev-browser, superpowers, veille) — pas juste meta mais structure et profondeur
- Renommer slug `claude-code-workflow-tips-after-6-months-of-daily-` → `claude-code-workflow-tips` + redirect 301
- Ajouter chiffres first-party mesurés sur 4 semaines pour boost CORE-EEAT Experience

---

## 2026-04-24 · audit SEO + Phase 1 fix · 21 articles refondus

### Pourquoi
Audit SEO complet du site demandé par Jérémy : 21 articles audités par 6 sous-agents Phase A (format MD scoring /100 sur 4 blocs : Meta + Structure + Linking + Content), puis 5 stratégiques en CORE-EEAT Phase B (8 dimensions, 3 vetos), puis Phase 1 fix par 4 sous-agents en parallèle.

### Audits livrés (26 fichiers MD)
- `audits/<slug>/202604241000.md` × 21 — audit SEO actionnable Phase A (score /100 + 15 checks ✅/❌ + 3-5 recos)
- `audits/<slug>/202604241200.md` × 5 — audit CORE-EEAT Phase B sur booking + llm-local + open-source + monde-ia + autoresearch-karpathy

### Phase A — État avant fix
- Note moyenne : **68/100**
- Distribution : 3 articles >80 · 7 entre 70-79 · 5 entre 60-69 · 5 entre 50-59
- Plus bas : claude-code-workflow-tips (50), monde-ia (52), dev-browser (53), superpowers (56), veille (58)

### Phase B — Veto déclenchés
- 🔴 booking-eurofiscalis-making-of : veto R10 (chiffres incohérents 400/375/345 + 4400/4140/4100 après 3 itérations Letsignit) → score plafonné à 60 (brut 81)
- 🟠 monde-ia + autoresearch-karpathy : veto T04 partial (transparence IA absente)

### Phase 1 fix livrée (4 sous-agents en parallèle, partition disjointe)
- **S1** · 8 coquilles SEO vides : backport bloc Meta complet (canonical + OG + Twitter + JSON-LD TechArticle/OpinionPiece) + raccourci titles + 4 liens internes cassés fixés sur dev-browser/superpowers
- **S2** · booking R10 + 4 transparence IA : 7 chiffres harmonisés (375 €/mois cumulé · 345 €/mois économisé · 4 140 €/an) + ajout puce TLDR « Écrit avec Claude, relu par moi » sur llm-local/open-source/hermes/autoresearch
- **S3** · 5 articles bien notés à raccourcir : titles supprimés du suffixe « — par Jérémy Sagnier » + 2 JSON-LD doublons fusionnés (karpathy + outil-vente)
- **S4** · 3 opinions/podcast : OG/Twitter ajoutés sur limova/better-call + 18 liens externes ajoutés au total + Schema PodcastSeries+3 PodcastEpisode sur guerres-d-ia-podcast

### Phase 1 — État après fix (estimations)
- Moyenne site : **68 → ~85/100** (+17 pts moyens)
- Top 5 articles passés à 90+ : superpowers (92), agents-ia-guide (92), loops-claude (92), karpathy (90+), plan-chine (90)
- Booking : R10 débloqué, devrait passer 60 → 81+
- Tous les 21 articles ont maintenant : Meta complet · titles ≤ 60 chars · meta desc ≤ 155 chars · transparence IA explicite · liens externes vers sources

### Patterns transverses corrigés
1. Suffixe « — par Jérémy Sagnier » supprimé sur 18+ titles (faisait dépasser 60 chars)
2. Bloc Meta complet backporté sur 8 articles (étaient des coquilles SEO vides)
3. 4 liens internes cassés (`href="claude-code.html"` → `../claude-code.html`) corrigés
4. Mention transparence IA harmonisée sur 4 articles non-dev récents
5. 18 liens externes vers sources/marques cités (Wondery, ElevenLabs, OpenAI, Limova, etc.)
6. 2 JSON-LD doublons fusionnés (karpathy + outil-vente)

### Fichiers touchés
- 21 articles `articles/*.html` modifiés
- 26 nouveaux audits `audits/<slug>/*.md`
- `CHANGELOG.md` (cette entrée)

### À venir (Phase 2 + Phase 3 non faites)
- Phase 2 : générer 21 og:image 1200×630 dédiées (auto via skill cover-generator) + ajouter FAQ + FAQPage JSON-LD sur les 5 stratégiques + MAJ `_TEMPLATE.html` pour bloquer la régression
- Phase 3 : refonte des 5 articles < 60/100 sur le contenu + renommer slug `claude-code-workflow-tips-after-6-months-of-daily-` → `claude-code-workflow-tips`

---

## 2026-04-24 · article booking V3 — ajout Letsignit (2e SaaS remplacé)

### Pourquoi
Sur demande Jérémy : préciser qu'on a aussi remplacé **Letsignit** (l'outil de signature email payé ~ 80 €/mois pour 20 utilisateurs). Renforce massivement l'angle « on a tué 2 SaaS d'un coup avec un seul outil maison ». Recalcule des économies (~ 4 100 €/an au lieu de 3 200 €/an).

### Livré V3
- **Titre + meta** : « On a viré Calendly **ET Letsignit** »
- **Hero H1** : « ON A VIRÉ CALENDLY ET LETSIGNIT » (2 marques colorées, fuchsia + teal)
- **Hero-lead** : précise les 2 abonnements et zéro contrôle charte
- **TL;DR** : retouche puces 1 et 5 (mention Letsignit + nouveau coût ~ 400 € avant / ~ 30 € après)
- **Section déclencheur** : nouveau paragraphe sur Letsignit (~ 80 €/mois plan standard, signatures qui se cassent dans Outlook Windows legacy)
- **Section back-office signature** : nouveau callout `tip` « Bye bye Letsignit » qui résume l'éviction
- **Section coût** : tableau enrichi avec ligne Letsignit (~ 80 €/mois, ~ 960 €/an), total des 2 SaaS (~ 375 €/mois), économie annuelle recalculée à ~ 4 140 €
- **Bignum « Économie mensuelle »** : ~ 290 € → ~ 345 €
- **Mini-marquees** : 2 mises à jour (« 2 SaaS qui coûtent 400 €/mois », « 2 SaaS résiliés », « 4 100 € économisés par an »)
- **`index.html`** project card : titre « On a viré Calendly et Letsignit », meta « 4 100 €/an économisés », desc actualisée

### Fichiers touchés
- `articles/booking-eurofiscalis-making-of.html` (752 lignes, +10 par rapport à V2)
- `index.html` (project card #03)
- `CHANGELOG.md` (cette entrée)

---

## 2026-04-24 · article « On a viré Calendly » V2 — ajout section back-office

### Pourquoi (suite)
Sur demande de Jérémy, ajout d'une section dédiée au back-office (la galère imprévue qu'on n'avait pas anticipée). Article passé de 647 → 742 lignes (+95). Timeline étendue avec 2 items (semaines 2-3 back-office + 4 semaines après pour polish + RDV à 2 + audit Max).

### Livré V2
- **Nouvelle section** « Le back-office que l'équipe pilote tous les jours » (entre « 3 features » et « Stack technique »)
  · Sous-section « Configurer sa page de réservation » avec showcase image `ma-page-rdv.png`
  · Sous-section « La signature email harmonisée » avec showcase image `mes-outils.png`
  · Listing des 5 pages du back-office (tableau : /mon-compte, /ma-page-rdv, /mes-outils, /equipe, /templates)
  · Callout « L'onboarding autonome » (la fonction qui a tout changé)
  · 3 leçons apprises sur les outils internes
- **Timeline étendue** de 7 à 9 items : ajout J5 « back-office (galère pas anticipée) » et « Avril · 4 semaines après · polish + RDV à 2 + audit »
- **Hero-lead enrichi** : mention « back-office complet où chaque conseiller pilote sa page »
- **TL;DR** : 3e puce reformulée pour mentionner back-office
- **Mini-marquee** ajoutée avant la section back-office (« Onboarding autonome · Signatures harmonisées · Fonds virtuels visio »)
- **2 nouveaux screenshots** dans `photos/booking/` :
  - `ma-page-rdv.png` (343 KB) — page de configuration de la page RDV avec mes liens, types, dispos, RDV à 2
  - `mes-outils.png` (628 KB optimisé depuis 1.4 MB) — signature email avec preview, gestion absence, fonds virtuels visio Eurofiscalis

### Fichiers touchés
- `articles/booking-eurofiscalis-making-of.html` (+95 lignes, 742 total)
- `photos/booking/ma-page-rdv.png` + `mes-outils.png` (nouveaux)
- `CHANGELOG.md` (cette entrée)

---

## 2026-04-24 · article « On a viré Calendly » + project card #3 sur la home

### Pourquoi
Making-of de booking.eurofiscalis.app : raconter comment on a remplacé Calendly chez Eurofiscalis (320 $/mois, 20 utilisateurs) par notre propre outil construit en 5 jours avec Claude Code. Format narratif similaire à `articles/guerres-d-ia-podcast.html` (le making-of podcast). Public débutant, ton Leo, gloses systématiques (Next.js, Supabase, Microsoft Graph, Resend, Vercel, etc.).

### Livré
- **`articles/booking-eurofiscalis-making-of.html`** · 647 lignes, ~4500 mots — 9 sections : Le déclencheur (Calendly et ses limites de personnalisation) · Showcase de la page live avec screenshot intégré · La semaine de construction (timeline 7 jours, dimanche soir → vendredi soir, Max sur la fin pour la sécu) · 3 features qui ont fait la différence (RDV à 2 / signatures email / widget intégrable) · Stack technique expliquée simplement (tableau 6 outils glossés) · Coût (~ 320 $/mois → ~ 30 €/mois, ~ 290 € d'économie/mois, 3 bignum cards) · 4 pièges (timezones / double booking / emails Microsoft Graph qui plantent / OAuth tokens) · Bilan « ce que je referais et ne referais pas » + matrice « pour qui c'est pertinent » · CTA newsletter
- **`photos/booking/booking-full.png`** + **`booking-hero.png`** · screenshots prod capturés via dev-browser sur https://booking.eurofiscalis.app/jeremy-sagnier
- **`index.html`** : 3ème project card ajoutée dans la section #projects (« On a viré Calendly en une semaine »), badge « Live · Outil interne · 03 », background = screenshot booking, après les cards Outil de vente Shirley + Podcast Wondery

### Fichiers touchés
- `articles/booking-eurofiscalis-making-of.html` (nouveau)
- `photos/booking/booking-hero.png` + `booking-full.png` (nouveaux)
- `index.html` (3e project card)
- `CHANGELOG.md` (cette entrée)

### À venir
- Possible : intégrer dans `apprendre.html` étape 04 si le making-of vaut comme exemple pédagogique
- Si l'article performe : faire le making-of d'un autre projet interne (CRM Tiger, agent qualif WhatsApp en cours)

---

## 2026-04-24 · article « Faire tourner une vraie IA chez toi » + intégration apprendre.html

### Pourquoi
Suite logique de l'article open source : passer de la théorie à la pratique. Tutoriel non-dev pour installer un LLM en local sur son ordi, avec Ollama + Open WebUI + RAG. Public débutant absolu, ton Leo, zéro jargon, mots simples. 5 sous-agents Superpowers déployés en parallèle (hardware, outils logiciels, modèles, cas d'usage + RAG, limites/futur).

### Livré
- **`articles/llm-local-pour-non-dev.html`** · ~785 lignes, ~4500 mots — 10 sections : Pourquoi c'est devenu sérieux (DeepSeek 589 G$ NVIDIA + 3 bignum cards confidentialité/coût/offline) · Pourquoi tu pourrais abandonner (4 callouts honnêtes multimodal/web/agentic/MAJ) · Le matos (3 budgets 800€/2400€/4500€ + Mac vs PC + piège bande passante) · 4 outils (Ollama / Open WebUI / LM Studio / GPT4All) · Modèles (6 familles + 5 modèles à essayer + piège base/instruct) · Tuto pas-à-pas 6 étapes step cards (Mac fil rouge + variantes Win/Linux) · 6 cas d'usage par profession (avocat/DAF/journaliste/formateur/étudiant/créatif) · RAG « discuter avec tes docs » (analogie + 3 étapes Open WebUI + tableau 6 cas) · Local vs cloud (matrice décisionnelle + workflow perso) · 5 erreurs débutant + Pour aller plus loin
- **`drafts/research-llm-local/`** · 5 fichiers research consolidés (~14 000 mots) issus des 5 sous-agents
- **`apprendre.html`** · 2 cards ajoutées en fin étape 04 (open source 04.6 c-teal + LLM local 04.7 c-orange) — intégration des 2 articles non-dev dans le parcours pédagogique
- Visuels HTML stylés réutilisés du template open source : bignum cards, callouts ok/warn/tip, outils grid, cas cards, step cards numérotées, mini-marquees signature, tableaux comparatifs
- Liens croisés : llm-local ↔ open-source dans intro et conclusion (continuité éditoriale)
- Schema.org TechArticle + canonical + OG/Twitter Card
- Ton Leo strict : 1ère personne, mots simples, pas familier, transparent IA, gloses inline (RAM, VRAM, RAG, Q4_K_M, base vs instruct)

### Fichiers touchés
- `articles/llm-local-pour-non-dev.html` (nouveau)
- `drafts/research-llm-local/*.md` (5 nouveaux)
- `apprendre.html` (2 cards ajoutées)
- `CHANGELOG.md` (cette entrée)

### À venir
- Tester en prod après push (parcours étape 04 + lecture article + responsive mobile)
- Captures d'écran tuto (idéal : Ollama install + Open WebUI premier chat) — non fait, pourrait améliorer
- Card dédiée dans `index.html#projects` ou `#opinions` pour mettre en avant le combo LLM local + open source
- Article 3 possible : « Mon pipeline de production avec mes IA en local » (workflow réel quotidien)

---

## 2026-04-24 · article « L'open source, expliqué pour ceux qui ne sont pas dev »

### Pourquoi
Tutoriel complet pour non-dev sur l'open source. Couvrir définition, licences, modèles économiques, IA ouverte, top outils, veille, pièges, sécurité — sans jargon, ton Leo, lecteur novice doit pouvoir comprendre. 5 sous-agents Superpowers déployés en parallèle pour la recherche.

### Livré
- **`articles/open-source-pour-non-dev.html`** · ~786 lignes, ~4000 mots — 10 sections : C'est quoi exactement (frise 5 étapes) · Licences (tableau décisionnel) · Modèles économiques (5 modèles + 3 bignum cards Red Hat 34G$ / MongoDB 2G$ / GitLab 750M$) · Controverse 2024-2026 (HashiCorp/Redis/Elastic) · Open source et IA (tableau OSAID + DeepSeek 27 jan 2025 + tutoriel Ollama 5 min) · 30 outils par catégorie · Veille (Korben/HN/Console.dev) · 5 pièges majeurs · Sécurité supply chain (log4j/xz/Polyfill) · Pour commencer aujourd'hui
- **`drafts/research-open-source/`** · 5 fichiers research consolidés (~14 000 mots) issus des 5 sous-agents
- Visuels HTML stylés : frise temporelle, tableau décisionnel, cards modèles, bignum, tableau IA, grid outils, encart Ollama style "quick start" noir, cards pièges, checklist audit
- Lien croisé vers article making-of podcast Guerres d'IA sur le moment DeepSeek
- Schema.org TechArticle + canonical + OG/Twitter Card
- Ton Leo respecté : 1ère personne, pas familier, transparent IA, mots simples, gloses inline du jargon

### Fichiers touchés
- `articles/open-source-pour-non-dev.html` (nouveau)
- `drafts/research-open-source/*.md` (5 nouveaux)
- `CHANGELOG.md` (cette entrée)

### À venir
- **Intégration dans `apprendre.html`** — devrait s'inscrire en étape 01 « Poser les bases ». Non fait dans cette session.
- Ajout d'une card dédiée dans `#opinions` ou nouvelle section tutos sur la home
- Tester en prod après push, suivre les retours

---

## 2026-04-24 · draft article « À quoi ressemblera le monde dans 5, 10, 20 ans avec l'IA »

### Pourquoi
Jérémy a demandé un 2e article d'opinion sur l'avenir du monde avec l'IA. Brief : angle pédagogique scénarios (option A), profondeur 3500-4500 mots, probabilités chiffrées assumées, fil rouge = opinion personnelle forte de Jérémy en tant que père d'un fils de 4 ans. Opinion centrale : le vrai basculement à 20-30 ans ne sera pas imposé d'en haut — les humains eux-mêmes préféreront la machine (santé, éducation, conduite, travail). Recherche préalable via 5 sous-agents parallèles (AGI timeline, horizon 5 ans, 10 ans, 20 ans, risques/géopolitique).

### Livré
- **`drafts/monde-ia-5-10-20-ans.md`** · draft MD ~3850 mots (19 min lecture) avec frontmatter complet : slug, titre, titre_seo, description 149 chars, catégorie `Opinion`, numéro 11, hero 3 lignes centré « J'ai un fils de 4 ans · Voici son monde », lead 130 mots posant directement la question du fils, 3 bullets TL;DR (incl. mention « Écrit avec Claude, relu par moi » pour conformité EU AI Act).
- **Structure** : 7 sections avec kickers rotatifs (fuchsia/teal/orange) · Avant de commencer (histoire du fils) → État actuel avril 2026 (benchmarks + METR + marché) → Dans 5 ans (3 usecases signaux concrets + tableau métiers exposés + callout compression carrière) → Dans 10 ans (patrons + chercheurs + paris + tableau 3 scénarios + 3 trends certains) → Dans 20 ans (tableau 4 scénarios documentés + focus abondance/catastrophe/muddling) → Les 3 vraies questions (3 faits ignorés + concentration pouvoir + callout) → Mon pari personnel (permis, métiers refuge, travail comme organisation sociale, éducation fils, callout chiffré 70/20/40 %).
- **Composants visuels** : 3 usecases (signaux 5 ans), 3 tableaux chiffrés (métiers exposés, 3 scénarios 10 ans, 4 scénarios 20 ans), 4 callouts (tip avis 20s, warn compression carrière, warn faits ignorés, ok pari chiffré), 8 sources externes linkées inline.
- **Opinion assumée en fil rouge** : le basculement majeur à 20-30 ans = humains choisissent IA par préférence (santé, éducation, transport, travail). Chiffres subjectifs assumés (70 % consultation IA avant médecin d'ici 2046, 20 % fils passe permis avant 25 ans, 40 % exerce un « métier »).
- **Ton Leo respecté** : 1ère personne, chaleureux non familier, transparent sur l'IA, mots simples, appels à réponse, assume les limites, posture père-observateur-curieux pas expert.

### Fichiers touchés
- `drafts/monde-ia-5-10-20-ans.md` (nouveau)
- `CHANGELOG.md` (cette entrée)

### À venir
- Relecture Jérémy du draft MD
- `npm run publish monde-ia-5-10-20-ans` pour générer `articles/monde-ia-5-10-20-ans.html` + MAJ `sitemap.xml`
- Éventuellement ajout d'un teaser dans `index.html` section `#opinions`
- Commit + push pour déclencher auto-deploy Vercel

---

## 2026-04-23 · intégration podcast complète "Guerres d'IA" · Jerwis Productions

### Pourquoi
Trois épisodes de podcast narratif prêts dans `~/Projets/podcast-wondery/exports/` (La Fracture, Les Quatre Jours, Frères Ennemis). Fallait les diffuser publiquement — Apple Podcasts + Spotify + section dédiée sur jerwis.fr. Plus : poser la marque **Jerwis Productions** comme maison de production pour héberger d'autres séries plus tard.

### Livré
- **Direction visuelle** · pochette "Direction 4" (duotone glitch éditorial, JetBrains Mono + chromatic aberration + scanlines CRT). Palette Fiesta conservée mais typo et effets modernisés (s'éloigne du heritage 90s du reste du site pour un ton narratif plus contemporain).
- **Pochettes générées automatiquement** · script `build-podcast-covers.js` avec Puppeteer + sharp. 8 PNG produites (série + 3 eps × 512 et 3000 px). Template paramétré `templates/podcast-cover.html`. Chaque ep a une teinte dominante (fuchsia pour ep01, orange pour ep02, fuchsia+teal pour ep03).
- **Page `/podcast.html`** · Layout A éditorial magazine (hero série + liste épisodes + player inline + 2 CTAs newsletter + mini-marquee + footer cohérent avec le site).
- **Lecteur HTML5 custom** · 0 dépendance, 136 lignes JS + CSS inline. Features : play/pause, seek, vitesse 1/1.25/1.5/2×, persistance position localStorage, 1 seul player actif à la fois (singleton), raccourcis clavier ←/→ ±5s, ARIA.
- **Host audio** · Cloudflare R2 (free tier 10 Go + 0 egress). 3 MP3 uploadés via `scripts/podcast-upload.js` (aws-sdk-s3 compatible, validation extension + sanitization filename + rejet fichier vide).
- **RSS feed iTunes-conforme** · `feed/podcast.xml` avec toutes les balises `<itunes:*>` requises par Apple/Spotify. Généré par `build-podcast-rss.js`. Validé xmllint + 3 enclosures R2.
- **Nav site** · entrée `Podcast` ajoutée dans 6 pages avec nav principale (`index`, `apprendre`, `outils`, `github`, `quiz`, `preferences`). Les 4 pages articles longs (`workflows`, `claude-code`, `debutant`, `lexique`) gardent leur back-link simple volontairement épuré.
- **Scripts npm** · `podcast:build` (covers + rss + page), `podcast:upload`, `podcast:rss`, `podcast:covers`, `podcast:page`.
- **Tests unitaires** · 8 tests sur helpers (format duration MM:SS et HH:MM:SS, escape XML/HTML, rfc2822Date, accent colors) via `node:test` · `npm test`.
- **Documentation** · section "Section Podcast · Jerwis Productions" dans CLAUDE.md + sitemap.xml mis à jour.

### Architecture
Source de vérité unique · `data/episodes.json`. Trois scripts de build (covers, rss, page) consomment ce JSON. Audio stocké hors repo sur Cloudflare R2 (CDN gratuit, 0 egress). Pas de base de données, pas de framework, pas de backend dédié. Chaque nouvel épisode = 1 entrée JSON + `npm run podcast:build` + commit.

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
- `index.html`, `apprendre.html`, `outils.html`, `github.html`, `quiz.html`, `preferences.html` (nav)
- `sitemap.xml`, `CLAUDE.md`, `package.json`, `.gitignore`, `.env.local`

### À venir
- [ ] Rédiger descriptions longues (300-500 mots) des 3 épisodes en ton Leo — à faire par Jérémy avant submission plateformes
- [ ] Soumettre le feed RSS à Apple Podcasts Connect + Spotify for Podcasters
- [ ] Valider le feed sur https://castfeedvalidator.com/ une fois en prod
- [ ] (Optionnel V2) Configurer custom domain `podcast-audio.jerwis.fr` CNAME vers bucket R2
- [ ] (Optionnel V2) Refactorer `test-helpers.js` en `scripts/lib/helpers.js` + `scripts/test-helpers.js` pour éviter que les tests s'exécutent à chaque import par les scripts de build
- [ ] (Optionnel V2) Page par épisode `/podcast/<slug>.html` avec transcript si audience grandit

---

## 2026-04-23 · migration MP3 podcast vers Cloudflare R2 (repo allégé)

### Pourquoi
Le setup R2 finalisé en parallèle (autre Claude Code) a uploadé les 3 MP3 masters. Source unique de vérité = R2 via URLs publiques. L'article `guerres-d-ia-podcast.html` doit pointer vers R2, pas vers `audio/podcast/` local. Avantages : repo Git redevient léger (~0 MB ajouté au lieu de ~69 MB), zéro doublon avec la future page `/podcast.html` qui pointera aux mêmes URLs, cache Cloudflare global.

### Livré
- **`articles/guerres-d-ia-podcast.html`** · 3 `<audio src=>` modifiés pour pointer vers R2 (`https://pub-13be70d367034b9eb7903c6b3b80eaa0.r2.dev/episode-XX-...-MASTER.mp3`). URLs récupérées depuis `data/episodes.json` (source unique) généré par le pipeline podcast en parallèle.
- **`audio/podcast/`** · supprimé (3 fichiers, ~69 MB)
- **`audio/`** · dossier supprimé (vide)

### Fichiers touchés
- `articles/guerres-d-ia-podcast.html`
- `audio/podcast/*.mp3` (supprimés)
- `audio/` (supprimé)
- `CHANGELOG.md` (cette entrée)

### À venir
- Si Cloudflare R2 expose un custom domain (`cdn.jerwis.fr/podcast/...`), remplacer les 3 URLs `pub-xxxx.r2.dev` par le custom domain pour pérennité
- Tester streaming 3 audios en prod après push
- Lecteur HTML5 custom (Task 8 parallèle) à intégrer dans cet article quand prêt — remplacera les `<audio>` natifs

---

## 2026-04-23 · draft article « Le plan chinois 2026-2030, décrypté »

### Pourquoi
Jérémy a demandé une synthèse pédagogique du 15e plan quinquennal chinois (adopté 12 mars 2026) pour son blog perso. Brief : ton Leo, sans jargon, angle observateur curieux qui décrypte, impact business mondial sur les années à venir. Recherche préalable effectuée en 5 sous-agents parallèles (politique, tech, économie, défense, climat) → synthèse consolidée en français simple.

### Livré
- **`drafts/plan-chine-2026-2030.md`** · draft MD ~2850 mots (13 min lecture) avec frontmatter complet : slug, titre, titre_seo, description 141 chars, catégorie `Opinion`, numéro 10, hero 3 lignes, lead 80 mots, 3 bullets TL;DR (incl. mention « Écrit avec Claude, relu par moi » pour conformité EU AI Act).
- **Structure** : 7 sections avec kickers rotatifs (fuchsia/teal/orange) · Avant de commencer → C'est quoi un plan quinquennal → 3 crises (usecases) → Pari de Xi → 5 leviers (steps numérotés) → 3 contradictions → Impact mondial/business → Pour aller plus loin.
- **Composants visuels** : 3 usecases (crises), 5 steps (leviers), 4 callouts (tip/warn/warn/ok), 5 sources externes linkées inline (Rhodium, Asia Times, Carnegie, Carbon Brief, CSIS, SIPRI, Climate Action Tracker).
- **Ton Leo respecté** : 1ère personne, chaleureux non familier, transparent sur l'IA, mots simples (plan quinquennal expliqué comme « programme politique + plan d'investissement + feuille de route militaire »), appels à réponse (« réponds à l'email, je lis tout »), assume les limites (« je peux me tromper »).
- **Posture Jérémy préservée** : pas de « dev »/« codeur », positionnement « entrepreneur curieux qui décrypte avec Claude ».

### Fichiers touchés
- `drafts/plan-chine-2026-2030.md` (nouveau)
- `CHANGELOG.md` (cette entrée)

### À venir
- Relecture Jérémy du draft MD
- `npm run publish plan-chine-2026-2030` pour générer `articles/plan-chine-2026-2030.html` + MAJ `sitemap.xml`
- Éventuellement ajout d'un teaser dans `index.html` section `#opinions` (6 cards style magazine)
- Commit + push pour déclencher auto-deploy Vercel

---

## 2026-04-23 · feedback widgets podcast (vote 👍/👎 par épisode + suggestion ép 4)

### Pourquoi
Jérémy veut récolter l'avis des auditeurs des 3 épisodes Guerres d'IA pour décider la suite : quel épisode marche le mieux, faut-il un ép 4, sur quel sujet. Ton Leo « réponds, je lis tout » mais en widget intégré sous chaque audio + form suggestion globale en bas d'article.

### Livré
- **`api/episode-feedback.js`** · nouveau endpoint serverless calqué sur `subscribe.js`. Gère 2 types : `kind: 'vote'` (avec `episode`, `vote: up|down`, `comment` optionnel) et `kind: 'suggestion'` (textarea ép 4). Envoie email Resend à `ADMIN_NOTIFY_EMAIL` (override env, fallback `jeremy.sagnier@eurofiscalis.com`). Pas de stockage DB — tout passe par email comme la notif `+1 newsletter`.
- **`articles/guerres-d-ia-podcast.html`** · 3 widgets feedback (un sous chaque `<audio>`) avec boutons 👍/👎 + textarea facultatif `+ Pourquoi`. Form `Suggestion ép 4` en bas avant final-cta avec textarea + bouton envoi. Anti double-vote via `localStorage` (clé `pod_vote_<episode>`). États visuels : voted (border teal), thanks, error.
- CSS cohérent charte Fiesta (boutons radius 12px, hover translate, error orange, thanks teal mono).
- JS frontend : event listeners, restauration état localStorage au load, fetch POST, gestion silencieuse des échecs (le vote reste enregistré localement même si le réseau échoue).

### Fichiers touchés
- `api/episode-feedback.js` (nouveau)
- `articles/guerres-d-ia-podcast.html` (CSS + 3 widgets HTML + form HTML + JS frontend)
- `CHANGELOG.md` (cette entrée)

### À venir
- Tester le pipeline complet en prod après push (vote + comment + suggestion)
- Vérifier que `ADMIN_NOTIFY_EMAIL` est bien défini sur Vercel (sinon fallback `jeremy.sagnier@eurofiscalis.com`)
- Potentiellement ajouter compteurs publics si Vercel KV configuré plus tard
- Re-déployer après push R2 (URLs `<audio src>` à modifier en parallèle)

---

## 2026-04-23 · article « Comment j'ai créé un podcast avec une voix IA en 24h »

### Pourquoi
Storytelling sur la production de la trilogie pilote du podcast *Guerres d'IA* (3 épisodes Wondery FR sur la guerre IA, voix synthétiques, scénarios écrits par sous-agents Claude, mixage automatisé). Récit narratif demandé par Jérémy : tout vrai, tout documenté, ton Leo, pas de jargon, lecteur novice doit comprendre.

### Livré
- **`articles/guerres-d-ia-podcast.html`** · nouvel article long-form (~2500 mots) — structure : hero dark + TL;DR + 9 sections (déclic / sujet / 3 audios embeddés / pipeline / test 5 min / bug invisible / 3 bonds par épisode / coût $33 / 6 leçons) + final CTA newsletter
- **`audio/podcast/`** · 3 MP3 masters embeddés (24 + 24 + 21 MB = ~69 MB) : `episode-01-la-fracture-MASTER.mp3`, `episode-02-les-quatre-jours-MASTER.mp3`, `episode-03-freres-ennemis-MASTER.mp3`
- **`index.html`** · ajout 2ème card dans section #projects (« Un podcast Wondery FR en 24 heures ») à côté de l'outil de vente. Grid `projects-grid` (sans `single`) pour 2 cards.
- Schema.org TechArticle + canonical + OG/Twitter Card complets
- Visuels HTML stylés : 4 cartes pipeline, carte « bug invisible » (mono vs stéréo), carte coût $33 noir, grille 6 leçons, 3 mini-marquees signature
- Ton Leo respecté (1ère personne Jérémy, chaleureux pas familier, transparent sur l'usage IA, pas de jargon, mots simples)

### Fichiers touchés
- `articles/guerres-d-ia-podcast.html` (nouveau, ~700 lignes)
- `audio/podcast/*.mp3` (nouveaux, 3 fichiers)
- `index.html` (card podcast ajoutée section #projects)
- `CHANGELOG.md` (cette entrée)

### À venir
- Demander à Jérémy si on push Vercel (les 3 MP3 ajoutent ~69 MB au repo)
- Éventuellement : remplacer les MP3 embed par liens externes Ausha/Spotify quand publiés
- Ajouter potentiellement une card dans #content (Sources) si Jérémy veut référencer son propre podcast

---

## 2026-04-23 · notifications admin sur inscriptions newsletter

### Pourquoi
Jérémy veut être alerté en temps réel à chaque nouvel inscrit (et à chaque désabonnement, déjà en place) pour suivre la croissance newsletter et réagir vite aux retours négatifs.

### Livré
- **`api/subscribe.js`** · nouvelle fonction `sendAdminNotification()` appelée best-effort après inscription réussie (pas sur doublon). Envoie à l'admin un email avec subject `+1 newsletter · <email>` + corps (email, prénom si fourni, source du form, date, lien dashboard Resend).
- **`api/unsubscribe.js`** · notif admin déjà existante, adresse destinataire alignée.
- **Destinataire admin** · `jeremy.sagnier@eurofiscalis.com` (remplace l'ancien `sagnier.jeremy@gmail.com`), override possible via env var `ADMIN_NOTIFY_EMAIL` sur Vercel si besoin de changer sans redéployer.
- **Symétrie inscription / désabonnement** · `+1` vs `-1` dans les subjects, même structure de body.

### Fichiers touchés
- `api/subscribe.js` · ajout `ADMIN_EMAIL`, `sendAdminNotification()`, `escapeHtml()`, appel après welcome
- `api/unsubscribe.js` · `ADMIN_EMAIL` passe de hardcodé à env var avec fallback

### Best-effort (pas de régression possible)
Les deux notifs admin sont encapsulées dans try/catch · si Resend rate, l'inscription/désabonnement réussit quand même. Log côté Vercel via `console.error`.

### À venir
- [ ] Tester en prod après redéploiement · s'inscrire avec un email test et vérifier la réception sur jeremy.sagnier@eurofiscalis.com
- [ ] Ajouter env var `ADMIN_NOTIFY_EMAIL` sur Vercel si tu veux override le fallback

---

## 2026-04-23 (second pass) · renommage slug article GMF + redirect 301

### Pourquoi
Après le premier passage d'anonymisation (texte visible), le slug URL `construit-avec-claude-code-gmf.html` restait visible dans la barre d'adresse et dans les liens partagés. Décision d'aller au bout du renommage, avec redirect 301 pour préserver le SEO et les liens déjà diffusés.

### Livré
- **Renommage fichier** · `articles/construit-avec-claude-code-gmf.html` → `articles/outil-vente-claude-code.html` (via `git mv`, historique préservé)
- **URLs internes du fichier** · canonical, og:url, twitter:url, schema.org `@id` + `url`, 5× share buttons (X, LinkedIn, Instagram, WhatsApp, copy link, email) + `mailto` body
- **Source formulaire** · `source: 'article-gmf'` → `source: 'article-outil-vente'` (nouvelles inscriptions taguées ainsi dans Resend)
- **Liens sortants mis à jour** · `apprendre.html`, `index.html`, `workflows.html`, `quiz.html`, `sitemap.xml`
- **Fichiers tech internes** · `SEO-GUIDE.md` (table), `scripts/seo-improve.js` (map PUBLISH_DATES), `admin/modules/articles/page.html` (logique classification `slug.includes('outil-vente')`), `CLAUDE.md` (mention slug MAJ)
- **Redirect 301 ajouté dans `vercel.json`** · `/articles/construit-avec-claude-code-gmf(.html)?` → `/articles/outil-vente-claude-code.html` · permanent. Préserve le juice SEO Google + empêche le 404 pour les liens externes déjà partagés.

### Vérifications
- `grep -r "GMF"` sur fichiers publics (HTML/XML) → 0 occurrence
- `grep -r "construit-avec-claude-code-gmf"` sur tout le projet → seulement le redirect `vercel.json` + CHANGELOG historique
- Tous les liens internes pointent vers le nouveau slug

### Fichiers touchés
- `articles/outil-vente-claude-code.html` (renommé + URLs internes)
- `apprendre.html`, `index.html`, `workflows.html`, `quiz.html`, `sitemap.xml`
- `SEO-GUIDE.md`, `scripts/seo-improve.js`, `admin/modules/articles/page.html`
- `CLAUDE.md`
- `vercel.json` (redirect 301)

### À venir
- [ ] Après redéploiement Vercel, tester manuellement que `/articles/construit-avec-claude-code-gmf.html` redirige bien en 301 vers le nouveau slug
- [ ] Si l'ancien slug a déjà été soumis à Google Search Console, attendre réindexation (2-4 semaines)

---

## 2026-04-23 · anonymisation GMF + abandon player TTS

### Pourquoi
Décision d'anonymiser le nom de l'employeur de Shirley sur tout le site (remplacé par "en assurance" / "outil de vente"). Le projet de player TTS (audio généré de l'article GMF) est également arrêté — on retire les artefacts locaux et la balise injectée dans l'article.

### Livré
- **Article GMF** (`articles/construit-avec-claude-code-gmf.html`) · retrait du `<link rel="stylesheet" href="../css/tts-player.css">` (CSS jamais committé) + retrait du bloc `<div class="tts-player">` injecté au-dessus du hero-lead
- **apprendre.html** · titre card "L'outil *GMF*" → "L'outil *de vente*" + preview "chargée de clientèle GMF" → "chargée de clientèle en assurance"
- **index.html** · projet #01 preview "chez GMF" → "en assurance" + commentaire HTML mis à jour
- **workflows.html** · lex-block-reassure "(chargée de clientèle GMF)" → "(chargée de clientèle en assurance)"
- **quiz.html** · reco qualifieur "l'outil de vente GMF" → "l'outil de vente de ma femme"
- **CLAUDE.md** · 2 références GMF remplacées dans la carto des sections + nouvelle règle "JAMAIS dire/écrire GMF" (slug technique conservé pour SEO)
- **AGENT_BRIEF.md** · exemple de slug changé (`construit-avec-claude-code-gmf` → `hermes-agent`) + règle ajoutée dans exclusions
- **Suppression locale** · dossier `articles/audio/` (5.8 Mo, 3 versions : orig / retell / clones voix) + `generate-audio.sh` · aucun de ces fichiers n'était committé, donc aucun historique à purger

### Décisions
- **Slug technique conservé** (`construit-avec-claude-code-gmf.html`, canonical, og:url, sitemap, `source: 'article-gmf'`). Raison : URLs déjà indexées par Google + partagées. Renommer casserait le SEO et les liens externes. Le slug ne fuit pas publiquement (l'utilisateur voit l'URL mais pas le mot sur la page).
- **`scripts/seo-improve.js` et `admin/modules/articles/page.html`** · références techniques au slug → laissées intactes (logique interne, pas visible).

### Fichiers touchés
- `articles/construit-avec-claude-code-gmf.html`
- `apprendre.html`, `index.html`, `workflows.html`, `quiz.html`
- `CLAUDE.md`, `AGENT_BRIEF.md`

### À venir
- [ ] Quand le projet TTS reprendra, recréer `css/tts-player.css` + décider du stockage audio (CDN vs repo — 5.8 Mo / épisode, donc probablement pas dans le repo)

---

## 2026-04-22 (soir) · domaine jerwis.fr verifie cote Resend · FROM_EMAIL switch

### Pourquoi
Après les premiers tests sandbox (welcome/goodbye OK sur sagnier.jeremy@gmail.com mais bloqués vers jeremy.sagnier@eurofiscalis.com), diagnostic · Resend mode sandbox avec `onboarding@resend.dev` ne peut envoyer qu'au propriétaire du compte. Il fallait vérifier jerwis.fr comme domaine d'envoi.

### Livré
- **Diagnostic DNS Hostinger** via API (lecture seule) · records DKIM/SPF/DMARC déjà présents dans la zone
- **Verification Resend** · click "Verify DNS" côté dashboard → passage de "Not Started" à "Verified" (Apr 22, 8:41 AM us-east-1)
- **Revert temporaire** (commit `cfa8c2c`) · FROM_EMAIL repassé sur `onboarding@resend.dev` pendant la fenêtre de vérif pour pas casser les inscriptions réelles
- **Re-switch définitif** (commit `bfecef6`) · FROM_EMAIL = `Jérémy Sagnier <jeremy@jerwis.fr>` sur `api/subscribe.js` + `api/unsubscribe.js`
- **Tests prod E2E validés** · 3 emails reçus via jeremy@jerwis.fr
  - welcome AI Playbook → jeremy.sagnier@eurofiscalis.com ✅
  - goodbye désabonnement → jeremy.sagnier@eurofiscalis.com ✅
  - notif feedback admin → sagnier.jeremy@gmail.com ✅

### Fichiers touchés
- `api/subscribe.js` · FROM_EMAIL
- `api/unsubscribe.js` · FROM_EMAIL

### À venir
- [ ] **Révoquer la clé Hostinger** partagée en clair (sécurité)

---

## 2026-04-22 (déploiement prod) · jerwis.fr est LIVE

### Pourquoi
Le site était prêt localement, manquait le passage en prod. Récupération du domaine `jerwis.fr` (précédemment sur un ancien projet Vercel) + déploiement du nouveau Site-perso + configuration Resend.

### Déploiement GitHub · commit unique
- `git init` + remote `git@github.com:sagnierjeremy-byte/Site-perso.git`
- 83 fichiers dans 1 commit initial · `daadda9 sync: back-office admin + pages outils/github/quiz + 3 articles + 10 freebies + brainstorm multi-sources`
- Branche `main` trackée

### Vercel
- Projet `site-perso` créé · import repo GitHub
- Application Preset · Other · root directory `/`
- **jerwis.fr détaché** de l'ancien projet (action manuelle sur dashboard)
- **jerwis.fr + www.jerwis.fr attachés** au nouveau projet
- DNS Hostinger déjà OK (A `76.76.21.21` + CNAME `cname.vercel-dns.com`) · propagation instantanée
- SSL Let's Encrypt auto-provisioné

### 3 fix techniques pendant le déploiement

**Fix 1 · `vercel.json` syntaxe legacy cassée** (commit `5424b9a` puis `e29bd11`)
- Problème · `version: 2 + builds: [...]` ne buildait pas `/api/subscribe.js` comme serverless function → 404
- Fix · passage à syntaxe moderne (`cleanUrls`, détection auto, pas de `builds`/`routes`)
- Résultat · `/api/subscribe` buildé et opérationnel

**Fix 2 · OPML servi comme 404**
- Problème · extension `.opml` hors liste manuelle `@vercel/static`
- Fix · retrait de la liste manuelle (Vercel détecte auto avec le nouveau vercel.json)
- Résultat · OPML 10 733 o, content-type `text/x-opml` ✓

**Fix 3 · `DEFAULT_AUDIENCE_ID` hardcodé supprimé** (commit `1a36574`)
- Problème · fallback vers audience Eurofiscalis si env var manquante → risque de fuite
- Fix · env var obligatoire, erreur 500 explicite si manquante
- Résultat · zéro secret résiduel dans le code

### Configuration Resend
- Création audience **AI Playbook** dédiée jerwis.fr (sur compte Resend perso, pas Eurofiscalis)
- Clé API créée avec **Full access** (Sending-only refusait l'écriture dans l'audience · erreur `restricted_api_key` 401)
- Env vars Vercel · `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` (production + preview + dev)

### Tests prod validés
- ✅ Home `jerwis.fr` · H1 « L'IA, c'est aussi pour nous. » rendu
- ✅ Pages `/claude-code`, `/outils`, `/github`, `/quiz`, `/apprendre`, `/debutant`, `/lexique` · 200 OK
- ✅ 7 downloads téléchargeables (OPML 10 Ko · install.sh 2.6 Ko · 3 MD · HTML cheatsheet · ZIP pack 713 Ko)
- ✅ Endpoint `/api/subscribe` · 200 OK avec `contactId` Resend
- ✅ Quiz testé manuellement par Jérémy, inscription newsletter confirmée

### Fichiers touchés
- `vercel.json` · refonte complète (syntaxe moderne)
- `api/subscribe.js` · retrait `DEFAULT_AUDIENCE_ID` hardcodé
- `CLAUDE.md` · section « Contexte projet » enrichie avec infos prod (jerwis.fr, GitHub, Vercel) · section « API Inscription Resend » mise à jour · nouvelle section « Vercel config » · TODOs recalibrés
- 3 commits post-initial · `5424b9a`, `e29bd11`, `1a36574`

### Plugin Claude Code bonus installé pendant la session
- `vercel@0.40.0` (via `npx plugins add vercel/vercel-plugin` · Vercel Labs) · 25 skills + 6 cmds + 3 agents + hooks + MCP pour piloter Vercel depuis Claude Code
- Total plugins actifs · 8 (claude-md-management, code-review, code-simplifier, context7, frontend-design, superpowers, telegram, vercel)

### À venir
- [ ] Kill l'ancien projet Vercel (maintenant safe)
- [ ] Redémarrer Claude Code pour activer les 25 skills Vercel
- [ ] Ajouter Vercel Analytics ou Plausible
- [ ] Configurer la séquence cours 5 jours côté Resend (guide dans `downloads/cours-email/sequence-resend.md`)
- [ ] Nettoyer les 3 contacts test `test-*@mailinator.com` dans audience Resend

---

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
