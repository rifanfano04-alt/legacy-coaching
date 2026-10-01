// Fiches : mâchoire, visage, yeux, gorge, larynx, et structures fibreuses restantes.

// ---- Mâchoire (muscles masticateurs, nerf mandibulaire V3) ----
F('superficial_part_of_masseter', 'Bord inférieur de l’arcade zygomatique (2/3 antérieurs)', 'Angle et face latérale de la mandibule',
  'Nerf massétérique (V3)', 'MA.ferm!, MA.prop', 'Le muscle le plus puissant pour sa taille ; serrer les dents à l’effort le contracte (bruxisme).');
F('deep_part_of_masseter', 'Face interne de l’arcade zygomatique', 'Branche de la mandibule (partie haute)',
  'Nerf massétérique (V3)', 'MA.ferm!, MA.retp', 'Fermeture de la bouche.');
F('temporalis', 'Fosse temporale', 'Processus coronoïde de la mandibule',
  'Nerfs temporaux profonds (V3)', 'MA.ferm!, MA.retp!', 'Tensions et céphalées liées au serrement des dents.');
F('medial_pterygoid', 'Fosse ptérygoïde (face médiale de la lame latérale)', 'Face médiale de l’angle de la mandibule',
  'Nerf ptérygoïdien médial (V3)', 'MA.ferm!, MA.prop, MA.did', 'Fermeture et mouvements latéraux.');
F('superior_head_of_lateral_pterygoid', 'Grande aile du sphénoïde', 'Disque et capsule de l’articulation temporo-mandibulaire',
  'Nerf ptérygoïdien latéral (V3)', 'MA.stab=Stabilisation du disque articulaire!, MA.prop', 'Stabilise le disque de l’ATM.');
F('inferior_head_of_lateral_pterygoid', 'Face latérale de la lame latérale du processus ptérygoïde', 'Col du processus condylaire de la mandibule',
  'Nerf ptérygoïdien latéral (V3)', 'MA.prop!, MA.ouv, MA.did!', 'Avance la mâchoire et ouvre la bouche.');

// ---- Visage (nerf facial VII) ----
F('frontalis', 'Aponévrose épicrânienne', 'Peau des sourcils',
  'Nerf facial (VII), rameau temporal', 'VI.sourcils=Lever les sourcils!', 'Plisse le front horizontalement.');
F('corrugator_supercilii', 'Arcade sourcilière (partie médiale)', 'Peau du milieu du sourcil',
  'Nerf facial (VII)', 'VI.froncer=Froncer les sourcils!', 'Rides verticales entre les sourcils.');
F('procerus', 'Os nasal', 'Peau entre les sourcils',
  'Nerf facial (VII)', 'VI.froncer=Froncer les sourcils!', 'Rides horizontales à la racine du nez.');
F('orbital_part_of_orbicularis_oculi', 'Bord médial de l’orbite', 'Fait le tour de l’orbite',
  'Nerf facial (VII)', 'VI.yeux=Fermer fort les paupières!', 'Plisser les yeux.');
F('palpebral_part_of_orbicularis_oculi', 'Ligament palpébral médial', 'Raphé palpébral latéral',
  'Nerf facial (VII)', 'VI.cligner=Cligner des yeux!', 'Fermeture douce des paupières.');
F('nasalis', 'Maxillaire (au-dessus des incisives et canines)', 'Cartilages du nez',
  'Nerf facial (VII)', 'VI.narines=Mouvements des narines!', 'Dilate ou comprime les narines.');
F('levator_labii_superioris', 'Bord inférieur de l’orbite', 'Peau de la lèvre supérieure',
  'Nerf facial (VII)', 'VI.levre=Relever la lèvre supérieure!', 'Expression du dégoût.');
F('zygomaticus_major', 'Face latérale de l’os zygomatique', 'Commissure des lèvres',
  'Nerf facial (VII)', 'VI.sourire=Sourire!', 'Le muscle du vrai sourire (avec l’orbiculaire de l’œil).');
F('zygomaticus_minor', 'Face latérale de l’os zygomatique', 'Lèvre supérieure',
  'Nerf facial (VII)', 'VI.levre=Relever la lèvre supérieure!, VI.sourire=Sourire', 'Accentue le sillon naso-génien.');
F('risorius', 'Fascia du masséter', 'Commissure des lèvres',
  'Nerf facial (VII)', 'VI.sourire=Sourire!', 'Tire la commissure en dehors (sourire crispé).');
F('orbicularis_oris', 'Fibres circulaires autour de la bouche', 'Peau et muqueuse des lèvres',
  'Nerf facial (VII)', 'VI.bouche=Fermer et pincer les lèvres!', 'Fermeture des lèvres, souffler, siffler.');
F('depressor_anguli_oris', 'Ligne oblique de la mandibule', 'Commissure des lèvres',
  'Nerf facial (VII)', 'VI.tristesse=Abaisser les coins de la bouche!', 'Expression de la tristesse.');
F('depressor_labii_inferioris', 'Ligne oblique de la mandibule', 'Peau de la lèvre inférieure',
  'Nerf facial (VII)', 'VI.levreInf=Abaisser la lèvre inférieure!', 'Fait la moue.');
F('mentalis', 'Mandibule (sous les incisives)', 'Peau du menton',
  'Nerf facial (VII)', 'VI.menton=Plisser le menton!', 'Avance la lèvre inférieure.');

// ---- Œil (nerfs oculomoteur III, trochléaire IV, abducens VI) ----
F('levator_palpebrae_superioris', 'Petite aile du sphénoïde', 'Peau et tarse de la paupière supérieure',
  'Nerf oculomoteur (III)', 'OE.paupiere=Relever la paupière!', 'Ouvre l’œil.');
F('superior_rectus', 'Anneau tendineux commun', 'Sclère (partie supérieure)',
  'Nerf oculomoteur (III)', 'OE.haut=Regard vers le haut!', 'Élève le globe oculaire.');
F('inferior_rectus', 'Anneau tendineux commun', 'Sclère (partie inférieure)',
  'Nerf oculomoteur (III)', 'OE.bas=Regard vers le bas!', 'Abaisse le globe oculaire.');
F('medial_rectus', 'Anneau tendineux commun', 'Sclère (partie médiale)',
  'Nerf oculomoteur (III)', 'OE.dedans=Regard vers le nez!', 'Convergence des yeux.');
F('lateral_rectus', 'Anneau tendineux commun', 'Sclère (partie latérale)',
  'Nerf abducens (VI)', 'OE.dehors=Regard vers l’extérieur!', 'Abduction du globe oculaire.');
F('superior_oblique', 'Corps du sphénoïde', 'Sclère (partie postéro-supérieure), après la trochlée',
  'Nerf trochléaire (IV)', 'OE.bas=Regard vers le bas!, OE.rotIn=Rotation interne de l’œil!', 'Regarder en bas et en dedans (descendre un escalier).');
F('inferior_oblique', 'Plancher de l’orbite (maxillaire)', 'Sclère (partie postéro-latérale)',
  'Nerf oculomoteur (III)', 'OE.haut=Regard vers le haut!, OE.rotEx=Rotation externe de l’œil!', 'Regarder en haut et en dedans.');

// ---- Gorge et larynx ----
F('levator_veli_palatini', 'Partie pétreuse du temporal, trompe auditive', 'Aponévrose palatine',
  'Nerf vague (X)', 'LA.voile=Élévation du voile du palais!', 'Ferme l’arrière du nez en avalant.');
F('tensor_veli_palatini', 'Fosse scaphoïde du sphénoïde, trompe auditive', 'Aponévrose palatine',
  'Nerf mandibulaire (V3)', 'LA.voile=Élévation du voile du palais, LA.trompe=Ouverture de la trompe auditive!', 'Équilibre la pression des oreilles (bâiller, avaler).');
F('lateral_crico_arytenoid', 'Arc du cartilage cricoïde', 'Processus musculaire de l’aryténoïde',
  'Nerf laryngé récurrent (X)', 'LA.ferm=Fermeture des cordes vocales!', 'Rapproche les cordes vocales.');
F('posterior_crico_arytenoid', 'Face postérieure du cricoïde', 'Processus musculaire de l’aryténoïde',
  'Nerf laryngé récurrent (X)', 'LA.ouvr=Ouverture des cordes vocales!', 'Seul muscle qui ouvre la glotte (respiration).');
F('oblique_arytenoid', 'Processus musculaire d’un aryténoïde', 'Sommet de l’aryténoïde opposé',
  'Nerf laryngé récurrent (X)', 'LA.ferm=Fermeture des cordes vocales!', 'Ferme l’entrée du larynx.');
F('transverse_arytenoid', 'Bord d’un aryténoïde', 'Bord de l’aryténoïde opposé',
  'Nerf laryngé récurrent (X)', 'LA.ferm=Fermeture des cordes vocales!', 'Rapproche les aryténoïdes.');
F('thyro_arytenoid', 'Face interne du cartilage thyroïde', 'Aryténoïde',
  'Nerf laryngé récurrent (X)', 'LA.ferm=Fermeture des cordes vocales!, LA.tension=Réglage de la tension des cordes vocales', 'Forme la corde vocale (muscle vocal).');
F('oblique_part_of_cricothyroid', 'Arc du cricoïde', 'Corne inférieure du cartilage thyroïde',
  'Nerf laryngé supérieur, branche externe (X)', 'LA.tension=Réglage de la tension des cordes vocales!', 'Rend la voix plus aiguë.');
F('straight_part_of_cricothyroid', 'Arc du cricoïde', 'Bord inférieur du cartilage thyroïde',
  'Nerf laryngé supérieur, branche externe (X)', 'LA.tension=Réglage de la tension des cordes vocales!', 'Rend la voix plus aiguë.');
T('arytenoid_cartilage', 'Petit cartilage pyramidal du larynx, en arrière', 'Posé sur le cartilage cricoïde',
  'Sert d’attache aux cordes vocales et aux muscles qui les ouvrent ou les ferment.');
T('median_cricothyroid_ligament', 'Membrane entre cartilages cricoïde et thyroïde', 'Du cricoïde au thyroïde',
  'Point de ponction d’urgence (coniotomie) des voies aériennes.');
T('intermediate_tendon', 'Tendon qui relie les deux ventres du digastrique', 'Fixé à l’os hyoïde par une boucle fibreuse', '');
T('tendon_of_levator_palpebrae_superioris', 'Aponévrose du releveur de la paupière', 'Tarse et peau de la paupière supérieure', '');

// ---- Membre supérieur : structures fibreuses ----
T('flexor_retinaculum_of_wrist', 'Ligament annulaire antérieur du carpe : toit du canal carpien', 'Du scaphoïde et trapèze au pisiforme et hamatum',
  'Le nerf médian et les tendons fléchisseurs passent dessous : canal carpien.');
T('interosseous_membrane_of_forearm', 'Membrane fibreuse entre radius et ulna', 'Bords interosseux du radius et de l’ulna',
  'Transmet les forces de la main vers le coude ; sert d’origine aux muscles profonds de l’avant-bras.');
