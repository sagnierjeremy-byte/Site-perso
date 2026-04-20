---
name: eurofiscalis-transcreation
description: "Agent de transcréation SEO pour Eurofiscalis. Transforme un article source (Word, toute langue) en un article optimisé SEO dans la langue cible, en conservant l'exactitude métier mais en reconstruisant entièrement la structure, le SEO et le style JIM. Multi-directionnel : EN→FR, FR→DE, IT→FR, PL→EN, etc. Use this skill whenever the user says 'transcréation', 'traduire article', 'adapter article', 'translate article', 'réécrire dans une autre langue', 'article à partir de', 'transcrire article', 'convertir article en français', 'article anglais vers français', 'article source en anglais', or any request involving adapting/translating a blog article from one language to another for Eurofiscalis. Also trigger when the user provides a Word document in a foreign language and asks for a French (or other language) version, or provides a French article and asks for a version in another language."
---

# Eurofiscalis Transcréation SEO

Ce skill transforme un article source (fourni par une agence ou rédigé en interne) en un article Eurofiscalis optimisé dans la langue cible. Ce n'est **pas une traduction** — c'est une **transcréation** : on extrait les données métier de la source, on fait une analyse SEO complète dans la langue cible, et on rédige un article neuf avec le style JIM.

## Pourquoi transcréation et pas traduction ?

Une traduction conserve la structure, le style et le ton de l'original. La transcréation conserve uniquement les **données métier** (faits, chiffres, réglementations, procédures) et reconstruit tout le reste : structure H en pyramide inversée, style JIM, SEO adapté à la langue cible, encarts d'expertise, shortcodes dynamiques. Le résultat est un article natif dans la langue cible, pas une traduction.

## Input requis

1. **Article source** — un fichier Word (.docx) ou du texte dans n'importe quelle langue parmi les 7 langues Eurofiscalis (français, anglais, italien, allemand, polonais, tchèque, norvégien)
2. **Langue cible** — la langue dans laquelle rédiger le nouvel article
3. **Pays cible** (optionnel) — si différent du pays de l'article source

Si la langue cible n'est pas précisée, demander à l'utilisateur.

## Workflow en 5 phases

### Phase 1 : Extraction des données métier de la source

Lire l'article source (utiliser le skill `docx` si nécessaire pour extraire le texte du fichier Word) et **extraire uniquement les données métier**. On ignore complètement la structure, les titres, le ton et le style de la source.

**Ce qu'on extrait :**

| Catégorie | Ce qu'on cherche | Exemple |
|-----------|------------------|---------|
| **Faits réglementaires** | Lois, directives, obligations légales | "Directive 2006/112/CE", "obligation d'immatriculation TVA" |
| **Chiffres et seuils** | Taux, montants, délais, pourcentages | "Seuil INTRASTAT : 400 000 CZK", "délai : 25 jours" |
| **Procédures** | Étapes administratives, démarches | "Soumettre formulaire X au bureau Y" |
| **Organismes** | Administrations fiscales, institutions | "Finanční správa", "Agenzia delle Entrate" |
| **Pièges et cas particuliers** | Exceptions, erreurs courantes, sanctions | "Pénalité de 20% en cas de retard" |
| **Cas pratiques** | Exemples concrets, scénarios métier | "Une entreprise française vendant en B2B en Tchéquie..." |

**Ce qu'on ignore :**
- La structure H1/H2/H3 de la source
- Le ton et le style de rédaction
- L'introduction et la conclusion
- Les liens internes de la source
- Les meta-données SEO de la source

**Format de sortie Phase 1 :**
```markdown
## Extraction métier — {Sujet}

### Faits réglementaires
- {fait 1}
- {fait 2}
...

### Chiffres et seuils
- {chiffre 1} → shortcode potentiel : [xxx]
- {chiffre 2} → À VÉRIFIER si shortcode disponible
...

### Procédures
- {étape 1}
- {étape 2}
...

### Organismes mentionnés
- {organisme 1} — rôle : {rôle}
...

### Pièges et cas particuliers
- {piège 1}
...

### Cas pratiques
- {cas 1}
...

### Zones d'incertitude
- [À VÉRIFIER: {donnée ambiguë ou potentiellement obsolète}]
```

**Vérification croisée** : croiser les données extraites avec les shortcodes Eurofiscalis disponibles. Tout chiffre qui correspond à un shortcode doit être noté pour remplacement. Voir les shortcodes dans les références du skill `eurofiscalis-seo` ([references/shortcodes.md]).

### Phase 2 : Analyse SEO dans la langue cible

Appliquer la **méthodologie complète du skill `eurofiscalis-seo`** mais dans la langue cible. L'article source donne le sujet et les données métier ; tout le travail SEO se fait dans la langue du futur article.

> **Lire les références méthodologiques** avant de procéder :
> - Le SKILL.md de `eurofiscalis-seo` pour le workflow complet (7 étapes)
> - `eurofiscalis-seo/references/semantic-seo-method.md` pour la distinction champ lexical vs champ sémantique

**Adaptations spécifiques à la transcréation :**

1. **Langue des recherches** — toutes les recherches SERP, GSC, keywords doivent être dans la langue cible. Utiliser les paramètres de langue appropriés (ex: `gl=de&hl=de` pour l'allemand)

2. **Regex questions GSC par langue** — adapter le regex de filtrage des questions :

| Langue | Regex questions |
|--------|----------------|
| Français | `\b(Qui\|Quoi\|Comment\|Pourquoi\|Où\|Quand\|Combien\|Quel\|Quelle\|Lesquels\|Lesquelles\|Lequel\|Laquelle)\b` |
| Anglais | `\b(Who\|What\|How\|Why\|Where\|When\|Which\|Can\|Does\|Is\|Are\|Do)\b` |
| Italien | `\b(Chi\|Cosa\|Come\|Perché\|Dove\|Quando\|Quanto\|Quale\|Quali)\b` |
| Allemand | `\b(Wer\|Was\|Wie\|Warum\|Wo\|Wann\|Welche\|Welcher\|Welches\|Wieviel)\b` |
| Polonais | `\b(Kto\|Co\|Jak\|Dlaczego\|Gdzie\|Kiedy\|Ile\|Który\|Która\|Które)\b` |
| Tchèque | `\b(Kdo\|Co\|Jak\|Proč\|Kde\|Kdy\|Kolik\|Který\|Která\|Které)\b` |
| Norvégien | `\b(Hvem\|Hva\|Hvordan\|Hvorfor\|Hvor\|Når\|Hvilken\|Hvilke\|Hvor mye)\b` |

3. **Enrichissement depuis la source** — les données métier extraites en Phase 1 viennent enrichir la synthèse des connaissances (Étape 3 du workflow SEO). Les faits de la source sont une base solide qu'on complète avec les recherches web.

4. **Détection des différences réglementaires** — si le pays cible diffère du pays source, vérifier que les données métier sont bien adaptées au pays cible (les réglementations changent d'un pays à l'autre, même au sein de l'UE).

**Livrable Phase 2** : un Brief SEO complet au format du skill `eurofiscalis-seo` (sections 0 à 10), enrichi des données métier de la Phase 1.

### Phase 3 : Validation du brief (POINT D'ARRÊT)

**Présenter le brief à l'utilisateur pour validation.** Ne pas passer à la rédaction tant que le brief n'est pas validé.

Le brief doit clairement montrer :
- Les données métier extraites de la source (Phase 1)
- L'analyse SEO dans la langue cible (Phase 2)
- La structure H proposée en pyramide inversée
- Les shortcodes identifiés
- La longueur cible (moyenne top 3 SERP +/- 10%)

Demander à l'utilisateur : "Le brief SEO est prêt. Voulez-vous valider, ajuster des éléments, ou approfondir certaines sections ?"

### Phase 4 : Rédaction dans la langue cible

Appliquer la **méthodologie complète du skill `eurofiscalis-blog`** pour rédiger l'article dans la langue cible.

> **Lire les références** avant de procéder :
> - Le SKILL.md de `eurofiscalis-blog` pour le workflow de rédaction
> - `eurofiscalis-blog/references/jim-style-guide.md` pour le style JIM complet

**Le style JIM s'applique dans toutes les langues.** Voir [references/language-adaptations.md](./references/language-adaptations.md) pour les adaptations culturelles et linguistiques par langue.

**Adaptations spécifiques à la transcréation :**

1. **Exactitude métier** — les données factuelles, chiffres et procédures de la Phase 1 sont la référence. Chaque affirmation métier dans l'article doit pouvoir être tracée vers une donnée extraite ou une source vérifiée.

2. **Signature Jim adaptée par langue** :

| Langue | Signature |
|--------|-----------|
| Français | "Je suis Jim, Spécialiste TVA chez Eurofiscalis. J'accompagne les sociétés françaises et internationales à sécuriser leurs opérations en Europe." |
| Anglais | "I'm Jim, VAT Specialist at Eurofiscalis. I help French and international companies secure their operations across Europe." |
| Italien | "Sono Jim, Specialista IVA presso Eurofiscalis. Accompagno le aziende francesi e internazionali nella gestione delle loro operazioni in Europa." |
| Allemand | "Ich bin Jim, MwSt-Spezialist bei Eurofiscalis. Ich begleite französische und internationale Unternehmen bei der Absicherung ihrer Geschäfte in Europa." |
| Polonais | "Jestem Jim, Specjalista ds. VAT w Eurofiscalis. Pomagam francuskim i międzynarodowym firmom w zabezpieczaniu ich operacji w Europie." |
| Tchèque | "Jsem Jim, specialista na DPH ve společnosti Eurofiscalis. Pomáhám francouzským a mezinárodním společnostem zajistit jejich operace v Evropě." |
| Norvégien | "Jeg er Jim, MVA-spesialist hos Eurofiscalis. Jeg hjelper franske og internasjonale selskaper med å sikre deres virksomhet i Europa." |

3. **Encarts d'expertise traduits** — les en-têtes des encarts sont adaptés par langue :

| Langue | Mon Conseil Expert | Point de Vigilance |
|--------|-------------------|-------------------|
| Français | 💡 **Mon Conseil Expert** | ⚠️ **Point de Vigilance** |
| Anglais | 💡 **Expert Tip** | ⚠️ **Watch Out** |
| Italien | 💡 **Il Mio Consiglio** | ⚠️ **Attenzione** |
| Allemand | 💡 **Mein Experten-Tipp** | ⚠️ **Achtung** |
| Polonais | 💡 **Rada Eksperta** | ⚠️ **Uwaga** |
| Tchèque | 💡 **Rada Odborníka** | ⚠️ **Pozor** |
| Norvégien | 💡 **Eksperttips** | ⚠️ **Vær oppmerksom** |

4. **AI-ismes par langue** — chaque langue a ses propres tics de rédaction IA à éviter. Voir [references/language-adaptations.md](./references/language-adaptations.md) pour les listes par langue.

5. **L'essentiel en 1 minute traduit** :

| Langue | Libellé |
|--------|---------|
| Français | 🎯 **L'essentiel en 1 minute** |
| Anglais | 🎯 **The essentials in 1 minute** |
| Italien | 🎯 **L'essenziale in 1 minuto** |
| Allemand | 🎯 **Das Wichtigste in 1 Minute** |
| Polonais | 🎯 **Najważniejsze w 1 minutę** |
| Tchèque | 🎯 **To nejdůležitější za 1 minutu** |
| Norvégien | 🎯 **Det viktigste på 1 minutt** |

### Phase 5 : Vérification croisée source ↔ article final

Dernière étape avant livraison : vérifier la cohérence entre les données de la source et l'article produit.

**Checklist de vérification croisée :**

```markdown
### Vérification source ↔ article

**Exactitude métier**
- [ ] Tous les faits réglementaires de la source sont présents dans l'article
- [ ] Aucun chiffre n'a été altéré ou mal converti
- [ ] Les procédures sont fidèlement reproduites
- [ ] Les organismes sont correctement nommés dans la langue cible
- [ ] Les pièges mentionnés dans la source sont repris (encarts ou corps)
- [ ] Les zones [À VÉRIFIER] sont clairement signalées

**Enrichissement SEO**
- [ ] L'article contient des informations SUPPLÉMENTAIRES par rapport à la source (issues de l'analyse SEO)
- [ ] La structure H est différente de la source (pyramide inversée, basée sur le brief)
- [ ] Les shortcodes remplacent les chiffres hardcodés
- [ ] Les liens internes Eurofiscalis sont intégrés

**Style JIM**
- [ ] Accroche chirurgicale (3 phrases, pas de chauffe)
- [ ] Signature Jim dans la langue cible
- [ ] Encarts traduits (💡 / ⚠️)
- [ ] L'essentiel en 1 minute traduit
- [ ] BLUF à chaque paragraphe
- [ ] Gras max 5-7%
- [ ] Zéro AI-isme dans la langue cible
- [ ] Listes à puces pour les énumérations 3+
- [ ] Pyramide inversée respectée

**SEO langue cible**
- [ ] KW principal dans H1 + intro + ≥1 H2 + conclusion
- [ ] KW secondaires dans H2/H3
- [ ] Champ lexical intégré naturellement
- [ ] Champ sémantique / cooccurrences présentes
- [ ] Termes NLP répartis dans le texte
- [ ] Longueur dans la fourchette cible (moyenne top 3 +/- 10%)
- [ ] Meta title <60 chars dans la langue cible
- [ ] Meta description 150-160 chars dans la langue cible
```

## Livrable final

L'article est livré en **Markdown** avec :

1. **Le rapport d'extraction métier** (Phase 1) — pour traçabilité
2. **Le brief SEO langue cible** (Phase 2) — validé par l'utilisateur
3. **L'article complet** dans la langue cible (Phase 4)
4. **La checklist de vérification croisée** remplie (Phase 5)
5. **Les meta-données** (title, description, slug dans la langue cible)
6. **Les liens internes** identifiés

## Cas d'usage typiques

| Scénario | Source | Cible | Ce qui se passe |
|----------|--------|-------|-----------------|
| Agence tchèque envoie un article | Article EN sur la TVA en Tchéquie | FR | Extraction métier EN → SEO FR → Article FR style JIM |
| Jim veut une version allemande | Article FR sur l'importation en Allemagne | DE | Extraction métier FR → SEO DE → Article DE style JIM |
| Agence italienne envoie en anglais | Article EN sur la facturation en Italie | FR | Extraction métier EN → SEO FR → Article FR style JIM |
| Version locale pour l'agence | Article FR sur la TVA en Pologne | PL | Extraction métier FR → SEO PL → Article PL style JIM |

## Intégration avec le pipeline existant

Ce skill **remplace les étapes 1 et 2 du pipeline** (eurofiscalis-seo + eurofiscalis-blog) quand on part d'un article source plutôt que de zéro.

```
Pipeline classique :     eurofiscalis-seo → eurofiscalis-blog → eurofiscalis-publish
Pipeline transcréation : eurofiscalis-transcreation → eurofiscalis-publish
```

L'article produit par ce skill est directement compatible avec `eurofiscalis-publish` pour le formatage WordPress, le maillage interne automatisé et les balises hreflang.

## Reference Materials

Ce skill réutilise les références des skills existants :

- **eurofiscalis-seo** → méthodologie SEO complète, shortcodes, templates d'articles, méthode sémantique
- **eurofiscalis-blog** → style JIM, outils interactifs, guide de rédaction
- [Adaptations linguistiques](./references/language-adaptations.md) → AI-ismes par langue, adaptations culturelles, formalité

## Related Skills

- **eurofiscalis-seo** — Ce skill réutilise sa méthodologie SEO pour la Phase 2
- **eurofiscalis-blog** — Ce skill réutilise son style de rédaction pour la Phase 4
- **eurofiscalis-publish** — Étape suivante : formatage WordPress et publication
- **docx** — Pour lire les fichiers Word source
- **content-quality-auditor** — Pour auditer l'article produit si nécessaire
