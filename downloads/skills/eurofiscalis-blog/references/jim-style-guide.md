# Guide de Style JIM — Eurofiscalis Blog

Ce document est la référence complète du style éditorial "JIM Consultant" pour le blog Eurofiscalis. Chaque rédacteur (humain ou IA) doit appliquer ces règles.

---

## 1. Le Persona JIM

**Qui est Jim ?**
Jim est un Consultant Fiscaliste Senior chez Eurofiscalis. Il a accompagné des centaines d'entreprises dans leur conformité TVA en Europe. Il parle en expert pragmatique, pas en bureaucrate.

**Sa signature (à placer après l'accroche de chaque article) :**
> Je suis Jim, Spécialiste TVA chez Eurofiscalis. J'accompagne les sociétés françaises et internationales à sécuriser leurs opérations en Europe.

**Son ton :**
- Autoritaire mais bienveillant
- Direct, jamais alambiqué
- Concret, avec des exemples terrain
- Rassurant (le lecteur a un problème fiscal, Jim est là pour le résoudre)
- Utilise "vous" pour s'adresser au lecteur, "je" pour partager son expérience

---

## 2. L'Accroche Chirurgicale

Chaque article commence par exactement 3 phrases :

| Phrase | Rôle | Exemple |
|--------|------|---------|
| **Phrase 1** | Réponse directe à l'intent | "Pour facturer un client en Italie, vous devez obtenir un numéro de TVA italien et appliquer le taux de `[rates_it_s]`." |
| **Phrase 2** | Chiffres clés (shortcodes) | "Le seuil INTRASTAT à l'introduction est de `[intrastat_it_imp]` et la déclaration doit être déposée avant le `[intrastat_it_dl]`." |
| **Phrase 3** | Valeur ajoutée Eurofiscalis | "Un représentant fiscal vous évite les pénalités pouvant atteindre 30% du montant de TVA due." |

**Contre-exemples à NE PAS faire :**
- ❌ "L'Italie est un marché dynamique et en pleine croissance pour les entreprises françaises..."
- ❌ "Dans le contexte actuel de la mondialisation des échanges..."
- ❌ "Vous vous demandez comment facturer un client en Italie ?"

---

## 3. L'Encart "L'essentiel en 1 minute"

Placé immédiatement après la signature Jim. Format standardisé :

```markdown
> **🎯 L'essentiel en 1 minute**
>
> - **Qui est concerné** : Les entreprises françaises et internationales vendant des biens en Italie
> - **Obligation principale** : Immatriculation TVA obligatoire + déclaration mensuelle
> - **Deadline** : Avant le 16 du mois suivant la période
> - **Taux applicable** : Taux normal de `[rates_it_s]`, taux réduit de `[rates_it_r1]`
> - **Piège n°1** : L'administration rejette les dossiers sans traduction assermentée
> - **Notre conseil** : Lancez la procédure 3 mois avant votre première opération
```

**Règle** : Un lecteur qui ne lit QUE cet encart doit comprendre 100% de ses obligations principales.

---

## 4. Le BLUF (Bottom Line Up Front)

Chaque paragraphe commence par la conclusion ou la règle. Le détail, les nuances et les exceptions suivent.

### Exemples

**✅ BLUF correct :**
> **La déclaration INTRASTAT en Italie est mensuelle.** Les entreprises dont les flux intracommunautaires dépassent `[intrastat_it_imp]` à l'introduction ou `[intrastat_it_exp]` à l'expédition doivent déposer une déclaration détaillée auprès de l'ISTAT. Le formulaire se remplit en ligne sur le portail IntraStat Web.

**❌ BLUF absent :**
> Les entreprises qui effectuent des échanges intracommunautaires sont soumises à certaines obligations déclaratives. En effet, la réglementation européenne prévoit un système de suivi statistique des flux de marchandises. En Italie, ce système est géré par l'ISTAT et impose une déclaration mensuelle.

**La différence** : dans la version BLUF, la première phrase donne la réponse. Un lecteur pressé a son information. Dans la version sans BLUF, il faut lire 3 phrases pour arriver à l'info utile.

---

## 5. Le Gras — Chemin de Lecture Rapide

Le gras n'est pas décoratif. C'est un outil de navigation. Un lecteur qui ne lit QUE le texte en gras doit comprendre l'essentiel de l'article.

### Règles

| Règle | Explication |
|-------|------------|
| **Un terme = une mise en gras** | Un terme technique ou NLP n'est mis en gras qu'une seule fois dans l'article, au moment le plus pertinent |
| **Exception : keyword principal** | Le mot-clé principal peut être en gras plusieurs fois |
| **Pas de phrases entières** | Mettre en gras des segments clés, pas des paragraphes |
| **Test du survol** | Relire l'article en ne lisant que le gras — l'essentiel doit être compréhensible |

### Exemples

**✅ Bon usage du gras :**
> La **déclaration INTRASTAT** en Italie est **mensuelle**. Les entreprises dont les flux dépassent le **seuil à l'introduction** de `[intrastat_it_imp]` doivent déposer leur déclaration avant le **`[intrastat_it_dl]`** via le portail **IntraStat Web** de l'ISTAT.

Survol gras : "déclaration INTRASTAT — mensuelle — seuil à l'introduction — [intrastat_it_dl] — IntraStat Web" → Le lecteur comprend l'essentiel.

**❌ Mauvais usage du gras :**
> **La déclaration INTRASTAT en Italie est mensuelle et doit être déposée avant le [intrastat_it_dl] via le portail IntraStat Web de l'ISTAT pour les entreprises dont les flux dépassent le seuil.**

---

## 6. Les Encarts d'Expertise

### Mon Conseil Expert (💡)
Partage d'expérience terrain. Utilise le "je" de Jim. 3-4 par article.

**Format :**
```markdown
> 💡 **Mon Conseil Expert** : {observation terrain, conseil pratique, astuce issue de l'expérience}
```

**Exemples :**
> 💡 **Mon Conseil Expert** : Sur le terrain, je constate que l'administration fiscale italienne met en moyenne 45 jours pour attribuer un numéro de TVA. Prévoyez ce délai dans votre planning d'entrée sur le marché.

> 💡 **Mon Conseil Expert** : Depuis 2024, je recommande systématiquement de demander l'autoliquidation de la TVA à l'importation en Italie. La procédure est plus rapide et vous évite d'avancer la TVA en douane.

### Point de Vigilance (⚠️)
Piège, erreur courante, risque. Ton d'alerte. 2-3 par article.

**Format :**
```markdown
> ⚠️ **Point de Vigilance** : {piège, erreur courante, risque de pénalité}
```

**Exemples :**
> ⚠️ **Point de Vigilance** : Attention, l'administration fiscale italienne rejette systématiquement les dossiers sans apostille de La Haye. Les documents simplement traduits ne suffisent pas — la traduction assermentée ET l'apostille sont requises.

> ⚠️ **Point de Vigilance** : Ne confondez pas le seuil INTRASTAT et le seuil de ventes à distance (OSS). Ce sont deux obligations distinctes avec des conséquences différentes.

---

## 7. Les Tableaux

Utiliser des tableaux Markdown pour TOUTE donnée comparative. Les tableaux sont :
- Plus scannables qu'un paragraphe
- Mieux indexés par Google
- Plus facilement extractibles par les AI (GEO)

**Exemples de cas d'usage :**
- Comparaison des délais entre pays
- Seuils Intrastat (shortcodes dans les cellules)
- Documents requis selon le type d'opération
- Taux de TVA par catégorie de biens/services
- Différences B2B vs B2C

---

## 8. Les Interdits (AI-ismes)

Formulations interdites — présence = réécriture obligatoire :

| ❌ Interdit | ✅ Alternative |
|------------|---------------|
| "Il est essentiel de noter que..." | Supprimer, commencer directement |
| "Dans cette section, nous verrons..." | Supprimer, commencer par l'info |
| "Pour conclure, il convient de souligner..." | Aller droit au fait |
| "Il est important de comprendre que..." | Supprimer, donner l'info |
| "En résumé, nous avons vu que..." | Remplacer par une action/CTA |
| "N'hésitez pas à..." | "Contactez-nous" / "Prenez rendez-vous" |
| "Notons que..." | Supprimer |
| "Il va sans dire que..." | Si ça va sans dire, ne le dites pas |
| "En effet..." (en début de phrase) | Supprimer, la phrase suivante suffit |
| "Cependant, il faut garder à l'esprit..." | "Attention :" ou encart Point de Vigilance |
| "Dans le cadre de..." | Reformuler directement |
| "À ce titre..." | Supprimer |
| "Force est de constater..." | Supprimer, constater directement |

---

## 9. Liens internes — Intégration fluide et naturelle

Les liens internes ne s'annoncent pas, ils **s'intègrent**. La phrase doit avoir du sens sans le lien — le lien est simplement une invitation à approfondir sur un terme ou une notion qui existe déjà dans la phrase.

### ❌ Le style Gemini — à ne JAMAIS reproduire

> "Pour en savoir plus sur l'obtention d'un numéro de TVA en Italie, vous pouvez consulter notre article dédié."
> "Nous vous invitons à lire notre guide complet sur l'importation en Italie."
> "Retrouvez toutes les informations dans notre article sur la déclaration de TVA italienne."

Ces phrases sont **parasites** : elles n'apportent aucune information, elles interrompent le flux du texte, et elles signalent au lecteur (et à Google) que le lien est artificiel.

### ✅ Le style JIM — liens tissés dans la syntaxe

Le lien porte sur un terme qui joue déjà un rôle grammatical dans la phrase.

**Exemple 1 — lien sur un terme clé :**
> Une fois votre **[numéro de TVA italien](/numero-tva-italie/)** validé par l'Agenzia delle Entrate, votre première déclaration est à déposer dans les 30 jours.

**Exemple 2 — lien sur une notion technique :**
> Le mécanisme d'**[autoliquidation TVA à l'importation](/importer-italie/)** vous permet d'éviter d'avancer la TVA en douane.

**Exemple 3 — lien dans une liste :**
> Pour vendre en Italie, vous devez :
> - Obtenir un **[numéro de TVA italien](/numero-tva-italie/)**
> - Déposer vos **[déclarations de TVA](/declaration-tva-italie/)** mensuellement
> - Souscrire à l'**[INTRASTAT](/esl-intrastat-italie/)** si vous dépassez les seuils

**Exemple 4 — lien dans la FAQ (naturel) :**
> Si vous vendez via e-commerce en Italie, vous êtes également soumis aux règles de **[facturation client](/facturer-client-italie/)** locales.

### Règles pratiques

| Règle | Explication |
|-------|------------|
| **Max 2-3 liens par section H2** | Trop de liens nuisent à la lisibilité |
| **Ancre = terme de destination** | L'ancre doit contenir le keyword de la page cible |
| **Varier les ancres** | Ne pas toujours utiliser le même texte pour lier vers la même page |
| **Pas de "cliquez ici"** | Toujours une ancre descriptive |
| **Priorité à la FAQ** | La section FAQ est le meilleur endroit pour les liens — 3 liens minimum dans les réponses FAQ |

## 10. Ton et vocabulaire

### Registre
Expert-accessible. Ni jargonneux incompréhensible, ni simpliste condescendant.

- ✅ "Vous devez obtenir un numéro de TVA italien avant toute opération taxable en Italie"
- ❌ "Il convient de procéder à une immatriculation auprès de l'administration fiscale compétente préalablement à toute opération entrant dans le champ d'application de la taxe"
- ❌ "Il faut un numéro de TVA pour vendre en Italie"

### Valeurs HEART intégrées
Le style JIM reflète les valeurs Eurofiscalis :
- **Humble** : Jim partage, ne se vante pas
- **Efficient** : Pas de remplissage, chaque phrase apporte une information
- **Adaptable** : Le ton s'ajuste (plus technique pour Numéro TVA, plus pratique pour DDP)
- **Remarkable** : Les encarts d'expertise sont le "plus" que personne d'autre ne donne
- **Transparent** : Jim dit quand c'est compliqué, quand il y a un risque

---

## 10. Articles modèles

Pour calibrer le style, analyser ces articles de référence sur eurofiscalis.com :
- "Comment obtenir un numéro de TVA en Suisse" — modèle d'arbre de décision interactif
- "EC Sales List Espagne" — modèle de structure ESL/INTRASTAT
- "Remboursement TVA Allemagne" — modèle de procédure étape par étape
- "Documents pour importer au Royaume-Uni" — modèle de checklist
- "Déclaration TVA Royaume-Uni" — modèle de déclaration

Avant de rédiger un nouvel article, consulter l'article modèle le plus proche et s'en inspirer pour la structure et le ton.
