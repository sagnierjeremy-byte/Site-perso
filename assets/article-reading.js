/* article-reading.js — confort de lecture des articles (design v2, 2026-07)
   1. Barre de progression de lecture (haut de page, gradient FIESTA)
   2. Bouton « Copier » sur les blockquotes (les prompts des articles)
   Zéro markup requis : tout est injecté (progressive enhancement).
   Libellés lang-aware (pages EN sous /en/ → <html lang="en">). */

(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  var isEN = document.documentElement.lang === 'en';
  var L = {
    copy: isEN ? 'Copy' : 'Copier',
    copied: isEN ? 'Copied ✓' : 'Copié ✓',
    aria: isEN ? 'Copy this prompt' : 'Copier ce prompt',
  };

  /* ---- 1. Barre de progression ---- */
  function initProgress() {
    if (document.querySelector('.read-progress')) return;
    var bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---- 2. Copier les prompts (blockquotes) ---- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  function initCopyButtons() {
    var quotes = document.querySelectorAll('section.block blockquote');
    for (var i = 0; i < quotes.length; i++) {
      (function (q) {
        if (q.querySelector('.copy-btn')) return;
        var text = q.textContent.trim()
          .replace(/^[«"']\s*/, '').replace(/\s*[»"']$/, ''); // sans les guillemets d'habillage
        if (text.length < 40) return; // pas de bouton sur les citations courtes
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.setAttribute('aria-label', L.aria);
        btn.textContent = L.copy;
        btn.addEventListener('click', function () {
          copyText(text).then(function (ok) {
            btn.textContent = ok ? L.copied : L.copy;
            btn.classList.toggle('copied', !!ok);
            setTimeout(function () {
              btn.textContent = L.copy;
              btn.classList.remove('copied');
            }, 2000);
          });
        });
        q.appendChild(btn);
      })(quotes[i]);
    }
  }

  function init() { initProgress(); initCopyButtons(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
