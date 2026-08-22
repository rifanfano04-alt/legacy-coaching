/* LEGACY — séance : cache l'app pour qu'elle s'ouvre sans réseau à la salle. */
var CACHE = 'lgcy-prog-v1';
var ASSETS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;                      // les envois passent toujours par le réseau
  if (r.url.indexOf('script.google.com') > -1) return;
  e.respondWith(
    fetch(r).then(function (res) {
      if (res && res.status === 200 && r.url.indexOf(self.registration.scope) === 0) {
        var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); });
      }
      return res;
    }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('./index.html'); }); })
  );
});
