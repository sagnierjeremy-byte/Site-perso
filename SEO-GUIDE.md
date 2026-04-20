# Guide SEO — À faire après le déploiement sur Vercel

Ce fichier n'est **pas déployé** (il reste en local). Suis ces étapes une fois le site en ligne.

---

## 1. Vérifier que tout est live

Avant toute chose, teste que ces URLs répondent (remplace `jeremysagnier.com` par ton vrai domaine si différent) :

| URL | Ce que tu dois voir |
|---|---|
| `https://jeremysagnier.com/` | Ton site |
| `https://jeremysagnier.com/robots.txt` | Le contenu texte (User-agent, Sitemap, etc.) |
| `https://jeremysagnier.com/sitemap.xml` | Un XML avec 10 URLs |

Si une des 3 ne répond pas, Vercel n'a pas servi le fichier. Vérifie qu'ils sont bien à la racine du projet.

---

## 2. Google Search Console (le plus important)

### Étape 1 — Créer la propriété

1. Va sur [search.google.com/search-console](https://search.google.com/search-console).
2. Clique **"Ajouter une propriété"**.
3. Choisis **"Préfixe de l'URL"** et colle `https://jeremysagnier.com/`.
4. Google te demande de vérifier que le site t'appartient. Méthode recommandée : **balise HTML**.

### Étape 2 — Ajouter la balise de vérification

Google te donne une balise du type :
```html
<meta name="google-site-verification" content="ABCDEF12345...">
```

Colle-la dans **l'`<head>`** de `index.html`, juste après `<meta name="viewport">`. Redéploie Vercel, puis retourne sur Search Console et clique **"Vérifier"**.

### Étape 3 — Soumettre le sitemap

Une fois vérifié :

1. Dans le menu gauche : **Sitemaps**.
2. Saisis `sitemap.xml` et clique **Envoyer**.
3. Statut attendu après 10 min : ✅ **Réussi**.

Google commencera à explorer tes pages dans les jours suivants.

---

## 3. Bing Webmaster Tools (bonus, 5 min)

Bing = 3% de part en France mais **source principale de Perplexity, ChatGPT Search, DuckDuckGo**. Donc utile quand l'IA cite tes articles.

1. [bing.com/webmasters](https://www.bing.com/webmasters).
2. **Importer depuis Google Search Console** (option disponible si déjà configuré).
3. Ça copie ta propriété + ton sitemap automatiquement.

---

## 4. Tests à faire une fois en ligne

### Validateurs officiels — à copier/coller

| Outil | URL | Ce que ça teste |
|---|---|---|
| Google Rich Results | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Schema.org parsé correctement (rich snippets) |
| Google PageSpeed | [pagespeed.web.dev](https://pagespeed.web.dev) | Core Web Vitals (LCP, CLS, FID) — vise 90+ |
| Twitter Card Validator | [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) | L'aperçu quand tu partages un lien sur X |
| Facebook Debugger | [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) | L'aperçu quand tu partages sur LinkedIn/Facebook |
| Schema Markup Validator | [validator.schema.org](https://validator.schema.org) | Valide le JSON-LD de chaque page |

### Checklist

- [ ] robots.txt accessible en HTTP
- [ ] sitemap.xml accessible en HTTP
- [ ] 0 erreur sur Rich Results Test pour `/` et 1-2 articles
- [ ] Aperçu Twitter Card correct (image + titre visible)
- [ ] PageSpeed Mobile >= 85

---

## 5. Stratégie post-lancement (90 premiers jours)

### Backlinks à activer en priorité

1. **LinkedIn bio** : ajoute le lien direct du site.
2. **X bio** (`@JeremySagnier`) : idem.
3. **YouTube** : dans la description de chaque vidéo, lien vers l'article du site qui correspond (ex : vidéo sur les loops → lien vers `/articles/loops-claude.html`).
4. **Signature email** : lien vers le site + newsletter.
5. **Comments autoritaires** : commente 2-3 articles/posts par semaine sur des sites de référence (Product Hunt, Hacker News, LinkedIn Top IA) avec un lien vers le tien quand c'est pertinent.

### Contenu pour faire grossir le SEO

- **1 article technique par mois** minimum (sur `/articles/`). Chaque article ciblant 1 mot-clé longue traîne précis.
- **1 newsletter par semaine** (ta promesse AI Playbook) : même si ce n'est pas indexé, ça crée du backlink quand les abonnés partagent.
- **Inscrire le site sur Indie Hackers, Product Hunt, Hacker News** — 3 backlinks qualitatifs instantanés.

### Signaux à surveiller dans Search Console

- **Impressions** (combien de fois tu apparais dans Google) : vise 1 000+/mois à 3 mois, 10 000+/mois à 12 mois.
- **Position moyenne** : vise < 30 à 6 mois sur tes mots-clés cibles.
- **Pages indexées** : les 10 pages doivent toutes être indexées sous 30 jours.
- **Core Web Vitals** : tout vert, sinon Google te pénalise au ranking mobile.

---

## 6. Mots-clés cibles principaux (déjà optimisés dans les pages)

| Page | Mots-clés principaux |
|---|---|
| `/` | jérémy sagnier, newsletter ia, ai playbook |
| `/debutant.html` | débuter claude ia, parcours non-dev, chat claude projects claude code |
| `/lexique.html` | clé api claude, mcp expliqué, cli terminal débutant, token ia, sonnet opus haiku |
| `/claude-code.html` | installer claude code, guide claude code français |
| `/articles/loops-claude.html` | loops claude code, /loop claude, automatiser claude |
| `/articles/hermes-agent.html` | hermes agent, nous research modele, ollama function calling |
| `/articles/karpathy.html` | andrej karpathy vulgarisé, karpathy cours ia |
| `/articles/llm-wiki-karpathy.html` | llm wiki karpathy, deuxième cerveau ia |
| `/articles/autoresearch-karpathy.html` | autoresearch karpathy, agents auto-améliorants |
| `/articles/construit-avec-claude-code-gmf.html` | cas concret claude code, outil vente ia |

---

## 7. Domain à changer si besoin

Si tu utilises un domaine autre que `jeremysagnier.com`, fais un **search-replace global** dans le dossier :

```bash
cd ~/Desktop/jeremy-sagnier-site/
grep -rl "jeremysagnier.com" . | xargs sed -i '' 's|jeremysagnier.com|TON-DOMAINE.com|g'
```

Vérifie ensuite :

```bash
grep -r "jeremysagnier.com" . --include="*.html" --include="*.xml" --include="*.txt"
```

Doit retourner 0 résultat.

---

**Fin du guide.** Si un point n'est pas clair, écris-moi. Bonne mise en ligne.
