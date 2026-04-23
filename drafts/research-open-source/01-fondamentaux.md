# Open source : les fondamentaux et les licences

> Section 1 du tuto. Public : entrepreneur curieux, pro pressé, débutant qui hésite. Ton Leo.

---

## 1. C'est quoi, exactement ?

L'open source, c'est du code informatique qu'on a le droit de **lire**, de **modifier** et de **redistribuer**. Imagine une recette de cuisine publiée en entier, avec la liste des ingrédients et chaque étape : tu peux la cuisiner, la changer, et la repartager modifiée. Pour qu'un logiciel mérite vraiment l'étiquette « open source », il doit cocher 10 critères très précis posés par l'**Open Source Initiative** (OSI), une association de référence créée en 1998. Pas de petits caractères, pas d'exclusions par profession, pas de « gratuit pour les particuliers seulement ».

Sans ces 10 critères, ce n'est plus de l'open source. C'est autre chose. Et la nuance compte beaucoup, comme tu vas voir.

---

## 2. Trois distinctions critiques

### 2.1. Open source vs free software

C'est la querelle historique. Deux écoles, deux mots, presque les mêmes logiciels.

| Camp | Mot d'ordre | Référence | Argument central |
|---|---|---|---|
| **Free Software** (FSF, Stallman, 1985) | Liberté de l'utilisateur | gnu.org | C'est un sujet **éthique** : enfermer l'utilisateur dans du code qu'il ne peut pas lire est immoral. |
| **Open source** (OSI, 1998) | Qualité technique du code | opensource.org | C'est un sujet **pragmatique** : le code ouvert produit de meilleurs logiciels, c'est tout. |

Stallman défend les **4 libertés essentielles** :

- **Liberté 0** : exécuter le programme pour n'importe quel usage
- **Liberté 1** : étudier le code et le modifier
- **Liberté 2** : redistribuer des copies pour aider les autres
- **Liberté 3** : redistribuer tes versions modifiées

Et la phrase culte : **« Free as in freedom, not as in beer »** (libre comme dans liberté, pas comme dans bière gratuite). En anglais, « free » veut dire « libre » et « gratuit », d'où l'ambiguïté. En français on a deux mots, donc moins de confusion. Le free software peut être payant. Tu peux vendre une copie de Linux, c'est légal.

**En pratique** : 95 % des logiciels « open source » sont aussi du « free software ». Mais Stallman te dira que parler d'« open » au lieu de « libre », c'est avoir oublié pourquoi on s'est battus au départ. Pour un débutant : retiens juste que c'est le même camp, séparé par une dispute philosophique vieille de 30 ans.

### 2.2. Open source vs « source available »

Là, ça devient piégeux. Beaucoup d'éditeurs publient leur code mais avec des restrictions qui violent les 10 critères OSI. Résultat : tu peux **lire** le code, mais tu n'as pas tous les droits dessus. C'est ce qu'on appelle **« source available »** (« code consultable »). Ce n'est **pas** de l'open source.

Trois exemples récents qui ont fait du bruit :

| Éditeur | Date | Ancienne licence | Nouvelle licence | Pourquoi ce n'est plus open source |
|---|---|---|---|---|
| **HashiCorp** (Terraform) | Août 2023 | MPL 2.0 (open source) | BSL (Business Source Limited) | Interdit aux concurrents d'offrir Terraform en service managé pendant 4 ans. |
| **Redis** | Mars 2024 | BSD (open source) | RSALv2 + SSPL | Interdit aux clouds (AWS, Google) de revendre Redis as a Service. |
| **Elastic** (Elasticsearch) | 2021 puis revirement 2024 | Apache 2 (open source) | Elastic License + SSPL | Même logique anti-AWS. (Elastic est revenu en arrière en août 2024 en ajoutant l'AGPL v3.) |

**Pourquoi ils ont fait ça ?** Parce qu'AWS prenait leur logiciel, le rebrandait, et gagnait plus d'argent qu'eux avec **leur** code. Logique d'éditeur, on comprend. Mais en blindant la licence, ils ont cassé la promesse open source. La communauté a réagi en forkant (en créant des copies sous l'ancienne licence) :

- Terraform → **OpenTofu** (porté par la Linux Foundation)
- Redis → **Valkey** (porté par AWS et Google)
- Elasticsearch → **OpenSearch** (porté par AWS)

Conclusion à retenir : **« source available » = code visible mais usage restreint**. Tu peux regarder, tu ne peux pas tout faire avec. L'OSI considère que la SSPL et la BSL ne sont pas des licences open source, point final.

### 2.3. Open source vs « open weights » (spécial IA)

Cette distinction est récente, elle date surtout de l'explosion des LLM (les grands modèles de langage genre ChatGPT). En IA, un modèle, c'est trois choses :

1. **L'architecture** : la structure du réseau de neurones (les plans du moteur)
2. **Les données d'entraînement** : les milliards de textes/images qu'on a montrés au modèle
3. **Les poids** (weights) : les milliards de chiffres ajustés pendant l'entraînement (le réglage final du moteur)

Quand Meta sort **Llama** ou Mistral sort **Mistral 7B**, ils publient **les poids**. Tu peux télécharger le modèle, le faire tourner chez toi, l'adapter à ton usage. Ça s'appelle **« open weights »**. Mais l'architecture exacte, le code d'entraînement, et surtout les données utilisées restent souvent secrets.

L'OSI a publié en octobre 2024 une définition officielle : la **OSAID 1.0** (Open Source AI Definition). Pour qu'un modèle soit vraiment open source, il faut :

- Le code d'entraînement
- Suffisamment d'infos sur les données pour qu'un humain puisse « substantiellement reproduire » le modèle
- Les poids
- Une licence sans restrictions discriminatoires

Verdict de l'OSI sur les modèles connus :

| Modèle | Open source selon OSAID ? | Pourquoi |
|---|---|---|
| **Llama 3** (Meta) | Non | Restrictions commerciales (au-dessus de 700M d'utilisateurs), pas de données d'entraînement publiées |
| **Mistral 7B** (Mistral) | Poids sous Apache 2 mais pas de data | « Open weights », pas open source au sens OSAID |
| **OLMo** (AI2) | Oui | Tout publié, code + data + poids |
| **Pythia** (EleutherAI) | Oui | Idem |

Concrètement : si tu lis « Llama est open source », c'est inexact. Llama est **open weights**. Nuance importante quand tu choisis un modèle pour ton entreprise (la licence Llama interdit certains usages, contrairement à un vrai open source).

---

## 3. Une histoire en 5 étapes

### Avant 1980 : tout le monde partageait

Dans les années 50-60, le logiciel n'était pas un produit. IBM vendait des machines très chères, et le code venait avec, gratuitement, source comprise. Les universités s'échangeaient leurs programmes par cartes perforées et bandes magnétiques. Des associations comme **SHARE** (créée en 1955 par les utilisateurs IBM) faisaient circuler le code librement. C'était la culture par défaut.

Tout bascule à la fin des années 70 : le logiciel devient un produit séparé du matériel, avec licence et secret industriel. Microsoft naît en 1975 sur ce modèle.

### 1983-1985 : Stallman invente le mouvement

**Richard Stallman**, chercheur au MIT, en a marre. Il ne peut plus modifier les drivers de ses imprimantes (le code est fermé). En 1983, il lance le projet **GNU** (« GNU's Not Unix », un acronyme récursif geek) : recréer un système d'exploitation entièrement libre. En 1985, il fonde la **Free Software Foundation** (FSF). En 1989, il publie la première version de la **GPL** (GNU General Public License), qui invente le concept de **copyleft** : « si tu utilises mon code, tu dois publier le tien aux mêmes conditions ». C'est viral : la liberté se transmet, légalement.

### 1991 : Linus Torvalds publie Linux

Le projet GNU avait presque tout sauf le **kernel** (le cœur du système qui parle au matériel). En août 1991, **Linus Torvalds**, étudiant finlandais de 21 ans, poste sur Usenet : « Je fais un OS libre, juste un hobby, ne sera pas gros et professionnel comme GNU. » Il lâche son code sous GPL en 1992. Combiné aux outils GNU, ça donne le système qu'on appelle aujourd'hui **GNU/Linux** (ou juste Linux). Aujourd'hui, Linux fait tourner 96 % des serveurs web, tous les supercalculateurs du top 500, et environ 70 % des smartphones (Android est basé dessus).

### 1998 : naissance du terme « open source »

Janvier 1998, coup de tonnerre : **Netscape** ouvre le code source de son navigateur (qui deviendra Mozilla puis Firefox). Quelques semaines plus tard, à Palo Alto, un petit groupe (**Eric Raymond**, **Bruce Perens**, **Christine Peterson**, et d'autres) se réunit et invente le terme **« open source »**. Pourquoi changer ? Parce que « free software » faisait peur aux entreprises (« libre = gratuit = pas pro »). « Open source » sonne plus business, plus pragmatique. Ils créent l'**OSI** (Open Source Initiative) dans la foulée. Stallman a refusé le rebranding, considérant que ça vidait le mouvement de son sens éthique. La fracture date de là, et elle n'a jamais été refermée.

### 2000-2026 : explosion totale

Quelques jalons :

- **2000** : Sun ouvre OpenOffice
- **2001** : Apple sort Mac OS X basé sur du BSD
- **2004** : Firefox 1.0
- **2008** : Android (kernel Linux) et création de **GitHub**, qui rend la collaboration triviale
- **2014** : Microsoft ouvre .NET, change radicalement de doctrine
- **2016** : Microsoft ouvre VS Code (MIT)
- **2018** : Microsoft rachète GitHub pour 7,5 milliards
- **2019-2024** : pivots de licence (HashiCorp, Elastic, Redis) → fragmentation
- **2023-2026** : explosion de l'IA ouverte : Llama, Mistral, DeepSeek, et la définition OSAID 1.0 en octobre 2024

Aujourd'hui, plus de 90 % des logiciels d'entreprise contiennent au moins un composant open source.

---

## 4. Les 8 licences à connaître

C'est le cœur du sujet. Une licence, c'est le **contrat juridique** qui dit ce que tu as le droit de faire avec le code. Trois grandes familles :

- **Permissive** : « fais ce que tu veux, garde juste mon nom »
- **Copyleft fort** : « si tu modifies et redistribues, tu dois publier tes modifs sous la même licence »
- **Copyleft faible** : « copyleft seulement sur mes fichiers, pas sur ton produit qui les utilise »

### 4.1. MIT

- **Type** : permissive (la plus permissive de toutes)
- **Droits** : utiliser commercialement · modifier · redistribuer · sous-licencier
- **Obligations** : mention du copyright et de la licence d'origine. C'est tout.
- **Cas d'usage** : tu veux maximiser l'adoption, tu te fiches que des entreprises ferment leur code à partir du tien. Idéal pour une lib JavaScript ou un outil de dev.
- **Exemples** : **React** (Facebook), **Ruby on Rails**, **Node.js**, **jQuery**, **Angular**, **VS Code**

### 4.2. Apache 2.0

- **Type** : permissive (avec une protection brevets en plus)
- **Droits** : utiliser commercialement · modifier · redistribuer · usage des brevets
- **Obligations** : mention copyright + licence + indiquer les changements faits + ne pas utiliser les marques de l'auteur
- **Cas d'usage** : projet d'entreprise, plus juridiquement blindé que MIT, important si ton projet manipule des brevets logiciels
- **Exemples** : **Android** (Google), **Kubernetes**, **TensorFlow**, **Apache Kafka**, **Mistral 7B** (les poids)

### 4.3. BSD 3-Clause

- **Type** : permissive (très proche de MIT)
- **Droits** : utiliser commercialement · modifier · redistribuer
- **Obligations** : mention copyright + licence + interdiction d'utiliser le nom des auteurs pour faire la promo de ton produit dérivé
- **Cas d'usage** : très proche de MIT, historiquement utilisée par les universités américaines (Berkeley) et tous les *BSD
- **Exemples** : **FreeBSD**, **OpenBSD**, **Flutter**, **LevelDB**, **Quill**

### 4.4. GPL v2

- **Type** : copyleft fort
- **Droits** : utiliser commercialement · modifier · redistribuer
- **Obligations** : publier le code source · garder la même licence sur les modifs · documenter les changements · mention copyright
- **Cas d'usage** : tu veux que ton projet reste libre, peu importe qui le reprend. Modèle communautaire.
- **Exemples** : **Linux** (le kernel), **Git**, **WordPress**, **VLC**, **MySQL**

### 4.5. GPL v3

- **Type** : copyleft fort (version durcie)
- **Droits** : idem GPL v2 + usage des brevets explicite
- **Obligations** : idem GPL v2 + protection contre la **« tivoïsation »** (interdire que quelqu'un mette ton code dans un appareil verrouillé sans donner les moyens de le modifier sur l'appareil)
- **Cas d'usage** : même esprit que GPL v2 mais adapté au monde post-2007 (DRM, brevets logiciels). Linus Torvalds a refusé de passer Linux en GPL v3, jugée trop restrictive.
- **Exemples** : **GNU Bash**, **GIMP**, **Inkscape**

### 4.6. AGPL v3

- **Type** : copyleft fort + clause réseau
- **Droits** : idem GPL v3
- **Obligations** : idem GPL v3 + **si tu utilises le logiciel sur un serveur accessible par réseau, tu dois publier tes modifs**, même si tu ne distribues pas le binaire
- **Cas d'usage** : tu veux empêcher AWS et compagnie de prendre ton code, le faire tourner en cloud, et ne rien rendre à la communauté. C'est la licence anti-cloud par excellence.
- **Exemples** : **MongoDB** (jusqu'en 2018) · **Mastodon** · **Nextcloud** · **Elasticsearch** (depuis août 2024 en option)

### 4.7. LGPL (Lesser GPL)

- **Type** : copyleft faible
- **Droits** : utiliser commercialement · modifier · redistribuer
- **Obligations** : si tu modifies la lib elle-même, tu dois publier tes modifs. Mais tu peux **lier** la lib dans un produit propriétaire sans rendre ton produit open source.
- **Cas d'usage** : librairie qui veut garder ses propres modifs ouvertes, mais sans contaminer toute appli qui l'utilise
- **Exemples** : **glibc** (la lib C de GNU), **GTK** (toolkit graphique), **FFmpeg** (parties)

### 4.8. MPL 2.0 (Mozilla Public License)

- **Type** : copyleft faible (au niveau du fichier)
- **Droits** : utiliser commercialement · modifier · redistribuer · usage des brevets
- **Obligations** : si tu modifies un fichier sous MPL, tes modifs de ce fichier doivent rester sous MPL. Le reste de ton projet peut être propriétaire.
- **Cas d'usage** : compromis intelligent entre permissif et copyleft. Adopté par Mozilla pour Firefox.
- **Exemples** : **Firefox**, **Thunderbird**, **LibreOffice** (parties), **Terraform** (avant le pivot 2023)

### Tableau décisionnel : « si tu veux X, choisis Y »

| Tu veux... | Choisis | Pourquoi |
|---|---|---|
| Maximum d'adoption, code utilisable même dans du proprio fermé | **MIT** ou **BSD** | Permissive, deux pages de licence, zéro friction |
| Idem mais avec protection brevets pour ta boîte | **Apache 2.0** | Standard de fait pour les projets Big Tech |
| Forcer ceux qui modifient ton code à publier leurs modifs | **GPL v2** ou **v3** | Copyleft viral, contamine le projet entier |
| Forcer même les utilisateurs SaaS/cloud à publier | **AGPL v3** | Comble le « trou réseau » de la GPL |
| Diffuser une lib utilisable dans du proprio sans rendre tout open | **LGPL** | Copyleft seulement sur la lib, pas sur l'appli qui l'embarque |
| Compromis : modifs de tes fichiers ouvertes mais pas le reste | **MPL 2.0** | Copyleft fichier-par-fichier, élégant |
| Empêcher AWS de cloner ton SaaS | **AGPL** (vrai OSS) ou **SSPL/BSL** (source available, pas OSS) | AGPL reste open source, SSPL/BSL non |

**Comment tu choisis en pratique pour ton projet ?**

- Lib JS/Python pour devs : **MIT**
- Outil d'entreprise (genre Kubernetes) : **Apache 2.0**
- Logiciel utilisateur final qu'on veut protéger : **GPL v3**
- SaaS communautaire : **AGPL v3**
- Tu hésites : va sur **choosealicense.com**, GitHub a fait un site exprès qui te pose 3 questions et te dit quoi prendre.

---

## 5. Trois mythes faux à casser

### Mythe 1 : « Open source = gratuit forcément »

**Faux.** « Free » en anglais veut dire libre OU gratuit, d'où la confusion. Tu peux **vendre** un logiciel open source. Red Hat est une boîte cotée en bourse (rachetée par IBM 34 milliards en 2019) qui vend du Linux. GitLab vend une version Enterprise. Wallaby, MongoDB, Elastic, Confluent, HashiCorp : toutes des entreprises milliardaires bâties sur de l'open source. Ce qui est gratuit, c'est la **liberté d'usage**, pas forcément la copie. Tu peux payer pour une copie, du support, un hébergement, une garantie. Le code reste ouvert.

### Mythe 2 : « Open source = personne n'est responsable »

**Faux.** Les gros projets open source ont une **gouvernance** très carrée :

- **Linux** : Linux Foundation, plus de 15 000 développeurs payés par leur entreprise (Intel, Red Hat, Google) contribuent. Linus Torvalds est dictateur bienveillant.
- **Kubernetes** : Cloud Native Computing Foundation, comité de pilotage élu, processus de release strict.
- **Apache projects** : Apache Software Foundation, vote de la communauté pour chaque décision majeure.
- **Mozilla** : fondation à but non lucratif avec budget annuel de 600M$.

Et côté **sécurité** : un bug dans Linux est trouvé et patché en heures parce que des milliers d'yeux regardent. Un bug dans un logiciel propriétaire peut traîner des années sans être vu. Le **Heartbleed** (faille OpenSSL en 2014) a été corrigé en 24h une fois publié. Il existait depuis 2 ans dans le code, oui, mais la transparence permet de le trouver. Avec du proprio, tu n'as **aucun moyen** de vérifier.

Côté **support contractuel** : tu peux acheter du support payant chez Red Hat, Canonical, SUSE, Percona, etc. Avec SLA, garantie de réponse, escalade. Comme avec n'importe quel logiciel proprio. Sauf que tu n'es pas **prisonnier** d'un seul fournisseur.

### Mythe 3 : « Open source = de moindre qualité »

**Faux.** Regarde autour de toi :

| Tu utilises... | Tu utilises de l'open source |
|---|---|
| Internet | 96 % des serveurs web tournent sur Linux + Apache/Nginx |
| Android | Kernel Linux + AOSP (Apache 2) |
| macOS / iOS | Basé sur Darwin (BSD) |
| Firefox / Chrome | Mozilla MPL / Chromium BSD |
| VS Code | MIT |
| Tout le cloud (AWS, Azure, GCP) | Linux + Kubernetes + des centaines de briques OSS |
| ChatGPT et Claude | Tournent sur des stacks Python/PyTorch open source |
| Ton banking en ligne | Backend Java/Spring (Apache 2), DB PostgreSQL (PostgreSQL License) |

Études concrètes : les codebases analysées par Coverity (outil d'audit qualité) montrent en moyenne **moins de bugs par 1000 lignes** dans Linux que dans les noyaux propriétaires comparables. Les projets sous gouvernance Apache ou CNCF ont des process de release plus stricts que beaucoup d'éditeurs proprio.

Le mythe vient des années 90 quand l'open source était perçu comme un truc d'amateurs. Aujourd'hui, c'est l'inverse : les meilleurs ingés du monde travaillent sur Linux, Postgres, React, etc., souvent payés par les GAFAM pour le faire à temps plein.

---

## À retenir avant la suite

L'open source, ce n'est pas un don de charité ni un mouvement militant pur (même si Stallman aimerait). C'est un **modèle juridique et économique** qui repose sur 10 critères stricts, 8 grandes licences à connaître, et une histoire de 40 ans qui va de Stallman au LLM Llama. Si tu retiens 3 choses :

1. **Open source ≠ gratuit, ≠ source available, ≠ open weights**. Les nuances ont des conséquences juridiques réelles.
2. **La licence détermine ce que tu peux faire**. Choisis-la avant d'écrire la première ligne, ou tu vas galérer pour la changer.
3. **Open source ne veut pas dire « pas pro »**. Linux, Postgres, Kubernetes, Firefox : la moitié de l'économie numérique tourne dessus.

La suite t'expliquera comment **utiliser** concrètement de l'open source dans ton projet, comment **contribuer** sans te ridiculiser, et comment **éviter les pièges juridiques** (notamment le copyleft involontaire qui t'oblige à publier ton code).
