# De quel matériel j'ai besoin pour faire tourner un LLM chez moi ?

*Avril 2026*

Si tu as lu mon article sur l'open source dans l'IA, tu sais déjà pourquoi c'est intéressant de faire tourner un modèle de langage chez toi : tes données restent chez toi, zéro abonnement mensuel, ça marche même sans internet, et personne ne peut te dire « non, tu n'as pas le droit de poser cette question ».

Reste la vraie question : **est-ce que ton ordinateur peut faire tourner un modèle ? Et si non, qu'est-ce qu'il te faut acheter ?**

Je te le dis tout de suite : tu n'as pas besoin d'un serveur à 20 000 €. En 2026, un MacBook Air à 1 200 € fait déjà des choses bluffantes. Et pour 2 400 €, tu rivalises avec ChatGPT Plus pour beaucoup d'usages du quotidien.

Voilà l'équation, expliquée simplement, avec des chiffres concrets et trois budgets-types pour t'aider à choisir.

---

## 1. L'équation de base : ce qui détermine si ton ordi peut le faire

Un modèle de langage, c'est un fichier énorme (entre 4 et 100 Go selon sa taille) qui doit être chargé en mémoire avant que tu puisses lui parler. Cinq éléments comptent vraiment :

### La RAM (la mémoire vive de ton ordinateur)

C'est elle qui doit accueillir le modèle. Si elle est trop petite, ton ordinateur va « écrire » la suite sur ton disque dur (on appelle ça le *swap*) et là, tout devient atrocement lent. Le modèle peut générer 1 mot toutes les 10 secondes au lieu d'un mot par seconde. Inutilisable.

### La VRAM (la mémoire de ta carte graphique)

Sur un PC avec carte graphique NVIDIA ou AMD, c'est elle qui fait le vrai travail. La VRAM est beaucoup plus rapide que la RAM classique pour ce type de calcul. Plus elle est grosse, plus tu peux faire tourner de gros modèles vite. Une RTX 4070 a 12 Go de VRAM, une RTX 5090 en a 32 Go.

Sur un Mac (puces M1, M2, M3, M4, M5), il y a une particularité magique : la **mémoire unifiée**. La RAM ET la mémoire vidéo partagent le même pool. Si tu as 48 Go sur un MacBook Pro, tes 48 Go peuvent servir au modèle. C'est un avantage énorme face à un PC où VRAM et RAM sont séparées.

### Le processeur (CPU)

Impact secondaire mais pas nul. Un processeur moderne (Apple M3 ou plus récent, AMD Ryzen 7000+, Intel Core 13e gen+) suffit largement. Pas besoin de t'attarder là-dessus.

### Le stockage SSD

Chaque modèle pèse entre 4 Go (un petit comme Phi-3 mini) et 100 Go (un gros comme DeepSeek R1). Si tu veux en garder plusieurs sous la main, prévois 200 à 500 Go libres sur ton SSD. Et **uniquement** un SSD : un disque dur classique te ferait perdre des heures au chargement.

### La bande passante mémoire (le vrai bottleneck)

C'est le point le moins connu et pourtant le plus important. J'y reviens en détail à la fin de l'article, mais retiens déjà ceci : **c'est ce qui détermine la vitesse à laquelle ton modèle te répond**. Un modèle peut « rentrer » dans ta RAM mais générer si lentement que tu abandonnes au bout de 30 secondes.

---

## 2. Combien de RAM ou VRAM par taille de modèle

Les modèles se mesurent en « milliards de paramètres » (B pour billions en anglais). Plus c'est gros, plus c'est intelligent (en gros), plus ça consomme de mémoire.

Voici la règle simple, valable en avril 2026 avec la quantization standard (Q4_K_M, j'explique juste après) :

| Taille du modèle | Exemples | RAM/VRAM minimum | Niveau attendu |
|---|---|---|---|
| 3B | Phi-3 mini, Gemma 2 2B | 4-6 Go | Tâches simples, brouillons |
| 7B / 8B | Mistral 7B, Llama 3 8B, Qwen 3 8B | 8-12 Go | Comparable à GPT-3.5 |
| 13B / 14B | Mistral Nemo, Qwen 14B | 16 Go | Bon assistant général |
| 30B / 34B | CodeLlama 34B, Mixtral 8x7B | 32 Go | Très solide, code et raisonnement |
| 70B | Llama 3.3 70B, DeepSeek R1 distill 70B | 48-64 Go | Niveau GPT-4 sur beaucoup de tâches |
| 405B+ | Llama 3.1 405B, DeepSeek R1 671B (full) | 128 Go+ ou multi-GPU | Workstation/serveur dédié |

**Comment lire ce tableau ?** Si tu as un MacBook Air 16 Go, tu joues confortablement dans la zone 7B-8B. Si tu as un MacBook Pro 48 Go, tu peux taper jusqu'à 70B. Au-delà de 70B, on entre dans le territoire des configurations sérieuses (4 000 € et plus).

Petit détail important : ces chiffres sont les **minimums**. Il faut toujours laisser 2 à 4 Go de marge pour ton système d'exploitation et tes autres applications. Donc 16 Go de RAM = 12-13 Go vraiment dispo pour le modèle.

---

## 3. La quantization : la compression magique qui change tout

Voilà LE concept qui m'a fait gagner 2 mois de compréhension quand je m'y suis mis.

**Analogie simple** : tu connais la compression JPEG d'une photo ? Une photo brute fait 24 Mo. Compressée en JPEG, elle fait 4 Mo. Tu perds 1 % de qualité visuelle mais le fichier est 6 fois plus petit. C'est exactement le même principe pour un modèle de langage.

Un modèle « brut » (en pleine précision, dit FP16) est énorme. Llama 3 70B en FP16 pèse 140 Go. Personne n'a 140 Go de RAM chez soi. La quantization, c'est l'art de réduire la taille du modèle en gardant l'essentiel de son intelligence.

### Les niveaux à connaître

| Niveau | Qualité préservée | Taille | Pour qui ? |
|---|---|---|---|
| FP16 | 100% (référence) | Énorme (×4) | Serveur dédié uniquement |
| Q8_0 | ~99% (quasi parfait) | Moyenne (×2) | Si tu as la RAM, ça vaut le coup |
| **Q4_K_M** | **~95%** | **Petite (÷2.5 vs FP16)** | **Le standard 2026, recommandé par défaut** |
| Q4_K_S | ~93% | Très petite | Compromis serré, OK si tu manques de RAM |
| Q2 | ~75% | Minuscule | Trop dégradé, à éviter sauf cas extrême |

**La règle d'or 2026** : prends **Q4_K_M**. C'est le sweet spot validé par toute la communauté. Tu gardes 95 % de la qualité, tu divises la taille par 2,5 par rapport au modèle brut, et c'est ce que Ollama et LM Studio installent par défaut sans te demander ton avis. Tu peux mettre ces deux outils sur ton ordinateur et oublier tout ce paragraphe : ils choisissent Q4_K_M tout seuls.

---

## 4. Mac, PC Windows ou Linux : les 3 écosystèmes en 2026

### Apple Silicon (M2, M3, M4, M5) : l'option simplicité

L'avantage majeur, déjà mentionné : la **mémoire unifiée**. Sur un Mac avec 48 Go, tes 48 Go entiers sont disponibles pour faire tourner un modèle. Sur un PC avec 48 Go de RAM mais une carte graphique de 12 Go, tu es limité par les 12 Go pour la vitesse maximum.

Autres atouts : silencieux, faible consommation électrique, framework MLX d'Apple optimisé pour les LLM, écosystème Ollama et LM Studio impeccable.

Quelques exemples concrets :
- **MacBook Air M3 16 Go** (~1 200 €) : Mistral 7B, Llama 3 8B en Q4 à 30-50 tokens par seconde. Très utilisable.
- **MacBook Pro M4 Pro 48 Go** (~2 400-2 900 €) : Llama 3.3 70B en Q4 à 6-7 tokens par seconde. Lent mais tu as un GPT-4-like sur tes genoux.
- **Mac Studio M3 Ultra 192 Go** (~6 000 € et plus) : tu attaques sérieusement les très gros modèles.

La limite : pas de NVIDIA CUDA. Certains outils d'entraînement ou de fine-tuning très spécialisés tournent moins bien. Pour de l'inférence (faire tourner un modèle pour discuter avec lui), Apple Silicon est top.

### PC Windows + GPU NVIDIA : l'écosystème historique

C'est le terrain de jeu d'origine des LLM. CUDA (la techno de NVIDIA pour faire calculer les GPU) est partout, tous les outils sont optimisés en priorité pour NVIDIA, tu trouves de la documentation à la pelle.

| Carte | VRAM | Prix neuf | Ce que tu fais tourner |
|---|---|---|---|
| RTX 4060 Ti 16 Go | 16 Go | ~450 € | Modèles 13B confortable |
| RTX 4070 Super | 12 Go | ~600 € | Modèles 8B-14B à 30-60 tokens/s |
| RTX 4090 | 24 Go | ~1 800 € (occasion ~1 400) | Modèles 30B confortable |
| RTX 5090 | 32 Go | ~2 200 € | Modèles 32B confortable, 70B possible en Q3 |

Combinée à 32-64 Go de RAM système, une RTX bien dimensionnée + offloading partiel (la technique qui répartit le modèle entre VRAM et RAM) te permet de pousser au-delà de ce que la VRAM seule permettrait. Mais avec une perte de vitesse importante.

**Bonne nouvelle 2026** : tu peux trouver une RTX 3090 d'occasion (24 Go VRAM) entre 650 et 800 €. C'est aujourd'hui le meilleur rapport VRAM/prix du marché, et toute la communauté r/LocalLLaMA la recommande comme entrée de gamme « sérieuse ».

### PC Linux : pareil que Windows, en mieux

Mêmes cartes, mêmes prix, mais souvent un meilleur support des drivers (NVIDIA officiels et AMD ROCm). Si tu es à l'aise avec Linux, c'est l'option la plus performante au prix le plus bas.

### Et AMD ?

ROCm (l'équivalent CUDA chez AMD) a fait des progrès énormes en 2024-2025. Depuis ROCm 7, c'est natif dans Ollama et LM Studio. AMD reste un second choix face à NVIDIA, mais ce n'est plus la galère que c'était il y a 18 mois. Si tu trouves une bonne affaire sur une Radeon, ne la jette plus systématiquement.

### Et Intel ?

Surprise 2026 : la **Intel Arc B580** à 249 € (12 Go VRAM) tient très bien le choc. 62 tokens par seconde sur un modèle 8B grâce aux moteurs XMX d'Intel. À ce prix-là, c'est devenu une option crédible pour démarrer.

---

## 5. Trois configurations recommandées par budget

J'ai testé, demandé, comparé. Voilà ce que je conseille concrètement en avril 2026 selon ton budget.

### Budget 500-800 € : la découverte

**Option A : MacBook Air M2 16 Go d'occasion (Refurb Apple)** — environ 700 €.

**Option B : PC fixe Ryzen 5 + 32 Go RAM (sans GPU dédié)** — environ 600 €.

**Option C (la maline) : récupérer une RTX 3060 12 Go d'occasion (~250 €) et l'ajouter à un vieux PC** — peut descendre à 400 €.

**Ce que tu peux faire** : Mistral 7B, Llama 3 8B, Phi-3, Gemma 2 9B en Q4. Qualité comparable à GPT-3.5. Largement suffisant pour 80 % des usages quotidiens : reformulation, résumés, brouillons d'emails, code simple, traductions, brainstorming.

### Budget 1 500-2 500 € : le sweet spot 2026

**Option A : MacBook Pro M4 Pro 48 Go** — environ 2 400-2 900 €.

**Option B : PC fixe Ryzen 7 + RTX 4070 Super 12 Go + 32 Go RAM** — environ 1 700 €.

**Option C (l'astucieuse) : PC fixe + RTX 3090 24 Go d'occasion + 64 Go RAM** — environ 1 500 €. C'est ce que recommande r/LocalLLaMA depuis 18 mois.

**Ce que tu peux faire** : Mixtral 8x7B en Q4, Qwen 32B en Q4, modèles 13-30B confortablement. Tu commences à toucher du doigt Llama 3.3 70B sur le MacBook Pro 48 Go (lent mais fonctionnel, 6-7 tokens/s). C'est la configuration que je recommande à 90 % des gens qui veulent vraiment s'y mettre.

### Budget 4 000 € et plus : le power user

**Option A : Mac Studio M4 Max 64 Go ou M3 Ultra 96 Go** — 2 500 à 4 000 €.

**Option B : PC fixe Threadripper + RTX 4090 24 Go ou RTX 5090 32 Go + 64-128 Go RAM** — 4 000 à 5 500 €.

**Option C (la radicale) : PC avec deux RTX 5090 en parallèle** — 6 000 à 7 000 €. Tu fais tourner Llama 70B à 27 tokens/s (vitesse d'un H100 pro à 25 000 €).

**Ce que tu peux faire** : Llama 70B en Q4 avec fluidité, DeepSeek R1 distill 70B, plusieurs modèles en parallèle pour tester, fine-tuning léger sur tes propres données, génération d'images via Stable Diffusion en plus.

---

## 6. Le calcul de rentabilité face au cloud

C'est la vraie question qui revient toujours : « OK mais ChatGPT Plus me coûte 20 €, pourquoi je dépenserais 2 400 € dans un Mac ? »

Comparons honnêtement.

| Solution | Coût initial | Coût mensuel | Coût sur 3 ans |
|---|---|---|---|
| ChatGPT Plus seul | 0 € | 20 € | 720 € |
| ChatGPT Plus + Claude Pro | 0 € | 40 € | 1 440 € |
| Stack pro (ChatGPT + Claude + Perplexity Pro) | 0 € | 60 € | 2 160 € |
| Usage API intensif (équipe, automatisations) | 0 € | 80-150 € | 3 000-5 400 € |
| MacBook Air M3 16 Go | 1 200 € | 0 € | 1 200 € |
| MacBook Pro M4 Pro 48 Go | 2 400 € | 0 € | 2 400 € |
| PC RTX 4090 + 64 Go RAM | 2 500 € | 0 € | 2 500 € |
| Mac Studio M4 Max 64 Go | 3 500 € | 0 € | 3 500 € |

### Seuil de rentabilité par configuration

| Matériel | Seuil rentabilité (vs ChatGPT+Claude à 40 €/mois) |
|---|---|
| MacBook Air M3 16 Go | 30 mois (2 ans et demi) |
| MacBook Pro M4 Pro 48 Go | 60 mois (5 ans) |
| PC RTX 4090 | 62 mois (5 ans) |
| Mac Studio M4 Max | 87 mois (7 ans) |

À première vue, le calcul semble défavorable. Mais regarde ce que tu gagnes en plus :

- **Vie privée totale** : aucune donnée ne part chez OpenAI ou Anthropic
- **Pas de censure ni de filtre commercial** : tu poses les questions que tu veux
- **Offline** : ça marche dans le train, dans l'avion, en panne d'internet
- **Pas de quota** : utilise-le 18 heures par jour si tu veux
- **Confidentialité légale** : pour un avocat, médecin, comptable, c'est non-négociable
- **Contrôle de la version** : ton modèle ne change pas du jour au lendemain
- **Revente du matériel** : un MacBook se revend 60-70 % de son prix après 3 ans

Mon avis honnête : si tu n'utilises l'IA que pour des questions banales 30 minutes par jour, reste sur ChatGPT Plus. Si tu manipules des documents pro, des données clients, du code propriétaire, ou que tu veux apprendre l'IA en profondeur, **investir 1 200 à 2 400 € dans un Mac vaut largement le coup**.

---

## 7. La bande passante mémoire : le vrai bottleneck que personne n'explique

Je termine par le point qui me semble le plus mal compris du grand public, et qui explique 90 % des déceptions.

### Pourquoi c'est crucial

Quand un modèle de langage te répond, il « lit » l'intégralité de ses paramètres pour générer **chaque mot**. Pour un modèle 70B en Q4, ça veut dire lire 42 Go de mémoire à chaque token généré. Si ta mémoire est lente, ton modèle est lent. Point.

C'est pour ça que la bande passante mémoire (mesurée en Go par seconde) est plus importante que la pure puissance de calcul pour faire tourner un LLM.

### Les chiffres qui parlent

| Matériel | Bande passante | Vitesse sur Llama 8B Q4 | Vitesse sur Llama 70B Q4 |
|---|---|---|---|
| RAM DDR5 standard (PC sans GPU) | ~80 Go/s | 5-10 tok/s | < 1 tok/s (inutilisable) |
| MacBook Air M3 | ~100 Go/s | 25-35 tok/s | n'entre pas en RAM |
| MacBook Pro M4 Pro | ~273 Go/s | 50-60 tok/s | Ne tient pas en RAM |
| MacBook Pro M4 Max | 546 Go/s | 90-100 tok/s | 6-7 tok/s |
| RTX 4090 | ~1 008 Go/s | 80-110 tok/s | offload partiel uniquement |
| RTX 5090 | 1 792 Go/s | 130-140 tok/s | possible en Q3 |

**Pour comparaison, un humain qui lit à voix haute fait environ 3-4 mots par seconde**. En dessous de 3 tokens par seconde, l'expérience devient frustrante. À 10 tokens par seconde, c'est confortable. À 30 tokens et plus, c'est instantané à l'œil.

### Conséquence pratique

Si tu prends un PC avec 64 Go de RAM mais sans GPU, tu peux **techniquement** charger Llama 70B en Q4 (qui pèse 42 Go). Mais ta vitesse de génération sera de 0,5 à 1 token par seconde. Inutilisable. Le modèle « entre » mais ne « roule » pas.

C'est exactement la raison pour laquelle un Mac à 2 400 € peut être plus pertinent qu'un PC à 1 500 € avec plus de RAM mais moins de bande passante.

---

## En résumé : le piège à éviter et le minimum vital

**Le piège n°1 à éviter** : acheter un PC avec beaucoup de RAM mais une carte graphique trop faible (ou pas de carte du tout). Tu pourras charger les modèles, ils seront juste atrocement lents. La bande passante mémoire compte autant que la quantité.

**Le minimum absolu pour démarrer en avril 2026** : 16 Go de RAM unifiée (Mac) ou 12 Go de VRAM (PC NVIDIA). En dessous, tu te limites aux tout petits modèles 3B et tu vas vite être frustré.

**Mon conseil si tu hésites** : commence par installer Ollama (gratuit, 5 minutes) sur ton ordinateur actuel, télécharge Mistral 7B et teste. Si ça marche bien, tu n'as peut-être rien à acheter. Si c'est trop lent et que ça te plaît, tu sauras exactement ce qu'il te manque.

Dans le prochain article de cette série, je te montre comment installer Ollama étape par étape et faire tourner ton premier modèle en moins de 10 minutes. Sans ligne de commande compliquée, sans connaissances techniques préalables.
