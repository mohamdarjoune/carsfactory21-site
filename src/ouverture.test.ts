import { describe, expect, it } from 'vitest'
import { maintenantAParis, statutOuverture } from './ouverture'

describe('ouvert maintenant ?', () => {
  it('mardi 10 h : ouvert', () => expect(statutOuverture(2, 10 * 60)).toEqual({ ouvert: true, texte: 'Ouvert maintenant · jusqu’à 19 h' }))
  it('samedi 18 h 30 : ferme bientôt', () => expect(statutOuverture(6, 18 * 60 + 30).texte).toBe('Ouvert · ferme bientôt (19 h)'))
  it('mercredi 8 h : ouvre aujourd’hui', () => expect(statutOuverture(3, 8 * 60).texte).toBe('Fermé · ouvre aujourd’hui à 9 h'))
  it('vendredi 19 h : ouvre demain', () => expect(statutOuverture(5, 19 * 60).texte).toBe('Fermé · ouvre demain à 9 h'))
  it('samedi soir : ouvre mardi', () => expect(statutOuverture(6, 20 * 60).texte).toBe('Fermé · ouvre mardi à 9 h'))
  it('dimanche : ouvre mardi', () => expect(statutOuverture(0, 12 * 60).texte).toBe('Fermé · ouvre mardi à 9 h'))
  it('lundi : ouvre demain', () => expect(statutOuverture(1, 12 * 60).texte).toBe('Fermé · ouvre demain à 9 h'))
  it('heure de Paris, même depuis un autre fuseau', () => {
    // mardi 30/09/2026 07:30 UTC = 09:30 à Paris (heure d'été)
    expect(maintenantAParis(new Date('2026-09-29T07:30:00Z'))).toEqual({ jour: 2, minutes: 9 * 60 + 30 })
  })
})
