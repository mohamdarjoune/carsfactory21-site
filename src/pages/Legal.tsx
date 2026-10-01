import { vers } from '../vers'
import type { ReactNode } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Container } from '../components/ui'
import { site, adresseComplete, adresseLieu } from '../config'
import photos from '../photos.json'

function PageTexte({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <Container className="flex max-w-[820px] flex-col gap-6 py-14 text-[16px] leading-relaxed md:py-20 [&_h2]:mt-4 [&_h2]:text-[30px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:leading-none">
          <h1 className="text-[48px] font-bold uppercase leading-none md:text-[64px]">{titre}</h1>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  )
}

export function MentionsLegales() {
  const m = site.mentions
  return (
    <PageTexte titre="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>{m.raisonSociale}, capital {m.capital}<br />Siège et atelier : {adresseComplete}<br />Accueil et bureau : {adresseLieu(site.lieux[0])}<br />SIREN {m.siren} · {m.rcs}<br />Téléphone : {site.telephone} · E-mail : {site.email}</p>
      <p>Responsable de la publication : {m.responsable}.</p>
      <h2>Hébergement</h2>
      <p>{m.hebergeur}</p>
      <h2>Photos</h2>
      <p>Les photos du site sont des <strong>photos d’illustration non contractuelles</strong>, issues d’Unsplash (licence Unsplash, usage commercial autorisé). Elles ne représentent pas l’atelier ni des véhicules réparés par le garage.</p>
      <ul className="list-disc pl-5 text-[15px] text-gris">
        {Object.entries(photos).map(([nom, c]) => (
          <li key={nom}><a href={c.lien} target="_blank" rel="noopener noreferrer" className="text-noir">{nom}</a>{c.auteur ? ` · photo de ${c.auteur}` : ''} sur Unsplash</li>
        ))}
      </ul>
      <h2>Crédits</h2>
      <p>Site réalisé par ÉTÉ 85 – Digital, Data &amp; IA (ete-85.fr).</p>
    </PageTexte>
  )
}

export function Confidentialite() {
  return (
    <PageTexte titre="Confidentialité">
      <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d’audience. Aucune donnée n’est vendue ni transmise à des tiers à des fins commerciales.</p>
      <h2>Plans d’accès</h2>
      <p>Les plans de la page d’accueil sont affichés depuis OpenStreetMap (openstreetmap.org), seulement quand ils apparaissent à l’écran. OpenStreetMap reçoit alors votre adresse IP, comme pour toute image chargée depuis son site ; il ne dépose pas de cookie publicitaire.</p>
      <h2>« Mon véhicule »</h2>
      <p>Si vous enregistrez votre véhicule (modèle, année, immatriculation) avec le bouton « Mon véhicule », ces informations restent uniquement dans le navigateur de votre téléphone ou ordinateur, pour préremplir le devis. Elles ne sont pas envoyées au garage tant que vous n’envoyez pas de demande. Le bouton « Oublier ce véhicule » les efface.</p>
      <h2>Formulaire de devis</h2>
      <p>Les informations envoyées par le formulaire (nom, téléphone, e-mail, véhicule, message, photos) servent uniquement à répondre à votre demande de devis. Elles sont transmises par e-mail au garage et ne sont pas conservées sur le site.</p>
      <p>Responsable du traitement : {site.mentions.raisonSociale}, {adresseComplete}.</p>
      <h2>Vos droits</h2>
      <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à {site.email} ou en appelant le {site.telephone}. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).</p>
    </PageTexte>
  )
}

export function Introuvable() {
  return (
    <PageTexte titre="Page introuvable">
      <p>Cette page n’existe pas ou a changé d’adresse.</p>
      <p><a href={vers('/')} className="font-semibold text-rouge">← Retour à l’accueil</a> · ou appelez le garage au <a href={`tel:${site.telephoneLien}`} className="font-semibold text-noir">{site.telephone}</a>.</p>
    </PageTexte>
  )
}
