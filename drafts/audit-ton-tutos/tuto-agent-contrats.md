# Audit ton — Tuto agent contrats PDF

**Note globale : 6,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 7 | Phrases courtes, structure claire, mais blocs de prompt système et JSON longs. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 5 | MCP filesystem, ZDR, DPA, art. 28 RGPD, hook, JSON, TJM, ILC/ILAT non glossés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 8 | 7 étapes numérotées, fiche de sortie attendue, structure exemplaire. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 5 | Très peu de "je", pose d'expert juridique, manque de vécu personnel. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 6 | Tient sur les commandes terminal, mais le hook FileChanged + JSON décroche. |

## Verdict
**⚠️ À retoucher**

Pas-à-pas excellent (le mieux structuré sur les commandes), encadré juridique honnête et responsable. Mais deux faiblesses : (1) le ton dérive vers « consultant juridique sérieux » et perd le « Jérémy entrepreneur curieux qui a testé pour lui » — quasiment aucun vécu personnel, aucune anecdote, pas de chiffres « j'ai testé sur 5 contrats et voici ce qui a marché ». (2) La section sécurité/RGPD est techniquement riche mais empile les acronymes (ZDR, DPA, art. 28 RGPD) sans glose, et la section Variantes balance "TJM", "ILC/ILAT", "M&A" comme si tout le monde savait. Le tuto fonctionne, mais ne se lit pas comme du Leo.

## 3 à 5 passages problématiques (verbatim)
- « Pour que l'agent puisse lire les PDFs que tu déposes dans inbox/, tu dois ajouter un MCP filesystem. » → "MCP filesystem" tombe sec. Suggestion : "tu dois lui ouvrir l'accès à un dossier précis. Pour ça on utilise un petit connecteur qu'on appelle un MCP filesystem (un MCP, c'est un module qui donne un nouveau pouvoir à Claude — ici, lire un dossier sur ton Mac)".
- « Claude for Work / Enterprise : zéro entraînement par défaut, option Zero Data Retention disponible. Obligatoire pour cabinets d'avocats » → "Zero Data Retention" jamais glosé. Suggestion : "option Zero Data Retention (ZDR — tes données ne sont jamais stockées, même pour debug)".
- « Si tu analyses les contrats de tes clients pour leur compte, tu deviens sous-traitant au sens de l'article 28 du RGPD. Tu dois signer un contrat de sous-traitance avec tes clients qui encadre cet usage. » → posture juridique pro, jargon RGPD non vulgarisé, "je" absent. Suggestion : "si tu analyses les contrats de tes clients pour leur compte, le RGPD considère que tu manipules leurs données — tu dois signer un papier de sous-traitance avec eux. Concrètement c'est un avenant d'une page, ton avocat te le sort en 30 minutes."
- « TJM ou forfait clairement défini ? […] Indexation des loyers : indice ILC ou ILAT ? […] dossiers M&A sensibles » → empilement d'acronymes métier (TJM = taux journalier moyen, ILC = indice loyers commerciaux, M&A = fusions-acquisitions). Pas glossés. Suggestion : ajouter une parenthèse à chaque sigle première fois.
- « Crée le fichier .claude/settings.json avec : { "hooks": { "FileChanged": [{ "matcher": "inbox/*.pdf"… » → bloc de configuration JSON balancé sans expliquer ce qu'est un "hook" ni ce que fait chaque champ. Pour un débutant, c'est de la magie noire copier-coller. Suggestion : ajouter en intro "un 'hook', c'est une règle qui dit à Claude Code 'quand X arrive, fais Y'. Ici, on lui dit 'à chaque PDF déposé dans inbox/, lance la commande analyser'."

## 3 à 5 passages réussis (verbatim)
- « Cet agent ne remplace pas un avocat. C'est un outil de premier filtrage qui t'aide à repérer les points à creuser avant de payer une vraie consultation juridique. » → honnêteté frontale en intro, ton Leo de transparence.
- « Si tu signes un contrat engageant plus de 10 000 € ou de la propriété intellectuelle sensible, fais toujours valider par un avocat. » → conseil tranché, chiffré, responsable. Pose d'ami qui te protège.
- « Si le PDF est un scan flou ou une photo prise au téléphone, Claude peut halluciner (inventer des clauses qui n'existent pas). Règle simple : si la fiche contient des clauses sans numéro de page ou dont la citation semble bizarre, demande une version texte du contrat ou refais scanner en bonne qualité. » → vrai conseil terrain, anti-piège, glose "halluciner" intégrée.
- « **Je peux me tromper.** Cet agent évolue avec les versions de Claude Code et les capacités PDF du modèle. Si une commande ne fonctionne plus, écris-moi. » → ton Leo signature, transparence.
- « Le calcul bascule dès le deuxième contrat du mois. » → punchline, posture entrepreneur, lecture facile.

## Recos prioritaires (3 max, actionnables)
1. **Réinjecter du vécu personnel** : ajouter 2-3 anecdotes concrètes type "le 1er contrat sur lequel j'ai testé, l'agent a raté la clause de non-concurrence — j'ai dû ajouter une règle au prompt", "voici le score moyen sur les 8 contrats que j'ai analysés cette semaine". Sans ça, l'article se lit comme un guide LegalTech, pas comme du Jérémy.
2. **Glosser le bloc juridique** : ZDR, DPA, art. 28 RGPD, TJM, ILC/ILAT, M&A, "background IP", "loi LME". Ajouter parenthèses systématiques. Le débutant lit l'article pour comprendre, pas pour valider du vocabulaire.
3. **Démystifier les blocs JSON et hooks** : ajouter avant chaque bloc de code une phrase "voilà ce que ça veut dire" + après chaque bloc une phrase "ce que ça déclenche concrètement". Aujourd'hui le débutant copie-colle sans rien comprendre, et le 1er bug le bloque.
