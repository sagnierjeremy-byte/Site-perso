#!/usr/bin/env node
/**
 * linkedin-post.mjs — décline un article publié en post LinkedIn prêt à coller.
 *
 * Recette validée par Jérémy (2026-07-21) :
 *   hook = 1 phrase sujet-verbe-conséquence en mots simples + avis tranché en ligne 2,
 *   puis chiffre qui pique, pique d'humour, renversement contrarian, question binaire.
 *   Jamais un résumé d'article. Lien UNIQUEMENT en 1er commentaire (l'algo LinkedIn
 *   pénalise les liens dans le corps). Tutoiement, ton Leo, zéro hashtag.
 *
 * Règles anti-IA (demande Jérémy 2026-08-28) : zéro tiret cadratin/demi-cadratin
 *   (gate mécanique bloquante, sans substitution par « : » qui est le même tic),
 *   plus un bloc de règles de style anti-détection dans le prompt système.
 *   29 des 30 premiers posts contenaient des — : l'exemple few-shot en avait un.
 *
 * Usage : node scripts/blog/linkedin-post.mjs <slug> [--force]
 * Écrit : linkedin/<slug>.md (post + 1er commentaire). Idempotent sans --force.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { claude, openrouter, hasClaude, hasOpenRouter } from './llm.mjs';
import { MOTS_BANNIS, TICS_IA } from './config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const slug = process.argv[2];
const FORCE = process.argv.includes('--force');
if (!slug) { console.error('Usage : linkedin-post.mjs <slug> [--force]'); process.exit(2); }

const outPath = path.join(ROOT, 'linkedin', `${slug}.md`);
if (existsSync(outPath) && !FORCE) { console.error(`• linkedin/${slug}.md existe déjà (--force pour régénérer)`); process.exit(0); }

const draftPath = path.join(ROOT, 'drafts', `${slug}.md`);
if (!existsSync(draftPath)) { console.error(`✗ draft introuvable : drafts/${slug}.md`); process.exit(1); }
const { data: fm, content: body } = matter(await readFile(draftPath, 'utf8'));
const articleUrl = `https://jerwis.fr/articles/${slug}`;

const EXEMPLE = `Google va bientôt arrêter de t'envoyer des visiteurs.
Et je dis : tant mieux.

À partir du 23 septembre, en France, l'IA de Google répondra directement en haut de la page, avant tous les liens. Là où c'est déjà en place, les sites ont perdu 61 % de leurs clics.

Tout le monde panique. Pas moi.

Ce qui va mourir, ce n'est pas le web. C'est le contenu écrit pour les robots. Les dix « Top 7 des meilleurs CRM » identiques, que même leurs auteurs n'ont jamais relus.

Personne ne les pleurera.

Ce qui va survivre : le contenu signé par quelqu'un qui a vraiment vécu son sujet. L'IA de Google ne cite pas les usines à contenu. Elle cite des humains identifiables.

Au moment exact où tout le monde se met à produire du texte à la chaîne, c'est l'expérience humaine qui devient ce qui rapporte le plus.

Mon décryptage complet en commentaire.

Toi, tu écris pour Google ou pour quelqu'un ?`;

const system = `Tu écris les posts LinkedIn de Jérémy Sagnier (entrepreneur curieux d'IA, PAS développeur, ne jamais le présenter comme dev/codeur). Chaque post décline un article de son blog jerwis.fr pour apporter de la valeur nativement dans le feed et donner envie de lire l'article.

STRUCTURE OBLIGATOIRE (recette validée, ne pas dévier) :
1. HOOK ligne 1 : une phrase sujet-verbe-conséquence, en mots SIMPLES qu'un lecteur pressé comprend instantanément. Zéro terme technique, zéro nom de produit obscur, zéro métaphore à décoder.
2. Ligne 2 : un AVIS TRANCHÉ, assumé, un peu contrariant (« Et je dis : tant mieux. » / « Et c'est une excellente nouvelle. » / « Moi, ça ne m'inquiète pas du tout. »).
3. Corps : UN chiffre qui pique (tiré des faits fournis, JAMAIS inventé), UNE pique d'humour ou de cruauté légère, UN renversement de perspective. Pas de résumé d'article.
4. Avant-dernière ligne : « … en commentaire. » (le lien n'est JAMAIS dans le corps).
5. Dernière ligne : une question BINAIRE, simple, un peu provocante, qui invite à commenter.

RÈGLES DE FORME :
- 800 à 1200 caractères MAX. Lignes courtes. Une idée par ligne. Sauts de ligne généreux.
- Tutoiement. 1ère personne. Chaleureux mais jamais familier (pas d'argot).
- Jargon interdit, ou traduit immédiatement en mots simples.
- Pas d'emojis décoratifs (les flèches → sont tolérées pour les listes). Pas de hashtags.
- Chaque phrase doit être compréhensible seule, au premier coup d'œil.

RÈGLES ANTI-IA (un post qui « sent l'IA » est un post raté ; relis-toi avec ça en tête avant de rendre) :
- JAMAIS de tiret cadratin (—) ni demi-cadratin (–), nulle part, y compris le 1er commentaire. Et ne le remplace pas par un « : » planté au milieu de la phrase, c'est le même tic. Réécris vraiment : deux phrases courtes, une virgule, ou une parenthèse.
- JAMAIS d'énumération de trois (« simple, rapide, efficace »). La liste de trois est LA signature IA. Un élément, deux, ou quatre.
- Le renversement « Ce n'est pas X. C'est Y. » : UNE seule fois par post, jamais plus.
- Pas d'anaphore mécanique (trois phrases qui démarrent pareil), pas de paragraphes symétriques, pas de question rhétorique auto-répondue (« Le résultat ? », « La bonne nouvelle ? »).
- Casse le rythme : une phrase de trois mots après une longue. Deux phrases voisines ne doivent jamais avoir la même construction.
- Tournures bannies : « à l'ère de », « dans un monde où », « en résumé », « au final », « une chose est sûre », « ce qui est certain », « spoiler », « accroche-toi », « plonger dans », « révolutionne », « game-changer », « booster », « incontournable », « sans précédent », « véritable ».
- Autorisé et bienvenu (ça fait humain) : commencer par « Et », « Mais », « Sauf que ». Une phrase sans verbe. Un aparté entre parenthèses.

EXEMPLE VALIDÉ (calque ce niveau, pas ce contenu) :
${EXEMPLE}

FORMAT DE SORTIE STRICT :
Le post, puis une ligne exactement « ---COMMENTAIRE--- », puis le 1er commentaire (1 phrase d'accroche + l'URL fournie). Rien d'autre.`;

const basePrompt = `ARTICLE À DÉCLINER :
Titre : ${fm.titre}
Description : ${fm.description}
URL (pour le 1er commentaire uniquement) : ${articleUrl}

CONTENU (source unique des faits et chiffres, n'invente rien d'autre) :
${body.slice(0, 12000)}

Écris le post LinkedIn.`;

async function generer(feedback) {
  const prompt = feedback
    ? `${basePrompt}\n\nATTENTION : ton essai précédent a été rejeté par la vérification mécanique pour : ${feedback}. Corrige exactement ces points, sans dégrader le reste.`
    : basePrompt;
  const opts = { system, temperature: 0.8, max_tokens: 2000 };
  if (await hasClaude()) {
    try { return (await claude(prompt, { ...opts, model: 'claude-sonnet-4-6' })).text; }
    catch (e) { console.error(`  ⟳ Claude KO (${e.message.slice(0, 80)}) → fallback OpenRouter…`); }
  }
  // Kimi K2.6 est un modèle « thinking » : avec un max_tokens court il consomme tout en
  // raisonnement et renvoie un content vide (finish: length). 16k comme le juge de la gate.
  if (await hasOpenRouter()) return (await openrouter(prompt, { ...opts, max_tokens: 16000 })).text;
  throw new Error('Aucune clé LLM disponible');
}

// ── gates mécaniques : mots bannis, tirets, tics IA (config.mjs), longueur, structure ──
function verifier(post, comment) {
  const errs = [];
  for (const m of MOTS_BANNIS) if (new RegExp(m, 'i').test(post)) errs.push(`mot banni : ${m}`);
  // Anti-IA : aucun tiret cadratin/demi-cadratin, ni tiret ASCII utilisé en ponctuation
  // (« mot - mot » ou puce « - » en début de ligne ; les mots composés restent permis).
  if (/[—–]/.test(post) || /[—–]/.test(comment)) errs.push('tiret cadratin/demi-cadratin (interdit, réécrire la phrase)');
  if (/ - /.test(post) || /^\s*-\s/m.test(post)) errs.push('tiret ASCII en ponctuation ou en puce (interdit, flèche → ou réécriture)');
  for (const t of TICS_IA) if (new RegExp(t, 'i').test(post)) errs.push(`tic IA : ${t}`);
  const pivots = (post.match(/\bn(?:'|’)est pas\b|\bne sont pas\b/gi) || []).length;
  if (pivots >= 3) errs.push(`renversement « n'est pas » répété ${pivots} fois (max 2)`);
  if (post.length > 1500) errs.push(`trop long (${post.length} car.)`);
  if (post.length < 400) errs.push(`trop court (${post.length} car.)`);
  if (!/commentaire/i.test(post)) errs.push('pas de mention « en commentaire »');
  if (/https?:\/\//.test(post)) errs.push('lien dans le corps du post (interdit)');
  if (!/\?\s*$/.test(post.trim())) errs.push('ne se termine pas par une question');
  if (!comment.includes(articleUrl)) errs.push('1er commentaire sans l’URL');
  return errs;
}

let post = null, comment = null, feedback = null;
for (let i = 1; i <= 3 && !post; i++) {
  console.error(`• Génération post LinkedIn "${slug}" (essai ${i}/3)…`);
  let raw;
  try {
    raw = (await generer(feedback)).trim();
  } catch (e) {
    // Une erreur LLM/réseau ne doit pas tuer le script au 1er essai : le 2e peut passer.
    // Vécu le 27-07-2026 — « OpenRouter réponse vide » a interrompu la génération alors
    // qu'un second appel aurait suffi (Kimi renvoie souvent un content vide au 1er coup).
    console.error(`  ✗ génération KO : ${e.message.slice(0, 120)}`);
    continue;
  }
  const [p, c] = raw.split(/^-{3}COMMENTAIRE-{3}$/m).map(s => (s || '').trim());
  const errs = verifier(p || '', c || '');
  if (errs.length) { console.error(`  ✗ gate : ${errs.join(' · ')}`); feedback = errs.join(' · '); continue; }
  post = p; comment = c;
}
if (!post) { console.error('✗ Génération échouée après 3 essais.'); process.exit(1); }

await mkdir(path.join(ROOT, 'linkedin'), { recursive: true });
const md = `---
slug: ${slug}
article: ${articleUrl}
generated: '${new Date().toISOString().slice(0, 10)}'
---

## Post

${post}

## 1er commentaire

${comment}
`;
await writeFile(outPath, md, 'utf8');
console.error(`✓ linkedin/${slug}.md écrit (${post.length} car.)`);
console.log(outPath);
