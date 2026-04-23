# 30 outils open source à connaître quand on n'est pas dev

Tu n'as pas besoin de savoir coder pour profiter de l'open source. La preuve : la plupart des outils ci-dessous s'installent en deux clics, comme une app classique. Tu télécharges, tu lances, tu utilises. La différence avec les logiciels propriétaires ? Pas d'abonnement mensuel qui grignote ton compte, pas de tes données qui partent dans un cloud opaque, et la garantie que l'outil ne va pas disparaître si l'éditeur se fait racheter.

J'ai rangé les 30 outils par usage. Pour chacun : ce qu'il remplace, sa license, le niveau de difficulté, comment l'installer, et surtout — la limite honnête. Parce qu'un outil open source n'est pas magique : si Photoshop te sert à survivre professionnellement, GIMP ne fera pas tout pareil. À toi de choisir ton compromis.

Légende difficulté :
- 😊 facile — installation deux clics, interface familière
- 😐 moyen — il faut une heure pour s'y faire, quelques tutos YouTube
- 😰 technique — prévoir du temps, parfois ligne de commande

---

## 1. Bureautique & docs (5 outils)

### LibreOffice 26.2.2

- **License** : MPL 2.0 (Mozilla Public License)
- **Remplace** : Microsoft Office (Word, Excel, PowerPoint)
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur libreoffice.org, double-clique, terminé
- **Pour qui** : si tu écris des lettres, fais des tableaux Excel, prépares des présentations occasionnelles. Lit et écrit les formats .docx, .xlsx, .pptx natifs.
- **Limite honnête** : la mise en forme complexe des fichiers Word avec macros VBA ou tableaux croisés dynamiques poussés peut casser. Pour de l'usage perso ou TPE, aucun souci. Pour un cabinet d'avocats qui vit dans Word avec 300 styles personnalisés, reste sur Microsoft.

La sortie 26.2 de février 2026 a apporté le support natif Markdown et des connecteurs dans Calc. C'est probablement la suite bureautique la plus mature de l'écosystème open source.

### OnlyOffice Docs

- **License** : AGPL v3
- **Remplace** : Google Docs / Microsoft 365 collaboratif
- **Difficulté** : 😐 moyen (auto-hébergé) — 😊 facile (version desktop)
- **Installation** : version desktop sur onlyoffice.com, ou via Docker pour la collab en ligne
- **Pour qui** : tu veux la collaboration temps réel à plusieurs sur un document, mais sans envoyer tes fichiers chez Google. La compatibilité avec les formats Microsoft est excellente — meilleure que LibreOffice sur ce point.
- **Limite honnête** : pour avoir la collab à plusieurs en temps réel, il faut auto-héberger un serveur (ou passer par Nextcloud, voir plus bas). C'est plus de boulot que de cliquer sur "partager" dans Google Docs.

### Joplin 3.4

- **License** : MIT
- **Remplace** : Notion, Evernote (pour la prise de notes)
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur joplinapp.org (Mac, Windows, Linux, iOS, Android)
- **Pour qui** : tu veux des notes Markdown synchronisées entre tous tes appareils, avec chiffrement de bout en bout, sans dépendre d'un cloud propriétaire. Tu choisis où ça se synchronise : Dropbox, OneDrive, Nextcloud, ou un serveur Joplin Cloud.
- **Limite honnête** : c'est de la note, pas une base de données. Si tu veux les bases relationnelles façon Notion (vues, tags croisés, formules dans des tables), Joplin ne le fera pas. Pour de la note simple et de l'archivage de connaissance, c'est top.

### Standard Notes

- **License** : AGPL v3
- **Remplace** : Apple Notes, Google Keep
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur standardnotes.com ou via l'App Store
- **Pour qui** : tu veux de la note ultra-simple, chiffrée par défaut, qui marche partout, et tu te fiches des fioritures. La phrase qui résume : "tes notes, chiffrées, point."
- **Limite honnête** : la version gratuite est très limitée (texte brut uniquement, pas de markdown enrichi, pas d'images dans les notes). Pour débloquer l'éditeur riche, les pièces jointes ou les graphiques, il faut payer ($90/an environ). Joplin est plus généreux dans sa version gratuite.

### CryptPad 2026.2

- **License** : AGPL v3
- **Remplace** : Google Docs / Office 365 chiffré
- **Difficulté** : 😊 facile
- **Installation** : pas d'installation — utilise cryptpad.fr directement dans ton navigateur, ou auto-héberge
- **Pour qui** : tu veux collaborer à plusieurs sur un document sans créer de compte, sans que personne (pas même CryptPad) ne puisse lire ce que tu écris. Le chiffrement se fait dans ton navigateur. Parfait pour partager un brouillon sensible avec un avocat ou un comptable.
- **Limite honnête** : interface qui sent encore le projet européen subventionné (les contrôles peuvent paraître datés). La version gratuite limite l'espace de stockage à 1 Go. Mais pour des sessions ponctuelles, c'est imbattable côté privacy.

---

## 2. Création visuelle, image, design (5 outils)

### GIMP 3.2.4

- **License** : GPL v3
- **Remplace** : Adobe Photoshop
- **Difficulté** : 😐 moyen
- **Installation** : télécharge sur gimp.org (Mac, Windows, Linux), ou via le Microsoft Store
- **Pour qui** : retouche photo, montage, détourage, création de visuels pour les réseaux sociaux. La version 3.2 sortie en mars 2026 a enfin amené les Link Layers (calques liés non destructifs) et les Vector Layers attendus depuis des années.
- **Limite honnête** : l'interface a longtemps été son point faible — elle s'améliore mais reste différente de Photoshop. Si tu fais du print pro avec des profils CMJN poussés ou que tu vis dans Photoshop 8h par jour, GIMP va te frustrer. Pour 90% des besoins amateurs et freelance, ça suffit largement.

### Inkscape 1.4

- **License** : GPL v2
- **Remplace** : Adobe Illustrator
- **Difficulté** : 😐 moyen
- **Installation** : télécharge sur inkscape.org
- **Pour qui** : logos, pictos, illustrations vectorielles, mise en page d'affiche simple. Le format SVG est natif — pratique si tu fais aussi du web.
- **Limite honnête** : le développement est lent (l'équipe est volontairement transparente : ils manquent de devs et recrutent). Pour de la PAO complexe (catalogues, magazines), regarde plutôt Scribus. Mais pour du logo ou de l'icône, Inkscape fait largement le job.

### Krita 5.3

- **License** : GPL v3
- **Remplace** : Photoshop, Procreate, Clip Studio Paint (pour la peinture digitale)
- **Difficulté** : 😐 moyen
- **Installation** : télécharge sur krita.org, ou via le Microsoft Store / Steam
- **Pour qui** : illustration, peinture digitale, BD, concept art. Les brosses sont excellentes, l'interface est pensée pour les artistes (pas les retoucheurs). La version 6.0 en bêta amène le texte éditable dans des formes vectorielles.
- **Limite honnête** : ce n'est PAS un logiciel de retouche photo. Si tu veux corriger des photos de famille, prends GIMP. Krita = peindre à partir de zéro, ou colorier des esquisses. Sur tablette graphique avec stylet pression, c'est un vrai bonheur.

### Penpot 2.x

- **License** : MPL 2.0
- **Remplace** : Figma (en partie Sketch, Adobe XD)
- **Difficulté** : 😐 moyen
- **Installation** : utilise penpot.app dans ton navigateur, ou auto-héberge
- **Pour qui** : tu fais du design d'interface (sites web, apps) et tu veux échapper au modèle Figma (qui appartient désormais à Adobe). Penpot 2.0 a apporté le support natif du CSS Grid — premier outil de design à le faire vraiment.
- **Limite honnête** : l'écosystème de plugins est microscopique comparé à Figma. Si tu travailles dans une équipe design qui partage des libraries Figma déjà construites, le switch va coûter cher. Pour démarrer un nouveau projet en solo, Penpot suffit.

### Darktable 5.0

- **License** : GPL v3
- **Remplace** : Adobe Lightroom
- **Difficulté** : 😰 technique (au début)
- **Installation** : télécharge sur darktable.org
- **Pour qui** : photographes qui shootent en RAW et veulent gérer leur catalogue + retouche non destructive sans abonnement Adobe. Le moteur de couleur est sérieux (espaces colorimétriques scéniques, scene-referred workflow).
- **Limite honnête** : la courbe d'apprentissage est rude. Darktable est puissant mais pas intuitif — prévois deux semaines pour t'y faire. Si c'est trop, regarde **RawTherapee** (GPL v3 aussi), un peu plus accessible. Pour de la simple retouche JPEG, GIMP suffit.

---

## 3. Audio & vidéo (5 outils)

### Audacity 3.7.5

- **License** : GPL v3 (uniquement)
- **Remplace** : enregistreur audio basique, Adobe Audition pour le simple
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur audacityteam.org
- **Pour qui** : enregistrer ta voix pour un podcast, nettoyer un audio, couper, fade, normaliser. La version 3.7 a amélioré la vitesse de démarrage et supporte enfin Windows ARM.
- **Limite honnête** : interface vieillotte assumée. Pour du mixage multi-pistes pro ou du mastering sérieux, regarde Reaper (pas open source mais pas cher) ou Ardour (open source mais payant pour le binaire — bizarrerie de license). Pour 95% des besoins, Audacity gagne.

### OBS Studio 32.1.1

- **License** : GPL v2
- **Remplace** : XSplit, Streamlabs Pro, et même certains studios virtuels
- **Difficulté** : 😐 moyen
- **Installation** : télécharge sur obsproject.com
- **Pour qui** : streaming Twitch/YouTube/Twitch, enregistrement d'écran pour tutos, captation de visio. C'est le standard dans le milieu — tu peux lancer une carrière de streamer sans jamais payer un centime de licence logicielle.
- **Limite honnête** : la première configuration est intimidante (scènes, sources, encodeurs, bitrate). Mais une fois en place, plus rien à toucher. Beaucoup de tutos disponibles.

### Kdenlive 24.x

- **License** : GPL v2+
- **Remplace** : Adobe Premiere Pro (pour usage non-pro)
- **Difficulté** : 😐 moyen
- **Installation** : télécharge sur kdenlive.org
- **Pour qui** : montage vidéo pour YouTube, vidéo familiale, projet associatif. Interface multi-pistes classique, support des proxy clips pour les machines modestes. L'édition 2026 a stabilisé le mixeur audio.
- **Limite honnête** : crash occasionnels selon les retours communauté. Sauvegarde souvent (Ctrl+S compulsif). Pour du montage complexe avec étalonnage poussé, regarde plutôt DaVinci Resolve (voir plus bas).

### Shotcut 24.x

- **License** : GPL v3
- **Remplace** : iMovie, Windows Movie Maker, Premiere Elements
- **Difficulté** : 😊 facile (à 😐 moyen)
- **Installation** : télécharge sur shotcut.org
- **Pour qui** : monteur débutant qui veut un truc cross-platform stable. Plus simple que Kdenlive d'apparence, plus calme côté crash. Idéal pour démarrer.
- **Limite honnête** : moins puissant que Kdenlive pour des projets longs et complexes. Si tu fais un court-métrage ambitieux, Kdenlive ou DaVinci offrent plus.

### DaVinci Resolve (mention spéciale, PAS open source)

- **License** : propriétaire (Blackmagic Design) — version gratuite ET commerciale
- **Remplace** : Premiere Pro, Final Cut Pro, et même After Effects en partie
- **Difficulté** : 😐 moyen à 😰 technique
- **Installation** : télécharge sur blackmagicdesign.com (création de compte gratuit obligatoire)
- **Pour qui** : tous ceux qui veulent du montage de niveau pro sans payer. Le moteur d'étalonnage est utilisé sur des films Hollywood. La version gratuite couvre 90% des besoins, y compris commerciaux.
- **Limite honnête** : ce n'est PAS open source. Le code source n'est pas accessible. Mais c'est gratuit, légalement utilisable en commercial, et reste le meilleur logiciel de montage gratuit du marché. Je le mentionne ici pour clarifier la confusion fréquente : "gratuit" n'égale pas "open source". DaVinci Resolve est gratuit mais propriétaire. Tu en dépends — si Blackmagic décide demain de tout faire payer, t'as zéro recours.

### Bonus : LMMS 1.3

- **License** : GPL v2+
- **Remplace** : FL Studio, Ableton Live (pour la prod basique)
- **Difficulté** : 😐 moyen
- **Installation** : télécharge sur lmms.io
- **Pour qui** : faire de la musique électronique, des beats, des compos MIDI sans payer FL Studio. Interface inspirée des trackers + DAW classique.
- **Limite honnête** : pas de pistes audio enregistrées (sampling oui, mais pas d'enregistrement live de guitare par-dessus). Pour ça, regarde Ardour ou Reaper.

---

## 4. IA générative open source (5 outils, sujet brûlant)

### Llama 4

- **License** : Llama 4 Community License (NON-OSI, restrictions commerciales)
- **Remplace** : ChatGPT (en local), Claude
- **Difficulté** : 😐 moyen avec Ollama (voir plus bas)
- **Installation** : `ollama pull llama4` une fois Ollama installé
- **Pour qui** : tu veux un LLM puissant qui tourne chez toi, sans envoyer tes prompts à OpenAI ou Anthropic. Llama 4 Scout 17B tourne sur 12 Go de VRAM — accessible avec une bonne carte graphique récente.
- **Limite honnête** : la license Llama interdit l'usage si tu as plus de 700 millions d'utilisateurs actifs (clause anti-Google) et impose une attribution. Ce n'est pas reconnu comme "open source" par l'OSI — on parle plutôt d'"open weights". C'est libre pour l'usage perso ou TPE, fais juste attention si tu deviens méga-startup.

### Mistral Small 3.2

- **License** : Apache 2.0 (sur les modèles "open")
- **Remplace** : ChatGPT, Claude
- **Difficulté** : 😐 moyen
- **Installation** : `ollama pull mistral-small`
- **Pour qui** : tu veux une vraie license open source (pas une "community license" bidon comme Llama) sur un modèle français de qualité. Mistral Small 3.2 est excellent à 16 Go de RAM.
- **Limite honnête** : seuls les "petits" modèles Mistral sont sous Apache 2.0. Les modèles haut de gamme (Mistral Large 3) sont propriétaires, accessibles via leur API payante. Pour de l'usage local, les versions open suffisent largement.

### Stable Diffusion 3.5 / FLUX.1

- **License** : Stable Diffusion 3.5 → CreativeML Open RAIL+M (commercial OK avec restrictions sur le contenu nuisible) ; FLUX.1-schnell → Apache 2.0 ; FLUX.1-dev → non-commercial
- **Remplace** : Midjourney, DALL·E
- **Difficulté** : 😰 technique au départ (😐 avec une interface comme ComfyUI ou Automatic1111)
- **Installation** : télécharge ComfyUI (le plus utilisé en 2026) et load les checkpoints depuis HuggingFace
- **Pour qui** : tu veux générer des images IA en local, sans crédit mensuel, sans envoyer tes prompts à un service tiers. Idéal pour iterer 200 fois sur une variation jusqu'à trouver le bon résultat.
- **Limite honnête** : il faut une carte graphique correcte (8 Go de VRAM minimum, idéalement 12+). Sur Mac M1/M2/M3, ça tourne mais plus lentement. La courbe d'apprentissage de ComfyUI (interface en nodes) est raide. FLUX.1 donne aujourd'hui de meilleurs résultats que Stable Diffusion sur les portraits photoréalistes.

### Whisper (OpenAI)

- **License** : MIT
- **Remplace** : Otter.ai, Trint, Sonix (transcription audio)
- **Difficulté** : 😐 moyen
- **Installation** : via Python `pip install openai-whisper`, ou via apps grand public comme MacWhisper (payant) ou WhisperX
- **Pour qui** : transcrire des podcasts, interviews, réunions, en local, gratuitement, dans 99 langues. Le français est très bien supporté.
- **Limite honnête** : OpenAI a publié Whisper en open source en 2022 et continue à le maintenir, mais les versions plus récentes (Whisper Large v3) demandent une bonne machine. Pour utiliser sans douleur sur Mac, `MacWhisper` (interface payante) ou `WhisperKit` simplifient énormément.

### Ollama 0.5+

- **License** : MIT
- **Remplace** : pas un remplaçant — c'est l'outil qui te permet de lancer Llama, Mistral, etc. en local
- **Difficulté** : 😊 facile (étonnamment)
- **Installation** : télécharge ollama.com, double-clique l'installeur
- **Pour qui** : toi, si tu veux essayer un LLM en local sans te prendre la tête. Une fois installé : `ollama run mistral` et tu chates en terminal. Combine avec **Open WebUI** (License BSD) pour avoir une interface ChatGPT-like en local.
- **Limite honnête** : pour de l'usage occasionnel, l'inférence sur CPU est lente. Tu profites pleinement avec une bonne carte graphique ou un Mac Apple Silicon récent (M2 et au-delà). Pour une interface plus visuelle et facile, regarde **LM Studio** (gratuit mais propriétaire — encore un piège "free ≠ open source").

---

## 5. Communication & collaboration (5 outils)

### Mattermost

- **License** : MIT (édition Team) / commerciale (Enterprise)
- **Remplace** : Slack, Microsoft Teams
- **Difficulté** : 😰 technique (auto-hébergé) — 😊 facile (cloud Mattermost)
- **Installation** : Docker pour auto-héberger, ou souscrire au cloud Mattermost
- **Pour qui** : équipe qui veut une alternative à Slack sans envoyer ses conversations chez Salesforce. Interface très proche de Slack — la transition est indolore.
- **Limite honnête** : pour l'auto-héberger, il faut un serveur (VPS ~10€/mois) et savoir manipuler Docker. Sinon **Rocket.Chat** (MIT) est une alternative très proche, parfois plus simple à déployer.

### Jitsi Meet

- **License** : Apache 2.0
- **Remplace** : Zoom, Google Meet
- **Difficulté** : 😊 facile (utilisation) — 😰 technique (auto-héberger)
- **Installation** : utilise meet.jit.si directement dans le navigateur, ou auto-héberge
- **Pour qui** : visio rapide à 2-15 personnes, sans création de compte, lien partageable instantanément. Parfait pour un appel client one-shot.
- **Limite honnête** : au-delà de 30 participants sur le serveur public, ça lague. Pas de fonction "salles d'attente" aussi fluide que Zoom. Pour un usage régulier en équipe, auto-héberger est mieux.

### BigBlueButton 2.7

- **License** : LGPL v3
- **Remplace** : Zoom (pour la formation/éducation)
- **Difficulté** : 😰 technique (auto-héberger uniquement)
- **Installation** : nécessite un serveur Ubuntu dédié et un peu de configuration
- **Pour qui** : profs, formateurs, écoles. Conçu spécifiquement pour le cours en ligne : tableau blanc partagé, sondages, sessions de groupe (breakout rooms), enregistrement automatique.
- **Limite honnête** : pas de version SaaS officielle, donc l'auto-hébergement est obligatoire. Beaucoup de prestataires éducatifs proposent des instances clé en main payantes. Pour une visio business classique, Jitsi est plus simple.

### Element (sur Matrix)

- **License** : AGPL v3
- **Remplace** : Signal, Telegram, WhatsApp (en partie)
- **Difficulté** : 😊 facile (client) — 😰 technique (serveur)
- **Installation** : télécharge Element sur element.io, crée un compte sur matrix.org (gratuit) ou sur ton serveur
- **Pour qui** : tu veux une messagerie chiffrée, fédérée (comme l'email — ton serveur peut parler à un autre serveur), avec audio/vidéo. La fédération veut dire que personne ne contrôle l'écosystème.
- **Limite honnête** : la complexité du protocole Matrix se voit parfois (bugs de chiffrement, sync lente entre appareils). Pour une messagerie ultra-simple grand public, Signal reste plus user-friendly (et lui aussi open source — GPL v3).

### Nextcloud Hub 30+

- **License** : AGPL v3
- **Remplace** : Google Drive, Microsoft 365, Dropbox + un peu Notion
- **Difficulté** : 😐 moyen (avec hébergeur clé en main) — 😰 technique (auto-héberger soi-même)
- **Installation** : passe par un hébergeur Nextcloud (Hetzner, Webo Facto, etc.) ou installe via Docker
- **Pour qui** : tu veux une suite collaborative complète (fichiers, calendrier, contacts, notes, visio via Talk, édition de docs via OnlyOffice intégré). Le couteau suisse open source.
- **Limite honnête** : c'est un gros morceau. Si tu veux juste du stockage de fichiers, c'est sur-dimensionné — regarde Syncthing (peer-to-peer, MPL 2.0) pour de la simple synchro de dossiers entre appareils.

---

## 6. Productivité, navigation & divers (5 outils)

### VS Code

- **License** : MIT (le code source) — mais Microsoft distribue un binaire avec télémétrie propriétaire (utilise **VSCodium** pour la version 100% libre)
- **Remplace** : Sublime Text, Atom, JetBrains pour pas mal de cas
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur code.visualstudio.com (ou vscodium.com pour la version dégooglisée)
- **Pour qui** : ouvrir/éditer du texte, du code, du Markdown, des fichiers de config. Même si tu n'es pas dev, c'est un excellent éditeur de texte évolué — meilleur que TextEdit ou Bloc-notes.
- **Limite honnête** : l'éditeur lui-même est open source (MIT), mais Microsoft ajoute des marketplace d'extensions et de la télémétrie qui ne le sont pas. Si tu es maximaliste sur la pureté, prends VSCodium.

### Firefox

- **License** : MPL 2.0
- **Remplace** : Chrome, Edge, Safari
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur mozilla.org
- **Pour qui** : tout le monde. Le seul navigateur grand public encore vraiment indépendant de Google et Apple. Excellente gestion vie privée par défaut, conteneurs multi-comptes très pratiques.
- **Limite honnête** : Mozilla est financée à 80% par Google (paiement pour rester moteur de recherche par défaut). Ce n'est pas un problème open source en soi (le code reste libre), mais ça soulève des questions de gouvernance. Ça reste, et de loin, la meilleure alternative à Chrome.

### Brave

- **License** : MPL 2.0 (le navigateur en lui-même)
- **Remplace** : Chrome avec adblocker
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur brave.com
- **Pour qui** : tu veux un navigateur basé sur Chromium (donc compatible avec toutes les extensions Chrome) avec un bloqueur de pub/tracker activé par défaut, et de bonnes performances.
- **Limite honnête** : Brave a des composants commerciaux non open source (le programme Brave Rewards basé sur le token BAT, certains services). Le moteur du navigateur reste libre. Pour la pureté maximale, Firefox ou **LibreWolf** sont meilleurs choix.

### Bitwarden 2026.4

- **License** : GPL v3
- **Remplace** : 1Password, LastPass, Dashlane
- **Difficulté** : 😊 facile
- **Installation** : télécharge sur bitwarden.com (apps mobiles, extensions navigateur, desktop)
- **Pour qui** : si tu n'utilises PAS encore de gestionnaire de mots de passe, arrête tout et installe ça aujourd'hui. C'est gratuit, ça marche partout, ça stocke aussi tes notes sécurisées et tes 2FA. Version Premium à $10/an pour quelques fonctions avancées.
- **Limite honnête** : pour les paranos, l'instance officielle Bitwarden héberge tes données (chiffrées de bout en bout, certes). Si tu veux tout chez toi, auto-héberge **Vaultwarden** (un fork open source compatible Bitwarden, AGPL v3) sur un Raspberry Pi.

### Plausible Analytics

- **License** : AGPL v3
- **Remplace** : Google Analytics
- **Difficulté** : 😐 moyen (cloud) — 😰 technique (auto-héberger)
- **Installation** : abonne-toi sur plausible.io (~9€/mois) ou auto-héberge via Docker
- **Pour qui** : tu as un site web et tu veux savoir combien de visiteurs, d'où ils viennent, sans cookie banner RGPD à valider, sans envoyer les données chez Google. Interface ultra-simple, rapport en une page lisible par n'importe qui.
- **Limite honnête** : tu n'auras pas la profondeur d'analyse de Google Analytics (entonnoirs complexes, segments avancés, machine learning). Pour 95% des sites, c'est largement suffisant et beaucoup plus respectueux. Alternative plus simple : **Umami** (MIT) — encore plus light.

### Bonus mention : Mautic + Home Assistant

- **Mautic** (GPL v3) : alternative à Mailchimp/HubSpot pour l'email marketing automation. 😰 technique à installer mais puissant. Idéal si tu envoies des newsletters à plus de 10k contacts (au-dessus de quoi Mailchimp devient cher).
- **Home Assistant** (Apache 2.0) : la référence open source en domotique. Connecte ampoules, thermostats, caméras, sans cloud propriétaire. 😐 moyen à 😰 technique. Le Raspberry Pi 5 + Home Assistant OS est devenu un classique 2026.

---

## 7. Comment vérifier qu'un outil est VRAIMENT open source

Le mot "open source" est utilisé à toutes les sauces — y compris par des outils qui ne le sont pas (DaVinci Resolve, Discord, la version gratuite de Notion, Zoom). Voici quatre critères pratiques pour ne pas se faire avoir.

### Critère 1 — License clairement affichée et reconnue par l'OSI

L'**Open Source Initiative** maintient une liste officielle des licenses qui méritent vraiment le label "open source" : opensource.org/licenses. Si la license d'un outil n'est pas dans cette liste, méfie-toi. Les principales légitimes :

- **MIT** — la plus permissive, fais ce que tu veux
- **Apache 2.0** — permissive avec protection brevets
- **GPL v2 / v3** — copyleft, toute modif doit rester libre
- **AGPL v3** — comme GPL mais s'applique aussi quand tu héberges le service en ligne
- **MPL 2.0** — copyleft "fichier par fichier", entre les deux
- **BSD** — quasi équivalent à MIT
- **LGPL** — variante de GPL pour les bibliothèques

Si un outil dit "Source Available" ou "Business Source License" (BSL), ce n'est PAS open source au sens strict — c'est un code visible mais avec restrictions d'usage commercial. C'est mieux que rien, mais ne te leurre pas sur le statut.

### Critère 2 — Code source accessible publiquement

Va sur GitHub, GitLab, Codeberg, ou le site officiel. Tu dois pouvoir voir le code, le télécharger, le modifier. Cherche le repo officiel (pas un fork random). Vérifie les indicateurs :

- Combien d'étoiles ?
- Date du dernier commit (vieux d'un an = projet probablement mort)
- Nombre de contributeurs
- Présence d'un fichier LICENSE clairement nommé

### Critère 3 — Build reproductible (avancé)

L'idéal : tu peux compiler toi-même le binaire à partir du code source, et obtenir exactement le même fichier que celui distribué officiellement. Ça garantit qu'aucun code "secret" n'a été ajouté entre le code public et le binaire que tu télécharges. Peu d'outils grand public arrivent à ce niveau (Tor Browser, certains modules Bitcoin, F-Droid pour les apps Android). Pour la majorité des usages non-dev, ce critère est moins crucial — mais c'est un bon signal de sérieux.

### Critère 4 — Communauté active et mainteneurs identifiables

Tu dois pouvoir savoir qui maintient l'outil. Une fondation (Mozilla, Document Foundation, Apache Foundation) c'est rassurant. Un dev solo, c'est plus risqué — si la personne perd intérêt, le projet meurt.

Bons indicateurs de santé :

- Issues GitHub avec réponses récentes (pas seulement des bugs ouverts qui pourrissent)
- Pull requests merged régulièrement
- Forum ou Matrix/Discord communautaire actif
- Roadmap publique
- Releases régulières (tous les 3-6 mois minimum)

### Méfie-toi du "free" qui n'est pas "open"

Quelques pièges fréquents :

| Outil | Statut | Réalité |
|---|---|---|
| DaVinci Resolve | "Free" | Propriétaire — Blackmagic peut tout fermer demain |
| Discord | "Free" | Propriétaire, télémétrie massive |
| Notion (gratuit) | "Free" | Propriétaire, tes données chez eux |
| LM Studio | "Free" | Propriétaire malgré l'image "indie" |
| Skype | "Free" | Propriétaire Microsoft |
| Zoom | "Free" | Propriétaire avec polémiques privacy |

Ce sont des outils légitimes, parfois excellents — mais "gratuit" ne veut pas dire "libre". Tu dépends de l'éditeur. Du jour où il change d'avis (rachat, faillite, pivot), tu perds tout. L'open source garantit que même si l'éditeur disparaît, le code reste, et un autre peut reprendre le flambeau (c'est ce qui s'est passé avec OpenOffice → LibreOffice après le rachat par Oracle).

---

## En résumé

L'écosystème open source en 2026 est mature, varié, accessible. Tu peux remplacer 80% de ta stack propriétaire sans rien perdre en qualité, juste en investissant un peu de temps d'apprentissage. Les 20% restants — Photoshop pour les retoucheurs pro, Excel avec macros VBA héritées, Final Cut pour les monteurs Apple — restent des cas où le propriétaire garde une vraie avance. Pour tout le reste, l'open source fait le job, gratuitement, sans abonnement, sans ta vie privée en otage.

Le pire qui puisse t'arriver en essayant : tu désinstalles. Le meilleur : tu économises 200€/an d'abonnements et tu reprends le contrôle de tes données.
