# Les outils pour faire tourner un LLM en local — état des lieux avril 2026

Tu as un Mac ou un PC posé sur ton bureau, et tu veux faire tourner un modèle d'IA dessus comme tu utilises ChatGPT — sans envoyer tes prompts dans le cloud, sans payer d'abonnement, et sans te transformer en ingénieur système. Bonne nouvelle : depuis 2024, l'écosystème s'est tellement simplifié qu'installer un LLM local est devenu plus simple qu'installer Photoshop. Plus besoin de compiler du C++ ou de configurer CUDA. Tu télécharges une app, tu cliques deux fois, tu choisis un modèle dans une liste, c'est joué.

Je t'ai trié les 9 outils qui comptent vraiment en avril 2026. Pour chacun : à quoi ça sert, à qui c'est destiné, ce que ça coûte (rien, dans 90% des cas), et où sont les limites honnêtes. Pas de promesse magique. Pas de discours de geek. Juste de quoi choisir le bon outil pour ton profil et démarrer dans l'heure.

---

## 1. L'écosystème en 2026 — la vue d'ensemble

Avant d'attaquer les outils un par un, il faut comprendre que le monde du LLM local s'est stratifié en quatre familles. Chacune répond à un besoin différent, et la confusion vient souvent du fait qu'on les compare alors qu'elles ne jouent pas dans la même cour.

### Les apps "clé en main"

Ce sont les outils que tu télécharges et qui font tout pour toi : ils gèrent le moteur, le téléchargement des modèles, l'interface de chat. **Ollama, LM Studio, Jan, GPT4All, Msty** entrent dans cette catégorie. Tu installes une seule chose, tu lances, tu chattes. C'est la porte d'entrée standard pour 95% des gens.

### Les interfaces web type ChatGPT

Ce sont des interfaces graphiques (généralement à installer sur ton ordi mais qui tournent dans le navigateur) qui se branchent sur un moteur tournant à côté. **Open WebUI, Lobe Chat, Chatbot UI** en sont les références. Tu les couples avec Ollama (le combo gagnant) pour avoir une vraie interface ChatGPT-like, multi-utilisateurs, avec mémoire et chat sur tes documents. C'est plus puissant que les apps clé en main, mais demande une étape de setup en plus.

### Les moteurs sous-jacents

Ce sont les briques techniques qui font vraiment tourner les modèles : **llama.cpp, MLX, vLLM, llamafile**. La plupart du temps tu ne les vois pas — Ollama, LM Studio et les autres les utilisent en interne. Mais savoir qu'ils existent te sert quand tu veux comprendre pourquoi tel outil est plus rapide qu'un autre, ou si tu veux pousser les performances au maximum.

### Pour qui chaque catégorie est faite

- **Tu veux essayer un LLM en 5 minutes sans réfléchir** → app clé en main (Ollama ou LM Studio)
- **Tu veux une expérience ChatGPT complète chez toi (RAG, multi-utilisateurs, historique)** → app clé en main + interface web (Ollama + Open WebUI)
- **Tu es power user et veux tout configurer** → moteur direct ou Text Generation WebUI
- **Tu déploies pour une équipe ou en production** → vLLM ou Ollama serveur

---

## 2. Les 9 outils à connaître en 2026

### Ollama — le défaut absolu

**License : MIT · Mac/Windows/Linux · gratuit**

Si tu ne devais en retenir qu'un, c'est lui. Ollama est devenu en 18 mois le standard de fait pour faire tourner des LLM en local, au point que la quasi-totalité des autres outils (Open WebUI, n8n, LangChain, Continue.dev) le supportent en backend par défaut.

**Installation** : tu télécharges sur ollama.com, tu lances l'installeur, c'est terminé. Sur Mac et Windows, depuis fin 2024, tu as une vraie GUI native qui ressemble à ChatGPT (champ de texte, historique des conversations, sélecteur de modèle dans la barre du haut). Plus besoin de toucher au terminal pour les usages basiques.

**Pour les gens qui veulent aller plus loin**, le terminal reste une mine d'or : `ollama pull llama3` télécharge le modèle, `ollama run llama3` lance une conversation, `ollama list` affiche ce que tu as installé. La bibliothèque officielle propose plus de 200 modèles déjà optimisés (Llama 4, Qwen 3, Mistral, Phi-4, Gemma 3, DeepSeek-R1, etc.).

**API REST compatible OpenAI** : Ollama expose automatiquement un serveur sur `localhost:11434` qui parle le même langage que l'API d'OpenAI. Concrètement, ça veut dire que tu peux brancher dessus n'importe quelle app qui sait parler à ChatGPT (Continue.dev pour coder, Open WebUI pour l'interface, Obsidian pour tes notes, etc.) en changeant juste l'URL.

**Ses limites** : pas de RAG natif (il faut une extension comme Open WebUI pour chatter avec tes documents), et la GUI native reste minimaliste comparée à LM Studio ou Msty. Mais pour la stabilité et la communauté (130k stars sur GitHub fin avril 2026), aucun concurrent ne tient la comparaison.

**Pour qui** : tout le monde. C'est le défaut absolu en 2026, le point de départ recommandé même si tu finis par préférer une autre interface par-dessus.

---

### LM Studio — l'interface premium gratuite

**License : propriétaire (gratuit pour usage perso et même pro depuis juillet 2025) · Mac/Windows/Linux**

LM Studio est l'app qui ressemble le plus à un produit commercial fini. Interface poli style Discord, recherche de modèles intégrée à HuggingFace, gestion des téléchargements avec barre de progression, paramètres avancés accessibles dans un panneau propre. C'est l'outil que tu donnes à ta sœur qui n'a jamais touché un terminal de sa vie.

**Le piège à connaître** : LM Studio est gratuit, mais **pas open source**. Le code est propriétaire. Pour la majorité des usages c'est sans conséquence (l'app ne phone-home pas, tes données restent locales), mais si l'open source est une valeur importante pour toi, regarde plutôt Jan (voir plus bas).

**Setup** : tu télécharges sur lmstudio.ai, tu lances. Au premier démarrage, l'app te propose 3-4 modèles populaires. Tu cliques sur "download", tu attends 5 minutes, tu chattes. La recherche HuggingFace intégrée te permet de chercher n'importe quel modèle GGUF (le format standard) directement depuis l'app, avec des filtres par taille, quantization, popularité.

**Server local intégré** : comme Ollama, LM Studio expose une API compatible OpenAI quand tu actives le mode serveur (un onglet dédié dans l'app). Tu peux donc brancher dessus tes propres scripts ou outils tiers.

**Multi-modèles en parallèle** : tu peux charger plusieurs modèles simultanément et les faire tourner ensemble (utile pour comparer leurs réponses sur le même prompt).

**Ses limites** : pas de RAG natif (idem Ollama), pas de partage multi-utilisateurs, et le côté propriétaire qui peut gêner certains. Sinon, c'est l'app la plus polie du marché grand public.

**Pour qui** : utilisateur qui veut une vraie app graphique sans jamais ouvrir de terminal, et qui se moque de la philosophie open source.

---

### Open WebUI — l'interface ChatGPT à la maison

**License : MIT · web app à installer (Docker recommandé) · gratuit**

Open WebUI est l'arme secrète de ceux qui veulent une vraie expérience ChatGPT chez eux. C'est une interface web qui imite à la perfection celle d'OpenAI (sidebar avec historique, sélecteur de modèle, markdown rendu, code highlighting, génération d'images si tu connectes Stable Diffusion) et qui se branche sur Ollama (ou n'importe quel serveur compatible OpenAI).

**Pourquoi c'est unique** :
- **RAG natif** : tu uploades tes PDF, tes Markdown, tes Word, et tu peux chatter avec. L'outil découpe les documents, calcule les embeddings, et injecte les bons passages dans le contexte de ta conversation. C'est aussi simple qu'un drag-and-drop.
- **Multi-utilisateurs** : tu peux créer des comptes pour ta famille ou ton équipe, chacun a ses conversations privées, et tu peux administrer les permissions.
- **Workspaces et bibliothèques** : tu organises tes chats par projet, tu crées des "modèles personnalisés" (un Llama avec un prompt système pour rédiger en français, un autre pour coder, etc.).

**Installation** : la voie recommandée est Docker (`docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main`). Si Docker te fait peur, tu peux aussi l'installer en pip Python, ou utiliser un installeur tout-en-un comme Pinokio. Une fois lancé, tu ouvres `localhost:3000` dans ton navigateur, tu te crées un compte admin, et c'est parti.

**Ses limites** : il faut Ollama qui tourne à côté, donc deux outils à gérer. Le setup Docker peut intimider un débutant absolu — c'est l'étape qui fait dire à certains "ah finalement je vais rester sur LM Studio".

**Pour qui** : famille, équipe, ou pro qui veut donner accès à plusieurs personnes à un LLM local, ou qui veut le RAG sur ses propres documents. Combiné à Ollama, c'est le combo gagnant 2026 (j'y reviens en section 5).

---

### GPT4All — le débutant absolu

**License : MIT · Mac/Windows/Linux · gratuit**

Maintenu par Nomic AI, GPT4All est probablement l'app la plus simple de toute la sélection. Tu télécharges sur gpt4all.io, tu lances, tu choisis un modèle dans la liste intégrée (Llama, Mistral, etc.), c'est terminé. Pas d'installation de modèle séparée, pas de terminal, pas de Docker. C'est "double-clique et chatte".

**RAG basique inclus** : tu peux pointer un dossier de documents et l'outil va indexer tes fichiers pour que tu puisses leur poser des questions. C'est moins puissant qu'Open WebUI mais ça marche d'emblée sans rien configurer.

**Ses limites** : moins d'options et de modèles que LM Studio (catalogue plus restreint, pas de recherche HuggingFace intégrée), pas d'API compatible OpenAI aussi solide qu'Ollama, et performance un cran en dessous de la concurrence sur Apple Silicon (n'utilise pas MLX par défaut). Le projet a aussi ralenti côté communauté en 2025 — Ollama et LM Studio ont pris l'avantage en visibilité.

**Pour qui** : le débutant absolu qui veut "install et c'est joué", sans la moindre étape supplémentaire. Aussi un bon choix si tu veux un RAG simple sans installer Open WebUI.

---

### Jan — l'alternative open source à LM Studio

**License : AGPL v3 · Mac/Windows/Linux · gratuit**

Jan est ce que LM Studio aurait été s'il avait été open source. Interface graphique poli, gestion des modèles intégrée, serveur API compatible OpenAI, support des extensions via un système de plugins. Le projet est porté par une équipe vietnamienne (Menlo Research) et a passé les 30k stars GitHub début 2026.

**Avantages spécifiques** :
- 100% open source (AGPL v3) — tu peux auditer le code, le forker, le self-hoster
- Système de plugins extensible (ajout de modèles cloud comme OpenAI ou Anthropic en complément du local, intégration RAG, etc.)
- Mode hybride : tu peux mélanger modèles locaux et cloud dans la même app

**Ses limites** : interface moins polie que LM Studio (les détails UX sont parfois moins léchés), communauté plus petite donc moins de tutos disponibles en français. Performance globale très proche de LM Studio (même backend llama.cpp en interne).

**Pour qui** : utilisateur qui veut une vraie alternative open source à LM Studio, pour des raisons philosophiques ou pour pouvoir bidouiller le code.

---

### Msty — l'app multi-LLM la plus poli

**License : propriétaire (gratuit avec version pro payante) · Mac/Windows/Linux**

Msty est l'outsider qui monte fort depuis 2025. Sa promesse : combiner dans une seule interface les modèles locaux (via Ollama en backend) ET les modèles cloud (OpenAI, Anthropic, Google, Mistral via API) avec une UX vraiment travaillée. Si tu veux pouvoir comparer côte à côte la réponse de Llama 4 local avec celle de Claude ou GPT-4, Msty est imbattable.

**Features qui font la différence** :
- **Split chats** : tu poses la même question à plusieurs modèles en parallèle (local et cloud) et tu compares les réponses dans deux colonnes
- **Knowledge Stack** (RAG) : import de PDF, Markdown, Notion, Obsidian, le tout indexé et requêtable
- **Branches de conversation** : tu repars d'un message au milieu d'un chat sans casser le fil principal
- **Bibliothèque de prompts** intégrée et partageable

**Ses limites** : propriétaire (pas open source), version gratuite limitée sur certaines features avancées (la version Aurum coûte environ $50/an), et un peu lourd au lancement comparé à Ollama.

**Pour qui** : utilisateur qui jongle entre local et cloud, ou qui veut une vraie expérience produit polie sans setup technique.

---

### Text Generation WebUI (oobabooga) — le power user

**License : AGPL v3 · Mac/Windows/Linux · gratuit**

Surnommé "le AUTOMATIC1111 des LLM" (en référence au célèbre WebUI de Stable Diffusion), Text Generation WebUI propose une interface ultra-complète pour tout configurer. Chat, mode notebook (génération de texte créatif), API serveur, fine-tuning LoRA intégré, gestion fine des paramètres de génération, support de tous les backends imaginables (llama.cpp, ExLlama, GPTQ, Transformers, etc.).

**Pourquoi le choisir** : si tu veux comprendre ce que fait chaque paramètre de génération (temperature, top_p, top_k, repetition_penalty), tester du fine-tuning à petite échelle, ou avoir un contrôle total sur le pipeline, c'est l'outil qui te donne les manettes.

**Ses limites** : beaucoup plus complexe à installer (script Python, dépendances, parfois bidouilles selon ton OS), interface qui sent le projet de hacker (UI fonctionnelle mais pas glamour), et courbe d'apprentissage raide.

**Pour qui** : power user qui veut tout configurer, hobbyiste passionné, ou personne qui veut faire du fine-tuning maison sans installer de stack séparée.

---

### llama.cpp — le moteur sous-jacent (culture générale)

**License : MIT · multiplateforme y compris smartphone et Raspberry Pi · gratuit**

llama.cpp est le projet du Bulgare Georgi Gerganov qui a déclenché toute la révolution du LLM local en mars 2023. C'est une réécriture en C++ pur de l'inférence des modèles Llama, ultra-portable et optimisée pour faire tourner des LLM sur du matériel modeste — y compris ton smartphone ou un Raspberry Pi 5.

**Pourquoi c'est important même si tu ne l'utilises pas direct** :
- Le format **GGUF** que tu vois partout (`mistral-7b-q4_k_m.gguf`) est le format inventé par llama.cpp et devenu standard de la communauté
- **Ollama, LM Studio, Jan, GPT4All, Text Generation WebUI** utilisent tous llama.cpp en interne (parfois avec une couche de modifications)
- Quand un nouveau modèle sort, c'est llama.cpp qui le supporte en premier — les autres outils suivent ensuite

**Ses limites en usage direct** : pas d'interface graphique (CLI uniquement), il faut compiler ou télécharger les binaires, paramètres en ligne de commande qui demandent de lire la doc.

**Pour qui** : à mentionner pour culture générale. Tu n'as quasi jamais besoin de l'utiliser direct — Ollama fait le job avec une UX 100x meilleure.

---

### MLX — l'optimisation Apple Silicon

**License : MIT · Mac uniquement (Apple Silicon : M1/M2/M3/M4) · gratuit**

MLX est le framework de machine learning créé par Apple en décembre 2023, pensé spécifiquement pour exploiter la **mémoire unifiée** des puces Apple Silicon. Concrètement : sur un Mac M3 ou M4, MLX est généralement 20 à 30% plus rapide que llama.cpp sur les mêmes modèles, et consomme moins de RAM.

**Comment l'utiliser** : la voie la plus simple est `mlx-lm`, une bibliothèque Python qui te permet de charger et utiliser des modèles MLX en quelques lignes (`pip install mlx-lm`, puis `mlx_lm.generate --model mistralai/Mistral-7B-Instruct-v0.2`). Plusieurs apps grand public commencent à l'intégrer en backend optionnel (LM Studio depuis fin 2024, Jan depuis 2025).

**Catalogue de modèles** : la communauté MLX sur HuggingFace propose plus de 1000 modèles déjà convertis (cherche "mlx-community" sur HuggingFace).

**Ses limites** : Mac Apple Silicon uniquement (pas de Mac Intel, pas de PC), pas d'app graphique dédiée — tu passes par mlx-lm en CLI ou par un outil tiers qui l'a intégré.

**Pour qui** : utilisateur Mac M-series qui veut le top des performances. Sur un MacBook Pro M3 ou M4, c'est la voie royale pour faire tourner Llama 3 70B ou Qwen 32B le plus vite possible.

---

### vLLM — production et serveur (culture générale)

**License : Apache 2 · Linux serveur (et Mac via expérimental) · gratuit**

vLLM est le framework Python de référence pour servir des LLM en production. Développé à Berkeley, il intègre des optimisations brutales (PagedAttention, batching dynamique, speculative decoding) qui lui permettent de servir des centaines de requêtes en parallèle avec une latence très basse. C'est ce qui tourne derrière la plupart des startups qui hostent leur propre LLM.

**Pourquoi c'est mentionné ici** : si un jour tu veux passer du "LLM sur mon laptop" au "LLM qui sert plusieurs collègues en interne", vLLM est l'outil. Il transforme ton serveur (souvent une machine GPU louée chez Hetzner, Runpod, Lambda Labs) en endpoint compatible OpenAI capable de tenir une vraie charge.

**Ses limites pour le grand public** : pas pour ton laptop, pas d'interface graphique, configuration en YAML ou CLI Python, demande un GPU NVIDIA puissant pour briller. Inutile en usage personnel.

**Pour qui** : à mentionner pour culture, pas pour le grand public. Tu n'en as besoin que le jour où tu veux servir un LLM à plusieurs utilisateurs en mode production sérieuse.

---

## 3. Tableau comparatif

| Outil | Type | License | OS | Install | GUI | RAG natif | Recommandé pour |
|---|---|---|---|---|---|---|---|
| **Ollama** | App clé en main | MIT (open source) | Mac/Win/Linux | 😊 1 clic | Oui (native) | Non | Tout le monde, défaut absolu |
| **LM Studio** | App clé en main | Propriétaire (gratuit) | Mac/Win/Linux | 😊 1 clic | Oui (très polie) | Non | UX premium sans terminal |
| **Open WebUI** | Interface web | MIT (open source) | Mac/Win/Linux (Docker) | 😐 Docker requis | Oui (web ChatGPT-like) | **Oui (excellent)** | RAG, multi-utilisateurs, équipe |
| **GPT4All** | App clé en main | MIT (open source) | Mac/Win/Linux | 😊 1 clic | Oui (basique) | Oui (basique) | Débutant absolu |
| **Jan** | App clé en main | AGPL v3 (open source) | Mac/Win/Linux | 😊 1 clic | Oui (polie) | Via plugin | Alternative OSS à LM Studio |
| **Msty** | App clé en main | Propriétaire (freemium) | Mac/Win/Linux | 😊 1 clic | Oui (très polie) | **Oui (excellent)** | Mix local + cloud |
| **Text Gen WebUI** | App power user | AGPL v3 (open source) | Mac/Win/Linux | 😰 Python + scripts | Oui (web touffue) | Via extension | Power user, fine-tuning |
| **llama.cpp** | Moteur (CLI) | MIT (open source) | Tout (smartphone inclus) | 😰 CLI uniquement | Non | Non | Culture générale |
| **MLX (mlx-lm)** | Framework Apple | MIT (open source) | Mac M-series uniquement | 😐 CLI Python | Non (CLI) | Non | Performance max sur Mac M |

Légende : 😊 facile (1 clic) · 😐 moyen (1h de setup) · 😰 technique (lecture de doc obligatoire)

---

## 4. Recommandations par profil

Pour t'éviter de perdre des heures à comparer, voici les choix tranchés en fonction de ton besoin :

- **« Je veux juste essayer un LLM en 5 minutes »** → **Ollama**. Télécharge sur ollama.com, lance, tape `ollama run llama3` dans le terminal (ou clique sur la GUI native). C'est tout.

- **« Je veux une interface graphique propre, sans toucher au terminal »** → **LM Studio** si tu acceptes le propriétaire (l'UX est imbattable), ou **Msty** si tu veux pouvoir aussi connecter ChatGPT et Claude dans la même app.

- **« Je veux chatter avec mes propres documents (PDF, Markdown, notes) »** → **Open WebUI** (combiné à Ollama) si tu acceptes 30 minutes de setup Docker, ou **Msty** si tu veux du clé en main sans étape technique.

- **« Je veux donner accès local à mon équipe ou ma famille »** → **Open WebUI**. C'est le seul outil de la liste qui gère vraiment le multi-utilisateurs avec comptes, permissions, et historique séparé. Tu l'installes sur un serveur (Mac mini, NUC, Raspberry Pi 5, ou VPS) et tu donnes l'URL aux autres.

- **« Je veux le maximum de performance sur Mac M (M3, M4) »** → **Ollama configuré avec MLX en backend** (option dispo depuis février 2026), ou **LM Studio en mode MLX** (toggle dans les settings). Sur les modèles 70B, tu gagnes facilement 25% de tokens par seconde.

- **« Je veux une alternative 100% open source à LM Studio »** → **Jan**. Mêmes capacités, code auditable, communauté active.

- **« Je suis power user, je veux tout configurer »** → **Text Generation WebUI** pour rester en interface graphique, ou **llama.cpp** direct si tu veux le contrôle absolu et lire la doc.

---

## 5. Le combo gagnant 2026 pour non-dev : Ollama + Open WebUI

Si je devais ne recommander qu'un seul setup à quelqu'un qui débute, ce serait **Ollama + Open WebUI**. C'est la combinaison qui te donne :

- La **simplicité** d'Ollama pour la gestion des modèles (téléchargement, mise à jour, sélection)
- L'**interface ChatGPT** d'Open WebUI (historique, multi-conversations, markdown, code highlighting)
- Le **RAG sur tes documents** (drag-and-drop PDF/Markdown/Word et tu chattes avec)
- Le **multi-utilisateurs** si tu veux partager avec ta famille ou ton équipe
- La **gratuité totale** et le **contrôle complet** (tout reste sur ta machine)

### Tutoriel rapide en 3 étapes

**Étape 1 — Installer Ollama**
- Va sur ollama.com, télécharge pour ton OS, lance l'installeur
- Ouvre un terminal (Spotlight sur Mac, "cmd" sur Windows)
- Tape `ollama pull llama3.2:3b` (modèle léger, 2 Go, marche sur 8 Go de RAM)
- Vérifie en tapant `ollama list` — tu dois voir le modèle apparaître

**Étape 2 — Installer Open WebUI via Docker**
- Installe Docker Desktop (docker.com/products/docker-desktop)
- Lance Docker Desktop, attends qu'il démarre (icône baleine dans la barre)
- Dans le terminal, tape : `docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main`
- Attends 2-3 minutes que l'image se télécharge

**Étape 3 — Premier chat**
- Ouvre ton navigateur sur `http://localhost:3000`
- Crée le compte admin (le tout premier compte créé est administrateur)
- En haut à gauche, sélectionne `llama3.2:3b` dans le menu déroulant des modèles
- Tape ton premier message — ça répond en 2-3 secondes sur un Mac M2 ou un PC avec 16 Go de RAM
- Pour le RAG : clique sur l'icône `+` dans le champ de chat, uploade un PDF, et pose tes questions

Setup total : 10 à 15 minutes la première fois, 0 minute les suivantes. Tu as un ChatGPT 100% local, gratuit, qui marche sans internet, et que tu peux partager avec ton équipe en pointant le port 3000 sur ton réseau.

---

## 6. Les 4 pièges à éviter

### Piège 1 — Confondre "GUI gratuit" et "open source"

LM Studio, Msty et la plupart des apps polies sont **gratuites mais propriétaires** (le code n'est pas auditable). Pour 95% des usages c'est sans conséquence — l'app ne phone-home pas tes données. Mais si l'open source est une valeur importante pour toi (auditabilité, garantie de pérennité, principe), regarde du côté d'**Ollama, Jan, Open WebUI, GPT4All** qui sont 100% open source.

### Piège 2 — Installer 5 apps en parallèle qui dupliquent les modèles

Chaque app gère son propre dossier de modèles : Ollama dans `~/.ollama/models`, LM Studio dans `~/.cache/lm-studio/models`, Jan dans `~/jan/models`, etc. Tu peux vite te retrouver avec 50 Go de doublons (le même Llama 3 8B téléchargé 3 fois). **La solution** : choisis un outil principal (Ollama de préférence), et utilise les autres uniquement comme interface par-dessus. Tu peux aussi pointer LM Studio vers le dossier Ollama via les paramètres avancés pour partager les fichiers GGUF.

### Piège 3 — Tester un outil 5 minutes et conclure "ça marche pas"

Premier test foiré sur la plupart des outils = utilisateur qui a téléchargé un modèle trop gros pour sa RAM (ex : Llama 3 70B sur 16 Go de RAM = swap massif, lenteur insupportable, conclusion "le local c'est nul"). **La règle** : commence avec un modèle 3B à 8B (Llama 3.2 3B, Mistral 7B, Qwen 2.5 7B). Tu valides que ton matériel suit. Tu montes ensuite en gamme si tu veux plus de qualité.

### Piège 4 — Garder les paramètres par défaut sans les comprendre

La **temperature** (créativité du modèle) est souvent à 0.7 ou 0.8 par défaut. Pour de la rédaction créative c'est OK. Pour du factuel ou du code, descends à 0.2-0.3 sinon le modèle invente. Le **context window** (taille de mémoire de la conversation) est parfois limité par défaut à 2048 ou 4096 tokens — tu vas perdre le début de tes longs chats. Augmente-le manuellement à 8192 ou 16384 dans les paramètres si ton modèle le supporte. Ces deux réglages changent ton expérience du tout au tout.

---

## Sources

- **Sites officiels** : ollama.com · lmstudio.ai · openwebui.com · jan.ai · msty.app · gpt4all.io · github.com/ggml-org/llama.cpp · ml-explore.github.io/mlx · docs.vllm.ai
- **Reviews vidéo récentes 2025-2026** : Matthew Berman, AICodeKing, Sam Witteveen, Prompt Engineer (YouTube)
- **Blogs de référence** : simonwillison.net (Simon Willison sur les LLM), huggingface.co/blog, blog.eleuther.ai
- **Communauté** : r/LocalLLaMA (la référence absolue, 700k membres en avril 2026), r/Ollama, r/LangChain
- **Indicateurs santé projet** : GitHub stars, fréquence des releases, activité des issues — Ollama 130k+ stars · llama.cpp 80k+ · LM Studio non open source mais 1M+ téléchargements/mois · Jan 30k+ stars · Open WebUI 50k+ stars
