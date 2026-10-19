// LEGACY · bêta : l'app et ses fichiers gardés sur le téléphone (jamais les envois au serveur, qui sont des POST).
const VERSION = 'legacy-beta-9b93ea80ad';
const COEUR = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(COEUR)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('legacy-beta-') && k !== VERSION && k !== 'legacy-beta-modeles').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (!u.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  // les modèles du labo (gros) : gardés une fois pour toutes
  if (/\.(wasm)$|vision_bundle\.js$|wasm\/vision/.test(u.pathname)) {
    e.respondWith(caches.open('legacy-beta-modeles').then(async c => { const m = await c.match(r); if (m) return m; const res = await fetch(r); if (res.ok) c.put(r, res.clone()); return res; }));
    return;
  }
  // l'app : la copie du téléphone tout de suite, la nouvelle version récupérée en arrière-plan
  e.respondWith(caches.open(VERSION).then(async c => {
    const m = await c.match(r, { ignoreSearch: true });
    const frais = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => m);
    return m || frais;
  }));
});
