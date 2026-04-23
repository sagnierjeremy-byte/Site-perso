# Audit ton — Limova vs Claude Code

**Note globale : 6/10**

**Type : opinion/analyse comparative produit** (pas tuto pas-à-pas — pondéré)

| Critère | Note /10 | Commentaire bref (15 mots max) |
|---|---|---|
| Lisibilité (phrases courtes, vocabulaire simple, agréable) | 7 | Phrases plutôt nettes mais paragraphes denses. Quelques tournures lourdes. |
| Absence de jargon (termes techniques expliqués à 1ère occurrence) | 4 | Avalanche de jargon non glosé : LLM, MCP, API, wrapper, MVP, Twilio, Deepgram, ElevenLabs, cron, tokens, Vercel. |
| Pas-à-pas (gradation, prend par la main) — pondéré opinion | 6 | Structure logique mais le passage "Claude Code DIY" décroche. Pas accessible débutant. |
| Ton Leo (1ère personne, chaleureux SANS être familier) | 8 | "Je ne fais pas le malin", "je peux me tromper" — bon. Mais ton parfois plus "consultant-tech" que Leo. |
| Public débutant (accessible à quelqu'un qui n'a jamais codé) | 4 | L'article promet de parler à un non-dev mais perd le débutant dès la 1ère comparaison technique. Contradiction interne. |

## Verdict
**À retoucher**

Le pire des 4 sur le critère jargon. L'article s'adresse explicitement à "l'entrepreneur qui n'a jamais codé" (positionnement Limova) mais bascule en mode geek dans toutes les comparaisons : LLM, MCP server, Twilio, Deepgram, ElevenLabs, cron, tokens à 3 $/million, Vercel, Railway. Un patron de TPE qui hésite entre Limova et l'autonomie technique va décrocher au moment crucial du calcul. L'opinion tranchée et la transparence sont là — c'est uniquement l'accessibilité qui pèche.

## 3 à 5 passages problématiques (verbatim)
- « la FAQ évoque "des IA comme ChatGPT", formulation assez floue pour laisser penser qu'il s'agit d'un wrapper au-dessus d'une API tierce. » → "wrapper", "API tierce" = double jargon non glosé. Suggérer : "une simple surcouche posée sur une IA d'une autre boîte (ChatGPT, Claude…), sans le dire".
- « Reconstruire cela avec Twilio, Deepgram pour la reconnaissance vocale, ElevenLabs pour la voix, et un agent Claude au milieu, c'est faisable mais c'est au moins 80 heures de travail » → 3 noms de services techniques en 1 phrase, sans contexte. Pour un débutant : opaque. Suggérer : "Reconstruire cela toi-même demande de coller ensemble 4 outils techniques (téléphonie, transcription, voix de synthèse, IA centrale)…"
- « Avec Claude Code, Claude Sonnet à 3 $ par million de tokens en entrée, les serveurs MCP qui se branchent à Gmail, Google Calendar, LinkedIn, Notion, et un hébergement Vercel ou Railway à 5 € par mois » → "tokens", "MCP", "Vercel", "Railway" = 4 jargons en 1 phrase. Inaccessible au public cible.
- « un produit qui ressemblerait plus à un MVP qu'à une solution finalisée » → "MVP" non glosé. Suggérer : "une version brouillon (MVP, le minimum vendable)".
- « Tom — un standardiste IA qui répond à tes appels entrants 24 heures sur 24, en cent quarante langues » → impec côté ton, mais "standardiste IA" gagnerait 3 mots de gloss : "(comme l'accueil téléphonique d'une boîte)".

## 3 à 5 passages réussis (verbatim)
- « Mais en creusant, j'ai relevé cinq points qui m'ont refroidi » → bon hook honnête, pose le verdict sans agresser.
- « Ton Trustpilot est 4,9 sur 5 sur 885 avis » + « zéro avis sur G2, Capterra, Reddit ou Product Hunt » → travail d'enquête concret, sources nommées, esprit critique = signature Leo.
- « Je ne vais pas faire le malin. Il y a deux situations où je paierais Limova sans trop me poser de questions. » → marqueur Leo classique. Honnêteté qui tranche.
- « Dans ces deux cas, la question n'est pas "Claude Code ou Limova". C'est "Limova ou rien". Et là, Limova l'emporte. » → reformulation puissante, force de proposition assumée.
- « Je peux me tromper. Si tu utilises Limova et que ton expérience est excellente, écris-moi. » → CTA réponse + humilité = ton Leo intact malgré l'opinion tranchée.

## Recos prioritaires (3 max, actionnables)
1. Faire un sweep "anti-jargon" sur la moitié du texte concernant le DIY : gloser à la 1ère occurrence LLM ("le cerveau IA derrière l'application"), API ("le tuyau qui connecte deux logiciels"), MCP ("petite passerelle qui relie ton IA à des outils comme Gmail"), tokens ("unité de comptage des mots traités par l'IA"), MVP ("version minimale d'un produit"), wrapper ("surcouche commerciale au-dessus d'un outil existant"), Twilio/Deepgram/ElevenLabs (en 1 phrase de groupe).
2. Repositionner les tableaux de comparaison Limova vs Claude Code avec une colonne "ce que ça veut dire concrètement" pour le lecteur non-tech, ou les déplacer en fin d'article comme bonus pour ceux qui veulent les détails.
3. Ajouter en intro UN paragraphe : "Cet article s'adresse à toi si tu hésites entre payer un outil clé en main et apprendre à monter le tien. Si la deuxième option te paraît hors de portée, va lire d'abord [mon article sur Claude Code]". Ça gère l'attente du débutant et lui propose une porte de sortie.
