# Audit ton — Les travaux de Karpathy, vulgarisés

**Note globale : 6,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 7 | Phrases courtes, bonne aération, mais densité de noms propres et concepts non amortis. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 5 | « Software 3.0 », « LLM OS », « jagged intelligence », « embeddings » balancés sans glose. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 6 | Bonne structure 3 idées + 4 ressources, mais saute « token » vite et ne dit pas comment regarder. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 8 | « Je le suis », « ce qui m'a marqué », chaleureux. Quelques anglicismes (« vibe », « scale »). |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 6 | Tient debut puis décroche au callout 2025-2026 (vibe coding / LLM OS / decade of agents). |

## Verdict
**[ ⚠️ À retoucher ]**

Article court et bien intentionné, ton Leo correctement tenu sur les 2/3 du texte. Mais le callout « Ce qu'il dit en 2025-2026 » empile cinq concepts pointus (vibe coding, LLM OS, jagged intelligence, decade of agents, human-in-the-loop) sans en gloser un seul — un débutant perd pied. La section « Concret pour ton business » fonctionne mais introduit le calcul tokens (3$ le million, Sonnet) sans avoir préparé le lecteur à ces unités. Quelques retouches ciblées et c'est bon.

## 3 à 5 passages problématiques (verbatim)
- « **Vibe coding** (février 2025) — "oublie le code, laisse l'IA coder, toi tu vibe" » → « vibe » non traduit + ton anglais qui décroche du registre français. Suggestion : « Vibe coding (février 2025) — l'idée de "laisser l'IA coder pendant que toi tu pilotes l'intention". C'est ce qui a fait exploser des outils comme Cursor ou Lovable (des éditeurs de code où tu décris ce que tu veux et l'IA l'écrit) ».
- « **LLM OS** — imaginer le LLM comme le cœur d'un nouveau système d'exploitation (le contexte = RAM, les embeddings = disque dur, les outils = périphériques). » → quatre termes (LLM, RAM, embeddings, périphériques) en une phrase pour un débutant = surcharge totale. Suggestion : virer la phrase ou la décortiquer en 3 phrases avec gloses.
- « **"Decade of agents, not year of agents"** » → titre laissé en anglais brut. Suggestion : « "Une décennie d'agents, pas une année d'agents" — autrement dit, les agents IA autonomes mettront dix ans à devenir vraiment fiables, pas un an comme on l'entend partout ».
- « **500 descriptions × 2 000 tokens = 1M tokens.** À 3$ le million (Claude Sonnet), ça te coûte **3$.** » → premier calcul tokens du site sans poser que 1 token ≈ 3 caractères. Le débutant lit « 1M tokens » comme un chiffre abstrait. Suggestion : ajouter une phrase « (1 million de tokens, c'est environ 750 000 mots — un livre entier) » avant de balancer le prix.
- « PhD à Stanford avec Fei-Fei Li. Co-fondateur d'OpenAI en 2015. » → enchaînement d'autorité sans expliquer qui est Fei-Fei Li (la « marraine » du deep learning vision). Pour un débutant total, ce nom ne dit rien et la phrase devient du name-dropping.

## 3 à 5 passages réussis (verbatim)
- « **Un LLM, c'est un "simulateur de texte"** [...] Pas de conscience, pas de raisonnement au sens humain — juste une machine à prédire le mot suivant, incroyablement bien calibrée. » → métaphore claire, glose immédiate, pile dans le ton Leo.
- « Je ne suis pas dev. Mais quand Karpathy explique comment fonctionne un LLM, je comprends. » → 1ère personne assumée, vulnérable, exactement le pitch « entrepreneur curieux » du site.
- « **Pas le temps pour 15h de vidéos ?** Regarde juste **Deep Dive into LLMs like ChatGPT (3h31, février 2025)** » → le lecteur pressé est pris en charge, recommandation tranchée, durée chiffrée.
- « "chat" c'est 1 token, "anticonstitutionnellement" c'est 6 tokens. » → deux exemples, mémorable, parfait pour ancrer un concept abstrait.
- « tu n'as pas besoin de savoir coder pour "programmer" une IA. Un prompt structuré — contexte, rôle, format, exemples — c'est littéralement du code en français. » → reformulation pédago, lecteur valorisé sans flatterie.

## Recos prioritaires (3 max, actionnables)
1. **Réécrire entièrement le callout « Ce qu'il dit en 2025-2026 »** : actuellement c'est un tas de jargon sans glose. Soit virer 3 items sur 4 et ne garder que « decade of agents » (avec traduction), soit gloser systématiquement chaque terme entre parenthèses comme dans l'article référence (« RAG » = « bibliothécaire qui a lu chaque livre »).
2. **Préparer le concept de tokens avant de l'utiliser dans les calculs business** : ajouter 2 lignes après « "anticonstitutionnellement" c'est 6 tokens » pour donner l'ordre de grandeur (« en gros, 1 million de tokens = 750 000 mots = un livre entier ») — sinon le « 3$ le million » sonne abstrait.
3. **Traduire ou supprimer les 4-5 anglicismes** qui décrochent du ton Leo : « vibe », « scale », « livrable », « decade of agents », « human-in-the-loop », « jagged intelligence ». L'article référence parle français même quand le concept est anglo (« mémoire unifiée », pas « unified memory »).
