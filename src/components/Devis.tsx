import { useState, type FormEvent } from 'react'
import { Container, Ico, TitreSection, btnRouge } from './ui'
import { site, accueil, atelier, adresseLieu } from '../config'
import { PRESTATIONS } from '../pages/services'

type Etat = 'idle' | 'envoi' | 'ok' | 'erreur' | 'limite'

const champ = 'w-full rounded-md border border-[#C9CDD3] bg-white px-3.5 py-3 text-base text-noir'
const lbl = 'flex flex-col gap-1.5 text-[14px] font-medium text-noir'
const PHOTOS_MAX = 3
const TAILLE_MAX = 4 * 1024 * 1024   // 4 Mo par photo (après réduction automatique)

/** Réduit une photo de téléphone (souvent 5 à 10 Mo) à 1600 px de large avant l'envoi. */
async function reduire(fichier: File): Promise<Blob> {
  if (!fichier.type.startsWith('image/') || typeof createImageBitmap !== 'function') return fichier
  try {
    const image = await createImageBitmap(fichier)
    const echelle = Math.min(1, 1600 / Math.max(image.width, image.height))
    const toile = document.createElement('canvas')
    toile.width = Math.round(image.width * echelle)
    toile.height = Math.round(image.height * echelle)
    toile.getContext('2d')!.drawImage(image, 0, 0, toile.width, toile.height)
    return await new Promise((ok) => toile.toBlob((b) => ok(b ?? fichier), 'image/jpeg', 0.85))
  } catch {
    return fichier
  }
}

export default function Devis({ prestationParDefaut = '' }: { prestationParDefaut?: string }) {
  const [etat, setEtat] = useState<Etat>('idle')
  const [photos, setPhotos] = useState<File[]>([])
  const [erreurPhotos, setErreurPhotos] = useState('')

  function choisirPhotos(liste: FileList | null) {
    const images = [...(liste ?? [])].filter((f) => f.type.startsWith('image/'))
    setErreurPhotos(images.length > PHOTOS_MAX ? `${PHOTOS_MAX} photos au maximum : les premières sont gardées.` : '')
    setPhotos(images.slice(0, PHOTOS_MAX))
  }

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setEtat('envoi')
    try {
      const donnees = new FormData(form)
      donnees.delete('photos')
      for (const [i, p] of photos.entries()) {
        const reduite = await reduire(p)
        if (reduite.size <= TAILLE_MAX) donnees.append('photos[]', reduite, `photo-${i + 1}.jpg`)
      }
      const res = await fetch('/api/devis.php', { method: 'POST', body: donnees })
      if (!res.ok) throw new Error(res.status === 429 ? 'limite' : '')
      setEtat('ok')
      setPhotos([])
      form.reset()
    } catch (err) {
      setEtat(err instanceof Error && err.message === 'limite' ? 'limite' : 'erreur')
    }
  }

  return (
    <section id="devis" className="scroll-mt-20 bg-fond">
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-12">
        <div id="contact" className="flex scroll-mt-24 flex-col gap-6 lg:col-span-5">
          <TitreSection label="Demande de devis" titre="Décrivez-nous le problème" texte="Quelques photos des dégâts et votre modèle de voiture suffisent pour une première estimation. On vous rappelle pour fixer un rendez-vous." />
          <ul className="flex flex-col gap-4 text-[16px]">
            <li className="flex items-start gap-3"><Ico nom="telephone" className="mt-0.5 shrink-0 text-rouge" /><span><strong className="block">Téléphone · dépannage 24 h/24</strong><a href={`tel:${site.telephoneLien}`} className="text-noir">{site.telephone}</a></span></li>
            <li className="flex items-start gap-3"><Ico nom="lieu" className="mt-0.5 shrink-0 text-rouge" /><span><strong className="block">Accueil et bureau</strong>{adresseLieu(accueil)}<strong className="mt-2 block">Atelier</strong>{adresseLieu(atelier)} <a href="/#acces" className="text-rouge">(plan)</a></span></li>
            <li className="flex items-start gap-3"><Ico nom="horloge" className="mt-0.5 shrink-0 text-rouge" />
              <span className="flex flex-col"><strong>Horaires</strong>
                {site.horaires.map(([j, h]) => <span key={j} className="text-gris">{j} : <span className="text-noir">{h}</span></span>)}
              </span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          {etat === 'ok' ? (
            <div role="status" className="flex flex-col gap-3 rounded-lg border border-ligne bg-white p-8">
              <p className="font-titre text-[32px] font-bold uppercase">Demande envoyée</p>
              <p className="text-gris">Merci ! Le garage vous recontacte rapidement pour votre devis.</p>
            </div>
          ) : (
            <form onSubmit={envoyer} className="flex flex-col gap-4 rounded-lg border border-ligne bg-white p-5 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={lbl}>Nom<input name="nom" required autoComplete="name" className={champ} /></label>
                <label className={lbl}>Téléphone<input name="telephone" type="tel" required autoComplete="tel" inputMode="tel" className={champ} /></label>
                <label className={lbl}><span>E-mail <span className="font-normal text-gris">(facultatif)</span></span><input name="email" type="email" autoComplete="email" className={champ} /></label>
                <label className={lbl}>Véhicule<input name="vehicule" required placeholder="Marque, modèle, année" className={champ} /></label>
              </div>
              <label className={lbl}>Prestation
                <select name="prestation" defaultValue={prestationParDefaut} className={champ}>
                  <option value="">Je ne sais pas</option>
                  {PRESTATIONS.map((p) => <option key={p.chemin} value={p.nom}>{p.nom}</option>)}
                </select>
              </label>
              <label className={lbl}>Votre demande<textarea name="message" rows={4} required placeholder="Ce qui s’est passé, les bruits, les voyants allumés…" className={`${champ} resize-y`} /></label>
              <label className={`${lbl} cursor-pointer`}>
                <span>Photos des dégâts <span className="font-normal text-gris">(facultatif, {PHOTOS_MAX} au maximum)</span></span>
                <span className="flex items-center gap-3 rounded-md border-2 border-dashed border-[#C9CDD3] px-4 py-4 text-gris hover:border-rouge">
                  <Ico nom="photo" className="shrink-0 text-rouge" />
                  {photos.length ? `${photos.length} photo${photos.length > 1 ? 's' : ''} : ${photos.map((p) => p.name).join(', ')}` : 'Prendre ou choisir des photos'}
                </span>
                <input name="photos" type="file" accept="image/*" multiple onChange={(e) => choisirPhotos(e.target.files)} className="sr-only" />
              </label>
              {erreurPhotos && <p className="text-[14px] text-[#B42318]">{erreurPhotos}</p>}
              <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-normal text-gris">
                <input type="checkbox" name="consentement" required className="mt-0.5 h-5 w-5 shrink-0 accent-rouge" />
                <span>J’accepte que ces informations soient utilisées pour me recontacter au sujet de ma demande (<a href="/confidentialite" className="text-noir">confidentialité</a>).</span>
              </label>
              {/* Piège à robots : invisible pour un humain */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label>Site web<input name="site_web" tabIndex={-1} autoComplete="off" /></label></div>
              {etat === 'erreur' && <p role="alert" className="text-[14px] text-[#B42318]">L’envoi a échoué. Appelez le garage au {site.telephone}.</p>}
              {etat === 'limite' && <p role="alert" className="text-[14px] text-[#B42318]">Plusieurs demandes ont déjà été envoyées aujourd’hui. Appelez le garage au {site.telephone}.</p>}
              <button type="submit" disabled={etat === 'envoi'} className={`${btnRouge} w-full border-0 disabled:opacity-60 sm:w-auto sm:self-start`}>
                {etat === 'envoi' ? 'Envoi…' : 'Envoyer ma demande de devis'}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  )
}
