// Orientation par symptômes : le coach décrit en texte libre ce que ressent l'athlète
// (« mal devant l'épaule en bas des dips », « coup de jus derrière le coude »…) et l'app propose
// les protocoles de réhab les plus proches, avec les raisons et les signes d'alerte.
// Outil d'orientation pour le coach, pas un diagnostic.

// Concepts : libellé affiché + expressions reconnues (sans accents, début de mot : « leve » reconnaît lever, levé, levant).
window.CONCEPTS = {
  // ---- zones ----
  z_epaule: ['épaule', 'epaule', 'deltoide', 'coiffe', 'acromion', 'sus epineux', 'supra epineux'],
  z_omoplate: ['omoplate', 'omoplate', 'scapula', 'scapulaire'],
  z_clavicule: ['clavicule', 'clavicule', 'acromio', 'articulation ac', 'ac joint'],
  z_coude: ['coude', 'coude', 'olecrane', 'epicondyle', 'epitrochlee'],
  z_avantbras: ['avant-bras', 'avantbras', 'forearm'],
  z_biceps: ['biceps', 'biceps'],
  z_triceps: ['triceps', 'triceps'],
  z_poignet: ['poignet', 'poignet', 'carpe', 'wrist'],
  z_main: ['main', 'main', 'mains', 'paume'],
  z_pouce: ['pouce', 'pouce'],
  z_doigt: ['doigt', 'doigt', 'annulaire', 'majeur', 'auriculaire', 'phalange', 'poulie'],
  z_cou: ['cou / nuque', 'cou', 'nuque', 'cervical', 'cervicale'],
  z_trapeze: ['trapèze', 'trapeze'],
  z_haut_dos: ['haut du dos', 'hautdudos', 'entre les omoplates', 'dorsale', 'thoracique'],
  z_lombaire: ['bas du dos', 'bas du dos', 'lombaire', 'lombes', 'lumbago', 'reins', 'dos'],
  z_thorax: ['sternum / côtes', 'sternum', 'cotes', 'une cote', 'la cote', 'aux cotes', 'poitrine', 'pec', 'pectoral', 'thorax', 'cage thoracique'],
  z_aine: ['aine', 'aine', 'pubis', 'pubien', 'pubalgie', 'adducteur', 'entrejambe', 'pli de la hanche'],
  z_hanche: ['hanche', 'hanche', 'trochanter'],
  z_fesse: ['fesse', 'fesse', 'fessier', 'fessiers'],
  z_ischion: ['sous la fesse', 'sous la fesse', 'ischion', 'pli fessier', 'haut de l ischio', 'haut des ischio', 'quand il s assoit sur'],
  z_bassin: ['bassin / sacrum', 'sacrum', 'sacro', 'bassin', 'fossette'],
  z_cuisse_ar: ['arrière de la cuisse', 'arriere de la cuisse', 'derriere la cuisse', 'derriere de la cuisse', 'ischio', 'ischios', 'hamstring'],
  z_cuisse_ext: ['extérieur de la cuisse', 'exterieur de la cuisse', 'côté de la cuisse', 'bandelette', 'tfl', 'fascia lata'],
  z_genou: ['genou', 'genou', 'genoux', 'menisque', 'ligament croise', 'lca', 'lli'],
  z_rotule: ['rotule', 'rotule', 'patella', 'rotulien', 'tendon rotulien'],
  z_tibia: ['tibia', 'tibia', 'devant de la jambe', 'periostite', 'shin'],
  z_mollet: ['mollet', 'mollet', 'mollets', 'gastro', 'soleaire', 'jumeau', 'jumeaux'],
  z_achille: ['tendon d’Achille', 'achille', 'arriere du talon', 'derriere le talon', 'talon arriere', 'derriere du talon', 'haut du talon'],
  z_cheville: ['cheville', 'cheville', 'malleole'],
  z_talon: ['talon / voûte', 'talon', 'voute', 'plante', 'plantaire', 'sous le pied'],
  // ---- localisation ----
  l_avant: ['devant', 'devant', 'avant', 'anterieur', 'face avant', 'en face'],
  l_arriere: ['derrière', 'derriere', 'arriere', 'posterieur', 'pointe du coude'],
  l_dessus: ['dessus', 'dessus', 'sur le haut', 'en haut de l epaule', 'sommet', 'dosmain'],
  l_dedans: ['côté intérieur', 'interieur', 'interne', 'dedans', 'medial', 'côté interne'],
  l_dehors: ['côté extérieur', 'exterieur', 'externe', 'lateral', 'sur le côté', 'côté externe'],
  l_petitdoigt: ['côté petit doigt', 'côté petit doigt', 'côté du petit doigt', 'petit doigt', 'auriculaire', 'cubital', 'ulnaire'],
  l_cotepouce: ['côté pouce', 'côté pouce', 'côté du pouce', 'radial'],
  l_pli: ['pli du coude', 'pli du coude', 'creux du coude', 'au pli'],
  l_base: ['à la base', 'base du pouce', 'base'],
  l_sous: ['en dessous', 'sous la rotule', 'en dessous', 'sous le talon', 'pointe de la rotule'],
  // ---- déclencheurs ----
  t_lever: ['en levant le bras', 'leve', 'lever', 'levant', 'levee', 'elevation', 'monte le bras', 'monter le bras', 'bras en l air', 'abduction', 'ecarter le bras'],
  t_arc: ['élévation vers 60-120°'],
  t_overhead: ['au-dessus de la tête', 'au dessus de la tete', 'overhead', 'militaire', 'bras tendus en haut'],
  t_dips: ['dips', 'dips', 'dip', 'barres paralleles'],
  t_pousser: ['pousser (développé, pompes)', 'developpe', 'bench', 'pompe', 'pousse', 'pousser', 'push'],
  t_tirer: ['tirer (tractions, rowing)', 'traction', 'tirage', 'rowing', 'tire', 'tirer', 'pull', 'muscle up', 'muscle-up'],
  t_supination: ['paume vers soi / supination', 'supination', 'paume vers soi', 'chin', 'chin up', 'curl'],
  t_verrouiller: ['bras tendu / verrouillage', 'verrouill', 'tendre le bras', 'bras tendu', 'lockout', 'en haut du dip', 'fin de mouvement', 'extension du coude'],
  t_flexion_coude: ['coude plié longtemps', 'coude plie', 'bras plie', 'plier le coude', 'appui sur le coude', 's appuie sur le coude', 'telephone'],
  t_rotation_main: ['tourner la main', 'tourner', 'tourne', 'rotation du poignet', 'poignee', 'bocal', 'tournevis', 'visser', 'devisser', 'essorer'],
  t_appui_main: ['appui sur les mains', 'appui', 'handstand', 'poirier', 'equilibre', 'planche', 'pompe', 'burpee', 'main a plat', 'mains au sol', 'front rack'],
  t_serrer: ['serrer / tenir', 'serre', 'serrer', 'saisir', 'prise', 'grip', 'tenir', 'porter', 'soulever un sac'],
  t_pincer: ['pincer', 'pince', 'pincer', 'pinch'],
  t_soulever: ['soulever / se pencher', 'soulever', 'souleve', 'deadlift', 'souleve de terre', 'ramasser', 'charge lourde'],
  t_sepencher: ['se pencher en avant', 'se pencher', 'penche', 'flexion avant', 'se baisser', 'mettre ses chaussettes', 'lacets'],
  t_assis: ['position assise', 'assis', 'assise', 'position assise', 'voiture', 'bureau', 's asseoir', 'cinema'],
  t_squat: ['squat / accroupi', 'squat', 'accroupi', 's accroupir', 'flexion du genou'],
  t_profond: ['en bas du mouvement / amplitude profonde', 'profond', 'en bas du mouvement', 'en bas des dips', 'en bas du dip', 'en bas du squat', 'tout en bas', 'bas du mouvement', 'amplitude', 'descente'],
  t_saut: ['sauts / réceptions', 'saut', 'sauter', 'sautant', 'reception', 'pliometrie', 'jump', 'basket', 'volley'],
  t_course: ['course', 'course', 'courir', 'running', 'footing', 'jogging', 'coureur'],
  t_sprint: ['sprint / accélération', 'sprint', 'accelere', 'acceleration', 'demarrage', 'frappe', 'shoot'],
  t_escalier: ['escaliers', 'escalier', 'marches', 'monter les', 'descendre les', 'cote en courant'],
  t_nuit: ['la nuit', 'nuit', 'dormir', 'reveille', 'reveil la nuit', 'insomnie'],
  t_couche_cote: ['couché sur le côté', 'couche sur le côté', 'dormir sur le côté', 'dort sur le côté', 'allonge sur le côté', 'sur le côté la nuit'],
  t_matin: ['le matin / premiers pas', 'matin', 'premiers pas', 'au lever', 'en se levant'],
  t_torsion: ['torsion / pivot', 'torsion', 'pivot', 'changement de direction', 'appui change', 'vrille', 'tourner sur'],
  t_choc: ['choc / chute / entorse', 'choc', 'chute', 'tombe', 'entorse', 'tordu', 'tordue', 'retourne', 'contact', 'plaquage', 'traumatisme'],
  t_lancer: ['lancer / armer le bras', 'lancer', 'lanceur', 'armer', 'service au tennis', 'smash'],
  t_tousser: ['toux / éternuement', 'tousse', 'eternue', 'toux'],
  t_respirer: ['respiration profonde', 'respire', 'respiration', 'inspire', 'inspiration'],
  t_grimpe: ['escalade / prise arquée', 'grimpe', 'escalade', 'arque', 'crimp', 'bloc', 'reglette'],
  t_clavier: ['écrans / souris / téléphone', 'ordinateur', 'souris', 'clavier', 'ecran', 'sms', 'ecrire'],
  t_bebe: ['porter un bébé', 'bebe', 'enfant dans les bras'],
  t_marche: ['marche', 'marche', 'marcher', 'debout longtemps'],
  t_regard: ['tourner la tête', 'tourner la tete', 'regarder par dessus', 'regarder en l air'],
  // ---- type de douleur ----
  p_decharge: ['décharge / fourmillements', 'coup de jus', 'decharge', 'electrique', 'electricite', 'fourmill', 'picote', 'picotement', 'engourd', 'aiguille', 'jus'],
  p_pincement: ['pincement / blocage', 'pincement', 'qui pince', 'ca pince', 'ça pince', 'coince', 'bloque', 'blocage', 'accroche'],
  p_claquement: ['claquement / ressaut', 'claque', 'clac', 'craque', 'ressaut', 'saute', 'crac'],
  p_gonfle: ['gonflement', 'gonfle', 'gonflement', 'epanchement', 'enfle'],
  p_raideur: ['raideur', 'raide', 'raideur', 'rouille', 'gele', 'gelee', 'n arrive plus a bouger', 'plus d amplitude'],
  p_instable: ['instabilité / dérobement', 'instable', 'deboite', 'se deboite', 'epaule part', 'genou part', 'ca part', 'lache', 'derobe', 'pas confiance'],
  p_irradie: ['douleur qui descend', 'descend dans la jambe', 'descend dans la fesse', 'irradie', 'sciatique', 'jusqu au pied', 'jusqu au mollet', 'derriere la jambe'],
  p_faiblesse: ['perte de force', 'perte de force', 'plus de force', 'faiblesse', 'n arrive plus a', 'lache les objets'],
  p_brutal: ['douleur brutale / coup de fouet', 'brutal', 'coup de fouet', 'd un coup', 'soudain', 'claquage', 'pete', 'sensation de coup'],
  p_diffus: ['douleur diffuse', 'diffus', 'tout le long', 'le long du'],
};

// Profils des protocoles : concept -> poids (zone ≈ 3-4, localisation 2-3, déclencheurs 1-4, type 1-4)
window.PROFILS = {
  coiffe: { z_epaule: 4, t_lever: 3, t_arc: 4, t_overhead: 2, l_dehors: 1, t_nuit: 2, t_couche_cote: 2, t_pousser: 1, p_pincement: 1, t_lancer: 1 },
  instabilite: { z_epaule: 4, p_instable: 4, t_lancer: 2, t_choc: 2, t_overhead: 1 },
  dyskinesie: { z_omoplate: 4, z_epaule: 2, p_claquement: 1, t_pousser: 1, t_lever: 1, l_arriere: 1 },
  capsulite: { z_epaule: 4, p_raideur: 4, t_nuit: 2, t_lever: 1, t_rotation_main: 1 },
  'long-biceps': { z_epaule: 3, l_avant: 3, t_dips: 3, t_pousser: 2, t_profond: 2, z_biceps: 1, p_claquement: 1 },
  'acromio-claviculaire': { z_clavicule: 4, z_epaule: 2, l_dessus: 3, t_dips: 2, t_pousser: 2, t_overhead: 1, t_choc: 1 },
  sternum: { z_thorax: 4, t_dips: 2, t_respirer: 2, t_pousser: 1, t_profond: 1 },
  epicondylite: { z_coude: 3, l_dehors: 3, t_serrer: 2, z_avantbras: 1, t_clavier: 1, t_tirer: 1, t_rotation_main: 1 },
  epitrochleite: { z_coude: 3, l_dedans: 3, t_tirer: 2, t_grimpe: 2, t_serrer: 1, t_lancer: 1, z_avantbras: 1 },
  'biceps-distal': { z_coude: 3, l_pli: 3, l_avant: 2, t_supination: 3, t_tirer: 2, z_biceps: 2 },
  triceps: { z_coude: 3, l_arriere: 3, t_verrouiller: 3, t_dips: 2, t_pousser: 1, z_triceps: 2 },
  'nerf-ulnaire': { z_coude: 3, p_decharge: 4, l_petitdoigt: 2, z_doigt: 1, t_flexion_coude: 2, l_arriere: 1, l_dedans: 1, t_dips: 1, t_profond: 1 },
  'poignet-cubital': { z_poignet: 4, l_petitdoigt: 4, t_appui_main: 2, t_rotation_main: 2, p_claquement: 1 },
  'poignet-dorsal': { z_poignet: 4, l_dessus: 2, t_appui_main: 3, p_pincement: 2 },
  dequervain: { z_poignet: 3, z_pouce: 3, l_cotepouce: 3, t_pincer: 2, t_bebe: 2, t_rotation_main: 1, t_serrer: 1 },
  carpien: { z_main: 2, z_poignet: 2, z_doigt: 1, p_decharge: 3, t_nuit: 3, t_clavier: 1 },
  poulies: { z_doigt: 4, t_grimpe: 4, p_claquement: 2, t_serrer: 1 },
  'pouce-skieur': { z_pouce: 4, t_choc: 3, l_base: 1, p_instable: 2, t_pincer: 1 },
  rhizarthrose: { z_pouce: 4, l_base: 3, t_pincer: 2, t_rotation_main: 2 },
  cervicalgie: { z_cou: 4, z_trapeze: 2, t_clavier: 2, t_regard: 2, p_raideur: 1, t_assis: 1 },
  lombalgie: { z_lombaire: 4, t_soulever: 2, t_sepencher: 2, t_assis: 1, p_raideur: 1, t_matin: 1 },
  sciatique: { z_lombaire: 2, z_fesse: 2, p_irradie: 4, p_decharge: 2, t_assis: 2, t_tousser: 2, t_sepencher: 1 },
  'sacro-iliaque': { z_bassin: 4, z_lombaire: 1, z_fesse: 1, t_escalier: 1, t_marche: 1, t_matin: 1 },
  'fessier-lateral': { z_hanche: 3, l_dehors: 3, t_couche_cote: 3, t_escalier: 2, t_course: 1, t_marche: 1 },
  cfa: { z_aine: 3, z_hanche: 2, l_avant: 1, t_squat: 2, t_profond: 2, t_assis: 2, p_pincement: 2 },
  pubalgie: { z_aine: 4, t_sprint: 2, t_torsion: 2, t_course: 1, t_tousser: 1 },
  ischios: { z_cuisse_ar: 4, t_sprint: 3, p_brutal: 3, t_course: 1 },
  'ischios-proximal': { z_ischion: 4, z_fesse: 2, z_cuisse_ar: 1, t_assis: 3, t_soulever: 1, t_sprint: 1, t_course: 1 },
  bandelette: { z_cuisse_ext: 3, z_genou: 2, l_dehors: 2, t_course: 3, t_escalier: 1 },
  femoropatellaire: { z_genou: 3, z_rotule: 3, l_avant: 2, t_escalier: 2, t_squat: 2, t_assis: 2 },
  rotulien: { z_genou: 3, z_rotule: 2, l_sous: 3, t_saut: 3, t_squat: 1 },
  lca: { z_genou: 3, t_torsion: 3, t_choc: 2, p_instable: 3, p_claquement: 2, p_gonfle: 2 },
  lli: { z_genou: 3, l_dedans: 3, t_choc: 2, t_torsion: 1 },
  menisque: { z_genou: 3, p_gonfle: 2, p_pincement: 2, t_squat: 2, t_profond: 2, t_torsion: 2, l_dedans: 1, l_dehors: 1 },
  periostite: { z_tibia: 4, t_course: 3, t_saut: 2, l_dedans: 2, p_diffus: 2 },
  mollet: { z_mollet: 4, p_brutal: 4, t_sprint: 2, t_saut: 1 },
  achille: { z_achille: 4, t_course: 2, t_saut: 2, t_matin: 2, z_talon: 1 },
  cheville: { z_cheville: 4, t_choc: 3, p_instable: 2, l_dehors: 2, p_gonfle: 1 },
  fasciite: { z_talon: 4, t_matin: 4, l_sous: 2, t_marche: 1, t_course: 1 },
};

// Signes d'alerte : si l'une des expressions apparaît -> message en tête des résultats
window.ALERTES_SYMPTOMES = [
  { mots: ['urin', 'incontinen', 'selle', 'entre les cuisses', 'perinee', 'organes genitaux'], msg: 'Troubles urinaires ou insensibilité entre les cuisses : URGENCE médicale (syndrome de la queue de cheval).' },
  { mots: ['essouffl', 'sueur', 'bras gauche', 'machoire', 'oppression', 'serre la poitrine'], msg: 'Douleur thoracique avec essoufflement, sueurs ou douleur vers le bras / la mâchoire : appeler le 15.' },
  { mots: ['fievre', 'rouge et chaud', 'chaud et rouge'], msg: 'Fièvre ou zone rouge et chaude : infection possible, avis médical rapide.' },
  { mots: ['perte de force', 'plus de force', 'faiblesse', 'paralys', 'lache les objets'], msg: 'Perte de force : avis médical (atteinte nerveuse ou rupture possible).' },
  { mots: ['deform', 'craquement et', 'impossible de poser', 'impossible d appuyer', 'ne peut plus marcher', 'os qui depasse'], msg: 'Déformation ou appui impossible après un choc : fracture ou luxation possible, imagerie.' },
  { mots: ['nuit et jour', 'meme au repos', 'au repos tout le temps', 'amaigr', 'perte de poids'], msg: 'Douleur permanente au repos et la nuit, ou perte de poids : avis médical.' },
  { mots: ['mollet dur', 'mollet gonfle', 'mollet chaud'], msg: 'Mollet dur, gonflé et chaud : écarter une phlébite (avis médical).' },
];

(function () {
  const sansAccent = (s) => (s || '').toLowerCase()
    .replace(/c[oô]tés?/g, 'cotx').replace(/avant[- ]bras/g, 'avantbras')
    .replace(/dos (du|des) poignets?|dos (de la|des) mains?/g, 'dosmain').replace(/haut du dos/g, 'hautdudos')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, ' ').replace(/[^a-z0-9°-]+/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  // distance d'édition ≤ 1 (fautes de frappe simples)
  const proche = (a, b) => {
    if (a === b) return true; if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, d = 0;
    while (i < a.length && j < b.length) { if (a[i] === b[j]) { i++; j++; continue; } if (++d > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; } }
    return d + (a.length - i) + (b.length - j) <= 1;
  };
  // « côté » tapé sans accent (« cote du pouce ») : chaque expression en « cotx » existe aussi en « cote »
  const index = Object.entries(window.CONCEPTS).map(([id, l]) => ({ id, lib: l[0], exp: l.slice(1).map(sansAccent).filter(Boolean).flatMap(e => e.includes('cotx') ? [e, e.replace(/cotx/g, 'cote')] : [e]) }));
  // mots déjà connus : jamais « corrigés » en un autre mot (poignet ≠ poignée, main ≠ matin, levant ≠ devant)
  const connus = new Set(index.flatMap(c => c.exp).flatMap(e => e.split(' ')));
  const estConnu = (m) => connus.has(m) || [...connus].some(k => k.length >= 4 && m.startsWith(k));
  function trouver(texte) {
    const t = ' ' + sansAccent(texte) + ' ', mots = t.trim().split(' ').filter(m => !estConnu(m));
    const trouves = new Set();
    for (const c of index) for (const e of c.exp) {
      // mots courts (cou, dos, main…) : mot entier (+ pluriel) seulement, sinon « cou » trouverait « coude »
      if (!e.includes(' ') && e.length <= 4) { if (new RegExp('(^| )' + e + '[sx]?( |$)').test(t)) { trouves.add(c.id); break; } continue; }
      if (t.includes(' ' + e)) { trouves.add(c.id); break; }
      // faute de frappe : expression d'un seul mot assez long, comparée au début de chaque mot
      if (!e.includes(' ') && e.length >= 5 && mots.some(m => m.length >= e.length - 1 && proche(m.slice(0, e.length), e))) { trouves.add(c.id); break; }
    }
    // angles : « vers 90° », « à 100 degrés »
    for (const m of t.matchAll(/(?:(\d{2,3})\s*(?:°|deg))|(?:(?:vers|a|environ|autour de)\s(\d{2,3})(?!\s*(?:kg|km|min|s|ans|cm|m)\b))/g)) { const a = +(m[1] || m[2]); if (a >= 60 && a <= 130) trouves.add('t_arc'); if (a > 130) trouves.add('t_overhead'); }
    // « devant » seul au milieu d'une phrase sur le genou / l'épaule : déjà géré par les poids
    return trouves;
  }
  window.chercherSymptomes = function (texte) {
    const c = trouver(texte), ts = sansAccent(texte);
    const zonesQ = [...c].filter(x => x.startsWith('z_'));
    const res = [];
    for (const r of window.REHAB) {
      const p = window.PROFILS[r.id]; if (!p) continue;
      let s = 0; const raisons = [];
      for (const [k, w] of Object.entries(p)) if (c.has(k)) { s += w; raisons.push(window.CONCEPTS[k][0]); }
      // zone citée mais absente du profil : protocole peu probable
      if (zonesQ.length && !zonesQ.some(z => p[z])) s *= 0.25;
      if (s > 0) res.push({ r, score: s, raisons });
    }
    res.sort((a, b) => b.score - a.score);
    const max = res.length ? res[0].score : 0;
    const garde = res.filter(x => x.score >= 3 && x.score >= max * 0.45).slice(0, 5);
    const alertes = window.ALERTES_SYMPTOMES.filter(a => a.mots.some(m => ts.includes(sansAccent(m)))).map(a => a.msg);
    return { resultats: garde, max, vague: max < 6, alertes, compris: [...c].map(k => window.CONCEPTS[k][0]) };
  };
})();
