# Cas d'usage pratiques + chat avec tes docs : faire bosser ton LLM local pour de vrai

*Avril 2026 — guide pour non-dev*

---

## 1. Pourquoi le LLM local change ton quotidien

Avoir un modèle qui tourne sur ta machine, c'est sortir de la logique « je paye 20 €/mois pour parler à un robot qui appartient à quelqu'un d'autre ». Cinq trucs basculent dès que tu installes Ollama ou LM Studio sur ton ordi.

**Confidentialité absolue.** Tes contrats clients, tes brouillons de roman, tes rapports financiers, tes notes médicales — tout reste sur ton disque. Aucune ligne ne part chez OpenAI, Anthropic ou Mistral. Pour un avocat, un médecin, un DAF, ce n'est pas un confort : c'est une obligation déontologique.

**Coût zéro après l'achat matériel.** Un Mac M4 Pro 32 Go acheté 2 200 € rembourse un abonnement ChatGPT Plus en 9 ans. Mais si tu as déjà la machine pour bosser, c'est gratuit immédiat. Pas de compteur de tokens, pas de paliers, pas de « vous avez atteint votre quota ».

**Disponibilité offline.** Train, avion, chambre d'hôtel à wifi pourri, panne internet du quartier : ton modèle répond. Pour un journaliste en reportage ou un consultant en déplacement, c'est un game changer.

**Personnalisation possible.** Tu peux brancher tes propres documents (RAG), tu peux fine-tuner sur ton style d'écriture, tu peux modifier le prompt système pour qu'il réponde toujours dans ta tonalité de marque. Aucun équivalent côté SaaS sans payer une fortune en API.

**Pas de filtre commercial.** Ton modèle ne refuse pas de t'aider à analyser un contrat « parce que c'est du conseil juridique », ne te ressort pas de disclaimer toutes les 3 lignes, ne t'oriente pas vers un produit maison. Il fait ce que tu lui demandes.

---

## 2. Huit cas d'usage concrets, par profession

### Cas 1 — Avocat : analyse de contrats clients

**Profil + besoin.** Cabinet de 3 associés, 50 contrats commerciaux à comparer trimestriellement. Envoyer ces fichiers chez OpenAI = violation du secret professionnel (RPVA, déonto barreau).

**Modèle recommandé.** Mistral Small 4 (256K de contexte, sorti mars 2026, gère un dossier complet d'un coup).

**App utilisée.** Open WebUI + Ollama, avec base de connaissances activée.

**Setup.**
1. Installe Ollama (`brew install ollama` sur Mac).
2. `ollama pull mistral-small:latest` (commande unique).
3. Lance Open WebUI via Docker (1 commande copiée-collée depuis leur doc).
4. Dans l'interface, crée une « Knowledge » et glisse-dépose tes 50 PDF.
5. Nouveau chat → choisis le modèle → coche la knowledge base → pose ta question.

**Prompt prêt à copier.**
> « Compare le contrat A et le contrat B fournis. Liste les 10 différences clés sur : durée, clause de résiliation, juridiction compétente, pénalités, propriété intellectuelle. Cite la page exacte de chaque clause. »

**Ce que tu obtiens.** Tableau de différences en 2 minutes vs 2 heures de relecture manuelle. Sources citées (page X, section Y) pour vérifier.

---

### Cas 2 — Commercial : 30 emails de prospection personnalisés

**Profil + besoin.** Co-fondatrice d'un SaaS B2B, doit envoyer 30 emails à des CEO ciblés, chacun adapté à leur secteur et actu récente.

**Modèle recommandé.** Mistral 7B (rapide, suffisant pour ce niveau de personnalisation).

**App utilisée.** Msty (interface drag-and-drop, templates intégrés) ou Ollama + petit script Python si tu connais quelqu'un qui peut le pondre.

**Setup.**
1. Installe Msty (clic-clic, pas de ligne de commande).
2. Télécharge Mistral 7B depuis l'interface Msty.
3. Crée un template d'email avec variables `{nom}`, `{boîte}`, `{actu_récente}`, `{pain_point}`.
4. Importe ton CSV de prospects.
5. Lance la génération en batch.

**Prompt prêt à copier.**
> « Tu es {prénom_expéditeur}. Écris un email de 6 lignes à {nom}, CEO de {boîte} ({secteur}). Mentionne {actu_récente} comme accroche. Propose un call de 15 min pour discuter de {pain_point}. Ton chaleureux, pas vendeur, pas de superlatifs. »

**Ce que tu obtiens.** 30 emails en 1 heure (génération + relecture rapide) au lieu de 5 heures. Et tu peux relancer 30 autres demain sans surcoût.

---

### Cas 3 — Journaliste : transcription + extraction d'interviews

**Profil + besoin.** Journaliste indé, 5 heures d'interviews enregistrées, doit extraire les 10 phrases les plus marquantes pour un article.

**Modèles recommandés.** Whisper Large v3 Turbo (transcription, 8x plus rapide que la v3 standard, sortie 2026) + Mistral 7B (résumé / extraction).

**App utilisée.** MacWhisper (40 €, vraiment confortable) ou WhisperX gratuit si tu acceptes la ligne de commande, puis Ollama pour l'extraction.

**Setup.**
1. Drag-and-drop tes 5 fichiers audio dans MacWhisper.
2. Choisis le modèle « Large v3 Turbo », clique « Transcrire ».
3. Attends 15 min (sur Mac M4) → tu récupères 5 fichiers .txt.
4. Ouvre Ollama (interface Open WebUI ou Msty).
5. Colle chaque transcript et lance le prompt d'extraction.

**Prompt prêt à copier.**
> « Voici la transcription d'une interview. Extrais les 10 phrases les plus marquantes (citations directes, mot pour mot). Pour chacune, indique la ligne approximative et explique en 1 phrase pourquoi c'est fort. »

**Ce que tu obtiens.** 2 heures de boulot total au lieu de 8. Et tu peux relancer le modèle avec un prompt différent (« extrais les 5 contradictions », « liste les chiffres cités ») sans repayer.

---

### Cas 4 — Formateur : génération de support de cours

**Profil + besoin.** Consultant qui anime une formation 2 jours sur la conformité RGPD secteur santé. Doit livrer un PDF participant complet.

**Modèle recommandé.** Mistral Small 4 (long contexte 256K, peut digérer ton ancien support + de la doc réglementaire).

**App utilisée.** Open WebUI avec base de connaissances (charge tes anciens cours + 5 articles juridiques de référence).

**Setup.**
1. Crée une knowledge base « Formation RGPD santé ».
2. Upload : ton ancien support PDF, 3-4 articles CNIL, ton plan détaillé.
3. Sélectionne Mistral Small 4 + cette knowledge base.
4. Demande la structure d'abord, valide, puis demande chaque module.
5. Export en Markdown, mise en page dans Notion ou Pages.

**Prompt prêt à copier.**
> « Crée 8 modules de cours sur la conformité RGPD pour cabinets médicaux. Pour chaque module : objectifs (3 bullets), contenu (400 mots), exemple concret tiré du secteur santé, exercice pratique à la fin. Inspire-toi du style de mes anciens cours uploadés. »

**Bonus.** Si tu as 50 anciens supports, tu peux fine-tuner un modèle sur ton style — mais c'est l'étape suivante, pas obligatoire.

---

### Cas 5 — DAF / comptable : analyse de rapports financiers

**Profil + besoin.** DAF d'un fonds family office, 10 rapports trimestriels de boîtes en portefeuille, doit identifier tendances + alertes pour le board.

**Modèle recommandé.** Mistral Small 4 (256K contexte, gère les 10 rapports d'un coup) — l'info initiale du brief disait 32K, c'est dépassé : la nouvelle version est sortie en mars 2026 avec 256K.

**App utilisée.** Open WebUI + RAG.

**Setup.**
1. Knowledge base « Portefeuille Q1-Q4 2025 ».
2. Upload les 40 PDF (10 boîtes × 4 trimestres).
3. Lance le modèle, sélectionne la base.
4. Pose tes questions analytiques.
5. Export les réponses dans ton tableau de board.

**Prompt prêt à copier.**
> « Pour la société Acme dans la base : compare les 4 trimestres. Identifie 3 tendances clés (CA, marge, cash), 2 alertes (risques émergents), 2 opportunités. Cite les pages exactes. Format : tableau. »

**Bonus.** Confidentialité absolue — ces rapports sont souvent sous NDA strict, impossible de les passer chez ChatGPT légalement.

---

### Cas 6 — Auteur / écrivain : aide à la rédaction de roman

**Profil + besoin.** Romancière, 1er roman de 80 000 mots, veut faire relire chapitre par chapitre, brainstormer la suite, trouver des incohérences.

**Modèle recommandé.** Mistral Small 4 ou Mixtral 8x7B (créativité supérieure aux modèles « instruct » classiques).

**App utilisée.** LM Studio (interface très confortable pour conversation longue, sauvegarde auto des sessions) ou Msty.

**Setup.**
1. Installe LM Studio.
2. Télécharge Mixtral 8x7B (quantization Q4_K_M, ~26 Go).
3. Crée une conversation « Roman — Chapitre 12 ».
4. Colle ton chapitre, demande relecture critique.
5. Itère : demande des reformulations, des suggestions de suite, des tests d'incohérence.

**Prompt prêt à copier.**
> « Voici le chapitre 12 de mon roman (genre : thriller psychologique). Relecture critique en 4 axes : (1) rythme — où est-ce qu'on traîne, (2) dialogues — qui sonne faux, (3) cohérence avec les chapitres précédents, (4) 3 suggestions concrètes pour renforcer la tension finale. Sois direct, pas de complaisance. »

**Bonus.** Tu peux fine-tuner sur les œuvres d'un auteur que tu aimes (Maupassant, Modiano…) pour pasticher son style à des fins d'exercice perso. Légalement OK tant que tu ne publies pas en prétendant que c'est lui.

---

### Cas 7 — Étudiant : tuteur personnel sur mesure

**Profil + besoin.** Terminale S, bloque sur Kant, a besoin qu'on lui ré-explique 50 fois en variant les angles sans se faire juger.

**Modèle recommandé.** DeepSeek R1-Distill 14B (montre son raisonnement étape par étape — pédagogiquement génial). Phi-4 14B est un solide concurrent si tu veux tester.

**App utilisée.** Open WebUI (gratuit, auto-hébergé) ou GPT4All (encore plus simple, installation 1 clic).

**Setup.**
1. Installe GPT4All.
2. Télécharge DeepSeek R1-Distill 14B depuis le catalogue intégré.
3. Crée un personnage système « Tuteur de philo ».
4. Démarre la conversation, l'historique se sauvegarde.
5. Reviens demain, le contexte reste dispo.

**Prompt prêt à copier.**
> « Tu es mon tuteur de philo, niveau Terminale. Explique-moi l'impératif catégorique de Kant en partant de zéro, sans présupposer que je connais Kant. Donne 3 exemples du quotidien d'ado. À la fin, pose-moi 2 questions pour vérifier que j'ai compris. »

**Bonus.** R1 affiche son raisonnement (« Réfléchissons étape par étape… ») dans une zone séparée — l'étudiant voit *comment* le modèle pense, pas juste la réponse. Pédagogie de fou.

---

### Cas 8 — Marketing / créatif : génération d'images en local

**Profil + besoin.** Solo marketeur, doit produire 50 visuels par mois pour campagnes LinkedIn / pubs Meta. Marre de payer Midjourney 30 €/mois et de subir leurs files d'attente.

**Modèle recommandé.** FLUX.1 schnell (licence Apache 2.0, **commercial OK gratuitement**, 4 steps suffisent — ultra rapide). Stable Diffusion 3.5 en alternative si tu préfères l'écosystème Stability.

**App utilisée.** ComfyUI (interface en blocs visuels, courbe d'apprentissage 2 jours mais ensuite tu fais tout) ou Forge / Automatic1111 si tu veux du classique.

**Setup.**
1. Installe ComfyUI (1 zip à dézipper sur Windows / 1 commande sur Mac).
2. Télécharge le checkpoint FLUX.1 schnell (~12 Go) + le VAE + le text encoder.
3. Charge un workflow basique « text-to-image » depuis la galerie ComfyUI.
4. Tape ton prompt en anglais, ajuste 2-3 paramètres (steps=4, CFG=1).
5. Génère, itère, exporte.

**Prompt prêt à copier (anglais obligatoire).**
> `professional photo of a young woman entrepreneur at her desk, soft natural light from a window, MacBook open, plant in background, shot on Leica, shallow depth of field, warm tones, editorial style`

**Bonus.** Tu peux entraîner un LoRA sur ta charte de marque (50 photos suffisent) pour que toutes les images sortent dans ton style visuel, avec tes couleurs. Une fois entraîné, c'est gratuit pour la vie.

---

## 3. Le RAG : « chat avec tes docs », l'arme secrète

### C'est quoi exactement

Le RAG (Retrieval Augmented Generation, ou en clair : **chat avec tes docs**) permet à ton modèle local de répondre en se basant sur **TES** documents — PDF, fichiers Word, notes Markdown, emails, codes source, peu importe.

L'analogie qui parle : c'est comme donner à un assistant brillant ta bibliothèque personnelle, et lui demander de répondre **en citant tes propres livres**, pas en bricolant depuis sa mémoire générale.

Différence avec « entraîner un modèle » (fine-tuning) : tu n'as pas besoin de recalculer des milliards de paramètres. Tu donnes juste les documents, l'outil les rend cherchables, et le modèle les consulte au moment où tu poses la question. C'est **10x plus simple** que le fine-tuning, et ça se met à jour en temps réel (tu ajoutes un PDF, c'est dispo dans la seconde).

### Comment ça marche, en 5 lignes

1. Tu balances tes documents dans l'outil (drag-and-drop).
2. L'outil les découpe en petits morceaux (« chunks ») de quelques centaines de mots.
3. Pour chaque morceau, il calcule une « signature numérique » (un embedding) qui code le sens du texte.
4. Quand tu poses une question, l'outil cherche les morceaux dont la signature ressemble à celle de ta question.
5. Il passe ces morceaux **+** ta question au modèle, qui répond en citant les sources.

Conséquence directe : si l'info n'est pas dans tes docs, le modèle ne l'invente pas (et te le dit). C'est une **qualité**, pas un bug : tu sais que la réponse vient bien de ton corpus.

### Outils RAG pour non-dev (avril 2026)

| Outil | Niveau | Force | Faiblesse |
|---|---|---|---|
| **Open WebUI** | Débutant + | RAG natif solide, gratuit, écosystème énorme | Setup Docker un peu impressionnant |
| **AnythingLLM** | Débutant | RAG le plus mature du marché, drag-and-drop ultra clean | Moins flexible côté modèles |
| **Msty** | Très débutant | « Knowledge stacks » + UI premium gratuite | Moins de contrôle technique |
| **GPT4All** | Très débutant | RAG basique mais 100% sans config | Limité aux gros corpus |
| **LM Studio** | Débutant | RAG ajouté en 2025, intégré à l'app | Moins poussé que Open WebUI |
| **Cherry Studio** | Débutant | Alternative récente populaire en Asie | Moins de docs en français |

**Recommandation tranchée :** si tu démarres aujourd'hui, **AnythingLLM**. Si tu veux la solution la plus extensible pour grandir, **Open WebUI**.

### Setup pas à pas avec Open WebUI (5 étapes)

1. Installe Docker Desktop (15 min, clic-clic).
2. Installe Ollama et télécharge un modèle : `ollama pull mistral-small`.
3. Lance Open WebUI : une seule commande Docker (copiée depuis [docs.openwebui.com](https://docs.openwebui.com/)).
4. Ouvre `http://localhost:3000` dans ton navigateur, crée ton compte admin.
5. Workspace → Knowledge → « + New Knowledge » → drag-and-drop tes PDF → attends le tick vert → crée un chat → tape `#` pour invoquer ta knowledge base.

C'est tout. Tu chattes avec tes documents.

### Limites du RAG local (à connaître)

- **Qualité dépend du modèle d'embedding.** Open WebUI utilise par défaut un modèle correct mais pas le meilleur. Pour des cas pointus, swap pour `nomic-embed-text` (gratuit, meilleur).
- **Documents mal structurés = mauvaises réponses.** Un PDF scanné illisible ou un Excel chaotique ne marchera pas. Nettoie tes sources.
- **Pas miraculeux.** Si l'info n'est pas dans tes docs, le modèle ne te la sortira pas. C'est une qualité (pas d'hallucination), mais ça veut dire que la richesse de ton corpus = la richesse de tes réponses.
- **Langue.** Les modèles d'embedding marchent mieux en anglais. En français pur, c'est bon mais pas exceptionnel. Si tes docs sont multilingues, choisis un embedding multilingue (`paraphrase-multilingual-mpnet-base-v2`).

### Cas d'usage RAG les plus puissants

| Profession | Corpus typique | Gain |
|---|---|---|
| Cabinet d'avocats | Jurisprudence interne, contrats types, mémos | Recherche en 10 sec vs 30 min |
| Médecin | Articles scientifiques, protocoles persos | Synthèse pré-consultation |
| Journaliste | Archives interviews, dossiers en cours | Retrouver une citation perdue |
| Consultant | Decks projets passés, livrables clients | Réutilisation intelligente |
| Étudiant | Cours + lectures du semestre | Révisions ciblées sur ses notes |
| Dev / PM | Doc technique interne, tickets, ADR | Onboarding et debug accélérés |

---

## 4. Outils complémentaires utiles

- **Continue.dev** — extension VS Code gratuite, branche un Ollama local pour avoir l'autocomplétion et le chat dans ton IDE. Pour les non-devs : ignore. Pour les bidouilleurs : tutoriel sur leur site, 10 min de setup, tu remplaces Copilot (10 €/mois) par du gratuit local.
- **Cursor** (payant, 20 $/mois) — IDE complet centré IA. Cloud par défaut mais tu peux pointer vers ton Ollama local. Plus poli que Continue, mais perd de son intérêt si tu veux du 100% local.
- **n8n + LLM local** — n8n est l'équivalent open source de Zapier. Tu peux brancher ton Ollama dans un workflow : « quand un email arrive → résume-le → poste sur Slack ». Domotique conversationnelle aussi.
- **Home Assistant + LLM local** — pilote ta maison à la voix, en local, sans Alexa qui écoute tout. Setup pour passionnés (1 weekend).

---

## 5. Limites communes à tous les cas d'usage

À avoir en tête avant de te lancer.

- **Vitesse selon hardware.** 5-15 tokens/sec sur laptop standard, 30-50 sur Mac M Pro 32 Go, 100+ sur RTX 4090 ou Mac M Ultra. Pour comparaison, ChatGPT cloud tourne à 100-150 tokens/sec.
- **Pas de recherche web autonome.** Sauf si tu installes une extension (Open WebUI a un module SearXNG, AnythingLLM a Tavily). Par défaut, le modèle ne sait que ce qu'il a appris jusqu'à sa date de cutoff.
- **Pas de génération d'image dans le chat.** Sauf si tu connectes FLUX ou Stable Diffusion en parallèle (Open WebUI peut le faire, ComfyUI tourne à côté).
- **Modèles plus petits = moins de mémoire conversationnelle.** Un Mistral 7B retient bien 8K-32K de contexte, mais oublie les vieux échanges d'une session de 4h. Pour de la conversation longue, prends Mistral Small 4 (256K).
- **Pas de mises à jour de connaissance automatiques.** Le modèle ne sait pas ce qui s'est passé après sa date de cutoff. Combine avec RAG sur des sources fraîches si tu veux du contenu à jour.
- **Setup initial = 1 à 4 heures selon ton niveau.** Après c'est tranquille, mais ne sous-estime pas la première fois (downloads de plusieurs Go, configurations Docker, choix de modèles).

---

*Sources principales : [docs.openwebui.com](https://docs.openwebui.com/features/workspace/knowledge/), [Mistral AI — Mistral Small 4 release](https://mistral.ai/news/mistral-small-4), [LocalLLaMA top models avril 2026 (Latent Space)](https://www.latent.space/p/ainews-top-local-models-list-april), [Compute Market — DeepSeek R1 setup 2026](https://www.compute-market.com/blog/deepseek-r1-local-setup-guide-2026), [SitePoint — Continue.dev + Ollama local](https://www.sitepoint.com/local-ai-coding-assistant-vscode-ollama-continue/), [WhisperKit / MacWhisper 2026](https://www.getvoibe.com/resources/best-local-whisper-model-superwhisper/), [FLUX.1 schnell licence Apache](https://docs.comfy.org/tutorials/flux/flux-1-text-to-image), [AnythingLLM vs Open WebUI 2026](https://openalternative.co/compare/anythingllm/vs/open-webui).*
