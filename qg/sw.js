// LEGACY QG · service worker v1 : réseau d'abord (toujours la dernière version), cache en secours.
const V = 'qg-v30';
const SHELL = ['./', './index.html', './style.css', './app.js', './config.js', './logo.png', './logo-contour.png', './icon-192.png', './icon-512.png', './icon-180.png', './favicon-32.png', './favicon-64.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r => { const c = r.clone(); caches.open(V).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
// notifications (résumé du matin, « X a payé ») envoyées par la fonction Supabase « notif »
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { texte: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titre || 'LEGACY QG', { body: d.texte || '', icon: 'icon-192.png', badge: 'favicon-64.png', data: { lien: d.lien || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(L => { const c = L.find(x => x.url.includes('/qg/')); return c ? c.focus() : clients.openWindow(new URL(e.notification.data.lien || './', self.registration.scope).href); }));
});
