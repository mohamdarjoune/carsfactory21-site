import { useState } from 'react'
import { Container, Ico, TitreSection, btnRouge } from './ui'
import { site, adresseLieu, planOsm, itineraire, voirOsm, type Lieu } from '../config'

/** Plan OpenStreetMap, chargé seulement quand il approche de l'écran.
 *  Un voile le couvre jusqu'au premier toucher : sur téléphone, le doigt fait défiler la page au lieu d'être « pris » par le plan. */
function Plan({ l }: { l: Lieu }) {
  const [actif, setActif] = useState(false)
  return (
    <div className="relative">
      <iframe src={planOsm(l)} title={`Plan : ${l.titre}, ${adresseLieu(l)}`} loading="lazy"
        className="block aspect-[16/10] w-full border-0 bg-fond" referrerPolicy="no-referrer" tabIndex={actif ? 0 : -1} />
      {!actif && (
        <button type="button" onClick={() => setActif(true)} className="absolute inset-0 flex items-end justify-center bg-transparent p-3"
          aria-label={`Utiliser le plan : ${l.titre}`}>
          <span className="rounded-full bg-noir/80 px-3.5 py-2 text-[13px] font-semibold text-white">Toucher pour déplacer le plan</span>
        </button>
      )}
    </div>
  )
}

function CarteLieu({ l, numero }: { l: Lieu; numero: number }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-ligne bg-white">
      <Plan l={l} />
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <p className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rouge font-titre text-[20px] font-bold text-white">{numero}</span>
          <span className="font-titre text-[30px] font-bold uppercase leading-none">{l.titre}</span>
        </p>
        <p className="flex items-start gap-2 text-[17px] font-semibold"><Ico nom="lieu" className="mt-0.5 shrink-0 text-rouge" />{adresseLieu(l)}</p>
        <p className="text-[15px] leading-relaxed text-gris">{l.texte}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          <a href={itineraire(l)} target="_blank" rel="noopener noreferrer" className={btnRouge}><Ico nom="lieu" taille={18} />Itinéraire</a>
          <a href={voirOsm(l)} target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold text-noir">Voir sur OpenStreetMap ↗</a>
        </div>
      </div>
    </article>
  )
}

/** Les deux adresses : l'accueil où l'on dépose la voiture, et l'atelier où elle est réparée. */
export default function Acces() {
  const [accueil, atelier] = site.lieux
  return (
    <section id="acces" aria-labelledby="titre-acces" className="scroll-mt-20 bg-fond">
      <Container className="flex flex-col gap-10 py-16 md:py-24">
        <div id="titre-acces">
          <TitreSection label="Nous trouver" titre="Deux adresses, un seul garage"
            texte="Vous êtes reçu à Saint-Apollinaire, près des commerces et des transports en commun. Le garage emmène ensuite votre voiture à l’atelier de Chevigny-Saint-Sauveur, puis vous la ramène." />
        </div>
        <div className="grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
          <CarteLieu l={accueil} numero={1} />
          <div className="flex items-center justify-center gap-3 py-2 text-center lg:flex-col lg:px-2" aria-hidden="true">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-noir text-white"><Ico nom="depannage" taille={28} /></span>
            <span className="max-w-[140px] font-titre text-[18px] font-bold uppercase leading-tight">Transfert par le garage</span>
            <Ico nom="fleche" taille={28} className="rotate-90 text-rouge lg:rotate-0" />
          </div>
          <CarteLieu l={atelier} numero={2} />
        </div>
        <p className="text-[13px] text-gris">Plans © contributeurs OpenStreetMap. Horaires : {site.horaires.filter(([j]) => j !== 'Dépannage').map(([j, h]) => `${j} ${h.toLowerCase()}`).join(' · ')}.</p>
      </Container>
    </section>
  )
}
