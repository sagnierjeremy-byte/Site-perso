# Enjeux business & techno · recherche

## Méta
- Date recherche : 2026-04-29
- Sources principales :
  - Bloomberg, CNBC, Washington Post, NPR, CNN, Reuters/Yahoo Finance
  - TechCrunch, The Information (cité), Fortune, Axios, Al Jazeera
  - Blog OpenAI officiel (openai.com/elon-musk, openai.com/our-structure)
  - Wikipedia (OpenAI, xAI) — pour cross-checks chronologiques
  - Sacra, Epoch AI, FutureSearch — pour les chiffres revenue/compute
  - Documents tribunal (musk-v-altman-openai-complaint-sf.pdf, courthousenews)
  - Simon Willison, Spyglass.org — pour la chronologie de l'AGI clause
- Méthode : croisement systématique de 2+ sources sur tout chiffre clé. Quand divergence → fourchette explicitée.

---

## 1. Structure légale OpenAI

### 1.1 Origine non-profit (décembre 2015)
- Fondation comme **OpenAI Inc.**, association à but non lucratif 501(c)(3) basée à San Francisco, le 11 décembre 2015.
- Co-fondateurs publics : Sam Altman, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, John Schulman, Elon Musk + Reid Hoffman, Jessica Livingston, Peter Thiel, AWS, Infosys, YC Research.
- Engagement initial annoncé : **1 Md$ de pledges**. Capital effectivement collecté très en deçà : seulement **133,2 M$** reçus à fin 2021 (Wikipedia OpenAI).
- Mission : "ensure that artificial general intelligence benefits all of humanity" + recherche ouverte (papers + open source).
- Source : https://en.wikipedia.org/wiki/OpenAI

### 1.2 Création de la "capped-profit" subsidiary (mars 2019)
- Le 11 mars 2019, OpenAI annonce **OpenAI LP**, filiale "capped-profit" détenue et contrôlée par OpenAI Nonprofit (qui est General Partner).
- **Le cap historique : 100x** sur les retours du premier round. Concrètement : un investisseur de 10 M$ ne peut récupérer plus de 1 Md$ de retours ; tout excédent revient à la non-profit.
- OpenAI précisait que le multiple serait **plus bas pour les rounds suivants** (jamais explicité publiquement combien).
- Raison : besoin d'attirer du capital à l'échelle nécessaire pour le compute (entraînement modèles frontier) — la non-profit pure ne pouvait pas lever des milliards.
- Sources :
  - https://openai.com/index/openai-lp/
  - https://techcrunch.com/2019/03/11/openai-shifts-from-nonprofit-to-capped-profit-to-attract-capital/
  - https://medium.com/@joycejshen/capped-profit-at-openai-f7e67fa93ff3

### 1.3 Transition vers Public Benefit Corporation (PBC) — état au 29 avril 2026
- Annonce du projet de transition en septembre/octobre 2024.
- **Restructuration finalisée le 28 octobre 2025** après approbation des états (notamment Delaware + California AG).
- Nouvelle structure :
  - **OpenAI Foundation** (ex-OpenAI Inc.) = nonprofit qui contrôle la PBC et détient une participation au capital.
  - **OpenAI Group PBC** = société à mission (Public Benefit Corporation Delaware) qui regroupe les activités commerciales.
- Particularité PBC : obligation légale de "advance its stated mission and consider the broader interests of all stakeholders" (vs corporation classique qui doit maximiser shareholder value).
- **Le cap 100x a été supprimé** lors de cette restructuration (FourWeekMBA, OpenAI Files).
- **OpenAI Foundation détient 26 %** d'OpenAI Group PBC, soit ~130 Md$ à la valuation d'octobre 2025.
- **Microsoft détient ~27 %** d'OpenAI Group PBC, valorisés ~135 Md$ (post-restructure, as-converted diluted basis).
- Engagement initial de la Foundation : **25 Md$** dédiés à santé + résilience IA.
- Limites de fundraising **levées** → OpenAI peut désormais préparer une IPO.
- Sources :
  - https://openai.com/our-structure/
  - https://openai.com/index/built-to-benefit-everyone/
  - https://openai.com/index/statement-on-openai-nonprofit-and-pbc/
  - https://www.cnbc.com/2025/10/28/open-ai-for-profit-microsoft.html
  - https://www.bloomberg.com/news/articles/2025-10-29/openai-s-public-benefit-corporation-plan-pbc-explained
  - https://www.openaifiles.org/restructuring (pour critiques)

### 1.4 Implications fiscales et de contrôle
- **Avantage fiscal de la non-profit** : exemption d'impôt fédéral sur les revenus (501(c)(3)) — préservé pour la Foundation seule, pas la PBC.
- Structuration PBC = autorisée à générer du profit imposable mais juge tenu de prendre en compte la mission. Plus flexible juridiquement qu'une non-profit pour lever et distribuer du capital.
- **Contrôle effectif** : Foundation conserve le contrôle juridique via majorité du board PBC, mais sa participation économique (26 %) est désormais minoritaire vs Microsoft (27 %) + nouveaux investisseurs.
- Critique principale (OpenAI Files, Musk) : transformation d'actifs charitables construits sous statut tax-exempt en valeur transférée vers actionnaires privés.

---

## 2. Deal Microsoft

### 2.1 Investissement total cumulé
| Date | Montant | Détail |
|---|---|---|
| Juillet 2019 | 1 Md$ | Premier ticket, avant ChatGPT |
| Janvier 2023 | ~10 Md$ | "Multi-year deal", confirme MS comme anchor investor |
| 2024 | ~2 Md$ supplémentaires | Tranches additionnelles |
| **Total engagé** | **~13 Md$** | dont **11,6 Md$ déployés** au 30/09/2025 |
| Mi-2026 | Solde 1,4 Md$ | Décaissement final attendu |

Sources :
- https://www.techi.com/microsoft-openai-13b-investment/
- https://deepquarry.substack.com/p/microsofts-quiet-investment-in-openai
- https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/

### 2.2 Termes du deal (avant restructuration octobre 2025)
- **Revenue share** : 20 % du chiffre d'affaires OpenAI versés à Microsoft jusqu'à atteinte de l'AGI.
- **Profit share phasé** : Microsoft récupère une part majoritaire des profits jusqu'à recoupement de son investissement, puis pourcentage dégressif.
- **Exclusivité Azure** : OpenAI tournait exclusivement sur Azure, MS = "compute provider of right of first refusal".
- **IP rights exclusifs** : MS a un accès exclusif aux modèles OpenAI pour l'intégration produit (Copilot, Bing, Office, GitHub).
- **Clause AGI** : voir §3.4.

### 2.3 Termes post-restructuration (28 octobre 2025 → ajustements 27 avril 2026)
- **Right of first refusal Azure supprimé** : OpenAI peut désormais utiliser d'autres clouds (d'où le deal Amazon $50B annoncé fin avril 2026).
- **Engagement OpenAI** : achat incrémental de **250 Md$ de services Azure** sur la durée du contrat.
- **Revenue share plafonné** : la part de revenus reversée à MS est désormais cappée (CNBC 27 avril 2026) — montant exact non public.
- **AGI clause "défangée"** : MS conserve les IP rights et l'exclusivité API jusqu'à AGI… mais OpenAI ne peut plus déclarer unilatéralement l'AGI ; un panel d'experts indépendants doit le valider, et la clause expire mécaniquement en **2032** quoi qu'il arrive.
- Microsoft conserve **27 % du capital** d'OpenAI Group PBC (~135 Md$).
- Sources :
  - https://www.cnbc.com/2026/04/27/openai-microsoft-partnership-revenue-cap.html
  - https://techcrunch.com/2026/04/27/openai-ends-microsoft-legal-peril-over-its-50b-amazon-deal/
  - https://simonwillison.net/2026/Apr/27/now-deceased-agi-clause/
  - https://spyglass.org/the-openai-microsoft-agi-clause/
  - https://techcrunch.com/2025/11/14/leaked-documents-shed-light-into-how-much-openai-pays-microsoft/

### 2.4 Valuation rounds (chronologie)
| Date | Valuation | Round | Investisseurs clés |
|---|---|---|---|
| Janvier 2023 | 29 Md$ | Microsoft $10B | Microsoft |
| Octobre 2024 | 157 Md$ | $6,6 Md$ | Thrive, MS, Nvidia, SoftBank |
| Avril 2025 | 300 Md$ | $40 Md$ | SoftBank lead |
| Février 2026 | 730 Md$ | $110 Md$ | Multi-investisseurs |
| **31 mars 2026** | **852 Md$** | **$122 Md$** (clôturé) | Amazon, Nvidia, SoftBank, MS, a16z, T. Rowe Price, MGX, TPG, retail $3B |

Sources :
- https://www.cnbc.com/2026/03/31/openai-funding-round-ipo.html
- https://www.bloomberg.com/news/articles/2026-03-31/openai-valued-at-852-billion-after-completing-122-billion-round
- https://openai.com/index/accelerating-the-next-phase-ai/
- https://www.bloomberg.com/news/articles/2026-02-27/openai-finalizes-110-billion-funding-at-730-billion-valuation
- https://tracxn.com/d/companies/openai/__kElhSG7uVGeFk1i71Co9-nwFtmtyMVT7f-YHMn4TFBg/funding-and-investors

---

## 3. Mission AGI et la charte

### 3.1 La charte (publiée le 9 avril 2018)
4 principes structurants :

1. **Broadly Distributed Benefits** : utiliser l'influence obtenue grâce à l'AGI pour bénéficier à tous, pas concentrer le pouvoir. Engagement à arrêter de competitor avec un projet "value-aligned" + safety-conscious qui serait sur le point d'atteindre l'AGI avant.
2. **Long-term Safety** : recherche safety rigoureuse. Si un autre projet aligné approche l'AGI avant nous, on bascule en mode assistance plutôt qu'en compétition.
3. **Technical Leadership** : être à la frontière technique pour avoir un impact réel sur la trajectoire.
4. **Cooperative Orientation** : collaborer activement avec autres labos + institutions, partager safety + standards.

Définition AGI dans la charte : *"highly autonomous systems that outperform humans at most economically valuable work"*.

Source : https://cyberir.mit.edu/site/openai-charter/

### 3.2 L'argument de Musk : OpenAI a dévié
- Plainte initiale (29 février 2024, San Francisco Superior Court) puis amendée fédéralement (août 2024).
- Thèse : Altman + Brockman ont fondé OpenAI avec Musk sur la base d'un "Founding Agreement" implicite (faire de l'AGI nonprofit, open-source, pour l'humanité). Le pivot capped-profit puis PBC + l'exclusivité Microsoft = breach of charitable trust + unjust enrichment.
- 26 claims initiales → **2 restantes au procès** (avril 2026) : breach of charitable trust + unjust enrichment.
- Musk demande : reversion à structure non-profit, retrait d'Altman et Brockman du board, ~130 Md$ de dommages reversés à la fondation.
- Source : https://www.courthousenews.com/wp-content/uploads/2024/02/musk-v-altman-openai-complaint-sf.pdf

### 3.3 L'argument d'OpenAI : restructure = nécessité concurrentielle
- Position OpenAI : sans capital privé à l'échelle, impossible de rivaliser avec Google DeepMind / Anthropic / Meta sur le compute. La non-profit pure aurait laissé l'AGI à des labs purement commerciaux.
- Données qui appuient cet argument :
  - **Compute roadmap OpenAI** : 30 GW de capacité visée d'ici 2030 (memo aux investisseurs avril 2026).
  - **Anthropic** : ~7-8 GW visés fin 2027.
  - Investissements miroirs : Google a engagé jusqu'à **40 Md$** dans Anthropic (avril 2026, $10B cash + $30B compute), Amazon a un deal jusqu'à **100 Md$ de compute** avec Anthropic.
- Argument repris par OpenAI : "Notre mission ne survit qu'avec un compute supérieur à la concurrence."
- Sources :
  - https://www.cnbc.com/2026/04/09/openai-slams-anthropic-in-memo-to-shareholders-as-rival-gains-momentum.html
  - https://techcrunch.com/2026/04/24/google-to-invest-up-to-40b-in-anthropic-in-cash-and-compute/

### 3.4 Le concept de "race to AGI" et qui est en tête
- Définition AGI **financière** (contrat MS-OpenAI fuité) : AGI = OpenAI génère assez de profits pour rembourser ses earliest investors ≈ 100 Md$ de profits cumulés. Cette métrique = source de tension MS / OpenAI.
- État du leaderboard (avril 2026, croisement Green Flag Digital + ARC Prize + TIME) :
  - **OpenAI** : GPT-5.5 sorti le 23 avril 2026, top benchmarks généralistes.
  - **Anthropic** : Claude Opus 4.7, leadership reconnu sur coding + agents (CoWork).
  - **Google DeepMind** : Gemini 3 Deep Think, ex æquo sur ARC-AGI-2.
  - **xAI** : Grok intégré à X + entreprise, monte en gamme avec investissement compute massif.
  - **Meta** : stratégie open-weight (Llama 3.1/4), valorisation pas en course directe.
- "Front three" : OpenAI, Anthropic, Google DeepMind. xAI = challenger en montée. Meta = strategy différentiation (open-source).
- Sources :
  - https://greenflagdigital.com/top-ai-models-ranked/
  - https://time.com/article/2026/04/27/time100-companies-ai/
  - https://techcrunch.com/2024/12/26/microsoft-and-openai-have-a-financial-definition-of-agi-report/

---

## 4. Chiffres clés (avril 2026)

| Métrique | Valeur | Date | Source |
|---|---|---|---|
| Valuation OpenAI (post-money) | **852 Md$** | 31 mars 2026 | Bloomberg, CNBC |
| Round le plus récent | **122 Md$** | 31 mars 2026 | OpenAI blog |
| Revenue run-rate OpenAI | **20 Md$** annualisé (24 Md$ en avril 2026, 2 Md$/mois) | Janvier 2026 (CFO Sarah Friar) → avril 2026 | Reuters/Yahoo Finance, futuresearch.ai |
| Revenue 2024 OpenAI | 6 Md$ | Année pleine | Sacra, Epoch AI |
| Revenue 2025 OpenAI | 20 Md$ (run-rate fin année) | Décembre 2025 | OpenAI CFO |
| Burn rate OpenAI | ~17 Md$ | 2025 | futuredigestnews |
| Donations Musk OpenAI nonprofit | **38-45 M$** (OpenAI dit <45M$, Musk a dit jusqu'à 100M$, court records 44-50M$) | 2015-2018 | OpenAI blog, TechCrunch, Wikipedia |
| Valuation Anthropic (primary) | **380 Md$** | 12 février 2026 | CNBC, Anthropic news |
| Offers secondary Anthropic | 800 Md$ - 1 T$ implicite | Avril 2026 | TechCrunch, TheNextWeb |
| Revenue run-rate Anthropic | **30 Md$** annualisé (vs 9 Md$ fin 2025) | Mars 2026 | Sacra |
| Valuation xAI | **230 Md$** (+ deal SpaceX-xAI valorisant xAI à 250 Md$) | Janvier 2026 / annonce SpaceX-xAI 2026 | TechCrunch, Hollywood Reporter |
| Round xAI Series E | 20 Md$ (upsizé depuis 15B) | Janvier 2026 | TechCrunch, CNBC |
| MS investissement OpenAI cumulé | **13 Md$ engagés / 11,6 Md$ déployés** | Sept 2025 | techi.com, deepquarry |
| MS participation OpenAI Group PBC | **27 % / ~135 Md$** | Octobre 2025 | Microsoft blog |
| OpenAI Foundation participation | 26 % / ~130 Md$ | Octobre 2025 | OpenAI |
| Coût entraînement GPT-4 | **78-100 M$** (Stanford AI Index, Altman) | 2023 | Epoch AI, Sam Altman |
| Coût entraînement GPT-5 | **500 M$ - 2,5 Md$** (estimations divergentes) | 2024-2025 | Fanatical Futurist, Daniel Newman |
| Coût frontier training projeté | >1 Md$ amorti d'ici 2027 | Trend 2,4x/an | arxiv 2405.21015 |

---

## 5. Offre rachat 97,4 Md$ février 2025

### 5.1 Conditions de l'offre
- **10 février 2025** : consortium Musk soumet un bid non sollicité de **97,4 Md$ all-cash** pour racheter le contrôle de la nonprofit OpenAI Inc.
- **12 février 2025** : Musk fixe une **deadline au 10 mai 2025** + lettre d'intention demandant accès aux records.
- Cible : la nonprofit (qui à l'époque contrôlait encore exclusivement la for-profit) — pas les actions de la for-profit.
- Logique : si Musk contrôle la nonprofit, il contrôle le board, donc OpenAI LP, donc le pivot vers PBC peut être bloqué.

### 5.2 Co-investisseurs
Liste des entités du consortium (selon WSJ + filings reportés par CNBC/Bloomberg/Axios) :
- **xAI** (Musk's x.AI Corp.)
- **Baron Capital Group**
- **Valor Management** (Antonio Gracias)
- **Atreides Management**
- **Vy Fund III** / **Vy Capital**
- **Emanuel Capital Management** (Ari Emanuel, CEO Endeavor)
- **Eight Partners VC** / **8VC** (Joe Lonsdale)

Sources :
- https://www.cnbc.com/2025/02/10/musk-and-investors-offering-97point4-billion-for-control-of-openai-wsj.html
- https://www.washingtonpost.com/technology/2025/02/10/elon-musk-openai-bid-valuation/
- https://www.bloomberg.com/news/articles/2025-02-10/musk-led-group-bids-97-4-billion-for-openai-control-wsj-says
- https://siliconangle.com/2025/02/10/consortium-led-elon-musk-makes-97-4b-offer-openai/
- https://fortune.com/2025/02/12/elon-musk-97-billion-openai-hostile-acquistion-all-cash-letter-of-intent/

### 5.3 Pourquoi le board OpenAI a refusé (14 février 2025)
- Vote **unanime** du board.
- Justification publique : "not a serious offer", "legal tactic" pour interférer avec la restructuration en PBC.
- **Bret Taylor** (chair board, ex-Twitter board chair lors du takeover Musk de 2022) communiqué officiel : *"Any potential reorganization of OpenAI will strengthen our nonprofit and its mission to ensure AGI benefits all of humanity."*
- **Sam Altman** réponse publique sur X : *"no thank you but we will buy twitter for $9.74 billion if you want"* (trolling).

Sources :
- https://www.bloomberg.com/news/articles/2025-02-14/openai-board-rejects-musk-s-97-4-billion-bid-to-control-company
- https://www.cnn.com/2025/02/14/tech/openai-board-rejects-musk-purchase-offer/index.html
- https://www.washingtonpost.com/technology/2025/02/14/openai-board-reject-musk-offer/

### 5.4 Implications légales : defensive measures
- Pas de "poison pill" classique (instrument de dilution actionnariale) en place — la structure non-profit / PBC en cours rendait l'application d'un poison pill juridiquement complexe.
- OpenAI a en revanche **introduit de nouvelles règles internes du board** post-offre Musk pour contrer toute future tentative hostile (IT Pro).
- Trend macro : retour des **poison pills + staggered boards** dans la tech US 2025-2026 face à la hausse des hostiles (Bloomberg Law).
- Source : https://www.itpro.com/business/openai-elon-musk-bid-board-changes
- Source : https://news.bloomberglaw.com/legal-exchange-insights-and-commentary/hostile-m-a-activity-could-spur-comeback-of-takeover-defenses

---

## 6. xAI : le concurrent fondé par Musk

### 6.1 Création et levées
- **Lancement officiel** : 12 juillet 2023, Musk annonce xAI Corp. (Nevada).
- Mission affichée : *"understand the true nature of the universe"*.
- Produit phare : **Grok** (1.0 nov 2023, 2.0 août 2024, 3.0 février 2025, intégré à X).
- Levées :
  - Décembre 2023 : 134,7 M$
  - Mai 2024 : 6 Md$ (Series B, valuation 24 Md$)
  - Décembre 2024 : 6 Md$ (Series C, valuation 50 Md$)
  - Mars 2025 : acquisition de X Corp. en all-stock, deal valorisé X à 33 Md$ + 12 Md$ debt = 45 Md$ ; xAI valorisé 80 Md$.
  - Juillet 2025 : 10 Md$ ($5B equity + $5B debt via Morgan Stanley)
  - Septembre 2025 : 10 Md$ equity, valuation 200 Md$.
  - **Janvier 2026 : Series E 20 Md$** (upsize depuis 15B), valuation **230 Md$**. Investisseurs : Valor, StepStone, Fidelity, QIA, MGX, Baron Capital, Nvidia, Cisco, Tesla (~$2B sous réserve approbation régulatoire).
- **Annonce 2026** : SpaceX acquiert xAI en all-stock, entité combinée valorisée **1,25 T$** (SpaceX 1T$ + xAI 250 Md$). Plus grosse fusion privée de l'histoire.

### 6.2 Comment Musk attaque OpenAI tout en construisant un concurrent direct
- Argument Musk : "OpenAI a triché sur la mission ; xAI = ce qu'OpenAI aurait dû être."
- Réalité business : xAI construit le même type de modèle frontier que GPT/Claude/Gemini, sur du capital privé, avec une exclusivité d'intégration sur X et Tesla.
- **Ironie soulevée par OpenAI** dans sa défense (blog post officiel + dépositions) : Musk reproche à OpenAI exactement la trajectoire qu'il prend lui-même (for-profit, capital privé massif, intégration produit).
- Argument "compétitivité défavorable" de Musk au procès : si OpenAI conserve sa structure exemptée d'impôt + ses early-mover advantages, xAI se bat à armes inégales.

Sources :
- https://en.wikipedia.org/wiki/XAI_(company)
- https://www.cnbc.com/2025/11/13/musk-xai-funding.html
- https://techcrunch.com/2026/01/06/xai-says-it-raised-20b-in-series-e-funding/
- https://www.hollywoodreporter.com/business/digital/elon-musk-xai-raises-20-billion-new-funding-round-1236465907/
- https://sacra.com/c/xai/

---

## 7. Pourquoi ce procès matters (synthèse pour l'article)

### Au-delà du drama personnel, 5 enjeux structurels :

**1. Le précédent juridique pour le secteur non-profit tech.**
Si Musk gagne sur le breach of charitable trust, ça ouvre la porte à des challenges similaires contre toute non-profit qui pivote vers du for-profit en gardant les actifs construits sous statut tax-exempt. Conséquence directe : refroidissement immédiat de la création de structures hybrides (capped-profit, PBC subsidiaries) pour les futurs labs IA. Mozilla, Wikimedia, et toute fondation tech regardent.

**2. La gouvernance de l'AGI passe d'un board à un panel d'experts.**
Le procès a déjà accouché d'un changement majeur en avril 2026 : la "AGI clause" du contrat MS-OpenAI, qui donnait au board OpenAI le pouvoir de déclarer unilatéralement l'atteinte de l'AGI (et donc de couper Microsoft des modèles), a été remplacée par un panel d'experts indépendants + une date butoir (2032). Le pouvoir de définir l'AGI passe de "le board d'une entreprise" à "un comité d'experts". Précédent fondamental pour la régulation IA.

**3. Le verrou non-profit comme outil de contrôle de l'IA est en train de mourir.**
La théorie de 2015 (faire de l'AGI dans une structure non-profit → contrôle moral + non-extraction de valeur privée) est validée comme **non-viable financièrement** à l'ère du compute à 30 GW + entraînements à 1 Md$. Quel que soit le verdict, le message est passé : l'AGI sera développée par des entités for-profit, le seul levier de contrôle restant = la régulation.

**4. Le concept de "compétitivité défavorable" devient une stratégie juridique.**
Musk inaugure un playbook : attaquer un concurrent dominant sur la base de sa structure légale, tout en construisant un challenger direct. Si ça marche, ça ouvre un terrain de jeu juridique pour les concurrents émergents (xAI vs OpenAI, mais demain tous les follow-ons vs incumbents) — pas seulement en IA.

**5. La concentration du marché de l'AGI.**
Quoi qu'il arrive, le procès expose au grand public les chiffres réels : 5 acteurs (OpenAI 852 Md$, Anthropic 380 Md$ → 1T$ implicite, Google DeepMind, xAI 230-250 Md$, Meta) accaparent l'intégralité du compute frontier. Si Musk gagne et force OpenAI à reverser 130 Md$ à la nonprofit, ça redistribue mais ne change pas la structure oligopolistique — et fragilise l'acteur le plus exposé à la mission "humanité" au profit des purs for-profits.

### Scénarios de verdict (mai 2026 attendu)

**Si Musk gagne (verdict + remedies acceptés par juge Gonzalez Rogers) :**
- Reversion partielle ou totale d'OpenAI Group PBC vers structure non-profit contrôlée.
- Dommages jusqu'à 130 Md$ versés à OpenAI Foundation.
- Possible retrait Altman + Brockman du board (improbable : remedy maximaliste).
- Effet immédiat : choc sur la valuation 852 Md$, gel des préparatifs IPO, renégociation forcée du deal Microsoft.
- Effet secteur : gel de toute restructuration similaire en cours, pression réglementaire renforcée.

**Si OpenAI gagne :**
- Validation rétroactive du modèle "non-profit qui crée capped-profit qui devient PBC".
- Voie ouverte à l'IPO d'OpenAI (probable courant 2027).
- Anthropic pourrait suivre un chemin similaire (PBC → IPO).
- Musk continue avec xAI mais perd son levier juridique sur OpenAI.
- Précédent dangereux côté philanthropie tech : actifs non-profit transférables vers for-profit avec faible contrôle judiciaire.

**Verdict mixte (le plus probable selon analystes Fortune + MIT Tech Review) :**
- Rejet du breach of charitable trust (claim juridiquement faible) mais reconnaissance partielle de l'unjust enrichment.
- Compensation symbolique mais pas de reversion structurelle.
- Statu quo de la PBC, contrats Microsoft maintenus, IPO légèrement retardée.

Sources clés :
- https://www.cnbc.com/2026/04/28/openai-trial-elon-musk-sam-altman-live-updates.html
- https://www.npr.org/2026/04/28/nx-s1-5801438/musk-altman-openai-trial-opening-statements
- https://www.technologyreview.com/2026/04/28/1136479/the-download-musk-altman-openai-trial-ai-profit-problem/
- https://fortune.com/2024/03/05/elon-musk-openai-lawsuit-founding-agreement-artificial-general-intelligence/
- https://localnewsmatters.org/2026/04/21/musk-v-altman-how-openais-founders-went-from-tech-allies-to-bitter-courtroom-enemies/
- https://www.aljazeera.com/economy/2026/4/27/elon-musk-trial-against-sam-altman-to-reveal-openai-power-struggle
