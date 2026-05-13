---
slug: podcast-ia-pour-enfants
title: "Podcast IA pour enfants : making-of des 3 Petites Lanternes"
description: "Pourquoi j'ai construit un podcast 4-6 ans avec ElevenLabs au lieu de YouTube Kids. Stack IA, casting voix, 8 interdits validés en neurosciences."
og_title: "Un podcast IA pour mon fils, pas YouTube Kids"
og_description: "Pourquoi j'ai construit un podcast 4-6 ans avec ElevenLabs au lieu de YouTube Kids. Making-of complet."
date_published: 2026-05-13
date_modified: 2026-05-13
reading_time: 14 min
niveau: Débutant
outils: ElevenLabs + Python
schema_type: Article
category: Making-of
keywords_primary:
  - podcast IA pour enfants
  - podcast enfants 4-6 ans
  - alternative YouTube Kids
keywords_secondary:
  - ElevenLabs podcast français
  - créer podcast IA
  - podcast peur enfants
  - podcast trajet voiture enfant
  - voix IA française
faq:
  - q: "C'est quoi un podcast IA pour enfants ?"
    a: "Un podcast narratif dont la voix du conteur et celles des personnages sont générées par une IA (ici ElevenLabs v3) à partir d'un script écrit pour la cible 4-6 ans. La musique et les bruitages peuvent aussi être générés par IA. Le tout est assemblé en Python et masterisé aux normes podcast (-16 LUFS). Le résultat tient en 10-12 minutes par épisode."
  - q: "Pourquoi ne pas mettre mon enfant sur YouTube Kids ?"
    a: "YouTube Kids enchaîne les contenus via un algorithme entraîné à maximiser le temps d'écran. Les coupures pub et les contenus low-effort dominent. Sur un trajet voiture, tu n'as ni mise sur pause ni courbe d'attention contrôlée. Un podcast résolu en 10-12 minutes avec début, milieu, fin, sans cliffhanger ni stimulation extrême, est conçu pour s'arrêter avec le moteur."
  - q: "Combien coûte la production d'un épisode podcast IA ?"
    a: "Pour un épisode de 12 minutes : environ 22 € de quota ElevenLabs Creator par mois (sert pour 4-5 épisodes), plus quelques euros d'API Anthropic pour les sous-agents scénariste/musique/sound design. Le matériel : un laptop. Total marginal par épisode : entre 5 et 8 €. Compté en heures de travail : 4 à 6 heures de la recherche au master."
  - q: "Pourquoi 10-12 minutes par épisode ?"
    a: "Trois raisons. La durée moyenne d'un trajet école en France tourne autour de 10 minutes. L'attention auditive d'un enfant de 4 ans plafonne entre 10 et 15 minutes sur un récit non interactif. La boucle narrative (situation → péripéties → résolution) tient bien en 1 400 mots à 140 mots par minute. Au-delà, il faut un cliffhanger — interdit avant 6 ans."
  - q: "Quelle voix IA française est la meilleure pour un podcast enfants ?"
    a: "Sur ElevenLabs v3, deux voix tiennent la distance : Paul K (Deep French Narrator) pour le narrateur en mode 'conteur du soir' avec stability 0.75 et style 0.0, et Philippine (Animation Creator) pour les personnages enfants avec stability 0.50-0.60. Le réglage style au-dessus de 0.4 produit de l'instabilité qui sur-joue les émotions — interdit pour 4-6 ans (effrayant)."
  - q: "Faut-il être développeur pour produire un podcast IA ?"
    a: "Non. Le pipeline est en Python mais Claude Code l'écrit pour toi en quelques sessions. Ce qui demande du travail humain : le brief scénariste pour respecter les contraintes 4-6 ans, le casting voix par essais successifs, la sélection des prises à l'oreille, et le mastering final. Le reste — appels API, assemblage, encodage — est automatisé."
---

# Un podcast IA pour mon fils. Pas YouTube Kids. Voilà comment.

## TL;DR

- Pourquoi je n'arrivais plus à laisser mon fils sur YouTube Kids ni sur les playlists Spotify "histoires pour enfants"
- Le concept verrouillé : trois héros, une lanterne chacun, une peur par épisode, **boucle fermée obligatoire** (zéro cliffhanger avant 6 ans)
- La stack IA : **ElevenLabs v3** pour la voix, Python pour l'assemblage, mastering **EBU R128**
- **Deux voix, quatre personnages** : un narrateur + une voix caméléon qui joue trois enfants (modèle Brigitte Lecordier sur Sangoku)
- Les **8 interdits durs** validés en neurosciences 4-6 ans
- Coût marginal par épisode : **5 à 8 €**, 4 à 6 heures de prod

---

## Le déclic

Je ne suis pas dev. Je n'ai pas non plus pour ambition de devenir producteur audio. Mais à un moment, j'en ai eu marre.

Marre de tendre le téléphone à mon fils pour qu'il tienne 10 minutes dans la voiture. Marre de YouTube Kids qui enchaîne tout seul des contenus tournés par des chaînes asiatiques optimisées dopamine. Marre des playlists Spotify "histoires pour enfants" qui balancent du conte lu sans rythme, sans personnages récurrents, sans rien qui accroche un cerveau de 4 ans.

J'ai cherché. Pendant deux semaines. Je voulais quelque chose de précis : **un podcast en français, narratif, avec des héros récurrents, des épisodes auto-résolus de 10-12 minutes, et zéro pub**.

Je n'ai pas trouvé.

Sur le marché français, le format dominant des podcasts enfants tourne autour du conte lu seul — 53 % du catalogue. Quelques pépites narratives existent (*Bestioles*, *Octave et Mélo*, *Encore une histoire*), mais aucune ne coche les quatre cases en même temps : héros récurrents + format trajet + sujets utiles + ton enfantin moderne.

J'ai décidé de le construire.

---

## Les trois trous de marché

Avant d'écrire la première ligne de script, j'ai lancé **quatre sous-agents en parallèle** pour benchmarker le terrain. C'est la première règle que j'applique chaque fois que je veux entrer sur un sujet que je ne maîtrise pas : ne pas googler tout seul, déléguer la recherche.

Les quatre briefs :

1. **YouTube enfants 4-6 ans** : top chaînes FR, thèmes qui tournent, persos icônes, angles podcast actionnables
2. **Benchmark podcasts enfants FR** : top 15 du catalogue, format dominant, trous de marché
3. **Narratif et scripting 4-6 ans** : seuils cognitifs, vocabulaire, structure narrative, brief scénariste prêt à coller
4. **IP et concepts originaux** : risques Marvel/Disney, folklore exploitable, cinq concepts pitchables

Trois trous se sont dégagés en croisant les quatre rapports :

| Trou | Constat |
|---|---|
| **Fiction sérielle à héros récurrents** | Marché FR vide. Les héros récurrents existent en télé (Bluey, T'choupi) mais pas en audio podcast |
| **Utilité parentale concrète** | Les peurs d'enfance — noir, séparation, médecin, monstre, déménagement — sont un argument d'abonnement direct pour les parents |
| **Slot trajet école** | Le réseau VINCI Autoroutes a tenté la promo audio enfants. Personne d'autre. Le créneau 10 min est libre |

Pondéré différemment, c'est exactement le pitch d'un format qui n'existait pas.

---

## Le concept verrouillé : Les 3 Petites Lanternes

Le titre de travail est posé : **« Les 3 Petites Lanternes »**.

Pitch en une phrase : *Alma, Lewis et James, élèves d'une école française, ont découvert au grenier trois lanternes magiques. Chaque épisode, l'un des trois affronte une peur précise — sa lanterne s'allume, lui donne le pouvoir adapté, et l'aventure se résout AVANT la fin de l'épisode.*

Les règles de fer du concept :

- **Trois personnages nommés maximum par épisode** : le narrateur + le héros focal + une menace. Au-delà, l'enfant perd qui parle.
- **Une peur par épisode**, traitée et résolue. Pas de moitié, pas de suspense.
- **Catalogue infini** : plus de 30 peurs d'enfance déjà répertoriées (séparation, noir, école, chien, médecin, déménagement, orage, perte du doudou, naissance d'un frère, monstre sous le lit, premier sommeil hors maison).
- **Boucle fermée systématique** : le retour à l'apaisement est obligatoire. Pas de cliffhanger. La voiture peut s'arrêter à la fin de l'épisode et l'enfant descend serein.

Pourquoi cette rigidité ? Parce qu'avant 6 ans, **le cliffhanger n'est pas un effet narratif — c'est une anxiété résiduelle**. L'enfant ne sait pas que la suite arrive. Il garde la tension. Ça pourrit la suite de sa journée, et ça te pourrit la tienne dans la voiture.

---

## La stack IA

Toute la production tourne avec ces quatre briques :

- **ElevenLabs v3** pour la génération des voix narrateur et personnages (français natif, audio tags, contrôle prosodie)
- **Python + pydub + ffmpeg** pour l'assemblage : voix + musique + bruitages + ducking + transitions
- **EBU R128** comme norme de mastering audio (loudness standardisé, indispensable pour le trajet voiture)
- **Claude Sonnet** en sous-agent pour scénariste, music director et sound designer

Aucun studio. Aucune licence Pro Tools. Aucun ingé son humain.

Le moteur audio Python a été récupéré d'un projet précédent — un podcast Wondery adulte que j'avais commencé sur les guerres d'IA. **J'ai gardé le moteur, jeté la dramaturgie**. Réutiliser ce qui marche, c'est 80 % du gain.

> **Pourquoi pas un outil tout-en-un type Descript ou Resemble ?**
> Parce qu'aucun ne maîtrise les trois axes en même temps : qualité voix française enfant + contrôle fin du mastering + scripting agentique. Le pipeline Python me laisse le contrôle. Je peux régler le ducking à -20 dB sous la voix enfant au lieu du -15 dB standard adulte (je reviens sur ça plus bas).

---

## Le casting : deux voix, quatre personnages

Le pari fort de cette série : **une seule voix adulte joue les trois enfants**.

C'est le modèle Brigitte Lecordier — celle qui doublait simultanément Sangoku, Gohan ET Goten chez Toei. Une voix caméléon, plusieurs personnages, cohérence de timbre, facilité de prod.

Voici le casting verrouillé :

| Rôle | Voix ElevenLabs | Settings clés | Audio tags |
|---|---|---|---|
| **Narrateur** | Paul K — Deep French Narrator | stability=0.75, style=0.0 | `[warm]` `[gentle]` `[hushed wonder]` |
| **Alma** — lanterne rouge, leader doux | Philippine — Animation Creator | stability=0.55, style=0.10 | `[determined]` `[soft]` `[smiling]` |
| **Lewis** — lanterne bleue, rêveur | Philippine — Animation Creator | stability=0.60, style=0.05 | `[gentle]` `[curious]` `[whispering]` |
| **James** — lanterne jaune, espiègle | Philippine — Animation Creator | stability=0.50, style=0.15 | `[playful]` `[mischievous]` `[excited]` |

Trois choses qui ont surpris :

**Un.** Le narrateur grave est risqué pour les 4-6 ans (voix grave = autorité = menace dans le cerveau d'un enfant). On a contourné avec le **mode "conteur du soir"** : stability poussée à 0.75 (versus 0.65 pour un adulte), style verrouillé à 0.0 (zéro intensité dramatique), audio tags adoucis. Audition validée à l'oreille avant la production de l'épisode complet.

**Deux.** Au-dessus de **style = 0.4**, ElevenLabs devient instable et sur-joue les émotions. Sur un public adulte, c'est expressif. Sur un enfant de 4 ans, c'est effrayant. Règle interne verrouillée : `style > 0.4 = BANNI`.

**Trois.** Audio tags interdits sur cette série : `[serious tone]`, `[dramatic tone]`, `[urgent]`, `[grave]`. Tous évoquent une menace. Remplacés par `[warm]`, `[smiling]`, `[gentle]`, `[playful]`, `[tender]`, `[hushed wonder]`, `[chuckles softly]`. Le ton compte plus que l'intrigue à cet âge.

---

## Les 8 interdits durs validés en neurosciences 4-6 ans

C'est la liste que j'ai collée en tête de chaque brief scénariste. Chaque ligne vient de la recherche en psychologie infantile que j'ai fait synthétiser par sous-agent. Aucune n'est négociable.

1. **Zéro cliffhanger.** Fin résolue obligatoire, retour routine apaisé.
2. **Zéro ironie, second degré ou sarcasme.** Pris au pied de la lettre avant 7 ans.
3. **Zéro drone grave persistant.** Anxiogène et indéchiffrable avant 5-6 ans.
4. **Zéro méchant cruel.** Un « ronchon » maximum, vaincu rapidement, jamais ambivalent.
5. **Zéro climax tendu.** Pas de cri, pas de crescendo menaçant. Le parent au volant subit aussi.
6. **Zéro méta-référence adulte.** Ça parasite le rythme et c'est complètement raté par la cible.
7. **Pas plus de 3 répliques de dialogue consécutives** avant relance du narrateur. Sinon l'auditeur perd qui parle.
8. **Silences max 1,5 secondes.** Au-delà, décrochage attentionnel garanti.

C'est dur à tenir, surtout l'interdit 5. Toute la dramaturgie adulte repose sur le climax. Pour 4-6 ans, **le pic doit être joyeux ou apaisant, jamais tendu**.

---

## La structure d'épisode type

Chaque épisode suit la même architecture, sur 10-12 minutes. C'est le schéma quinaire de Larivaille appliqué au format trajet école.

| Minutage | Bloc | Fonction |
|---|---|---|
| 00:00 – 00:30 | **Jingle générique + accroche narrateur** | Ancrage série + thème de l'épisode |
| 00:30 – 02:00 | **Situation initiale** | Quotidien à l'école avec les trois héros |
| 02:00 – 02:30 | **Déclencheur** | La peur surgit dans le quotidien |
| 02:30 – 08:30 | **Péripéties** | Deux à trois obstacles, lanterne s'allume au pic |
| 08:30 – 09:30 | **Résolution** | Le héros vainc sa peur, retour des amis |
| 09:30 – 10:30 | **Boucle fermée** | Apaisement, refrain magique chanté |
| 10:30 – 11:00 | **Outro + teaser doux** | Annonce prochain épisode, ton apaisé |

La cible : **environ 1 400 mots de script total**, à 140 mots par minute lus par Paul K en mode posé.

Le refrain magique est répété **trois fois par épisode** (effet comptine, ancrage mnémonique). Forme : *« Petite lanterne, petite lumière, [souhait] pour [problème] »*.

---

## Le mastering : le détail qui change tout en voiture

Si tu retiens une seule décision technique de cet article, retiens celle-là.

Un podcast pour enfants écouté en voiture a un problème que n'a aucun autre format audio : **le bruit ambiant masque les sons doux**. Si tu mastérises comme un podcast adulte (-19 LUFS standard), le narrateur disparaît dans le bruit de route. Si tu pousses fort, la musique te défonce les oreilles au moment du pic.

La cible verrouillée pour cette série :

- **Loudness intégré : -16 LUFS** (versus -19 pour un podcast adulte standard, versus -14 pour un podcast news)
- **True peak : -1.5 dBTP** (marge de sécurité contre l'écrêtage en streaming)
- **Loudness range : 8 à 9 LU** (compressé, pas plat)
- **Ducking musique sous voix : -18 à -20 dB** (versus -15 dB standard adulte)

Le ducking à -20 dB sous la voix, c'est la modif clé. La musique reste perceptible mais ne masque jamais ce que dit Paul K. Sur un haut-parleur de voiture, ça fait passer la compréhension de 70 % à 95 % sur les enfants de 4 ans.

L'outil : un script `mastering.py` qui chaîne pydub pour l'assemblage, ffmpeg pour l'encodage, et pyloudnorm pour la mesure EBU R128. Le tout en 30 lignes utiles.

---

## Les chiffres réels du dernier épisode

Pour donner un ordre de grandeur concret, voici ce qu'a généré l'épisode 2 (*« Lewis et la peur de tomber »*, sorti de la chaîne le 11 mai) :

- **Durée finale** : 13 min 42 s
- **Taille** : 18,8 Mo en MP3
- **Segments assemblés** : 109
- **Prises voix générées** : 67 (narrateur + Lewis principalement)
- **Cues musicaux composés** : 14, tous distincts et joués en durée naturelle (pas de bouclage)
- **Bruitages diégétiques** : 34 (skatepark, béton, roulettes, chutes, encouragements parentaux)
- **Loudness mesuré final** : -16.1 LUFS / -1.5 dBTP / 8.5 LU
- **Coût marginal** : environ 6 € (ElevenLabs + Anthropic), hors quota mensuel
- **Temps de prod humain** : 5 heures (recherche + brief + sélection prises + mastering)

À comparer avec un podcast adulte produit en studio : compter facilement 1 500 à 3 000 € la journée, et trois jours minimum par épisode.

---

## Trois pièges sur lesquels j'ai buté

Aucune prod ne se passe sans accroc. Voici les trois trucs qui m'ont fait perdre une journée chacun.

### Le quota ElevenLabs qui explose en silence

Sur l'épisode 2, j'ai cramé tout le quota Creator (110 000 caractères) en 1 run de génération. Pourquoi ? Parce que **chaque émotion narratrice demande trois prises pour sélectionner la meilleure**, et chaque prise consomme l'intégralité du bloc. Soixante-sept lignes × 3 = 200 générations × ~600 caractères = 120 000 caractères.

Solution : surveiller le quota en amont, splitter le script en deux sessions si besoin, et **régénérer uniquement les prises ratées** au lieu de tout reprendre.

### Le bouclage musical qui sonne « tapis »

Au premier mastering de l'épisode 2, des cues de 22 secondes rebouclaient sous 60-90 secondes de scène. Résultat : monotonie audible immédiate. Un enfant de 4 ans ne sait pas dire ce qui cloche, mais décroche.

La règle verrouillée pour la suite : **chaque fichier musical est joué une fois, sa durée naturelle**. On cible 18 à 22 cues distincts par épisode de 12 minutes, soit un changement musical toutes les 30-40 secondes. Si un petit trou de 2-5 secondes apparaît, c'est OK — un enfant a besoin de respiration audio.

### Le bug silencieux dans le pipeline

Mon code de pipeline contenait un test `"OUT" in block.cue.upper()` censé détecter la fin d'un cue musical. Sauf que `"OUT"` matche aussi `"AJOUTÉE"` et `"fade out"`. Conséquence : **des cues étaient skippés sans message d'erreur**. J'ai mis trois heures à comprendre pourquoi certaines musiques manquaient dans le master.

Patché en `== "OUT"` strict. Leçon : sur un pipeline génératif, les bugs silencieux sont les plus chers à débugger. **Toujours logger ce qu'on saute, pas seulement ce qu'on traite.**

---

## Ce que j'en retire pour mon prochain projet IA

Cinq leçons que je vais réappliquer, pas seulement sur du podcast.

1. **Les sous-agents parallèles valent 10 heures de Google.** Quatre briefs lancés en même temps, quatre rapports lus en 30 minutes. Tout ce qui suit s'appuie dessus.
2. **Une voix caméléon battra trois voix mal castées.** La cohérence de timbre compte plus que la diversité. Vrai en audio, vrai aussi en illustration ou en UI.
3. **Le quota explose plus vite que la facture.** Sur les outils IA récurrents, surveille les unités consommées, pas le tarif mensuel.
4. **Le mastering compte autant que le contenu.** Sur tous les médias diffusés en mobilité, le réglage final fait la différence entre « audible » et « ignoré ».
5. **Les bugs silencieux sont les plus chers.** Logger ce qui est skippé, pas juste ce qui est traité. C'est vrai du pipeline audio comme de toute chaîne agentique.

---

## Pour qui c'est utile, et ce que tu peux en prendre

Si tu es **parent d'un gamin de 4 à 6 ans** : le pilote des 3 Petites Lanternes sort dans quelques semaines sur Spotify, Apple Podcasts et toutes les plateformes habituelles. Je préviendrai dans la newsletter quand c'est dispo.

Si tu veux **construire ton propre podcast IA** (pour enfants, ados, adultes, brand content, peu importe) : la stack que je décris ici est entièrement réplicable. Les fichiers Python d'assemblage et de mastering sortiront en open source dans le pack téléchargeable du site dès qu'ils sont stabilisés sur l'épisode 4.

Si tu es **prof, orthophoniste ou pédopsy** : les peurs traitées dans le catalogue (séparation, noir, médecin, etc.) sont issues du croisement de deux sources de recherche. Si tu vois un manque, écris-moi — je modifie la liste.

---

## Le pilote sort bientôt

Je continue à produire les épisodes pendant que tu lis cet article. Mon objectif : un catalogue de 10 épisodes prêts pour la rentrée scolaire, distribués sur les grandes plateformes.

Si tu veux que je te prévienne quand le pilote sort, l'inscription à la newsletter AI Playbook est en bas de la home. C'est aussi là que je partage tous les making-of futurs, et que je préviens quand un nouvel article sort.

Réponds à l'email, je lis tout.
