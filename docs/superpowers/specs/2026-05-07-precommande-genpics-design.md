# Page e-commerce · précommande workflow-genpics-team

> Spec validée le 2026-05-07. Vente du code source du générateur de photos personal branding via Stripe Checkout, livraison auto par email (URL signée du ZIP + invitation GitHub).

## 1. Contexte

L'article `/articles/photos-perso-ia.html` (publié 2026-05-07) propose en CTA une précommande à 99€ avec un `mailto:` provisoire. On remplace ce CTA par une vraie page de vente qui ouvre un Stripe Checkout, encaisse le paiement, et déclenche une livraison automatique du produit (repo GitHub privé `workflow-genpics-team` + ZIP).

Le projet vendu est `~/Projets/workflow-genpics-team` — un outil Next.js de génération de photos de personal branding via fal.ai (Seedream 4.5, FLUX 2 Pro, Nano Banana Pro, GPT Image 2). Stack technique détaillée dans le STORYTELLING.md du projet.

## 2. Décisions déjà prises (verrouillées)

| Décision | Choix |
|---|---|
| Stack vente | Stripe Checkout hosted + 2 fonctions Vercel + Resend |
| Mode livraison | GitHub invite + ZIP URL envoyés ensemble par email après paiement |
| Prix | **99 € TTC fixe** monde entier, TVA absorbée par Eurofiscalis (pas de Stripe Tax) |
| Hébergement page | Sur jerwis.fr · `precommande-photos-personal-branding.html` à la racine du repo (édité directement en HTML, **pas** via le pipeline `npm run publish` qui est dédié aux articles) |
| GitHub username | Custom field Stripe Checkout **optionnel** ; fallback si non fourni via route `/api/github-invite-late` |
| Repo source | `github.com/sagnierjeremy-byte/workflow-genpics-team` (privé, GitHub Pro requis) |
| ZIP storage | Vercel Blob, URL signée TTL **30 jours** |
| Garantie remboursement | Manuelle via Stripe Dashboard, pas de bouton self-service |

## 3. Architecture

### 3.1 Flow paiement (happy path)

```
[Page de vente jerwis.fr]
   ↓ click "Précommande 99€"
[POST /api/checkout-create]
   ↓ crée Stripe.checkout.Session
[Stripe Checkout (hosted)]
   ↓ paiement réussi
[Stripe Webhook → POST /api/stripe-webhook]
   ├ vérifie signature
   ├ idempotency check (Vercel Blob: deliveries/{session.id}.json existe ?)
   ├ [GitHub API] PUT /repos/{owner}/{repo}/collaborators/{username} (si username fourni)
   ├ [Vercel Blob] génère URL signée du ZIP (TTL 30j)
   ├ [Resend] envoie email de livraison
   └ écrit deliveries/{session.id}.json (audit + idempotency)
   ↓
[Acheteur] reçoit email avec 2 CTAs : Télécharger ZIP / Accepter invite GitHub
```

### 3.2 Composants

**Pages statiques** (HTML écrites **directement à la racine du repo**, pas via le pipeline `npm run publish` qui sert aux articles) :

- `precommande-photos-personal-branding.html` — landing e-commerce, style aligné sur `claude-code.html` ou `outils.html` (pages root du site)
- `precommande-merci.html` — page de remerciement post-redirect Stripe success
- Ajout au `sitemap.xml` manuellement, ces 2 URLs sont indexables (la merci page peut avoir `noindex` car contenu transactionnel)

**3 fonctions Vercel** (`api/`) :

- `checkout-create.js` — POST sans body, crée Stripe Session avec line item fixe 99€ + custom field GitHub username optionnel, retourne `{ url }` pour redirection
- `stripe-webhook.js` — POST signé Stripe, traite `checkout.session.completed`, exécute livraison
- `github-invite-late.js` — GET (page mini-form HTML) ou POST (action), permet à un acheteur n'ayant pas fourni son username au checkout de le faire après coup ; vérifie via `session.id` que le paiement est bien `paid` avant d'inviter

**Données externes** :

- **Vercel Blob** :
  - `releases/workflow-genpics-team-v1.0.zip` (uploadé manuellement, mis à jour à chaque release)
  - `deliveries/{session.id}.json` — audit log + idempotency, format `{ sessionId, email, githubUsername, ts, githubInviteOk, emailSentOk, errors }`
- **GitHub** : `sagnierjeremy-byte/workflow-genpics-team` (repo privé, à créer)
- **Resend** : envoi via API existante, sender `jerwis@jerwis.fr`, reply-to `jeremy.sagnier@jerwis.fr`

## 4. Page de vente — wireframe & sections

URL : `https://jerwis.fr/precommande-photos-personal-branding.html`

Sections (ordre top → bottom) :

1. **Hero** · accroche + photo héro NB + bouton CTA principal "Précommande 99€"
2. **Ce que tu reçois** · 5 bullets : code source Next.js + ZIP + STORYTELLING + CLAUDE.md + repo GitHub privé
3. **Pourquoi c'est en précommande** · 1 paragraphe sur la raison (l'outil marche mais pas encore packagé pour install autonome) · prix 99€ aujourd'hui vs 149€ à la sortie
4. **Stack technique** · pour rassurer les devs : Next.js 16, fal.ai, Gemini, déploiement Vercel
5. **Garantie remboursement** · 1 phrase claire : "Si ça ne marche pas chez toi en 1h, je rembourse intégralement"
6. **Ce que tu apportes (clés API)** · transparence sur les coûts variables : fal.ai ~20€/100 photos, OpenRouter ~1€/50 sessions
7. **FAQ** · 5-6 questions clés (TVA, livraison, support, modifications, garantie, refund)
8. **CTA final** · bouton "Précommander 99€" qui appelle `POST /api/checkout-create` puis redirect vers `data.url`

Style : aligné avec le reste de jerwis.fr (CSS `assets/main.css`), sections colorées via commentaires `<!-- section k-fuchsia -->` etc., usage des callout `tip`/`ok`/`warn` existants.

Page de remerciement `precommande-merci.html` :
- Hero "Merci ! Ton paiement a bien été reçu"
- "Tu vas recevoir un email dans les 2 prochaines minutes avec ton accès"
- "Tu n'as rien reçu après 5 min ? Vérifie tes spams. Sinon écris-moi à jeremy.sagnier@jerwis.fr"

## 5. Détail des routes API

### 5.1 `POST /api/checkout-create`

**Input** : aucun (single product fixe).

**Action** :
```js
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      unit_amount: 9900,
      product_data: {
        name: 'workflow-genpics-team — code source',
        description: 'Générateur de photos personal branding · code source complet, repo GitHub privé + ZIP'
      }
    },
    quantity: 1
  }],
  custom_fields: [{
    key: 'github_username',
    label: { type: 'custom', custom: 'GitHub username (optionnel — pour invitation au repo privé)' },
    optional: true,
    type: 'text'
  }],
  success_url: 'https://jerwis.fr/precommande-merci.html?session={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://jerwis.fr/precommande-photos-personal-branding.html',
  metadata: { product: 'workflow-genpics-team-v1' }
});
return Response.json({ url: session.url });
```

**Sécurité** : aucun input utilisateur côté serveur (prix codé en dur). Pas de rate limit nécessaire (Stripe gère).

### 5.2 `POST /api/stripe-webhook`

**Input** : body raw Stripe + header `Stripe-Signature`.

**Action** :
1. `stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)` → throw si signature invalide → 400
2. Filtre `event.type === 'checkout.session.completed'`, sinon 200 silent (autres events ignorés)
3. Idempotency : `head` sur `deliveries/{session.id}.json` via Vercel Blob → si existe, 200 silent
4. Extract :
   - `email = session.customer_details.email`
   - `githubUsername = session.custom_fields.find(f => f.key === 'github_username')?.text?.value` (peut être null)
5. Génération URL signée du ZIP via `vercelBlob.head('releases/workflow-genpics-team-v1.0.zip', { token })` puis URL signée TTL 30j
6. Si `githubUsername` non null : `PUT https://api.github.com/repos/sagnierjeremy-byte/workflow-genpics-team/collaborators/{username}` avec body `{ permission: 'pull' }` et header `Authorization: Bearer GITHUB_TOKEN`
7. Resend `emails.send` avec template HTML (voir §6)
8. Écrit `deliveries/{session.id}.json` via `vercelBlob.put()` avec `{ sessionId, email, githubUsername, ts, githubInviteOk, emailSentOk, errors }`
9. Si erreur GitHub ou Resend : envoie un email d'alerte à `ALERT_EMAIL` avec session.id + détail erreur (toujours via Resend)
10. Retourne 200

**Robustesse** : `Promise.allSettled` sur les 3 ops (GitHub, Resend, Blob write) pour ne pas bloquer en cas d'échec partiel. Acheteur reçoit toujours au moins l'email avec le ZIP, même si GitHub échoue.

**Important — body raw obligatoire** : Vercel Functions parse par défaut le JSON body. Pour vérifier la signature Stripe, on doit récupérer le body brut. Implémentation : `export const config = { api: { bodyParser: false } }` puis lecture manuelle du stream via `req.text()` (Vercel Edge runtime ou Node.js avec helper). À tester avec Stripe CLI en local avant prod.

**Domaine Resend** : `jerwis.fr` doit avoir DKIM/SPF/DMARC vérifiés dans Resend Dashboard. Probablement déjà fait vu que `/api/subscribe.js` utilise déjà ce sender, mais à confirmer avant le premier achat live.

### 5.3 `GET/POST /api/github-invite-late?session=cs_xxx`

**GET** : retourne une page HTML mini avec un input `<input name="github_username">` + bouton submit. Affiche d'abord en server-side la session : email + statut paiement (depuis `stripe.checkout.sessions.retrieve(session)`). Si `payment_status !== 'paid'` → 403 page "session non payée".

**POST** : 
1. `stripe.checkout.sessions.retrieve(session)` → vérifie `payment_status === 'paid'`
2. Lit `deliveries/{session.id}.json` → si déjà invité, message "déjà fait", sinon :
3. Invite via API GitHub
4. Met à jour `deliveries/{session.id}.json` avec `githubUsername` + `githubInviteOk`
5. Retourne page de confirmation

**Sécurité** : token CSRF non nécessaire car la `session.id` Stripe est secrète et signée. Mais on doit vérifier que `payment_status === 'paid'` ET que l'invite n'a pas déjà été faite.

## 6. Email de livraison (Resend)

**Subject** : `Ton accès au générateur de photos personal branding`

**From** : `jerwis@jerwis.fr` (ou `Jeremy Sagnier <jerwis@jerwis.fr>`)
**Reply-To** : `jeremy.sagnier@jerwis.fr`

**Body HTML** (responsive, palette jerwis.fr) :

- Header : "Merci pour ta précommande" (Stripe Checkout par défaut ne demande pas le prénom, donc pas de personnalisation au-delà de l'email — on peut l'ajouter plus tard via custom field si on veut)
- Récap : commande #cs_xxx · 99€ TTC · daté
- Section "Ton accès" :
  - Bloc 1 : **Télécharger le code source (ZIP)** — gros bouton vers URL signée Blob, mention "valide 30 jours"
  - Bloc 2 (conditionnel) :
    - Si `githubUsername` fourni : "Tu as été invité au repo privé `workflow-genpics-team`. Accepte l'invitation ici : [lien GitHub]"
    - Si `githubUsername` non fourni : "Tu n'as pas donné ton username GitHub au checkout. Donne-le ici pour rejoindre le repo privé : [lien `/api/github-invite-late?session=cs_xxx`]"
- Section "Pour démarrer en 15 minutes" : 3 bullets (clone, install, ajouter clés .env)
- Section "Tu apportes" : rappel des 2 clés API à fournir (fal.ai + OpenRouter) avec liens
- Section "Garantie" : rappel 1 phrase + email de support
- Footer : signature Jérémy

## 7. Variables d'environnement

À ajouter dans Vercel Dashboard (project `jeremy-sagnier-site`) :

| Variable | Valeur |
|---|---|
| `STRIPE_SECRET_KEY` | clé Stripe live `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | secret signing endpoint webhook (généré dans Stripe Dashboard → Developers → Webhooks) |
| `GITHUB_TOKEN` | Personal Access Token avec scope `repo` |
| `GITHUB_REPO_OWNER` | `sagnierjeremy-byte` |
| `GITHUB_REPO_NAME` | `workflow-genpics-team` |
| `BLOB_READ_WRITE_TOKEN` | généré dans Vercel Dashboard → Storage → Blob |
| `RESEND_API_KEY` | déjà existant |
| `RESEND_FROM` | `jerwis@jerwis.fr` (déjà existant) |
| `RESEND_REPLYTO` | `jeremy.sagnier@jerwis.fr` |
| `ALERT_EMAIL` | `jeremy.sagnier@jerwis.fr` |

`.env.local` mis à jour avec les mêmes variables pour test local via `vercel env pull`.

## 8. Sécurité

| Vecteur | Protection |
|---|---|
| Webhook spoofing | `Stripe.webhooks.constructEvent()` avec `STRIPE_WEBHOOK_SECRET` obligatoire, throw → 400 |
| Double livraison sur retry | Idempotency par `session.id` (lookup Vercel Blob `deliveries/{id}.json`) |
| Bypass paiement | Tout pricing serveur-side dans `checkout-create.js`, jamais frontend |
| ZIP partage public | URL signée Vercel Blob, scope read uniquement, TTL 30j |
| GitHub token leak | Stocké en env var Vercel, scope minimal `repo` |
| Late-invite fraud (utiliser une session.id volée) | Vérifie `stripe.checkout.sessions.retrieve(session)` server-side : `payment_status === 'paid'` + check `deliveries/{id}.json` |
| Webhook timeout | < 60s (cap Vercel Hobby), `Promise.allSettled` sur les 3 ops |

## 9. Failure modes & recovery

| Échec | Comportement | Recovery |
|---|---|---|
| GitHub invite échoue (username invalide) | Email d'alerte à `ALERT_EMAIL`, `githubInviteOk: false` dans deliveries.json | Tu invites manuellement via GitHub UI |
| Resend email échoue | Email d'alerte impossible (Resend down) → console.error + Vercel logs | Tu retrouves la session via Stripe Dashboard, regénères ZIP URL via script CLI, envoies via Gmail |
| Webhook timeout | Stripe retry automatique (jusqu'à 5 fois sur 3 jours) | Idempotency garantit pas de double livraison |
| ZIP URL expirée après 30j | Acheteur te ping | Tu regénères depuis Vercel Blob (1 commande CLI) |
| Acheteur n'a pas mis username au checkout | Email contient ZIP + CTA `/api/github-invite-late?session=X` | Acheteur clique, donne username, invite auto |
| Stripe Dashboard remboursement | Tu rembourses → tu retires le collaborator manuellement via API GitHub ou UI | Manuel pour démarrage, automatisable plus tard si volume |

## 10. Tests bout-en-bout (avant prod)

1. **Mode test Stripe** : `STRIPE_SECRET_KEY=sk_test_...`, `STRIPE_WEBHOOK_SECRET=whsec_test_...`, page de vente affichée
2. **Stripe CLI** : `stripe listen --forward-to localhost:3000/api/stripe-webhook` pour tester le webhook en local
3. **Achat test #1** : avec username GitHub → vérif invite reçue + email reçu avec 2 CTAs valides
4. **Achat test #2** : sans username GitHub → vérif email reçu avec ZIP + CTA late-invite, suivi du flow late-invite
5. **Idempotency test** : `stripe events resend` sur une session déjà livrée → vérif aucune double livraison
6. **Failure test** : invalider GITHUB_TOKEN → vérif email d'alerte reçu, ZIP toujours livré
7. **Switch en mode live** une fois les 4 tests OK : `sk_live_...`, créer le webhook prod dans Stripe Dashboard avec l'URL `https://jerwis.fr/api/stripe-webhook`, regénérer `STRIPE_WEBHOOK_SECRET`

## 11. Effort estimé

| Phase | Temps | Livrables |
|---|---|---|
| Setup infra (Stripe test mode, Vercel Blob token, GitHub PAT, repo privé créé, ZIP v1.0 uploadé) | ~30 min | Tout l'env prêt |
| Page de vente HTML (root, écrite à la main en réutilisant le CSS existant) | ~2 h | `precommande-photos-personal-branding.html` + `precommande-merci.html` à la racine |
| Route `checkout-create.js` | ~30 min | Vercel function testable |
| Route `stripe-webhook.js` | ~2 h | Function complète avec idempotency + multi-ops |
| Route `github-invite-late.js` | ~1 h | Page form + handler |
| Email Resend HTML template | ~1 h | Template responsive testé |
| Tests E2E avec Stripe CLI | ~1 h | Les 6 scénarios validés |
| Switch live + premier achat réel | ~30 min | Webhook prod configuré, achat test |
| **Total** | **~8 h** | Prêt à recevoir des précommandes |

## 12. Hors scope (V1)

Volontairement laissé pour plus tard :

- **Stripe Tax / OSS multi-pays** — démarrage en 99€ TTC fixe, on bascule si volume monte
- **Bouton "demander un remboursement" self-service** — workflow manuel suffit pour démarrer
- **Gestion multi-licences (équipe / agence)** — un seul tier 99€ pour démarrer
- **Compte client / dashboard "mes achats"** — l'email de livraison contient tout
- **Integration analytics conversion** (Plausible event sur achat) — à brancher après quelques ventes
- **Affiliations / codes promo** — pas pertinent en précommande early
- **Mise à jour automatique des acheteurs quand v2 sort** — manuel via repo GitHub (ils sont déjà dedans)

## 13. Mise à jour de l'article existant

Une fois la page de vente en ligne, mettre à jour `articles/photos-perso-ia.html` :
- Remplacer le `mailto:jeremy.sagnier@jerwis.fr?...` actuel par un lien vers `/precommande-photos-personal-branding.html`
- Garder le mailto en fallback (texte type "ou écris-moi à...")

## 14. Documents liés

- Article public : `articles/photos-perso-ia.html`
- Draft markdown : `drafts/photos-perso-ia.md`
- Produit vendu : `~/Projets/workflow-genpics-team/`
- Récit technique du produit (à inclure dans la livraison) : `~/Projets/workflow-genpics-team/STORYTELLING.md`
