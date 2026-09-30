import { Route, Routes } from 'react-router-dom'
import Accueil from './pages/Accueil'
import Prestation from './pages/Prestation'
import { MentionsLegales, Confidentialite, Introuvable } from './pages/Legal'
import { PRESTATIONS } from './pages/services'

export function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      {PRESTATIONS.map((p) => <Route key={p.chemin} path={p.chemin} element={<Prestation chemin={p.chemin} />} />)}
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
      <Route path="*" element={<Introuvable />} />
    </Routes>
  )
}

/** Pages écrites en HTML complet à la construction (référencement), avec leur titre et leur description Google. */
export const PAGES_PRERENDUES: { chemin: string; fichier: string; priorite: string; titre: string; description: string; introuvable?: boolean }[] = [
  { chemin: '/', fichier: 'index.html', priorite: '1.0',
    titre: 'Garage carrosserie et mécanique à Chevigny | Cars Factory 21',
    description: 'Carrosserie, peinture, covering, mécanique et dépannage 24 h/24 à Chevigny-Saint-Sauveur, près de Dijon. Devis sur photos. Appelez le 07 59 56 38 39.' },
  ...PRESTATIONS.map((p) => ({ chemin: p.chemin, fichier: `${p.chemin.slice(1)}.html`, priorite: '0.8', titre: p.titre, description: p.description })),
  { chemin: '/mentions-legales', fichier: 'mentions-legales.html', priorite: '0.2',
    titre: 'Mentions légales | Cars Factory 21',
    description: 'Mentions légales du site de Cars Factory 21, garage de carrosserie et de mécanique à Chevigny-Saint-Sauveur (Côte-d’Or).' },
  { chemin: '/confidentialite', fichier: 'confidentialite.html', priorite: '0.2',
    titre: 'Confidentialité | Cars Factory 21',
    description: 'Comment Cars Factory 21 utilise les informations envoyées par le formulaire de devis, et comment exercer vos droits sur vos données.' },
  { chemin: '/page-introuvable', fichier: '404.html', priorite: '0', titre: 'Page introuvable | Cars Factory 21', description: 'Cette page n’existe pas.', introuvable: true },
]
