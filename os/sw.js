// LEGACY · bêta : l'app et ses fichiers gardés sur le téléphone (jamais les envois au serveur, qui sont des POST).
const VERSION = 'legacy-beta-bc99566648';
const COEUR = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "logo-blanc.png"];
// (21/10) l'installation prend les fichiers FRAIS (pas la copie de 10 minutes que GitHub laisse au téléphone)
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(COEUR.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
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
  // (21/10, coach : « je vois pas les modifs ») LA PAGE : en direct à chaque ouverture (toujours la dernière version) ; la copie du
  // téléphone seulement sans réseau (ou si le réseau met plus de 4 s)
  if (r.mode === 'navigate') {
    e.respondWith(caches.open(VERSION).then(async c => {
      const frais = fetch(r.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => { if (res.ok) c.put(new URL('./', self.registration.scope).href, res.clone()); return res; });
      try { e.waitUntil(frais.catch(() => {})); } catch (er) {}
      const m = await c.match(new URL('./', self.registration.scope).href);
      if (!m) return frais;
      return Promise.race([frais.catch(() => m), new Promise(ok => setTimeout(() => ok(m), 4000))]);
    }));
    return;
  }
  // les autres fichiers de l'app : la copie du téléphone tout de suite, la version fraîche récupérée pour la fois suivante
  e.respondWith(caches.open(VERSION).then(async c => {
    const m = await c.match(r, { ignoreSearch: true });
    const frais = fetch(r, { cache: 'no-cache' }).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => m);
    try { e.waitUntil(frais); } catch (er) {}
    return m || frais;
  }));
});
