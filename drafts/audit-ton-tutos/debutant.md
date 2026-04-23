# Audit ton — Parcours débutant Claude

**Note globale : 8/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 8 | Phrases nettes, rythme bon. Quelques prompts copiables denses. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 7 | Glossaire en tête excellent, mais MECE/SCQA/Minto/ROAS lâchés sans glose. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 9 | Métaphore escalier 3 portes + 6 étapes claude.ai numérotées : exemplaire. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 9 | Salut moi c'est Jérémy, je lis tout, transparent sur l'IA, parfait. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 8 | Section objections "j'ai peur de tout casser" très rassurante, on perd le fil sur les 5 prompts métiers. |

## Verdict
**OK · À publier tel quel** (avec 3 micro-retouches recommandées)

L'article tient parfaitement le ton Leo — analogies fortes (escalier, stagiaire amnésique), 1ère personne assumée, transparence sur l'usage de Claude. Le pas-à-pas est exemplaire (3 portes + 6 étapes + 5 prompts + 7 cas concrets). Quelques accrocs ponctuels (jargon consultant non glosé dans le prompt B2B, terme « Claude Cowork » dont l'existence est à vérifier) mais rien de bloquant.

## 3 à 5 passages problématiques (verbatim)
- « Sois hypothesis-driven, pas descriptif. » → jargon consultant pur dans le prompt 04, contradictoire avec une page débutant. Remplacer par « Pars d'une hypothèse à valider, pas d'un résumé de la situation. »
- « Pyramide de Minto (la conclusion d'abord) - SCQA (Situation, Complication, Question, Answer) - MECE pour toute décomposition - "So what ?" à chaque point » → 4 sigles d'élite consulting balancés sans glose dans un seul bloc. Problème : un débutant qui copie ce prompt ne comprend rien à ce qu'il demande à Claude. Solution : ajouter une note « Si ces 4 mots ne te disent rien, garde-les quand même : Claude les comprend et structurera mieux. Tu apprendras ce qu'ils veulent dire en lisant ses réponses. »
- « Les marques DTC qui utilisent l'IA pour leurs fiches produits voient en moyenne +18 à 20 % de taux de conversion. » + « obtiennent un ROAS moyen de 3,8× » → DTC et ROAS lâchés sans glose dans la grille personas. Remplacer par « marques qui vendent en direct (DTC = direct-to-consumer) » et « un retour de 3,80 € pour 1 € de pub (ROAS = return on ad spend) ».
- « Claude Cowork » utilisé tout du long comme nom de produit Anthropic à mi-chemin entre Chat et Code → vérifier l'existence du nom (Anthropic parle de Claude.ai Projects + Claude Code + Claude Computer Use). Si « Cowork » n'est pas le nom officiel, risque de désorienter le lecteur qui cherchera ça sur claude.com.
- « 76 % des restaurateurs utilisent déjà l'IA. Bien utilisée, elle réduit de 70 % le temps passé à répondre aux avis Google. » → chiffre énorme posé sans plus de contexte. Le ton Leo demande « j'ai vérifié, voilà la source » plus appuyé. Sources sont citées en bas mais visuellement écrasées.

## 3 à 5 passages réussis (verbatim)
- « C'est la chambre d'hôtel. Propre, prête à l'emploi, tu entres, tu poses ta question, tu ressors. » → analogie parfaite, instantanée, débloque toute la suite.
- « Ce que tu dois faire : Traite Claude comme un nouveau collaborateur talentueux mais qui a besoin d'un onboarding à chaque fois. » → modèle mental le plus utile de la page, posé après le bon contexte.
- « Salut, moi c'est Jérémy. Je ne suis pas développeur. Je n'ai jamais suivi de formation tech. Pendant des années, le terminal m'intimidait autant qu'il intimide probablement la plupart des gens qui lisent cette page. » → ton Leo niveau référence, humble, transparent, fédérateur.
- « Les 7 mots à connaître avant de commencer » avec définitions ultra-simples (« Anthropic = L'entreprise qui fabrique Claude (comme OpenAI fabrique ChatGPT). ») → glossaire en ouverture, modèle à reproduire dans tous les tutos.
- « Si un humain nouveau dans ton équipe ne pouvait pas répondre sans plus d'infos, Claude non plus. » → règle mnémotechnique brillante, restera en tête du lecteur.

## Recos prioritaires (3 max, actionnables)
1. **Désamorcer les 4 sigles consulting du prompt 04** (Minto, SCQA, MECE, "So what?") avec une note d'1 ligne : « Si ces termes ne te parlent pas, copie quand même — Claude sait quoi en faire. » Sinon c'est la seule section qui décroche pour un vrai débutant.
2. **Vérifier le nom « Claude Cowork »** : si le produit s'appelle officiellement « Claude Desktop » ou « Claude.ai Projects », corriger pour aligner avec ce que le lecteur trouvera réellement sur claude.com. Aujourd'hui, un débutant qui cherche « Claude Cowork » pourrait ne rien trouver.
3. **Gloser DTC, ROAS, brand book** dans les personas e-commerce et agence — soit en inline soit dans le glossaire d'ouverture. Cohérence avec la promesse « zéro jargon ».
