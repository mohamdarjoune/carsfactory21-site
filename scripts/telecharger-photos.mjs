// Télécharge les photos d'illustration (Unsplash, licence gratuite y compris usage commercial) dans public/photos/,
// en 3 largeurs (960, 1920 et 3840 px = 4K) au format WebP, et note les auteurs dans src/photos.json.
// À relancer seulement pour changer de photos : node scripts/telecharger-photos.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sortie = path.join(racine, 'public', 'photos')
fs.mkdirSync(sortie, { recursive: true })

// nom sur le site → [identifiant de l'image, page Unsplash de la photo]
// atelier, garage, carrosserie, peinture et sinistre : vraies photos du garage (medias/photos-khalid), plus téléchargées ici
const PHOTOS = {
  mecanique: ['photo-1619642751034-765dfdf7c58e', 'mains-travaillant-sur-le-moteur-de-la-voiture-Fd6osyVbtG4'],
  entretien: ['photo-1487754180451-c456f719a1fc', 'homme-faisant-le-plein-dhuile-moteur-sur-le-compartiment-moteur-de-la-voiture-V37iTrYZz2E'],
  diagnostic: ['photo-1727893372771-b4ccae9b9f0b', 'un-homme-assis-dans-une-voiture-a-laide-dun-ordinateur-portable-dSosKR6g-W8'],
  covering: ['photo-1699078137802-d466758a533d', 'une-voiture-noire-et-orange-garee-devant-un-rideau-efY8tRSxnh8'],
  depannage: ['photo-1686966933735-305bd8fe0a77', 'une-voiture-bleue-chargee-sur-un-camion-a-plate-forme-UanilB8ZktA'],
  lavage: ['photo-1543857182-68106299b6b2', 'deux-hommes-lavant-un-suv-noir-ci7gkM_29wA'],
}
// Déjà téléchargées : on ne refait que les nouvelles (supprimer un fichier pour le retélécharger)
const dejaLa = (nom) => LARGEURS.every((l) => fs.existsSync(path.join(sortie, `${nom}-${l}.webp`)))
const anciens = fs.existsSync(path.join(racine, 'src', 'photos.json')) ? JSON.parse(fs.readFileSync(path.join(racine, 'src', 'photos.json'), 'utf8')) : {}
const LARGEURS = [960, 1920, 3840]

const credits = Object.fromEntries(Object.entries(anciens).filter(([, c]) => c.reelle))
for (const [nom, [id, page]] of Object.entries(PHOTOS)) {
  if (dejaLa(nom) && anciens[nom]) { credits[nom] = anciens[nom]; continue }
  for (const l of LARGEURS) {
    const r = await fetch(`https://images.unsplash.com/${id}?w=${l}&q=${l > 2000 ? 72 : 78}&fm=webp&fit=max`)
    if (!r.ok) throw new Error(`${nom} ${l} : ${r.status}`)
    fs.writeFileSync(path.join(sortie, `${nom}-${l}.webp`), Buffer.from(await r.arrayBuffer()))
  }
  // Auteur de la photo (crédit affiché dans les mentions légales)
  let auteur = ''
  try {
    const cle = page.split('-').pop()
    const infos = await (await fetch(`https://unsplash.com/napi/photos/${cle}`)).json()
    auteur = infos?.user?.name ?? ''
  } catch { /* crédit sans nom */ }
  credits[nom] = { auteur, lien: `https://unsplash.com/fr/photos/${page}`, reelle: false }
  console.log(`✓ ${nom} ${auteur}`)
}
fs.writeFileSync(path.join(racine, 'src', 'photos.json'), JSON.stringify(credits, null, 2) + '\n')
