// Fiches : épaule, ceinture scapulaire, bras, avant-bras, main.
// Sources : anatomie descriptive classique (Kamina, Gray's Anatomy), Kendall (muscles, tests et fonctions).

// ---- Deltoïde ----
F('clavicular_part_of_deltoid', 'Tiers latéral du bord antérieur de la clavicule', 'Tubérosité deltoïdienne de l’humérus',
  'Nerf axillaire (C5-C6)', 'EP.flex!, EP.ri, EP.hadd, EP.abd',
  'Moteur du développé militaire et des élévations frontales ; très sollicité au développé couché incliné. Souvent sur-développé par rapport au postérieur.');
F('acromial_part_of_deltoid', 'Bord latéral de l’acromion', 'Tubérosité deltoïdienne de l’humérus',
  'Nerf axillaire (C5-C6)', 'EP.abd!',
  'Principal abducteur de 15 à 90°, avec le supra-épineux qui initie le mouvement. Donne la largeur d’épaule (élévations latérales).');
F('spinal_part_of_deltoid', 'Bord inférieur de l’épine de la scapula', 'Tubérosité deltoïdienne de l’humérus',
  'Nerf axillaire (C5-C6)', 'EP.habd!, EP.ext, EP.re',
  'Souvent faible : à travailler en face pull, oiseau, rowing coudes écartés. Important pour l’équilibre de l’épaule et la posture.');

// ---- Coiffe des rotateurs ----
F('supraspinatus', 'Fosse supra-épineuse de la scapula', 'Facette supérieure du tubercule majeur de l’humérus',
  'Nerf supra-scapulaire (C5-C6)', 'EP.abd!, EP.coapt!, EP.re',
  'Initie l’abduction et plaque la tête humérale dans la glène. Tendon le plus souvent lésé (conflit sous-acromial) : full can, élévation dans le plan de la scapula.');
F('infraspinatus_muscle', 'Fosse infra-épineuse de la scapula', 'Facette moyenne du tubercule majeur de l’humérus',
  'Nerf supra-scapulaire (C5-C6)', 'EP.re!, EP.coapt!, EP.habd',
  'Principal rotateur externe. Clé de la santé d’épaule des pousseurs : rotations externes à l’élastique, couché sur le côté, face pull.');
F('teres_minor', 'Bord latéral de la scapula (2/3 supérieurs)', 'Facette inférieure du tubercule majeur de l’humérus',
  'Nerf axillaire (C5-C6)', 'EP.re!, EP.coapt, EP.add',
  'Associé à l’infra-épineux ; travaillé en rotation externe bras le long du corps ou à 90° d’abduction.');
F('subscapularis', 'Fosse subscapulaire (face antérieure de la scapula)', 'Tubercule mineur de l’humérus',
  'Nerfs subscapulaires supérieur et inférieur (C5-C7)', 'EP.ri!, EP.coapt!, EP.add',
  'Rempart antérieur de l’épaule (anti-luxation). Rotation interne à l’élastique, belly press, pompes en protraction.');

F('teres_major', 'Angle inférieur de la scapula (face postérieure)', 'Crête du tubercule mineur de l’humérus',
  'Nerf subscapulaire inférieur (C5-C7)', 'EP.ext!, EP.add!, EP.ri',
  '« Petit frère du grand dorsal » : tractions, rowing, pull-over. Donne l’épaisseur sous l’aisselle.');
F('coracobrachialis', 'Processus coracoïde de la scapula', 'Face médiale de l’humérus (tiers moyen)',
  'Nerf musculo-cutané (C5-C7)', 'EP.flex, EP.add, EP.hadd!',
  'Petit fléchisseur-adducteur ; travaille avec le pectoral au développé et aux écartés.');

// ---- Pectoraux ----
F('clavicular_part_of_pectoralis_major', 'Moitié médiale de la clavicule', 'Lèvre latérale du sillon intertuberculaire de l’humérus',
  'Nerf pectoral latéral (C5-C7)', 'EP.flex!, EP.hadd!, EP.ri',
  'Faisceau « haut des pecs » : développé incliné, écartés inclinés, pompes pieds surélevés.');
F('sternocostal_part_of_pectoralis_major', 'Face antérieure du sternum et cartilages des côtes 1 à 6', 'Lèvre latérale du sillon intertuberculaire de l’humérus',
  'Nerfs pectoraux latéral et médial (C6-T1)', 'EP.hadd!, EP.add!, EP.ri, EP.ext',
  'Masse principale du pectoral : développé couché, dips, pompes, écartés.');
F('abdominal_part_of_pectoralis_major', 'Gaine du muscle droit de l’abdomen', 'Lèvre latérale du sillon intertuberculaire (fibres les plus hautes)',
  'Nerf pectoral médial (C8-T1)', 'EP.add!, EP.ext, EP.hadd',
  'Bas des pectoraux : dips, développé décliné, écartés vers le bas.');
F('pectoralis_minor', 'Côtes 3 à 5 (face externe)', 'Processus coracoïde de la scapula',
  'Nerf pectoral médial (C8-T1)', 'SC.abs!, SC.prot, SC.rinf, CT.insp',
  'Souvent raide chez les pousseurs : tire l’épaule en avant (épaule enroulée). À étirer, et à compenser par le trapèze inférieur et le dentelé.');
F('subclavius', 'Première côte (jonction os-cartilage)', 'Face inférieure de la clavicule',
  'Nerf du subclavier (C5-C6)', 'CL.abs!, CL.stab!',
  'Stabilise l’articulation sterno-claviculaire.');
F('serratus_anterior', 'Faces externes des côtes 1 à 8 ou 9', 'Bord médial de la scapula (face antérieure)',
  'Nerf thoracique long (C5-C7)', 'SC.prot!, SC.rsup!, SC.plaq!, SC.bpost!, CT.insp',
  'Indispensable pour lever le bras au-dessus de la tête sans conflit. Sa faiblesse donne la scapula ailée : pompes plus, wall slides, push-up plus.');

// ---- Trapèze, rhomboïdes, élévateur ----
F('descending_part_of_trapezius', 'Os occipital, ligament nucal', 'Tiers latéral de la clavicule',
  'Nerf accessoire (XI) et C3-C4', 'SC.elev!, SC.rsup!, CE.ext, CE.incl, CE.rotc',
  'Shrugs, tirages menton. Souvent hyperactif chez les gens stressés ou qui compensent un dentelé faible.');
F('transverse_part_of_trapezius', 'Processus épineux C7 à T3', 'Bord médial de l’acromion et épine de la scapula',
  'Nerf accessoire (XI) et C3-C4', 'SC.retr!, SC.stab!',
  'Rapproche les omoplates : rowing coudes ouverts, oiseau, face pull.');
F('ascending_part_of_trapezius', 'Processus épineux T4 à T12', 'Tubercule de l’épine de la scapula',
  'Nerf accessoire (XI) et C3-C4', 'SC.abs!, SC.rsup!, SC.retr, SC.bpost!',
  'Souvent faible : Y-raise, prone Y, tractions scapulaires. Clé de la santé d’épaule au-dessus de la tête.');
F('rhomboid_major', 'Processus épineux T2 à T5', 'Bord médial de la scapula (sous l’épine)',
  'Nerf dorsal de la scapula (C4-C5)', 'SC.retr!, SC.elev, SC.rinf!',
  'Rowing, tirages, rétractions scapulaires. Tient l’omoplate plaquée.');
F('rhomboid_minor', 'Ligament nucal, processus épineux C7 et T1', 'Bord médial de la scapula (racine de l’épine)',
  'Nerf dorsal de la scapula (C4-C5)', 'SC.retr!, SC.elev, SC.rinf!', 'Même rôle que le grand rhomboïde.');
F('levator_scapulae', 'Processus transverses C1 à C4', 'Angle supérieur de la scapula',
  'Nerf dorsal de la scapula (C5) et C3-C4', 'SC.elev!, SC.rinf!, CE.incl, CE.roth',
  'Point douloureux fréquent (« nœud » en haut de l’omoplate) : à étirer, souvent sur-sollicité.');
F('latissimus_dorsi', 'Processus épineux T7 à L5, fascia thoraco-lombaire, crête iliaque, côtes 9 à 12, angle inférieur de la scapula', 'Fond du sillon intertuberculaire de l’humérus',
  'Nerf thoraco-dorsal (C6-C8)', 'EP.ext!, EP.add!, EP.ri, SC.abs, TR.ext, CT.exp',
  'Le muscle des tractions, du muscle up et du rowing. Sa raideur limite l’élévation complète du bras (overhead squat, handstand).');

// ---- Bras ----
F('long_head_of_biceps_brachii', 'Tubercule supra-glénoïdal de la scapula', 'Tubérosité radiale et aponévrose bicipitale',
  'Nerf musculo-cutané (C5-C6)', 'CO.flex!, AB.sup!, EP.flex, EP.abd',
  'Son tendon passe dans le sillon de l’humérus : tendinopathies fréquentes chez les grimpeurs et street lifters. Curl, chin-up, curl incliné (étiré).');
F('short_head_of_biceps_brachii', 'Processus coracoïde de la scapula', 'Tubérosité radiale',
  'Nerf musculo-cutané (C5-C6)', 'CO.flex!, AB.sup!, EP.flex, EP.hadd',
  'Curl, chin-up, curl pupitre (le chef court travaille bien bras devant le corps).');
F('brachialis', 'Moitié distale de la face antérieure de l’humérus', 'Processus coronoïde et tubérosité de l’ulna',
  'Nerf musculo-cutané (C5-C6) et nerf radial', 'CO.flex!',
  'Fléchisseur pur du coude, quelle que soit la position de la main : curl marteau, curl prise pronation, tractions. Donne l’épaisseur du bras.');
F('long_head_of_triceps_brachii', 'Tubercule infra-glénoïdal de la scapula', 'Olécrâne de l’ulna',
  'Nerf radial (C6-C8)', 'CO.ext!, EP.ext, EP.add',
  'Le seul chef qui croise l’épaule : travaillé étiré bras au-dessus de la tête (extension nuque, overhead). Gros volume du triceps.');
F('lateral_head_of_triceps_brachii', 'Face postérieure de l’humérus (au-dessus du sillon radial)', 'Olécrâne de l’ulna',
  'Nerf radial (C6-C8)', 'CO.ext!', 'Le « fer à cheval » visible : dips, pushdown, développé prise serrée.');
F('medial_head_of_triceps_brachii', 'Face postérieure de l’humérus (sous le sillon radial)', 'Olécrâne de l’ulna',
  'Nerf radial (C6-C8)', 'CO.ext!', 'Travaille à toutes les extensions, surtout en fin de mouvement (verrouillage).');
F('anconeus', 'Épicondyle latéral de l’humérus', 'Face latérale de l’olécrâne',
  'Nerf radial (C7-C8)', 'CO.ext, CO.stab!', 'Stabilise le coude en extension et en pronation.');

// ---- Avant-bras : loge antérieure ----
F('humeral_head_of_pronator_teres', 'Épicondyle médial de l’humérus (épitrochlée)', 'Face latérale du radius (tiers moyen)',
  'Nerf médian (C6-C7)', 'AB.pron!, CO.flex', 'Pronation contre résistance ; impliqué dans le « coude du golfeur ».');
F('ulnar_head_of_pronator_teres', 'Processus coronoïde de l’ulna', 'Face latérale du radius (tiers moyen)',
  'Nerf médian (C6-C7)', 'AB.pron!', 'Le nerf médian passe entre ses deux chefs (syndrome du rond pronateur).');
F('flexor_carpi_radialis', 'Épicondyle médial de l’humérus', 'Base des 2e et 3e métacarpiens',
  'Nerf médian (C6-C7)', 'PO.flex!, PO.abd, AB.pron', 'Curl poignet, prise en pronation ; sollicité en grimpe et en street.');
F('palmaris_longus', 'Épicondyle médial de l’humérus', 'Aponévrose palmaire',
  'Nerf médian (C7-C8)', 'PO.flex!', 'Absent chez environ 15 % des gens. Tend l’aponévrose palmaire.');
F('humeral_head_of_flexor_carpi_ulnaris', 'Épicondyle médial de l’humérus', 'Pisiforme, hamatum, base du 5e métacarpien',
  'Nerf ulnaire (C7-T1)', 'PO.flex!, PO.add!', 'Fort fléchisseur du poignet côté ulnaire : grip, suspensions, curl poignet.');
F('ulnar_head_of_flexor_carpi_ulnaris', 'Olécrâne et bord postérieur de l’ulna', 'Pisiforme, hamatum, base du 5e métacarpien',
  'Nerf ulnaire (C7-T1)', 'PO.flex!, PO.add!', 'Le nerf ulnaire passe sous son arcade (tunnel cubital).');
F('flexor_digitorum_superficialis', 'Épicondyle médial, processus coronoïde de l’ulna, radius', 'Phalanges moyennes des doigts 2 à 5',
  'Nerf médian (C7-T1)', 'DG.flex!, PO.flex', 'Grip, crochetage : suspensions, farmer walk, travail de grip.');
F('flexor_digitorum_profundus', 'Faces antérieure et médiale de l’ulna, membrane interosseuse', 'Phalanges distales des doigts 2 à 5',
  'Nerf médian (index, majeur) et nerf ulnaire (annulaire, auriculaire) (C8-T1)', 'DG.flex!, PO.flex',
  'Seul fléchisseur de la dernière phalange : crimp en escalade, prise à deux doigts. Poulies fragiles.');
F('flexor_pollicis_longus', 'Face antérieure du radius, membrane interosseuse', 'Phalange distale du pouce',
  'Nerf interosseux antérieur, branche du médian (C8-T1)', 'PC.flex!, PO.flex', 'Pince et prise pouce : pinch grip.');
F('pronator_quadratus', 'Quart distal de la face antérieure de l’ulna', 'Quart distal de la face antérieure du radius',
  'Nerf interosseux antérieur (C8-T1)', 'AB.pron!, AB.stab!', 'Principal pronateur, tient ensemble radius et ulna au poignet.');

// ---- Avant-bras : loge latérale et postérieure ----
F('brachioradialis', 'Bord latéral de l’humérus (au-dessus de l’épicondyle)', 'Processus styloïde du radius',
  'Nerf radial (C5-C6)', 'CO.flex!',
  'Fléchisseur du coude surtout en prise neutre : curl marteau, tractions prise neutre, curl inversé.');
F('extensor_carpi_radialis_longus', 'Bord latéral de l’humérus, épicondyle latéral', 'Base du 2e métacarpien (face dorsale)',
  'Nerf radial (C6-C7)', 'PO.ext!, PO.abd!, CO.flex', 'Extension du poignet : stabilise la prise lors des tirages.');
F('extensor_carpi_radialis_brevis', 'Épicondyle latéral de l’humérus', 'Base du 3e métacarpien (face dorsale)',
  'Branche profonde du nerf radial (C7-C8)', 'PO.ext!, PO.abd',
  'Muscle en cause dans l’épicondylite (« tennis elbow ») : excentrique du poignet (Tyler twist), renforcement progressif.');
F('extensor_digitorum', 'Épicondyle latéral de l’humérus', 'Phalanges moyennes et distales des doigts 2 à 5 (dossière)',
  'Nerf interosseux postérieur (C7-C8)', 'DG.ext!, PO.ext', 'Ouvre la main : extension des doigts à l’élastique pour équilibrer le grip.');
F('extensor_digiti_minimi', 'Épicondyle latéral de l’humérus', 'Dossière de l’auriculaire',
  'Nerf interosseux postérieur (C7-C8)', 'DG.ext!', 'Extension du 5e doigt.');
F('extensor_carpi_ulnaris', 'Épicondyle latéral de l’humérus et bord postérieur de l’ulna', 'Base du 5e métacarpien',
  'Nerf interosseux postérieur (C7-C8)', 'PO.ext!, PO.add!', 'Stabilise le poignet côté ulnaire.');
F('supinator', 'Épicondyle latéral, ligament annulaire, crête du supinateur de l’ulna', 'Tiers proximal du radius',
  'Nerf interosseux postérieur (C5-C6)', 'AB.sup!', 'Supination lente sans effort ; le biceps prend le relais en force.');
F('abductor_pollicis_longus', 'Faces postérieures de l’ulna et du radius, membrane interosseuse', 'Base du 1er métacarpien',
  'Nerf interosseux postérieur (C7-C8)', 'PC.abd!, PC.ext, PO.abd', 'Tendinite de De Quervain (avec le court extenseur du pouce).');
F('extensor_pollicis_brevis', 'Face postérieure du radius, membrane interosseuse', 'Phalange proximale du pouce',
  'Nerf interosseux postérieur (C7-C8)', 'PC.ext!, PC.abd', 'Délimite la tabatière anatomique.');
F('extensor_pollicis_longus', 'Face postérieure de l’ulna, membrane interosseuse', 'Phalange distale du pouce',
  'Nerf interosseux postérieur (C7-C8)', 'PC.ext!', 'Extension complète du pouce.');
F('extensor_indicis', 'Face postérieure de l’ulna (quart distal)', 'Dossière de l’index',
  'Nerf interosseux postérieur (C7-C8)', 'DG.ext!', 'Permet de tendre l’index seul.');

// ---- Main ----
F('abductor_pollicis_brevis', 'Rétinaculum des fléchisseurs, scaphoïde, trapèze', 'Base de la phalange proximale du pouce',
  'Nerf médian (C8-T1)', 'PC.abd!, PC.opp', 'Éminence thénar : touché en premier dans le syndrome du canal carpien.');
F('superficial_head_of_flexor_pollicis_brevis', 'Rétinaculum des fléchisseurs, trapèze', 'Base de la phalange proximale du pouce',
  'Nerf médian (C8-T1)', 'PC.flex!, PC.opp', 'Pince pouce-index.');
F('flexor_pollicis_brevis', 'Trapézoïde, capitatum', 'Base de la phalange proximale du pouce',
  'Nerf ulnaire (C8-T1)', 'PC.flex!', 'Chef profond du court fléchisseur.');
F('opponens_pollicis', 'Rétinaculum des fléchisseurs, trapèze', 'Bord latéral du 1er métacarpien',
  'Nerf médian (C8-T1)', 'PC.opp!', 'Permet d’opposer le pouce aux autres doigts : toutes les prises fines.');
F('oblique_head_of_adductor_pollicis', 'Capitatum, bases des 2e et 3e métacarpiens', 'Base de la phalange proximale du pouce (côté ulnaire)',
  'Nerf ulnaire (C8-T1)', 'PC.add!', 'Serre le pouce contre la main : pinch grip, plate pinch.');
F('transverse_head_of_adductor_pollicis', 'Diaphyse du 3e métacarpien', 'Base de la phalange proximale du pouce (côté ulnaire)',
  'Nerf ulnaire (C8-T1)', 'PC.add!', 'Idem chef oblique.');
F('abductor_digiti_minimi_of_hand', 'Pisiforme', 'Base de la phalange proximale de l’auriculaire',
  'Nerf ulnaire (C8-T1)', 'DG.abd!', 'Éminence hypothénar.');
F('flexor_digiti_minimi_brevis_of_hand', 'Hamulus de l’hamatum', 'Base de la phalange proximale de l’auriculaire',
  'Nerf ulnaire (C8-T1)', 'DG.flex!', 'Éminence hypothénar.');
F('opponens_digiti_minimi_of_hand', 'Hamulus de l’hamatum', 'Bord médial du 5e métacarpien',
  'Nerf ulnaire (C8-T1)', 'DG.opp=Opposition du 5e doigt!', 'Creuse la paume (prise en coupe).');
F('set_of_lumbricals_of_hand', 'Tendons du fléchisseur profond des doigts', 'Dossières des doigts 2 à 5',
  'Nerf médian (lombricaux 1-2) et nerf ulnaire (3-4) (C8-T1)', 'DG.flex!, DG.ext', 'Fléchissent la base des doigts en étendant les phalanges : position « bec de canard ».');
F('set_of_dorsal_interossei_of_hand', 'Faces adjacentes des métacarpiens', 'Bases des phalanges proximales et dossières des doigts 2 à 4',
  'Nerf ulnaire (C8-T1)', 'DG.abd!, DG.flex', 'Écartent les doigts.');
F('set_of_palmar_interossei_of_hand', 'Métacarpiens 2, 4 et 5', 'Bases des phalanges proximales et dossières',
  'Nerf ulnaire (C8-T1)', 'DG.add!, DG.flex', 'Rapprochent les doigts.');
