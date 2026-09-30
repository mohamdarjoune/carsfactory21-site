import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { Container, Ico, btnRouge } from './ui'
import { site } from '../config'
import { PRESTATIONS } from '../pages/services'

const LIENS: [string, string][] = [['Carrosserie', '/#carrosserie'], ['Mécanique', '/#mecanique'], ['Dépannage 24 h/24', '/depannage-auto'], ['Le garage', '/#garage'], ['Contact', '/#contact']]

export default function Header() {
  const [ouvert, setOuvert] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOuvert(false), [pathname])
  const appeler = `tel:${site.telephoneLien}`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-noir/95 text-white backdrop-blur">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <a href="/" className="no-underline" aria-label="Cars Factory 21, accueil"><Logo /></a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {LIENS.map(([l, h]) => <a key={h} href={h} className="text-white/80 no-underline hover:text-white">{l}</a>)}
        </nav>

        <div className="flex items-center gap-2">
          <a href={appeler} className="hidden items-center gap-2 rounded-md px-3 py-2 text-[15px] font-semibold text-white no-underline hover:bg-white/10 md:flex">
            <Ico nom="telephone" taille={18} />{site.telephone}
          </a>
          <a href="/#devis" className={`${btnRouge} !min-h-11 !px-4 !py-2`}>Devis</a>
          <button type="button" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert} aria-controls="menu-mobile"
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'} className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-white/10 lg:hidden">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </Container>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Menu" className="border-t border-white/10 bg-noir lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {LIENS.map(([l, h]) => <a key={h} href={h} onClick={() => setOuvert(false)} className="rounded-md px-3 py-3 text-[17px] font-medium text-white no-underline hover:bg-white/10">{l}</a>)}
            <p className="mt-3 px-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/50">Prestations</p>
            {PRESTATIONS.map((p) => <a key={p.chemin} href={p.chemin} className="rounded-md px-3 py-2.5 text-[15px] text-white/80 no-underline hover:bg-white/10">{p.nom}</a>)}
            <a href={appeler} className="mt-3 flex items-center gap-2 rounded-md bg-white/10 px-3 py-3 font-semibold text-white no-underline"><Ico nom="telephone" taille={18} />Appeler : {site.telephone}</a>
          </Container>
        </nav>
      )}
    </header>
  )
}
