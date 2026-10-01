// Vocabulaire des fonctions : articulations, mouvements, paires antagonistes.
// Une fonction s'écrit « ART.mouv » (ex. EP.abd = épaule : abduction). Un « ! » final = moteur principal.
// Les fonctions propres (visage, œil, larynx…) s'écrivent « ART.code=Libellé ».
window.ARTICULATIONS = {
  EP: 'Épaule', SC: 'Scapula', CO: 'Coude', AB: 'Avant-bras', PO: 'Poignet', DG: 'Doigts', PC: 'Pouce',
  HA: 'Hanche', BA: 'Bassin', GE: 'Genou', CH: 'Cheville', PI: 'Pied', OR: 'Orteils', HX: 'Hallux',
  CE: 'Tête et cou', TR: 'Tronc', CT: 'Respiration', MA: 'Mâchoire', VI: 'Visage', OE: 'Œil',
  LA: 'Larynx et déglutition', PP: 'Plancher pelvien', CL: 'Clavicule',
};
window.MOUVEMENTS = {
  flex: 'Flexion', ext: 'Extension', abd: 'Abduction', add: 'Adduction', ri: 'Rotation interne', re: 'Rotation externe',
  hadd: 'Adduction horizontale', habd: 'Abduction horizontale', elev: 'Élévation', abs: 'Abaissement',
  prot: 'Protraction', retr: 'Rétraction', rsup: 'Sonnette latérale (rotation vers le haut)', rinf: 'Sonnette médiale (rotation vers le bas)',
  bpost: 'Bascule postérieure', plaq: 'Plaquage contre le thorax', pron: 'Pronation', sup: 'Supination', fd: 'Flexion dorsale', fp: 'Flexion plantaire',
  inv: 'Inversion', ev: 'Éversion', incl: 'Inclinaison latérale', roth: 'Rotation homolatérale', rotc: 'Rotation controlatérale',
  stab: 'Stabilisation', coapt: 'Coaptation (centrage de la tête)', compr: 'Compression abdominale', ant: 'Antéversion', retro: 'Rétroversion',
  insp: 'Inspiration', exp: 'Expiration forcée', opp: 'Opposition', repo: 'Retour d’opposition', voute: 'Soutien de la voûte plantaire',
  ferm: 'Fermeture de la bouche', ouv: 'Ouverture de la bouche', prop: 'Propulsion de la mandibule', retp: 'Rétropulsion de la mandibule', did: 'Diduction',
  verr: 'Déverrouillage', ecart: 'Écartement', rappr: 'Rapprochement', tens: 'Mise en tension',
};
// Paires antagonistes (même articulation, mouvement opposé)
window.OPPOSES = {
  flex: 'ext', ext: 'flex', abd: 'add', add: 'abd', ri: 're', re: 'ri', hadd: 'habd', habd: 'hadd', elev: 'abs', abs: 'elev',
  prot: 'retr', retr: 'prot', rsup: 'rinf', rinf: 'rsup', pron: 'sup', sup: 'pron', fd: 'fp', fp: 'fd', inv: 'ev', ev: 'inv',
  ant: 'retro', retro: 'ant', insp: 'exp', exp: 'insp', ferm: 'ouv', ouv: 'ferm', prop: 'retp', retp: 'prop', opp: 'repo', repo: 'opp', ecart: 'rappr', rappr: 'ecart',
};
window.FICHES = {};
// F(clé, origine, insertion, innervation, fonctions, intérêt pour le coach)
window.F = (k, o, i, n, a, note) => { window.FICHES[k] = { o, i, n, a: a.split(/\s*,\s*/).filter(Boolean), note: note || '' }; };
// T(clé, description, attaches, intérêt) : tendons, fascias, ligaments
window.T = (k, d, att, note) => { window.FICHES[k] = { d, att, note: note || '', a: [] }; };
