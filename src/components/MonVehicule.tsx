import { useEffect, useRef, type FormEvent } from 'react'
import { Container, Ico, btnNoir, btnRouge } from './ui'
import { decrireVehicule, enregistrerVehicule, ouvrirMonVehicule, useVehicule } from '../vehicule'

const champ = 'w-full rounded-md border border-[#C9CDD3] bg-white px-3.5 py-3 text-base text-noir'

/** Fenêtre « Mon véhicule » : une seule dans la page, ouverte depuis l'en-tête, les tuiles ou l'encart. */
export function FenetreVehicule() {
  const ref = useRef<HTMLDialogElement>(null)
  const v = useVehicule()
  useEffect(() => {
    const ouvrir = () => ref.current?.showModal()
    window.addEventListener('cf21-ouvrir-vehicule', ouvrir)
    return () => window.removeEventListener('cf21-ouvrir-vehicule', ouvrir)
  }, [])

  function valider(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const t = (k: string) => String(d.get(k) ?? '').trim().slice(0, 60)
    enregistrerVehicule({ modele: t('modele'), annee: t('annee'), immat: t('immat') })
    ref.current?.close()
  }

  return (
    <dialog ref={ref} aria-labelledby="titre-vehicule" className="m-auto w-[min(92vw,480px)] rounded-xl p-0 backdrop:bg-black/60">
      <form method="dialog" onSubmit={valider} key={v ? decrireVehicule(v) : 'vide'} className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="titre-vehicule" className="text-[32px] font-bold uppercase leading-none">Mon véhicule</h2>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Fermer" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-fond"><Ico nom="fermer" /></button>
        </div>
        <p className="text-[15px] text-gris">Il sera ajouté automatiquement à votre demande de devis. Il reste sur ce téléphone : rien n’est envoyé tant que vous n’envoyez pas de demande.</p>
        <label className="flex flex-col gap-1.5 text-[14px] font-medium">Marque et modèle<input name="modele" required defaultValue={v?.modele} placeholder="Ex. : Peugeot 208" autoComplete="off" className={champ} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[14px] font-medium">Année<input name="annee" inputMode="numeric" maxLength={4} defaultValue={v?.annee} placeholder="2018" className={champ} /></label>
          <label className="flex flex-col gap-1.5 text-[14px] font-medium"><span>Immatriculation <span className="font-normal text-gris">(facultatif)</span></span><input name="immat" defaultValue={v?.immat} placeholder="AB-123-CD" autoCapitalize="characters" className={champ} /></label>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className={`${btnRouge} border-0`}>Enregistrer mon véhicule</button>
          {v && <button type="button" onClick={() => { enregistrerVehicule(null); ref.current?.close() }} className="px-2 text-[14px] font-semibold text-gris underline">Oublier ce véhicule</button>}
        </div>
      </form>
    </dialog>
  )
}

/** Encart « Préparez votre devis » (dans l'esprit « Vérifiez la compatibilité »). */
export function EncartVehicule() {
  const v = useVehicule()
  return (
    <Container>
      <div className="flex flex-col gap-4 rounded-xl border-2 border-rouge/30 bg-[#FFF4F2] p-5 sm:flex-row sm:items-center md:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-rouge"><Ico nom="voiture" taille={30} /></span>
        <div className="flex-1">
          {v ? (
            <><p className="text-[18px] font-bold">Votre véhicule : {decrireVehicule(v)}</p><p className="text-[15px] text-gris">Il est déjà ajouté à votre demande de devis.</p></>
          ) : (
            <><p className="text-[18px] font-bold">Préparez votre devis</p><p className="text-[15px] text-gris">Indiquez votre véhicule : il sera ajouté automatiquement à votre demande.</p></>
          )}
        </div>
        <button type="button" onClick={ouvrirMonVehicule} className={`${v ? btnNoir : btnRouge} border-0`}>{v ? 'Modifier' : 'Indiquer mon véhicule'}</button>
      </div>
    </Container>
  )
}
