# Audit ton — Le LLM Wiki, ton deuxième cerveau

**Note globale : 6/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 7 | Très bien structuré, comparatif clair, mais quelques phrases longues et anglicisées. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 4 | RAG glosé tardivement, GraphRAG / embeddings vectoriels / Mem0 / Zep / lint / ingest non glosés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 7 | Bonne section seuils + setup en 4 étapes, mais saute « ouvre le terminal », « claude » non expliqué. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 6 | Honnête sur les seuils, mais ton un peu consultant ; peu de « je » personnels. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 5 | OK jusqu'aux 3 couches puis décroche : `mkdir`, `claude`, vault Obsidian, lint. |

## Verdict
**[ ⚠️ À retoucher ]**

Le meilleur des 3 articles audités sur la structure (excellente section « à partir de quand ça vaut le coup », tableau comparatif honnête avec NotebookLM / Notion / GraphRAG, seuils chiffrés). Mais le contenu reste truffé d'anglicismes non traduits (lint, ingest, query, deep dive, track, vault, fan wiki, compound effect, due diligence) et de termes techniques jamais glosés (embeddings vectoriels, GraphRAG, Mem0, Zep). Le setup minimal balance des commandes shell sans expliquer ce qu'est un terminal ni Claude Code. Cible « curieux patient » revendiquée mais le débutant absolu décroche à mi-parcours.

## 3 à 5 passages problématiques (verbatim)
- « **Lint · Tu maintiens la qualité (mensuellement)** [...] C'est l'opération que beaucoup d'articles dérivés oublient » → « lint » est un mot de dev (vérification automatique de code) jamais glosé. Le verbe revient ensuite (« la passe de lint mensuelle »). Suggestion : intituler « Nettoyer · Tu fais le ménage (1× par mois) » et glisser entre parenthèses « ce que les développeurs appellent un "lint" : passer en revue ce qui doit être corrigé ».
- « les RAG modernes (GraphRAG de Microsoft, Mem0, Zep) [...] stockent tout dans des **embeddings vectoriels opaques** » → quatre concepts dev empilés sans glose, et « embeddings vectoriels opaques » est inintelligible pour un débutant. Suggestion : « les RAG modernes (comme GraphRAG de Microsoft) stockent tout sous une forme mathématique que l'IA comprend mais que toi, tu ne peux pas relire ».
- « ```mkdir mon-wiki / cd mon-wiki / mkdir sources wiki``` » suivi de « `claude` » → premières commandes de terminal du site sans aucune explication préalable. Le débutant ne sait pas où taper ces lignes. Suggestion : ajouter une étape 0 « Ouvre le Terminal (Mac : Cmd + espace, tape "Terminal"...) » comme dans l'article référence ollama.
- « **Track ta vie** [...] **Deep dive un sujet** [...] **Fan wiki personnel** [...] **Due diligence** » → 4 titres de section sur 6 en franglais, dans un site dont la règle d'or est « pas d'anglicismes type free ou scroll ». Suggestion : « Suivre ta vie », « Plonger dans un sujet », « Wiki personnel d'une œuvre », « Étudier une boîte avant de signer ».
- « **Dérive épistémique** » → terme universitaire, ton qui décroche complètement du Leo. Suggestion : « **L'erreur qui contamine tout** — si l'IA se trompe au moment d'enregistrer une source [...] » (et garder le contenu pédagogique qui suit, qui lui est très bon).

## 3 à 5 passages réussis (verbatim)
- « **Moins de 10 sources · Non** [...] C'est disproportionné. Utilise les **Projects dans Claude.ai** » → exactement le ton Leo : on dit non au lecteur, on l'envoie ailleurs s'il n'a pas besoin. Anti-vente, pédagogique, parfait.
- « Un RAG classique, c'est comme si tu avais un bibliothécaire qui ne connaît pas les livres, les lit uniquement quand tu poses une question, puis les oublie. **Un LLM Wiki, c'est un bibliothécaire qui a lu chaque livre**, a pris des notes, fait des fiches » → métaphore puissante, mémorable, exactement le niveau de l'article référence.
- « **Tu n'es pas à l'aise avec la ligne de commande ?** Commence par **Claude Projects** ou **NotebookLM**. Tu auras 80% des bénéfices d'un LLM Wiki sans toucher à Claude Code. » → bienveillance + alternative concrète, pile dans le pitch « centré lecteur » de la home.
- Le tableau comparatif (Claude Projects vs NotebookLM vs Notion vs LLM Wiki vs GraphRAG) avec colonne « Pour qui » → niveau pro, transparent, aide vraiment à décider.
- « **Coût tokens réel** — un ingest touche 5 à 15 pages = 20 000 à 50 000 tokens en sortie. À 15$ le million [...] compte **0,5 à 1$ par source**. 100 sources = 50 à 100$. Pas catastrophique, mais à savoir avant de foncer. » → chiffres concrets + verdict tranché, ton Leo.

## Recos prioritaires (3 max, actionnables)
1. **Franciser les titres de sections et les verbes-pivots** : « Ingest » → « Ajouter une source », « Query » → « Poser une question », « Lint » → « Faire le ménage », « Track ta vie » → « Suivre ta vie », « Deep dive » → « Plonger dans », « Due diligence » → « Étudier une boîte ». La règle FIESTA du site bannit explicitement les anglicismes — l'article les multiplie.
2. **Ajouter un encadré « pré-requis » avant le Setup minimal** : qu'est-ce qu'un terminal, comment ouvrir Claude Code, où on tape les commandes. Sans ça, l'étape 01 (`mkdir mon-wiki`) est un mur. L'article référence (llm-local) le fait très bien.
3. **Gloser systématiquement les 5 termes techniques pivots à leur première apparition** : RAG (déjà OK mais à refaire plus tôt), embeddings vectoriels, GraphRAG, vault Obsidian, schema. Méthode : analogie + 1 phrase entre parenthèses, comme l'article référence pour « 7B = 7 milliards de paramètres ».
