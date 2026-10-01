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
  // Adresse de l'atelier (siège, fiche Google)
  adresse: { rue: '1 bis rue de la Fonderie', codePostal: '21800', ville: 'Chevigny-Saint-Sauveur', departement: 'Côte-d’Or' },
  lienItineraire: 'https://www.google.com/maps/dir/?api=1&destination=47.3391354,5.0720674',
  // Deux adresses : les clients sont reçus à Saint-Apollinaire (commerces et transports en commun à proximité),
  // le garage emmène ensuite la voiture à l'atelier de Chevigny-Saint-Sauveur et la ramène.
  // Coordonnées : OpenStreetMap (Nominatim), 30/09/2026 ; atelier placé sur la rue (le n° 1 bis n'est pas référencé).
  lieux: [
    { id: 'accueil', titre: 'Accueil et bureau', rue: '6 rue de Bastogne', codePostal: '21850', ville: 'Saint-Apollinaire',
      texte: 'C’est ici que vous déposez et récupérez votre voiture, et que se font devis et démarches. Commerces et transports en commun à proximité.',
      lat: 47.3391354, lon: 5.0720674 },
    { id: 'atelier', titre: 'Atelier', rue: '1 bis rue de la Fonderie', codePostal: '21800', ville: 'Chevigny-Saint-Sauveur',
      texte: 'Carrosserie, peinture et mécanique sont réalisées ici. Le garage s’occupe du transfert de votre voiture entre l’accueil et l’atelier.',
      lat: 47.2937067, lon: 5.1494143 },
  ],
  // Agenda Cal.com du garage (ex. 'cars-factory-21/rendez-vous') : vide = agenda de démonstration
  calLink: '',
  lienAvisGoogle: '',              // lien vers les avis Google du garage (à récupérer sur la fiche)
  // Réseaux sociaux du garage : [nom, lien]. Lien vide = pas encore de compte
  // (l'emplacement n'apparaît que sur la démonstration ; sur le vrai site, seuls les liens remplis s'affichent).
  reseaux: [
    ['Fiche Google', ''],
    ['Facebook', ''],
    ['Instagram', ''],
    ['TikTok', ''],
    ['Snapchat', ''],
    ['WhatsApp', ''],
  ] as [string, string][],
  snapcode: '',                    // image du Snapcode Snapchat du garage, ex. '/reseaux/snapcode.svg' (à fournir)
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
export type Lieu = (typeof site.lieux)[number]
export const adresseLieu = (l: Lieu) => `${l.rue}, ${l.codePostal} ${l.ville}`
export const accueil = site.lieux[0]
export const atelier = site.lieux[1]
/** Plan OpenStreetMap intégrable (sans cookie de suivi), centré sur le lieu avec un repère. */
export const planOsm = (l: Lieu, zoom = 0.006) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${l.lon - zoom},${l.lat - zoom / 2},${l.lon + zoom},${l.lat + zoom / 2}&layer=mapnik&marker=${l.lat},${l.lon}`
export const itineraire = (l: Lieu) => `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lon}`
export const voirOsm = (l: Lieu) => `https://www.openstreetmap.org/?mlat=${l.lat}&mlon=${l.lon}#map=17/${l.lat}/${l.lon}`
