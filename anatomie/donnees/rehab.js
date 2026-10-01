// Protocoles de réhabilitation et de prévention : trames de progression par blessure courante.
// Les exercices sont désignés par leur nom exact dans la base. Outil d'aide à la programmation, pas un avis médical.
window.REHAB = [];
const R = (o) => window.REHAB.push(o);

R({ id: 'coiffe', nom: 'Tendinopathie de la coiffe / conflit sous-acromial', zone: 'Épaule',
  cibles: 'supra infra prond dentele trapI', resume: 'Douleur à l’élévation du bras (arc douloureux 60-120°), souvent chez les pousseurs et en overhead.',
  phases: [
    { nom: 'Calmer et charger sans douleur', objectif: 'Réduire la douleur, garder le tendon sous charge tolérée (≤ 3/10).', critere: 'Douleur au repos absente, isométriques indolores.',
      exos: ['Abduction isométrique contre le mur', 'Rotation externe isométrique contre le mur', 'Rotation externe couché sur le côté', 'Serratus punch (coup de poing couché)', 'Low row isométrique'] },
    { nom: 'Renforcer la coiffe et la scapula', objectif: 'Gagner en force en rotation externe et en contrôle scapulaire.', critere: 'Rotation externe ≥ 2/3 de la rotation interne, pas de douleur à l’élévation.',
      exos: ['Rotation externe à l’élastique coude au corps', 'Full can (élévation dans le plan de la scapula)', 'Face pull', 'Prone Y-T-W', 'Wall slide (glissés au mur)', 'Push-up plus'] },
    { nom: 'Retour au-dessus de la tête et à la charge', objectif: 'Réintroduire développés et tractions progressivement.', critere: 'Exercices overhead sans douleur ni compensation.',
      exos: ['Rotation externe à 90° d’abduction', 'Développé landmine', 'Bottom-up kettlebell press', 'Y-raise', 'Tractions scapulaires', 'Turkish get-up'] },
  ], precautions: 'Éviter temporairement développé nuque, dips profonds et élévations latérales au-dessus de 90°. Douleur nocturne persistante ou perte de force brutale : avis médical (rupture possible).' });

R({ id: 'instabilite', nom: 'Instabilité d’épaule / après luxation', zone: 'Épaule',
  cibles: 'subscap infra prond dentele deltA', resume: 'Sensation que l’épaule « part », après une luxation ou chez les hyperlaxes.',
  phases: [
    { nom: 'Protéger et activer', objectif: 'Contrôle de la tête humérale en positions sûres (bras bas).', critere: 'Accord du médecin, amplitude passive retrouvée.',
      exos: ['Pendulaire de Codman', 'Rotation interne à l’élastique', 'Rotation externe à l’élastique coude au corps', 'Scapular push-up', 'Stabilisation rythmique épaule'] },
    { nom: 'Stabilité dynamique', objectif: 'Renforcer en chaîne fermée puis ouverte.', critere: 'Pas d’appréhension en abduction-rotation externe modérée.',
      exos: ['Pompe sur genoux plus', 'Marche à quatre pattes sur les mains (crawl)', 'Bottom-up kettlebell press', 'Rowing bas à l’élastique', 'Face pull'] },
    { nom: 'Positions à risque et sport', objectif: 'Charger en abduction-rotation externe, réactivité.', critere: 'Force symétrique, tests fonctionnels validés.',
      exos: ['Rotation externe à 90° d’abduction', 'Turkish get-up', 'Lancer poitrine de medecine ball', 'Développé couché haltères', 'Tractions pronation'] },
  ], precautions: 'Éviter longtemps les positions bras en l’air et en arrière (armé du lancer, dips très profonds, développé nuque). Récidives : avis chirurgical.' });

R({ id: 'dyskinesie', nom: 'Dyskinésie scapulaire / scapula ailée', zone: 'Épaule',
  cibles: 'dentele trapI trapM', resume: 'Omoplate qui décolle ou bouge mal ; souvent liée à un dentelé et un trapèze inférieur faibles et un petit pectoral raide.',
  phases: [
    { nom: 'Mobilité et prise de conscience', objectif: 'Assouplir le petit pectoral, sentir la bascule postérieure.', critere: 'Omoplates contrôlées bras le long du corps.',
      exos: ['Étirement des pectoraux (encadrement de porte)', 'Extension thoracique sur rouleau', 'Low row isométrique', 'Serratus punch (coup de poing couché)'] },
    { nom: 'Renforcement scapulaire', objectif: 'Dentelé et trapèze inférieur forts.', critere: 'Plus de décollement visible aux pompes et à l’élévation.',
      exos: ['Push-up plus', 'Wall slide avec rouleau en mousse', 'Prone Y raise', 'Tractions scapulaires', 'Face pull'] },
    { nom: 'Intégration', objectif: 'Contrôle en charge et au-dessus de la tête.', critere: 'Mouvement fluide sous charge.',
      exos: ['Pompes', 'Développé landmine', 'Overhead carry', 'Turkish get-up'] },
  ], precautions: 'Une scapula très ailée d’apparition brutale peut venir d’une atteinte du nerf thoracique long : avis médical.' });

R({ id: 'epicondylite', nom: 'Épicondylite latérale (tennis elbow)', zone: 'Coude',
  cibles: 'extPoignet extDoigts', resume: 'Douleur à l’extérieur du coude en serrant ou en soulevant paume vers le bas.',
  phases: [
    { nom: 'Calmer', objectif: 'Charge tolérée, isométriques.', critere: 'Prise d’objets courants peu douloureuse.',
      exos: ['Extension des poignets', 'Ouverture des doigts à l’élastique', 'Étirement des extenseurs du poignet'] },
    { nom: 'Excentrique et force', objectif: 'Remodeler le tendon.', critere: 'Douleur ≤ 3/10 pendant et le lendemain.',
      exos: ['Tyler twist (excentrique poignet)', 'Extension des poignets', 'Pronation-supination au marteau', 'Curl inversé'] },
    { nom: 'Retour aux tirages', objectif: 'Réintroduire tractions et rowing.', critere: 'Grip symétrique et indolore.',
      exos: ['Curl marteau', 'Rowing haltère un bras', 'Tractions prise neutre', 'Farmer walk'] },
  ], precautions: 'Souvent lent (3 à 6 mois). Vérifier la prise : prise neutre et grips plus épais soulagent.' });

R({ id: 'epitrochleite', nom: 'Épitrochléite (coude du golfeur / du grimpeur)', zone: 'Coude',
  cibles: 'flechPoignet pronat flechDoigts', resume: 'Douleur à l’intérieur du coude : tractions, curls, escalade, street.',
  phases: [
    { nom: 'Calmer', objectif: 'Réduire la charge des tirages.', critere: 'Douleur au repos absente.',
      exos: ['Étirement des fléchisseurs du poignet', 'Écrasement de balle (grip)', 'Glissement neural du nerf médian'] },
    { nom: 'Renforcer', objectif: 'Excentrique des fléchisseurs et pronateurs.', critere: 'Suspension 30 s sans douleur.',
      exos: ['Excentrique des fléchisseurs du poignet', 'Rotation de poignet au marteau en pronation lente', 'Curl poignets (flexion)', 'Suspension à la barre (dead hang)'] },
    { nom: 'Retour au street', objectif: 'Tractions, muscle up progressifs.', critere: 'Tractions sans douleur le lendemain.',
      exos: ['Tractions prise neutre', 'Tractions excentriques', 'Tractions pronation', 'Négatives de muscle up'] },
  ], precautions: 'Fourmillements dans les 4e et 5e doigts : penser au nerf ulnaire, avis médical.' });

R({ id: 'lombalgie', nom: 'Lombalgie commune', zone: 'Dos',
  cibles: 'transverse multifides gfess obliques cl', resume: 'Douleur lombaire sans signe de gravité, la plus fréquente des plaintes.',
  phases: [
    { nom: 'Bouger sans peur', objectif: 'Rester actif, retrouver la mobilité et la respiration.', critere: 'Activités quotidiennes possibles.',
      exos: ['Respiration diaphragmatique 90/90', 'Chat-vache', 'Bascule du bassin', 'Extension en appui sur les coudes (McKenzie)', 'Pont fessier'] },
    { nom: 'Stabilité du tronc', objectif: 'Le « big 3 » de McGill et le contrôle moteur.', critere: 'Tenir les gainages sans douleur.',
      exos: ['McGill curl-up', 'Planche latérale', 'Bird dog', 'Dead bug', 'Pallof press'] },
    { nom: 'Recharger la charnière de hanche', objectif: 'Retour progressif aux charges.', critere: 'Soulevé de terre léger indolore.',
      exos: ['Hip thrust', 'Pull-through poulie', 'Soulevé de terre roumain', 'Suitcase carry (porté valise)', 'Soulevé de terre trap bar', 'Extensions lombaires au banc'] },
  ], precautions: 'Signes d’alerte (avis médical immédiat) : perte de force ou d’anesthésie dans les jambes, troubles urinaires, fièvre, douleur nocturne intense, traumatisme.' });

R({ id: 'cervicalgie', nom: 'Cervicalgie / tête en avant', zone: 'Cou',
  cibles: 'flechCou extCou trapI trapM', resume: 'Douleurs de nuque, souvent liées à la posture et à la faiblesse des fléchisseurs profonds.',
  phases: [
    { nom: 'Mobilité et contrôle', objectif: 'Réveiller les fléchisseurs profonds.', critere: 'Chin tuck tenu 10 s sans compensation.',
      exos: ['Chin tuck (rentrer le menton)', 'Rotation cervicale active assistée', 'Étirement du trapèze supérieur', 'Extension thoracique sur rouleau'] },
    { nom: 'Renforcement', objectif: 'Endurance cou et haut du dos.', critere: 'Plus de douleur en fin de journée.',
      exos: ['Isométrie cervicale multidirectionnelle', 'Rétraction cervicale avec extension', 'Face pull', 'Prone Y-T-W'] },
    { nom: 'Charge', objectif: 'Renforcer le cou en charge.', critere: 'Force symétrique.',
      exos: ['Renforcement cou en flexion (bandeau)', 'Renforcement cou en extension (harnais)', 'Shrugs haltères', 'Rowing poulie assis'] },
  ], precautions: 'Douleur irradiant dans le bras, vertiges, maux de tête violents : avis médical.' });

R({ id: 'femoropatellaire', nom: 'Syndrome fémoro-patellaire (douleur antérieure du genou)', zone: 'Genou',
  cibles: 'quadri vasteM mfess gfess', resume: 'Douleur autour de la rotule en descente d’escaliers, squat, position assise prolongée.',
  phases: [
    { nom: 'Calmer et activer', objectif: 'Charge tolérée, hanche et quadriceps.', critere: 'Escaliers peu douloureux.',
      exos: ['Wall sit (chaise)', 'Clamshell', 'Abduction de hanche couché sur le côté', 'Terminal knee extension (TKE)', 'Pont fessier'] },
    { nom: 'Renforcement', objectif: 'Force quadriceps et fessiers, alignement du genou.', critere: 'Squat au poids du corps sans douleur.',
      exos: ['Spanish squat', 'Step-down (descente contrôlée)', 'Marche latérale à l’élastique (monster walk)', 'Leg press amplitude réduite (0-60°)', 'Hip thrust'] },
    { nom: 'Retour sport', objectif: 'Charges et impacts.', critere: 'Squat profond et sauts indolores.',
      exos: ['Squat goblet', 'Squat bulgare', 'Fentes arrière', 'Réceptions de saut (drop landing)', 'Tirer le traîneau à reculons'] },
  ], precautions: 'Gonflement, blocage ou dérobement du genou : avis médical (ménisque, ligament).' });

R({ id: 'rotulien', nom: 'Tendinopathie rotulienne (jumper’s knee)', zone: 'Genou',
  cibles: 'quadri', resume: 'Douleur sous la rotule chez les sauteurs et coureurs, réveillée par la charge.',
  phases: [
    { nom: 'Isométrie antalgique', objectif: 'Calmer la douleur par l’isométrie.', critere: 'Douleur au saut unipodal ≤ 3/10.',
      exos: ['Isométrie quadriceps à 60° (tendon rotulien)', 'Wall sit (chaise)', 'Spanish squat'] },
    { nom: 'Lourd et lent', objectif: 'Charges lourdes, tempo lent (3 s / 3 s).', critere: 'Squat 1,5 x poids du corps sans douleur.',
      exos: ['Leg extension unilatéral', 'Squat tempo (excentrique 3-5 s)', 'Presse à cuisses unilatérale', 'Squat bulgare'] },
    { nom: 'Énergie et retour au sport', objectif: 'Stockage-restitution d’énergie.', critere: 'Bonds et changements de direction sans douleur.',
      exos: ['Pogo jumps', 'Box jump', 'Bonds unipodaux', 'Drop jump'] },
  ], precautions: 'La douleur ne doit pas augmenter d’une séance à l’autre (règle des 24 h).' });

R({ id: 'lca', nom: 'Reprise après ligamentoplastie du LCA', zone: 'Genou',
  cibles: 'quadri ischios gfess mfess', resume: 'Trame générale de la reprise : toujours en accord avec le chirurgien et le kinésithérapeute.',
  phases: [
    { nom: 'Récupérer extension et quadriceps', objectif: 'Extension complète, verrouillage actif.', critere: 'Extension complète, pas d’épanchement.',
      exos: ['Contraction isométrique du quadriceps (quad set)', 'Élévation jambe tendue (SLR)', 'Patella mobilisation (auto-mobilisation de la rotule)', 'Pont fessier'] },
    { nom: 'Force', objectif: 'Reconstruire quadriceps et ischios.', critere: 'Quadriceps ≥ 70 % du côté sain.',
      exos: ['Mini-squat à 45°', 'Leg press amplitude réduite (0-60°)', 'Step-up', 'Leg curl assis', 'Équilibre unipodal', 'Tirer le traîneau à reculons'] },
    { nom: 'Puissance et contrôle', objectif: 'Réceptions, course, changements de direction.', critere: 'Symétrie ≥ 90 % (force et sauts), tests de retour au sport.',
      exos: ['Réceptions de saut (drop landing)', 'Fente avant décélérée', 'Bonds unipodaux', 'Skater jumps', 'Nordic curl (ischios nordiques)'] },
  ], precautions: 'Délais et critères fixés par l’équipe médicale (souvent 9 mois minimum avant les sports pivots).' });

R({ id: 'cheville', nom: 'Entorse de cheville (latérale)', zone: 'Cheville',
  cibles: 'fibulaires tibP mollets piedIntr', resume: 'Torsion en inversion ; récidives fréquentes sans travail proprioceptif.',
  phases: [
    { nom: 'Protéger et mobiliser', objectif: 'Réduire l’œdème, récupérer la flexion dorsale.', critere: 'Marche normale.',
      exos: ['Mobilité de cheville genou au mur', 'Tibia raises (relevé de pointes)', 'Short foot (pied court)'] },
    { nom: 'Renforcer et équilibrer', objectif: 'Fibulaires, mollets, proprioception.', critere: 'Équilibre unipodal 30 s yeux fermés.',
      exos: ['Éversion de cheville à l’élastique', 'Extensions mollets unilatérales', 'Équilibre unipodal', 'Balance Y (Y-balance test)'] },
    { nom: 'Impacts et sport', objectif: 'Sauts et appuis.', critere: 'Sauts unipodaux symétriques.',
      exos: ['Pogo jumps', 'Sauts sur place à cloche-pied (retour au sport)', 'Skater jumps', 'Bonds unipodaux'] },
  ], precautions: 'Impossibilité de poser le pied ou douleur osseuse : radio pour éliminer une fracture.' });

R({ id: 'achille', nom: 'Tendinopathie d’Achille', zone: 'Cheville',
  cibles: 'gastro soleaire', resume: 'Douleur et raideur du tendon le matin et au début de l’effort.',
  phases: [
    { nom: 'Calmer', objectif: 'Isométrie et charge tolérée.', critere: 'Douleur ≤ 3/10 à la marche.',
      exos: ['Extensions mollets isométriques lourdes', 'Soleus squat (genou fléchi en isométrie)', 'Extensions mollets assis'] },
    { nom: 'Lourd et lent', objectif: 'Renforcer gastrocnémiens et soléaire.', critere: '25 extensions mollets unilatérales sans douleur.',
      exos: ['Extensions mollets unilatérales', 'Excentrique mollets (protocole Alfredson)', 'Extensions mollets debout', 'Extensions mollets assis'] },
    { nom: 'Pliométrie', objectif: 'Rendre au tendon son élasticité.', critere: 'Sauts et course sans douleur le lendemain.',
      exos: ['Pogo jumps', 'Corde à sauter', 'Bonds unipodaux', 'Sprint'] },
  ], precautions: 'Douleur brutale avec sensation de coup de pied dans le mollet : rupture possible, avis médical urgent.' });

R({ id: 'ischios', nom: 'Lésion des ischio-jambiers', zone: 'Cuisse',
  cibles: 'ischios bfL gfess', resume: 'Douleur vive à l’arrière de la cuisse en sprint ou en étirement.',
  phases: [
    { nom: 'Protéger et activer', objectif: 'Isométrie sans douleur.', critere: 'Marche normale, pont indolore.',
      exos: ['Pont ischios isométrique (talons sur banc)', 'Pont fessier', 'Bird dog'] },
    { nom: 'Renforcer en allongement', objectif: 'Force en position étirée.', critere: 'Force ≥ 80 % du côté sain.',
      exos: ['Leg curl excentrique unilatéral', 'Soulevé de terre roumain unilatéral léger', 'Glissade ischios (slider curl)', 'Hip thrust'] },
    { nom: 'Vitesse et prévention', objectif: 'Nordic, sprint progressif.', critere: 'Sprint à vitesse maximale sans appréhension.',
      exos: ['Nordic curl (ischios nordiques)', 'Soulevé de terre roumain', 'Montées de genoux (A-skip)', 'Sprint'] },
  ], precautions: 'Hématome important ou claquement audible : imagerie (lésion du tendon proximal).' });

R({ id: 'pubalgie', nom: 'Pubalgie / lésion des adducteurs', zone: 'Hanche',
  cibles: 'adducteurs obliques gdroit', resume: 'Douleur à l’aine ou au pubis, sports de frappe et de changements de direction.',
  phases: [
    { nom: 'Calmer', objectif: 'Isométrie des adducteurs.', critere: 'Serrage entre les genoux indolore.',
      exos: ['Isométrie de hanche en adduction (balle entre les genoux)', 'Dead bug', 'Pont fessier'] },
    { nom: 'Renforcer', objectif: 'Adducteurs et paroi abdominale.', critere: 'Copenhagen courte 30 s sans douleur.',
      exos: ['Planche latérale Copenhagen courte', 'Adduction à l’élastique', 'Fentes latérales', 'Pallof press'] },
    { nom: 'Retour au terrain', objectif: 'Changements de direction et frappes.', critere: 'Tests de terrain indolores.',
      exos: ['Copenhagen plank', 'Squat cosaque', 'Skater jumps', 'Lancer de medecine ball rotation'] },
  ], precautions: 'Douleur testiculaire, fièvre ou masse : avis médical.' });

R({ id: 'bandelette', nom: 'Syndrome de la bandelette ilio-tibiale', zone: 'Hanche / genou',
  cibles: 'mfess gfess rotHanche', resume: 'Douleur à l’extérieur du genou chez le coureur, après quelques kilomètres.',
  phases: [
    { nom: 'Réduire l’irritation', objectif: 'Diminuer le volume de course, activer la hanche.', critere: 'Marche et escaliers indolores.',
      exos: ['Clamshell', 'Abduction de hanche couché sur le côté', 'Auto-massage à la balle (fessiers)', 'Pont avec élastique aux genoux'] },
    { nom: 'Renforcer la hanche', objectif: 'Contrôle du bassin en appui unipodal.', critere: 'Step-down sans chute du bassin.',
      exos: ['Marche latérale à l’élastique (monster walk)', 'Step-down (descente contrôlée)', 'Soulevé de terre unilatéral (une jambe)', 'Hip airplane'] },
    { nom: 'Reprise de la course', objectif: 'Volume progressif.', critere: 'Course de référence sans douleur.',
      exos: ['Squat bulgare', 'Bonds unipodaux', 'Skater jumps'] },
  ], precautions: 'Le rouleau sur la bandelette soulage parfois mais ne la « détend » pas : le travail de hanche est l’essentiel.' });

R({ id: 'fasciite', nom: 'Fasciite plantaire', zone: 'Pied',
  cibles: 'piedIntr mollets', resume: 'Douleur sous le talon aux premiers pas du matin.',
  phases: [
    { nom: 'Calmer', objectif: 'Diminuer la charge, mobiliser.', critere: 'Premiers pas du matin moins douloureux.',
      exos: ['Auto-massage à la balle (voûte plantaire)', 'Étirement des mollets au mur', 'Short foot (pied court)'] },
    { nom: 'Renforcer', objectif: 'Pied et mollets.', critere: 'Montées sur pointes unilatérales sans douleur.',
      exos: ['Extensions mollets unilatérales', 'Ramasser une serviette avec les orteils', 'Marche sur les pointes'] },
    { nom: 'Retour aux impacts', objectif: 'Course et sauts.', critere: 'Pas de douleur le lendemain.',
      exos: ['Pogo jumps', 'Corde à sauter'] },
  ], precautions: 'Douleur nocturne ou engourdissement : avis médical.' });

// ---- Ajouts (01/10/2026) : sciatique, hanche, jambe, genou, main/poignet, épaule gelée, sacro-iliaque ----
R({ id: 'sciatique', nom: 'Lombosciatique / hernie discale', zone: 'Dos',
  cibles: 'multifides transverse erecteurs gfess', resume: 'Douleur qui descend dans la fesse et la jambe (parfois sous le genou), souvent aggravée assis, en se penchant ou en toussant.',
  phases: [
    { nom: 'Calmer la jambe', objectif: 'Centraliser la douleur (elle remonte vers le bas du dos), rester actif, éviter les positions qui la font descendre.', critere: 'La douleur ne descend plus sous le genou ; 20-30 min de marche tolérées.',
      exos: ['Extension en appui sur les coudes (McKenzie)', 'Respiration diaphragmatique 90/90', 'Glissement neural du nerf sciatique', 'Bascule du bassin'] },
    { nom: 'Gainage et contrôle', objectif: 'Endurance du tronc (les « big 3 » de McGill), charger sans irradiation dans la jambe.', critere: 'Planche latérale 30-45 s par côté sans irradiation ; flexion avant légère tolérée.',
      exos: ['McGill curl-up', 'Bird dog', 'Planche latérale', 'Dead bug', 'Pont fessier', 'Pallof press'] },
    { nom: 'Recharger la charnière de hanche', objectif: 'Réapprendre à soulever : charnière de hanche, portés, puis charges lourdes.', critere: 'Soulevés et portés habituels sans retour des symptômes le lendemain.',
      exos: ['Soulevé de terre roumain', 'Suitcase carry (porté valise)', 'Hip thrust', 'Soulevé de terre trap bar', 'Squat goblet', 'Swing kettlebell'] },
  ], precautions: 'URGENCE : perte de force dans la jambe qui s’aggrave, insensibilité entre les cuisses (« en selle »), troubles urinaires ou sexuels (syndrome de la queue de cheval). Éviter un temps la flexion lombaire chargée et la position assise prolongée ; si la douleur de jambe augmente pendant un exercice, arrêter.' });

R({ id: 'fessier-lateral', nom: 'Tendinopathie du moyen fessier (douleur latérale de hanche)', zone: 'Hanche',
  cibles: 'mfess pfess tfl', resume: 'Douleur sur le côté de la hanche (grand trochanter) : couché sur le côté, en montant les escaliers, debout sur une jambe. Fréquente chez les coureurs et après 40 ans.',
  phases: [
    { nom: 'Isométriques et positions', objectif: 'Calmer par l’isométrie et supprimer la compression du tendon : pas de jambes croisées, pas de hanche « sortie » en appui sur une jambe.', critere: 'Isométriques indolores, nuits plus calmes.',
      exos: ['Abduction de hanche isométrique debout (contre le mur)', 'Pont fessier', 'Squat au poids du corps'] },
    { nom: 'Renforcer en charge', objectif: 'Abducteurs et extenseurs de hanche, appui sur une jambe contrôlé.', critere: 'Appui unipodal 30 s, bassin horizontal, sans douleur.',
      exos: ['Marche latérale à l’élastique (monster walk)', 'Step-up', 'Pont fessier une jambe', 'Squat goblet', 'Soulevé de terre roumain unilatéral léger', 'Équilibre unipodal'] },
    { nom: 'Fonction et sport', objectif: 'Charges lourdes, unilatéral et impacts.', critere: 'Course et escaliers sans douleur le lendemain.',
      exos: ['Squat bulgare', 'Hip thrust unilatéral', 'Planche latérale avec abduction', 'Fentes latérales', 'Skater jumps'] },
  ], precautions: 'Au début, éviter l’abduction couché sur le côté et le clamshell (ils compriment le tendon), les étirements de la bandelette et les jambes croisées. Les infiltrations soulagent à court terme, mais éducation + exercice font mieux à un an (étude LEAP).' });

R({ id: 'cfa', nom: 'Conflit fémoro-acétabulaire (douleur de l’aine en flexion)', zone: 'Hanche',
  cibles: 'gfess mfess rotHanche iliopsoas transverse', resume: 'Douleur dans le pli de l’aine en flexion profonde avec rotation (squat profond, assis bas, sortie de voiture), parfois avec accrochage. Fréquent chez les jeunes sportifs.',
  phases: [
    { nom: 'Respecter l’amplitude', objectif: 'Garder la hanche active dans les amplitudes indolores ; éviter flexion profonde + rotation interne.', critere: 'Activités courantes sans douleur.',
      exos: ['Pont fessier', 'Rotation externe de hanche à l’élastique (assis)', 'Dead bug', 'Abduction de hanche couché sur le côté', 'Isométrie de hanche en adduction (balle entre les genoux)'] },
    { nom: 'Contrôle et force', objectif: 'Fessiers, rotateurs et tronc ; contrôle du bassin en appui unipodal.', critere: 'Squat à la parallèle sans pincement de l’aine.',
      exos: ['Squat box', 'Hip airplane', 'Rotation interne de hanche à l’élastique (assis)', 'Planche latérale Copenhagen courte', 'Soulevé de terre roumain', 'Marche latérale à l’élastique (monster walk)'] },
    { nom: 'Retour au sport', objectif: 'Amplitude utile, vitesse et changements de direction.', critere: 'Sauts, sprints et changements de direction sans douleur.',
      exos: ['Fentes arrière', 'Squat goblet', 'Squat cosaque', 'Skater jumps', 'Sprint'] },
  ], precautions: 'Adapter plutôt que forcer : squat moins profond, pieds plus écartés, pointes ouvertes. Blocage, dérobement ou douleur nocturne : imagerie et avis spécialisé (lésion du labrum).' });

R({ id: 'periostite', nom: 'Périostite tibiale (syndrome de stress tibial médial)', zone: 'Jambe',
  cibles: 'soleaire tibP flechOrteils tibA', resume: 'Douleur diffuse le long du bord interne du tibia à la course et aux sauts, souvent après une augmentation trop rapide du volume.',
  phases: [
    { nom: 'Décharger', objectif: 'Réduire les impacts (vélo, natation possibles) et renforcer sans douleur.', critere: 'Pas de douleur à la marche ni aux petits sauts sur place.',
      exos: ['Extensions mollets assis', 'Soleus squat (genou fléchi en isométrie)', 'Tibia raises (relevé de pointes)', 'Short foot (pied court)', 'Inversion de cheville à l’élastique'] },
    { nom: 'Renforcer pour encaisser', objectif: 'Mollets et soléaire forts, pied actif.', critere: '25 montées sur pointe sur une jambe et 30 s de sauts sur place sans douleur.',
      exos: ['Extensions mollets unilatérales', 'Extensions mollets debout', 'Marche sur les pointes', 'Relevé du gros orteil seul (toe yoga)', 'Pogo jumps'] },
    { nom: 'Retour à la course', objectif: 'Alternance marche-course, +10 % de volume par semaine au maximum.', critere: 'Course habituelle sans douleur le lendemain.',
      exos: ['Retour à la course (alternance marche-course)', 'Corde à sauter', 'Sauts sur place à cloche-pied (retour au sport)', 'Bonds unipodaux'] },
  ], precautions: 'Douleur très localisée sur un point précis de l’os, douleur au repos ou la nuit : suspecter une fracture de fatigue (avis médical, imagerie). Vérifier chaussures, volume et surface.' });

R({ id: 'lli', nom: 'Entorse du ligament collatéral médial du genou (LLI)', zone: 'Genou',
  cibles: 'quadri vasteM ischioMed adducteurs', resume: 'Douleur sur le bord interne du genou après un choc ou une torsion genou rentré vers l’intérieur.',
  phases: [
    { nom: 'Protéger et réveiller', objectif: 'Amplitude complète, réveiller le quadriceps, aucun stress en valgus.', critere: 'Marche sans boiterie, extension complète.',
      exos: ['Contraction isométrique du quadriceps (quad set)', 'Élévation jambe tendue (SLR)', 'Terminal knee extension (TKE)', 'Mini-squat à 45°', 'Patella mobilisation (auto-mobilisation de la rotule)'] },
    { nom: 'Force', objectif: 'Quadriceps, ischios et fessiers ; équilibre.', critere: 'Pas de douleur au test en valgus, squat sans douleur.',
      exos: ['Leg press amplitude réduite (0-60°)', 'Step-up', 'Pont fessier', 'Leg curl couché', 'Équilibre unipodal', 'Squat goblet'] },
    { nom: 'Pivots et contacts', objectif: 'Appuis latéraux, réceptions, changements de direction.', critere: 'Quadriceps ≥ 90 % de l’autre jambe, changements de direction sans appréhension.',
      exos: ['Fentes latérales', 'Réceptions de saut (drop landing)', 'Sauts sur place à cloche-pied (retour au sport)', 'Skater jumps', 'Sprint'] },
  ], precautions: 'Délais indicatifs : grade 1 ≈ 1-3 semaines, grade 2 ≈ 3-6 semaines (attelle articulée souvent au début). Laxité franche (grade 3) ou suspicion de lésion du LCA ou d’un ménisque : avis médical.' });

R({ id: 'menisque', nom: 'Lésion méniscale (conservateur ou après chirurgie)', zone: 'Genou',
  cibles: 'quadri vasteM gfess ischios', resume: 'Douleur sur l’interligne du genou, gonflement, parfois accrochages ; aggravée en flexion profonde et en rotation.',
  phases: [
    { nom: 'Calmer le genou', objectif: 'Réduire le gonflement, extension complète, quadriceps actif.', critere: 'Genou sec, extension complète, marche normale.',
      exos: ['Contraction isométrique du quadriceps (quad set)', 'Élévation jambe tendue (SLR)', 'Terminal knee extension (TKE)', 'Pont fessier', 'Leg press amplitude réduite (0-60°)'] },
    { nom: 'Renforcer sans flexion profonde', objectif: 'Force du quadriceps et de la hanche jusqu’à 90° de flexion.', critere: 'Squat à 90° sans douleur ni gonflement le lendemain.',
      exos: ['Mini-squat à 45°', 'Step-up', 'Wall sit (chaise)', 'Leg curl couché', 'Équilibre unipodal', 'Step-down (descente contrôlée)'] },
    { nom: 'Retour aux appuis', objectif: 'Flexion complète progressive, course et sauts.', critere: 'Course et sauts sans gonflement le lendemain.',
      exos: ['Squat goblet', 'Fentes avant', 'Réceptions de saut (drop landing)', 'Retour à la course (alternance marche-course)', 'Sauts sur place à cloche-pied (retour au sport)'] },
  ], precautions: 'Après suture méniscale : suivre les consignes du chirurgien (souvent pas de flexion au-delà de 90° en charge ni de squat profond pendant 6 semaines à 3 mois). Genou bloqué, impossible à tendre : avis rapide.' });

R({ id: 'mollet', nom: 'Lésion du mollet (tennis leg)', zone: 'Jambe',
  cibles: 'gastro soleaire', resume: 'Douleur brutale dans le mollet (« coup de fouet ») lors d’une accélération ou d’une impulsion, le plus souvent au gastrocnémien médial.',
  phases: [
    { nom: 'Protéger, charger tôt', objectif: 'Marche sans boiterie ; isométriques indolores dès que possible.', critere: 'Marche normale, montée sur les deux pointes indolore.',
      exos: ['Extensions mollets isométriques lourdes', 'Extensions mollets assis', 'Soleus squat (genou fléchi en isométrie)'] },
    { nom: 'Force', objectif: 'Concentrique puis excentrique, jambe tendue et fléchie.', critere: '25 montées sur pointe sur une jambe, force symétrique.',
      exos: ['Extensions mollets debout', 'Extensions mollets unilatérales', 'Excentrique mollets (protocole Alfredson)', 'Marche sur les pointes', 'Étirement des mollets au mur'] },
    { nom: 'Vitesse et impulsions', objectif: 'Élasticité, course puis sprint.', critere: 'Sprint à pleine vitesse sans appréhension.',
      exos: ['Pogo jumps', 'Corde à sauter', 'Retour à la course (alternance marche-course)', 'Bonds unipodaux', 'Sprint'] },
  ], precautions: 'Mollet très gonflé, dur et douloureux au repos : écarter une phlébite (avis médical). Récidives fréquentes si le sprint revient trop vite.' });

R({ id: 'poulies', nom: 'Lésion des poulies des doigts (grimpeur)', zone: 'Main',
  cibles: 'flexor_digitorum_superficialis flexor_digitorum_profundus flechPoignet', resume: 'Douleur à la base d’un doigt (souvent annulaire ou majeur) après une prise en arqué, parfois avec un « clac ».',
  phases: [
    { nom: 'Protéger', objectif: 'Laisser cicatriser, garder la mobilité des doigts sans charge.', critere: 'Pas de douleur poing serré ni à la pression de la poulie.',
      exos: ['Ouverture et fermeture de la main (doigts écartés)', 'Extension de doigts sur élastique et prise en pince', 'Ouverture des doigts à l’élastique', 'Écrasement de balle (grip)'] },
    { nom: 'Recharger progressivement', objectif: 'Charger les fléchisseurs en prise tendue (pas d’arqué).', critere: 'Suspension pieds au sol à charge moyenne sans douleur.',
      exos: ['Suspension pieds au sol (charge partielle des doigts)', 'Curl poignets (flexion)', 'Rouleau à poignets (wrist roller)', 'Pince disques (plate pinch)'] },
    { nom: 'Retour à la grimpe', objectif: 'Poids du corps sur prises moyennes, puis petites prises ; l’arqué en dernier.', critere: 'Suspension au poids du corps sans douleur.',
      exos: ['Suspension à la barre (dead hang)', 'Suspension à la serviette', 'Tractions pronation', 'Farmer walk'] },
  ], precautions: 'Tendon qui « décolle » de l’os en fléchissant (corde d’arc), plusieurs poulies touchées ou douleur forte : échographie et avis spécialisé. Strapping en H à la reprise. Délais indicatifs : entorse de poulie 2-6 semaines, rupture complète 2-3 mois.' });

R({ id: 'dequervain', nom: 'Ténosynovite de De Quervain (pouce / poignet)', zone: 'Poignet',
  cibles: 'abductor_pollicis_longus extensor_pollicis_brevis extPoignet', resume: 'Douleur au bord du poignet côté pouce en serrant, en pinçant ou en tournant le poignet (porter un bébé, souris, kettlebell).',
  phases: [
    { nom: 'Calmer', objectif: 'Réduire les gestes en pince et poignet incliné côté pouce ; orthèse de repos si besoin.', critere: 'Pas de douleur au repos, test de Finkelstein moins douloureux.',
      exos: ['Ouverture et fermeture de la main (doigts écartés)', 'Ouverture des doigts à l’élastique'] },
    { nom: 'Renforcer', objectif: 'Tendons du pouce et du poignet, charges légères et progressives.', critere: 'Pince et rotation du poignet sans douleur.',
      exos: ['Extension du pouce à l’élastique', 'Extension des poignets', 'Curl poignets (flexion)', 'Pronation-supination au marteau', 'Écrasement de balle (grip)'] },
    { nom: 'Retour aux charges', objectif: 'Prises lourdes et portés.', critere: 'Gestes du sport sans douleur le lendemain.',
      exos: ['Pince disques (plate pinch)', 'Farmer walk', 'Rouleau à poignets (wrist roller)', 'Curl marteau'] },
  ], precautions: 'Très fréquente après une naissance : adapter la façon de porter. Pas d’amélioration après 6-8 semaines : infiltration possible (avis médical).' });

R({ id: 'carpien', nom: 'Syndrome du canal carpien', zone: 'Poignet',
  cibles: 'flechDoigts flechPoignet pouce', resume: 'Fourmillements du pouce, de l’index et du majeur, surtout la nuit ou poignet fléchi longtemps.',
  phases: [
    { nom: 'Soulager le nerf', objectif: 'Poignet neutre la nuit (attelle), glissements du nerf médian.', critere: 'Moins de réveils nocturnes.',
      exos: ['Glissement neural du nerf médian', 'Ouverture et fermeture de la main (doigts écartés)', 'Étirement des fléchisseurs du poignet'] },
    { nom: 'Mobilité et force légère', objectif: 'Mains et avant-bras sans déclencher les symptômes.', critere: 'Pas de fourmillements pendant ni après les exercices.',
      exos: ['Extension de doigts sur élastique et prise en pince', 'Extension des poignets', 'Curl poignets (flexion)', 'Écrasement de balle (grip)'] },
    { nom: 'Charges', objectif: 'Prises lourdes et appuis.', critere: 'Prise lourde sans symptômes.',
      exos: ['Farmer walk', 'Pince disques (plate pinch)', 'Rowing haltère un bras'] },
  ], precautions: 'Perte de force du pouce, fonte de la base du pouce ou fourmillements permanents : avis médical (EMG, chirurgie possible). Éviter les appuis prolongés poignet en extension (pompes, front squat) s’ils déclenchent les symptômes.' });

R({ id: 'capsulite', nom: 'Capsulite rétractile (épaule gelée)', zone: 'Épaule',
  cibles: 'coiffe deltA deltM', resume: 'Épaule douloureuse puis raide dans toutes les directions, surtout en rotation externe ; évolue sur 1 à 3 ans, fréquente entre 40 et 60 ans et chez les diabétiques.',
  phases: [
    { nom: 'Phase douloureuse', objectif: 'Soulager, garder un peu de mouvement sans jamais forcer.', critere: 'Douleur nocturne en baisse.',
      exos: ['Pendulaire de Codman', 'Flexion d’épaule assistée au bâton (couché)', 'Rotation externe assistée au bâton', 'Low row isométrique'] },
    { nom: 'Phase raide : gagner de l’amplitude', objectif: 'Étirements tenus et progressifs, sans douleur qui persiste après.', critere: 'Gain d’amplitude régulier d’une semaine à l’autre.',
      exos: ['Rotation externe assistée au bâton', 'Sleeper stretch', 'Étirement du grand dorsal (prière)', 'Wall slide (glissés au mur)', 'Dislocations à l’élastique ou au bâton', 'Rotation externe à l’élastique coude au corps'] },
    { nom: 'Récupérer la force', objectif: 'Coiffe et scapula, puis gestes au-dessus de la tête.', critere: 'Élévation et rotations proches de l’autre côté, overhead sans douleur.',
      exos: ['Full can (élévation dans le plan de la scapula)', 'Face pull', 'Rotation externe couché sur le côté', 'Développé landmine', 'Rowing bas à l’élastique'] },
  ], precautions: 'Ne pas forcer en phase douloureuse (ça l’aggrave). Infiltration ou hydrodilatation possibles (avis médical). Chez le diabétique, l’équilibre glycémique compte.' });

R({ id: 'sacro-iliaque', nom: 'Douleur sacro-iliaque / ceinture pelvienne', zone: 'Bassin',
  cibles: 'gfess transverse multifides plancher adducteurs', resume: 'Douleur basse et latérale du dos, sur la fossette du sacrum, parfois dans la fesse ; fréquente pendant et après la grossesse et chez les sportifs asymétriques.',
  phases: [
    { nom: 'Stabiliser', objectif: 'Activer transverse, plancher pelvien, fessiers et adducteurs ; éviter les positions asymétriques douloureuses.', critere: 'Marche et escaliers sans douleur.',
      exos: ['Respiration diaphragmatique 90/90', 'Contraction du plancher pelvien', 'Isométrie de hanche en adduction (balle entre les genoux)', 'Pont fessier', 'Dead bug'] },
    { nom: 'Charger', objectif: 'Symétrique puis unilatéral, anti-rotation.', critere: 'Appui unipodal et fentes courtes sans douleur.',
      exos: ['Bird dog', 'Pallof press', 'Planche latérale', 'Clamshell', 'Marche latérale à l’élastique (monster walk)', 'Hip thrust'] },
    { nom: 'Asymétrie et sport', objectif: 'Unilatéral lourd, portés, impacts.', critere: 'Course, fentes et sauts sans douleur le lendemain.',
      exos: ['Fentes arrière', 'Soulevé de terre roumain unilatéral léger', 'Suitcase carry (porté valise)', 'Step-up', 'Squat bulgare'] },
  ], precautions: 'Raideur matinale de plus de 30 min qui s’améliore en bougeant, douleur la nuit, jeune adulte : penser à une spondyloarthrite (avis rhumatologique).' });

// ---- Ajouts (01/10/2026, 2e série) : poignet, coude, épaule aux dips, sternum, pouce, ischios proximaux ----
R({ id: 'poignet-cubital', nom: 'Douleur du poignet côté petit doigt (TFCC / extenseur ulnaire du carpe)', zone: 'Poignet',
  cibles: 'extensor_carpi_ulnaris ulnar_head_of_flexor_carpi_ulnaris pronat supinat', resume: 'Douleur au bord du poignet côté petit doigt, en appui (pompes, handstand, front rack), en tournant la main ou en inclinant le poignet vers le petit doigt ; parfois un claquement.',
  phases: [
    { nom: 'Décharger', objectif: 'Supprimer les appuis douloureux (poignets neutres, poings, parallettes), garder la mobilité.', critere: 'Pas de douleur au repos ni en tournant la main sans charge.',
      exos: ['Ouverture et fermeture de la main (doigts écartés)', 'Pronation-supination au marteau', 'Écrasement de balle (grip)', 'Pompes sur parallettes (poignets neutres)'] },
    { nom: 'Renforcer les stabilisateurs', objectif: 'Extenseur et fléchisseur ulnaires du carpe, rotations de l’avant-bras.', critere: 'Rotation et inclinaison cubitale contre charge sans douleur.',
      exos: ['Inclinaison du poignet au marteau (radiale / cubitale)', 'Extension des poignets', 'Curl poignets (flexion)', 'Rouleau à poignets (wrist roller)', 'Farmer walk'] },
    { nom: 'Retour à l’appui', objectif: 'Réintroduire progressivement l’appui main à plat et les rotations chargées.', critere: 'Pompes à plat et support aux barres sans douleur le lendemain.',
      exos: ['Balancements à quatre pattes (mobilité des poignets)', 'Pompes inclinées (mains surélevées)', 'Support sur barres (straight bar support)', 'Pompes', 'Rowing haltère un bras'] },
  ], precautions: 'Claquement douloureux, instabilité, douleur après une chute sur la main ou qui ne cède pas en 6 semaines : avis médical (imagerie du TFCC). Un strap ou bracelet de poignet soulage souvent à la reprise.' });

R({ id: 'poignet-dorsal', nom: 'Douleur du dos du poignet en extension (handstand, pompes)', zone: 'Poignet',
  cibles: 'flechPoignet extPoignet', resume: 'Douleur ou pincement sur le dessus du poignet quand la main est à plat et le poignet très en extension (handstand, planche, pompes, burpees).',
  phases: [
    { nom: 'Réduire l’extension forcée', objectif: 'Appuis poignets neutres le temps que ça calme, mobilité douce.', critere: 'Plus de pincement à la mise en appui légère.',
      exos: ['Pompes sur parallettes (poignets neutres)', 'Balancements à quatre pattes (mobilité des poignets)', 'Étirement des fléchisseurs du poignet', 'Écrasement de balle (grip)'] },
    { nom: 'Renforcer l’avant-bras', objectif: 'Fléchisseurs et extenseurs forts pour « tenir » le poignet en appui.', critere: 'Appui à quatre pattes chargé sans douleur.',
      exos: ['Curl poignets (flexion)', 'Extension des poignets', 'Dorsiflexion de poignet en appui (préparation handstand)', 'Rouleau à poignets (wrist roller)'] },
    { nom: 'Appui progressif', objectif: 'Augmenter l’angle et la charge en appui main à plat.', critere: 'Handstand et planche lean sans douleur le lendemain.',
      exos: ['Pompes', 'Planche lean', 'Wall walk', 'Équilibre en appui renversé (handstand)'] },
  ], precautions: 'Douleur après une chute, gonflement sur le dos du poignet ou douleur dans la tabatière (base du pouce) : avis médical (fracture du scaphoïde, kyste). Échauffer les poignets avant chaque séance d’appuis.' });

R({ id: 'biceps-distal', nom: 'Tendinopathie distale du biceps (pli du coude)', zone: 'Coude',
  cibles: 'biceps brachial supinat', resume: 'Douleur au pli du coude en tirant paume vers soi (chin-up, curl, rowing supination) ou en tournant la main (tournevis).',
  phases: [
    { nom: 'Calmer et charger sans douleur', objectif: 'Isométriques antalgiques, éviter les tractions supination et les curls lourds.', critere: 'Isométrie indolore, pas de douleur au repos.',
      exos: ['Curl isométrique coude à 90°', 'Pronation-supination au marteau', 'Curl marteau', 'Rowing bas à l’élastique'] },
    { nom: 'Renforcer progressivement', objectif: 'Curls lents, puis supination chargée.', critere: 'Curl barre modéré et supination contre résistance sans douleur.',
      exos: ['Curl haltères alterné', 'Curl incliné haltères', 'Curl Zottman', 'Tractions prise neutre', 'Rowing haltère un bras'] },
    { nom: 'Retour aux tractions', objectif: 'Supination et charges lourdes, puis lestées.', critere: 'Chin-ups au poids du corps sans douleur le lendemain.',
      exos: ['Tractions excentriques', 'Chin-up (traction supination)', 'Curl barre', 'Tractions lestées'] },
  ], precautions: 'Douleur brutale avec « claquement », bleu au pli du coude ou biceps qui remonte (signe de Popeye inversé) : rupture possible, avis chirurgical rapide (dans les 2-3 semaines).' });

R({ id: 'triceps', nom: 'Tendinopathie du triceps (arrière du coude)', zone: 'Coude',
  cibles: 'triceps ancone', resume: 'Douleur à la pointe du coude en poussant bras tendu (dips, extensions, développé prise serrée), surtout en fin d’extension.',
  phases: [
    { nom: 'Calmer', objectif: 'Isométriques, retirer temporairement dips et skull crushers.', critere: 'Isométrie indolore.',
      exos: ['Pushdown isométrique (coude à 90°)', 'Extension triceps poulie (pushdown)', 'Pompes inclinées (mains surélevées)'] },
    { nom: 'Renforcer', objectif: 'Extensions lentes, amplitude croissante.', critere: 'Extensions modérées et pompes sans douleur.',
      exos: ['Pushdown à la corde', 'Extension triceps poulie au-dessus de la tête', 'Développé couché prise serrée', 'Pompes', 'Floor press'] },
    { nom: 'Retour aux poussées lourdes', objectif: 'Dips et extensions lourdes progressivement.', critere: 'Dips au poids du corps sans douleur le lendemain.',
      exos: ['Support sur barres (straight bar support)', 'Dips machine', 'Dips', 'Barre au front (skull crusher)'] },
  ], precautions: 'Gonflement en « balle » à la pointe du coude : bursite olécrânienne (ne pas appuyer dessus ; rouge et chaud = avis médical). Perte de force brutale en extension : rupture possible.' });

R({ id: 'nerf-ulnaire', nom: 'Irritation du nerf ulnaire au coude (décharges vers le petit doigt)', zone: 'Coude',
  cibles: 'flechPoignet main', resume: 'Décharges électriques ou fourmillements vers l’annulaire et le petit doigt (« coup de jus »), coude plié longtemps, appui sur le coude, tractions ou dips.',
  phases: [
    { nom: 'Protéger le nerf', objectif: 'Éviter coude plié longtemps (téléphone, nuit) et appui sur le coude ; glissements doux.', critere: 'Moins de décharges au quotidien, nuits calmes.',
      exos: ['Glissement neural du nerf ulnaire', 'Ouverture et fermeture de la main (doigts écartés)', 'Ouverture des doigts à l’élastique'] },
    { nom: 'Force sans irritation', objectif: 'Main et avant-bras en évitant la flexion maximale du coude.', critere: 'Pas de décharge pendant ni après les exercices.',
      exos: ['Écrasement de balle (grip)', 'Curl poignets (flexion)', 'Extension des poignets', 'Rowing bas à l’élastique'] },
    { nom: 'Retour aux tirages et appuis', objectif: 'Tractions et dips en amplitude contrôlée.', critere: 'Séance complète sans fourmillements le lendemain.',
      exos: ['Rowing haltère un bras', 'Tractions prise neutre', 'Support sur barres (straight bar support)', 'Dips machine'] },
  ], precautions: 'Faiblesse de la main (difficulté à écarter les doigts, à pincer), fonte des muscles entre pouce et index ou fourmillements permanents : avis médical (EMG). Décharges qui partent du cou : penser à une origine cervicale.' });

R({ id: 'long-biceps', nom: 'Douleur à l’avant de l’épaule aux dips (tendon du long biceps)', zone: 'Épaule',
  cibles: 'bicL deltA coiffe pecM', resume: 'Douleur ou « coup de jus » à l’avant de l’épaule en bas des dips, au développé couché, aux pompes profondes ou en muscle up.',
  phases: [
    { nom: 'Réduire l’amplitude', objectif: 'Supprimer temporairement le bas des dips et les étirements de l’avant de l’épaule ; garder des poussées indolores.', critere: 'Pas de douleur à la palpation légère ni aux pompes inclinées.',
      exos: ['Rotation externe à l’élastique coude au corps', 'Rotation interne à l’élastique', 'Pompes inclinées (mains surélevées)', 'Curl marteau', 'Low row isométrique'] },
    { nom: 'Centrer la tête de l’humérus', objectif: 'Coiffe, scapula et posture thoracique.', critere: 'Pompes et développé modéré sans douleur.',
      exos: ['Face pull', 'Push-up plus', 'Rotation externe couché sur le côté', 'Extension thoracique sur rouleau', 'Pompes', 'Développé couché haltères'] },
    { nom: 'Retour aux dips', objectif: 'Amplitude puis charge progressives, en gardant les épaules basses et le buste légèrement penché.', critere: 'Dips profonds sans douleur le lendemain.',
      exos: ['Support sur barres (straight bar support)', 'Dips machine', 'Dips', 'Dips lestés'] },
  ], precautions: 'Douleur avec claquement au-dessus de la tête, perte de force, ou boule dans le bras (rupture du long biceps) : avis médical. Ne pas descendre plus bas que l’amplitude indolore aux dips.' });

R({ id: 'acromio-claviculaire', nom: 'Douleur acromio-claviculaire (dessus de l’épaule)', zone: 'Épaule',
  cibles: 'trapS deltA deltM pecH', resume: 'Douleur pointue sur le dessus de l’épaule (au bout de la clavicule) aux dips, au développé couché large, aux écartés ou en ramenant le bras devant soi.',
  phases: [
    { nom: 'Éviter le cisaillement', objectif: 'Supprimer dips, écartés profonds, développé prise large et bras croisé devant.', critere: 'Pas de douleur au quotidien ni bras croisé sans charge.',
      exos: ['Low row isométrique', 'Rotation externe à l’élastique coude au corps', 'Rowing bas à l’élastique', 'Floor press'] },
    { nom: 'Renforcer en amplitude sûre', objectif: 'Développés en amplitude réduite, scapula et coiffe.', critere: 'Floor press et pompes sans douleur.',
      exos: ['Face pull', 'Développé landmine', 'Pompes', 'Rowing haltère un bras', 'Push-up plus'] },
    { nom: 'Retour aux mouvements à risque', objectif: 'Réintroduire développé couché et dips, prise plus serrée, amplitude progressive.', critere: 'Développé et dips sans douleur le lendemain.',
      exos: ['Développé couché haltères', 'Développé couché barre', 'Dips machine', 'Dips'] },
  ], precautions: 'Après une chute sur l’épaule avec déformation (marche d’escalier au bout de la clavicule) : avis médical (luxation acromio-claviculaire). Prise plus serrée et descente moins profonde au développé sont souvent la solution durable.' });

R({ id: 'sternum', nom: 'Douleur au sternum ou aux côtes aux dips (costochondrite)', zone: 'Thorax',
  cibles: 'pecM pecB intercostaux', resume: 'Douleur vive sur le sternum ou à la jonction côtes-sternum en bas des dips, au développé ou en respirant fort ; souvent après une augmentation de volume.',
  phases: [
    { nom: 'Calmer', objectif: 'Retirer dips et écartés profonds, respiration et mobilité thoracique.', critere: 'Pas de douleur en respirant profondément ni à la pression légère.',
      exos: ['Respiration diaphragmatique 90/90', 'Ouverture de la cage thoracique couché (respiration latérale)', 'Rotation thoracique (open book)', 'Extension thoracique sur rouleau'] },
    { nom: 'Recharger les pectoraux', objectif: 'Poussées en amplitude réduite.', critere: 'Pompes complètes sans douleur.',
      exos: ['Pompes inclinées (mains surélevées)', 'Floor press', 'Pompes', 'Développé couché haltères'] },
    { nom: 'Retour aux dips', objectif: 'Amplitude puis charge progressives.', critere: 'Dips au poids du corps sans douleur le lendemain.',
      exos: ['Support sur barres (straight bar support)', 'Dips machine', 'Dips'] },
  ], precautions: 'URGENCE : douleur thoracique avec essoufflement, sueurs, douleur dans le bras gauche ou la mâchoire, ou à l’effort sans lien avec un mouvement précis — appeler le 15. Douleur après un choc : écarter une fracture de côte.' });

R({ id: 'pouce-skieur', nom: 'Entorse du pouce (ligament collatéral ulnaire, « pouce du skieur »)', zone: 'Main',
  cibles: 'pouce', resume: 'Douleur à la base du pouce côté index après une chute main ouverte ou un pouce tordu (ski, sports de ballon, grip qui lâche).',
  phases: [
    { nom: 'Protéger', objectif: 'Attelle ou strapping du pouce, mobilité des autres doigts.', critere: 'Pas de douleur au repos, pince légère tolérée.',
      exos: ['Ouverture et fermeture de la main (doigts écartés)', 'Ouverture des doigts à l’élastique'] },
    { nom: 'Stabiliser', objectif: 'Muscles du pouce, pince contrôlée pouce arrondi.', critere: 'Pince pouce-index forte sans douleur.',
      exos: ['Pince pouce-index isométrique (pâte ou balle)', 'Abduction du pouce à l’élastique', 'Extension du pouce à l’élastique', 'Écrasement de balle (grip)'] },
    { nom: 'Retour aux prises', objectif: 'Prises lourdes, crochet, pince.', critere: 'Prise de barre et pince sans douleur le lendemain.',
      exos: ['Pince disques (plate pinch)', 'Farmer walk', 'Suspension à la barre (dead hang)'] },
  ], precautions: 'Pouce instable (il « baille » en écartant) ou boule à la base du pouce : rupture complète possible (lésion de Stener), avis chirurgical rapide. Strapping à la reprise des sports de prise.' });

R({ id: 'rhizarthrose', nom: 'Rhizarthrose (douleur à la base du pouce)', zone: 'Main',
  cibles: 'pouce', resume: 'Douleur à la base du pouce (près du poignet) en pinçant, en ouvrant un bocal ou en tenant une barre ; fréquente après 50 ans, surtout chez la femme.',
  phases: [
    { nom: 'Soulager', objectif: 'Orthèse de repos si besoin, éviter la pince forte pouce « cassé » en arrière.', critere: 'Douleur au quotidien en baisse.',
      exos: ['Ouverture et fermeture de la main (doigts écartés)', 'Abduction du pouce à l’élastique'] },
    { nom: 'Stabiliser la base du pouce', objectif: 'Renforcer les muscles qui centrent le pouce (abducteurs, premier interosseux dorsal).', critere: 'Pince pouce arrondi sans douleur.',
      exos: ['Abduction du pouce à l’élastique', 'Pince pouce-index isométrique (pâte ou balle)', 'Extension du pouce à l’élastique', 'Écrasement de balle (grip)'] },
    { nom: 'Prises adaptées', objectif: 'Prises larges plutôt que pinces fines ; grips épais à la salle.', critere: 'Séance de tirage sans douleur le lendemain.',
      exos: ['Farmer walk', 'Rowing haltère un bras', 'Rouleau à poignets (wrist roller)'] },
  ], precautions: 'C’est une arthrose : le but est de soulager et de garder la fonction. Gonflement important ou douleur nocturne : avis médical (infiltration ou orthèse sur mesure possibles).' });

R({ id: 'ischios-proximal', nom: 'Tendinopathie proximale des ischio-jambiers (douleur sous la fesse)', zone: 'Cuisse',
  cibles: 'ischios gfess', resume: 'Douleur profonde sous la fesse (ischion) assis sur une surface dure, en montée, au sprint ou au soulevé de terre ; fréquente chez les coureurs.',
  phases: [
    { nom: 'Calmer la compression', objectif: 'Éviter étirements des ischios et position assise prolongée sur dur ; isométriques hanche peu fléchie.', critere: 'Isométrie indolore, assis tolérable 30 min.',
      exos: ['Pont ischios isométrique (talons sur banc)', 'Pont fessier', 'Leg curl couché'] },
    { nom: 'Charger en augmentant la flexion de hanche', objectif: 'Force des ischios, d’abord hanche tendue puis de plus en plus fléchie.', critere: 'Soulevé de terre roumain modéré sans douleur le lendemain.',
      exos: ['Hip thrust', 'Glissade ischios (slider curl)', 'Soulevé de terre roumain', 'Bonjour (good morning)', 'Swing kettlebell'] },
    { nom: 'Vitesse', objectif: 'Charge lourde et rapide, puis sprint.', critere: 'Sprint et soulevé lourd sans douleur le lendemain.',
      exos: ['Nordic curl (ischios nordiques)', 'Soulevé de terre unilatéral (une jambe)', 'Retour à la course (alternance marche-course)', 'Sprint'] },
  ], precautions: 'Les étirements des ischios et le travail en flexion profonde de hanche aggravent souvent au début (ils compriment le tendon) : les réintroduire en dernier. Douleur brutale avec bleu sous la fesse : arrachement possible, avis médical.' });
