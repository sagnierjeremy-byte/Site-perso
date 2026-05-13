(function () {
  'use strict';

  function init() {
    var nav = document.querySelector('.mini-nav');
    if (!nav) return;
    var burger = nav.querySelector('.burger');
    var links = nav.querySelector('.links');
    if (!burger || !links) return;

    function open() {
      nav.classList.add('is-open');
      document.body.classList.add('mini-nav-open');
      burger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      nav.classList.remove('is-open');
      document.body.classList.remove('mini-nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (nav.classList.contains('is-open')) close(); else open();
    }

    burger.addEventListener('click', toggle);

    links.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.tagName === 'A') close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        burger.focus();
      }
    });

    var mq = window.matchMedia('(min-width: 961px)');
    var onChange = function () { if (mq.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
