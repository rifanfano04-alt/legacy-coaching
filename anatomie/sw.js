// Service worker : l'appli et le modèle 3D sont gardés en cache pour marcher hors connexion.
const VERSION = 'anatomie-41d3005ea9';
const FICHIERS = ["./", "ui.js", "donnees/conseils.js", "donnees/exercices-base.js", "donnees/exos-complements.js", "donnees/exos-dos.js", "donnees/exos-haut-du-corps.js", "donnees/exos-jambes.js", "donnees/exos-rehab-mobilite.js", "donnees/exos-street.js", "donnees/exos-tronc-athle.js", "donnees/fiches-membre-inf.js", "donnees/fiches-membre-sup.js", "donnees/fiches-tete.js", "donnees/fiches-tronc-cou.js", "donnees/os.js", "donnees/rehab.js", "donnees/symptomes.js", "donnees/vocabulaire.js", "modele/corps.bin", "modele/corps-delta.bin", "modele/tendon.bin", "modele/attaches.json", "modele/corps.json", "modele/structures.json", "icon-192.png", "icon-512.png", "icon-512-maskable.png", "apple-touch-icon.png", "manifest.webmanifest"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('anatomie-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  // bibliothèques (three.js) et polices : réseau d'abord une fois, puis cache
  if (u.origin !== location.origin) {
    if (!/cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host)) return;
    e.respondWith(caches.open(VERSION + '-ext').then(async c => { const m = await c.match(r); if (m) return m; const res = await fetch(r); if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }));
    return;
  }
  // fichiers de l'appli : cache d'abord (ignore les paramètres de version)
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r)));
});
