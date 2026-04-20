---
name: eurofiscalis-content-refresh
description: "Actualise et optimise un article Eurofiscalis existant. Lit l'article depuis son URL, identifie les données obsolètes (chiffres hardcodés, réglementations changées), refait une analyse SEO fraîche, et réécrit l'article complet en style JIM avec shortcodes. L'article reste sur la même URL. Use this skill whenever the user says 'actualiser article', 'mettre à jour article', 'rafraîchir contenu', 'optimiser article existant', 'refresh article', 'update article', 'réécrire article existant', 'article obsolète', 'moderniser article', 'remplacer chiffres par shortcodes', or any request to update, refresh, or optimize an existing Eurofiscalis blog article. Also trigger when the user provides a eurofiscalis.com URL and asks for improvements."
---

# Eurofiscalis Content Refresh — Actualisation & Optimisation

Ce skill prend un article Eurofiscalis existant (via URL), l'analyse, identifie tout ce qui doit être mis à jour (données, SEO, style), et produit une version actualisée complète en style JIM. L'article reste sur la même URL — c'est une mise à jour en place, pas un nouvel article.

## Pourquoi ce skill ?

Les articles du blog Eurofiscalis vivent longtemps. Les taux de TVA changent, les seuils INTRASTAT évoluent, les réglementations sont modifiées. Certains anciens articles ont été rédigés avant l'adoption du style JIM et des shortcodes dynamiques. Ce skill modernise tout d'un coup : données, SEO, style, shortcodes.

## Input requis

1. **URL de l'article** — obligatoire. L'URL de la page sur eurofiscalis.com (ou sous-domaine)
2. **Modifications métier** (optionnel) — l'utilisateur peut fournir une liste de changements à apporter :
   - Nouvelles règles ou réglementations
   - Données obsolètes à corriger
   - Sections à ajouter ou supprimer
   - Informations complémentaires issues du terrain

Si l'utilisateur ne fournit pas de modifications métier, le skill détecte les problèmes automatiquement et les soumet pour validation.

## Workflow en 6 phases

### Phase 1 : Lecture et audit de l'article existant

#### 1.1 — Récupérer l'article

Utiliser **WebFetch** sur l'URL fournie pour récupérer le contenu de l'article existant. Extraire :
- Le contenu textuel complet (tous les paragraphes)
- La structure H (H1, H2, H3...)
- Les meta-données (title tag, meta description)
- Le slug actuel
- Les liens internes présents
- Les images et leur alt text

#### 1.2 — Audit automatique

Analyser l'article sur 4 axes et produire un **rapport d'audit** :

**Axe 1 — Données obsolètes**

| Ce qu'on cherche | Comment détecter | Action |
|------------------|------------------|--------|
| Chiffres hardcodés (taux TVA, seuils) | Rechercher les pourcentages, montants en € et valeurs numériques qui devraient être des shortcodes | → Remplacer par shortcodes |
| Dates et années obsolètes | Rechercher les mentions d'années passées ("en 2023", "depuis 2022") | → Mettre à jour ou rendre intemporel |
| Réglementations modifiées | Croiser avec les sources officielles via WebSearch | → Corriger avec source |
| Liens morts | Vérifier les liens externes | → Remplacer ou supprimer |

**Axe 2 — Conformité style JIM**

| Critère | Conforme ? | Détail |
|---------|------------|--------|
| Accroche chirurgicale (3 phrases BLUF) | ✅/❌ | L'intro répond-elle directement à l'intention ? |
| Signature Jim | ✅/❌ | Présente après l'accroche ? |
| L'essentiel en 1 minute | ✅/❌ | Encart présent avec les 6 points ? |
| BLUF à chaque paragraphe | ✅/❌ | Chaque § commence par la conclusion ? |
| Gras = chemin de lecture (max 5-7%) | ✅/❌ | Test du survol : l'essentiel compréhensible ? |
| Encarts Mon Conseil Expert (≥3) | ✅/❌ | Nombre trouvé : X |
| Encarts Point de Vigilance (≥2) | ✅/❌ | Nombre trouvé : X |
| Shortcodes (zéro chiffre hardcodé) | ✅/❌ | Nombre de chiffres hardcodés trouvés : X |
| Zéro AI-isme | ✅/❌ | Formulations IA détectées : ... |
| Listes à puces (énumérations 3+) | ✅/❌ | Paragraphes qui devraient être des listes : X |
| Outil interactif | ✅/❌ | Tag [OUTIL-TX] ou bloc HTML présent ? |
| FAQ (5-8 questions, 40-60 mots) | ✅/❌ | Nombre de questions FAQ : X |
| CTA final | ✅/❌ | Présent ? |

**Axe 3 — SEO on-page**

| Critère | État actuel |
|---------|-------------|
| KW principal dans H1 | ✅/❌ — KW détecté : "..." |
| KW dans intro | ✅/❌ |
| KW dans ≥1 H2 | ✅/❌ |
| Meta title (<60 chars) | Actuel : "..." ({N} chars) |
| Meta description (150-160 chars) | Actuelle : "..." ({N} chars) |
| Structure pyramide inversée | ✅/❌ — Les H2 sont-ils ordonnés par importance ? |
| Nombre de mots | Actuel : {N} mots |

**Axe 4 — Contenu manquant**

- Sujets couverts par les concurrents mais absents de l'article
- Questions PAA (People Also Ask) non traitées
- Micro-intentions non couvertes

#### 1.3 — Score d'actualisation

Attribuer un score synthétique :

```markdown
## Score d'actualisation

| Axe | Score | Priorité |
|-----|-------|----------|
| Données obsolètes | X/10 | 🔴 Critique / 🟡 Moyen / 🟢 OK |
| Style JIM | X/10 | 🔴 / 🟡 / 🟢 |
| SEO on-page | X/10 | 🔴 / 🟡 / 🟢 |
| Contenu manquant | X/10 | 🔴 / 🟡 / 🟢 |
| **Score global** | **X/40** | |

Verdict : {REFONTE COMPLÈTE / MISE À JOUR IMPORTANTE / AJUSTEMENTS MINEURS}
```

### Phase 2 : Intégration des modifications métier de l'utilisateur

Si l'utilisateur a fourni des modifications métier :
1. Les intégrer dans le rapport d'audit
2. Marquer chaque modification avec sa source : `[UTILISATEUR]` vs `[AUDIT AUTO]`

Si l'utilisateur n'a pas fourni de modifications :
1. Présenter le rapport d'audit
2. Demander : "Voici l'audit de l'article. Avez-vous des modifications métier supplémentaires à apporter (nouvelles règles, données à corriger, sections à ajouter) ?"

**POINT D'ARRÊT N°1** : attendre la validation de l'audit et les éventuelles modifications métier avant de continuer.

### Phase 3 : Analyse SEO fraîche dans la langue de l'article

Appliquer la **méthodologie complète du skill `eurofiscalis-seo`** pour produire un brief SEO actualisé. L'article existant donne le sujet — tout le travail SEO est refait à neuf.

> **Lire** le SKILL.md de `eurofiscalis-seo` pour le workflow complet (7 étapes).

**Adaptations spécifiques au refresh :**

1. **Conserver le slug existant** — ne pas proposer un nouveau slug. L'URL ne change pas.

2. **Analyser le positionnement actuel** — via GSC, identifier :
   - Les requêtes sur lesquelles l'article se positionne déjà
   - Les positions actuelles et leur évolution
   - Les requêtes perdues (l'article s'est déclassé) → opportunité de récupération
   - Les nouvelles requêtes apparues depuis la publication

3. **Comparer avec la SERP actuelle** — le paysage SEO a peut-être changé :
   - Nouveaux concurrents apparus
   - Longueur des articles concurrents (recalculer la cible : moyenne top 3 +/- 10%)
   - Nouvelles SERP features (PAA, AI Overviews)
   - Mots-clés secondaires qui n'existaient pas à l'époque

4. **Identifier les acquis SEO à préserver** — certains éléments de l'article actuel performent bien :
   - H2 qui rankent sur des requêtes spécifiques → les conserver (même reformulés)
   - Sections qui génèrent des Featured Snippets → ne pas casser la structure
   - Liens internes entrants → vérifier que les ancres restent cohérentes

**Livrable Phase 3** : un Brief SEO complet au format `eurofiscalis-seo`, avec une section supplémentaire "Acquis SEO à préserver".

**POINT D'ARRÊT N°2** : présenter le brief SEO pour validation avant de rédiger.

### Phase 4 : Rédaction de l'article actualisé

Appliquer la **méthodologie complète du skill `eurofiscalis-blog`** pour réécrire l'article.

> **Lire** le SKILL.md de `eurofiscalis-blog` et `references/jim-style-guide.md`.

**Adaptations spécifiques au refresh :**

1. **Réutiliser le contenu métier valide** — les informations factuelles de l'article original qui sont toujours correctes sont réintégrées (pas besoin de tout réécrire si le fond est bon). En revanche, le style, la structure et le SEO sont reconstruits.

2. **Remplacer TOUS les chiffres hardcodés par des shortcodes** — c'est la priorité n°1. Chaque taux de TVA, seuil INTRASTAT, délai ou montant qui peut changer doit devenir un shortcode.

3. **Marquer les changements majeurs** — dans le livrable, utiliser un système de marquage pour que Jim puisse voir ce qui a changé :
   - `[NOUVEAU]` — section entièrement nouvelle
   - `[RÉÉCRIT]` — section existante réécrite (style, structure, ou fond)
   - `[DONNÉES MÀJ]` — données factuelles mises à jour
   - `[SHORTCODE]` — chiffre hardcodé remplacé par un shortcode
   - `[CONSERVÉ]` — section conservée telle quelle (ou quasi)

4. **Conserver la langue de l'article original** — si l'article est en français, rester en français. Si l'article est en allemand, rester en allemand. Appliquer les adaptations linguistiques de `eurofiscalis-transcreation/references/language-adaptations.md` si la langue n'est pas le français.

### Phase 5 : Diff visuel avant/après

Produire un comparatif clair entre l'ancien et le nouvel article pour que Jim puisse valider les changements.

**Format du diff :**

```markdown
## Comparatif avant/après

### Meta-données
| Élément | Avant | Après |
|---------|-------|-------|
| Title tag | "{ancien}" | "{nouveau}" |
| Meta description | "{ancienne}" | "{nouvelle}" |
| Slug | /{slug}/ | /{même slug}/ (inchangé) |

### Structure H
| Avant | Après | Changement |
|-------|-------|------------|
| H1: {ancien} | H1: {nouveau} | RÉÉCRIT |
| H2: {ancien} | H2: {nouveau} | RÉÉCRIT |
| — | H2: {nouveau} | NOUVEAU |
| H2: {ancien} | — | SUPPRIMÉ |
| ... | ... | ... |

### Données mises à jour
| Donnée | Avant (hardcodé) | Après (shortcode) |
|--------|-------------------|-------------------|
| Taux TVA normal | "22%" | [rates_it_s] |
| Seuil INTRASTAT | "400 000 €" | [intrastat_it_imp] |
| ... | ... | ... |

### Statistiques
| Métrique | Avant | Après |
|----------|-------|-------|
| Nombre de mots | {N} | {N} |
| Nombre de H2 | {N} | {N} |
| Shortcodes utilisés | {N} | {N} |
| Encarts Expert | {N} | {N} |
| Encarts Vigilance | {N} | {N} |
| Liens internes | {N} | {N} |
| Questions FAQ | {N} | {N} |
```

### Phase 6 : Checklist de validation finale

```markdown
### Checklist de validation — Content Refresh

**Données**
- [ ] Tous les chiffres hardcodés remplacés par des shortcodes
- [ ] Réglementations vérifiées et à jour
- [ ] Modifications métier de l'utilisateur intégrées
- [ ] Sources officielles citées
- [ ] Zones [À VÉRIFIER] signalées si incertitude

**Style JIM**
- [ ] Accroche chirurgicale (3 phrases)
- [ ] Signature Jim
- [ ] L'essentiel en 1 minute
- [ ] BLUF à chaque paragraphe
- [ ] Gras max 5-7% (chemin de lecture)
- [ ] ≥3 encarts Mon Conseil Expert
- [ ] ≥2 encarts Point de Vigilance
- [ ] Listes à puces pour énumérations 3+
- [ ] Zéro AI-isme
- [ ] Pyramide inversée

**SEO**
- [ ] KW principal dans H1 + intro + ≥1 H2 + conclusion
- [ ] KW secondaires dans H2/H3
- [ ] Champ lexical intégré
- [ ] Champ sémantique / cooccurrences
- [ ] Termes NLP répartis
- [ ] Longueur dans la fourchette cible (top 3 +/- 10%)
- [ ] Meta title <60 chars
- [ ] Meta description 150-160 chars
- [ ] Slug inchangé

**Acquis SEO**
- [ ] H2/sections performantes conservées ou améliorées
- [ ] Ancres de liens internes entrants toujours cohérentes
- [ ] Featured Snippets préservés

**Structure**
- [ ] FAQ 5-8 questions (40-60 mots/réponse)
- [ ] ≥3 liens internes dans la FAQ
- [ ] Outil interactif [OUTIL-TX] présent
- [ ] CTA final
```

## Livrable final

L'article actualisé est livré avec :

1. **Le rapport d'audit** (Phase 1) — score d'actualisation
2. **Le brief SEO actualisé** (Phase 3) — validé par l'utilisateur
3. **L'article complet réécrit** en Markdown (Phase 4) — avec marqueurs de changement
4. **Le diff visuel avant/après** (Phase 5) — pour validation rapide
5. **La checklist de validation** remplie (Phase 6)
6. **Les meta-données** actualisées (title, description, slug inchangé)

L'article est directement compatible avec `eurofiscalis-publish` pour la mise à jour sur WordPress.

## Intégration avec le pipeline existant

```
Pipeline refresh : eurofiscalis-content-refresh → eurofiscalis-publish
```

Ce skill remplace les étapes `eurofiscalis-seo` + `eurofiscalis-blog` quand on part d'un article existant plutôt que de zéro. L'article produit va directement dans `eurofiscalis-publish` pour la mise à jour WordPress.

## Reference Materials

Ce skill réutilise les références des skills existants :

- **eurofiscalis-seo** → méthodologie SEO complète (7 étapes), shortcodes, méthode sémantique
- **eurofiscalis-blog** → style JIM, outils interactifs, guide de rédaction
- **eurofiscalis-transcreation** → adaptations linguistiques (si l'article n'est pas en français)

## Related Skills

- **eurofiscalis-seo** — Méthodologie SEO réutilisée en Phase 3
- **eurofiscalis-blog** — Style de rédaction réutilisé en Phase 4
- **eurofiscalis-publish** — Étape suivante : mise à jour WordPress
- **eurofiscalis-transcreation** — Adaptations linguistiques si article non-français
- **content-quality-auditor** — Audit CORE-EEAT complémentaire si nécessaire
