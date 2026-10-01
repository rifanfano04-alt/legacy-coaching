// Base d'exercices : raccourcis de groupes musculaires + fonction d'ajout.
// X(nom, catégorie, matériel, niveau 1-3, principaux, secondaires, stabilisateurs, conseil)
// Les muscles s'écrivent avec un raccourci ci-dessous ou une clé du modèle, séparés par des espaces.
window.GROUPES = {
  // pectoraux / épaule
  pecH: ['clavicular_part_of_pectoralis_major'], pecM: ['sternocostal_part_of_pectoralis_major'], pecB: ['abdominal_part_of_pectoralis_major'],
  pec: ['clavicular_part_of_pectoralis_major', 'sternocostal_part_of_pectoralis_major', 'abdominal_part_of_pectoralis_major'],
  pmin: ['pectoralis_minor'], dentele: ['serratus_anterior'], subclavier: ['subclavius'],
  deltA: ['clavicular_part_of_deltoid'], deltM: ['acromial_part_of_deltoid'], deltP: ['spinal_part_of_deltoid'],
  delt: ['clavicular_part_of_deltoid', 'acromial_part_of_deltoid', 'spinal_part_of_deltoid'],
  supra: ['supraspinatus'], infra: ['infraspinatus_muscle'], prond: ['teres_minor'], subscap: ['subscapularis'],
  coiffe: ['supraspinatus', 'infraspinatus_muscle', 'teres_minor', 'subscapularis'], rotExt: ['infraspinatus_muscle', 'teres_minor'],
  grond: ['teres_major'], gd: ['latissimus_dorsi'], coraco: ['coracobrachialis'],
  trapS: ['descending_part_of_trapezius'], trapM: ['transverse_part_of_trapezius'], trapI: ['ascending_part_of_trapezius'],
  trap: ['descending_part_of_trapezius', 'transverse_part_of_trapezius', 'ascending_part_of_trapezius'],
  rhombo: ['rhomboid_major', 'rhomboid_minor'], elevScap: ['levator_scapulae'],
  // bras / avant-bras
  bicL: ['long_head_of_biceps_brachii'], bicC: ['short_head_of_biceps_brachii'], biceps: ['long_head_of_biceps_brachii', 'short_head_of_biceps_brachii'],
  brachial: ['brachialis'], brachioRad: ['brachioradialis'],
  triL: ['long_head_of_triceps_brachii'], triLat: ['lateral_head_of_triceps_brachii'], triM: ['medial_head_of_triceps_brachii'],
  triceps: ['long_head_of_triceps_brachii', 'lateral_head_of_triceps_brachii', 'medial_head_of_triceps_brachii'], ancone: ['anconeus'],
  flechPoignet: ['flexor_carpi_radialis', 'humeral_head_of_flexor_carpi_ulnaris', 'ulnar_head_of_flexor_carpi_ulnaris', 'palmaris_longus'],
  flechDoigts: ['flexor_digitorum_superficialis', 'flexor_digitorum_profundus', 'flexor_pollicis_longus'],
  extPoignet: ['extensor_carpi_radialis_longus', 'extensor_carpi_radialis_brevis', 'extensor_carpi_ulnaris'],
  extDoigts: ['extensor_digitorum', 'extensor_digiti_minimi', 'extensor_indicis'],
  pronat: ['humeral_head_of_pronator_teres', 'ulnar_head_of_pronator_teres', 'pronator_quadratus'], supinat: ['supinator'],
  pouce: ['flexor_pollicis_longus', 'abductor_pollicis_brevis', 'opponens_pollicis', 'oblique_head_of_adductor_pollicis', 'transverse_head_of_adductor_pollicis', 'superficial_head_of_flexor_pollicis_brevis'],
  main: ['set_of_lumbricals_of_hand', 'set_of_dorsal_interossei_of_hand', 'set_of_palmar_interossei_of_hand'],
  // tronc
  gdroit: ['rectus_abdominis'], oblExt: ['external_oblique'], oblInt: ['internal_oblique'], obliques: ['external_oblique', 'internal_oblique'],
  transverse: ['transversus_abdominis'], abdos: ['rectus_abdominis', 'external_oblique', 'internal_oblique', 'transversus_abdominis'],
  erecteurs: ['iliocostalis_lumborum', 'iliocostalis_thoracis', 'longissimus_thoracis', 'spinalis', 'spinalis_thoracis'],
  multifides: ['multifidus_lumborum', 'multifidus_thoracis', 'rotatores'], cl: ['quadratus_lumborum'],
  diaphragme: ['diaphragm'], intercostaux: ['external_intercostal_muscle', 'internal_intercostal_muscle'],
  plancher: ['pubococcygeus', 'puborectalis', 'iliococcygeus', 'coccygeus'],
  // cou
  scm: ['sternocleidomastoid'], scalenes: ['scalenus_anterior', 'scalenus_medius', 'scalenus_posterior'],
  flechCou: ['longus_capitis', 'superior_oblique_part_of_longus_colli', 'inferior_oblique_part_of_longus_colli', 'vertical_intermediate_part_of_longus_colli', 'rectus_capitis_anterior'],
  extCou: ['splenius_capitis', 'splenius_cervicis', 'semispinalis_capitis', 'semispinalis_cervicis', 'multifidus_cervicis'],
  sousOcc: ['rectus_capitis_posterior_major', 'rectus_capitis_posterior_minor'],
  // hanche / cuisse
  psoas: ['psoas_major'], iliaque: ['iliacus'], iliopsoas: ['psoas_major', 'iliacus'],
  gfess: ['gluteus_maximus'], mfess: ['gluteus_medius'], pfess: ['gluteus_minimus'], tfl: ['tensor_fasciae_latae'],
  rotHanche: ['piriformis', 'gemellus_superior', 'gemellus_inferior', 'obturator_internus', 'obturator_externus', 'quadratus_femoris'],
  quadri: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius'], droitFem: ['rectus_femoris'],
  vastes: ['vastus_lateralis', 'vastus_medialis', 'vastus_intermedius'], vasteM: ['vastus_medialis'], vasteL: ['vastus_lateralis'],
  ischios: ['long_head_of_biceps_femoris', 'short_head_of_biceps_femoris', 'semitendinosus', 'semimembranosus'],
  bfL: ['long_head_of_biceps_femoris'], bfC: ['short_head_of_biceps_femoris'], ischioMed: ['semitendinosus', 'semimembranosus'],
  adducteurs: ['adductor_longus', 'adductor_brevis', 'adductor_magnus', 'adductor_minimus', 'gracilis', 'pectineus'],
  gadd: ['adductor_magnus'], couturier: ['sartorius'],
  // jambe / pied
  gastro: ['medial_head_of_gastrocnemius', 'lateral_head_of_gastrocnemius'], soleaire: ['soleus'],
  mollets: ['medial_head_of_gastrocnemius', 'lateral_head_of_gastrocnemius', 'soleus'],
  tibA: ['tibialis_anterior'], tibP: ['tibialis_posterior'], fibulaires: ['fibularis_longus', 'fibularis_brevis'],
  extOrteils: ['extensor_digitorum_longus', 'extensor_hallucis_longus'], flechOrteils: ['flexor_digitorum_longus', 'flexor_hallucis_longus'],
  piedIntr: ['abductor_hallucis', 'flexor_digitorum_brevis', 'flexor_accessorius', 'medial_head_of_flexor_hallucis_brevis', 'lateral_head_of_flexor_hallucis_brevis', 'abductor_digiti_minimi_of_foot'],
  poplite: ['popliteus'],
};
window.CATEGORIES = {
  muscu: 'Musculation', force: 'Force', pdc: 'Poids du corps & street', streetlift: 'Streetlifting (lesté)', rehab: 'Réhab & prévention', mobilite: 'Mobilité & étirements',
  gainage: 'Gainage & tronc', plio: 'Pliométrie & athlétisme', halt: 'Haltérophilie', strong: 'Strongman & portés',
};
window.MATERIEL = {
  barre: 'Barre', halteres: 'Haltères', kb: 'Kettlebell', poulie: 'Poulie', machine: 'Machine', pdc: 'Poids du corps', elastique: 'Élastique',
  fixe: 'Barre fixe', anneaux: 'Anneaux', parallettes: 'Parallettes / barres', banc: 'Banc', ball: 'Swiss ball', trx: 'Sangles TRX', landmine: 'Landmine',
  sac: 'Sandbag', medball: 'Medecine ball', box: 'Box / step', sled: 'Traîneau', disque: 'Disque', ez: 'Barre EZ', trap: 'Trap bar', rouleau: 'Rouleau / balle',
};
window.EXOS = [];
window.X = (nom, cat, mat, niv, p, s, st, conseil) => {
  const id = nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  window.EXOS.push({ id, nom, cat, mat: mat ? mat.split(/\s+/) : [], niv, p: p ? p.split(/\s+/) : [], s: s ? s.split(/\s+/) : [], st: st ? st.split(/\s+/) : [], c: conseil || '' });
};
