import { vers } from '../vers'
import { useEffect, useState } from 'react'
import { Ico } from './ui'
import { site } from '../config'
import { maintenantAParis, statutOuverture } from '../ouverture'

/** Bandeau d'informations en haut de page, qui défile (flèches et bouton pause, comme un carrousel). */
export default function Bandeau() {
  const [statut, setStatut] = useState('Du mardi au samedi, 9 h – 19 h')
  const [i, setI] = useState(0)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    const maj = () => { const { jour, minutes } = maintenantAParis(); setStatut(statutOuverture(jour, minutes).texte) }
    maj()
    const t = setInterval(maj, 60_000)
    return () => clearInterval(t)
  }, [])

  const messages: [string, string][] = [
    [`Dépannage 24 h/24 et 7 j/7 · ${site.telephone}`, `tel:${site.telephoneLien}`],
    [statut, '/#acces'],
    ['Devis sur photos, sans vous déplacer', '/#devis'],
    ['Accueil à Saint-Apollinaire, près des transports en commun', '/#acces'],
  ]

  useEffect(() => {
    if (pause || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 5000)
    return () => clearInterval(t)
  }, [pause, messages.length])

  const [texte, lien] = messages[i]
  return (
    <div className="bg-rouge text-white" role="region" aria-label="Informations" aria-roledescription="carrousel">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center gap-1 px-2 md:px-6">
        <button type="button" onClick={() => setI((i - 1 + messages.length) % messages.length)} aria-label="Information précédente" className="flex h-10 w-10 shrink-0 items-center justify-center rounded hover:bg-white/15"><Ico nom="gauche" taille={18} /></button>
        <a href={vers(lien)} aria-live={pause ? 'polite' : 'off'} className="min-w-0 flex-1 truncate text-center text-[14px] font-semibold text-white no-underline hover:underline">{texte}</a>
        <button type="button" onClick={() => setI((i + 1) % messages.length)} aria-label="Information suivante" className="flex h-10 w-10 shrink-0 items-center justify-center rounded hover:bg-white/15"><Ico nom="droite" taille={18} /></button>
        <button type="button" onClick={() => setPause((p) => !p)} aria-label={pause ? 'Reprendre le défilement' : 'Mettre le défilement en pause'} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded hover:bg-white/15 sm:flex"><Ico nom={pause ? 'lecture' : 'pause'} taille={16} /></button>
      </div>
    </div>
  )
}
