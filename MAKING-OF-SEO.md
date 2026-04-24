# Making-of — SEO setup de jerwis.fr en une soirée

> Notes brutes pour futur article de blog.
>
> Format inspiré des "Making-of" : récit narratif + anecdotes + chiffres concrets + leçons.
> À transformer en article si/quand ça rentre dans le calendrier éditorial.
>
> **Date** : 24 avril 2026, ~21h–minuit (Paris)
> **Point de départ** : jerwis.fr live depuis 2 jours, invisible sur Google
> **Point d'arrivée** : site indexable, trackable, prêt à recevoir du trafic

---

## TL;DR (pour le lecteur pressé)

En 3 heures de co-pilotage avec Claude Code, j'ai rendu jerwis.fr pleinement trouvable par Google :
- Google Search Console + Bing Webmaster Tools connectés
- Plausible Analytics installé sur 33 pages (pas de bannière RGPD)
- IndexNow configuré (Bing + Yandex notifiés automatiquement à chaque publi)
- 32 URLs dans le sitemap (contre 24 au départ)
- 9 canonicals standardisés pour éviter le duplicate content
- 27 dimensions d'images ajoutées pour Core Web Vitals
- DNS corrigé : `jerwis.fr` en primary (avant : `www.jerwis.fr` + redirect 307 temporaire qui polluait le SEO)

6 commits, 0 downtime, 0 coût d'infra supplémentaire (Plausible à 9€/mois le seul nouveau coût).

Et surtout : **je suis parti de zéro connaissance en SEO**. Je te raconte comment.

---

## Acte 1 — "Google Analytics ou Google Search ?"

Je commence ma session en demandant à Claude : "Explique-moi comment être indexé sur Google et suivre le trafic."

Première leçon : il y a **deux outils différents** que je confondais.

| Outil | À quoi ça sert |
|---|---|
| Google Search Console (GSC) | Dire à Google que le site existe, voir les mots-clés qui ramènent du trafic |
| Google Analytics / Plausible | Voir combien de visiteurs, d'où ils viennent, quelles pages ils lisent |

GSC = côté Google (comment Google te voit).
Analytics = côté visiteur (ce que font les gens sur ton site).

Pas la même chose. Et les deux sont obligatoires si tu veux sérieusement savoir ce qui se passe.

**Anecdote** : je pensais qu'un seul outil ferait les deux jobs. J'avais tort. Ce sont deux paires de lunettes qui regardent dans deux directions opposées.

---

## Acte 2 — La vérif DNS sans toucher au DNS

Étape 1 de GSC : prouver à Google que j'ai bien le contrôle du domaine `jerwis.fr`. Pour ça, il faut ajouter un enregistrement TXT dans la zone DNS.

Google me donne une chaîne du genre :
```
google-site-verification=82DMITsZkEDYO0FwmChYwhru566cANuyQleBMzMUd-c
```

Normalement tu vas dans l'interface de ton registrar (chez moi, Hostinger), tu ajoutes un TXT, tu attends la propagation, tu cliques "Vérifier" dans GSC.

J'avais mieux : Hostinger a une **API DNS publique** sortie en 2024. J'ai créé un token API temporaire (valable 1 jour), donné à Claude, et il a fait :

1. Fetch de la zone DNS actuelle (backup automatique dans `/tmp/`)
2. Ajout du TXT google-site-verification en **préservant** le SPF email (crucial : si tu écrases sans préserver, tes emails ne sortent plus)
3. Vérif de la propagation via `dig` sur les DNS Google et Cloudflare

**Temps total** : 2 min. L'alternative manuelle aurait été 10 min + risque de casser les emails.

**Leçon** : avant d'aller cliquer dans une UI, demande-toi si le service a une API. Beaucoup en ont.

---

## Acte 3 — Le piège du www

En vérifiant que mon site était prêt, Claude détecte un problème.

```bash
curl -I https://jerwis.fr/
# HTTP/2 307 
# location: https://www.jerwis.fr/
```

Traduction : quand tu tapes `jerwis.fr`, Vercel te redirige vers `www.jerwis.fr`. Mais mes balises `canonical` dans le HTML disent toutes `https://jerwis.fr/` (sans www). Et mon sitemap aussi.

**Pourquoi c'est grave** :
- Google crawle `jerwis.fr` → redirigé vers `www.jerwis.fr`
- Mais la page qu'il atteint dit "mon URL canonique est `jerwis.fr` sans www"
- Google est confus : quelle URL indexer ?
- Résultat : le "SEO juice" est dilué entre les 2 versions

Deuxième problème : le redirect est un **307 Temporary**, pas un **308 Permanent**. Pour le SEO, 307 dit à Google "ceci est temporaire, continue d'indexer l'original aussi". 308 dit "fusionne tout sur la cible, j'ai déménagé".

Fix via Vercel Domains (ça j'ai fait à la main, car l'API Vercel avec mon token n'avait pas les permissions). 3 minutes, 4 clics.

**Leçon** : tant que tu ne regardes pas ces détails, ton site fonctionne mais **dilue son potentiel SEO**. Les canonicals doivent pointer vers l'URL réellement servie. Le redirect entre www et non-www doit être 308 (permanent).

---

## Acte 4 — GA4 ou Plausible ?

Question suivante : analytics.

| | GA4 | Plausible |
|---|---|---|
| Prix | Gratuit | 9€/mois |
| RGPD | Bannière cookies obligatoire | Aucune bannière |
| Dashboard | Complexe, overloaded | Lisible en 10 sec |

J'ai choisi Plausible. Pour un blog perso, les 9€/mois pour ne pas imposer une bannière cookies à mes lecteurs, ça vaut le coup. Installation en 2 minutes : un compte, un domaine à ajouter, un snippet à copier-coller.

Sauf que "copier-coller" sur **33 pages HTML**, non merci. Claude a écrit un script Python de 20 lignes qui :
- Liste toutes les pages publiques (en excluant les drafts, templates, previews)
- Vérifie si le snippet n'est pas déjà présent
- L'insère juste avant `</head>` dans chaque fichier

Exécution : 1 seconde. 33 OK. Zéro erreur.

**Anecdote** : j'aurais pu faire ça à la main, mais j'aurais oublié 3-4 pages ou introduit des typos. Le script est 10× plus fiable.

---

## Acte 5 — L'agent audit qui hallucine

Une fois les bases posées, j'ai lancé un sous-agent Claude pour auditer le SEO complet du site. Il est revenu avec un rapport de 400 lignes, score 65/100, et **3 bloquants critiques**.

Premier bloquant : "**16 pages sans H1**". 16 pages sur 33, c'est énorme. L'agent disait que mes pages index.html, apprendre.html, articles.html, lexique.html... n'avaient pas de titre principal.

J'ai failli dire "bon, on fixe ça" et refactorer 16 pages. Claude a eu le réflexe de vérifier d'abord. Résultat :

```bash
$ grep -c "<h1" index.html
1
```

Chaque page a exactement 1 H1. L'agent avait été trompé par les H1 avec spans animés (`<h1><span class="line">...</span></h1>` pour l'animation). Son parser ne savait pas lire le texte dans les spans, il a conclu "H1 vide".

**Leçon majeure** : un agent audit n'est pas Dieu. Il faut vérifier ses dires avant de lancer un refactor. L'agent avait aussi trouvé des vrais problèmes (9 pages manquantes du sitemap, canonicals inconsistants) — mais sur ce point précis il hallucinait.

---

## Acte 6 — IndexNow, le shortcut du pauvre

Google peut mettre 3 à 14 jours pour crawler et indexer une nouvelle page. Bing, pareil voire plus. Pour un site qui publie 2 fois par semaine, c'est de la frustration.

**IndexNow** est une norme ouverte créée par Microsoft et Yandex en 2021. Principe : tu pings une API avec la liste des URLs que tu viens de publier, les moteurs compatibles (Bing, Yandex, Seznam, DuckDuckGo indirectement) les indexent en **quelques minutes**.

Google ne supporte pas IndexNow officiellement (ils ont leur propre Indexing API). Mais Bing + Yandex = déjà 15-20% du trafic search mondial.

Setup :
1. Générer une clé aléatoire (32 chars hex)
2. Créer un fichier `<clé>.txt` à la racine du site contenant la clé
3. Script Node.js de 50 lignes pour ping l'API

Premier ping après le deploy : 32 URLs envoyées, HTTP 202 (accepté).

Intégration dans mon workflow : le script `scripts/publish.js` affiche maintenant après chaque nouvel article :

```
Next step : git add . && git commit -m "Add article: X" && git push
Puis ping IndexNow : npm run indexnow https://jerwis.fr/articles/X.html
```

**Temps total de setup** : 5 minutes. **Temps gagné sur chaque future publi** : plusieurs jours d'attente.

---

## Acte 7 — Le truc con que tout le monde oublie

Dernier chantier : les dimensions des images.

Tu connais ce truc agaçant où tu commences à lire un article, le texte saute parce qu'une image vient de se charger et pousse tout vers le bas ? Ça s'appelle le **layout shift** et Google t'en pénalise (Cumulative Layout Shift, un des 3 Core Web Vitals).

La fix est ultra-simple : ajouter `width="1200" height="720"` aux balises `<img>`. Le navigateur réserve l'espace avant même d'avoir téléchargé l'image, plus de saut.

Mes 21 articles avaient 42 balises img. 27 sans dimensions. Script Python avec PIL pour lire les dimensions réelles de chaque fichier image → insertion automatique dans le HTML.

1 minute d'exécution, 27 images fixées. Lighthouse content.

**Leçon** : les petits détails techniques ont un impact cumulé énorme. Aucun visiteur ne remarque individuellement, mais le score global augmente.

---

## Ce que j'ai appris

1. **Ne confonds pas Analytics et Search Console**. Deux outils, deux jobs.
2. **Canonicals + redirects + primary domain doivent être alignés**. Sinon tu dilues ton SEO.
3. **Les APIs cachées des services sont sous-utilisées**. Hostinger, Vercel, IndexNow — tout est scriptable.
4. **Un audit IA n'est pas gospel**. Vérifier avant de refactor.
5. **Plausible > GA4 pour un blog perso**. 9€/mois pour zéro bannière, c'est donné.
6. **IndexNow est criminellement sous-utilisé**. 5 min de setup pour skip 3-14 jours d'attente.
7. **Le détail qui tue le CLS** : dimensions sur les images.

---

## Ce qui reste pour plus tard

- Covers OG dédiées par page (aujourd'hui toutes les pages partagent la même image de fallback)
- Lazy loading sur les images en bas de page
- Conversion WebP batch (gain de 40% de poids)
- Service Account Google Cloud pour l'Indexing API (équivalent IndexNow côté Google)
- Intégration des stats Plausible dans mon back-office admin (pour ne pas jongler entre 3 dashboards)

---

## Timeline réelle de la session

| Horaire | Ce qui s'est passé |
|---|---|
| ~21h00 | "Explique-moi comment être indexé par Google" |
| 21h15 | Création propriété GSC + TXT DNS via API Hostinger |
| 21h30 | Découverte du conflit www / canonical, fix Vercel Domains |
| 21h45 | Sitemap soumis dans GSC (24 URLs) |
| 22h00 | Plausible Analytics installé sur 33 pages en 1 push |
| 22h20 | Audit SEO par sous-agent + tri des faux positifs |
| 22h45 | Fix canonicals (9 articles) + sitemap enrichi (8 URLs ajoutées) |
| 23h15 | IndexNow setup + 32 URLs pingées (Bing/Yandex OK) |
| 23h45 | Open Graph + Twitter Card complétés (12 pages via sous-agent parallèle) |
| 00h00 | Dimensions images (27 ajoutées) |
| 00h15 | Tout commit, pushé, déployé |

**6 commits. 0 downtime. 1 soirée.**

---

## Anecdotes à garder pour l'article

- Le token Vercel que j'ai donné à Claude **n'avait pas les permissions** pour toucher aux domaines. Pas grave, on a fait ce bout à la main en 3 minutes.
- L'agent audit SEO a créé 5 scripts bash temporaires dans le répertoire courant pour ses vérifs. Il faut penser à les nettoyer avant de commit.
- La session précédente avait laissé du code non-commité dans le working tree (fix grille articles + nouvel avatar). Claude a détecté ça et refusé de commit sans demander d'abord. Safety net important.
- Le faux positif "H1 manquant" sur 16 pages : l'agent a halluciné à cause des spans animés dans les H1. Avant de croire un audit, on vérifie.
- Le SPF email aurait pu sauter si on avait écrit le TXT DNS sans `overwrite: false`. Backup automatique dans `/tmp/` avant chaque modif DNS, ça aide.

---

## Stack finale

| Outil | Rôle |
|---|---|
| Google Search Console | Index Google + stats queries |
| Bing Webmaster Tools | Index Bing (import 1-clic depuis GSC) |
| Plausible | Analytics visiteurs, sans cookie |
| IndexNow | Ping instantané Bing/Yandex |
| Hostinger API | Manipulation DNS automatisée |
| Vercel | Hosting + redirect 308 www |
| GitHub Actions (implicite) | Deploy auto sur push main |
| Claude Code + sous-agents | Cerveau qui orchestre tout ça |

---

_Fin du making-of — à transformer en article quand le moment viendra._
