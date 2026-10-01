// Fiches des os : description courte + mots-clés pour retrouver les muscles qui s'y attachent
// (recherche dans les origines et insertions des fiches muscles, sans accents ni majuscules).
window.OS = {};
const O = (k, d, mots) => { window.OS[k] = { d, mots }; };

// Crâne et face
O('frontal_bone', 'Os du front ; forme le toit des orbites.', ['frontal', 'arcade sourciliere', 'epicranienne']);
O('parietal_bone', 'Os pair du sommet et des côtés du crâne.', ['parietal']);
O('occipital_bone', 'Os de l’arrière du crâne, percé du trou occipital. Point d’attache des muscles de la nuque.', ['occipital', 'nucale']);
O('temporal_bone', 'Os des tempes ; contient l’oreille et porte le processus mastoïde.', ['temporal', 'temporale', 'mastoide', 'styloide du temporal', 'arcade zygomatique', 'petreuse']);
O('sphenoid_bone', 'Os en forme de papillon à la base du crâne.', ['sphenoide', 'pterygoide', 'aile du sphenoide']);
O('ethmoid', 'Petit os entre les orbites, à la racine du nez.', ['ethmoide']);
O('mandible', 'Mâchoire inférieure, seul os mobile du crâne (articulation temporo-mandibulaire).', ['mandibule', 'mentonniere', 'coronoide de la mandibule', 'condylaire']);
O('maxilla', 'Mâchoire supérieure ; porte les dents du haut.', ['maxillaire', 'plancher de l’orbite', 'bord inferieur de l’orbite']);
O('zygomatic_bone', 'Os de la pommette.', ['zygomatique']);
O('nasal_bone', 'Petit os de l’arête du nez.', ['os nasal']);
O('lacrimal_bone', 'Petit os de la paroi interne de l’orbite.', ['lacrymal']);
O('palatine_bone', 'Os du fond du palais.', ['palatin', 'palatine']);
O('vomer', 'Os de la cloison nasale.', ['vomer']);
O('hyoid_bone', 'Os en fer à cheval sous la mandibule, sans articulation avec un autre os. Ancrage des muscles de la déglutition.', ['hyoide']);

// Colonne
O('atlas', 'Première vertèbre cervicale (C1) : porte le crâne, permet le « oui ».', ['atlas', 'c1 ']);
O('axis', 'Deuxième vertèbre cervicale (C2) : sa dent permet le « non ».', ['axis', 'c2']);

// Thorax
O('manubrium', 'Partie haute du sternum ; s’articule avec les clavicules.', ['manubrium', 'sternum']);
O('body_of_sternum', 'Corps du sternum ; reçoit les cartilages des côtes.', ['sternum', 'cartilages des cotes', 'cartilages costaux']);
O('xiphoid_process', 'Pointe inférieure du sternum.', ['xiphoide']);

// Ceinture scapulaire et membre supérieur
O('clavicle', 'Os en S entre sternum et scapula ; seul lien osseux entre le bras et le tronc.', ['clavicule']);
O('scapula', 'Omoplate : plaque triangulaire qui glisse sur le thorax. Ancrage de 17 muscles dont la coiffe des rotateurs.', ['scapula', 'acromion', 'coracoide', 'glenoidal', 'fosse supra', 'fosse infra', 'fosse subscapulaire', 'epine de la scapula']);
O('humerus', 'Os du bras ; sa tête s’articule avec la glène de la scapula.', ['humerus', 'humerale', 'tubercule majeur', 'tubercule mineur', 'intertuberculaire', 'deltoidienne', 'epicondyle', 'tubercule de l’humerus']);
O('radius', 'Os latéral de l’avant-bras (côté pouce) ; tourne autour de l’ulna en prono-supination.', ['radius', 'radiale']);
O('ulna', 'Os médial de l’avant-bras (cubitus) ; forme l’olécrâne (pointe du coude).', ['ulna', 'olecrane', 'coronoide de l’ulna', 'crete du supinateur']);
O('scaphoid', 'Os du carpe côté pouce ; la fracture la plus fréquente du poignet (chute main en avant).', ['scaphoide']);
O('lunate', 'Os central de la première rangée du carpe.', ['lunatum']);
O('pisiform', 'Petit os en pois dans le tendon du fléchisseur ulnaire du carpe.', ['pisiforme']);
O('trapezium', 'Os du carpe à la base du pouce (articulation trapézo-métacarpienne).', ['trapeze']);
O('trapezoid', 'Petit os du carpe à la base de l’index.', ['trapezoide']);
O('capitate', 'Le plus gros os du carpe.', ['capitatum']);
O('hamate', 'Os du carpe à crochet (hamulus) côté auriculaire.', ['hamatum', 'hamulus']);

// Bassin et membre inférieur
O('sacrum', 'Os triangulaire formé de 5 vertèbres soudées ; s\u2019articule avec les os coxaux (articulations sacro-iliaques) et porte la colonne.', ['sacrum', 'sacres', 'sacree']);
O('triquetral', 'Os pyramidal de la première rangée du carpe, côté auriculaire ; porte le pisiforme.', ['triquetrum', 'pyramidal']);
O('hip_bone', 'Os coxal : ilium, ischium et pubis soudés. Forme le bassin avec le sacrum.', ['ilium', 'iliaque', 'ischiatique', 'ischio', 'pubis', 'pubien', 'pubienne', 'acetabulum', 'obturatrice', 'pecten', 'epine iliaque']);
O('femur', 'Os de la cuisse, le plus long et le plus solide du corps.', ['femur', 'trochanter', 'ligne apre', 'condyle medial du femur', 'condyle lateral du femur', 'glutéale', 'glutale', 'tubercule de l’adducteur', 'intertrochanter', 'ligne pectineale']);
O('patella', 'Rotule : os sésamoïde dans le tendon du quadriceps ; augmente son bras de levier.', ['patella']);
O('tibia', 'Os principal de la jambe, porte le poids du corps.', ['tibia', 'tibiale', 'tibiales', 'patte d’oie', 'gerdy', 'ligne du soleaire']);
O('fibula', 'Péroné : os fin latéral de la jambe ; stabilise la cheville (malléole latérale).', ['fibula']);
O('calcaneus', 'Os du talon ; reçoit le tendon d’Achille.', ['calcaneus', 'calcaneen']);
O('talus', 'Astragale : relie la jambe au pied (articulation de la cheville). Aucun muscle ne s’y insère.', ['talus']);
O('navicular_bone_of_foot', 'Os en barque du bord interne du pied ; clé de la voûte.', ['naviculaire']);
O('cuboid_bone', 'Os cubique du bord externe du pied.', ['cuboide']);
O('medial_cuneiform_bone', 'Os cunéiforme interne.', ['cuneiforme medial', 'cuneiformes']);
O('intermediate_cuneiform_bone', 'Os cunéiforme du milieu.', ['cuneiformes']);
O('lateral_cuneiform_bone', 'Os cunéiforme externe.', ['cuneiforme lateral', 'cuneiformes']);
O('sesamoid_bone_of_foot', 'Petits os sous la tête du 1er métatarsien, dans le court fléchisseur de l’hallux.', ['sesamoide']);

// Règles pour les séries (vertèbres, côtes, métacarpiens, métatarsiens, phalanges)
window.osFiche = (k, fr) => {
  if (window.OS[k]) return window.OS[k];
  const ord = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12 };
  let m;
  if ((m = k.match(/^(\w+?)_(cervical|thoracic|lumbar)_vertebra$/))) {
    const n = ord[m[1]], z = { cervical: 'C', thoracic: 'T', lumbar: 'L' }[m[2]];
    const d = { cervical: 'Vertèbre du cou : petite, très mobile.', thoracic: 'Vertèbre dorsale : porte une paire de côtes, peu mobile en flexion.', lumbar: 'Vertèbre lombaire : la plus massive, supporte les charges ; zone des hernies (L4-L5, L5-S1).' }[m[2]];
    return { d, mots: [z + n, 'vertebres', 'vertebraux', 'epineux', 'transverses', 'lombaires', 'thoraciques', 'cervicaux'] };
  }
  if ((m = k.match(/^(\w+?)_rib$/))) { const n = ord[m[1]]; return { d: n <= 7 ? 'Vraie côte : reliée directement au sternum.' : n <= 10 ? 'Fausse côte : rattachée au sternum par le cartilage de la côte du dessus.' : 'Côte flottante : non reliée au sternum.', mots: ['cotes', 'cote', n + 'e cote', 'costaux'] }; }
  if ((m = k.match(/^(\w+?)_metacarpal_bone$/))) { const n = ord[m[1]]; return { d: 'Os de la paume (métacarpien n° ' + n + ').', mots: [n + 'e metacarpien', 'metacarpiens', n === 1 ? '1er metacarpien' : 'xx'] }; }
  if ((m = k.match(/^(\w+?)_metatarsal_bone$/))) { const n = ord[m[1]]; return { d: 'Os de l’avant-pied (métatarsien n° ' + n + ').', mots: [n + 'e metatarsien', 'metatarsiens', n === 1 ? '1er metatarsien' : 'xx'] }; }
  if (/phalanx/.test(k)) { const pos = k.startsWith('proximal') ? 'proximale' : k.startsWith('middle') ? 'moyenne' : 'distale';
    const pied = /toe/.test(k); return { d: 'Phalange ' + pos + (pied ? ' d’un orteil.' : ' d’un doigt.'), mots: ['phalange ' + pos, 'phalanges ' + pos + 's'] }; }
  return { d: '', mots: [] };
};
