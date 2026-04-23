# Audit ton — Agents IA, à quoi ça sert

**Note globale : 6/10**

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 7 | Phrases globalement courtes, structure aérée, mais densité info parfois élevée. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 4 | LLM, RAG, fine-tuner, MCP, DPIA, DPA, tokens, prompt injection : non glossés. |
| Pas-à-pas (gradation, prend par la main, aucune étape implicite) | 6 | Guide théorique correct, mais saute du concept au déploiement sans pont concret. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 6 | « Je » discret, ton plutôt « consultant qui synthétise » que « ami qui partage ». |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 5 | Tableau APIs en $/million de tokens, LangGraph/CrewAI, function calling : décroche le débutant. |

## Verdict
**⚠️ À retoucher**

L'article tient debout sur la structure et la pédagogie globale, mais le débutant pur décroche dès la section "briques" (les "tools", le "tool use", "function calling"). Les acronymes RGPD/EU AI Act/DPIA/DPA tombent sans glose. Le ton est plus posé/expert que "Jérémy entrepreneur curieux". Une passe de glossaire à la première occurrence + injection plus franche du "je" suffirait à le faire passer à 8/10.

## 3 à 5 passages problématiques (verbatim)
- « Un million de tokens (entrée et sortie) » suivi du tableau de prix à 1 $, 5 $, etc. → "tokens" jamais expliqué dans l'article. Suggestion : ajouter une phrase glose au-dessus du tableau ("Un token = environ 4 caractères, soit 750 mots pour 1000 tokens. Un million de tokens = un livre de 750 000 mots.").
- « Full dev Python (LangGraph, CrewAI) » → noms balancés sans contexte. Suggestion : "deux bibliothèques Python qu'utilisent les développeurs pour orchestrer des agents complexes — à ignorer si tu n'es pas dev".
- « Les "prompt injections" sont une attaque connue : quelqu'un glisse dans un email une instruction cachée que ton agent exécute à son insu. » → la glose est là, mais l'expression anglaise pique sans synonyme français. Suggestion : "L'injection de prompt — quelqu'un glisse une instruction cachée dans un email…".
- « divulguer au utilisateurs qu'ils parlent à une IA (article 50 de l'EU AI Act) » → faute typo + acronyme non glossé. Suggestion : "prévenir tes utilisateurs qu'ils parlent à une IA (l'article 50 de la loi européenne sur l'IA, l'EU AI Act, l'impose depuis 2026)".
- « L'acronyme technique est RAG — Retrieval Augmented Generation, soit "génération assistée par récupération" » → bien glossé ICI, mais le terme RAG apparaît trois sections avant sans avoir été présenté. Suggestion : remonter cette glose à la première occurrence section "TL;DR".

## 3 à 5 passages réussis (verbatim)
- « Un agent IA, ce n'est pas un chatbot. La définition la plus claire vient de Simon Willison… » → vraie posture d'auteur, source citée, ton clair.
- « La plupart des outils vendus comme "agents IA" en 2026 sont en réalité des workflows améliorés avec du LLM au milieu. Rien de mal à cela. Mais savoir ce que tu as vraiment, tu payes mieux. » → ton Leo authentique, contrarien, posture d'entrepreneur.
- « Sans mémoire, l'agent oublie tout à chaque session, comme un stagiaire amnésique. » → analogie efficace, accessible, ton Leo réussi.
- « **Je peux me tromper.** Si tu as déployé un agent récemment et que ton expérience est différente, écris-moi. Je lis tout, je réponds. » → ton Leo signature, transparence et appel à réponse.
- « La règle empirique que je donne à mes proches : commence par le no-code… » → "je" assumé, conseil concret, posture de pair.

## Recos prioritaires (3 max, actionnables)
1. **Faire une passe glossaire** : à chaque première occurrence de LLM, RAG, fine-tuner, MCP, DPIA, DPA, tokens, RGPD, prompt injection, EU AI Act → ajouter une glose courte entre parenthèses ou une phrase d'intro. Renvoyer sinon vers `lexique.html` comme le fait `hermes-agent.html`.
2. **Injecter plus de "je" et de vécu** : remplacer 4-5 paragraphes en mode "voici la définition" par "ce que j'ai compris en testant", "voici comment je m'en sers", "j'ai bricolé celui-ci pour…". Le ton Leo fonctionne quand il assume l'expérience perso.
3. **Couper la table des prix API ou la simplifier** : le tableau Claude/GPT/Gemini/Mistral en dollars par million de tokens parle aux devs, pas au débutant. Soit le remplacer par "compte 5 € par mois pour démarrer, jusqu'à 500 € pour un usage pro intensif", soit ajouter une vraie traduction "ce que ça veut dire pour toi" sous le tableau.
