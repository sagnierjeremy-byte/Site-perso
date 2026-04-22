---
jour: 4
envoi: J+3 (72h après inscription)
sujet: "Jour 4 · Ton premier workflow qui tourne sans toi"
preheader: "Un script, une commande, et Claude fait la tâche à ta place pendant que tu dors."
---

Salut,

Jour 4. Tu as Claude Code, un CLAUDE.md, des skills. Aujourd'hui on passe au **niveau au-dessus · un workflow qui s'exécute tout seul**.

## Ce qu'on va faire

Tu vas construire ton premier **workflow automatisé**. Un exemple concret qui prend 30 minutes et qui te fait gagner 2h par semaine.

Je te propose 3 idées selon ton métier. Choisis-en une et lance-toi.

## Option A · Automatiser ta veille (tous métiers)

**Problème** · tu passes 30 min par jour à parcourir Reddit, Twitter, des blogs, pour te tenir à jour.

**Solution** · un script qui scrape tes sources favorites chaque matin et te sort un résumé des 10 trucs importants.

**Comment** · dans Claude Code, dis ·
> *« Écris-moi un script Node.js qui fetch les 10 derniers posts de [r/ClaudeAI, r/Entrepreneur, OpenAI blog], me filtre les plus importants sur [IA, Claude Code, agents], et me sort un résumé de 5 bullet points. Lance-le avec `node veille.js`. »*

Claude écrit le script complet. Tu lances chaque matin avec `node veille.js`.

Bonus · si tu veux que ça tourne **tout seul**, demande · *« programme ce script pour qu'il tourne chaque matin à 7h et m'envoie le résultat par email ».*

## Option B · Décliner tes articles en posts sociaux (créateurs)

**Problème** · tu publies un article et tu n'as pas le courage d'écrire 2 posts LinkedIn + X derrière.

**Solution** · un prompt qui prend ton article et sort 2 drafts prêts à publier.

**Comment** · télécharge [**mon pack prompts**](https://jerwis.fr/downloads/jeremy-prompts-pack.md). Le Prompt 2 est exactement ça · tu copies-colles, tu remplaces `[URL-ARTICLE]` par ton fichier, Claude sort LinkedIn + X.

Gain typique · **45 min → 5 min** par article.

## Option C · Qualifier tes leads automatiquement (growth/sales)

**Problème** · tu reçois 20 demandes de contact par semaine, tu dois toutes les lire et trier.

**Solution** · un agent qui lit chaque email entrant, le score selon tes critères (taille entreprise, budget, urgence), te marque les hauts potentiels.

**Comment** · lire [mon article Agent Gmail](https://jerwis.fr/articles/tuto-agent-gmail.html). 15 min de lecture, 30 min d'install. Tu as un agent qui tourne en fond.

## La règle importante

**Quel que soit le workflow que tu choisis, dis à Claude en français ce que tu veux. Ne tape pas de commandes toi-même.**

Exemple de brief minimaliste ·
> *« J'ai un fichier leads.csv avec 50 lignes. Pour chaque ligne, analyse le nom de l'entreprise, regarde son site web, et note-moi (1-5) si c'est un lead prometteur pour [mon offre]. Sauve le résultat dans leads-scored.csv. »*

Claude écrit le script, l'exécute, tu récupères le résultat.

## Checkpoint

À ce stade de la semaine, tu dois avoir ·
- ✅ Claude Code installé
- ✅ Un CLAUDE.md configuré
- ✅ Au moins 1 skill utilisé pour une vraie tâche
- ✅ 1 workflow qui te fait gagner du temps

Si l'un des 4 coince, réponds-moi. On débloque ensemble.

## Ce que tu fais demain

Demain · **le dernier email**. Récap de ce que tu as construit + ta roadmap pour le premier mois (quoi explorer, quoi éviter, comment rester à jour).

À demain,

Jérémy

—
P.S. Pour les plus avancés · j'ai une stack complète de 11 outils qui tournent ensemble (n8n, Supabase, Resend, Zernio...). [Ma page outils](https://jerwis.fr/outils.html) détaille chacun. Mais n'y va pas encore · reste sur Claude Code pour l'instant.
