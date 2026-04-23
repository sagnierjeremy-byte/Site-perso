# Audit ton — Superpowers, le plugin qui force Claude à réfléchir

**Note globale : 5,5/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 6 | Phrases ok, mais empilement d'anglicismes et de noms de skills illisibles. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 4 | TDD, refactor, root cause, worktree, anti-patterns, marketplace : zéro gloss. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 6 | Installation claire en 4 étapes, mais le concept arrive avant tout pré-requis. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 6 | « Je » présent mais quelques familiarités (« prend des plombes », « overkill », « bricoler »). |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 4 | Article quasi inaccessible : 14 noms de skills techniques en anglais, peu de glose. |

## Verdict
**⚠️ À retoucher** (proche du « ❌ À refaire » sur le critère débutant)

Le contenu est honnête (avis nuancé, sources citées, transparence sur le « Écrit avec Claude, relu par moi »), mais l'article suppose qu'on parle déjà la langue Claude Code. Un débutant qui n'a jamais codé ne sait pas ce qu'est TDD, un worktree, root cause, ni un anti-pattern, et ne sera pas porté par les noms de skills bruts en anglais. À retoucher en priorité sur la glose et le tri du contenu.

## 3 à 5 passages problématiques (verbatim)
- « **2. Test-Driven Development (TDD)** — Claude écrit d'abord un test qui échoue, puis le code qui le fait passer, puis il refactorise. » → « test », « refactorise », « TDD » non glosés. Un débutant ne sait pas pourquoi écrire un test qui échoue est utile. Suggestion : intro 2 lignes sur ce qu'est un test automatique, puis l'idée de TDD avec une analogie.
- « **systematic-debugging** · Quatre phases obligatoires · (1) investigation de root cause, (2) pattern, (3) hypothèse + test, (4) fix. » → 4 mots techniques d'affilée, dont « root cause » et « fix » en anglais brut. Suggestion : « (1) chercher la vraie cause (root cause), (2) repérer le motif récurrent, (3) tester une hypothèse, (4) corriger. »
- « using-git-worktrees · Crée une branche isolée (worktree) avant de commencer » → « branche », « worktree », « git » jamais introduits. Pour un débutant : zéro accroche.
- « Depuis Superpowers, changer un bout de CSS prend des plombes. » et « Insupportable si tu veux juste bricoler. » et « overkill sur les petites tâches » → « prend des plombes », « bricoler », « overkill » : 3 familiarités/anglicismes interdits par le CLAUDE.md sur la même page.
- « Mejba Ahmed, dans un benchmark sur 12 sessions, mesure que les tâches simples consomment 10-15 % de tokens en plus » → « benchmark », « tokens » ressortent sans glose. Suggestion : « dans une étude comparative » et « consomment 10-15 % de tokens en plus (la "monnaie" facturée par Claude pour chaque mot traité) ».

## 3 à 5 passages réussis (verbatim)
- « Mon avis en 5 secondes — Superpowers, c'est la ceinture de sécurité de Claude Code. Indispensable quand tu lances un projet sérieux. Insupportable si tu veux juste bricoler. » → analogie immédiate, tranchée, dans le ton « entrepreneur curieux ».
- « Je n'ai Superpowers que depuis quelques jours. Voici 3 scénarios concrets où je l'activerai la semaine prochaine. » → transparence parfaite (assume la fraîcheur du test), 1ère personne directe.
- « Avant : "Fais-moi X" → Claude pond du code → tu découvres que ce n'était pas exactement ça. Avec Superpowers : Claude t'interroge 3 minutes → propose un design → tu valides → plan écrit → exécution testée. » → format avant/après en bullets, ultra-lisible.
- « Verdict honnête : parfait pour les vrais projets, overkill sur les petites tâches. Tu le désactives en une commande quand tu veux juste bricoler. Écrit avec Claude, relu par moi. » → mention « écrit avec Claude, relu par moi » : pile la transparence du ton Leo.
- « Quand je veux juste bricoler [...] claude plugin disable superpowers. Quand je lance un vrai projet [...] claude plugin enable superpowers. » → règle pratique très concrète, copiable.

## Recos prioritaires (3 max, actionnables)
1. Réécrire la section « Les 14 skills en clair » : pour chaque skill, virer le nom anglais brut (`brainstorming`, `writing-plans`...) du H4 et le remplacer par une accroche en français (« Brainstormer avant de coder », « Écrire un plan détaillé »...) — garder le slug technique en petit, entre parenthèses, pour les utilisateurs avancés.
2. Ajouter en début d'article (après le TL;DR) un mini-encadré « Le vocabulaire en 3 lignes » qui glose : test automatique, TDD, root cause, branche/worktree, plugin, marketplace, sous-agent. Sinon les 7 sections suivantes sont impénétrables.
3. Nettoyer les 6 marqueurs familiers/anglicismes (« prend des plombes », « overkill », « bricoler », « benchmark », « overhead », « auto-invoque »). Tester à voix haute la règle « copain au bar vs ami qui écrit un mail un dimanche soir ».
