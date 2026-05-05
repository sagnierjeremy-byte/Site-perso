# Jerwis Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire `jerwis-admin`, un admin Next.js 16 forké de `~/Projets/newsletter-dashboard/`, déployé sur `admin.jerwis.fr`, qui fait tourner le pipeline éditorial complet (sources → scan → curation → newsletter → 15 posts sociaux) pour la newsletter "Vendredi 9h" de Jérémy.

**Architecture:** Fork de newsletter-dashboard (~65-70% code réutilisable), nouveau projet Supabase dédié, schéma simplifié à 6 tables, suppression des 7 sections hors-MVP, refonte des prompts IA (Leo Eurofiscalis → Leo Jérémy 1ère personne), middleware mot de passe basique pour l'auth, nouvelle page `/social` avec intégration Zernio.

**Tech Stack:** Next.js 16.2.3 · React 19.2.4 · Tailwind 4 · TypeScript · Supabase 2.102 · Anthropic SDK 0.86.1 · Resend (custom fetch) · Zernio API · Vercel (Hobby plan + cron) · Vitest (tests unit lib).

---

## File Structure (cible `~/Projets/jerwis-admin/`)

```
jerwis-admin/
├── README.md                              # Setup + variables d'env
├── package.json                           # Deps héritées + nom "jerwis-admin"
├── tsconfig.json                          # Hérité tel quel
├── next.config.ts                         # Hérité tel quel
├── postcss.config.mjs                     # Hérité tel quel
├── eslint.config.mjs                      # Hérité tel quel
├── vercel.json                            # Crons + cleanUrls
├── middleware.ts                          # NOUVEAU — auth mdp
├── vitest.config.ts                       # NOUVEAU — config tests lib
├── .env.local.example                     # Template env vars
├── .env.local                             # (gitignored)
├── db/
│   └── migrations/
│       └── 001_jerwis_schema.sql          # NOUVEAU — schéma 6 tables
├── public/
│   └── favicon.ico                        # Hérité, à customiser plus tard
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Adapté (sidebar 8 routes)
│   │   ├── sidebar.tsx                    # Adapté (8 routes MVP)
│   │   ├── page.tsx                       # Dashboard
│   │   ├── globals.css                    # Hérité
│   │   ├── login/
│   │   │   ├── page.tsx                   # NOUVEAU — page login
│   │   │   └── actions.ts                 # NOUVEAU — login server action
│   │   ├── sources/
│   │   │   ├── page.tsx                   # NOUVEAU
│   │   │   ├── source-manager.tsx         # NOUVEAU (client)
│   │   │   └── actions.ts                 # NOUVEAU (CRUD sources)
│   │   ├── inspiration/
│   │   │   ├── page.tsx                   # NOUVEAU
│   │   │   ├── inspiration-list.tsx       # NOUVEAU (client)
│   │   │   └── actions.ts                 # NOUVEAU (mark item kept/dismissed)
│   │   ├── generate/
│   │   │   ├── page.tsx                   # Adapté
│   │   │   ├── newsletter-editor.tsx      # NOUVEAU (client)
│   │   │   └── actions.ts                 # Adapté
│   │   ├── newsletters/
│   │   │   ├── page.tsx                   # Adapté
│   │   │   └── actions.ts                 # Adapté (Resend send)
│   │   ├── audience/
│   │   │   ├── page.tsx                   # Adapté
│   │   │   └── actions.ts                 # Adapté
│   │   ├── social/
│   │   │   ├── page.tsx                   # NOUVEAU
│   │   │   ├── social-editor.tsx          # NOUVEAU (client)
│   │   │   └── actions.ts                 # NOUVEAU (génération + Zernio)
│   │   ├── settings/
│   │   │   ├── page.tsx                   # NOUVEAU
│   │   │   └── actions.ts                 # NOUVEAU
│   │   └── api/
│   │       └── cron/
│   │           ├── veille/route.ts        # Adapté
│   │           └── send-scheduled/route.ts # Adapté
│   ├── components/
│   │   └── ui/                            # Hérité (badges, tooltips, etc.)
│   └── lib/
│       ├── auth.ts                        # NOUVEAU — hash mdp + cookie
│       ├── supabase/
│       │   ├── client.ts                  # Adapté (URL + service role)
│       │   ├── sources.ts                 # NOUVEAU
│       │   ├── items.ts                   # NOUVEAU
│       │   ├── newsletters.ts             # Adapté
│       │   └── social-posts.ts            # Adapté
│       ├── format.ts                      # Hérité
│       ├── html-to-text.ts                # Hérité
│       ├── rate-limit.ts                  # Hérité
│       ├── validations.ts                 # Adapté (schémas Zod jerwis)
│       ├── url-canonical.ts               # NOUVEAU — strip UTM/fragments
│       ├── feeds.ts                       # NOUVEAU — parse RSS/Atom
│       ├── veille.ts                      # Refondu (831L → ~400L)
│       ├── scoring.ts                     # NOUVEAU — Claude Haiku 0-100
│       ├── newsletter-writer.ts           # Refondu (prompt Leo Jérémy)
│       ├── social-writer.ts               # Refondu (3 réseaux × 5 sujets)
│       ├── resend.ts                      # Adapté (sender jerwis)
│       └── zernio.ts                      # Adapté (3 réseaux)
└── tests/
    ├── url-canonical.test.ts              # NOUVEAU
    ├── feeds.test.ts                      # NOUVEAU
    ├── auth.test.ts                       # NOUVEAU
    ├── scoring.test.ts                    # NOUVEAU
    └── social-writer.test.ts              # NOUVEAU
```

**Conventions** :
- Toutes les routes (sauf `/login` + `/api/cron/*`) sont protégées par `middleware.ts`
- Server Components par défaut, `"use client"` uniquement pour les éditeurs interactifs
- `actions.ts` co-localisé avec sa page pour les mutations (Server Actions)
- Logique métier pure dans `src/lib/`, jamais dans `src/app/`
- Tests Vitest unit pour `src/lib/` (logique pure), pas de tests UI (overkill MVP)

---

## Phase 0 — Bootstrap (Tasks 1-4)

### Task 1 : Cloner newsletter-dashboard et nettoyer

**Files:**
- Create: `~/Projets/jerwis-admin/` (copie)
- Modify: `~/Projets/jerwis-admin/package.json`
- Modify: `~/Projets/jerwis-admin/README.md`
- Delete: `~/Projets/jerwis-admin/_backups/`, `~/Projets/jerwis-admin/PROJECT_NOTES.md`, `~/Projets/jerwis-admin/last-deploy.md`, `~/Projets/jerwis-admin/supabase-migration-v11-send-day.sql`, `~/Projets/jerwis-admin/Leo avatar image/`

- [ ] **Step 1 : Cloner sans le `.git`**

```bash
cp -R ~/Projets/newsletter-dashboard ~/Projets/jerwis-admin
cd ~/Projets/jerwis-admin
rm -rf .git node_modules .next _backups PROJECT_NOTES.md last-deploy.md "Leo avatar image" supabase-migration-v11-send-day.sql CHANGELOG.md
```

- [ ] **Step 2 : Renommer le projet dans `package.json`**

Modifie le champ `"name"` :
```json
{
  "name": "jerwis-admin",
  "version": "0.1.0",
  "description": "Admin éditorial perso Jérémy — pipeline newsletter Vendredi 9h"
}
```

- [ ] **Step 3 : Nouveau README**

```markdown
# jerwis-admin

Admin éditorial pour `admin.jerwis.fr`. Pipeline complet :
sources → scan → curation → newsletter Vendredi 9h → 15 posts sociaux.

## Setup

1. `npm install`
2. Copier `.env.local.example` → `.env.local`, remplir les valeurs
3. `npm run dev` → http://localhost:3000

## Stack
Next.js 16 · React 19 · Tailwind 4 · Supabase · Resend · Anthropic · Zernio.
```

- [ ] **Step 4 : Init nouveau repo Git + premier commit**

```bash
cd ~/Projets/jerwis-admin
git init
git add -A
git commit -m "chore: initial fork from newsletter-dashboard"
```

- [ ] **Step 5 : Créer le repo GitHub distant et pousser**

```bash
gh repo create sagnierjeremy-byte/jerwis-admin --private --source=. --push
```

---

### Task 2 : Créer le projet Supabase dédié + appliquer schéma 6 tables

**Files:**
- Create: `~/Projets/jerwis-admin/db/migrations/001_jerwis_schema.sql`

- [ ] **Step 1 : Créer le projet Supabase**

Via dashboard Supabase :
- Nom : `jerwis-admin-prod`
- Région : `eu-west-3` (Paris)
- Plan : Free
- Récupérer URL projet + service role key + anon key

- [ ] **Step 2 : Écrire la migration SQL initiale**

Contenu de `db/migrations/001_jerwis_schema.sql` (schéma simplifié vs newsletter-dashboard) :

```sql
-- 6 tables MVP : sources, items, source_runs, newsletters, social_posts, settings

create extension if not exists pgcrypto;

-- 1. Sources (pilotables par Jérémy depuis /sources)
create table sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('youtube', 'rss', 'gnews')),
  name text not null,
  url text not null,
  category text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_scanned_at timestamptz,
  last_error text
);
create index idx_sources_active on sources(active);

-- 2. Items bruts (avant scoring + curation)
create table items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  url_canonical text not null unique,
  title text not null,
  excerpt text,
  published_at timestamptz,
  scraped_at timestamptz not null default now(),
  score int,
  score_reasoning text,
  status text not null default 'pending'
    check (status in ('pending', 'kept', 'dismissed', 'used'))
);
create index idx_items_status on items(status);
create index idx_items_score on items(score desc);
create index idx_items_published_at on items(published_at desc);

-- 3. Logs de scans (debug + observabilité)
create table source_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  items_found int,
  items_new int,
  error text
);
create index idx_source_runs_source on source_runs(source_id, started_at desc);

-- 4. Newsletters (drafts + scheduled + sent)
create table newsletters (
  id uuid primary key default gen_random_uuid(),
  edition_number int not null,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  resend_broadcast_id text,
  subject text,
  edito text,
  curated_item_ids uuid[],
  outil_section text,
  html_body text,
  text_body text,
  created_at timestamptz not null default now()
);
create unique index idx_newsletters_edition on newsletters(edition_number);

-- 5. Posts sociaux (15 par newsletter)
create table social_posts (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid not null references newsletters(id) on delete cascade,
  item_id uuid references items(id) on delete set null,
  platform text not null check (platform in ('x', 'linkedin', 'instagram')),
  content text not null,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at timestamptz,
  zernio_post_id text,
  created_at timestamptz not null default now()
);
create index idx_social_posts_newsletter on social_posts(newsletter_id);

-- 6. Settings (clé/valeur)
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS off (admin solo, accès via service role uniquement)
alter table sources disable row level security;
alter table items disable row level security;
alter table source_runs disable row level security;
alter table newsletters disable row level security;
alter table social_posts disable row level security;
alter table settings disable row level security;
```

- [ ] **Step 3 : Appliquer la migration**

Via SQL Editor Supabase : copier-coller le contenu de `001_jerwis_schema.sql`, exécuter. Vérifier les 6 tables dans Table Editor.

- [ ] **Step 4 : Commit**

```bash
cd ~/Projets/jerwis-admin
git add db/
git commit -m "feat(db): schéma initial 6 tables MVP"
```

---

### Task 3 : Configurer `.env.local` et template

**Files:**
- Create: `~/Projets/jerwis-admin/.env.local.example`
- Create: `~/Projets/jerwis-admin/.env.local`
- Modify: `~/Projets/jerwis-admin/.gitignore` (vérif `.env.local` exclu)

- [ ] **Step 1 : Écrire `.env.local.example`**

```bash
# Supabase (jerwis-admin-prod, eu-west-3)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Resend (réutilise audience AI Playbook jerwis.fr)
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
RESEND_DEFAULT_SENDER="Jérémy <jeremy@jerwis.fr>"
RESEND_DEFAULT_REPLY_TO=jeremy@jerwis.fr

# Zernio (programmation 3 réseaux)
ZERNIO_API_KEY=
ZERNIO_BRAND_ID=

# Auth admin
ADMIN_PASSWORD=
ADMIN_SECRET=

# Crons Vercel
CRON_SECRET=
```

- [ ] **Step 2 : Créer `.env.local` (copie + valeurs réelles)**

```bash
cp .env.local.example .env.local
# Remplir manuellement avec les valeurs Supabase + Resend + Anthropic + Zernio
# ADMIN_PASSWORD : choisir un mot de passe fort
# ADMIN_SECRET : openssl rand -hex 32
# CRON_SECRET : openssl rand -hex 32
```

- [ ] **Step 3 : Vérifier `.gitignore`**

S'assurer que `.env.local` est dans `.gitignore` (il l'est déjà héritage). Si absent, ajouter.

- [ ] **Step 4 : Commit**

```bash
git add .env.local.example .gitignore
git commit -m "feat(config): template env vars + secrets"
```

---

### Task 4 : Configurer Vitest pour les tests lib

**Files:**
- Create: `~/Projets/jerwis-admin/vitest.config.ts`
- Modify: `~/Projets/jerwis-admin/package.json` (scripts test + deps vitest)

- [ ] **Step 1 : Installer Vitest**

```bash
cd ~/Projets/jerwis-admin
npm install -D vitest @vitest/ui
```

- [ ] **Step 2 : Créer `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3 : Ajouter scripts dans `package.json`**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4 : Test sanity**

```bash
mkdir -p tests
echo "import { test, expect } from 'vitest'; test('sanity', () => expect(1).toBe(1));" > tests/sanity.test.ts
npm test
```

Expected : `1 passed`. Supprimer `tests/sanity.test.ts`.

- [ ] **Step 5 : Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "feat(tests): config Vitest pour tests lib"
```

---

## Phase 1 — Auth (Tasks 5-7)

### Task 5 : Lib auth (hash + cookie)

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/auth.ts`
- Create: `~/Projets/jerwis-admin/tests/auth.test.ts`

- [ ] **Step 1 : Écrire le test**

`tests/auth.test.ts` :
```ts
import { test, expect } from 'vitest';
import { hashSession, verifySession } from '@/lib/auth';

test('hashSession produces deterministic 64-char hex', () => {
  const h = hashSession('mdp', 'secret');
  expect(h).toHaveLength(64);
  expect(h).toMatch(/^[a-f0-9]+$/);
});

test('verifySession returns true for matching pair', () => {
  const h = hashSession('mdp', 'secret');
  expect(verifySession(h, 'mdp', 'secret')).toBe(true);
});

test('verifySession returns false for wrong password', () => {
  const h = hashSession('mdp', 'secret');
  expect(verifySession(h, 'mauvais', 'secret')).toBe(false);
});

test('verifySession returns false for wrong secret', () => {
  const h = hashSession('mdp', 'secret');
  expect(verifySession(h, 'mdp', 'autre-secret')).toBe(false);
});
```

- [ ] **Step 2 : Run test → fail attendu**

```bash
npm test
```
Expected: `Cannot find module '@/lib/auth'`.

- [ ] **Step 3 : Implémenter `src/lib/auth.ts`**

```ts
import { createHash } from 'node:crypto';

export const SESSION_COOKIE = 'jerwis_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function hashSession(password: string, secret: string): string {
  return createHash('sha256').update(`${password}::${secret}`).digest('hex');
}

export function verifySession(
  cookieValue: string | undefined,
  password: string,
  secret: string,
): boolean {
  if (!cookieValue) return false;
  return cookieValue === hashSession(password, secret);
}
```

- [ ] **Step 4 : Run test → pass**

```bash
npm test
```
Expected : 4 tests passés.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/auth.ts tests/auth.test.ts
git commit -m "feat(auth): hash session + verify (sha256 mdp+secret)"
```

---

### Task 6 : Middleware Next.js (gate global)

**Files:**
- Create: `~/Projets/jerwis-admin/middleware.ts`

- [ ] **Step 1 : Écrire `middleware.ts`**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/api/cron'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes publiques (login + crons)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    // Crons : vérifier Bearer CRON_SECRET
    if (pathname.startsWith('/api/cron')) {
      const auth = req.headers.get('authorization');
      if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  // Static assets : skip
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Tout le reste : check cookie
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  const password = process.env.ADMIN_PASSWORD ?? '';
  const secret = process.env.ADMIN_SECRET ?? '';

  if (!verifySession(cookie, password, secret)) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] **Step 2 : Lancer dev pour vérifier le redirect**

```bash
npm run dev
```

Naviguer vers `http://localhost:3000/`. Doit rediriger vers `/login?next=%2F`.

- [ ] **Step 3 : Commit**

```bash
git add middleware.ts
git commit -m "feat(auth): middleware global · gate hors /login + /api/cron"
```

---

### Task 7 : Page `/login`

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/login/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/login/actions.ts`

- [ ] **Step 1 : Écrire `actions.ts`**

```ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hashSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/');

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, hashSession(password, process.env.ADMIN_SECRET ?? ''), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  redirect(next);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/login');
}
```

- [ ] **Step 2 : Écrire `page.tsx`**

```tsx
import { login } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? '/';
  const error = sp.error === '1';

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1a1b] text-white">
      <form
        action={login}
        className="flex flex-col gap-4 p-8 rounded-lg border border-white/10 w-80"
      >
        <h1 className="text-2xl font-bold">Jerwis Admin</h1>
        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          autoFocus
          placeholder="Mot de passe"
          className="px-3 py-2 rounded bg-white/5 border border-white/10 outline-none focus:border-emerald-400"
        />
        {error && <p className="text-red-400 text-sm">Mot de passe incorrect.</p>}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
        >
          Entrer
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 3 : Tester en dev**

```bash
npm run dev
```

Aller sur `localhost:3000/login`, saisir `ADMIN_PASSWORD`, vérifier redirect `/`.

- [ ] **Step 4 : Commit**

```bash
git add src/app/login/
git commit -m "feat(auth): page /login + login/logout server actions"
```

---

## Phase 2 — Layout & rebranding (Tasks 8-10)

### Task 8 : Suppression des 7 sections hors-MVP

**Files:**
- Delete: `src/app/ab-tests/`, `src/app/analytics/`, `src/app/feedback/`, `src/app/history/`, `src/app/learnings/`, `src/app/leo/`, `src/app/templates/`, `src/app/inscription/`, `src/app/segments/`, `src/app/content/`, `src/app/trending/`
- Delete: `src/lib/supabase/{ab-tests,engagement,feedback,learnings,leo-stats,segments,subscriptions}.ts`
- Delete: `src/lib/{performance-analyzer,gemini-image,ai-analysis,research}.ts`
- Delete: `src/components/deliverability-score.tsx` (lié analytics)

- [ ] **Step 1 : Supprimer les routes**

```bash
cd ~/Projets/jerwis-admin/src/app
rm -rf ab-tests analytics feedback history learnings leo templates inscription segments content trending
```

- [ ] **Step 2 : Supprimer les libs hors-MVP**

```bash
cd ~/Projets/jerwis-admin/src/lib
rm -f performance-analyzer.ts gemini-image.ts ai-analysis.ts research.ts
rm -f supabase/ab-tests.ts supabase/engagement.ts supabase/feedback.ts \
      supabase/learnings.ts supabase/leo-stats.ts supabase/segments.ts \
      supabase/subscriptions.ts
```

- [ ] **Step 3 : Vérifier que `npm run build` détecte les imports cassés**

```bash
cd ~/Projets/jerwis-admin
npm install
npm run build
```

Lister les erreurs d'import. À chaque erreur, supprimer ou commenter l'import dans le fichier concerné. Boucler jusqu'à `npm run build` qui passe.

- [ ] **Step 4 : Commit**

```bash
git add -A
git commit -m "chore: suppression 7 sections hors-MVP + libs orphelines"
```

---

### Task 9 : Refactor sidebar et layout (8 routes MVP)

**Files:**
- Modify: `~/Projets/jerwis-admin/src/app/sidebar.tsx`
- Modify: `~/Projets/jerwis-admin/src/app/layout.tsx`

- [ ] **Step 1 : Réécrire `sidebar.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from './login/actions';

const ROUTES = [
  { href: '/', label: 'Tableau de bord', icon: '◆' },
  { href: '/sources', label: 'Sources', icon: '⊕' },
  { href: '/inspiration', label: 'Veille', icon: '✦' },
  { href: '/generate', label: 'Rédaction', icon: '✎' },
  { href: '/newsletters', label: 'Envois', icon: '↗' },
  { href: '/audience', label: 'Audience', icon: '○' },
  { href: '/social', label: 'Posts sociaux', icon: '❖' },
  { href: '/settings', label: 'Réglages', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-[#0a1414] border-r border-white/5 flex flex-col">
      <div className="p-4 border-b border-white/5">
        <div className="text-xs uppercase tracking-widest text-white/40">jerwis</div>
        <div className="text-lg font-bold">Admin</div>
      </div>
      <nav className="flex-1 p-2">
        {ROUTES.map((r) => {
          const active = pathname === r.href || (r.href !== '/' && pathname.startsWith(r.href));
          return (
            <Link
              key={r.href}
              href={r.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm ${
                active ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="w-4">{r.icon}</span>
              {r.label}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="p-2 border-t border-white/5">
        <button type="submit" className="text-xs text-white/40 hover:text-white">
          Déconnexion
        </button>
      </form>
    </aside>
  );
}
```

- [ ] **Step 2 : Adapter `layout.tsx`**

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Sidebar } from './sidebar';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Jerwis Admin',
  description: 'Pipeline éditorial Vendredi 9h',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-invoke-path') ?? '';
  const isLogin = pathname.startsWith('/login');

  return (
    <html lang="fr">
      <body className="bg-[#0d1a1b] text-white antialiased min-h-screen">
        {isLogin ? (
          children
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
```

- [ ] **Step 3 : Vérifier en dev**

```bash
npm run dev
```

`localhost:3000/login` → page sans sidebar. Login → toutes les autres pages avec sidebar 8 entrées.

- [ ] **Step 4 : Commit**

```bash
git add src/app/sidebar.tsx src/app/layout.tsx
git commit -m "feat(ui): sidebar 8 routes MVP + layout login bypass"
```

---

### Task 10 : Page `/` Dashboard (placeholder fonctionnel)

**Files:**
- Modify: `~/Projets/jerwis-admin/src/app/page.tsx`

- [ ] **Step 1 : Réécrire `page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = createClient();

  const [{ count: pendingItems }, { data: lastNewsletter }, { count: activeSources }] =
    await Promise.all([
      supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase
        .from('newsletters')
        .select('edition_number, status, sent_at, scheduled_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('sources').select('*', { count: 'exact', head: true }).eq('active', true),
    ]);

  // Inscrits Resend
  const subscribersCount = await fetchResendCount();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card label="Inscrits" value={subscribersCount?.toString() ?? '—'} />
        <Card label="Sources actives" value={activeSources?.toString() ?? '0'} />
        <Card label="Items en attente" value={pendingItems?.toString() ?? '0'} />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Dernière newsletter</h2>
        {lastNewsletter ? (
          <p className="text-white/70">
            #{lastNewsletter.edition_number} · {lastNewsletter.status}
            {lastNewsletter.sent_at && ` · envoyée le ${lastNewsletter.sent_at}`}
          </p>
        ) : (
          <p className="text-white/40">Aucune newsletter pour le moment.</p>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="text-xs uppercase tracking-widest text-white/40">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

async function fetchResendCount(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
      {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        cache: 'no-store',
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data: unknown[] };
    return json.data.length;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2 : Vérifier en dev**

`npm run dev` puis aller sur `/`. Doit afficher 3 cards (compteur Resend + sources actives + items en attente).

- [ ] **Step 3 : Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(dashboard): page racine · compteurs basiques (Resend + sources + items)"
```

---

## Phase 3 — Sources (Tasks 11-15)

### Task 11 : Lib `supabase/sources.ts`

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/supabase/sources.ts`

- [ ] **Step 1 : Écrire le module**

```ts
import { createClient } from './client';

export type SourceKind = 'youtube' | 'rss' | 'gnews';

export type Source = {
  id: string;
  kind: SourceKind;
  name: string;
  url: string;
  category: string | null;
  active: boolean;
  created_at: string;
  last_scanned_at: string | null;
  last_error: string | null;
};

export async function listSources(): Promise<Source[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('kind')
    .order('name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Source[];
}

export async function listActiveSources(): Promise<Source[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true);
  if (error) throw new Error(error.message);
  return (data ?? []) as Source[];
}

export async function createSource(input: {
  kind: SourceKind;
  name: string;
  url: string;
  category?: string;
}): Promise<Source> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sources')
    .insert({ ...input, active: true })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Source;
}

export async function toggleSource(id: string, active: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('sources').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteSource(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('sources').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function markScanned(
  id: string,
  result: { success: boolean; error?: string },
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('sources')
    .update({
      last_scanned_at: new Date().toISOString(),
      last_error: result.success ? null : result.error ?? null,
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/supabase/sources.ts
git commit -m "feat(sources): CRUD lib supabase + types"
```

---

### Task 12 : Seed initial des sources jerwis

**Files:**
- Create: `~/Projets/jerwis-admin/db/seeds/001_jerwis_sources.sql`

- [ ] **Step 1 : Écrire le seed**

Contenu (extrait — structure complète) :

```sql
-- 34 chaînes YouTube + 7 médias presse + 8 queries Google News

insert into sources (kind, name, url, category, active) values
-- YouTube IA & Tech (7)
('youtube', 'Silicon Carne', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCSzj7G8GnFq2zrAB05_qJng', 'ia_tech', true),
('youtube', 'IA et Stratégie', 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4bz9w3p5cBWlEr3W8MoflA', 'ia_tech', true),
('youtube', 'Vision IA', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCWGm-vSYUYsQy0mnoQOK0sw', 'ia_tech', true),
('youtube', 'Underscore_', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCDmEJVqv1JaWRjKMG1zjEnQ', 'ia_tech', true),
('youtube', 'Melvynx', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCDghqW3yVeNAIsh5FUeEJ4Q', 'ia_tech', true),
('youtube', 'Grand Angle', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnuuXFkR3Te2NksSH9q_-WA', 'ia_tech', true),
('youtube', 'Grand Angle Nova', 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4qsWzDTYzjN6Q8jw_8jhuw', 'ia_tech', true),

-- YouTube Business (12) — channel IDs à résoudre via youtube-channels.js du site
-- (récupérer depuis ~/Projets/jeremy-sagnier-site/scripts/youtube-channels.js)
-- Hormozi, Leila Hormozi, GaryVee, Iman Gadzhi, Grant Cardone, LEGEND,
-- Oussama Ammar, Hasheur, Le Déclic, Antoine Blanco, Yomi Denzel, TheiCollection

-- Presse FR (6)
('rss', 'Les Echos', 'https://www.lesechos.fr/rss/rss_la_une.xml', 'presse_fr', true),
('rss', 'Le Monde', 'https://www.lemonde.fr/rss/une.xml', 'presse_fr', true),
('rss', 'L''Usine Digitale', 'https://www.usine-digitale.fr/rss', 'presse_fr', true),
('rss', 'Maddyness', 'https://www.maddyness.com/feed/', 'presse_fr', true),
('rss', 'Numerama', 'https://www.numerama.com/feed/', 'presse_fr', true),
('rss', 'Korben', 'https://korben.info/feed', 'presse_fr', true),

-- Presse EN (1, optionnelle)
('rss', 'Sifted', 'https://sifted.eu/feed', 'presse_en', true),

-- Google News queries (8)
('gnews', 'IA en entreprise', 'https://news.google.com/rss/search?q=%22intelligence+artificielle%22+entreprise&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'IA générative PME', 'https://news.google.com/rss/search?q=%22IA+g%C3%A9n%C3%A9rative%22+PME&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'Outils IA productivité', 'https://news.google.com/rss/search?q=%22outils+IA%22+productivit%C3%A9&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'Entrepreneur IA France', 'https://news.google.com/rss/search?q=entrepreneur+IA+France&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'Automatisation no-code', 'https://news.google.com/rss/search?q=automatisation+%22no-code%22&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'IA travail emploi', 'https://news.google.com/rss/search?q=%22IA%22+travail+emploi+m%C3%A9tier&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'Startup IA France levée', 'https://news.google.com/rss/search?q=startup+IA+France+lev%C3%A9e&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true),
('gnews', 'OpenAI Anthropic Mistral', 'https://news.google.com/rss/search?q=OpenAI+Anthropic+Mistral+lancement&hl=fr&gl=FR&ceid=FR:fr', 'gnews', true);
```

- [ ] **Step 2 : Récupérer les channelIds YouTube manquants**

Lire `~/Projets/jeremy-sagnier-site/data/youtube-cache.json` (si existe) ou `~/Projets/jeremy-sagnier-site/scripts/youtube-channels.js`. Compléter le seed avec les 27 chaînes restantes (Business, Finance, Géopolitique, Lifestyle).

- [ ] **Step 3 : Appliquer le seed**

Via SQL Editor Supabase : copier-coller, exécuter. Vérifier `select count(*) from sources;` = ~50.

- [ ] **Step 4 : Commit**

```bash
git add db/seeds/001_jerwis_sources.sql
git commit -m "feat(sources): seed initial · 34 YT + 7 presse + 8 GNews"
```

---

### Task 13 : Page `/sources` + actions

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/sources/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/sources/source-manager.tsx`
- Create: `~/Projets/jerwis-admin/src/app/sources/actions.ts`

- [ ] **Step 1 : `actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import {
  createSource,
  deleteSource,
  toggleSource,
  type SourceKind,
} from '@/lib/supabase/sources';

export async function addSource(formData: FormData) {
  const kind = String(formData.get('kind')) as SourceKind;
  const name = String(formData.get('name')).trim();
  const url = String(formData.get('url')).trim();
  const category = String(formData.get('category') ?? '').trim() || undefined;

  if (!name || !url) throw new Error('Nom et URL requis');
  if (!['youtube', 'rss', 'gnews'].includes(kind)) throw new Error('Type invalide');

  await createSource({ kind, name, url, category });
  revalidatePath('/sources');
}

export async function toggleSourceAction(id: string, active: boolean) {
  await toggleSource(id, active);
  revalidatePath('/sources');
}

export async function deleteSourceAction(id: string) {
  await deleteSource(id);
  revalidatePath('/sources');
}
```

- [ ] **Step 2 : `page.tsx`**

```tsx
import { listSources } from '@/lib/supabase/sources';
import { SourceManager } from './source-manager';

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const sources = await listSources();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Sources</h1>
      <p className="text-white/60 mb-8">
        Tu pilotes ce que les agents scannent. Active / désactive / ajoute.
      </p>
      <SourceManager sources={sources} />
    </div>
  );
}
```

- [ ] **Step 3 : `source-manager.tsx` (client)**

```tsx
'use client';

import { useState } from 'react';
import {
  addSource,
  toggleSourceAction,
  deleteSourceAction,
} from './actions';
import type { Source } from '@/lib/supabase/sources';

export function SourceManager({ sources }: { sources: Source[] }) {
  const grouped = sources.reduce<Record<string, Source[]>>((acc, s) => {
    (acc[s.kind] ??= []).push(s);
    return acc;
  }, {});

  const labels = { youtube: 'YouTube', rss: 'RSS / Presse', gnews: 'Google News' };

  return (
    <div className="space-y-8">
      <AddForm />
      {(['youtube', 'rss', 'gnews'] as const).map((kind) => (
        <section key={kind}>
          <h2 className="text-xl font-semibold mb-3">
            {labels[kind]} ({grouped[kind]?.length ?? 0})
          </h2>
          <ul className="space-y-1">
            {(grouped[kind] ?? []).map((s) => (
              <SourceRow key={s.id} source={s} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function SourceRow({ source }: { source: Source }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2 rounded border border-white/5 hover:border-white/15">
      <input
        type="checkbox"
        checked={source.active}
        onChange={(e) => toggleSourceAction(source.id, e.target.checked)}
        className="accent-emerald-500"
      />
      <div className="flex-1">
        <div className="font-medium">{source.name}</div>
        <div className="text-xs text-white/40 truncate">{source.url}</div>
        {source.last_error && (
          <div className="text-xs text-red-400 mt-1">⚠ {source.last_error}</div>
        )}
      </div>
      <button
        onClick={() => {
          if (confirm(`Supprimer ${source.name} ?`)) deleteSourceAction(source.id);
        }}
        className="text-xs text-white/40 hover:text-red-400"
      >
        Supprimer
      </button>
    </li>
  );
}

function AddForm() {
  const [kind, setKind] = useState<'youtube' | 'rss' | 'gnews'>('rss');
  return (
    <form action={addSource} className="flex gap-2 items-end p-3 rounded border border-white/10">
      <select
        name="kind"
        value={kind}
        onChange={(e) => setKind(e.target.value as 'youtube' | 'rss' | 'gnews')}
        className="px-2 py-1 bg-white/5 border border-white/10 rounded"
      >
        <option value="rss">RSS</option>
        <option value="youtube">YouTube</option>
        <option value="gnews">Google News</option>
      </select>
      <input
        name="name"
        required
        placeholder="Nom"
        className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded"
      />
      <input
        name="url"
        required
        placeholder="URL RSS / channel feed / GNews query"
        className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-emerald-500 text-black rounded font-semibold"
      >
        Ajouter
      </button>
    </form>
  );
}
```

- [ ] **Step 4 : Vérifier en dev**

`/sources` doit afficher les ~50 sources groupées par type avec cases à cocher fonctionnelles + form d'ajout.

- [ ] **Step 5 : Commit**

```bash
git add src/app/sources/
git commit -m "feat(sources): page /sources éditable + 3 server actions"
```

---

### Task 14 : Lib `url-canonical.ts` + tests

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/url-canonical.ts`
- Create: `~/Projets/jerwis-admin/tests/url-canonical.test.ts`

- [ ] **Step 1 : Test**

```ts
import { test, expect } from 'vitest';
import { canonicalize } from '@/lib/url-canonical';

test('strips utm params', () => {
  expect(canonicalize('https://x.com/a?utm_source=foo&utm_medium=bar&id=1')).toBe(
    'https://x.com/a?id=1',
  );
});

test('strips fragment', () => {
  expect(canonicalize('https://x.com/a#section')).toBe('https://x.com/a');
});

test('lowercases host but preserves path case', () => {
  expect(canonicalize('https://Example.COM/Path')).toBe('https://example.com/Path');
});

test('removes trailing slash on path (root excepted)', () => {
  expect(canonicalize('https://x.com/a/b/')).toBe('https://x.com/a/b');
  expect(canonicalize('https://x.com/')).toBe('https://x.com/');
});

test('returns input on invalid URL', () => {
  expect(canonicalize('not-a-url')).toBe('not-a-url');
});
```

- [ ] **Step 2 : Run test → fail attendu**

```bash
npm test -- url-canonical
```

- [ ] **Step 3 : Implémenter `url-canonical.ts`**

```ts
const STRIP_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
  'igshid',
  'ref',
  'ref_src',
]);

export function canonicalize(input: string): string {
  try {
    const u = new URL(input);
    u.hostname = u.hostname.toLowerCase();
    u.hash = '';
    for (const p of [...u.searchParams.keys()]) {
      if (STRIP_PARAMS.has(p.toLowerCase())) u.searchParams.delete(p);
    }
    let pathname = u.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    u.pathname = pathname;
    return u.toString();
  } catch {
    return input;
  }
}
```

- [ ] **Step 4 : Run test → pass**

```bash
npm test -- url-canonical
```

- [ ] **Step 5 : Commit**

```bash
git add src/lib/url-canonical.ts tests/url-canonical.test.ts
git commit -m "feat(veille): canonicalize URL · strip UTM + fragment + trailing slash"
```

---

### Task 15 : Lib `feeds.ts` (parse RSS / Atom unifié) + tests

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/feeds.ts`
- Create: `~/Projets/jerwis-admin/tests/feeds.test.ts`

- [ ] **Step 1 : Installer `fast-xml-parser`**

```bash
npm install fast-xml-parser
```

- [ ] **Step 2 : Test (fixtures inline minimales)**

```ts
import { test, expect } from 'vitest';
import { parseFeed } from '@/lib/feeds';

const RSS_SAMPLE = `<?xml version="1.0"?>
<rss version="2.0"><channel>
<title>Test</title>
<item>
  <title>Item 1</title>
  <link>https://example.com/1</link>
  <description>Hello</description>
  <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
</item>
</channel></rss>`;

const ATOM_SAMPLE = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>Test</title>
<entry>
  <title>Vid 1</title>
  <link href="https://youtube.com/watch?v=abc"/>
  <published>2024-01-01T00:00:00+00:00</published>
  <summary>Hello</summary>
</entry>
</feed>`;

test('parses RSS 2.0', () => {
  const items = parseFeed(RSS_SAMPLE);
  expect(items).toHaveLength(1);
  expect(items[0].title).toBe('Item 1');
  expect(items[0].url).toBe('https://example.com/1');
  expect(items[0].excerpt).toBe('Hello');
});

test('parses Atom', () => {
  const items = parseFeed(ATOM_SAMPLE);
  expect(items).toHaveLength(1);
  expect(items[0].url).toBe('https://youtube.com/watch?v=abc');
});

test('returns [] on garbage', () => {
  expect(parseFeed('nope')).toEqual([]);
});
```

- [ ] **Step 3 : Run test → fail**

```bash
npm test -- feeds
```

- [ ] **Step 4 : Implémenter `feeds.ts`**

```ts
import { XMLParser } from 'fast-xml-parser';

export type FeedItem = {
  title: string;
  url: string;
  excerpt: string | null;
  publishedAt: Date | null;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
});

export function parseFeed(xml: string): FeedItem[] {
  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return [];
  }

  // RSS 2.0
  const rss = parsed.rss as { channel?: { item?: unknown } } | undefined;
  if (rss?.channel?.item) {
    const items = Array.isArray(rss.channel.item) ? rss.channel.item : [rss.channel.item];
    return items.map(rssItem);
  }

  // Atom
  const feed = parsed.feed as { entry?: unknown } | undefined;
  if (feed?.entry) {
    const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
    return entries.map(atomEntry);
  }

  return [];
}

function rssItem(item: Record<string, unknown>): FeedItem {
  const title = String(item.title ?? '').trim();
  const url = String(item.link ?? '').trim();
  const excerpt = item.description ? String(item.description).trim() : null;
  const dateStr = item.pubDate ? String(item.pubDate) : null;
  const publishedAt = dateStr ? new Date(dateStr) : null;
  return { title, url, excerpt, publishedAt: isValidDate(publishedAt) ? publishedAt : null };
}

function atomEntry(entry: Record<string, unknown>): FeedItem {
  const title = String(entry.title ?? '').trim();
  const linkVal = entry.link as { '@_href'?: string } | undefined;
  const url = linkVal?.['@_href'] ? String(linkVal['@_href']) : '';
  const excerpt = entry.summary
    ? String(entry.summary).trim()
    : entry['media:description']
    ? String(entry['media:description']).trim()
    : null;
  const dateStr = entry.published ? String(entry.published) : null;
  const publishedAt = dateStr ? new Date(dateStr) : null;
  return { title, url, excerpt, publishedAt: isValidDate(publishedAt) ? publishedAt : null };
}

function isValidDate(d: Date | null): d is Date {
  return d !== null && !Number.isNaN(d.getTime());
}
```

- [ ] **Step 5 : Run test → pass**

- [ ] **Step 6 : Commit**

```bash
git add src/lib/feeds.ts tests/feeds.test.ts package.json package-lock.json
git commit -m "feat(veille): parser RSS/Atom unifié + 3 tests"
```

---

## Phase 4 — Veille / scan / scoring (Tasks 16-19)

### Task 16 : Lib `supabase/items.ts`

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/supabase/items.ts`

- [ ] **Step 1 : Module**

```ts
import { createClient } from './client';

export type ItemStatus = 'pending' | 'kept' | 'dismissed' | 'used';

export type Item = {
  id: string;
  source_id: string;
  url_canonical: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
  scraped_at: string;
  score: number | null;
  score_reasoning: string | null;
  status: ItemStatus;
};

export async function upsertItem(input: {
  source_id: string;
  url_canonical: string;
  title: string;
  excerpt: string | null;
  published_at: Date | null;
}): Promise<{ inserted: boolean; id: string } | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('items')
    .insert({
      source_id: input.source_id,
      url_canonical: input.url_canonical,
      title: input.title,
      excerpt: input.excerpt,
      published_at: input.published_at?.toISOString() ?? null,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    if (error.code === '23505') return null; // unique violation = doublon
    throw new Error(error.message);
  }
  return data ? { inserted: true, id: data.id } : null;
}

export async function listUnscored(limit = 100): Promise<Item[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .is('score', null)
    .eq('status', 'pending')
    .order('scraped_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Item[];
}

export async function setScore(
  id: string,
  score: number,
  reasoning: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('items')
    .update({ score, score_reasoning: reasoning })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listTopPending(limit = 30): Promise<Item[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('status', 'pending')
    .gte('score', 40)
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Item[];
}

export async function setStatus(id: string, status: ItemStatus): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('items').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/supabase/items.ts
git commit -m "feat(veille): CRUD items lib + dédup via unique violation"
```

---

### Task 17 : Lib `veille.ts` refondue (scan + dédup)

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/veille.ts` (remplace l'ancien)

- [ ] **Step 1 : Implémenter**

```ts
import { listActiveSources, markScanned, type Source } from '@/lib/supabase/sources';
import { upsertItem } from '@/lib/supabase/items';
import { parseFeed } from '@/lib/feeds';
import { canonicalize } from '@/lib/url-canonical';
import { createClient } from '@/lib/supabase/client';

const FETCH_TIMEOUT_MS = 15_000;

export type ScanResult = {
  sourceId: string;
  sourceName: string;
  itemsFound: number;
  itemsNew: number;
  error?: string;
};

export async function scanAllActiveSources(): Promise<ScanResult[]> {
  const sources = await listActiveSources();
  const results: ScanResult[] = [];
  for (const source of sources) {
    const result = await scanSource(source);
    await logRun(source.id, result);
    await markScanned(source.id, {
      success: !result.error,
      error: result.error,
    });
    results.push(result);
  }
  return results;
}

async function scanSource(source: Source): Promise<ScanResult> {
  try {
    const xml = await fetchWithTimeout(source.url);
    const items = parseFeed(xml);
    let itemsNew = 0;
    for (const item of items) {
      if (!item.url) continue;
      const url_canonical = canonicalize(item.url);
      const result = await upsertItem({
        source_id: source.id,
        url_canonical,
        title: item.title,
        excerpt: item.excerpt,
        published_at: item.publishedAt,
      });
      if (result?.inserted) itemsNew++;
    }
    return { sourceId: source.id, sourceName: source.name, itemsFound: items.length, itemsNew };
  } catch (e) {
    return {
      sourceId: source.id,
      sourceName: source.name,
      itemsFound: 0,
      itemsNew: 0,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function fetchWithTimeout(url: string): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'user-agent': 'jerwis-admin-bot/0.1 (+admin.jerwis.fr)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

async function logRun(sourceId: string, result: ScanResult): Promise<void> {
  const supabase = createClient();
  await supabase.from('source_runs').insert({
    source_id: sourceId,
    started_at: new Date().toISOString(),
    ended_at: new Date().toISOString(),
    items_found: result.itemsFound,
    items_new: result.itemsNew,
    error: result.error ?? null,
  });
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/veille.ts
git commit -m "feat(veille): scan toutes sources actives · dédup canonical · log runs"
```

---

### Task 18 : Lib `scoring.ts` (Claude Haiku 0-100) + tests

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/scoring.ts`
- Create: `~/Projets/jerwis-admin/tests/scoring.test.ts`

- [ ] **Step 1 : Test (mock Anthropic)**

```ts
import { test, expect, vi } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = {
      create: async () => ({
        content: [
          {
            type: 'text',
            text: JSON.stringify({ score: 75, reasoning: 'Pertinent pour entrepreneur curieux' }),
          },
        ],
      }),
    };
  },
}));

const { scoreItem } = await import('@/lib/scoring');

test('scoreItem returns 0-100 + reasoning', async () => {
  const r = await scoreItem({
    title: 'Comment OpenAI a réduit les coûts',
    excerpt: 'Étude de cas...',
    sourceCategory: 'ia_tech',
  });
  expect(r.score).toBe(75);
  expect(r.reasoning).toMatch(/entrepreneur/);
});
```

- [ ] **Step 2 : Implémenter**

```ts
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Tu scores un article ou une vidéo pour la newsletter "Vendredi 9h" de Jérémy Sagnier.

Cible : entrepreneur curieux d'IA, pas dev, qui veut suivre l'IA et le business pratique sans jargon.

Donne un score 0-100 sur 3 axes pondérés :
- Pertinence cible (50%) : est-ce que ça parle à un entrepreneur non-dev ?
- Accessibilité (30%) : pas trop technique, pas de jargon, langage clair ?
- Fraîcheur (20%) : sujet actuel ou intemporel ?

Items < 40 = écartés.

Réponds UNIQUEMENT en JSON : {"score": number, "reasoning": "1 phrase"}.`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function scoreItem(input: {
  title: string;
  excerpt: string | null;
  sourceCategory: string | null;
}): Promise<{ score: number; reasoning: string }> {
  const userMsg = `Titre : ${input.title}\nExtrait : ${input.excerpt ?? '(aucun)'}\nCatégorie source : ${input.sourceCategory ?? 'inconnue'}`;

  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMsg }],
  });

  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { text: string }).text)
    .join('');

  try {
    const parsed = JSON.parse(text) as { score: number; reasoning: string };
    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      reasoning: parsed.reasoning ?? '',
    };
  } catch {
    return { score: 0, reasoning: 'Erreur parsing réponse modèle' };
  }
}
```

- [ ] **Step 3 : Run test → pass**

- [ ] **Step 4 : Commit**

```bash
git add src/lib/scoring.ts tests/scoring.test.ts
git commit -m "feat(veille): scoring Haiku 3-axes + prompt cache"
```

---

### Task 19 : Cron `/api/cron/veille`

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/api/cron/veille/route.ts`
- Modify: `~/Projets/jerwis-admin/vercel.json`

- [ ] **Step 1 : Route**

```ts
import { NextResponse } from 'next/server';
import { scanAllActiveSources } from '@/lib/veille';
import { listUnscored, setScore } from '@/lib/supabase/items';
import { scoreItem } from '@/lib/scoring';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const SCORING_BATCH_LIMIT = 100;

export async function GET() {
  const t0 = Date.now();

  // 1. Scan toutes les sources actives
  const scanResults = await scanAllActiveSources();

  // 2. Score les items en attente (max N par run)
  const unscored = await listUnscored(SCORING_BATCH_LIMIT);
  const supabase = createClient();
  let scored = 0;
  for (const item of unscored) {
    try {
      // Récup catégorie de la source
      const { data: source } = await supabase
        .from('sources')
        .select('category')
        .eq('id', item.source_id)
        .maybeSingle();
      const r = await scoreItem({
        title: item.title,
        excerpt: item.excerpt,
        sourceCategory: source?.category ?? null,
      });
      await setScore(item.id, r.score, r.reasoning);
      scored++;
    } catch (e) {
      console.error('score error', item.id, e);
    }
  }

  return NextResponse.json({
    duration_ms: Date.now() - t0,
    sources_scanned: scanResults.length,
    items_new_total: scanResults.reduce((s, r) => s + r.itemsNew, 0),
    items_scored: scored,
    errors: scanResults.filter((r) => r.error).map((r) => ({ name: r.sourceName, error: r.error })),
  });
}
```

- [ ] **Step 2 : Mettre à jour `vercel.json`**

```json
{
  "crons": [
    { "path": "/api/cron/veille", "schedule": "0 */6 * * *" },
    { "path": "/api/cron/send-scheduled", "schedule": "0 * * * *" }
  ]
}
```

- [ ] **Step 3 : Test manuel local**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/veille
```

Expected : JSON avec `sources_scanned`, `items_new_total`, `items_scored`.

- [ ] **Step 4 : Commit**

```bash
git add src/app/api/cron/veille/ vercel.json
git commit -m "feat(cron): /api/cron/veille · scan + scoring (toutes les 6h)"
```

---

## Phase 5 — Inspiration & curation (Tasks 20-21)

### Task 20 : Page `/inspiration` + actions

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/inspiration/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/inspiration/inspiration-list.tsx`
- Create: `~/Projets/jerwis-admin/src/app/inspiration/actions.ts`

- [ ] **Step 1 : `actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { setStatus, type ItemStatus } from '@/lib/supabase/items';

export async function setItemStatus(id: string, status: ItemStatus) {
  await setStatus(id, status);
  revalidatePath('/inspiration');
}
```

- [ ] **Step 2 : `page.tsx`**

```tsx
import { listTopPending } from '@/lib/supabase/items';
import { listActiveSources } from '@/lib/supabase/sources';
import { InspirationList } from './inspiration-list';

export const dynamic = 'force-dynamic';

export default async function InspirationPage() {
  const [items, sources] = await Promise.all([listTopPending(30), listActiveSources()]);
  const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Veille</h1>
      <p className="text-white/60 mb-8">
        Top 30 sujets remontés par les agents. Coche les 5 que tu veux pour la newsletter.
      </p>
      <InspirationList items={items} sourceById={sourceById} />
    </div>
  );
}
```

- [ ] **Step 3 : `inspiration-list.tsx` (client)**

```tsx
'use client';

import { setItemStatus } from './actions';
import type { Item } from '@/lib/supabase/items';
import type { Source } from '@/lib/supabase/sources';

export function InspirationList({
  items,
  sourceById,
}: {
  items: Item[];
  sourceById: Record<string, Source>;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const source = sourceById[item.source_id];
        const isKept = item.status === 'kept';
        return (
          <li
            key={item.id}
            className={`p-4 rounded border ${
              isKept ? 'border-emerald-400 bg-emerald-400/5' : 'border-white/10'
            }`}
          >
            <div className="flex gap-4 items-start">
              <input
                type="checkbox"
                checked={isKept}
                onChange={(e) => setItemStatus(item.id, e.target.checked ? 'kept' : 'pending')}
                className="mt-1 accent-emerald-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 text-xs text-white/40">
                  <span>{source?.name ?? '—'}</span>
                  <span>·</span>
                  <span>Score {item.score}</span>
                  {item.published_at && (
                    <>
                      <span>·</span>
                      <span>{new Date(item.published_at).toLocaleDateString('fr-FR')}</span>
                    </>
                  )}
                </div>
                <a
                  href={item.url_canonical}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold hover:text-emerald-400"
                >
                  {item.title}
                </a>
                {item.excerpt && (
                  <p className="text-sm text-white/60 mt-1 line-clamp-2">{item.excerpt}</p>
                )}
                {item.score_reasoning && (
                  <p className="text-xs text-white/40 italic mt-1">→ {item.score_reasoning}</p>
                )}
              </div>
              <button
                onClick={() => setItemStatus(item.id, 'dismissed')}
                className="text-xs text-white/40 hover:text-red-400"
              >
                Écarter
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 4 : Commit**

```bash
git add src/app/inspiration/
git commit -m "feat(inspiration): page top 30 + curation kept/dismissed"
```

---

### Task 21 : Compteur sélection en sidebar

**Files:**
- Modify: `~/Projets/jerwis-admin/src/app/sidebar.tsx`

- [ ] **Step 1 : Lire le compteur côté serveur**

Convertir `Sidebar` en composant async server-side qui fetch le compteur, ou utiliser un endpoint API + useEffect côté client. Approche simple : ajouter un compteur dans `layout.tsx` puis le passer à la sidebar via prop.

Implémenter dans `layout.tsx` :

```tsx
import { createClient } from '@/lib/supabase/client';
// ... imports existants
const supabase = createClient();
const { count: keptCount } = await supabase
  .from('items')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'kept');
// passer `keptCount` à <Sidebar keptCount={keptCount ?? 0} />
```

Et dans `sidebar.tsx`, accepter `keptCount` et afficher un badge `(N)` à côté de `Veille` quand `keptCount > 0`.

- [ ] **Step 2 : Commit**

```bash
git add src/app/layout.tsx src/app/sidebar.tsx
git commit -m "feat(ui): badge sélection dans sidebar Veille"
```

---

## Phase 6 — Génération newsletter (Tasks 22-24)

### Task 22 : Lib `newsletter-writer.ts` refondue (prompt Leo Jérémy)

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/newsletter-writer.ts` (remplace l'ancien)

- [ ] **Step 1 : Implémenter**

```ts
import Anthropic from '@anthropic-ai/sdk';
import type { Item } from '@/lib/supabase/items';

const TON_LEO_JEREMY = `Tu rédiges la newsletter "Vendredi 9h" de Jérémy Sagnier (jerwis.fr).

Contexte rédacteur :
- Jérémy Sagnier, entrepreneur curieux d'IA, frère jumeau de Kevin (fondateur Eurofiscalis), père d'un fils.
- PAS dev. PAS codeur. Il refuse juste d'être dépassé par l'IA.
- Il partage ce qu'il consomme à lui-même chaque semaine.

Cible : entrepreneurs curieux d'IA, pros pressés, débutants qui hésitent.

TON LEO (RÈGLES DURES) :
- 1ère personne directe : "Cette semaine j'ai vu...", "Je suis tombé sur...", "Je te partage..."
- Chaleureux MAIS pas familier. Comme un ami qui t'écrit un dimanche soir, pas un copain au bar.
- Hyper transparent : assume l'IA, désinscription 1 clic.
- Simple, pas de jargon, mots courants, phrases courtes.
- Montrer le travail : chiffres, sources, processus.
- Assumer les limites : "je peux me tromper, écris-moi".

À BANNIR : "kif", "taf", "mec", "ouais", "y'a", argot oral, "tu piques", "je te file".
À UTILISER : "je te partage", "je t'envoie", "qui fonctionnent", "désinscription en 1 clic".

PITCH CENTRAL (UNE seule fois max par newsletter, idéalement pas du tout) :
"Je fais tout ça d'abord pour moi. Si ça arrive jusqu'à toi, c'est parce que ça m'a servi à moi en premier."

Format de la newsletter :
1. ÉDITO (3-5 lignes) — ton perso, ce que tu as remarqué cette semaine
2. 5 SUJETS curés (chacun 80-120 mots) — titre + pourquoi je le partage + lien
3. OUTIL TESTÉ (100-150 mots) — 1 outil/méthode/prompt que j'ai testé cette semaine

Sortie : JSON STRICT avec les clés "subject", "edito", "sujets" (array de 5 objets {title, blurb, url}), "outil_section".`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function writeNewsletter(input: {
  curatedItems: Item[];
  outilHint?: string;
  editionNumber: number;
}): Promise<{
  subject: string;
  edito: string;
  sujets: { title: string; blurb: string; url: string }[];
  outil_section: string;
}> {
  const itemsBlock = input.curatedItems
    .map(
      (it, i) =>
        `Sujet ${i + 1} :\n  Titre : ${it.title}\n  URL : ${it.url_canonical}\n  Extrait : ${it.excerpt ?? '(aucun)'}`,
    )
    .join('\n\n');

  const userMsg = `Édition #${input.editionNumber}.

Voici les 5 sujets curés à intégrer :
${itemsBlock}

Outil à présenter dans la section dédiée : ${input.outilHint ?? 'choisis un outil concret que Jérémy aurait pu tester cette semaine, lié à un des sujets.'}

Rédige la newsletter complète en JSON.`;

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: [{ type: 'text', text: TON_LEO_JEREMY, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMsg }],
  });

  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { text: string }).text)
    .join('');

  // Le modèle peut wrap le JSON dans des ```json
  const cleaned = text.replace(/```json\s*|```/g, '').trim();

  return JSON.parse(cleaned) as {
    subject: string;
    edito: string;
    sujets: { title: string; blurb: string; url: string }[];
    outil_section: string;
  };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/newsletter-writer.ts
git commit -m "feat(generate): writer newsletter ton Leo Jérémy + prompt cache Sonnet"
```

---

### Task 23 : Lib `supabase/newsletters.ts`

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/supabase/newsletters.ts`

- [ ] **Step 1 : Module CRUD newsletters**

```ts
import { createClient } from './client';

export type NewsletterStatus = 'draft' | 'scheduled' | 'sent';

export type Newsletter = {
  id: string;
  edition_number: number;
  status: NewsletterStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  resend_broadcast_id: string | null;
  subject: string | null;
  edito: string | null;
  curated_item_ids: string[] | null;
  outil_section: string | null;
  html_body: string | null;
  text_body: string | null;
  created_at: string;
};

export async function getNextEditionNumber(): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from('newsletters')
    .select('edition_number')
    .order('edition_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.edition_number ?? 0) + 1;
}

export async function createDraft(input: {
  edition_number: number;
  subject: string;
  edito: string;
  curated_item_ids: string[];
  outil_section: string;
  html_body: string;
  text_body: string;
}): Promise<Newsletter> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('newsletters')
    .insert({ ...input, status: 'draft' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Newsletter;
}

export async function listNewsletters(): Promise<Newsletter[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Newsletter[];
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as Newsletter | null;
}

export async function updateNewsletter(
  id: string,
  patch: Partial<Newsletter>,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('newsletters').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listScheduledDue(): Promise<Newsletter[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString());
  if (error) throw new Error(error.message);
  return (data ?? []) as Newsletter[];
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/supabase/newsletters.ts
git commit -m "feat(newsletters): CRUD lib + listScheduledDue pour cron"
```

---

### Task 24 : Page `/generate` + génération HTML

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/generate/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/generate/newsletter-editor.tsx`
- Create: `~/Projets/jerwis-admin/src/app/generate/actions.ts`

- [ ] **Step 1 : `actions.ts` (générer + sauver draft)**

```ts
'use server';

import { redirect } from 'next/navigation';
import { listTopPending } from '@/lib/supabase/items';
import { writeNewsletter } from '@/lib/newsletter-writer';
import { createDraft, getNextEditionNumber } from '@/lib/supabase/newsletters';
import { setStatus } from '@/lib/supabase/items';
import { createClient } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';

export async function generateDraft(formData: FormData) {
  const outilHint = String(formData.get('outilHint') ?? '');
  const supabase = createClient();
  const { data: kept } = await supabase
    .from('items')
    .select('*')
    .eq('status', 'kept')
    .order('score', { ascending: false })
    .limit(5);

  if (!kept || kept.length < 5) {
    throw new Error(`Il te faut 5 sujets cochés en /inspiration (actuellement ${kept?.length ?? 0}).`);
  }

  const editionNumber = await getNextEditionNumber();
  const generated = await writeNewsletter({
    curatedItems: kept,
    outilHint: outilHint || undefined,
    editionNumber,
  });

  const html = renderHtml(generated, editionNumber);
  const text = renderText(generated, editionNumber);

  const draft = await createDraft({
    edition_number: editionNumber,
    subject: generated.subject,
    edito: generated.edito,
    curated_item_ids: kept.map((k) => k.id),
    outil_section: generated.outil_section,
    html_body: html,
    text_body: text,
  });

  // Marquer items comme used
  for (const k of kept) await setStatus(k.id, 'used');

  revalidatePath('/inspiration');
  revalidatePath('/newsletters');
  redirect(`/newsletters?draft=${draft.id}`);
}

function renderHtml(
  g: { subject: string; edito: string; sujets: { title: string; blurb: string; url: string }[]; outil_section: string },
  n: number,
): string {
  const sujetsHtml = g.sujets
    .map(
      (s, i) => `
      <h2 style="font-size:18px;margin-top:32px">${i + 1}. ${escape(s.title)}</h2>
      <p>${escape(s.blurb)}</p>
      <p><a href="${escape(s.url)}" style="color:#10b981">Lire →</a></p>`,
    )
    .join('');
  return `<!doctype html><html><body style="font-family:system-ui;max-width:600px;margin:0 auto;padding:24px;color:#111">
    <p style="color:#666;text-transform:uppercase;font-size:11px;letter-spacing:.1em">Vendredi 9h · #${n}</p>
    <h1>${escape(g.subject)}</h1>
    <p>${escape(g.edito)}</p>
    ${sujetsHtml}
    <h2 style="font-size:18px;margin-top:48px;border-top:1px solid #ddd;padding-top:24px">🛠️ L'outil que j'ai testé cette semaine</h2>
    <p>${escape(g.outil_section)}</p>
    <p style="margin-top:48px;color:#666;font-size:13px">Réponds à cet email, je lis tout. — Jérémy</p>
    <p style="margin-top:24px;color:#999;font-size:11px"><a href="{{RESEND_UNSUBSCRIBE_URL}}" style="color:#999">Désinscription</a></p>
  </body></html>`;
}

function renderText(
  g: { subject: string; edito: string; sujets: { title: string; blurb: string; url: string }[]; outil_section: string },
  n: number,
): string {
  return [
    `VENDREDI 9H · #${n}`,
    '',
    g.subject,
    '',
    g.edito,
    '',
    ...g.sujets.flatMap((s, i) => [`${i + 1}. ${s.title}`, s.blurb, s.url, '']),
    '',
    `🛠️ L'outil que j'ai testé cette semaine`,
    g.outil_section,
    '',
    'Réponds à cet email, je lis tout. — Jérémy',
    '',
    'Désinscription : {{RESEND_UNSUBSCRIBE_URL}}',
  ].join('\n');
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

- [ ] **Step 2 : `page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/client';
import { generateDraft } from './actions';

export const dynamic = 'force-dynamic';

export default async function GeneratePage() {
  const supabase = createClient();
  const { data: kept } = await supabase
    .from('items')
    .select('*')
    .eq('status', 'kept')
    .order('score', { ascending: false });

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Rédaction</h1>
      <p className="text-white/60 mb-8">
        {kept?.length ?? 0} sujets cochés / 5 requis. Le générateur prend les 5 mieux scorés.
      </p>

      <ul className="mb-8 space-y-2">
        {(kept ?? []).slice(0, 5).map((it) => (
          <li key={it.id} className="text-sm">
            <span className="text-white/40">[{it.score}]</span> {it.title}
          </li>
        ))}
      </ul>

      <form action={generateDraft} className="space-y-4">
        <label className="block">
          <span className="text-sm text-white/60">Indice pour la section "Outil testé" (optionnel)</span>
          <input
            name="outilHint"
            placeholder="ex : Claude Skills, Cursor, Notion AI..."
            className="block w-full mt-1 px-3 py-2 bg-white/5 border border-white/10 rounded"
          />
        </label>
        <button
          type="submit"
          disabled={(kept?.length ?? 0) < 5}
          className="px-6 py-3 bg-emerald-500 text-black font-bold rounded disabled:opacity-50"
        >
          Générer le draft (Sonnet · ~30s)
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3 : Test E2E manuel**

1. Aller sur `/inspiration`, cocher 5 items.
2. Aller sur `/generate`, cliquer "Générer le draft".
3. Vérifier redirection `/newsletters?draft=<id>`.
4. Vérifier draft créé en DB.

- [ ] **Step 4 : Commit**

```bash
git add src/app/generate/
git commit -m "feat(generate): page /generate · génère draft + render HTML/text · marque items used"
```

---

## Phase 7 — Envois (Tasks 25-27)

### Task 25 : Lib `resend.ts` adaptée jerwis

**Files:**
- Modify: `~/Projets/jerwis-admin/src/lib/resend.ts`

- [ ] **Step 1 : Adapter le sender + audience**

Repérer les `DEFAULT_SENDER` / `DEFAULT_REPLY_TO` hardcodés Eurofiscalis et les remplacer par lecture env vars :

```ts
export const DEFAULT_SENDER = process.env.RESEND_DEFAULT_SENDER ?? 'Jérémy <jeremy@jerwis.fr>';
export const DEFAULT_REPLY_TO = process.env.RESEND_DEFAULT_REPLY_TO ?? 'jeremy@jerwis.fr';
export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
```

Garder les fonctions `createBroadcast`, `sendBroadcast`, `getBroadcast` existantes. Vérifier qu'aucune réf à `eurofiscalis.app` ou domaines tiers ne reste.

```bash
grep -i "eurofiscalis\|@example\|leo@" src/lib/resend.ts
```

Si match, remplacer.

- [ ] **Step 2 : Commit**

```bash
git add src/lib/resend.ts
git commit -m "fix(resend): sender + audience via env vars · suppression réf Eurofiscalis"
```

---

### Task 26 : Page `/newsletters` (liste + envoi)

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/newsletters/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/newsletters/actions.ts`

- [ ] **Step 1 : `actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { getNewsletter, updateNewsletter } from '@/lib/supabase/newsletters';
import { createBroadcast, sendBroadcast, AUDIENCE_ID } from '@/lib/resend';

export async function sendNow(id: string) {
  const n = await getNewsletter(id);
  if (!n || !n.html_body || !n.subject) throw new Error('Newsletter incomplète');
  if (!AUDIENCE_ID) throw new Error('RESEND_AUDIENCE_ID manquant');

  const broadcast = await createBroadcast({
    audienceId: AUDIENCE_ID,
    subject: n.subject,
    html: n.html_body,
    text: n.text_body ?? '',
  });
  await sendBroadcast(broadcast.id);
  await updateNewsletter(id, {
    status: 'sent',
    sent_at: new Date().toISOString(),
    resend_broadcast_id: broadcast.id,
  });
  revalidatePath('/newsletters');
}

export async function schedule(id: string, formData: FormData) {
  const datetime = String(formData.get('scheduled_at'));
  if (!datetime) throw new Error('Date requise');
  await updateNewsletter(id, {
    status: 'scheduled',
    scheduled_at: new Date(datetime).toISOString(),
  });
  revalidatePath('/newsletters');
}
```

- [ ] **Step 2 : `page.tsx`**

```tsx
import { listNewsletters } from '@/lib/supabase/newsletters';
import { sendNow, schedule } from './actions';

export const dynamic = 'force-dynamic';

export default async function NewslettersPage() {
  const newsletters = await listNewsletters();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Envois</h1>
      <ul className="space-y-3">
        {newsletters.map((n) => (
          <li key={n.id} className="p-4 rounded border border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest text-white/40">#{n.edition_number}</span>
              <span className={`text-xs px-2 py-1 rounded ${badge(n.status)}`}>{n.status}</span>
              <span className="font-semibold flex-1">{n.subject ?? '(sans sujet)'}</span>
              <span className="text-xs text-white/40">
                {n.sent_at ? `envoyée ${new Date(n.sent_at).toLocaleString('fr-FR')}` : ''}
                {n.scheduled_at && n.status === 'scheduled'
                  ? `programmée ${new Date(n.scheduled_at).toLocaleString('fr-FR')}`
                  : ''}
              </span>
            </div>
            {n.status === 'draft' && (
              <div className="mt-3 flex gap-2 items-center">
                <form action={sendNow.bind(null, n.id)}>
                  <button className="px-3 py-1 bg-emerald-500 text-black font-semibold rounded">
                    Envoyer maintenant
                  </button>
                </form>
                <form action={schedule.bind(null, n.id)} className="flex gap-2 items-center">
                  <input
                    name="scheduled_at"
                    type="datetime-local"
                    required
                    className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                  />
                  <button className="px-3 py-1 border border-white/20 rounded">Programmer</button>
                </form>
              </div>
            )}
            {n.html_body && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-white/40">Aperçu HTML</summary>
                <iframe
                  srcDoc={n.html_body}
                  className="w-full h-96 mt-2 bg-white rounded"
                  sandbox=""
                />
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function badge(status: string): string {
  if (status === 'sent') return 'bg-emerald-500/20 text-emerald-400';
  if (status === 'scheduled') return 'bg-amber-500/20 text-amber-400';
  return 'bg-white/10 text-white/60';
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/app/newsletters/
git commit -m "feat(newsletters): page liste + envoyer maintenant + programmer"
```

---

### Task 27 : Cron `/api/cron/send-scheduled`

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/api/cron/send-scheduled/route.ts`

- [ ] **Step 1 : Route**

```ts
import { NextResponse } from 'next/server';
import { listScheduledDue, updateNewsletter } from '@/lib/supabase/newsletters';
import { createBroadcast, sendBroadcast, AUDIENCE_ID } from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const due = await listScheduledDue();
  if (!AUDIENCE_ID) {
    return NextResponse.json({ error: 'AUDIENCE_ID manquant' }, { status: 500 });
  }
  const sent: string[] = [];
  for (const n of due) {
    if (!n.html_body || !n.subject) continue;
    try {
      const broadcast = await createBroadcast({
        audienceId: AUDIENCE_ID,
        subject: n.subject,
        html: n.html_body,
        text: n.text_body ?? '',
      });
      await sendBroadcast(broadcast.id);
      await updateNewsletter(n.id, {
        status: 'sent',
        sent_at: new Date().toISOString(),
        resend_broadcast_id: broadcast.id,
      });
      sent.push(n.id);
    } catch (e) {
      console.error('send-scheduled failed', n.id, e);
    }
  }
  return NextResponse.json({ sent });
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/app/api/cron/send-scheduled/
git commit -m "feat(cron): /api/cron/send-scheduled · envoie newsletters dues"
```

---

## Phase 8 — Audience (Task 28)

### Task 28 : Page `/audience`

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/audience/page.tsx`

- [ ] **Step 1 : `page.tsx`**

```tsx
export const dynamic = 'force-dynamic';

type Contact = { id: string; email: string; created_at: string; unsubscribed: boolean };

export default async function AudiencePage() {
  const contacts = await fetchContacts();
  const subscribed = contacts.filter((c) => !c.unsubscribed);
  const unsubs = contacts.filter((c) => c.unsubscribed);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Audience</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card label="Inscrits" value={subscribed.length.toString()} />
        <Card label="Désinscrits" value={unsubs.length.toString()} />
        <Card label="Total contacts" value={contacts.length.toString()} />
      </div>
      <h2 className="text-xl font-semibold mb-3">Inscrits récents</h2>
      <ul className="space-y-1">
        {subscribed.slice(0, 50).map((c) => (
          <li key={c.id} className="flex items-center gap-3 text-sm py-1">
            <span className="text-white/40">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
            <span>{c.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="text-xs uppercase tracking-widest text-white/40">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

async function fetchContacts(): Promise<Contact[]> {
  const res = await fetch(
    `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
    {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      cache: 'no-store',
    },
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { data: Contact[] };
  return json.data ?? [];
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/app/audience/
git commit -m "feat(audience): page Resend · inscrits + désinscrits + 50 derniers"
```

---

## Phase 9 — Posts sociaux (Tasks 29-32)

### Task 29 : Lib `social-writer.ts` refondue + tests

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/social-writer.ts` (remplace l'ancien)
- Create: `~/Projets/jerwis-admin/tests/social-writer.test.ts`

- [ ] **Step 1 : Test (mock SDK)**

```ts
import { test, expect, vi } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = {
      create: async () => ({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              x: 'Tweet test #1',
              linkedin: 'Post LinkedIn test',
              instagram: 'Caption Insta',
            }),
          },
        ],
      }),
    };
  },
}));

const { writeSocialForItem } = await import('@/lib/social-writer');

test('writeSocialForItem returns 3 platforms', async () => {
  const r = await writeSocialForItem({
    item: { title: 'Test', url_canonical: 'https://x.com', excerpt: '' } as never,
  });
  expect(r.x).toContain('Tweet');
  expect(r.linkedin).toContain('LinkedIn');
  expect(r.instagram).toContain('Insta');
});
```

- [ ] **Step 2 : Implémenter**

```ts
import Anthropic from '@anthropic-ai/sdk';
import type { Item } from '@/lib/supabase/items';

const SYSTEM_PROMPT = `Tu écris des déclinaisons sociales pour la newsletter "Vendredi 9h" de Jérémy Sagnier.

Ton Leo : 1ère personne, chaleureux pas familier, simple, pas de jargon.

À partir d'UN sujet de la newsletter, écris :
1. UN tweet X (≤ 280 chars) : hook fort + 1 phrase d'insight + lien.
2. UN post LinkedIn (200-400 mots) : hook ligne 1 (sans emoji), insight, question fin. Pas de bullet emoji-spam.
3. UNE caption Instagram (100-150 mots) : ton Leo, accroche émotionnelle, CTA newsletter.

Réponds UNIQUEMENT en JSON : {"x": "...", "linkedin": "...", "instagram": "..."}.`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function writeSocialForItem(input: {
  item: Item;
}): Promise<{ x: string; linkedin: string; instagram: string }> {
  const userMsg = `Sujet : ${input.item.title}
Extrait : ${input.item.excerpt ?? '(aucun)'}
Lien : ${input.item.url_canonical}

Décline en 3 posts (X, LinkedIn, Instagram).`;

  const res = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMsg }],
  });

  const text = res.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { text: string }).text)
    .join('');
  const cleaned = text.replace(/```json\s*|```/g, '').trim();
  return JSON.parse(cleaned) as { x: string; linkedin: string; instagram: string };
}
```

- [ ] **Step 3 : Run test → pass**

- [ ] **Step 4 : Commit**

```bash
git add src/lib/social-writer.ts tests/social-writer.test.ts
git commit -m "feat(social): writer 3 plateformes ton Leo + test mock"
```

---

### Task 30 : Lib `supabase/social-posts.ts`

**Files:**
- Create: `~/Projets/jerwis-admin/src/lib/supabase/social-posts.ts`

- [ ] **Step 1 : Module CRUD**

```ts
import { createClient } from './client';

export type Platform = 'x' | 'linkedin' | 'instagram';
export type SocialStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export type SocialPost = {
  id: string;
  newsletter_id: string;
  item_id: string | null;
  platform: Platform;
  content: string;
  status: SocialStatus;
  scheduled_at: string | null;
  zernio_post_id: string | null;
  created_at: string;
};

export async function createSocialPost(input: {
  newsletter_id: string;
  item_id: string | null;
  platform: Platform;
  content: string;
}): Promise<SocialPost> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('social_posts')
    .insert({ ...input, status: 'draft' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as SocialPost;
}

export async function listForNewsletter(newsletterId: string): Promise<SocialPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .eq('newsletter_id', newsletterId)
    .order('platform')
    .order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []) as SocialPost[];
}

export async function updatePost(id: string, patch: Partial<SocialPost>): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('social_posts').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/supabase/social-posts.ts
git commit -m "feat(social): CRUD lib social_posts"
```

---

### Task 31 : Lib `zernio.ts` adaptée

**Files:**
- Modify: `~/Projets/jerwis-admin/src/lib/zernio.ts`

- [ ] **Step 1 : Vérifier l'API**

Lire l'existant `src/lib/zernio.ts` (179L hérité). Vérifier qu'il expose une fonction `schedulePost({ platform, content, scheduledAt })` ou équivalente. Si oui, adapter juste les noms de plateforme acceptés (`x` | `linkedin` | `instagram`) et virer toute réf Eurofiscalis.

- [ ] **Step 2 : Si refonte nécessaire**, signature minimale :

```ts
export async function scheduleZernio(input: {
  platform: 'x' | 'linkedin' | 'instagram';
  content: string;
  scheduledAt: Date;
}): Promise<{ zernioPostId: string }> {
  const res = await fetch('https://api.zernio.io/v1/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      brandId: process.env.ZERNIO_BRAND_ID,
      platform: input.platform,
      content: input.content,
      scheduledAt: input.scheduledAt.toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Zernio HTTP ${res.status}`);
  const json = (await res.json()) as { id: string };
  return { zernioPostId: json.id };
}
```

(Endpoints exacts à vérifier dans la doc Zernio ou le code existant.)

- [ ] **Step 3 : Commit**

```bash
git add src/lib/zernio.ts
git commit -m "fix(zernio): API jerwis (x/linkedin/insta) · suppression réf Eurofiscalis"
```

---

### Task 32 : Page `/social` + actions

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/social/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/social/social-editor.tsx`
- Create: `~/Projets/jerwis-admin/src/app/social/actions.ts`

- [ ] **Step 1 : `actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { getNewsletter } from '@/lib/supabase/newsletters';
import { writeSocialForItem } from '@/lib/social-writer';
import { createSocialPost, listForNewsletter, updatePost } from '@/lib/supabase/social-posts';
import { scheduleZernio } from '@/lib/zernio';
import { createClient } from '@/lib/supabase/client';

const SCHEDULES = {
  x: { day: 0, hour: 18 },          // dimanche 18h
  linkedin: { day: 1, hour: 8 },    // lundi 8h (puis +1j chaque sujet jusqu'à vendredi)
  instagram: { day: 2, hour: 19 },  // mardi 19h (puis +1j)
};

export async function generatePosts(newsletterId: string) {
  const n = await getNewsletter(newsletterId);
  if (!n || !n.curated_item_ids) throw new Error('Newsletter introuvable ou sans items');

  const supabase = createClient();
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .in('id', n.curated_item_ids);

  if (!items || items.length === 0) throw new Error('Aucun item curé');

  for (const item of items) {
    const variants = await writeSocialForItem({ item });
    await Promise.all([
      createSocialPost({ newsletter_id: newsletterId, item_id: item.id, platform: 'x', content: variants.x }),
      createSocialPost({ newsletter_id: newsletterId, item_id: item.id, platform: 'linkedin', content: variants.linkedin }),
      createSocialPost({ newsletter_id: newsletterId, item_id: item.id, platform: 'instagram', content: variants.instagram }),
    ]);
  }
  revalidatePath('/social');
}

export async function scheduleAllToZernio(newsletterId: string) {
  const posts = await listForNewsletter(newsletterId);
  const drafts = posts.filter((p) => p.status === 'draft');
  if (drafts.length === 0) return;

  const baseDate = nextMonday();
  const counters = { x: 0, linkedin: 0, instagram: 0 };

  for (const post of drafts) {
    const cfg = SCHEDULES[post.platform];
    const offset = counters[post.platform]++;
    const at = new Date(baseDate);
    at.setDate(at.getDate() + cfg.day + offset);
    at.setHours(cfg.hour, 0, 0, 0);

    try {
      const r = await scheduleZernio({ platform: post.platform, content: post.content, scheduledAt: at });
      await updatePost(post.id, {
        status: 'scheduled',
        scheduled_at: at.toISOString(),
        zernio_post_id: r.zernioPostId,
      });
    } catch (e) {
      await updatePost(post.id, { status: 'failed' });
      console.error('zernio schedule error', post.id, e);
    }
  }
  revalidatePath('/social');
}

export async function updatePostContent(id: string, content: string) {
  await updatePost(id, { content });
  revalidatePath('/social');
}

function nextMonday(): Date {
  const d = new Date();
  const day = d.getDay();
  const offset = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}
```

- [ ] **Step 2 : `page.tsx`**

```tsx
import { listNewsletters } from '@/lib/supabase/newsletters';
import { listForNewsletter } from '@/lib/supabase/social-posts';
import { SocialEditor } from './social-editor';
import { generatePosts, scheduleAllToZernio } from './actions';

export const dynamic = 'force-dynamic';

export default async function SocialPage({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string }>;
}) {
  const newsletters = await listNewsletters();
  const sp = await searchParams;
  const selectedId =
    sp.newsletter ?? newsletters.find((n) => n.status === 'sent')?.id ?? newsletters[0]?.id;
  const posts = selectedId ? await listForNewsletter(selectedId) : [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Posts sociaux</h1>
      <p className="text-white/60 mb-8">
        15 posts par newsletter (5 sujets × 3 réseaux). Génère puis programme via Zernio.
      </p>
      <select
        defaultValue={selectedId}
        onChange={(e) => (window.location.href = `/social?newsletter=${e.target.value}`)}
        className="px-3 py-2 bg-white/5 border border-white/10 rounded mb-6"
      >
        {newsletters.map((n) => (
          <option key={n.id} value={n.id}>
            #{n.edition_number} · {n.subject ?? '(sans sujet)'}
          </option>
        ))}
      </select>
      {selectedId && (
        <SocialEditor newsletterId={selectedId} posts={posts} />
      )}
    </div>
  );
}
```

(Le `<select onChange>` nécessite que la page soit client ou wrap dans un client component — variant simple à adapter en `<form>` avec server action navigate.)

- [ ] **Step 3 : `social-editor.tsx`**

```tsx
'use client';

import { generatePosts, scheduleAllToZernio, updatePostContent } from './actions';
import type { SocialPost } from '@/lib/supabase/social-posts';

export function SocialEditor({
  newsletterId,
  posts,
}: {
  newsletterId: string;
  posts: SocialPost[];
}) {
  const grouped = posts.reduce<Record<string, SocialPost[]>>((acc, p) => {
    (acc[p.platform] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <form action={generatePosts.bind(null, newsletterId)}>
          <button className="px-4 py-2 bg-emerald-500 text-black font-bold rounded">
            Générer les 15 posts (Sonnet · ~90s)
          </button>
        </form>
        <form action={scheduleAllToZernio.bind(null, newsletterId)}>
          <button
            disabled={posts.length === 0}
            className="px-4 py-2 border border-white/20 rounded disabled:opacity-40"
          >
            Programmer tout dans Zernio
          </button>
        </form>
      </div>
      {(['x', 'linkedin', 'instagram'] as const).map((platform) => (
        <section key={platform}>
          <h2 className="text-xl font-semibold mb-3 capitalize">
            {platform} ({grouped[platform]?.length ?? 0})
          </h2>
          <ul className="space-y-2">
            {(grouped[platform] ?? []).map((p) => (
              <li key={p.id} className="p-3 rounded border border-white/10">
                <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                  <span>{p.status}</span>
                  {p.scheduled_at && <span>· {new Date(p.scheduled_at).toLocaleString('fr-FR')}</span>}
                </div>
                <textarea
                  defaultValue={p.content}
                  onBlur={(e) => updatePostContent(p.id, e.target.value)}
                  rows={platform === 'x' ? 3 : 6}
                  className="w-full px-2 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

- [ ] **Step 4 : Test E2E manuel**

1. Page `/social` avec une newsletter envoyée → cliquer "Générer 15 posts" → attendre Sonnet.
2. Vérifier 5 posts × 3 plateformes en draft.
3. Édition inline d'un post.
4. Cliquer "Programmer tout dans Zernio" → vérifier API Zernio + statut `scheduled` en DB.

- [ ] **Step 5 : Commit**

```bash
git add src/app/social/
git commit -m "feat(social): page /social · génération 15 posts + programmation Zernio 1 clic"
```

---

## Phase 10 — Réglages (Task 33)

### Task 33 : Page `/settings`

**Files:**
- Create: `~/Projets/jerwis-admin/src/app/settings/page.tsx`
- Create: `~/Projets/jerwis-admin/src/app/settings/actions.ts`

- [ ] **Step 1 : `actions.ts`**

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/client';

export async function updateSetting(key: string, formData: FormData) {
  const value = String(formData.get('value') ?? '');
  const supabase = createClient();
  await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  revalidatePath('/settings');
}
```

- [ ] **Step 2 : `page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/client';
import { updateSetting } from './actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('settings').select('*');
  const settings = Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Réglages</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Variables d'environnement (lecture seule)</h2>
        <p className="text-sm text-white/60 mb-3">
          Modifiable uniquement dans le dashboard Vercel : Project → Settings → Environment Variables.
        </p>
        <ul className="space-y-1 text-sm font-mono">
          <li>SUPABASE_URL : {process.env.SUPABASE_URL ? '✓ défini' : '⚠ manquant'}</li>
          <li>ANTHROPIC_API_KEY : {process.env.ANTHROPIC_API_KEY ? '✓ défini' : '⚠ manquant'}</li>
          <li>RESEND_API_KEY : {process.env.RESEND_API_KEY ? '✓ défini' : '⚠ manquant'}</li>
          <li>RESEND_AUDIENCE_ID : {process.env.RESEND_AUDIENCE_ID ?? '⚠ manquant'}</li>
          <li>ZERNIO_API_KEY : {process.env.ZERNIO_API_KEY ? '✓ défini' : '⚠ manquant'}</li>
          <li>ZERNIO_BRAND_ID : {process.env.ZERNIO_BRAND_ID ?? '⚠ manquant'}</li>
          <li>ADMIN_PASSWORD : {process.env.ADMIN_PASSWORD ? '✓ défini' : '⚠ manquant'}</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Settings DB</h2>
        <SettingForm
          k="zernio_schedule"
          label="Planning Zernio (JSON)"
          current={JSON.stringify(settings['zernio_schedule'] ?? {}, null, 2)}
        />
      </section>
    </div>
  );
}

function SettingForm({ k, label, current }: { k: string; label: string; current: string }) {
  return (
    <form action={updateSetting.bind(null, k)} className="mb-4">
      <label className="block text-sm text-white/60 mb-1">{label}</label>
      <textarea
        name="value"
        defaultValue={current}
        rows={4}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded font-mono text-sm"
      />
      <button className="mt-2 px-3 py-1 bg-emerald-500 text-black rounded">Enregistrer</button>
    </form>
  );
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/app/settings/
git commit -m "feat(settings): vérif env vars + édition settings DB"
```

---

## Phase 11 — Déploiement (Tasks 34-35)

### Task 34 : Lier Vercel + DNS + 1ère prod

**Files:**
- Modify: `~/Projets/jerwis-admin/vercel.json`

- [ ] **Step 1 : Push GitHub si pas déjà fait**

```bash
cd ~/Projets/jerwis-admin
git push origin main
```

- [ ] **Step 2 : Importer dans Vercel**

Via dashboard Vercel : New Project → Import `sagnierjeremy-byte/jerwis-admin` → Configure :
- Framework : Next.js (auto-détecté)
- Build : `next build` (auto)
- Output : `.next` (auto)
- Env vars : copier-coller toutes les valeurs de `.env.local`

- [ ] **Step 3 : Premier deploy + vérif crons**

Vercel build → vérifier que `/api/cron/veille` et `/api/cron/send-scheduled` apparaissent dans Project → Cron Jobs.

- [ ] **Step 4 : Lier le sous-domaine `admin.jerwis.fr`**

Vercel : Project → Domains → Add `admin.jerwis.fr`.

DNS Hostinger : ajouter CNAME `admin` → `cname.vercel-dns.com`.

Attendre la propagation, vérifier `https://admin.jerwis.fr/login` répond.

- [ ] **Step 5 : Test du flow complet en prod**

1. Login avec `ADMIN_PASSWORD`
2. Aller sur `/sources` → vérifier 50 sources visibles (via seed)
3. Déclencher manuellement le cron veille : `curl -H "Authorization: Bearer $CRON_SECRET" https://admin.jerwis.fr/api/cron/veille`
4. Aller sur `/inspiration` → cocher 5 items
5. `/generate` → générer un draft
6. Lire le HTML généré sur `/newsletters` → ne PAS envoyer encore (test)

- [ ] **Step 6 : Commit `vercel.json` final**

```bash
git add vercel.json
git commit -m "chore(vercel): config crons finale · admin.jerwis.fr live"
git push
```

---

### Task 35 : Première édition réelle (smoke test prod)

- [ ] **Step 1 : Choisir une heure d'envoi de test**

Programmer un draft à T+10 min via `/newsletters` → "Programmer".

- [ ] **Step 2 : Vérifier l'envoi**

Attendre que le cron horaire se déclenche. Vérifier reception dans Resend dashboard + dans la boîte de Jérémy.

- [ ] **Step 3 : Tester déclinaison sociale**

`/social` → cliquer "Générer 15 posts" → vérifier les 15. Cliquer "Programmer tout dans Zernio" → vérifier dans Zernio dashboard que les 15 posts apparaissent.

- [ ] **Step 4 : Si tout marche, première édition publique**

Programmer la prochaine édition pour vendredi 9h. Documenter date et numéro édition dans CHANGELOG du site jerwis.fr (voir Task 37).

---

## Phase 12 — Cleanup site jerwis.fr (Tasks 36-37)

### Task 36 : Supprimer l'admin actuel + scripts brainstorm

**Files (dans `~/Projets/jeremy-sagnier-site/`):**
- Delete: `admin/`
- Delete: `scripts/admin-server.js`
- Delete: `scripts/brainstorm.js`
- Delete: `scripts/editorial-clusters.js`
- Delete: `scripts/youtube-channels.js`
- Delete: `data/youtube-cache.json`
- Delete: `BACKLOG.md`
- Delete: `social-drafts/` (si présent)
- Modify: `package.json` (retirer scripts `admin`, `brainstorm` si présents)

- [ ] **Step 1 : Vérifier qu'aucune autre partie du site ne référence ces fichiers**

```bash
cd ~/Projets/jeremy-sagnier-site
grep -r "admin-server\|brainstorm\|editorial-clusters\|BACKLOG" --include="*.js" --include="*.json" --include="*.md" .
```

Investiguer chaque match. Soit retirer la référence, soit garder le fichier.

- [ ] **Step 2 : Supprimer**

```bash
cd ~/Projets/jeremy-sagnier-site
rm -rf admin/ social-drafts/
rm -f scripts/admin-server.js scripts/brainstorm.js scripts/editorial-clusters.js scripts/youtube-channels.js
rm -f data/youtube-cache.json BACKLOG.md
```

- [ ] **Step 3 : Nettoyer `package.json`**

Retirer les scripts `"admin"`, `"brainstorm"`, etc. Retirer les deps qui ne servaient qu'à ces scripts (potentiellement `rss-parser` ou autres).

```bash
npm prune
```

- [ ] **Step 4 : Vérifier que le site build**

```bash
# Site est statique pur, donc juste vérifier que les pages ne référencent pas l'admin
grep -r "/admin" --include="*.html" .
```

Aucune référence attendue côté frontend.

- [ ] **Step 5 : Commit**

```bash
cd ~/Projets/jeremy-sagnier-site
git add -A
git commit -m "chore: suppression admin local + scripts brainstorm (remplacé par jerwis-admin)"
```

---

### Task 37 : Mise à jour CHANGELOG + PROJECT_NOTES + CLAUDE.md du site

**Files:**
- Modify: `~/Projets/jeremy-sagnier-site/CHANGELOG.md`
- Modify: `~/Projets/jeremy-sagnier-site/CLAUDE.md`

- [ ] **Step 1 : Ajouter une entrée CHANGELOG**

En haut de `CHANGELOG.md` :

```markdown
## 2026-05-XX · Refonte admin → jerwis-admin

**Pourquoi** : l'admin local sur `~/Projets/jeremy-sagnier-site/admin/` ne servait plus. Le sourcing automatique remontait des sujets non pertinents. Décision de tout supprimer et de partir sur un admin dédié, forké de newsletter-dashboard, déployé sur sous-domaine.

**Livré** :
- Nouveau repo `~/Projets/jerwis-admin/` (Next.js 16 + Supabase + Resend) déployé sur `admin.jerwis.fr`
- Pipeline complet : sources → veille (cron 6h) → curation → newsletter "Vendredi 9h" → 15 posts sociaux via Zernio
- Suppression `admin/`, `scripts/admin-server.js`, `scripts/brainstorm.js`, `scripts/editorial-clusters.js`, `scripts/youtube-channels.js`, `BACKLOG.md`, `data/youtube-cache.json`
- Audience Resend AI Playbook réutilisée (zéro perte d'inscrits)

**Fichiers touchés** : suppression admin + scripts. Pas de modif côté pages publiques.

**À venir** : V2 = analytics fines, A/B tests sujets, learnings auto, templates multiples. Plan dans `docs/superpowers/specs/2026-05-05-jerwis-admin-design.md`.
```

- [ ] **Step 2 : Mettre à jour CLAUDE.md du site**

Dans la section "Back-office local" : remplacer le contenu actuel par :

```markdown
## Back-office

L'admin local a été remplacé par **jerwis-admin** (`~/Projets/jerwis-admin/`), déployé sur `https://admin.jerwis.fr` (mot de passe Vercel env). Stack : Next.js 16 + Supabase + Resend + Zernio. Voir `docs/superpowers/specs/2026-05-05-jerwis-admin-design.md` pour le design complet.

L'inscription côté site public reste via `/api/subscribe.js` (Resend, audience AI Playbook). L'admin pilote l'envoi de la newsletter "Vendredi 9h" et les 15 posts sociaux par édition.
```

- [ ] **Step 3 : Commit**

```bash
cd ~/Projets/jeremy-sagnier-site
git add CHANGELOG.md CLAUDE.md
git commit -m "docs: refonte admin documentée · jerwis-admin remplace admin local"
```

---

## Self-Review Checklist (à exécuter une fois le plan rédigé)

**Spec coverage** — j'ai mappé chaque section du spec à au moins une task :
- §1 Contexte → Tasks 36-37 (suppression)
- §2 Objectifs → toutes phases
- §3 Non-objectifs → Task 8 (suppression sections exclues)
- §4 Architecture → Tasks 1-3 (bootstrap)
- §5 Pipeline → Phases 4-7-9 (veille → newsletter → social)
- §6 Sources → Phase 3 (Tasks 11-13)
- §7 Newsletter format → Task 22 (writer)
- §8 Réseaux sociaux → Phase 9 (Tasks 29-32)
- §9 Auth → Phase 1 (Tasks 5-7)
- §10 Scope MVP 8 pages → toutes pages couvertes
- §11 Schéma DB → Task 2
- §12 Plan migration → Task 1 (clone) + Task 34 (Vercel/DNS) + Task 36 (suppression)
- §13 Open questions → reportées (3 restantes)
- §14 Risks → mitigations dans tasks (timeout fetch · retry Zernio · scoring batch limit)
- §15 Definition of done → Task 35 (smoke test prod) + Task 37 (CHANGELOG)

**Placeholder scan** — pas de TBD/TODO. 1 mention "à vérifier dans la doc Zernio" sur Task 31 — acceptable car le code source `~/Projets/newsletter-dashboard/src/lib/zernio.ts` (179L) existe déjà et sert de base.

**Type consistency** :
- `SourceKind`, `Source` définis Task 11, utilisés Tasks 12-13-17
- `Item`, `ItemStatus` définis Task 16, utilisés Tasks 18-19-20-29
- `Newsletter`, `NewsletterStatus` définis Task 23, utilisés Tasks 24-26-27
- `SocialPost`, `Platform`, `SocialStatus` définis Task 30, utilisés Tasks 31-32

**Cohérence supplémentaire** : `createClient()` est importé partout depuis `@/lib/supabase/client` (hérité de newsletter-dashboard sans refacto).

**Volume estimé** : ~37 commits, ~2-3 semaines effort solo, ~3500 lignes de code à écrire (dont ~1500 hérité avec adaptations légères).

---

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-05-05-jerwis-admin-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** - Dispatch fresh subagent per task, review between tasks, fast iteration. Bien adapté ici car tâches majoritairement indépendantes par fichier.

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints. Pratique pour debug en live mais charge le contexte.

**Which approach?**
