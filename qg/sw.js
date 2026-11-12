// LEGACY QG · service worker v1 : réseau d'abord (toujours la dernière version), cache en secours.
const V = 'qg-v8';
const SHELL = ['./', './index.html', './style.css', './app.js', './config.js', './logo.png', './logo-contour.png', './icon-192.png', './icon-512.png', './icon-180.png', './favicon-32.png', './favicon-64.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r => { const c = r.clone(); caches.open(V).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
