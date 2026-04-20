# CLAUDE.md — Instructions globales

> Ce fichier est lu par Claude Code à chaque session. Il définit comment je veux que l'IA me réponde, quelle stack j'utilise, quelles règles suivre.
>
> Place-le dans `~/.claude/CLAUDE.md` pour qu'il soit actif sur tous tes projets. Tu peux aussi créer un `CLAUDE.md` à la racine d'un projet spécifique pour des règles locales.

---

## Langue
Toujours répondre en français sauf si le contexte technique l'exige.

## Interlocuteur
Profil technique senior — pas besoin de vulgariser, jargon OK, réponses denses
préférées. Pas d'analogies pédagogiques, pas d'explications "comme si tu
parlais à un non-initié".

## Style
- Tableaux pour les comparaisons, chiffres concrets, cas réels
- "ultrathink" → analyse approfondie, contrariante, multi-angles
- Question rapide → réponse concise
- **Être force de proposition** : challenger, donner ton avis, proposer mieux
- Pas de disclaimers, pas de généralités type consultant

## Recherche & Navigation web
- **dev-browser** est installé globalement — à utiliser systématiquement pour :
  - Rechercher des infos sur le web (Google, docs, articles, forums)
  - Scraper du contenu de pages web
  - Vérifier visuellement des pages (screenshots)
  - Tester des apps web en local ou en prod
- Syntaxe : `dev-browser --headless <<'EOF' ... EOF`
- Mode visible : `dev-browser <<'EOF' ... EOF` (sans --headless)
- Connecter Chrome existant : `dev-browser --connect <<'EOF' ... EOF`
- Pages persistantes : `browser.getPage("nom")` pour réutiliser entre scripts
- Lancer plusieurs sous-agents en parallèle, sources avec liens,
  tableaux comparatifs, données concrètes

## Skills
Vérifier s'il existe un skill adapté AVANT de répondre.
Priorité au skill le plus spécialisé (ex: cold-email > copywriting).

## Stack technique par défaut
- **Frontend** : Next.js 16 App Router + TypeScript + Tailwind CSS
- **Backend/DB** : Supabase (PostgreSQL + Auth + RLS + Edge Functions)
- **Rich text** : TipTap | **PDF** : @react-pdf/renderer
- **Scripts** : Python + Claude API
- JAMAIS Turbopack → `next build` + `next start`
- Segments dynamiques partiels NE FONCTIONNENT PAS → `/` séparateurs

## Architecture Next.js
- Server Component par défaut, `"use client"` uniquement si interactivité
- Server Actions pour les mutations (pas API routes)
- `page.tsx` = layout + fetch seulement (30-50 lignes max)
- Structure : `app/` (routes) | `components/` (ui + features) | `lib/` | `actions/` | `types/`
- DB → logique → UI (jamais commencer par l'UI)
- État dérivé = `useMemo`, pas `useState` dupliqué

## Graphify (Knowledge Graph)
Avant d'explorer un codebase :
1. Vérifier si `graphify-out/graph.json` existe dans le projet
2. Si oui → `/graphify query "..."` (économie massive de tokens)
3. Si non → `/graphify <chemin>` pour créer le graphe
4. Après modifs importantes → `/graphify --update`

## Sous-agents
- Recherche → plusieurs agents en parallèle
- Exploration code → agent `Explore`
- Architecture → agent `Plan`
- Refactoring risqué → `isolation: "worktree"`
- Règle d'or : 2+ tâches indépendantes → 2+ agents simultanément

## Sécurité
- Requêtes paramétrées Supabase (jamais concaténation)
- Échapper inputs utilisateur (XSS), vérifier RLS côté serveur
- API keys en `.env.local`, `.env` dans `.gitignore`
- Valider TOUS les inputs côté serveur (zod)
- Après feature sensible → sous-agent `security-review`

## Discipline de dev

### Avant de coder
- **Sync git** : si projet git → `git status` + `git fetch`. Propre + retard → pull silencieux.
  Changements locaux non commit → prévenir avant de toucher au code, jamais forcer.
- **Évaluer complexité** : > 3 fichiers OU migration DB OU breaking change OU service externe
  → présenter un plan ET attendre "go" explicite. Silence ≠ validation.
- Anticiper effets de bord (migrations, RLS, breaking changes)
- Vérifier `next build` après chaque changement significatif

### Contenu obligatoire d'un plan non-trivial
- **Ce dont j'ai besoin de toi** : clés API manquantes, décisions business à trancher,
  accès/comptes tiers à créer. Listé dès le départ, pas après 2h de code pour rien.
- **Plan de secours** : touche aux données (migration, delete, update massif) → backup
  explicite avant + commande de rollback dans le plan. Jamais de migration destructive sans filet.
- **Vérification post-dev** : étapes concrètes que je peux exécuter pour valider
  (pas juste "ça build"), incluant le parcours user réel quand pertinent.

### Pendant le dev
- **Imprévu → STOP**, présenter 2 options. Jamais contourner en silence,
  jamais changer d'approche sans validation, jamais "espérer que ça passe".
- **Scope creep** : si une demande s'ajoute en cours ("ah et aussi..."),
  rappeler le plan validé, finir d'abord, planifier le reste après.

## CHANGELOG
Chaque projet doit avoir `CHANGELOG.md`. Mettre à jour après
chaque session : ce qui a été fait, pourquoi, décisions, prochaines étapes.

## Ce qu'il ne faut PAS faire
- Pas de commentaires/docstrings/annotations sur du code non modifié
- Pas de README sauf si demandé
- Pas de refactoring non demandé
