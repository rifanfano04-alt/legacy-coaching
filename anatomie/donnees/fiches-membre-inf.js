// Fiches : hanche, cuisse, jambe, pied.

// ---- Fléchisseurs de hanche ----
F('psoas_major', 'Corps et processus transverses T12 à L5, disques intervertébraux', 'Petit trochanter du fémur (avec l’iliaque)',
  'Rameaux ventraux L1-L3', 'HA.flex!, BA.ant!, TR.flex, TR.stab, HA.re',
  'Fléchisseur de hanche puissant ; raccourci par la position assise, il tire les lombaires en avant. Relevés de genoux, étirement en fente.');
F('iliacus', 'Fosse iliaque', 'Petit trochanter du fémur (avec le psoas)',
  'Nerf fémoral (L2-L3)', 'HA.flex!, BA.ant!', 'Forme l’ilio-psoas avec le grand psoas : sprint, relevé de jambes, L-sit.');

// ---- Fessiers ----
F('gluteus_maximus', 'Face postérieure de l’ilium, sacrum, coccyx, fascia thoraco-lombaire', 'Tubérosité glutéale du fémur, bandelette ilio-tibiale',
  'Nerf glutéal inférieur (L5-S2)', 'HA.ext!, HA.re!, BA.retro!, HA.abd, HA.add',
  'Le plus gros muscle du corps : hip thrust, squat profond, soulevé de terre, fentes, sprint. Clé de la protection du genou et du dos.');
F('gluteus_medius', 'Face externe de l’ilium (entre lignes glutéales antérieure et postérieure)', 'Face latérale du grand trochanter',
  'Nerf glutéal supérieur (L4-S1)', 'HA.abd!, BA.stab=Stabilisation du bassin en appui unipodal!, HA.ri, HA.re',
  'Empêche le bassin de tomber en appui sur une jambe et le genou de rentrer : marche latérale élastique, abductions, pistol, step-down.');
F('gluteus_minimus', 'Face externe de l’ilium (entre lignes glutéales antérieure et inférieure)', 'Face antérieure du grand trochanter',
  'Nerf glutéal supérieur (L4-S1)', 'HA.abd!, HA.ri!, BA.stab=Stabilisation du bassin en appui unipodal', 'Partenaire profond du moyen fessier.');
F('tensor_fasciae_latae', 'Épine iliaque antéro-supérieure', 'Bandelette ilio-tibiale (puis tubercule de Gerdy du tibia)',
  'Nerf glutéal supérieur (L4-S1)', 'HA.abd!, HA.flex, HA.ri, GE.stab',
  'Souvent dominant sur le moyen fessier chez les coureurs : à équilibrer (clamshell, abduction hanche en extension).');

// ---- Pelvi-trochantériens ----
F('piriformis', 'Face antérieure du sacrum', 'Bord supérieur du grand trochanter',
  'Nerf du piriforme (L5-S2)', 'HA.re!, HA.abd, HA.stab=Coaptation de la hanche!',
  'Le nerf sciatique passe dessous (parfois au travers) : syndrome du piriforme. Étirement « pigeon ».');
F('gemellus_superior', 'Épine ischiatique', 'Grand trochanter (avec l’obturateur interne)',
  'Nerf de l’obturateur interne (L5-S2)', 'HA.re!, HA.stab=Coaptation de la hanche!', 'Rotateur externe profond.');
F('gemellus_inferior', 'Tubérosité ischiatique', 'Grand trochanter (avec l’obturateur interne)',
  'Nerf du carré fémoral (L4-S1)', 'HA.re!, HA.stab=Coaptation de la hanche', 'Rotateur externe profond.');
F('obturator_internus', 'Face interne de la membrane obturatrice et de son pourtour', 'Face médiale du grand trochanter',
  'Nerf de l’obturateur interne (L5-S2)', 'HA.re!, HA.stab=Coaptation de la hanche', 'Lien direct avec le plancher pelvien (arc tendineux).');
F('obturator_externus', 'Face externe de la membrane obturatrice', 'Fosse trochantérique du fémur',
  'Nerf obturateur (L3-L4)', 'HA.re!, HA.add', 'Rotateur externe profond.');
F('quadratus_femoris', 'Tubérosité ischiatique', 'Crête intertrochantérique du fémur',
  'Nerf du carré fémoral (L4-S1)', 'HA.re!, HA.add', 'Rotateur externe puissant.');

// ---- Adducteurs ----
F('adductor_longus', 'Corps du pubis (sous la crête)', 'Ligne âpre du fémur (tiers moyen)',
  'Nerf obturateur (L2-L4)', 'HA.add!, HA.flex', 'Le plus souvent touché dans la pubalgie et les claquages d’adducteurs : Copenhagen plank, adductions à l’élastique.');
F('adductor_brevis', 'Corps et branche inférieure du pubis', 'Ligne âpre du fémur (tiers proximal)',
  'Nerf obturateur (L2-L4)', 'HA.add!, HA.flex', 'Adducteur profond.');
F('adductor_magnus', 'Branche ischio-pubienne et tubérosité ischiatique', 'Ligne âpre du fémur et tubercule de l’adducteur',
  'Nerf obturateur (L2-L4) et nerf sciatique (L4)', 'HA.add!, HA.ext!, HA.flex',
  'Gros extenseur de hanche dans le squat profond (sa partie ischiatique fonctionne comme un ischio-jambier).');
F('adductor_minimus', 'Branche inférieure du pubis', 'Ligne âpre du fémur (partie haute)',
  'Nerf obturateur (L2-L4)', 'HA.add!, HA.re', 'Partie supérieure du grand adducteur.');
F('gracilis', 'Corps et branche inférieure du pubis', 'Face médiale du tibia (patte d’oie)',
  'Nerf obturateur (L2-L3)', 'HA.add!, GE.flex, GE.ri', 'Seul adducteur qui croise le genou ; fait partie de la patte d’oie.');
F('pectineus', 'Pecten du pubis', 'Ligne pectinéale du fémur (sous le petit trochanter)',
  'Nerf fémoral (L2-L3), parfois obturateur', 'HA.add!, HA.flex!', 'Entre fléchisseurs et adducteurs.');

// ---- Quadriceps ----
F('rectus_femoris', 'Épine iliaque antéro-inférieure et toit de l’acétabulum', 'Patella puis tubérosité tibiale (tendon rotulien)',
  'Nerf fémoral (L2-L4)', 'GE.ext!, HA.flex!, BA.ant',
  'Le seul chef du quadriceps qui croise la hanche : leg extension, squat, sprint, frappe de balle. Souvent raide (test de Thomas).');
F('vastus_lateralis', 'Grand trochanter et lèvre latérale de la ligne âpre', 'Patella puis tubérosité tibiale',
  'Nerf fémoral (L2-L4)', 'GE.ext!', 'Le plus gros chef du quadriceps : squat, presse, fentes.');
F('vastus_medialis', 'Ligne intertrochantérique et lèvre médiale de la ligne âpre', 'Patella (bord médial) puis tubérosité tibiale',
  'Nerf fémoral (L2-L4)', 'GE.ext!, GE.patella=Stabilisation de la rotule!',
  'Son faisceau oblique (VMO) stabilise la rotule : réhab genou, squat profond, step-down, Spanish squat.');
F('vastus_intermedius', 'Faces antérieure et latérale du fémur', 'Patella puis tubérosité tibiale',
  'Nerf fémoral (L2-L4)', 'GE.ext!', 'Sous le droit fémoral ; travaille à toutes les extensions du genou.');
F('sartorius', 'Épine iliaque antéro-supérieure', 'Face médiale du tibia (patte d’oie)',
  'Nerf fémoral (L2-L3)', 'HA.flex, HA.abd, HA.re, GE.flex, GE.ri, HA.combi=Position assis en tailleur!', 'Le plus long muscle du corps : position « assis en tailleur ».');

// ---- Ischio-jambiers ----
F('long_head_of_biceps_femoris', 'Tubérosité ischiatique', 'Tête de la fibula',
  'Nerf sciatique, partie tibiale (L5-S2)', 'GE.flex!, HA.ext!, GE.re!, BA.retro',
  'Le plus souvent blessé en sprint : Nordic curl, soulevé de terre jambes tendues, leg curl, glute-ham raise.');
F('short_head_of_biceps_femoris', 'Ligne âpre du fémur (lèvre latérale)', 'Tête de la fibula',
  'Nerf sciatique, partie fibulaire (L5-S2)', 'GE.flex!, GE.re!', 'Seul ischio qui ne croise pas la hanche : leg curl.');
F('semitendinosus', 'Tubérosité ischiatique', 'Face médiale du tibia (patte d’oie)',
  'Nerf sciatique, partie tibiale (L5-S2)', 'GE.flex!, HA.ext!, GE.ri!, BA.retro', 'Son tendon sert souvent de greffe pour le ligament croisé (DIDT).');
F('semimembranosus', 'Tubérosité ischiatique', 'Condyle médial du tibia (face postérieure)',
  'Nerf sciatique, partie tibiale (L5-S2)', 'GE.flex!, HA.ext!, GE.ri!, BA.retro', 'Ischio le plus profond et le plus large en bas.');

// ---- Jambe : loge postérieure ----
F('medial_head_of_gastrocnemius', 'Condyle médial du fémur', 'Calcanéus par le tendon calcanéen',
  'Nerf tibial (S1-S2)', 'CH.fp!, GE.flex', 'Mollet : extensions mollets jambes tendues, sauts, sprint. Lésion fréquente (« tennis leg »).');
F('lateral_head_of_gastrocnemius', 'Condyle latéral du fémur', 'Calcanéus par le tendon calcanéen',
  'Nerf tibial (S1-S2)', 'CH.fp!, GE.flex', 'Mollet, côté externe.');
F('soleus', 'Tête et col de la fibula, ligne du soléaire du tibia', 'Calcanéus par le tendon calcanéen',
  'Nerf tibial (S1-S2)', 'CH.fp!, CH.stab!',
  'Travaille surtout genou fléchi : mollets assis. Muscle de l’endurance et de la réhab tendon d’Achille.');
F('plantaris', 'Condyle latéral du fémur', 'Calcanéus (avec le tendon calcanéen)',
  'Nerf tibial (S1-S2)', 'CH.fp, GE.flex, CH.prop=Proprioception de la cheville!', 'Petit muscle au long tendon, parfois absent.');
F('popliteus', 'Condyle latéral du fémur', 'Face postérieure du tibia (au-dessus de la ligne du soléaire)',
  'Nerf tibial (L4-S1)', 'GE.verr=Déverrouillage du genou!, GE.ri!, GE.flex', 'Déverrouille le genou tendu au début de la flexion.');
F('tibialis_posterior', 'Membrane interosseuse, tibia et fibula (faces postérieures)', 'Naviculaire, cunéiformes, bases des métatarsiens 2 à 4',
  'Nerf tibial (L4-L5)', 'PI.inv!, PI.voute!, CH.fp',
  'Soutient la voûte plantaire : sa faiblesse donne un pied plat acquis. Élévations mollets en inversion, travail pied nu.');
F('flexor_digitorum_longus', 'Face postérieure du tibia', 'Phalanges distales des orteils 2 à 5',
  'Nerf tibial (L5-S1)', 'OR.flex!, CH.fp, PI.inv, PI.voute', 'Agrippe le sol avec les orteils.');
F('flexor_hallucis_longus', 'Face postérieure de la fibula', 'Phalange distale de l’hallux',
  'Nerf tibial (S1-S2)', 'HX.flex!, CH.fp, PI.voute', 'Propulsion à la marche et au sprint (poussée du gros orteil).');

// ---- Jambe : loges antérieure et latérale ----
F('tibialis_anterior', 'Condyle latéral et face latérale du tibia, membrane interosseuse', 'Cunéiforme médial et base du 1er métatarsien',
  'Nerf fibulaire profond (L4-L5)', 'CH.fd!, PI.inv!, PI.voute',
  'Relève le pied ; prévient la périostite (« shin splints »). Tibia raises, marche sur les talons.');
F('extensor_digitorum_longus', 'Condyle latéral du tibia, fibula, membrane interosseuse', 'Phalanges moyennes et distales des orteils 2 à 5',
  'Nerf fibulaire profond (L5-S1)', 'OR.ext!, CH.fd, PI.ev', 'Relève les orteils.');
F('extensor_hallucis_longus', 'Face médiale de la fibula, membrane interosseuse', 'Phalange distale de l’hallux',
  'Nerf fibulaire profond (L5-S1)', 'HX.ext!, CH.fd', 'Testé pour la racine L5 (relever le gros orteil).');
F('fibularis_tertius', 'Tiers distal de la fibula', 'Base du 5e métatarsien (face dorsale)',
  'Nerf fibulaire profond (L5-S1)', 'CH.fd, PI.ev!', 'Variante du long extenseur des orteils.');
F('fibularis_longus', 'Tête et face latérale de la fibula', 'Cunéiforme médial et base du 1er métatarsien (par la plante)',
  'Nerf fibulaire superficiel (L5-S1)', 'PI.ev!, CH.fp, PI.voute',
  'Protège de l’entorse de cheville en inversion : proprioception, éversion à l’élastique, sauts réactifs.');
F('fibularis_brevis', 'Deux tiers distaux de la face latérale de la fibula', 'Tubérosité du 5e métatarsien',
  'Nerf fibulaire superficiel (L5-S1)', 'PI.ev!, CH.fp', 'Éverseur principal ; son tendon peut arracher la base du 5e métatarsien dans une entorse.');

// ---- Pied ----
F('extensor_hallucis_brevis', 'Face dorsale du calcanéus', 'Phalange proximale de l’hallux',
  'Nerf fibulaire profond (L5-S1)', 'HX.ext!', 'Muscle dorsal du pied.');
F('abductor_hallucis', 'Tubérosité du calcanéus, rétinaculum des fléchisseurs', 'Phalange proximale de l’hallux (côté médial)',
  'Nerf plantaire médial (S1-S2)', 'HX.abd=Abduction de l’hallux!, PI.voute!', 'Soutient l’arche interne : « short foot », travail pieds nus. Combat l’hallux valgus.');
F('flexor_digitorum_brevis', 'Tubérosité du calcanéus, aponévrose plantaire', 'Phalanges moyennes des orteils 2 à 5',
  'Nerf plantaire médial (S1-S2)', 'OR.flex!, PI.voute', 'Muscle de la voûte : towel curls, short foot.');
F('abductor_digiti_minimi_of_foot', 'Tubérosité du calcanéus', 'Phalange proximale du 5e orteil',
  'Nerf plantaire latéral (S1-S3)', 'OR.abd=Abduction du 5e orteil!, PI.voute', 'Bord externe du pied.');
F('flexor_accessorius', 'Faces médiale et latérale du calcanéus', 'Tendon du long fléchisseur des orteils',
  'Nerf plantaire latéral (S1-S3)', 'OR.flex!', 'Réaligne la traction du long fléchisseur.');
F('first_lumbrical_of_foot', 'Tendon du long fléchisseur des orteils', 'Dossière du 2e orteil',
  'Nerf plantaire médial (S2-S3)', 'OR.flex', 'Fléchit la base de l’orteil et étend les phalanges.');
F('second_lumbrical_of_foot', 'Tendons du long fléchisseur des orteils', 'Dossière du 3e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.flex', 'Idem.');
F('third_lumbrical_of_foot', 'Tendons du long fléchisseur des orteils', 'Dossière du 4e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.flex', 'Idem.');
F('fourth_lumbrical_of_foot', 'Tendons du long fléchisseur des orteils', 'Dossière du 5e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.flex', 'Idem.');
F('medial_head_of_flexor_hallucis_brevis', 'Cuboïde, cunéiforme latéral', 'Phalange proximale de l’hallux (côté médial)',
  'Nerf plantaire médial (S1-S2)', 'HX.flex!', 'Contient un os sésamoïde.');
F('lateral_head_of_flexor_hallucis_brevis', 'Cuboïde, cunéiforme latéral', 'Phalange proximale de l’hallux (côté latéral)',
  'Nerf plantaire médial (S1-S2)', 'HX.flex!', 'Contient un os sésamoïde.');
F('oblique_head_of_adductor_hallucis', 'Bases des métatarsiens 2 à 4', 'Phalange proximale de l’hallux (côté latéral)',
  'Nerf plantaire latéral (S2-S3)', 'HX.add=Adduction de l’hallux!, PI.voute', 'Trop tendu, il participe à l’hallux valgus.');
F('transverse_head_of_adductor_hallucis', 'Ligaments des articulations métatarso-phalangiennes 3 à 5', 'Phalange proximale de l’hallux (côté latéral)',
  'Nerf plantaire latéral (S2-S3)', 'HX.add=Adduction de l’hallux!, PI.voute', 'Tient l’arche transversale de l’avant-pied.');
F('flexor_digiti_minimi_brevis_of_foot', 'Base du 5e métatarsien', 'Phalange proximale du 5e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.flex!', 'Flexion du 5e orteil.');
F('opponens_digiti_minimi_of_foot', 'Base du 5e métatarsien', 'Diaphyse du 5e métatarsien',
  'Nerf plantaire latéral (S2-S3)', 'PI.voute!', 'Inconstant.');
F('first_plantar_interosseous_of_foot', '3e métatarsien', 'Phalange proximale du 3e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.add=Rapprochement des orteils!, OR.flex', 'Rapproche les orteils.');
F('second_plantar_interosseous_of_foot', '4e métatarsien', 'Phalange proximale du 4e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.add=Rapprochement des orteils!, OR.flex', 'Rapproche les orteils.');
F('third_plantar_interosseous_of_foot', '5e métatarsien', 'Phalange proximale du 5e orteil',
  'Nerf plantaire latéral (S2-S3)', 'OR.add=Rapprochement des orteils!, OR.flex', 'Rapproche les orteils.');

// ---- Tendons, fascias, membranes du membre inférieur ----
T('iliotibial_tract', 'Épaississement du fascia lata sur la face externe de la cuisse', 'De la crête iliaque (via tenseur du fascia lata et grand fessier) au tubercule de Gerdy du tibia',
  'Syndrome de la bandelette chez les coureurs : renforcer moyen fessier et rotateurs externes plutôt que « rouler » la bandelette.');
T('calcaneal_tendon', 'Tendon d’Achille : tendon commun des gastrocnémiens et du soléaire, le plus solide du corps', 'Face postérieure du calcanéus',
  'Tendinopathie : charges lourdes et lentes (mollets debout et assis, excentrique Alfredson), puis pliométrie progressive.');
T('interosseous_membrane_of_leg', 'Membrane fibreuse entre tibia et fibula', 'Bords interosseux du tibia et de la fibula',
  'Sert d’origine aux muscles profonds de la jambe.');
T('long_plantar_ligament', 'Ligament le plus long de la plante du pied', 'Du calcanéus au cuboïde et aux bases des métatarsiens',
  'Soutient l’arche latérale du pied.');
