# Audit ton — Tuto agent Gmail

**Note globale : 7,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 8 | Phrases courtes, structure pas-à-pas claire, blocs de code bien séparés. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 6 | OAuth, MCP server, launchd, cron, API tokens : tombent sans glose. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 9 | 6 étapes numérotées, prérequis explicites, exemple de sortie attendue. Excellent. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 7 | "Je", appel à réponse final OK, mais reste assez procédural au milieu du tuto. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 7 | Promesse "ouvre le terminal pour la 1ère fois" tenue, sauf section MCP/OAuth qui décroche. |

## Verdict
**⚠️ À retoucher** (légèrement)

L'article est le mieux structuré des 4 audités. Pas-à-pas exemplaire (étapes numérotées, prérequis listés, sortie attendue, pièges). Ton Leo correct, surtout dans les pièges et la conclusion. Trois accrocs : (1) la section "MCP server / OAuth Google Cloud" décroche brutalement le débutant ; (2) le calcul de coût "Haiku 4.5 à 1 $ par million de tokens" balance "tokens" sans glose ; (3) le milieu du tuto (étapes 4-5) tombe en pose procédurale, le "je" disparaît. Une passe de glose + 3-4 phrases personnelles redonne le ton et fait passer à 9/10.

## 3 à 5 passages problématiques (verbatim)
- « Si tu veux que l'agent puisse étiqueter et archiver les mails, il te faut un MCP server. Le plus propre aujourd'hui s'appelle shinzo-labs/gmail-mcp. » → "MCP server" jamais expliqué. Le débutant lit "tu as besoin d'une chose technique avec un nom GitHub bizarre". Suggestion : "tu as besoin d'un petit programme qu'on appelle un MCP server (un connecteur qu'on branche à Claude pour lui donner de nouveaux pouvoirs)".
- « Cette option demande de créer un projet Google Cloud et de télécharger une clé OAuth. » → "projet Google Cloud" et "clé OAuth" : deux blocs technique balancés en une phrase, tuto absent. Suggestion : soit renvoyer vers un mini-tuto séparé, soit le détailler en 3 sous-étapes avec captures.
- « Le tarif est Haiku 4.5 à 1 $ par million de tokens en entrée, et 5 $ en sortie » → "tokens" jamais glosé dans l'article. Suggestion : remplacer par "environ 5 € par mois pour 30 lectures de boîte mail. Si tu veux le détail technique : Haiku 4.5 facture 1 $ par million de tokens (un token ≈ 4 caractères)".
- « Tu peux aussi orchestrer depuis Zapier ou Make qui déclenche Claude Code à distance. » → "orchestrer" jargon SaaS. Suggestion : "tu peux aussi piloter ton agent depuis Zapier ou Make (deux services qui font tourner des automatisations dans le cloud)".
- « C'est l'option la plus simple. La routine tourne dans le cloud Claude, ton Mac n'a pas besoin d'être allumé. » → "routine" et "cloud Claude" pas terriblement parlants pour un vrai débutant. Suggestion : "C'est le plus simple. Ton tuto tourne sur les serveurs d'Anthropic — ton Mac peut être éteint, ça marche quand même".

## 3 à 5 passages réussis (verbatim)
- « Si tu n'as jamais ouvert de terminal de ta vie, ce tutoriel reste faisable. Tu vas copier-coller cinq commandes. Mais prends ton temps sur chacune. » → bienveillance, pose la cible, dédramatise. Ton Leo parfait.
- « Quarante-cinq minutes devant toi, sans interruption. Si tu fais une pause au milieu d'une étape OAuth, tu devras tout recommencer. » → conseil pratique vécu, prévient un piège réel.
- « Ne mets jamais d'envoi automatique de mails tant que tu n'as pas un mois d'usage derrière toi. […] Un agent qui envoie « par erreur » un mail à un client te coûte plus cher que deux ans d'abonnement Claude Pro. » → conseil tranché, chiffré, posture senior.
- « Pendant sept jours, ouvre les catégories et ajuste ton prompt en ajoutant des règles : "Les mails de telle adresse sont toujours urgents", "Les digests Substack ne sont jamais urgents". Au bout d'une semaine, l'agent est calibré. » → pas-à-pas concret + horizon temps + vécu.
- « **Je peux me tromper.** Les MCP Gmail évoluent vite et certains repos GitHub utilisés dans ce tutoriel peuvent devenir obsolètes. Si une commande ne fonctionne plus, écris-moi, je mets le tutoriel à jour. » → ton Leo signature, transparence, appel à réponse.

## Recos prioritaires (3 max, actionnables)
1. **Découper l'étape 2 "Brancher Gmail"** : faire une vraie option A pas-à-pas (3 captures du connecteur natif), et renvoyer l'option B (MCP server + projet Google Cloud + OAuth) vers un article séparé. Là, en l'état, on perd le débutant en plein milieu du tuto principal.
2. **Glosser à minima** : tokens, MCP, OAuth, cron, launchd, "orchestrer". Une parenthèse à chaque première occurrence suffit. Modèle : ce que fait `llm-local-pour-non-dev.html` avec « RAG » ("le mot fait peur, le concept est très simple").
3. **Réinjecter du "je" entre les étapes** : insérer 2-3 micro-paragraphes "voilà ce que ça donne chez moi", "j'ai mis 4 essais avant que ce prompt fonctionne", "le 1er matin où j'ai vu le briefing arriver à 7h, j'ai souri tout seul". Le tuto deviendrait une expérience partagée plutôt qu'un mode d'emploi.
