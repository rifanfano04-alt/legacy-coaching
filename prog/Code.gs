/**
 * LEGACY — SÉANCE  ·  serveur (Apps Script)
 * Web app appelée par https://rifanfano04-alt.github.io/legacy-coaching/prog/
 *
 * Rôle : lire le programme dans l'onglet BLOCK de l'athlète et y réécrire
 * ce qu'il saisit dans l'app (RPE 1ère/dernière série, charge utilisée,
 * note, difficulté de séance, tableau jaune de fin de semaine).
 *
 * Déploiement : Déployer ▸ Nouveau déploiement ▸ Application web
 *   - Exécuter en tant que : MOI (le coach)
 *   - Qui a accès : Tout le monde
 * => les athlètes peuvent être en LECTURE SEULE sur leur Sheet.
 */

/* ───────────────────────── CONFIG ───────────────────────── */

// Fichier qui contient l'onglet "ATHLÈTES" (registre code -> Sheet)
var REGISTRY_ID  = '1wWKlENyCJXyoghb9fire_lgHipmjv_SKXa6dRVq-iRw'; // FUTURE PROG
var REGISTRY_TAB = 'ATHLÈTES';

// Colonne du nom de mouvement pour les 6 semaines : D, V, AN, BF, BX, CP
var WEEK_COLS = [4, 22, 40, 58, 76, 94];
// Ligne d'en-tête "mouvement" de chaque séance ; les exos sont en +2..+8
var SESSION_ROWS = [15, 28, 41, 54, 67, 80];
var EXOS_PER_SESSION = 7;

// Décalages de colonne, relatifs à la colonne du nom (N)
var OFF = {
  code:      -1,  // C  code muscle (M/P/D/S/R)
  nom:        0,  // D  nom (formule)
  variante:   1,  // E
  tempo:      2,  // F
  sets:       3,  // G
  reps:       5,  // I
  rpeCible:   6,  // J  RPE estimé / cap
  rpe1:       7,  // K  ressenti première série   <- athlète
  rpeLast:    8,  // L  ressenti dernière série   <- athlète
  pct:       10,  // N  %
  chargeReco:11,  // O  charge recommandée
  charge:    12,  // P  charge utilisée           <- athlète
  note:      13   // Q  note                      <- athlète
};
var OFF_DIFF = 13;          // colonne difficulté, sur la ligne "total série" (+9)
var RECUP_ROWS = { sommeil: 94, nutrition: 95, steps: 96, humeur: 97, poids: 99 };
var OFF_RECUP  = 12;        // valeurs du tableau jaune (même colonne que la charge)
var OFF_1RM    = 1;         // 1RM de la semaine : lignes 96..99, colonne N+1

// Les seances etaient lues a des lignes figees (SESSION_ROWS). Un bloc peut desormais
// contenir plus ou moins d'exercices : on deduit le plan du contenu, et les constantes
// ci-dessus ne servent plus que de secours si la detection echoue.
var HAUTEUR_MAX = 200;

var COULEURS = { M:'#9FC5E8', P:'#76A5AF', D:'#8E7CC3', S:'#45818E', R:'#D9D9D9' };
var LIB_MUSCLE = { M:'Muscle-up', P:'Pull-up', D:'Dips', S:'Squat', R:'Renfo' };

/* ───────────────────────── ROUTAGE ───────────────────────── */

function doPost(e) {
  var out = { ok: false, error: 'requête vide' };
  try {
    var body = JSON.parse(e.postData.contents);
    var action = String(body.action || '');
    if (action === 'login')   out = apiLogin(body);
    else if (action === 'program') out = apiProgram(body);
    else if (action === 'save')    out = apiSave(body);
    else if (action === 'weekly')  out = apiWeekly(body);
    else if (action === 'coach')   out = apiCoach(body);
    else if (action === 'records') out = apiRecords(body);
    else if (action === 'historique') out = apiHistorique(body);
    else if (action === 'maFiche')    out = apiMaFiche(body);
    else if (action === 'coachAthletes') out = apiCoachAthletes(body);
    else if (action === 'coachFiche')    out = apiCoachFiche(body);
    else if (action === 'coachReglages') out = apiCoachReglages(body);
    else out = { ok: false, error: 'action inconnue : ' + action };
  } catch (err) {
    out = { ok: false, error: String(err && err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, ping: 'LEGACY séance' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ───────────────────────── REGISTRE ───────────────────────── */

/** Onglet ATHLÈTES : créé automatiquement s'il n'existe pas encore. */
function registreSheet_() {
  var ss = SpreadsheetApp.openById(REGISTRY_ID);
  var sh = ss.getSheetByName(REGISTRY_TAB);
  if (sh) return sh;
  sh = ss.insertSheet(REGISTRY_TAB);
  sh.getRange(1, 1, 1, 5).setValues([['Code', 'Prénom', 'Actif', 'ID du Sheet', 'Remarque']]);
  sh.getRange(1, 1, 1, 5).setBackground('#000000').setFontColor('#ffffff').setFontWeight('bold');
  sh.setColumnWidth(1, 110); sh.setColumnWidth(2, 140);
  sh.setColumnWidth(3, 70);  sh.setColumnWidth(4, 420); sh.setColumnWidth(5, 220);
  sh.setFrozenRows(1);
  sh.getRange('C2:C200').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['oui', 'non'], true).build());
  sh.getRange(2, 1, 1, 5).setValues([['DEMO', 'Prénom', 'non', 'colle ici l\'ID ou l\'URL du Sheet de l\'athlète', 'ligne d\'exemple']]);
  return sh;
}


function athleteFromCode_(code) {
  code = String(code || '').trim().toUpperCase();
  if (!code) throw new Error('Code manquant.');
  // Le registre vit dans FUTURE PROG : louvrir coute cher et il ne change quasiment jamais.
  // On garde la correspondance code -> Sheet 15 minutes en memoire du script.
  var cache = null;
  try { cache = CacheService.getScriptCache(); } catch (e) {}
  if (cache) {
    var hit = cache.get('ath:' + code);
    if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  }
  var a = athleteDepuisRegistre_(code);
  if (cache) { try { cache.put('ath:' + code, JSON.stringify(a), 900); } catch (e) {} }
  return a;
}

// Lecture reelle du registre. Les erreurs (code inconnu, acces desactive) ne sont
// jamais mises en cache : une reactivation prend effet tout de suite.
function athleteDepuisRegistre_(code) {
  var sh = registreSheet_();
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var c = String(rows[i][0] || '').trim().toUpperCase();
    if (!c || c !== code) continue;
    var actif = String(rows[i][2] || 'oui').trim().toLowerCase();
    if (actif === 'non' || actif === 'no' || actif === 'faux') throw new Error('Accès désactivé.');
    var coach = /coach/i.test(String(rows[i][4] || ''));
    var id = String(rows[i][3] || '').trim();
    var m = id.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (m) id = m[1];
    if (!id && !coach) throw new Error('Aucun Sheet associé à ce code.');
    // avec un Sheet -> athlète (et coach en plus si la remarque le dit) ; sans Sheet -> coach seul
    return { code: c, prenom: String(rows[i][1] || '').trim(), sheetId: id,
             coach: coach, role: id ? 'athlete' : 'coach' };
  }
  throw new Error('Code inconnu.');
}

/* ───────────────────────── LECTURE PROGRAMME ───────────────────────── */

function num_(v) {
  if (v === '' || v === null || v === undefined) return null;
  if (v instanceof Date) return null;              // cellule mal typée : on ignore
  var n = Number(String(v).replace(',', '.'));
  return isNaN(n) ? null : n;
}

/** "7.5" saisi dans Sheets devient parfois la date du 7 mai : on le récupère. */
function rpe_(v) {
  if (v === '' || v === null || v === undefined) return '';
  if (v instanceof Date) {
    var d = v.getDate(), mo = v.getMonth() + 1;    // 7 mai  ->  7.5
    return (mo <= 12 && d <= 12) ? String(d) + '.' + String(mo) : '';
  }
  return String(v);
}

function txt_(v) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yy');
  return String(v).trim();
}

function blocksOf_(ss) {
  return ss.getSheets().filter(function (s) { return /^\s*BLOCK/i.test(s.getName()); });
}

function dureeSemaines_(v) {
  var m = String(v || '').match(/(\d+)/);
  return m ? Number(m[1]) : 6;
}

/** Choisit le block + la semaine en cours d'après les dates du Sheet. */
function situation_(ss) {
  var blocks = blocksOf_(ss), today = new Date();
  today.setHours(0, 0, 0, 0);
  var best = null;
  blocks.forEach(function (sh) {
    var debut = sh.getRange(12, 4).getValue();     // D12
    var nbSem = dureeSemaines_(sh.getRange(12, 16).getValue()); // P12
    if (!(debut instanceof Date)) return;
    var d0 = new Date(debut); d0.setHours(0, 0, 0, 0);
    if (d0 > today) return;
    var diffSem = Math.floor((today - d0) / 604800000) + 1;
    var score = d0.getTime();
    if (!best || score > best.score) {
      best = { sheet: sh, debut: d0, nbSem: nbSem, semaine: Math.min(Math.max(diffSem, 1), nbSem), score: score };
    }
  });
  if (!best) {
    var last = blocks[blocks.length - 1];
    if (!last) throw new Error('Aucun onglet BLOCK dans ce Sheet.');
    best = { sheet: last, debut: null, nbSem: dureeSemaines_(last.getRange(12, 16).getValue()), semaine: 1 };
  }
  return best;
}

/**
 * Plan de l'onglet, deduit du contenu et non de lignes figees.
 * Une seance commence a l'en-tete « mouvement » (colonne du nom, semaine 1),
 * ses exercices vont de +2 jusqu'a la ligne « total serie », qui porte la difficulte.
 * Les lignes sont identiques d'une semaine a l'autre : on ne detecte que sur la semaine 1.
 */
function plan_(vals) {
  var colNom = WEEK_COLS[0] + OFF.nom;
  var txt = function (r, c) {
    var l = vals[r - 1] || [];
    return String(l[c - 1] === undefined || l[c - 1] === null ? '' : l[c - 1]).trim().toLowerCase();
  };
  var seances = [];
  for (var r = 1; r <= vals.length; r++) {
    if (txt(r, colNom) !== 'mouvement') continue;
    var premier = r + 2, dernier = premier - 1, total = 0;
    for (var k = premier; k <= vals.length; k++) {
      var t = txt(k, colNom);
      if (t.indexOf('total s') === 0) { total = k; break; }
      if (t === 'mouvement') break;
      dernier = k;
    }
    if (dernier >= premier) seances.push({ head: r, premier: premier, dernier: dernier, total: total || (dernier + 1) });
  }
  // secours : on retombe sur l'ancienne disposition plutot que de ne rien lire
  if (!seances.length) {
    seances = SESSION_ROWS.map(function (h) {
      return { head: h, premier: h + 2, dernier: h + 1 + EXOS_PER_SESSION, total: h + 9 };
    });
  }
  // Les libelles du tableau jaune se suivent dans l'ordre : on cherche chacun a partir
  // du precedent. Sans cette contrainte, un mot croise plus haut ferait viser la mauvaise
  // ligne — et apiWeekly ECRIT dedans.
  var recup = {}, c0 = WEEK_COLS[0];
  var depart = seances[seances.length - 1].total + 1;
  var chercher = function (mot, apres) {   // mot est une expression reguliere
    for (var rr = apres; rr <= vals.length; rr++) {
      for (var cc = c0; cc <= c0 + 16; cc++) {
        var s = txt(rr, cc);
        if (s && mot.test(s)) return rr;
      }
    }
    return 0;
  };
  var apres = depart;
  // libelles tolerants : le Sheet ecrit « Hummeur » et « Poids du corps »
  [['sommeil', /^sommeil/], ['nutrition', /^nutrition/], ['steps', /^steps/],
   ['humeur', /^humm?eur/], ['poids', /^poids/]].forEach(function (p) {
    var l = chercher(p[1], apres);
    recup[p[0]] = l || RECUP_ROWS[p[0]];
    if (l) apres = l;
  });
  return { seances: seances, recup: recup };
}

/**
 * Le RPE est le seul champ qui ne peut se remplir qu'apres l'effort. Le coach ecrit
 * parfois ses charges a l'avance dans la colonne « charge utilisee » : une seance ou
 * AUCUN RPE n'a ete saisi n'a donc pas ete faite, quelles que soient les charges.
 * (Au niveau de la ligne on reste tolerant : les exos secondaires sont souvent
 *  charges sans RPE alors que la seance a bien eu lieu.)
 */
function aUnRpe_(e) { return !!(e.rpe1 || e.rpeLast); }

/** Lit une semaine dans un tableau deja charge (colonne A -> fin de la semaine). */
function lireSemaineDe_(vals, semaine) {
  var col = WEEK_COLS[semaine - 1];
  var get = function (r, off) { return vals[r - 1][col - 1 + off]; };

  var pl = plan_(vals);
  var seances = [], indexBloc = null;
  pl.seances.forEach(function (S, sIdx) {
    var hRow = S.head;
    var exos = [], rempli = 0, prescrits = 0, avecRpe = 0;
    for (var r = S.premier; r <= S.dernier; r++) {
      var code = txt_(get(r, OFF.code)).toUpperCase();
      var sets = num_(get(r, OFF.sets));
      var nom  = txt_(get(r, OFF.nom));
      var vari = txt_(get(r, OFF.variante));
      var reps = num_(get(r, OFF.reps));
      var chg  = num_(get(r, OFF.charge));
      // ligne de gabarit (code muscle présent mais rien de programmé) : on l'ignore
      if (!code || (!sets && !reps && !vari && chg === null)) continue;
      // Derniere fois : on remonte les semaines precedentes DU BLOC (meme ligne, meme exercice).
      // Tout est deja dans vals (lecture depuis la colonne A) : aucune lecture de plus.
      // Si rien, on cherche l'exercice par son nom dans tout le bloc ; les blocs
      // precedents viennent ensuite, a part (attacherHistorique_).
      var prev = null;
      var cles = clesExo_(code, nom, vari, txt_(get(r, OFF.tempo)), sets, reps);
      for (var w = semaine - 1; w >= 1 && !prev; w--) {
        var pc = WEEK_COLS[w - 1];
        if (txt_(vals[r - 1][pc - 1 + OFF.code]).toUpperCase() !== code) continue;
        var o = occurrence_(vals, r, pc, true);
        if (o && memeExo_(o.cles[3], cles[3])) prev = entreeHist_(o, vals, w, S.head, true, semaine);
      }
      if (!prev && semaine > 1) {
        if (!indexBloc) {
          indexBloc = { e: [], k: {} };
          for (var w2 = semaine - 1; w2 >= 1; w2--) indexerSemaine_(indexBloc, vals, pl, w2, { memeBloc: true, depuis: semaine });
        }
        prev = chercherHist_(indexBloc, cles);
      }

      var libelle = (code === 'R') ? (vari || 'Renfo') : nom;
      var sousTitre = (code === 'R') ? '' : vari;
      var charge = chg;
      var e = {
        row: r,
        prev: prev,
        nomBrut: nom,
        varBrut: vari,
        code: code,
        couleur: COULEURS[code] || '#D9D9D9',
        groupe: LIB_MUSCLE[code] || '',
        nom: libelle || (LIB_MUSCLE[code] || 'Exercice'),
        variante: sousTitre,
        tempo: txt_(get(r, OFF.tempo)),
        sets: sets,
        reps: reps,
        rpeCible: rpe_(get(r, OFF.rpeCible)),
        pct: num_(get(r, OFF.pct)),
        chargeReco: num_(get(r, OFF.chargeReco)),
        charge: charge,
        rpe1: rpe_(get(r, OFF.rpe1)),
        rpeLast: rpe_(get(r, OFF.rpeLast)),
        note: txt_(get(r, OFF.note))
      };
      if (e.charge !== null || e.rpe1 || e.rpeLast || e.note) rempli++;
      if (aUnRpe_(e)) avecRpe++;
      if (e.sets || e.reps) prescrits++;
      exos.push(e);
    }
    if (!exos.length) return;
    var diff = txt_(get(S.total, OFF_DIFF));
    // « faite » = la difficulté de séance est renseignée (c'est le marqueur de fin,
    // écrit par l'app) OU tout ce qui était programmé a été rempli — mais dans ce
    // cas il faut au moins un RPE quelque part : sans ça, ce sont des charges
    // notées à l'avance et la séance n'a pas eu lieu.
    var reelle = avecRpe > 0;
    var faite = !!diff || (reelle && prescrits > 0 && rempli >= prescrits);
    seances.push({
      idx: sIdx,
      ligne: hRow,
      ligneTotal: S.total,
      jour: txt_(get(hRow - 1, OFF.nom)),
      difficulte: diff,
      exos: exos,
      remplis: rempli,
      total: exos.length,
      etat: faite ? 'faite' : ((reelle && rempli > 0) ? 'encours' : 'vide'),
      faite: faite,
      reelle: reelle
    });
  });

  var recup = {};
  Object.keys(pl.recup).forEach(function (k) {
    var l = vals[pl.recup[k] - 1];
    recup[k] = l ? num_(l[col - 1 + OFF_RECUP]) : null;
  });

  return { seances: seances, recup: recup };
}

/* ───────────────────────── DERNIERE FOIS ─────────────────────────
 * Ce que l'athlete a fait la derniere fois sur un exercice, meme dans un bloc
 * precedent (un renfo garde d'un bloc a l'autre). On compare les NOMS :
 * d'abord meme format et meme schema, puis meme format, puis nom + variante, puis le nom seul
 * (l'app signale alors le format different).
 */

/** Nom normalise : casse, accents, ponctuation et pluriels ignores (« Push ups » = « push-up »). */
function canonH_(s) {
  s = String(s == null ? '' : s).toLowerCase();
  if (s.normalize) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return s.replace(/[^a-z0-9°%+]+/g, ' ').trim().split(' ').map(function (m) {
    return (m.length >= 3 && /s$/.test(m) && !/ss$/.test(m)) ? m.slice(0, -1) : m;
  }).join(' ');
}

/** Meme ligne d'une semaine a l'autre : meme exercice si un nom contient l'autre
 *  (« emom » = « pompe emom » raccourci) ; un autre exercice mis a sa place ne compte pas. */
function memeExo_(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  var A = a.split(' '), B = b.split(' ');
  var dans = function (x, y) { return x.every(function (m) { return y.indexOf(m) >= 0; }); };
  return dans(A, B) || dans(B, A);
}

/** Pour un renfo (code R) le nom de l'exercice est dans la colonne variante. */
function clesExo_(code, nom, vari, tempo, sets, reps) {
  var R = String(code).toUpperCase() === 'R';
  var n = canonH_(R ? vari : nom), v = R ? '' : canonH_(vari), t = canonH_(tempo);
  if (!n) return [null, null, null, null];
  // le schema d'abord : deux lignes « squat » (serie lourde + series de retour) ne se confondent pas
  return [n + '|' + v + '|' + t + '|' + (sets || '') + 'x' + (reps || ''), n + '|' + v + '|' + t, n + '|' + v, n];
}

/** Une ligne d'une semaine, si elle a ete faite. Charge seule = ecrite a l'avance : il faut un RPE ou une note. */
function occurrence_(vals, r, col, chargeSeuleOk) {
  var g = function (off) { return vals[r - 1][col - 1 + off]; };
  var code = txt_(g(OFF.code)).toUpperCase();
  var nom = txt_(g(OFF.nom)), vari = txt_(g(OFF.variante)), tempo = txt_(g(OFF.tempo));
  if (!code) return null;
  var ch = num_(g(OFF.charge)), r1 = rpe_(g(OFF.rpe1)), r2 = rpe_(g(OFF.rpeLast)), nt = txt_(g(OFF.note));
  if (!(r1 || r2 || nt || (chargeSeuleOk && ch !== null))) return null;
  var cles = clesExo_(code, nom, vari, tempo, num_(g(OFF.sets)), num_(g(OFF.reps)));
  if (!cles[3]) return null;
  return { cles: cles, code: code, charge: ch, rpe1: r1, rpeLast: r2, note: nt,
           sets: num_(g(OFF.sets)), reps: num_(g(OFF.reps)),
           variante: (code === 'R') ? '' : vari, tempo: tempo };
}

/** Ce que l'app recoit : les valeurs + d'ou elles viennent (bloc, semaine, date de la seance). */
function entreeHist_(o, vals, semaine, head, memeBloc, depuis, bloc) {
  var debut = vals[11] ? vals[11][WEEK_COLS[semaine - 1] - 1] : null;   // ligne 12 : date de la semaine
  var jour = txt_(vals[head - 2] ? vals[head - 2][WEEK_COLS[semaine - 1] - 1 + OFF.nom] : '');
  var d = (debut instanceof Date) ? (dateSeance_(debut, jour) || debut) : null;
  var e = { charge: o.charge, rpe1: o.rpe1, rpeLast: o.rpeLast, note: o.note,
            sets: o.sets, reps: o.reps, variante: o.variante, tempo: o.tempo,
            semaine: semaine,
            date: d ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '' };
  if (memeBloc) e.ecart = depuis - semaine;
  else e.bloc = bloc || '';
  return e;
}

/** Range les exercices faits d'une semaine dans l'index (le premier range = le plus recent).
 *  index = { e: [entrees], k: { cle: rang dans e } } : chaque entree n'est stockee qu'une fois. */
function indexerSemaine_(index, vals, pl, semaine, meta) {
  var col = WEEK_COLS[semaine - 1];
  for (var i = pl.seances.length - 1; i >= 0; i--) {        // fin de semaine d'abord
    var S = pl.seances[i];
    var reelle = false, occ = [];
    for (var r = S.premier; r <= S.dernier; r++) {
      var o = occurrence_(vals, r, col, true);
      if (!o) continue;
      if (o.rpe1 || o.rpeLast) reelle = true;
      occ.push(o);
    }
    occ.forEach(function (o) {
      if (!(o.rpe1 || o.rpeLast || o.note) && !reelle) return;  // charges notees a l'avance, seance pas faite
      var rang = -1;
      o.cles.forEach(function (k, n) {
        var cle = (n + 1) + ':' + k;
        if (index.k[cle] !== undefined) return;
        if (rang < 0) rang = index.e.push(entreeHist_(o, vals, semaine, S.head, meta.memeBloc, meta.depuis, meta.bloc)) - 1;
        index.k[cle] = rang;
      });
    });
  }
}

function chercherHist_(index, cles) {
  if (!cles[3] || !index || !index.k) return null;
  for (var i = 0; i < cles.length; i++) {
    var n = index.k[(i + 1) + ':' + cles[i]];
    if (n !== undefined) return index.e[n];
  }
  // fautes de frappe du Sheet (« leg extess » / « leg extenss ») : 1 lettre d'ecart des 6
  // caracteres, 2 des 10 ; a egalite, le plus recent
  var nom = cles[3], max = nom.length >= 10 ? 2 : (nom.length >= 6 ? 1 : 0), best = null;
  if (!max) return null;
  Object.keys(index.k).forEach(function (k) {
    if (k.indexOf('4:') !== 0) return;
    var d = ecart_(nom, k.slice(2), max);
    if (d <= max && (!best || d < best.d || (d === best.d && index.k[k] < best.n))) best = { d: d, n: index.k[k] };
  });
  return best ? index.e[best.n] : null;
}

/** Distance d'edition (Levenshtein), arretee des qu'elle depasse max. */
function ecart_(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  var prec = [], i, j;
  for (j = 0; j <= b.length; j++) prec[j] = j;
  for (i = 1; i <= a.length; i++) {
    var cur = [i], mini = i;
    for (j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prec[j] + 1, cur[j - 1] + 1, prec[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < mini) mini = cur[j];
    }
    if (mini > max) return max + 1;
    prec = cur;
  }
  return prec[b.length];
}

/** Numero d'un onglet « BLOCK 4 » ; les onglets sans numero passent apres. */
function numBloc_(sh) {
  var m = sh.getName().match(/(\d+)/);
  return m ? Number(m[1]) : -1;
}

/**
 * Index des exercices faits dans les blocs PRECEDENTS. Il ne bouge pas quand l'athlete
 * enregistre (l'app n'ecrit que dans le bloc en cours) : on le garde 6 h en memoire.
 */
function indexBlocsPrecedents_(sheetId, ss, sit, seulementCache) {
  var cle = 'hist:' + sheetId + ':' + sit.sheet.getSheetId(), cache = null;
  try { cache = CacheService.getScriptCache(); } catch (e) {}
  if (cache) {
    var hit = cache.get(cle);
    if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  }
  if (seulementCache) return null;
  var ref = sit.sheet, refNum = numBloc_(ref);
  var refDebut = sit.debut ? sit.debut.getTime() : null;
  var autres = [];
  blocksOf_(ss).forEach(function (sh) {
    if (sh.getSheetId() === ref.getSheetId()) return;
    var d = sh.getRange(12, 4).getValue();
    var t = (d instanceof Date) ? d.getTime() : null;
    var avant = (t !== null && refDebut !== null) ? t < refDebut : numBloc_(sh) < refNum;
    if (avant) autres.push({ sh: sh, t: t, n: numBloc_(sh) });
  });
  autres.sort(function (a, b) {
    if (a.t !== null && b.t !== null) return b.t - a.t;
    return b.n - a.n;
  });
  var index = { e: [], k: {} };
  autres.forEach(function (b) {
    var nbSem = Math.min(dureeSemaines_(b.sh.getRange(12, 16).getValue()), WEEK_COLS.length);
    var vals = grille_(b.sh, WEEK_COLS[nbSem - 1] + 16);
    var pl = plan_(vals);
    for (var w = nbSem; w >= 1; w--) indexerSemaine_(index, vals, pl, w, { memeBloc: false, bloc: b.sh.getName().trim() });
  });
  if (cache) {
    try {
      var json = JSON.stringify(index);
      if (json.length < 95000) cache.put(cle, json, 21600);
    } catch (e) {}
  }
  return index;
}

/** Complete « derniere fois » avec les blocs precedents pour les exos qui n'ont rien dans le bloc en cours. */
function attacherHistorique_(sheetId, ss, sit, seances, seulementCache) {
  var manquants = [];
  seances.forEach(function (s) {
    s.exos.forEach(function (e) { if (!e.prev) manquants.push(e); });
  });
  if (!manquants.length) return true;
  var index = indexBlocsPrecedents_(sheetId, ss, sit, seulementCache);
  if (!index) return false;
  manquants.forEach(function (e) {
    var p = chercherHist_(index, clesExo_(e.code, e.nomBrut, e.varBrut, e.tempo, e.sets, e.reps));
    if (p) e.prev = p;
  });
  return true;
}

/** Les blocs precedents seuls : appel separe, comme les records, pour ne pas ralentir l'ouverture. */
function apiHistorique(body) {
  var a = athleteFromCode_(body.code);
  if (!a.sheetId) return { ok: true, prev: {} };
  var ss = SpreadsheetApp.openById(a.sheetId);
  var sit = situation_(ss);
  var semaine = Number(body.semaine) || sit.semaine;
  if (semaine < 1) semaine = 1;
  if (semaine > sit.nbSem) semaine = sit.nbSem;
  var w = lireSemaine_(sit.sheet, semaine);
  attacherHistorique_(a.sheetId, ss, sit, w.seances, false);
  var out = {};
  w.seances.forEach(function (s) {
    s.exos.forEach(function (e) { if (e.prev) out[e.row] = e.prev; });
  });
  return { ok: true, semaine: semaine, block: sit.sheet.getName(), prev: out };
}

/** Plan de l'onglet pour les ecritures : une lecture etroite suffit (colonnes A a T). */
function planDuSheet_(sh) {
  return plan_(grille_(sh, WEEK_COLS[0] + 16));
}

/** Une semaine : lecture bornee a cette semaine. */
function lireSemaine_(sh, semaine) {
  return lireSemaineDe_(grille_(sh, WEEK_COLS[semaine - 1] + 16), semaine);
}

/** Tout le bloc en UNE lecture : indispensable pour reperer ce qui traine d'une semaine a l'autre. */
function lireBloc_(sh, nbSem) {
  if (!nbSem || nbSem < 1) nbSem = 1;
  if (nbSem > WEEK_COLS.length) nbSem = WEEK_COLS.length;
  var vals = grille_(sh, WEEK_COLS[nbSem - 1] + 16);
  var out = [];
  for (var s = 1; s <= nbSem; s++) out.push(lireSemaineDe_(vals, s));
  return out;
}

/** Lecture bornee aux dimensions reelles de l'onglet : un Sheet plus etroit ne doit pas planter. */
function grille_(sh, nbCol) {
  var maxL = sh.getMaxRows(), maxC = sh.getMaxColumns();
  var vals = sh.getRange(1, 1, Math.min(HAUTEUR_MAX, maxL), Math.min(nbCol, maxC)).getValues();
  var large = Math.max(nbCol, maxC);
  for (var i = 0; i < vals.length; i++) {
    while (vals[i].length < large) vals[i].push('');
  }
  while (vals.length < HAUTEUR_MAX) vals.push(new Array(large).join('.').split('.'));
  return vals;
}

/* ───────────────────────── API ───────────────────────── */

/**
 * Valeurs de RPE acceptees par le Sheet (validation de donnees de la colonne K).
 * L'app construit ses boutons avec CETTE liste : sans ca elle peut proposer un choix
 * que Google refuse a l'ecriture, et la seance entiere est perdue.
 */
function optionsRpe_(sh, col, ligne) {
  try {
    var dv = sh.getRange(ligne || (SESSION_ROWS[0] + 2), col + OFF.rpe1).getDataValidation();
    if (!dv) return null;
    var type = dv.getCriteriaType();
    var args = dv.getCriteriaValues();
    var brut = null;
    if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
      brut = args[0];
    } else if (type === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
      brut = args[0].getValues().map(function (l) { return l[0]; });
    }
    if (!brut || !brut.length) return null;
    var out = [];
    brut.forEach(function (x) { var t = rpe_(x); if (t !== '' && out.indexOf(t) < 0) out.push(t); });
    return out.length ? out : null;
  } catch (e) { return null; }
}

/** « 9,5 » dans la liste, 9.5 une fois ecrit en nombre : c'est le meme RPE. */
function normRpe_(v) {
  return String(v == null ? '' : v).trim().toLowerCase()
    .replace(',', '.').replace(/\.0$/, '').replace(/\s+/g, ' ');
}
function rpeAccepte_(liste, v) {
  if (!liste || !liste.length) return true;   // validation illisible : on ne bloque rien
  var n = normRpe_(v);
  for (var i = 0; i < liste.length; i++) if (normRpe_(liste[i]) === n) return true;
  return false;
}

/**
 * Records de l'athlete, tels que le TABLEAU DE PR les calcule.
 * Le scan complet du classeur coute cher : on le garde 6 h en memoire,
 * et apiSave rafraichit la cle des qu'une seance est enregistree.
 */
function recordsAthlete_(sheetId, forcer, seulementCache) {
  var cle = 'pr:' + sheetId, cache = null;
  try { cache = CacheService.getScriptCache(); } catch (e) {}
  if (cache && !forcer) {
    var hit = cache.get(cle);
    if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  }
  // le scan complet coute ~5 s : on ne le fait jamais pendant le chargement de la seance
  if (seulementCache) return null;
  var plats;
  try { plats = TableauPR.recordsPlats(sheetId); } catch (e) { return null; }
  var index = {};
  (plats || []).forEach(function (p) {
    var cur = index[p.cle];
    if (!cur || p.charge > cur.charge) index[p.cle] = { charge: p.charge, period: p.period };
  });
  if (cache) {
    try {
      var json = JSON.stringify(index);
      if (json.length < 90000) cache.put(cle, json, 21600);
    } catch (e) {}
  }
  return index;
}

/** Attache a chaque exercice le record a battre pour SON format et SON schema. */
function attacherRecords_(sheetId, seances, seulementCache) {
  var index = recordsAthlete_(sheetId, false, seulementCache);
  if (!index) return false;
  var plats = [], refs = [];
  seances.forEach(function (s) {
    s.exos.forEach(function (e) {
      plats.push({ nom: e.nomBrut, qual: e.varBrut, tempo: e.tempo, sets: e.sets, reps: e.reps });
      refs.push(e);
    });
  });
  var cles;
  try { cles = TableauPR.clesDExos(plats); } catch (e) { return; }
  refs.forEach(function (e, i) {
    var k = cles[i];
    if (!k) return;
    var rec = index[k.cle] || null;
    e.record = rec ? { charge: rec.charge, quand: rec.period } : null;
    e.prFormat = k.format;
    e.prSchema = k.schema;
  });
  return true;
}

function apiLogin(body) {
  var a = athleteFromCode_(body.code);
  if (!a.sheetId) return { ok: true, role: 'coach', coach: true, prenom: a.prenom };
  var ss = SpreadsheetApp.openById(a.sheetId);
  return { ok: true, role: 'athlete', coach: a.coach, prenom: a.prenom, sheet: ss.getName() };
}

function apiProgram(body) {
  var a  = athleteFromCode_(body.code);
  if (!a.sheetId) return { ok: true, role: 'coach', coach: true, prenom: a.prenom };
  var ss = SpreadsheetApp.openById(a.sheetId);
  var sit = situation_(ss);
  var semaine = Number(body.semaine) || sit.semaine;
  if (semaine < 1) semaine = 1;
  if (semaine > sit.nbSem) semaine = sit.nbSem;
  var w = lireSemaine_(sit.sheet, semaine);
  // records seulement s'ils sont deja en memoire ; sinon l'app les demandera a part
  var recPrets = false;
  try { recPrets = attacherRecords_(a.sheetId, w.seances, true); } catch (e) {}
  // blocs precedents seulement s'ils sont deja en memoire ; sinon action « historique »
  var histPret = false;
  try { histPret = attacherHistorique_(a.sheetId, ss, sit, w.seances, true); } catch (e) {}
  return {
    ok: true,
    role: 'athlete',
    coach: a.coach,
    prenom: a.prenom,
    block: sit.sheet.getName(),
    blockDebut: sit.debut ? Utilities.formatDate(sit.debut, Session.getScriptTimeZone(), 'dd/MM/yy') : '',
    semaine: semaine,
    nbSemaines: sit.nbSem,
    semaineAuto: sit.semaine,
    rpeOptions: optionsRpe_(sit.sheet, WEEK_COLS[semaine - 1],
                            w.seances.length ? w.seances[0].ligne + 2 : 0),
    recordsPrets: !!recPrets,
    historiquePret: !!histPret,
    seances: w.seances,
    recup: w.recup
  };
}

/** Les records seuls : appel separe pour ne pas ralentir l'ouverture de la seance. */
/** Les records seuls : appel separe pour ne pas ralentir l'ouverture de la seance. */
function apiRecords(body) {
  var a = athleteFromCode_(body.code);
  if (!a.sheetId) return { ok: true, records: {} };
  var ss = SpreadsheetApp.openById(a.sheetId);
  var sit = situation_(ss);
  var semaine = Number(body.semaine) || sit.semaine;
  if (semaine < 1) semaine = 1;
  if (semaine > sit.nbSem) semaine = sit.nbSem;
  var w = lireSemaine_(sit.sheet, semaine);
  attacherRecords_(a.sheetId, w.seances, false);
  var out = {};
  w.seances.forEach(function (s) {
    s.exos.forEach(function (e) {
      out[e.row] = { record: e.record || null, format: e.prFormat || '', schema: e.prSchema || '' };
    });
  });
  return { ok: true, semaine: semaine, records: out };
}

function apiSave(body) {
  var a  = athleteFromCode_(body.code);
  var ss = SpreadsheetApp.openById(a.sheetId);
  var sh = ss.getSheetByName(body.block);
  if (!sh) throw new Error('Onglet ' + body.block + ' introuvable.');
  var col = WEEK_COLS[Number(body.semaine) - 1];
  if (!col) throw new Error('Semaine invalide.');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  // Une cellule refusee (validation de donnees) ne doit PAS faire perdre le reste de la seance :
  // on ecrit case par case et on renvoie la liste de ce qui n'est pas passe.
  var refus = [];
  // Apps Script applique les ecritures au flush() : une valeur refusee par la validation
  // n'echoue donc PAS sur son setValue mais a la fin, et ferait tomber toute la seance.
  // On verifie donc les RPE AVANT d'ecrire.
  var pl = planDuSheet_(sh);
  var rpeOk = optionsRpe_(sh, col, pl.seances[0] ? pl.seances[0].premier : 0);
  var refuser = function (r, champ, valeur, raison) {
    refus.push({ row: r, champ: champ, valeur: String(valeur), raison: raison });
  };
  var ecrire = function (r, c, valeur, champ) {
    try { sh.getRange(r, c).setValue(valeur); }
    catch (e) {
      refus.push({ row: r, champ: champ, valeur: String(valeur),
                   raison: String((e && e.message) || e).slice(0, 200) });
    }
  };
  try {
    (body.entries || []).forEach(function (en) {
      var r = Number(en.row);
      if (!r) return;
      if (en.rpe1 !== undefined && en.rpe1 !== '') {
        if (rpeAccepte_(rpeOk, en.rpe1)) ecrire(r, col + OFF.rpe1, valRpe_(en.rpe1), 'RPE 1re serie');
        else refuser(r, 'RPE 1re serie', en.rpe1, 'valeur absente de la liste du Sheet');
      }
      if (en.rpeLast !== undefined && en.rpeLast !== '') {
        if (rpeAccepte_(rpeOk, en.rpeLast)) ecrire(r, col + OFF.rpeLast, valRpe_(en.rpeLast), 'RPE derniere serie');
        else refuser(r, 'RPE derniere serie', en.rpeLast, 'valeur absente de la liste du Sheet');
      }
      if (en.charge   !== undefined && en.charge  !== '' && en.charge !== null) {
        ecrire(r, col + OFF.charge, Number(en.charge), 'charge');
      }
      if (en.note !== undefined && String(en.note).trim() !== '') {
        ecrire(r, col + OFF.note, String(en.note).trim(), 'note');
      }
    });
    if (body.difficulte) {
      var S = pl.seances[Number(body.seance)];
      if (S) ecrire(S.total, col + OFF_DIFF, String(body.difficulte), 'difficulte');
    }
    try { SpreadsheetApp.flush(); }
    catch (e) { refuser(0, 'enregistrement', '', String((e && e.message) || e).slice(0, 200)); }
  } finally {
    lock.releaseLock();
  }
  rebuildPR_(a.sheetId);
  try { recordsAthlete_(a.sheetId, true); } catch (e) {}   // le record vient peut-etre de changer
  oublierFiche_(a.sheetId);                                  // vue coach : la fiche sera relue
  return { ok: true, refus: refus };
}

/**
 * Reconstruit le TABLEAU DE PR de l'athlète.
 * Le script du tableau ne se déclenche (onEdit) que sur une saisie humaine :
 * quand c'est l'app qui écrit, on l'appelle donc nous-mêmes, via la
 * bibliothèque « TableauPR » (le projet lié à FUTURE PROG).
 * Jamais bloquant : si ça échoue, la séance est quand même enregistrée.
 */
function rebuildPR_(sheetId) {
  try {
    TableauPR.construirePourSheet(sheetId);
  } catch (err) {
    console.error('Tableau de PR non reconstruit : ' + (err && err.message || err));
  }
}

/** RPE : nombre si possible (évite la conversion en date), sinon texte. */
function valRpe_(v) {
  var s = String(v).trim().replace(',', '.');
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function apiWeekly(body) {
  var a  = athleteFromCode_(body.code);
  var ss = SpreadsheetApp.openById(a.sheetId);
  var sh = ss.getSheetByName(body.block);
  if (!sh) throw new Error('Onglet ' + body.block + ' introuvable.');
  var col = WEEK_COLS[Number(body.semaine) - 1];
  if (!col) throw new Error('Semaine invalide.');

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var lignes = planDuSheet_(sh).recup;
    ['sommeil', 'nutrition', 'steps', 'humeur', 'poids'].forEach(function (k) {
      var v = body[k];
      if (v === undefined || v === null || v === '') return;
      if (!lignes[k]) return;
      sh.getRange(lignes[k], col + OFF_RECUP).setValue(Number(v));
    });
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  oublierFiche_(a.sheetId);   // vue coach : la fiche sera relue
  return { ok: true };
}

/* ───────────────────────── VUE COACH ───────────────────────── */

/** Date reelle d'une seance : debut de la semaine + le jour ecrit dans le Sheet. */
var JOURS_SEM = { dimanche: 0, lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6 };
function dateSeance_(debutSemaine, jour) {
  if (!debutSemaine) return null;
  var k = JOURS_SEM[String(jour || '').trim().toLowerCase()];
  if (k === undefined) return null;
  var d = new Date(debutSemaine.getTime());
  d.setDate(d.getDate() + ((k - d.getDay() + 7) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}
function jourCourt_(d) {
  return d ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM') : '';
}

/** RPE au plafond : 9.5 et plus, ou « échec ». */
function estDur_(v) {
  var t = String(v || '').toLowerCase();
  if (t.indexOf('échec') > -1 || t.indexOf('echec') > -1) return true;
  var n = Number(t.replace(',', '.'));
  return !isNaN(n) && n >= 9.5;
}

/** Ce qui n'a pas ete saisi sur un exercice programme. */
function manque_(e) {
  if (!e.sets && !e.reps) return '';                 // rien n'etait programme
  var sansCharge = (e.charge === null);
  var sansRpe    = (!e.rpe1 && !e.rpeLast);
  if (sansCharge && sansRpe) return 'tout';
  if (sansCharge) return 'charge';
  if (sansRpe)    return 'rpe';
  return '';
}

/**
 * Ce qui traine sur l'ensemble du bloc, exercice par exercice (meme ligne, semaine apres semaine) :
 *  - dur      : RPE au plafond une fois -> recurrent si plusieurs semaines
 *  - stagne   : 3 charges relevees sans la moindre progression
 *  - note     : la derniere note laissee par l'athlete
 */
function soucisDuBloc_(semaines, jusqua) {
  var suivi = {}, ordre = [];
  for (var s = 0; s < jusqua && s < semaines.length; s++) {
    semaines[s].seances.forEach(function (se) {
      se.exos.forEach(function (e) {
        var k = se.idx + ':' + e.row;
        if (!suivi[k]) { suivi[k] = { nom: e.nom, variante: e.variante, jour: se.jour, dur: [], charges: [], note: null }; ordre.push(k); }
        var t = suivi[k];
        if (estDur_(e.rpeLast) || estDur_(e.rpe1)) t.dur.push(s + 1);
        if (e.charge !== null && se.reelle) t.charges.push({ sem: s + 1, val: e.charge });
        if (e.note) t.note = { sem: s + 1, texte: e.note };
      });
    });
  }
  var out = [];
  ordre.forEach(function (k) {
    var t = suivi[k];
    if (t.dur.length) {
      out.push({ exo: t.nom, variante: t.variante, jour: t.jour,
                 type: t.dur.length > 1 ? 'recurrent' : 'dur',
                 texte: t.dur.length > 1 ? 'RPE au plafond ' + t.dur.length + ' semaines' : 'RPE au plafond',
                 semaines: t.dur });
    }
    var c = t.charges;
    if (c.length >= 3) {
      var d = c.slice(c.length - 3);
      if (d[2].val <= d[0].val && d[2].val > 0) {   // 0 = poids du corps, rien a progresser
        out.push({ exo: t.nom, variante: t.variante, jour: t.jour, type: 'stagne',
                   texte: 'charge bloquée à ' + d[2].val + ' kg depuis la semaine ' + d[0].sem,
                   semaines: [d[0].sem, d[2].sem] });
      }
    }
    if (t.note) {
      out.push({ exo: t.nom, variante: t.variante, jour: t.jour, type: 'note',
                 texte: t.note.texte, semaines: [t.note.sem] });
    }
  });
  var rang = { recurrent: 0, stagne: 1, dur: 2, note: 3 };
  out.sort(function (a, b) { return rang[a.type] - rang[b.type]; });
  return out.slice(0, 12);
}

/** Un exercice mérite l'attention du coach ? */
function alertesExo_(e) {
  var out = [];
  var dur = function (v) {
    var s = String(v || '').toLowerCase();
    if (s.indexOf('échec') > -1 || s.indexOf('echec') > -1) return true;
    var n = Number(s.replace(',', '.'));
    return !isNaN(n) && n >= 9.5;
  };
  if (dur(e.rpeLast) || dur(e.rpe1)) {
    out.push({ type: 'rpe', exo: e.nom, texte: 'RPE ' + (e.rpeLast || e.rpe1) });
  }
  if (e.note) out.push({ type: 'note', exo: e.nom, texte: e.note });
  return out;
}

function apiCoach(body) {
  var a = athleteFromCode_(body.code);
  if (!a.coach) throw new Error('Réservé au coach.');

  var rows = registreSheet_().getDataRange().getValues();
  var athletes = [];

  for (var i = 1; i < rows.length; i++) {
    var code = String(rows[i][0] || '').trim();
    if (!code) continue;
    if (String(rows[i][2] || 'oui').trim().toLowerCase() === 'non') continue;
    var id = String(rows[i][3] || '').trim();
    var m = id.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (m) id = m[1];
    if (!id) continue;

    var fiche = { code: code, prenom: String(rows[i][1] || '').trim() || code };
    try {
      var ss  = SpreadsheetApp.openById(id);
      var sit = situation_(ss);
      var semaines = lireBloc_(sit.sheet, sit.nbSem);   // une seule lecture pour tout le bloc
      var w   = semaines[sit.semaine - 1] || semaines[semaines.length - 1];

      var faites = 0, alertes = [];
      w.seances.forEach(function (s) {
        if (s.etat === 'faite') faites++;
        s.exos.forEach(function (e) {
          alertesExo_(e).forEach(function (al) { al.jour = s.jour; alertes.push(al); });
        });
      });

      var notes = [], somme = 0, n = 0;
      ['sommeil', 'nutrition', 'steps', 'humeur'].forEach(function (k) {
        var v = w.recup[k];
        if (v !== null && v !== undefined) { somme += v; n++; notes.push(k + ' ' + v); }
      });
      var moyenne = n ? Math.round((somme / n) * 10) / 10 : null;

      fiche.block    = sit.sheet.getName();
      fiche.semaine  = sit.semaine;
      fiche.nbSem    = sit.nbSem;
      fiche.faites   = faites;
      fiche.total    = w.seances.length;
      // Une seance dont le jour n'est pas encore arrive ne peut rien avoir d'oublie.
      var t0 = new Date(); t0.setHours(0, 0, 0, 0);
      var debutW = null;
      if (sit.debut) {
        debutW = new Date(sit.debut.getTime());
        debutW.setDate(debutW.getDate() + 7 * (sit.semaine - 1));
        debutW.setHours(0, 0, 0, 0);
      }
      var trous = 0, aVenir = 0, sautees = [];
      fiche.seances  = w.seances.map(function (s) {
        var dS = dateSeance_(debutW, s.jour);
        // sans date exploitable, on retombe sur l'ancienne regle
        var passee = dS ? (dS < t0) : (s.etat !== 'vide');
        var commencee = (s.etat !== 'vide');
        if (!passee) aVenir++;
        if (passee && !commencee) sautees.push({ jour: s.jour, date: jourCourt_(dS) });
        var exos = s.exos.map(function (e) {
          var mq = (passee && commencee) ? manque_(e) : '';
          if (mq) trous++;
          return {
            nom: e.nom, variante: e.variante, tempo: e.tempo,
            sets: e.sets, reps: e.reps,
            rpeCible: e.rpeCible, rpe1: e.rpe1, rpeLast: e.rpeLast,
            chargeReco: e.chargeReco, charge: e.charge,
            note: e.note, manque: mq, dur: estDur_(e.rpeLast) || estDur_(e.rpe1)
          };
        });
        return { jour: s.jour, date: jourCourt_(dS), passee: passee,
                 etat: s.etat, remplis: s.remplis, total: s.total,
                 difficulte: s.difficulte, exos: exos };
      });
      fiche.trous    = trous;
      fiche.aVenir   = aVenir;
      fiche.sautees  = sautees;
      fiche.soucis   = soucisDuBloc_(semaines, sit.semaine);
      fiche.alertes  = alertes.slice(0, 12);
      fiche.recup    = { moyenne: moyenne, detail: notes.join(' · '), poids: w.recup.poids };
    } catch (err) {
      fiche.erreur = String(err && err.message || err);
    }
    athletes.push(fiche);
  }
  return { ok: true, prenom: a.prenom, athletes: athletes };
}

/* ═════════════════════════ VUE COACH v2 ═════════════════════════
   La fiche complète d'un athlète : tous ses onglets BLOCK (toutes les semaines, toutes les lignes)
   et son Tableau de PR. Tout est calculé ensuite dans l'app (records battus, graphiques, muscles).
   - fiche gardée en mémoire du script, compressée (limite ~100 Ko par entrée), 15 min maximum,
     effacée dès que l'athlète envoie une séance ou son bilan (apiSave / apiWeekly) ;
   - réglages du coach (classement des exercices, muscles associés, fusions) dans les propriétés du script. */

var FICHE_TTL = 900;
var JAUNE_V2 = [['sommeil', /^sommeil/], ['nutrition', /^nutrition/], ['steps', /^steps/], ['humeur', /^humm?eur/], ['poids', /^poids/]];

function coachAutorise_(body) {
  var a = athleteFromCode_(body.code);
  if (!a.coach) throw new Error('Réservé au coach.');
  return a;
}

/** Athlètes actifs du registre (gardés 15 min en mémoire : ouvrir FUTURE PROG coûte cher). */
function athletesActifs_() {
  var cache = null;
  try { cache = CacheService.getScriptCache(); } catch (e) {}
  if (cache) { var hit = cache.get('reg:actifs'); if (hit) { try { return JSON.parse(hit); } catch (e) {} } }
  var rows = registreSheet_().getDataRange().getValues(), out = [];
  for (var i = 1; i < rows.length; i++) {
    var code = String(rows[i][0] || '').trim();
    if (!code) continue;
    if (String(rows[i][2] || 'oui').trim().toLowerCase() === 'non') continue;
    var id = String(rows[i][3] || '').trim();
    var m = id.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (m) id = m[1];
    if (!id) continue;
    out.push({ code: code, prenom: String(rows[i][1] || '').trim() || code, id: id });
  }
  if (cache) { try { cache.put('reg:actifs', JSON.stringify(out), 900); } catch (e) {} }
  return out;
}

function numV2_(x) {
  if (x === '' || x === null || x === undefined) return null;
  if (typeof x === 'number') return x;
  if (x instanceof Date) return parseFloat(x.getDate() + '.' + (x.getMonth() + 1));   // « 7.5 » converti en date par Sheets FR
  var m = String(x).match(/^\s*(\d+(?:[.,]\d+)?)/);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}
function txtV2_(x) {
  if (x === null || x === undefined) return '';
  if (x instanceof Date) return x.getDate() + '.' + (x.getMonth() + 1);
  if (typeof x === 'number') return (x % 1 === 0) ? String(x) : String(x);
  return String(x).trim();
}
function isoV2_(d) { return (d instanceof Date) ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') : null; }

function extraireFiche_(id) {
  var ss = SpreadsheetApp.openById(id);
  var blocs = {}, semaines = {};
  ss.getSheets().forEach(function (sh) {
    var mm = sh.getName().match(/^BLOCK (\d+)$/);
    if (!mm) return;
    var b = Number(mm[1]);
    var nbL = Math.min(sh.getMaxRows(), HAUTEUR_MAX), nbC = Math.min(sh.getMaxColumns(), 4 + 18 * 5 + 17);
    var v = sh.getRange(1, 1, nbL, nbC).getValues();
    var cell = function (r, c) { return (r >= 1 && r <= nbL && c >= 1 && c <= nbC) ? v[r - 1][c - 1] : ''; };
    var dm = String(cell(12, 16) || '').match(/(\d)/), duree = dm ? Number(dm[1]) : null;
    var heads = [];
    for (var r = 1; r <= nbL; r++) if (String(cell(r, 4) || '').trim().toLowerCase() === 'mouvement') heads.push(r);
    blocs[b] = { debut: isoV2_(cell(12, 4)), duree: duree };
    for (var w = 1; w <= 6; w++) {
      if (duree && w > duree) break;
      var c = 4 + 18 * (w - 1);
      if (c + 15 > nbC) break;
      var seances = [], vide = true;
      heads.forEach(function (h) {
        var lignes = [], rr = h + 2;
        while (rr <= nbL && String(cell(rr, 4) || '').trim().toLowerCase().indexOf('total s') !== 0) {
          var nom = txtV2_(cell(rr, c)), s = numV2_(cell(rr, c + 3));
          if (nom && s) {
            var e1 = numV2_(cell(rr, c + 15));
            lignes.push({ row: rr, code: txtV2_(cell(rr, c - 1)), nom: nom.toLowerCase(), 'var': txtV2_(cell(rr, c + 1)).toLowerCase(),
              tempo: txtV2_(cell(rr, c + 2)), sets: s, reps: numV2_(cell(rr, c + 5)) || 0, repsTxt: txtV2_(cell(rr, c + 5)),
              rpeCible: txtV2_(cell(rr, c + 6)), rpe1: txtV2_(cell(rr, c + 7)), rpeLast: txtV2_(cell(rr, c + 8)),
              charge: numV2_(cell(rr, c + 12)), note: txtV2_(cell(rr, c + 13)), ton: numV2_(cell(rr, c + 14)) || 0,
              // une cellule mal remplie a donné -2881,7 chez Mathias : on écarte l'aberrant
              e1rm: (e1 !== null && e1 > 0 && e1 < 400) ? e1 : null });
          }
          rr++;
        }
        if (lignes.length) vide = false;
        seances.push({ jour: txtV2_(cell(h - 1, c)), difficulte: txtV2_(cell(rr, c + 13)), lignes: lignes });
      });
      /* tableau jaune : libellés cherchés DANS L'ORDRE (sinon « poids » sort avant « humeur ») ; case vide = null */
      var recup = {}, depart = 1;
      JAUNE_V2.forEach(function (j) {
        for (var r2 = depart; r2 <= nbL; r2++) {
          if (j[1].test(String(cell(r2, c + 11) || '').trim().toLowerCase())) { recup[j[0]] = numV2_(cell(r2, c + 12)); depart = r2 + 1; return; }
        }
      });
      if (!vide) semaines[b + '-' + w] = { date: isoV2_(cell(12, c)), seances: seances, recup: recup };
    }
  });
  return { blocs: blocs, semaines: semaines, pr: tableauPrV2_(ss) };
}

/** Le Tableau de PR tel qu'il est affiché dans le Sheet : groupes > exercices > lignes (format, schéma, record, date). */
function tableauPrV2_(ss) {
  var sh = ss.getSheetByName('TABLEAU DE PR');
  if (!sh) return [];
  var vals = sh.getDataRange().getValues(), nL = vals.length;
  var v = function (r, c) { return (r >= 1 && r <= nL && vals[r - 1][c - 1] !== undefined) ? vals[r - 1][c - 1] : ''; };
  var groupes = [], cur = null, r = 4;
  while (r <= nL) {
    var b = v(r, 2);
    if (b && v(r + 1, 2) === 'Format') {
      var fin = r + 2;
      [2, 7, 12].forEach(function (c) {
        var nom = v(r, c);
        if (!nom) return;
        var rows = [], rr = r + 2;
        while (rr <= nL && v(rr, c) !== '' && v(rr, c) !== null) {
          var d = v(rr, c + 3);
          rows.push({ f: String(v(rr, c)), s: String(v(rr, c + 1)), rec: String(v(rr, c + 2)),
                      le: (d instanceof Date) ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yy') : String(d || '') });
          rr++;
        }
        fin = Math.max(fin, rr);
        if (!cur) { cur = { titre: 'AUTRE', exos: [] }; groupes.push(cur); }
        cur.exos.push({ nom: String(nom), rows: rows });
      });
      r = fin; continue;
    }
    if (b && typeof b === 'string') { cur = { titre: b.trim(), exos: [] }; groupes.push(cur); }
    r++;
  }
  return groupes.filter(function (g) { return g.exos.length; });
}

/* mémoire du script : JSON compressé puis découpé en morceaux de 90 000 caractères */
function ficheEnCache_(id) {
  try {
    var c = CacheService.getScriptCache(), n = Number(c.get('fiche:' + id + ':n') || 0);
    if (!n) return null;
    var cles = []; for (var i = 0; i < n; i++) cles.push('fiche:' + id + ':' + i);
    var got = c.getAll(cles), s = '';
    for (var k = 0; k < n; k++) { if (!got[cles[k]]) return null; s += got[cles[k]]; }
    var json = Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(s), 'application/x-gzip')).getDataAsString();
    return JSON.parse(json);
  } catch (e) { return null; }
}
function mettreFicheEnCache_(id, fiche) {
  try {
    var z = Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(fiche), 'application/json')).getBytes());
    var parts = {}, n = 0;
    for (var i = 0; i < z.length; i += 90000) { parts['fiche:' + id + ':' + n] = z.slice(i, i + 90000); n++; }
    parts['fiche:' + id + ':n'] = String(n);
    CacheService.getScriptCache().putAll(parts, FICHE_TTL);
  } catch (e) {}
}
/** Appelé après chaque envoi de l'athlète : la prochaine ouverture relit le Sheet. */
function oublierFiche_(id) { try { CacheService.getScriptCache().remove('fiche:' + id + ':n'); } catch (e) {} }

function lireReglages_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('coach_reglages') || '{}'); } catch (e) { return {}; }
}

function apiCoachAthletes(body) {
  var a = coachAutorise_(body);
  return { ok: true, prenom: a.prenom,
           athletes: athletesActifs_().map(function (x) { return { code: x.code, prenom: x.prenom }; }),
           reglages: lireReglages_() };
}

function apiCoachFiche(body) {
  coachAutorise_(body);
  var voulu = String(body.athlete || '').trim().toUpperCase();
  var cible = athletesActifs_().filter(function (x) { return x.code.toUpperCase() === voulu; })[0];
  if (!cible) throw new Error('Athlète introuvable.');
  var fiche = body.forcer ? null : ficheEnCache_(cible.id);
  if (!fiche) { fiche = extraireFiche_(cible.id); mettreFicheEnCache_(cible.id, fiche); }
  return { ok: true, code: cible.code, prenom: cible.prenom, fiche: fiche };
}

/** L'athlete, onglet Records : SA fiche (meme extraction que la vue coach) + le classement du coach.
 *  Le code ne donne acces qu'a son propre Sheet. */
function apiMaFiche(body) {
  var a = athleteFromCode_(body.code);
  if (!a.sheetId) throw new Error('Aucun Sheet pour ce code.');
  var fiche = body.forcer ? null : ficheEnCache_(a.sheetId);
  if (!fiche) { fiche = extraireFiche_(a.sheetId); mettreFicheEnCache_(a.sheetId, fiche); }
  return { ok: true, prenom: a.prenom, fiche: fiche, reglages: lireReglages_() };
}

function apiCoachReglages(body) {
  coachAutorise_(body);
  var r = lireReglages_();
  if (body.reglages) {
    ['classement', 'muscles', 'fusions', 'noms', 'masques'].forEach(function (k) {
      if (body.reglages[k] && typeof body.reglages[k] === 'object') r[k] = body.reglages[k];
    });
    var s = JSON.stringify(r);
    if (s.length > 8500) throw new Error('Réglages trop volumineux.');
    PropertiesService.getScriptProperties().setProperty('coach_reglages', s);
  }
  return { ok: true, reglages: r };
}
