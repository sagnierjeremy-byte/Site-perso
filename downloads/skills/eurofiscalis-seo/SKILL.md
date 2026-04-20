---
name: eurofiscalis-seo
description: "Semantic SEO analysis for Eurofiscalis blog articles on European VAT, Intrastat, importation, and fiscal compliance. Produces a complete content brief: primary/secondary keywords, NLP terms, semantic field, lexical field, cooccurrences, search intents, micro-intents, queries fan-out, competitor SERP analysis, Google Search Console data, and internal linking opportunities. Use this skill whenever the user says 'analyse sémantique', 'brief SEO', 'recherche de mots-clés', 'préparer un article', 'content brief', 'analyse SEO pour [pays]', 'keywords pour [sujet TVA]', 'semantic analysis', 'champ lexical', 'champ sémantique', or any request involving keyword research or SEO preparation for Eurofiscalis VAT/fiscal content. This is the FIRST step before writing — it feeds the eurofiscalis-blog skill."
---

# Eurofiscalis SEO — Analyse Sémantique & Brief de Contenu

Ce skill produit le brief SEO complet qui alimente la rédaction. Il remplace les phases manuelles Perplexity (recherche) → NotebookLM (synthèse) → Perplexity (analyse SEO).

## Quand utiliser ce skill

- Avant de rédiger un article du blog Eurofiscalis
- Pour analyser le champ sémantique et lexical d'un sujet TVA/fiscal pour un pays donné
- Pour produire un brief de contenu structuré avec keywords, intents, NLP
- Pour identifier les opportunités de maillage interne
- Pour analyser les SERP et la concurrence sur un mot-clé fiscal

## Inputs

L'utilisateur fournit un **prompt de briefing** qui peut contenir :

1. **Le sujet de l'article** — obligatoire (peut être un sujet libre ou correspondre à un des 7 templates)
2. **Les personas cibles** — à qui s'adresse cet article (ex: directeur financier d'une PME exportatrice, comptable en cabinet, entrepreneur e-commerce)
3. **Les questions auxquelles l'article doit répondre** — les interrogations concrètes du lecteur

Pour les articles de la matrice Eurofiscalis, le sujet peut aussi être exprimé comme :
- **Pays cible** — un des 15 pays de la matrice
- **Template d'article** — un des 7 templates (voir section ci-dessous)

Si l'utilisateur fournit un sujet libre (hors matrice), adapter le workflow en conséquence. Les personas et questions fournies par l'utilisateur enrichissent l'analyse des intentions de recherche et orientent la structure de l'article.

## Règle linguistique fondamentale

**La langue de l'article détermine la langue de toute l'analyse sémantique.**

Si l'article est rédigé en français :
- Le champ lexical doit être constitué de termes français
- Le champ sémantique et les cooccurrences doivent provenir de l'analyse des SERP françaises
- Les termes NLP doivent être ceux du contexte francophone (les entités NLP peuvent différer entre langues — ex: "autoliquidation" en français vs "reverse charge" en anglais ; les deux doivent figurer si les deux sont utilisés dans le contexte fiscal français)
- Les queries fan-out doivent être formulées en français
- Les données GSC doivent être filtrées sur les termes de la langue cible
- Les recherches SERP doivent être effectuées dans la langue cible (utiliser `gl=fr&hl=fr` ou équivalent)

> Voir [references/semantic-seo-method.md](./references/semantic-seo-method.md) pour la méthodologie complète champ lexical vs champ sémantique, cooccurrences, et application concrète.

## Les 7 Templates d'articles

> **Référence complète** : voir [references/article-templates.md](./references/article-templates.md) pour les questions-guides détaillées de chaque template.

| # | Template | Slug type | Exemple |
|---|----------|-----------|---------|
| 1 | ESL / INTRASTAT | `esl-intrastat-{pays}` | ESL et INTRASTAT en Italie |
| 2 | Déclaration de TVA | `declaration-tva-{pays}` | Déclaration de TVA en Espagne |
| 3 | Facturer un client | `facturer-client-{pays}` | Facturer un client en Allemagne |
| 4 | Numéro de TVA | `numero-tva-{pays}` | Obtenir un numéro de TVA en Pologne |
| 5 | Importation | `importer-{pays}` | Comment importer au Royaume-Uni |
| 6 | Remboursement TVA | `remboursement-tva-{pays}` | Remboursement de TVA en Allemagne |
| 7 | Vendre en DDP | `vendre-ddp-{pays}` | Vendre en DDP en Italie |

## Instructions — Workflow en 7 étapes

### Étape 1 : Recherche de sources (remplace Perplexity Phase 1)

Utiliser **WebSearch** pour collecter les sources de référence sur le sujet.

**Requêtes à lancer** (adapter au pays, template et langue cible) :
- `{sujet} {pays} réglementation {année courante}`
- `{sujet} {pays} obligations entreprises`
- `{keyword principal} guide complet`
- `site:europa.eu {sujet} {pays}`
- `site:gov.{tld pays} {sujet TVA/VAT}`

**Collecter pour chaque source** :
- URL
- Type de source (officielle/gouvernementale, cabinet concurrent, média spécialisé, institution EU)
- Pertinence (haute/moyenne/faible)
- Date de publication

**Objectif** : 8-15 sources pertinentes, dont au minimum 2 sources officielles (administrations fiscales, EUR-Lex, Commission européenne).

### Étape 2 : Données Google Search Console

Exploiter le MCP Google Search Console pour extraire les données réelles de positionnement d'Eurofiscalis sur le sujet.

#### 2.1 — Termes avec impressions et clics

Requêter la GSC pour identifier les termes liés au sujet qui génèrent déjà des impressions et/ou des clics.

> **⚠️ FILTRE LANGUE OBLIGATOIRE — RÈGLE NON NÉGOCIABLE**
>
> Ne retenir **QUE** les requêtes rédigées dans la langue cible de l'article. Si l'article est en français, **exclure systématiquement** toutes les requêtes en polonais, anglais, italien, allemand ou toute autre langue — **même si ces requêtes ont un volume élevé**.
>
> **Exemple concret** : pour un article **en français** sur la TVA en Pologne :
> - ✅ CONSERVER : "déclaration TVA Pologne", "représentant fiscal Pologne", "JPK_V7M Pologne"
> - ❌ EXCLURE : "biała lista vat", "mechanizm podzielonej płatności", "podzielona płatność od jakiej kwoty"
>
> **Pourquoi** : le site Eurofiscalis est multi-langue avec des sous-domaines séparés. Les requêtes polonaises concernent le sous-domaine polonais (pl.eurofiscalis.com), PAS le sous-domaine français. Mélanger les langues fausse l'analyse SEO.

**Méthode de filtrage** : après avoir extrait les requêtes GSC, passer chaque requête au crible :
1. La requête contient-elle des mots dans une autre langue que la langue cible ? → **EXCLURE**
2. La requête serait-elle tapée par un utilisateur de la langue cible ? → **CONSERVER**
3. Terme technique international (ex: "JPK", "INTRASTAT", "SAF-T") → **CONSERVER** seulement si le reste de la requête est dans la langue cible

**Ce qu'il faut extraire (après filtrage langue) :**
- Les requêtes **dans la langue cible uniquement** avec impressions > 0 liées au sujet
- Le nombre d'impressions, clics, CTR et position moyenne pour chaque requête
- Les requêtes à fort potentiel (impressions élevées mais CTR faible = opportunité)
- Si **aucune requête** en langue cible n'est trouvée → le signaler explicitement comme opportunité (marché non adressé)

**Comment utiliser ces données :**
- Intégrer les termes à forte impression comme mots-clés secondaires ou dans le champ sémantique
- Prioriser les termes où Eurofiscalis est déjà visible (position 5-20) car le nouvel article peut les renforcer
- Identifier les requêtes où le CTR est faible malgré des impressions : le contenu actuel ne répond pas bien à l'intention

#### 2.2 — Questions des utilisateurs

Filtrer les requêtes GSC avec le regex suivant pour détecter les questions :

```regex
\b(Qui|Quoi|Comment|Pourquoi|Où|Quand|Combien|Quel|Quelle|Lesquels|Lesquelles|Lequel|Laquelle)\b
```

**Ce qu'il faut faire avec les questions détectées :**
- Si une question a un volume significatif d'impressions → l'intégrer comme **H2 ou H3** dans la structure de l'article
- Si la question est secondaire → l'intégrer dans la **FAQ** de l'article
- Toujours vérifier que la question correspond au sujet de l'article (pas de hors-sujet)

**Format de sortie :**
```markdown
| Question GSC | Impressions | Clics | Position | Action recommandée |
|-------------|-------------|-------|----------|--------------------|
| Comment déclarer la TVA en Italie | 450 | 12 | 8.3 | → H2 |
| Quel taux de TVA en Italie | 220 | 5 | 15.2 | → H3 ou FAQ |
| ... | ... | ... | ... | ... |
```

### Étape 3 : Synthèse des connaissances (remplace NotebookLM)

Pour chaque **question-guide du template** (voir [references/article-templates.md](./references/article-templates.md)) ET pour les questions fournies par l'utilisateur dans son prompt :

1. **Lire les sources** via WebFetch sur les 5-8 meilleures URLs
2. **Synthétiser** la réponse factuelle à chaque question
3. **Identifier les données dynamiques** → remplacer par les shortcodes appropriés :
   - Seuils Intrastat : `[intrastat_XX_imp]`, `[intrastat_XX_exp]`, `[intrastat_XX_dl]`
   - Taux de TVA : `[rates_XX_s]`, `[rates_XX_r1]`, `[rates_XX_r2]`, `[rates_XX_sr]`
   - Voir [references/shortcodes.md](./references/shortcodes.md) pour la table complète
4. **Marquer les zones d'incertitude** avec `[À VÉRIFIER: ...]` quand la source est ambiguë ou potentiellement obsolète

**Intégrer les personas** : adapter la profondeur et l'angle des réponses en fonction des personas identifiés dans le prompt. Un directeur financier a besoin de chiffres et d'obligations ; un comptable a besoin de processus techniques ; un entrepreneur e-commerce a besoin de cas pratiques.

**Format de sortie pour chaque question** :
```markdown
### Q: {question-guide}
**Réponse synthèse** : {réponse factuelle, 100-300 mots}
**Sources** : [Source 1](url), [Source 2](url)
**Shortcodes utilisés** : [rates_XX_s], etc.
**Alertes** : [À VÉRIFIER: ...] le cas échéant
```

### Étape 4 : Analyse SEO sémantique approfondie

C'est le cœur du skill. Produire l'analyse complète en 8 livrables. **Toute l'analyse doit être conduite dans la langue cible de l'article** (voir Règle linguistique fondamentale).

> **Méthodologie détaillée** : lire [references/semantic-seo-method.md](./references/semantic-seo-method.md) pour la distinction champ lexical vs champ sémantique, la méthode d'extraction des cooccurrences, et les principes du SEO sémantique.

#### 4.1 — Mot-clé principal
Identifier LE mot-clé principal (celui qui sera dans le H1 et le title tag).

Critères de sélection :
- Volume de recherche estimé (utiliser Google Trends MCP si disponible, sinon estimer)
- Pertinence métier Eurofiscalis
- Difficulté estimée
- Intent match avec le template
- **Données GSC** : si ce terme génère déjà des impressions, c'est un signal fort

#### 4.2 — Mots-clés secondaires (8-15)
Liste de mots-clés à intégrer naturellement dans les H2/H3 et le body. Inclure les termes issus de la GSC qui ont des impressions significatives.

Format :
```markdown
| Mot-clé secondaire | Volume estimé | Source (analyse/GSC) | Où placer |
|--------------------|---------------|----------------------|-----------|
| déclaration tva italie | élevé | GSC (320 imp) | H2 |
| ... | ... | ... | ... |
```

#### 4.3 — Champ lexical (15-25 termes)
Les termes **de la même famille sémantique** que le mot-clé principal : synonymes, variantes morphologiques, reformulations, termes directement associés.

Ce sont les mots que le lecteur utiliserait naturellement pour parler du même sujet.

```markdown
| Terme du champ lexical | Relation avec le KW principal |
|------------------------|-------------------------------|
| déclaration fiscale | synonyme |
| dépôt de TVA | variante |
| ... | ... |
```

#### 4.4 — Champ sémantique et cooccurrences (20-40 termes)
L'univers de sens élargi autour du sujet. Inclut les **cooccurrences statistiques** — les termes qui apparaissent fréquemment dans les pages les mieux positionnées sur le sujet.

**Méthode :** analyser les contenus du top 5-10 SERP via WebFetch et identifier les termes récurrents qui ne sont pas des synonymes directs mais que Google "attend" dans un article exhaustif.

Classer par importance :
```markdown
| Terme sémantique / cooccurrence | Fréquence top 10 | Importance |
|---------------------------------|------------------|------------|
| Agenzia delle Entrate | 9/10 pages | haute |
| codice fiscale | 7/10 pages | haute |
| ... | ... | ... |
```

#### 4.5 — Intentions de recherche
Classifier l'intent principal et les intents secondaires. Intégrer les personas fournis par l'utilisateur pour affiner la compréhension des intentions.

| Intent | Type | Persona concerné | Exemples de requêtes |
|--------|------|-------------------|---------------------|
| Principal | Informationnel / Transactionnel / Commercial | ... | ... |
| Secondaire 1 | ... | ... | ... |
| Secondaire 2 | ... | ... | ... |

#### 4.6 — Micro-intentions de recherche (8-12)
Les sous-questions implicites que le lecteur a en tête. Chaque micro-intention devient potentiellement un H2 ou H3. Les questions issues de la GSC (Étape 2.2) viennent enrichir cette liste.

```markdown
1. [Micro-intent] → correspond au H2 "..." → source: analyse
2. [Micro-intent] → correspond au H2 "..." → source: GSC (220 impressions)
...
```

#### 4.7 — Termes NLP
Les entités, relations et concepts que les moteurs NLP (Google BERT/MUM, LLMs) extraient du texte. Structurer par catégorie. **Utiliser les termes dans la langue cible** (et ajouter l'équivalent anglais entre parenthèses uniquement si le terme anglais est aussi utilisé dans le contexte francophone).

| Catégorie | Termes NLP |
|-----------|------------|
| Entités (organismes) | {nom administration fiscale}, Commission européenne, ... |
| Entités (réglementations) | Directive 2006/112/CE, {loi locale}, ... |
| Concepts fiscaux | fait générateur, exigibilité, base imposable, ... |
| Processus | immatriculation, dépôt, liquidation, remboursement, ... |
| Acteurs | assujetti, représentant fiscal, mandataire, ... |

#### 4.8 — Queries Fan-Out (15-25 requêtes)
Les requêtes longue traîne que les utilisateurs tapent réellement. **Formulées dans la langue cible.** Inclure :
- Questions "Comment..." / "Pourquoi..."
- Questions "Quel..." / "Combien..."
- Requêtes comparatives "{pays} vs {pays}"
- Requêtes problème/solution ("pénalité retard TVA {pays}")
- **Questions issues de la GSC** (Étape 2.2) — les intégrer systématiquement

### Étape 5 : Analyse SERP et concurrence

1. **Lancer WebSearch** sur le mot-clé principal (dans la langue cible)
2. **Analyser les 5-10 premiers résultats** :
   - Type de contenu (guide, FAQ, page service, article)
   - **Nombre de mots** (mesurer ou estimer pour les 3 premiers résultats)
   - Structure (nombre de H2, présence FAQ, tables, outils, listes à puces)
   - Domaine (concurrent direct, institution, média)
3. **Calculer la longueur cible** : moyenne du nombre de mots du top 3, puis appliquer **+/- 10%**. Exemple : si le top 3 fait en moyenne 2800 mots → cible = 2520-3080 mots.
4. **Identifier les gaps** : ce que les concurrents ne couvrent pas et qu'Eurofiscalis peut apporter (expertise terrain, shortcodes dynamiques, outils interactifs)
5. **Détecter les SERP features** : Featured snippets, PAA (People Also Ask), AI Overviews

### Étape 6 : Structure H en pyramide inversée

Construire le plan Hn de l'article en appliquant le principe de la **pyramide inversée** : les informations les plus importantes et les intentions de recherche principales doivent apparaître en premier dans la structure.

**Principes de la pyramide inversée :**
- Le H1 + l'introduction répondent immédiatement à l'intention principale
- Les premiers H2 traitent les micro-intentions les plus recherchées (celles avec le plus de volume/impressions GSC)
- Les H2 suivants couvrent les aspects secondaires et les détails
- La FAQ et le CTA viennent en fin d'article

**Mapper chaque H2/H3 à :**
- Une micro-intention identifiée (Étape 4.6)
- Des termes du champ sémantique à intégrer dans cette section
- Des termes du champ lexical à utiliser
- Des shortcodes si des données variables sont concernées

```markdown
## Structure H proposée (pyramide inversée)

H1 : {reprend le title, variante, inclut KW principal}

H2-1 : {micro-intention #1 — la plus recherchée} → KW secondaire: "..."
  H3 : {sous-aspect}
  H3 : {sous-aspect}

H2-2 : {micro-intention #2 — deuxième plus recherchée} → KW secondaire: "..."
  H3 : {sous-aspect}

[... H2 ordonnés par importance décroissante ...]

H2-N : {aspect secondaire}

H2 : FAQ — {Sujet} en {Pays}
  H3 : {question 1 — issue GSC ou queries fan-out}
  H3 : {question 2}
  ...

H2 : Besoin d'accompagnement ?
```

### Étape 7 : Opportunités de maillage interne

Identifier les articles existants sur eurofiscalis.com qui devront être liés depuis/vers le nouvel article.

**Méthode** :
1. `WebSearch` : `site:eurofiscalis.com {pays}` et `site:eurofiscalis.com {sujet}`
2. Lister les URLs trouvées avec leur titre
3. Proposer les ancres de lien et la direction (entrant/sortant)

Format :
```markdown
| Article existant | URL | Direction | Ancre suggérée |
|-----------------|-----|-----------|----------------|
| Numéro TVA Italie | /numero-tva-italie/ | sortant | "obtenir votre numéro de TVA en Italie" |
| ... | ... | ... | ... |
```

## Livrable final — Le Brief SEO

Assembler toutes les étapes en un document structuré unique.

```markdown
# Brief SEO — {Sujet} : {Pays}
Date : {date du jour}

## 0. Contexte
- **Sujet** : {sujet de l'article}
- **Personas cibles** : {personas identifiés}
- **Questions à traiter** : {questions fournies par l'utilisateur + questions GSC}
- **Langue** : {langue de rédaction}

## 1. Méta-données cibles
- **Title tag** : {proposition, <60 chars, keyword en tête}
- **Meta description** : {proposition, 150-160 chars, CTA inclus}
- **Slug** : /{slug proposé}/
- **Mot-clé principal** : {keyword}

## 2. Structure H proposée (pyramide inversée)
- H1 : {reprend le title, variante}
- H2 : {micro-intention #1 — la plus recherchée}
  - H3 : {sous-sections}
- H2 : {micro-intention #2}
  ...
- H2 : FAQ
  - H3 : {questions FAQ — incluant questions GSC}
- H2 : CTA

## 3. Données Google Search Console
{Étape 2 — termes avec impressions/clics + questions filtrées}

## 4. Analyse sémantique complète
{Sections 4.1 à 4.8 — champ lexical, champ sémantique, cooccurrences, NLP, intents}

## 5. Synthèse des connaissances
{Résumé des réponses aux questions-guides, Étape 3}

## 6. Analyse concurrentielle
{Étape 5 — incluant longueur cible calculée sur top 3 +/- 10%}

## 7. Maillage interne
{Étape 7}

## 8. Sources collectées
{Liste complète avec URLs, Étape 1}

## 9. Shortcodes à utiliser
{Liste des shortcodes pertinents pour cet article}

## 10. Directives de rédaction
- Longueur cible : {X mots — moyenne top 3 +/- 10%}
- Nombre de H2 minimum : {X}
- FAQ : {X questions minimum — inclure les questions GSC}
- Shortcodes obligatoires : {liste}
- Outils/interactifs suggérés : {arbre de décision, simulateur, checklist}
- Gras : max 5-7% des termes (KW principal + variantes + termes champ sémantique)
- Listes à puces : utiliser pour les énumérations, les étapes, les conditions
- Structure : pyramide inversée (H2 par importance décroissante)
```

## Validation finale

Avant de livrer le brief, vérifier :
- [ ] Mot-clé principal identifié avec justification
- [ ] Au moins 10 mots-clés secondaires
- [ ] Au moins 15 termes du champ lexical
- [ ] Au moins 20 termes du champ sémantique / cooccurrences
- [ ] Au moins 15 queries fan-out
- [ ] Toutes les questions-guides du template couvertes en synthèse
- [ ] Questions de l'utilisateur et questions GSC intégrées
- [ ] Au moins 2 sources officielles dans les références
- [ ] Shortcodes identifiés (aucun chiffre hardcodé)
- [ ] Au moins 3 opportunités de maillage interne
- [ ] Structure H en pyramide inversée avec micro-intents mappés
- [ ] Longueur cible = moyenne top 3 +/- 10%
- [ ] Meta title <60 chars et meta description 150-160 chars
- [ ] Analyse sémantique dans la langue cible de l'article
- [ ] Données GSC exploitées (termes + questions)
- [ ] Personas cibles identifiés et pris en compte

## Intégration MCP

**Google Search Console** : Exploiter systématiquement pour chaque brief. Extraire les requêtes avec impressions/clics sur le sujet, filtrer les questions françaises avec le regex `\b(Qui|Quoi|Comment|Pourquoi|Où|Quand|Combien|Quel|Quelle|Lesquels|Lesquelles|Lequel|Laquelle)\b`. Les données GSC sont un input prioritaire pour la structure et la FAQ.

**Google Trends** (si connecté) : Valider les volumes relatifs et la saisonnalité des keywords principaux. Comparer les variantes de formulation.

**Google Ads** (si connecté) : Récupérer les volumes de recherche exacts, CPC, et niveau de concurrence pour affiner la priorisation des keywords.

## Reference Materials

- [Article Templates](./references/article-templates.md) — Les 7 templates avec toutes les questions-guides
- [Shortcodes](./references/shortcodes.md) — Table complète des shortcodes Intrastat et TVA
- [Méthodologie ThotSEO](./references/thotseo-method.md) — Les 7 étapes de la méthode de rédaction SEO
- [Méthodologie SEO Sémantique](./references/semantic-seo-method.md) — Champ lexical vs champ sémantique, cooccurrences, règles linguistiques

## Related Skills

- **eurofiscalis-blog** — Utilise ce brief pour rédiger l'article (étape suivante)
- **eurofiscalis-publish** — Formate et publie sur WordPress (étape finale)
- **geo-content-optimizer** — Optimisation GEO/AEO à appliquer après rédaction
