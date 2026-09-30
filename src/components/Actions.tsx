import { vers } from '../vers'
import { useEffect, useState } from 'react'
import { Ico } from './ui'
import { site, accueil, itineraire } from '../config'

/** Téléphone : barre fixée en bas de l'écran, sous le pouce. Appeler · Itinéraire · Devis. */
export function BarreMobile() {
  const lien = 'flex min-h-[60px] flex-1 flex-col items-center justify-center gap-0.5 text-[12px] font-semibold no-underline'
  return (
    <nav aria-label="Actions rapides" className="fixed inset-x-0 bottom-0 z-50 flex border-t border-white/10 bg-noir pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.25)] lg:hidden">
      <a href={`tel:${site.telephoneLien}`} className={`${lien} bg-rouge text-white`}><Ico nom="telephone" taille={22} />Appeler</a>
      <a href={vers('/#rdv')} className={`${lien} text-white`}><Ico nom="calendrier" taille={22} />Rendez-vous</a>
      <a href={itineraire(accueil)} target="_blank" rel="noopener noreferrer" className={`${lien} text-white`}><Ico nom="lieu" taille={22} />Itinéraire</a>
      <a href={vers('/#devis')} className={`${lien} text-white`}><Ico nom="devis" taille={22} />Devis</a>
    </nav>
  )
}

/** Ordinateur : bulle « Besoin d'aide ? » en bas à droite (masquable). */
export function Aide() {
  const [ouvert, setOuvert] = useState(false)
  const [masque, setMasque] = useState(true)
  useEffect(() => { try { setMasque(sessionStorage.getItem('cf21-aide') === 'masque') } catch { setMasque(false) } }, [])
  if (masque) return null
  const masquer = () => { setMasque(true); try { sessionStorage.setItem('cf21-aide', 'masque') } catch { /* rien */ } }
  const ligne = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-noir no-underline hover:bg-fond'
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-3 lg:flex">
      {ouvert && (
        <div role="dialog" aria-label="Besoin d’aide ?" className="w-[290px] rounded-xl border border-ligne bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
          <p className="px-3 pb-1 pt-2 text-[13px] text-gris">Une question, un devis, une panne ?</p>
          <a href={`tel:${site.telephoneLien}`} className={ligne}><Ico nom="telephone" className="text-rouge" />Appeler le {site.telephone}</a>
          <a href={`sms:${site.telephoneLien}`} className={ligne}><Ico nom="sms" className="text-rouge" />Envoyer un SMS</a>
          <a href={vers('/#devis')} onClick={() => setOuvert(false)} className={ligne}><Ico nom="devis" className="text-rouge" />Demander un devis</a>
          <a href={vers('/#acces')} onClick={() => setOuvert(false)} className={ligne}><Ico nom="lieu" className="text-rouge" />Nos adresses et horaires</a>
        </div>
      )}
      <div className="flex items-center gap-2">
        {!ouvert && (
          <>
            <button type="button" onClick={masquer} aria-label="Masquer l’aide" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-noir shadow-md hover:bg-fond"><Ico nom="fermer" taille={16} /></button>
            <button type="button" onClick={() => setOuvert(true)} className="rounded-full bg-white px-4 py-2.5 text-[15px] font-semibold text-noir shadow-md hover:bg-fond">Besoin d’aide ?</button>
          </>
        )}
        <button type="button" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert} aria-label={ouvert ? 'Fermer l’aide' : 'Ouvrir l’aide'}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rouge text-white shadow-lg hover:bg-[#A91F13]">
          <Ico nom={ouvert ? 'fermer' : 'bulle'} taille={26} />
        </button>
      </div>
    </div>
  )
}
