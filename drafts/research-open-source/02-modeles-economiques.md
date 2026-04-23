# Si c'est gratuit, comment les boîtes gagnent leur vie ?

> Bloc de recherche n°02 pour l'article tutoriel "Open source pour les non-devs".
> Date de rédaction : 24 avril 2026.
> Public cible : entrepreneurs et curieux qui n'ont jamais codé.

---

## L'intro à garder en tête

Quand je dis "logiciel open source", la première question qui revient toujours est la même : « OK Jérémy, mais si le code est gratuit, comment la boîte derrière paie ses salaires ? ». Bonne question. Parce qu'il y a vraiment des boîtes derrière. Red Hat a été rachetée 34 milliards de dollars. MongoDB fait 2 milliards de chiffre d'affaires. GitLab dépasse 750 millions. Aucune ne vend de licence comme Microsoft vend Word.

La réponse tient en une phrase : **le code est gratuit, mais tout ce qu'il y a autour ne l'est pas**. Le support, l'hébergement, les fonctionnalités entreprise, la tranquillité juridique. C'est ce "autour" qui paie les salaires. Voici les 5 modèles qui marchent, les 5 cas concrets qui les illustrent, et la grosse controverse qui agite le secteur depuis 2023.

---

## 1. Les 5 modèles économiques de l'open source

### Modèle 1 · Services + support (le modèle Red Hat)

**L'idée** : tu donnes le code gratuitement, tu vends du support, du conseil et des garanties autour.

Concrètement, n'importe quel admin système peut télécharger Linux gratuitement. Mais une banque qui fait tourner 10 000 serveurs Linux ne veut pas être celle qui appelle un consultant freelance à 3h du matin quand un patch de sécurité casse la prod. Elle paie Red Hat (ou SUSE, ou Canonical) pour avoir un téléphone à appeler, des correctifs garantis pendant 10 ans, et un contrat juridique qui dit "si ça casse, on est responsables".

| Avantages | Limites |
|---|---|
| Modèle ultra-prouvé (Red Hat, IBM, SUSE) | Marges plus faibles que le SaaS |
| Pas de drama "tu nous voles" : tout reste libre | Demande beaucoup d'humains (consultants, support N1/N2/N3) |
| Crédibilité maximale auprès de la communauté | Difficile à scaler sans recruter |

**Qui l'utilise aujourd'hui** : Red Hat, SUSE, Canonical (Ubuntu), Percona (MySQL/PostgreSQL), Acquia (Drupal).

### Modèle 2 · Hosted SaaS (le modèle MongoDB Atlas)

**L'idée** : le code est libre, mais la version "managée" qui tourne dans le cloud avec sauvegarde, monitoring, scaling auto, tu la paies au mois.

C'est le modèle le plus rentable aujourd'hui. MongoDB édite la base de données MongoDB en open source. N'importe qui peut l'installer sur son serveur. Mais 73 % du chiffre d'affaires de MongoDB en 2026 vient d'**Atlas**, leur service hébergé. Pourquoi ? Parce que installer une base, la sécuriser, la sauvegarder, la patcher tous les mois, c'est un job à plein temps. Payer 200 euros par mois pour qu'ils s'en occupent, c'est moins cher qu'un junior DevOps.

| Avantages | Limites |
|---|---|
| Marges SaaS classiques (70-80 %) | AWS peut copier ton offre et la vendre moins cher (cf. Elastic, Redis) |
| Croissance prévisible (revenus récurrents) | Dépendance au cloud (AWS, GCP, Azure prennent leur part) |
| L'open source sert d'aimant à développeurs | Risque de drift : la version cloud devient meilleure que l'open source, la communauté râle |

**Qui l'utilise aujourd'hui** : MongoDB Atlas, Elastic Cloud, Confluent (Kafka), Databricks (Spark), Supabase (Postgres).

### Modèle 3 · Open core (le modèle GitLab)

**L'idée** : la version "communauté" est gratuite et open source. Mais les fonctionnalités dont les grosses boîtes ont besoin (SSO, audit, conformité, support de 5 000 utilisateurs) sont dans une version payante.

GitLab en est l'exemple le plus pur. La version "Community Edition" couvre tout ce dont un dev solo ou une PME a besoin. Mais si tu es une banque qui a besoin de connexion à Active Directory, de logs d'audit pour la conformité bancaire, de gestion fine des permissions par équipe, tu prends GitLab Premium (29 $/utilisateur/mois) ou Ultimate (99 $/utilisateur/mois). Sid Sijbrandij, le fondateur, l'a expliqué franchement : "L'open source seul ne suffit pas. C'est un vent dans le dos, mais il faut un produit ET de la vente pour tenir".

| Avantages | Limites |
|---|---|
| Modèle clair, marges saines | Frontière "core vs premium" sensible : si tu mets trop dans le payant, la communauté part |
| Évolutif (tu peux remonter des features dans le core ou les sortir en premium) | Risque que des concurrents reproduisent gratuitement tes features payantes |
| Acquisition simple : essayez gratuit, payez quand vous grandissez | Demande beaucoup de discipline produit |

**Qui l'utilise aujourd'hui** : GitLab, Sentry, n8n, Cal.com, PostHog, Plausible.

### Modèle 4 · Dual license (le modèle MySQL historique)

**L'idée** : le code est sous licence GPL (libre, mais "virale" : si tu l'intègres dans ton produit, ton produit doit aussi être libre). Si tu veux l'utiliser dans un produit propriétaire, tu paies une licence commerciale.

C'est le modèle qu'a utilisé MySQL avant son rachat par Sun (1 milliard en 2008), puis par Oracle. Si tu es un éditeur logiciel qui veut intégrer MySQL dans son produit fermé, tu ne peux pas (la GPL t'oblige à libérer ton produit). Donc tu paies une licence commerciale à Oracle. C'est élégant : la communauté garde du libre, les éditeurs commerciaux paient.

| Avantages | Limites |
|---|---|
| Cash direct des éditeurs propriétaires | Peu de boîtes B2B savent gérer la complexité juridique |
| Préserve le libre pour les utilisateurs finaux | Ne fonctionne que si la GPL "fait peur" : pour beaucoup de produits modernes (web, SaaS), elle ne s'applique pas |
| Model vieux mais éprouvé | En perte de vitesse vs SaaS hébergé |

**Qui l'utilise aujourd'hui** : MySQL (Oracle), Qt (Digia), Sequel Pro, MariaDB (en partie). Modèle moins en vogue qu'il y a 15 ans.

### Modèle 5 · Sponsoring + dons (le modèle GitHub Sponsors)

**L'idée** : la communauté (devs, entreprises) paie volontairement les mainteneurs via des plateformes comme GitHub Sponsors, Open Collective, Patreon.

Sur le papier, c'est le modèle le plus pur. En réalité, c'est le plus dur à scaler. GitHub Sponsors a permis de débloquer plus de **60 millions de dollars cumulés** depuis son lancement en 2019. C'est beaucoup, mais réparti sur des milliers de mainteneurs, ça fait souvent moins de 500 dollars par mois par projet.

Ça marche pour les bibliothèques très utilisées par d'autres devs (curl, FFmpeg, Vue.js, Babel). Ça ne marche pas pour les gros logiciels d'infrastructure qui ont besoin de 50 ingénieurs à plein temps.

| Avantages | Limites |
|---|---|
| Aucun conflit d'intérêt avec la communauté | Très instable : un mois 5K€, le mois suivant 800€ |
| Adapté aux petits projets de niche | N'a jamais permis de bâtir une vraie boîte (>10 salariés) |
| Permet de salarier 1 à 3 mainteneurs | Pas de SLA, pas de garantie pour les entreprises qui paient |

**Qui l'utilise aujourd'hui** : Vue.js (Evan You), Sindre Sorhus, beaucoup de projets npm, Babel, Bevy (moteur de jeu Rust).

---

## 2. Cinq cas concrets décortiqués

### Cas 1 · Red Hat — la référence absolue (34 G$)

**Timeline** : Fondée en 1993 par Bob Young et Marc Ewing. IPO en 1999 (8e plus grosse hausse au premier jour de Wall Street à l'époque). Atteint 1 milliard de chiffre en 2012, 3,4 milliards en 2019. **Rachetée par IBM en juillet 2019 pour 34 milliards de dollars** — la deuxième plus grosse acquisition tech de l'histoire à cette date.

**Modèle** : Services + support pur. Linux gratuit, abonnements payants pour Red Hat Enterprise Linux (RHEL) avec support, certifications matériel, patches de sécurité long terme, conformité.

**Pourquoi ça a marché** : Red Hat a été la première boîte à prouver qu'on pouvait construire une multinationale rentable sur du logiciel libre. Leur secret : les DSI des grosses entreprises voulaient Linux mais avaient besoin d'un fournisseur "responsable" en costume-cravate à qui faire signer un contrat. Red Hat a vendu cette tranquillité.

**Leçon** : Le modèle services-support fonctionne mais demande **20 ans** pour devenir énorme. Pas un sprint, un marathon.

### Cas 2 · GitLab — l'open core moderne (750 M$ ARR)

**Timeline** : Fondé en 2011 par Dmitriy Zaporozhets (Ukraine) et Sid Sijbrandij (Pays-Bas). 100 % remote depuis le jour 1. IPO en octobre 2021 à 11 milliards de valorisation. Chiffre fiscal 2025 : **759 millions de dollars** (+31 % YoY), 123 clients à plus d'1 M$ d'ARR.

**Modèle** : Open core strict. Community Edition gratuite (MIT). Premium (29 $/user/mois) et Ultimate (99 $/user/mois) pour les boîtes qui veulent SSO, audit, sécurité avancée, conformité.

**Pourquoi ça a marché** : Sid Sijbrandij a publié toute la stratégie de la boîte sur leur "handbook" public (3 000+ pages). Cette transparence radicale a créé une communauté massive et a séduit les DSI qui détestent les boîtes opaques. Aussi : ils ont commencé en visant directement le bas du marché (devs solo) pour remonter ensuite vers l'enterprise.

**Leçon** : L'open core marche si tu acceptes que **70 à 80 % de tes utilisateurs ne paieront jamais**. Tu monétises les 20 % qui ont les moyens et le besoin réel.

### Cas 3 · MongoDB — le hosted SaaS qui a tout changé (2 G$ ARR)

**Timeline** : Fondée en 2007. IPO en 2017. Lance Atlas (le service cloud hébergé) en 2016, qui devient progressivement le moteur de croissance. Chiffre fiscal 2025 : **2,006 milliards de dollars** (+19 % YoY). **Atlas représente 73 % du revenu** en 2026 (vs 66 % en 2024).

**Modèle** : Hosted SaaS. Le code MongoDB est libre (passé de AGPL à SSPL en 2018). Atlas, le service managé, est l'offre payante principale.

**Pourquoi ça a marché** : Les développeurs adorent MongoDB pour sa simplicité (JSON-like, pas de schéma rigide). Mais gérer une base MongoDB en production demande un savoir-faire qu'aucune startup n'a en interne. Atlas a vendu "tu cliques, c'est en prod, on s'occupe de tout". Le pivot SSPL en 2018 visait à empêcher AWS de proposer un service concurrent — efficace.

**Leçon** : Le hosted SaaS bat tous les autres modèles **en marges**. Mais il oblige à se battre frontalement avec les hyperscalers (AWS, Google, Azure) qui adorent copier les bons logiciels open source.

### Cas 4 · HashiCorp — le drama license qui finit en rachat (6,4 G$)

**Timeline** : Fondée en 2012 par Mitchell Hashimoto et Armon Dadgar. Crée Terraform, Vault, Consul, Nomad — l'infrastructure-as-code devient un standard de facto. IPO en 2021. **Août 2023 : passe Terraform de la licence MPL (vraiment libre) à la BSL (Business Source License)** — geste qui interdit aux clouds concurrents de revendre Terraform comme service. Avril 2024 : annonce de l'acquisition par IBM. **Février 2025 : closing de l'acquisition à 6,4 milliards de dollars**.

**Modèle** : Mixte. Open source historique pour la traction, puis pivot BSL pour empêcher les clouds (notamment AWS et son service Terraform Cloud concurrent) de monétiser leur travail. Cloud HashiCorp managé en payant.

**Pourquoi ça a "cassé" partiellement** : Le pivot BSL a déclenché un fork immédiat appelé **OpenTofu**, soutenu par la Linux Foundation. La communauté open source a perçu HashiCorp comme un traître. Mais d'un point de vue business, le pivot a sécurisé la valeur — IBM a justement acheté pour ce contrôle renforcé.

**Leçon** : Changer de licence après coup, c'est utile financièrement, mais ça **brûle la confiance pour toujours**. La communauté n'oublie pas.

### Cas 5 · Elastic — le drama license qui revient en arrière

**Timeline** : Fondée en 2012 (Shay Banon). Elasticsearch et Kibana sont des standards de la recherche et l'analyse de logs. IPO en 2018. **Janvier 2021 : pivot d'Apache 2.0 vers SSPL + Elastic License** pour bloquer AWS, qui vendait un service Elasticsearch concurrent. **AWS fork instantané : OpenSearch**, qui dépasse 100 millions de téléchargements la première année. **Septembre 2024 : Elastic ajoute la licence AGPLv3 (vraiment open source)** — retour en arrière partiel.

**Modèle** : Hosted SaaS (Elastic Cloud) + open core.

**Pourquoi ça a cassé puis recollé** : Le pivot a marché juridiquement contre AWS, mais a fragmenté la communauté. Beaucoup d'utilisateurs sont passés sur OpenSearch et ne sont jamais revenus. Le retour à AGPL en 2024 visait à récupérer ces devs perdus, mais comme l'a dit un commentateur : "vous ne pouvez pas dénoncer le mariage et redemander la même fille en mariage trois ans plus tard".

**Leçon** : Le pivot de licence est une **arme à double tranchant**. Elastic l'a utilisé pour stopper un saignement court terme, mais a perdu l'aura "open source" durablement.

---

## 3. La controverse 2024-2026 « post open source »

Depuis 2018, on assiste à une vague de pivots de licences. Le calendrier :

| Année | Boîte | Pivot |
|---|---|---|
| 2018 | MongoDB | AGPL → SSPL |
| 2019 | Redis Labs | Apache 2.0 → RSAL pour certains modules |
| 2021 | Elastic | Apache 2.0 → SSPL + Elastic License |
| 2023 | HashiCorp | MPL → BSL |
| 2023 | Sentry | BSL → FSL (créée pour l'occasion) |
| 2024 | Redis | BSD → SSPL + RSALv2 (puis ajout AGPL en 2025 — encore un revirement) |

### L'argument des fondateurs : « AWS nous mange »

Le narratif est toujours le même : « On a créé un super logiciel open source. AWS le prend tel quel, le revend en service managé, fait des centaines de millions dessus, et **ne contribue rien en retour**. Sans changement de licence, on meurt ». Sid Sijbrandij, Shay Banon, Mitchell Hashimoto, Salvatore Sanfilippo (Redis) ont tous tenu publiquement ce discours.

Le mot d'ordre est venu de Chad Whitacre, le head of open source de Sentry, quand il a inventé la **Functional Source License (FSL)** en novembre 2023 : « Freedom without harmful free-riding ». Liberté sans parasitage nuisible.

### L'argument des opposants : « Ce n'est plus open source »

L'**Open Source Initiative** (OSI), gardienne historique de la définition d'open source depuis 1998, a refusé de reconnaître la SSPL comme open source en 2019 (Mongo l'avait soumise puis retirée face au refus). Position claire : ces licences violent les critères 6 et 9 de l'Open Source Definition (pas de discrimination contre des champs d'usage, pas de contamination d'autres logiciels).

Bruce Perens (cocréateur de l'OSI) et Peter Zaitsev (Percona) sont parmi les voix les plus dures : « Vous reprenez le mot "open source" pour vendre un produit qui n'en est plus un. C'est de la publicité mensongère ».

### Le mouvement « source available » et « fair source »

Pour clarifier le vocabulaire :

- **Open source** (au sens strict OSI) : tu peux utiliser, modifier, redistribuer, **y compris pour concurrencer l'auteur**. Pas de discrimination.
- **Source available** : tu peux lire le code, parfois le modifier, mais des restrictions s'appliquent (pas de revente comme service, pas d'usage commercial, etc.). Pas open source au sens OSI.
- **Fair source** (mouvement lancé en 2024 sur fair.io) : source available + une promesse de **basculer en vrai open source après X années** (Delayed Open Source Publication). C'est l'idée de la BSL et de la FSL.

Sentry s'est positionné en chef de file de "fair source". L'argument : « après 2 ou 4 ans, le code devient totalement libre — donc à terme, c'est open source ». L'OSI répond : « tant que c'est restreint, c'est restreint. Le futur n'efface pas le présent ».

### Position de l'OSI vs les pivots

| OSI | Boîtes qui pivotent |
|---|---|
| L'open source a une définition stricte depuis 1998 | La définition n'a pas anticipé les hyperscalers cloud |
| Les pivots utilisent le mot "open source" pour vendre un produit qui n'en est plus un | Sans monétisation, le projet meurt et plus personne ne contribue |
| Si vous voulez restreindre, OK, mais arrêtez de dire "open source" | "Fair source" est un terme distinct, on ne triche pas |
| Risque de pollution de la marque "open source" | Mieux vaut un projet vivant en source available qu'un projet mort en open source pur |

Mon avis personnel : les deux camps ont raison. L'OSI protège un mot qui a une vraie valeur juridique et culturelle. Les fondateurs protègent leur business face à des géants qui ne jouent pas le jeu. La vérité est qu'on a besoin d'un nouveau mot — et "fair source" pourrait l'être, à condition que tout le monde l'accepte.

---

## 4. Pour un entrepreneur en 2026 : peut-on lancer un SaaS open core ?

Oui, mais à conditions. Voici la grille à utiliser.

### Les 4 conditions de viabilité

1. **Tu vises un marché B2B avec des budgets enterprise.** Les particuliers ne paient pas pour de l'open core. Il faut des clients qui ont 50 K€ à 500 K€ de budget logiciel par an.
2. **Ton produit a un "moat" technique fort.** Si quelqu'un peut cloner ton truc en 3 mois, l'open source te tue. Si tu as 5 ans d'avance, l'open source te fait gagner.
3. **Tu acceptes une longue traversée du désert.** Les 3 à 5 premières années, le revenu vient quasi exclusivement des early adopters self-serve. Le gros revenu enterprise arrive après.
4. **Tu as les nerfs solides face à la communauté.** Les utilisateurs gratuits demandent énormément (issues, PRs, support sur Discord). Si tu ne supportes pas, n'y va pas.

### Les pièges à éviter

- **Le piège Sentry 2023** : changer de licence après avoir construit ta communauté sur de l'open source pur. Même si tu as raison économiquement, tu vas te prendre 1 000 articles de blog haineux et perdre des contributeurs. Si tu veux faire du source available, **commence en source available**, ne pivote pas en cours de route.
- **Le piège open core trop fermé** : si la version gratuite est inutilisable seule (pas de SSO basique, pas d'API, pas de scale au-delà de 10 users), la communauté ne grandira jamais. GitLab a longtemps été critiqué pour ça.
- **Le piège du SLA implicite** : ne jamais promettre "support communautaire 24/7" sans contrat payant. Les utilisateurs gratuits comprennent qu'ils sont gratuits.

### 3 success stories récentes

| Boîte | Modèle | Stade 2026 |
|---|---|---|
| **Cal.com** (alternative open source à Calendly) | Open core MIT | 5,1 M$ d'ARR fin 2024, valorisée 150 M$ |
| **Plausible Analytics** (alternative à Google Analytics) | Open core AGPL + cloud payant | Profitable, équipe de 8, "lifestyle business" assumé |
| **PostHog** (analytics produit open source) | Open core MIT, cloud payant | 31K+ étoiles GitHub, levée Series B 15 M$, croissance forte |

Trois modèles différents, trois succès. Ce qui est commun : le code est vraiment utilisable gratuitement, le payant ajoute une vraie valeur (SaaS hébergé sans config, scale, features enterprise).

### Le coût caché : la communauté demande à manger

Avant de te lancer, regarde les chiffres réels d'un projet comme Cal.com ou PostHog : ils consacrent 1 à 2 ETP (équivalent temps plein) **uniquement à modérer les issues GitHub, répondre sur Discord, examiner les pull requests, écrire de la doc**. Ce n'est pas du temps qui rapporte directement. C'est l'impôt à payer pour avoir une communauté active. Beaucoup de fondateurs sous-estiment et finissent burn-out.

---

## 5. Le mythe à casser : « les devs open source bossent gratuitement par passion »

C'est l'image d'Épinal : un barbu en pull dans son garage qui code Linux le week-end pour la beauté du geste.

La réalité 2026 est très différente.

**84,3 % des commits du noyau Linux en 2025 sont signés par des développeurs en CDI dans des grandes entreprises**, selon les analyses LWN.net (Linux Weekly News). Le top des contributeurs :

- Intel : 13,1 %
- Google : 12,5 % (sign-offs)
- Red Hat : 7,2 %
- Linaro : 5,6 %
- IBM : 4,1 %

Pourquoi ces boîtes paient des devs à plein temps pour bosser sur du code "gratuit" ? Parce que :

- **Intel a besoin que Linux supporte parfaitement ses processeurs** — sans ça, ils perdent face à AMD ou ARM.
- **Google fait tourner Android (basé sur Linux) sur 3 milliards de smartphones** — un bug noyau, c'est des milliards de pertes.
- **Red Hat vend du support Linux** — il faut bien que des gens écrivent le code qu'ils supportent.

Donc oui, le code est libre. Mais celui qui le tape **est payé pour ça** dans 8 cas sur 10 sur les gros projets. Le bénévole pur reste majoritaire sur les petits projets de niche (extensions, libs spécialisées), mais devient minoritaire dès qu'un projet devient critique.

C'est important de le savoir parce que ça change la lecture de l'open source : **ce n'est pas du bénévolat romantique, c'est un système d'investissement industriel partagé**. Les boîtes mettent en commun le code qu'elles utiliseraient de toute façon, parce que c'est moins cher pour elles que de développer chacune dans son coin.

---

## Sources principales

- **Red Hat / IBM** : [Red Hat press release 2019](https://www.redhat.com/en/about/press-releases/ibm-closes-landmark-acquisition-of-red-hat-34-billion-defines-open-hybrid-cloud-future), [TechCrunch](https://techcrunch.com/2019/07/09/ibm-closes-red-hat-acquisition-for-34-billion/)
- **GitLab** : [GitLab IR FY2025](https://ir.gitlab.com/news/news-details/2025/GitLab-Reports-Fourth-Quarter-and-Full-Fiscal-Year-2025-Financial-Results/default.aspx), [Interview Sid Sijbrandij InfoQ](https://www.infoq.com/articles/gitlab-sid-interview-sw-development/)
- **MongoDB** : [MongoDB IR FY2025](https://investors.mongodb.com/news-releases/news-release-details/mongodb-inc-announces-fourth-quarter-and-full-year-fiscal-2025), [10-K SEC filing](https://www.stocktitan.net/sec-filings/MDB/10-k-mongo-db-inc-files-annual-report-b4d146eca812.html)
- **HashiCorp** : [TechCrunch acquisition closing](https://techcrunch.com/2025/02/27/ibm-closes-6-4b-hashicorp-acquisition/), [The Register](https://www.theregister.com/2025/02/28/ibm_hashicorp_deal_closing/)
- **Elastic** : [InfoQ retour AGPL 2024](https://www.infoq.com/news/2024/09/elastic-open-source-agpl/), [Simon Willison](https://simonwillison.net/2024/Aug/29/elasticsearch-is-open-source-again/)
- **Sentry / FSL** : [TechCrunch FSL launch](https://techcrunch.com/2023/11/20/with-functional-source-license-sentry-wants-to-grant-developers-freedom-without-harmful-free-riding/), [Sentry blog FSL](https://blog.sentry.io/introducing-the-functional-source-license-freedom-without-free-riding/)
- **MySQL / Oracle** : [Wikipedia MySQL](https://en.wikipedia.org/wiki/MySQL), [RedMonk Oracle EU Q&A](https://redmonk.com/sogrady/2009/10/23/oracle-mysql-and-the-eu-the-qa/)
- **Redis / Valkey** : [InfoQ Redis SSPL](https://www.infoq.com/news/2024/03/redis-license-open-source/), [Redis AGPL announcement 2025](https://redis.io/blog/agplv3/)
- **Cal.com** : [VentureBeat Series A](https://venturebeat.com/business/open-source-calendly-rival-cal-com-raises-25m), [GetLatka 2024](https://getlatka.com/blog/18-year-old-raises-32m-to-build-opensource-version-of-calendly/)
- **PostHog** : [PostHog open source business models](https://posthog.com/blog/open-source-business-models)
- **Linux contributors** : [LWN.net 6.15 stats](https://lwn.net/Articles/1022414/), [Linux Foundation insights](https://insights.linuxfoundation.org/project/korg/contributors)
- **Fair source / OSI** : [TechCrunch Fair Source movement](https://techcrunch.com/2024/09/22/some-startups-are-going-fair-source-to-avoid-the-pitfalls-of-open-source-licensing/), [FOSSA Fall 2024 roundup](https://fossa.com/blog/fall-2024-software-licensing-roundup/), [Fair.io](https://fair.io/)
- **Funding open source** : [Linux Foundation State of Funding 2024](https://www.linuxfoundation.org/blog/understanding-the-state-of-open-source-funding-in-2024), [GitHub Sponsors](https://github.com/sponsors)
