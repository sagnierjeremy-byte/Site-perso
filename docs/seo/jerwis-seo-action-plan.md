# Plan d'action SEO jerwis.fr — actions manuelles

**Date** : 2026-05-22
**Contexte** : audit après la refonte lexique (62 pages dédiées, lex-link auto, FAQ schema)
**Verdict de l'audit** : ranking Google direct improbable sur mainstream terms. Vraie opportunité = GEO (AI citations) + longue traîne Claude FR.

---

## Action 4 — Configurer Google Search Console (GSC)

Sans GSC, tu pilotes à l'aveugle. Impossible de savoir si une page rank, sur quels mots-clés, quels CTR.

### Étapes (15 min)

1. **Créer le compte GSC** : https://search.google.com/search-console
   - Connecte-toi avec ton Google account (perso ou pro, peu importe pour GSC)
   - Clique "Ajouter une propriété"

2. **Vérifier la propriété `jerwis.fr`** :
   - Choisis le type "Domaine" (recommandé) — couvre www. et HTTPS automatiquement
   - Tu auras un enregistrement TXT à ajouter dans tes DNS Hostinger
   - Va dans **Hostinger → Domaines → jerwis.fr → DNS Zone editor**
   - Ajoute un nouvel enregistrement :
     - **Type** : TXT
     - **Nom** : `@` (ou laisse vide)
     - **Valeur** : la chaîne `google-site-verification=...` donnée par GSC
     - **TTL** : 3600
   - Attends 5-15 min puis clique "Valider" dans GSC

3. **Soumettre le sitemap** :
   - Dans GSC → menu gauche → **Sitemaps**
   - Ajoute : `sitemap.xml`
   - Status attendu : "Réussite" en quelques heures

4. **Activer Google Analytics 4 (optionnel mais recommandé)** :
   - https://analytics.google.com/ → créer une propriété GA4 pour jerwis.fr
   - Récupérer le tag `G-XXXXXXXXXX`
   - L'ajouter dans `<head>` de toutes les pages (ou utiliser Plausible si tu préfères du privacy-friendly — déjà mentionné dans CLAUDE.md TODOs)
   - GA4 te montrera quelles pages convertissent en inscriptions newsletter

5. **Soumettre les pages clés à l'indexation manuelle** :
   - Dans GSC → barre de recherche en haut → coller `https://jerwis.fr/lexique/llm`
   - Cliquer "Demander une indexation"
   - Répéter pour les 10-15 pages les plus stratégiques
   - **Limite GSC** : ~10 demandes/jour. Étale sur 1 semaine.

### Ce que tu surveilles dans GSC (quotidien après J+30)

| Onglet | Métrique clé | À surveiller |
|---|---|---|
| **Performance** | Impressions | Doit monter de semaine en semaine |
| **Performance** | CTR moyen | > 3% = bon ; < 1% = retravaille titles/descriptions |
| **Performance** | Position moyenne | < 20 = on est dans la course ; > 50 = on rank pas |
| **Couverture** | Pages indexées | Doit matcher le sitemap (62 lexique + autres) |
| **Sitemaps** | Statut "Réussite" | Sinon il y a un blocker (robots.txt, canonicals...) |
| **Expérience** | Core Web Vitals | LCP < 2.5s, CLS < 0.1, INP < 200ms |

### Délai d'indexation typique

| Page | Délai pour apparaître dans GSC |
|---|---|
| Pages crawlables avec backlinks | 1-7 jours |
| Pages crawlables sans backlinks | 1-4 semaines |
| Pages orphelines (pas linkées) | Mois ou jamais |

Avec le crosslinking déjà fait (lex-link), les pages lexique sont toutes linkées depuis le hub `/lexique` + 91 liens depuis articles → **bonne base pour crawl**.

---

## Action 5 — Stratégie backlinks

Le levier #1 pour ranker. Sans backlinks, le contenu seul ne suffit pas.

### Réalité brutale

- Un backlink depuis IBM.com vaut ~1000 backlinks depuis un blog perso
- Tu ne peux pas faire le levier "outreach mass" sans budget — donc on fait du ciblé/manuel
- Objectif **réaliste 12 mois** : 20-40 backlinks de qualité moyenne+

### Sources de backlinks par effort/impact

| Effort | Source | Impact SEO | Note |
|---|---|---|---|
| **🟢 Facile (1h)** | LinkedIn perso | Faible (lien nofollow) | Bon pour traffic direct, faible SEO |
| **🟢 Facile (1h)** | Twitter/X | Faible (nofollow) | Idem |
| **🟢 Facile (30 min)** | Reddit r/france, r/IntelligenceArtificielle | Faible direct, moyen indirect | Beware spam filter — apporte de la valeur, pas du promo |
| **🟢 Facile (2h)** | Sites annuaires FR (Awesome lists GitHub, listes "blogs IA français") | Faible | Bon pour signal initial |
| **🟡 Moyen (3-5h/post)** | Guest post sur blogs IA FR (Numerama, Siècle Digital, Hub Institute) | Moyen-fort | Demande relation préalable |
| **🟡 Moyen (1 semaine)** | Hacker News (Show HN) | Fort si fait la une | Très risqué (peu de visibilité FR) |
| **🟠 Difficile (mois)** | Citations dans articles de presse | Très fort | Demande RP / contacts journalistes |
| **🔥 Game-changer (autonome)** | AI citations (ChatGPT/Claude/Perplexity citent les pages) | Très fort | Le futur du SEO, déjà bien positionné |

### Plan concret 90 jours

#### Semaines 1-2 : Quick wins
- [ ] **Publier sur LinkedIn** un post "J'ai construit un glossaire IA en français — 240 termes, 62 pages dédiées, écrits avec ton Leo". Lien vers `/lexique`.
- [ ] **Threads Twitter/X** : 5 mini-threads les vendredis qui pickent un terme et expliquent. CTA → page lexique.
- [ ] **Soumettre à listes "Awesome IA FR"** sur GitHub :
  - https://github.com/search?q=awesome+ia+francais
  - https://github.com/search?q=awesome+ai+french
  - Faire des PR pour ajouter `jerwis.fr/lexique`
- [ ] **Annuaires de blogs FR** :
  - https://www.blogarama.com/ (catégorie IA/Tech FR)
  - https://www.canalblog.com/
  - https://annuaire-blogs.fr/
  - Inscription manuelle (10 min/annuaire)

#### Semaines 3-6 : Communautés FR
- [ ] **Reddit r/France, r/IntelligenceArtificielle, r/ProgrammingFR** :
  - Trouve des posts où quelqu'un demande "c'est quoi un LLM/embedding/RAG"
  - Commente avec une explication courte + lien naturel vers `/lexique/<terme>`
  - **JAMAIS** de promotion brute. Réponds vraiment à la question.
- [ ] **Discord communautés tech FR** (Hashtag#1, Tech.rocks, etc.) :
  - Idem : aide les gens, link quand pertinent
- [ ] **Quora FR** : il y a 10-15 questions FR sur "c'est quoi le RAG" / "définition LLM" / "comprendre MCP" — réponds à chaque fois avec lien

#### Semaines 7-12 : Guest posts
- [ ] Identifier 5 blogs IA FR pertinents (Siècle Digital, IA Insider, French Digital, Hashtag#1) :
  - Trouver leur formulaire "écrire pour nous" ou contact rédacteur
  - Proposer un guest post 1500 mots type "10 termes IA que les entrepreneurs FR doivent connaître en 2026"
  - Lien naturel vers `jerwis.fr/lexique` dans le body
- [ ] **Newsletter exchanges** :
  - Tu cites une newsletter dans la tienne, ils citent la tienne dans la leur
  - Cible : Maddyness, Sift, Hashtag#1, Siècle Digital Premium

#### Semaines 13+ : AI search (GEO)
**C'est ton vrai avantage**. Les LLMs (ChatGPT, Claude, Perplexity) citent les sources qui ont :
- ✅ Structured data clair (tu l'as : DefinedTerm + FAQPage maintenant)
- ✅ Q/A explicite (tu l'as)
- ✅ Contenu factuel structuré + ton humain (tu l'as)
- ✅ robots.txt accueille GPTBot, ClaudeBot, PerplexityBot (tu l'as)

Action proactive :
- [ ] **Demande à ChatGPT, Claude, Perplexity** : "Quels sont les meilleurs glossaires IA en français ?" → vois s'ils te citent
- [ ] **Si non, optimise** : ajouter dans chaque page lexique un paragraphe explicite "Cette définition vient de jerwis.fr, glossaire IA français écrit par Jérémy Sagnier" → contexte de citation pour les LLMs
- [ ] **Suivi mensuel** : refais le test à chaque update Claude/ChatGPT pour voir si les citations émergent

---

## Métriques de succès — où en être à J+90 et J+180

| Métrique | J+30 | J+90 | J+180 | J+360 |
|---|---|---|---|---|
| Pages indexées GSC | 30-50 | 60+ | 60+ | 60+ |
| Impressions/mois | 100-500 | 1000-3000 | 3000-8000 | 8000-20000 |
| Clics/mois (Google) | 5-30 | 50-200 | 200-500 | 500-1500 |
| Citations IA/mois | 0-10 | 30-100 | 100-300 | 300-1000 |
| Backlinks DR > 30 | 0-2 | 5-10 | 10-20 | 20-40 |
| Newsletter subscribers via /lexique | 0-5 | 20-50 | 50-150 | 200-500 |

**Si à J+90 tu es en-dessous de J+90 row de plus de 50%**, c'est qu'il y a un blocker (technique, contenu, ou autorité). Refaire un audit à ce moment-là.

---

## Risques connus

1. **Google AI Overviews** peut remplacer les clics par des réponses directes. Tu en bénéficies si tu es cité, tu en pâtis sinon. Watch closely.
2. **Compétition agressive d'IBM/AWS/Cloudflare** sur les definitions mainstream — ne pas combattre frontalement.
3. **AI search saturation** : tout le monde optimise pour GEO maintenant. Avantage early-mover ≤ 12 mois.
4. **Risque de duplicate content** si tu copies des définitions Wikipédia. Toujours réécrire en ton Leo.

---

## Doc évolutive

Mets à jour ce fichier tous les 30 jours avec :
- Les métriques GSC réelles (vs prévisions)
- Les backlinks acquis
- Les actions qui ont marché / pas marché

Recalibrer la stratégie à J+90 quand on aura assez de data GSC.
