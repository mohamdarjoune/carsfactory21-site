import { describe, expect, it } from 'vitest'
import { chercher } from './recherche'

const premier = (q: string) => chercher(q)[0]?.chemin

describe('recherche « Que recherchez-vous ? »', () => {
  it('voyant allumé → diagnostic', () => expect(premier('voyant allumé')).toBe('/diagnostic-automobile'))
  it('rayure → carrosserie ou peinture', () => expect(['/carrosserie', '/peinture-automobile']).toContain(premier('une rayure')))
  it('vidange → entretien', () => expect(premier('vidange')).toBe('/entretien-vidange'))
  it('plaquettes de frein → mécanique', () => expect(premier('plaquettes de frein')).toBe('/mecanique-generale'))
  it('ma voiture ne démarre pas → dépannage ou mécanique', () => expect(['/depannage-auto', '/mecanique-generale']).toContain(premier('ne démarre pas')))
  it('accident → sinistre', () => expect(premier('accident')).toBe('/reparation-apres-sinistre'))
  it('sans accents ni majuscules', () => expect(premier('GRELE')).toBe('/reparation-apres-sinistre'))
  it('adresse → nos adresses', () => expect(premier('adresse')).toBe('/#acces'))
  it('trop court : rien', () => expect(chercher('a')).toEqual([]))
})
