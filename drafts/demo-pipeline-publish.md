---
slug: demo-pipeline-publish
titre: "Comment j'ai monté mon pipeline de publication"
titre_seo: "Pipeline publication MD→HTML — par Jérémy Sagnier"
description: "J'ai monté un pipeline qui convertit mes drafts markdown en articles HTML publiés. Voici comment, et pourquoi ça m'a libéré 3h par article."
numero: "99"
categorie: "Démo"
hero_ligne_1: "J'écris en markdown."
hero_ligne_2: "Un script"
hero_ligne_3: "publie pour moi."
lead: "Avant, publier un article sur mon site me prenait 3 heures de copier-coller HTML. Maintenant, j'écris un fichier markdown avec Claude Code, je lance une commande, l'article est en ligne. Voilà le pipeline complet."
duree: "5 min"
niveau: "Débutant"
outils: "Claude Code · Node.js"
published: "2026-04-21"
tldr:
  - "Un dossier <strong>drafts/</strong> pour les articles en cours de rédaction en markdown"
  - "Un script <strong>publish.js</strong> qui convertit MD → HTML en respectant le template"
  - "Déploiement auto via <strong>Vercel</strong> dès qu'on push le commit"
---

<!-- section k-fuchsia -->

## Avant de commencer

Tu te dis peut-être que publier un article sur son site, c'est simple. En théorie, oui. **En pratique, ça vire vite à la corvée** : copier-coller le template HTML, remplacer 15 placeholders, vérifier que rien ne casse, mettre à jour le sitemap, ajouter le lien dans le parcours d'apprentissage...

Bref, 3 heures pour un article de 7 minutes de lecture. J'ai décidé de craquer là-dessus.

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Tu perds plus de temps à déployer qu'à écrire ? C'est le signe qu'il te faut un pipeline. Quelques lignes de Node suffisent — pas besoin de monter une usine.</p>
</div>

<!-- section k-teal -->

## Le concept

Le pipeline fait une chose simple : **tu écris en markdown, il génère l'HTML**. Comme un static site generator artisanal, mais pour mon site spécifiquement, avec mon template et ma charte.

Les 3 pièces :

1. Un dossier `drafts/` où je dépose mes articles en `.md`
2. Un template HTML (`articles/_TEMPLATE.html`) qui fixe la mise en page
3. Un script `publish.js` qui fait la conversion

Quand je lance `npm run publish mon-article`, il lit le draft, injecte dans le template, écrit dans `articles/mon-article.html`, met à jour le `sitemap.xml`. Je relis le résultat, je commit, Vercel redéploie tout seul.

<!-- section k-orange -->

## Ce que ça change concrètement

<div class="usecase">
  <div class="usecase-label">Cas 01 · Écrire avec Claude Code</div>
  <h4>Claude me fait le premier jet, je retravaille</h4>
  <p>J'ouvre Claude Code, je lui dis "écris un article sur X en suivant AGENT_BRIEF.md". Il me sort un <strong>draft markdown complet</strong> avec frontmatter, structure, callouts. Je relis, j'édite les passages qui sonnent faux, je valide.</p>
  <p>Temps passé à écrire : <strong>45 minutes</strong> (vs 2h avant). Qualité : identique, parfois meilleure parce que Claude me propose des angles auxquels je n'aurais pas pensé.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 02 · Publier en une commande</div>
  <h4>Un script, trois effets</h4>
  <p>Je lance <code>npm run publish demo-pipeline-publish</code>. Le script :</p>
  <pre>✓ articles/demo-pipeline-publish.html généré
✓ sitemap.xml — nouvelle entrée ajoutée
• parcours_etape non défini → apprendre.html non modifié</pre>
  <p>Je vérifie visuellement que tout est propre. J'ouvre le HTML en local, je scroll. Si c'est OK, je commit et je push.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Cas 03 · Déploiement Vercel auto</div>
  <h4>Git push, Vercel déploie</h4>
  <p>Vercel est branché sur mon repo GitHub. Dès qu'un commit arrive sur <code>main</code>, il détecte les fichiers modifiés et redéploie le site. <strong>Temps moyen</strong> : 30-45 secondes.</p>
  <p>Aucune config à gérer, aucune CI custom à maintenir. C'est la magie des sites statiques : on publie, ça marche.</p>
</div>

<!-- section k-fuchsia -->

## Les pièges que j'ai rencontrés

### Piège 1 · Vouloir tout parser tout de suite

Mon premier réflexe a été de supporter 100% de la syntaxe markdown + 50 composants custom. Résultat : 800 lignes de script pour une utilité marginale. **Je suis revenu en arrière** : marked + gray-matter + quelques regex suffisent pour 95% des cas. Le reste, j'injecte du HTML brut dans mon markdown.

### Piège 2 · Oublier les métadonnées

Au début, je publiais sans mettre à jour `sitemap.xml` ni la carte `apprendre.html`. Google finit par indexer, mais ça traîne. Le script fait ces MAJ automatiquement maintenant — un piège de moins.

### Piège 3 · Le cache Vercel

Une fois, j'ai commit un article avec un typo dans la meta description. Corrigé, pushé à nouveau, mais l'Open Graph continuait à montrer la vieille version sur LinkedIn. **Leçon** : Vercel met un temps à invalider les previews OG. Prévoir une relecture sérieuse avant le premier push.

<div class="callout ok">
  <h4>Ma check-list avant publish</h4>
  <p>(1) Le frontmatter est complet. (2) J'ai relu le MD à voix haute (test ton Leo). (3) Les liens internes pointent vers des articles qui existent. → Si OK aux 3, <strong>npm run publish</strong>.</p>
</div>

<!-- section k-teal -->

## Pour aller plus loin

Ce pipeline est la Phase 1 de mon plan agent IA. Ce qui arrive ensuite :

1. **Phase 2 · GitHub Actions** — un agent qui ouvre une PR avec un draft dès que je crée une issue "idée article : X". Je relis, je merge.
2. **Phase 3 · Editorial Mesh** — plusieurs agents spécialisés (Scout, Writer, Editor) qui tournent en parallèle. Pas avant 50 articles validés.

Si tu veux voir comment évolue cette stack, **réponds à la newsletter** — je publierai les retours d'XP dès qu'il y a quelque chose à raconter.
