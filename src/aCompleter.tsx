import { DEMO } from './vers'

/** Texte encore à fournir par le garage : il commence par « [ ». */
export const aCompleter = (t: string) => t.trimStart().startsWith('[')

/** Sur le vrai site, un texte à compléter n'est jamais montré ; sur la démonstration, il reste visible pour le client. */
export const montrer = (t: string) => DEMO || !aCompleter(t)

/** Affiche un texte ; sur la démonstration, un texte à compléter est surligné en jaune. */
export function Texte({ t }: { t: string }) {
  return aCompleter(t) ? <mark className="rounded bg-amber-100 px-1 text-amber-900">{t}</mark> : <>{t}</>
}
