// Interface : fiches, fonctions cliquables, exercices, réhab, listes. Parle au moteur 3D via window.Corps.
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '’');
const NIV = { p: 1, s: 0.55, st: 0.3 };
const NOM_NIV = { p: 'Principal', s: 'Secondaire', st: 'Stabilisateur' };

// ======================= Données dérivées =======================
const D = { fonctions: new Map(), parMuscle: new Map(), exoParMuscle: new Map(), exoParId: new Map(), osParMuscle: new Map() };

function analyserFonction(tok) {
  let principal = false; tok = tok.trim();
  if (tok.endsWith('!')) { principal = true; tok = tok.slice(0, -1); }
  let [code, lib] = tok.split('=');
  const [art, mv] = code.split('.');
  const artLib = ARTICULATIONS[art] || art;
  const mvLib = lib || MOUVEMENTS[mv] || mv;
  return { code, art, mv, artLib, mvLib, principal, libelle: artLib + ' · ' + mvLib };
}
function preparer() {
  for (const [k, f] of Object.entries(FICHES)) {
    const fs = (f.a || []).map(analyserFonction);
    D.parMuscle.set(k, fs);
    for (const fn of fs) {
      if (!D.fonctions.has(fn.code)) D.fonctions.set(fn.code, { code: fn.code, art: fn.art, artLib: fn.artLib, mvLib: fn.mvLib, mv: fn.mv, muscles: [] });
      D.fonctions.get(fn.code).muscles.push({ k, principal: fn.principal });
    }
  }
  const resoudre = (t) => GROUPES[t] || [t];
  for (const e of EXOS) {
    if (!e.c && window.CONSEILS && CONSEILS[e.nom]) e.c = CONSEILS[e.nom];
    D.exoParId.set(e.id, e);
    e.niveaux = new Map();
    for (const [champ, niv] of [['st', 'st'], ['s', 's'], ['p', 'p']]) for (const t of e[champ]) for (const k of resoudre(t)) e.niveaux.set(k, niv);
    for (const [k, niv] of e.niveaux) { if (!D.exoParMuscle.has(k)) D.exoParMuscle.set(k, []); D.exoParMuscle.get(k).push({ e, niv }); }
    e.texte = norm(e.nom + ' ' + (CATEGORIES[e.cat] || '') + ' ' + e.mat.map(m => MATERIEL[m] || m).join(' '));
    const de = (niv) => [...e.niveaux].filter(x => x[1] === niv).map(([k]) => Corps.structures.get(k)).filter(Boolean);
    e.grp = { p: [...new Set(de('p').map(st => norm(st.g)))], s: [...new Set(de('s').map(st => norm(st.g)))] };
    e.txt = { p: norm(de('p').map(st => st.fr).join(' ')), s: norm(de('s').map(st => st.fr).join(' ')) };
  }
  for (const v of D.exoParMuscle.values()) v.sort((a, b) => 'p s st'.indexOf(a.niv) - 'p s st'.indexOf(b.niv) || a.e.niv - b.e.niv);
  window.REHAB.forEach(r => { r.cles = new Set(r.cibles.split(/\s+/).flatMap(resoudre)); });
}
function antagoniste(code) { const [art, mv] = code.split('.'); const o = OPPOSES[mv]; return o && D.fonctions.has(art + '.' + o) ? art + '.' + o : null; }
function synergistes(k) {
  const score = new Map();
  for (const fn of D.parMuscle.get(k) || []) {
    for (const m of D.fonctions.get(fn.code).muscles) if (m.k !== k) score.set(m.k, (score.get(m.k) || 0) + (fn.principal ? 2 : 1) * (m.principal ? 2 : 1));
  }
  return [...score].sort((a, b) => b[1] - a[1]).slice(0, 8).map(x => x[0]);
}
function antagonistes(k) {
  const res = new Map();
  for (const fn of D.parMuscle.get(k) || []) {
    if (!fn.principal) continue;
    const a = antagoniste(fn.code); if (!a) continue;
    for (const m of D.fonctions.get(a).muscles) if (m.principal && m.k !== k) res.set(m.k, (res.get(m.k) || 0) + 1);
  }
  return [...res].sort((a, b) => b[1] - a[1]).slice(0, 8).map(x => x[0]);
}
function muscleSurOs(cleOs) {
  const fiche = window.osFiche(cleOs);
  let mots = (fiche.mots || []).map(norm);
  const m = cleOs.match(/^(\w+?)_(cervical|thoracic|lumbar)_vertebra$/);
  if (m) {
    const ord = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12 }[m[1]];
    const z = { cervical: 'C', thoracic: 'T', lumbar: 'L' }[m[2]];
    const lim = { cervical: 7, thoracic: 12, lumbar: 5 }[m[2]];
    // muscles dont une plage « X à Y » couvre cette vertèbre
    const res = [];
    for (const [k, f] of Object.entries(FICHES)) {
      const txt = (f.o || '') + ' ' + (f.i || '');
      const plages = [...txt.matchAll(/([CTL])(\d+)\s*(?:à|-)\s*([CTL])?(\d+)/g)];
      const rang = (l, n) => ({ C: 0, T: 7, L: 19 }[l] + +n);
      const moi = rang(z, ord);
      if (plages.some(p => rang(p[1], p[2]) <= moi && moi <= rang(p[3] || p[1], p[4])) || new RegExp('\\b' + z + ord + '\\b').test(txt)) res.push(k);
    }
    return res;
  }
  if (!mots.length) return [];
  const res = [];
  for (const [k, f] of Object.entries(FICHES)) {
    // mots entiers seulement ; la bandelette « ilio-tibiale » ne désigne pas le tibia
    const t = norm((f.o || '') + ' ' + (f.i || '') + ' ' + (f.att || '')).replace(/ilio-tibial\w*/g, '');
    if (mots.some(w => w.length > 2 && new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![a-z])').test(t))) res.push(k);
  }
  return res;
}

// ======================= Stockage des listes =======================
const Stock = {
  etat: { listes: [{ id: 'favoris', nom: 'Favoris', exos: [] }] }, ref: null, abonnes: [],
  async init() {
    try { const v = localStorage.getItem('legacy-anatomie-listes'); if (v) this.etat = JSON.parse(v); } catch (e) {}
    this.publier();
    const claude = window.claude;
    if (!claude || !claude.use) return;
    try {
      const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
      const id = user ? await user.id() : null;
      if (!db || !id) return;
      this.ref = db.doc('data/users/' + id + '/listes');
      this.ref.onSnapshot((snap) => {
        if (snap.exists) { const d = snap.data(); if (d && Array.isArray(d.listes)) { this.etat = JSON.parse(JSON.stringify(d)); this.local(); this.publier(); } }
        else if (this.etat.listes.some(l => l.exos.length) || this.etat.listes.length > 1) this.sauver(); // migre le local vers le compte
      }, () => {});
    } catch (e) { /* stockage local seulement */ }
  },
  local() { try { localStorage.setItem('legacy-anatomie-listes', JSON.stringify(this.etat)); } catch (e) {} },
  ecriture: Promise.resolve(),
  sauver() {
    this.local(); this.publier();
    if (!this.ref) return;
    const copie = JSON.parse(JSON.stringify(this.etat));
    this.ecriture = this.ecriture.then(() => this.ref.set(copie)).catch(() => toast('Liste gardée sur cet appareil seulement.'));
  },
  publier() { this.abonnes.forEach(f => f()); },
  liste(id) { return this.etat.listes.find(l => l.id === id); },
  contient(id, exo) { const l = this.liste(id); return !!l && l.exos.includes(exo); },
  basculer(id, exo) { const l = this.liste(id); if (!l) return; const i = l.exos.indexOf(exo); i >= 0 ? l.exos.splice(i, 1) : l.exos.push(exo); this.sauver(); },
  creer(nom) { const l = { id: 'l' + Date.now().toString(36), nom: nom.slice(0, 60), exos: [] }; this.etat.listes.push(l); this.sauver(); return l; },
  renommer(id, nom) { const l = this.liste(id); if (l) { l.nom = nom.slice(0, 60); this.sauver(); } },
  supprimer(id) { if (id === 'favoris') return; this.etat.listes = this.etat.listes.filter(l => l.id !== id); this.sauver(); },
  video(exo) { return (this.etat.videos || {})[exo] || ''; },
  poserVideo(exo, url) { this.etat.videos = this.etat.videos || {}; if (url) this.etat.videos[exo] = url; else delete this.etat.videos[exo]; this.sauver(); },
  deplacer(id, exo, d) { const l = this.liste(id); const i = l.exos.indexOf(exo), j = i + d; if (i < 0 || j < 0 || j >= l.exos.length) return; [l.exos[i], l.exos[j]] = [l.exos[j], l.exos[i]]; this.sauver(); },
};

// ======================= Panneau (navigation à pile) =======================
const panneau = $('#panneau'), pCorps = $('#pCorps'), pTitre = $('#pTitre'), pSur = $('#pSur'), pRetour = $('#pRetour');
let pile = [], hauteur = 'ferme';
function reglerHauteur(h) {
  hauteur = h; panneau.dataset.h = h; document.body.dataset.panneau = h;
  // hauteur finale cachée par le panneau + la barre d'onglets (pas mesurée : le panneau est en cours d'animation)
  const H = h === 'mi' ? innerHeight * 0.52 : h === 'plein' ? innerHeight - 116 : 0;
  Corps.decaler(h === 'ferme' ? 0 : H + 52);
}
function ouvrir(vue, h = 'mi', remplacer = false) {
  if (remplacer) pile = []; pile.push(vue); afficher(); reglerHauteur(h);
}
function afficher() {
  const v = pile[pile.length - 1]; if (!v) return;
  if (Corps.isole) Corps.isoler(null);
  pRetour.style.visibility = pile.length < 2 ? 'hidden' : 'visible'; pSur.textContent = v.sur || ''; pTitre.textContent = v.titre || '';
  pCorps.replaceChildren(); v.rendre(pCorps); pCorps.scrollTop = 0;
  if (v.surligner) Corps.surligner(v.surligner(), v.cle || null, !!v.chaleur);
}
function fermer() { if (Corps.isole) Corps.isoler(null); pile = []; Corps.effacer(); reglerHauteur('ferme'); onglet('corps', true); }
pRetour.onclick = () => { pile.pop(); afficher(); };
$('#pFermer').onclick = fermer;
$('#pPoignee').onclick = () => reglerHauteur(hauteur === 'plein' ? 'mi' : 'plein');
// glisser la poignée vers le bas pour fermer / réduire
(() => { let y0 = null; const h = $('#pPoignee');
  h.addEventListener('pointerdown', e => { y0 = e.clientY; });
  addEventListener('pointerup', e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null;
    if (dy > 60) hauteur === 'plein' ? reglerHauteur('mi') : fermer(); else if (dy < -60) reglerHauteur('plein'); });
})();

// ======================= Composants =======================
function section(parent, titre) { const s = el('section', 'bloc'); if (titre) s.append(el('h3', 'bloc-t', titre)); parent.append(s); return s; }
function puce(txt, onclick, cls = '') { const b = el('button', 'puce ' + cls, txt); b.type = 'button'; if (onclick) b.onclick = onclick; return b; }
function nomStructure(k) { return Corps.structures.get(k)?.fr || k; }
function ligneExo(e, niv) {
  const li = el('button', 'ligne-exo'); li.type = 'button';
  const g = el('span', 'le-g'); g.append(el('span', 'le-nom', e.nom));
  g.append(el('span', 'le-meta', (CATEGORIES[e.cat] || e.cat) + ' · ' + e.mat.map(m => MATERIEL[m] || m).join(', ')));
  li.append(g);
  const d = el('span', 'le-d');
  if (niv) d.append(el('span', 'badge b-' + niv, NOM_NIV[niv]));
  d.append(el('span', 'niv', '●'.repeat(e.niv) + '○'.repeat(3 - e.niv)));
  if (Stock.contient('favoris', e.id)) d.append(el('span', 'etoile', '★'));
  li.append(d);
  li.onclick = () => vueExo(e);
  return li;
}
function listeMuscles(parent, cles, niv) {
  const w = el('div', 'puces');
  for (const k of cles) w.append(puce(nomStructure(k), () => vueStructure(k), niv ? 'pn-' + niv : ''));
  parent.append(w);
}
// « Isoler » : n'affiche que ces muscles (et le squelette), sans rien devant
function boutonIsoler(cles, texte = 'Isoler ce muscle') {
  const b = el('button', 'btn btn-isoler'); b.type = 'button';
  const maj = () => { b.textContent = Corps.isole ? '\u25c9 Tout réafficher' : '\u25ce ' + texte; b.setAttribute('aria-pressed', !!Corps.isole); };
  b.onclick = () => { Corps.isoler(Corps.isole ? null : cles); maj(); };
  maj(); return b;
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.dataset.on = ''; clearTimeout(toast.t); toast.t = setTimeout(() => delete t.dataset.on, 2200); }

// ======================= Vues =======================
function vueStructure(k) {
  const s = Corps.structures.get(k); if (!s) return;
  if (s.t === 'o') return ouvrir(vueOs(k));
  ouvrir({ cle: k, sur: s.g + ' · ' + ({ s: 'superficiel', p: 'profond', t: 'tendon / fascia', c: 'cartilage' }[s.couche] || ''), titre: s.fr,
    surligner: () => ({ [k]: 1 }),
    rendre(c) {
      const f = FICHES[k] || {};
      c.append(el('p', 'latin', s.en));
      c.append(boutonIsoler([k]));
      if (f.d) { const b = section(c, 'Description'); b.append(el('p', '', f.d)); if (f.att) b.append(el('p', 'sous', 'Attaches : ' + f.att)); }
      const fs = D.parMuscle.get(k) || [];
      if (fs.length) {
        const b = section(c, 'Fonctions'); b.append(el('p', 'aide-txt', 'Touche une fonction pour voir tous les muscles qui la réalisent.'));
        const parArt = new Map(); fs.forEach(fn => { if (!parArt.has(fn.artLib)) parArt.set(fn.artLib, []); parArt.get(fn.artLib).push(fn); });
        for (const [art, l] of parArt) {
          const r = el('div', 'fn-ligne'); r.append(el('span', 'fn-art', art));
          const w = el('div', 'puces'); l.forEach(fn => w.append(puce(fn.mvLib + (fn.principal ? ' ★' : ''), () => vueFonction(fn.code), fn.principal ? 'pn-p' : 'pn-s'))); r.append(w); b.append(r);
        }
      }
      if (f.o) {
        const b = section(c, 'Anatomie');
        for (const [t, v] of [['Origine', f.o], ['Insertion', f.i], ['Innervation', f.n]]) { const r = el('div', 'kv'); r.append(el('span', 'k', t), el('span', 'v', v)); b.append(r); }
      }
      const syn = synergistes(k), ant = antagonistes(k);
      if (syn.length) { const b = section(c, 'Synergistes'); listeMuscles(b, syn); }
      if (ant.length) { const b = section(c, 'Antagonistes'); listeMuscles(b, ant); }
      if (f.note) { const b = section(c, 'Pour le coach'); b.append(el('p', 'note', f.note)); }
      const ex = D.exoParMuscle.get(k) || [];
      const b = section(c, 'Exercices (' + ex.length + ')');
      if (!ex.length) b.append(el('p', 'aide-txt', 'Aucun exercice ne cible spécifiquement ce muscle.'));
      const filtre = el('div', 'puces filtres'); let actif = 'tous';
      const liste = el('div', 'liste');
      const maj = () => { liste.replaceChildren(); ex.filter(x => actif === 'tous' || x.niv === actif).forEach(x => liste.append(ligneExo(x.e, x.niv))); };
      for (const [v, t] of [['tous', 'Tous'], ['p', 'Principal'], ['s', 'Secondaire'], ['st', 'Stabilisateur']]) {
        const n = v === 'tous' ? ex.length : ex.filter(x => x.niv === v).length; if (!n) continue;
        const p = puce(t + ' ' + n, () => { actif = v; filtre.querySelectorAll('.puce').forEach(q => q.setAttribute('aria-pressed', q === p)); maj(); }); p.setAttribute('aria-pressed', v === 'tous'); filtre.append(p);
      }
      if (ex.length) b.append(filtre, liste); maj();
    } }, 'mi');
}
function vueOs(k) {
  const s = Corps.structures.get(k), f = window.osFiche(k, s.fr), ms = muscleSurOs(k);
  return { cle: k, sur: s.g + ' · os', titre: s.fr, surligner: () => { const m = { [k]: 1 }; ms.forEach(x => m[x] = 0.5); return m; },
    rendre(c) {
      c.append(el('p', 'latin', s.en));
      if (f.d) { const b = section(c, 'Description'); b.append(el('p', '', f.d)); }
      const b = section(c, 'Muscles qui s’y attachent (' + ms.length + ')');
      if (ms.length) listeMuscles(b, ms); else b.append(el('p', 'aide-txt', 'Aucun muscle du modèle ne s’y attache directement.'));
    } };
}
function vueFonction(code) {
  const fn = D.fonctions.get(code); if (!fn) return;
  const ant = antagoniste(code);
  ouvrir({ sur: 'Fonction · ' + fn.artLib, titre: fn.mvLib,
    surligner: () => { const m = {}; fn.muscles.forEach(x => { m[x.k] = Math.max(m[x.k] || 0, x.principal ? 1 : 0.5); }); return m; },
    rendre(c) {
      const pr = fn.muscles.filter(x => x.principal).map(x => x.k), se = fn.muscles.filter(x => !x.principal).map(x => x.k);
      const uniq = (a) => [...new Set(a)];
      if (pr.length) { const b = section(c, 'Moteurs principaux'); listeMuscles(b, uniq(pr), 'p'); }
      if (se.length) { const b = section(c, 'Muscles accessoires'); listeMuscles(b, uniq(se).filter(k => !pr.includes(k)), 's'); }
      if (ant) { const b = section(c, 'Mouvement opposé'); b.append(puce(D.fonctions.get(ant).artLib + ' · ' + D.fonctions.get(ant).mvLib, () => vueFonction(ant))); }
      // exercices qui travaillent les moteurs principaux
      const sc = new Map();
      for (const k of uniq(pr)) for (const x of D.exoParMuscle.get(k) || []) if (x.niv === 'p') sc.set(x.e, (sc.get(x.e) || 0) + 1);
      const ex = [...sc].sort((a, b) => b[1] - a[1]).slice(0, 25).map(x => x[0]);
      if (ex.length) { const b = section(c, 'Exercices qui travaillent cette fonction'); const l = el('div', 'liste'); ex.forEach(e => l.append(ligneExo(e))); b.append(l); }
    } }, 'mi');
}
function vueExo(e) {
  ouvrir({ sur: (CATEGORIES[e.cat] || e.cat) + ' · niveau ' + e.niv, titre: e.nom, chaleur: true,
    surligner: () => { const m = {}; for (const [k, n] of e.niveaux) m[k] = NIV[n]; return m; },
    rendre(c) {
      const act = el('div', 'actions');
      const fav = el('button', 'btn', Stock.contient('favoris', e.id) ? '★ En favori' : '☆ Favori'); fav.type = 'button';
      fav.onclick = () => { Stock.basculer('favoris', e.id); fav.textContent = Stock.contient('favoris', e.id) ? '★ En favori' : '☆ Favori'; };
      const aj = el('button', 'btn', '+ Ajouter à une liste'); aj.type = 'button'; aj.onclick = () => choisirListe(e);
      const vid = Stock.video(e.id);
      const demo = el('a', 'btn', vid ? '\u25b6 Ta vidéo' : '\u25b6 Voir une démo'); demo.href = vid || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(e.nom + ' exercice'); demo.target = '_blank'; demo.rel = 'noopener';
      const part = el('button', 'btn btn-fort', '\u2934 Partager la fiche'); part.type = 'button'; part.onclick = () => partagerExo(e);
      act.append(part, fav, aj, demo, boutonIsoler([...e.niveaux].filter(x => x[1] !== 'st').map(x => x[0]), 'Isoler ces muscles')); c.append(act);
      if (e.c) { const b = section(c, 'Exécution'); b.append(el('p', 'note', e.c)); }
      const b = section(c, 'Muscles');
      for (const niv of ['p', 's', 'st']) {
        const cles = [...e.niveaux].filter(x => x[1] === niv).map(x => x[0]); if (!cles.length) continue;
        const r = el('div', 'fn-ligne'); r.append(el('span', 'fn-art', NOM_NIV[niv])); listeMuscles(r, cles, niv); b.append(r);
      }
      const m = section(c, 'Matériel'); const w = el('div', 'puces'); e.mat.forEach(x => w.append(el('span', 'tag', MATERIEL[x] || x))); m.append(w);
      // lien vidéo du coach : joint à la fiche partagée
      const bv = section(c, 'Ta vidéo d’exécution'); const iv = el('input', 'recherche'); iv.type = 'url'; iv.id = 'videoExo'; iv.placeholder = 'Colle un lien (YouTube, Insta, Drive…) : il sera joint au partage'; iv.value = Stock.video(e.id);
      iv.onchange = () => { const u = iv.value.trim(); if (u && !/^https?:\/\//i.test(u)) { toast('Le lien doit commencer par https://'); return; } Stock.poserVideo(e.id, u); toast(u ? 'Vidéo enregistrée pour cet exercice' : 'Vidéo retirée'); };
      bv.append(iv);
      // exercices proches : mêmes muscles principaux
      const p = [...e.niveaux].filter(x => x[1] === 'p').map(x => x[0]);
      const sc = new Map();
      for (const k of p) for (const x of D.exoParMuscle.get(k) || []) if (x.e !== e && x.niv === 'p') sc.set(x.e, (sc.get(x.e) || 0) + 1);
      const pro = [...sc].sort((a, b) => b[1] - a[1]).slice(0, 8).map(x => x[0]);
      if (pro.length) { const b2 = section(c, 'Exercices proches (variantes)'); const l = el('div', 'liste'); pro.forEach(x => l.append(ligneExo(x))); b2.append(l); }
    } }, 'mi');
}
// ======================= Fiche exercice à partager (image + texte) =======================
const C_NIV = { p: '#ff3b30', s: '#ff9500', st: '#ffd60a' };
function lignesTexte(x, txt, maxW) {
  const mots = txt.split(/\s+/), out = []; let l = '';
  for (const m of mots) { const t = l ? l + ' ' + m : m; if (x.measureText(t).width > maxW && l) { out.push(l); l = m; } else l = t; }
  if (l) out.push(l); return out;
}
async function imageFiche(e) {
  try { await Promise.all(['800 70px Archivo', '600 30px Archivo', '500 24px "IBM Plex Mono"'].map(f => document.fonts.load(f))); } catch (er) {}
  const ph = await Corps.photos(900), acc = ph.accent, vid = Stock.video(e.id);
  const W = 1080, P = 72, CW = W - 2 * P;
  const noms = (niv) => [...new Set([...e.niveaux].filter(x => x[1] === niv).map(([k]) => nomStructure(k).replace(/,.*$/, '')))];
  const dessiner = (x) => {
    let y = 0;
    const texte = (t, font, col, lh, maxW = CW, xx = P) => { x.font = font; x.fillStyle = col; const ls = lignesTexte(x, t, maxW); ls.forEach(l => { y += lh; x.fillText(l, xx, y); }); return ls.length; };
    const titre = (t) => { y += 46; x.font = '600 21px "IBM Plex Mono", monospace'; x.fillStyle = acc; x.fillText(t.toUpperCase().split('').join(String.fromCharCode(8202)), P, y); y += 4; };
    // en-tête
    y = 88; x.font = '800 34px Archivo, sans-serif'; x.fillStyle = '#f4ece2'; x.fillText('L E G A C Y', P, y);
    x.font = '500 20px "IBM Plex Mono", monospace'; x.fillStyle = acc; x.textAlign = 'right'; x.fillText('FICHE EXERCICE', W - P, y); x.textAlign = 'left';
    y += 24; x.fillStyle = acc; x.fillRect(P, y, 64, 3); y += 26;
    texte(((CATEGORIES[e.cat] || e.cat) + ' · ' + ['', 'Débutant', 'Intermédiaire', 'Avancé'][e.niv]).toUpperCase(), '500 22px "IBM Plex Mono", monospace', acc, 30);
    y += 8; texte(e.nom, '800 68px Archivo, sans-serif', '#ffffff', 76);
    // corps de face et de dos, muscles en couleur
    y += 34; const hI = 620, larg = (c) => hI * c.width / c.height;
    const lf = larg(ph.face), ld = larg(ph.dos), esp = Math.max(40, (CW - lf - ld) / 3);
    x.drawImage(ph.face, P + esp, y, lf, hI); x.drawImage(ph.dos, P + 2 * esp + lf, y, ld, hI);
    x.font = '500 18px "IBM Plex Mono", monospace'; x.fillStyle = 'rgba(244,236,226,.5)'; x.textAlign = 'center';
    x.fillText('FACE', P + esp + lf / 2, y + hI + 30); x.fillText('DOS', P + 2 * esp + lf + ld / 2, y + hI + 30); x.textAlign = 'left';
    y += hI + 62;
    let lx = P; x.font = '500 20px "IBM Plex Mono", monospace';
    for (const [n, lib] of [['p', 'Principal'], ['s', 'Secondaire'], ['st', 'Stabilisateur']]) { x.fillStyle = C_NIV[n]; x.beginPath(); x.arc(lx + 8, y - 7, 8, 0, 7); x.fill(); x.fillStyle = 'rgba(244,236,226,.75)'; x.fillText(lib.toUpperCase(), lx + 24, y); lx += x.measureText(lib).width + 80; }
    if (e.c) { titre('Exécution'); texte(e.c, '400 31px Archivo, sans-serif', '#eae2d8', 42); }
    titre('Muscles');
    for (const [n, lib] of [['p', 'Principaux'], ['s', 'Secondaires']]) { const l = noms(n); if (!l.length) continue; y += 6; texte(lib + ' : ' + l.join(' · '), '500 27px Archivo, sans-serif', n === 'p' ? '#ffffff' : 'rgba(244,236,226,.72)', 37); }
    if (e.mat.length) { titre('Matériel'); texte(e.mat.map(m => MATERIEL[m] || m).join(' · '), '500 27px Archivo, sans-serif', 'rgba(244,236,226,.8)', 37); }
    if (vid) { titre('▶ Vidéo d’exécution'); texte(vid.replace(/^https?:\/\//, ''), '500 25px "IBM Plex Mono", monospace', '#ffffff', 34); }
    y += 70; x.font = 'italic 600 24px Archivo, sans-serif'; x.fillStyle = 'rgba(244,236,226,.45)'; x.textAlign = 'center'; x.fillText('Build your own legacy', W / 2, y); x.textAlign = 'left';
    return y + 56;
  };
  // 1er passage : mesure de la hauteur ; 2e : dessin
  const m = document.createElement('canvas').getContext('2d'); const H = Math.ceil(dessiner(m));
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#120c0b'); g.addColorStop(1, '#060505'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const h = x.createRadialGradient(W / 2, 560, 0, W / 2, 560, 620); h.addColorStop(0, acc + '22'); h.addColorStop(1, 'transparent'); x.fillStyle = h; x.fillRect(0, 0, W, H);
  dessiner(x);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
function texteFiche(e) {
  const noms = (niv) => [...new Set([...e.niveaux].filter(x => x[1] === niv).map(([k]) => nomStructure(k).replace(/,.*$/, '')))].join(', ');
  const vid = Stock.video(e.id);
  return [e.nom.toUpperCase(), e.c ? 'Exécution : ' + e.c : '', 'Muscles principaux : ' + noms('p'), noms('s') ? 'Secondaires : ' + noms('s') : '', vid ? 'Vidéo : ' + vid : '', '— LEGACY'].filter(Boolean).join('\n\n');
}
async function partagerExo(e) {
  toast('Préparation de la fiche…');
  const blob = await imageFiche(e), nomF = 'LEGACY-' + norm(e.nom).replace(/[^a-z0-9]+/g, '-') + '.png', txt = texteFiche(e);
  const fichier = new File([blob], nomF, { type: 'image/png' }), url = URL.createObjectURL(blob);
  const dlg = $('#dlg'), corps = $('#dlgCorps'); corps.replaceChildren();
  const img = el('img', 'apercu-fiche'); img.src = url; img.alt = 'Fiche ' + e.nom;
  const act = el('div', 'actions');
  const bP = el('button', 'btn btn-fort', '⤴ Envoyer'); bP.type = 'button';
  bP.onclick = async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [fichier] })) await navigator.share({ files: [fichier], title: e.nom, text: txt });
      else if (navigator.share) await navigator.share({ title: e.nom, text: txt });
      else throw new Error('pas de partage');
    } catch (er) { if (er.name !== 'AbortError') toast('Partage impossible ici : enregistre l’image et copie le texte'); }
  };
  const bE = el('a', 'btn', '↓ Enregistrer l’image'); bE.href = url; bE.download = nomF;
  const bT = el('button', 'btn', 'Copier le texte'); bT.type = 'button';
  bT.onclick = () => navigator.clipboard.writeText(txt).then(() => toast('Texte copié : colle-le sous l’image'), () => toast('Copie impossible ici'));
  act.append(bP, bE, bT);
  corps.append(el('h3', 'bloc-t', 'Fiche à envoyer'), img, act, el('p', 'aide-txt', 'Sur téléphone, « Envoyer » ouvre WhatsApp, Insta, Messages… avec l’image et le texte (et ta vidéo si tu en as mis une).'));
  dlg.showModal(); dlg.addEventListener('close', () => setTimeout(() => URL.revokeObjectURL(url), 1000), { once: true });
}
function choisirListe(e) {
  const dlg = $('#dlg'), corps = $('#dlgCorps'); corps.replaceChildren();
  corps.append(el('h3', 'bloc-t', 'Ajouter « ' + e.nom + ' »'));
  for (const l of Stock.etat.listes) {
    const b = el('button', 'ligne-liste'); b.type = 'button';
    const dedans = l.exos.includes(e.id);
    b.append(el('span', '', l.nom), el('span', 'le-meta', dedans ? '✓ dedans' : l.exos.length + ' exos'));
    b.onclick = () => { Stock.basculer(l.id, e.id); dlg.close(); toast((Stock.contient(l.id, e.id) ? 'Ajouté à ' : 'Retiré de ') + l.nom); };
    corps.append(b);
  }
  const f = el('form', 'nouvelle'); const inp = el('input'); inp.id = 'nouvelleListe'; inp.placeholder = 'Nouvelle liste (ex. Réhab épaule Mathias)'; inp.maxLength = 60;
  const ok = el('button', 'btn', 'Créer et ajouter'); f.append(inp, ok);
  f.onsubmit = (ev) => { ev.preventDefault(); const n = inp.value.trim(); if (!n) return; const l = Stock.creer(n); Stock.basculer(l.id, e.id); dlg.close(); toast('Ajouté à ' + l.nom); };
  corps.append(f);
  dlg.showModal();
}
$('#dlgFermer').onclick = () => $('#dlg').close();

// ---- Recherche d'exercices : mots du coach -> muscles travaillés ----
// « épaule » trouve les exercices où les deltoïdes / la coiffe travaillent, pas seulement ceux qui ont « épaule » dans le nom
const ALIAS = { // mot du coach -> régions musculaires (début du nom de groupe)
  epaule: ['epaules', 'coiffe'], pec: ['pectoraux'], pecto: ['pectoraux'], pectora: ['pectoraux'], torse: ['pectoraux'], poitrine: ['pectoraux'],
  dos: ['dos', 'trapeze'], trap: ['trapeze'], trapeze: ['trapeze'],
  abdo: ['abdominaux'], abdominaux: ['abdominaux'], gainage: ['abdominaux'], sangle: ['abdominaux'], core: ['abdominaux'],
  jambe: ['quadriceps', 'ischio', 'fessiers', 'mollets', 'adducteurs', 'jambe', 'cuisse'], cuisse: ['quadriceps', 'ischio', 'adducteurs', 'cuisse'],
  quadri: ['quadriceps'], quad: ['quadriceps'], quadricep: ['quadriceps'], ischio: ['ischio'], fesse: ['fessiers'], fessier: ['fessiers'], glute: ['fessiers'],
  mollet: ['mollets'], bras: ['bras'], avant: ['avant-bras'], grip: ['avant-bras', 'main'], poigne: ['avant-bras', 'main'], main: ['main'],
  lombaire: ['lombaires', 'erecteurs'], hanche: ['flechisseurs de hanche', 'fessiers', 'pelvi', 'adducteurs'], adducteur: ['adducteurs'], cou: ['cou', 'nuque'], nuque: ['nuque', 'cou'],
};
const racine = (w) => w.length > 3 ? w.replace(/(aux|s|x)$/, '') : w;
function scoreMot(e, w) {
  const r = racine(w), reg = ALIAS[r] || ALIAS[w];
  const dans = (niv) => reg ? e.grp[niv].some(g => reg.some(c => g.startsWith(c))) : e.txt[niv].includes(r);
  const P = dans('p'), S = dans('s'), N = e.texte.includes(w) || e.texte.includes(r);
  // nom + muscle principal > muscle principal > nom seul (« épaulé » n'est pas un exercice d'épaule) > muscle secondaire
  return N && P ? 5 : P ? 3 : N ? (S ? 2.5 : 2) : S ? 1 : 0;
}
// ---- Dictée vocale : bouton micro accroché à un champ texte ----
function boutonMicro(champ, apres) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null; // sinon : le micro du clavier du téléphone fait le même travail
  const b = el('button', 'micro'); b.type = 'button'; b.setAttribute('aria-label', 'Dicter');
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
  let rec = null;
  b.onclick = () => {
    if (rec) { rec.stop(); return; }
    rec = new SR(); rec.lang = 'fr-FR'; rec.interimResults = true; rec.continuous = false;
    const base = champ.value.trim() ? champ.value.trim() + ' ' : '';
    rec.onresult = (ev) => { champ.value = base + [...ev.results].map(r => r[0].transcript).join(''); apres(); };
    rec.onerror = (ev) => { if (ev.error !== 'aborted' && ev.error !== 'no-speech') toast('Micro indisponible ici : utilise la dictée du clavier'); };
    rec.onend = () => { rec = null; b.removeAttribute('data-on'); };
    try { rec.start(); b.dataset.on = ''; } catch (e) { rec = null; toast('Micro indisponible ici : utilise la dictée du clavier'); }
  };
  return b;
}
function avecMicro(champ, apres) { const w = el('div', 'champ-micro'); w.append(champ); const m = boutonMicro(champ, apres); if (m) w.append(m); return w; }

// ---- Explorateur d'exercices ----
const filtres = { q: '', cat: new Set(), mat: new Set(), niv: new Set(), zone: '' };
function vueExercices() {
  return { sur: EXOS.length + ' exercices', titre: 'Exercices', surligner: () => ({}),
    rendre(c) {
      const rech = el('input', 'recherche'); rech.id = 'rechercheExo'; rech.type = 'search'; rech.placeholder = 'Rechercher (squat, élastique, épaule…)'; rech.value = filtres.q;
      c.append(avecMicro(rech, () => { filtres.q = rech.value; maj(); }));
      const fz = el('div', 'puces filtres');
      const zones = [...new Set([...Corps.structures.values()].filter(s => s.t === 'm').map(s => s.g))].sort((a, b) => a.localeCompare(b, 'fr'));
      const sel = el('select', 'zone'); sel.id = 'zoneExo'; sel.append(new Option('Toutes les zones', ''));
      zones.forEach(z => sel.append(new Option(z, z))); sel.value = filtres.zone;
      fz.append(sel); c.append(fz);
      const fc = el('div', 'puces filtres'); for (const [k, v] of Object.entries(CATEGORIES)) { const p = puce(v, () => { filtres.cat.has(k) ? filtres.cat.delete(k) : filtres.cat.add(k); p.setAttribute('aria-pressed', filtres.cat.has(k)); maj(); }); p.setAttribute('aria-pressed', filtres.cat.has(k)); fc.append(p); }
      const fm = el('div', 'puces filtres'); for (const k of ['pdc', 'barre', 'halteres', 'kb', 'poulie', 'machine', 'elastique', 'fixe', 'anneaux', 'parallettes', 'banc', 'box', 'trx', 'landmine', 'medball']) { const p = puce(MATERIEL[k], () => { filtres.mat.has(k) ? filtres.mat.delete(k) : filtres.mat.add(k); p.setAttribute('aria-pressed', filtres.mat.has(k)); maj(); }); p.setAttribute('aria-pressed', filtres.mat.has(k)); fm.append(p); }
      const fn = el('div', 'puces filtres'); for (const n of [1, 2, 3]) { const p = puce(['', 'Débutant', 'Intermédiaire', 'Avancé'][n], () => { filtres.niv.has(n) ? filtres.niv.delete(n) : filtres.niv.add(n); p.setAttribute('aria-pressed', filtres.niv.has(n)); maj(); }); p.setAttribute('aria-pressed', filtres.niv.has(n)); fn.append(p); }
      const det = el('details', 'plus-filtres'); det.append(el('summary', '', 'Filtres : catégorie, matériel, niveau'), el('p', 'fn-art', 'Catégorie'), fc, el('p', 'fn-art', 'Matériel'), fm, el('p', 'fn-art', 'Niveau'), fn);
      c.append(det);
      const compte = el('p', 'compte'); const liste = el('div', 'liste'); c.append(compte, liste);
      const zoneCles = (z) => new Set([...Corps.structures].filter(([, s]) => s.g === z).map(([k]) => k));
      function maj() {
        const q = norm(filtres.q).split(/\s+/).filter(Boolean), zc = filtres.zone ? zoneCles(filtres.zone) : null;
        const res = EXOS.filter(e => (!filtres.cat.size || filtres.cat.has(e.cat)) && (!filtres.mat.size || e.mat.some(m => filtres.mat.has(m))) && (!filtres.niv.size || filtres.niv.has(e.niv))
          && (!zc || [...e.niveaux].some(([k, n]) => n !== 'st' && zc.has(k))));
        if (q.length) { // chaque mot doit se retrouver dans le nom, ou dans les muscles travaillés ; muscle principal d'abord
          const sc = new Map(); for (const e of res) { let t = 0; for (const w of q) { const v = scoreMot(e, w); if (!v) { t = 0; break; } t += v; } if (t) sc.set(e, t); }
          res.splice(0, res.length, ...[...sc].sort((a, b) => b[1] - a[1] || a[0].niv - b[0].niv).map(x => x[0]));
        }
        compte.textContent = res.length + ' exercice' + (res.length > 1 ? 's' : '');
        liste.replaceChildren(); res.slice(0, 200).forEach(e => liste.append(ligneExo(e)));
        if (res.length > 200) liste.append(el('p', 'aide-txt', 'Affine la recherche pour voir les ' + (res.length - 200) + ' autres.'));
        if (zc) Corps.surligner(Object.fromEntries([...zc].map(k => [k, 0.8])), null); else Corps.surligner({}, null);
      }
      rech.oninput = () => { filtres.q = rech.value; maj(); };
      sel.onchange = () => { filtres.zone = sel.value; maj(); };
      maj();
    } };
}
// ---- Atlas : recherche globale, index des muscles, des os et des mouvements ----
let atlasOnglet = 'muscles', atlasQ = '';
function vueAtlas() {
  return { sur: 'Index & recherche', titre: 'Atlas', surligner: () => ({}),
    rendre(c) {
      const rech = el('input', 'recherche'); rech.id = 'rechercheAtlas'; rech.type = 'search'; rech.placeholder = 'Muscle, os, mouvement, exercice…'; rech.value = atlasQ;
      c.append(rech);
      const seg = el('div', 'puces filtres'); const zone = el('div');
      for (const [k, t] of [['muscles', 'Muscles'], ['os', 'Os'], ['mouvements', 'Mouvements']]) {
        const b = puce(t, () => { atlasOnglet = k; seg.querySelectorAll('.puce').forEach(x => x.setAttribute('aria-pressed', x === b)); maj(); }); b.setAttribute('aria-pressed', atlasOnglet === k); seg.append(b);
      }
      c.append(seg, zone);
      const struct = [...Corps.structures].map(([k, v]) => ({ k, ...v, txt: norm(v.fr + ' ' + v.en + ' ' + v.g) }));
      const parGroupe = (l) => { const m = new Map(); l.forEach(x => { if (!m.has(x.g)) m.set(x.g, []); m.get(x.g).push(x); }); return [...m].sort((a, b) => a[0].localeCompare(b[0], 'fr')); };
      const listeStructures = (parent, l) => { const w = el('div', 'liste'); l.sort((a, b) => a.fr.localeCompare(b.fr, 'fr')).forEach(x => { const b = el('button', 'ligne-liste'); b.type = 'button'; b.append(el('span', '', x.fr), el('span', 'le-meta', x.t === 'o' ? 'os' : { s: 'superficiel', p: 'profond', t: 'tendon', c: 'cartilage' }[x.couche] || '')); b.onclick = () => vueStructure(x.k); w.append(b); }); parent.append(w); };
      function maj() {
        zone.replaceChildren(); const q = norm(atlasQ).split(/\s+/).filter(Boolean);
        seg.hidden = q.length > 0;
        if (q.length) {
          const ok = (t) => q.every(w => t.includes(w));
          const st = struct.filter(x => ok(x.txt)).slice(0, 40);
          const fn = [...D.fonctions.values()].filter(f => ok(norm(f.artLib + ' ' + f.mvLib))).slice(0, 30);
          const ex = EXOS.filter(e => ok(e.texte)).slice(0, 40);
          if (st.length) { const b = section(zone, 'Muscles et os (' + st.length + ')'); listeStructures(b, st); }
          if (fn.length) { const b = section(zone, 'Mouvements (' + fn.length + ')'); const w = el('div', 'puces'); fn.forEach(f => w.append(puce(f.artLib + ' \u00b7 ' + f.mvLib, () => vueFonction(f.code)))); b.append(w); }
          if (ex.length) { const b = section(zone, 'Exercices (' + ex.length + ')'); const l = el('div', 'liste'); ex.forEach(e => l.append(ligneExo(e))); b.append(l); }
          if (!st.length && !fn.length && !ex.length) zone.append(el('p', 'aide-txt', 'Aucun résultat. Essaie un autre mot (ex. « deltoïde », « abduction », « fémur »).'));
          return;
        }
        if (atlasOnglet === 'mouvements') {
          zone.append(el('p', 'aide-txt', 'Touche un mouvement pour voir les muscles qui le réalisent et les exercices qui le travaillent.'));
          const parArt = new Map(); [...D.fonctions.values()].forEach(f => { if (!parArt.has(f.artLib)) parArt.set(f.artLib, []); parArt.get(f.artLib).push(f); });
          const ordre = Object.values(ARTICULATIONS);
          [...parArt].sort((a, b) => ordre.indexOf(a[0]) - ordre.indexOf(b[0])).forEach(([art, l]) => {
            const b = section(zone, art); const w = el('div', 'puces');
            l.sort((a, b) => a.mvLib.localeCompare(b.mvLib, 'fr')).forEach(f => { const n = new Set(f.muscles.filter(m => m.principal).map(m => m.k)).size; w.append(puce(f.mvLib + (n ? ' \u00b7 ' + n : ''), () => vueFonction(f.code))); });
            b.append(w);
          });
          return;
        }
        const filtre = atlasOnglet === 'os' ? (x => x.t === 'o') : (x => x.t !== 'o');
        zone.append(el('p', 'aide-txt', (atlasOnglet === 'os' ? struct.filter(filtre).length + ' os' : struct.filter(x => x.t === 'm').length + ' muscles') + ', classés par région.'));
        for (const [g, l] of parGroupe(struct.filter(filtre))) { const d = el('details', 'groupe-atlas'); d.append(el('summary', '', g + ' \u00b7 ' + l.length)); listeStructures(d, l); zone.append(d); }
      }
      rech.oninput = () => { atlasQ = rech.value; maj(); };
      maj();
    } };
}
// ---- Réhab ----
let symptomesQ = '';
function vueRehabListe() {
  return { sur: REHAB.length + ' protocoles', titre: 'Réhab & prévention', surligner: () => ({}),
    rendre(c) {
      // ---- orientation par symptômes ----
      const bs = section(c, 'Décrire la douleur de l’athlète'); bs.classList.add('symptomes');
      const ta = el('textarea'); ta.id = 'symptomes'; ta.value = symptomesQ;
      ta.placeholder = 'Ex. : mal devant l’épaule en bas des dips · coup de jus derrière le coude · douleur sous le talon le matin · épaule quand il lève le bras vers 90°';
      const compris = el('div', 'compris'), sortie = el('div');
      bs.append(avecMicro(ta, () => chercher()), compris, sortie, el('p', 'aide-txt', 'Plus tu précises (zone, endroit exact, mouvement qui déclenche, type de douleur), plus c’est juste. Orientation pour le coach, pas un diagnostic.'));
      let minuteur = null;
      function chercher() {
        symptomesQ = ta.value; compris.replaceChildren(); sortie.replaceChildren();
        if (norm(symptomesQ).trim().length < 3) { Corps.surligner({}, null); return; }
        const r = chercherSymptomes(symptomesQ);
        r.compris.forEach(x => compris.append(el('span', '', x)));
        r.alertes.forEach(a => sortie.append(el('p', 'avert', a)));
        if (!r.resultats.length) { sortie.append(el('p', 'sous', 'Rien de précis pour l’instant : ajoute la zone (épaule, coude, genou…), l’endroit exact (devant, derrière, côté petit doigt…), le mouvement qui fait mal et le type de douleur (pincement, décharge, raideur…).')); Corps.surligner({}, null); return; }
        const l = el('div', 'liste');
        r.resultats.forEach(({ r: p, score, raisons }) => {
          const x = el('button', 'ligne-exo'); x.type = 'button';
          const g = el('span', 'le-g'); g.append(el('span', 'le-nom', p.nom), el('span', 'le-meta', 'Correspond : ' + raisons.join(' · ')));
          const d = el('span', 'le-d'), pert = el('span', 'pertinence'); const n = Math.max(1, Math.round(score / r.max * 3));
          for (let i = 0; i < 3; i++) { const k = el('i'); if (i < n) k.className = 'on'; pert.append(k); }
          d.append(pert); x.append(g, d); x.onclick = () => ouvrir(vueRehab(p), 'mi'); l.append(x);
        });
        if (r.vague) sortie.append(el('p', 'sous', 'Description encore vague : précise l’endroit exact, le mouvement qui fait mal et le type de douleur pour affiner.'));
        sortie.append(l);
        // le protocole le plus probable : ses muscles s'allument sur le corps
        Corps.surligner(Object.fromEntries([...r.resultats[0].r.cles].map(k => [k, 0.9])), null);
      }
      ta.oninput = () => { clearTimeout(minuteur); minuteur = setTimeout(chercher, 180); };
      chercher();
      const zones = new Map(); REHAB.forEach(r => { if (!zones.has(r.zone)) zones.set(r.zone, []); zones.get(r.zone).push(r); });
      for (const [z, l] of zones) { const b = section(c, z); const li = el('div', 'liste'); l.forEach(r => { const x = el('button', 'ligne-exo'); x.type = 'button'; const g = el('span', 'le-g'); g.append(el('span', 'le-nom', r.nom), el('span', 'le-meta', r.resume)); x.append(g); x.onclick = () => ouvrir(vueRehab(r), 'mi'); li.append(x); }); b.append(li); }
    } };
}
function vueRehab(r) {
  return { sur: 'Réhab · ' + r.zone, titre: r.nom, surligner: () => Object.fromEntries([...r.cles].map(k => [k, 1])),
    rendre(c) {
      c.append(el('p', '', r.resume));
      const b0 = section(c, 'Muscles à cibler'); listeMuscles(b0, [...r.cles]);
      r.phases.forEach((ph, i) => {
        const b = section(c, 'Phase ' + (i + 1) + ' · ' + ph.nom);
        const kv1 = el('div', 'kv'); kv1.append(el('span', 'k', 'Objectif'), el('span', 'v', ph.objectif));
        const kv2 = el('div', 'kv'); kv2.append(el('span', 'k', 'Pour passer à la suite'), el('span', 'v', ph.critere));
        b.append(kv1, kv2);
        const l = el('div', 'liste');
        ph.exos.forEach(n => { const e = EXOS.find(x => x.nom === n); if (e) l.append(ligneExo(e)); });
        b.append(l);
        const btn = el('button', 'btn', '+ Créer une liste avec cette phase'); btn.type = 'button';
        btn.onclick = () => { const li = Stock.creer(r.nom.split(/ \/ | \(/)[0].trim() + ' · phase ' + (i + 1)); ph.exos.forEach(n => { const e = EXOS.find(x => x.nom === n); if (e) Stock.basculer(li.id, e.id); }); toast('Liste « ' + li.nom + ' » créée'); };
        b.append(btn);
      });
      const p = section(c, 'Précautions'); p.append(el('p', 'avert', r.precautions));
    } };
}
// ---- Listes ----
function vueListes() {
  return { sur: 'Mes listes', titre: 'Favoris & listes', surligner: () => ({}),
    rendre(c) {
      const l = el('div', 'liste');
      for (const li of Stock.etat.listes) {
        const b = el('button', 'ligne-liste'); b.type = 'button';
        b.append(el('span', '', (li.id === 'favoris' ? '★ ' : '') + li.nom), el('span', 'le-meta', li.exos.length + ' exercice' + (li.exos.length > 1 ? 's' : '')));
        b.onclick = () => ouvrir(vueListe(li.id), 'plein'); l.append(b);
      }
      c.append(l);
      const f = el('form', 'nouvelle'); const inp = el('input'); inp.id = 'creerListe'; inp.placeholder = 'Nom de la nouvelle liste'; inp.maxLength = 60;
      f.append(inp, el('button', 'btn', 'Créer')); f.onsubmit = (ev) => { ev.preventDefault(); if (!inp.value.trim()) return; Stock.creer(inp.value.trim()); afficher(); };
      c.append(f);
      c.append(el('p', 'aide-txt', Stock.ref ? 'Tes listes sont enregistrées sur ton compte : les mêmes sur téléphone et ordinateur.' : 'Tes listes sont enregistrées sur cet appareil.'));
      // export / import : passer ses listes d'un appareil (ou d'une version de l'appli) à l'autre
      const b = section(c, 'Transférer mes listes');
      const zoneT = el('div');
      const ex = el('button', 'btn', 'Copier mes listes'); ex.type = 'button';
      ex.onclick = () => { const txt = 'LEGACY-LISTES:' + JSON.stringify(Stock.etat); navigator.clipboard.writeText(txt).then(() => toast('Listes copiées : colle-les dans l\u2019autre appareil'), () => { const t = el('textarea', 'copie'); t.value = txt; zoneT.replaceChildren(t); t.select(); }); };
      const im = el('button', 'btn', 'Importer des listes'); im.type = 'button';
      im.onclick = () => {
        const t = el('textarea', 'copie'); t.id = 'importListes'; t.placeholder = 'Colle ici le texte copié depuis l\u2019autre appareil';
        const ok = el('button', 'btn', 'Fusionner avec mes listes'); ok.type = 'button';
        ok.onclick = () => {
          try {
            const d = JSON.parse(t.value.trim().replace(/^LEGACY-LISTES:/, ''));
            if (!d || !Array.isArray(d.listes)) throw 0;
            let n = 0;
            for (const l of d.listes) {
              if (!l || !Array.isArray(l.exos)) continue;
              const cible = Stock.liste(l.id) || (() => { const x = { id: l.id || 'l' + Date.now().toString(36) + n, nom: String(l.nom || 'Liste').slice(0, 60), exos: [] }; Stock.etat.listes.push(x); return x; })();
              for (const e of l.exos) if (D.exoParId.has(e) && !cible.exos.includes(e)) { cible.exos.push(e); n++; }
            }
            Stock.sauver(); toast(n + ' exercice(s) importé(s)'); afficher();
          } catch (e) { toast('Texte non reconnu : copie-le depuis « Copier mes listes ».'); }
        };
        zoneT.replaceChildren(t, ok); t.focus();
      };
      const act2 = el('div', 'actions'); act2.append(ex, im); b.append(act2, zoneT);
    } };
}
function vueListe(id) {
  return { sur: 'Liste', get titre() { return Stock.liste(id)?.nom || ''; },
    surligner: () => { const m = {}; for (const x of Stock.liste(id)?.exos || []) { const e = D.exoParId.get(x); if (e) for (const [k, n] of e.niveaux) if (n === 'p') m[k] = 1; } return m; },
    rendre(c) {
      const li = Stock.liste(id); if (!li) return;
      const act = el('div', 'actions');
      const cp = el('button', 'btn', 'Copier pour un athlète'); cp.type = 'button';
      cp.onclick = () => {
        const txt = li.nom + '\n\n' + li.exos.map((x, i) => { const e = D.exoParId.get(x); return e ? (i + 1) + '. ' + e.nom + (e.c ? ' — ' + e.c : '') : ''; }).filter(Boolean).join('\n');
        navigator.clipboard.writeText(txt).then(() => toast('Liste copiée'), () => { const t = el('textarea', 'copie'); t.value = txt; c.prepend(t); t.select(); toast('Sélectionne et copie le texte'); });
      };
      act.append(cp);
      if (li.id !== 'favoris') {
        const rn = el('button', 'btn', 'Renommer'); rn.type = 'button';
        rn.onclick = () => { const f = el('form', 'nouvelle'); const inp = el('input'); inp.id = 'renommer'; inp.value = li.nom; inp.maxLength = 60; f.append(inp, el('button', 'btn', 'OK')); f.onsubmit = (ev) => { ev.preventDefault(); if (inp.value.trim()) { Stock.renommer(id, inp.value.trim()); afficher(); } }; act.after(f); inp.focus(); };
        const sup = el('button', 'btn danger', 'Supprimer'); sup.type = 'button';
        sup.onclick = () => { if (sup.dataset.confirme) { Stock.supprimer(id); pile.pop(); afficher(); toast('Liste supprimée'); } else { sup.dataset.confirme = '1'; sup.textContent = 'Confirmer la suppression'; } };
        act.append(rn, sup);
      }
      c.append(act);
      if (!li.exos.length) c.append(el('p', 'aide-txt', 'Liste vide : ajoute des exercices depuis leur fiche (bouton « + Ajouter à une liste »).'));
      const l = el('div', 'liste');
      li.exos.forEach((x, i) => {
        const e = D.exoParId.get(x); if (!e) return;
        const r = el('div', 'ligne-ordre'); r.append(ligneExo(e));
        const ctl = el('div', 'ordre');
        const h = el('button', 'mini', '↑'); h.type = 'button'; h.ariaLabel = 'Monter'; h.disabled = i === 0; h.onclick = () => { Stock.deplacer(id, x, -1); afficher(); };
        const bas = el('button', 'mini', '↓'); bas.type = 'button'; bas.ariaLabel = 'Descendre'; bas.disabled = i === li.exos.length - 1; bas.onclick = () => { Stock.deplacer(id, x, 1); afficher(); };
        const rm = el('button', 'mini', '✕'); rm.type = 'button'; rm.ariaLabel = 'Retirer'; rm.onclick = () => { Stock.basculer(id, x); afficher(); };
        ctl.append(h, bas, rm); r.append(ctl); l.append(r);
      });
      c.append(l);
    } };
}

// ======================= Onglets du bas =======================
function onglet(n, sansOuvrir) {
  document.querySelectorAll('.onglets button').forEach(b => b.setAttribute('aria-pressed', b.dataset.o === n));
  document.body.dataset.onglet = n;
  if (sansOuvrir) return;
  if (n === 'corps') { fermer(); return; }
  ouvrir({ atlas: vueAtlas, exercices: vueExercices, rehab: vueRehabListe, listes: vueListes }[n](), 'plein', true);
}
document.querySelectorAll('.onglets button').forEach(b => b.onclick = () => onglet(b.dataset.o));

// ---- Carte compacte (touche sur le corps) ----
const fiche = $('#fiche');
fiche.onclick = () => { if (Corps.choisi) vueStructure(Corps.choisi); };
fiche.onkeydown = (e) => { if ((e.key === 'Enter' || e.key === ' ') && Corps.choisi) { e.preventDefault(); vueStructure(Corps.choisi); } };

// ======================= Démarrage =======================
Corps.pret.then(() => {
  preparer();
  Stock.init();
  Stock.abonnes.push(() => { const v = pile[pile.length - 1]; if (v && hauteur !== 'ferme' && document.activeElement?.tagName !== 'INPUT') afficher(); });
  // un muscle touché alors que le panneau est ouvert : on ouvre directement sa fiche
  Corps.surToucher = (k) => { if (hauteur !== 'ferme' && k) vueStructure(k); };
  window.UI = { vueStructure, vueExo, vueFonction, D, Stock, ouvrir, fermer };
});
})();
