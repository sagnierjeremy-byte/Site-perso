# Plan /apprendre v3 — parcours en 5 étapes (rééquilibrage)

> **Statut : toutes les décisions sont prises et tout le contenu est écrit (FR + EN, verbatim, ton Leo validé). Ce document est un plan d'exécution MÉCANIQUE : aucune décision créative à prendre, aucun texte à inventer.**
> Rédigé le 2026-07-20. Avant de commencer : lire `CLAUDE.md` (racine). La charte (`docs/charte-fiesta-et-ton.md`) est déjà respectée dans les contenus ci-dessous — ne pas les reformuler.

---

## 0. Contexte & objectif (ne pas rediscuter)

Le parcours actuel envoie le débutant de l'étape 01 (lire des bases) directement à Claude Code et au terminal (étape 02). Point contrariant identifié de longue date et confirmé par la recherche utilisateur de juin 2026 : **il manque une étape de pratique dans le navigateur** (prompts, résumés, vérification, visuels) avant l'outil « technique ».

**Décision actée** : passer de 4 à **5 étapes** en insérant une nouvelle étape 02 « Mettre l'IA au travail » (5 articles déjà publiés, 100 % navigateur, versions gratuites), et décaler les étapes suivantes. L'article `automatiser-taches-ia-sans-coder` rejoint l'étape agents (devenue 04) comme carte d'ouverture.

**Nouvelle structure** (couleurs de section : `s-teal` / `s-fuchsia` / `s-orange` / `s-teal` (cycle) / `s-ink` — toutes ces classes CSS existent déjà, ZÉRO CSS à ajouter) :

| # | id | classe | Titre | Cartes | Durée |
|---|---|---|---|---|---|
| 01 | `etape-01` | `s-teal` | Poser les bases (inchangé) | 3 | ~35 min |
| 02 | `etape-02` | `s-fuchsia` | **Mettre l'IA au travail (NOUVEAU)** | 5 | ~47 min |
| 03 | `etape-03` | `s-orange` | Passer à Claude Code (ex-02) | 4 | ~41 min |
| 04 | `etape-04` | `s-teal` | Construire tes agents (ex-03 + 1 carte) | 5 | ~59 min |
| 05 | `etape-05` | `s-ink` | Aller plus loin (ex-04) | 7 | ~55 min |

Totaux pour les chips du hero : **5 étapes · 24 lectures · ~4h de lecture · 0 €**.

Fichiers touchés : `apprendre.html`, `en/apprendre.html`, `CHANGELOG.md`, `CLAUDE.md` (2 lignes). C'est tout.

---

## 1. Ordre d'exécution recommandé

1. `apprendre.html` (FR) : édits A→K ci-dessous, dans l'ordre.
2. `en/apprendre.html` (EN) : édits A→K miroir (contenus verbatim fournis en §3).
3. QC (§4), preview local, commit par chemins explicites, `git pull --rebase origin main` avant push (l'autopilot blog pousse lun/mar/jeu/ven ~8-10h UTC, le cron news tous les jours ~8h), push, vérif live avec cache-bust, CHANGELOG + CLAUDE.md.

⚠️ Règles absolues : ne PAS toucher aux sections `whatis`, `parcours-fears` (sauf les 4 numéros d'étape listés en édit H), `parcours-optin`, quickwin, hero H1/lead (seuls les chips changent), hreflang/canonical, formulaires. Ne jamais `git add -A`.

---

## 2. ÉDITS FR (`apprendre.html`) — contenu verbatim

### Édit A — Hero : chips méta
Remplacer le bloc `.parcours-hero-meta` actuel par :
```html
    <div class="parcours-hero-meta">
      <span><strong>5</strong>étapes</span>
      <span><strong>24</strong>lectures</span>
      <span><strong>~4h</strong>de lecture</span>
      <span><strong>0 €</strong>pour tout lire</span>
    </div>
```

### Édit B — Rail de progression (5 entrées)
Remplacer tout le contenu de `.progress-rail-inner` par :
```html
      <a href="#etape-01" class="progress-step active" data-color="teal" data-step="01">
        <span class="progress-step-num">01</span>
        <span class="progress-step-label">
          <strong>Poser les bases</strong>
          <span>Aucun prérequis</span>
        </span>
      </a>
      <a href="#etape-02" class="progress-step" data-color="fuchsia" data-step="02">
        <span class="progress-step-num">02</span>
        <span class="progress-step-label">
          <strong>Pratiquer au quotidien</strong>
          <span>100 % navigateur</span>
        </span>
      </a>
      <a href="#etape-03" class="progress-step" data-color="orange" data-step="03">
        <span class="progress-step-num">03</span>
        <span class="progress-step-label">
          <strong>Claude Code</strong>
          <span>Ton premier prompt qui code</span>
        </span>
      </a>
      <a href="#etape-04" class="progress-step" data-color="teal" data-step="04">
        <span class="progress-step-num">04</span>
        <span class="progress-step-label">
          <strong>Construire un agent</strong>
          <span>Tes premiers automatismes</span>
        </span>
      </a>
      <a href="#etape-05" class="progress-step" data-color="ink" data-step="05">
        <span class="progress-step-num">05</span>
        <span class="progress-step-label">
          <strong>Aller plus loin</strong>
          <span>Cas concrets · recherche</span>
        </span>
      </a>
```
Note : vérifier que `data-color="ink"` est bien géré par le CSS existant (l'ancienne étape 04 l'utilisait déjà → oui).

### Édit C — Barre de progression : « / 5 »
1. `<span class="pp-label"><span id="pp-count">0</span> / 4 étapes terminées</span>` → `/ 5 étapes terminées`
2. `aria-valuemax="4"` → `aria-valuemax="5"`
3. Dans le JS en bas de page : `f.style.width = (n/4*100) + '%'` → `(n/5*100)` et `bar.classList.toggle('complete', n===4)` → `n===5`.

### Édit D — NOUVELLE étape 02 (insérer le bloc complet ci-dessous ENTRE la fin de la section `etape-01` — après son `</section>` — et le mini-marquee qui suit ; le mini-marquee existant « 01 → 02 » est remplacé par l'édit G)

```html
<!-- ========== ÉTAPE 02 — Mettre l'IA au travail ========== -->
<section class="step s-fuchsia" id="etape-02">
  <div class="container">
    <header class="step-header">
      <div class="step-num-big">02</div>
      <div class="step-meta">
        <span class="step-kicker">Étape 02 · Au quotidien, sans rien installer</span>
        <h2 class="step-title">Mettre l'IA<br><em>au travail.</em></h2>
        <p class="step-intro">
          Avant d'installer quoi que ce soit, on pratique. Tout se passe dans ton navigateur, avec les versions gratuites : tu apprends à écrire une demande qui donne un bon résultat, tu fais résumer un long document, tu vérifies ce que l'IA raconte, tu crées tes premiers visuels. <strong>À la fin de cette étape, l'IA fait déjà partie de ta semaine</strong> — et tu sauras quel outil te convient avant de passer au niveau supérieur.
        </p>
        <div class="step-facts">
          <span><strong>5</strong>lectures</span>
          <span><strong>~47 min</strong>au total</span>
          <span><strong>Niveau</strong>Débutant</span>
          <span><strong>Outils</strong>100 % gratuits</span>
        </div>
      </div>
    </header>

    <div class="step-cards">

      <a class="article-card c-fuchsia" href="articles/ecrire-bon-prompt-non-dev">
        <svg class="article-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Lecture · 02.1</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Écrire un prompt<br>qui donne<br><em>un bon résultat.</em></h3>
          <div class="article-subtitle">— Rôle · Contexte · Format</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Ce que tu repars avec</div>
          <p class="article-preview-text">La différence entre une réponse molle et une réponse utile tient à la façon de demander. La méthode complète, avec des exemples avant/après à copier.</p>
        </div>
      </a>

      <a class="article-card c-teal-fuchsia" href="articles/resumer-pdf-video-avec-ia">
        <svg class="article-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="12" y2="17"/>
        </svg>
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Lecture · 02.2</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Résumer un PDF,<br>une vidéo, un<br><em>long document.</em></h3>
          <div class="article-subtitle">— Le cas d'usage n°1 au quotidien</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Ce que tu vas faire</div>
          <p class="article-preview-text">Contrats, rapports, vidéos YouTube d'une heure : obtenir un résumé fiable en 2 minutes, choisir le bon outil, et éviter les pièges classiques.</p>
        </div>
      </a>

      <a class="article-card c-teal" href="articles/verifier-info-ia">
        <svg class="article-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <path d="M8 11l2 2 4-4"/>
        </svg>
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Lecture · 02.3</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Vérifier ce que<br>l'IA te raconte<br><em>(elle invente).</em></h3>
          <div class="article-subtitle">— Hallucinations · Réflexes de vérification</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Pourquoi c'est indispensable</div>
          <p class="article-preview-text">L'IA peut se tromper avec un aplomb parfait. Les réflexes pour repérer une invention, la vérifier vite, et transformer ce défaut en avantage.</p>
        </div>
      </a>

      <a class="article-card c-fuchsia-orange" href="articles/creer-images-ia-gratuit">
        <svg class="article-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Lecture · 02.4</span>
          <span class="article-pill">11 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Créer tes visuels<br>gratuitement,<br><em>sans designer.</em></h3>
          <div class="article-subtitle">— Gemini · ChatGPT · Canva</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Ce que tu repars avec</div>
          <p class="article-preview-text">Quotas gratuits réels, droits d'usage commercial, et les prompts qui donnent des images utilisables pour ton activité.</p>
        </div>
      </a>

      <a class="article-card c-orange" href="articles/choisir-ia-ecrire-coder-images">
        <svg class="article-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M12 3v18"/>
          <path d="M5 7l7-4 7 4"/>
          <path d="M3 13a3 3 0 0 0 6 0l-3-6-3 6z"/>
          <path d="M15 13a3 3 0 0 0 6 0l-3-6-3 6z"/>
        </svg>
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Lecture · 02.5</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Choisir ton outil :<br>ChatGPT, Claude<br><em>ou un autre ?</em></h3>
          <div class="article-subtitle">— Le comparatif honnête 2026</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Pour quoi faire</div>
          <p class="article-preview-text">Écrire, créer, coder : quel outil pour quel usage, ce que valent vraiment les versions gratuites, et quand payer vaut le coup.</p>
        </div>
      </a>

    </div>

    <div class="step-done"><button type="button" class="step-done-btn" data-step="02">Marquer l'étape 02 comme terminée</button></div>

    <a href="#etape-03" class="step-next">
      <div>
        <div class="step-next-meta">— Étape suivante · 03</div>
        <div class="step-next-title">Passer à <em>Claude Code</em></div>
      </div>
      <span class="step-next-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </span>
    </a>

  </div>
</section>
```

### Édit E — Étape Claude Code : 02 → 03
Dans la section actuellement `id="etape-02"` (Claude Code) :
1. `<section class="step s-fuchsia" id="etape-02">` → `<section class="step s-orange" id="etape-03">`
2. `<div class="step-num-big">02</div>` → `03`
3. `<span class="step-kicker">Étape 02 · Passer à Claude Code</span>` → `Étape 03 · Passer à Claude Code`
4. Les 4 badges : `Lecture · 02.1` → `03.1`, `02.2` → `03.2`, `02.3` → `03.3`, `02.4` → `03.4`
5. `data-step="02"` du bouton → `data-step="03"` et son libellé `Marquer l'étape 02…` → `03`
6. `step-next` : `href="#etape-03"` → `#etape-04` ; `— Étape suivante · 03` → `· 04` ; le titre `Construire un <em>agent</em>` reste.
7. Commentaire HTML `<!-- ========== ÉTAPE 02 — Claude Code ========== -->` → `ÉTAPE 03`.

### Édit F — Étape Agents : 03 → 04 (+ nouvelle carte d'ouverture)
Dans la section actuellement `id="etape-03"` :
1. `<section class="step s-orange" id="etape-03">` → `<section class="step s-teal" id="etape-04">`
2. `step-num-big` `03` → `04` ; kicker `Étape 03 · Construire tes agents` → `Étape 04 · Construire tes agents`
3. `step-facts` : `<span><strong>4</strong>lectures</span>` → `5` et `~48 min` → `~59 min`
4. **Insérer en PREMIÈRE position** dans `.step-cards` (avant la carte agents-ia-guide) :
```html
      <a class="article-card c-teal" href="articles/automatiser-taches-ia-sans-coder">
        <svg class="article-watermark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Lecture · 04.1</span>
          <span class="article-pill">11 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Automatiser tes<br>tâches répétitives<br><em>sans coder.</em></h3>
          <div class="article-subtitle">— Le pont entre le chat et les agents</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Ce que tu vas comprendre</div>
          <p class="article-preview-text">Rappels, tris, rapports : les outils no-code qui enchaînent des actions à ta place, et ceux qui valent le coup en 2026. La marche juste avant les agents.</p>
        </div>
      </a>
```
5. Les 4 badges existants : `03.1` → `04.2`, `03.2` → `04.3`, `03.3` → `04.4`, `03.4` → `04.5`
6. `data-step="03"` → `data-step="04"` (+ libellé)
7. `step-next` : `href="#etape-04"` → `#etape-05` ; `· 04` → `· 05`
8. Commentaire `ÉTAPE 03` → `ÉTAPE 04`.

### Édit G — Étape Aller plus loin : 04 → 05
1. `<section class="step s-ink" id="etape-04">` → `id="etape-05"` (classe inchangée)
2. `step-num-big` `04` → `05` ; kicker `Étape 04 · Aller plus loin` → `Étape 05 · Aller plus loin`
3. Les 7 badges : `04.1` → `05.1` … `04.7` → `05.7`
4. `data-step="04"` → `data-step="05"` (+ libellé)
5. Commentaire `ÉTAPE 04` → `ÉTAPE 05`.

### Édit H — Mini-marquees de transition
1. Le marquee actuel entre l'étape 01 et l'étape Claude Code (« Les bases posées · Place à l'action · On passe au terminal · Claude Code arrive · Ton premier prompt qui code ») est **remplacé** par (transition 01→02) :
```html
<!-- Mini-marquee 01 → 02 -->
<div class="mini-marquee" aria-hidden="true">
  <div class="mini-marquee-track">
    <span>Les bases posées</span><span>Maintenant on pratique</span><span>Tout dans ton navigateur</span><span>Zéro installation</span><span>Ton premier réflexe IA</span>
    <span>Les bases posées</span><span>Maintenant on pratique</span><span>Tout dans ton navigateur</span><span>Zéro installation</span><span>Ton premier réflexe IA</span>
  </div>
</div>
```
2. **Insérer un nouveau marquee** entre la nouvelle étape 02 et l'étape 03 (transition 02→03) :
```html
<!-- Mini-marquee 02 → 03 -->
<div class="mini-marquee" aria-hidden="true">
  <div class="mini-marquee-track">
    <span>L'IA fait partie de ta semaine</span><span>Prochain niveau</span><span>Claude Code arrive</span><span>Toujours des phrases · jamais du code</span><span>Le terminal apprivoisé</span>
    <span>L'IA fait partie de ta semaine</span><span>Prochain niveau</span><span>Claude Code arrive</span><span>Toujours des phrases · jamais du code</span><span>Le terminal apprivoisé</span>
  </div>
</div>
```
3. Les marquees existants « Claude est installé… » (avant agents) et « Tu as ton premier agent… » (avant plus loin) restent tels quels — seuls leurs commentaires HTML passent à `02 → 03`→`03 → 04` et `03 → 04`→`04 → 05`.

### Édit I — Section peurs : 4 numéros d'étape à décaler
Uniquement ces chaînes (ne rien toucher d'autre dans les peurs) :
1. « Le guide de l'étape 02 te montre chaque clic de l'installation » → « Le guide de l'étape 03 te montre chaque clic de l'installation »
2. « Et dès l'étape 02, je te fais installer GitHub » → « Et dès l'étape 03, je te fais installer GitHub »
3. « Toute l'étape 01 se fait avec les versions gratuites » → « Les étapes 01 et 02 se font entièrement avec les versions gratuites »
4. « Claude Code arrive à l'étape 02 : il est inclus » → « Claude Code arrive à l'étape 03 : il est inclus »

### Édit J — JSON-LD (2 blocs à modifier, 2 intouchés)
1. **LearningResource** : `"description": "Parcours structuré en 4 étapes…"` → `"Parcours structuré en 5 étapes pour apprendre l'IA, la pratiquer au quotidien, puis passer à Claude Code et à la construction d'agents, à partir de zéro."` ; `"timeRequired": "PT2H30M"` → `"PT4H"`.
2. **Course** : `"name": "Apprendre l'IA · le parcours en 4 étapes"` → `en 5 étapes` ; `"courseWorkload": "PT5H"` → `"PT4H"` ; remplacer `hasPart` par :
```json
 "hasPart": [
  {"@type": "Course", "name": "Étape 01 · Poser les bases", "description": "Comprendre les bases de l'IA générative avant de toucher aux outils avancés. Niveau débutant absolu.", "url": "https://jerwis.fr/debutant", "position": 1},
  {"@type": "Course", "name": "Étape 02 · Mettre l'IA au travail", "description": "Pratiquer dans le navigateur avec les versions gratuites : prompts, résumés, vérification des réponses, visuels, choix de l'outil.", "url": "https://jerwis.fr/articles/ecrire-bon-prompt-non-dev", "position": 2},
  {"@type": "Course", "name": "Étape 03 · Passer à Claude Code", "description": "Le passage de Claude web à Claude Code : agentique, terminal, autonomie.", "url": "https://jerwis.fr/claude-code", "position": 3},
  {"@type": "Course", "name": "Étape 04 · Construire tes agents", "description": "Automatiser sans coder, puis monter ses premiers agents IA pour Gmail, contrats, ou des cas d'usage métier concrets.", "url": "https://jerwis.fr/articles/agents-ia-guide", "position": 4},
  {"@type": "Course", "name": "Étape 05 · Aller plus loin", "description": "Outils de vente, veille IA, et les travaux d'Andrej Karpathy pour comprendre le fond.", "url": "https://jerwis.fr/articles/karpathy", "position": 5}
 ]
```
3. BreadcrumbList et FAQPage : **NE PAS TOUCHER** (la FAQ ne contient aucun numéro d'étape).

### Édit K — Meta description (le « 4 étapes » n'y figure plus depuis la v2 — vérifier qu'aucun « 4 étapes »/« 13 articles » ne survit)
`grep -n "4 étapes\|13 articles\|2h30" apprendre.html` doit renvoyer **0** hors CHANGELOG à la fin des édits.

---

## 3. ÉDITS EN (`en/apprendre.html`) — contenu verbatim

Mêmes édits A→K. Conventions EN : hrefs **absolus** `/en/...` (ex. `href="/en/articles/ecrire-bon-prompt-non-dev"`), libellés boutons `Mark step 0X as completed`, pp-label `/ 5 steps completed`. Les 5 slugs d'articles existent tous en EN (parité 100 %).

### A — chips
```html
    <div class="parcours-hero-meta">
      <span><strong>5</strong>steps</span>
      <span><strong>24</strong>reads</span>
      <span><strong>~4h</strong>of reading</span>
      <span><strong>€0</strong>to read it all</span>
    </div>
```

### B — rail
```html
      <a href="#etape-01" class="progress-step active" data-color="teal" data-step="01">
        <span class="progress-step-num">01</span>
        <span class="progress-step-label">
          <strong>Lay the foundations</strong>
          <span>No prerequisites</span>
        </span>
      </a>
      <a href="#etape-02" class="progress-step" data-color="fuchsia" data-step="02">
        <span class="progress-step-num">02</span>
        <span class="progress-step-label">
          <strong>Practice daily</strong>
          <span>100% in your browser</span>
        </span>
      </a>
      <a href="#etape-03" class="progress-step" data-color="orange" data-step="03">
        <span class="progress-step-num">03</span>
        <span class="progress-step-label">
          <strong>Claude Code</strong>
          <span>Your first prompt that codes</span>
        </span>
      </a>
      <a href="#etape-04" class="progress-step" data-color="teal" data-step="04">
        <span class="progress-step-num">04</span>
        <span class="progress-step-label">
          <strong>Build an agent</strong>
          <span>Your first automations</span>
        </span>
      </a>
      <a href="#etape-05" class="progress-step" data-color="ink" data-step="05">
        <span class="progress-step-num">05</span>
        <span class="progress-step-label">
          <strong>Go further</strong>
          <span>Real cases · research</span>
        </span>
      </a>
```

### C — progress : `/ 4 steps completed` → `/ 5 steps completed`, `aria-valuemax="5"`, JS `n/5*100` + `n===5`.

### D — nouvelle étape 02 EN (bloc complet ; mêmes SVG watermarks que le FR §2.D)
```html
<!-- ========== STEP 02 — Put AI to work ========== -->
<section class="step s-fuchsia" id="etape-02">
  <div class="container">
    <header class="step-header">
      <div class="step-num-big">02</div>
      <div class="step-meta">
        <span class="step-kicker">Step 02 · Every day, nothing to install</span>
        <h2 class="step-title">Put AI<br><em>to work.</em></h2>
        <p class="step-intro">
          Before installing anything, we practice. Everything happens in your browser, with the free versions: you learn to write a request that gets a good result, you have a long document summarized, you fact-check what the AI tells you, you create your first visuals. <strong>By the end of this step, AI is already part of your week</strong> — and you'll know which tool suits you before moving up a level.
        </p>
        <div class="step-facts">
          <span><strong>5</strong>reads</span>
          <span><strong>~47 min</strong>total</span>
          <span><strong>Level</strong>Beginner</span>
          <span><strong>Tools</strong>100% free</span>
        </div>
      </div>
    </header>

    <div class="step-cards">

      <a class="article-card c-fuchsia" href="/en/articles/ecrire-bon-prompt-non-dev">
        [même SVG watermark crayon que FR 02.1]
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Read · 02.1</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Write a prompt<br>that gets<br><em>a good result.</em></h3>
          <div class="article-subtitle">— Role · Context · Format</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">What you walk away with</div>
          <p class="article-preview-text">The difference between a flat answer and a useful one comes down to how you ask. The full method, with before/after examples to copy.</p>
        </div>
      </a>

      <a class="article-card c-teal-fuchsia" href="/en/articles/resumer-pdf-video-avec-ia">
        [même SVG watermark document que FR 02.2]
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Read · 02.2</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Summarize a PDF,<br>a video, a<br><em>long document.</em></h3>
          <div class="article-subtitle">— The #1 everyday use case</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">What you'll do</div>
          <p class="article-preview-text">Contracts, reports, hour-long YouTube videos: get a reliable summary in 2 minutes, pick the right tool, and avoid the classic traps.</p>
        </div>
      </a>

      <a class="article-card c-teal" href="/en/articles/verifier-info-ia">
        [même SVG watermark loupe-check que FR 02.3]
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Read · 02.3</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Fact-check what<br>the AI tells you<br><em>(it makes things up).</em></h3>
          <div class="article-subtitle">— Hallucinations · Verification reflexes</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">Why it's essential</div>
          <p class="article-preview-text">AI can be wrong with perfect confidence. The reflexes to spot an invention, check it fast, and turn that flaw into an advantage.</p>
        </div>
      </a>

      <a class="article-card c-fuchsia-orange" href="/en/articles/creer-images-ia-gratuit">
        [même SVG watermark image que FR 02.4]
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Read · 02.4</span>
          <span class="article-pill">11 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Create your visuals<br>for free,<br><em>no designer.</em></h3>
          <div class="article-subtitle">— Gemini · ChatGPT · Canva</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">What you walk away with</div>
          <p class="article-preview-text">Real free-tier quotas, commercial usage rights, and the prompts that produce images you can actually use for your business.</p>
        </div>
      </a>

      <a class="article-card c-orange" href="/en/articles/choisir-ia-ecrire-coder-images">
        [même SVG watermark balance que FR 02.5]
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Read · 02.5</span>
          <span class="article-pill">9 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Choose your tool:<br>ChatGPT, Claude<br><em>or another?</em></h3>
          <div class="article-subtitle">— The honest 2026 comparison</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">What it's for</div>
          <p class="article-preview-text">Writing, creating, coding: which tool for which use, what the free versions are really worth, and when paying makes sense.</p>
        </div>
      </a>

    </div>

    <div class="step-done"><button type="button" class="step-done-btn" data-step="02">Mark step 02 as completed</button></div>

    <a href="#etape-03" class="step-next">
      <div>
        <div class="step-next-meta">— Next step · 03</div>
        <div class="step-next-title">Move to <em>Claude Code</em></div>
      </div>
      <span class="step-next-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </span>
    </a>

  </div>
</section>
```

### E/F/G — renumérotations EN : identiques au FR (badges `Read · 0X.Y`, kickers `Step 03 · Moving to Claude Code` etc. — garder les intitulés EN existants, ne changer QUE les numéros, classes de section et ancres, comme au §2). Carte EN 04.1 (automatiser) :
```html
      <a class="article-card c-teal" href="/en/articles/automatiser-taches-ia-sans-coder">
        [même SVG watermark engrenage que FR 04.1]
        <div class="article-top">
          <span class="article-badge"><span class="pulse"></span>Read · 04.1</span>
          <span class="article-pill">11 min</span>
        </div>
        <div class="article-middle">
          <h3 class="article-title">Automate your<br>repetitive tasks<br><em>without coding.</em></h3>
          <div class="article-subtitle">— The bridge between chat and agents</div>
        </div>
        <div class="article-preview">
          <div class="article-preview-label">What you'll understand</div>
          <p class="article-preview-text">Reminders, sorting, reports: the no-code tools that chain actions for you, and which ones are worth it in 2026. The step right before agents.</p>
        </div>
      </a>
```
step-facts EN étape 04 : `<span><strong>5</strong>reads</span>` + `~59 min`.

### H — marquees EN
01→02 :
```html
    <span>Foundations laid</span><span>Now we practice</span><span>All in your browser</span><span>Nothing to install</span><span>Your first AI reflex</span>
```
02→03 :
```html
    <span>AI is part of your week</span><span>Next level</span><span>Claude Code is coming</span><span>Always sentences · never code</span><span>The terminal, tamed</span>
```
(contenu dupliqué ×2 dans le track, comme partout).

### I — peurs EN : 4 chaînes
1. « The step 02 guide walks you through every click » → `step 03 guide`
2. « And from step 02, I have you set up GitHub » → `from step 03`
3. « All of step 01 works with the free versions » → « Steps 01 and 02 work entirely with the free versions »
4. « Claude Code comes in at step 02: it's included » → `at step 03`

### J — JSON-LD EN : miroir du §2.J (LearningResource description « 5 steps », timeRequired PT4H ; Course name « the 5-step path », courseWorkload PT4H, hasPart 5 entrées avec urls `/en/...` : `/en/debutant`, `/en/articles/ecrire-bon-prompt-non-dev`, `/en/claude-code`, `/en/articles/agents-ia-guide`, `/en/articles/karpathy`, descriptions traduites librement mais fidèles au FR).

---

## 4. QC (tout doit passer)

1. `node -e` parse des 4 JSON-LD ×2 fichiers (0 erreur).
2. `grep -c 'progress-step ' apprendre.html` = 5 ; `grep -c '<section class="step ' apprendre.html` = 5 ; idem EN.
3. `grep -n '"4 étapes"\|4 steps\|13 articles\|13 reads\|2h30\|PT2H30M\|PT5H' apprendre.html en/apprendre.html` → 0 résultat.
4. Aucune séquence de badges cassée : `grep -oE '0[0-9]\.[0-9]' apprendre.html | sort | uniq -c` → 01.1-01.3, 02.1-02.5, 03.1-03.4, 04.1-04.5, 05.1-05.7 exactement.
5. Les 6 nouveaux hrefs répondent (fichiers existants) : `articles/{ecrire-bon-prompt-non-dev,resumer-pdf-video-avec-ia,verifier-info-ia,creer-images-ia-gratuit,choisir-ia-ecrire-coder-images,automatiser-taches-ia-sans-coder}.html` + versions `en/articles/`.
6. Mots bannis charte : `grep -inE 'je te file|des trucs|ouais|kif|GMF' apprendre.html en/apprendre.html` → 0.
6bis. Placeholders du plan non résolus : `grep -c 'même SVG watermark' en/apprendre.html` → 0 (dans les blocs EN, chaque `[même SVG watermark … que FR 0X.Y]` doit avoir été remplacé par le `<svg class="article-watermark">…</svg>` exact du bloc FR correspondant du §2).
7. **Preview local** (serveur statique cleanUrls) : rail à 5 entrées cliquables, sections dans l'ordre, marquer une étape → compteur X/5 et fill correct, reset OK ; light + dark + 375 px ; console 0 erreur. ⚠️ Piège connu : le screenshot de l'outil preview rend NOIR après un scroll profond (bug de l'outil, pas du site) → pour valider visuellement une section basse, masquer temporairement les sections au-dessus via JS (`style.display='none'`) et screenshoter à scrollY=0, ou lire les computed styles. ⚠️ Piège thème : forcer `data-theme` via `setAttribute` après chargement donne des computed styles incohérents → poser `localStorage.setItem('theme','dark')` PUIS recharger.
8. Gate francité EN (mots-fonction FR dans le body) < 1 %.

## 5. Livraison

1. Commits par chemins explicites (`apprendre.html en/apprendre.html CHANGELOG.md CLAUDE.md`), message `feat(apprendre): parcours v3 — 5 étapes, pratique navigateur avant Claude Code`.
2. `git pull --rebase origin main` puis push.
3. Live check avec cache-bust `?cb=$(date +%s)` : FR + EN 200, `grep -c 'progress-step '` = 5 sur le HTML live, chips « 5 étapes ».
4. `CHANGELOG.md` : nouvelle entrée en haut (Pourquoi = point contrariant « Claude Code trop tôt », Livré = résumé des édits, Fichiers touchés, À venir = rien).
5. `CLAUDE.md` : section Parcours → « 5 étapes : 01 Poser les bases (teal) · 02 Mettre l'IA au travail (fuchsia) · 03 Passer à Claude Code (orange) · 04 Construire tes agents (teal) · 05 Aller plus loin (ink) ».

## 6. Pièges connus de ce repo (vécus)

- **zsh ne word-splitte pas `$VAR`** : boucles de fichiers en Node, pas en shell.
- localStorage `jerwis_parcours_done` des visiteurs existants contient "01".."04" : reste valide (le sens de "02" change pour eux, acceptable — ne PAS migrer, ne PAS reset).
- Les pages EN utilisent des hrefs absolus `/en/...`, les FR des relatifs — ne pas uniformiser.
- Le formulaire `parcours7j-form`, la section `whatis`, le quickwin et le bloc peurs (hors 4 chaînes du §2.I) ne bougent pas.
- Cache CDN : toujours vérifier le live avec `?cb=` avant de conclure à un échec.
- L'autopilot publie lun/mar/jeu/ven ~8-10h UTC et le cron news ~8h UTC tous les jours : `git pull --rebase` juste avant le push, sinon rejet non-fast-forward.

## 7. Prompt à donner à la session d'exécution

> Lis `docs/plan-apprendre-v3-5-etapes.md` et exécute-le intégralement. Tout le contenu (FR + EN) y est écrit verbatim et toutes les décisions sont prises : ta mission est purement mécanique — appliquer les édits A→K sur `apprendre.html` puis `en/apprendre.html`, passer la QC du §4, livrer selon le §5. N'invente aucun texte, ne reformule rien, respecte les pièges du §6.
