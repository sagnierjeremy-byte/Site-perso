/**
 * pick-cover.mjs — choisit une cover de la bibliothèque (photos/covers/) pour un article.
 *
 * Déterministe : on matche d'abord des mots-clés du slug+titre (le plus pertinent),
 * puis la catégorie, sinon 'default'. Le style est unique (charte rétro FIESTA) donc
 * n'importe quelle cover reste cohérente — le pick optimise juste la PERTINENCE.
 *
 * Usage CLI : node scripts/blog/pick-cover.mjs <slug> "<categorie>" "<titre>"  → imprime le thème.
 * Import : import { pickCover } from './pick-cover.mjs'
 */

// thèmes disponibles dans photos/covers/ (cf. reference_jerwis_blog_image_style)
export const COVER_THEMES = [
  'default', 'ia-expliquee', 'tuto', 'automatisation', 'agents', 'securite',
  'choisir', 'prompt', 'images', 'business', 'reglementation', 'futur', 'data', 'podcast', 'veille',
];

// règles mot-clé → thème (ordre = priorité ; 1ère qui matche gagne)
const KEYWORD_RULES = [
  [/deepfake|arnaqu|fraude|s[ée]curit|phishing|escroqu|usurp/, 'securite'],
  [/ai.?act|r[ée]glement|\brgpd\b|\bloi\b|conformit|l[ée]gal|juridique/, 'reglementation'],
  [/choisir|quelle ia|comparat|\bvs\b|meilleur|gratuit ou payant/, 'choisir'],
  [/automatis|no.?code|zapier|make\b|workflow/, 'automatisation'],
  [/\bagent/, 'agents'],
  [/\bprompt|prompting|rctf|\b[ée]crire\b/, 'prompt'],
  [/\brag\b|donn[ée]es|document|base de connaiss|second cerveau|wiki/, 'data'],
  [/image|visuel|photo|dessin|logo|design|nano.?banana|midjourney/, 'images'],
  [/podcast|audio|voix|micro/, 'podcast'],
  [/veille|news|actualit|newsletter/, 'veille'],
  [/choisir|quelle ia|comparat|\bvs\b|meilleur|gratuit ou payant/, 'choisir'],
  [/business|argent|gagner|vente|vendre|prix|co[ûu]t|\broi\b|entreprise/, 'business'],
  [/futur|demain|2030|2040|monde|avenir|remplac/, 'futur'],
  [/\bmcp\b|c.?est quoi|expliqu|comprendre|d[ée]butant|\bllm\b|qu.?est.?ce/, 'ia-expliquee'],
  [/tuto|comment|guide|[ée]tape|cr[ée]er|construire|faire/, 'tuto'],
];

// fallback par catégorie (frontmatter `categorie` OU type listing)
const CATEGORY_FALLBACK = {
  'making-of': 'business', 'makingof': 'business',
  'opinion': 'futur', 'podcast': 'podcast',
  'tuto': 'tuto', 'vulgarisation': 'ia-expliquee', 'décryptage': 'ia-expliquee', 'decryptage': 'ia-expliquee',
};

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function pickCover(slug = '', categorie = '', titre = '') {
  const hay = norm(`${slug} ${titre}`);
  for (const [re, theme] of KEYWORD_RULES) if (re.test(hay)) return theme;
  const cat = norm(categorie);
  if (CATEGORY_FALLBACK[cat]) return CATEGORY_FALLBACK[cat];
  return 'default';
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const [slug, categorie, titre] = process.argv.slice(2);
  process.stdout.write(pickCover(slug, categorie, titre));
}
