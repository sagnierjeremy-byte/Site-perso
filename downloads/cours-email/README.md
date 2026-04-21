# Mini-cours email · "Ta semaine 1 avec Claude"

> 5 emails, 1 par jour, pour faire passer un lecteur de zéro à premier projet Claude Code livré.
> Compte moyen à envoyer · 8-12h de setup une seule fois.

---

## Objectif pédagogique

Le lecteur s'inscrit · **J+0 reçoit l'email J1**, puis J+1, J+2, J+3, J+4. En 5 jours il a :

1. Installé Claude Code
2. Un CLAUDE.md qui fonctionne
3. Utilisé un skill pour une vraie tâche
4. Automatisé un workflow simple
5. Un plan clair pour continuer

## Fichiers

| Fichier | Rôle |
|---|---|
| `day-1-install.md` | Jour 1 · Installer Claude Code en 10 min |
| `day-2-claude-md.md` | Jour 2 · Ton premier CLAUDE.md |
| `day-3-skill.md` | Jour 3 · Lancer un skill pour une vraie tâche |
| `day-4-automation.md` | Jour 4 · Automatiser un workflow simple |
| `day-5-next.md` | Jour 5 · Récap + ta roadmap mois 1 |
| `sequence-resend.md` | Guide pour configurer la séquence dans Resend |

## Setup · configurer la séquence (Resend)

Les emails sont au format Markdown. Deux options pour les envoyer :

**Option A · Resend Broadcasts + Workflow**

1. Dashboard Resend · crée une audience dédiée `cours-semaine-1`
2. Pour chaque email (jour 1 à 5), crée un broadcast avec le contenu MD converti en HTML
3. Configure un workflow sur l'audience · déclencheur = inscription, envoi = J+0, J+1, J+2, J+3, J+4
4. Active le workflow

**Option B · Endpoint Vercel + cron**

Si tu veux plus de contrôle, vois `sequence-resend.md` pour le code d'un endpoint qui envoie les emails via l'API Resend à partir d'une table Supabase (inscription + date d'envoi).

## Intégration avec le site

Le formulaire d'inscription du site (`/api/subscribe`) doit ajouter un paramètre `source: "cours-semaine-1"` pour segmenter l'audience. Côté Resend, le workflow se déclenche sur ce segment.

Exemple de form sur l'index.html ou une landing dédiée /cours.html :

```html
<form id="coursInscription">
  <input type="email" name="email" required>
  <button type="submit">Je commence les 5 jours gratuits →</button>
</form>
<script>
document.getElementById('coursInscription').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source: 'cours-semaine-1' }),
  });
  e.target.innerHTML = '<p>✓ C\'est parti. Premier email dans ta boîte dans 2 minutes.</p>';
});
</script>
```

## Ton Leo · à appliquer partout

- 1ère personne, tutoiement
- Chaleureux mais pas familier (pas de "kif", "taf", "mec")
- Phrases courtes, 12 mots max en moyenne
- CTA réponse à chaque email · "réponds-moi si ça bloque"
- Mention IA transparente dans le premier email

---

© 2026 Jérémy Sagnier · https://jeremysagnier.com
