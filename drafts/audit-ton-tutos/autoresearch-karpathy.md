# Audit ton — Les agents qui s'auto-améliorent (autoresearch)

**Note globale : 4,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 6 | Phrases OK mais blocs de jargon non aérés ; le bloc résultats est très dense. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 3 | GPU, depth=12, val_bpb, hyperparamètres, optimiseur, SWE-bench, F1, framework — non glosés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 5 | Boucle décrite mais pré-requis (Claude Code, Python, repo, GitHub) supposés acquis. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 6 | Bons retours d'expérience, mais ton consultant techno qui ressort par moments. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 3 | Annoncé « Curieux » mais réel = niveau dev. Débutant largué dès le « depth=12 ». |

## Verdict
**[ ❌ À refaire ]** (ou retoucher en profondeur — 50% du texte est inadapté au public)

L'article a un cœur d'idée fort et un excellent callout d'avertissement marketing IA très Leo. Mais il enchaîne des éléments techniques (depth=12, val_bpb, GPU, tokenizer, hyperparamètres, optimiseur, SWE-bench, ICLR 2025, F1, LangGraph, CrewAI, AutoGen, pip install) sans en expliquer un seul. Un lecteur qui n'a jamais codé décroche dès la troisième paragraphe. Le pas-à-pas « Tu lances ton agent (Claude Code, Codex, etc.) dans le repo » suppose qu'on sait ce qu'est un repo et un agent CLI. À retravailler en mode « entrepreneur curieux » ou à classer dans les articles avancés.

## 3 à 5 passages problématiques (verbatim)
- « le repo contient un modèle GPT miniature qui s'entraîne en 5 minutes sur un seul GPU. L'agent IA peut **modifier le code d'entraînement** (architecture, optimiseur, hyperparamètres, tout) » → cinq termes techniques (repo, GPU, code d'entraînement, optimiseur, hyperparamètres) dans une phrase, zéro glose. Suggestion : « le projet contient un mini cerveau IA qui apprend en 5 minutes sur un ordinateur équipé d'une carte graphique puissante. L'agent IA peut modifier la recette de l'apprentissage (la structure du modèle, les réglages, tout) ».
- « Karpathy a laissé tourner son agent pendant **environ 48h** sur un modèle taille *depth=12*. L'agent a retenu **20 changements additifs** qui [...] ont réduit le *Time-to-GPT-2* de **2h02 à 1h48** » → « depth=12 », « changements additifs », « Time-to-GPT-2 » = jargon de chercheur. Suggestion : retirer ces métriques précises, garder l'idée (« l'agent a tourné 48h et trouvé 20 améliorations qui ont rendu un autre modèle 11% plus rapide »).
- « Sakana AI — Darwin Gödel Machine (mai 2025) : un agent qui réécrit son propre code et grimpe de **20% à 50% sur SWE-bench**, et de 14% à 30% sur Polyglot. » → SWE-bench et Polyglot non expliqués. Pour un débutant : chiffre flou + nom inconnu = bruit. Suggestion : « grimpe de 20% à 50% sur SWE-bench (un test qui mesure la capacité d'une IA à corriger de vrais bugs dans du code) ».
- « Tu lances ton agent (Claude Code, Codex, etc.) dans le repo » → le débutant ne sait ni ce qu'est Claude Code (CLI ?), ni Codex, ni un repo. Aucun lien vers les articles d'introduction. Suggestion : commencer par un encadré « Avant de te lancer : tu dois avoir installé Claude Code (mon tuto ici → loops-claude.html) et compris ce qu'est un dépôt de code ».
- « **CrewAI** — framework multi-agents avec rôles et mémoire persistante. [...] **AutoGen (Microsoft)** [...] **LangGraph** — devenu la référence 2026 pour les workflows d'agents complexes avec état partagé. » → 4 outils dev en 1 callout, jargon « framework », « workflows », « état partagé » non glosé, et ce dans un article qui dit servir au « non-chercheur ».

## 3 à 5 passages réussis (verbatim)
- « **Attention marketing IA · à lire avant de rêver** [...] tu vas passer **2-3 weekends à comprendre comment ça fonctionne**, tu vas **rater tes 10 premiers runs** [...] et tu auras peut-être **10 à 30% d'amélioration** — pas 300%. » → exactement le ton Leo : honnête, contrariant, contre l'hype, chiffres réalistes. Pépite de l'article.
- « **Les chiffres que je donne viennent de MON expérience** [...] Ce n'est pas une science, c'est un témoignage. » → transparence parfaite, recommandée par le CLAUDE.md (« je peux me tromper »).
- « Ton vrai travail devient d'écrire un meilleur `program.md`, pas d'écrire du code Python. » → reformulation accessible et valorisante du basculement, bonne pédagogie.
- « **Mon retour après 3 semaines de test sur ce schéma** [...] Si ton agent tourne dans le vide, c'est presque toujours ton `program.md` qui est flou, pas l'agent qui est en cause. » → vécu personnel, leçon actionnable, ton du copain qui a essayé.
- L'exemple `program.md` cold email : très concret, copiable, structure claire (Objectif / Variables / Cadre fixe / Boucle / Métrique / Garde-fous). Ça, c'est du Leo.

## Recos prioritaires (3 max, actionnables)
1. **Trier les passages techniques en 2 catégories** : ce qui est essentiel à comprendre (la boucle ingest/test/garde) → garder en français simple avec gloses systématiques ; ce qui est de la preuve technique (depth=12, val_bpb, SWE-bench, F1) → soit virer, soit isoler dans un encadré « pour les techniques qui veulent vérifier » assumé comme tel.
2. **Ajouter un préambule « ce qu'il faut savoir avant »** : Claude Code = c'est quoi (lien vers l'article du site), repo = un dossier de code partagé sur GitHub, agent CLI = une IA qui te répond dans le terminal. Sans ça, 60% des lecteurs débutants abandonnent.
3. **Reformuler l'intro et le bloc résultats Karpathy** en gardant l'idée mais en retirant les métriques chiffrées de chercheur. Remplacer « 11% plus rapide sur Time-to-GPT-2 » par « un peu plus de 10% plus rapide pour atteindre la même qualité » — l'ordre de grandeur suffit pour le public cible.
