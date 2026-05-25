/* lexique-tooltip.js — tooltip glossaire auto pour jerwis.fr
   Scanne <p>, <li>, <td>, <small>, wrappe la 1re occurrence des 12 termes
   de base avec un tooltip qui affiche la définition courte au hover/focus.
   Garde-fous : skip <a>, headings, <code>, .lex-az-term, .lex-tooltip. */

(function () {
  'use strict';

  var LEX_BASE = {
    'llm': { label: 'LLM', def: 'Un modèle qui a digéré beaucoup de texte et répond comme un assistant cultivé.' },
    'modèle': { label: 'Modèle', def: 'Le cerveau IA derrière ChatGPT, Claude, Gemini. Tu lui parles, il répond.' },
    'prompt': { label: 'Prompt', def: 'La demande que tu écris au modèle. Précise = bonne réponse, vague = mou.' },
    'token': { label: 'Token', def: 'Un morceau de mot (~3-4 caractères). Tout se facture et se mesure en tokens.' },
    'contexte': { label: 'Contexte', def: 'La mémoire de travail du modèle pendant la conversation en cours.' },
    'hallucination': { label: 'Hallucination', def: 'Quand le modèle invente une réponse fausse avec assurance. Le risque n°1.' },
    'embedding': { label: 'Embedding', def: 'L’empreinte numérique du sens d’un texte. Permet de comparer deux idées.' },
    'vecteur': { label: 'Vecteur', def: 'Un classeur intelligent qui range tes documents par sens, pas par alphabet.' },
    'rag': { label: 'RAG', def: 'L’assistant qui consulte tes archives avant de répondre. Parade aux hallucinations.' },
    'agent': { label: 'Agent', def: 'Un modèle autonome qui enchaîne des étapes seul, comme un stagiaire avec une mission.' },
    'mcp': { label: 'MCP', def: 'Une prise jack universelle pour brancher n’importe quel outil sur le modèle.' },
    'workflow': { label: 'Workflow', def: 'Une recette fixe d’étapes IA prédéfinies. Plus fiable qu’un agent autonome.' },
    'chunk': { label: 'Chunk', def: 'Un morceau de document découpé pour que le modèle puisse l’avaler.' }
  };

  var TERMS = Object.keys(LEX_BASE);
  // Regex insensible à la casse, word boundaries Unicode-safe
  var TERM_REGEX = new RegExp('\\b(' + TERMS.map(function (t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('|') + ')\\b', 'i');

  var TARGET_SELECTORS = 'p, li, td, small';
  var SKIP_SELECTORS = 'a, h1, h2, h3, h4, h5, h6, code, pre, .lex-az-term, .lex-tooltip, .term-meta, .term-back, .term-kicker, .section-kicker, .mini-marquee, .term-related-links, .term-side-cta, .term-final a, .base-num, .step-num, .choice-label, .perso-kicker';

  function isInsideSkipped(node) {
    var el = node.parentElement;
    while (el) {
      if (el.matches && el.matches(SKIP_SELECTORS)) return true;
      el = el.parentElement;
    }
    return false;
  }

  function normalizeTerm(raw) {
    return raw.toLowerCase();
  }

  function processTextNode(textNode, seenInBlock) {
    var match = TERM_REGEX.exec(textNode.nodeValue);
    if (!match) return false;
    var key = normalizeTerm(match[1]);
    if (seenInBlock[key]) return false;
    var entry = LEX_BASE[key];
    if (!entry) return false;

    var before = textNode.nodeValue.slice(0, match.index);
    var matched = match[0];
    var after = textNode.nodeValue.slice(match.index + matched.length);
    var parent = textNode.parentNode;
    if (!parent) return false;

    var span = document.createElement('span');
    span.className = 'lex-tooltip';
    span.setAttribute('tabindex', '0');
    span.setAttribute('role', 'button');
    span.setAttribute('aria-label', matched + ' — définition');
    span.dataset.lexKey = key;
    span.textContent = matched;

    if (before) parent.insertBefore(document.createTextNode(before), textNode);
    parent.insertBefore(span, textNode);
    if (after) parent.insertBefore(document.createTextNode(after), textNode);
    parent.removeChild(textNode);

    seenInBlock[key] = true;
    return true;
  }

  function walkBlock(block) {
    var seen = {};
    // Capture text nodes first (don't mutate during walk)
    var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (isInsideSkipped(node)) return NodeFilter.FILTER_REJECT;
        if (!TERM_REGEX.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    var cur;
    while ((cur = walker.nextNode())) nodes.push(cur);
    for (var i = 0; i < nodes.length; i++) {
      processTextNode(nodes[i], seen);
    }
  }

  // Bubble singleton
  var bubble = null;
  function ensureBubble() {
    if (bubble) return bubble;
    bubble = document.createElement('span');
    bubble.className = 'lex-tooltip-bubble';
    bubble.setAttribute('role', 'tooltip');
    bubble.id = 'lex-tooltip-bubble';
    document.body.appendChild(bubble);
    return bubble;
  }

  function showBubble(target) {
    var key = target.dataset.lexKey;
    var entry = LEX_BASE[key];
    if (!entry) return;
    var b = ensureBubble();
    b.innerHTML = '<strong>' + entry.label + '</strong>' + entry.def;
    target.setAttribute('aria-describedby', b.id);
    // Position
    var rect = target.getBoundingClientRect();
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    b.style.position = 'absolute';
    b.style.top = (rect.top + scrollY - 10) + 'px';
    b.style.left = (rect.left + scrollX + rect.width / 2) + 'px';
    b.style.transform = 'translate(-50%, -100%)';
    b.classList.add('is-visible');
  }

  function hideBubble(target) {
    if (target) target.removeAttribute('aria-describedby');
    if (bubble) bubble.classList.remove('is-visible');
  }

  function bindEvents() {
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('.lex-tooltip');
      if (t) showBubble(t);
    });
    document.addEventListener('mouseout', function (e) {
      var t = e.target.closest && e.target.closest('.lex-tooltip');
      if (t) hideBubble(t);
    });
    document.addEventListener('focusin', function (e) {
      var t = e.target.closest && e.target.closest('.lex-tooltip');
      if (t) showBubble(t);
    });
    document.addEventListener('focusout', function (e) {
      var t = e.target.closest && e.target.closest('.lex-tooltip');
      if (t) hideBubble(t);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideBubble(document.activeElement);
    });
  }

  function init() {
    var blocks = document.querySelectorAll(TARGET_SELECTORS);
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].closest(SKIP_SELECTORS)) continue;
      walkBlock(blocks[i]);
    }
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
