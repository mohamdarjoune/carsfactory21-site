/*
 * Recherche « Que recherchez-vous ? » : comprend les mots du quotidien (voyant, rayure, frein…)
 * et propose la bonne prestation. Tout se passe dans le navigateur, rien n'est envoyé.
 */
import { PRESTATIONS } from './pages/services'

export type Resultat = { nom: string; chemin: string; detail: string }

const MOTS_CLES: Record<string, string[]> = {
  '/carrosserie': ['bosse', 'choc', 'rayure', 'pare-chocs', 'parechoc', 'aile', 'portiere', 'retroviseur', 'accrochage', 'carrosserie', 'capot', 'optique', 'phare'],
  '/peinture-automobile': ['peinture', 'teinte', 'vernis', 'polissage', 'rayure', 'couleur', 'eclat'],
  '/reparation-apres-sinistre': ['accident', 'sinistre', 'assurance', 'grele', 'expert', 'vandalisme', 'franchise', 'constat'],
  '/covering': ['covering', 'film', 'wrapping', 'mat', 'satine', 'marquage', 'changer de couleur'],
  '/mecanique-generale': ['frein', 'plaquette', 'disque', 'embrayage', 'distribution', 'courroie', 'amortisseur', 'suspension', 'echappement', 'batterie', 'demarrage', 'bruit', 'mecanique'],
  '/entretien-vidange': ['vidange', 'huile', 'filtre', 'revision', 'entretien', 'controle technique', 'niveau', 'carnet'],
  '/diagnostic-automobile': ['voyant', 'diagnostic', 'valise', 'code defaut', 'moteur', 'capteur', 'mode degrade', 'airbag', 'abs', 'perte de puissance'],
  '/depannage-auto': ['depannage', 'remorquage', 'panne', 'depanneuse', 'urgence', 'nuit', '24h', 'ne demarre pas', 'en panne'],
}

const AUTRES: (Resultat & { mots: string[] })[] = [
  { nom: 'Lavage auto', chemin: '/#autres', detail: 'Intérieur et extérieur', mots: ['lavage', 'nettoyage', 'laver', 'propre'] },
  { nom: 'Véhicules d’occasion', chemin: '/#autres', detail: 'Véhicules à la vente', mots: ['occasion', 'achat', 'acheter', 'vente', 'voiture a vendre'] },
  { nom: 'Nos adresses et horaires', chemin: '/#acces', detail: 'Saint-Apollinaire et Chevigny-Saint-Sauveur', mots: ['adresse', 'plan', 'horaire', 'ouvert', 'itineraire', 'ou', 'acces', 'saint-apollinaire', 'chevigny'] },
  { nom: 'Demander un devis', chemin: '/#devis', detail: 'Avec des photos, sans vous déplacer', mots: ['devis', 'prix', 'tarif', 'combien', 'photo'] },
]

const MOTS_VIDES = new Set(['les', 'des', 'une', 'mon', 'mes', 'pas', 'est', 'sur', 'pour', 'avec', 'dans', 'par', 'qui', 'que', 'quoi', 'faire', 'voiture', 'auto', 'vehicule', 'mais', 'tres', 'plus'])

/** Minuscules, sans accents ni ponctuation superflue. */
export const normaliser = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim()

export function chercher(requete: string, max = 6): Resultat[] {
  const q = normaliser(requete)
  if (q.length < 2) return []
  // les petits mots (de, la, ma, pas…) ne comptent pas : « de » ne doit pas trouver « dépannage »
  const mots = q.split(' ').filter((m) => m.length >= 3 && !MOTS_VIDES.has(m))
  if (!mots.length) return []
  const touche = (texte: string) => mots.some((m) => normaliser(texte).includes(m))
  const scores: [number, Resultat][] = []
  for (const p of PRESTATIONS) {
    let s = 0
    if (touche(p.nom)) s += 5
    if ((MOTS_CLES[p.chemin] ?? []).some((k) => mots.some((m) => k.includes(m) || m.includes(k)))) s += 4
    if (touche(p.resume) || p.interventions.some(touche)) s += 1
    if (s) scores.push([s, { nom: p.nom, chemin: p.chemin, detail: p.resume }])
  }
  for (const a of AUTRES) {
    const s = (touche(a.nom) ? 5 : 0) + (a.mots.some((k) => mots.some((m) => k.includes(m) || m.includes(k))) ? 4 : 0)
    if (s) scores.push([s, { nom: a.nom, chemin: a.chemin, detail: a.detail }])
  }
  return scores.sort((a, b) => b[0] - a[0]).slice(0, max).map(([, r]) => r)
}
