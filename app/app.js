/* ============================================================
 * Jerwis News (PWA /app) — logique de l'app.
 *
 * Données : /api/news (60 items, ~43 Ko, agrégat de 29 flux RSS)
 *         + /data/news-summary.json (résumé du jour, cron quotidien)
 * État local : lu/non-lu en localStorage (aucun compte, aucun serveur).
 * Le hors-ligne est assuré par app/sw.js (network-first + repli cache).
 * ============================================================ */
(function () {
  'use strict';

  var API = '/api/news';
  var DIGEST = '/data/news-summary.json';
  var K_READ = 'jerwis_news_read';     // URLs lues
  var K_STAMP = 'jerwis_news_stamp';   // date du dernier fetch réussi (ISO)
  var MAX_READ = 400;                  // borne : on ne garde pas un historique infini

  var el = {
    feed: document.getElementById('feed'),
    digest: document.getElementById('digest'),
    digestDay: document.getElementById('digest-day'),
    digestItems: document.getElementById('digest-items'),
    filters: document.getElementById('filters'),
    age: document.getElementById('age'),
    refresh: document.getElementById('refresh'),
    markAll: document.getElementById('mark-all'),
    ptr: document.getElementById('ptr'),
    nAll: document.getElementById('n-all'),
    nIa: document.getElementById('n-ia'),
    nBu: document.getElementById('n-bu'),
  };

  var items = [];
  var filter = 'all';

  // ─── stockage ──────────────────────────────────────────────

  function readSet() {
    try { return new Set(JSON.parse(localStorage.getItem(K_READ)) || []); }
    catch (e) { return new Set(); }
  }
  function saveRead(set) {
    try {
      // on tronque en gardant les plus récentes (fin du tableau)
      var arr = Array.from(set).slice(-MAX_READ);
      localStorage.setItem(K_READ, JSON.stringify(arr));
    } catch (e) {}
  }
  var read = readSet();

  // ─── utilitaires ───────────────────────────────────────────

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function ago(iso) {
    var t = new Date(iso).getTime();
    if (!t) return '';
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'à l’instant';
    if (m < 60) return 'il y a ' + m + ' min';
    var h = Math.round(m / 60);
    if (h < 24) return 'il y a ' + h + ' h';
    var d = Math.round(h / 24);
    return 'il y a ' + d + ' j';
  }

  function setAge() {
    var s = localStorage.getItem(K_STAMP);
    el.age.textContent = s ? 'MAJ ' + ago(s) : '';
  }

  // ─── rendu ─────────────────────────────────────────────────

  function visible() {
    if (filter === 'all') return items;
    if (filter === 'unread') return items.filter(function (i) { return !read.has(i.url); });
    return items.filter(function (i) { return i.category === filter; });
  }

  function counts() {
    var ia = 0, bu = 0, unread = 0;
    items.forEach(function (i) {
      if (i.category === 'IA') ia++;
      else if (i.category === 'Business') bu++;
      if (!read.has(i.url)) unread++;
    });
    el.nAll.textContent = unread ? unread : '';
    el.nIa.textContent = ia || '';
    el.nBu.textContent = bu || '';
  }

  function renderFeed() {
    var list = visible();
    if (!list.length) {
      el.feed.innerHTML = '<p class="state">' +
        (filter === 'unread' ? 'Tout est lu. 👊' : 'Rien à afficher pour ce filtre.') + '</p>';
      return;
    }
    el.feed.innerHTML = list.map(function (i) {
      var isRead = read.has(i.url);
      return '<a class="card' + (isRead ? ' read' : '') + '" href="' + esc(i.url) + '"' +
        ' target="_blank" rel="noopener noreferrer" data-url="' + esc(i.url) + '">' +
        '<div class="card-body">' +
          '<div class="card-meta">' +
            '<span class="card-cat" data-cat="' + esc(i.category) + '">' + esc(i.category) + '</span>' +
            '<span>' + esc(i.sourceName) + '</span>' +
            '<span>· ' + esc(ago(i.publishedAt)) + '</span>' +
          '</div>' +
          '<h2 class="card-title">' + esc(i.title) + '</h2>' +
          (i.excerpt ? '<p class="card-excerpt">' + esc(i.excerpt) + '</p>' : '') +
        '</div>' +
        (i.image ? '<img class="card-thumb" src="' + esc(i.image) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
      '</a>';
    }).join('');
    counts();
  }

  function renderDigest(d) {
    if (!d || !d.items || !d.items.length) return;
    el.digestDay.textContent = 'Aujourd’hui en 30 secondes · ' + (d.day_label || '');
    el.digestItems.innerHTML = d.items.map(function (it, n) {
      var src = (it.sources && it.sources[0]) || null;
      return '<div class="digest-item">' +
        '<span class="digest-num">' + String(n + 1).padStart(2, '0') + '</span>' +
        '<div>' +
          '<p class="digest-title">' + esc(it.title) + '</p>' +
          '<p class="digest-why">' + esc(it.why_it_matters) + '</p>' +
          (src ? '<a class="digest-src" href="' + esc(src.url) + '" target="_blank" rel="noopener noreferrer">' +
                 esc(src.name) + ' ↗</a>' : '') +
        '</div>' +
      '</div>';
    }).join('');
    el.digest.hidden = false;
  }

  // ─── chargement ────────────────────────────────────────────

  function load(force) {
    el.refresh.classList.add('spin');
    var opts = force ? { cache: 'reload' } : {};

    var pNews = fetch(API, opts).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
    var pDigest = fetch(DIGEST, opts).then(function (r) {
      return r.ok ? r.json() : null;
    }).catch(function () { return null; });

    return Promise.all([pNews, pDigest]).then(function (res) {
      items = Array.isArray(res[0]) ? res[0] : [];
      try { localStorage.setItem(K_STAMP, new Date().toISOString()); } catch (e) {}
      document.body.classList.remove('is-offline');
      renderFeed();
      renderDigest(res[1]);
      setAge();
    }).catch(function (err) {
      // Le service worker a normalement déjà servi une copie ; si on arrive ici,
      // c'est qu'il n'y a aucune donnée en cache (premier lancement hors ligne).
      document.body.classList.add('is-offline');
      if (!items.length) {
        el.feed.innerHTML = '<p class="state">Pas de connexion et aucune actu enregistrée.<br>' +
          'Reviens quand tu auras du réseau.</p>';
      }
      console.warn('[app] chargement impossible :', err.message);
    }).then(function () {
      el.refresh.classList.remove('spin');
    });
  }

  // ─── interactions ──────────────────────────────────────────

  // marquer comme lu au tap (le lien s'ouvre normalement dans un nouvel onglet)
  el.feed.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    var url = card.getAttribute('data-url');
    if (!url || read.has(url)) return;
    read.add(url);
    saveRead(read);
    card.classList.add('read');
    counts();
  });

  el.filters.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    filter = chip.getAttribute('data-cat');
    Array.prototype.forEach.call(el.filters.querySelectorAll('.chip'), function (c) {
      c.setAttribute('aria-pressed', String(c === chip));
    });
    renderFeed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  el.refresh.addEventListener('click', function () { load(true); });

  el.markAll.addEventListener('click', function () {
    items.forEach(function (i) { read.add(i.url); });
    saveRead(read);
    renderFeed();
  });

  // Pull-to-refresh : seulement quand on est déjà en haut de page.
  var startY = 0, pulling = false, armed = false;
  document.addEventListener('touchstart', function (e) {
    pulling = window.scrollY <= 0 && e.touches.length === 1;
    startY = pulling ? e.touches[0].clientY : 0;
    armed = false;
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!pulling) return;
    var dy = e.touches[0].clientY - startY;
    armed = dy > 70;
    el.ptr.classList.toggle('on', dy > 20);
  }, { passive: true });

  document.addEventListener('touchend', function () {
    if (pulling && armed) load(true);
    el.ptr.classList.remove('on');
    pulling = armed = false;
  }, { passive: true });

  // Revenir sur l'app après un moment → on rafraîchit et on recalcule l'âge affiché
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    setAge();
    var s = localStorage.getItem(K_STAMP);
    if (!s || Date.now() - new Date(s).getTime() > 15 * 60 * 1000) load(false);
  });

  window.addEventListener('online', function () { load(true); });
  window.addEventListener('offline', function () { document.body.classList.add('is-offline'); });

  // ─── notifications push ────────────────────────────────────
  // Clé publique VAPID : publique par nature, elle DOIT être côté client.
  // La clé privée vit uniquement dans le secret GitHub VAPID_PRIVATE_KEY.
  var VAPID_PUBLIC = 'BARW0J86y6KH6KLOgXJnwUqnJVBWostlStEgRIhZ76dMJAxVRcEy1mIyULzZlX2YmUme2jGcf78bXXX6N2Qhg7Y';

  var elNotif = document.getElementById('notif');
  var elSub = document.getElementById('sub');
  var elSubJson = document.getElementById('sub-json');

  function b64ToUint8(base64) {
    var pad = '='.repeat((4 - base64.length % 4) % 4);
    var raw = atob((base64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function pushSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  function refreshNotifBtn(sub) {
    if (!pushSupported()) { elNotif.hidden = true; return; }
    elNotif.hidden = false;
    if (Notification.permission === 'denied') {
      elNotif.textContent = 'Notifs bloquées (réglages du système)';
      elNotif.disabled = true;
    } else if (sub) {
      elNotif.textContent = 'Notif du matin activée ✓';
    } else {
      elNotif.textContent = 'Activer la notif du matin';
    }
  }

  function showSub(sub) {
    elSubJson.value = JSON.stringify(sub);
    elSub.hidden = false;
    elSub.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  elNotif.addEventListener('click', function () {
    if (!pushSupported()) return;
    Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') { refreshNotifBtn(null); return; }
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.getSubscription().then(function (existing) {
          if (existing) return existing;
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: b64ToUint8(VAPID_PUBLIC),
          });
        });
      }).then(function (sub) {
        refreshNotifBtn(sub);
        showSub(sub);
      });
    }).catch(function (e) {
      console.warn('[app] abonnement push impossible :', e.message);
      elNotif.textContent = 'Échec de l’abonnement — réessaie';
    });
  });

  document.getElementById('sub-copy').addEventListener('click', function () {
    var txt = elSubJson.value;
    var done = function () { document.getElementById('sub-copy').textContent = 'Copié ✓'; };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done).catch(function () {
      elSubJson.select(); document.execCommand('copy'); done();
    });
    else { elSubJson.select(); document.execCommand('copy'); done(); }
  });

  document.getElementById('sub-close').addEventListener('click', function () { elSub.hidden = true; });

  // ─── démarrage ─────────────────────────────────────────────

  setAge();
  load(false);

  if ('serviceWorker' in navigator) {
    // SW servi depuis la racine : Vercel redirige /app/ → /app, donc un SW placé
    // dans /app/ (scope « /app/ ») ne contrôlerait pas la page. Le filtrage fin
    // est fait dans app-sw.js, pas par le scope (qui attrape aussi /apprendre).
    navigator.serviceWorker.register('/app-sw.js', { scope: '/app' }).then(function () {
      // l'état du bouton dépend d'un abonnement existant → après le register
      if (!pushSupported()) { refreshNotifBtn(null); return; }
      return navigator.serviceWorker.ready
        .then(function (reg) { return reg.pushManager.getSubscription(); })
        .then(refreshNotifBtn);
    }).catch(function (e) {
      console.warn('[app] service worker non enregistré :', e.message);
    });
  }
})();
