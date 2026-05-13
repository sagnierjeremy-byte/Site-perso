/*
  Article TOC sidebar + back-to-top + mobile bottom-sheet
  --------------------------------------------------------
  Zéro dépendance. S'auto-active si on trouve ≥3 H2 dans le contenu.
  - Desktop ≥1280px : sidebar fixed à droite
  - Mobile/tablette : bottom-sheet drawer + FAB allongé "Sommaire" bas-gauche
  - Back-to-top : bouton rond bas-droite
  - Mobile friendly : touch targets ≥44px, swipe-down close, safe-area iOS
*/

(function () {
  if (typeof window === 'undefined') return;

  // ------------ helpers ------------

  function slugify(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'section';
  }

  function cleanTitle(el) {
    return el.textContent.trim().replace(/\s+/g, ' ');
  }

  function throttle(fn, ms) {
    let last = 0;
    let timeout = null;
    return function () {
      const now = Date.now();
      const remaining = ms - (now - last);
      if (remaining <= 0) {
        if (timeout) { clearTimeout(timeout); timeout = null; }
        last = now;
        fn();
      } else if (!timeout) {
        timeout = setTimeout(() => {
          last = Date.now();
          timeout = null;
          fn();
        }, remaining);
      }
    };
  }

  // ------------ collect headings ------------

  function collectHeadings() {
    const selectors = [
      'section.block h2',
      'main section h2',
      'main h2',
      'body > section h2',
    ];
    const excludeClosest = ['header', 'footer', '.hero', '.pod-hero', '.tldr', '.final-cta', '.mini-nav'];
    let h2s = [];
    for (const sel of selectors) {
      try {
        const found = Array.from(document.querySelectorAll(sel)).filter(el => {
          for (const ex of excludeClosest) if (el.closest(ex)) return false;
          return true;
        });
        if (found.length >= 3) { h2s = found; break; }
      } catch (e) { /* skip */ }
    }
    return h2s;
  }

  function ensureIds(h2s) {
    h2s.forEach((h, i) => {
      if (!h.id) {
        const base = slugify(cleanTitle(h));
        let id = base || ('section-' + (i + 1));
        let n = 1;
        while (document.getElementById(id) && document.getElementById(id) !== h) {
          id = base + '-' + (++n);
        }
        h.id = id;
      }
    });
  }

  function collectItems(h2s) {
    // items: [{ el, text, level }]
    const items = [];
    h2s.forEach((h2, idx) => {
      items.push({ el: h2, text: cleanTitle(h2), level: 2 });
      // récupère les h3 dans la même section parent
      const parent = h2.parentElement;
      if (!parent) return;
      const subH3s = parent.querySelectorAll(':scope h3');
      subH3s.forEach(h3 => {
        if (!h3.id) {
          const base = slugify(cleanTitle(h3));
          let id = (base || 'sub') + '-' + idx;
          let n = 1;
          while (document.getElementById(id)) id = base + '-' + idx + '-' + (++n);
          h3.id = id;
        }
        items.push({ el: h3, text: cleanTitle(h3), level: 3 });
      });
    });
    return items;
  }

  // ------------ DOM builders ------------

  function buildListItems(items, onClick) {
    const frag = document.createDocumentFragment();
    items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'article-toc-item' + (it.level === 3 ? ' is-h3' : '');
      const a = document.createElement('a');
      a.href = '#' + it.el.id;
      a.textContent = it.text;
      if (onClick) a.addEventListener('click', e => onClick(e, it));
      li.appendChild(a);
      frag.appendChild(li);
    });
    return frag;
  }

  function smoothScrollTo(el, offset) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + el.id);
  }

  function buildSidebar(items) {
    const aside = document.createElement('aside');
    aside.className = 'article-toc is-ready';
    aside.setAttribute('aria-label', 'Sommaire de l\'article');

    const label = document.createElement('div');
    label.className = 'article-toc-label';
    label.textContent = 'Sommaire';
    aside.appendChild(label);

    const ol = document.createElement('ol');
    ol.className = 'article-toc-list';
    ol.appendChild(buildListItems(items, (e, it) => {
      e.preventDefault();
      smoothScrollTo(it.el, 90);
    }));
    aside.appendChild(ol);
    return aside;
  }

  function buildMobile(items) {
    // FAB
    const fab = document.createElement('button');
    fab.className = 'article-toc-fab is-ready';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Ouvrir le sommaire');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg><span>Sommaire</span>';

    // Drawer (bottom sheet)
    const drawer = document.createElement('div');
    drawer.className = 'article-toc-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="article-toc-drawer-backdrop" data-toc-close></div>
      <div class="article-toc-drawer-panel" role="dialog" aria-label="Sommaire">
        <div class="article-toc-drawer-grab" aria-hidden="true"></div>
        <div class="article-toc-drawer-header">
          <div class="article-toc-label">Sommaire</div>
          <button class="article-toc-drawer-close" type="button" aria-label="Fermer le sommaire" data-toc-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <ol class="article-toc-list"></ol>
      </div>
    `;

    const drawerList = drawer.querySelector('.article-toc-list');
    drawerList.appendChild(buildListItems(items, (e, it) => {
      e.preventDefault();
      closeDrawer();
      // Attendre que le drawer se ferme (animation 350ms) avant de scroller
      setTimeout(() => smoothScrollTo(it.el, 80), 320);
    }));

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('article-toc-open');
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('article-toc-open');
    }

    fab.addEventListener('click', openDrawer);
    drawer.addEventListener('click', e => {
      if (e.target.closest('[data-toc-close]')) closeDrawer();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
        fab.focus();
      }
    });

    // Swipe-down sur le panel pour fermer (mobile natif)
    const panel = drawer.querySelector('.article-toc-drawer-panel');
    let touchStartY = 0;
    let touchCurrentY = 0;
    let touchActive = false;
    panel.addEventListener('touchstart', e => {
      // Démarre le swipe seulement depuis le grab handle ou le header
      const target = e.target;
      if (target.closest('.article-toc-list') && panel.querySelector('.article-toc-list').scrollTop > 0) {
        return;
      }
      touchStartY = e.touches[0].clientY;
      touchCurrentY = touchStartY;
      touchActive = true;
    }, { passive: true });
    panel.addEventListener('touchmove', e => {
      if (!touchActive) return;
      touchCurrentY = e.touches[0].clientY;
      const dy = touchCurrentY - touchStartY;
      if (dy > 0) {
        panel.style.transform = `translateY(${dy}px)`;
        panel.style.transition = 'none';
      }
    }, { passive: true });
    panel.addEventListener('touchend', () => {
      if (!touchActive) return;
      touchActive = false;
      const dy = touchCurrentY - touchStartY;
      panel.style.transition = '';
      panel.style.transform = '';
      if (dy > 80) closeDrawer();
    });

    return { fab, drawer };
  }

  function buildBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Remonter en haut de page');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return btn;
  }

  // ------------ Scroll spy + visibility controls ------------

  function setupScrollSpy(items, sidebar, drawer) {
    // Map heading id → li elements (sidebar + drawer)
    const sidebarLis = sidebar.querySelectorAll('.article-toc-item');
    const drawerLis = drawer.querySelectorAll('.article-toc-item');
    const refs = items.map((it, i) => ({
      el: it.el,
      lis: [sidebarLis[i], drawerLis[i]].filter(Boolean),
    }));

    let currentIdx = -1;
    function setActive(idx) {
      if (idx === currentIdx) return;
      if (currentIdx >= 0 && refs[currentIdx]) {
        refs[currentIdx].lis.forEach(l => l.classList.remove('is-active'));
      }
      if (idx >= 0 && refs[idx]) {
        refs[idx].lis.forEach(l => l.classList.add('is-active'));
        // auto-scroll de la liste sidebar pour garder l'item visible
        const sidebarActive = refs[idx].lis[0];
        if (sidebarActive && sidebarActive.scrollIntoView) {
          const rect = sidebarActive.getBoundingClientRect();
          const listRect = sidebar.querySelector('.article-toc-list').getBoundingClientRect();
          if (rect.top < listRect.top || rect.bottom > listRect.bottom) {
            sidebarActive.scrollIntoView({ block: 'nearest' });
          }
        }
      }
      currentIdx = idx;
    }

    function updateActive() {
      const offset = 140;
      let best = -1;
      for (let i = 0; i < refs.length; i++) {
        const rect = refs[i].el.getBoundingClientRect();
        if (rect.top - offset <= 0) best = i;
        else break;
      }
      setActive(best);
    }
    window.addEventListener('scroll', throttle(updateActive, 80), { passive: true });
    updateActive();
  }

  function setupVisibility(fab, backToTop) {
    const fabThreshold = 600;   // FAB Sommaire apparaît après scroll 600px (laisse passer le hero)
    const btnThreshold = 400;   // back-to-top apparaît après scroll 400px

    function onScroll() {
      const y = window.pageYOffset;
      if (fab) fab.classList.toggle('is-visible', y > fabThreshold);
      if (backToTop) backToTop.classList.toggle('is-visible', y > btnThreshold);
    }
    window.addEventListener('scroll', throttle(onScroll, 100), { passive: true });
    onScroll();
  }

  // ------------ init ------------

  function init() {
    const h2s = collectHeadings();

    // Toujours installer le back-to-top, même si pas de TOC
    const backToTop = buildBackToTop();
    document.body.appendChild(backToTop);

    if (h2s.length < 3) {
      setupVisibility(null, backToTop);
      return;
    }

    ensureIds(h2s);
    const items = collectItems(h2s);

    const sidebar = buildSidebar(items);
    document.body.appendChild(sidebar);

    const { fab, drawer } = buildMobile(items);
    document.body.appendChild(fab);
    document.body.appendChild(drawer);

    setupScrollSpy(items, sidebar, drawer);
    setupVisibility(fab, backToTop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
