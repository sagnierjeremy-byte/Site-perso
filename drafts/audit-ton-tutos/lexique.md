# Audit ton — Lexique 8 mots techniques

**Note globale : 8.5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 9 | Structure répétée 6 blocs par entrée = lecteur sait toujours où il est. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 8 | Excellent globalement, mais entrées .env et MCP introduisent du sous-jargon (commit, shell, MCP server). |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 9 | Pattern « phrase / analogie / cas / où / comment / quand ignorer » exemplaire. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 9 | « Je peux me tromper, écris-moi », « moi j'estime toujours avant », parfait. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 7 | Entrées 1, 4, 6, 7 OK. Entrées 2 (.env) et 3 (token) supposent déjà un projet/code. |

## Verdict
**OK · À publier tel quel** (avec 1-2 retouches sur l'entrée .env)

C'est l'article qui tient le mieux le ton de référence — il est même structurellement plus lisible que `llm-local-pour-non-dev.html` grâce à son canevas répété. Analogies brillantes (badge salle de sport, trousseau de clés, Uber, USB-C, V8/hybride/citadine, manuels du cuisinier, App Store). Promesse « tu peux l'ignorer si... » à chaque fin d'entrée = relâche la pression. Seule faiblesse : l'entrée .env présuppose un « projet », un « .gitignore » et un usage de GitHub que le lecteur cible n'a pas.

## 3 à 5 passages problématiques (verbatim)
- « Avant de sauvegarder quoi que ce soit sur GitHub, vérifie que le fichier .gitignore contient bien la ligne .env. » → entrée 02 suppose que le lecteur sait ce qu'est GitHub et un .gitignore. Aucune glose. Pour un vrai débutant, on le perd ici. Suggestion : ouvrir l'entrée par « Tu peux totalement sauter celle-ci si tu n'as pas encore de projet de code à toi. Reviens-y le jour où un tuto te demande de créer un fichier .env. »
- « Vocabulaire rapide : CLI = le principe (interface en ligne de commande), Terminal = l'application qui ouvre la fenêtre, Shell = le moteur qui tourne dedans (bash ou zsh sur Mac, PowerShell sur Windows). Tu n'as pas besoin de retenir, je te le remets juste au cas où tu le croises. » → le « tu n'as pas besoin de retenir » sauve, mais 5 termes nouveaux dans une parenthèse = surcharge. Trop dense pour un débutant. À aérer en bullet list ou à reporter en encart.
- « les secrets ne touchent jamais le disque, déverrouillage par Touch ID » et « rotation automatique des clés, pratique à partir de trois personnes » → 1Password CLI et Doppler sont mentionnés comme « pour aller plus loin » mais avec du vocabulaire (rotation, CLI, secrets) qui fait peur. Soit raccourcir radicalement, soit déplacer en note de bas de page.
- « MCP server », « connecteur MCP », « auth en 1 clic » dans l'entrée 05 → 3 micro-jargons cumulés. « Auth » devrait être « tu te connectes » ; « server » à éviter, dire « brique logicielle » ou supprimer.
- « Claude pondu 400 lignes » dans l'entrée 08 (plugin code-simplifier) → « pondu » = familier, à banni selon le CLAUDE.md du projet. Remplacer par « écrit » ou « produit ».

## 3 à 5 passages réussis (verbatim)
- « C'est l'USB-C de l'intelligence artificielle. Souviens-toi d'avant : chaque appareil avait son propre câble. » → analogie MCP la plus pédagogique vue à ce jour sur le sujet, débloque immédiatement.
- « Imagine trois moteurs dans le même garage. Opus, c'est le V8 de compétition (...) Sonnet, c'est l'hybride familial (...) Haiku, c'est la citadine électrique. » → analogie modèles brillante, on n'oublie plus.
- « Un email court = quelques centimes. Un contrat de cinquante pages = plusieurs euros. Moi, j'estime toujours avant de lancer une boucle pour éviter la mauvaise surprise le lendemain. » → ton Leo + chiffres concrets + vécu personnel, niveau référence.
- « Tu peux l'ignorer si… Tu utilises uniquement claude.ai ou l'application mobile pour discuter avec Claude. » → la rubrique « ignorer si » à la fin de chaque entrée est un cadeau au débutant : elle relâche la pression et balise le « pas pour toi maintenant ».
- « Pour vérifier qu'un skill fonctionne : lance une demande qui correspond à sa spécialité et regarde si Claude applique la méthode du skill sans que tu la rappelles. Si oui, c'est en place. » → critère de vérification concret, accessible, parfait pas-à-pas.

## Recos prioritaires (3 max, actionnables)
1. **Reformuler l'entrée 02 (.env)** en ouvrant par un « tu peux totalement sauter pour l'instant si tu n'as pas encore de projet de code à toi » — sinon on perd le débutant ici, alors qu'il en avait gagné un par l'entrée 01. Idéalement, déplacer cette entrée en position 7 ou 8 dans le sommaire, après MCP qui est plus parlant.
2. **Remplacer « Claude a pondu 400 lignes »** par « Claude a produit 400 lignes » — seule occurrence familière repérée, viole la règle CLAUDE.md « PAS familier ».
3. **Ajouter une glose 1-ligne sur GitHub et .gitignore** dans l'entrée 02 (par exemple « GitHub = le coffre-fort en ligne où tu envoies ton code ; .gitignore = la liste des fichiers à laisser dans ton ordi seulement »). Sans ça, deux phrases-clés du tuto sécurité tombent dans le vide pour un non-dev.
