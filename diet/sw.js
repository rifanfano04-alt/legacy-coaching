/* Service worker — Diet LEGACY.
   Stratégie : réseau d'abord pour la page (mises à jour rapides), cache en secours (hors ligne).
   Penser à incrémenter CACHE à chaque déploiement d'une nouvelle version. */
var CACHE = 'diet-v8';
var PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './bg.jpg',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return; // ne jamais intercepter les envois (Apps Script, Open Food Facts…)

  // Ne pas mettre en cache les réponses d'API (Open Food Facts) : toujours le réseau
  if (/openfoodfacts\.org|script\.google\.com/.test(req.url)) return;

  // Page : réseau d'abord, cache en secours
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Statique (icônes, manifest, polices Google) : cache d'abord, réseau sinon
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
