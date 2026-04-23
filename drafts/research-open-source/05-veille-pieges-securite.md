# Veille open source, pièges à éviter et sécurité avant installation

*Date : 24 avril 2026 — Article 5 de la série open source pour non-devs*

L'open source, c'est un peu comme un marché aux puces géant et mondial. On y trouve des trésors, mais aussi des objets cassés, des vendeurs qui disparaissent du jour au lendemain, et même quelques arnaqueurs déguisés en brocanteurs sympathiques. Bonne nouvelle : il existe des manières simples de s'y repérer, à condition de savoir où regarder, ce qui peut mal tourner, et comment vérifier qu'un outil est sain avant de l'installer.

Ce guide répond à trois questions concrètes : comment être au courant des nouveautés open source ? Quels sont les pièges qu'on découvre toujours trop tard ? Et comment s'assurer qu'un outil est safe avant de cliquer sur "installer" ?

---

## 1. Comment faire sa veille open source

L'erreur classique, quand on débute, c'est de vouloir tout suivre. C'est intenable. La bonne approche : 5 minutes par jour, 30 minutes par semaine, et des sources qui font le tri pour toi.

### Sources francophones

- **Korben.info** — l'incontournable de la vulgarisation tech en français. Korben teste les outils, explique les enjeux, vulgarise sans être condescendant. Si un outil open source mérite l'attention en France, il en parle.
- **Linuxfr.org** — la vénérable communauté francophone Linux et logiciel libre. Ambiance technique mais accessible, dépêches communautaires, débats de fond sur les licences.
- **Next** (anciennement NextINpact) — média tech français indépendant. Couvre les sujets de fond (licences, vie privée, souveraineté numérique) avec un vrai recul.
- **Linux Magazine France** — pour ceux qui veulent creuser, papier ou web.
- **Riff** — podcast tech français qui parle régulièrement d'écosystème logiciel et d'open source.
- **Comptes X/Twitter à suivre** : `@Korben`, `@SebSauvage` (créateur de Shaarli, ZeroBin), `@nextinpact`.

### Sources internationales

- **Hacker News** (`news.ycombinator.com`) — la référence absolue. Page d'accueil mise à jour en continu, communauté de devs et fondateurs ultra réactive. Tout outil OS qui prend de l'ampleur passe par là. Astuce : le **fil "Show HN"** liste les projets que les créateurs présentent eux-mêmes.
- **GitHub Trending** (`github.com/trending`) — ce qui prend des étoiles aujourd'hui, cette semaine, ce mois. Filtre par langage. Idéal pour repérer les outils en train de monter avant qu'ils soient mainstream.
- **Lobsters** (`lobste.rs`) — alternative à Hacker News, plus curated, plus tech, moins de bruit. Inscription par cooptation.
- **Product Hunt** — beaucoup de SaaS, mais aussi pas mal d'alternatives open source mises en avant.
- **Reddit** : `r/opensource`, `r/selfhosted` (pour héberger soi-même), `r/programming`.
- **Newsletters** :
  - *TLDR Newsletter* — résumé quotidien, 5 minutes de lecture.
  - *Console* (`console.dev`) — newsletter dédiée aux outils dev open source, hebdomadaire, très bien curatée.
  - *Pragmatic Engineer* (Gergely Orosz) — analyses de fond sur l'industrie tech.
- **Comptes X internationaux** : `@GergelyOrosz`, `@kentcdodds`, `@gvanrossum` (créateur de Python), `@ThePSF` (Python Software Foundation).

### Workflow recommandé (5 min/jour, 30 min/semaine)

| Fréquence | Action | Outil |
|---|---|---|
| Tous les jours | Scanner la front page de Hacker News | `news.ycombinator.com` |
| 1 fois/semaine | Review de GitHub Trending sur ton langage | `github.com/trending/python` (par ex.) |
| 1 fois/semaine | Lire la newsletter Console + 1 article Korben | Email |
| 1 fois/mois | Tour des subreddits pertinents | Reddit |

Pour automatiser : **Feedly** (gratuit) avec un dossier dédié "Open Source" et tes flux RSS préférés. Tu ouvres 5 minutes par jour, tu marques comme lu, tu sauvegardes 1 ou 2 articles à creuser le week-end. C'est tout.

---

## 2. Les 5 pièges majeurs à éviter

### Piège 1 — La contamination de licence (le piège GPL)

C'est l'erreur fatale des startups qui découvrent l'open source. La licence **GPL** (General Public License) est dite "virale" : si tu intègres du code GPL dans ton produit propriétaire fermé que tu vends à des clients, tu **dois** publier ton code source entier sous GPL. Pas une partie. Tout.

Beaucoup d'entreprises l'ont appris à leurs dépens, parfois après plusieurs années de développement. La solution n'est pas d'éviter la GPL (elle a sa place), mais de **vérifier la licence de chaque dépendance avant installation**.

Outils pour ça :
- `license-checker` (npm) — liste les licences de toutes tes dépendances JavaScript.
- `pip-licenses` (Python) — équivalent côté Python.
- **FOSSA** ou **Snyk** — analyse automatisée et alertes en CI/CD.

### Piège 2 — Le projet qui meurt (ou que le maintainer sabote)

Tu construis ta boîte sur un outil OS, et un jour, le mainteneur arrête. Pire : il sabote son propre projet. Deux cas réels qui ont marqué les esprits.

**Colors.js et Faker.js (janvier 2022)** : Marak Squires, fatigué de maintenir gratuitement deux librairies utilisées par des milliers de projets (3,3 milliards de téléchargements pour `colors.js`, 272 millions pour `faker.js`), a délibérément cassé son propre code. Il a poussé une version qui injectait une boucle infinie et affichait "LIBERTY LIBERTY LIBERTY" en boucle dans les terminaux. Des milliers d'applications en production sont tombées du jour au lendemain. ([Bleeping Computer](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/))

**Core-js** : un seul maintainer, Denis Pushkarev, basé en Russie. La librairie est utilisée sur plus de la moitié du top 10 000 des sites web, plus de 43 millions de téléchargements npm par semaine. Ses revenus ? 400 $/mois en 2023, contre 2 500 $/mois auparavant. Sanctions internationales, burnout, hostilité de la communauté. Il a publiquement déclaré qu'il était prêt à arrêter. ([The Stack](https://www.thestack.technology/core-js-maintainer-denis-pusharev-license-broke-angry/))

**Comment l'anticiper** :
- Date du dernier commit (moins de 2 mois = bon signe).
- Nombre de contributeurs actifs sur les 12 derniers mois.
- Présence de sponsors visibles (GitHub Sponsors, OpenCollective, entreprise mère).
- Existence de forks récents avec activité (filet de sécurité).
- Bus factor : combien de personnes peuvent maintenir le projet si une disparaît ? 1 = danger, 5+ = serein.

### Piège 3 — Le changement de licence unilatéral

Pendant des années, tu utilises gratuitement un outil sous licence permissive (Apache 2, BSD, MIT). Du jour au lendemain, l'éditeur change la licence. Ce que tu utilisais devient propriétaire ou semi-propriétaire. Les exemples se multiplient depuis 2021.

| Outil | Date | Avant | Après | Réaction communautaire |
|---|---|---|---|---|
| **Elasticsearch** | Janvier 2021 | Apache 2.0 | SSPL + Elastic License | AWS forke en **OpenSearch** |
| **Terraform** (HashiCorp) | Août 2023 | MPL 2.0 | BSL 1.1 (Business Source License) | Fork **OpenTofu** (Linux Foundation) |
| **Redis** | Mars 2024 | BSD | SSPL + RSALv2 | Fork **Valkey** (AWS, Google, Oracle) |

Le pattern est toujours le même : une boîte unique contrôle le projet, ses revenus stagnent face aux cloud providers (AWS notamment), elle change la licence pour bloquer la concurrence. Les utilisateurs trinquent.

**Comment détecter le risque en amont** :
- **Qui contrôle la licence ?** Une fondation indépendante (CNCF, Apache Software Foundation, Linux Foundation, Eclipse Foundation) = sûr. Une boîte unique à actionnaires = risque.
- Vérifie le fichier `GOVERNANCE.md` du projet sur GitHub.
- Si l'outil est critique pour ton business, garde un œil sur les forks et les alternatives. OpenTofu a été créé en 1 mois après le changement de Terraform.

### Piège 4 — Le "free" qui n'est pas open source

C'est la confusion la plus fréquente. **Gratuit ≠ open source**. Beaucoup d'outils sont gratuits à utiliser, mais le code source est privé et propriétaire. Tu peux les utiliser, mais tu n'as aucun droit dessus, aucune visibilité, aucune garantie.

| Outil | Gratuit ? | Open source ? |
|---|---|---|
| DaVinci Resolve | Oui | Non (propriétaire Blackmagic) |
| Discord | Oui | Non (propriétaire) |
| Skype | Oui | Non (propriétaire Microsoft) |
| Notion (free tier) | Oui | Non (propriétaire) |
| Figma (free tier) | Oui | Non (propriétaire Adobe depuis 2025) |
| Slack (free tier) | Oui | Non (propriétaire Salesforce) |

**Comment vérifier en 30 secondes** :
1. Cherche "[nom de l'outil] github" — s'il n'y a pas de repo officiel public, c'est propriétaire.
2. Va sur le site officiel, cherche un fichier `LICENSE` — si tu ne le trouves pas, c'est propriétaire.
3. Si tu vois "source available", "free for personal use", "community edition" — ce n'est pas open source au sens OSI.

### Piège 5 — La fausse open source IA ("open weights")

C'est le piège du moment. Llama (Meta) et Mistral sont systématiquement présentés comme "open source". Ils ne le sont pas vraiment.

- **Llama 4** : licence "Meta Community License". Usage commercial autorisé sauf si ton produit dépasse **700 millions d'utilisateurs mensuels actifs** (la limite est clairement faite pour bloquer les concurrents directs de Meta). ([Codieshub](https://codieshub.com/for-ai/open-weights-licensing-risks))
- **Mistral** : modèles "small/medium" sous Apache 2.0 (vraiment open source), mais les **gros modèles** (Mistral Large) sont sous licence commerciale restrictive.

L'OSI (Open Source Initiative) a publié en 2024 une définition de l'IA open source qui exclut explicitement Llama. Le terme correct pour ces modèles, c'est **"open weights"** : les poids du modèle sont accessibles, mais ce n'est pas du vrai open source (les données d'entraînement ne sont pas publiées, et la licence ajoute des restrictions).

**Vérifie toujours** : que peux-tu faire concrètement avec ce modèle ? Le déployer dans ton SaaS payant ? Le fine-tuner et le redistribuer ? Lis la licence avant d'engager du dev dessus.

---

## 3. Sécurité supply chain : les attaques récentes qui doivent te servir de leçon

### Log4Shell — décembre 2021

Une faille de gravité maximale (CVSS 10/10) dans Log4j, librairie Java de logging utilisée partout dans le monde. La vulnérabilité permettait à n'importe qui d'exécuter du code arbitraire à distance sur n'importe quel serveur vulnérable, en envoyant juste une requête web bien formée. Existait silencieusement depuis 2013. ([Wikipedia Log4Shell](https://en.wikipedia.org/wiki/Log4Shell))

**Impact** : potentiellement des centaines de millions d'appareils touchés. 10 jours après la divulgation, seuls 45% des workloads vulnérables étaient patchés en cloud. **La leçon** : même les libs vénérables et omniprésentes peuvent avoir des trous béants.

### XZ Utils — mars 2024

L'attaque la plus glaçante de l'histoire récente de l'open source. Un attaquant ("Jia Tan", probablement un acteur étatique) a passé **plus de 2 ans** à contribuer honnêtement au projet `xz-utils` (utilitaire de compression utilisé par toutes les distributions Linux). Il a gagné la confiance du mainteneur épuisé, est devenu co-mainteneur, puis a inséré une **backdoor SSH** dans les versions 5.6.0 et 5.6.1.

Détecté par hasard par **Andres Freund**, ingénieur Microsoft, qui faisait des benchmarks PostgreSQL et a remarqué que ses connexions SSH prenaient 500 ms au lieu de 100 ms. Il a creusé, trouvé l'anomalie. Sans cette curiosité, la backdoor aurait sans doute touché tous les serveurs Linux du monde dans les semaines suivantes. ([Wikipedia XZ Backdoor](https://en.wikipedia.org/wiki/XZ_Utils_backdoor))

**La leçon** : les attaques par ingénierie sociale sur les projets OS critiques sont une réalité. Les mainteneurs isolés et épuisés sont des cibles.

### Polyfill.io — juin 2024

`polyfill.io` était un CDN JavaScript utilisé sur 100 000+ sites pour faire fonctionner du code moderne sur de vieux navigateurs. En février 2024, le domaine et le compte GitHub sont rachetés par **Funnull**, une entreprise chinoise. À partir de juin, le CDN se met à injecter du JavaScript malveillant qui redirige les visiteurs mobiles vers des sites de scam. Cloudflare, Google et Fastly ont mis en place des miroirs pour mitiger l'impact. ([Sansec via Sonatype](https://www.sonatype.com/blog/polyfill.io-supply-chain-attack-hits-100000-websites-all-you-need-to-know))

**La leçon** : ne jamais charger de scripts depuis un CDN tiers sans intégrité (SRI). Préférer héberger soi-même les ressources critiques.

### Typosquatting npm/PyPI — en continu

Faux packages aux noms quasi identiques aux vrais : `reqests` au lieu de `requests`, `lodahs` au lieu de `lodash`. Le développeur tape vite, fait une faute, installe le package vérolé. Selon les rapports Sonatype, des centaines de packages malveillants sont publiés chaque mois sur npm et PyPI.

**La leçon** : copier-coller les noms de packages depuis la documentation officielle, jamais les retaper.

---

## 4. Comment auditer un outil open source AVANT de l'installer

Checklist pratique, applicable en 5 minutes pour la plupart des projets.

### Checklist manuelle

- ✅ **Licence OSI-approuvée** : vérifier sur `opensource.org/licenses`. MIT, Apache 2.0, BSD, MPL = OK pour la plupart des usages. AGPL, SSPL, BSL = lire la licence avant de t'engager.
- ✅ **Repo officiel actif** : commits récents (dernier mois maxi), issues qui reçoivent des réponses, pull requests régulièrement mergées.
- ✅ **Mainteneurs identifiés** : vrais profils avec historique, pas juste des handles anonymes créés la semaine dernière.
- ✅ **Sponsors / soutiens visibles** : GitHub Sponsors, OpenCollective, entreprise reconnue, fondation (Linux Foundation, Apache, etc.).
- ✅ **Stars et forks > 100** : signe d'usage réel par la communauté. Attention aux projets avec 50k stars et 0 commit depuis 2 ans (effet de mode passé).
- ✅ **Pas de CVE non patchés** : recherche sur `cve.mitre.org` ou directement `[nom du projet] CVE`.
- ✅ **Pour les libs npm/pip/cargo** : `npm audit` ou `pip-audit` ou `cargo audit` — commande à passer avant install.

### Outils gratuits pour automatiser

| Outil | Usage | Niveau |
|---|---|---|
| **GitHub Dependabot** | Alertes automatiques sur dépendances vulnérables | Activable en 1 clic sur tout repo GitHub |
| **OpenSSF Scorecard** | Score automatique de la santé sécurité d'un projet (18 checks, note sur 10) | Public, vérifiable sur `scorecard.dev` |
| **Socket.dev** | Analyse comportementale des packages npm en temps réel (détecte les comportements suspects, pas juste les CVE connues) | Free tier généreux |
| **Snyk Open Source** | Scan de vulnérabilités multi-langages | Free tier 1-2 projets |
| **deps.dev** (Google) | Visualisation des dépendances + scores Scorecard intégrés | 100% gratuit |

**Recommandation pratique** : active **Dependabot** sur tes repos GitHub maintenant (Settings → Security → Dependabot alerts). C'est gratuit, automatique, et te préviendra par email à chaque CVE détectée dans tes dépendances.

---

## 5. Pour une entreprise : comment instaurer une politique open source

Tu gères une équipe ou une boîte ? Tu ne peux pas laisser chaque dev installer ce qu'il veut sans cadre. Voici les fondations d'une vraie politique OS.

1. **Désigner un responsable open source** — interne (CTO, lead tech) ou avocat externe pour les questions de licence. Une seule personne référente, à qui les devs posent les questions.
2. **Whitelist de licences acceptées** :
   - **Toujours OK** : MIT, Apache 2.0, BSD (2 et 3 clauses), ISC, MPL 2.0.
   - **Cas par cas** : LGPL, EPL.
   - **À éviter ou bannir** pour usage interne propriétaire : GPL/AGPL (sauf si tu publies ton code), SSPL, BSL, Elastic License.
3. **Process de review pour toute nouvelle dépendance** — même rapide. Un Pull Request qui ajoute une dépendance doit être validé par le responsable OS. Ça force à se poser la question "ai-je vraiment besoin de cette lib ?" avant d'ajouter 200 transitives à ton projet.
4. **Outil SCA (Software Composition Analysis) en CI** : Snyk, FOSSA, Sonatype Lifecycle, ou GitHub Advanced Security. Bloque le build si une CVE critique est détectée.
5. **Contributing back** — encourage tes employés à contribuer aux projets que tu utilises. C'est éthique, c'est bon pour le recrutement, et ça réduit le risque que ces projets meurent. Donne du temps de travail rémunéré (1 jour par mois minimum pour les seniors).

---

## En résumé

L'open source, c'est un écosystème vivant. Il bouge, il évolue, il a parfois des accidents. Pas la peine d'avoir peur, juste besoin d'un peu de méthode :

- **Veille régulière mais légère** : 5 minutes par jour suffisent.
- **Vérifie la licence systématiquement** : 30 secondes pour éviter une catastrophe juridique 3 ans plus tard.
- **Outille-toi** : Dependabot et Socket.dev sont gratuits, activables en quelques clics, et te font gagner des semaines de galère.
- **Choisis les projets gouvernés par des fondations** quand c'est critique pour ton business.

Le vrai risque, ce n'est pas l'open source. C'est de l'utiliser sans regarder.

---

## Sources principales

- [XZ Utils backdoor — Wikipedia](https://en.wikipedia.org/wiki/XZ_Utils_backdoor)
- [Log4Shell — Wikipedia](https://en.wikipedia.org/wiki/Log4Shell)
- [Polyfill.io supply chain attack — Sonatype](https://www.sonatype.com/blog/polyfill.io-supply-chain-attack-hits-100000-websites-all-you-need-to-know)
- [colors.js et faker.js sabotage — Bleeping Computer](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/)
- [Redis license change — InfoQ](https://www.infoq.com/news/2024/03/redis-license-open-source/)
- [HashiCorp BSL change & OpenTofu fork — Spacelift](https://spacelift.io/blog/terraform-license-change)
- [Elastic license change 2021 — Elastic blog](https://www.elastic.co/blog/elastic-license-update)
- [OpenSSF Scorecard — scorecard.dev](https://scorecard.dev/)
- [Llama / Mistral open weights vs open source — Codieshub](https://codieshub.com/for-ai/open-weights-licensing-risks)
- [core-js maintainer story — The Stack](https://www.thestack.technology/core-js-maintainer-denis-pusharev-license-broke-angry/)
- [OpenSSF — openssf.org](https://openssf.org/)
- [Open Source Initiative — opensource.org](https://opensource.org/)
