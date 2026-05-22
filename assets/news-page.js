(function () {
  'use strict';

  // ─── UNIFIED STATE ────────────────────────────────────────────────
  const state = {
    articles: [],          // immutable after fetch
    clusters: [],          // computed after fetch via buildClusters (T12)
    summary: null,         // daily AI summary JSON (T15)
    query: '',
    category: 'all',
    source: 'all',
    sort: 'trending',
    hideRead: false,
    readUrls: new Set(),
  };

  // Load read URLs from localStorage safely
  try {
    const raw = localStorage.getItem('news-read');
    if (raw) state.readUrls = new Set(JSON.parse(raw));
  } catch (e) {
    // Quota or private mode — keep empty Set
  }

  // ─── Pure helpers (duplicated from scripts/news-helpers.mjs) ──────
  // /!\ Keep in sync with scripts/news-helpers.mjs. Tests import from the .mjs file.

  function normalize(s) {
    if (s == null) return '';
    return String(s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const STOPWORDS = new Set([
    'avec','sans','sous','sur','pour','dans','mais','comment','pourquoi','quand',
    'quel','quels','quelle','quelles','cette','cet','ces','son','ses','leur','leurs',
    'plus','moins','aussi','tout','tous','toute','toutes','rien','tres','aux',
    'qui','que','quoi','dont','ainsi','lui','elle','ils','elles','nous','vous',
    'des','les','une','est','sont','etre','par','pas','peu',
    'the','and','for','with','this','that','from','have','has','was','were',
    'are','will','would','could','should','can','may','about','into','than',
    'just','very','also','only','then','when','where','what','how','why','its',
    'new','old','one','two','top','any','all','our','your','their','his','her',
  ]);

  function tokenize(title) {
    return normalize(title).split(' ').filter(w => w.length >= 3 && !STOPWORDS.has(w));
  }

  function jaccard(setA, setB) {
    let inter = 0;
    for (const x of setA) if (setB.has(x)) inter++;
    const union = setA.size + setB.size - inter;
    return union === 0 ? 0 : inter / union;
  }

  const SIM_THRESHOLD = 0.35;
  const MIN_COMMON = 3;

  function buildClusters(articles, opts = {}) {
    const minSources = opts.minSources ?? 3;
    const tokensArr = articles.map(a => new Set(tokenize(a.title)));
    const visited = new Array(articles.length).fill(false);
    const clusters = [];
    for (let i = 0; i < articles.length; i++) {
      if (visited[i]) continue;
      const indices = [i];
      visited[i] = true;
      for (let j = i + 1; j < articles.length; j++) {
        if (visited[j]) continue;
        let inter = 0;
        for (const t of tokensArr[i]) if (tokensArr[j].has(t)) inter++;
        if (inter >= MIN_COMMON && jaccard(tokensArr[i], tokensArr[j]) >= SIM_THRESHOLD) {
          indices.push(j);
          visited[j] = true;
        }
      }
      const uniqSources = new Set(indices.map(idx => articles[idx].sourceName));
      if (uniqSources.size >= minSources) {
        clusters.push({ indices, sourceCount: uniqSources.size });
      }
    }
    clusters.sort((a, b) => b.sourceCount - a.sourceCount);
    return clusters;
  }

  function timeBucket(publishedAt, now = new Date()) {
    if (!publishedAt) return 'older';
    const d = new Date(publishedAt);
    if (isNaN(d.getTime())) return 'older';
    const startToday     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startYesterday = new Date(startToday.getTime() - 24*3600*1000);
    const startWeek      = new Date(startToday.getTime() - 7*24*3600*1000);
    if (d >= startToday)     return 'today';
    if (d >= startYesterday) return 'yesterday';
    if (d >= startWeek)      return 'this_week';
    return 'older';
  }

  const BUCKET_LABELS = {
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    this_week: 'Cette semaine',
    older: 'Plus ancien',
  };
  const BUCKET_ORDER = ['today', 'yesterday', 'this_week', 'older'];

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // ─── THEME ────────────────────────────────────────────────────────
  (function() {
    const toggle = document.getElementById('themeToggleV2');
    const saved = localStorage.getItem('theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', saved || (sysDark ? 'dark' : 'light'));
    if (toggle) toggle.addEventListener('click', function() {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  })();

  // ─── NEWS FEED ────────────────────────────────────────────────────

  function catClass(cat) {
    if (!cat) return 'cat-other';
    var lower = cat.toLowerCase();
    if (lower.includes('ia') || lower.includes('ai') || lower.includes('intelligence')) return 'cat-ia';
    if (lower.includes('business') || lower.includes('finance') || lower.includes('startup')) return 'cat-business';
    return 'cat-other';
  }

  function catLabel(cat) {
    return cat || 'Autre';
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  function cardHtml(article, featured) {
    var cat = article.category;
    var cls = catClass(cat);
    var source = article.sourceName || '';
    var isRead = state.readUrls.has(article.url);
    var readCls = isRead ? ' is-read' : '';
    var dataUrl = ' data-url="' + escapeHtml(article.url || '') + '"';

    var imgHtml = article.image
      ? '<img src="' + escapeHtml(article.image) + '" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=\\\"card-img-placeholder ' + cls + '\\\">' + escapeHtml(source || 'Veille') + '<\\/div>\'">'
      : '<div class="card-img-placeholder ' + cls + '">' + escapeHtml(source || 'Veille') + '</div>';

    var excerptHtml = article.excerpt
      ? '<p class="card-excerpt">' + escapeHtml(article.excerpt.slice(0, 180)) + '</p>'
      : '';

    if (featured) {
      return '<a href="' + escapeHtml(article.url) + '"' + dataUrl + ' target="_blank" rel="noopener" class="news-card-featured' + readCls + '">'
        + '<div class="card-img-wrap">' + imgHtml + '</div>'
        + '<div class="card-body">'
        + '<div>'
        + '<div class="card-meta"><span class="card-source">' + escapeHtml(source) + '</span>'
        + (cat ? '<span class="card-tag ' + cls + '">' + escapeHtml(catLabel(cat)) + '</span>' : '')
        + '</div>'
        + '<p class="card-title" style="-webkit-line-clamp:4">' + escapeHtml(article.title) + '</p>'
        + excerptHtml
        + '</div>'
        + '<div class="card-footer"><span>' + formatDate(article.publishedAt) + '</span></div>'
        + '</div>'
        + '</a>';
    }

    return '<a href="' + escapeHtml(article.url) + '"' + dataUrl + ' target="_blank" rel="noopener" class="news-card' + readCls + '">'
      + '<div class="card-img-wrap">' + imgHtml + '</div>'
      + '<div class="card-body">'
      + '<div class="card-meta"><span class="card-source">' + escapeHtml(source) + '</span>'
      + (cat ? '<span class="card-tag ' + cls + '">' + escapeHtml(catLabel(cat)) + '</span>' : '')
      + '</div>'
      + '<p class="card-title">' + escapeHtml(article.title) + '</p>'
      + excerptHtml
      + '<div class="card-footer"><span>' + formatDate(article.publishedAt) + '</span></div>'
      + '</div>'
      + '</a>';
  }

  function renderGrid(list) {
    var grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.classList.remove('skeleton-grid');
    grid.className = 'news-grid';

    if (!list.length) {
      grid.innerHTML = '<div class="veille-empty"><strong>Aucun article pour le moment.</strong>La veille se met à jour toutes les 6h.</div>';
      return;
    }

    var html = '';
    list.forEach(function(a, i) {
      html += cardHtml(a, i === 0);
    });
    grid.innerHTML = html;
  }

  function renderError(msg) {
    var grid = document.getElementById('newsGrid');
    if (grid) {
      grid.classList.remove('skeleton-grid');
      grid.className = 'news-grid';
      grid.innerHTML = '<div class="veille-empty"><strong>' + escapeHtml(msg) + '</strong>Actualise la page dans quelques secondes.</div>';
    }
    var count = document.getElementById('articleCount');
    if (count) count.textContent = '';
  }

  function formatCount(visible, total) {
    if (visible === total) return total + ' article' + (total > 1 ? 's' : '');
    return visible + ' sur ' + total + ' affichés';
  }

  function sortArticles(list, sortKey, clusters, allArticles) {
    if (sortKey === 'source') {
      return list.slice().sort(function(a, b) {
        return (a.sourceName || '').localeCompare(b.sourceName || '');
      });
    }
    if (sortKey === 'trending' && clusters && clusters.length > 0) {
      var clusterMembership = new Map();
      clusters.forEach(function(c, ci) {
        c.indices.forEach(function(idx) {
          var url = allArticles[idx].url;
          if (!clusterMembership.has(url)) clusterMembership.set(url, ci);
        });
      });
      return list.slice().sort(function(a, b) {
        var ca = clusterMembership.get(a.url);
        var cb = clusterMembership.get(b.url);
        if (ca != null && cb != null) return ca - cb;
        if (ca != null) return -1;
        if (cb != null) return 1;
        return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
      });
    }
    return list.slice().sort(function(a, b) {
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    });
  }

  function applyFiltersAndRender() {
    var list = state.articles.slice();
    if (state.category !== 'all') {
      list = list.filter(function(a) {
        return a.category && a.category.toLowerCase() === state.category.toLowerCase();
      });
    }
    if (state.source !== 'all') {
      list = list.filter(function(a) { return a.sourceName === state.source; });
    }
    if (state.query) {
      var q = normalize(state.query);
      list = list.filter(function(a) {
        return normalize(a.title || '').includes(q)
          || normalize(a.excerpt || '').includes(q)
          || normalize(a.sourceName || '').includes(q);
      });
    }
    if (state.hideRead) {
      list = list.filter(function(a) { return !state.readUrls.has(a.url); });
    }
    list = sortArticles(list, state.sort, state.clusters, state.articles);
    syncURL();
    var count = document.getElementById('articleCount');
    if (count) count.textContent = formatCount(list.length, state.articles.length);
    renderGrid(list);
  }

  function populateFilterButtons() {
    var cats = [];
    state.articles.forEach(function(a) {
      if (a.category && !cats.includes(a.category)) cats.push(a.category);
    });
    cats.sort();

    var bar = document.getElementById('filterBar');
    if (!bar) return;
    var activeAll = state.category === 'all' ? ' active' : '';
    var html = '<button class="filter-btn' + activeAll + '" data-cat="all">Tout (' + state.articles.length + ')</button>';
    cats.forEach(function(c) {
      var n = state.articles.filter(function(a) { return a.category === c; }).length;
      var active = state.category.toLowerCase() === c.toLowerCase() ? ' active' : '';
      html += '<button class="filter-btn' + active + '" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + ' (' + n + ')</button>';
    });
    bar.innerHTML = html;

    bar.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        bar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.category = btn.dataset.cat;
        applyFiltersAndRender();
      });
    });
  }

  // ─── STUBS (filled by T5–T11) ─────────────────────────────────────

  function initFiltersFromURL() {
    // T10: read URL params, mutate state, reflect in UI controls
  }

  function populateSourceFilter() {
    // T6: fill #sourceFilter <select> with optgroups
  }

  function syncURL() {
    // T10: history.replaceState to reflect state in URL
  }

  // ─── LOAD ─────────────────────────────────────────────────────────

  async function loadArticles() {
    try {
      var res = await fetch('/api/news');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      state.articles = Array.isArray(data) ? data : [];
      state.clusters = []; // T12 will populate this
      initFiltersFromURL();
      populateSourceFilter();
      populateFilterButtons();
      applyFiltersAndRender();
    } catch (err) {
      console.error('[veille]', err);
      renderError('Impossible de charger les articles.');
    }
  }

  // ─── EVENT HANDLERS ───────────────────────────────────────────────

  // Search input handler with debounce
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function(e) {
      state.query = e.target.value;
      applyFiltersAndRender();
    }, 200));
  }

  // Stubs for handlers wired in T6-T8 — see plan
  // sourceFilter, sortBy, hideReadToggle, markAllRead, resetRead exist in DOM but
  // have no handlers yet. That's fine — they're inactive until those tasks.

  loadArticles();

  // ─── CTA NEWSLETTER ───────────────────────────────────────────────
  document.querySelectorAll('.veille-cta-form').forEach(function(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var email = form.querySelector('input[name="email"]').value.trim();
      var btn = form.querySelector('button');
      var orig = btn.textContent;
      btn.disabled = true; btn.textContent = '...';
      try {
        var res = await fetch('/api/subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source: form.dataset.source || 'veille-cta' }),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        btn.textContent = '✓ Inscription confirmée';
        setTimeout(function() { btn.textContent = orig; btn.disabled = false; form.reset(); }, 3000);
      } catch {
        btn.textContent = '× Erreur';
        setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 2500);
      }
    });
  });

})();
