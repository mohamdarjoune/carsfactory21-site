/*
 * « Mon véhicule » : gardé sur le téléphone du visiteur (localStorage), jamais envoyé tout seul.
 * Sert à préremplir le formulaire de devis et à personnaliser les messages.
 */
import { useEffect, useState } from 'react'

export type Vehicule = { modele: string; annee: string; immat: string }
const CLE = 'cf21-vehicule'
const EVENEMENT = 'cf21-vehicule'

export function lireVehicule(): Vehicule | null {
  try {
    const v = JSON.parse(localStorage.getItem(CLE) ?? 'null')
    return v && typeof v.modele === 'string' && v.modele ? { modele: v.modele, annee: String(v.annee ?? ''), immat: String(v.immat ?? '') } : null
  } catch {
    return null
  }
}

export function enregistrerVehicule(v: Vehicule | null) {
  try {
    if (v) localStorage.setItem(CLE, JSON.stringify(v))
    else localStorage.removeItem(CLE)
  } catch { /* stockage indisponible (navigation privée) : tant pis */ }
  window.dispatchEvent(new Event(EVENEMENT))
}

export const decrireVehicule = (v: Vehicule) => [v.modele, v.annee && `(${v.annee})`, v.immat && `· ${v.immat.toUpperCase()}`].filter(Boolean).join(' ')

/** Le véhicule enregistré (null avant le chargement de la page ou s'il n'y en a pas). */
export function useVehicule() {
  const [v, setV] = useState<Vehicule | null>(null)
  useEffect(() => {
    const maj = () => setV(lireVehicule())
    maj()
    window.addEventListener(EVENEMENT, maj)
    window.addEventListener('storage', maj)
    return () => { window.removeEventListener(EVENEMENT, maj); window.removeEventListener('storage', maj) }
  }, [])
  return v
}

/** Ouvre la fenêtre « Mon véhicule » (écoutée par le composant MonVehicule). */
export const ouvrirMonVehicule = () => window.dispatchEvent(new Event('cf21-ouvrir-vehicule'))
