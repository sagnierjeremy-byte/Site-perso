/*
  Nav dropdown « Plus »
  ----------------------
  Gère l'ouverture/fermeture du menu dropdown dans .mini-nav .more-wrap.
  - Click trigger → toggle
  - Click outside → close
  - Escape → close
  - Mobile : le dropdown est statique (CSS), pas de JS spécifique nécessaire
    sauf pour basculer is-open (qui anime max-height)
*/

(function () {
  if (typeof window === 'undefined') return;

  function init() {
    const wraps = document.querySelectorAll('.mini-nav .more-wrap');
    if (!wraps.length) return;

    wraps.forEach(wrap => {
      const trigger = wrap.querySelector('.more-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = wrap.classList.contains('is-open');
        // Ferme les autres
        document.querySelectorAll('.mini-nav .more-wrap.is-open').forEach(w => {
          if (w !== wrap) {
            w.classList.remove('is-open');
            w.querySelector('.more-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });
        wrap.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Click extérieur → close
    document.addEventListener('click', e => {
      if (!e.target.closest('.mini-nav .more-wrap')) {
        document.querySelectorAll('.mini-nav .more-wrap.is-open').forEach(w => {
          w.classList.remove('is-open');
          w.querySelector('.more-trigger')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Escape → close
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.mini-nav .more-wrap.is-open').forEach(w => {
        w.classList.remove('is-open');
        w.querySelector('.more-trigger')?.setAttribute('aria-expanded', 'false');
        w.querySelector('.more-trigger')?.focus();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
