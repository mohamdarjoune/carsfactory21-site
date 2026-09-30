/*
 * Adresse d'une page ou d'un fichier du site, en tenant compte du dossier où le site est publié :
 * « / » sur le vrai domaine, « /carsfactory21-site/ » sur la démonstration GitHub Pages.
 * Les liens externes (https:, tel:, sms:, mailto:) sont laissés tels quels.
 */
export const BASE = import.meta.env.BASE_URL
export const vers = (c: string) => (c.startsWith('/') && !c.startsWith('//') ? BASE.replace(/\/$/, '') + c : c)

/** Version de démonstration : formulaires sans envoi, site non indexé par Google. */
export const DEMO = import.meta.env.VITE_DEMO === '1'
