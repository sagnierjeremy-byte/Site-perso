---
slug: superpowers-claude-code
titre: "Superpowers · ce que ce plugin change vraiment dans Claude Code"
titre_seo: "Superpowers Claude Code · guide complet — Jérémy Sagnier"
description: "Superpowers est un plugin qui force Claude à réfléchir avant de coder : brainstorm socratique, plan d'implémentation, TDD, revue. Je te montre à quoi ça sert, ce que ça change, et quand tu ne devrais pas l'utiliser."
numero: "09"
categorie: "Outils"
hero_ligne_1: "Superpowers."
hero_ligne_2: "Le plugin qui force"
hero_ligne_3: "Claude à réfléchir."
lead: "Superpowers est le plugin Claude Code le plus installé du marketplace officiel (163 000 stars GitHub, 4e position chez Anthropic). Créé par Jesse Vincent, il impose une méthodologie : Claude ne code plus avant d'avoir brainstormé, planifié, testé. Je viens de l'installer. Voici ce que j'en ai compris après lecture de la doc et des retours d'utilisateurs avancés : à quoi ça sert, ce que ça change vraiment, et quand il vaut mieux le désactiver."
duree: "13 min"
niveau: "Débutant"
outils: "Claude Code · Superpowers"
published: "2026-04-24"
tldr:
  - "Superpowers oblige Claude à <strong>brainstormer, écrire un plan, tester avant de coder</strong>. Fini les 400 lignes pondues à la volée · tu valides chaque étape."
  - "14 skills qui se déclenchent automatiquement selon le contexte. Les 3 commandes slash (<code>/brainstorm</code>, <code>/write-plan</code>, <code>/execute-plan</code>) sont <strong>dépréciées</strong>, le plugin utilise maintenant un système de skills plus flexible."
  - "Verdict honnête : parfait pour les vrais projets, <strong>overkill sur les petites tâches</strong>. Tu le désactives en une commande quand tu veux juste bricoler. Écrit avec Claude, relu par moi."
---

<!-- section k-fuchsia -->

## Avant de commencer

Si tu utilises Claude Code depuis quelques semaines, tu connais cette scène : tu demandes quelque chose de simple, Claude te pond 400 lignes avec 10 options que tu n'as pas demandées, tu passes 30 minutes à nettoyer. Ce n'est pas la faute de Claude. C'est la faute du format *« écris-moi du code »* qui invite au chaos.

Jesse Vincent, un ex-ingénieur d'Anthropic, a créé **Superpowers** pour régler ça. Le plugin force une discipline : **Claude doit comprendre ce que tu veux, valider le design, écrire un plan, puis exécuter avec des tests · dans cet ordre**. Sorti en octobre 2025, Superpowers a grimpé à **163 000 étoiles GitHub en six mois** et est le **4e plugin le plus installé** du marketplace officiel Anthropic. Simon Willison le décrit comme *« un morceau significatif en soi »*. Evan Schwartz dit *« je ne peux pas le recommander assez »*.

Mais il y a aussi des utilisateurs qui râlent : *« Depuis que j'ai installé Superpowers, changer un bout de CSS prend des plombes »* (rodskagg sur Threads). Du overhead injustifié sur les petites tâches. Honnêteté oblige, je commence par ça.

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Superpowers, c'est la ceinture de sécurité de Claude Code. Indispensable quand tu lances un projet sérieux. Insupportable si tu veux juste bricoler. La bonne posture : installe, apprends à activer/désactiver à la demande. Tu auras le meilleur des deux mondes.</p>
</div>

<!-- section k-teal -->

## Le concept · Claude devient discipliné

Superpowers n'ajoute pas de fonctionnalité. Il **change le comportement** de Claude Code, en lui donnant des skills qui s'activent automatiquement selon le contexte.

### Les trois piliers de la méthode

**1. Brainstorming socratique**

Au lieu de coder immédiatement, Claude te pose des questions. *« C'est pour quel usage exactement ? Besoin de RGPD ? Envoi immédiat ou différé ? »* Tu réponds, il reformule sa compréhension, tu valides. Puis seulement il propose un design. Tu signes le design avant qu'une ligne de code existe. Fini les malentendus à rallonge.

**2. Test-Driven Development (TDD)**

Claude écrit d'abord **un test qui échoue**, puis le code qui le fait passer, puis il refactorise. C'est contre-intuitif, mais ça garantit deux choses : le test vérifie vraiment ce que tu voulais, et le code fait exactement ce qu'il faut. Zéro exception · pas de *« je testerai plus tard »*.

**3. Subagent-Driven Development**

Sur les gros projets, Claude découpe le travail en tâches indépendantes et lance **plusieurs sous-agents en parallèle**. Chacun fait sa tâche isolée, un autre agent relit et valide, un troisième audite la qualité. C'est comme avoir 3 juniors vérifiés par un senior · mais automatique.

<div class="callout ok">
  <h4>Ce qui change concrètement dans ta journée</h4>
  <p><strong>Avant</strong> : « Fais-moi X » → Claude pond du code → tu découvres que ce n'était pas exactement ça → reprise.</p>
  <p><strong>Avec Superpowers</strong> : « Fais-moi X » → Claude t'interroge 3 minutes → propose un design → tu valides → plan écrit → exécution testée à chaque étape → audit final. Plus long au démarrage, 10× plus rapide au total.</p>
</div>

<!-- section k-orange -->

## Les 14 skills en clair (regroupés par fonction)

Le plugin active 14 skills qui se déclenchent automatiquement. Je les ai regroupés en 4 familles pour que tu voies à quoi ça correspond vraiment.

<div class="usecase">
  <div class="usecase-label">Famille 01 · Comprendre avant d'agir</div>
  <h4>4 skills qui forcent la clarification</h4>
  <p><strong><code>brainstorming</code></strong> · Claude te pose des questions, reformule, valide le design avant toute ligne de code.</p>
  <p><strong><code>writing-plans</code></strong> · Transforme le design validé en plan d'implémentation détaillé · une tâche par 2-5 minutes, avec le code exact à écrire.</p>
  <p><strong><code>writing-skills</code></strong> · T'aide à documenter une procédure récurrente pour que Claude la réutilise dans les futures sessions.</p>
  <p><strong><code>using-superpowers</code></strong> · Le mode d'emploi du plugin · Claude le lit au début pour savoir quand invoquer les autres skills.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Famille 02 · Exécuter proprement</div>
  <h4>5 skills pour dérouler sans chaos</h4>
  <p><strong><code>executing-plans</code></strong> · Claude lit un plan existant, le critique, puis l'exécute tâche par tâche avec checkpoints.</p>
  <p><strong><code>subagent-driven-development</code></strong> · Le cœur · chaque tâche reçoit un sous-agent dédié, un autre la vérifie, un troisième l'audite.</p>
  <p><strong><code>dispatching-parallel-agents</code></strong> · Quand tu as 3+ problèmes indépendants, Claude lance 3 agents en parallèle au lieu de résoudre séquentiellement.</p>
  <p><strong><code>test-driven-development</code></strong> · Impose le cycle rouge → vert → refactor · zéro code sans test qui échoue d'abord.</p>
  <p><strong><code>using-git-worktrees</code></strong> · Crée une branche isolée (worktree) avant de commencer, garde ton répertoire principal propre.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Famille 03 · Déboguer avec méthode</div>
  <h4>2 skills anti-panique</h4>
  <p><strong><code>systematic-debugging</code></strong> · Quatre phases obligatoires · (1) investigation de root cause, (2) pattern, (3) hypothèse + test, (4) fix. Interdit les *« je tente un truc »* qui créent plus de problèmes.</p>
  <p><strong><code>verification-before-completion</code></strong> · Avant de dire *« c'est fini »*, Claude doit **exécuter** la commande qui prouve le résultat et lire la sortie. Plus de *« devrait passer »* · des logs, des preuves.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Famille 04 · Finir en beauté</div>
  <h4>3 skills pour ne rien laisser traîner</h4>
  <p><strong><code>requesting-code-review</code></strong> · Claude lance un agent reviewer en isolation · il compare le code au plan, cherche bugs et anti-patterns, range par criticité.</p>
  <p><strong><code>receiving-code-review</code></strong> · Quand Claude reçoit un avis de review (humain ou agent), ce skill l'aide à évaluer techniquement avant d'appliquer aveuglément.</p>
  <p><strong><code>finishing-a-development-branch</code></strong> · Vérifie tests verts, propose 4 options · merger, PR, garder pour plus tard, jeter. Nettoie les fichiers temporaires.</p>
</div>

<!-- section k-fuchsia -->

## Les 3 cas où Superpowers m'a vraiment servi

Je n'ai Superpowers que depuis quelques jours. Voici 3 scénarios concrets où je l'activerai la semaine prochaine.

### Cas 1 · Le nouveau module admin

Mon back-office a déjà 13 modules. J'en ajoute un tous les 2 jours. Sans Superpowers, Claude démarre et code directement une ébauche, je corrige après. **Avec Superpowers**, il me demande d'abord *« ce module va lire quoi ? écrire où ? il remplace quelque chose ou c'est nouveau ? il a besoin d'un endpoint API ? »*. 5 minutes de questions, 0 de correction ensuite.

### Cas 2 · Le script qui casse

Mon script de brainstorm a planté une fois, impossible de retrouver pourquoi. Claude a essayé 4 fixes différents qui marchaient pas. **Avec `systematic-debugging`**, il aurait été forcé d'investiguer root cause avant de tenter quoi que ce soit. J'aurais gagné 30 minutes.

### Cas 3 · La grosse feature qui touche 8 fichiers

Quand j'ai monté le système de clusters éditoriaux, 8 fichiers ont bougé. Claude a écrit les 8 en 10 minutes, j'ai découvert 2 bugs le lendemain. **Avec `subagent-driven-development`**, chaque fichier aurait été écrit par un sous-agent + vérifié par un reviewer. Les 2 bugs auraient été attrapés avant que je les voie.

<!-- section k-fuchsia -->

## Ce qui pose vraiment problème (honnêteté)

Je ne te vends pas du rêve. Les critiques sont réelles.

### Problème 1 · Overkill sur les petites tâches

Un utilisateur sur Threads : *« Depuis Superpowers, changer un bout de CSS prend des plombes. »* Mejba Ahmed, dans un [benchmark sur 12 sessions](https://www.mejba.me/blog/superpowers-plugin-claude-code-review), mesure que **les tâches simples consomment 10-15 % de tokens en plus** avec Superpowers qu'en Claude Code natif. La phase clarification + design est injustifiée quand tu veux juste changer une couleur.

### Problème 2 · Activation automatique trop agressive

Depuis une récente mise à jour, le plugin s'auto-invoque sur tout. Tu voulais juste faire une modif rapide, Claude te lance une session brainstorming de 5 minutes. Frustrant. La solution · tu désactives à la demande avec `claude plugin disable superpowers` et tu réactives quand tu en as besoin.

### Problème 3 · Sous-agents qui oublient le contexte

Des utilisateurs rapportent ([issue #237 du repo](https://github.com/obra/superpowers/issues/237)) que les sous-agents ne reçoivent pas toujours le skill `using-superpowers` en profondeur d'arborescence, ce qui casse la discipline attendue. Bug actif, probablement corrigé dans une version future.

<div class="callout warn">
  <h4>Ma règle de désactivation</h4>
  <p>Quand je veux juste bricoler (changer un texte, tester un bout de code, ajuster une couleur) · <code>claude plugin disable superpowers</code>. Quand je lance un vrai projet ou quand je débogue un truc complexe · <code>claude plugin enable superpowers</code>. 10 secondes de gestion, mais le plugin joue son rôle uniquement quand c'est pertinent.</p>
</div>

<!-- section k-teal -->

## Installation · 30 secondes chrono

### Étape 1 · Vérifier Claude Code

Ouvre ton terminal, tape `claude --version`. Si ça répond avec un numéro, tu es prêt. Sinon, va d'abord lire [mon guide Claude Code](claude-code.html).

### Étape 2 · Installer

```bash
claude plugin install superpowers
```

Une seule commande. Installation en quelques secondes depuis le marketplace officiel Anthropic.

### Étape 3 · Redémarrer Claude Code

Ferme ta session Claude Code et rouvre. Les skills se chargent au démarrage.

### Étape 4 · Tester

Ouvre n'importe quel projet et dis à Claude *« j'ai une idée d'amélioration, utilise superpowers pour m'aider à la clarifier »*. Il devrait enclencher le skill `brainstorming` et te poser des questions. Si tu vois ça, c'est installé.

<div class="callout ok">
  <h4>Mon setup complet</h4>
  <p>Je te recommande Superpowers <strong>avec les 5 autres plugins</strong> que j'utilise (<code>context7</code> pour les docs à jour, <code>claude-md-management</code> pour nettoyer ton CLAUDE.md, etc.). Tout est décrit dans <a href="claude-code.html#plugins">ma section plugins officiels</a>. Les 6 s'installent en une commande chacun, ou en bloc avec mon <a href="downloads/install-plugins.sh">script bash</a>.</p>
</div>

<!-- section k-teal -->

## Pour aller plus loin

Superpowers est un gros morceau · voici ce que je te recommande pour creuser :

1. **[Le billet fondateur de Jesse Vincent](https://blog.fsck.com/2025/10/09/superpowers/)** · comprendre la philosophie par l'auteur lui-même. En anglais mais ça se lit très bien.
2. **[Simon Willison sur Superpowers](https://simonwillison.net/2025/Oct/10/superpowers/)** · le référent technique du monde IA-dev donne son avis. Court, précis, honnête.
3. **[Le benchmark de Mejba Ahmed](https://www.mejba.me/blog/superpowers-plugin-claude-code-review)** · 12 sessions réelles mesurées. Plus utile qu'un review marketing.
4. **[Mes 6 plugins officiels](claude-code.html#plugins)** · Superpowers + les 5 autres qui composent ma stack.
5. **[Ma page Outils](outils.html)** · les 6 outils que j'utilise tous les jours, au-delà des plugins.

Si tu installes Superpowers cette semaine et que tu tombes sur un cas où il t'a vraiment sauvé la mise (ou l'inverse · il t'a frustré), **réponds à ma newsletter et raconte-moi**. Je fais la même chose en permanence · j'apprends des retours terrain. Je peux me tromper sur tes besoins, tes messages me recadrent.
