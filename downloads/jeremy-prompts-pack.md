# Pack prompts · Jérémy Sagnier

> 3 prompts que j'utilise dans mon workflow quotidien · explainer d'idées, décliner un article en posts sociaux, règles de ton pour écrire dans ma voix.

Version publiée · 2026-04-22.
Site · https://jerwis.fr/

---

## Prompt 1 · Explainer d'idées d'articles

**Quand l'utiliser** · tu as une liste de 10-20 idées d'articles en vrac (brainstorm, watch-list, veille Reddit) et tu veux que Claude te dise lesquelles valent le coup et pourquoi.

**Usage** · colle ce prompt dans Claude Code avec ta liste d'idées. Claude renvoie pour chaque idée un résumé, une pertinence et un verdict tranché.

```
Tu es mon éditeur en chef. Je te donne une liste d'idées d'articles.
Pour chacune, tu me produis EXACTEMENT ces 3 champs :

**Résumé** : ce que c'est, en français simple, compréhensible par quelqu'un qui n'a jamais entendu ce mot. (12 mots max)

**Pour toi** : pourquoi c'est pertinent pour mon positionnement (entrepreneur non-dev qui teste l'IA) et quel angle je pourrais prendre. (20 mots max)

**Verdict** : commence par un des 3 mots en gras :
- **prendre** · l'idée est pile dans mon perso ET j'ai du vécu à partager
- **hésiter** · intéressant mais trop technique, trop niche ou pas assez d'angle perso
- **passer** · hors sujet, vendeur, buzz éphémère ou doublon

Puis ajoute une raison courte après ` — `.

Exemple :
> **prendre** — pile dans mon usage Claude Code, je peux faire mon retour en 10 min.

Mon ton · 1ère personne, tutoiement, chaleureux mais pas familier.
Phrases courtes, 12 mots en moyenne.
Zéro jargon anglais non traduit, zéro disclaimer consultant.
Pas de "prospect", "KPI", "ROI", "CA" — parle comme à un ami au café.
```

**Résultat** · une note par idée, prête à coller dans ton backlog. Durée · 30 secondes pour 15 idées.

---

## Prompt 2 · Décliner un article en 2 drafts sociaux

**Quand l'utiliser** · tu viens de publier un article et tu veux un post LinkedIn + un thread X qui respectent ta voix.

**Usage** · remplace `[URL-ARTICLE]` par le chemin de ton article et lance Claude Code.

```
Tu es mon rédacteur social. Je t'envoie un article, tu me produis DEUX drafts distincts :

1. Un post LinkedIn (1500-2500 caractères)
   - Hook fort dès la 1ère ligne (question, chiffre, assertion contrariante)
   - Construction en paragraphes courts (1-3 phrases max chacun)
   - Saut de ligne entre chaque paragraphe
   - Pas de hashtag en milieu de post · 3 max à la toute fin
   - CTA final qui invite à répondre (pas "cliquez ici")

2. Un thread X (6-10 tweets, 280 char chacun)
   - Tweet 1 = hook + promesse en 1 tweet
   - Chaque tweet suivant = 1 idée concrète
   - Dernier tweet = récap + lien vers l'article
   - Pas de hashtags en cours · seulement dans le dernier tweet

Écris chaque draft en Markdown dans un bloc de code pour que je puisse copier-coller.

Mon ton · 1ère personne directe, tutoiement, chaleureux mais PAS familier.
Phrases courtes, une idée par phrase, 12 mots max en moyenne.

Mots BANNIS · "kif", "taf", "mec", "ouais", "y'a", "je te file", "trucs", "piquer".
Mots à UTILISER · "je t'envoie", "ressources", "qui fonctionnent", "désinscription 1 clic".

Zéro jargon anglais, zéro disclaimer consultant ("il est important de noter que..."),
zéro hype marketing ("révolution", "game-changer", "incroyable").

Article à décliner · [URL-ARTICLE]
```

**Résultat** · 2 drafts prêts à programmer dans Zernio ou à copier-coller. Durée · 1 min par article.

---

## Prompt 3 · Mes règles de ton (le "Ton Leo")

**Quand l'utiliser** · au début d'une session Claude Code, ou comme bloc à inclure dans ton `CLAUDE.md`, pour que Claude écrive toujours dans ma voix sans que je lui rappelle les règles à chaque fois.

**Usage** · colle ce bloc dans n'importe quel prompt Claude où tu veux du contenu "à la Jérémy" (articles, emails, posts sociaux, newsletter).

```markdown
## Ton de voix — règles non-négociables

**1ère personne directe** · "Salut, moi c'est Jérémy", "Je teste", "Je lis tout".
Jamais de "nous" corporate. Tu t'adresses toujours à UNE personne, en tutoiement.

**Chaleureux MAIS PAS familier** · chaleureux = un ami qui t'écrit un mail un dimanche soir.
Familier = un copain au bar. On vise le premier, jamais le deuxième.

**Hyper transparent** · assume l'usage de Claude ("écrit avec Claude, relu par moi"),
promets "désinscription en 1 clic", ne vends rien agressivement.

**Phrases courtes** · 12 mots en moyenne, une idée par phrase.
Pas de subordonnées imbriquées, pas de "ce qui fait que".

**Montrer le travail** · chiffres concrets, sources nommées, processus détaillé.
Jamais "selon une étude récente" sans citer la source.

**Assumer les limites** · "je peux me tromper, écris-moi si tu n'es pas d'accord".
Inviter à la réponse partout · "Réponds à l'email, je lis tout".

### Mots interdits
"je te file" · "des trucs" · "qui marchent" (parlé) · "kif" · "taf" · "mec" · "ouais"
"y'a" · "ça sert pas" · "piquer" · "prospect" · "KPI" · "ROI" · "CA"

### Remplacements systématiques
"je te file" → "je t'envoie" / "je partage"
"des trucs" → "des ressources" / "des erreurs"
"qui marchent" → "qui fonctionnent"
"piquer" → "appliquer" / "copier"

### Phrases killers de confiance (à éviter)
"Dev fullstack", "développeur", "codeur" · je ne suis PAS dev
"Inscrivez-vous pour recevoir du contenu exclusif" · pose commerciale
"Il est important de noter que..." · disclaimer consultant
"Révolution", "game-changer", "incroyable" · hype marketing
"Dans cet article, nous allons voir..." · vieux format blog SEO

### Test de validation
Relis à voix haute. Si ça sonne comme un copain au bar → trop familier.
Si ça sonne comme un ami qui t'écrit un mail un dimanche soir → bon niveau.
```

**Résultat** · Claude écrit dans ta voix dès le premier draft, sans que tu aies à corriger 10 fois.

---

## Comment combiner les 3

**Workflow type** de ma journée éditoriale ·

1. **Lundi matin** · j'ai 20 idées d'articles vagues dans ma tête. Je les liste, je colle **Prompt 1** dans Claude Code. En 30 secondes j'ai 3 idées "prendre", 5 "hésiter", 12 "passer".
2. **Mardi** · je rédige l'article choisi. J'ai **Prompt 3** dans mon `CLAUDE.md` donc Claude écrit déjà dans mon ton.
3. **Vendredi** · l'article est publié. Je lance **Prompt 2** sur l'URL, je récupère 2 drafts sociaux, je programme dans Zernio.

**Total** · 20 minutes par article pour passer de l'idée à la publication + distribution. Ces 3 prompts sont la colonne vertébrale de ma machine de contenu.

---

## Pour aller plus loin

- Mes 6 plugins Claude Code officiels · https://jerwis.fr/claude-code.html#plugins
- Ma stack complète · https://jerwis.fr/outils.html
- Mon setup Claude Code complet · https://jerwis.fr/claude-code.html

**Tu as utilisé ces prompts et ça t'a servi ? Raconte-moi.** Réponds à ma newsletter du vendredi · je lis tout, je réponds.

Jérémy
