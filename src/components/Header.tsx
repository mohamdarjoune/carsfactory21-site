import { vers } from '../vers'
import { useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import Bandeau from './Bandeau'
import Recherche from './Recherche'
import { FenetreVehicule } from './MonVehicule'
import { Container, Ico, btnRouge } from './ui'
import { site } from '../config'
import { decrireVehicule, ouvrirMonVehicule, useVehicule } from '../vehicule'

// Barre des prestations (comme les rayons d'un centre auto) : défile au doigt sur téléphone
const RAYONS: [string, string, boolean?][] = [
  ['Rendez-vous atelier', '/#rdv'],
  ['Carrosserie', '/carrosserie'], ['Peinture', '/peinture-automobile'], ['Covering', '/covering'],
  ['Sinistre et assurance', '/reparation-apres-sinistre'], ['Mécanique', '/mecanique-generale'], ['Entretien, vidange', '/entretien-vidange'],
  ['Diagnostic', '/diagnostic-automobile'], ['Dépannage 24 h/24', '/depannage-auto', true], ['Lavage, occasions', '/#autres'],
]

function BoutonIcone({ icone, libelle, detail, href, onClick }: { icone: Parameters<typeof Ico>[0]['nom']; libelle: string; detail?: string; href?: string; onClick?: () => void }) {
  const contenu = (
    <>
      <Ico nom={icone} taille={24} className="shrink-0" />
      <span className="hidden flex-col text-left leading-tight xl:flex">
        <span className="text-[15px] font-semibold">{libelle}</span>
        {detail && <span className="max-w-[150px] truncate text-[12px] text-white/60">{detail}</span>}
      </span>
      <span className="sr-only xl:hidden">{libelle}</span>
    </>
  )
  const classe = 'flex h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2 text-white no-underline hover:bg-white/10'
  return href ? <a href={vers(href)} className={classe}>{contenu}</a> : <button type="button" onClick={onClick} className={classe}>{contenu}</button>
}

export default function Header() {
  const { pathname } = useLocation()
  const vehicule = useVehicule()
  return (
    <>
      <Bandeau />
      <header className="sticky top-0 z-50 bg-noir text-white shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        <Container className="flex h-[68px] items-center gap-3 md:h-[80px] md:gap-5">
          <a href={vers('/')} className="shrink-0 no-underline" aria-label="Cars Factory 21, accueil"><Logo /></a>
          <Recherche className="hidden flex-1 md:block md:max-w-[520px]" />
          <nav aria-label="Raccourcis" className="ml-auto flex items-center gap-0.5 md:gap-1">
            <BoutonIcone icone="lieu" libelle="Nos adresses" detail="Saint-Apollinaire · Chevigny" href="/#acces" />
            <BoutonIcone icone="carrosserie" libelle="Mon véhicule" detail={vehicule ? decrireVehicule(vehicule) : 'Préparer mon devis'} onClick={ouvrirMonVehicule} />
            <a href={`tel:${site.telephoneLien}`} className="hidden h-11 items-center gap-2 whitespace-nowrap rounded-md px-3 text-[15px] font-semibold text-white no-underline hover:bg-white/10 lg:flex">
              <Ico nom="telephone" taille={20} />{site.telephone}
            </a>
            <a href={vers('/#devis')} className={`${btnRouge} !min-h-11 !px-4 !py-2 max-sm:!hidden`}>Devis</a>
          </nav>
        </Container>
      </header>
      {/* Recherche sur téléphone : toute la largeur, sous le logo ; elle défile avec la page pour laisser de la place au contenu */}
      <div className="bg-noir px-4 pb-3 pt-1 md:hidden"><Recherche /></div>

      <nav aria-label="Prestations" className="border-b border-ligne bg-white">
        <Container className="relative">
          <ul className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] md:mx-0 md:gap-1 md:px-0">
            {RAYONS.map(([nom, href, urgent]) => {
              const actif = pathname === href
              return (
                <li key={href} className="shrink-0 snap-start">
                  <a href={vers(href)} aria-current={actif ? 'page' : undefined}
                    className={`flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-[15px] font-medium no-underline md:border-0 md:px-3 ${actif ? 'border-noir bg-noir text-white' : urgent ? 'border-rouge/40 text-rouge' : 'border-ligne text-noir hover:bg-fond'}`}>
                    {urgent && <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-rouge" aria-hidden="true" />}{nom}
                  </a>
                </li>
              )
            })}
          </ul>
        </Container>
      </nav>
      <FenetreVehicule />
    </>
  )
}
