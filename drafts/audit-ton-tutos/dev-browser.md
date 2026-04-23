# Audit ton — Dev-browser, navigateur piloté par ton IA

**Note globale : 7/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 8 | Bien rythmé, sections courtes, exemples concrets. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 5 | "Headless", "Chromium", "scraper", "cutoff", "JS", "npm" peu ou pas glosés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 8 | Vraie section installation 3 étapes, premier usage testé. Bien fait. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 7 | 1ère personne OK, "Mon avis en 5 secondes" sympa, mais quelques formulations sèches. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 6 | Effort réel mais le bloc de code JavaScript décroche le débutant. |

## Verdict
**⚠️ À retoucher**

Plus structuré que les autres (vrai pas-à-pas d'installation, cas d'usage clairs, check-list). Mais le bloc de code JavaScript en pleine page sans avertissement va effrayer le non-dev, et plusieurs termes techniques (headless, scraper, cutoff, npm install) glissent sans glose. La règle d'or "tu ne tapes jamais un script toi-même" est très bien posée — il faut juste l'appliquer en supprimant ou cachant le bloc de code intimidant.

## 3 à 5 passages problématiques (verbatim)
- Le bloc de code `dev-browser --headless <<'EOF' const page = await browser.getPage("main"); ...` → en plein milieu de l'article, ça contredit la règle "tu n'écris jamais de code". Suggestion : remplacer par une capture d'écran de Claude qui exécute la commande, ou cacher derrière un "Voir l'exemple technique (optionnel)".
- « Il ne connaît pas les pages récentes (créées après son cutoff). » → "cutoff" technique non glossé. Suggestion : « les pages créées après sa dernière mise à jour de connaissances ».
- « Ça se fait généralement avec npm install -g @anthropic-ai/dev-browser » → "npm install" jamais expliqué. Suggestion : ajouter en encart « npm install = la commande standard pour installer un outil en ligne de commande, comme un App Store en mode texte ».
- « Chromium en coulisse, comme Chrome sans les pubs » → la glose "comme Chrome sans les pubs" est sympa mais imprécise (Chromium est l'open source de Chrome, sans rapport avec les pubs). Suggestion : « Chromium, le moteur open source qui fait tourner Chrome, sans la fenêtre visible ».
- « scraper un site que Claude ne connaît pas » → "scraper" jamais glossé. Suggestion : à la première occurrence : « scraper (récupérer automatiquement le contenu d'une page web) ».

## 3 à 5 passages réussis (verbatim)
- « Tu ne tapes jamais un script dev-browser toi-même. Tu demandes ce que tu veux en français à Claude. Claude fait le script. Tu restes à 100 % dans ton rôle d'entrepreneur qui demande, jamais de développeur qui code. » → règle d'or parfaite, ton Leo + posture Jérémy assumée.
- « La première fois que j'ai lancé dev-browser, une fenêtre Chrome s'est ouverte sur mon écran et m'a fait sursauter. » → anecdote vécue, chaleureuse, transparente sur les ratés.
- « Je lis tout, je réponds, je peux me tromper sur tes besoins — tes retours me recadrent. » → respect impeccable du dogme transparence + appel à réponse.
- « 3 cas d'usage quotidiens : scraper une page, tester une page en local, prendre un screenshot. Et tu n'écris jamais de code toi-même — Claude le fait. » → TL;DR très clair, pose le contrat dès le départ.
- « Pour le grand public, j'accepte simplement que 10 % des sites refusent · je passe à autre chose. » → posture pragmatique, assume les limites sans dramatiser.

## Recos prioritaires (3 max, actionnables)
1. **Retirer ou masquer le bloc de code JavaScript** (le `EOF`/script multi-lignes). Il contredit frontalement la règle "tu n'écris jamais de code" posée dans l'article même. Le remplacer par une capture d'écran ou un détail repliable "Pour les curieux".
2. **Glossariser 5 termes critiques en première occurrence** : scraper, headless, Chromium, cutoff, npm install. Une parenthèse courte par mot.
3. **Ajouter une note "Si tu ne sais pas ce qu'est un terminal" en amont de la section Installation**. Aujourd'hui l'article saute la marche "ouvrir un terminal" comme si c'était évident. Pour le public Jérémy non-dev, c'est l'étape la plus intimidante.
