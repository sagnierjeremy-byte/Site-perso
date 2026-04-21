---
slug: claude-code-6-mois-non-dev
titre: "6 mois de Claude Code quand tu n'es pas dev"
titre_seo: "Claude Code après 6 mois · vu par un non-dev — Jérémy Sagnier"
description: "Un dev senior a partagé ses tips Claude Code après 6 mois. Non-dev, je l'utilise chaque jour aussi. Voici ce qui change sans son background."
numero: "06"
categorie: "Retour d'XP"
hero_ligne_1: "6 mois de Claude Code"
hero_ligne_2: "au quotidien."
hero_ligne_3: "Vu par un non-dev."
lead: "Un dev senior a posté ses tips Claude Code après 6 mois d'usage quotidien. J'ai lu, j'ai souri, et j'ai réalisé : moi aussi je l'utilise tous les jours depuis six mois. Sauf que je n'ai jamais écrit une ligne de code avant lui. Je suis entrepreneur. Je n'avais pas ouvert un terminal avant de croiser Claude Code. Voici ce qui change quand tu arrives sans quinze ans de métier derrière toi."
duree: "9 min"
niveau: "Débutant"
outils: "Claude Code"
published: "2026-04-22"
tldr:
  - "Un dev senior a listé ses tips Claude Code : <strong>spec-driven, routines, multi-agents, MCP</strong>. Je n'avais jamais entendu ces mots il y a six mois."
  - "Pourtant j'ai livré mon site, un <strong>back-office admin</strong>, une newsletter automatique, un agent qui cherche mes idées d'articles. Sans savoir coder."
  - "Ce qui change pour un non-dev : tu n'as rien à <strong>désapprendre</strong>. C'est un avantage que les devs senior n'ont pas. Écrit avec Claude, relu par moi."
---

<!-- section k-fuchsia -->

## Avant de commencer

Tu as vu passer sur Reddit ou LinkedIn un post du type « mes conseils Claude Code après six mois d'usage quotidien ». L'auteur est souvent un dev senior. Il parle de spec-driven development, de routines, de multi-agents, de serveurs MCP. Tu lis trois paragraphes, tu comprends un mot sur deux, tu fermes l'onglet.

C'est normal. Ces posts sont écrits pour d'autres devs. Le problème, c'est que **tu peux lire ça et te dire : ce n'est pas pour moi, je ne suis pas du métier.**

Je suis passé par là. Il y a six mois, je ne connaissais aucun de ces mots. Aujourd'hui, je lance Claude Code tous les jours pour faire tourner mon business. Et j'ai un avis tranché : **Claude Code est plus facile pour un non-dev que pour un dev senior.** Je t'explique pourquoi dans cet article, et je te montre ce que j'ai livré avec, en six mois, sans savoir coder.

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Un dev senior a quinze ans d'habitudes à désapprendre. Toi, tu n'as rien à désapprendre. Tu pars d'une page blanche, tu demandes à Claude Code ce que tu ne sais pas, tu avances. C'est un avantage, pas un handicap.</p>
</div>

<!-- section k-teal -->

## Deux façons d'arriver à Claude Code

Il y a deux chemins pour utiliser cet outil. Selon ton chemin, tu ne vois pas les mêmes choses.

### Le dev senior

Il vient de son éditeur de code habituel, VS Code, Cursor, Zed. Il a déjà un workflow qui fonctionne. Il a des habitudes de travail installées depuis des années. Il cherche à automatiser ce qu'il fait déjà, gagner en vitesse, industrialiser. Il parle naturellement de *tests*, *linting*, *refactoring*. Il juge la qualité du code que Claude produit.

Claude Code arrive dans sa vie comme un collègue ingénieur. Il l'utilise en pair programming. Il corrige ses suggestions, il désactive ce qui ne marche pas chez lui, il cherche à optimiser chaque seconde.

### L'entrepreneur non-dev

Moi, j'arrive d'ailleurs. Je veux publier un site, envoyer une newsletter, avoir un tableau de bord pour suivre mes idées d'articles. Je ne pars pas d'un éditeur. Je pars d'un besoin.

Je n'ai pas d'avis sur la qualité du code. Je valide le résultat : est-ce que le site est en ligne, est-ce que le formulaire marche, est-ce que l'email arrive. Le reste, je fais confiance à Claude.

Claude Code arrive dans ma vie comme un stagiaire qui sait déjà tout, qui ne demande pas de pause déjeuner et qui ne se plaint jamais.

### Ce qui change entre les deux

Trois points :

1. **Le dev senior sait ce qui est "normal".** Moi non. Donc je demande tout. Je ne fais pas de raccourci mental du type « ah, c'est sûrement une erreur de permissions ». Je copie-colle l'erreur telle quelle à Claude, je laisse l'outil expliquer.
2. **Le dev senior a un ego technique.** Il juge le code. Il veut que ce soit fait « bien ». Moi, je juge le résultat. Si le site marche et que le code est moche, je m'en fiche.
3. **Le dev senior veut maîtriser.** Moi, je veux livrer. Deux buts différents, deux façons de parler à Claude.

<div class="callout warn">
  <h4>Attention, ce n'est pas une attaque aux devs</h4>
  <p>Les devs seniors produisent du code robuste parce qu'ils savent ce qui casse en production. Moi non. Je livre des projets personnels et des outils pour mon business. Si tu construis un SaaS qui sert mille clients, les tips d'un dev senior sont indispensables. Ce que je dis ici vaut pour l'entrepreneur qui veut livrer pour lui-même.</p>
</div>

<!-- section k-orange -->

## Ce que j'ai livré en six mois, sans savoir coder

Voici quatre projets concrets construits avec Claude Code Max en local, sur mon Mac, sans que j'écrive une ligne de code moi-même. Les chiffres sont réels, je les mesure toutes les semaines.

<div class="usecase">
  <div class="usecase-label">Cas 01 · Ce site</div>
  <h4>Mon site perso, en HTML statique sans framework</h4>
  <p>Tu lis cet article sur le site que Claude Code a monté avec moi. HTML pur, CSS pur, JavaScript pur. Pas de React, pas de Next.js. <strong>Huit pages principales</strong>, cinq articles publiés, vingt idées dans mon backlog.</p>
  <p>Je décris ce que je veux dans un fichier <code>CLAUDE.md</code>, j'ouvre Claude Code, je lui demande d'ajouter une section, de changer une couleur, de corriger un bug de navigation. Il le fait. Je relis en ouvrant la page dans un navigateur local. Si c'est bon, je commit et Vercel redéploie tout seul en 30 secondes.</p>
  <p><strong>Temps moyen pour publier un article :</strong> 45 minutes de rédaction, 5 minutes de publication. Avant Claude Code, j'aurais mis trois heures rien qu'à copier-coller du HTML.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 02 · Mon back-office admin</div>
  <h4>Neuf modules pour piloter mon contenu depuis mon navigateur</h4>
  <p>J'ai un back-office local à l'adresse <code>localhost:3001</code>. Neuf modules : tableau de bord, idées d'articles, drafts, articles, newsletter, réseaux sociaux, audits SEO, trafic, système. Chaque module est un dossier de trois fichiers HTML. Pour en rajouter un, je crée un dossier.</p>
  <p>Claude Code a écrit le serveur Node.js, le système de modules, la charte graphique <em>Fiesta</em> entière. J'ai <strong>cliqué « Je veux ça »</strong>, j'ai relu, j'ai validé. Deux semaines d'aller-retour, zéro ligne de code de ma main.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 03 · Mon agent de brainstorm d'idées</div>
  <h4>Un script qui va fouiller Internet pour me proposer 10 sujets d'articles</h4>
  <p>Je clique sur un bouton « Cherche-moi des idées » dans mon back-office. Un script Node.js parcourt Reddit (huit subreddits), Hacker News, GitHub, des flux RSS Anthropic et OpenAI. Il récupère environ <strong>400 propositions brutes</strong>. Il les filtre sur six « clusters éditoriaux » (Claude Code, Agents IA, Opinions tranchées, Outils IA, Entrepreneuriat, Frontier).</p>
  <p>Au final, je reçois une <strong>liste de quinze idées scorées</strong> dans mon interface. Je garde celles qui me parlent, je rejette les autres. Temps de traitement : 10 secondes. Temps que ça m'aurait pris à la main : je ne l'aurais simplement pas fait.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 04 · Mon agent qui décline un article en posts réseaux</div>
  <h4>Un article = deux drafts LinkedIn + X prêts à publier</h4>
  <p>Quand je publie un article, j'ouvre Claude Code avec un prompt contextuel (préparé par un bouton de mon back-office). Claude lit l'article, respecte le ton que j'ai défini dans mes règles Leo, et sort deux drafts sociaux dans le dossier <code>social-drafts/</code>.</p>
  <p>Je relis, j'ajuste deux mots, je copie dans Zernio qui programme la publication. <strong>Total :</strong> 5 minutes. Avant, écrire un post LinkedIn qui me plaisait prenait 45 minutes.</p>
</div>

<!-- section k-fuchsia -->

## Les trois pièges que j'ai rencontrés

Je ne te vends pas un monde rose. Voici trois pièges dans lesquels je suis tombé, qui t'arriveront si tu te lances.

### Piège 1 · Vouloir tout comprendre avant d'agir

Mes trois premières semaines, je lisais la documentation Anthropic, j'essayais de saisir chaque terme avant de lancer une commande. Résultat : j'avançais de 10% par semaine.

**Ce qui m'a débloqué :** j'ai commencé à lancer, casser, poser la question à Claude, recommencer. J'ai progressé cinq fois plus vite en arrêtant de vouloir comprendre avant d'essayer.

### Piège 2 · Oublier que Claude ne voit pas tout

Je croyais que Claude Code « savait tout » sur mon projet dès que je l'ouvrais. Faux. Il lit seulement ce que tu lui donnes à lire, et il ne voit pas le reste de ton ordinateur.

**La solution :** un fichier <code>CLAUDE.md</code> à la racine de chaque projet, qui dit en deux pages : qui je suis, ce que fait le projet, mes règles de style, mes interdits. Claude le lit à chaque session. Mon temps de mise en contexte est passé de 30 minutes à zéro.

### Piège 3 · Prendre les conseils des dev seniors au pied de la lettre

Un post Reddit dit « il faut absolument utiliser des routines et du multi-agent ». Tu l'appliques. Tu perds deux semaines à monter une architecture que tu ne comprends pas, pour un besoin que tu n'as pas.

**Ce que j'ai fini par faire :** je lis les conseils, je note ce qui m'intrigue, je les laisse mûrir. Si je retombe trois fois sur la même technique, c'est qu'elle est importante. Sinon, elle ne sert probablement pas à mon cas.

<div class="callout ok">
  <h4>Ma check-list avant de lancer un projet Claude Code</h4>
  <p>(1) Je rédige un fichier <code>CLAUDE.md</code> de deux pages, même grossier. (2) Je commence par le plus petit morceau livrable (une page, une fonction, un script). (3) Je relis avec mes propres yeux avant d'accepter quoi que ce soit. → Si ces trois choses sont en place, je lance.</p>
</div>

<!-- section k-teal -->

## Ce qui compte vraiment pour un non-dev

Un dev senior te parlera d'optimisation, de couverture de tests, d'architecture propre. Pour un entrepreneur qui veut livrer, trois choses comptent :

1. **Est-ce que ça marche pour toi, aujourd'hui.** Pas « est-ce que ça passera l'échelle à 10 000 utilisateurs ». Tu n'en es pas là.
2. **Est-ce que tu comprends ce que tu mets en production.** Pas « chaque ligne », mais « ce que fait le script globalement ». Si Claude te livre un truc que tu n'oses pas relire, tu t'arrêtes.
3. **Est-ce que tu peux réparer si ça casse.** Demain, un script ne tourne plus. Tu dois pouvoir ouvrir Claude Code, copier l'erreur, récupérer un diagnostic. Si tu dépends d'une complexité que tu n'as jamais comprise, tu es coincé.

Pour moi, ces trois règles valent tous les tips de dev senior du monde. Elles ne t'empêchent pas de lire les tips, bien sûr. Elles te disent juste : **applique-les à ton rythme, et pas parce que quelqu'un d'autre le fait**.

<!-- section k-teal -->

## Pour aller plus loin

Si tu veux continuer sur cette lancée :

1. **[Bien démarrer avec Claude Code](../claude-code.html)** — le point de départ si tu n'as jamais ouvert un terminal
2. **[Les loops Claude Code expliqués](../loops-claude.html)** — la boucle de décision qui fait la puissance de l'outil
3. **[Construire ton premier agent Gmail](../articles/tuto-agent-gmail.html)** — un projet concret pour passer à la pratique

Si tu veux suivre mes retours d'XP concrets au fil des mois, ma veille du vendredi te les envoie directement. Pas de pub, désinscription en un clic.

**Si tu as une question ou un retour sur cet article, réponds à la newsletter.** Ça arrive dans ma boîte et je lis tout, je peux me tromper sur certains points et tes retours m'aident à corriger le tir.
