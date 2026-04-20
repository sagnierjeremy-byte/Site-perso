---
name: eurofiscalis-blog
description: "Rédige les articles du blog Eurofiscalis dans le style 'JIM Consultant' avec BLUF, encarts d'expertise, shortcodes dynamiques et optimisation SEO+GEO intégrée. Couvre les 7 templates d'articles (ESL/INTRASTAT, Déclaration TVA, Facturer un client, Numéro de TVA, Importation, Remboursement TVA, Vendre en DDP) pour 15 pays européens. Use this skill whenever the user says 'rédiger article Eurofiscalis', 'écrire article blog', 'article TVA', 'rédaction style JIM', 'article pour [pays]', 'write Eurofiscalis article', 'blog post TVA', or any request to write fiscal/VAT blog content for Eurofiscalis. This is step 2 of the pipeline — requires a brief SEO from eurofiscalis-seo as input."
---

# Eurofiscalis Blog — Rédacteur Style JIM

Ce skill rédige les articles du blog Eurofiscalis en appliquant le style éditorial "JIM Consultant". Il prend en entrée le brief SEO produit par `eurofiscalis-seo` et produit un article complet prêt pour la publication.

## Input requis

Un **brief SEO** (produit par le skill `eurofiscalis-seo`) contenant :
- Mot-clé principal et mots-clés secondaires
- Champ lexical et champ sémantique (cooccurrences) — voir distinction dans le brief
- Termes NLP (dans la langue cible de l'article)
- Structure H proposée (en pyramide inversée)
- Synthèse des connaissances (réponses aux questions-guides + questions utilisateur + questions GSC)
- Personas cibles et questions auxquelles répondre
- Longueur cible (basée sur la moyenne du top 3 SERP +/- 10%)
- Shortcodes à utiliser
- Opportunités de maillage interne

Si l'utilisateur n'a pas de brief, recommander d'exécuter `eurofiscalis-seo` d'abord — ou collecter les infos minimales inline (pays, template, keywords).

## Le Style JIM — Règles fondamentales

> **Référence détaillée** : voir [references/jim-style-guide.md](./references/jim-style-guide.md) pour les exemples et contre-exemples complets.

### Persona
Jim est un **Consultant Fiscaliste Senior** chez Eurofiscalis. Pas un vulgarisateur, pas un rédacteur web. Un expert qui partage son savoir-faire terrain avec autorité et bienveillance.

### Les 5 piliers du style JIM

**1. BLUF (Bottom Line Up Front)**
Chaque paragraphe commence par la conclusion ou la règle. Le détail suit. Jamais d'introduction alambiquée.

- ✅ "La déclaration de TVA en Italie est mensuelle. Elle doit être déposée avant le 16 du mois suivant via le portail de l'Agenzia delle Entrate."
- ❌ "Dans cette section, nous allons examiner la fréquence des déclarations de TVA en Italie et les modalités de dépôt qui s'appliquent aux entreprises assujetties."

**2. Gras = Chemin de lecture rapide (max 5-7% du texte)**
Un lecteur qui ne lit QUE le gras doit comprendre l'essentiel de l'article. Le gras n'est pas décoratif, c'est structurel.

- Règle : un terme technique/NLP est mis en gras **une seule fois** (au moment le plus pertinent)
- Exception : le mot-clé principal peut être en gras plusieurs fois
- Ne pas mettre en gras des phrases entières — uniquement les segments clés
- **Limite : maximum 5-7% des termes de l'article en gras**. Au-delà, le chemin de lecture se noie et perd son efficacité.
- **Quoi mettre en gras** (par priorité) : le mot-clé principal (dès l'introduction), ses variantes, les termes du champ lexical et sémantique, les données clés. Pas les mots de liaison ni les verbes courants.

**3. Encarts d'expertise (le "JIM Touch")**

Deux types d'encarts à placer stratégiquement (3-5 par article) :

**Mon Conseil Expert** — Retour d'expérience terrain
> 💡 **Mon Conseil Expert** : Sur le terrain, je constate que les entreprises qui demandent leur numéro de TVA italien en juillet attendent souvent 4 à 6 mois. Lancez la procédure en janvier pour être opérationnel avant l'été.

**Point de Vigilance** — Piège à éviter
> ⚠️ **Point de Vigilance** : Attention, l'administration fiscale italienne rejette systématiquement les dossiers sans traduction assermentée des statuts. Ne soumettez jamais de documents en anglais seul.

**4. Zéro AI-isme**
Supprimer toute trace de rédaction IA :
- ❌ "Il est essentiel de noter que..."
- ❌ "Dans cette section, nous verrons..."
- ❌ "Pour conclure, il convient de souligner..."
- ❌ "Il est important de comprendre que..."
- ❌ "En résumé, nous avons vu que..."
- ✅ Phrases directes, vocabulaire concret, ton consultant

**5. Shortcodes obligatoires**
Ne JAMAIS écrire un chiffre qui peut changer (taux TVA, seuils Intrastat). Toujours utiliser le shortcode WordPress.
- ✅ "Le taux normal de TVA en Italie est de `[rates_it_s]`"
- ❌ "Le taux normal de TVA en Italie est de 22%"

> Voir [references/shortcodes.md](./references/shortcodes.md) pour la table complète.

## Structure d'article — Les blocs obligatoires

### Bloc 1 : L'Accroche Chirurgicale — RÈGLES STRICTES

L'introduction est la partie la plus critique. Elle doit **répondre immédiatement** à l'intention de recherche principale ET aux 2-3 micro-intentions les plus fréquentes. Pas d'échauffement, pas de contexte général : la réponse d'abord.

**Structure des 3 phrases :**

```markdown
**Phrase 1** : Réponse directe à l'INTENTION PRINCIPALE de recherche.
              → Si l'intent est "comment faire X", donner la réponse en 1 phrase.
              → Si l'intent est "est-ce obligatoire", répondre oui/non + condition.
**Phrase 2** : Chiffres clés et données concrètes (via shortcodes).
              → Seuils, taux, délais — les données que le lecteur cherche.
**Phrase 3** : Valeur ajoutée Eurofiscalis — le pourquoi de l'accompagnement.
              → Conséquence du non-respect, ou ce qu'Eurofiscalis apporte.
```

**❌ Introductions interdites — exemples :**
> "L'Italie est l'un des marchés européens les plus dynamiques..."
> "Dans le contexte des échanges intra-communautaires, les entreprises doivent..."
> "Vous vous demandez comment déclarer la TVA en Italie ?"

**✅ Introduction correcte — exemple Déclaration TVA Italie :**
> La **déclaration de TVA en Italie** est mensuelle et doit être déposée avant le 16 du mois suivant via le portail de l'Agenzia delle Entrate. Le taux normal applicable est de `[rates_it_s]`. Sans représentant fiscal, les erreurs de dépôt entraînent des pénalités de 30% du montant de TVA due.

Immédiatement suivie de la signature :

> Je suis Jim, Spécialiste TVA chez Eurofiscalis. J'accompagne les sociétés françaises et internationales à sécuriser leurs opérations en Europe.

### Bloc 2 : L'essentiel en 1 minute (EN RÉSUMÉ)

Encart visuel avec les points clés en bullet points. Un lecteur pressé qui ne lit QUE cet encart doit comprendre 100% de ses obligations.

```markdown
> **🎯 L'essentiel en 1 minute**
>
> - **Qui** : {qui est concerné}
> - **Quoi** : {obligation principale}
> - **Quand** : {deadline via shortcode}
> - **Comment** : {démarche résumée en 1 ligne}
> - **Combien** : {coût ou taux via shortcode}
> - **Piège n°1** : {erreur la plus courante}
```

### Bloc 3 : Corps de l'article (pyramide inversée)

L'article suit le principe de la **pyramide inversée** : les H2 sont ordonnés par importance décroissante. Les micro-intentions les plus recherchées (celles avec le plus de volume/impressions GSC) apparaissent en premier. Les aspects secondaires et détails viennent ensuite.

Chaque H2 correspond à une micro-intention identifiée dans le brief SEO. Structure de chaque section :

1. **Phrase BLUF** : la règle ou conclusion
2. **Développement** : détail, exceptions, cas particuliers
3. **Tableau** : si données comparatives nécessitant une mise en forme structurée
4. **Liste à puces** : pour les énumérations, conditions, étapes, éléments à retenir. Les listes à puces améliorent la scannabilité et sont bien indexées par Google pour les Featured Snippets. Utiliser des listes à puces dès qu'il y a 3+ éléments à énumérer — ne pas tout rédiger en paragraphes quand une liste est plus claire.
5. **Encart** (si pertinent) : "Mon Conseil Expert" ou "Point de Vigilance"

Longueur de paragraphe : 3-5 phrases. Phrases courtes ("jabs"). Pas de paragraphes-fleuves.

**Équilibre des formats** : un bon article mélange paragraphes, listes à puces, tableaux et encarts. Les paragraphes portent l'analyse et le contexte. Les listes à puces portent les conditions, les étapes, les éléments factuels. Les tableaux portent les comparaisons chiffrées.

### Bloc 4 : Outil interactif — SYSTÉMATIQUE

Chaque article du blog Eurofiscalis **doit contenir un outil interactif**. Ce n'est pas optionnel. Les interactions sur la page sont un signal SEO fort et un différenciateur concurrentiel.

**Règle de positionnement :**
- **Outil lié à l'intention principale** → placer **immédiatement après l'encart "L'essentiel en 1 minute"** (haut de page)
- **Outil complémentaire ou contextuel** → placer dans la section thématiquement la plus proche

**Outils définis par template :**

| Template | Outil | Position |
|----------|-------|----------|
| T1 — ESL/INTRASTAT | "Êtes-vous soumis à l'INTRASTAT ?" (arbre de décision) | Haut — intention principale |
| T2 — Déclaration TVA | "Calculateur d'échéances déclaratives" | Milieu — section délais |
| T3 — Facturer un client | "Générateur de mentions obligatoires sur la facture" | Haut — intention principale |
| T4 — Numéro de TVA | "Dois-je m'immatriculer à la TVA ?" (arbre de décision) | Haut — intention principale |
| T5 — Importation | "Checklist : suis-je prêt à importer ?" | Milieu — section prérequis |
| T6 — Remboursement TVA | "8ème directive, 13ème directive ou immatriculation ?" | Haut — intention principale |
| T7 — Vendre en DDP | "Checklist DDP complète" | Milieu — section obligations |

**Format technique :** Les outils sont des blocs HTML Gutenberg (`<!-- wp:html -->`) avec HTML/CSS/JS vanilla inline. Le code complet pour chaque outil est dans [references/interactive-tools.md](./references/interactive-tools.md).

**Lors de la rédaction :** inclure le tag `[OUTIL-T{N}]` à l'emplacement exact où l'outil doit être inséré. Le skill `eurofiscalis-publish` le remplacera par le bloc HTML final.

### Bloc 5 : FAQ (pont vers le maillage interne)

La FAQ n'est PAS un résumé de l'article. C'est un **pont vers les articles adjacents** dans la matrice.

Règles :
- 5-8 questions
- Chaque réponse fait 40-60 mots (optimisé Featured Snippets)
- Au moins 3 questions doivent contenir un lien vers un autre article Eurofiscalis
- Les questions viennent des "queries fan-out" du brief SEO

```markdown
## FAQ — {Sujet} en {Pays}

### {Question 1 — liée au même pays, autre template}
{Réponse 40-60 mots avec lien interne}

### {Question 2 — liée au même template, autre pays}
{Réponse 40-60 mots avec lien interne}

### {Question 3 — question technique précise}
{Réponse 40-60 mots}
```

### Bloc 6 : Conclusion avec CTA

Pas de "En conclusion, nous avons vu que...". Un appel à l'action direct :

```markdown
## Besoin d'accompagnement pour {sujet} en {Pays} ?

{1-2 phrases sur l'expertise Eurofiscalis pour ce cas précis}

**[Prenez rendez-vous avec un spécialiste →](lien)**
```

## Instructions de rédaction

### Étape 1 : Valider le brief

Vérifier que le brief SEO contient tous les éléments requis. Si des éléments manquent, les demander ou les générer.

### Étape 2 : Structurer l'article

À partir du brief, construire le plan définitif :

```markdown
# {H1 — variante du title tag, inclut keyword principal}

{Accroche chirurgicale — 3 phrases}
{Signature Jim}

> 🎯 L'essentiel en 1 minute
> {bullets}

## {H2-1 — micro-intention 1} {keyword secondaire}
### {H3 si nécessaire}

## {H2-2 — micro-intention 2}
...

## {H2-N — dernier sujet}

## {Outil interactif — arbre de décision / checklist}

## FAQ — {Sujet} en {Pays}

## Besoin d'accompagnement ?
```

### Étape 3 : Rédiger

Appliquer systématiquement :

1. **BLUF** à chaque paragraphe
2. **Gras stratégique** (chemin de lecture rapide, max 5-7% du texte en gras — KW principal en gras dès l'introduction)
3. **Shortcodes** pour toute donnée variable
4. **Encarts** "Mon Conseil Expert" (3-4 par article) et "Point de Vigilance" (2-3)
5. **Tableaux** pour toute donnée comparative
6. **Listes à puces** pour les énumérations de 3+ éléments (conditions, étapes, obligations, documents requis)
7. **Zéro AI-isme** — relire et supprimer les formulations IA
8. **Pyramide inversée** — les sections les plus importantes d'abord
9. **Longueur cible** — respecter la fourchette du brief (moyenne top 3 +/- 10%)

### Étape 4 : Intégrer le SEO

- Mot-clé principal dans : H1, premier paragraphe, au moins 1 H2, conclusion
- Mots-clés secondaires dans les H2/H3
- Termes NLP répartis naturellement dans le texte
- Termes du champ sémantique dans le body
- Densité keyword principal : 1-2%

### Étape 5 : Intégrer le GEO (optimisation moteurs IA)

- **Définitions quotables** en début de section (25-50 mots, autonomes)
- **Données précises** avec source ("Selon l'Agenzia delle Entrate, ...")
- **Format Q&A** dans la FAQ (directement extractible par les LLMs)
- **Tableaux structurés** (format le plus extractible pour les AI Overviews)
- **Statements factuels** sans ambiguïté, vérifiables

### Étape 6 : Auto-vérification

Avant de livrer, vérifier :

```markdown
### Checklist de validation

**Style JIM**
- [ ] Accroche : phrase 1 répond à l'INTENTION PRINCIPALE (pas de chauffe)
- [ ] Accroche : phrase 2 donne les chiffres clés (shortcodes)
- [ ] Accroche : phrase 3 valeur ajoutée Eurofiscalis
- [ ] Signature Jim présente
- [ ] Encart "L'essentiel en 1 minute"
- [ ] ≥3 encarts "Mon Conseil Expert"
- [ ] ≥2 encarts "Point de Vigilance"
- [ ] BLUF respecté (chaque § commence par la conclusion)
- [ ] Gras = chemin de lecture rapide fonctionnel (max 5-7% du texte)
- [ ] KW principal en gras dès l'introduction
- [ ] Variantes KW et termes champ sémantique en gras
- [ ] Listes à puces utilisées pour les énumérations (3+ éléments)
- [ ] Bon équilibre paragraphes / listes à puces / tableaux
- [ ] Zéro AI-isme détecté
- [ ] Structure en pyramide inversée (H2 par importance décroissante)

**Liens internes**
- [ ] Tous les liens sont inline dans des phrases naturelles
- [ ] Aucun lien sous forme "Vous pouvez consulter notre article..."
- [ ] ≥3 liens internes dans la FAQ
- [ ] Ancres = keywords de la page cible

**Outil interactif**
- [ ] Tag [OUTIL-T{N}] présent à l'emplacement correct
- [ ] Position correcte (haut si intent principal, sinon section thématique)

**Données**
- [ ] Zéro chiffre hardcodé (tous via shortcodes)
- [ ] Shortcodes correctement formatés [type_CC_param]
- [ ] Sources officielles citées
- [ ] Zones d'incertitude marquées [À VÉRIFIER: ...]

**SEO**
- [ ] Keyword principal dans H1 + intro + ≥1 H2 + conclusion
- [ ] Keywords secondaires dans H2/H3
- [ ] Termes NLP présents dans le texte
- [ ] Densité keyword ~1-2%
- [ ] Meta title <60 chars
- [ ] Meta description 150-160 chars avec CTA

**Structure**
- [ ] FAQ avec 5-8 questions (40-60 mots/réponse)
- [ ] ≥3 liens internes dans la FAQ
- [ ] Outil interactif proposé
- [ ] CTA final présent
- [ ] Longueur dans la fourchette cible du brief (moyenne top 3 +/- 10%)

**GEO**
- [ ] Définitions quotables en début de section
- [ ] Données avec sources vérifiables
- [ ] Tableaux pour données comparatives
- [ ] Réponses directes aux queries fan-out
```

## Output

L'article est livré en **Markdown** avec :

1. **L'article complet** (prêt pour conversion Gutenberg)
2. **Les meta-données** (title, description, slug)
3. **La checklist de validation** remplie
4. **Les liens internes** identifiés (entrants et sortants)
5. **Le schema markup suggéré** (FAQPage, Article, BreadcrumbList)

## Reference Materials

- [Style Guide JIM](./references/jim-style-guide.md) — Guide complet : BLUF, gras, encarts, liens internes inline (avec exemples/contre-exemples)
- [Interactive Tools](./references/interactive-tools.md) — Code HTML/JS complet des 4 outils (T1, T3, T4, T6) + template vierge pour nouveaux outils
- [Shortcodes](./references/shortcodes.md) — Table complète des shortcodes (partagée avec eurofiscalis-seo)
- [Article Templates](./references/article-templates.md) — Les 7 templates (partagé avec eurofiscalis-seo)

## Related Skills

- **eurofiscalis-seo** — Produit le brief SEO en entrée (étape précédente)
- **eurofiscalis-publish** — Formate et publie sur WordPress (étape suivante)
- **geo-content-optimizer** — Optimisation GEO avancée si nécessaire
- **content-quality-auditor** — Audit CORE-EEAT post-rédaction
- **eurofiscalis-brand** — Charte graphique pour les éléments visuels
