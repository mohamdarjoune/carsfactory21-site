import { vers, BASE } from '../vers'
import type { ReactNode } from 'react'
import type { Icone } from '../pages/services'

export const btnRouge = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-rouge px-5 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-[#A91F13]'
export const btnClair = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/35 px-5 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:border-white hover:bg-white/10'
export const btnNoir = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-noir px-5 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-acier'

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-8 ${className}`}>{children}</div>
}

/** En-tête de section : petite étiquette, grand titre condensé, liseré rouge. */
export function TitreSection({ label, titre, texte, clair = false }: { label: string; titre: ReactNode; texte?: ReactNode; clair?: boolean }) {
  return (
    <div className="flex max-w-[760px] flex-col gap-3">
      <p className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${clair ? 'text-rouge-vif' : 'text-rouge'}`}>{label}</p>
      <h2 className={`text-[38px] font-bold uppercase leading-[0.95] md:text-[56px] ${clair ? 'text-white' : ''}`}>{titre}</h2>
      <div className="lisere" />
      {texte && <p className={`text-[17px] leading-relaxed ${clair ? 'text-white/75' : 'text-gris'}`}>{texte}</p>}
    </div>
  )
}

/* Icônes au trait (aucune image extérieure) */
const TRACES: Record<Icone | 'telephone' | 'horloge' | 'lieu' | 'photo' | 'coche' | 'fleche' | 'loupe' | 'bulle' | 'fermer' | 'sms' | 'gauche' | 'droite' | 'pause' | 'lecture' | 'devis' | 'goutte' | 'etiquette' | 'calendrier' | 'voiture', string> = {
  // voiture entière vue de profil (« Mon véhicule ») : caisse, vitres, deux roues
  voiture: 'M3.7 17H1v-3.6l3-1.2 3.6-4.8h8.4l4.2 4.2 2.6.7c.7.2 1.2.8 1.2 1.6V17h-2.2M8.9 17h6.7M6.3 19.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM18.2 19.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM7.3 12.2h12.3M12 7.4v4.8',
  carrosserie: 'M3 15l2-5 3-3h8l3 3 2 5v3H3zM3 15h18M7 18v2M17 18v2M7.5 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2M16.5 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  peinture: 'M4 4h11v5H4zM15 6h3v5h-7v3M10 14h2v7h-2z',
  sinistre: 'M12 3l9 16H3zM12 10v4M12 17v.5',
  mecanique: 'M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
  entretien: 'M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3zM10 14a2 2 0 0 0 2 2',
  diagnostic: 'M3 5h18v11H3zM8 20h8M12 16v4M6 12l3-3 2 2 4-4 3 3',
  covering: 'M4 20l4-12 12-4-4 12zM8 8l8 8M4 20l6-2',
  depannage: 'M2 16V7h9v9M11 11h5l3 3v2h-8M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
  telephone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2',
  horloge: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  lieu: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  photo: 'M4 7h3l2-3h6l2 3h3v12H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  coche: 'M5 12l4 4 10-10',
  loupe: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4.2-4.2',
  bulle: 'M4 5h16v11H9l-5 4z',
  fermer: 'M6 6l12 12M18 6L6 18',
  sms: 'M4 5h16v11H9l-5 4zM8 10h.01M12 10h.01M16 10h.01',
  gauche: 'M15 5l-7 7 7 7',
  droite: 'M9 5l7 7-7 7',
  pause: 'M8 5v14M16 5v14',
  lecture: 'M7 5l12 7-12 7z',
  devis: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
  goutte: 'M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z',
  etiquette: 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',
  calendrier: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  fleche: 'M5 12h14M13 6l6 6-6 6',
}

export function Ico({ nom, taille = 24, className = '' }: { nom: keyof typeof TRACES; taille?: number; className?: string }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={TRACES[nom]} />
    </svg>
  )
}

export type NomPhoto = 'atelier' | 'garage' | 'carrosserie' | 'peinture' | 'sinistre' | 'mecanique' | 'entretien' | 'diagnostic' | 'covering' | 'depannage' | 'lavage'

/**
 * Photo d'illustration (Unsplash, 4K) en 3 tailles : le navigateur charge la plus petite suffisante
 * (téléphone ≈ 960 px, ordinateur ≈ 1920 px, écran 4K = 3840 px). Mention « non contractuelle » incrustée.
 */
export function Photo({ nom, alt, sizes = '100vw', className = '', prioritaire = false, mention = true }:
  { nom: NomPhoto; alt: string; sizes?: string; className?: string; prioritaire?: boolean; mention?: boolean }) {
  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`}>
      <img src={vers(`/photos/${nom}-1920.webp`)} srcSet={`${BASE}photos/${nom}-960.webp 960w, ${BASE}photos/${nom}-1920.webp 1920w, ${BASE}photos/${nom}-3840.webp 3840w`}
        sizes={sizes} alt={alt} loading={prioritaire ? 'eager' : 'lazy'} decoding="async" {...(prioritaire ? { fetchPriority: 'high' } : {})}
        className="h-full w-full object-cover" />
      {mention && <span className="absolute bottom-2 right-2 hidden rounded bg-black/55 px-2 py-0.5 text-[11px] text-white/85 sm:block">Photo non contractuelle</span>}
    </div>
  )
}

/** Emplacement de photo en attente des vraies photos du garage. */
export function PhotoAVenir({ texte, sombre = false, className = '' }: { texte: string; sombre?: boolean; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-lg ${sombre ? 'hachures bg-acier text-white/60' : 'hachures-claires bg-fond text-gris'} ${className}`}>
      <span className="flex items-center gap-2 px-4 text-center text-[14px]"><Ico nom="photo" taille={20} />{texte}</span>
    </div>
  )
}
