import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Container, Ico, TitreSection, btnRouge } from './ui'
import { site, accueil, adresseLieu } from '../config'
import { PRESTATIONS } from '../pages/services'
import { decrireVehicule, useVehicule } from '../vehicule'

/*
 * Prise de rendez-vous.
 * - Si site.calLink est rempli (compte Cal.com du garage) : l'agenda Cal.com s'affiche.
 * - Sinon : agenda de DÉMONSTRATION, dans le même esprit (tous les créneaux libres du mardi au samedi),
 *   pour montrer le fonctionnement au client. Rien n'est réservé ni envoyé.
 */

const JOURS_COURTS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']
const CRENEAUX = Array.from({ length: 19 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)   // 9:00 → 18:00
const ouvert = (d: Date) => d.getDay() >= 2 && d.getDay() <= 6
const memeJour = (a: Date, b: Date) => a.toDateString() === b.toDateString()
const format = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('fr-FR', o)

function AgendaCal({ lien }: { lien: string }) {
  return <iframe src={`https://cal.com/${lien}?embed=true&theme=light`} title="Agenda de prise de rendez-vous" loading="lazy" className="h-[720px] w-full rounded-xl border border-ligne bg-white" />
}

function AgendaDemo() {
  const vehicule = useVehicule()
  const [aujourdhui, setAujourdhui] = useState<Date | null>(null)
  const [mois, setMois] = useState<Date | null>(null)
  const [jour, setJour] = useState<Date | null>(null)
  const [heure, setHeure] = useState('')
  const [prestation, setPrestation] = useState(PRESTATIONS[0].nom)
  const [confirme, setConfirme] = useState(false)

  // Le calendrier dépend de la date du visiteur : calculé dans le navigateur, pas au pré-rendu
  useEffect(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0)
    setAujourdhui(t)
    // Plus aucun jour libre ce mois-ci (fin de mois) : on ouvre directement le mois suivant
    const fin = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()
    const resteUnJour = Array.from({ length: fin - t.getDate() + 1 }, (_, k) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + k))
      .some((d) => ouvert(d) && !(memeJour(d, t) && new Date().getHours() >= 17))
    setMois(new Date(t.getFullYear(), t.getMonth() + (resteUnJour ? 0 : 1), 1))
  }, [])

  const cases = useMemo(() => {
    if (!mois) return []
    const decalage = (mois.getDay() + 6) % 7   // lundi = 0
    const nb = new Date(mois.getFullYear(), mois.getMonth() + 1, 0).getDate()
    return [...Array(decalage).fill(null), ...Array.from({ length: nb }, (_, i) => new Date(mois.getFullYear(), mois.getMonth(), i + 1))]
  }, [mois])

  if (!aujourdhui || !mois) return <div className="h-[520px] animate-pulse rounded-xl bg-fond" aria-label="Chargement de l’agenda" />

  const moisSuivantMax = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() + 2, 1)
  const libre = (d: Date) => ouvert(d) && d >= aujourdhui && !(memeJour(d, aujourdhui) && new Date().getHours() >= 17)
  const changerMois = (n: number) => { setMois(new Date(mois.getFullYear(), mois.getMonth() + n, 1)); setJour(null); setHeure('') }

  if (confirme && jour) {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-xl border border-ligne bg-white p-6 md:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2FBF62] text-white"><Ico nom="coche" taille={26} /></span>
        <p className="font-titre text-[32px] font-bold uppercase leading-none">Rendez-vous demandé</p>
        <p className="text-[17px]"><strong>{prestation}</strong> · {format(jour, { weekday: 'long', day: 'numeric', month: 'long' })} à {heure.replace(':', ' h ')}</p>
        <p className="text-gris">Dépôt à l’accueil : {adresseLieu(accueil)}.</p>
        <p className="rounded-lg bg-[#FFF4F2] px-3 py-2 text-[14px] text-rouge">Démonstration : ce rendez-vous n’est pas enregistré.</p>
        <button type="button" onClick={() => { setConfirme(false); setHeure(''); setJour(null) }} className="font-semibold text-rouge underline">Choisir un autre créneau</button>
      </div>
    )
  }

  function confirmer(e: FormEvent) { e.preventDefault(); setConfirme(true) }

  return (
    <div className="grid overflow-hidden rounded-xl border border-ligne bg-white lg:grid-cols-[260px_1fr_220px]">
      {/* 1. La prestation */}
      <div className="flex flex-col gap-3 border-b border-ligne p-5 lg:border-b-0 lg:border-r">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gris">1 · Prestation</p>
        <label className="sr-only" htmlFor="rdv-prestation">Prestation</label>
        <select id="rdv-prestation" value={prestation} onChange={(e) => setPrestation(e.target.value)} className="w-full rounded-md border border-[#C9CDD3] bg-white px-3 py-3 text-base">
          {PRESTATIONS.filter((p) => p.chemin !== '/depannage-auto').map((p) => <option key={p.chemin}>{p.nom}</option>)}
          <option>Lavage auto</option><option>Autre demande</option>
        </select>
        <p className="flex items-start gap-2 text-[14px] text-gris"><Ico nom="lieu" taille={18} className="mt-0.5 shrink-0 text-rouge" />Dépôt à l’accueil, {accueil.rue}, {accueil.ville}</p>
        <p className="flex items-start gap-2 text-[14px] text-gris"><Ico nom="horloge" taille={18} className="mt-0.5 shrink-0 text-rouge" />Mardi – samedi, 9 h – 19 h</p>
      </div>

      {/* 2. Le jour */}
      <div className="border-b border-ligne p-5 lg:border-b-0 lg:border-r">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gris">2 · Jour</p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => changerMois(-1)} disabled={mois <= new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1)} aria-label="Mois précédent" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-fond disabled:opacity-30"><Ico nom="gauche" taille={18} /></button>
            <p className="min-w-[130px] text-center font-semibold capitalize" aria-live="polite">{format(mois, { month: 'long', year: 'numeric' })}</p>
            <button type="button" onClick={() => changerMois(1)} disabled={new Date(mois.getFullYear(), mois.getMonth() + 1, 1) > moisSuivantMax} aria-label="Mois suivant" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-fond disabled:opacity-30"><Ico nom="droite" taille={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label="Choisir un jour">
          {JOURS_COURTS.map((j) => <span key={j} className="py-1 text-[12px] font-semibold uppercase text-gris">{j}</span>)}
          {cases.map((d, i) => d === null ? <span key={`v${i}`} /> : (
            <button key={d.toISOString()} type="button" disabled={!libre(d)} onClick={() => { setJour(d); setHeure('') }}
              aria-pressed={jour ? memeJour(d, jour) : false} aria-label={format(d, { weekday: 'long', day: 'numeric', month: 'long' }) + (libre(d) ? ', disponible' : ', indisponible')}
              className={`flex aspect-square min-h-10 items-center justify-center rounded-lg text-[15px] font-semibold transition-colors ${jour && memeJour(d, jour) ? 'bg-rouge text-white' : libre(d) ? 'bg-[#FFF4F2] text-noir hover:bg-rouge hover:text-white' : 'text-[#B7BCC3]'} ${memeJour(d, aujourdhui) ? 'ring-2 ring-noir/20' : ''}`}>
              {d.getDate()}
            </button>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-3 text-[12px] text-gris"><span className="inline-block h-3 w-3 rounded bg-[#FFF4F2] ring-1 ring-rouge/20" />disponible<span className="inline-block h-3 w-3 rounded bg-white ring-1 ring-ligne" />fermé (lundi, dimanche)</p>
      </div>

      {/* 3. L'heure, puis la confirmation */}
      <div className="p-5">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-gris">3 · Heure</p>
        {!jour ? <p className="text-[14px] text-gris">Choisissez d’abord un jour.</p> : !heure ? (
          <>
            <p className="mb-2 font-semibold capitalize">{format(jour, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="grid max-h-[340px] grid-cols-3 gap-2 overflow-y-auto pr-1 lg:grid-cols-1">
              {CRENEAUX.filter((h) => !memeJour(jour, aujourdhui) || Number(h.slice(0, 2)) > new Date().getHours()).map((h) => (
                <button key={h} type="button" onClick={() => setHeure(h)} className="min-h-11 rounded-lg border border-rouge/40 text-[15px] font-semibold text-rouge hover:bg-rouge hover:text-white">{h.replace(':', ' h ')}</button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={confirmer} className="flex flex-col gap-3">
            <p className="text-[15px]"><strong className="capitalize">{format(jour, { weekday: 'long', day: 'numeric', month: 'long' })}</strong> à <strong>{heure.replace(':', ' h ')}</strong> <button type="button" onClick={() => setHeure('')} className="text-[13px] text-rouge underline">changer</button></p>
            <label className="flex flex-col gap-1 text-[14px] font-medium">Nom<input required autoComplete="name" className="rounded-md border border-[#C9CDD3] px-3 py-2.5 text-base" /></label>
            <label className="flex flex-col gap-1 text-[14px] font-medium">Téléphone<input required type="tel" inputMode="tel" autoComplete="tel" className="rounded-md border border-[#C9CDD3] px-3 py-2.5 text-base" /></label>
            <label className="flex flex-col gap-1 text-[14px] font-medium">Véhicule<input required defaultValue={vehicule ? decrireVehicule(vehicule) : ''} key={vehicule ? 'v' : 'n'} className="rounded-md border border-[#C9CDD3] px-3 py-2.5 text-base" /></label>
            <button type="submit" className={`${btnRouge} border-0`}>Confirmer le rendez-vous</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Rendezvous() {
  return (
    <section id="rdv" className="scroll-mt-32 bg-fond">
      <Container className="flex flex-col gap-6 py-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TitreSection label="Rendez-vous atelier" titre="Prendre rendez-vous" texte="Choisissez la prestation, le jour et l’heure : vous déposez votre voiture à l’accueil de Saint-Apollinaire." />
          {!site.calLink && <p className="rounded-full bg-noir px-4 py-2 text-[13px] font-semibold text-white">Démonstration · tous les créneaux sont libres</p>}
        </div>
        {site.calLink ? <AgendaCal lien={site.calLink} /> : <AgendaDemo />}
        <p className="text-[14px] text-gris">Urgence ou panne ? Appelez directement le <a href={`tel:${site.telephoneLien}`} className="font-semibold text-noir">{site.telephone}</a> (dépannage 24 h/24).</p>
      </Container>
    </section>
  )
}
