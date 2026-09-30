import { vers } from '../vers'
import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Ico } from './ui'
import { chercher, type Resultat } from '../recherche'

/** « Que recherchez-vous ? » : suggestions au fil de la frappe, navigation au clavier. */
export default function Recherche({ className = '' }: { className?: string }) {
  const [q, setQ] = useState('')
  const [ouvert, setOuvert] = useState(false)
  const [actif, setActif] = useState(-1)
  const liste = useId()
  const champ = useRef<HTMLInputElement>(null)
  const resultats: Resultat[] = chercher(q)
  const aucun = q.trim().length >= 3 && resultats.length === 0

  function aller(r?: Resultat) {
    const cible = r ?? resultats[actif] ?? resultats[0]
    window.location.href = vers(cible ? cible.chemin : '/#devis')
    setOuvert(false)
  }
  function valider(e: FormEvent) { e.preventDefault(); if (q.trim()) aller() }
  function clavier(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOuvert(true); setActif((a) => Math.min(a + 1, resultats.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActif((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Escape') { setOuvert(false); setActif(-1) }
  }

  return (
    <form role="search" onSubmit={valider} className={`relative ${className}`}>
      <label className="sr-only" htmlFor={`${liste}-champ`}>Que recherchez-vous ?</label>
      <input ref={champ} id={`${liste}-champ`} type="search" value={q} autoComplete="off" enterKeyHint="search"
        placeholder="Que recherchez-vous ? (vidange, rayure, voyant…)"
        role="combobox" aria-expanded={ouvert && (resultats.length > 0 || aucun)} aria-controls={liste} aria-autocomplete="list"
        aria-activedescendant={actif >= 0 ? `${liste}-${actif}` : undefined}
        onChange={(e) => { setQ(e.target.value); setOuvert(true); setActif(-1) }}
        onFocus={() => setOuvert(true)} onBlur={() => setTimeout(() => setOuvert(false), 150)} onKeyDown={clavier}
        className="h-11 w-full rounded-full border-0 bg-white pl-5 pr-14 text-[15px] text-noir placeholder:text-gris focus:outline-2 focus:outline-rouge-vif md:h-12" />
      <button type="submit" aria-label="Rechercher" className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-rouge text-white hover:bg-[#A91F13] md:h-10 md:w-10">
        <Ico nom="loupe" taille={20} />
      </button>
      {ouvert && (resultats.length > 0 || aucun) && (
        <ul id={liste} role="listbox" className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-ligne bg-white py-1 text-noir shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
          {resultats.map((r, n) => (
            <li key={r.nom} id={`${liste}-${n}`} role="option" aria-selected={n === actif}>
              <a href={vers(r.chemin)} onMouseDown={(e) => { e.preventDefault(); aller(r) }}
                className={`flex flex-col px-4 py-2.5 no-underline ${n === actif ? 'bg-fond' : 'hover:bg-fond'}`}>
                <span className="font-semibold text-noir">{r.nom}</span><span className="text-[13px] text-gris">{r.detail}</span>
              </a>
            </li>
          ))}
          {aucun && (
            <li role="option" aria-selected="false">
              <a href={vers('/#devis')} onMouseDown={(e) => { e.preventDefault(); aller() }} className="flex flex-col px-4 py-2.5 no-underline hover:bg-fond">
                <span className="font-semibold text-noir">Pas trouvé ? Décrivez votre besoin</span><span className="text-[13px] text-gris">Le garage vous répond avec un devis</span>
              </a>
            </li>
          )}
        </ul>
      )}
    </form>
  )
}
