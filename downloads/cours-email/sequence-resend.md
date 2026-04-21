# Configurer la séquence Resend pour le mini-cours

> Guide technique pour mettre les 5 emails en production via Resend + un endpoint Vercel serverless.

---

## Option A · Resend Broadcasts (plus simple, pas de code)

1. Va sur [resend.com/audiences](https://resend.com/audiences)
2. Crée une audience `cours-semaine-1`
3. Pour chaque email (jour 1 à 5) ·
   - [resend.com/broadcasts](https://resend.com/broadcasts) → `New broadcast`
   - Audience · `cours-semaine-1`
   - Subject · copie depuis le frontmatter de `day-X.md`
   - Body · convertis le MD en HTML (utilise `marked` ou paste dans un éditeur MD→HTML)
4. Schedule · envoi manuel ou via cron externe (option B)

**Limite** · Resend Broadcasts ne gère pas les séquences automatiques déclenchées par l'inscription. Il faut un cron externe ou passer à Option B.

---

## Option B · Endpoint Vercel + cron (recommandé)

### Architecture

```
[Form inscription]
  ↓
  /api/subscribe (Vercel serverless)
  → Resend add contact to audience
  → Supabase insert { email, inscrit_le, prochain_envoi_jour: 1 }

[Cron quotidien (Vercel cron ou Supabase Edge Function)]
  ↓
  /api/send-daily (lit Supabase, envoie les emails dus aujourd'hui)
```

### Étape 1 · table Supabase

```sql
create table cours_inscrits (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  inscrit_le timestamptz default now(),
  dernier_envoi_jour int default 0,
  termine boolean default false,
  unsubscribed boolean default false
);

-- Index pour requête du cron
create index idx_cours_a_envoyer
  on cours_inscrits (termine, unsubscribed, inscrit_le)
  where termine = false and unsubscribed = false;
```

### Étape 2 · endpoint `/api/subscribe` (modification)

Dans `/api/subscribe.js`, quand `source === 'cours-semaine-1'`, insère aussi dans `cours_inscrits` ·

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ... code existant ...

if (source === 'cours-semaine-1') {
  await supabase.from('cours_inscrits').upsert(
    { email, dernier_envoi_jour: 0 },
    { onConflict: 'email' }
  );
  // Envoyer le jour 1 immédiatement
  await sendCoursEmail(email, 1);
}
```

### Étape 3 · endpoint `/api/send-daily.js` (cron Vercel)

```js
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEMPLATES_DIR = path.join(process.cwd(), 'downloads/cours-email');

function loadDay(jour) {
  const file = path.join(TEMPLATES_DIR, `day-${jour}-${['install','claude-md','skill','automation','next'][jour-1]}.md`);
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { subject: data.sujet, preheader: data.preheader, html: marked(content) };
}

async function sendCoursEmail(email, jour) {
  const { subject, preheader, html } = loadDay(jour);
  await resend.emails.send({
    from: 'Jérémy Sagnier <hello@jeremysagnier.com>',
    to: email,
    subject,
    html: `<!-- ${preheader} -->\n${html}`,
  });
}

export default async function handler(req, res) {
  // Authentification cron (Vercel cron secret)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Récupère tous les inscrits non terminés
  const { data: inscrits, error } = await supabase
    .from('cours_inscrits')
    .select('*')
    .eq('termine', false)
    .eq('unsubscribed', false);

  if (error) return res.status(500).json({ error: error.message });

  let sent = 0;
  for (const inscrit of inscrits) {
    const joursDepuisInscription = Math.floor(
      (Date.now() - new Date(inscrit.inscrit_le).getTime()) / 86400e3
    );
    const prochainJour = inscrit.dernier_envoi_jour + 1;

    // Envoie le prochain jour s'il est dû
    if (joursDepuisInscription >= prochainJour - 1 && prochainJour <= 5) {
      try {
        await sendCoursEmail(inscrit.email, prochainJour);
        await supabase
          .from('cours_inscrits')
          .update({
            dernier_envoi_jour: prochainJour,
            termine: prochainJour === 5,
          })
          .eq('id', inscrit.id);
        sent++;
      } catch (e) {
        console.error(`Fail ${inscrit.email} jour ${prochainJour}:`, e);
      }
    }
  }

  return res.json({ ok: true, sent });
}
```

### Étape 4 · configurer le cron Vercel

Dans `vercel.json` ·

```json
{
  "crons": [{
    "path": "/api/send-daily",
    "schedule": "0 9 * * *"
  }]
}
```

Chaque jour à 9h UTC (10h FR été, 11h FR hiver).

Ajoute `CRON_SECRET` dans les env vars Vercel (n'importe quelle string aléatoire longue).

### Étape 5 · page d'inscription

Crée `/cours.html` · hero + promesse + formulaire qui poste vers `/api/subscribe` avec `source: 'cours-semaine-1'`.

---

## Option C · workflow n8n (no-code)

Si tu veux éviter le code custom ·

1. Webhook n8n reçoit l'inscription depuis le form
2. Insère dans Airtable ou Google Sheets
3. Workflow schedulé chaque jour · parcourt la table, envoie l'email du bon jour via Resend
4. Met à jour la date du dernier envoi

Plus lent à setup (45 min) mais zéro code.

---

## Tests avant de lancer

1. Inscris-toi avec ton propre email
2. Vérifie que le jour 1 arrive immédiatement
3. Attends 24h, vérifie que le jour 2 arrive
4. Pour tester sans attendre 5 jours, change temporairement le calcul de `joursDepuisInscription` à `Math.floor(diff / 300e3)` (5 min entre chaque email)

## Monitoring

- Dashboard Resend · taux d'ouverture, clics, bounces
- Table Supabase · nombre d'inscrits actifs, taux de complétion
- Indicateur clé · **% de gens qui ouvrent le jour 5** (reflet de la qualité du cours)

---

© 2026 Jérémy Sagnier · https://jeremysagnier.com
