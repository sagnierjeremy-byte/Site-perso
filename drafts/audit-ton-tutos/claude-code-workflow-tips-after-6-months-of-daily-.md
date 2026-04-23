# Audit ton — 6 mois de Claude Code au quotidien, vu par un non-dev

**Note globale : 8,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 9 | Phrases courtes, rythme excellent, peu de subordonnées, lecture fluide. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 7 | Spec-driven, MCP, multi-agents nommés mais pas explicités au passage. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 8 | Structure binaire dev/non-dev claire, 4 cas concrets, 3 pièges, checklist. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 9 | 1ère personne assumée, pas de familiarités, ton entrepreneur curieux net. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 9 | Article qui parle directement au non-dev, l'avantage est même posé en thèse. |

## Verdict
**OK · À publier tel quel** (avec 2-3 micro-retouches optionnelles)

L'article qui s'approche le plus du ton de l'article référence. Thèse forte (« le non-dev a un avantage »), 1ère personne partout, transparence assumée (« Écrit avec Claude, relu par moi »), chiffres concrets, pas une seule familiarité interdite. Les rares termes non glosés (spec-driven, MCP, routines, multi-agents) sont volontairement listés une seule fois pour montrer qu'on s'en fiche — c'est cohérent avec le propos.

## 3 à 5 passages problématiques (verbatim)
- « L'auteur est souvent un dev senior. Il parle de spec-driven development, de routines, de multi-agents, de serveurs MCP. » → 4 termes non glosés. Choix volontaire (le but est de montrer qu'on ne comprend pas), mais un débutant peut décrocher s'il croit qu'il devrait les connaître. Suggestion : ajouter une mini-phrase rassurante après : « Si ces 4 mots ne te disent rien, parfait — c'est le cœur de mon propos. »
- « Le dev senior sait ce qui est "normal". Moi non. » → bonne idée mais la formule mériterait une 2e phrase. Suggestion : ajouter « Quand un message rouge apparaît dans le terminal, lui devine ce que c'est. Moi, je le copie tel quel à Claude. »
- « Pas "est-ce que ça passera l'échelle à 10 000 utilisateurs". » → expression « passer l'échelle » est jargon dev (anglicisme « scale »). Suggestion : « Pas "est-ce que ça tiendra avec 10 000 utilisateurs". »
- « Si tu construis un SaaS qui sert mille clients » → « SaaS » non glosé. Suggestion : « Si tu construis un logiciel en ligne (un SaaS) qui sert mille clients ».
- « (préparé par un bouton de mon back-office) » → « back-office » récurrent, jamais glosé même si compréhensible. Optionnel : à la 1ère occurrence, ajouter « (back-office, l'interface privée pour piloter mon site) ».

## 3 à 5 passages réussis (verbatim)
- « Un dev senior a quinze ans d'habitudes à désapprendre. Toi, tu n'as rien à désapprendre. » → thèse limpide, contre-intuitive, vendable, 100% ton Leo.
- « Claude Code arrive dans ma vie comme un stagiaire qui sait déjà tout, qui ne demande pas de pause déjeuner et qui ne se plaint jamais. » → analogie excellente, drôle sans être familière, image qui parle à un entrepreneur.
- « Mes trois premières semaines, je lisais la documentation Anthropic, j'essayais de saisir chaque terme avant de lancer une commande. Résultat : j'avançais de 10% par semaine. Ce qui m'a débloqué : j'ai commencé à lancer, casser, poser la question à Claude, recommencer. » → vécu personnel, chiffré, leçon claire. Modèle de step-by-step pédagogique.
- « Attention, ce n'est pas une attaque aux devs — Les devs seniors produisent du code robuste parce qu'ils savent ce qui casse en production. » → callout d'humilité qui désamorce et crédibilise. Pile dans la posture « je peux me tromper ».
- « Je décris ce que je veux dans un fichier CLAUDE.md, j'ouvre Claude Code, je lui demande d'ajouter une section [...] Il le fait. Je relis en ouvrant la page dans un navigateur local. » → workflow concret, verbes simples, aucun jargon. Exactement le niveau cible.

## Recos prioritaires (3 max, actionnables)
1. Ajouter une phrase rassurante juste après la liste « spec-driven, routines, multi-agents, MCP » pour confirmer au débutant que ne pas connaître ces mots n'est pas un problème (et qu'aucun ne sera utilisé dans la suite de l'article).
2. Glose minimale pour 2-3 termes invisibles aux yeux d'un dev mais opaques pour un débutant : SaaS, back-office, « passer l'échelle ». 5 mots à chaque fois suffisent.
3. À publier tel quel après ces deux retouches. Cet article peut servir de référence interne « ton réussi sur tuto retour d'XP ».
