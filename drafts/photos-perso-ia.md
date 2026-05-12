---
slug: photos-perso-ia
titre: "Un vrai shooting personal branding à 0,04 $ la photo"
titre_seo: "Personal branding IA · un vrai shooting à 0,04 $ la photo"
description: "Klayn coûte 200 €/mois. Une séance photo, 500 €. J'ai construit l'équivalent qui me sort une photo pro à 0,04 $. Récit complet · ce qui marche, ce qui foire, et le code source que je vends à 39 € TTC."
numero: "12"
categorie: "Récit"
hero_ligne_1: "Un vrai shooting"
hero_ligne_2: "personal branding."
hero_ligne_3: "À 0,04 $ la photo."
lead: "Florian, notre vidéaste au bureau, a sorti un outil qui génère des photos de produits pour les sites e-commerce · quelques centimes par photo au lieu d'un shooting photographe. Quand j'ai vu ça, je me suis dit · si ça marche pour les produits, pourquoi pas pour les visages ? J'ai construit l'équivalent pour le personal branding. Deux semaines de chantier plus tard, j'utilise mes photos sur LinkedIn et on a même fait un set complet pour un de nos collaborateurs à 0,80 €. Voici le récit · ce qui marche, ce qui foire honteusement, et le code source que je vends en précommande pour ceux qui veulent juste l'utiliser pour eux et leur équipe."
duree: "15 min"
niveau: "Débutant"
outils: "Next.js · fal.ai · Gemini"
published: "2026-05-07"
tldr:
  - "Pour <strong>30 € de crédit IA</strong> j'ai obtenu une centaine de photos de moi · et un set complet pour un collaborateur à <strong>0,80 €</strong>. La plus réussie de moi, je l'utilise déjà sur LinkedIn."
  - "Trois trucs cassent tout au début · les modèles te font des photos <strong>de magazine</strong> par défaut, ils inventent des détails (cheveux, boucles d'oreilles…) et les compositions trop léchées sentent le shooting Vogue à plein nez."
  - "Le code source est en vente à <strong>39 € TTC</strong> · tu paies une fois, tu génères pour toi <strong>et toute ton équipe</strong>. Livraison auto par email en 2 minutes après paiement."
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
  <p>Tu peux très bien remplacer la séance photo par un outil maison. <strong>Mais pas en 1 soir</strong> · il faut deux semaines pour caler les bons réglages. Si t'as pas envie de te taper la courbe d'apprentissage, je vends mon code en précommande à 39 € · tu lis l'article et tu choisis si tu veux le faire toi-même ou récupérer le mien.</p>
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

<!-- section k-fuchsia -->

## L'app, en vrai

Voilà à quoi ça ressemble une fois déployé. Pas de terminal, pas de YAML, juste une UI. Tu cliques, tu colles tes 3 clés, tu génères tes photos.

<img src="screenshots/photos-perso-ia/hero-pb.png" alt="Page d'accueil du wizard · titre 'Fiesta', showcase photo, 3 étapes pour générer ses photos personal branding" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**Le wizard que t'auras chez toi** · accueil, showcase d'exemples, le bouton "Démarrer" qui te lance les 4 étapes (selfies → scène → propositions → tirages). C'est la page que tu vois en premier en arrivant sur ton URL Vercel.

<img src="screenshots/photos-perso-ia/settings-overview.png" alt="Page Paramètres · hero, diagramme 'Comment ça marche en 3 clés' et début des cartes de statut" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**La page Paramètres qui te dit en vert que tout marche** · tu arrives ici depuis n'importe où via la topbar. Diagramme "comment ça marche", 3 cartes pour les 3 clés (fal.ai, OpenRouter, Admin token), bouton "Tester la connexion" sous chaque case. Quand tout est vert, t'es prêt.

<img src="screenshots/photos-perso-ia/settings-cards.png" alt="Zoom sur les cartes de statut des clés API · status, variable d'environnement, bouton tester" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**Zoom sur les cartes** · à gauche le statut (✓ Configurée avec la valeur masquée `••••XXXX`, ou ✗ Manquante), à droite le bouton "Tester la connexion" qui ping l'endpoint billing de fal.ai. Tu te déplies "Comment l'obtenir" si tu cherches la doc à suivre.

<img src="screenshots/photos-perso-ia/settings-calc.png" alt="Section 'Installer tes clés en local' · instructions pas-à-pas pour le mode local" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**Et si tu veux tourner ça en local** · même page, plus bas. Instructions pas-à-pas pour cloner le repo, lancer `npm install`, créer ton `.env.local`. C'est le seul moment de l'outil où on te parle de fichier d'env · sinon tout passe par l'UI.

<div class="callout tip">
  <h4>Pourquoi je te montre ça</h4>
  <p>Parce que 80% des "outils IA" vendus aujourd'hui sont des scripts Python bricolés livrés en ZIP avec un README de 200 lignes. Ici c'est un <strong>vrai produit Next.js</strong> avec sa topbar, ses pages, son design system, ses callouts. Tu le déploies sur Vercel, tu mets ton domaine custom, tu changes le nom · t'as une app à toi.</p>
</div>

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

Pour pas que tu restes sur 2 photos · voilà ce que l'outil sort sur **8 cas d'usage typiques** d'un personal branding solide. À chaque fois je te donne l'usage cible, le coût réel, et pourquoi ça marche (parce que comprendre pourquoi, c'est ce qui te permet de répliquer chez toi).

### Wall of results · le volume brut, sans commentaire

Avant d'attaquer les cas un par un, regarde juste la planche-contact. **9 résultats côte à côte**, façon studio photo qui te tend la feuille de vignettes après la séance. C'est ça, une heure de génération à $0.04 le tirage :

<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin:28px 0;">
  <img src="screenshots/photos-perso-ia/win-1-bw.jpeg" alt="Vignette · portrait B&W col roulé" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/win-2-rooftop.jpeg" alt="Vignette · rooftop sunset" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/gpt-high.png" alt="Vignette · LinkedIn corporate" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/laptop-cafe.png" alt="Vignette · café lifestyle" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/gpt-medium.png" alt="Vignette · café bibliothèque" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/speaker-stage.jpg" alt="Vignette · scène conférence présentation" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/coffee-bookshelf.jpg" alt="Vignette · matin home office bomber café" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/office-tower.jpg" alt="Vignette · bureau premium tour étage haut" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
  <img src="screenshots/photos-perso-ia/win-3-collaborateur.jpeg" alt="Vignette · portrait B&W collaborateur" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:6px; display:block;">
</div>

Maintenant on déroule les cas en détail.

<img src="screenshots/photos-perso-ia/gpt-high.png" alt="Portrait LinkedIn corporate · costume sombre, ambiance bureau premium, laptop ouvert" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**1 · LinkedIn corporate (photo de profil + page À propos)**
- **Pour quoi** · photo de profil LinkedIn, page "à propos" du site, signature email, slide d'intro de pitch.
- **Coût** · $0.04 le tirage, j'en ai pris 6 avant d'avoir celle-là (≈ $0.25).
- **Ce qui marche** · ambiance "open space premium" mais flou de profondeur naturel (pas de bokeh stock), expression contrôlée mais pas figée, regard légèrement décadré (pas plein cadre = ça respire). Tu peux la mettre sur LinkedIn demain matin, personne ne pose de question.

<img src="screenshots/photos-perso-ia/speaker-stage.jpg" alt="Présentation sur scène · polo marine, lumière vidéoprojecteur, attitude posée près du pupitre" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**2 · Speaker / scène (annonce talk, post conférence, slide bio)**
- **Pour quoi** · annoncer un talk à venir (meetup, conférence sectorielle, podcast vidéo), illustrer un post "retour d'expérience après la confs", slide bio dans une présentation client.
- **Coût** · $0.04. Une seule génération, c'était bon du premier coup.
- **Ce qui marche** · la posture statique près du pupitre, la lumière froide du vidéoprojecteur derrière (signature des salles de conf), le polo marine bien ajusté = le code visuel "expert qui prend la parole". Tu peux la mettre en hero de page "Je donne des conférences" et personne n'ira vérifier.

<img src="screenshots/photos-perso-ia/laptop-cafe.png" alt="Gros plan lifestyle · mains sur clavier laptop, bibliothèque en arrière-plan, ambiance café cosy" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**3 · Café lifestyle (carrousel LinkedIn, fond de newsletter)**
- **Pour quoi** · carrousel "ma routine matin", header de newsletter, visuel de page de vente d'une formation, illustration d'article blog sur la productivité.
- **Coût** · $0.04, premier tirage.
- **Ce qui marche** · c'est un gros plan **sans visage** · l'IA n'a pas à se battre pour reproduire ma tête, du coup le rendu est ultra-clean (la peau parfaite de l'IA pose problème seulement sur les portraits frontaux). Cadrage cinématographique, lumière dorée, bibliothèque qui suggère "je lis donc je pense". Tu peux décliner cette esthétique sur 50 visuels d'un coup.

<img src="screenshots/photos-perso-ia/office-tower.jpg" alt="Portrait bureau premium · bomber beige, plantes vertes, fenêtres tour à étage haut sur skyline" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**4 · Bureau premium tour (hero "à propos", page équipe, photo pro)**
- **Pour quoi** · hero de la page "À propos" du site, photo officielle pour un communiqué de presse, slide d'ouverture d'un pitch d'investisseur, header de page équipe d'une start-up.
- **Coût** · $0.04, j'en ai tiré 3 pour avoir l'angle propre (≈ $0.12).
- **Ce qui marche** · l'étage haut avec skyline floue derrière qui suggère "boîte qui scale" (bureau premium = signal de réussite), la posture mains-dans-poches qui équilibre la sobriété du bomber beige sans tomber dans le costard 3 pièces, la lumière naturelle latérale qui maquille la peau. Photo qu'on garde 2 ans en hero "à propos" sans la remplacer.

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

<img src="screenshots/photos-perso-ia/gpt-medium.png" alt="Variante café bibliothèque · ambiance bois chaud, plan poitrine, regard pensif" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**7 · Variante café bibliothèque (cover de podcast, header "à propos")**
- **Pour quoi** · cover d'un podcast personnel, header de page "à propos" en mode chaleureux, photo d'auteur sur un blog perso, illustration d'un essai ou d'un livre.
- **Coût** · $0.04, 2 tirages pour avoir le bon angle (≈ $0.08).
- **Ce qui marche** · ambiance plus chaude que la corporate (#1), plus posée que le bureau tour (#4). Bois, lumière tungstène, fond légèrement flou de bibliothèque · c'est le portrait "intellectuel accessible". Idéal quand tu vends de la formation, du conseil, du contenu écrit. Très différent du LinkedIn corporate · même tête, deux univers visuels distincts.

<img src="screenshots/photos-perso-ia/coffee-bookshelf.jpg" alt="Matin home office · bomber camel, mug café fumant, bibliothèque, lumière du jour par la fenêtre" style="width:100%; max-width:720px; border-radius:12px; margin:24px auto; display:block;">

**8 · Matin home office (post LinkedIn casual, photo de blog perso, hero formation)**
- **Pour quoi** · post LinkedIn type "voilà à quoi ressemble ma matinée", photo d'illustration sur un blog perso (productivité, routine, vie d'entrepreneur), hero d'une page de vente de formation en ligne, header de cover d'un essai.
- **Coût** · $0.04. 2 tirages pour avoir le mug à la bonne hauteur (≈ $0.08).
- **Ce qui marche** · le bomber camel + tee blanc = signal "casual qui assume" sans tomber dans le hoodie, le mug en main à la fenêtre = ancre temporelle "c'est le matin, calme", la bibliothèque + cadres derrière qui chuchotent sans hurler "j'ai un univers à moi". C'est la photo qui dit "je suis cher mais j'ai du temps" sans avoir à le dire.

### 9 · Avant / après · le selfie iPhone vs ce que l'IA en sort

Pour que tu mesures le delta brut, voilà côte à côte **un selfie iPhone d'entrée** et **un résultat IA** générés à partir de lui :

<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; margin:28px 0; align-items:center;">
  <div>
    <img src="screenshots/photos-perso-ia/input-1-profil.jpg" alt="Avant · selfie iPhone brut, mur clair, lumière du jour, expression neutre" style="width:100%; border-radius:10px; display:block;">
    <p style="text-align:center; font-size:13px; opacity:0.75; margin-top:8px;">Avant · selfie iPhone, 2 sec, mur clair</p>
  </div>
  <div>
    <img src="screenshots/photos-perso-ia/win-1-bw.jpeg" alt="Après · portrait noir et blanc col roulé généré par IA à partir du selfie" style="width:100%; border-radius:10px; display:block;">
    <p style="text-align:center; font-size:13px; opacity:0.75; margin-top:8px;">Après · portrait B&W généré, $0.04</p>
  </div>
</div>

C'est exactement le saut · à gauche ce que t'as déjà dans la pellicule de ton téléphone, à droite ce que tu peux mettre sur LinkedIn lundi matin. Sans changement de coupe, sans rasage, sans studio. **Just 4 cents et 30 secondes**.

<div class="callout tip">
  <h4>Le truc à retenir de cette galerie</h4>
  <p>Les 9 photos ci-dessus représentent ensemble <strong>moins de $2 de crédits IA</strong> (avec les ratés que j'ai jetés). En studio, le même set te coûterait entre <strong>500 € et 1500 €</strong> selon la ville et le niveau du photographe · sans compter la demi-journée à bloquer dans ton agenda et les 6 changements de costume.</p>
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

Je vais pas te vendre du rêve. Pour 1 photo qui marche, j'en jette 4. Voici 3 ratés caractéristiques · ça te donne une idée du genre de pièges à éviter.

### Raté 1 · L'IA a inventé un personnage qui n'est pas moi

<img src="screenshots/photos-perso-ia/fail-2-personnage-invente.jpg" alt="Photo générée d'un homme avec cheveux mi-longs et boucles d'oreilles · ne ressemble pas du tout à Jérémy" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

Ce gars-là n'est pas moi. Je suis chauve, je porte pas de boucles d'oreilles, j'ai jamais eu cette coupe. **Pourquoi ça arrive** · quand le prompt est trop vague (genre "homme business sur un rooftop"), le modèle invente le personnage. Mes 4 selfies de référence pèsent moins fort que les milliers de photos LinkedIn corporate que le modèle a vues à l'entraînement.

**Le fix qui a marché** · forcer dans le prompt des ancres très précises sur l'identité · *"chauve, barbe poivre et sel, structure du visage carré, yeux bleus"*. Et faire un mini-test de 1 photo avant le batch, pour voir si l'IA capte bien ma tête. Si elle me confond avec quelqu'un d'autre, j'ajuste avant de tirer 5 photos d'un coup.

### Raté 2 · La pose figée "stock photo corporate 2018"

<img src="screenshots/photos-perso-ia/fail-1-rooftop-stock.jpg" alt="Photo générée · homme en costume beige marchant sur un rooftop · pose figée style banque d'images" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

Là c'est un peu plus subtil · ça me ressemble vaguement (forme du crâne OK), mais c'est devenu une **photo de banque d'images**. Pose figée, costume beige stock, sourire de catalogue, lumière de pub immobilier. Si je mets ça en photo LinkedIn, mon réseau va se demander si j'ai pivoté en consultant Big4.

**Pourquoi ça arrive** · les modèles d'image ont une *voix par défaut*. Quand tu leur donnes pas de consignes très précises, ils tirent vers ce qu'ils ont le plus vu pendant leur entraînement · des photos de magazine éditorial, des photos corporate, du Hawkesworth-Kinfolk pour l'extérieur. Et c'est jamais ce qu'on veut quand on cherche du naturel.

**Le fix qui a marché** · j'ai créé un mode "iPhone naturel" par défaut. Le prompt force des choses comme *"objectif 24mm, lumière mixte ambiante, légèrement décadré, pas de grain de pellicule, pas de composition éditoriale"*. Bilan · les photos ressemblent enfin à ce qu'on prendrait avec un iPhone moderne, pas à une couverture de magazine.

### Raté 3 · Le street éditorial qui sent le shooting Vogue

<img src="screenshots/photos-perso-ia/street-phone.png" alt="Photo générée · marche dans la rue parisienne en manteau beige, téléphone à l'oreille, taxi jaune en arrière-plan · trop éditorial" style="width:100%; max-width:560px; border-radius:12px; margin:24px auto; display:block;">

À première vue, elle est belle. Lumière dorée, manteau crème, taxi jaune au second plan, geste cinématographique du téléphone à l'oreille · tu pourrais la croire payée 300 € à un photographe.

**Pourquoi je la jette quand même** · c'est exactement le piège du raté 2, version premium. Trop éditorial pour un usage perso. Si tu mets ça sur LinkedIn, ton réseau sent immédiatement le "shooting magazine" et la photo perd toute crédibilité d'authenticité. C'est joli mais ça ne te ressemble plus · ça ressemble à une publicité Hermès saison 2023. Le mouvement scripté (marche + téléphone) ajoute une couche de mise en scène qui pue le décor.

**La leçon** · les modèles d'image adorent les compositions de magazine. Plus c'est "joli", plus tu dois te méfier. Une photo qui te ressemble vraiment a souvent l'air *moins remarquable* qu'une photo de Vogue · et c'est précisément pour ça qu'elle marche.

<!-- section k-orange -->

## Les 3 trucs que j'aurais aimé savoir au début

Si tu envisages de faire ton propre outil (ou même juste d'utiliser un Klayn et compagnie), ces 3 leçons te feront gagner deux semaines.

### 1 · Les modèles d'image ont une "voix par défaut" très magazine

C'est le truc le plus piégeant. Tu écris un prompt simple et neutre, le modèle te sort du **Vogue**. Pas parce que tu lui as demandé, mais parce que c'est ce qu'il a le plus vu pendant son entraînement.

**Concrètement** · si tu veux du naturel iPhone, tu dois l'imposer fort dans le prompt (et même bannir explicitement les mots comme "Kodak Portra", "cinematic", "editorial"). Si tu fais pas ça, t'auras toujours du faux-magazine et tu comprendras pas pourquoi.

### 2 · Plus court = mieux (compresse tes prompts ×3)

Mon réflexe au début · ajouter du contexte. Plus de mots = plus de précision, non ? **Non, l'inverse**.

Les modèles d'image ont un nombre de mots optimal entre 30 et 100. Au-dessus, ils moyennent et oublient la moitié de tes consignes. J'ai compressé mes prompts de 470 mots à 165 mots · les résultats ont été immédiatement meilleurs.

### 3 · Pas de modèle gagnant universel · tu testes les 4 sur ta tête

Il existe une dizaine de modèles d'image accessibles via fal.ai. J'en utilise principalement 4 · **Seedream 4.5** (le meilleur pour faire 5 photos cohérentes d'un coup), **Nano Banana Pro** (le meilleur pour une seule photo très ressemblante), **FLUX 2** (bon pour les scènes d'extérieur très précises), **GPT Image 2** (bon pour la fidélité d'identité quand t'as une seule photo de référence).

Aucun n'est meilleur que les autres dans l'absolu · ça dépend de **ta tête** et de **ce que tu cherches**. Le seul moyen de savoir, c'est de générer la même scène avec les 4 modèles sur tes selfies, et regarder. Compte $0.50 pour ce test, c'est rentable.

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

## Tu veux juste l'utiliser ? 39 € · achat unique

T'as une équipe à équiper, ou tu veux refaire tes photos pro tous les trois mois sans signer un abonnement à 200 €/mois. Je vends le code source · **achat unique**, pas de SaaS qui peut disparaître, pas de quota par utilisateur.

<div class="callout ok">
  <h4>Ce que tu reçois pour 39 € TTC</h4>
  <ul>
    <li><strong>Code Next.js complet</strong> · invitation au repo GitHub privé (mises à jour à vie) + ZIP autonome. Déploiement 1 clic sur Vercel gratuit.</li>
    <li><strong>Page Paramètres turnkey</strong> · tu colles tes 3 clés API via l'interface, le statut passe au vert et un bouton "Tester la connexion" confirme. Tu touches jamais un fichier <code>.env.local</code>, jamais un terminal.</li>
    <li><strong>Docs livrées</strong> · <code>STORYTELLING.md</code> (toutes les décisions techniques + bugs déjà résolus) + <code>CLAUDE.md</code> (pour que Claude Code modifie ton fork proprement).</li>
    <li><strong>Pas de limite d'usage</strong> · toi, ton équipe, ton pote — autant de personnes que tu veux.</li>
    <li><strong>Livraison auto 2 minutes</strong> · Stripe → email avec lien ZIP + invite GitHub. Aucune validation manuelle.</li>
    <li><strong>Garantie remboursement 1h</strong> · si ça marche pas en moins d'1h après réception, je rembourse intégral sans question.</li>
  </ul>
  <p style="margin-top:14px;"><strong>Tes coûts variables · clés API à toi</strong> · fal.ai (~ 4 € pour 100 photos) + OpenRouter (~ 1 € pour 50 sessions). Tu paies à l'usage, directement aux providers, à quelques centimes la photo. Pas d'abonnement caché.</p>
</div>

### Le calcul sur 2 ans, sans bullshit

| | Klayn (abo SaaS) | Photographe (1/trim) | Mon outil |
|---|---|---|---|
| Année 1 | 2 400 € | 2 000 € | ~ 130 € |
| Année 2 | 2 400 € | 2 000 € | ~ 30 € |
| **Total 2 ans** | **4 800 €** | **4 000 €** | **~ 160 €** |

Facteur 25-30, pas une économie de 10 %. Et tu peux refaire 50 sets dans l'année sans surcoût supplémentaire — un nouveau collaborateur arrive ? 1 € de crédit fal.ai et c'est plié.

<!-- section k-orange -->

## Pourquoi pas Klayn ? Pourquoi pas un photographe ?

Trois trucs qui m'auraient empêché de dormir si j'avais signé chez Klayn :

- **Le vendor lock-in sur ton visage.** Klayn entraîne un modèle propriétaire sur tes selfies (4 h de training). Tu changes de coupe, tu te rases la barbe ? Tu repasses par la case training. Chez moi, 4 nouveaux selfies à chaque session, l'IA s'adapte en direct — 30 secondes, c'est tout.
- **La dépendance au survivant du SaaS.** S'ils ferment, pivotent ou augmentent les prix, tes données partent avec eux. Avec le code source, tu as les fichiers à vie — même si je disparais demain (improbable, je signe avec mon nom).
- **Le paywall sur les nouveaux modèles.** Tous les 3-4 mois un nouveau modèle d'image sort (Seedream 5, FLUX 3…). Chez Klayn = nouveau plan tarifaire à 299 €/mois pour y accéder. Chez moi = 1 commit gratuit qui l'ajoute au dropdown.

Et le photographe alors ? **C'est complémentaire, pas concurrent.** Une bonne séance par an reste précieuse. Mais entre deux séances, ton truc devient pâle au bout de 4 mois — et pour une équipe de 5-10, faire venir un photographe au bureau (1 500-3 000 € + une journée bloquée) devient irrationnel quand chacun peut envoyer 4 selfies depuis son canapé en 2 min.

<div class="callout ok">
  <h4>39 € TTC · achat unique, pas d'abonnement</h4>
  <p>Tu paies une fois, le code est à toi <strong>à vie</strong>. Mises à jour gratuites, repo GitHub privé, ZIP autonome, livraison auto 2 minutes. Garantie remboursement 1 heure.</p>
</div>

<p style="text-align:center; margin: 36px 0 20px;"><a href="../precommande-photos-personal-branding.html" style="display:inline-block; background:#ef426f; color:white; padding:18px 36px; border-radius:8px; font-weight:600; font-size:18px; text-decoration:none;">Acheter à 39 € TTC →</a></p>

<p style="text-align:center; font-size:14px; opacity:0.7;">Pas développeur ? La page Paramètres te guide pas-à-pas, tu ne touches jamais un terminal. <a href="mailto:jeremy.sagnier@jerwis.fr">Écris-moi directement</a> si tu préfères payer autrement (virement, etc.).</p>


<!-- section k-teal -->

## Pour aller plus loin

Quelques liens si tu veux creuser le sujet :

1. **[fal.ai](https://fal.ai)** · la plateforme qui permet de générer des images via une dizaine de modèles (Seedream, FLUX, Nano Banana, GPT Image, Imagen…). Tarification à l'usage, créditer son compte de 20 € te donne déjà de quoi tester.
2. **[Mon guide Claude Code](../claude-code.html)** · si tu veux te lancer dans le développement de ce genre d'outil, c'est par là que je commence en général.
3. **[Le lexique IA](../lexique.html)** · pour comprendre les termes techniques (LoRA, polas, batch, queue) qui reviennent souvent dans le monde des modèles d'image.
4. **[Mes outils](../outils.html)** · les 6 outils que j'utilise tous les jours dans mon stack IA-développeur.

Si t'as fait ton propre générateur de photos personal branding ou que t'as testé Klayn, **réponds à la newsletter** et raconte-moi ce que t'as appris. C'est comme ça que mes prochains articles s'améliorent.
