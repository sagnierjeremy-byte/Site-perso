#!/usr/bin/env node
/**
 * SEO-B10 · AI Overviews / SGE optimization
 *
 * Insère un encart "Réponse rapide" (40-60 mots, style factuel 3e personne)
 * juste avant le bloc TL;DR de chaque article ciblé.
 *
 * Cible : les premiers 40-60 mots visibles aux crawlers Google AI Overviews,
 * Perplexity, ChatGPT Browse — qui décident en un coup d'œil si l'article
 * répond à la requête. Sans cette réponse directe, ils ne citent pas.
 *
 * L'encart est COMPLÉMENTAIRE au TL;DR (qui reste, mais est trop long et
 * narratif pour l'extraction IA). Style 3e personne, factuel, pas de "je".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');

// 10 articles stratégiques + réponse factuelle (50-60 mots, 3e personne)
// Rédigée à partir du contenu réel de chaque article (pas d'hallucination).
const ANSWERS = [
  {
    slug: 'loops-claude',
    answer: `Une loop Claude Code est une boucle d'exécution autonome où Claude relance une commande à intervalles réguliers ou décide lui-même du moment de réitérer. Deux modes existent : timed loop (intervalles fixes, coût prévisible) et dynamic loop (Claude choisit, coût variable). La loop nécessite une session ouverte ; pour un fonctionnement persistant, Anthropic propose Routines.`,
  },
  {
    slug: 'hermes-agent',
    answer: `Un Hermes Agent est un assistant IA personnalisé qui lit une boîte mail, classe les messages selon des règles définies et rédige des brouillons de réponse. Construit avec Claude connecté à Gmail via OAuth, il s'appuie sur des instructions en langage naturel. Comptez un après-midi pour la première version, sans aucune ligne de code à écrire soi-même.`,
  },
  {
    slug: 'karpathy',
    answer: `Andrej Karpathy est un chercheur en intelligence artificielle, ancien directeur IA de Tesla et co-fondateur d'OpenAI. PhD à Stanford sous Fei-Fei Li, il a fondé en 2024 Eureka Labs, une startup dédiée à l'éducation IA. Il enseigne via YouTube les concepts fondamentaux des LLM, tokens et prompt engineering, accessibles sans bagage technique préalable.`,
  },
  {
    slug: 'agents-ia-guide',
    answer: `Un agent IA est un LLM qui exécute des outils en boucle pour atteindre un objectif, selon la définition de Simon Willison. Sans outils, sans boucle, sans objectif, ce n'est qu'un chatbot. Trois approches existent en 2026 : no-code (Lindy, Zapier), low-code (Claude Code), full développement. Budget de 15 € à plusieurs milliers d'euros par mois selon la complexité.`,
  },
  {
    slug: 'llm-local-pour-non-dev',
    answer: `Faire tourner un LLM en local consiste à installer un modèle d'IA (Mistral, Llama, DeepSeek) directement sur son ordinateur, sans abonnement ni connexion internet. La méthode standard combine Ollama (moteur d'exécution) et Open WebUI (interface type ChatGPT). Configuration recommandée : 16 Go de RAM minimum. Avantage clé : les données ne quittent jamais la machine.`,
  },
  {
    slug: 'superpowers',
    answer: `Superpowers est un plugin Claude Code créé par Jesse Vincent qui impose une méthodologie stricte : brainstorm, plan, tests avant écriture de code. Le plugin le plus installé du marketplace Anthropic (163 000 stars GitHub). Il fournit 14 skills qui se déclenchent automatiquement selon le contexte. Recommandé sur les vrais projets, désactivable en une commande pour les tâches rapides.`,
  },
  {
    slug: 'claude-code-workflow-tips',
    answer: `Utiliser Claude Code en professionnel demande une discipline de prompt : présenter un plan avant d'exécuter, valider chaque étape, documenter les décisions dans un CLAUDE.md. Sur 6 mois d'usage quotidien, un non-développeur peut livrer 11 projets, environ 1 850 commits et économiser 12 h/semaine. Abonnement Claude Code Max requis pour usage intensif (200 $/mois).`,
  },
  {
    slug: 'dev-browser',
    answer: `Dev-browser est un outil qui permet à Claude de piloter un navigateur web : visiter une page, remplir un formulaire, prendre un screenshot, scraper du contenu. Installé en ligne de commande, il fonctionne en mode headless (sans interface) ou visible, et peut se connecter à un Chrome existant. Usage typique : tests d'interface, veille concurrentielle, vérification de sources.`,
  },
  {
    slug: 'monde-ia-5-10-20-ans',
    answer: `À horizon 2030-2045, l'intelligence artificielle générale transformera la santé (diagnostic IA généralisé), le travail (la plupart des tâches cognitives automatisables) et l'éducation (tuteurs IA personnalisés). Le basculement ne sera pas une IA imposée mais un choix collectif : préférer le médecin IA, le prof IA, le conducteur IA. Préparer les enfants à ce monde devient un enjeu éducatif majeur.`,
  },
  {
    slug: 'outil-vente-claude-code',
    answer: `Construire un outil de vente avec Claude Code consiste à transformer un document de vente statique (fichier Word, PDF) en application interactive qui affiche le bon script selon le profil prospect. Trois soirées suffisent pour un non-développeur, avec Claude Code qui génère le code à partir d'instructions en langage naturel. Cas réel : 40 pages Word converties en outil utilisable dès le lendemain.`,
  },
];

// HTML de l'encart — inline styles pour éviter dépendance à un CSS partagé
// (les articles n'importent pas main.css, ils ont chacun leur <style> bloc)
function buildAnswerCard(answer) {
  return `<!-- AI Overviews · réponse directe -->
<div class="container">
  <aside class="answer-card" aria-label="Réponse directe" style="margin:20px 0 30px; padding:16px 20px; background:var(--bg-2,#F4EFE6); border-left:4px solid var(--teal,#00B2A9); border-radius:6px; font-size:15px; line-height:1.55; color:var(--ink-soft,#3A3A3A)">
    <p style="margin:0"><strong style="color:var(--ink,#0A0A0A); margin-right:6px">Réponse rapide.</strong>${answer}</p>
  </aside>
</div>
<!-- /AI Overviews -->
`;
}

function patchArticle(slug, answer) {
  const file = path.join(ARTICLES_DIR, `${slug}.html`);
  if (!fs.existsSync(file)) {
    return { slug, ok: false, reason: 'file not found' };
  }

  let html = fs.readFileSync(file, 'utf8');

  // Idempotence
  if (html.includes('class="answer-card"')) {
    return { slug, ok: true, skipped: true, reason: 'already patched' };
  }

  const card = buildAnswerCard(answer);

  // Pattern d'insertion : juste avant le `<div class="container">` qui contient
  // le `<div class="tldr">`. On cible le premier match (qui est toujours le TL;DR
  // de l'article, jamais celui d'un autre composant).
  //
  // Regex tolérante au whitespace pour matcher la même structure sur tous les
  // articles, peu importe les commentaires HTML qui précèdent.
  const tldrPattern = /(<div class="container">\s*<div class="tldr">)/;
  const match = html.match(tldrPattern);
  if (!match) {
    return { slug, ok: false, reason: 'no tldr container found' };
  }

  html = html.replace(tldrPattern, `${card}\n${match[1]}`);
  fs.writeFileSync(file, html);
  return { slug, ok: true };
}

const results = ANSWERS.map(({ slug, answer }) => patchArticle(slug, answer));

console.log('SEO-B10 · Answer cards inserted\n');
for (const r of results) {
  if (r.ok && r.skipped) {
    console.log(`  - ${r.slug} : skipped (${r.reason})`);
  } else if (r.ok) {
    console.log(`  - ${r.slug} : OK`);
  } else {
    console.log(`  - ${r.slug} : FAIL — ${r.reason}`);
  }
}

const okCount = results.filter((r) => r.ok && !r.skipped).length;
const skipCount = results.filter((r) => r.skipped).length;
const failCount = results.filter((r) => !r.ok).length;
console.log(`\nTotal : ${okCount} patched · ${skipCount} skipped · ${failCount} failed`);

if (failCount > 0) process.exit(1);
