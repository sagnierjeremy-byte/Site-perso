---
slug: photos-perso-ia
titre: "J'ai construit mon générateur de photos personal branding à 30€"
titre_seo: "Générer ses photos de personal branding à l'IA · récit complet"
description: "Klayn coûte 200€/mois. Une séance photo personal branding, 500€. J'ai voulu voir si je pouvais m'en sortir avec 30€ de crédit IA. Récit complet : ce qui a marché, ce qui a foiré, et le code que je vends à 99€ TTC (offre de lancement jusqu'au 6 juin · 149€ ensuite)."
numero: "12"
categorie: "Récit"
hero_ligne_1: "Mon générateur"
hero_ligne_2: "de photos personal branding."
hero_ligne_3: "30 € au lieu de 500."
lead: "Florian, notre vidéaste au bureau, a sorti un outil qui génère des photos de produits pour les sites e-commerce · quelques centimes par photo au lieu d'un shooting photographe. Quand j'ai vu ça, je me suis dit · si ça marche pour les produits, pourquoi pas pour les visages ? J'ai construit l'équivalent pour le personal branding. Deux semaines de chantier plus tard, j'utilise mes photos sur LinkedIn et on a même fait un set complet pour un de nos collaborateurs à 0,80 €. Voici le récit · ce qui marche, ce qui foire honteusement, et le code source que je vends en précommande pour ceux qui veulent juste l'utiliser pour eux et leur équipe."
duree: "12 min"
niveau: "Débutant"
outils: "Next.js · fal.ai · Gemini"
published: "2026-05-07"
tldr:
  - "Pour <strong>30 € de crédit IA</strong> j'ai obtenu une centaine de photos de moi · et un set complet pour un collaborateur à <strong>0,80 €</strong>. La plus réussie de moi, je l'utilise déjà sur LinkedIn."
  - "Trois trucs cassent tout au début · les modèles te font des photos <strong>de magazine</strong> par défaut, ils inventent des détails (cheveux, boucles d'oreilles…), et tu peux brûler 30 € en 1 h sans t'en rendre compte."
  - "Le code source est en vente à <strong>99 € TTC en offre de lancement</strong> (jusqu'au 6 juin, ensuite 149 €) · tu paies une fois, tu génères pour toi <strong>et toute ton équipe</strong>. Livraison auto par email en 2 minutes après paiement."
---

<!-- section k-fuchsia -->

## Avant de commencer

J'avais besoin de photos. Pas mille, juste **5 ou 6 belles photos de moi**, utilisables sur LinkedIn, le site, en hero de newsletter, sur une page de vente. Tu connais le problème : la dernière vraie séance photo que tu as faite remonte à des années, tes selfies datent de 2022, et tout ce que tu publies sort un peu pâle.

Deux options classiques · payer un photographe (environ 500 € la séance à Lyon ou Paris pour un set correct), ou prendre un abonnement à un générateur tout-fait comme **Klayn.ai** (à peu près 200 €/mois). J'ai trouvé les deux trop chers pour un truc dont j'ai besoin une fois par trimestre.

Donc j'ai fait ce que je fais à chaque fois que je trouve un produit cher · j'ai regardé sous le capot. Klayn empile en réalité trois ou quatre **modèles d'image IA** disponibles sur des plateformes comme **fal.ai**. À l'unité, chaque photo coûte entre $0.04 et $0.20 · pas 200 € par mois. Le reste, c'est juste de l'interface, du marketing et de la marge.

J'ai construit mon outil. Voilà la photo dont je suis le plus content (générée à partir de 4 selfies pris à mon iPhone) :

<img src="screenshots/photos-perso-ia/win-1-bw.jpeg" alt="Portrait noir et blanc, col roulé, regard direct caméra · ma photo la plus réussie générée par IA" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

<div class="callout tip">
  <h4>Mon avis en 5 secondes</h4>
  <p>Tu peux très bien remplacer la séance photo par un outil maison. <strong>Mais pas en 1 soir</strong> · il faut deux semaines pour caler les bons réglages. Si t'as pas envie de te taper la courbe d'apprentissage, je vends mon code en précommande à 99 € · tu lis l'article et tu choisis si tu veux le faire toi-même ou récupérer le mien.</p>
</div>

<!-- section k-teal -->

## Comment c'est parti (et l'idée vient pas de moi)

Pour être honnête, l'idée vient pas de moi. C'est **Florian**, notre vidéaste-photographe au bureau, qui a tout démarré.

Il y a quelques mois, Florian a construit un outil qui génère des **photos de produits** pour les sites e-commerce. Le principe est tout simple · au lieu d'organiser un shooting (matos, studio, photographe, post-prod · facilement 1000 € pour quelques produits), tu uploades une photo de ton produit, tu décris la scène que tu veux (*"notre crème en gros plan sur un comptoir en marbre noir, lumière dorée"*), et l'IA te sort 5-10 photos pro de ton produit dans cette scène. Pour quelques centimes l'unité.

Quand j'ai vu ses premiers résultats sur des produits, j'ai eu un déclic · *si ça marche pour les produits, pourquoi pas pour les visages ?*

Parce qu'on a tous le même problème · une photo de profil LinkedIn qui date de 2022, pas de portrait pour la page "à propos" du site, rien d'utilisable en hero de newsletter, pas de visuel pour les pages de vente. Et entre la séance photo à 500 € et l'abonnement Klayn à 200 €/mois, il y a un trou que personne ne remplit. Surtout pour les **équipes** · si t'as 5 collaborateurs qui ont chacun besoin de 10 photos, ça te coûte un bras avec la voie classique (logistique d'un photographe au bureau, 1 journée bloquée, 2000-3000 € la facture finale).

Donc j'ai pris la même architecture que Florian, je l'ai forkée, et j'ai tout repensé pour les visages · gestion des références d'identité, prompts spécifiques pour qu'on reconnaisse vraiment la personne, mode "iPhone naturel" par défaut pour éviter le faux-magazine.

Deux semaines plus tard, j'avais mes photos. Et puis on s'est dit "tiens, on devrait essayer pour les autres dans la boîte" · t'en as un aperçu un peu plus bas dans l'article.

<!-- section k-orange -->

## À quoi ressemble le truc

J'ai fait un site web tout simple. Quatre étapes, dans l'ordre :

<div class="usecase">
  <div class="usecase-label">Étape 01 · Tu te prends en selfie</div>
  <h4>4 à 7 photos prises à l'iPhone</h4>
  <p>Pas besoin de matos. Tu prends 4 selfies à la lumière du jour · face, profil gauche, profil droit, gros plan visage. C'est ce qu'on appelle des <strong>polas</strong> dans le jargon photo · les photos de référence pour que l'IA apprenne ta tête.</p>
  <p>Comptes-y 2 minutes devant un mur clair.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Étape 02 · Tu décris la scène</div>
  <h4>Un lieu, une ambiance, c'est tout</h4>
  <p>Tu écris en français : <em>"je veux une photo de moi en café cosy avec un MacBook"</em> · ou <em>"sur un rooftop au coucher du soleil avec mon téléphone"</em>. Si t'as pas d'idée, un bouton "Inspire-moi" te propose 8 décors prêts à l'emploi.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Étape 03 · Tu valides 5 propositions</div>
  <h4>L'IA décompose ta scène en 5 plans</h4>
  <p>Sous le capot, <strong>Gemini 2.5 Pro</strong> (un modèle de Google) lit tes selfies et ton brief, puis te propose 5 plans différents · gros plan visage, plan poitrine, plan large décor, etc. Tu peux les modifier ou en virer un avant de lancer.</p>
</div>

<div class="usecase">
  <div class="usecase-label">Étape 04 · Tu lances · 30 secondes plus tard t'as tes photos</div>
  <h4>5 photos, 30 secondes, $0.20 le tirage</h4>
  <p>Le modèle d'image (par défaut <strong>Seedream 4.5</strong>, un modèle chinois ultra-bon pour faire plusieurs photos cohérentes d'un coup) fait son travail. 30-60 secondes plus tard, t'as tes 5 photos. Si y'en a une qui te plaît pas, tu cliques sur "regénérer ce plan" · ça en refait juste cette photo-là sans toucher aux autres.</p>
</div>

Dans le tableau de bord, t'as aussi un compteur de coût en haut à droite · *aujourd'hui $X.XX*, *ce mois-ci $Y.YY*. Histoire de pas brûler 30 € sans t'en rendre compte (j'y reviens plus bas, c'est exactement ce qui m'est arrivé au début).

### Voilà mes 4 selfies de référence

Pour que tu mesures à quel point l'étape 01 est ridicule de simplicité · voici **exactement** les 4 photos que j'ai uploadées dans l'outil pour générer toutes les photos que tu vois dans cet article. 4 selfies iPhone, mur clair, pris en 2 minutes :

<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin:28px 0;">
  <img src="screenshots/photos-perso-ia/jeremy-1.jpg" alt="Selfie de référence n°1 · face caméra, lumière du jour, mur clair" style="width:100%; border-radius:10px; display:block;">
  <img src="screenshots/photos-perso-ia/jeremy-2.jpg" alt="Selfie de référence n°2 · profil, expression neutre" style="width:100%; border-radius:10px; display:block;">
  <img src="screenshots/photos-perso-ia/jeremy-3.jpg" alt="Selfie de référence n°3 · 3/4 face, sourire léger" style="width:100%; border-radius:10px; display:block;">
  <img src="screenshots/photos-perso-ia/jeremy-4.jpg" alt="Selfie de référence n°4 · gros plan visage, lumière naturelle" style="width:100%; border-radius:10px; display:block;">
</div>

C'est tout. Pas de matos, pas de séance, pas de costume. **Ça** suffit à l'outil pour comprendre ma tête et la reproduire dans 50 décors différents. Le talent est dans le prompt, pas dans la photo d'entrée.

<!-- section k-teal -->

## Les photos qui marchent vraiment

Je te montre deux résultats · ça donne une idée de ce qu'on obtient quand tout s'aligne.

<img src="screenshots/photos-perso-ia/win-1-bw.jpeg" alt="Portrait noir et blanc · col roulé, lumière douce, regard direct" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

**Pourquoi celle-là marche** · l'IA a gardé ma vraie tête (forme du crâne, structure de la barbe, regard), la lumière est douce et naturelle (pas de flash agressif), et le noir et blanc cache la peau parfois trop lisse de l'IA. C'est le genre de portrait que je peux mettre en photo de profil sans que personne ne pose de questions.

<img src="screenshots/photos-perso-ia/win-2-rooftop.jpeg" alt="Portrait sur rooftop au coucher du soleil, smartphone en main" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

**Pourquoi celle-là marche** · le décor (rooftop coucher de soleil) reste plausible, je tiens le téléphone d'une manière naturelle, et la lumière dorée maquille les imperfections que l'IA met parfois sur la peau. Idéal en hero de page de vente ou de newsletter.

<div class="callout ok">
  <h4>Le coût exact des deux photos ci-dessus</h4>
  <p>Chaque tirage Seedream 4.5 me coûte <strong>$0.04</strong>. Pour ces 2 photos j'en ai en réalité tiré une quinzaine (je garde celles qui me plaisent et je jette les autres). <strong>Total : environ $0.60</strong>. Une séance complète "tous les sets de l'année" me coûte 30 €.</p>
</div>

<!-- section k-fuchsia -->

## Galerie · ce qu'on peut sortir concrètement

Pour pas que tu restes sur 2 photos · voilà ce que l'outil sort sur **6 cas d'usage typiques** d'un personal branding solide. À chaque fois je te donne l'usage cible, le coût réel, et pourquoi ça marche (parce que comprendre pourquoi, c'est ce qui te permet de répliquer chez toi).

<img src="screenshots/photos-perso-ia/gpt-high.png" alt="Portrait LinkedIn corporate · costume sombre, ambiance bureau premium, laptop ouvert" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**1 · LinkedIn corporate (photo de profil + page À propos)**
- **Pour quoi** · photo de profil LinkedIn, page "à propos" du site, signature email, slide d'intro de pitch.
- **Coût** · $0.04 le tirage, j'en ai pris 6 avant d'avoir celle-là (≈ $0.25).
- **Ce qui marche** · ambiance "open space premium" mais flou de profondeur naturel (pas de bokeh stock), expression contrôlée mais pas figée, regard légèrement décadré (pas plein cadre = ça respire). Tu peux la mettre sur LinkedIn demain matin, personne ne pose de question.

<img src="screenshots/photos-perso-ia/podcast-studio.png" alt="Setup podcast studio · micro suspendu, sourire engagé, ambiance feutrée" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**2 · Post "j'étais sur un podcast" (sans avoir été sur un podcast)**
- **Pour quoi** · annoncer un passage podcast (le tien ou un invité), promo d'un épisode, photo de cover de série de posts "behind the scenes".
- **Coût** · $0.04. Une seule génération, c'était bon du premier coup.
- **Ce qui marche** · le micro à condensateur de pro, le sourire authentique (pas commercial), la lumière chaude orangée typique des studios podcast. C'est la photo qui pose le plus de questions à mon réseau · "tu fais un podcast maintenant ?". Spoiler · pas encore.

<img src="screenshots/photos-perso-ia/laptop-cafe.png" alt="Gros plan lifestyle · mains sur clavier laptop, bibliothèque en arrière-plan, ambiance café cosy" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**3 · Café lifestyle (carrousel LinkedIn, fond de newsletter)**
- **Pour quoi** · carrousel "ma routine matin", header de newsletter, visuel de page de vente d'une formation, illustration d'article blog sur la productivité.
- **Coût** · $0.04, premier tirage.
- **Ce qui marche** · c'est un gros plan **sans visage** · l'IA n'a pas à se battre pour reproduire ma tête, du coup le rendu est ultra-clean (la peau parfaite de l'IA pose problème seulement sur les portraits frontaux). Cadrage cinématographique, lumière dorée, bibliothèque qui suggère "je lis donc je pense". Tu peux décliner cette esthétique sur 50 visuels d'un coup.

<img src="screenshots/photos-perso-ia/street-phone.png" alt="Photo éditoriale · marche dans la rue parisienne, téléphone à l'oreille, manteau beige, taxi jaune en arrière-plan" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**4 · Street éditorial (couv d'article, hero de page de vente)**
- **Pour quoi** · cover d'un article long format ("comment j'ai monté ma boîte"), hero d'une page de vente, image d'ouverture d'une présentation pitch.
- **Coût** · $0.04, j'en ai tiré 4 pour avoir l'angle parfait (≈ $0.16).
- **Ce qui marche** · mouvement (marche, regard hors-champ, téléphone à l'oreille) au lieu d'une pose figée · ça raconte une histoire. Le taxi jaune en arrière-plan ancre la scène (Paris, business, mouvement). Le manteau beige ressort sur le fond gris-bleu de la rue. C'est le genre de photo que tu paierais 300 € à un photographe pour aller la chercher en vrai dans la rue.

<img src="screenshots/photos-perso-ia/win-2-rooftop.jpeg" alt="Rooftop coucher de soleil · portrait hero, lumière dorée chaude" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**5 · Rooftop hero (hero homepage, page de pré-commande, hero newsletter)**
- **Pour quoi** · hero d'une homepage, header d'une page de pré-commande, photo d'ouverture d'un lancement produit.
- **Coût** · $0.04. Compte 3-4 essais pour trouver l'angle propre (≈ $0.15).
- **Ce qui marche** · la lumière dorée du coucher de soleil maquille naturellement les imperfections que l'IA met sur la peau · c'est le secret. Pose naturelle (téléphone en main, regard vers l'horizon), ambiance "fin de journée business mais cool". Tu mets cette photo en hero, t'as un site qui a l'air financé en seed round.

<img src="screenshots/photos-perso-ia/win-1-bw.jpeg" alt="Portrait noir et blanc col roulé · regard direct, intemporel" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**6 · Portrait B&W intemporel (photo de profil "principale", interview, presse)**
- **Pour quoi** · ta photo de profil principale (LinkedIn, Twitter, site, podcast invité), photo presse à envoyer à un journaliste, cover d'interview.
- **Coût** · $0.04. C'est ma préférée, j'en ai tiré une dizaine pour la trouver (≈ $0.40).
- **Ce qui marche** · le noir et blanc **cache la peau parfois trop lisse de l'IA** (c'est le principal tell que tu vois sur les photos IA mal calées · une peau trop nette). Col roulé = intemporel, regard direct caméra = autorité, lumière douce latérale = pas de coupe-net flash. C'est le portrait que tu peux laisser 3 ans sans le remplacer.

<div class="callout tip">
  <h4>Le truc à retenir de cette galerie</h4>
  <p>Les 6 photos ci-dessus représentent ensemble <strong>moins de $1.50 de crédits IA</strong> (avec les ratés que j'ai jetés). En studio, le même set te coûterait entre <strong>500 € et 1500 €</strong> selon la ville et le niveau du photographe · sans compter la demi-journée à bloquer dans ton agenda et les 6 changements de costume.</p>
</div>

<!-- section k-orange -->

## Et ça marche aussi pour les collaborateurs

C'est là que l'outil devient vraiment intéressant. Une fois calé pour ma tête, on a pu le réutiliser tel quel pour les têtes des autres dans la boîte.

Voici un portrait généré pour **un de nos collaborateurs** · 4 selfies envoyés en input, brief "studio neutre noir et blanc, regard direct caméra, costume sobre", quelques tirages plus tard on avait son set complet de photos pro :

<img src="screenshots/photos-perso-ia/win-3-collaborateur.jpeg" alt="Portrait noir et blanc d'un collaborateur · regard direct, fond gris clair, veste et chemise blanche" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

**Ce que ça change concrètement** · si tu pilotes une équipe, tu n'as plus besoin de faire venir un photographe au bureau pour tout le monde (logistique infernale, prix qui grimpe vite · entre 1500 € et 3000 € pour 5-10 personnes selon la ville). Chaque personne envoie ses 4 selfies depuis chez elle, tu fais tourner l'outil 5 minutes, et tout le monde a son set. **Une fois l'outil installé, le coût marginal d'un collaborateur supplémentaire tourne autour de 0,80-1 €.**

C'est aussi le moment où l'argument *"j'achète le code une fois plutôt que de m'abonner"* prend tout son sens · sur 5-10 personnes à équiper, le ROI du logiciel est immédiat.

<!-- section k-fuchsia -->

## Les photos honteusement ratées (parce que faut être honnête)

Je vais pas te vendre du rêve. Pour 1 photo qui marche, j'en jette 4. Voici 2 ratés caractéristiques · ça te donne une idée du genre de pièges à éviter.

### Raté 1 · L'IA a inventé un personnage qui n'est pas moi

<img src="screenshots/photos-perso-ia/fail-2-personnage-invente.jpg" alt="Photo générée d'un homme avec cheveux mi-longs et boucles d'oreilles · ne ressemble pas du tout à Jérémy" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

Ce gars-là n'est pas moi. Je suis chauve, je porte pas de boucles d'oreilles, j'ai jamais eu cette coupe. **Pourquoi ça arrive** · quand le prompt est trop vague (genre "homme business sur un rooftop"), le modèle invente le personnage. Mes 4 selfies de référence pèsent moins fort que les milliers de photos LinkedIn corporate que le modèle a vues à l'entraînement.

**Le fix qui a marché** · forcer dans le prompt des ancres très précises sur l'identité · *"chauve, barbe poivre et sel, structure du visage carré, yeux bleus"*. Et faire un mini-test de 1 photo avant le batch, pour voir si l'IA capte bien ma tête. Si elle me confond avec quelqu'un d'autre, j'ajuste avant de tirer 5 photos d'un coup.

### Raté 2 · La pose figée "stock photo corporate 2018"

<img src="screenshots/photos-perso-ia/fail-1-rooftop-stock.jpg" alt="Photo générée · homme en costume beige marchant sur un rooftop · pose figée style banque d'images" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

Là c'est un peu plus subtil · ça me ressemble vaguement (forme du crâne OK), mais c'est devenu une **photo de banque d'images**. Pose figée, costume beige stock, sourire de catalogue, lumière de pub immobilier. Si je mets ça en photo LinkedIn, mon réseau va se demander si j'ai pivoté en consultant Big4.

**Pourquoi ça arrive** · les modèles d'image ont une *voix par défaut*. Quand tu leur donnes pas de consignes très précises, ils tirent vers ce qu'ils ont le plus vu pendant leur entraînement · des photos de magazine éditorial, des photos corporate, du Hawkesworth-Kinfolk pour l'extérieur. Et c'est jamais ce qu'on veut quand on cherche du naturel.

**Le fix qui a marché** · j'ai créé un mode "iPhone naturel" par défaut. Le prompt force des choses comme *"objectif 24mm, lumière mixte ambiante, légèrement décadré, pas de grain de pellicule, pas de composition éditoriale"*. Bilan · les photos ressemblent enfin à ce qu'on prendrait avec un iPhone moderne, pas à une couverture de magazine.

<!-- section k-orange -->

## Les 5 trucs que j'aurais aimé savoir au début

Si tu envisages de faire ton propre outil (ou même juste d'utiliser un Klayn et compagnie), ces 5 leçons te feront gagner deux semaines.

### 1 · Les modèles d'image ont une "voix par défaut" très magazine

C'est le truc le plus piégeant. Tu écris un prompt simple et neutre, le modèle te sort du **Vogue**. Pas parce que tu lui as demandé, mais parce que c'est ce qu'il a le plus vu pendant son entraînement.

**Concrètement** · si tu veux du naturel iPhone, tu dois l'imposer fort dans le prompt (et même bannir explicitement les mots comme "Kodak Portra", "cinematic", "editorial"). Si tu fais pas ça, t'auras toujours du faux-magazine et tu comprendras pas pourquoi.

### 2 · Plus court = mieux (compresse tes prompts ×3)

Mon réflexe au début · ajouter du contexte. Plus de mots = plus de précision, non ? **Non, l'inverse**.

Les modèles d'image ont un nombre de mots optimal entre 30 et 100. Au-dessus, ils moyennent et oublient la moitié de tes consignes. J'ai compressé mes prompts de 470 mots à 165 mots · les résultats ont été immédiatement meilleurs.

### 3 · Pas de modèle gagnant universel · tu testes les 4 sur ta tête

Il existe une dizaine de modèles d'image accessibles via fal.ai. J'en utilise principalement 4 · **Seedream 4.5** (le meilleur pour faire 5 photos cohérentes d'un coup), **Nano Banana Pro** (le meilleur pour une seule photo très ressemblante), **FLUX 2** (bon pour les scènes d'extérieur très précises), **GPT Image 2** (bon pour la fidélité d'identité quand t'as une seule photo de référence).

Aucun n'est meilleur que les autres dans l'absolu · ça dépend de **ta tête** et de **ce que tu cherches**. Le seul moyen de savoir, c'est de générer la même scène avec les 4 modèles sur tes selfies, et regarder. Compte $0.50 pour ce test, c'est rentable.

### 4 · Tu peux brûler 30 € en 1 h sans t'en rendre compte

Ça m'est arrivé en deux jours, sans déconner. Au début j'avais branché un modèle qui prenait 5-10 minutes à tourner. L'interface me disait *"failed"* à chaque essai (parce que mon serveur avait un timeout à 60 secondes). Sauf que le modèle, lui, **continuait son travail en arrière-plan** · et **me facturait quand même**. Je re-cliquais, il facturait à nouveau. Bilan en 1h · $30 brûlés en silence.

**Le fix qui a sauvé mon compte fal** · à chaque fois qu'un modèle prend plus de 60 secondes, je passe en mode *queue + poll* (en français · l'interface envoie le job, reçoit un ticket, et vient demander toutes les 8 secondes "c'est fini ?"). Plus jamais de double facturation. Et j'ai mis un compteur de coût en haut de l'écran qui passe au rouge si je dépasse $30 par jour.

### 5 · Le pouce vert/rouge sous chaque photo bat 200 ajustements de prompts

Au début j'ai voulu trop tuner mes prompts. À chaque mauvais résultat j'allais modifier 3 mots dans le prompt système. Au bout de 2 jours, j'avais touché à tout, et j'arrivais plus à savoir quel changement avait amélioré quoi.

Le truc qui marche, à la place · un simple **système de feedback humain**. Sous chaque photo générée, 3 boutons (👍 j'aime · 👎 j'aime pas · 🛑 raté). Plus 8 tags fixes pour préciser ("ne me ressemble pas", "peau plastique", "pose figée", etc.). En 1 semaine de votes, j'ai compris que mon problème principal c'était la pose, pas la lumière. Sans le feedback j'aurais passé 2 semaines à tuner la lumière.

<!-- section k-teal -->

## Tu veux le construire toi-même ?

Si t'es développeur ou que t'as Claude Code installé, tu peux complètement faire ça toi-même. Voici la **stack minimale** :

- **Next.js** + **Tailwind** pour l'interface (3 pages, c'est tout · upload, choix scène, résultats)
- **Zustand** pour stocker les sessions dans le navigateur (pas besoin de base de données)
- **fal.ai** comme passerelle vers les modèles d'image (Seedream, FLUX, etc.) · facture à l'usage, pas d'abonnement
- **OpenRouter** pour appeler **Gemini 2.5 Pro** qui décompose la scène en 5 plans · environ 1 € pour 50 sessions

3 conseils non négociables si tu te lances :

1. **Mets un compteur de coût dès le jour 1**. Tu vas faire des erreurs, autant les voir tout de suite. 30 lignes de code, ça te coûte rien.
2. **Compresse tes prompts ×3**. Démarre court, ajoute seulement si tu vois que ça améliore.
3. **Mode "iPhone naturel" par défaut**. Sinon tous tes résultats vont tirer vers le magazine et tu comprendras pas pourquoi.

J'ai écrit le récit technique complet (17 sections, tous les bugs résolus, toutes les décisions d'architecture) dans un document à part. Si tu veux le lire avant de te lancer, **dis-moi en réponse à la newsletter** · je l'envoie en privé à ceux qui le demandent.

<!-- section k-fuchsia -->

## Tu veux juste l'utiliser (pour toi et ton équipe) ? 99 € en offre de lancement

Si t'as pas envie de te taper deux semaines de bricolage · ou si t'as une équipe à équiper et que les abonnements SaaS additionnés te font mal au crâne · je vends le code source. À acheter une seule fois, pas d'abonnement, pas de SaaS qui peut disparaître demain.

<div class="callout ok">
  <h4>Ce que tu reçois pour 99 € TTC</h4>
  <p><strong>Le code source complet</strong>, livré en deux formats · invitation immédiate au repo GitHub privé (tu reçois les futures mises à jour) <strong>et</strong> ZIP téléchargeable (autonome, tu fais ce que tu veux avec).</p>
  <p>Sont inclus · le code Next.js prêt à déployer (15 min sur Vercel gratuit), le récit technique <strong>STORYTELLING.md</strong> qui documente toutes les décisions et les bugs déjà résolus pour toi, et le fichier <strong>CLAUDE.md</strong> qui permet à Claude Code d'apporter des modifications proprement.</p>
  <p><strong>Une page Paramètres intégrée</strong> · accessible depuis n'importe où via la topbar. Elle affiche le statut de chaque clé API (✓ Configurée / ✗ Manquante avec valeur masquée <code>••••XXXX</code>), des boutons "Tester la connexion" pour fal.ai et OpenRouter (endpoints gratuits, zéro coût), un calculateur de coût interactif (tu rentres sessions/mois + photos/session, tu vois le total $ et €), un walkthrough pas-à-pas qui s'adapte selon que tu sois sur Vercel ou en local, des sections dépliables par clé (comment l'obtenir, à quoi ça sert, combien ça coûte, bonnes pratiques) et une FAQ avec les 7 questions qui reviennent tout le temps. <strong>Concrètement · tu ne touches plus jamais à un fichier <code>.env.local</code></strong>, tout se passe dans le dashboard Vercel + l'interface.</p>
  <p><strong>Livraison automatique en 2 minutes</strong> · tu paies sur Stripe, tu reçois immédiatement par email le lien ZIP + l'invitation GitHub. Aucune attente, aucune validation manuelle.</p>
  <p><strong>Pas de limite par utilisateur</strong> · une fois installé, tu génères pour toi, tes collaborateurs, ton équipe, ton pote qui t'a demandé un service. Tu paies juste les coûts variables (les clés API ci-dessous).</p>
  <p><strong>Ce que tu apportes</strong> · ta propre clé fal.ai (environ 20 € pour 100 photos) et ta clé OpenRouter (environ 1 € pour 50 sessions). Pas d'abonnement caché · tu paies les modèles d'image à l'usage, directement, à quelques centimes la photo.</p>
  <p><strong>Garantie remboursement</strong> · si tu déploies l'outil et que ça ne marche pas chez toi en moins d'1h, je te rembourse intégralement, sans question.</p>
</div>

### Tu fais le calcul, et là...

Le truc le plus simple pour comprendre l'intérêt, c'est de poser les 3 options côte à côte sur 12 mois :

| Option | Coût année 1 | Coût année 2 | Limite | À qui c'est rentable |
|---|---|---|---|---|
| **Klayn.ai** (abonnement SaaS) | 200 € × 12 = **2 400 €** | **2 400 €** (récurrent) | 1 personne / compte, modèles imposés, dépend de la survie du SaaS | À personne, sauf si tu génères 50 photos / semaine et que t'as zéro envie de toucher à un terminal |
| **Séance photographe** (1 / trimestre) | 4 × 500 € = **2 000 €** | **2 000 €** | 1 personne, 1 esthétique figée par séance, photos vieillissent en 6 mois | Si tu valorises le rapport humain au photographe et que la qualité "vraie photo" est non-négociable pour ton marché (avocat de luxe, etc.) |
| **Cet outil** (achat unique) | **99 € + ~30 € de crédits fal.ai** = ≈ 130 € | **0 € + crédits à l'usage** (≈ 30 €/an si tu refais 3 sets) | Aucune (illimité, équipe entière, autant de sets que tu veux) | À 95 % des gens qui veulent juste des photos pro régulièrement |

**Lecture rapide** · sur 2 ans, tu compares **4 800 € (Klayn) ou 4 000 € (photographe) contre 160 €** avec mon outil. C'est pas une économie de 10 %, c'est un facteur 25-30.

<div class="callout ok">
  <h4>Cas 1 · Tu équipes 5 collaborateurs</h4>
  <p>Faire venir un photographe au bureau pour 5 personnes · entre <strong>1 500 € et 3 000 €</strong> selon ville et niveau (Paris/Lyon haut de gamme, comptes large). En plus, faut bloquer une demi-journée d'agenda pour 5 collaborateurs, gérer la logistique des fonds/changes, et la retouche derrière.</p>
  <p>Avec l'outil · <strong>99 € une fois + ≈ 5 € de crédits fal.ai</strong> pour les 5 sets initiaux (1 € par personne, 25 photos chacune). Chaque personne envoie ses 4 selfies depuis chez elle, ça tourne pendant qu'elle prend son café.</p>
  <p><strong>ROI</strong> · économie de ~1 400 à 2 900 € dès la première utilisation. Et tu peux refaire un nouveau set quand quelqu'un change de look ou que tu veux décliner une autre esthétique. L'outil est amorti dès le premier collaborateur équipé.</p>
</div>

<div class="callout ok">
  <h4>Cas 2 · Tu es indépendant ou solo</h4>
  <p>Klayn.ai à 200 €/mois = <strong>2 400 € / an</strong>. À ce tarif, mon outil coûte l'équivalent de <strong>0,5 mois d'abonnement Klayn</strong>. Tu peux te payer mon outil 24 fois avant d'avoir dépensé l'équivalent d'une seule année de Klayn.</p>
  <p>Sur 3 ans · Klayn te coûte <strong>7 200 €</strong>. Mon outil te coûte <strong>99 € + ~90 € de crédits</strong> (3 ans × 30 € de crédits si tu génères régulièrement) = <strong>189 €</strong>. Tu fais le calcul, et là... tu te demandes ce que les 7 011 € restants pourraient financer (un MacBook Pro M5, 14 séances chez un photographe pro, 2 ans de coworking).</p>
</div>

<!-- section k-teal -->

## Les arguments qu'on entend (et ce que je réponds)

Quand je présente l'outil, ces 4 objections reviennent à chaque fois. Voilà mes réponses honnêtes · pas du "je vais essayer de te convaincre", juste ce que je dirais à un pote.

### *"Mais l'IA, ça se voit !"*

Ça se voit **sur les photos qui sortent mal**. Et ça se voit beaucoup moins sur les photos qui sortent bien. Reviens regarder le **portrait B&W** et la **photo LinkedIn corporate** plus haut dans l'article · personne dans mon réseau ne m'a jamais demandé si c'était de l'IA. Personne.

Les "tells" classiques (peau plastique, mains à 6 doigts, yeux vides) apparaissent quand · tu utilises un modèle vieux, tu prompt trop court ou trop générique, tu prends une photo full frontale en pleine lumière sans aucun grain. Quand tu cadres en B&W, en plan large, en mouvement, ou avec une lumière de fin de journée · l'IA devient indétectable. Le piège, c'est de pas s'en rendre compte et de prendre la première photo qui sort.

### *"Y'a pas de support si ça plante chez moi."*

Faux. Pour 3 raisons concrètes :

1. **Repo GitHub privé** · t'es invité dessus, tu vois toutes les mises à jour que je pousse, tu peux ouvrir une issue si t'as un blocage.
2. **Garantie remboursement 1h** · si tu déploies l'outil et que ça marche pas chez toi en moins d'1h après réception, je te rembourse intégralement, sans question.
3. **Email direct** · tu m'écris à <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a>, je réponds en moins de 24h en jour ouvré. Pas un ticket à un support tiers · directement moi.

Le risque pour toi · 99 € si je disparais demain (improbable, je signe l'article avec mon nom et mon adresse). Le risque pour Klayn · 200 €/mois × 12 si leur SaaS ferme dans 6 mois, tu perds tout et tu repars de zéro.

### *"Je préfère payer un photographe une vraie séance."*

Vas-y. Sincèrement. Une vraie séance, c'est une autre expérience · un humain qui te guide, une vraie esthétique cohérente, des photos qui ont quelque chose en plus dans l'œil du photographe.

**Mais** · si tu fais une séance / 6 mois (très peu de gens en font plus), ton truc devient pâle au bout du 4e mois. Avec mon outil, tu refais **10 sets dans l'année** si tu veux · changement de saison, nouvelle ambiance, nouveau costume, un événement business spécifique. **C'est complémentaire, pas concurrent**. Tu peux très bien faire 1 vraie séance / an pour les photos "principales" et utiliser l'outil pour tout le reste (carrousels, posts, hero d'articles, mailings). C'est même ce que je fais.

### *"Je suis pas dev."*

C'est pour ça que la **page Paramètres** existe (relis la section "Setup en 3 minutes" plus haut). Concrètement, tu cliques sur "Deploy on Vercel" depuis le repo, tu te connectes avec ton compte GitHub (gratuit), tu colles 3 clés dans Vercel via leur interface graphique, et tu reviens sur l'app · les 3 cases passent au vert.

Tu ne touches **jamais** un fichier `.env.local`, jamais un terminal, jamais une ligne de code. Si tu sais utiliser Notion, tu sais utiliser l'outil. Et si t'es vraiment bloqué, le support garantie 1h ci-dessus existe.

<!-- section k-fuchsia -->

### Setup en 3 minutes · pour ceux qui ne veulent surtout pas toucher au code

Si t'es à l'aise avec un terminal, l'install prend 15 min. Si t'es allergique au code · genre tu sais à peine ce qu'est un `.env`, mais t'as déjà cliqué sur "Deploy" dans Vercel · t'es exactement la cible.

Tu déploies le repo sur Vercel en 1 clic (template gratuit, aucune carte bancaire requise · juste un compte). Tu ouvres l'app sur ton URL Vercel, tu cliques sur **Paramètres** dans la topbar, et tu vois trois cases rouges · `FAL_KEY`, `OPENROUTER_API_KEY`, `ADMIN_TOKEN`. À côté de chaque case, un bouton **"Comment l'obtenir"** te déplie un guide pas-à-pas (où aller cliquer chez fal.ai, où aller chez OpenRouter, quoi copier-coller dans Vercel).

Tu colles les 3 clés dans le dashboard Vercel (Settings → Environment Variables, copier-coller, save), tu redéploies (1 clic, 30 secondes), tu reviens sur la page Paramètres · les 3 cases passent au vert. Tu cliques **"Tester la connexion"** sur chaque clé · ça appelle l'endpoint de billing de fal.ai (gratuit, juste pour vérifier l'auth) et te répond *"connexion OK · ton solde est de X $"*. À ce moment-là, t'es prêt à générer ta première photo.

C'est ce que je voulais éviter à tout prix · qu'un acheteur se retrouve à ouvrir VS Code, comprendre ce qu'est un `.env.local`, googler "comment ajouter une variable d'environnement Vercel", et abandonner à la 3e tentative. Là, tout se passe dans l'interface · l'app te tient la main jusqu'à ce qu'elle marche.

<div class="callout warn">
  <h4>Offre de lancement · jusqu'au 6 juin 2026</h4>
  <p>Le tarif <strong>99 € TTC</strong> est une offre de lancement <strong>limitée à 30 jours</strong>. À partir du 6 juin 2026, le prix passe à <strong>149 € TTC</strong> (le tarif normal pour ce genre de produit).</p>
  <p>Si tu hésites, ne traîne pas trop · ça fait 50 € d'économie pour ceux qui décident maintenant.</p>
</div>

Pour acheter, **direction la page** :

<p style="text-align:center; margin: 28px 0;"><a href="../precommande-photos-personal-branding.html" style="display:inline-block; background:#ef426f; color:white; padding:16px 32px; border-radius:8px; font-weight:600; font-size:16px; text-decoration:none;">Acheter à 99 € TTC · offre limitée →</a></p>

Tu peux aussi écrire directement à <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a> si tu préfères payer autrement (virement, etc.).

<!-- section k-teal -->

## Pour aller plus loin

Quelques liens si tu veux creuser le sujet :

1. **[fal.ai](https://fal.ai)** · la plateforme qui permet de générer des images via une dizaine de modèles (Seedream, FLUX, Nano Banana, GPT Image, Imagen…). Tarification à l'usage, créditer son compte de 20 € te donne déjà de quoi tester.
2. **[Mon guide Claude Code](../claude-code.html)** · si tu veux te lancer dans le développement de ce genre d'outil, c'est par là que je commence en général.
3. **[Le lexique IA](../lexique.html)** · pour comprendre les termes techniques (LoRA, polas, batch, queue) qui reviennent souvent dans le monde des modèles d'image.
4. **[Mes outils](../outils.html)** · les 6 outils que j'utilise tous les jours dans mon stack IA-développeur.

Si t'as fait ton propre générateur de photos personal branding ou que t'as testé Klayn, **réponds à la newsletter** et raconte-moi ce que t'as appris. C'est comme ça que mes prochains articles s'améliorent.
