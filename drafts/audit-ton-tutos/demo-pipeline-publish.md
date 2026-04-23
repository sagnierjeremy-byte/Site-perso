# Audit ton — Pipeline markdown vers HTML automatique

**Note globale : 4.5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 6 | Court et structuré, mais saturé de termes techniques bruts. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 2 | Markdown, frontmatter, marked, gray-matter, sitemap, Vercel, OG, CI : aucun glossé. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 4 | Survole. "Quelques lignes de Node suffisent" sans jamais montrer comment. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 6 | 1ère personne OK mais ton plus geek que Leo. "J'ai décidé de craquer" un peu sec. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 3 | Inaccessible à un non-dev dès la 2e section. Hors cible totale du site. |

## Verdict
**❌ À refaire**

Cet article est écrit pour des développeurs, pas pour le public Jérémy. Markdown, frontmatter, gray-matter, sitemap, regex, Open Graph, CI custom, static site generator — tout est balancé sans glose. Pour quelqu'un qui n'a jamais codé, c'est de l'arabe. Le ton Leo est aussi en retrait : phrases courtes mais sèches, peu de chaleur, pas de "je peux me tromper". À refaire en mode "voici comment je publie un article sur mon site, version humaine, sans nommer d'outils techniques".

## 3 à 5 passages problématiques (verbatim)
- « Un dossier drafts/ pour les articles en cours de rédaction en markdown » → "markdown" jamais expliqué. Suggestion : « un dossier drafts/ où je dépose mes articles écrits dans un format texte simple appelé markdown (comme un Word, en plus léger) ».
- « Mon premier réflexe a été de supporter 100% de la syntaxe markdown + 50 composants custom. Résultat : 800 lignes de script pour une utilité marginale. Je suis revenu en arrière : marked + gray-matter + quelques regex suffisent pour 95% des cas. » → 4 termes opaques d'affilée (composants custom, marked, gray-matter, regex). Pour un non-dev c'est illisible. À reformuler complètement ou à supprimer.
- « Vercel met un temps à invalider les previews OG. Prévoir une relecture sérieuse avant le premier push. » → "previews OG", "push" : jargon brut. Le débutant n'a aucune idée de quoi on parle.
- « Aucune config à gérer, aucune CI custom à maintenir. C'est la magie des sites statiques : on publie, ça marche. » → "config", "CI", "sites statiques" : trois termes techniques en deux phrases.
- « Tu perds plus de temps à déployer qu'à écrire ? C'est le signe qu'il te faut un pipeline. Quelques lignes de Node suffisent — pas besoin de monter une usine. » → "déployer", "pipeline", "Node" : aucun glossé. Et pas de pas-à-pas qui montre les "quelques lignes". On reste dans l'incantation.

## 3 à 5 passages réussis (verbatim)
- « Avant, publier un article sur mon site me prenait 3 heures de copier-coller HTML. Maintenant, j'écris un fichier markdown avec Claude Code, je lance une commande, l'article est en ligne. » → bon contraste avant/après, ouverture honnête.
- « Bref, 3 heures pour un article de 7 minutes de lecture. J'ai décidé de craquer là-dessus. » → 1ère personne, chiffres concrets, ressenti partagé.
- « (1) Le frontmatter est complet. (2) J'ai relu le MD à voix haute (test ton Leo). (3) Les liens internes pointent vers des articles qui existent. » → check-list claire (mais "frontmatter", "MD" à glosser).
- « Si tu veux voir comment évolue cette stack, réponds à la newsletter — je publierai les retours d'XP dès qu'il y a quelque chose à raconter. » → bon respect de la règle "appel à réponse" (mais "stack", "XP" jargon).

## Recos prioritaires (3 max, actionnables)
1. **Repositionner l'article : "à qui ça s'adresse ?"**. Soit assumer "ce tuto est pour des dévs" (et le sortir du parcours débutant), soit le réécrire pour non-dev avec aucun nom technique nommé hors glose. La V actuelle est entre deux.
2. **Glossariser ou retirer chaque mention technique** : markdown, frontmatter, marked, gray-matter, regex, sitemap, OG, CI, push, deploy, Vercel, Node, stack. Si un mot n'est pas expliqué, soit on l'explique, soit on le supprime.
3. **Ajouter le pas-à-pas qui manque** : montrer le contenu d'un fichier markdown source, montrer le HTML généré, montrer la commande exacte. Aujourd'hui l'article décrit le concept sans jamais montrer le concret. Pour un débutant, voir = comprendre.
