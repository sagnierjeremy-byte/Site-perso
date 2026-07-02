/*
  AI summarize bar
  -----------------
  Insère automatiquement après le .tldr (ou en haut de la 1re .block) une
  barre « Demande à une IA de te le résumer » avec :
  - 2 boutons directs : Perplexity (auto-submit) + ChatGPT (hints=search)
  - 1 dropdown : Claude, Gemini, Le Chat (Mistral), Copilot — copy prompt
    + open la home de l'IA en nouvel onglet
  - Toast confirmation au copy
  Zéro dépendance.
*/

(function () {
  if (typeof window === 'undefined') return;
  if (document.querySelector('.ai-summarize')) return; // déjà injectée

  function init() {
    // Trouve un point d'ancrage : .tldr d'abord, sinon 1er h2 de section.block
    const tldr = document.querySelector('.tldr');
    const firstBlock = document.querySelector('section.block');
    if (!tldr && !firstBlock) return; // pas un article, on sort

    // Récupère le titre d'article + l'URL canonique (ou window.location.href)
    const canonical = document.querySelector('link[rel="canonical"]');
    const articleUrl = canonical ? canonical.href : window.location.href;
    const title = document.title.replace(/ — par Jérémy Sagnier$/, '').trim();

    // Libellés lang-aware (page EN sous /en/ → <html lang="en">)
    const isEN = document.documentElement.lang === 'en';
    const T = isEN ? {
      aria: 'Ask an AI to summarize this article',
      label: 'Too long? Ask an AI to summarize it for you:',
      more: 'Other AIs',
      claude: 'Copy &amp; open Claude', gemini: 'Copy &amp; open Gemini', mistral: 'Copy &amp; open Le Chat',
      copilot: 'Copy &amp; open Copilot', copyOnly: 'Copy the prompt only',
      hint: "The prompt is copied to your clipboard. Paste it into the AI's chat bar.",
    } : {
      aria: 'Demande à une IA de résumer cet article',
      label: 'Trop long ? Demande à une IA de te le résumer :',
      more: 'Autres IA',
      claude: 'Copier &amp; ouvrir Claude', gemini: 'Copier &amp; ouvrir Gemini', mistral: 'Copier &amp; ouvrir Le Chat',
      copilot: 'Copier &amp; ouvrir Copilot', copyOnly: 'Copier le prompt seul',
      hint: "Le prompt est copié dans ton presse-papier. Colle-le dans la barre de chat de l'IA.",
    };

    // Construit le prompt (dans la langue de la page)
    const prompt = (isEN
      ? 'Summarize this article for me in 5 key points, in English: '
      : 'Résume-moi cet article en 5 points clés, en français : ') + articleUrl;
    const promptLong = isEN
      ? 'Summarize this article for me in 5 key points, in English.\n' +
        'Article: ' + articleUrl + '\n' + (title ? 'Title: ' + title : '')
      : 'Résume-moi cet article en 5 points clés, en français.\n' +
        'Article : ' + articleUrl + '\n' + (title ? 'Titre : ' + title : '');

    // SVGs des logos IA (monochrome, héritent currentColor)
    const SVG = {
      perplexity: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.4L18.5 8 12 11.6 5.5 8 12 4.4zM5 9.7l6 3.3v6.6l-6-3.7V9.7zm14 0v6.2l-6 3.7v-6.6l6-3.3z"/></svg>',
      chatgpt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.28 9.52a5.97 5.97 0 0 0-.51-4.91 6.04 6.04 0 0 0-6.51-2.9 6.07 6.07 0 0 0-4.55-2.01 6.04 6.04 0 0 0-5.76 4.18 5.97 5.97 0 0 0-3.98 2.9 6.04 6.04 0 0 0 .74 7.08 5.97 5.97 0 0 0 .51 4.91 6.04 6.04 0 0 0 6.51 2.9 5.97 5.97 0 0 0 4.55 2.01 6.04 6.04 0 0 0 5.76-4.18 5.97 5.97 0 0 0 3.98-2.9 6.04 6.04 0 0 0-.74-7.08zM13.06 20.5a4.47 4.47 0 0 1-2.87-1.04l.14-.08 4.78-2.76a.78.78 0 0 0 .39-.68v-6.73l2.02 1.17.02.05v5.59a4.5 4.5 0 0 1-4.48 4.48zm-9.62-4.11a4.47 4.47 0 0 1-.53-3l.14.09 4.78 2.76a.78.78 0 0 0 .79 0l5.83-3.37v2.33l-.02.05-4.83 2.79a4.5 4.5 0 0 1-6.16-1.65zM2.2 8.4a4.46 4.46 0 0 1 2.33-1.96V12.1a.78.78 0 0 0 .39.68l5.83 3.36-2.02 1.17a.07.07 0 0 1-.07 0L3.84 14.5A4.5 4.5 0 0 1 2.2 8.4zm16.69 3.91l-5.83-3.37 2.02-1.17a.07.07 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.07v-5.65a.78.78 0 0 0-.4-.67zm2.01-3.02l-.14-.09-4.78-2.76a.78.78 0 0 0-.79 0L9.36 9.81V7.48l.02-.05 4.83-2.79a4.5 4.5 0 0 1 6.7 4.66zM8.27 12.39l-2.02-1.17a.07.07 0 0 1-.02-.05V5.59a4.5 4.5 0 0 1 7.38-3.46l-.14.08-4.78 2.76a.78.78 0 0 0-.39.68l-.03 6.73zm1.1-2.37L11.97 8.5l2.6 1.51v3.01l-2.6 1.51-2.6-1.51v-3.01z"/></svg>',
      claude: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.8 8.5l-2.8 7h1.3l.6-1.5h3l.6 1.5h1.3l-2.8-7H7.8zm-.6 4.4l1-2.7 1 2.7h-2zm9.8-4.4l-2.8 7h1.3l.6-1.5h3l.6 1.5h1.3l-2.8-7H17zm-.6 4.4l1-2.7 1 2.7h-2z"/></svg>',
      gemini: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1L13.5 9 22 10.5 13.5 12 12 20 10.5 12 2 10.5 10.5 9 12 1z"/></svg>',
      mistral: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h4v4H3V4zm0 4h4v4H3V8zm0 4h4v4H3v-4zm0 4h4v4H3v-4zm4-12h4v4H7V4zm0 12h4v4H7v-4zm4-12h4v4h-4V4zm0 12h4v4h-4v-4zm4-12h4v4h-4V4zm0 4h4v4h-4V8zm0 4h4v4h-4v-4zm0 4h4v4h-4v-4z"/></svg>',
      copilot: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/><path d="M8 15c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
      copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M19 14v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>'
    };

    const bar = document.createElement('aside');
    bar.className = 'ai-summarize';
    bar.setAttribute('aria-label', T.aria);
    bar.innerHTML = `
      <div class="ai-summarize-label">${T.label}</div>
      <div class="ai-summarize-actions">
        <a class="ai-summarize-btn" data-ai="perplexity" target="_blank" rel="noopener noreferrer"
           href="https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}">
          ${SVG.perplexity}<span>Perplexity</span>
        </a>
        <a class="ai-summarize-btn" data-ai="chatgpt" target="_blank" rel="noopener noreferrer"
           href="https://chatgpt.com/?q=${encodeURIComponent(prompt)}&hints=search">
          ${SVG.chatgpt}<span>ChatGPT</span>
        </a>
        <div class="ai-summarize-more">
          <button type="button" class="ai-summarize-btn" data-ai="more" aria-haspopup="true" aria-expanded="false">
            ${SVG.copy}<span>${T.more}</span>
          </button>
          <div class="ai-summarize-menu" role="menu">
            <button type="button" data-ai="claude">${SVG.claude}<span>${T.claude}</span></button>
            <button type="button" data-ai="gemini">${SVG.gemini}<span>${T.gemini}</span></button>
            <button type="button" data-ai="mistral">${SVG.mistral}<span>${T.mistral}</span></button>
            <button type="button" data-ai="copilot">${SVG.copilot}<span>${T.copilot}</span></button>
            <button type="button" data-ai="just-copy">${SVG.copy}<span>${T.copyOnly}</span></button>
            <div class="ai-summarize-menu-hint">${T.hint}</div>
          </div>
        </div>
      </div>
    `;

    // Insère juste après le .tldr ou en haut de la 1re section.block
    if (tldr) {
      // Le .tldr est généralement dans un .container, on insère après ce container
      const tldrContainer = tldr.parentElement;
      if (tldrContainer && tldrContainer.classList.contains('container')) {
        tldrContainer.insertAdjacentElement('afterend', bar);
      } else {
        tldr.insertAdjacentElement('afterend', bar);
      }
    } else if (firstBlock) {
      firstBlock.parentElement.insertBefore(bar, firstBlock);
    }

    // Dropdown wiring
    const moreWrap = bar.querySelector('.ai-summarize-more');
    const moreBtn = moreWrap.querySelector('button[data-ai="more"]');
    const menu = moreWrap.querySelector('.ai-summarize-menu');
    const closeMenu = () => {
      moreWrap.classList.remove('is-open');
      moreBtn.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      moreWrap.classList.add('is-open');
      moreBtn.setAttribute('aria-expanded', 'true');
    };
    moreBtn.addEventListener('click', e => {
      e.stopPropagation();
      moreWrap.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    document.addEventListener('click', e => {
      if (!moreWrap.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && moreWrap.classList.contains('is-open')) closeMenu();
    });

    // Actions menu
    const targets = {
      claude:  'https://claude.ai/new',
      gemini:  'https://gemini.google.com/app',
      mistral: 'https://chat.mistral.ai/chat',
      copilot: 'https://copilot.microsoft.com/'
    };
    menu.querySelectorAll('button[data-ai]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ai = btn.getAttribute('data-ai');
        const ok = await copyToClipboard(promptLong);
        showToast(document.documentElement.lang === 'en'
          ? (ok ? 'Prompt copied — paste it in the chat' : 'Manual copy needed')
          : (ok ? 'Prompt copié — colle-le dans le chat' : 'Copie manuelle nécessaire'));
        if (ai !== 'just-copy' && targets[ai]) {
          window.open(targets[ai], '_blank', 'noopener,noreferrer');
        }
        closeMenu();
      });
    });
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fallback below */ }
    // Fallback : textarea + execCommand
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  let toastEl = null;
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'ai-summarize-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
  }

  // Différer l'init après le first paint pour libérer le main-thread.
  function deferredInit() {
    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    ric(init, { timeout: 2000 });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferredInit);
  } else {
    deferredInit();
  }
})();
