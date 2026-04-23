# Les modèles open weights à installer en local en avril 2026

*Volet 3 du dossier "LLM en local pour les non-dev". On a vu pourquoi le faire et comment l'installer. Maintenant la question qui te bloque : **quel modèle choisir ?** Llama, Mistral, Qwen, DeepSeek, Phi, Gemma… Six familles, des dizaines de variantes, des chiffres barbares partout. On déblaye.*

---

## 1. Comprendre les noms et les tailles (sans jargon)

Quand tu lis « **Llama 3 8B** », le « 8B » signifie 8 milliards de **paramètres**. Un paramètre, c'est un petit réglage interne du modèle. Plus il y en a, plus le modèle a de mémoire pour stocker des connaissances et des nuances de langue. Pense à un cerveau : 8 milliards de neurones réglés un par un.

Concrètement, **chaque paramètre pèse environ 0,5 à 1 octet une fois compressé** (on parle de « quantization », on y revient au volet suivant). Donc un modèle de 8 milliards de paramètres pèse entre **4 et 8 Go sur ton disque**. Et il occupe à peu près autant de RAM quand il tourne.

### Les quatre familles de taille

| Catégorie | Taille | Poids disque (Q4) | RAM nécessaire | Pour qui |
|---|---|---|---|---|
| **Petit** | 1 à 3 milliards | 1 à 2 Go | 4 à 8 Go | Smartphone, vieux laptop, tâches simples |
| **Moyen** | 7 à 14 milliards | 4 à 8 Go | 8 à 16 Go | MacBook récent, PC standard — le sweet spot |
| **Gros** | 30 à 70 milliards | 18 à 40 Go | 32 à 64 Go | Workstation, MacBook Pro 64 Go+ |
| **Très gros** | 100 milliards et + | 60 Go à plusieurs To | Carte serveur ou MoE | Inaccessible sans matos pro |

### Plus gros n'est pas forcément mieux

Règle qui surprend tout le monde : **un modèle 7B bien entraîné en 2026 défonce un modèle 70B de 2023**. Mistral 7B sorti en septembre 2023 battait à l'époque Llama 2 13B. Aujourd'hui Phi-4 14B se compare à Llama 3.3 70B sur du raisonnement. Donc avant de te dire « il me faut le plus gros possible », pose-toi la vraie question : **qu'est-ce que je veux faire ?** Pour répondre à des emails et brainstormer, un 7B suffit largement.

### MoE : la triche intelligente (Mixture of Experts)

Tu vas voir des modèles annoncés bizarrement : **Mixtral 8x7B = 47 milliards de paramètres au total mais seulement 13 milliards actifs à chaque réponse**. Pareil pour Llama 4 Scout (17B actifs / 109B total) ou Llama 4 Maverick (17B actifs / 400B total).

L'idée : le modèle est divisé en plusieurs « experts » spécialisés. Pour chaque mot généré, **un routeur choisit 2 experts sur 8** (par exemple) et ne fait travailler qu'eux. Conséquence : la RAM doit charger les 47 Go en entier, mais le calcul ne mobilise que ~13 Go à la fois → **réponse rapide d'un modèle 13B avec la culture d'un modèle 47B**. Magique, sauf que tu paies en RAM.

---

## 2. Les six familles à connaître

### Famille Llama (Meta) — la marque la plus connue

Meta a démocratisé le local avec Llama 2 en juillet 2023. Depuis, ils enchaînent : Llama 3 (avril 2024), Llama 3.1 (juillet 2024), Llama 3.2 (septembre 2024, version multimodale qui voit les images), Llama 3.3 (décembre 2024). Et le 5 avril 2025, **Llama 4** débarque avec deux modèles MoE :

- **Llama 4 Scout** : 109 milliards de paramètres au total, 17 milliards actifs, **fenêtre de contexte de 10 millions de tokens** (record absolu — tu peux y coller 50 livres d'un coup). Multimodal natif.
- **Llama 4 Maverick** : 400 milliards au total, 17 milliards actifs, 128 experts. Compétitif avec GPT-4 sur de nombreux benchmarks.

**Forces** : écosystème énorme (le plus de fine-tunes communautaires sur HuggingFace), généraliste solide, multilingue correct, marque rassurante.

**Faiblesses** : la **license n'est pas vraiment open source**. Meta interdit l'usage commercial si ton produit dépasse 700 millions d'utilisateurs actifs (Apple, Google, Amazon sont bloqués). Et tu dois afficher « Built with Llama » dans tes produits dérivés. C'est de l'**open weights restrictif**, pas du vrai libre type Apache 2.0. Pour 99,9 % des gens ça change rien, mais sache-le.

### Famille Mistral (français, cocorico) — le rapport qualité/taille

Mistral AI, basée à Paris, a sorti son premier modèle (Mistral 7B) en septembre 2023 et a immédiatement choqué l'industrie : un modèle de 7 milliards de paramètres qui battait Llama 2 13B. Depuis, ils alignent :

- **Mistral 7B** (Apache 2.0) — toujours d'actualité comme défaut universel
- **Mistral Nemo 12B** (Apache 2.0) — sorti en collab avec NVIDIA
- **Mistral Small 3 24B** (Apache 2.0, sorti le 30 janvier 2025) — rivalise avec Llama 3.3 70B, 81 % sur MMLU, 150 tokens/s
- **Mixtral 8x7B et 8x22B** (Apache 2.0) — MoE costauds
- **Mistral Large 3** (propriétaire, API uniquement) — leur modèle de pointe, payant
- **Codestral 22B** (license commerciale spécifique) — spécialisé code

**Forces** : license **vraiment libre** (Apache 2.0) sur les modèles open. Excellent en français natif (c'est rare). Souveraineté européenne (RGPD-friendly, serveurs UE). Rapport qualité/taille imbattable.

**Faiblesses** : leur tout meilleur modèle (Mistral Large 3) est fermé. Codestral a une license un peu chiante pour le commercial pur.

### Famille DeepSeek (chinois) — le tremblement de terre

Le 20 janvier 2025, DeepSeek (laboratoire chinois rattaché au hedge fund High-Flyer) sort **DeepSeek R1**. Quelques jours plus tard, NVIDIA perd **589 milliards de dollars de capitalisation boursière en une seule séance** — record historique. Pourquoi ? Parce que R1 atteint le niveau d'OpenAI o1 (le modèle de raisonnement payant à 200 $/mois) avec un coût d'entraînement annoncé à **5,6 millions de dollars** au lieu de centaines de millions. Et c'est open source.

- **DeepSeek R1 (671B)** : le modèle complet, MoE, inaccessible en local sans cluster GPU. License MIT (la plus libre qui existe).
- **DeepSeek R1-Distill** : 6 versions plus petites (1,5B / 7B / 8B / 14B / 32B / 70B) entraînées à imiter R1. **C'est ces versions que tu installes en local**.
- **DeepSeek V3 / V3.1 / V3.2** : la branche généraliste, mise à jour décembre 2025.
- **DeepSeek R2** : annoncé pour mai 2025, repoussé à plusieurs reprises (problèmes d'entraînement sur les puces Huawei Ascend). Toujours pas sorti en avril 2026, attendu courant 2026.

**Forces** : chain-of-thought visible (tu vois le modèle « réfléchir » dans une balise `<think>` avant sa réponse — fascinant et utile pour comprendre les erreurs). License MIT (la plus permissive). Ratio qualité/coût hallucinant.

**Faiblesses** : la version full R1 (671B) est inaccessible chez toi. Les R1-Distill sont des copies allégées : excellentes mais pas équivalentes au modèle complet. Côté politique, le modèle évite certains sujets sensibles (Place Tian'anmen etc.) — à savoir si tu fais du fact-checking historique.

### Famille Qwen (Alibaba) — le cheval qui monte

Alibaba a sorti **Qwen 3 le 29 avril 2025** avec une gamme délirante : 8 modèles allant de **0,6 milliards** (tient sur un téléphone) à **235 milliards de paramètres** (MoE, 22B actifs).

Modèles disponibles : Qwen3-0.6B / 1.7B / 4B / 8B / 14B / 32B / 30B-A3B (MoE) / 235B-A22B (MoE). Pré-entraînés sur 36 000 milliards de tokens dans 119 langues. Support natif du protocole MCP (Model Context Protocol — celui qui permet aux agents IA de parler à tes outils).

**Forces** : license Apache 2.0. Multilingue (119 langues, dont français correct). Les petits modèles (4B, 8B) sont étonnamment bons. Le 235B-A22B se compare à DeepSeek R1, o1, Gemini 2.5 Pro sur les benchmarks coding et math.

**Faiblesses** : moins d'écosystème français (peu de tutos en VF). Méfiance traditionnelle envers les modèles chinois côté entreprises sensibles.

### Famille Phi (Microsoft) — le petit qui dépote

Microsoft a une thèse contrariante : **petits modèles entraînés sur des données triées et synthétiques peuvent battre des gros modèles entraînés sur du web brut**. Résultat avec Phi :

- **Phi-3 mini (3,8B)** — tient sur un téléphone, qualité étonnante
- **Phi-3 medium (14B)** — solide pour son poids
- **Phi-4 (14B, sorti janvier 2025)** — bat GPT-4o-mini sur MATH et GPQA
- **Phi-4 Reasoning et Phi-4 Reasoning Plus (avril 2025)** — variantes optimisées raisonnement, **dépassent DeepSeek R1-Distill 70B** alors qu'ils font 14B seulement

**Forces** : license MIT (vraiment libre). Petits modèles performants. Excellent en math et raisonnement formel. Idéal si ton hardware est limité.

**Faiblesses** : moins polyvalent en chat ouvert (entraîné sur du contenu « scolaire », parfois trop sec ou refus moralisateur). Multilingue moyen. Moins bon en créativité pure que Mistral ou Llama.

### Famille Gemma (Google) — l'outsider pratique

Google a sorti **Gemma 3 le 12 mars 2025** avec quatre tailles : 1B (texte seul), 4B, 12B et 27B (multimodaux, voient les images). Plus une mini-version 270M pour fine-tuning ultra-spécialisé.

**Forces** : qualité Google (entraînement sérieux), 140+ langues supportées, contexte 128k tokens (sauf 1B qui a 32k), multimodal sur 4B+.

**Faiblesses** : license « Gemma Terms of Use » — pas OSI-approved, mais permissive en pratique (similaire à Llama). Écosystème plus pauvre que Llama ou Mistral.

### Modèles spécialisés (à connaître hors généraliste)

| Tâche | Modèle | License | Pourquoi celui-là |
|---|---|---|---|
| Code | Codestral 22B (Mistral) | Commerciale | Le défaut français pour le code |
| Code | Qwen 2.5-Coder 32B | Apache 2.0 | Bat GPT-4o sur HumanEval (88,4 %) |
| Code | DeepSeek-Coder V2 | MIT | Très bon en complétion |
| Transcription audio | Whisper Large v3 | MIT | OpenAI, 99 langues, FR top |
| Image | FLUX.1 schnell (Black Forest Labs) | Apache 2.0 | Le meilleur libre commercial |
| Image | Stable Diffusion 3.5 | Stability Community | Best-in-class, license OK perso |
| TTS (synthèse vocale) | Coqui XTTS v2 | MPL 2.0 | Voix multilingues |
| TTS premium | Voxtral (Mistral, mars 2026) | À vérifier | Voix ultra naturelle FR |

---

## 3. Quel modèle pour quel hardware (la matrice de décision)

C'est LA question qu'on te pose à chaque fois. Voici la grille :

| Ton hardware | Chat général | Code | Raisonnement | Transcription | Image |
|---|---|---|---|---|---|
| **MacBook Air M2 16 Go** | Mistral 7B Q4, Qwen 3 4B | Qwen 2.5-Coder 7B | Phi-4 14B Q4 | Whisper Base | (limité, lent) |
| **MacBook Pro M3/M4 32 Go** | Mistral Small 3, Llama 3.1 8B | Codestral 22B Q4 | DeepSeek R1-Distill 14B | Whisper Large v3 | FLUX.1 schnell |
| **MacBook Pro M4 64 Go+** | Mixtral 8x7B, Llama 3.3 70B Q4 | Codestral 22B, Qwen Coder 32B | DeepSeek R1-Distill 70B | Whisper Large v3 | FLUX.1 dev |
| **PC + RTX 4070 12 Go VRAM** | Mistral 7B / Llama 3 8B | Codestral 7B | Phi-4 14B Q4 | Whisper Large v3 | FLUX.1 schnell |
| **PC + RTX 4090 24 Go VRAM** | Mixtral 8x7B / Llama 3 70B Q4 | Codestral 22B | DeepSeek R1-Distill 32B | Whisper Large v3 | FLUX.1 dev / SD 3.5 |
| **Mac Studio M3 Ultra 192 Go** | Llama 4 Scout, Qwen 3 235B Q4 | Qwen Coder 32B FP16 | DeepSeek R1-Distill 70B FP16 | Whisper Large v3 | FLUX.1 dev FP16 |

**Comment lire ça** : sur un MacBook Air M2 16 Go, tu télécharges Mistral 7B en Q4 (4 Go), tu lances `ollama run mistral`, et **tu as un assistant qui répond à 25-40 mots par seconde, 100 % offline, gratuit à vie**. C'est ton défaut.

---

## 4. Les 5 modèles à essayer en premier en avril 2026

Si tu démarres aujourd'hui et que tu veux te faire une opinion en une après-midi, télécharge ces 5-là dans cet ordre. Total : ~30 Go, 3 heures de jeu.

| Rang | Modèle | Commande Ollama | Poids | Pourquoi |
|---|---|---|---|---|
| **1** | Mistral 7B Q4_K_M | `ollama pull mistral` | 4 Go | Le défaut universel. 8 Go de RAM suffit. Français natif. Apache 2.0. |
| **2** | Llama 3.1 8B Q4_K_M | `ollama pull llama3.1` | 4,7 Go | Comparaison Mistral vs Meta. Légèrement meilleur en anglais. |
| **3** | Qwen 3 4B | `ollama pull qwen3:4b` | 2,5 Go | Le petit modèle 2026 qui dépote. Idéal si RAM limitée. |
| **4** | DeepSeek R1-Distill 7B | `ollama pull deepseek-r1:7b` | 4,7 Go | Pour découvrir le raisonnement chain-of-thought visible. Effet « wahou » garanti. |
| **5** | Codestral 22B Q4 | `ollama pull codestral` | 13 Go | Si tu codes. Demande du matos (32 Go RAM minimum). |

**Mon conseil tranché** : commence par Mistral 7B. C'est suffisant pour 80 % des cas (rédaction, résumé, brainstorm, traduction FR↔EN, questions générales). Tu verras vite si tu as besoin de plus gros ou plus spécialisé.

---

## 5. Comment les télécharger (3 méthodes)

### Via Ollama (terminal, le plus simple)

```bash
ollama pull mistral
ollama run mistral
```

Une commande, 4 Go téléchargés depuis ollama.com/library, et tu chattes en CLI. Bibliothèque énorme, mises à jour automatiques.

### Via LM Studio (interface graphique, le plus visuel)

LM Studio a un onglet « Discover » qui se branche directement sur HuggingFace. Tu cherches « Mistral 7B GGUF », tu cliques sur la version Q4_K_M (taille ~4 Go), double-clic, ça télécharge et tu chattes dans une UI propre. Parfait si le terminal te fait peur.

### Direct depuis HuggingFace (le plus flexible)

HuggingFace est le GitHub des modèles IA. Tu vas sur huggingface.co/models, tu cherches le modèle voulu, tu télécharges le fichier au format **GGUF** (compatible llama.cpp / Ollama / LM Studio). Format universel pour le local. Avantage : tu choisis exactement la version (Q2_K, Q4_K_M, Q5_K_M, Q6_K, Q8_0, FP16…).

**Astuce** : les uploaders fiables sur HuggingFace sont **TheBloke** (historique), **bartowski**, **mradermacher**, et les comptes officiels (mistralai, meta-llama, Qwen, microsoft, deepseek-ai, google). Évite les comptes sans étoiles ni historique.

---

## 6. Quel modèle pour quoi (matrice tâche → modèle)

| Ce que tu veux faire | Modèle recommandé | Alternative |
|---|---|---|
| Brainstorm, chat général, rédaction | Mistral 7B, Llama 3.1 8B | Qwen 3 8B |
| Résumé de longs textes (rapports, livres) | Mistral Small 3 24B, Mixtral 8x7B | Llama 4 Scout (10M tokens !) |
| Traduction (FR ↔ autres langues) | Mistral (FR natif), Qwen 3 (119 langues) | Gemma 3 27B |
| Analyse de code, génération de code | Codestral 22B, Qwen 2.5-Coder 32B | DeepSeek-Coder V2 |
| Raisonnement complexe (math, logique) | DeepSeek R1-Distill, Phi-4 Reasoning | Qwen 3 32B |
| Vision (analyser une image) | Llama 3.2 Vision 11B, Llama 4 Scout | Gemma 3 27B, Qwen 2.5-VL |
| Transcription audio | Whisper Large v3 | Whisper Medium (si peu de RAM) |
| Génération d'image (libre commercial) | FLUX.1 schnell | SDXL Lightning |
| Synthèse vocale (TTS) | Coqui XTTS v2, Voxtral | Bark |
| Données ultra-sensibles (avocat, médecin) | Mistral 7B / Small 3 (Apache 2.0, EU) | Phi-4 (MIT, US) |

---

## 7. Les 4 pièges à éviter

### Piège n°1 : « Open source » abusif

**Llama n'est PAS open source au sens OSI**. Mistral (Apache 2.0), DeepSeek (MIT), Phi (MIT), Qwen (Apache 2.0) le sont vraiment. Llama et Gemma sont des **« open weights »** sous licenses maison restrictives. Si tu veux bâtir un produit commercial, lis les licenses — surtout les clauses « si tu dépasses X utilisateurs ».

### Piège n°2 : la quantization trop agressive

Quand tu vois Q2_K, Q3_K, Q4_K_M, Q5_K_M, Q6_K, Q8_0… c'est le **niveau de compression**. Plus le chiffre est bas, plus c'est compressé, plus c'est petit, **plus la qualité dégrade**.

| Quantization | Compression | Qualité conservée | Recommandation |
|---|---|---|---|
| Q2_K | Maximale | ~70 % | À éviter sauf urgence RAM |
| Q3_K_M | Très forte | ~85 % | Acceptable petit modèle |
| **Q4_K_M** | Forte | **~95 %** | **Le défaut recommandé** |
| Q5_K_M | Moyenne | ~98 % | Si tu as la RAM |
| Q6_K | Légère | ~99 % | Quasi équivalent au full |
| Q8_0 | Très légère | 99,5 % | Pour l'évaluation pure |
| FP16 (full) | Aucune | 100 % | Production sérieuse |

**Règle** : prends toujours **Q4_K_M en premier**. Si la qualité te déçoit, monte à Q5 ou Q6 avant de changer de modèle.

### Piège n°3 : modèles « non-vérifiés » sur HuggingFace

N'importe qui peut uploader un modèle sur HuggingFace. Certains contiennent du code malveillant (les fichiers `.bin` ou `.pt` peuvent embarquer du Python exécuté au chargement — pas les `.gguf` heureusement). **Reste sur les comptes officiels ou les uploaders historiques** (cités plus haut). Vérifie les téléchargements (>10k = sûr), les étoiles, les commentaires.

### Piège n°4 : confusion « base » vs « instruct »

Chaque modèle existe en 2 versions :
- **Base** (ou « foundation ») : modèle brut, pré-entraîné. **Ne suit PAS les instructions**. Si tu lui dis « écris-moi un poème », il continue ta phrase au lieu de l'exécuter.
- **Instruct** (ou « chat », « it ») : version fine-tunée pour suivre des instructions. **C'est celle que tu veux dans 99 % des cas**.

Quand tu télécharges, vérifie qu'il y a `instruct` ou `chat` ou `it` dans le nom (ex. `mistral-7b-instruct-v0.3`, `llama-3.1-8b-instruct`, `gemma-3-27b-it`). Sinon tu vas hurler que « le modèle marche pas ».

---

## TL;DR — La synthèse en 30 secondes

- **Tu débutes ?** → `ollama pull mistral`. C'est tout. 4 Go, 8 Go de RAM, et tu as un assistant offline pour la vie.
- **Tu codes ?** → ajoute Codestral 22B ou Qwen 2.5-Coder 7B/32B selon ton matos.
- **Tu veux voir un modèle « réfléchir » ?** → DeepSeek R1-Distill 7B ou 14B. Effet wahou.
- **Tu as un Mac 64 Go+ ?** → Mixtral 8x7B et Llama 3.3 70B Q4 deviennent jouables. Tu rentres dans la cour des grands.
- **Tu veux du libre commercial sans piège juridique ?** → Mistral (Apache 2.0), DeepSeek (MIT), Qwen (Apache 2.0), Phi (MIT). Évite Llama et Gemma pour la prod.

L'écosystème en avril 2026 est tel que **tu peux faire tourner sur ton MacBook ce qui demandait un cluster GPU à 100 000 € en 2023**. C'est inédit dans l'histoire de l'informatique.

---

*Volet suivant : la quantization expliquée pour ta grand-mère (et pourquoi Q4_K_M est ton meilleur ami).*

## Sources

- [Ollama Library — bibliothèque officielle des modèles](https://ollama.com/library)
- [LMSYS Chatbot Arena — benchmarks utilisateurs réels](https://lmarena.ai/)
- [HuggingFace Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)
- [Mistral AI News — Mistral Small 3 (janvier 2025)](https://mistral.ai/news/mistral-small-3/)
- [Welcome Llama 4 sur HuggingFace (5 avril 2025)](https://huggingface.co/blog/llama4-release)
- [Qwen3 — Think Deeper, Act Faster (29 avril 2025)](https://qwenlm.github.io/blog/qwen3/)
- [Microsoft Phi-4 Reasoning Technical Report](https://www.microsoft.com/en-us/research/publication/phi-4-reasoning-technical-report/)
- [Welcome Gemma 3 sur HuggingFace (12 mars 2025)](https://huggingface.co/blog/gemma3)
- [DeepSeek-R1 GitHub officiel](https://github.com/deepseek-ai/DeepSeek-R1)
- [Qwen2.5-Coder Series benchmarks](https://qwenlm.github.io/blog/qwen2.5-coder-family/)
- [r/LocalLLaMA — la référence absolue](https://www.reddit.com/r/LocalLLaMA/)
- [Best Open Source LLMs 2026 — Klu](https://klu.ai/blog/open-source-llm-models)
