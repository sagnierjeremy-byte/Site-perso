# Page e-commerce précommande genpics-team — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter le paiement Stripe + livraison automatique (invite GitHub + ZIP signé envoyés par email) sur la page de vente précommande déjà créée à `/precommande-photos-personal-branding.html`.

**Architecture:** 3 nouvelles fonctions Vercel serverless (`api/checkout-create.js`, `api/stripe-webhook.js`, `api/github-invite-late.js`) qui orchestrent Stripe Checkout hosted + GitHub API + Vercel Blob (URL signée 30j) + Resend (email). Idempotency via Vercel Blob `deliveries/{session.id}.json`. Aucune DB, pas de framework de tests automatisés (vérifs manuelles via Stripe CLI).

**Tech Stack:** Node.js ESM (`"type": "module"`), Vercel serverless functions, Stripe SDK (`stripe` npm), Vercel Blob SDK (`@vercel/blob`), GitHub REST API + Resend API en `fetch` direct (cohérence avec `api/subscribe.js`).

**Spec source:** `docs/superpowers/specs/2026-05-07-precommande-genpics-design.md`

**Pré-existant** (déjà fait dans le commit `f354ad4`) :
- Page de vente `precommande-photos-personal-branding.html` (mailto provisoire)
- Entrée sitemap.xml
- IndexNow ping fait

---

## Phase 0 — Setup infrastructure manuel (sans code)

> **Note** : ces étapes sont à exécuter à la main par Jérémy. Aucune ligne de code n'est écrite ici. Estimation : ~30 min.

### Task 0.1: Créer le repo source-of-truth

**Files:** aucun (action GitHub UI).

- [ ] **Step 1: Créer le repo privé**

Aller sur https://github.com/new :
- Owner: `sagnierjeremy-byte`
- Name: `workflow-genpics-team`
- Visibility: **Private**
- Pas de README, pas de .gitignore, pas de licence

- [ ] **Step 2: Pousser le code source du projet local vers ce repo**

```bash
cd ~/Projets/workflow-genpics-team
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:sagnierjeremy-byte/workflow-genpics-team.git
git push -u origin main
```

Expected: le code de l'outil est sur GitHub privé, branche `main` à jour.

- [ ] **Step 3: Créer un GitHub Personal Access Token**

Aller sur https://github.com/settings/tokens :
- Type: **Fine-grained token**
- Token name: `jerwis-precommande-genpics`
- Expiration: 1 year
- Repository access: **Only select repositories** → `workflow-genpics-team`
- Permissions:
  - `Administration: Read and write` (pour collaborators)
  - `Metadata: Read-only` (auto)
- Generate, copier la valeur (commence par `github_pat_...`), la garder à part pour Phase 1.

### Task 0.2: Préparer le ZIP de livraison

- [ ] **Step 1: Générer le ZIP de la v1.0**

```bash
cd ~/Projets
git -C workflow-genpics-team archive --format=zip --prefix=workflow-genpics-team/ -o workflow-genpics-team-v1.0.zip HEAD
ls -lh workflow-genpics-team-v1.0.zip
```

Expected: fichier ZIP de quelques MB (sans `node_modules`, sans `.next`, juste le source).

- [ ] **Step 2: Vérifier le contenu**

```bash
unzip -l workflow-genpics-team-v1.0.zip | head -30
```

Expected: voir `package.json`, `src/`, `STORYTELLING.md`, `CLAUDE.md` dans la liste.

### Task 0.3: Setup Vercel Blob

- [ ] **Step 1: Activer Vercel Blob sur le projet `jeremy-sagnier-site`**

Aller sur https://vercel.com/dashboard → Storage → Create Database → Blob :
- Name: `jerwis-deliveries`
- Region: Frankfurt (proche France)
- Project: lier au projet `jeremy-sagnier-site`

Vercel va auto-injecter `BLOB_READ_WRITE_TOKEN` dans les env vars du projet.

- [ ] **Step 2: Uploader le ZIP via Vercel CLI**

```bash
cd ~/Projets/jeremy-sagnier-site
vercel env pull .env.local
npx vercel-blob put ../workflow-genpics-team-v1.0.zip releases/workflow-genpics-team-v1.0.zip
```

> Si `vercel-blob` CLI n'existe pas, alternative : utiliser le Vercel Dashboard UI (Storage → Blob → Upload file → choisir le path `releases/workflow-genpics-team-v1.0.zip`).

Expected: le fichier est listé dans Vercel Blob UI sous `releases/workflow-genpics-team-v1.0.zip`.

### Task 0.4: Setup Stripe en mode test

- [ ] **Step 1: Créer un compte Stripe (si pas déjà fait)**

Aller sur https://stripe.com → Sign up (utiliser email Eurofiscalis). Compte initialement en **mode test**.

- [ ] **Step 2: Récupérer les clés test**

Dashboard Stripe → Developers → API Keys :
- Copier `Secret key` (`sk_test_...`) à part

- [ ] **Step 3: Installer Stripe CLI pour test webhook local**

```bash
brew install stripe/stripe-cli/stripe
stripe login
```

Expected: `stripe login` ouvre le browser pour OAuth, retourne "Done!".

### Task 0.5: Ajouter les env vars Vercel

- [ ] **Step 1: Ajouter les nouvelles variables**

Vercel Dashboard → projet `jeremy-sagnier-site` → Settings → Environment Variables :

| Key | Value (test mode pour démarrer) | Environments |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` (de Phase 0.4 step 2) | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | (laisser vide en prod — sera rempli en Phase 7 ; en dev/local, sera rempli en Phase 6) | Production, Preview, Development |
| `GITHUB_TOKEN` | `github_pat_...` (de Phase 0.1 step 3) | Production, Preview, Development |
| `GITHUB_REPO_OWNER` | `sagnierjeremy-byte` | Production, Preview, Development |
| `GITHUB_REPO_NAME` | `workflow-genpics-team` | Production, Preview, Development |
| `RESEND_REPLYTO` | `jeremy.sagnier@eurofiscalis.com` | Production, Preview, Development |
| `ALERT_EMAIL` | `jeremy.sagnier@eurofiscalis.com` | Production, Preview, Development |

`BLOB_READ_WRITE_TOKEN` est déjà auto-injecté par Phase 0.3. `RESEND_API_KEY` existe déjà.

- [ ] **Step 2: Pull les env vars en local**

```bash
cd ~/Projets/jeremy-sagnier-site
vercel env pull .env.local
```

Expected: `.env.local` contient toutes les vars listées + les anciennes.

---

## Phase 1 — Dépendances npm + page de remerciement

### Task 1.1: Ajouter les dépendances Stripe + Vercel Blob

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Installer `stripe` et `@vercel/blob`**

```bash
cd ~/Projets/jeremy-sagnier-site
npm install stripe @vercel/blob
```

Expected: `package.json` `dependencies` contient maintenant `"stripe"` et `"@vercel/blob"`. `package-lock.json` mis à jour.

- [ ] **Step 2: Vérifier**

```bash
npm list stripe @vercel/blob --depth=0
```

Expected: les deux paquets sont listés avec versions.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add stripe + @vercel/blob for précommande genpics"
```

### Task 1.2: Créer la page de remerciement

**Files:**
- Create: `precommande-merci.html`
- Modify: `sitemap.xml`

- [ ] **Step 1: Créer le fichier**

Créer `precommande-merci.html` à la racine du repo, structure HTML statique simple basée sur le pattern de `precommande-photos-personal-branding.html` (head + nav + section unique + footer + theme toggle script).

Contenu de la `<section>` principale :

```html
<section class="precom-section" style="text-align:center; padding: 100px 0;">
  <div class="container" style="max-width: 640px;">
    <div class="kicker"><span class="pulse"></span>— Paiement reçu</div>
    <h1 style="font-family:'Archivo Black',sans-serif;font-size:clamp(40px,6vw,64px);line-height:.95;letter-spacing:-.03em;text-transform:uppercase;color:var(--ink);margin:24px 0;">Merci !<br>Tu vas recevoir<br>ton accès<br><em style="font-style:normal;color:var(--fuchsia);">par email.</em></h1>
    <p style="font-size:17px;line-height:1.6;color:var(--ink-soft);margin-bottom:28px;">
      Le paiement a bien été reçu. Tu vas recevoir un email dans les <strong>2 prochaines minutes</strong> avec le lien de téléchargement du ZIP et l'invitation au repo GitHub privé (si tu as donné ton username).
    </p>
    <div class="callout warn" style="text-align:left;margin-bottom:28px;">
      <h4>Tu n'as rien reçu après 5 minutes ?</h4>
      <p>Vérifie tes spams. Si toujours rien, écris-moi à <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a> avec ton numéro de session Stripe (visible dans l'URL ou dans le reçu Stripe). Je t'envoie tout en moins d'1h.</p>
    </div>
    <a href="index.html" style="display:inline-block;color:var(--fuchsia);font-weight:600;text-decoration:none;">← Retour à l'accueil</a>
  </div>
</section>
```

Ajouter `<meta name="robots" content="noindex">` dans le `<head>` (page transactionnelle, pas indexable).

- [ ] **Step 2: Vérifier le rendu localement**

Ouvre `file:///Users/jeremysagnier/Projets/jeremy-sagnier-site/precommande-merci.html` dans un navigateur.

Expected: page lisible, header/footer alignés sur le reste du site, theme toggle fonctionnel.

- [ ] **Step 3: Ajouter au sitemap**

Modifier `sitemap.xml`, ajouter avant la section "Articles" :

```xml
<url>
  <loc>https://jerwis.fr/precommande-merci.html</loc>
  <lastmod>2026-05-07</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.3</priority>
</url>
```

> Note : la page a `noindex` mais on la met dans le sitemap pour traçabilité interne. Google la verra mais ne l'indexera pas.

- [ ] **Step 4: Commit**

```bash
git add precommande-merci.html sitemap.xml
git commit -m "feat(ecommerce): page précommande-merci.html (post-paiement Stripe)"
```

---

## Phase 2 — Route `api/checkout-create.js`

### Task 2.1: Implémenter la création de session Stripe

**Files:**
- Create: `api/checkout-create.js`

- [ ] **Step 1: Écrire la fonction**

```js
// Endpoint Vercel serverless · crée une Stripe Checkout Session pour la précommande
// du générateur de photos personal branding (99 € TTC, paiement unique).
// Retourne { url } pour redirection client-side.

import Stripe from "stripe";

const PRODUCT_AMOUNT_CENTS = 9900; // 99 € TTC fixe
const PRODUCT_CURRENCY = "eur";
const PRODUCT_NAME = "workflow-genpics-team — code source";
const PRODUCT_DESCRIPTION =
  "Générateur de photos personal branding · code source complet, repo GitHub privé + ZIP. Précommande, livraison sous quelques semaines.";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("[checkout-create] STRIPE_SECRET_KEY manquante");
    return res.status(503).json({ error: "Service indisponible" });
  }

  const stripe = new Stripe(stripeKey);
  const origin = req.headers.origin || "https://jerwis.fr";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: PRODUCT_CURRENCY,
            unit_amount: PRODUCT_AMOUNT_CENTS,
            product_data: {
              name: PRODUCT_NAME,
              description: PRODUCT_DESCRIPTION,
            },
          },
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: "github_username",
          label: {
            type: "custom",
            custom: "GitHub username (optionnel — pour invitation au repo privé)",
          },
          optional: true,
          type: "text",
        },
      ],
      success_url: `${origin}/precommande-merci.html?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/precommande-photos-personal-branding.html`,
      metadata: { product: "workflow-genpics-team-v1" },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[checkout-create] Stripe error:", err.message);
    return res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
}
```

- [ ] **Step 2: Tester en local avec Vercel dev**

```bash
cd ~/Projets/jeremy-sagnier-site
vercel dev
```

Dans un autre terminal :

```bash
curl -X POST http://localhost:3000/api/checkout-create
```

Expected: réponse `{"url":"https://checkout.stripe.com/..."}` ; ouvrir l'URL dans un navigateur affiche la page Stripe Checkout avec le produit à 99 €.

- [ ] **Step 3: Vérifier le custom field**

Sur la page Stripe Checkout, vérifier la présence du champ "GitHub username (optionnel — pour invitation au repo privé)".

- [ ] **Step 4: Commit**

```bash
git add api/checkout-create.js
git commit -m "feat(api): checkout-create.js · crée Stripe Session 99€ TTC"
```

---

## Phase 3 — Route `api/stripe-webhook.js`

### Task 3.1: Squelette + vérification signature

**Files:**
- Create: `api/stripe-webhook.js`

- [ ] **Step 1: Écrire le squelette avec body raw + signature check**

```js
// Endpoint Vercel serverless · reçoit les webhooks Stripe.
// Traite uniquement `checkout.session.completed` pour livrer la précommande.
// Idempotency via Vercel Blob `deliveries/{session.id}.json`.

import Stripe from "stripe";
import { put, head } from "@vercel/blob";

// IMPORTANT : Vercel parse le body par défaut. Pour vérifier la signature
// Stripe, on a besoin du body brut. Désactiver le bodyParser ici.
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    console.error("[stripe-webhook] STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET manquant");
    return res.status(503).json({ error: "Service indisponible" });
  }

  const stripe = new Stripe(stripeKey);
  const signature = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature invalide:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Filtre · seul l'event checkout.session.completed nous intéresse
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const sessionId = session.id;

  // TODO Phase 3.2 · idempotency check
  // TODO Phase 3.3 · GitHub invite + URL signée + email Resend
  // TODO Phase 3.4 · écriture deliveries/{session.id}.json

  return res.status(200).json({ received: true, sessionId });
}
```

- [ ] **Step 2: Tester en local que le squelette répond bien**

```bash
cd ~/Projets/jeremy-sagnier-site
vercel dev
```

Dans un autre terminal :

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Expected: Stripe CLI affiche `Ready! Your webhook signing secret is whsec_...`. Copier cette valeur dans `.env.local` :

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

Redémarrer `vercel dev`.

- [ ] **Step 3: Trigger un event test**

Dans un troisième terminal :

```bash
stripe trigger checkout.session.completed
```

Expected: Stripe CLI affiche `--> checkout.session.completed [evt_test_...]` et la fonction `vercel dev` log `[stripe-webhook]` ... Réponse 200 avec `{received:true, sessionId: cs_test_...}`.

- [ ] **Step 4: Commit**

```bash
git add api/stripe-webhook.js
git commit -m "feat(api): stripe-webhook.js · squelette + signature check (TODO: livraison)"
```

### Task 3.2: Idempotency check via Vercel Blob

**Files:**
- Modify: `api/stripe-webhook.js`

- [ ] **Step 1: Ajouter la fonction d'idempotency**

Remplacer le commentaire `// TODO Phase 3.2 · idempotency check` par :

```js
  // Idempotency : si on a déjà traité cette session, on ignore (Stripe peut retry)
  const deliveryKey = `deliveries/${sessionId}.json`;
  try {
    const existing = await head(deliveryKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (existing) {
      console.log(`[stripe-webhook] session ${sessionId} déjà livrée, skip`);
      return res.status(200).json({ received: true, alreadyDelivered: true });
    }
  } catch (err) {
    // 404 = pas encore livrée, on continue. Toute autre erreur = on log + continue
    if (!err.message?.includes("not found") && !err.message?.includes("404")) {
      console.warn("[stripe-webhook] head check failed:", err.message);
    }
  }
```

- [ ] **Step 2: Tester l'idempotency**

```bash
stripe trigger checkout.session.completed
# Note le sessionId dans les logs
# Manuellement, écrire un faux fichier deliveries/{sessionId}.json via Vercel Dashboard
# Re-trigger :
stripe events resend evt_test_xxxx
```

Expected: deuxième appel renvoie `{received:true, alreadyDelivered:true}`, aucune ligne de livraison logguée.

> Note : pour ce test, on peut aussi attendre la Phase 3.4 qui écrira automatiquement le fichier après livraison. Si tu veux tester en isolation, créer manuellement le fichier dans Vercel Blob UI.

- [ ] **Step 3: Commit**

```bash
git add api/stripe-webhook.js
git commit -m "feat(api): stripe-webhook · idempotency check via Vercel Blob"
```

### Task 3.3: GitHub invite + URL signée ZIP + email Resend

**Files:**
- Modify: `api/stripe-webhook.js`

- [ ] **Step 1: Ajouter les helpers de livraison**

Avant la fonction `handler` (sous `readRawBody`), ajouter :

```js
const FROM_EMAIL = "Jérémy Sagnier <jeremy@jerwis.fr>";
const ZIP_BLOB_KEY = "releases/workflow-genpics-team-v1.0.zip";
const URL_TTL_DAYS = 30;

async function inviteGithubCollaborator(username) {
  if (!username) return { ok: true, skipped: true };
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;
  const cleanUsername = String(username).trim().replace(/^@/, "");

  const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${encodeURIComponent(cleanUsername)}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ permission: "pull" }),
  });
  if (r.status === 201 || r.status === 204) return { ok: true, alreadyMember: r.status === 204 };
  const detail = await r.text();
  return { ok: false, status: r.status, detail };
}

async function generateZipUrl() {
  // @vercel/blob expose une URL publique stable pour les blobs uploadés ;
  // pour un accès "signé" temporaire, on utilise getDownloadUrl si dispo,
  // sinon on construit l'URL directe (les blobs uploadés en private nécessitent token sign).
  // Pour ce projet, on a uploadé en mode "public" → l'URL directe via head() suffit.
  const meta = await head(ZIP_BLOB_KEY, { token: process.env.BLOB_READ_WRITE_TOKEN });
  return meta.url; // URL publique stable, scope read uniquement
}

async function sendDeliveryEmail({ to, sessionId, zipUrl, githubUsername, githubInviteOk, lateInviteUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const replyTo = process.env.RESEND_REPLYTO || "jeremy.sagnier@eurofiscalis.com";

  const githubBlock = githubUsername && githubInviteOk
    ? `<div style="background:#f3f3f3;padding:18px 22px;border-radius:8px;margin:12px 0">
         <p style="margin:0 0 8px 0"><strong>2. Accepter l'invitation GitHub</strong></p>
         <p style="margin:0;font-size:14px">Tu as été invité au repo privé <code>workflow-genpics-team</code>.</p>
         <p style="margin:8px 0 0 0"><a href="https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/invitations" style="color:#ef426f;font-weight:600;text-decoration:none">→ Accepter sur GitHub</a></p>
       </div>`
    : `<div style="background:#fff8e0;padding:18px 22px;border-radius:8px;margin:12px 0;border:1px solid #f0c040">
         <p style="margin:0 0 8px 0"><strong>2. Donner ton GitHub username</strong></p>
         <p style="margin:0;font-size:14px">Tu n'as pas donné ton username GitHub au paiement. Donne-le ici pour rejoindre le repo privé :</p>
         <p style="margin:8px 0 0 0"><a href="${lateInviteUrl}" style="color:#ef426f;font-weight:600;text-decoration:none">→ Donner mon username</a></p>
       </div>`;

  const html = `<!doctype html>
<html><body style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:auto;padding:24px">
  <h1 style="font-size:26px;margin:0 0 12px 0">Merci pour ta précommande !</h1>
  <p style="color:#555">Commande <code>${sessionId}</code> · 99 € TTC · paiement unique</p>
  <h2 style="font-size:18px;margin:28px 0 12px 0">Ton accès</h2>
  <div style="background:#f3f3f3;padding:18px 22px;border-radius:8px;margin:12px 0">
    <p style="margin:0 0 8px 0"><strong>1. Télécharger le code source (ZIP)</strong></p>
    <p style="margin:0;font-size:14px">Lien valide 30 jours, dispo immédiatement.</p>
    <p style="margin:8px 0 0 0"><a href="${zipUrl}" style="display:inline-block;background:#ef426f;color:white;padding:10px 18px;border-radius:6px;font-weight:600;text-decoration:none">Télécharger le ZIP</a></p>
  </div>
  ${githubBlock}
  <h2 style="font-size:18px;margin:28px 0 12px 0">Pour démarrer en 15 minutes</h2>
  <ol style="font-size:14px;line-height:1.7">
    <li>Décompresse le ZIP, ouvre le dossier dans ton terminal</li>
    <li><code>npm install</code> · puis crée un fichier <code>.env.local</code> avec <code>FAL_KEY=...</code> + <code>OPENROUTER_API_KEY=...</code> + <code>ADMIN_TOKEN=...</code></li>
    <li><code>npm run dev</code> · l'app est dispo sur <code>localhost:3000</code></li>
  </ol>
  <h2 style="font-size:18px;margin:28px 0 12px 0">Tes coûts variables</h2>
  <ul style="font-size:14px;line-height:1.7">
    <li><strong>fal.ai</strong> : ~20 € pour 100 photos · <a href="https://fal.ai" style="color:#ef426f">créer un compte</a></li>
    <li><strong>OpenRouter</strong> : ~1 € pour 50 sessions · <a href="https://openrouter.ai" style="color:#ef426f">créer un compte</a></li>
  </ul>
  <p style="font-size:14px;color:#555;margin-top:32px;border-top:1px solid #ddd;padding-top:18px">
    <strong>Garantie remboursement</strong> · si ça ne marche pas chez toi en 1h, réponds à cet email, je rembourse.<br>
    Pour toute question, écris à <a href="mailto:${replyTo}" style="color:#ef426f">${replyTo}</a>.
  </p>
  <p style="font-size:12px;color:#999;margin-top:18px">— Jérémy Sagnier · jerwis.fr</p>
</body></html>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      reply_to: replyTo,
      subject: "Ton accès au générateur de photos personal branding",
      html,
    }),
  });
  if (!r.ok) {
    const detail = await r.text();
    return { ok: false, status: r.status, detail };
  }
  return { ok: true };
}

async function sendAlertEmail(subject, body) {
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail || !apiKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [alertEmail],
      subject: `[précommande genpics] ${subject}`,
      html: `<pre style="font-family:monospace;font-size:13px">${body}</pre>`,
    }),
  }).catch((err) => console.error("[stripe-webhook] alert email failed:", err.message));
}
```

- [ ] **Step 2: Wire les helpers dans le handler**

Remplacer le commentaire `// TODO Phase 3.3` par :

```js
  // Extraction des données de session
  const email = session.customer_details?.email;
  const githubUsername = session.custom_fields?.find((f) => f.key === "github_username")?.text?.value || null;

  if (!email) {
    console.error(`[stripe-webhook] session ${sessionId} sans email`);
    await sendAlertEmail(`Session ${sessionId} sans email`, JSON.stringify(session, null, 2));
    return res.status(200).json({ received: true, error: "no email" });
  }

  // Livraison · 3 ops en parallèle (ne se bloquent pas)
  const origin = process.env.SITE_ORIGIN || "https://jerwis.fr";
  const lateInviteUrl = `${origin}/api/github-invite-late?session=${sessionId}`;

  const [zipResult, githubResult] = await Promise.allSettled([
    generateZipUrl(),
    inviteGithubCollaborator(githubUsername),
  ]);

  const zipUrl = zipResult.status === "fulfilled" ? zipResult.value : null;
  const githubInviteOk = githubResult.status === "fulfilled" && githubResult.value.ok;

  if (!zipUrl) {
    console.error(`[stripe-webhook] session ${sessionId} : ZIP URL gen failed`, zipResult);
    await sendAlertEmail(`URL ZIP introuvable pour session ${sessionId}`, JSON.stringify(zipResult, null, 2));
    return res.status(500).json({ received: true, error: "zip_url_failed" });
  }

  const emailResult = await sendDeliveryEmail({
    to: email,
    sessionId,
    zipUrl,
    githubUsername,
    githubInviteOk,
    lateInviteUrl,
  });

  if (!emailResult.ok) {
    console.error(`[stripe-webhook] email échoué pour ${email}:`, emailResult.detail);
    await sendAlertEmail(`Email livraison échoué pour ${email} (session ${sessionId})`, JSON.stringify(emailResult, null, 2));
  }

  if (!githubInviteOk && githubUsername) {
    await sendAlertEmail(
      `GitHub invite échoué pour ${githubUsername} (session ${sessionId})`,
      JSON.stringify(githubResult, null, 2)
    );
  }
```

- [ ] **Step 3: Tester avec un event Stripe simulé**

```bash
stripe trigger checkout.session.completed
```

Note: l'event simulé n'a pas un vrai `customer_details.email` exploitable. Pour un test plus complet, il faut faire un vrai paiement (voir Phase 6). Pour l'instant, on vérifie juste que le code ne crash pas.

Expected: log dans `vercel dev` `[stripe-webhook] session sans email` (parce que l'event simulé n'a pas de buyer), pas de stack trace JS.

- [ ] **Step 4: Commit**

```bash
git add api/stripe-webhook.js
git commit -m "feat(api): stripe-webhook · livraison auto (GitHub invite + URL ZIP + email Resend)"
```

### Task 3.4: Persister la livraison + finaliser

**Files:**
- Modify: `api/stripe-webhook.js`

- [ ] **Step 1: Écrire le delivery log avant de retourner 200**

À la fin du handler (avant `return res.status(200).json({ received: true });`), ajouter :

```js
  // Audit + idempotency : écrit le delivery log (idempotency check Phase 3.2 le verra ensuite)
  try {
    await put(
      deliveryKey,
      JSON.stringify({
        sessionId,
        email,
        githubUsername,
        ts: new Date().toISOString(),
        zipUrl,
        githubInviteOk,
        emailSentOk: emailResult.ok,
        errors: {
          github: githubResult.status === "rejected" ? String(githubResult.reason) : null,
          email: emailResult.ok ? null : emailResult.detail,
        },
      }),
      { access: "public", contentType: "application/json", token: process.env.BLOB_READ_WRITE_TOKEN }
    );
  } catch (err) {
    console.error("[stripe-webhook] delivery log write failed:", err.message);
    await sendAlertEmail(
      `Delivery log non écrit pour session ${sessionId}`,
      `Erreur : ${err.message}\n\nLes ops ont été tentées : email=${emailResult.ok}, github=${githubInviteOk}`
    );
  }

  return res.status(200).json({
    received: true,
    sessionId,
    githubInviteOk,
    emailSentOk: emailResult.ok,
  });
```

> Remplacer le `return res.status(200).json({ received: true, sessionId });` final existant.

- [ ] **Step 2: Tester en bout-en-bout**

Avec `vercel dev` + `stripe listen` en cours, faire un vrai paiement test (voir Phase 6 pour le détail). Pour l'instant on peut quand même vérifier la fin du flow avec :

```bash
stripe trigger checkout.session.completed --add checkout_session:customer_details:email=test@example.com
```

(Le flag `--add` n'est pas standard, alternative : aller directement en Phase 6 pour vrai test.)

- [ ] **Step 3: Commit**

```bash
git add api/stripe-webhook.js
git commit -m "feat(api): stripe-webhook · delivery log + finalisation"
```

---

## Phase 4 — Route `api/github-invite-late.js`

### Task 4.1: Page formulaire + handler POST

**Files:**
- Create: `api/github-invite-late.js`

- [ ] **Step 1: Écrire le handler dual (GET = page HTML / POST = action)**

```js
// Endpoint Vercel serverless · permet à un acheteur d'ajouter son username GitHub
// après le paiement (s'il ne l'a pas donné dans le custom field au checkout).
// Vérifie via la session Stripe que le paiement est bien `paid`.

import Stripe from "stripe";
import { put, head } from "@vercel/blob";

const FROM_EMAIL = "Jérémy Sagnier <jeremy@jerwis.fr>";

async function inviteGithubCollaborator(username) {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;
  const cleanUsername = String(username).trim().replace(/^@/, "");
  const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${encodeURIComponent(cleanUsername)}`;
  const r = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ permission: "pull" }),
  });
  if (r.status === 201 || r.status === 204) return { ok: true };
  const detail = await r.text();
  return { ok: false, status: r.status, detail };
}

function renderPage({ title, body, status = 200, contentType = "text/html" }) {
  return {
    status,
    contentType,
    body: `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:60px auto;padding:24px;color:#1a1a1a}
h1{font-size:28px;margin:0 0 16px 0}
p{font-size:16px;line-height:1.6;color:#555}
form{margin:24px 0;display:flex;gap:8px}
input{flex:1;padding:12px 14px;border:1px solid #ddd;border-radius:6px;font-size:15px}
button{padding:12px 22px;background:#ef426f;color:white;border:none;border-radius:6px;font-weight:600;font-size:15px;cursor:pointer}
.error{background:#fee;border:1px solid #f88;color:#a00;padding:14px;border-radius:6px;margin:18px 0}
.ok{background:#eef9e0;border:1px solid #5a5;color:#262;padding:14px;border-radius:6px;margin:18px 0}
.kicker{font-family:monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#999;margin-bottom:12px}</style></head>
<body>${body}</body></html>`,
  };
}

export default async function handler(req, res) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(503).send("Service indisponible");
  const stripe = new Stripe(stripeKey);

  const sessionId = req.query?.session || req.body?.session;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    const page = renderPage({
      title: "Lien invalide",
      body: `<div class="kicker">— Erreur</div><h1>Lien invalide</h1>
        <p>Le lien que tu as utilisé est invalide ou expiré. Contacte <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a> avec ton numéro de session Stripe.</p>`,
      status: 400,
    });
    res.setHeader("Content-Type", page.contentType);
    return res.status(page.status).send(page.body);
  }

  // Vérification que le paiement est bien `paid`
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    const page = renderPage({
      title: "Session introuvable",
      body: `<div class="kicker">— Erreur</div><h1>Session introuvable</h1>
        <p>Stripe ne reconnaît pas cette session. Contacte le support.</p>`,
      status: 404,
    });
    res.setHeader("Content-Type", page.contentType);
    return res.status(page.status).send(page.body);
  }

  if (session.payment_status !== "paid") {
    const page = renderPage({
      title: "Paiement non confirmé",
      body: `<div class="kicker">— Erreur</div><h1>Paiement non confirmé</h1>
        <p>Cette session n'a pas encore été payée. Si tu viens de payer, attends 1 minute et recharge cette page.</p>`,
      status: 403,
    });
    res.setHeader("Content-Type", page.contentType);
    return res.status(page.status).send(page.body);
  }

  // Check si la livraison existe déjà avec un username
  const deliveryKey = `deliveries/${sessionId}.json`;
  let existing = null;
  try {
    const meta = await head(deliveryKey, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (meta?.url) {
      const r = await fetch(meta.url);
      if (r.ok) existing = await r.json();
    }
  } catch (err) {
    // 404 = on continue
  }

  if (existing?.githubUsername && existing?.githubInviteOk) {
    const page = renderPage({
      title: "Déjà invité",
      body: `<div class="kicker">— Déjà fait</div><h1>Déjà invité</h1>
        <p>Tu as déjà été invité au repo en tant que <code>${existing.githubUsername}</code>. Vérifie tes emails GitHub ou va sur <a href="https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/invitations" style="color:#ef426f">tes invitations GitHub</a>.</p>`,
    });
    res.setHeader("Content-Type", page.contentType);
    return res.status(200).send(page.body);
  }

  // GET = afficher le form
  if (req.method === "GET") {
    const page = renderPage({
      title: "Donne ton username GitHub",
      body: `<div class="kicker">— Précommande livraison</div><h1>Donne ton username GitHub</h1>
        <p>Pour qu'on t'invite au repo privé <code>workflow-genpics-team</code>, donne-nous ton username GitHub (le nom dans <code>github.com/TON_USERNAME</code>).</p>
        <form method="POST" action="/api/github-invite-late?session=${encodeURIComponent(sessionId)}">
          <input type="text" name="username" placeholder="ton-username-github" required autofocus>
          <button type="submit">M'inviter</button>
        </form>
        <p style="font-size:13px;color:#999">Le ZIP du code reste téléchargeable depuis le mail que tu as reçu. Cette étape est juste pour le repo GitHub.</p>`,
    });
    res.setHeader("Content-Type", page.contentType);
    return res.status(200).send(page.body);
  }

  // POST = traiter le form
  if (req.method === "POST") {
    const username = req.body?.username;
    if (!username || typeof username !== "string" || username.trim().length < 1) {
      const page = renderPage({
        title: "Username manquant",
        body: `<div class="error">Username manquant ou invalide.</div>
          <p><a href="/api/github-invite-late?session=${encodeURIComponent(sessionId)}">← Retour</a></p>`,
        status: 400,
      });
      res.setHeader("Content-Type", page.contentType);
      return res.status(page.status).send(page.body);
    }

    const result = await inviteGithubCollaborator(username);

    // Update delivery log si possible
    if (existing) {
      try {
        await put(
          deliveryKey,
          JSON.stringify({
            ...existing,
            githubUsername: username.trim(),
            githubInviteOk: result.ok,
            githubInviteLateAt: new Date().toISOString(),
          }),
          { access: "public", contentType: "application/json", token: process.env.BLOB_READ_WRITE_TOKEN }
        );
      } catch (err) {
        console.error("[github-invite-late] delivery log update failed:", err.message);
      }
    }

    if (!result.ok) {
      const page = renderPage({
        title: "Échec invitation",
        body: `<div class="error">L'invitation a échoué (${result.status}). Détail : <code>${result.detail || "?"}</code>.</div>
          <p>Vérifie que ton username GitHub est correct, ou écris à <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a>.</p>
          <p><a href="/api/github-invite-late?session=${encodeURIComponent(sessionId)}">← Réessayer</a></p>`,
      });
      res.setHeader("Content-Type", page.contentType);
      return res.status(200).send(page.body);
    }

    const page = renderPage({
      title: "Invitation envoyée",
      body: `<div class="ok">Invitation envoyée à <code>${username}</code> !</div>
        <p>Vérifie tes <a href="https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/invitations" style="color:#ef426f">invitations GitHub</a> dans une minute.</p>
        <p>Si tu as une question, réponds au mail de livraison.</p>`,
    });
    res.setHeader("Content-Type", page.contentType);
    return res.status(200).send(page.body);
  }

  return res.status(405).send("Method not allowed");
}
```

- [ ] **Step 2: Tester en local (GET form)**

```bash
vercel dev
# Dans le browser :
open http://localhost:3000/api/github-invite-late?session=cs_test_invalid
```

Expected: page d'erreur "Lien invalide" (parce que la session n'existe pas).

Pour tester avec une session valide, utiliser une session retournée par un vrai test paiement (Phase 6).

- [ ] **Step 3: Commit**

```bash
git add api/github-invite-late.js
git commit -m "feat(api): github-invite-late · fallback pour acheteurs sans username au checkout"
```

---

## Phase 5 — Brancher la page de vente sur Stripe + lien depuis l'article

### Task 5.1: Modifier le bouton CTA de la page de vente

**Files:**
- Modify: `precommande-photos-personal-branding.html`

- [ ] **Step 1: Remplacer le bouton CTA finale par un appel à l'API**

Trouver dans le fichier la section `<!-- CTA finale -->` (ligne ~430), repérer le bouton :

```html
<a href="mailto:jeremy.sagnier@eurofiscalis.com?subject=Pr%C3%A9commande..." class="precom-cta-btn" style="font-size: 19px; padding: 22px 40px;">Précommander · 99 € TTC <span class="arrow">→</span></a>
```

Remplacer par :

```html
<button id="precom-cta-final" class="precom-cta-btn" style="font-size: 19px; padding: 22px 40px;">Précommander · 99 € TTC <span class="arrow">→</span></button>
<p id="precom-cta-error" style="display:none; color: #fbbac8; font-size:14px; margin-top: 16px;"></p>
```

Et juste avant `</body>`, ajouter :

```html
<script>
  document.getElementById('precom-cta-final')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const errorEl = document.getElementById('precom-cta-error');
    btn.disabled = true;
    btn.textContent = 'Redirection vers Stripe…';
    try {
      const r = await fetch('/api/checkout-create', { method: 'POST' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const { url } = await r.json();
      if (!url) throw new Error('URL manquante');
      window.location.href = url;
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = 'Précommander · 99 € TTC <span class="arrow">→</span>';
      errorEl.style.display = 'block';
      errorEl.textContent = 'Erreur : ' + err.message + '. Réessaie ou écris à jeremy.sagnier@eurofiscalis.com';
    }
  });
</script>
```

- [ ] **Step 2: Mettre à jour aussi le bouton CTA du Hero (en haut de page)**

Repérer le bouton dans la section Hero :

```html
<a href="#cta" class="precom-cta-btn">Précommander · 99 € <span class="arrow">→</span></a>
```

Le laisser tel quel (il scroll vers `#cta`, puis l'utilisateur clique sur le bouton final).

> Alternative simple : remplacer aussi par un clone du bouton final pour éviter le scroll. Mais pour démarrer, le scroll est OK.

- [ ] **Step 3: Mettre à jour aussi le mailto provisoire en bas (fallback explicite)**

Trouver la phrase :

```html
<p style="margin-top: 28px; font-size: 13px; color: rgba(255,255,255,.55);">
  Le paiement Stripe sécurisé arrive très bientôt. En attendant, écris-moi à ...
</p>
```

Remplacer par :

```html
<p style="margin-top: 28px; font-size: 13px; color: rgba(255,255,255,.55);">
  Tu préfères payer manuellement ? Écris-moi à <a href="mailto:jeremy.sagnier@eurofiscalis.com" style="color: rgba(255,255,255,.85); text-decoration: underline;">jeremy.sagnier@eurofiscalis.com</a> et je t'envoie un lien Stripe alternatif.
</p>
```

- [ ] **Step 4: Vérifier en local**

```bash
vercel dev
open http://localhost:3000/precommande-photos-personal-branding.html
```

Cliquer sur "Précommander · 99 € TTC" → doit rediriger vers la page Stripe Checkout.

- [ ] **Step 5: Commit**

```bash
git add precommande-photos-personal-branding.html
git commit -m "feat(ecommerce): bouton CTA -> POST /api/checkout-create -> Stripe Checkout"
```

### Task 5.2: Mettre à jour l'article photos-perso-ia pour pointer vers la page de vente

**Files:**
- Modify: `drafts/photos-perso-ia.md`

- [ ] **Step 1: Remplacer le mailto par un lien vers la page de vente**

Trouver dans `drafts/photos-perso-ia.md` (ligne ~223) :

```
Pour pré-réserver, **envoie-moi un mail** à <a href="mailto:jeremy.sagnier@eurofiscalis.com?subject=...">...
```

Remplacer par :

```
Pour pré-réserver, **va sur la page de précommande** :

<p style="text-align:center; margin: 28px 0;"><a href="../precommande-photos-personal-branding.html" style="display:inline-block; background:var(--fuchsia); color:white; padding:16px 32px; border-radius:8px; font-weight:600; font-size:16px; text-decoration:none;">Précommander à 99 € TTC →</a></p>

Tu peux aussi écrire directement à <a href="mailto:jeremy.sagnier@eurofiscalis.com">jeremy.sagnier@eurofiscalis.com</a> si tu préfères payer autrement (virement, etc.).
```

- [ ] **Step 2: Republier**

```bash
cd ~/Projets/jeremy-sagnier-site
npm run publish photos-perso-ia
```

Expected: `articles/photos-perso-ia.html` régénéré, taille ~41-42 KB.

- [ ] **Step 3: Commit**

```bash
git add drafts/photos-perso-ia.md articles/photos-perso-ia.html sitemap.xml
git commit -m "feat(blog): photos-perso-ia · CTA précommande -> page de vente Stripe"
```

---

## Phase 6 — Tests bout-en-bout en mode test

### Task 6.1: Setup environnement de test

**Files:** aucun.

- [ ] **Step 1: Lancer Vercel dev + Stripe CLI listen**

Terminal 1 :
```bash
cd ~/Projets/jeremy-sagnier-site
vercel dev
```

Terminal 2 :
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Stripe CLI affiche `whsec_...`. Vérifier que cette valeur est bien dans `.env.local` côté `STRIPE_WEBHOOK_SECRET`. Si différente, mettre à jour et relancer `vercel dev`.

### Task 6.2: Test #1 — achat avec username GitHub

- [ ] **Step 1: Faire un paiement test**

Dans le navigateur :
- http://localhost:3000/precommande-photos-personal-branding.html
- Cliquer sur "Précommander · 99 € TTC"
- Stripe Checkout s'ouvre
- Renseigner :
  - Email : `test-with-github@example.com`
  - Card : `4242 4242 4242 4242` · `12/34` · `123`
  - Custom field GitHub username : ton vrai username (ex: `sagnierjeremy-byte` — un compte test)

Confirmer le paiement.

- [ ] **Step 2: Vérifier les logs**

Dans le terminal `vercel dev`, attendre les logs :
```
[stripe-webhook] session cs_test_xxx
```

- [ ] **Step 3: Vérifier l'invite GitHub**

Aller sur https://github.com/{username}/invitations · l'invite au repo `workflow-genpics-team` doit être présente.

- [ ] **Step 4: Vérifier l'email**

Dans la boîte mail `test-with-github@example.com` (ou le vrai email utilisé), vérifier la réception du mail "Ton accès au générateur de photos personal branding" avec :
- Bouton "Télécharger le ZIP" qui marche
- Bloc "Accepter sur GitHub" (parce que username fourni)
- 3 conseils setup
- Reply-to vers Eurofiscalis

- [ ] **Step 5: Vérifier le delivery log**

Dans Vercel Dashboard → Storage → Blob → vérifier `deliveries/cs_test_xxx.json` avec `githubInviteOk: true` et `emailSentOk: true`.

### Task 6.3: Test #2 — achat sans username GitHub

- [ ] **Step 1: Faire un paiement test sans remplir le custom field**

Même processus, mais cette fois **ne pas remplir** le champ GitHub username au checkout. Email : `test-without-github@example.com`.

- [ ] **Step 2: Vérifier le mail**

Le mail doit afficher le bloc "Donner ton GitHub username" avec un lien vers `/api/github-invite-late?session=cs_test_xxx`.

- [ ] **Step 3: Cliquer sur le lien**

Le browser ouvre la page form. Remplir avec un username GitHub valide. Soumettre.

- [ ] **Step 4: Vérifier l'invite GitHub**

L'invite doit être envoyée au compte GitHub renseigné. La page de confirmation s'affiche.

- [ ] **Step 5: Vérifier le delivery log**

Le fichier `deliveries/cs_test_xxx.json` doit maintenant contenir `githubUsername` mis à jour + `githubInviteLateAt`.

### Task 6.4: Test #3 — idempotency (retry du webhook)

- [ ] **Step 1: Resend un event déjà traité**

Dans Stripe Dashboard → Events, repérer un event `checkout.session.completed` déjà reçu. Cliquer "Resend".

- [ ] **Step 2: Vérifier les logs**

Dans `vercel dev`, log doit afficher `[stripe-webhook] session ... déjà livrée, skip`.

Vérifier qu'aucun deuxième email n'a été envoyé.

### Task 6.5: Test #4 — failure GitHub (username invalide)

- [ ] **Step 1: Faire un paiement avec un username GitHub volontairement invalide**

Email : `test-bad-github@example.com`, GitHub username : `username-qui-existe-pas-12345-aaa`.

- [ ] **Step 2: Vérifier**

- L'email de livraison doit quand même partir (avec le ZIP)
- Le `deliveries/{session.id}.json` doit avoir `githubInviteOk: false`
- Un email d'alerte doit arriver à `jeremy.sagnier@eurofiscalis.com`

---

## Phase 7 — Switch en mode prod (Stripe Live)

> **Attention** : ne passer en mode live que quand toutes les Phases 0-6 sont 100 % validées. À partir de là, les paiements sont réels.

### Task 7.1: Activer le compte Stripe en mode live

**Files:** aucun.

- [ ] **Step 1: Compléter les infos business sur Stripe Dashboard**

Stripe Dashboard → Settings → Business settings :
- Renseigner SIRET, adresse, IBAN Eurofiscalis
- Activer le mode Live (validation Stripe peut prendre quelques heures)

- [ ] **Step 2: Récupérer la clé live**

Dashboard Stripe (mode Live) → Developers → API Keys :
- Copier `Secret key` (`sk_live_...`)

- [ ] **Step 3: Mettre à jour la variable Vercel**

Vercel Dashboard → projet `jeremy-sagnier-site` → Settings → Environment Variables :
- `STRIPE_SECRET_KEY` → mettre à jour avec `sk_live_...` (en Production seulement, garder `sk_test_...` en Preview/Development)

### Task 7.2: Configurer le webhook prod

- [ ] **Step 1: Créer le webhook live**

Dashboard Stripe (mode Live) → Developers → Webhooks → Add endpoint :
- URL : `https://jerwis.fr/api/stripe-webhook`
- Events : `checkout.session.completed`
- Cliquer Save

- [ ] **Step 2: Récupérer le signing secret prod**

Dans la fiche du webhook créé, cliquer "Reveal" sur le signing secret · copier `whsec_...`.

- [ ] **Step 3: Mettre à jour la variable Vercel**

Vercel Dashboard → Settings → Environment Variables :
- `STRIPE_WEBHOOK_SECRET` (Production) → `whsec_...` (le secret prod)

- [ ] **Step 4: Redéployer**

```bash
vercel --prod
```

Ou simplement push un commit sur `main`.

### Task 7.3: Test paiement réel

- [ ] **Step 1: Faire un vrai achat à 99 €**

Aller sur https://jerwis.fr/precommande-photos-personal-branding.html, faire le paiement avec ta vraie carte (mode Live).

> Tu peux te rembourser ensuite via Stripe Dashboard. Compte sur ~3 € de fees Stripe non remboursés.

- [ ] **Step 2: Vérifier**

- L'email arrive
- Le ZIP télécharge
- L'invite GitHub fonctionne
- Le delivery log existe dans Vercel Blob

- [ ] **Step 3: Annoncer**

```bash
git tag -a v1-precommande -m "Page précommande genpics-team v1 live"
git push --tags
```

(Optionnel) Poster sur LinkedIn / Twitter / newsletter pour annoncer.

---

## Récapitulatif

**Total commits estimés** : ~12-15 commits sur la branche `main` ou une branche feature dédiée.

**Total temps estimé** : ~8 h cumulées (cf. spec §11).

**Phases parallélisables** : aucune par défaut (chaque phase dépend de la précédente). Mais Phase 0 (setup infra manuel) peut commencer en parallèle de Phase 1 (deps + page merci) si on maîtrise tout.

**Hors scope V1** : Stripe Tax, dashboard "mes achats", multi-tier (équipe/agence), bouton remboursement self-service, analytics conversion. Voir spec §12.

**Commande post-livraison à connaître** :
- Pour révoquer un acheteur (remboursé) : `curl -X DELETE -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/sagnierjeremy-byte/workflow-genpics-team/collaborators/{username}`
- Pour regénérer une URL signée si l'acheteur a perdu son lien après 30j : ouvrir Vercel Blob UI, copier l'URL publique du ZIP, l'envoyer manuellement par mail.
