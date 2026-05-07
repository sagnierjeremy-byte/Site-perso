# booking-kit · spec design

> Fork white-label de `eurofiscalis-booking` (alternative Calendly + Letsignit) à revendre à 199 € TTC sur jerwis.fr.

## Contexte

Eurofiscalis utilise en interne `eurofiscalis-booking` pour ~20 conseillers depuis avril 2026 (cf. `articles/booking-eurofiscalis-making-of.html`). L'outil remplace Calendly (booking) + Letsignit (signatures email), économisant ~345€/mois.

On crée un fork blank `booking-kit` revendable à d'autres entreprises (cabinets compta, conseil, freelances avec équipe). Cible client : PME 5-30 personnes qui veulent une solution self-hosted, white-label, payée une fois (vs SaaS récurrents).

## Décisions verrouillées (validation user)

| Décision | Choix |
|---|---|
| Nom du repo / produit | **`booking-kit`** |
| Refactor `booking-page.tsx` (3.2K lignes) | **Split en sous-composants** pour la V1 |
| MSAL Outlook | **Garder en option** · Google Calendar par défaut, MSAL alternative configurable |
| Périmètre livraison | **Full 6 phases** (pas de MVP réduit) |
| Prix | **199 € TTC** sur jerwis.fr (réutilisation infra Stripe genpics) |
| Canal de vente | jerwis.fr uniquement V1 |

## Architecture cible

### Repo

`github.com/sagnierjeremy-byte/booking-kit` (privé · créé `2026-05-07`).

### Stack (héritée de eurofiscalis-booking, intacte)

- Next.js 16.2.3 + React 19 + TypeScript 5
- Supabase (PostgreSQL + auth SSR + RLS) + storage avatars
- Resend (emails transactionnels)
- Google Calendar API + `@azure/msal-node` (les deux supportés)
- Sentry (errors + tracing 10% prod)
- date-fns + date-fns-tz, Zod 4, Vitest 4 (tests préservés)

### Configuration centrale

Tout le branding extrait dans **`branding.config.ts`** typé strict. Le fichier exporte un objet `BrandingConfig` avec 6 sections :
- `company` (name, tagline, address, website, trustpilotUrl)
- `domains` (bookingApp, emailFrom, internalEmailDomain)
- `colors` (primary, accent, darkBg, lightBg)
- `assets` (logoMain, logoIcon, logoLight, heroBackground, favicon)
- `signature` (legalDisclaimer, ctaLabel, includeTrustpilot)
- `seo` (defaultTitle, defaultDescription, ogImage, locale)

Les couleurs alimentent des CSS custom properties (`--brand-primary`, `--brand-accent`) via `app/globals.css`.

### Calendrier · pattern adapter

Interface unifiée `CalendarAdapter` dans `lib/calendar/types.ts` :

```ts
export interface CalendarAdapter {
  getEvents(userId: string, from: Date, to: Date): Promise<CalendarEvent[]>;
  createEvent(userId: string, event: NewCalendarEvent): Promise<string>; // returns external id
  deleteEvent(userId: string, eventId: string): Promise<void>;
  refreshTokens(userId: string): Promise<void>;
  getAuthUrl(state: string): string;
  handleCallback(code: string, state: string): Promise<{ userId: string }>;
}
```

Implémentations :
- `lib/calendar/google-adapter.ts` (default, basé sur `googleapis`)
- `lib/calendar/outlook-adapter.ts` (existant, basé sur `@azure/msal-node`)

Sélection au runtime via env var `CALENDAR_PROVIDER=google|outlook|none`.

Tables Supabase :
- `outlook_tokens` → renommée **`calendar_tokens`** (générique) avec colonne `provider` ('google'|'outlook')
- Migration nécessaire pour les acheteurs qui partent de zéro (aucune donnée existante).

### Refactor `booking-page.tsx`

Split de 3 200 lignes en :
- `components/booking/page.tsx` (orchestrator, ~300 lignes)
- `components/booking/calendar-grid.tsx` (~600 lignes, sélection créneau)
- `components/booking/availability-loader.tsx` (~400 lignes, fetch + cache dispos)
- `components/booking/form.tsx` (~500 lignes, form prospect + validation)
- `components/booking/confirm.tsx` (~300 lignes, écran confirmation)
- `components/booking/duo-merger.tsx` (~400 lignes, intersection 2 users si `?avec=`)
- `hooks/use-booking-state.ts` (state machine, extrait du composant)

Tests Vitest existants à adapter (14 tests dispo + double-booking). Pas de régression tolérée.

## Phases d'implémentation

| # | Phase | Effort | Livrable |
|---|---|---|---|
| 1 | Setup repo + skeleton config | 0,5 j | ✅ Fait `2026-05-07` (commit init) — repo `booking-kit` privé · `branding.config.ts` skeleton · README + .env.example |
| 2 | Refactor branding → config-driven (avec split `booking-page.tsx`) | 3 j | Tout `Eurofiscalis` extrait · CSS custom props · email templates paramétriques · login validation domaine configurable |
| 3 | Calendar adapter pattern (Google + Outlook coexistent) | 3 j | `CalendarAdapter` interface + 2 implémentations · table `calendar_tokens` migrée · UI step-onboarding adaptative · routes `/api/calendar/*` génériques |
| 4 | Documentation | 1 j | `SETUP.md` · `CUSTOMIZE.md` · `STORYTELLING.md` · `CLAUDE.md` · screenshots/vidéos courtes |
| 5 | Page de vente jerwis.fr | 0,5 j | `precommande-booking-kit.html` (style aligné sur la page genpics) · refacto `api/checkout-create.js` pour 2e produit (`?product=genpics|booking`) · lien depuis footer |
| 6 | Tests E2E + livraison | 1 j | Test instance demo (Supabase test + Google Cloud test) · ZIP v1.0 · upload Vercel Blob `releases/booking-kit-v1.0.zip` · webhook Stripe configuré |

**Total restant : ~8,5 jours.**

## Variables d'environnement (livrées dans `.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL

RESEND_API_KEY

CALENDAR_PROVIDER=google|outlook|none

# Google (si CALENDAR_PROVIDER=google)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI

# Outlook (si CALENDAR_PROVIDER=outlook)
OUTLOOK_CLIENT_ID
OUTLOOK_CLIENT_SECRET
AZURE_TENANT_ID

TOKEN_ENCRYPTION_KEY  # AES-256-GCM des tokens calendrier (32 bytes hex)

NEXT_PUBLIC_SENTRY_DSN  # optionnel
CRON_SECRET             # rappels + sync
```

## Sécurité

| Vecteur | Protection |
|---|---|
| Multi-tenancy | 1 instance = 1 entreprise · isolation 100% via Supabase distinct |
| Tokens calendrier | AES-256-GCM avec `TOKEN_ENCRYPTION_KEY` server-side uniquement |
| Anti-double-booking | Tests existants préservés (14 Vitest) · race conditions covered |
| RLS Supabase | Activée sur toutes tables · whitelist user_id ou role='admin' |
| Crons authentifiés | `CRON_SECRET` Bearer token sur toutes routes `/api/cron/*` |
| Validation login | Domaine email configurable via `branding.domains.internalEmailDomain` (défaut "*" = tout) |
| Sentry filtering | maskAllText, blockAllMedia (privacy by default) |

## Hors scope V1

- Multi-tenancy intra-instance (plusieurs entreprises sur 1 déploiement) — chaque acheteur déploie sa propre instance
- Builder UI WYSIWYG pour signatures email — copy-paste HTML reste manuel
- Extension navigateur pour auto-injection signature
- Apple Calendar / iCloud Calendar adapter — uniquement Google + Outlook V1
- Intégration Teams Meeting (Outlook conserve, Google passe Google Meet automatique)
- API publique pour intégrations tierces — V2

## Documents liés

- Source code : `~/Projets/eurofiscalis-booking/`
- Fork target : `~/Projets/booking-kit/` · `github.com/sagnierjeremy-byte/booking-kit`
- Plan d'implémentation : `docs/superpowers/plans/2026-05-07-booking-kit-plan.md`
- Page de vente cible : `precommande-booking-kit.html` (à créer Phase 5)
