---
slug: mcp-explique-simplement
titre: "C'est quoi le MCP, expliqué simplement"
titre_seo: "C'est quoi le MCP ? L'explication simple et claire"
description: "Le MCP, c'est la prise universelle qui branche ton IA sur tes outils (Gmail, Notion, ta base de données). Je t'explique à quoi ça sert et comment démarrer, sans jargon."
numero: "28"
categorie: "Décryptage"
hero_ligne_1: "C'est quoi"
hero_ligne_2: "le MCP,"
hero_ligne_3: "vraiment ?"
lead: "Tu as vu passer « MCP » partout depuis quelques mois, sans jamais comprendre de quoi on parle. Moi aussi, au début, je hochais la tête sans savoir. Puis j'ai branché mon premier outil sur Claude grâce à ça, et le déclic s'est fait. Je t'explique en une page ce que c'est, à quoi ça sert pour toi, et pourquoi tout le monde en parle en 2026."
duree: "6 min"
niveau: "Débutant"
outils: "Claude, MCP"
published: "2026-05-27"
tldr:
  - "<strong>MCP = Model Context Protocol</strong> : une prise universelle entre une IA et tes outils (Gmail, agenda, base de données)."
  - "Avant, chaque connexion IA↔outil devait être bricolée à la main. Le MCP standardise tout, comme l'USB a standardisé les câbles."
  - "Standard ouvert depuis son lancement, désormais gouverné par une fondation indépendante (Linux Foundation) et adopté par les grands acteurs de l'IA."
  - "Pour toi : ton assistant IA peut enfin lire tes vrais documents et agir dans tes vrais outils, sans que tu codes quoi que ce soit."
  - "Je te montre 3 cas concrets et comment démarrer en 10 minutes."
---

<!-- section k-fuchsia -->

## Le problème que le MCP règle

Pendant longtemps, une IA comme Claude ou ChatGPT vivait dans sa bulle. Tu lui parlais, elle répondait, mais elle ne savait rien de **ton** monde. Tes emails, ton agenda, tes fichiers, ta base clients : tout ça lui était invisible.

Si tu voulais qu'elle agisse sur tes vrais outils, il fallait construire un pont sur mesure pour chaque outil. Un pont pour Gmail. Un autre pont, complètement différent, pour Notion. Encore un autre pour ta base de données. Chaque pont, du travail technique à part entière, et rien n'était réutilisable.

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Le MCP, c'est le moment où l'IA est passée de « assistant qui parle » à « assistant qui fait ». C'est moins spectaculaire qu'un nouveau modèle, mais c'est ce qui change vraiment ton quotidien.</p>
</div>

C'est exactement le problème que les câbles posaient avant l'USB. Tu te souviens ? Chaque appareil avait sa prise. Un câble pour l'imprimante, un autre pour l'appareil photo, un autre pour le téléphone. Puis l'USB est arrivé et a tout standardisé. Une seule prise, tous les appareils.

Le MCP, c'est l'USB de l'IA.

<!-- section k-teal -->

## MCP, ça veut dire quoi au juste

MCP, c'est l'abréviation de **Model Context Protocol**. En français : un protocole qui donne du contexte au modèle.

Décortiquons sans jargon :

- **Modèle** : c'est l'IA elle-même (Claude, GPT, Gemini…). Si le mot te bloque, va voir ma fiche [modèle dans le lexique](/lexique/llm).
- **Contexte** : tout ce qui aide l'IA à comprendre ta situation. Tes documents, tes données, l'accès à tes outils.
- **Protocole** : une façon standardisée de se parler. Comme le code de la route : tout le monde suit les mêmes règles, donc tout le monde se comprend.

Mis bout à bout : le MCP est **la manière standard de brancher une IA sur tes outils et tes données**. Une fois qu'un outil parle « MCP », n'importe quelle IA compatible peut s'y connecter. Tu ne refais plus le pont à chaque fois.

Et c'est là que ça devient sérieux : ouvert dès le départ (Anthropic l'a publié fin 2024), le MCP est depuis [fin 2025](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) gouverné par une fondation indépendante, l'Agentic AI Foundation, sous l'égide de la Linux Foundation. Traduction : ce n'est pas le jouet privé d'une seule entreprise. C'est un terrain neutre que tout le monde peut utiliser, ce qui explique pourquoi l'adoption a explosé.

<!-- section k-orange -->

## À quoi ça te sert, à toi

Assez de théorie. Voilà ce que le MCP débloque concrètement, même si tu n'écris pas une ligne de code.

### 1. Ton assistant lit tes vrais documents

Tu branches ton dossier Google Drive ou Notion en MCP. D'un coup, ton IA peut répondre à « résume-moi le contrat qu'on a signé avec ce client » en allant chercher le vrai document. Plus besoin de copier-coller des pages entières dans la conversation.

### 2. Ton assistant agit dans tes outils

Avec un connecteur MCP vers Gmail, ton IA peut trier ta boîte, repérer les vrais urgents, préparer des brouillons de réponse. C'est exactement le principe de mon [agent qui lit mes 200 mails chaque matin](/articles/hermes-agent) — le MCP, c'est la tuyauterie qui rend ça possible proprement.

### 3. Tu construis tes propres connexions

Tu as un outil maison, une base de données perso, un tableur ? Si tu l'exposes en MCP, ton IA peut s'en servir. C'est ce qui transforme un assistant générique en **ton** assistant, qui connaît ton business.

<div class="callout tip">
  <h4>Le piège à éviter</h4>
  <p>Donner un accès MCP à une IA, c'est lui donner les clés d'un outil. Commence toujours par des accès en lecture seule, et ne branche jamais un outil sensible (banque, données clients) sans comprendre ce que l'IA peut en faire. La prudence d'abord.</p>
</div>

## MCP, agent, API : on ne confond pas

Trois mots qui reviennent ensemble et qu'on mélange souvent.

- Un **[agent](/lexique/agent)**, c'est une IA qui décide elle-même des étapes à enchaîner pour accomplir une tâche.
- Une **API**, c'est l'adresse technique d'un service, comme un numéro de téléphone direct vers une fonction.
- Le **MCP**, c'est le standard qui permet à l'agent d'utiliser ces API sans qu'on recâble tout à chaque fois.

Image simple : l'agent est le cuisinier, les API sont les ingrédients, le MCP est le plan de travail qui range tout pour que le cuisinier attrape ce qu'il veut sans réfléchir.

## Comment démarrer en 10 minutes

Tu n'as rien à installer de compliqué. Voici le chemin le plus court.

1. **Ouvre Claude** (l'app de bureau ou le web). C'est le plus simple pour découvrir le MCP aujourd'hui.
2. **Va dans les connecteurs.** Tu y trouves une liste d'outils déjà compatibles MCP : Google Drive, Notion, GitHub, et bien d'autres.
3. **Branche-en un en lecture seule.** Ton agenda, par exemple.
4. **Pose une vraie question.** « Qu'est-ce que j'ai cette semaine ? » L'IA va lire ton vrai agenda et te répondre.

Le déclic arrive à ce moment-là. Tu réalises que l'IA n'est plus une boîte fermée : elle touche enfin ton vrai quotidien.

Si tu veux aller plus loin et lui faire faire des actions concrètes, regarde mon [tutoriel d'agent qui trie Gmail](/articles/tuto-agent-gmail) : c'est le cas d'usage parfait pour comprendre la puissance du MCP en pratique.

## Questions fréquentes

### Le MCP, c'est réservé à Claude ?
Non. Le MCP a été lancé par Anthropic (les créateurs de Claude) fin 2024, et il est ouvert depuis le départ. Fin 2025, il a été confié à une fondation indépendante pour que personne ne le contrôle seul. D'autres IA et de plus en plus d'outils le supportent. C'est justement l'intérêt d'un standard : il n'appartient à personne.

### Faut-il savoir coder pour utiliser le MCP ?
Pour **utiliser** des connecteurs existants (Drive, Notion, agenda), non, c'est quelques clics. Pour **créer** ton propre connecteur sur un outil maison, il faut un peu de technique, ou un coup de main d'un outil comme Claude Code. Moi qui ne suis pas du métier, j'y arrive en me faisant guider.

### C'est dangereux de brancher mes outils ?
Comme tout accès, ça demande de la prudence. Règle d'or : lecture seule d'abord, outils non sensibles d'abord, et tu comprends ce que l'IA peut faire avant de lui donner les clés. Bien configuré, c'est sûr. Branché à l'aveugle, c'est risqué.

### Quelle différence avec un « plugin » ou un « custom GPT » ?
Un plugin ou un custom GPT, c'est souvent spécifique à une plateforme. Le MCP, lui, est un standard partagé : un même connecteur peut servir à plusieurs IA différentes. C'est la différence entre une prise propriétaire et une prise universelle.

### Où voir la liste des outils compatibles ?
Elle grandit chaque semaine. Le plus simple est de regarder directement dans les connecteurs de ton IA, ou de chercher « serveur MCP » pour l'outil qui t'intéresse. Pour les définitions des termes croisés ici, j'ai un [lexique IA complet](/lexique).

## Ce que je retiens

Le MCP n'est pas une révolution tape-à-l'œil. C'est une révolution discrète : celle qui fait que ton IA arrête de vivre dans sa bulle et commence à toucher ton vrai monde. Mes outils, mes documents, mes vraies tâches.

Si tu ne devais retenir qu'une phrase : **le MCP, c'est la prise universelle entre ton IA et tout le reste.** Et une fois que tu l'as branchée, tu ne reviens plus en arrière.
