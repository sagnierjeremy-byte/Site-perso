(function () {
  'use strict';

  // ─── THEME ───
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

  // ─── NEWS FEED ───
  var allArticles = [];
  var activeFilter = 'all';

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

  function buildCard(article, featured) {
    var cat = article.category;
    var cls = catClass(cat);
    var source = article.sourceName || '';

    var imgHtml = article.image
      ? '<img src="' + escHtml(article.image) + '" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=\\\"card-img-placeholder ' + cls + '\\\">' + escHtml(source || 'Veille') + '<\\/div>\'">'
      : '<div class="card-img-placeholder ' + cls + '">' + escHtml(source || 'Veille') + '</div>';

    var excerptHtml = article.excerpt
      ? '<p class="card-excerpt">' + escHtml(article.excerpt.slice(0, 180)) + '</p>'
      : '';

    if (featured) {
      return '<a href="' + escHtml(article.url) + '" target="_blank" rel="noopener" class="news-card-featured">'
        + '<div class="card-img-wrap">' + imgHtml + '</div>'
        + '<div class="card-body">'
        + '<div>'
        + '<div class="card-meta"><span class="card-source">' + escHtml(source) + '</span>'
        + (cat ? '<span class="card-tag ' + cls + '">' + escHtml(catLabel(cat)) + '</span>' : '')
        + '</div>'
        + '<p class="card-title" style="-webkit-line-clamp:4">' + escHtml(article.title) + '</p>'
        + excerptHtml
        + '</div>'
        + '<div class="card-footer"><span>' + formatDate(article.publishedAt) + '</span></div>'
        + '</div>'
        + '</a>';
    }

    return '<a href="' + escHtml(article.url) + '" target="_blank" rel="noopener" class="news-card">'
      + '<div class="card-img-wrap">' + imgHtml + '</div>'
      + '<div class="card-body">'
      + '<div class="card-meta"><span class="card-source">' + escHtml(source) + '</span>'
      + (cat ? '<span class="card-tag ' + cls + '">' + escHtml(catLabel(cat)) + '</span>' : '')
      + '</div>'
      + '<p class="card-title">' + escHtml(article.title) + '</p>'
      + excerptHtml
      + '<div class="card-footer"><span>' + formatDate(article.publishedAt) + '</span></div>'
      + '</div>'
      + '</a>';
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function renderArticles(articles) {
    var grid = document.getElementById('newsGrid');
    var count = document.getElementById('articleCount');

    if (!articles.length) {
      grid.className = 'news-grid';
      grid.innerHTML = '<div class="veille-empty"><strong>Aucun article pour le moment.</strong>La veille se met à jour toutes les 6h.</div>';
      count.textContent = '0 article';
      return;
    }

    count.textContent = articles.length + ' article' + (articles.length > 1 ? 's' : '');
    grid.className = 'news-grid';

    var html = '';
    articles.forEach(function(a, i) {
      html += buildCard(a, i === 0);
    });
    grid.innerHTML = html;
  }

  function applyFilter(cat) {
    activeFilter = cat;
    var filtered = cat === 'all'
      ? allArticles
      : allArticles.filter(function(a) {
          return a.category && a.category.toLowerCase() === cat.toLowerCase();
        });
    renderArticles(filtered);
  }

  function buildFilters(articles) {
    var cats = [];
    articles.forEach(function(a) {
      if (a.category && !cats.includes(a.category)) cats.push(a.category);
    });
    cats.sort();

    var bar = document.getElementById('filterBar');
    var html = '<button class="filter-btn active" data-cat="all">Tout (' + articles.length + ')</button>';
    cats.forEach(function(c) {
      var n = articles.filter(function(a) { return a.category === c; }).length;
      html += '<button class="filter-btn" data-cat="' + escHtml(c) + '">' + escHtml(c) + ' (' + n + ')</button>';
    });
    bar.innerHTML = html;

    bar.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        bar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(btn.dataset.cat);
      });
    });
  }

  async function loadNews() {
    try {
      var res = await fetch('/api/news');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      allArticles = Array.isArray(data) ? data : [];
      buildFilters(allArticles);
      applyFilter('all');
    } catch (err) {
      console.error('[veille]', err);
      var grid = document.getElementById('newsGrid');
      grid.className = 'news-grid';
      grid.innerHTML = '<div class="veille-empty"><strong>Impossible de charger les articles.</strong>Actualise la page dans quelques secondes.</div>';
      document.getElementById('articleCount').textContent = '';
    }
  }

  loadNews();

  // ─── CTA NEWSLETTER ───
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
