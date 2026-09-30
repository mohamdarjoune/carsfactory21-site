import { Logo } from './Logo'
import { Container } from './ui'
import { site, adresseComplete } from '../config'
import { PRESTATIONS } from '../pages/services'

export default function Footer() {
  return (
    <footer className="bg-noir text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4">
          <Logo grand />
          <p className="text-[14px] leading-relaxed text-white/60">{site.metier} à {site.adresse.ville}, près de Dijon ({site.adresse.departement}).</p>
        </div>
        {(['Carrosserie', 'Mécanique', 'Services'] as const).map((famille) => (
          <div key={famille} className="flex flex-col gap-2.5">
            <p className="font-titre text-[20px] font-bold uppercase">{famille}</p>
            {PRESTATIONS.filter((p) => p.famille === famille).map((p) => (
              <a key={p.chemin} href={p.chemin} className="text-[15px] text-white/70 no-underline hover:text-white">{p.nom}</a>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-2.5 text-[15px] text-white/70">
          <p className="font-titre text-[20px] font-bold uppercase text-white">Contact</p>
          <span>{adresseComplete}</span>
          <a href={`tel:${site.telephoneLien}`} className="text-white/70 no-underline hover:text-white">{site.telephone}</a>
          {site.horaires.map(([j, h]) => <span key={j} className="text-[14px]">{j} : {h}</span>)}
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-[13px] text-white/50 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {site.nom}</span>
          <span className="flex gap-5">
            <a href="/mentions-legales" className="text-white/60 no-underline hover:text-white">Mentions légales</a>
            <a href="/confidentialite" className="text-white/60 no-underline hover:text-white">Confidentialité</a>
          </span>
        </Container>
      </div>
    </footer>
  )
}
