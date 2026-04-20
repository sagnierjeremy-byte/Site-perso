# Les 7 Templates d'articles Eurofiscalis — Questions-guides

Ce document contient les questions-guides complètes pour chaque template. Chaque question devient une section potentielle de l'article et doit être couverte dans la synthèse des connaissances.

Remplacer `{Pays}` par le pays cible dans toutes les questions.

---

## Template 1 : ESL / INTRASTAT

**Slug** : `esl-intrastat-{pays}`
**Sujet** : Déclarations ESL (EC Sales List) et INTRASTAT pour les échanges intra-communautaires.

### Questions-guides

1. Qu'est-ce que l'EC Sales List et l'INTRASTAT, et quelles sont les différences ?
2. Qui est redevable de l'ESL en {Pays} ?
3. Qui est redevable de l'INTRASTAT en {Pays} ?
4. Quels sont les seuils INTRASTAT en {Pays} ?
   - Seuil à l'introduction : `[intrastat_{cc}_imp]`
   - Seuil à l'expédition : `[intrastat_{cc}_exp]`
5. Que faut-il déclarer dans l'ESL en {Pays} ?
6. Que faut-il déclarer dans l'INTRASTAT en {Pays} ?
7. Quels sont les délais de dépôt de l'ESL et de l'INTRASTAT en {Pays} ?
   - Date limite : `[intrastat_{cc}_dl]`
8. Comment déposer les déclarations en {Pays} ? (plateforme en ligne, format, procédure)

### Shortcodes obligatoires
- `[intrastat_{cc}_imp]`, `[intrastat_{cc}_exp]`, `[intrastat_{cc}_dl]`

---

## Template 2 : Déclaration de TVA

**Slug** : `declaration-tva-{pays}`
**Sujet** : Obligations déclaratives TVA, périodicité, formulaires, pénalités.

### Questions-guides

1. Qui doit déposer des déclarations de TVA en {Pays} ?
2. Quelle est la périodicité des déclarations en {Pays} ? (mensuelle, trimestrielle, annuelle)
3. Quelle est la date limite de dépôt de la déclaration de TVA en {Pays} ?
4. Comment remplir la déclaration de TVA {Pays} ? (étape par étape)
5. Existe-t-il une déclaration annuelle en {Pays} ? (quoi, quand, comment la remplir)
6. Quelles sont les pénalités en cas de non-dépôt ou de dépôt tardif ?
7. Est-il possible de déposer soi-même ses déclarations en {Pays} ? (sans représentant)

### Shortcodes obligatoires
- `[rates_{cc}_s]`, `[rates_{cc}_r1]`, `[rates_{cc}_r2]`, `[rates_{cc}_sr]` (selon disponibilité)

---

## Template 3 : Facturer un client

**Slug** : `facturer-client-{pays}`
**Sujet** : Règles de facturation, mentions obligatoires, TVA applicable selon le type d'opération.

### Questions-guides

1. Quelles sont les étapes pour facturer un client en {Pays} ?
2. Quelles sont les mentions de base obligatoires sur une facture {Pays} ?
3. Quelle TVA facturer sur les ventes à un client {Pays} ?
   - Si le client est un particulier (B2C)
   - Pour les ventes à distance (e-commerce)
   - Si le client est une entreprise (B2B)
   - Pour les ventes locales
   - Pour une livraison intracommunautaire
   - Pour une exportation
4. Quelles mentions spécifiques doivent figurer sur la facture ?
   - Pour les ventes locales (taux applicable : `[rates_{cc}_s]`)
   - Pour une livraison intracommunautaire (B2B) — mention d'exonération
5. Y a-t-il des différences entre la facturation de biens et de services ?
6. Quelle documentation conserver pour l'administration fiscale {Pays} ?
7. Comment facturer une vente DAP pour une entreprise non-UE avec des clients {Pays} ?
8. Comment facturer une vente DDP pour une entreprise non-UE avec des clients {Pays} ?

### Shortcodes obligatoires
- `[rates_{cc}_s]`, `[rates_{cc}_r1]`, `[rates_{cc}_r2]`, `[rates_{cc}_sr]`

---

## Template 4 : Numéro de TVA

**Slug** : `numero-tva-{pays}`
**Sujet** : Procédure d'immatriculation TVA, documents requis, obligations post-immatriculation.

### Questions-guides

1. Comment obtenir un numéro de TVA en {Pays} ?
2. Quelle est la procédure étape par étape pour s'immatriculer à la TVA en {Pays} ?
3. Quels documents fournir à l'administration fiscale {Pays} pour l'immatriculation TVA ? (considérer la traduction des documents)
4. Dans quels cas demander un numéro de TVA {Pays} ? Quelles activités nécessitent une immatriculation TVA en {Pays} ?
5. Une fois le numéro de TVA {Pays} obtenu, quelles sont mes obligations déclaratives ?
6. Faut-il un représentant fiscal en {Pays} pour s'immatriculer à la TVA ? (considérer les réformes récentes avec prudence)

### Shortcodes obligatoires
- `[rates_{cc}_s]` (taux standard pour contexte)

---

## Template 5 : Importation

**Slug** : `importer-{pays}`
**Sujet** : Procédure d'importation, documents, droits de douane, autoliquidation TVA.

### Questions-guides

1. Comment importer en {Pays} ? (Faut-il un numéro de TVA ? Un numéro EORI ?)
2. Quels documents sont nécessaires pour importer en {Pays} ?
3. Quelles sont les étapes pour importer en {Pays} ?
4. Y a-t-il de la TVA à payer en douane ?
5. Existe-t-il un mécanisme d'autoliquidation de la TVA à l'importation en {Pays} ?
6. Y a-t-il des droits de douane et comment sont-ils calculés ?
7. Faut-il désigner un représentant en douane ?
8. Faut-il désigner un représentant fiscal en {Pays} ?
9. Y a-t-il des incoterms qui réduisent mes obligations à l'importation en {Pays} ?
10. Comment importer en DDP en {Pays} ?

### Shortcodes obligatoires
- `[rates_{cc}_s]` (taux TVA à l'importation)

---

## Template 6 : Remboursement TVA

**Slug** : `remboursement-tva-{pays}`
**Sujet** : Procédures de remboursement TVA (8e directive, 13e directive, via déclaration TVA).

### Questions-guides

1. Comment obtenir le remboursement de la TVA {Pays} ? (8e directive, 13e directive)
2. Obtenir le remboursement en s'immatriculant à la TVA en {Pays}
3. Remboursement TVA {Pays} en 8e directive étape par étape
4. Remboursement TVA {Pays} en 13e directive étape par étape
5. Remboursement TVA {Pays} via la déclaration de TVA {Pays}
6. Combien de temps l'administration fiscale {Pays} met-elle pour traiter un remboursement de TVA ?
7. Quelles dépenses ont une TVA déductible, partiellement déductible, et non déductible en {Pays} ?
8. Représentation fiscale en {Pays} pour le remboursement en 13e directive

### Shortcodes obligatoires
- `[rates_{cc}_s]` (pour calculer les montants de remboursement)

---

## Template 7 : Vendre en DDP

**Slug** : `vendre-ddp-{pays}`
**Sujet** : Obligations liées aux ventes DDP (Delivered Duty Paid) dans le pays cible.

### Questions-guides

1. Comment vendre en DDP en {Pays} ? (immatriculation, EORI, droits de douane et TVA)
2. Quelles sont mes obligations pour vendre en DDP en {Pays} ? (immatriculation, EORI, droits de douane et TVA, déclaration TVA)
3. Comment facturer mon client {Pays} pour une vente DDP ? (facture TTC pour B2C, TTC ou autoliquidation pour B2B)
4. Comment obtenir le remboursement de la TVA payée à l'importation pour une vente DDP en {Pays} ? (autoliquidation TVA import)
5. Existe-t-il des prestataires pour faciliter les ventes DDP en {Pays} ? (représentant fiscal, représentant en douane, logisticien et 3PL)
6. Checklist des actions et documents pour vendre en DDP en {Pays}

### Shortcodes obligatoires
- `[rates_{cc}_s]`, `[rates_{cc}_r1]` (taux TVA pour calcul prix TTC)

---

## Matrice Complète : 7 Templates × 15 Pays = 105 Articles

| Pays | Code | ESL/INTRA | Décl. TVA | Facturer | N° TVA | Import | Rembours. | DDP |
|------|------|-----------|-----------|----------|--------|--------|-----------|-----|
| Italie | IT | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Espagne | ES | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| France | FR | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Luxembourg | LU | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Belgique | BE | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Pays-Bas | NL | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Royaume-Uni | UK | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Irlande | IE | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Allemagne | DE | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Autriche | AT | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Danemark | DK | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Suède | SE | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Norvège | NO | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Pologne | PL | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Rép. tchèque | CZ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

**Note Royaume-Uni & Norvège** : Ces pays non-UE n'ont pas d'ESL/INTRASTAT. Le template 1 doit être adapté (déclarations douanières équivalentes).
