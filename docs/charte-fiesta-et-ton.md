# Charte graphique FIESTA / 89 + Ton de voix « Leo »

> Référence intégrale déplacée depuis `CLAUDE.md` (2026-07-03). À lire avant toute création/modif de contenu ou d'UI sur jerwis.fr.

---

## Charte graphique FIESTA / 89

Inspirée San Antonio Spurs (1989). Streetwear, heritage, jamais corporate.

### Palette
- `--fuchsia: #EF426F` · CTA principal, énergie
- `--teal: #00B2A9` · Success, heritage
- `--orange: #FF8200` · Heat, alertes
- `--ink: #0A0A0A` · Base dominante
- `--bg: #FBF7F0` (light) / `#0A0A0A` (dark)

### Règle d'or
**Noir/cream dominant (50%) > surfaces (30%) > 3 couleurs accent (20%).**
Jamais les 3 couleurs Fiesta en aplat à taille égale.

### Signature triple-stripe
Ordre canonique **immuable** : `teal → fuchsia → orange`. Utilisée en headers, footers, dividers.

### Mini-marquees (signature Fiesta, RÈGLE À APPLIQUER PARTOUT)
Dividers identitaires. **Chaque nouvelle page doit en contenir 2-3**, entre les grandes sections, pour rythmer le scroll.
- Le CSS (`.mini-marquee`, `.mini-marquee-track`, keyframes) est **déjà dans `assets/main.css`** — ne plus le copier dans le `<style>` des pages qui importent main.css.
- HTML : `<div class="mini-marquee" aria-hidden="true"><div class="mini-marquee-track"><span>Mot 1</span>…</div></div>` — **dupliquer le contenu 2×** pour une boucle infinie fluide.
- Contenu : 5-7 mots/expressions courtes, cohérentes avec la section qui suit. Zéro familier, ton Leo, pas d'anglicismes. Exemple validé : *« Gratuit · Zéro pub · Juste ce qui sert · Désinscription 1 clic · Fait pour moi d'abord · Inspire-toi »*.

### Typo
- Display H1-H2 : `Archivo Black` UPPERCASE · `letter-spacing: -0.03em à -0.04em`
- Body : `Archivo` 400/500/600/700/900
- Labels/kickers : `JetBrains Mono` UPPERCASE · `letter-spacing: 0.1em à 0.2em`

### Effets
- Grain overlay SVG (fractalNoise) en multiply (light) / screen (dark) · radial gradients colorés sur les hero
- Dual-theme via `data-theme="light|dark"` sur `<html>` + localStorage

### Dark mode · piège à éviter (RÈGLE)
Les variables `--ink` et `--bg` sont **sémantiques** (texte / fond adaptatifs), pas **chromatiques** : les deux **s'inversent** en dark (`--ink` devient cream, `--bg` devient noir).

**Quand un bloc doit rester sombre peu importe le thème** (hero noir, CTA noir), NE PAS utiliser `background: var(--ink)` · ça donne cream sur cream en dark = illisible. Utiliser les couleurs **fixes** : `background: #0A0A0A; color: #FBF7F0;`. Les 3 accents (`--teal`, `--fuchsia`, `--orange`) ne changent pas selon le thème, OK partout.

**Incident fondateur** · 2026-04-22 · `outils.html` tier2-intro + `github.html` hero/final illisibles en dark mode.

---

## Ton de voix — "Ton Leo" (RÈGLE ABSOLUE)

Ton Leo = ton de la mascotte IA Leo d'Eurofiscalis. Appliqué **partout** sur ce site.

### Règles non-négociables
- **1ère personne directe** : "Salut, moi c'est Jérémy", "Je teste", "Je lis tout"
- **Chaleureux + bienveillant** : pas de pitch commercial, conversation
- **Hyper transparent** : assumer l'usage de l'IA, promettre désinscription 1 clic
- **Simple** : pas de jargon, mots courants, phrases courtes
- **Montrer le travail** : chiffres concrets, sources, processus détaillé
- **Assumer les limites** : "je peux me tromper, écris-moi si tu n'es pas d'accord"
- **Appel à réponse** partout : "Réponds à l'email, je lis tout"

### Registre : naturel, PAS familier (règle renforcée 2026-04-20)
Chaleureux ≠ familier. Jamais d'argot ni de langage "de pote" sur le site public.

**À BANNIR :** "je te file", "tu piques", "prêt à piquer", "des trucs", "c'est de la daube", "qui marchent" (parlé), "1 clic pour sortir", "kif", "taf", "mec", "ouais", élisions orales ("ça sert pas", "y'a").

**À UTILISER :** "je t'envoie" / "je partage", "prêt à appliquer" / "prêt à utiliser", "erreurs" / "ressources", "qui fonctionnent", "désinscription en 1 clic", "sans pub".

**Test :** relire à voix haute. Si ça sonne comme un copain au bar → trop familier. Si ça sonne comme un ami qui t'écrit un mail un dimanche soir → bon niveau.

**Exception** : citer un mot banni **entre guillemets français** comme exemple explicite de l'interdit est OK (ex: `« kif »`). Un audit grep remontera ces occurrences comme faux positifs — c'est normal.

### PITCH CENTRAL (à préserver à tout prix)
> "Je fais tout ça d'abord pour moi. Si ça arrive jusqu'à toi, c'est parce que ça m'a servi à moi en premier."

Les newsletters sont **des veilles automatiques** que Jérémy se produit à lui-même. Il propose au lecteur de recevoir la même. **Jamais** dire "j'ai créé ce contenu pour toi" — toujours "je te partage ce que je consomme".

### À ne JAMAIS dire / écrire
- ❌ "Dev fullstack", "développeur", "codeur" → Jérémy N'EST PAS dev
- ❌ "Inscrivez-vous pour recevoir du contenu exclusif" → pose commerciale
- ❌ Mentions de projets Eurofiscalis/Kevin internes si pas pertinent
- ❌ Disclaimer consultant "il est important de noter que..."
- ❌ **"GMF", "chez GMF", "produit GMF"** → toujours remplacer par "en assurance" / "outil de vente" / formulation neutre. Article renommé `outil-vente-claude-code.html` avec redirect 301 depuis l'ancien slug. AUCUN texte visible ne doit contenir "GMF". Raison : anonymisation du nom de l'employeur de Shirley (décidée 2026-04-23).
