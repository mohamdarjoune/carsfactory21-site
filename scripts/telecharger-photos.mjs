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
const PHOTOS = {
  atelier: ['photo-1786489623043-fb024ae22e82', 'voitures-de-luxe-dans-un-garage-de-reparation-automobile-dAeMPFChAHs'],
  garage: ['photo-1767681092416-bccf9410bda4', 'voitures-en-cours-de-reparation-en-atelier-VdXnpwrp1qc'],
  carrosserie: ['photo-1786489785813-8057d678d91e', 'personne-poncant-la-voiture-dans-un-atelier-de-reparation-rKGIDTIaTQE'],
  peinture: ['photo-1512080482556-ea648017576c', 'vehicule-recouvert-de-blanc-en-garage-tBaM1JuJCKA'],
  sinistre: ['photo-1673187139211-1e7ec3dd60ec', 'une-voiture-rouge-est-sur-une-depanneuse-a-plateau-kE__1vnDxg4'],
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

const credits = {}
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
  credits[nom] = { auteur, lien: `https://unsplash.com/fr/photos/${page}` }
  console.log(`✓ ${nom} ${auteur}`)
}
fs.writeFileSync(path.join(racine, 'src', 'photos.json'), JSON.stringify(credits, null, 2) + '\n')
