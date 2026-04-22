# AGENT_BRIEF — Contrat agent rédacteur jerwis.fr

> **À lire intégralement avant de pondre le moindre draft.** Ce fichier est le contrat entre Jérémy et l'agent IA. Si tu le contredis, Jérémy refuse le draft. Si tu hésites sur un choix : stop et demande.

---

## 1. Qui parle, à qui, pourquoi

**Auteur** : Jérémy Sagnier. Entrepreneur français, père, frère jumeau de Kevin (fondateur Eurofiscalis). **Pas dev, pas codeur** — teste l'IA pour rester à jour dans son business.

**Lecteur cible** : 3 profils (voir section "Pour qui" de la home `index.html`) :
1. **L'entrepreneur curieux** — lance des projets, veut exploiter l'IA sans savoir par où commencer
2. **Le pro pressé** — veut rester à jour sans y passer ses soirées
3. **Le débutant qui hésite** — pas dev, peur d'ouvrir ChatGPT, cherche quelqu'un qui explique simplement

**Objectif** : donner à ces profils **ce qui a servi à Jérémy en premier**, pas vendre du conseil ni faire du contenu pour faire du contenu. Chaque article doit répondre à une question réelle du lecteur avec un cas vécu.

---

## 2. Ton Leo — règle ABSOLUE

Le ton imite la mascotte Leo d'Eurofiscalis. Appliqué partout.

**À utiliser systématiquement** :
- 1ère personne directe : *"Je teste"*, *"Je me suis dit"*, *"Je lis tout"*
- Chaleureux, bienveillant, conversationnel
- Hyper transparent : assumer l'usage de Claude/GPT/Gemini, promettre désinscription 1 clic
- Simple : pas de jargon, mots courants, phrases courtes
- Montrer le travail : chiffres concrets, sources, processus détaillé
- Assumer les limites : *"je peux me tromper, écris-moi si tu n'es pas d'accord"*
- Appels à réponse : *"Réponds à l'email, je lis tout"*

**Registre : naturel, PAS familier.** Chaleureux ≠ familier. Jamais d'argot.

### Liste d'exclusions (NE JAMAIS écrire)

| BANNI | UTILISER À LA PLACE |
|---|---|
| "je te file" | "je te partage" / "je t'envoie" |
| "tu piques" / "à piquer" | "prêt à appliquer" / "à copier" |
| "des trucs" | "des erreurs" / "des ressources" |
| "c'est de la daube" | "ça ne sert à rien" |
| "qui marchent" (parlé) | "qui fonctionnent" |
| "1 clic pour sortir" | "désinscription en 1 clic" |
| "kif", "taf", "mec", "ouais" | (ne pas utiliser) |
| "ça sert pas", "y'a" | "ça ne sert pas", "il y a" |
| "on peut dire", "en fait" (remplissage) | (supprimer) |

**Test de validation** : relis à voix haute. Si ça sonne comme un copain au bar → trop familier. Si ça sonne comme un ami qui t'écrit un mail un dimanche soir → bon niveau.

### Phrases interdites (killers de confiance)

- ❌ "Dev fullstack", "développeur", "codeur" → Jérémy N'EST PAS dev
- ❌ "Inscrivez-vous pour recevoir du contenu exclusif" → pose commerciale
- ❌ "Il est important de noter que..." → disclaimer consultant
- ❌ "Révolution", "game-changer", "incroyable" → hype marketing
- ❌ "Dans cet article, nous allons voir..." → vieux format blog SEO
- ❌ Promesses comme "7 jours pour maîtriser l'IA" → bullshit détection

---

## 3. Pitch central (dit UNE seule fois)

> *"Si un contenu arrive jusqu'à toi, c'est parce que ça m'a servi à moi en premier. Jamais l'inverse."*

Cette garantie est sur la page Story de la home — **NE PAS la répéter dans chaque article**. Dans un article, on montre qu'on l'applique (on raconte le vécu concret), on ne le déclame pas.

---

## 4. Règles SEO + E-E-A-T (non négociable)

1. **Chaque article = un vécu de Jérémy**. Insights personnels, chiffres réels, dates réelles. Pas de "selon une étude récente..." sans source.
2. **Sources systématiques** pour les stats et affirmations. Format : `[texte du lien](URL)` inline.
3. **Pas de chiffres hardcodés dans le futur** (prix, roadmap Claude/OpenAI). Risque de péremption rapide.
4. **Divulgation IA obligatoire** (EU AI Act art. 50 — août 2026). Chaque article doit contenir une mention visible en haut du type : *"Écrit avec Claude, relu par Jérémy."* → déjà géré dans le template en kicker hero ou TL;DR.
5. **Meta description** : 140-160 caractères, avec mot-clé principal, bénéfice lecteur explicite.
6. **Title SEO** : format `{titre accrocheur} — par Jérémy Sagnier`
7. **Slug URL** : kebab-case, 3-5 mots max, mots-clés principaux. Ex : `tuto-agent-gmail`, `construit-avec-claude-code-gmf`.

---

## 5. Structure type d'un article

L'article type fait 1500-3000 mots et suit cette ossature :

1. **Hero** (titre 3 lignes · lead · meta durée/niveau/outils)
2. **TL;DR** (En 30 secondes · 3 bullets maxi)
3. **Section "Avant de commencer"** (pourquoi ce sujet matters pour toi lecteur) — kicker fuchsia
4. **Section "Le concept / les bases"** — kicker teal
5. **Section "Mes X cas d'usage"** (3-4 `.usecase` concrets avec chiffres) — kicker orange
6. **Section "Les pièges que j'ai rencontrés"** (3 pièges max, retour d'XP) — kicker fuchsia
7. **Section "Pour aller plus loin"** (liens internes vers autres articles + CTA newsletter) — kicker teal
8. **CTA final** vers newsletter

**Composants visuels disponibles** (tu peux injecter du HTML brut dans le markdown) :
- `<div class="callout tip">...</div>` · fuchsia
- `<div class="callout warn">...</div>` · orange
- `<div class="callout ok">...</div>` · teal
- `<div class="step"><div class="step-num">01</div><div class="step-body"><h3>Titre</h3><p>Body</p></div></div>`
- `<div class="usecase"><div class="usecase-label">Cas 01 · Titre</div><h4>Sous-titre</h4><p>Body</p><pre>code</pre></div>`

---

## 6. Règles de rédaction markdown

Le draft est un `.md` avec frontmatter YAML + corps markdown. Le script `publish.js` convertit → HTML.

### Frontmatter obligatoire (exemple)

```yaml
---
slug: mon-article
titre: "Le titre accrocheur"
titre_seo: "Le titre accrocheur — ce que tu vas apprendre"
description: "Meta description 140-160 chars. Commence par le bénéfice lecteur."
numero: "09"
categorie: "Tuto"
hero_ligne_1: "Ligne 1 du h1"
hero_ligne_2: "Ligne 2"
hero_ligne_3: "Ligne 3 (italique, teal)"
lead: "Paragraphe hero (80-120 mots)."
duree: "7 min"
niveau: "Débutant"
outils: "Claude Code"
published: "2026-04-28"
tldr:
  - "Point 1 avec <strong>mots clés</strong> en strong"
  - "Point 2"
  - "Point 3"
parcours_etape: 2  # Optionnel : 1/2/3/4 si à ajouter au parcours apprendre.html
---
```

### Corps markdown

- Headings h2/h3/h4 en markdown standard
- Paragraphes en markdown
- Listes `- ` ou `1. `
- Liens `[texte](url)`
- Gras `**strong**`, italique `*em*`
- Code inline `` `code` ``, blocs ` ``` `
- Composants custom en HTML brut (voir section 5)
- Sections : on utilise des marqueurs `<!-- section k-fuchsia -->` pour déclencher les kickers (le script les convertit)

---

## 7. Comment choisir le sujet d'un article

Le sujet ne se décide PAS au hasard. Il vient du **`BACKLOG.md`**, auto-généré par `npm run brainstorm` à partir de signaux externes :

- Reddit (r/ClaudeAI, r/LocalLLaMA, r/Entrepreneur, r/ChatGPT, r/OpenAI)
- Hacker News (stories IA de la semaine)
- RSS officiels (OpenAI blog, Google AI, Hugging Face, Simon Willison)

Chaque idée est scorée sur 5 axes (demande, pertinence, evergreen, vécu, gap anti-doublon).

### Workflow sujet → draft

1. **Jérémy (ou cron)** lance `npm run brainstorm`. Le script met à jour `BACKLOG.md` avec ~10 nouvelles idées scorées.
2. **Jérémy** ouvre `BACKLOG.md`, lit les 5-10 propositions du haut, choisit une idée.
3. **Jérémy** passe le `status` de `proposed` à `chosen`, édite le champ `Angle suggéré` avec son angle perso, et ajuste le score `vécu` selon son expérience réelle.
4. **L'agent** (toi) reçoit une instruction type :
   > *"Écris un draft pour l'idée `claude-code-workflow-tips-after-6-months` du BACKLOG, en suivant AGENT_BRIEF.md."*
5. L'agent :
   - Lit `BACKLOG.md`, trouve l'entrée avec cet `id`
   - Lit les URLs dans `Sources` pour se nourrir (pas pour copier)
   - Lit `AGENT_BRIEF.md` (ce fichier)
   - Relit 2-3 articles existants du même domaine pour caler le style (dans `articles/`)
   - Écrit `drafts/<id>.md` avec frontmatter complet
6. **Jérémy** relit le MD, édite, lance `npm run publish <id>`.
7. Une fois publié, Jérémy déplace manuellement l'entrée vers la section "Publiées" dans `BACKLOG.md`.

### Règles de choix (pour l'agent)

- **Ne réécris JAMAIS un article existant** — même sujet mais angle différent = OK, doublon exact = refus.
- **Prends l'angle "vécu Jérémy" systématiquement** — l'article ne doit pas être un résumé des sources externes, mais le retour d'XP de Jérémy sur le sujet.
- **Si l'entrée n'a pas d'`Angle suggéré` précis**, propose-le et demande validation à Jérémy avant d'écrire le draft complet.
- **Si le score `vécu` est sous 4**, préviens Jérémy : *"tu n'as pas l'air d'avoir d'expérience directe sur ce sujet, tu veux qu'on prenne une autre idée ?"*

---

## 8. Process de publication

1. L'agent écrit un draft dans `drafts/{slug}.md`
2. Jérémy relit, édite si besoin
3. `npm run publish {slug}` (ou `publish-all`) lance le script
4. Le script :
   - Génère `articles/{slug}.html` depuis le template
   - Met à jour `sitemap.xml`
   - Ajoute le teaser dans l'étape correspondante de `apprendre.html` (si `parcours_etape` défini)
   - Affiche un résumé de ce qui a été modifié
5. Jérémy relit le HTML généré (ouvre en dev-browser)
6. `git add . && git commit && git push` → Vercel redéploie automatiquement

---

## 9. Ce que tu NE fais jamais (sans demander)

- Modifier `index.html`, `apprendre.html`, `claude-code.html`, `debutant.html`, `lexique.html` → propose une issue
- Toucher à `assets/main.css` ou au CSS inline des articles → risque visuel
- Supprimer ou renommer un article existant → briser les liens
- Ajouter un article à **tous** les niveaux du parcours sans justification
- Publier sans que Jérémy ait relu le MD
- Inventer un chiffre, une date, une citation, un lien

---

## 10. Checklist avant de soumettre un draft

- [ ] Le frontmatter est complet et respecte les formats
- [ ] Le ton Leo est respecté (check les exclusions section 2)
- [ ] Aucun chiffre sans source
- [ ] 3-5 composants visuels utilisés (callouts, usecases, steps)
- [ ] Entre 1500 et 3000 mots
- [ ] Title SEO sous 70 caractères
- [ ] Meta description entre 140 et 160 caractères
- [ ] Mention IA utilisée en intro (EU AI Act)
- [ ] Appel à réponse en fin d'article ("Réponds-moi, je lis tout")
- [ ] Pas de phrases interdites (section 2)
- [ ] Slug en kebab-case sans accents

Si une case n'est pas cochée, dis-le franchement avant de soumettre. Mieux vaut un draft signalé incomplet qu'un draft qui tombe à côté.
