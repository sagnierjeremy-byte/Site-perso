# Design articles v2 — plan d'exécution

> **Statut : design TERMINÉ et validé visuellement (light + dark + mobile). Ce document est le plan d'exécution de la migration, à réaliser par une session Claude (Sonnet 5).**
> Rédigé le 2026-07-06. Avant de commencer : lire `CLAUDE.md` (racine) + `docs/charte-fiesta-et-ton.md`.

---

## 0. Ce qui existe DÉJÀ (ne pas re-créer, ne pas redessiner)

| Fichier | Rôle | État |
|---|---|---|
| `assets/article.css` | La feuille de style v2 complète des articles (remplace le `<style>` inline) | ✅ écrit, validé |
| `assets/article-reading.js` | Barre de progression de lecture + boutons « Copier » sur les blockquotes (lang-aware FR/EN) | ✅ écrit, validé |
| `articles/_PROTO-design.html` | Prototype de référence (article ia-cv avec le design v2 + table et marquee de démo, `noindex`) | ✅ rendu attendu |

**Le design ne se rediscute pas** : toutes les décisions (mesure de prose 700px, h3 sentence-case avec `//` teal, prompt-cards, tables, hr gradient, marquees, progress bar) sont dans `article.css` et visibles dans le proto. Ta mission = **intégration + migration + QC**, zéro créativité CSS.

Pour voir le rendu attendu : `node <un serveur statique cleanUrls> .` puis ouvrir `/articles/_PROTO-design`, comparer avec `/articles/ia-cv-lettre-entretien` (ancien design). Tester light + dark (toggle) + mobile 375px.

## 1. Résumé des changements design (pour comprendre ce qu'on migre)

1. **Mesure de lecture** : la prose (p, ul, ol, h3, h4, blockquote enfants directs du `.container` de section) est limitée à `--prose-measure: 700px` (~68ch). Les cards `.step`/`.usecase`, tables et H2 gardent la pleine largeur (880px).
2. **Typo corps** : 17px / interligne 1.8 (16,5px mobile). H2 légèrement recalibré (clamp 27→40px, lh 1.02). **H3 n'est plus uppercase** : Archivo Black sentence-case précédé de `// ` teal (signature déjà utilisée sur le podcast). H2/H3 ont `scroll-margin-top: 96px` (ancres TOC).
3. **Nouveaux composants** (avant : NON STYLÉS dans les articles) :
   - `blockquote` = **carte prompt** : fond `--code-bg`, bordure gauche fuchsia 4px, radius 14px, texte droit (les `em` du markdown sont redressés) + **bouton Copier** injecté par `article-reading.js` (sur les citations ≥40 caractères uniquement).
   - `table` (le markdown GFM des articles récents en produit) : header JetBrains Mono uppercase sur `--bg-2`, lignes séparées, 1ʳᵉ colonne en gras, `display:block; overflow-x:auto` pour le mobile.
   - `img` de corps : radius 14px + bordure ; `figcaption`/`.img-caption` en mono 11,5px.
   - `hr` (les `---` du markdown) : divider signature 96px, gradient teal→fuchsia→orange, centré.
4. **Signature FIESTA** :
   - `.read-progress` : barre 3px fixe en haut, gradient tri-couleur, remplie au scroll (JS).
   - **Mini-marquees** (charte : 2-3 par page — les articles n'en avaient AUCUN) : CSS inclus dans `article.css` (les articles n'importent pas `main.css`), 2 marquees par article (voir §3).
   - `::selection` fuchsia/cream. `prefers-reduced-motion` respecté (marquee + progress figés).
5. **Callouts** : padding/radius légèrement augmentés, h4 uppercase, p 15px/1.7 (structure HTML inchangée).

## 2. Périmètre de migration

- `articles/_TEMPLATE.html` (futurs articles)
- `scripts/publish.js` (ancres explicites + marquees dans le corps — voir §3)
- Tous les articles **conformes au template**, FR (`articles/*.html`) et EN (`en/articles/*.html`).
  **Critère de conformité** (les deux requis) : le fichier contient un `<style>` inline avec `--fuchsia: #EF426F;` **ET** la classe `.tldr {`. Les articles hand-made non conformes (anciens, à CSS custom : karpathy, jerwis-finance-tracker, etc.) sont **SKIPPÉS et listés** en sortie de script — ne pas les forcer.
- NE PAS toucher : `assets/main.css`, les pages hors articles, `article-toc.css/js`, `ai-summarize.css/js`, `footer.css`, `lang-toggle.js`.

## 3. ⚠️ GARDE-FOU CRITIQUE : publish.js et les ancres du corps

**Incident du 2026-07-02→06 (ne pas reproduire)** : `publish.js` remplace le corps entre la fin du TL;DR (`</div></div>`) et l'ancre `<!-- Final CTA -->` via `bodyZoneRegex`. Une refonte avait supprimé l'ancre → replace silencieux → 2 articles publiés avec le corps d'exemple du template. Un fail-loud existe désormais (publish jette si le corps n'est pas injecté).

Conséquences pour cette migration :

1. **Interdit** d'insérer quoi que ce soit entre le `</div></div>` du TL;DR et la première `<section class="block">`, ou de renommer/supprimer `<!-- Final CTA -->`, **sans** faire l'étape 2 ci-dessous d'abord.
2. **Étape obligatoire — ancres explicites** dans `scripts/publish.js` :
   - `renderBody()` doit désormais émettre le corps encadré : `<!-- ARTICLE_BODY:START -->\n{marquee1}\n{sections}\n{marquee2}\n<!-- ARTICLE_BODY:END -->`.
   - Le remplacement du corps devient : si le HTML cible contient les deux ancres `ARTICLE_BODY:START/END` → remplacer tout ce qui est entre elles (ancres incluses, ré-émises) ; **sinon** fallback sur l'actuelle `bodyZoneRegex` (rétro-compatibilité). Conserver le fail-loud existant tel quel.
   - `{marquee1}` et `{marquee2}` = les deux mini-marquees (contenus §4), générés par publish.js — ils vivent DANS la zone remplacée, donc régénérés à chaque re-publication (c'est voulu ; ne JAMAIS les insérer hors zone pour un article qui a un draft).
3. **Test obligatoire après modification de publish.js** : `npm run publish creer-images-ia-gratuit` puis vérifier (a) corps correct (`grep -c 'Timed vs'` = 0, contenu Gemini présent), (b) ancres présentes, (c) marquees présents ×2, (d) re-publier une 2ᵉ fois = idempotent (pas de marquees dupliqués). Puis test négatif : retirer temporairement les ancres ET `<!-- Final CTA -->` d'une copie du template → publish doit REFUSER (throw).

## 4. Contenu des mini-marquees (validé, ton Leo)

Format HTML (charte : contenu dupliqué 2× pour la boucle) :
```html
<div class="mini-marquee" aria-hidden="true"><div class="mini-marquee-track">
  <span>Zéro jargon</span><span>Testé d'abord pour moi</span><span>Sources dans le texte</span><span>Prompts à copier</span><span>Réponds si tu n'es pas d'accord</span>
  <span>Zéro jargon</span><span>Testé d'abord pour moi</span><span>Sources dans le texte</span><span>Prompts à copier</span><span>Réponds si tu n'es pas d'accord</span>
</div></div>
```
- **marquee1** (début de corps, FR) : `Zéro jargon · Testé d'abord pour moi · Sources dans le texte · Prompts à copier · Réponds si tu n'es pas d'accord`
- **marquee2** (fin de corps, FR) : `Comprendre avant d'appliquer · À ton rythme · Pas de pub · Désinscription en 1 clic · Je lis toutes les réponses`
- **Versions EN** (pour les articles `en/articles/`) : `No jargon · Tested on myself first · Sources in the text · Prompts to copy · Reply if you disagree` / `Understand before you apply · At your own pace · No ads · Unsubscribe in one click · I read every reply`

## 5. Étapes d'exécution

### Phase A — Template + pipeline (2 fichiers)
1. `articles/_TEMPLATE.html` :
   - Remplacer tout le bloc `<style>…</style>` (~332 lignes) par : `<link rel="stylesheet" href="../assets/article.css?v=20260706">`
   - Ajouter `<script src="../assets/article-reading.js" defer></script>` juste avant `</body>` (après les scripts TOC/ai-summarize existants).
   - NE PAS insérer de marquees dans le template (ils viennent de renderBody, §3).
2. `scripts/publish.js` : ancres `ARTICLE_BODY:START/END` + marquees dans `renderBody()` (§3.2). Tests §3.3.

### Phase B — Script de migration `scripts/migrate-article-design.mjs`
Écrire un script Node idempotent qui, pour chaque `articles/*.html` et `en/articles/*.html` (hors `_TEMPLATE.html`, `_PROTO-design.html`) :
1. **Détecte la conformité** (§2). Non conforme → skip + log.
2. Remplace le `<style>…</style>` inline (celui qui contient `--fuchsia`) par le `<link … article.css?v=20260706>`. Idempotent : si le link est déjà là, skip.
3. Injecte `<script src="../assets/article-reading.js" defer></script>` avant `</body>` (idempotent).
4. Insère les ancres + marquees dans le corps (idempotent, seulement si absents) :
   - `<!-- ARTICLE_BODY:START -->` + marquee1 juste **avant la première** `<section class="block">` qui suit la fin du TL;DR — c'est-à-dire immédiatement après le `</div></div>` fermant le container TL;DR (le marquee se place ENTRE ce `</div></div>` et la première section : c'est autorisé UNIQUEMENT parce que les ancres START/END prennent le relais de l'ancienne regex — Phase A.2 doit être faite et testée AVANT).
   - marquee2 + `<!-- ARTICLE_BODY:END -->` juste **avant** `<!-- Final CTA -->` (ou `<!-- Fin d'article` si absent).
   - Langue des marquees : `en/articles/` → jeux EN (§4), sinon FR.
5. Sort un rapport : migrés / skippés (avec raison) / déjà à jour.

### Phase C — QC (script ou one-liners, TOUT doit passer)
- 0 `<style>` inline contenant `--fuchsia` résiduel dans les articles migrés ; le `<link article.css>` présent.
- `article-reading.js` présent sur tous les migrés ; marquees exactement 2 par article migré ; ancres START/END présentes.
- JSON-LD parse OK sur tous les fichiers touchés ; 0 placeholder `{{…}}`.
- Pages EN : marquees en anglais ; re-passer `node scripts/i18n/gen-en-page.mjs <rel>` N'EST PAS nécessaire (on ne touche ni liens ni head SEO) — mais vérifier qu'aucun `lang="fr"` n'a été introduit.
- `npm run publish creer-images-ia-gratuit` (test complet pipeline) puis `git diff` : le corps régénéré doit être stable (pas de churn en dehors des ancres/marquees la première fois).
- Spot-check visuel local (serveur statique) : 3 articles FR + 2 EN + le proto, light + dark + 375px. Console : 0 erreur.

### Phase D — Livraison
- Commits **par chemins explicites** (JAMAIS `git add -A`), en 2 commits : (1) template+publish.js+script de migration, (2) les articles migrés.
- `git pull --rebase origin main` avant push (l'autopilot blog pousse lun/jeu ~8-10h UTC, le cron news tous les jours ~8h).
- Vérif live après déploiement : 2 articles FR + 1 EN en HTTP 200, `article.css` chargé (200), progress bar visible, un bouton Copier fonctionnel (avec cache-bust `?cb=` pour éviter le CDN).
- Mettre à jour `CHANGELOG.md` (entrée en haut) + la ligne « Structure type » de `CLAUDE.md` section Articles (mentionner article.css partagé + marquees via publish.js).

## 6. Pièges connus (vécus sur ce repo)

- **zsh ne word-splitte pas `$VAR`** : pour itérer sur des fichiers dans un script shell, passer par Node (`fs.readdirSync`), pas par des boucles `for f in $FILES`.
- Les excerpts/cartes d'`articles.html` sont dans le tableau JS inline `ALL_ARTICLES` (PAS les marqueurs `ARTICLES:START/END` du CLAUDE.md, qui décrivent un état non déployé) — cette migration n'y touche pas.
- `blockquote:has(.copy-btn)` : le sélecteur `:has()` est supporté partout depuis 2024 ; le fallback sans bouton reste lisible (progressive enhancement).
- La table en `display:block` prend la largeur de son contenu (voulu, validé au proto) — ne pas « corriger » en `width:max-content`.
- Le thème est sur `<html data-theme>` ; le hero/les couleurs fixes du hero ne changent pas selon le thème (règle charte dark mode).
- Ne PAS committer `articles/_PROTO-design.html` dans le sitemap ni le lier depuis une page ; il est `noindex` et sert uniquement de référence.
- Cache CDN : après déploiement, toujours vérifier avec `?cb=$(date +%s)` avant de conclure à un échec.

## 7. Rollback

Chaque article migré reste auto-suffisant (le CSS externe est additif). En cas de problème : `git revert` du commit « articles migrés » remet l'inline ; le commit template/publish peut rester (le fallback bodyZoneRegex couvre les anciens articles).
