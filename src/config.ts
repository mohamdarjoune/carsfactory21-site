/*
 * Toutes les informations du garage, au même endroit.
 * Sources : informations transmises par Simo (annuaire des entreprises, Pappers, fiche Google), 30/09/2026.
 * Les valeurs entre crochets [ ] sont À REMPLIR avec le client : rien n'a été inventé.
 */

export const site = {
  nom: 'Cars Factory 21',
  metier: 'Carrosserie, peinture et mécanique',
  // Adresse du site en ligne : à confirmer (nom de domaine pas encore choisi)
  siteUrl: 'https://www.cars-factory-21.fr',
  telephone: '07 59 56 38 39',
  telephoneLien: '+33759563839',
  email: '[E-mail]',
  adresse: { rue: '1 bis rue de la Fonderie', codePostal: '21800', ville: 'Chevigny-Saint-Sauveur', departement: 'Côte-d’Or' },
  lienItineraire: 'https://www.google.com/maps/search/?api=1&query=Cars+Factory+21+1+bis+rue+de+la+Fonderie+21800+Chevigny-Saint-Sauveur',
  lienAvisGoogle: '',              // lien vers les avis Google du garage (à récupérer sur la fiche)
  horaires: [
    ['Lundi', 'Fermé'],
    ['Mardi – samedi', '9 h – 19 h'],
    ['Dimanche', 'Fermé'],
    ['Dépannage', '24 h/24, 7 j/7'],
  ] as [string, string][],
  // Horaires pour Google (données structurées)
  horairesGoogle: [{ jours: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ouverture: '09:00', fermeture: '19:00' }],
  // Engagements : les deux premiers sont confirmés par les informations du garage, les deux suivants sont À CONFIRMER
  atouts: [
    ['Dépannage 24 h/24', 'Panne ou accident : un dépannage 7 jours sur 7, jour et nuit.'],
    ['Tout au même endroit', 'Carrosserie, peinture, mécanique, covering et lavage.'],
    ['Devis gratuit', 'Envoyez des photos : une première estimation sans vous déplacer.'],
    ['Prix annoncé avant travaux', 'Aucun travail supplémentaire sans votre accord.'],
  ] as [string, string][],
  // Autres services du garage (sans page dédiée)
  autresServices: [
    ['Lavage auto', 'Intérieur et extérieur, pour retrouver une voiture propre.', 'lavage'],
    ['Véhicules d’occasion', 'Des véhicules d’occasion à la vente : renseignez-vous au garage.', 'garage'],
  ] as [string, string, 'lavage' | 'garage'][],
  mentions: {
    raisonSociale: 'CARS FACTORY 21, SASU',
    siren: '999 123 458',
    rcs: '[RCS à confirmer]',
    capital: '[Capital social]',
    responsable: 'Khalid Bouimecha, président',
    hebergeur: '[Hébergeur du site, ex. OVH SAS, 2 rue Kellermann, 59100 Roubaix]',
  },
  zone: ['Chevigny-Saint-Sauveur', 'Dijon', 'Quetigny', 'Saint-Apollinaire', 'Sennecey-lès-Dijon', 'Neuilly-Crimolois', 'Magny-sur-Tille', 'Varois-et-Chaignot', 'Longvic'],
}

export const adresseComplete = `${site.adresse.rue}, ${site.adresse.codePostal} ${site.adresse.ville}`
