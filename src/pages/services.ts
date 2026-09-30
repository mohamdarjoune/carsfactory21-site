/*
 * Une page par prestation, pour être trouvé sur Google (« carrossier [ville] », « vidange [ville] »…).
 * Contenu descriptif du métier uniquement : aucun prix, délai, avis ni chiffre inventé.
 * Chaque page est pré-rendue (routes.tsx) et apparaît dans le plan du site.
 */

export type Icone = 'carrosserie' | 'peinture' | 'sinistre' | 'mecanique' | 'entretien' | 'diagnostic' | 'covering' | 'depannage'

export type PagePrestation = {
  chemin: string
  famille: 'Carrosserie' | 'Mécanique' | 'Services'
  nom: string
  resume: string                  // une ligne (grille de l'accueil)
  icone: Icone
  titre: string                   // <title> pour Google (≤ 60 caractères)
  description: string             // 70 à 160 caractères
  h1: string
  accroche: string
  interventions: string[]         // ce qui est pris en charge
  deroulement: [string, string][]
  faq: [string, string][]
  liees: string[]
}

export const PRESTATIONS: PagePrestation[] = [
  {
    chemin: '/carrosserie', famille: 'Carrosserie', icone: 'carrosserie',
    nom: 'Carrosserie', resume: 'Chocs, rayures, bosses : la carrosserie remise à neuf.',
    titre: 'Carrosserie auto près de Dijon | Cars Factory 21',
    description: 'Réparation de carrosserie toutes marques : chocs, bosses, rayures, pare-chocs et éléments remplacés. Devis sur photos. Cars Factory 21 à Chevigny-Saint-Sauveur.',
    h1: 'Réparation de carrosserie',
    accroche: 'Un accrochage sur un parking, une bosse, un pare-chocs fendu : l’atelier redresse ou remplace les éléments abîmés pour rendre à votre voiture son aspect d’origine.',
    interventions: ['Redressage et débosselage', 'Remplacement de pare-chocs, ailes, portières, capots', 'Réparation de rayures et d’éclats', 'Remplacement de rétroviseurs et d’optiques', 'Préparation avant peinture'],
    deroulement: [['Photos ou passage à l’atelier', 'Vous montrez les dégâts ; un devis détaillé vous est remis.'], ['Réparation', 'Redressage ou remplacement des pièces, puis peinture si besoin.'], ['Contrôle et restitution', 'Vérification des jeux, des finitions et de la teinte avant de vous rendre le véhicule.']],
    faq: [['Puis-je avoir un devis sans venir au garage ?', 'Oui : envoyez des photos des dégâts avec le formulaire de devis. Une première estimation vous est donnée, confirmée ensuite en voyant la voiture.'], ['Faut-il passer par mon assurance ?', 'Pas obligatoirement. Si le sinistre est couvert, l’atelier vous aide dans les démarches avec votre assureur.']],
    liees: ['/peinture-automobile', '/reparation-apres-sinistre'],
  },
  {
    chemin: '/peinture-automobile', famille: 'Carrosserie', icone: 'peinture',
    nom: 'Peinture automobile', resume: 'Une teinte identique à l’origine, finition vernie.',
    titre: 'Peinture automobile près de Dijon | Cars Factory 21',
    description: 'Peinture auto élément par élément ou complète, teinte identique à l’origine et vernis de finition. Cars Factory 21 à Chevigny-Saint-Sauveur, près de Dijon.',
    h1: 'Peinture automobile',
    accroche: 'Après une réparation ou pour effacer les traces du temps, la peinture est refaite à la teinte exacte de votre véhicule, puis vernie pour la protéger.',
    interventions: ['Peinture d’un élément après réparation', 'Raccords de teinte sur les éléments voisins', 'Reprise de rayures profondes', 'Vernis de protection', 'Rénovation de l’aspect (polissage)'],
    deroulement: [['Recherche de la teinte', 'À partir du code peinture du véhicule, ajustée à l’usure réelle.'], ['Préparation', 'Ponçage, apprêt et masquage des zones à protéger.'], ['Application et séchage', 'Peinture, vernis, puis contrôle de la finition à la lumière.']],
    faq: [['La couleur sera-t-elle identique ?', 'La teinte est préparée d’après le code peinture de votre voiture et ajustée si la peinture d’origine a vieilli, pour éviter une différence visible.'], ['Peut-on peindre seulement une partie ?', 'Oui, un seul élément peut être repeint, avec un raccord progressif sur les éléments voisins si nécessaire.']],
    liees: ['/carrosserie', '/reparation-apres-sinistre'],
  },
  {
    chemin: '/reparation-apres-sinistre', famille: 'Carrosserie', icone: 'sinistre',
    nom: 'Sinistre et assurance', resume: 'Accident, grêle, vandalisme : on vous accompagne.',
    titre: 'Réparation après sinistre et assurance | Cars Factory 21',
    description: 'Accident, grêle, vandalisme : réparation de votre véhicule et aide pour les démarches avec votre assurance. Cars Factory 21 à Chevigny-Saint-Sauveur.',
    h1: 'Réparation après un sinistre',
    accroche: 'Après un accident ou des dégâts, les démarches paraissent longues. L’atelier répare votre véhicule et vous aide à constituer le dossier pour votre assureur.',
    interventions: ['Réparations après accident', 'Dégâts de grêle', 'Vandalisme et effraction', 'Bris d’éléments de carrosserie', 'Préparation du passage de l’expert'],
    deroulement: [['Déclaration', 'Vous déclarez le sinistre à votre assurance ; l’atelier vous aide à préparer les photos et informations.'], ['Expertise', 'Le véhicule est présenté à l’expert mandaté par l’assurance si besoin.'], ['Réparation', 'Les travaux validés sont réalisés, puis le véhicule vous est rendu.']],
    faq: [['Suis-je libre de choisir mon garage ?', 'Oui, en règle générale vous pouvez choisir le réparateur de votre choix. Vérifiez les conditions de votre contrat.'], ['Qui paie la franchise ?', 'Elle dépend de votre contrat d’assurance et des circonstances du sinistre : votre assureur vous l’indique.']],
    liees: ['/carrosserie', '/peinture-automobile'],
  },
  {
    chemin: '/mecanique-generale', famille: 'Mécanique', icone: 'mecanique',
    nom: 'Mécanique générale', resume: 'Freins, embrayage, distribution, suspensions.',
    titre: 'Garage mécanique à Chevigny | Cars Factory 21',
    description: 'Mécanique générale : freinage, embrayage, courroie de distribution, suspensions, échappement. Garage à Chevigny-Saint-Sauveur, près de Dijon.',
    h1: 'Mécanique générale',
    accroche: 'Un bruit au freinage, un embrayage qui patine, une courroie à changer : l’atelier diagnostique la panne et vous explique la réparation avant d’intervenir.',
    interventions: ['Freinage : plaquettes, disques, liquide', 'Embrayage', 'Courroie ou chaîne de distribution', 'Amortisseurs et suspensions', 'Échappement', 'Batterie et démarrage'],
    deroulement: [['Diagnostic', 'Recherche de l’origine du problème, essai si nécessaire.'], ['Devis', 'Vous validez les travaux et le prix avant toute intervention.'], ['Réparation et essai', 'Remplacement des pièces, puis vérification sur route.']],
    faq: [['Le garage répare-t-il toutes les marques ?', '[À confirmer avec le garage.]'], ['Puis-je fournir mes pièces ?', '[À confirmer avec le garage.]']],
    liees: ['/entretien-vidange', '/diagnostic-automobile'],
  },
  {
    chemin: '/entretien-vidange', famille: 'Mécanique', icone: 'entretien',
    nom: 'Entretien et vidange', resume: 'Révision, vidange, filtres, selon le carnet.',
    titre: 'Entretien et vidange près de Dijon | Cars Factory 21',
    description: 'Vidange, remplacement des filtres, révision selon les préconisations du constructeur et contrôle des points de sécurité. Cars Factory 21, Chevigny.',
    h1: 'Entretien et vidange',
    accroche: 'Un entretien régulier évite les pannes coûteuses. La révision suit les préconisations du constructeur de votre véhicule.',
    interventions: ['Vidange et huile adaptée au moteur', 'Filtres à huile, à air, à carburant, d’habitacle', 'Contrôle des niveaux', 'Contrôle des freins, pneus et éclairage', 'Préparation au contrôle technique'],
    deroulement: [['Rendez-vous', 'Vous choisissez un créneau ; indiquez le kilométrage et le modèle.'], ['Révision', 'Opérations prévues par le constructeur pour ce kilométrage.'], ['Compte rendu', 'Ce qui a été fait, et ce qui sera à prévoir.']],
    faq: [['La révision chez un garage indépendant conserve-t-elle la garantie constructeur ?', 'En principe oui, si l’entretien respecte les préconisations du constructeur et utilise des pièces de qualité équivalente. Conservez les factures.'], ['Tous les combien faire la vidange ?', 'Cela dépend du moteur et de l’usage : le carnet d’entretien de votre véhicule l’indique.']],
    liees: ['/mecanique-generale', '/diagnostic-automobile'],
  },
  {
    chemin: '/diagnostic-automobile', famille: 'Mécanique', icone: 'diagnostic',
    nom: 'Diagnostic électronique', resume: 'Voyant allumé ? Lecture des codes défaut.',
    titre: 'Diagnostic auto, voyant allumé | Cars Factory 21',
    description: 'Voyant moteur allumé, perte de puissance, message d’erreur : lecture des codes défaut à la valise et recherche de la cause. Cars Factory 21, Chevigny.',
    h1: 'Diagnostic électronique',
    accroche: 'Un voyant qui s’allume au tableau de bord n’indique pas toujours la pièce à changer. La lecture des codes défaut est le point de départ pour trouver la vraie cause.',
    interventions: ['Lecture et effacement des codes défaut', 'Voyant moteur, ABS, airbag', 'Perte de puissance, mode dégradé', 'Contrôle des capteurs', 'Réinitialisation après intervention'],
    deroulement: [['Lecture', 'Branchement de l’outil de diagnostic sur la prise du véhicule.'], ['Analyse', 'Interprétation des codes et contrôles complémentaires.'], ['Explication', 'Vous savez ce qui est en cause et ce qu’il faut faire.']],
    faq: [['Peut-on simplement effacer le voyant ?', 'On peut effacer le code, mais s’il y a une vraie panne, le voyant reviendra. Le diagnostic sert à trouver la cause.'], ['Mon véhicule est-il compatible ?', '[À confirmer avec le garage.]']],
    liees: ['/mecanique-generale', '/entretien-vidange'],
  },
  {
    chemin: '/covering', famille: 'Carrosserie', icone: 'covering',
    nom: 'Covering', resume: 'Changer de couleur ou protéger sa peinture avec un film.',
    titre: 'Covering voiture près de Dijon | Cars Factory 21',
    description: 'Covering automobile : changement de couleur, finitions mates ou brillantes, pose partielle ou complète d’un film adhésif. Cars Factory 21, Chevigny.',
    h1: 'Covering automobile',
    accroche: 'Le covering habille la carrosserie d’un film adhésif : nouvelle couleur, finition mate, satinée ou brillante, sans repeindre la voiture.',
    interventions: ['Covering complet (changement de couleur)', 'Covering partiel : toit, capot, rétroviseurs', 'Finitions mates, satinées, brillantes', 'Marquage de véhicules professionnels', '[Autres poses proposées : à confirmer avec le garage]'],
    deroulement: [['Choix', 'Couleur, finition et parties du véhicule à habiller.'], ['Préparation', 'Nettoyage et dégraissage minutieux de la carrosserie.'], ['Pose', 'Application du film, découpes et finitions des bords.']],
    faq: [['Le covering abîme-t-il la peinture ?', 'Posé sur une peinture d’origine en bon état, le film se retire sans l’abîmer. Sur une peinture déjà écaillée, il vaut mieux la réparer avant.'], ['Combien de temps dure un covering ?', '[À confirmer avec le garage : durée de vie selon le film utilisé.]']],
    liees: ['/peinture-automobile', '/carrosserie'],
  },
  {
    chemin: '/depannage-auto', famille: 'Services', icone: 'depannage',
    nom: 'Dépannage 24 h/24', resume: 'Panne ou accident : dépannage jour et nuit, 7 j/7.',
    titre: 'Dépannage auto 24 h/24 près de Dijon | Cars Factory 21',
    description: 'Voiture en panne ou accidentée ? Dépannage et remorquage 24 h/24 et 7 j/7 depuis Chevigny-Saint-Sauveur, près de Dijon. Appelez le 07 59 56 38 39.',
    h1: 'Dépannage auto 24 h/24',
    accroche: 'Une panne sur la route, une voiture qui ne démarre plus, un accident : le garage assure le dépannage et le remorquage jour et nuit, 7 jours sur 7.',
    interventions: ['Remorquage vers le garage', 'Véhicule en panne ou accidenté', 'Voiture qui ne démarre pas', 'Réparation au garage après le remorquage', '[Zone d’intervention : à confirmer avec le garage]'],
    deroulement: [['Vous appelez', 'Indiquez où vous êtes, le modèle de votre voiture et ce qui s’est passé.'], ['Remorquage', 'Le véhicule est chargé et conduit au garage.'], ['Diagnostic et devis', 'La panne est recherchée ; vous validez le devis avant la réparation.']],
    faq: [['Que faire en attendant la dépanneuse ?', 'Mettez-vous en sécurité : gilet jaune, triangle de signalisation, et restez derrière la glissière sur une voie rapide.'], ['Mon assurance prend-elle en charge le dépannage ?', 'Beaucoup de contrats incluent une assistance : vérifiez le vôtre ou appelez votre assureur.']],
    liees: ['/reparation-apres-sinistre', '/mecanique-generale'],
  },
]

export const prestation = (chemin: string) => PRESTATIONS.find((p) => p.chemin === chemin)
