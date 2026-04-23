# Audit ton — Les loops Claude Code, expliqués

**Note globale : 7,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 8 | Phrases courtes, rythme bon, quelques anglicismes lourds dans les pré-requis. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 6 | « cron », « cache prompt », « tokens mis en cache », « hooks settings.json » non glosés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 8 | Bonne structure timed/dynamic puis cas, tableau clair, checklist finale. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 8 | « Je » bien posé, transparent, rare familier (« qui marchent », « bosser »). |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 7 | Le cas non-dev arrive trop tard, monitoring/déploiement perd un débutant. |

## Verdict
**⚠️ À retoucher**

Le squelette tient (1ère personne, transparence, pas-à-pas, chiffres). Mais plusieurs termes techniques cardinaux (cron, cache prompt, tokens, hooks, MCP, sous-agent) ne sont pas glosés à leur 1ère occurrence — un vrai débutant qui n'a jamais codé décroche dès la 3e section. À corriger avant publication propre.

## 3 à 5 passages problématiques (verbatim)
- « Pense à un cron job, mais beaucoup plus intelligent. Un cron te lance un script bête. » → « cron job » non expliqué + « script bête » trop familier. Suggestion : « Imagine une minuterie qui relance une tâche toutes les X minutes (un "cron job", pour le terme exact). »
- « Le cache prompt Anthropic a une durée de vie de 5 minutes, rafraîchie à chaque appel réussi. Tant que tes loops tournent à moins de 5 minutes d'écart entre deux appels, le cache reste chaud et tu paies les tokens mis en cache à environ −90% » → 4 termes non glosés en 2 phrases (cache, tokens, "cache chaud", "cache miss"). Suggestion : ajouter une mini-définition du cache et renvoyer au lexique pour « token ».
- « Les hooks settings.json — faire que Claude déclenche automatiquement une action à chaque fin de session » → « hooks », « settings.json » jamais introduits. Suggestion : « Les hooks (petits déclencheurs automatiques configurés dans un fichier settings.json)... »
- « 5 minutes de questions, 0 de correction ensuite. » et « les tournures IA-ish » → registre limite familier. Suggestion : « zéro correction ensuite » et « les tournures qui sentent le ChatGPT ».
- « Couvre les 4 cas. » (Piège 2) → trop sec pour un débutant qui découvre la logique de filtre. Suggestion : « Pense à couvrir les 4 cas possibles, sinon tu rates les pannes. »

## 3 à 5 passages réussis (verbatim)
- « Avant, je checkais manuellement mes veilles 3 fois par jour. Maintenant, un loop tourne, me ping quand il trouve quelque chose d'intéressant » → 1ère personne, contexte vécu, bénéfice concret. Pile dans le ton Leo.
- « Tu mets /loop 1m "fais X" pour "voir ce que ça donne", tu laisses ta session ouverte, tu oublies. 1 440 runs en 24 h. » → exemple chiffré, mise en garde claire et pédagogique sans jargon.
- Tableau « Mécanisme · Session · Mac · Idéal pour » → matérialise visuellement les 3 modes, parfait pour débutant.
- « Active le plafond de dépense sur ton compte Anthropic (Settings → Billing → Usage limits). Mets 20 $/mois au départ. » → action concrète, pas-à-pas, ton de copain qui prévient.
- « C'est quoi "sous-agents parallèles" ? [...] Comme si tu embauchais 5 stagiaires pour la même heure » → analogie nette, gloss au moment où le terme apparaît. Modèle à généraliser.

## Recos prioritaires (3 max, actionnables)
1. Glosser systématiquement à la 1ère occurrence : cron, token (déjà linké au lexique mais à expliciter en 1 ligne), cache prompt, hooks, settings.json, sous-agent, skill custom. Une parenthèse de 8 mots suffit.
2. Remonter le « Cas 00 · Pour les non-devs » avant le cas monitoring/déploiement Vercel — ou retirer le cas Vercel des 4 cas principaux et le mettre en bonus, pour ne pas perdre l'audience cible dès le 2e exemple.
3. Nettoyer 4-5 micro-familiarités (« qui marchent pas », « ça donne », « tournures IA-ish ») et remplacer par des formulations équivalentes côté ami-qui-écrit-un-mail-le-dimanche.
