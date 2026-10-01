import { vers } from '../vers'
import { Logo } from './Logo'
import { Aide, BarreMobile } from './Actions'
import { Container } from './ui'
import { site, accueil, atelier, adresseLieu } from '../config'
import { PRESTATIONS } from '../pages/services'

export default function Footer() {
  return (
    <footer className="bg-noir text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-4">
          <Logo grand />
          <p className="text-[14px] leading-relaxed text-white/60">{site.metier} à Saint-Apollinaire et Chevigny-Saint-Sauveur, près de Dijon ({site.adresse.departement}).</p>
        </div>
        {(['Carrosserie', 'Mécanique', 'Services'] as const).map((famille) => (
          <div key={famille} className="flex flex-col">
            <p className="mb-1 font-titre text-[20px] font-bold uppercase">{famille}</p>
            {PRESTATIONS.filter((p) => p.famille === famille).map((p) => (
              <a key={p.chemin} href={vers(p.chemin)} className="py-2 text-[15px] text-white/70 no-underline hover:text-white">{p.nom}</a>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-2.5 text-[15px] text-white/70">
          <p className="font-titre text-[20px] font-bold uppercase text-white">Contact</p>
          <span><strong className="text-white">Accueil</strong> · {adresseLieu(accueil)}</span>
          <span><strong className="text-white">Atelier</strong> · {adresseLieu(atelier)}</span>
          <a href={`tel:${site.telephoneLien}`} className="-my-2 py-2 text-white/70 no-underline hover:text-white">{site.telephone}</a>
          {site.horaires.map(([j, h]) => <span key={j} className="text-[14px]">{j} : {h}</span>)}
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between md:pb-24">
          <span>© {new Date().getFullYear()} {site.nom}</span>
          <span>
            Conception, design et réalisation :{' '}
            <a href="https://ete-85.fr" target="_blank" rel="noopener" className="inline-block py-2.5 font-semibold text-white/80 no-underline hover:text-white">ÉTÉ 85</a>
            <span className="text-white/45"> · Digital, Data &amp; IA</span>
          </span>
          <span className="flex gap-5">
            <a href={vers('/mentions-legales')} className="py-2.5 text-white/70 no-underline hover:text-white">Mentions légales</a>
            <a href={vers('/confidentialite')} className="py-2.5 text-white/70 no-underline hover:text-white">Confidentialité</a>
          </span>
        </Container>
      </div>
      <BarreMobile />
      <Aide />
    </footer>
  )
}
