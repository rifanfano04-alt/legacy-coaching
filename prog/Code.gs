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

/** Lit une semaine dans un tableau deja charge (colonne A -> fin de la semaine). */
function lireSemaineDe_(vals, semaine) {
  var col = WEEK_COLS[semaine - 1];
  var get = function (r, off) { return vals[r - 1][col - 1 + off]; };

  var seances = [];
  SESSION_ROWS.forEach(function (hRow, sIdx) {
    var exos = [], rempli = 0, prescrits = 0;
    for (var k = 0; k < EXOS_PER_SESSION; k++) {
      var r = hRow + 2 + k;
      var code = txt_(get(r, OFF.code)).toUpperCase();
      var sets = num_(get(r, OFF.sets));
      var nom  = txt_(get(r, OFF.nom));
      var vari = txt_(get(r, OFF.variante));
      var reps = num_(get(r, OFF.reps));
      var chg  = num_(get(r, OFF.charge));
      // ligne de gabarit (code muscle présent mais rien de programmé) : on l'ignore
      if (!code || (!sets && !reps && !vari && chg === null)) continue;
      // Semaine precedente : elle est deja dans vals (on lit depuis la colonne A),
      // donc aucune lecture supplementaire. Rien en semaine 1.
      var prev = null;
      if (semaine > 1) {
        var pc = col - 18;
        var pg = function (off) { return vals[r - 1][pc - 1 + off]; };
        var pch = num_(pg(OFF.charge));
        var pr1 = rpe_(pg(OFF.rpe1)), pr2 = rpe_(pg(OFF.rpeLast)), pnt = txt_(pg(OFF.note));
        if (pch !== null || pr1 || pr2 || pnt) {
          prev = { charge: pch, rpe1: pr1, rpeLast: pr2, note: pnt,
                   sets: num_(pg(OFF.sets)), reps: num_(pg(OFF.reps)),
                   variante: (code === 'R') ? '' : txt_(pg(OFF.variante)),
                   tempo: txt_(pg(OFF.tempo)) };
        }
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
      if (e.sets || e.reps) prescrits++;
      exos.push(e);
    }
    if (!exos.length) return;
    var diff = txt_(get(hRow + 9, OFF_DIFF));
    // « faite » = la difficulté de séance est renseignée (c'est le marqueur de fin,
    // écrit par l'app) OU tout ce qui était programmé a été rempli.
    var faite = !!diff || (prescrits > 0 && rempli >= prescrits);
    seances.push({
      idx: sIdx,
      ligne: hRow,
      jour: txt_(get(hRow - 1, OFF.nom)),
      difficulte: diff,
      exos: exos,
      remplis: rempli,
      total: exos.length,
      etat: faite ? 'faite' : (rempli > 0 ? 'encours' : 'vide'),
      faite: faite
    });
  });

  var recup = {};
  Object.keys(RECUP_ROWS).forEach(function (k) {
    recup[k] = num_(vals[RECUP_ROWS[k] - 1][col - 1 + OFF_RECUP]);
  });

  return { seances: seances, recup: recup };
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
  var vals = sh.getRange(1, 1, Math.min(110, maxL), Math.min(nbCol, maxC)).getValues();
  var large = Math.max(nbCol, maxC);
  for (var i = 0; i < vals.length; i++) {
    while (vals[i].length < large) vals[i].push('');
  }
  while (vals.length < 110) vals.push(new Array(large).join('.').split('.'));
  return vals;
}

/* ───────────────────────── API ───────────────────────── */

/**
 * Valeurs de RPE acceptees par le Sheet (validation de donnees de la colonne K).
 * L'app construit ses boutons avec CETTE liste : sans ca elle peut proposer un choix
 * que Google refuse a l'ecriture, et la seance entiere est perdue.
 */
function optionsRpe_(sh, col) {
  try {
    var dv = sh.getRange(SESSION_ROWS[0] + 2, col + OFF.rpe1).getDataValidation();
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
    rpeOptions: optionsRpe_(sit.sheet, WEEK_COLS[semaine - 1]),
    recordsPrets: !!recPrets,
    seances: w.seances,
    recup: w.recup
  };
}

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
  var rpeOk = optionsRpe_(sh, col);
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
      var hRow = SESSION_ROWS[Number(body.seance)];
      if (hRow) ecrire(hRow + 9, col + OFF_DIFF, String(body.difficulte), 'difficulte');
    }
    try { SpreadsheetApp.flush(); }
    catch (e) { refuser(0, 'enregistrement', '', String((e && e.message) || e).slice(0, 200)); }
  } finally {
    lock.releaseLock();
  }
  rebuildPR_(a.sheetId);
  try { recordsAthlete_(a.sheetId, true); } catch (e) {}   // le record vient peut-etre de changer
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
    ['sommeil', 'nutrition', 'steps', 'humeur', 'poids'].forEach(function (k) {
      var v = body[k];
      if (v === undefined || v === null || v === '') return;
      sh.getRange(RECUP_ROWS[k], col + OFF_RECUP).setValue(Number(v));
    });
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
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
        if (e.charge !== null) t.charges.push({ sem: s + 1, val: e.charge });
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
