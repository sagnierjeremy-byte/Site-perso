/**
 * editorial-clusters.js — Cadre éditorial de Jérémy Sagnier
 *
 * 6 clusters qui correspondent à son personnage (entrepreneur, pas dev, teste l'IA au quotidien).
 * Chaque cluster a :
 *  - un multiplicateur qui booste ou pénalise les idées qui y matchent
 *  - une liste de keywords (matching par inclusion, sensible à la casse inférieure)
 *  - une priorité (1 = on tente de matcher celui-ci en premier)
 *
 * Utilisé par brainstorm.js pour scorer les propositions + par l'UI back-office
 * pour afficher des pills colorées et permettre le filtrage.
 */

export const CLUSTERS = [
  {
    id: 'claude-code',
    label: 'Claude Code tutos',
    icon: '⚙️',
    color: 'teal',
    multiplier: 1.25,
    priority: 1,
    stars: 3,
    description: 'Ton expertise quotidienne · skills, hooks, loops, MCP, sous-agents',
    keywords: [
      'claude code', 'claude-code', 'anthropic code',
      'skill', 'skills', 'subagent', 'sub-agent', 'sous-agent',
      'mcp', 'hook', 'loop', 'settings.json', 'slash command',
      'agent sdk', 'claude agent', 'agent api',
      'artifact', 'computer use', 'memory tool',
    ],
  },
  {
    id: 'agents-concrets',
    label: 'Agents IA concrets',
    icon: '🤖',
    color: 'fuchsia',
    multiplier: 1.25,
    priority: 2,
    stars: 3,
    description: 'Agents qui bossent pour toi · mails, leads, veille, CRM',
    keywords: [
      'built an agent', 'my agent', 'i built', 'i made',
      'gmail agent', 'email agent', 'mail agent',
      'crm agent', 'sales agent', 'veille', 'monitoring agent',
      'automation workflow', 'automate my', 'automate this', 'automate email', 'automate content',
      'ai workflow', 'agent workflow', 'workflow agent', 'n8n', 'zapier',
      'lindy', 'make.com', 'relevance ai',
      'langchain', 'langgraph', 'crewai', 'autogen',
      'multi-agent', 'agent orchestration',
    ],
  },
  {
    id: 'opinions-tranchees',
    label: 'Opinions tranchées',
    icon: '🎯',
    color: 'orange',
    multiplier: 1.10,
    priority: 3,
    stars: 2,
    description: 'Ton style signature · comparer, débunk, retour d\'XP honnête',
    keywords: [
      ' vs ', ' versus ', 'better than', 'overrated', 'underrated',
      'unpopular opinion', 'my take', 'honest review',
      'i tried', 'i tested', 'after using', 'after 6 months',
      'i switched', 'why i stopped', 'why i use',
      'lessons learned', 'what i learned', 'what went wrong',
      'mistakes', 'regret', 'disappointed',
    ],
  },
  {
    id: 'outils-ia',
    label: 'Outils IA du moment',
    icon: '🧰',
    color: 'teal',
    multiplier: 1.10,
    priority: 4,
    stars: 2,
    description: 'ChatGPT · Claude · Gemini · Cursor · Perplexity · comparatifs',
    keywords: [
      'chatgpt', 'gpt-5', 'gpt5', 'gpt-4o', 'openai',
      'claude sonnet', 'claude opus', 'claude haiku',
      'gemini', 'gemini 2.5', 'gemini flash',
      'perplexity', 'mistral', 'deepseek',
      'cursor', 'windsurf', 'zed', 'aider', 'cline', 'continue.dev',
      'comparison', 'comparatif', 'benchmark',
      'pricing', 'cost comparison',
    ],
  },
  {
    id: 'entrepreneuriat-ia',
    label: 'Entrepreneuriat + IA',
    icon: '💼',
    color: 'fuchsia',
    multiplier: 1.0,
    priority: 5,
    stars: 1,
    description: 'Ton terrain · ROI, stack solopreneur, monter un produit IA',
    keywords: [
      'solopreneur', 'solo founder', 'indie hacker', 'indiehacker',
      'built in public', 'bootstrap', 'bootstrapped',
      'mrr', 'arr', 'revenue milestone',
      'my saas', 'my startup', 'my business', 'side project',
      'productivity stack', 'ai stack', 'solo stack',
      'making money with ai', 'monetize ai',
    ],
  },
  {
    id: 'frontier',
    label: 'Frontier vulgarisé',
    icon: '🔬',
    color: 'orange',
    multiplier: 1.0,
    priority: 6,
    stars: 1,
    description: 'Ton angle Karpathy · papers, RL, internals LLM',
    keywords: [
      'karpathy', 'andrej karpathy',
      'paper', 'arxiv', 'research paper',
      'reinforcement learning', 'rlhf', 'rl agents',
      'transformer', 'attention is all', 'scaling laws',
      'fine-tun', 'pretrain', 'llm internals', 'mechanistic',
      'nanogpt', 'deep learning', 'neural network',
      'chain of thought', 'reasoning model', 'o1 reasoning',
    ],
  },
];

// Cluster "autre" implicite pour tout ce qui ne matche aucun · multiplicateur 0.5
export const NO_CLUSTER_MULTIPLIER = 0.5;

/**
 * Détecte le cluster qui matche un titre/description.
 * Retourne le cluster de plus haute priorité (1 = priorité max) qui matche, ou null.
 */
export function detectCluster(title, description = '') {
  const txt = (title + ' ' + description).toLowerCase();
  const sorted = [...CLUSTERS].sort((a, b) => a.priority - b.priority);
  for (const c of sorted) {
    for (const kw of c.keywords) {
      if (txt.includes(kw.toLowerCase())) return c;
    }
  }
  return null;
}

export function getClusterById(id) {
  return CLUSTERS.find(c => c.id === id) || null;
}
