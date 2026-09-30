import { useEffect, useState } from 'react'
import { maintenantAParis, statutOuverture, type Statut } from '../ouverture'

/** « Ouvert maintenant » / « Fermé · ouvre mardi à 9 h » : calculé dans le navigateur, à l'heure de Paris. */
export default function StatutOuverture({ clair = false }: { clair?: boolean }) {
  const [s, setS] = useState<Statut | null>(null)
  useEffect(() => {
    const maj = () => { const { jour, minutes } = maintenantAParis(); setS(statutOuverture(jour, minutes)) }
    maj()
    const t = setInterval(maj, 60_000)
    return () => clearInterval(t)
  }, [])
  // Avant le calcul (page pré-rendue) : simplement les horaires
  const texte = s?.texte ?? 'Du mardi au samedi, 9 h – 19 h'
  const couleur = !s ? 'bg-white/40' : s.ouvert ? 'bg-[#2FBF62]' : 'bg-[#F2A33A]'
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-semibold ${clair ? 'bg-white/12 text-white' : 'bg-fond text-noir'}`} role="status">
      <span className={`h-2.5 w-2.5 rounded-full ${couleur}`} aria-hidden="true" />{texte}
    </span>
  )
}
