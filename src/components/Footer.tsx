import { vers, DEMO } from '../vers'
import { Logo } from './Logo'
import { Aide, BarreMobile } from './Actions'
import { Container } from './ui'
import { site, accueil, atelier, adresseLieu } from '../config'
import { PRESTATIONS } from '../pages/services'

/** Réseaux sociaux du garage et QR code du site. Sur la démonstration, les comptes pas encore créés apparaissent en pointillés. */
function Reseaux() {
  const reseaux = site.reseaux.filter(([, url]) => url || DEMO)
  return (
    <div className="border-t border-white/10">
      <Container className="grid gap-8 py-8 md:grid-cols-[1fr_auto] md:items-center">
        {reseaux.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="font-titre text-[20px] font-bold uppercase">Suivez le garage</p>
            <ul className="flex flex-wrap gap-2">
              {reseaux.map(([nom, url]) => (
                <li key={nom}>
                  {url
                    ? <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-[15px] font-semibold text-white no-underline hover:border-white">{nom}</a>
                    : <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dashed border-amber-300/70 px-4 text-[14px] text-amber-100">{nom}<span className="text-[12px] text-amber-200/70">· à ajouter</span></span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center gap-4">
          {site.snapcode
            ? <img src={vers(site.snapcode)} alt="Snapcode de Cars Factory 21 sur Snapchat" width={96} height={96} loading="lazy" className="h-24 w-24 rounded-lg" />
            : DEMO && <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-noir bg-[#FFFC00] p-2 text-center font-titre text-[13px] font-bold uppercase leading-tight text-noir">Emplacement Snapcode</div>}
          <img src={vers('/qr-site.svg')} alt="QR code pour ouvrir le site sur un téléphone" width={96} height={96} loading="lazy" className="h-24 w-24 shrink-0 rounded-lg bg-white" />
          <p className="max-w-[200px] text-[13px] leading-snug text-white/70">
            <strong className="mb-0.5 block text-[14px] text-white">Le site sur votre téléphone</strong>
            Scannez le code avec l’appareil photo, puis ajoutez le site à l’écran d’accueil.
          </p>
        </div>
      </Container>
    </div>
  )
}

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
      <Reseaux />
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between md:pb-24">
          <span>© {new Date().getFullYear()} {site.nom}</span>
          <span className="flex items-center gap-3">
            Conception, design et réalisation
            <a href="https://ete-85.fr" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center opacity-85 transition-opacity hover:opacity-100">
              <img src={vers('/credits/ete85.svg')} alt="ÉTÉ 85 – Digital, Data & IA" width={98} height={36} loading="lazy" className="h-9 w-auto" />
            </a>
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
