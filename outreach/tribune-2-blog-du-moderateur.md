# Tribune 2 · Blog du Modérateur (BdM)

**Cible** : Blog du Modérateur (média digital/marketing/IA grand public, ~1M lecteurs/mois)
**Email** : `contact@blogdumoderateur.com`
**Journaliste IA** : Matthieu Eugène (rédacteur récurrent IA) — `https://www.blogdumoderateur.com/auteur/matthieu-eugene/`
**Angle** : "Workflow Claude Code d'un non-dev qui livre" — cas pratique chiffré
**Pourquoi cette cible** : audience tech grand public + chefs de projet + marketers, format "Comment X utilise Y" très présent, DR ~75

---

## Email à envoyer

**Sujet** : Cas pratique IA — 25 articles + 1 outil micro-SaaS construit en 14 mois avec Claude Code (sans coder)

```
Bonjour Matthieu,

(ou : Bonjour l'équipe du Blog du Modérateur,)

J'aime votre rubrique « Comment X utilise Y » — la dernière sur [PRENDRE
1 ARTICLE PRÉCIS DE MATTHIEU EUGÈNE PARMI LES 5 DERNIERS, LIRE LE NOM, CITER]
m'a particulièrement marqué parce qu'on est sur du concret, pas du buzz.

Je vous propose un cas pratique qui pourrait coller à ce format :

  « Le workflow Claude Code d'un entrepreneur non-dev :
   25 articles, 1 newsletter à 1500 abonnés, 1 mini-SaaS en 14 mois »

Je suis Jérémy Sagnier (jerwis.fr), 41 ans, entrepreneur en Provence. Frère
jumeau de Kevin Sagnier qui a fondé Eurofiscalis. Pas développeur, pas codeur.
Mais j'utilise Claude Code en production depuis 18 mois pour piloter mon
site, ma newsletter et mes outils.

Ce que je peux raconter en cas pratique chiffré :

→ Mon workflow exact (Ghostty + Claude Code + 26 skills custom installés)
→ Combien ça coûte par mois (chiffres réels API, hosting, etc.)
→ Ce qui se casse régulièrement et comment je récupère
→ Les 5 « patterns » qui m'ont fait passer du brouillon au shipping
→ Pourquoi un non-dev peut aller plus vite qu'un dev sur certains projets
  (et l'inverse, où je suis limité)

Format possible :
- Article interview Q/A 1500 mots avec captures d'écran de mon setup
- Cas pratique structuré (Problème → Solution → Résultat chiffré)
- Vidéo screen capture si vous voulez du visuel (10 min, je sais faire)

Mes sources pour vérifier ce que j'avance :
- Articles : https://jerwis.fr/articles (les tutos Claude Code, dev-browser,
  hermes-agent sont les plus pertinents)
- Bio : https://jerwis.fr/jeremy-sagnier
- Press kit : https://jerwis.fr/presse

Si l'angle vous intéresse, dites-moi le format préféré, je peux livrer
en 5-7 jours. Sinon, aucun souci, je continue à vous lire.

Belle journée,
Jérémy Sagnier
jeremy.sagnier@jerwis.fr
```

---

## Cas pratique complet (1100 mots — prêt à coller dans Google Doc)

### Le workflow Claude Code d'un entrepreneur non-dev : 25 articles, 1500 abonnés, 1 mini-SaaS en 14 mois

**Cas pratique présenté par Jérémy Sagnier (fondateur de Jerwis Conseil)**

---

#### Le profil

Je m'appelle Jérémy Sagnier, j'ai 41 ans, je vis à Roussillon dans le Vaucluse. Je suis le frère jumeau de Kevin Sagnier, fondateur d'Eurofiscalis (cabinet de représentation fiscale créé en 2017). Je ne suis pas développeur. Je n'ai jamais codé professionnellement. Mais depuis novembre 2024, j'utilise Claude Code en production tous les jours pour faire tourner mon site jerwis.fr, ma newsletter AI Playbook (1500+ abonnés), mon podcast Guerres d'IA et un mini-SaaS de génération de photos personal branding à 39 €.

Voici comment.

#### Le setup (ce qui tourne sur ma machine)

- **Terminal** : Ghostty (à la place du Terminal Apple, parce que les couleurs et la rapidité font une différence quand tu y passes plusieurs heures par jour).
- **Claude Code** : l'outil officiel d'Anthropic en CLI. Mon abonnement Max (200 $/mois).
- **Mon fichier `CLAUDE.md`** : un document de ~5 000 mots qui décrit mes projets, mes conventions, mon ton, mes interdictions. Chaque session Claude Code le lit en premier.
- **26 skills custom** installés (compétences spécialisées que Claude peut activer selon le contexte).
- **MCP servers** connectés : Supabase, Resend, Notion. Ce qui veut dire que Claude peut directement lire et écrire dans ma base de données newsletter ou envoyer un email transactionnel.
- **dev-browser** : un outil que j'ai monté avec Claude pour qu'il pilote un navigateur Chrome (lire des pages, prendre des screenshots, faire de la veille).

#### Le coût mensuel réel

Pour donner des chiffres précis (chose rare dans ce sujet) :

- Claude Max : 200 € (équivalent abonnement Pro pour Jérémy seul)
- API Anthropic complémentaire (quand je dépasse les quotas Max) : 30-80 €
- Hosting Vercel : 0 € (plan Hobby suffit pour mon trafic)
- Resend (newsletter) : 0 € (plan gratuit jusqu'à 3000 emails/mois)
- Supabase (base) : 0 € (plan gratuit largement suffisant)
- ElevenLabs (voix podcast) : 22 € (plan Starter)
- Domaine + DNS : ~12 € / an

**Total moyen** : ~260 € / mois pour faire tourner trois canaux de contenu et un produit. C'est moins que ce que coûtait mon abonnement Adobe Creative Cloud en 2020.

#### Le workflow type d'une journée

**8h-9h** : je lis mon mail, je réponds aux messages newsletter. Pas d'IA.

**9h-10h30** : édition d'un article ou de la newsletter. Je tape un brouillon de 200-500 mots, puis je lance Claude Code dans le répertoire `~/Projets/jeremy-sagnier-site/`. Je lui dis : « lis mon brouillon, repasse en ton Leo, vérifie les chiffres, restitue-moi 3 versions du paragraphe d'intro ». J'arbitre, je fusionne, je publie. Une heure pour un article qui m'aurait pris trois heures il y a deux ans.

**10h30-12h** : développement. C'est le moment où je casse des trucs, où je fais évoluer le site, où je crée de nouveaux outils. Je décris ce que je veux à Claude Code en français, il propose une approche, je valide ou je redirige, il code, on teste. Je n'écris jamais une ligne moi-même.

**14h-17h** : selon la journée, soit production de la newsletter du vendredi, soit veille (avec dev-browser qui scanne 100+ sources), soit production d'un épisode de podcast.

#### Cinq patterns qui m'ont fait passer du brouillon au shipping

**1. Le `CLAUDE.md` explicite** — Sans ce document, chaque conversation repart de zéro. Avec, Claude connaît mes contraintes, mon ton, mes interdictions. Premier investissement : 2 heures pour le rédiger. Retour sur investissement : massif et permanent.

**2. Le « stop and ask »** — Quand Claude veut faire un truc qui touche plus de 3 fichiers ou la base de données, il s'arrête et me demande validation. Petit ajout dans le `CLAUDE.md`, économise des heures de rollback.

**3. Les skills modulaires** — Au lieu d'avoir un Claude « généraliste », j'ai 26 skills qui se déclenchent automatiquement selon le contexte. Le skill « éditeur article jerwis » se déclenche dans `articles/`. Le skill « newsletter » se déclenche quand je dis « rédige la newsletter ».

**4. Le commit atomique** — Chaque modification = un commit Git distinct. Si quelque chose casse, je reviens en arrière proprement. Claude le fait pour moi maintenant.

**5. Les sous-agents en parallèle** — Quand je veux faire de la recherche profonde (le procès Musk contre OpenAI, par exemple), je lance 4 sous-agents Claude en parallèle qui creusent des angles différents pendant que je fais autre chose. Économie de temps : un facteur 4 sur la phase recherche.

#### Ce qui se casse régulièrement

Pour la transparence : ce n'est pas la science exacte.

- **Claude hallucine des sources** environ une fois sur dix. Je vérifie systématiquement les chiffres et les citations avant publication.
- **Les déploiements Vercel échouent** parfois pour des raisons obscures. Claude répare en 3-4 essais, mais il y a des moments de frustration.
- **Les workflows d'agents complexes** demandent du tuning constant. Mon agent Hermes (qui trie mes 200 mails par jour) a pris trois itérations sur deux semaines avant d'atteindre 91 % de précision.

#### Pourquoi un non-dev peut aller plus vite qu'un dev sur certains projets

Contre-intuitif, mais vrai dans mon expérience. Trois raisons :

1. **Je n'ai pas d'attachement** à une stack particulière. Si Claude propose Supabase pour ma base et que mon ami dev m'aurait fait du Postgres direct, je n'ai pas d'opinion. Je prends le plus rapide à déployer.

2. **Je raisonne en cas d'usage**, pas en architecture. Mon site n'a pas besoin d'être scalable à 1 million d'utilisateurs. Donc je ne perds pas de temps sur l'optimisation prématurée.

3. **Je shippe quand c'est utile à moi**, pas quand c'est parfait. Mon mini-SaaS de génération de photos a été mis en ligne avec une UI brouillonne. J'ai fait 30 ventes avant de polir l'interface.

#### Où je suis limité

- **Sécurité applicative** : je ne comprends pas finement les implications des décisions sécurité. Pour mon outil payant, j'ai demandé une revue à un ami développeur sénior. Indispensable.
- **Performance pure** : je ne saurais pas optimiser une requête SQL complexe. Heureusement, je n'en ai pas besoin pour mon profil de site.
- **Debug profond** : quand quelque chose plante en production et que les logs sont obscurs, je galère plus longtemps qu'un dev.

#### Ce que ça dit du marché

Mon profil n'est pas une exception. Je croise des dizaines d'entrepreneurs non-tech qui, depuis fin 2024, sont devenus capables de livrer des produits qu'ils auraient sous-traités à 30 000 € il y a deux ans. Ce n'est pas la fin du développement professionnel. C'est l'apparition d'une nouvelle couche d'usage : des opérationnels qui passent du « j'ai une idée » à « j'ai un truc qui tourne » sans intermédiaire.

C'est ça, l'effet réel de Claude Code en 2026, dans la PME française. Pas une révolution. Une dégravitation du coût de mise en production.

---

**Jérémy Sagnier** publie chaque vendredi *AI Playbook*, sa newsletter sur l'IA pour non-développeurs. Il produit aussi le podcast *Guerres d'IA* (Jerwis Productions). Plus d'infos sur jerwis.fr.

---

## Notes pour l'envoi

- Personnaliser `[PRENDRE 1 ARTICLE PRÉCIS DE MATTHIEU EUGÈNE]` en allant sur la page auteur et en citant un article récent
- Bon timing : mardi-mercredi matin, en suivant ce que publie Matthieu
- Asset à proposer : capture d'écran du terminal Ghostty + Claude Code (visuel qui marche bien sur BdM)
- Si réponse positive, livrer captures d'écran HD dans les 48h
