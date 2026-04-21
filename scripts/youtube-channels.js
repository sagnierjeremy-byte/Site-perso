/**
 * youtube-channels.js — Sources YouTube pour le brainstorm
 *
 * Liste des chaînes à scanner chaque semaine pour alimenter le backlog d'idées.
 * Les 34 chaînes du site sont filtrées pour ne garder que celles pertinentes
 * vis-à-vis des 6 clusters éditoriaux (claude-code, agents, opinions, outils,
 * entrepreneuriat, frontier). Les catégories Lifestyle/Actu/Finance sont exclues.
 *
 * Chaque entrée :
 *   - handle     : @handle YouTube (sans l'URL)
 *   - label      : nom lisible pour les logs
 *   - priority   : 1 = essentiel, 2 = secondaire
 *   - boost      : multiplicateur de score (1.0 par défaut, 1.15 pour les chaînes pile dans le perso)
 *
 * Les channelId sont résolus dynamiquement via `resolveChannelId()` (cache JSON).
 */

export const YT_CHANNELS = [
  // === IA & Tech (7) · cluster claude-code / agents / frontier / outils-ia ===
  { handle: 'siliconcarnepod',   label: 'Silicon Carne',   priority: 1, boost: 1.15 },
  { handle: 'SamouraiDansant',   label: 'IA et Stratégie', priority: 1, boost: 1.15 },
  { handle: 'VisionIA-FR',       label: 'Vision IA',       priority: 1, boost: 1.15 },
  { handle: 'Underscore_',       label: 'Underscore_',     priority: 1, boost: 1.15 },
  { handle: 'melvynxdev',        label: 'Melvynx',         priority: 1, boost: 1.10 },
  { handle: 'GrandAnglePodcast', label: 'Grand Angle',     priority: 1, boost: 1.10 },
  { handle: 'grandanglenova',    label: 'Grand Angle Nova',priority: 1, boost: 1.10 },

  // === Business & Entrepreneuriat (9 sélectionnées sur 12) · cluster entrepreneuriat-ia / opinions ===
  // Skippés : Hasheur (crypto), Yomi Denzel (e-com), TheiCollection (lifestyle)
  { handle: 'AlexHormozi',       label: 'Alex Hormozi',    priority: 2, boost: 1.0 },
  { handle: 'leilahormozi',      label: 'Leila Hormozi',   priority: 2, boost: 1.0 },
  { handle: 'garyvee',           label: 'GaryVee',         priority: 2, boost: 1.0 },
  { handle: 'ImanGadzhi',        label: 'Iman Gadzhi',     priority: 2, boost: 1.0 },
  { handle: 'GrantCardone',      label: 'Grant Cardone',   priority: 2, boost: 1.0 },
  { handle: 'legendmedia',       label: 'LEGEND',          priority: 2, boost: 1.0 },
  { handle: 'oussamaammaroff',   label: 'Oussama Ammar',   priority: 2, boost: 1.05 },
  { handle: 'PodcastLeDéclic',   label: 'Le Déclic',       priority: 2, boost: 1.0 },
  { handle: 'antoineblanco99',   label: 'Antoine Blanco',  priority: 2, boost: 1.0 },
];

/**
 * Mots-clés du titre YouTube qui signalent du contenu pertinent pour ce site.
 * Un titre sans aucun de ces keywords sera filtré (bruit lifestyle / clickbait pur).
 * Appliqué en plus des KEYWORDS_NOISE standard de brainstorm.js.
 */
export const YT_SIGNAL_KEYWORDS = [
  // IA / tech
  'ia', 'ai', 'intelligence artificielle', 'gpt', 'chatgpt', 'claude', 'gemini',
  'agent', 'llm', 'modèle', 'anthropic', 'openai', 'mistral',
  'prompt', 'automatisation', 'automatiser', 'n8n', 'zapier', 'make',
  'mcp', 'claude code', 'cursor', 'copilot',
  // Entrepreneuriat
  'entreprise', 'entrepreneur', 'solopreneur', 'freelance', 'business',
  'startup', 'saas', 'product', 'produit', 'monétis',
  'scale', 'scaling', 'scaler', 'croissance', 'revenus', 'chiffre d\'affaires',
  'équipe', 'recrutement', 'marque personnelle', 'personal brand',
  // Ops / workflow
  'productivité', 'productive', 'workflow', 'système', 'process',
  'outil', 'stack', 'tool',
];
