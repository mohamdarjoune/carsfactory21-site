import { describe, expect, it } from 'vitest'
import { PAGES_PRERENDUES } from '../routes'
import { PRESTATIONS } from './services'

/* Google coupe les titres au-delà d'environ 60 caractères et les descriptions au-delà d'environ 155. */
describe('titres et descriptions pour Google', () => {
  for (const p of PAGES_PRERENDUES.filter((x) => !x.introuvable)) {
    it(`${p.chemin} : titre ≤ 60 caractères, description entre 70 et 160`, () => {
      expect(p.titre.length).toBeLessThanOrEqual(60)
      expect(p.description.length).toBeGreaterThanOrEqual(70)
      expect(p.description.length).toBeLessThanOrEqual(160)
      expect(p.titre).toMatch(/Cars Factory 21/)
    })
  }

  it('aucun titre en double', () => {
    const titres = PAGES_PRERENDUES.map((p) => p.titre)
    expect(new Set(titres).size).toBe(titres.length)
  })

  it('les pages liées existent', () => {
    const chemins = new Set(PRESTATIONS.map((p) => p.chemin))
    for (const p of PRESTATIONS) for (const l of p.liees) expect(chemins.has(l), `${p.chemin} → ${l}`).toBe(true)
  })
})
