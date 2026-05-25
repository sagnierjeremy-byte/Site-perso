# Hacker News submission · dev-browser (article EN)

**Stratégie** : Show HN inadapté car dev-browser est un package Anthropic (pas un projet Jérémy). On part sur une **submission HN classique** avec l'article en EN.

**URL à soumettre** : https://jerwis.fr/articles/dev-browser-en (version EN à créer, voir ci-dessous)
**Plateforme** : https://news.ycombinator.com/submit
**Compte requis** : avec quelques karma (>= 50) sinon le post peut être ratelimité

---

## Pourquoi cette submission peut marcher sur HN

HN adore 3 patterns particuliers :

1. **L'angle contrariant** : "non-developer" + "production workflow with AI tool" = combo rare. HN est saturé de "dev senior fait X". Voir un opérationnel non-tech qui s'approprie un outil dev = différenciation.

2. **Le storytelling concret** : workflows pratiques, chiffres réels, pas de hype.

3. **La transparence** : ce qui marche + ce qui casse + coût réel. HN flag immédiatement le marketing déguisé.

**Probabilité estimée frontpage** : 15-25 % (1 sur 5 chances), normal pour une première soumission. Si frontpage → 5-20k visites + 10-30 backlinks naturels.

---

## Titre HN (3 versions à tester)

### Version A · "Non-developer angle" (recommandée)
```
A non-developer's daily workflow with dev-browser
```

### Version B · "Time period" (alt)
```
14 months using dev-browser without writing code
```

### Version C · "Concrete claim" (alt)
```
How I use dev-browser to run a newsletter and a podcast without coding
```

**Recommandation** : version A. Plus factuelle, déclenche la curiosité ("comment ça marche pour un non-dev ?"), pas de chiffres clickbait.

---

## Body du commentaire d'auteur (à poster dans la minute qui suit la submission)

```
Hi HN,

Original poster here. Quick context since I'm a bit of an outlier on this site:

I'm a French entrepreneur, not a developer. I co-built Eurofiscalis (European
tax representation firm) with my twin brother in 2017, and I've been writing
about how non-tech founders use AI tools in production since late 2024.

The article is in French — sorry. There's a "Translate to English" button
in the page header (or use any browser translate). I'm planning a full EN
version next month.

Things I cover in the post and would happily expand on in comments:

- My actual setup: Ghostty + Claude Code + 26 custom skills + MCP servers
  (Supabase, Resend, Notion)
- Real monthly cost (~260 € all included for 3 content channels + 1 SaaS)
- 5 patterns that took me from "broken drafts" to "shipping" — the CLAUDE.md
  file is the single biggest leverage point
- What breaks regularly (Claude hallucinates sources ~1/10 times, Vercel
  deploys fail occasionally, agent workflows need 2-3 weeks of tuning)
- Where I'm structurally limited (security, deep debugging, query optimization)

The thing I'd push back on if anyone says "this is just hype":

The cost curve of putting AI in production has collapsed in 2025-2026. For
non-tech founders willing to write a good CLAUDE.md and accept that some
things will break, you can ship a small SaaS in weeks rather than quarters.

That doesn't make professional development less valuable. It does change
who can start what kind of project.

Happy to answer specifics if anyone has a non-dev friend wondering whether
this is feasible.

— Jérémy
```

---

## Version EN courte de l'article (à publier sur jerwis.fr/articles/dev-browser-en avant la soumission HN)

### How a non-developer uses dev-browser daily

**By Jérémy Sagnier (Jerwis Conseil) — May 2026**

I'm a French entrepreneur, not a developer. My twin brother and I co-built a tax services firm with 60+ people. In late 2024, I started using dev-browser (the Anthropic-built browser automation tool) in production. This is what 18 months of daily use looks like, from a non-tech perspective.

#### What dev-browser actually is

dev-browser is a CLI tool that lets Claude (or other LLMs) drive a real browser. You ask in natural language: "open this URL, take a screenshot, read what's on the page, fill out this form". Claude figures out the clicks, the typing, the waiting.

For a developer, it sits somewhere between Playwright and a smart agent. For a non-developer like me, it's something more fundamental: it's the bridge between "Claude can think" and "Claude can act on the web".

#### Three daily use cases that justify the setup

**1. Daily content curation.** Every morning around 9am, I run a script that opens 12 RSS feeds + 6 specific websites, summarizes what's new, and stores the result in a Notion database. Time saved vs doing it manually: about 45 minutes per day. Cost: ~$0.30 / day in API calls.

**2. Cross-platform testing of my own site.** Before publishing an article on jerwis.fr, I have a workflow that opens the staging URL on 4 viewport sizes, takes screenshots, and tells me if anything looks broken. Sounds simple. Saves me 20 minutes per article and catches mistakes I wouldn't see.

**3. Competitive monitoring.** Once a week, dev-browser visits 8 competitor sites in my niche, takes a snapshot of their pricing pages, and emails me a diff with what changed. Took 2 hours to set up the first time, runs forever now.

#### What the setup looks like

- Terminal: Ghostty (because color and speed matter when you live in there)
- Claude Code: Anthropic's CLI tool (Max plan, ~200€/month)
- dev-browser: installed via npm
- MCP servers: Supabase, Resend, Notion
- 26 custom skills in `.claude/skills/`

The single most important file is `CLAUDE.md` — about 5,000 words describing my projects, conventions, tone of voice, and forbidden phrases. Every Claude Code session reads it first. Without it, every conversation starts from scratch.

#### What I'm not telling you (transparency)

I'm not a developer. Three categories of problems I struggle with:

1. **Security implications**: I have a senior developer friend who reviews my paid product (a €39 SaaS). I would not deploy that alone.

2. **Performance optimization**: I can't write a complex SQL query optimization. Luckily my traffic profile doesn't need it.

3. **Deep debugging**: when something fails in production with obscure logs, I spend longer than a dev would. Sometimes I just rebuild from scratch.

#### Five patterns that changed everything

- **Explicit CLAUDE.md**: documented constraints upfront. Massive time saver.
- **"Stop and ask"**: if Claude wants to touch >3 files, it pauses for my approval. Prevents 90% of rollbacks.
- **Modular skills**: 26 specialized skills auto-trigger by context, instead of one generic "do everything" prompt.
- **Atomic commits**: every change is one git commit. Easy rollback if something breaks.
- **Parallel sub-agents**: deep research tasks split across 4 sub-agents working in parallel. 4x speedup on the research phase.

#### Cost vs paid alternatives

I rebuilt a workflow that one of the firms I work with was paying €840/year for, in two weeks, for €4/month in API costs. That's not a critique of paid tools. It's a signal that the orchestration layer for AI is becoming commoditized faster than most people expected.

#### What this means

I'm not claiming non-developers will replace developers. I'm claiming something more boring: the bar for shipping small production systems has collapsed in 18 months. Non-tech founders willing to invest 20-40 hours in learning the workflow can now ship things that would have cost €30,000 to outsource in 2023.

The implication for the next 2-3 years: a wave of small one-person businesses doing things that used to require 3-5 person teams.

If that's hype, it's the kind of hype I can verify in my own week.

---

**Jérémy Sagnier** writes weekly about AI for non-developers at [jerwis.fr](https://jerwis.fr).

---

## Pre-flight checklist avant submission

- [ ] Compte HN avec >= 50 karma (sinon, builder du karma en commentant pertinemment pendant 1-2 semaines)
- [ ] Version EN de l'article publiée sur jerwis.fr (peut être /articles/dev-browser-en)
- [ ] Article testé : ouvert dans Safari + Chrome, OG image OK, mobile responsive
- [ ] Timing : **mardi 14h-17h UTC** (= 7-10am Pacific, prime time HN) OU **dimanche 00h-01h Pacific** (concurrence faible)
- [ ] PAS d'upvote farming. Ne demander d'upvote à personne. HN détecte les voting rings.
- [ ] Commentaire d'auteur posté **dans les 60 secondes** après la submission (= signal positif fort pour les autres lecteurs)
- [ ] Disponible les 2 premières heures pour répondre aux commentaires (= signal positif fort)
- [ ] Lien dans le profil HN bien à jour : `https://jerwis.fr`

## Si frontpage atteint (top 30)

- **Trafic attendu** : 5-20k visites en 24-48h
- **Cascade attendue** : 10-30 backlinks naturels (blogs, Twitter, newsletters tech)
- **Newsletter signups attendus** : 50-200 nouveaux abonnés (taux conversion ~1%)
- **Actions à faire** :
  - Répondre à TOUS les commentaires sous 4h
  - Préparer 1-2 articles de suivi (HN adore les follow-ups)
  - Cross-poster sur Twitter/LinkedIn avec ancre "Featured on HN"

## Si shadowbanned (article supprimé silencieusement)

- Vérifier avec [hnshadowban.com](https://hnshadowban.com) sur ton username
- Cause habituelle : trop de submissions promotionnelles, ou pattern de upvote suspect
- Pas de récupération possible immédiate. Attendre 30 jours puis retry avec un autre article.

## Fallback si pas de frontpage

- 70-85% des submissions ne montent pas. Ce n'est pas grave.
- Le contenu reste indexé sur HN → backlink permanent (dofollow, DR 91)
- Au pire, c'est 1 backlink de qualité pour 30 min de travail
- Réessayer avec un angle différent dans 6-12 semaines (pas plus tôt — flag spam)

---

## Notes pour Jérémy

- Cette submission demande un compte HN existant avec un peu de karma. Si pas le cas, **commencer par 2 semaines de commentaires utiles sur HN** avant de tenter la submission. Reddit / HN punissent les comptes fraîchement créés qui spamment.
- Si tu n'as pas de compte HN actif, **alternative plus accessible** : cross-poster cette version EN sur Dev.to (canonical → jerwis.fr/articles/dev-browser-en) + Medium. Probabilité de succès plus basse mais effort moindre.
- L'article EN ci-dessus fait ~750 mots. Pour HN il devrait idéalement être 1200-2000 mots avec plus de code et de captures d'écran. Jérémy peut l'enrichir lui-même avant publication.
