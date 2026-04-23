# Audit ton — Construire un Hermes Agent pas à pas

**Note globale : 5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 6 | Phrases courtes mais blocs techniques (Python, JSON, tableaux RAM) cassent le rythme. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 3 | Fine-tuner, function calling, GGUF, quantization, Q4, tok/s, MCP, baseURL : balancés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 5 | Setup Ollama OK, mais bond brutal vers "définir tes outils en Python". |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 7 | « Je » très présent, vécu chiffré (« 200 mails sur 7 jours »), bonne transparence. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 3 | L'article s'auto-déclare « 100% dev / Avancé » — assumé, mais alors hors cible débutant. |

## Verdict
**⚠️ À retoucher** (ou à repositionner clairement comme tuto avancé hors-parcours débutant)

Le ton Leo est le plus juste des 4 articles audités (vécu perso précis, chiffres réels, transparence sur ce qui a échoué). MAIS l'article assume « 100% dev / niveau avancé » dès l'encadré d'intro — donc hors-cible "débutant qui n'a jamais codé" du brief. Si on garde la cible débutant, c'est à refaire en simplifiant 70% du contenu (retirer Python, JSON, tableau RAM/tok/s). Si on l'assume comme tuto avancé du parcours, alors la note tient, mais il faut quand même gloser GGUF, Q4, fine-tuning, function calling.

## 3 à 5 passages problématiques (verbatim)
- « ils sont fine-tunés pour agir, pas juste discuter » → "fine-tunés" jamais expliqué. Suggestion : "ils sont ré-entraînés (on dit fine-tunés) pour agir, pas juste discuter".
- « Tous deux excellent en function calling — c'est-à-dire appeler des outils/fonctions via du JSON structuré. » → glose présente mais le terme "JSON structuré" tombe sec ; un débutant ne sait pas ce qu'est du JSON. Suggestion : "via un format de message normalisé qu'on appelle JSON".
- « Règle réelle : il te faut environ 1,2× la taille du fichier quantifié » + tableau « Taille Q4 / RAM mini / tok/s / bande passante 200 GB/s » → empilement de termes techniques jamais introduits. Quantification, Q4, tok/s : à expliquer ou à retirer du tuto débutant.
- « ⚠️ Article 100% dev · à lire avant de te lancer […] Tu n'es pas dev ? Pas grave » → bon réflexe d'avertissement, MAIS le tuto garde quand même la promesse "non-dev" dans la nav du parcours. Soit le sortir du parcours débutant, soit faire une vraie version vulgarisée.
- « Ollama expose une API OpenAI-compatible. Utilise le SDK OpenAI avec la baseURL locale » → "API", "SDK", "baseURL" : trois termes techniques en une phrase, aucun glossé. Suggestion : ajouter une phrase d'intro "Ollama parle le même langage que ChatGPT (techniquement, une API compatible OpenAI), donc on peut utiliser le même outil de programmation (le SDK)".

## 3 à 5 passages réussis (verbatim)
- « **Résultat :** 91% bien classés (182 sur 200), 11 erreurs de tag, 8 faux positifs "spam soft", 4h économisées sur la semaine » → vécu chiffré, transparence sur les erreurs : ton Leo signature.
- « Les 2 qui ont échoué : (1) « Tag "important" selon ton intuition » → trop vague, il taggait 80% des mails en "important". (2) … il a commencé à répondre à ma mère comme si c'était un prospect. J'ai coupé le tool "send_email" immédiatement. » → admission d'échec, anecdote concrète, ton Jérémy authentique.
- « **Le piège n°1 si tu copies-colles ce code ailleurs** : le champ tool_call_id est obligatoire […]. Je l'ai appris à mes dépens — noté pour toi. » → posture d'apprenti qui partage, exactement le ton voulu.
- « Mon conseil : teste les 3 sur ton cas réel, garde celui qui te sort les meilleurs résultats. Le "meilleur" varie selon la tâche. » → "je", conseil tranché, anti-disclaimer.
- « Si tout ce qui précède t'a un peu perdu, bonne nouvelle : tu peux avoir 70% du résultat sans écrire une ligne de code. » → exit ramp pour débutant, posture bienveillante.

## Recos prioritaires (3 max, actionnables)
1. **Décider le statut de l'article dans le parcours** : si on le garde dans "Apprendre" comme étape 03, alors couper les blocs Python (étapes 01-03 « construire un agent ») et renvoyer vers un repo GitHub pour les courageux. Si on l'assume comme tuto pro avancé, le sortir du parcours débutant et l'étiqueter clairement « Niveau avancé · réservé devs ».
2. **Glosser systématiquement** : fine-tuning, function calling, JSON, API, SDK, MCP, GGUF, quantization, Q4, tok/s. Soit en parenthèses dans le texte, soit via les liens vers `lexique.html` (déjà utilisés pour "modèle" et "skill-agent" — étendre le pattern).
3. **Préserver le bloc "version 2 minutes sans Python" en l'enrichissant** : c'est la perle de l'article pour le débutant. Le remonter plus tôt (avant l'étape Python) et le développer en mini-tuto Claude.ai à part entière.
