#!/usr/bin/env node
/**
 * generate-draft.mjs — Étape 2 : un brief de recherche → un draft markdown complet.
 *
 * Lit research/<slug>.json, génère drafts/<slug>.md (frontmatter + corps), GROUNDED
 * sur les faits du brief (anti-hallucination : interdiction d'affirmer hors brief).
 *
 * Générateur = Claude si ANTHROPIC_API_KEY présente (voix calibrée), sinon Gemini (gratuit).
 *
 * Usage : node scripts/blog/generate-draft.mjs <slug> [--num=NN]
 * Sortie : drafts/<slug>.md
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from './llm.mjs';
import { TON_LEO, SEO_RULES } from './config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const slug = process.argv[2];
const num = (process.argv.find(a => a.startsWith('--num=')) || '--num=').split('=')[1] || '';
if (!slug) { console.error('Usage : node scripts/blog/generate-draft.mjs <slug>'); process.exit(2); }

const briefPath = path.join(ROOT, 'research', `${slug}.json`);
if (!existsSync(briefPath)) { console.error(`Brief introuvable : ${briefPath} (lance research.mjs d'abord)`); process.exit(2); }
const brief = JSON.parse(await readFile(briefPath, 'utf8'));
const type = brief.type || 'A';

const factsBlock = (brief.facts || []).map((f, i) => `[F${i + 1}] ${f.claim} (${f.date || 'n.d.'}) — source: ${f.source_url}`).join('\n');
const statsBlock = (brief.stats || []).map((s, i) => `[S${i + 1}] ${s.stat} (${s.date || 'n.d.'}) — source: ${s.source_url}`).join('\n');
const linksBlock = (brief.internal_links || []).map(l => `${l.url} — ${l.why}`).join('\n');
const faqBlock = (brief.faq || []).map(q => `- ${q}`).join('\n');

const minW = type === 'B' ? SEO_RULES.body_words_min_B : SEO_RULES.body_words_min_A;
const maxW = type === 'B' ? '' : ` et ${SEO_RULES.body_words_max_A} mots maximum`;

const prompt = `Tu écris un article de blog pour jerwis.fr, le blog de Jérémy Sagnier.

${TON_LEO}

SUJET : ${brief.topic}
ANGLE : ${brief.angle}
INTENTION DU LECTEUR : ${brief.intent}
TYPE : ${type === 'B' ? 'Making-of (récit vécu)' : 'Article SEO informatif'}

=== MATIÈRE FACTUELLE (tu n'as le droit d'affirmer QUE ce qui est ici) ===
FAITS :
${factsBlock}

STATISTIQUES :
${statsBlock}

RÈGLE ANTI-INVENTION ABSOLUE :
- N'affirme AUCUN fait, chiffre, nom propre ou date qui ne soit pas dans la matière ci-dessus.
- Si un chiffre te semble douteux ou invraisemblable, NE L'UTILISE PAS (mieux vaut l'omettre qu'inventer).
- Quand tu cites une stat, garde une formulation prudente et mentionne l'année.
- Tu n'es pas obligé d'utiliser tous les faits — choisis les plus solides.

=== LIENS INTERNES À PLACER (2 à 6, en markdown [texte](url), ancres variées) ===
${linksBlock}

=== STRUCTURE ATTENDUE ===
- Sections H2 (##) inspirées de : ${(brief.outline || []).join(' / ')}
- Un H2 tous les 250-350 mots. Corps : ${minW} mots minimum${maxW}.
- Inclure 1-2 encarts \`<div class="callout tip"><h4>Titre</h4><p>...</p></div>\` (ton avis perso). Titre d'encart court et chaleureux SANS être familier ni péremptoire (ex: "Mon conseil", "Le piège à éviter", "Ce que je retiens" — PAS "Mon avis tranché" ni "à mes dépens").
- IMPÉRATIF : termine l'article complètement, ne le coupe jamais en milieu de phrase ou de mot.
- Terminer par un H2 "## Questions fréquentes" avec ces questions (### par question) :
${faqBlock}
- Finir par un court H2 de conclusion personnelle ("## Ce que je retiens" ou similaire).
- Insérer 2 séparateurs de section style \`<!-- section k-fuchsia -->\` / \`<!-- section k-teal -->\` / \`<!-- section k-orange -->\` avant certains H2 (rotation des couleurs).

=== FORMAT DE SORTIE (markdown avec frontmatter YAML, RIEN d'autre autour) ===
---
slug: ${slug}
titre: "titre interne 50-60 caractères"
titre_seo: "titre SEO 40-65 caractères (sans le suffixe — par Jérémy Sagnier)"
description: "meta description 140-160 caractères, bénéfice lecteur en tête"
numero: "${num || '00'}"
categorie: "${type === 'B' ? 'Making-of' : 'Décryptage'}"
hero_ligne_1: "ligne 1 du H1 (2-3 mots)"
hero_ligne_2: "ligne 2"
hero_ligne_3: "ligne 3 (sera en italique)"
lead: "paragraphe hero ${SEO_RULES.lead_words_min}-${SEO_RULES.lead_words_max} mots, 1ère personne, commence par la question du lecteur"
duree: "X min"
niveau: "Débutant"
outils: "outil principal"
published: "${new Date().toISOString().slice(0, 10)}"
tldr:
  - "point 1 avec <strong>mot clé</strong>"
  - "point 2"
  - "point 3"
  - "point 4"
---

[CORPS MARKDOWN ICI — pas de # H1 (déjà géré par le hero), commence directement par un <!-- section --> puis ## ]

RÈGLE DE TUTOIEMENT (ton Leo de jerwis.fr) :
- TUTOIE le lecteur partout : "tu", "ton", "tes", "tu veux", "tu écris". JAMAIS de "vous"/"votre"/"vos".
- Vaut aussi pour les titres et les questions de la FAQ.

RÈGLE TYPOGRAPHIQUE FRANÇAISE STRICTE (très important) :
- TOUS les titres (##, ###, h4 d'encadré) en CASSE DE PHRASE française : SEULE la première lettre du titre est en majuscule, plus les noms propres. JAMAIS de Title Case anglo (Majuscule À Chaque Mot).
- Exemples corrects : "Les 4 piliers d'un bon prompt", "Comment itérer sur tes prompts", "Les erreurs qui plombent tes réponses".
- Exemples INTERDITS : "Les 4 Piliers d'un Bon Prompt", "Comment Itérer Sur Tes Prompts".
- Les noms propres gardent leur casse : Chain-of-Thought, Context Engineering, Claude, RCTF.

Écris maintenant l'article complet, en respectant le ton Leo À LA LETTRE. Pas de "dans cet article nous allons voir". Va au vécu, sois utile, sois chaleureux sans être familier. Termine l'article entièrement.`;

console.error(`• Génération du draft "${slug}" (Type ${type})…`);
const { provider, text } = await generate(prompt, {
  tier: type === 'B' ? 'makingof' : 'seo',
  temperature: 0.7,
  max_tokens: 16000,   // marge confortable : un article de 2500 mots ne doit jamais être tronqué
});
console.error(`  généré par : ${provider}`);

// nettoie : retire tout fence (```yaml / ```markdown / ```), puis démarre au 1er '---'
let md = text.trim()
  .replace(/^```[a-z]*\s*/i, '')   // fence d'ouverture avec n'importe quel tag
  .replace(/```\s*$/, '')           // fence de fermeture
  .trim();
const fmStart = md.indexOf('---');
if (fmStart === -1) {
  console.error('⚠️ Aucun frontmatter (---) trouvé. Dump :');
  console.error(md.slice(0, 400));
  process.exit(1);
}
md = md.slice(fmStart);  // tout préambule éventuel ("Voici l'article :", "yaml", etc.) supprimé

const outPath = path.join(ROOT, 'drafts', `${slug}.md`);
await writeFile(outPath, md + '\n', 'utf8');
console.error(`✓ Draft écrit : drafts/${slug}.md (${Buffer.byteLength(md, 'utf8')} octets)`);
console.log(outPath);
