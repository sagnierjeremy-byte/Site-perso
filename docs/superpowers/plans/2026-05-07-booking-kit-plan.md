# booking-kit · plan d'implémentation

> Plan d'exécution V1 (6 phases). Source : `specs/2026-05-07-booking-kit-design.md`.
> Phase 1 ✅ commitée `2026-05-07` (commit `991fb8f`). Plan détaillé Phase 2 ci-dessous, phases 3-6 en haut niveau.

---

## Phase 2 — Refactor branding + split `booking-page.tsx` (3 j)

### Constat post-Phase 1

Le fork a **déjà splitté** `booking-page.tsx` lors de l'init (cf. `components/booking/*.tsx`). Le spec demande des noms différents pour les composants déjà extraits + 2 composants supplémentaires qui n'existent pas. Phase 2 = renommage des fichiers existants + 2 extractions + extraction branding.

### État actuel à transformer

**Fichiers existants :**
| Fichier | Lignes | Action Phase 2 |
|---|---|---|
| `components/booking-page.tsx` | 779 | Renommer → `components/booking/page.tsx` |
| `components/booking/calendar.tsx` | 152 | Renommer → `calendar-grid.tsx` |
| `components/booking/booking-form.tsx` | 349 | Renommer → `form.tsx` |
| `components/booking/confirmation.tsx` | 346 | Renommer → `confirm.tsx` |
| `hooks/use-booking.ts` | 287 | Renommer → `use-booking-state.ts` |
| `components/booking/{stepper,skeleton-loader,theme,time-slots,trust-badges,review-carousel}.tsx` | total ~580 | Inchangés (noms cohérents avec le spec) |

**Fichiers à créer :**
| Nouveau | Source | Lignes attendues |
|---|---|---|
| `components/booking/availability-loader.tsx` | Extraction des 3 `useEffect` fetch (dispos, slots, visibility) du hook | ~120-150 |
| `components/booking/duo-merger.tsx` | Extraction des blocs UI conditionnels `avecMember` (header double avatar, intro double nom, prop `avecSlug`) | ~150-200 |

**NB** : les estimations du spec (600L, 400L, 500L) sont surévaluées car héritées de l'ancien fichier 3.2K lignes. Lignes réelles seront ~50% du spec.

### Branding à extraire (96 occurrences `Eurofiscalis` dans 38 fichiers)

**Champs `branding.config.ts` à compléter** (skeleton actuel manque 4 sections) :

```ts
company: {
  // existant
  + phones: string[];        // ex: ["+33412391004", "+33489410257"] · contact fallback si calendrier non connecté
  + ownerName: string;       // ex: "Jérémy SAGNIER" · nom affiché dans le contact fallback
}
booking: {                   // NOUVEAU bloc
  customChips: { label: string; icon?: "globe" | "users" | "check" }[];
  // Ex: [{ label: "8 pays en Europe", icon: "globe" }] · chips info à côté de "Gratuit" + "30 min"
  subjectOptions: { value: string; label: string }[];
  // Ex: [{ value: "tva_ecommerce", label: "TVA e-commerce / Marketplace" }, ...]
  roleLabels: Record<string, string>;
  // Ex: { commercial: "Commercial", chef_de_mission: "Chef de mission", ... }
  ics: { prodId: string; summaryPrefix: string; }; // ex prodId: "-//MonEntreprise//RDV//FR"
}
```

**Fichiers à patcher (cibles concrètes) :**

| Fichier | Hardcodés à remplacer |
|---|---|
| `components/booking-page.tsx` (=`page.tsx` après rename) | `/logo-eurofiscalis.png` (×2), `Eurofiscalis` alt + " - Eurofiscalis" poste, `8 pays en Europe` chip, téléphones `+33412391004` & `+33489410257`, `Jérémy SAGNIER`, `eurofiscalis-booking-confirmed` postMessage type |
| `components/booking/theme.tsx` | `LIGHT/DARK` couleurs (couleurs → `branding.colors`), `SUJETS` → `branding.booking.subjectOptions`, `ROLE_LABELS` → `branding.booking.roleLabels`, `ICS uid @eurofiscalis.fr`, `PRODID Eurofiscalis`, `rdv-eurofiscalis.ics` filename, `RDV Eurofiscalis -` summary |
| `app/login/page.tsx` | `@eurofiscalis.com` validation domaine ligne 65 → `branding.domains.internalEmailDomain` (avec gestion `*` = tout autorisé) |
| `lib/email-templates.ts` | 4 occurrences `Eurofiscalis` → `branding.company.name` + paramétrage From/Subject/footer |
| `lib/email-signature.ts` | 3 occurrences (logo Supabase URL, `eurofiscalis.com` lien, alt label) → `branding.assets.logoIcon` + `branding.company.website` |
| `lib/email-send.ts` | `from: "Eurofiscalis"` → `branding.company.name` + `branding.domains.emailFrom` |
| `lib/constants.ts` | 2 occurrences à vérifier |
| `app/layout.tsx` | metadata title/description (8 occurrences) → `branding.seo.*` |
| `app/opengraph-image.tsx` | 3 occurrences (texte SVG dynamique) → `branding.company.name` |
| `app/site.webmanifest` | name/short_name → générer dynamiquement OU bypass (file statique) |
| `app/{not-found,error,signatures,templates,equipe,mes-outils,ma-page-rdv,mon-compte/...}` | UI strings `Eurofiscalis` → `branding.company.name` (5-9 occurrences chacun) |
| `app/api/reservation/{creer,reporter}/route.ts` | textes emails dynamiques → `branding.company.name` |
| `components/sidebar.tsx` | titre admin sidebar → `branding.company.name` |
| `public/widget.js` | doc inline + branding → `branding.company.name` (3 occurrences) |
| `public/backgrounds/fond-eurofiscalis-sombre.svg` | Renommer → `hero-dark.svg` + update `branding.assets.heroBackground` |
| `next.config.ts` | header/redirect spécifique Eurofiscalis si présent (1 occurrence) |
| `supabase-schema.sql` | 1 occurrence (commentaire SQL) — laisser ou retirer |

**CSS custom properties** (`app/globals.css`) :
```css
:root {
  --brand-primary: <inject from branding.colors.primary>;
  --brand-accent: <inject from branding.colors.accent>;
  --brand-bg-dark: <inject from branding.colors.darkBg>;
  --brand-bg-light: <inject from branding.colors.lightBg>;
}
```
Injection via `app/layout.tsx` :
```tsx
<style>{`:root { --brand-primary: ${branding.colors.primary}; ... }`}</style>
```
`theme.tsx` reste avec ses constantes JS pour lisibilité (les CSS vars sont surtout pour les emails qui ne lisent pas le JS theme).

---

### Découpage en 5 étapes (1 commit / étape)

#### Étape A — Préflight (15 min, sans risque)
1. `cd ~/Projets/booking-kit && git status` → confirmer working tree clean
2. `git checkout -b phase-2/branding-refactor`
3. Baseline build : `npx next build` → noter zéro erreur
4. Baseline tests : `npx vitest run` → noter X tests pass
5. Étendre `branding.config.ts` avec les 4 nouveaux champs (`company.phones`, `company.ownerName`, `booking.*`)

**Commit** : `chore(branding): extend BrandingConfig with phones/booking/ics fields`

#### Étape B — Renames (mécanique, 30 min)
1. `git mv components/booking-page.tsx components/booking/page.tsx`
2. `git mv components/booking/calendar.tsx components/booking/calendar-grid.tsx`
3. `git mv components/booking/booking-form.tsx components/booking/form.tsx`
4. `git mv components/booking/confirmation.tsx components/booking/confirm.tsx`
5. `git mv hooks/use-booking.ts hooks/use-booking-state.ts`
6. Update tous les imports (sed/Edit) :
   - `import BookingPage from "@/components/booking-page"` → `from "@/components/booking/page"` (3 callsites: `app/[slug]/page.tsx`, `app/[slug]/embed/page.tsx`, `app/[slug]/[type]/page.tsx`)
   - `from "./booking/calendar"` → `from "./booking/calendar-grid"`, etc.
   - `Calendar` → `CalendarGrid`, `BookingForm` → `Form`, `Confirmation` → `Confirm` (renommage exports + usages)
   - `useBooking` → `useBookingState`
7. `npx next build` doit passer · `npx vitest run` doit passer

**Commit** : `refactor(booking): rename split components per booking-kit spec`

#### Étape C — Extractions `availability-loader` + `duo-merger` (2 h)

**`hooks/use-booking-state.ts` → simplifier** : extraire les 3 useEffect fetch dans le composant `availability-loader.tsx` qui wrappe le hook.

Pattern : `<AvailabilityLoader slug={slug} typeSlug={typeSlug} avecSlug={avecSlug} onLoad={...}>` qui prend en charge les fetch et expose `availableDates / slots / loading`.

**Alternative plus simple** : laisser la logique dans le hook, créer `availability-loader.tsx` comme wrapper React Suspense-style qui rend `<SkeletonLoader/>` ou children. À trancher en codant.

**`components/booking/duo-merger.tsx`** : composant client qui prend `member` + `avecMember` + theme `t` et rend le bloc header double avatar + titre `RDV avec X et Y`. Utilisé conditionnellement par `page.tsx`.

1. Créer les 2 fichiers
2. Refacto `page.tsx` pour utiliser ces composants → réduit `page.tsx` de 779 → ~600 lignes (le spec dit 300, c'est optimiste vu l'arborescence d'erreurs notFound/no-availability/no-outlook)
3. `next build` + `vitest run` OK

**Commit** : `refactor(booking): extract availability-loader and duo-merger components`

#### Étape D — Branding extraction (le gros morceau, 4-6 h)

Sous-étape par couche, commits intermédiaires possibles :

**D1 — Theme + assets** (1 h)
- `components/booking/theme.tsx` : LIGHT/DARK couleurs lues depuis `branding.colors`, `SUJETS`/`ROLE_LABELS` exportés depuis `branding.booking.*`, `generateICSDownload` paramétré
- Renommer `public/backgrounds/fond-eurofiscalis-sombre.svg` → `hero-dark.svg`
- `branding.config.ts` valeurs par défaut blank cohérentes

**D2 — UI pages** (1.5 h)
- `components/booking/page.tsx` (ex booking-page) : 5 hardcodés
- `app/login/page.tsx` : validation domaine via `branding.domains.internalEmailDomain` (gérer `*` = tout)
- `app/layout.tsx`, `app/opengraph-image.tsx`, `app/site.webmanifest`
- Toutes les autres pages (`mon-compte`, `equipe`, `ma-page-rdv`, etc.)

**D3 — Lib emails** (1 h)
- `lib/email-templates.ts`, `lib/email-signature.ts`, `lib/email-send.ts`
- `app/api/reservation/{creer,reporter}/route.ts` (si textes en dur)

**D4 — Divers** (30 min)
- `components/sidebar.tsx`
- `public/widget.js`
- `next.config.ts`
- `app/api/cron/*` si réf branding

**D5 — Validation grep** (15 min)
- `grep -ri "eurofiscalis" components/ lib/ hooks/ app/ public/widget.js` → 0 résultat hors commentaires acceptables (CHANGELOG, README, docs)
- `grep -ri "@eurofiscalis.com" .` → 0 résultat hors `.env.example`/branding default

**Commit** : `refactor(branding): extract all Eurofiscalis branding to branding.config.ts (96 occurrences)`

#### Étape E — Validation finale (30 min)
1. `npx next build` strict (zero warning sur paths)
2. `npx vitest run` 100% pass (les 14 tests réservation + 9 tests intersect duo doivent rester verts)
3. `npm run dev`, smoke test :
   - Ouvrir une page `/{slug}` quelconque (ou créer un slug factice via Supabase si nécessaire)
   - Vérifier que header utilise `branding.company.name` au lieu de "Eurofiscalis"
   - Modifier `branding.company.name` dans le fichier → reload → doit refléter le changement
4. Update `CHANGELOG.md` racine booking-kit avec section Phase 2
5. Update `.env.example` si nouvelle var (ex: rien d'autre prévu)
6. Push branche, merge dans `main` (PR ou merge direct selon préférence)

**Commit** : `chore(changelog): document Phase 2 — branding refactor + split components`

---

### Ce dont j'ai besoin de toi (décisions)

1. **Valeurs `branding.config.ts` par défaut** : on garde les placeholders blanks (`MonEntreprise`) ou on remet les vraies valeurs Eurofiscalis pour test local ? Recommandation : **placeholders** (c'est le but du fork) + un fichier `branding.eurofiscalis.example.ts` non commité pour mes tests.
2. **Extension du `BrandingConfig`** OK pour ajouter `company.phones`, `company.ownerName`, `booking.{customChips, subjectOptions, roleLabels, ics}` ? (Sinon je peux mettre tout dans `metadata: Record<string, any>` mais perte de typage).
3. **Suppression du contact fallback** (téléphones Jérémy + nom) si calendrier non connecté : on garde le pattern (configurable via `branding.company.phones`) ou on remplace par un message générique `branding.bookingFallbackText` ? Recommandation : **garder** + paramétrer.
4. **`SUJETS` (TVA e-commerce, Comptabilité, Import/Export…)** : extraire dans `branding.config.ts` (= configurable par acheteur) ou dans un nouveau `subjects.config.ts` séparé ? Recommandation : **dans `branding.booking.subjectOptions`** — c'est la vocation du config-driven.
5. **PR ou merge direct** sur `main` ? (Repo perso, pas d'équipe, OK à merger direct si tests verts.)

### Plan de secours

- Branche dédiée `phase-2/branding-refactor`
- Aucune migration DB Phase 2 → rollback = `git checkout main && git branch -D phase-2/branding-refactor`
- Si tests Vitest régressent à mi-parcours : on stoppe, on identifie le commit fautif via `git bisect`, on revert
- Backup auto via git, pas de backup additionnel nécessaire

### Vérification post-dev (à exécuter manuellement)

```bash
cd ~/Projets/booking-kit
npx next build                                           # zero erreur
npx vitest run                                           # 100% pass
grep -ri "eurofiscalis" components/ lib/ hooks/ app/     # 0 résultat
grep -ri "@eurofiscalis.com" .                           # uniquement dans docs/.env.example
npm run dev &                                            # démarrer dev
# ouvrir http://localhost:3000/login → vérifier UI utilise branding.company.name
# modifier branding.config.ts company.name = "Test Inc" → reload → doit refléter
```

---

## Phase 3 — Calendar adapter pattern (3 j) — haut niveau

- Créer `lib/calendar/types.ts` avec `CalendarAdapter` interface
- `lib/calendar/google-adapter.ts` (nouveau, basé sur `googleapis`)
- Refactor `lib/outlook.ts` → `lib/calendar/outlook-adapter.ts` implémentant l'interface
- Migration SQL : `outlook_tokens` → `calendar_tokens` (+ colonne `provider`)
- Routes `/api/outlook/*` → `/api/calendar/*` génériques
- Sélection runtime via `CALENDAR_PROVIDER` env var
- Onboarding step adaptatif selon provider configuré
- Tests pour les 2 adaptateurs

## Phase 4 — Documentation (1 j)
- `SETUP.md` : installation pas à pas
- `CUSTOMIZE.md` : guide branding + customisations avancées
- `STORYTELLING.md` : pitch, FAQs, cas clients
- Refondre `CLAUDE.md` du repo
- 3-5 screenshots/vidéos courtes

## Phase 5 — Page de vente jerwis.fr (0.5 j)
- `precommande-booking-kit.html` (style aligné `precommande-genpics.html`)
- Refacto `api/checkout-create.js` (jerwis-site) pour `?product=genpics|booking`
- Lien depuis footer jerwis.fr

## Phase 6 — Tests E2E + livraison (1 j)
- Instance demo (Supabase test + Google Cloud test project)
- Smoke test bout-en-bout : signup → onboarding → booking → email confirmation
- ZIP `booking-kit-v1.0.zip`
- Upload Vercel Blob `releases/booking-kit-v1.0.zip`
- Webhook Stripe configuré pour livrer le lien après paiement

---

**Total restant : ~8.5 jours.**
