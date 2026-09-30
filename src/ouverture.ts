/*
 * « Ouvert maintenant » : calculé à l'heure de Paris, d'après les horaires du garage
 * (du mardi au samedi, 9 h – 19 h ; fermé le lundi et le dimanche).
 */

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const OUVERTURE = 9 * 60, FERMETURE = 19 * 60
const ouvrable = (jour: number) => jour >= 2 && jour <= 6   // mardi (2) → samedi (6)

export type Statut = { ouvert: boolean; texte: string }

/** jour : 0 = dimanche … 6 = samedi ; minutes depuis minuit. */
export function statutOuverture(jour: number, minutes: number): Statut {
  if (ouvrable(jour) && minutes >= OUVERTURE && minutes < FERMETURE) {
    return { ouvert: true, texte: FERMETURE - minutes <= 60 ? 'Ouvert · ferme bientôt (19 h)' : 'Ouvert maintenant · jusqu’à 19 h' }
  }
  if (ouvrable(jour) && minutes < OUVERTURE) return { ouvert: false, texte: 'Fermé · ouvre aujourd’hui à 9 h' }
  for (let d = 1; d <= 7; d++) {
    const j = (jour + d) % 7
    if (ouvrable(j)) return { ouvert: false, texte: `Fermé · ouvre ${d === 1 ? 'demain' : JOURS[j]} à 9 h` }
  }
  return { ouvert: false, texte: 'Fermé' }
}

/** Jour et minutes à Paris, quel que soit le fuseau du téléphone du visiteur. */
export function maintenantAParis(date = new Date()): { jour: number; minutes: number } {
  const parties = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date)
  const val = (t: string) => parties.find((p) => p.type === t)?.value ?? ''
  const jour = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'))
  return { jour, minutes: Number(val('hour')) * 60 + Number(val('minute')) }
}
