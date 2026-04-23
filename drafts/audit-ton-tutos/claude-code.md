# Audit ton — Guide d'installation Claude Code

**Note globale : 6.5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 7 | Bonne en intro, devient sèche dans les 4 étapes d'install + liste des 37 skills. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 5 | commit, ZIP, ranker, ghostwriter, dmg/exe, diff, MCP, ~/.zshrc balancés sans glose. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 7 | 4 étapes numérotées OK, mais la sortie « bravo tu es prêt » saute le « et maintenant ». |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 7 | Bonne intro Jérémy + transparence newsletter, mais « pondu », « la sécu », « casse, adapte » dérapent. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 6 | Bloc liste de 37 skills (noms anglais en kebab-case) = mur infranchissable pour le profil cible. |

## Verdict
**À retoucher**

C'est l'article qui décroche le plus du ton de référence. Pas catastrophique : la structure 4 étapes est bonne, l'ouverture « Salut, moi c'est Jérémy. Je ne suis ni dev ni codeur » pose le ton Leo, et la mention de l'app Claude Desktop (« tu peux éviter le terminal complètement ») est un excellent réflexe d'inclusion. Mais 3 problèmes : (1) l'article promet « 20 minutes » mais la liste de 37 skills + 6 plugins + dépannage dépasse largement ; (2) le jargon dev s'accumule sans glose dans la 2ᵉ moitié (« commit », « diff », « relance ton terminal », « ~/.zshrc », « source ~/.zshrc ») ; (3) le bloc des 37 skills est une avalanche de noms anglais en kebab-case (`stripe-integration-expert`, `geo-content-optimizer`, `playwright-pro`...) que le débutant n'a aucune raison de comprendre. Comparé à la finesse pédagogique de `llm-local-pour-non-dev.html` ou de `lexique.html`, le contraste est marqué.

## 3 à 5 passages problématiques (verbatim)
- « Quand j'ai besoin d'écrire une landing, un email, une page — je lance Claude Code. (...) Avant de commit, je lui fais passer security-review sur le diff. » → 3 mots techniques d'un coup (landing, commit, diff) dans la section « au quotidien ». Pour le profil cible, « commit » et « diff » sont opaques. Reformuler : « Avant d'enregistrer mon travail (faire un commit), je lui fais auditer ce que j'ai modifié (le diff). »
- « Agent qui simplifie le code récemment modifié. Utile quand Claude a écrit 400 lignes pour une fonction qui en méritait 100. Tu lui demandes "simplifie", il réduit sans casser le comportement. » → bon contenu mais le lecteur cible « entrepreneur, marketeur, rédacteur, indépendant » (ta promesse au-dessus) ne lit jamais une ligne de code. Cette section parle à un autre public. Soit la sortir, soit reformuler depuis l'angle « moins de coût, moins de bugs ».
- « Tu fais du dev / Product, solo-dev, tech lead. Tu codes, tu déploies, tu audites. » → 4ᵉ profil de « par où commencer » casse complètement la promesse d'inclusion débutant. À renommer « Tu construis des produits techniques » et glisser en dernier, ou retirer.
- « 26 skills custom (...) + 11 skills officiels Anthropic = 37 skills sur ma machine. Voici le détail par catégorie » → pavé de 37 lignes en anglais kebab-case sans pédagogie. Le débutant qui s'est laissé porter jusque-là décroche net. Suggestion : retirer la liste exhaustive (la mettre en téléchargement annexe) et garder 5 skills nommés en français avec « ce que ça fait pour toi ».
- « Test : Crée-moi un fichier hello.txt avec 'Hello world' dedans » → premier exemple de prompt = un truc de dev ("hello world"). Pour quelqu'un qui n'a jamais codé, c'est un signe culturel d'exclusion. Remplacer par un truc utile : « Crée-moi un fichier liste-courses.txt avec 5 produits dedans » ou « Liste-moi tous les fichiers de ce dossier ».

## 3 à 5 passages réussis (verbatim)
- « Salut, moi c'est Jérémy. Je ne suis ni dev ni codeur — je suis juste un entrepreneur qui utilise Claude Code tous les jours pour ne pas être dépassé. » → ouverture niveau référence, ton Leo parfait.
- « Tu préfères éviter le terminal complètement ? Anthropic a sorti en avril 2026 une app Claude Desktop (Mac + Windows) avec un onglet Code, zéro commande à taper. » → réflexe d'inclusion exemplaire, sauve la moitié des lecteurs qui auraient abandonné.
- « Aucun souci — l'app Terminal de macOS (déjà installée) fait parfaitement le boulot. Saute cette étape et passe à l'étape 02. » → option de sortie posée à chaque étape optionnelle, exactement le bon réflexe pédagogique.
- « Transparence : ton email t'inscrit à ma newsletter AI Playbook (1 email/semaine sur l'IA en pratique). Désinscription en 1 clic. » → transparence parfaitement Leo, à dupliquer partout sur les downloads.
- « Réponds à ma newsletter — je reçois ton email directement, je te débloque. Je lis tout. » → CTA dépannage chaleureux et actionnable, reproduit la promesse du site.

## Recos prioritaires (3 max, actionnables)
1. **Trancher le public cible et trier le contenu en conséquence.** Aujourd'hui l'article promet « entrepreneur, marketeur, rédacteur, indépendant » mais bascule à mi-parcours sur du contenu pour développeur (skills `playwright-pro`, `postgres-patterns`, `senior-backend`, profil « solo-dev », vocabulaire commit/diff/zshrc). Choisir : soit non-dev → sortir le bloc dev complètement (le mettre dans un article séparé `claude-code-pour-dev.html`), soit hybride → faire 2 colonnes parallèles avec mention claire « si tu codes, va à droite ».
2. **Réécrire la liste des 37 skills.** Aujourd'hui c'est un mur de noms anglais kebab-case sans pédagogie. Cible : 5 à 8 skills max, nommés en français (« Cold email », « Audit SEO », « Réécriture marketing »), avec en dessous « ce que tu peux lui demander concrètement ». Le pack zip reste téléchargeable pour ceux qui veulent les 26.
3. **Gloser ou retirer commit, diff, ~/.zshrc, dmg/exe, source.** Soit en inline (« faire un commit = enregistrer une version sauvegardable de ton travail »), soit en pop-over si techniquement possible. Sans ça, la section dépannage et la section « au quotidien » perdent leur lecteur en 3 lignes.
