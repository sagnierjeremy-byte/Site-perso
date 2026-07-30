/* ============================================================
 * Service worker de la PWA « Jerwis News » (/app).
 *
 * POURQUOI CE FICHIER EST À LA RACINE ET NON DANS /app/ :
 * Vercel (cleanUrls) redirige /app/ → /app en 308. La page vit donc à « /app »,
 * sans slash final — or un SW placé dans /app/ a le scope « /app/ » et ne
 * contrôlerait JAMAIS cette page. Servi depuis la racine, il peut revendiquer
 * le scope « /app ».
 *
 * ⚠️ MAIS le scope d'un SW est un préfixe de CHAÎNE, pas de segment : « /app »
 * matche aussi « /apprendre », une vraie page du site. On ne se repose donc PAS
 * sur le scope pour se protéger : le handler fetch ci-dessous n'intercepte que
 * des URLs explicitement listées et laisse passer tout le reste sans y toucher
 * (pas de respondWith = comportement réseau normal). Conséquence : même si
 * /apprendre tombe dans le scope, ce SW ne peut pas lui servir de cache périmé.
 *
 * Stratégies :
 *   - shell de l'app (/app, /app/*)          → cache-first + revalidation
 *   - polices et icônes (immuables)           → cache-first
 *   - /api/news, /data/news-summary.json      → network-first + repli cache
 *   - tout le reste du site, images tierces   → NON INTERCEPTÉ
 * ============================================================ */

var VERSION = 'jerwis-news-v1';

var SHELL = [
  '/app',
  '/app/app.css?v=1',
  '/app/app.js?v=1',
  '/app/manifest.webmanifest',
  '/assets/fonts.css',
  '/assets/fonts/archivo.woff2',
  '/assets/fonts/archivo-black.woff2',
  '/assets/fonts/jetbrains-mono.woff2',
  '/photos/app-icons/icon-192.png',
  '/photos/app-icons/apple-touch-icon.png',
];

var DATA = ['/api/news', '/data/news-summary.json'];

// Seules ces URLs sont gérées par le SW. Tout le reste passe au réseau.
var RE_APP = /^\/app(\/|$)/;                       // /app et /app/... mais PAS /apprendre
var RE_IMMUTABLE = /^\/(assets\/fonts(\.css|\/)|photos\/app-icons\/)/;

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (c) {
      // add() une par une : addAll échoue en bloc si une seule URL est absente
      return Promise.all(SHELL.map(function (u) {
        return c.add(new Request(u, { cache: 'reload' })).catch(function () {
          console.warn('[sw] pré-cache ignoré :', u);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (k) { return k !== VERSION; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function cacheFirst(req) {
  return caches.match(req).then(function (hit) {
    if (hit) {
      // revalidation silencieuse pour la prochaine ouverture
      fetch(req).then(function (res) {
        if (res && res.ok) caches.open(VERSION).then(function (c) { c.put(req, res); });
      }).catch(function () {});
      return hit;
    }
    return fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    });
  });
}

function networkFirst(req) {
  return fetch(req).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(VERSION).then(function (c) { c.put(req, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || Response.error(); });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Origines tierces (vignettes des articles) : jamais mises en cache.
  if (url.origin !== self.location.origin) return;

  var p = url.pathname;

  if (DATA.indexOf(p) !== -1) { e.respondWith(networkFirst(req)); return; }
  if (RE_IMMUTABLE.test(p))   { e.respondWith(cacheFirst(req));   return; }

  if (RE_APP.test(p)) {
    // navigation vers l'app hors ligne → on ressort le shell
    if (req.mode === 'navigate') {
      e.respondWith(fetch(req).catch(function () {
        return caches.match('/app').then(function (hit) { return hit || Response.error(); });
      }));
    } else {
      e.respondWith(cacheFirst(req));
    }
    return;
  }

  // Reste du site (/apprendre, /articles/*, /assets/main.css…) : on ne touche à rien.
});
