---
slug: skills-claude-code-non-dev
titre: "Les Skills Claude Code, expliqués pour un non-dev"
titre_seo: "Skills Claude Code · 3 mois d'usage — Jérémy Sagnier"
description: "Un Skill Claude Code, c'est un mode d'emploi que tu glisses dans un dossier. Je t'explique à quoi ça sert et comment je m'en sers tous les jours, depuis 3 mois."
numero: "07"
categorie: "Retour d'XP"
hero_ligne_1: "Les Skills Claude Code,"
hero_ligne_2: "expliqués"
hero_ligne_3: "pour un non-dev."
lead: "Les Skills sont l'invention la plus utile d'Anthropic de ces 12 derniers mois. Sauf que personne ne te les explique dans une langue que tu comprends quand tu n'es pas développeur. Moi j'en ai installés 26, j'en ai créé pour mon site, et je les lance tous les jours. Voici ce que je leur demande, ce qu'ils font vraiment, et pourquoi tu devrais t'y mettre."
duree: "10 min"
niveau: "Débutant"
outils: "Claude Code · Skills"
published: "2026-04-23"
tldr:
  - "Un Skill, c'est <strong>un mode d'emploi permanent</strong> que Claude lit avant de répondre. Pas un plugin, pas un prompt à copier à chaque session."
  - "Tu mets un fichier <code>SKILL.md</code> dans un dossier, Claude s'en sert tout seul. Chez moi : <strong>26 skills actifs</strong>, dont 4 que j'utilise tous les jours."
  - "Créer le tien prend 20 minutes. Tu décris ce que tu veux que Claude fasse <strong>toujours</strong>, il le fait. Écrit avec Claude, relu par moi."
---

<!-- section k-fuchsia -->

## Avant de commencer

Melvynx a posté [un tuto ultra clair sur les Skills](https://www.youtube.com/watch?v=RamZTmlqXCc) la semaine dernière. Si tu es dev, va le voir, il te suffit. Si tu n'es pas dev, je te propose autre chose : mon retour après 3 mois d'usage de **26 skills installés** sur mon ordinateur, et 4 que j'ai créés moi-même.

Les Skills sont sortis en octobre 2025. C'est un mécanisme simple comme un manche de pelle, mais qui change tout : **tu apprends à Claude une tâche une fois, il la refait parfaitement à chaque fois**. Sans que tu réexpliques. Sans que tu copies-colles un prompt. Sans que tu re-paies en tokens à chaque session.

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Les Skills sont la meilleure chose qui est arrivée à Claude Code depuis le début. Si tu n'en utilises pas encore, tu perds une à deux heures par semaine à re-expliquer les mêmes choses à ton agent IA. C'est le niveau au-dessus du fichier <code>CLAUDE.md</code>.</p>
</div>

<!-- section k-teal -->

## Le concept, en une métaphore

Melvynx explique ça avec la métaphore du chef cuisinier. Je la garde, elle est parfaite.

Imagine que tu engages un chef cuisinier. Il sait cuisiner. Mais il ne connaît **pas ta cuisine**. Il ne sait pas où tu ranges le sel, il ne sait pas que ta plaque fait une marque quand la poêle est trop chaude, il ne sait pas que ton four chauffe 20 degrés en moins que ce qu'il affiche.

Tu peux :

1. **Lui réexpliquer à chaque service.** Tu es à côté, tu lui donnes les infos. Ça marche, mais tu es fatigué.
2. **Lui laisser un classeur dans la cuisine.** Quand il arrive, il consulte. « Ah, le sel est en haut à gauche. Le four chauffe moins. Super. » Il fait son service sans toi.

**Le classeur, c'est un Skill.**

Tu écris une fois dans un fichier `SKILL.md` : « Voici comment je veux que tu répondes aux emails », ou « Voici comment je veux que tu écrives un article SEO », ou « Voici la charte graphique de mon site ». Claude Code lit ce fichier **au début de chaque session** quand tu en as besoin, et il applique. Tu n'as plus à répéter.

### Ce qui se passe sous le capot, rapidement

Tu as un dossier sur ton ordinateur, typiquement `~/.claude/skills/nom-de-ta-skill/`. Dedans, un fichier `SKILL.md` et éventuellement des scripts associés. Claude Code connaît ce dossier. Quand tu lances une conversation, il voit la liste de tes skills et peut décider lui-même laquelle activer selon ce que tu lui demandes.

Tu n'as **pas besoin de comprendre les scripts**. Le fichier `SKILL.md` est du texte en français qui décrit ce que la skill fait. Un non-dev peut en créer une. Je te montre plus bas.

<!-- section k-orange -->

## Les 4 skills que j'utilise tous les jours

Sur les 26 skills installés chez moi, 4 tournent en permanence. Les autres dorment en attendant leur moment.

<div class="usecase">
  <div class="usecase-label">Skill 01 · content-quality-auditor</div>
  <h4>Noter mes articles sur 80 critères SEO + IA</h4>
  <p>Quand je finis un article, je demande à Claude : « Audite cet article contre CORE-EEAT ». Le skill se déclenche, il scanne le HTML, il me sort un rapport avec <strong>un score sur 100 réparti sur 8 dimensions</strong> (clarté contextuelle, organisation, preuves, exclusivité, expérience, expertise, autorité, confiance).</p>
  <p>Temps d'audit : <strong>2 minutes</strong>. Temps que ça me prendrait à la main : au moins une heure. Et je raterais des points que le skill voit du premier coup.</p>
  <p>Mon dernier audit a fait passer un article de 78 à 87 sur 100 grâce à <strong>2 quick wins</strong> identifiés par le skill : ajouter les URL des sources et rendre les statistiques plus spécifiques.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Skill 02 · geo-content-optimizer</div>
  <h4>Rendre mes articles citables par les IA</h4>
  <p>Un article qui se classe sur Google n'est pas forcément cité par ChatGPT ou Perplexity. Ce skill analyse le texte, me dit si les phrases sont <strong>« quotables »</strong> pour un LLM, et m'aide à reformuler les passages flous. C'est la moitié du jeu SEO en 2026.</p>
  <p>Quand je l'ai lancé sur mon article <a href="../articles/agents-ia-guide.html">sur les agents IA</a>, il m'a fait passer de 75 à 92 sur les critères GEO (Generative Engine Optimization).</p>
</div>

<div class="usecase">
  <div class="usecase-label">Skill 03 · content-production</div>
  <h4>Écrire en respectant le ton Leo sans lui rappeler à chaque fois</h4>
  <p>Tu as vu dans <a href="../articles/loops-claude.html">mes autres articles</a> que j'ai un ton très précis (1ère personne, pas de familier, phrases courtes). Avant ce skill, je passais 5 minutes à chaque session à <strong>rappeler les règles à Claude</strong>.</p>
  <p>Maintenant, le skill contient la liste de <strong>tous les mots bannis</strong> (« kif », « taf », « je te file »), les règles de phrasé (12 mots max en moyenne, une idée par phrase), et les interdits (pas de « dev fullstack », pas de pitch commercial). Je lance une rédaction, j'obtiens du texte dans mon ton sans négocier.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Skill 04 · deep-research</div>
  <h4>Creuser un sujet avant d'écrire</h4>
  <p>Quand je démarre un article, je ne veux pas que Claude résume ce qu'il sait déjà. Je veux qu'il aille <strong>chercher les sources récentes, croise les angles, me sorte les chiffres précis</strong>.</p>
  <p>Ce skill enclenche un comportement « je cherche avant de répondre ». Résultat : mes articles contiennent 5 à 10 sources nommées (Simon Willison, Anthropic, études précises) au lieu de généralités.</p>
</div>

<!-- section k-teal -->

## Créer ta première skill en 20 minutes

Je te montre le process que j'ai utilisé pour ma skill `social-poster` (celle qui décline mes articles en posts LinkedIn et X).

### Étape 1 · Identifie une tâche répétitive

Pose-toi cette question : **qu'est-ce que je demande à Claude au moins une fois par semaine, avec les mêmes règles à chaque fois ?**

Pour moi : « décline cet article en 2 posts sociaux, en respectant mon ton ». Je le faisais une fois par semaine, manuellement. Parfait candidat pour une skill.

### Étape 2 · Écris le cahier des charges en français

Tu ouvres un fichier texte. Tu écris ce que tu attends, comme si tu briefais un stagiaire. Trois paragraphes maximum.

<div class="callout tip">
  <h4>Structure simple qui marche</h4>
  <p>(1) <strong>Quand déclencher</strong> · « Quand Jérémy demande de décliner un article, ». (2) <strong>Ce que tu lis</strong> · « Lis l'article dans <code>articles/</code>. » (3) <strong>Ce que tu produis</strong> · « Écris deux fichiers : <code>social-drafts/[slug]/linkedin.md</code> et <code>social-drafts/[slug]/twitter.md</code>. »</p>
</div>

### Étape 3 · Ajoute tes règles de style

C'est ici que ça devient puissant. Tu listes tout ce que tu veux et surtout **tout ce que tu ne veux pas**. Pour mes skills de rédaction, ma liste des mots bannis fait 40 lignes. Je ne prendrais jamais le temps de la redonner à chaque conversation.

### Étape 4 · Place le fichier au bon endroit

Tu mets ce fichier dans un dossier. Sur Mac : `~/.claude/skills/ma-skill/SKILL.md`. Tu lances Claude Code, tu tapes « utilise la skill ma-skill », il la lit, il l'applique. La première fois, c'est magique. La dixième, c'est devenu ton standard.

<!-- section k-fuchsia -->

## Les 3 pièges que j'ai rencontrés

### Piège 1 · Vouloir qu'une skill fasse tout

Ma première skill faisait 15 choses. Claude se perdait, le résultat était moyen. J'ai découpé en **4 skills focalisées**, chacune avec un seul rôle clair. Chaque skill est meilleure, Claude choisit la bonne selon le contexte.

### Piège 2 · Écrire trop technique

Je pensais qu'il fallait parler « prompt engineering » dans le `SKILL.md`. Faux. Plus tu écris comme tu parlerais à un collègue humain, plus la skill marche. **« Voici comment je veux que tu réponses à Jérémy »** est meilleur que `## SYSTEM ROLE: Follow the prompt engineering framework defined in...`

### Piège 3 · Ne pas mettre à jour la skill

Au début, mes skills dormaient après leur création. Dès que je remarquais un nouveau comportement gênant de Claude, je n'ajoutais pas la règle dans la skill, je rappelais Claude à la session suivante. **Résultat** : je perdais mes propres apprentissages. Maintenant, dès que je corrige Claude deux fois sur le même point, j'ouvre la skill et j'ajoute la règle.

<div class="callout ok">
  <h4>Ma check-list avant de créer une skill</h4>
  <p>(1) Je fais cette tâche au moins une fois par semaine. (2) Je peux lister mes règles en 10-20 lignes sans être technique. (3) Je suis capable de juger si le résultat est bon sans être dev. → Si OK aux 3, je crée.</p>
</div>

<!-- section k-teal -->

## Pour aller plus loin

Si tu veux continuer à creuser les Skills :

1. **[La vidéo de Melvynx](https://www.youtube.com/watch?v=RamZTmlqXCc)** — 10 minutes, explication claire avec métaphores, je te la recommande en complément
2. **[Mon pack de 26 skills](../downloads/jeremy-claude-pack.zip)** — 690 Ko, avec mes skills perso et 25 skills tiers que j'utilise vraiment. Décompresse dans `~/.claude/skills/`, tu as ma config
3. **[Mes loops Claude Code](../articles/loops-claude.html)** — pour comprendre comment Claude décide quelle skill activer dans quelle situation

Si tu crées ta première skill cette semaine et qu'elle te sort un résultat qui t'étonne, **réponds à la newsletter et raconte-moi**. Je lis tout. Les retours terrain valent mille fois les articles génériques — y compris celui que tu viens de lire.
