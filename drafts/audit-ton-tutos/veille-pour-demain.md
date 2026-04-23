# Audit ton — Veille construite avec Claude Code

**Note globale : 7/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 8 | Bien écrit, narration claire, quelques tournures un peu longues sur la fin. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 5 | "Sous-agents", "embeddings", "SQLite", "long-form", "Sonnet/Opus" jamais glosés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 6 | Étude de cas, pas tuto. Saute des étapes (comment lance-t-on un sous-agent ?). |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 9 | Très réussi : transparent, chiffré, assume les ratés et le pivot. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 6 | Le vocabulaire technique fait décrocher dès la section "construction". |

## Verdict
**⚠️ À retoucher**

Bon récit, ton Leo très bien tenu, mais l'article perd le débutant à mi-parcours dès qu'on entre dans le "comment". La liste des composants techniques (Ollama, embeddings multilingues, Claude Sonnet/Opus, SQLite, worker, planificateur Mac) arrive en bloc, sans glose. Le débutant ne saura pas ce qu'il a sous les yeux. À retoucher : ajouter 5-6 parenthèses explicatives suffirait.

## 3 à 5 passages problématiques (verbatim)
- « J'ai lancé trois sous-agents de recherche en parallèle. » → "sous-agents" est un concept Claude Code jamais expliqué. Suggestion : « j'ai lancé trois recherches en parallèle (Claude Code permet de lancer plusieurs assistants en même temps, chacun sur une tâche) ».
- « Un moteur de recherche sémantique qui tourne en local grâce à Ollama — un modèle d'embeddings multilingue qui comprend les 96 sources même quand elles parlent des langues différentes. » → "moteur sémantique", "embeddings", "Ollama" : trois termes opaques empilés. Suggestion : « Un moteur qui regroupe les articles par sens (pas juste par mots-clés). Il tourne sur mon Mac grâce à Ollama, un outil gratuit que j'ai déjà présenté ici ».
- « Deux modèles Claude utilisés à des étapes différentes : Claude Sonnet pour proposer 30 sujets du jour, Claude Opus pour rédiger les analyses long-form quand je sélectionne un sujet. » → "Sonnet", "Opus", "long-form" non glosés. Suggestion : « Deux versions de Claude : la rapide (Sonnet) pour proposer 30 sujets, la plus puissante (Opus) pour écrire des analyses détaillées de 1 000 mots ».
- « Un worker qui tourne à 7h du matin, déclenché par le planificateur de mon Mac. » → "worker", "planificateur" : jargon. Suggestion : « Un petit programme qui se lance tout seul à 7h, comme une alarme programmée sur ton Mac ».
- « Une base SQLite qui vit entièrement sur mon disque. » → SQLite jamais expliqué. Suggestion : « Une mini-base de données stockée dans un seul fichier sur mon disque (technologie SQLite — gratuit, rien à installer) ».

## 3 à 5 passages réussis (verbatim)
- « J'ai voulu lancer une newsletter généraliste. Les sous-agents de recherche m'ont rendu un verdict brutal : marché saturé, coût d'opportunité énorme, moins de 5 % de chances d'en vivre en 24 mois. » → assume l'échec/pivot, chiffré, transparent.
- « Le déclic, c'est quand j'ai arrêté de vouloir un produit et que je me suis demandé ce que moi, concrètement, j'aurais aimé avoir dans ma journée. » → pitch central "d'abord pour moi" parfaitement incarné.
- « Le coût mensuel tourne autour de 5 € par mois, parfois un peu plus selon ma fréquence d'usage. Max 10 € les mois où je fais beaucoup d'analyses. » → chiffres concrets, honnêteté sur les ordres de grandeur.
- « Je ne vends rien. Je cherche juste à comprendre comment les autres s'y prennent. » → posture "force de proposition" sans pose commerciale.
- « Quand j'étais seul avec mon idée, je me serais dit que c'était un projet de six mois. Avec Claude Code, c'est une journée de construction. » → contraste avant/après très accessible, sans jargon.

## Recos prioritaires (3 max, actionnables)
1. **Glossariser en bloc les 5-6 termes techniques de la section "Construction"** : sous-agent, worker, planificateur, SQLite, embeddings, Sonnet/Opus. Une parenthèse de 5 mots suffit pour chacun.
2. **Ajouter une intro "Avant de commencer" qui pose ce qu'est Claude Code** et ce qu'est un "sous-agent". L'article suppose qu'on a lu d'autres tutos du site, mais l'intro doit autoriser une lecture isolée.
3. **Reformuler le pic technique de la liste à puces "voici ce qu'il y a dedans"** en mode "ce que ça fait" plutôt que "ce que c'est techniquement". Exemple : remplacer "Une base SQLite qui vit sur mon disque" par "Toutes les données restent stockées chez moi, pas dans le cloud — un seul fichier que je peux sauvegarder".
