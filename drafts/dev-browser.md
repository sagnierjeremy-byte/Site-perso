---
slug: dev-browser
titre: "Dev-browser · un navigateur piloté par ton IA"
titre_seo: "Dev-browser · navigateur piloté par l'IA — Jérémy Sagnier"
description: "Dev-browser est un navigateur que ton IA peut piloter en écrivant un petit script. Cliquer, lire, screenshoter, tester. Voilà ce que j'en fais chaque jour."
numero: "08"
categorie: "Outils"
hero_ligne_1: "Un navigateur"
hero_ligne_2: "piloté"
hero_ligne_3: "par ton IA."
lead: "Dev-browser, c'est le chaînon manquant entre Claude et le web. Tu demandes à ton IA de regarder une page, de remplir un formulaire, de prendre un screenshot, de comparer deux sites. Pas de clic humain. Juste un petit script que Claude écrit pour toi. Je l'utilise tous les jours pour scraper, tester mes pages, vérifier des sources. Voici comment ça marche, comment l'installer, et pourquoi c'est devenu indispensable."
duree: "11 min"
niveau: "Débutant"
outils: "Claude Code · dev-browser"
published: "2026-04-23"
tldr:
  - "Dev-browser est un <strong>navigateur sans fenêtre</strong> que ton IA pilote en JavaScript. Tu dis ce que tu veux, elle écrit le script, elle exécute, elle te renvoie le résultat."
  - "3 cas d'usage quotidiens : <strong>scraper une page, tester une page en local, prendre un screenshot</strong>. Et tu n'écris jamais de code toi-même — Claude le fait."
  - "Installation : 1 ligne dans ton terminal. Configuration : zéro. Usage : tu dis à Claude « ouvre cette page et dis-moi ce que tu vois ». Écrit avec Claude, relu par moi."
---

<!-- section k-fuchsia -->

## Avant de commencer

Tu as déjà essayé de demander à ChatGPT ou Claude d'aller lire une page web ? Tu connais la frustration. Parfois il y arrive, parfois il te dit « Désolé, je ne peux pas accéder à cette URL ». Ou pire : il hallucine un contenu qu'il n'a jamais vu.

Dev-browser règle ce problème. C'est un **navigateur sans fenêtre** que ton IA pilote en écrivant un petit script. Tu n'ouvres jamais Chrome toi-même. Tu dis ce que tu veux, Claude écrit le script, il s'exécute, tu récupères ce qui t'intéresse.

Je l'ai installé sur mon Mac il y a deux mois. Aujourd'hui, je l'utilise presque tous les jours : vérifier qu'une page est bien déployée, scraper un site que Claude ne connaît pas, prendre un screenshot pour valider un design, tester le formulaire d'inscription de mon site sans ouvrir Chrome à la main.

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Si tu utilises Claude Code tous les jours et que tu touches à du web (un site, des sources à vérifier, un scraping ponctuel), dev-browser doit être installé chez toi. Il rend ton IA vraiment utile pour les tâches qui touchent à Internet. Trois minutes d'install, retour sur investissement en dix minutes.</p>
</div>

<!-- section k-teal -->

## Le concept · un navigateur que tu ne vois pas

### Le vrai problème résolu

Claude connaît énormément de pages grâce à son entraînement. Mais deux limites :

1. Il ne connaît **pas les pages récentes** (créées après son cutoff).
2. Il ne peut **pas interagir** avec une page : cliquer, remplir, attendre qu'un script JS se lance, faire défiler.

Dev-browser corrige les deux. Il ouvre vraiment un navigateur (Chromium en coulisse, comme Chrome sans les pubs) sans fenêtre graphique. Claude y envoie des ordres en JavaScript : « va sur cette page, attends 3 secondes, récupère le texte du h1, clique sur ce bouton ».

### Comment ça marche concrètement

Tu tapes dans ton terminal quelque chose comme ceci :

```bash
dev-browser --headless <<'EOF'
  const page = await browser.getPage("main");
  await page.goto("https://jerwis.fr");
  const titre = await page.evaluate(() => document.querySelector("h1").innerText);
  console.log(titre);
EOF
```

Un navigateur s'ouvre en arrière-plan, charge ma page, récupère le titre, l'affiche dans ton terminal. Fin. Pas de fenêtre qui apparaît sur ton écran.

**Ce que tu ne fais pas toi-même** : écrire ce script. Tu dis à Claude « va sur jerwis.fr et dis-moi le titre ». Claude comprend, écrit le script dev-browser, l'exécute, te renvoie le résultat dans la conversation.

<div class="callout ok">
  <h4>La règle d'or que j'applique</h4>
  <p>Tu ne tapes jamais un script dev-browser toi-même. Tu demandes ce que tu veux en français à Claude. Claude fait le script. Tu restes à 100 % dans ton rôle d'entrepreneur qui demande, jamais de développeur qui code.</p>
</div>

<!-- section k-orange -->

## 4 cas où dev-browser change ma journée

<div class="usecase">
  <div class="usecase-label">Cas 01 · Vérifier qu'un déploiement a marché</div>
  <h4>Sans ouvrir Chrome, sans copier-coller</h4>
  <p>Je commit une modification de mon site, je push, Vercel déploie. Avant dev-browser, je devais ouvrir Chrome, aller sur jerwis.fr, chercher l'élément qui a changé. <strong>Maintenant, je dis à Claude</strong> : « vérifie que la page /lexique.html affiche bien 8 entrées et pas 7 ». Il lance dev-browser, compte, me répond en 5 secondes.</p>
  <p><strong>Gain mesuré :</strong> je gagne 30 secondes par déploiement. Sur une journée où je push 10 fois, 5 minutes. Pas révolutionnaire à l'unité, énorme au cumul.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 02 · Scraper une source pour un article</div>
  <h4>Récupérer un tableau, une date, une citation</h4>
  <p>J'écris un article, j'ai besoin d'un chiffre précis qui figure sur le site d'une étude. Claude n'a pas ce chiffre dans son entraînement. <strong>Je lui dis</strong> : « va sur cette URL, trouve le chiffre de latence moyenne de GPT-5, cite-le-moi ». Il lance dev-browser, extrait, me renvoie le chiffre + la source.</p>
  <p>Pareil pour les citations. Dernière fois, j'avais besoin d'une phrase exacte de Simon Willison dans un billet. Claude a scrapé son site, trouvé le paragraphe, copié au mot près. <strong>10 secondes.</strong></p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 03 · Tester un formulaire en local</div>
  <h4>Avant de déployer, je valide que le flux marche</h4>
  <p>Mon site a un formulaire d'inscription newsletter. Je le modifie, je lance mon serveur local sur <code>localhost:8088</code>. <strong>Je dis à Claude</strong> : « remplis le formulaire avec <code>test@example.com</code>, clique submit, dis-moi si le message de succès s'affiche bien ». Il lance dev-browser, fait le test, rapporte.</p>
  <p><strong>Pourquoi c'est génial :</strong> avant, je testais à la main, j'oubliais parfois des cas, je créais des emails de test dans ma base par accident. Maintenant Claude teste méthodiquement, capture les bugs, ne pollue rien.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 04 · Prendre un screenshot pour valider un design</div>
  <h4>Claude voit ma page comme je la verrais</h4>
  <p>Je retouche une section. <strong>Je demande</strong> : « prends un screenshot de la section Freebies de ma home, regarde si les 4 cartes sont alignées ». Claude lance dev-browser, capture l'image, me la montre dans la conversation. Je vois immédiatement si un élément déborde ou si un espacement est raté.</p>
  <p>J'utilise ça <strong>à chaque grosse refonte UI</strong>. Claude voit la page, me décrit ce qu'il voit, je valide ou je corrige sans ouvrir de navigateur.</p>
</div>

<!-- section k-teal -->

## Installation · 3 minutes chrono

### Pré-requis

- **Mac** ou Linux (Windows Subsystem for Linux fonctionne aussi)
- **Node.js** déjà installé (vérifie avec <code>node --version</code> · si ça affiche un chiffre, c'est bon)
- **Claude Code Max** (ou au moins Claude Code gratuit)

### Étape 1 · Installer

Ouvre ton terminal. Colle la commande que Claude te donnera quand tu lui demanderas *« installe dev-browser pour moi »*. Ça se fait généralement avec <code>npm install -g @anthropic-ai/dev-browser</code> (ou l'équivalent selon la version du moment · demande à Claude la commande exacte actuelle).

### Étape 2 · Tester

Toujours dans ton terminal, tape :

```bash
dev-browser --help
```

Si tu vois une liste d'options qui défile, c'est installé. Sinon, relance ton terminal ou demande à Claude de t'aider à débugger.

### Étape 3 · Premier usage

Ouvre Claude Code dans un dossier, n'importe lequel, et dis-lui :

> « Utilise dev-browser pour aller sur jerwis.fr et me donner le titre de la page »

Claude va écrire un petit script, le lancer, et te renvoyer *« Suis l'IA. Sans être dev. Sans y passer tes soirées. »* (mon H1 actuel). Si ça marche, tu es équipé. Sinon, Claude t'aidera à corriger.

<div class="callout warn">
  <h4>Le piège classique que j'ai eu</h4>
  <p>La première fois que j'ai lancé dev-browser, une fenêtre Chrome s'est ouverte sur mon écran et m'a fait sursauter. C'est parce que j'avais oublié le flag <code>--headless</code>. Sans ce flag, le navigateur apparaît vraiment. Demande toujours à Claude d'ajouter <code>--headless</code> par défaut. Tu ne verras plus rien, comme il se doit.</p>
</div>

<!-- section k-fuchsia -->

## Les 3 limites que j'ai rencontrées

### Limite 1 · Les sites qui détectent les bots

Certains sites (X/Twitter, LinkedIn connecté, Reddit parfois) détectent les navigateurs automatisés et bloquent. Dev-browser peut se connecter à ton Chrome existant avec le flag <code>--connect</code>, mais c'est plus technique. Pour le grand public, j'accepte simplement que 10 % des sites refusent · je passe à autre chose.

### Limite 2 · Les pages très lourdes en JavaScript

Certaines pages mettent 5-10 secondes à se charger complètement. Par défaut, dev-browser attend 2 secondes. Si Claude ne trouve pas un élément, c'est souvent un souci de timing. La solution : demande à Claude d'ajouter <code>await new Promise(r => setTimeout(r, 5000))</code>. Il saura.

### Limite 3 · Pas une solution si tu veux scraper à grande échelle

Dev-browser est fait pour les tâches ponctuelles · vérifier une page, tester un flux, récupérer une donnée précise. Si tu veux scraper 10 000 pages pour un projet massif, il faut d'autres outils (Apify, Bright Data, ou du code custom). Pour tout le reste, dev-browser suffit.

<div class="callout ok">
  <h4>Ma check-list avant chaque usage</h4>
  <p>(1) Le flag <code>--headless</code> est bien là. (2) Je demande à Claude en français, pas en code. (3) Je valide le résultat qu'il me renvoie avant de le croire sur parole. → Ces 3 réflexes couvrent 95 % de mon usage.</p>
</div>

<!-- section k-teal -->

## Pour aller plus loin

Si tu veux creuser :

1. **[Claude Code · le setup complet](claude-code.html)** — à installer avant dev-browser, évidemment
2. **[Les 6 plugins Claude Code à installer](claude-code.html#plugins)** — la suite logique, avec <code>context7</code> qui complémente bien dev-browser pour les docs officielles
3. **[Ma page Outils](outils.html)** — les 6 outils que j'utilise en complément de Claude Code tous les jours

Si tu installes dev-browser cette semaine et que tu l'utilises pour un vrai cas, **réponds à ma newsletter et raconte-moi**. Ça m'aide à savoir ce qui marche pour les autres. Je lis tout, je réponds, je peux me tromper sur tes besoins — tes retours me recadrent.
