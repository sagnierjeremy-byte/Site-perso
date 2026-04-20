# Méthodologie ThotSEO — Les 7 étapes de la rédaction SEO

Source : Bible de la rédaction SEO (ThotSEO). Adaptée au contexte Eurofiscalis.

---

## Vue d'ensemble

La méthode ThotSEO structure la création de contenu SEO en 7 étapes séquentielles. Chaque étape produit un livrable qui alimente la suivante. Le skill `eurofiscalis-seo` couvre les étapes 1-4 (analyse). Le skill `eurofiscalis-blog` couvre les étapes 5-6 (rédaction). Le skill `eurofiscalis-publish` couvre l'étape 7 (publication).

## Étape 1 : Étude du mot-clé principal

**Objectif** : Identifier le mot-clé principal autour duquel construire l'article.

- Analyser le volume de recherche (Google Trends, Google Ads Keyword Planner)
- Évaluer la difficulté de positionnement
- Vérifier l'adéquation avec l'intention de recherche
- S'assurer que le mot-clé correspond à l'expertise Eurofiscalis

**Livrable** : Mot-clé principal validé + intent classifié

## Étape 2 : Analyse des SERP

**Objectif** : Comprendre ce que Google valorise actuellement pour ce mot-clé.

- Analyser les 10 premiers résultats Google
- Identifier le type de contenu qui ranke (guide, liste, FAQ, page service)
- Mesurer la longueur moyenne des contenus positionnés
- Repérer les SERP features (Featured Snippets, PAA, AI Overview)
- Identifier les angles non couverts par la concurrence

**Livrable** : Rapport SERP avec gaps identifiés

## Étape 3 : Construction du champ sémantique

**Objectif** : Cartographier l'univers sémantique complet du sujet.

### 3.1 Mots-clés secondaires
Termes que Google associe fortement au mot-clé principal. Ils structurent les H2/H3.

### 3.2 Termes NLP (Natural Language Processing)
Les entités et concepts que les algorithmes NLP de Google (BERT, MUM) identifient :
- Entités nommées (organisations, lois, personnes)
- Concepts techniques (fait générateur, exigibilité, base imposable)
- Relations sémantiques (X est obligatoire pour Y, X remplace Y)

### 3.3 Champ lexical élargi
Synonymes, variantes, co-occurrences qui enrichissent le texte sans keyword stuffing.

### 3.4 Queries Fan-Out
Les requêtes longue traîne que les utilisateurs tapent réellement. Elles alimentent :
- Les sections FAQ
- Les encarts "Point de Vigilance"
- Les sous-titres H3

**Livrable** : Tableau sémantique complet (mots-clés, NLP, champ lexical, queries)

## Étape 4 : Architecture du contenu

**Objectif** : Structurer l'article avant la rédaction.

- Mapper chaque micro-intention à un H2/H3
- Définir l'ordre logique des sections
- Placer les shortcodes aux emplacements appropriés
- Identifier les emplacements pour les outils interactifs (arbres de décision, simulateurs)
- Planifier le maillage interne (liens entrants et sortants)

**Livrable** : Plan H détaillé avec annotations

## Étape 5 : Rédaction (skill eurofiscalis-blog)

**Objectif** : Écrire l'article en style "JIM Consultant".

- Appliquer le BLUF (Bottom Line Up Front) à chaque paragraphe
- Utiliser les encarts "Mon Conseil Expert" et "Point de Vigilance"
- Intégrer les shortcodes (jamais de valeurs hardcodées)
- Créer le TL;DR "L'essentiel en 1 minute"
- Rédiger la FAQ (pont vers d'autres articles)
- Maintenir le chemin de lecture rapide (gras stratégique)

**Livrable** : Article complet en Markdown

## Étape 6 : Optimisation SEO & GEO (skill eurofiscalis-blog)

**Objectif** : Affiner l'article pour le référencement classique et l'optimisation pour les moteurs IA.

- Vérifier la densité des mots-clés (1-2% keyword principal)
- S'assurer que tous les termes NLP sont présents
- Optimiser pour les Featured Snippets (définitions en 40-60 mots, listes, tableaux)
- Ajouter les signaux EEAT (signature Jim, citations sources officielles, dates)
- Optimiser pour GEO (statements quotables, données précises avec sources)
- Vérifier le title tag (<60 chars) et la meta description (150-160 chars)

**Livrable** : Article optimisé + checklist SEO/GEO validée

## Étape 7 : Publication WordPress (skill eurofiscalis-publish)

**Objectif** : Formater et publier l'article sur WordPress.

- Convertir en blocs Gutenberg
- Configurer SureRank (plugin SEO)
- Insérer le maillage interne final (basé sur le sitemap XML)
- Ajouter les balises hreflang pour les versions pays
- Configurer le schema markup (Article, FAQPage, BreadcrumbList)

**Livrable** : Article publié sur WordPress

---

## Principes transversaux

### Zéro hardcoding
Toute donnée susceptible de changer (seuils, taux, dates) DOIT utiliser un shortcode.

### EEAT comme fil rouge
Chaque section doit renforcer l'un des piliers EEAT :
- **Experience** : Encarts "Mon Conseil Expert" (vécu terrain)
- **Expertise** : Précision des données, terminologie exacte
- **Authoritativeness** : Citations de sources officielles (admin. fiscales, EUR-Lex)
- **Trust** : Signature Jim, transparence sur les limites, dates de mise à jour

### Scannabilité
Un lecteur pressé doit pouvoir comprendre l'article en ne lisant que :
1. Le TL;DR "L'essentiel en 1 minute"
2. Les titres H2/H3
3. Les mots en gras
4. Les encarts "Mon Conseil Expert" et "Point de Vigilance"
