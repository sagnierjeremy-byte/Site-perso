/* lang-toggle.js — sélecteur de langue FR ⇄ EN, auto-plaçant.
 * Un seul <script src="/assets/lang-toggle.js" defer> sur chaque page suffit.
 * Détecte la langue via <html lang>, calcule la page équivalente (préfixe/strip /en/),
 * crée un bouton et l'insère dans le header (3 structures gérées) ou en flottant.
 * Le hreflang dans le <head> assure le signal SEO même sans JS. */
(function () {
  'use strict';
  var isEn = document.documentElement.lang === 'en';
  var other = isEn ? 'FR' : 'EN';

  function target() {
    var p = location.pathname;
    var t = isEn ? (p.replace(/^\/en(\/|$)/, '/') || '/') : ('/en' + (p === '/' ? '/' : p));
    return t + location.hash;
  }

  function injectCss() {
    if (document.getElementById('lang-switch-css')) return;
    var s = document.createElement('style');
    s.id = 'lang-switch-css';
    s.textContent =
      '.lang-switch{display:inline-flex;align-items:center;justify-content:center;' +
      "font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;" +
      'text-decoration:none;color:var(--ink,#0A0A0A);background:transparent;' +
      'border:1.5px solid var(--line-strong,rgba(10,10,10,.2));border-radius:999px;' +
      'padding:7px 11px;line-height:1;cursor:pointer;transition:background .2s,color .2s,border-color .2s;}' +
      '.lang-switch:hover{background:var(--fuchsia,#EF426F);color:#fff;border-color:var(--fuchsia,#EF426F);}' +
      '.lang-switch.floating{position:fixed;top:14px;right:14px;z-index:9999;' +
      'background:var(--bg,#fff);box-shadow:0 4px 16px rgba(0,0,0,.12);}';
    document.head.appendChild(s);
  }

  function place() {
    var btn = document.createElement('a');
    btn.href = target();
    btn.className = 'lang-switch';
    btn.textContent = other;
    btn.setAttribute('aria-label', isEn ? 'Voir cette page en français' : 'View this page in English');
    btn.setAttribute('hreflang', isEn ? 'fr' : 'en');

    var a;
    if ((a = document.querySelector('.mini-nav .theme-toggle-v2'))) {
      btn.style.marginRight = '8px'; a.parentNode.insertBefore(btn, a);
    } else if ((a = document.querySelector('.header-inner .theme-toggle, .header .theme-toggle'))) {
      btn.style.marginRight = '10px'; a.parentNode.insertBefore(btn, a);
    } else if ((a = document.querySelector('.term-header nav'))) {
      a.appendChild(btn);
    } else {
      btn.classList.add('floating'); document.body.appendChild(btn);
    }
  }

  injectCss();
  if (document.readyState !== 'loading') place();
  else document.addEventListener('DOMContentLoaded', place);
})();
