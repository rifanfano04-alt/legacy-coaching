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

function lireSemaine_(sh, semaine) {
  var col = WEEK_COLS[semaine - 1];
  var vals = sh.getRange(1, 1, 110, col + 16).getValues();
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
      var libelle = (code === 'R') ? (vari || 'Renfo') : nom;
      var sousTitre = (code === 'R') ? '' : vari;
      var charge = chg;
      var e = {
        row: r,
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

/* ───────────────────────── API ───────────────────────── */

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
    seances: w.seances,
    recup: w.recup
  };
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
  try {
    (body.entries || []).forEach(function (en) {
      var r = Number(en.row);
      if (!r) return;
      if (en.rpe1     !== undefined && en.rpe1    !== '') sh.getRange(r, col + OFF.rpe1   ).setValue(valRpe_(en.rpe1));
      if (en.rpeLast  !== undefined && en.rpeLast !== '') sh.getRange(r, col + OFF.rpeLast).setValue(valRpe_(en.rpeLast));
      if (en.charge   !== undefined && en.charge  !== '' && en.charge !== null) {
        sh.getRange(r, col + OFF.charge).setValue(Number(en.charge));
      }
      if (en.note !== undefined && String(en.note).trim() !== '') {
        sh.getRange(r, col + OFF.note).setValue(String(en.note).trim());
      }
    });
    if (body.difficulte) {
      var hRow = SESSION_ROWS[Number(body.seance)];
      if (hRow) sh.getRange(hRow + 9, col + OFF_DIFF).setValue(String(body.difficulte));
    }
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  rebuildPR_(a.sheetId);
  return { ok: true };
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
      var w   = lireSemaine_(sit.sheet, sit.semaine);

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
      fiche.seances  = w.seances.map(function (s) {
        return { jour: s.jour, etat: s.etat, remplis: s.remplis, total: s.total, difficulte: s.difficulte };
      });
      fiche.alertes  = alertes.slice(0, 12);
      fiche.recup    = { moyenne: moyenne, detail: notes.join(' · '), poids: w.recup.poids };
    } catch (err) {
      fiche.erreur = String(err && err.message || err);
    }
    athletes.push(fiche);
  }
  return { ok: true, prenom: a.prenom, athletes: athletes };
}
