import { vers } from '../vers'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Devis from '../components/Devis'
import Acces from '../components/Acces'
import StatutOuverture from '../components/Statut'
import { EncartVehicule } from '../components/MonVehicule'
import Rendezvous from '../components/Rendezvous'
import { Container, Ico, Photo, TitreSection, btnClair, btnRouge, type NomPhoto } from '../components/ui'
import { site, accueil, atelier } from '../config'
import { PRESTATIONS, type PagePrestation } from './services'

const rempli = (v: string) => v !== '' && !v.startsWith('[')

/** Données structurées pour Google : un garage (AutoRepair), seulement avec les informations déjà remplies. */
function donneesGarage() {
  const d: Record<string, unknown> = {
    '@context': 'https://schema.org', '@type': 'AutoRepair', '@id': `${site.siteUrl}/#garage`,
    name: site.nom, url: `${site.siteUrl}/`, image: `${site.siteUrl}/photos/atelier-1920.webp`,
    description: 'Carrosserie, peinture, covering, réparation après sinistre, mécanique, entretien, diagnostic et dépannage 24 h/24 à Chevigny-Saint-Sauveur, près de Dijon.',
    telephone: site.telephoneLien,
    geo: { '@type': 'GeoCoordinates', latitude: atelier.lat, longitude: atelier.lon },
    location: site.lieux.map((l) => ({ '@type': 'Place', name: `Cars Factory 21 · ${l.titre}`, address: { '@type': 'PostalAddress', streetAddress: l.rue, postalCode: l.codePostal, addressLocality: l.ville, addressCountry: 'FR' }, geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lon } })),
    address: { '@type': 'PostalAddress', streetAddress: site.adresse.rue, postalCode: site.adresse.codePostal, addressLocality: site.adresse.ville, addressRegion: 'Bourgogne-Franche-Comté', addressCountry: 'FR' },
    openingHoursSpecification: site.horairesGoogle.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.jours, opens: h.ouverture, closes: h.fermeture })),
    areaServed: [...site.zone.map((name) => ({ '@type': 'City', name })), { '@type': 'AdministrativeArea', name: site.adresse.departement }],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Prestations', itemListElement: PRESTATIONS.map((p) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.nom, url: site.siteUrl + p.chemin } })) },
  }
  if (rempli(site.email)) d.email = site.email
  return d
}

/** La vidéo de présentation, décrite pour Google (peut apparaître dans les résultats vidéo). */
const VIDEO = {
  '@context': 'https://schema.org', '@type': 'VideoObject',
  name: 'Cars Factory 21 : le garage en moins d’une minute',
  description: 'Carrosserie, peinture, covering, mécanique, diagnostic, lavage, et deux façons de nous confier votre voiture : dépannage 24 h/24 jusqu’à l’atelier de Chevigny-Saint-Sauveur, ou dépôt à l’accueil de Saint-Apollinaire. En dessin animé.',
  thumbnailUrl: `${site.siteUrl}/videos/presentation-garage.webp`,
  contentUrl: `${site.siteUrl}/videos/presentation-garage.mp4`,
  uploadDate: '2026-09-30',
  duration: 'PT56S',
  publisher: { '@id': `${site.siteUrl}/#garage` },
}

/** Tuile de prestation : ligne compacte sur téléphone (vignette + texte), carte avec photo sur ordinateur. */
function Tuile({ p }: { p: PagePrestation }) {
  return (
    <a href={vers(p.chemin)} className="group flex min-h-[92px] overflow-hidden rounded-xl border border-ligne bg-white text-noir no-underline shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:flex-col">
      <Photo nom={p.icone as NomPhoto} alt="" sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 112px" className="w-28 shrink-0 sm:aspect-[16/10] sm:w-auto" />
      <div className="flex flex-1 items-center gap-3 p-3.5 sm:flex-col sm:items-start sm:gap-1.5 sm:p-4">
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-[21px] font-bold uppercase leading-none sm:text-[24px]"><Ico nom={p.icone} taille={20} className="hidden shrink-0 text-rouge sm:block" />{p.nom}</h3>
          <p className="mt-1 text-[14px] leading-snug text-gris">{p.resume}</p>
        </div>
        <Ico nom="droite" taille={20} className="shrink-0 text-rouge transition-transform group-hover:translate-x-1 sm:hidden" />
        <span className="hidden items-center gap-1 pt-1 text-[14px] font-semibold text-rouge sm:flex">Voir la prestation <Ico nom="fleche" taille={16} /></span>
      </div>
    </a>
  )
}

const ETAPES: [string, string][] = [
  ['Devis', 'Par téléphone, à l’accueil ou en ligne avec des photos.'],
  ['Dépôt', 'À l’accueil de Saint-Apollinaire, du mardi au samedi.'],
  ['Réparation', 'À l’atelier, seulement les travaux validés.'],
  ['Restitution', 'Votre voiture revient à l’accueil, travaux expliqués.'],
]

const FAQ: [string, string][] = [
  ['Puis-je obtenir un devis sans venir au garage ?', 'Oui. Remplissez le formulaire de devis en ajoutant des photos des dégâts et le modèle de votre voiture : le garage vous recontacte pour une première estimation.'],
  ['Où dois-je déposer ma voiture ?', 'À l’accueil, 6 rue de Bastogne à Saint-Apollinaire, près des commerces et des transports en commun. Le garage emmène ensuite votre voiture à son atelier de Chevigny-Saint-Sauveur et vous la ramène une fois les travaux terminés.'],
  ['Quels sont les horaires du garage ?', 'Le garage est ouvert du mardi au samedi, de 9 h à 19 h. Il est fermé le lundi et le dimanche. Le dépannage fonctionne 24 h/24, 7 j/7.'],
  ['Le garage s’occupe-t-il des démarches avec mon assurance ?', 'Le garage vous aide à préparer votre dossier et à présenter le véhicule à l’expert si votre assurance en mandate un.'],
  ['Faut-il prendre rendez-vous ?', '[À confirmer avec le garage : rendez-vous obligatoire ou possibilité de passer sans rendez-vous.]'],
]

export default function Accueil() {
  const appeler = `tel:${site.telephoneLien}`
  const depannage = PRESTATIONS.find((p) => p.chemin === '/depannage-auto')!
  const tuileAction = 'flex min-h-[88px] flex-col justify-center gap-1 rounded-xl bg-white p-4 text-noir no-underline shadow-[0_8px_30px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 sm:min-h-[104px] sm:p-5'
  return (
    <>
      <Header />
      <main>
        {/* ── Accroche courte : l'essentiel tient dans le premier écran du téléphone ── */}
        <section className="relative isolate overflow-hidden bg-noir text-white">
          <Photo nom="atelier" alt="Atelier de réparation automobile" prioritaire mention={false} className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/85 to-noir/35" />
          <Container className="flex flex-col gap-4 pb-24 pt-8 md:gap-6 md:pb-32 md:pt-16">
            <StatutOuverture clair />
            <h1 className="max-w-[820px] text-[46px] font-bold uppercase leading-[0.9] md:text-[88px]">
              Carrosserie <span className="text-rouge-vif">&amp;</span> mécanique
            </h1>
            <p className="max-w-[580px] text-[16px] leading-relaxed text-white/80 md:text-[19px]">
              Près de Dijon : accueil à Saint-Apollinaire, atelier à Chevigny-Saint-Sauveur. Devis sur photos, dépannage 24 h/24.
            </p>
            <div className="hidden gap-3 sm:flex">
              <a href="#devis" className={btnRouge}>Demander un devis</a>
              <a href={appeler} className={btnClair}><Ico nom="telephone" taille={18} />{site.telephone}</a>
            </div>
          </Container>
          <span className="absolute bottom-2 right-3 text-[11px] text-white/45">Photo non contractuelle</span>
        </section>

        {/* ── Tuiles d'action, posées sur la photo ── */}
        <section aria-label="Que voulez-vous faire ?" className="relative z-10 -mt-16 md:-mt-20">
          <Container className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <a href="#devis" className={tuileAction}>
              <Ico nom="devis" taille={28} className="text-rouge" /><span className="text-[17px] font-bold leading-tight">Demander un devis</span><span className="hidden text-[13px] text-gris sm:block">Avec des photos, sans vous déplacer</span>
            </a>
            <a href={appeler} className={`${tuileAction} !bg-rouge !text-white`}>
              <Ico nom="depannage" taille={28} /><span className="text-[17px] font-bold leading-tight">Dépannage 24 h/24</span><span className="text-[13px] text-white/85">{site.telephone}</span>
            </a>
            <a href="#acces" className={tuileAction}>
              <Ico nom="lieu" taille={28} className="text-rouge" /><span className="text-[17px] font-bold leading-tight">Nos adresses</span><span className="hidden text-[13px] text-gris sm:block">Accueil · atelier · horaires</span>
            </a>
            <a href="#rdv" className={tuileAction}>
              <Ico nom="calendrier" taille={28} className="text-rouge" /><span className="text-[17px] font-bold leading-tight">Prendre rendez-vous</span><span className="hidden text-[13px] text-gris sm:block">Choisissez le jour et l’heure</span>
            </a>
          </Container>
        </section>

        {/* ── Prestations ── */}
        <section id="prestations" className="scroll-mt-32">
          <Container className="flex flex-col gap-8 py-10 md:gap-10 md:py-16">
            <div id="carrosserie" className="flex scroll-mt-32 flex-col gap-4">
              <h2 className="flex items-baseline justify-between gap-3 text-[30px] font-bold uppercase leading-none md:text-[44px]">Carrosserie <span className="font-sans text-[13px] font-normal normal-case text-gris">Photos non contractuelles</span></h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PRESTATIONS.filter((p) => p.famille === 'Carrosserie').map((p) => <Tuile key={p.chemin} p={p} />)}
              </div>
            </div>
            <div id="mecanique" className="flex scroll-mt-32 flex-col gap-4">
              <h2 className="text-[30px] font-bold uppercase leading-none md:text-[44px]">Mécanique et services</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PRESTATIONS.filter((p) => p.famille !== 'Carrosserie').map((p) => <Tuile key={p.chemin} p={p} />)}
              </div>
            </div>
          </Container>
        </section>

        <Rendezvous />

        <div className="h-8 md:h-12" />
        <EncartVehicule />

        <div className="h-10 md:h-16" />
        <Acces />

        {/* ── Dépannage 24 h/24 ── */}
        <section id="depannage" className="relative isolate scroll-mt-32 overflow-hidden bg-rouge text-white">
          <Container className="grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">Jour et nuit, 7 jours sur 7</p>
              <h2 className="text-[40px] font-bold uppercase leading-[0.92] md:text-[64px]">En panne ? On vient vous chercher.</h2>
              <p className="max-w-[520px] text-[16px] leading-relaxed text-white/85 md:text-[17px]">{depannage.accroche}</p>
              <a href={appeler} className="inline-flex min-h-14 items-center justify-center gap-2 self-stretch rounded-md bg-white px-5 py-3 text-[19px] font-bold text-rouge no-underline hover:bg-white/90 sm:self-start"><Ico nom="telephone" taille={22} />{site.telephone}</a>
            </div>
            <Photo nom="depannage" alt="Voiture chargée sur une dépanneuse" sizes="(min-width: 1024px) 560px, 100vw" className="hidden aspect-[16/10] rounded-lg sm:block" />
          </Container>
        </section>

        {/* ── Vidéo de présentation (chargée seulement au clic sur Lecture) ── */}
        <section id="video" aria-labelledby="titre-video" className="scroll-mt-32 bg-noir text-white">
          <Container className="grid items-center gap-6 py-12 md:gap-10 md:py-20 lg:grid-cols-12">
            <div className="flex flex-col gap-3 lg:col-span-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-rouge-vif">En vidéo</p>
              <h2 id="titre-video" className="text-[34px] font-bold uppercase leading-[0.95] md:text-[56px]">Le garage en moins d’une minute</h2>
              <p className="text-[16px] leading-relaxed text-white/75">Tous les services de Cars Factory 21, en dessin animé.</p>
            </div>
            <div className="lg:col-span-8">
              <video controls preload="none" playsInline poster={vers('/videos/presentation-garage.webp')} width={1280} height={720}
                className="aspect-video w-full rounded-lg border border-white/10 bg-acier shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                aria-label="Vidéo de présentation des services de Cars Factory 21, en dessin animé">
                <source src={vers('/videos/presentation-garage.mp4')} type="video/mp4" />
                Votre navigateur ne lit pas cette vidéo. <a href={vers('/videos/presentation-garage.mp4')} className="text-rouge-vif">Télécharger la vidéo</a>.
              </video>
              <p className="mt-2 text-right text-[12px] text-white/45">Illustrations non contractuelles</p>
            </div>
          </Container>
        </section>

        {/* ── Aussi au garage ── */}
        <section id="autres" className="scroll-mt-32">
          <Container className="flex flex-col gap-4 py-10 md:py-16">
            <h2 className="text-[30px] font-bold uppercase leading-none md:text-[44px]">Aussi au garage</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {site.autresServices.map(([t, d, photo]) => (
                <a key={t} href={appeler} className="group flex min-h-[92px] overflow-hidden rounded-xl border border-ligne bg-white text-noir no-underline hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  <Photo nom={photo} alt="" sizes="(min-width: 768px) 220px, 112px" className="w-28 shrink-0 md:w-52" />
                  <div className="flex flex-1 items-center gap-3 p-3.5 md:p-5">
                    <div className="flex-1"><h3 className="text-[21px] font-bold uppercase leading-none md:text-[26px]">{t}</h3><p className="mt-1 text-[14px] leading-snug text-gris">{d}</p><p className="mt-1 text-[13px] font-semibold text-rouge">Se renseigner par téléphone</p></div>
                    <Ico nom="telephone" taille={20} className="shrink-0 text-rouge" />
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Comment ça se passe (compact) ── */}
        <section className="bg-fond">
          <Container className="flex flex-col gap-6 py-10 md:py-16">
            <h2 className="text-[30px] font-bold uppercase leading-none md:text-[44px]">Comment ça se passe</h2>
            <ol className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {ETAPES.map(([t, d], i) => (
                <li key={t} className="flex flex-col gap-1 rounded-xl bg-white p-4 md:p-5">
                  <span className="font-titre text-[34px] font-bold leading-none text-rouge md:text-[44px]">0{i + 1}</span>
                  <p className="font-titre text-[21px] font-bold uppercase leading-none md:text-[24px]">{t}</p>
                  <p className="text-[13px] leading-snug text-gris md:text-[15px]">{d}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ── Le garage ── */}
        <section id="garage" className="scroll-mt-32">
          <Container className="grid items-center gap-6 py-10 md:gap-10 md:py-16 lg:grid-cols-2">
            <Photo nom="garage" alt="Véhicules en réparation dans un atelier" sizes="(min-width: 1024px) 560px, 100vw" className="hidden aspect-[4/3] rounded-lg lg:block" />
            <div className="flex flex-col gap-5">
              <TitreSection label="Le garage" titre={site.nom} texte="[Présentation du garage : son histoire, l’équipe, les équipements de l’atelier, ce qui le distingue. Quelques phrases fournies par le client.]" />
              <a href="#acces" className="self-start font-semibold text-rouge">Voir nos deux adresses →</a>
            </div>
          </Container>
        </section>

        {/* ── Avis ── */}
        <section id="avis" className="scroll-mt-32 bg-fond">
          <Container className="flex flex-col gap-6 py-10 md:py-16">
            <h2 className="text-[30px] font-bold uppercase leading-none md:text-[44px]">Avis clients</h2>
            <p className="text-[15px] text-gris">De vrais avis, repris de la fiche Google du garage avec l’accord des clients.</p>
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {[1, 2, 3].map((n) => (
                <figure key={n} className="m-0 flex w-[82%] shrink-0 snap-start flex-col gap-3 rounded-xl border border-ligne bg-white p-5 md:w-auto">
                  <p className="text-[18px] text-rouge">[Note ★]</p>
                  <blockquote className="m-0 text-[16px] leading-relaxed">« [Avis réel d’un client] »</blockquote>
                  <figcaption className="text-[14px] text-gris">[Prénom], [prestation]</figcaption>
                </figure>
              ))}
            </div>
            {site.lienAvisGoogle && <a href={site.lienAvisGoogle} target="_blank" rel="noopener noreferrer" className="self-start font-semibold text-rouge">Voir tous les avis sur Google →</a>}
          </Container>
        </section>

        {/* ── Questions fréquentes ── */}
        <section>
          <Container className="grid gap-6 py-10 md:gap-10 md:py-16 lg:grid-cols-12">
            <h2 className="text-[30px] font-bold uppercase leading-none md:text-[44px] lg:col-span-4">Questions fréquentes</h2>
            <div className="flex flex-col divide-y divide-ligne border-y border-ligne lg:col-span-8">
              {FAQ.map(([q, r]) => (
                <details key={q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold">
                    {q}<span className="text-[26px] text-rouge transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="pb-4 text-[16px] leading-relaxed text-gris">{r}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Zone ── */}
        <section aria-labelledby="titre-zone" className="bg-noir text-white">
          <Container className="flex flex-col gap-4 py-10">
            <h2 id="titre-zone" className="text-[28px] font-bold uppercase leading-none md:text-[40px]">À deux pas de Dijon</h2>
            <p className="max-w-[720px] text-[15px] text-white/70">Accueil à {accueil.ville}, atelier à {atelier.ville} : le garage accueille les conducteurs de toute l’agglomération et des communes voisines.</p>
            <ul className="flex flex-wrap gap-2">
              {site.zone.map((v) => <li key={v} className="rounded-full border border-white/20 px-3 py-1.5 text-[14px] text-white/85">{v}</li>)}
            </ul>
          </Container>
        </section>

        <Devis />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesGarage()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO) }} />
    </>
  )
}
