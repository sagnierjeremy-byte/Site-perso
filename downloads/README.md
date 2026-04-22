# Bienvenue — Pack Claude Code de Jérémy

Salut, moi c'est Jérémy. Si tu lis ce fichier, c'est que tu as téléchargé mon pack Claude Code. Merci pour ta confiance — et bienvenue.

Ce que tu vas trouver ici, c'est ce que j'utilise moi-même tous les jours. Rien de théorique, rien d'inventé pour te plaire. Juste la config qui me fait gagner des heures, et les skills que j'ai mis en place pour mes projets.

Si quelque chose ne fonctionne pas ou n'est pas clair, réponds simplement à ma newsletter — je lis tout.

---

## Ce que contient ce pack

| Fichier/Dossier | Ce que c'est |
|---|---|
| `CLAUDE.md` | Mes instructions globales pour Claude Code (anonymisées pour toi) |
| `skills/` | Mes 26 skills custom (cold-email, copywriting, graphify, etc.) |
| `install-plugins.sh` | Script bash qui installe mes 6 plugins Anthropic officiels (superpowers, context7, claude-md-management, frontend-design, code-review, code-simplifier) |
| `README.md` | Ce fichier |

---

## Étape 1 — Installer Claude Code

Claude Code, c'est la version CLI de Claude. Tu tapes des commandes dans ton terminal, et Claude s'exécute.

### Sur Mac

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Puis relance ton terminal et lance :

```bash
claude
```

La première fois, il te demandera de te connecter. Suis les instructions, c'est 30 secondes.

### Plus de détails ?

Va sur le guide complet : [jerwis.fr/claude-code](#)

---

## Étape 2 — Placer le CLAUDE.md

Le `CLAUDE.md`, c'est le fichier que Claude lit à CHAQUE session. Il définit comment tu veux qu'il te réponde, quelle stack tu utilises, quelles règles il doit suivre.

Copie-le dans le bon dossier :

```bash
mkdir -p ~/.claude
cp CLAUDE.md ~/.claude/CLAUDE.md
```

Ouvre-le, lis-le, adapte-le à ta stack et à ton style. Le mien est un point de départ — pas une règle gravée dans le marbre.

---

## Étape 3 — Installer les skills

Les skills, c'est des capacités supplémentaires que tu donnes à Claude. Un skill = un dossier avec un fichier `SKILL.md` qui explique à Claude quand et comment l'utiliser.

Exemple : le skill `cold-email`. Quand tu demandes à Claude d'écrire un cold email, il charge automatiquement ce skill et suit les règles que j'ai définies dedans.

Pour installer tous les skills :

```bash
mkdir -p ~/.claude/skills
cp -R skills/* ~/.claude/skills/
```

Relance Claude Code et ils sont actifs. Tu peux les lister dans l'UI ou avec `/skill list`.

---

## Étape 4 — Installer mes 6 plugins officiels

Les plugins Anthropic officiels ajoutent des super-pouvoirs à Claude Code · méthodologie de dev, docs à jour, audit des CLAUDE.md, etc. J'en utilise 6 au quotidien.

Depuis le dossier du pack, lance le script :

```bash
bash install-plugins.sh
```

Ça installe en 30 secondes :

- `superpowers` · méthodologie complète + 3 commandes slash (`/brainstorm`, `/write-plan`, `/execute-plan`)
- `context7` · docs à jour de n'importe quel framework
- `claude-md-management` · audit automatique de tes CLAUDE.md (`/revise-claude-md`)
- `frontend-design` · UI production-grade
- `code-review` · review multi-agents
- `code-simplifier` · simplifie le code généré

Après l'install, **redémarre Claude Code** (ferme et rouvre) pour charger les commandes slash.

Pour vérifier : `claude plugin list`. Pour en savoir plus : https://jerwis.fr/claude-code.html#plugins

---

## Étape 5 — Tester

Ouvre un projet existant (ou crée un dossier vide), lance `claude`, et demande-lui :

> "Tu as quels skills disponibles ?"

Il va te lister les skills qu'il a chargés. Si tu vois `cold-email`, `copywriting`, `graphify` dans la liste, tout fonctionne.

Teste aussi une commande slash d'un plugin : `/brainstorm` ou `/revise-claude-md`. Si elle est reconnue, les plugins sont bien actifs.

---

## Ça ne fonctionne pas ?

Trois points à vérifier :

1. **`claude --version`** fonctionne dans ton terminal ? Sinon, relance-le.
2. **`ls ~/.claude/CLAUDE.md`** renvoie bien le fichier ? Sinon, il n'est pas au bon endroit.
3. **`ls ~/.claude/skills/`** liste tes skills ? Sinon, la copie a échoué.

Si tu es coincé, réponds simplement à ma newsletter — je t'aide à débloquer.

---

## Les skills custom inclus

| Skill | Ce qu'il fait |
|---|---|
| `cold-email` | Écrit et améliore des séquences d'emails froids B2B |
| `content-production` | Pipeline complet pour écrire un article de blog de A à Z |
| `content-quality-auditor` | Audite la qualité d'un contenu (80 critères CORE-EEAT) |
| `copywriting` | Écrit/réécrit du copy marketing (landing, homepage, pricing) |
| `deep-research` | Recherche multi-sources avec citations |
| `geo-content-optimizer` | Optimise ton contenu pour être cité par ChatGPT, Claude, Perplexity |
| `graphify` | Transforme n'importe quel dossier en graphe de connaissance |
| `humanizer` | Enlève les marques d'écriture IA d'un texte |
| `landing-page-generator` | Génère des landing pages Next.js/Tailwind optimisées conversion |
| `playwright-pro` | Suite Playwright de prod (55 templates, flaky tests, etc.) |
| `postgres-patterns` | Patterns PostgreSQL : optimisation, schéma, indexes, sécurité |
| `prompt-engineer-toolkit` | Analyse et améliore tes prompts |
| `search-first` | Workflow : chercher une lib existante avant de coder |
| `security-review` | Checklist sécurité complète pour auth, inputs, secrets |
| `security-scan` | Scanne ta config Claude Code pour vulnérabilités |
| `self-improving-agent` | Transforme la mémoire de Claude en skills réutilisables |
| `senior-backend` | Design backend : REST, microservices, DB, auth |
| `senior-frontend` | Dev frontend React/Next.js (perf, a11y, bundle) |
| `seo-audit` | Audit SEO : technique, on-page, structured data |
| `social-content` | Crée du contenu social (LinkedIn, Twitter, Instagram) |
| `stripe-integration-expert` | Intégrations Stripe prod (subscriptions, billing) |
| `viral-content` | Transforme tes brouillons en contenu optimisé pour le partage |

+ 4 skills spécifiques au secteur fiscalité européenne (eurofiscalis-*) que tu peux retirer si tu n'es pas concerné.

---

## Tu veux creuser ?

Je publie chaque semaine une newsletter qui raconte ce que je teste en IA, les outils qui fonctionnent, les prompts que j'utilise. Tu l'as reçue en t'inscrivant sur le site. Si tu ne l'as pas encore, va sur [jerwis.fr](#).

Et si tu as des questions, réponds à l'email. Je lis tout.

— Jérémy
