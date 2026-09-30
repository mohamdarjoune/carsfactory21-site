import Header from '../components/Header'
import Footer from '../components/Footer'
import Devis from '../components/Devis'
import { Container, Ico, Photo, TitreSection, btnClair, btnRouge, type NomPhoto } from '../components/ui'
import { site, adresseComplete } from '../config'
import { PRESTATIONS, type PagePrestation } from './services'

const rempli = (v: string) => v !== '' && !v.startsWith('[')

/** Données structurées pour Google : un garage (AutoRepair), seulement avec les informations déjà remplies. */
function donneesGarage() {
  const d: Record<string, unknown> = {
    '@context': 'https://schema.org', '@type': 'AutoRepair', '@id': `${site.siteUrl}/#garage`,
    name: site.nom, url: `${site.siteUrl}/`, image: `${site.siteUrl}/photos/atelier-1920.webp`,
    description: 'Carrosserie, peinture, covering, réparation après sinistre, mécanique, entretien, diagnostic et dépannage 24 h/24 à Chevigny-Saint-Sauveur, près de Dijon.',
    telephone: site.telephoneLien,
    address: { '@type': 'PostalAddress', streetAddress: site.adresse.rue, postalCode: site.adresse.codePostal, addressLocality: site.adresse.ville, addressRegion: 'Bourgogne-Franche-Comté', addressCountry: 'FR' },
    openingHoursSpecification: site.horairesGoogle.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.jours, opens: h.ouverture, closes: h.fermeture })),
    areaServed: [...site.zone.map((name) => ({ '@type': 'City', name })), { '@type': 'AdministrativeArea', name: site.adresse.departement }],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Prestations', itemListElement: PRESTATIONS.map((p) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.nom, url: site.siteUrl + p.chemin } })) },
  }
  if (rempli(site.email)) d.email = site.email
  return d
}

function CartePrestation({ p, sombre = false }: { p: PagePrestation; sombre?: boolean }) {
  return (
    <a href={p.chemin} className={`group flex flex-col overflow-hidden rounded-lg no-underline transition-transform hover:-translate-y-1 ${sombre ? 'bg-acier text-white' : 'border border-ligne bg-white text-noir'}`}>
      <Photo nom={p.icone as NomPhoto} alt={p.nom} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="flex items-center gap-2 text-[28px] font-bold uppercase leading-none"><Ico nom={p.icone} className={`shrink-0 ${sombre ? 'text-rouge-vif' : 'text-rouge'}`} />{p.nom}</h3>
        <p className={`text-[15px] leading-relaxed ${sombre ? 'text-white/70' : 'text-gris'}`}>{p.resume}</p>
        <span className={`mt-auto flex items-center gap-1.5 pt-2 text-[15px] font-semibold ${sombre ? 'text-rouge-vif' : 'text-rouge'}`}>En savoir plus <Ico nom="fleche" taille={18} className="transition-transform group-hover:translate-x-1" /></span>
      </div>
    </a>
  )
}

const ETAPES: [string, string][] = [
  ['Devis', 'Par téléphone, au garage ou en ligne avec des photos des dégâts.'],
  ['Rendez-vous', 'Un créneau du mardi au samedi pour déposer votre véhicule.'],
  ['Réparation', 'Les travaux validés dans le devis, rien de plus sans votre accord.'],
  ['Restitution', 'Explication des travaux réalisés et remise des clés.'],
]

const FAQ: [string, string][] = [
  ['Puis-je obtenir un devis sans venir au garage ?', 'Oui. Remplissez le formulaire de devis en ajoutant des photos des dégâts et le modèle de votre voiture : le garage vous recontacte pour une première estimation.'],
  ['Quels sont les horaires du garage ?', 'Le garage est ouvert du mardi au samedi, de 9 h à 19 h. Il est fermé le lundi et le dimanche. Le dépannage fonctionne 24 h/24, 7 j/7.'],
  ['Le garage s’occupe-t-il des démarches avec mon assurance ?', 'Le garage vous aide à préparer votre dossier et à présenter le véhicule à l’expert si votre assurance en mandate un.'],
  ['Faut-il prendre rendez-vous ?', '[À confirmer avec le garage : rendez-vous obligatoire ou possibilité de passer sans rendez-vous.]'],
]

export default function Accueil() {
  const appeler = `tel:${site.telephoneLien}`
  const depannage = PRESTATIONS.find((p) => p.chemin === '/depannage-auto')!
  return (
    <>
      <Header />
      <main>
        {/* ── Grande photo d'accroche ── */}
        <section className="relative isolate overflow-hidden bg-noir text-white">
          <Photo nom="atelier" alt="Atelier de réparation automobile" prioritaire mention={false} className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/85 to-noir/30" />
          <Container className="flex min-h-[640px] flex-col justify-center gap-7 py-20 md:min-h-[720px]">
            <a href={appeler} className="flex items-center gap-2 self-start rounded-full bg-rouge px-4 py-2 text-[14px] font-semibold text-white no-underline hover:bg-[#A91F13]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />Dépannage 24 h/24 · {site.telephone}
            </a>
            <h1 className="max-w-[820px] text-[56px] font-bold uppercase leading-[0.9] md:text-[96px]">
              Carrosserie <span className="text-rouge-vif">&amp;</span> mécanique
            </h1>
            <p className="max-w-[580px] text-[18px] leading-relaxed text-white/80 md:text-[20px]">
              Carrosserie, peinture, covering, entretien et mécanique à Chevigny-Saint-Sauveur, à deux pas de Dijon. Envoyez des photos pour votre devis, sans vous déplacer.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#devis" className={btnRouge}>Demander un devis</a>
              <a href={appeler} className={btnClair}><Ico nom="telephone" taille={18} />{site.telephone}</a>
            </div>
            <p className="flex items-center gap-2 text-[14px] text-white/65"><Ico nom="horloge" taille={18} />Du mardi au samedi, 9 h – 19 h · {site.adresse.ville}</p>
          </Container>
          <span className="absolute bottom-3 right-3 text-[11px] text-white/50">Photo non contractuelle</span>
        </section>

        {/* ── Engagements ── */}
        <section aria-label="Nos engagements" className="border-b-4 border-rouge bg-acier text-white">
          <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {site.atouts.map(([t, d]) => (
              <div key={t} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rouge"><Ico nom="coche" taille={18} /></span>
                <div><p className="font-titre text-[22px] font-bold uppercase leading-tight">{t}</p><p className="text-[14px] text-white/65">{d}</p></div>
              </div>
            ))}
          </Container>
        </section>

        {/* ── Carrosserie ── */}
        <section id="carrosserie" className="scroll-mt-20">
          <Container className="flex flex-col gap-10 py-16 md:py-24">
            <TitreSection label="Carrosserie" titre="Votre voiture comme avant" texte="Chocs, rayures, bosses ou dégâts après un sinistre : la carrosserie est réparée puis repeinte à la teinte d’origine. Envie d’une nouvelle couleur ? Pensez au covering." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PRESTATIONS.filter((p) => p.famille === 'Carrosserie').map((p) => <CartePrestation key={p.chemin} p={p} />)}
            </div>
          </Container>
        </section>

        {/* ── Mécanique ── */}
        <section id="mecanique" className="scroll-mt-20 bg-noir">
          <Container className="flex flex-col gap-10 py-16 md:py-24">
            <TitreSection clair label="Mécanique" titre="Entretien, pannes, diagnostic" texte="De la vidange au remplacement de l’embrayage, la panne est d’abord diagnostiquée, puis expliquée avant d’intervenir." />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PRESTATIONS.filter((p) => p.famille === 'Mécanique').map((p) => <CartePrestation key={p.chemin} p={p} sombre />)}
            </div>
          </Container>
        </section>

        {/* ── Dépannage 24 h/24 ── */}
        <section id="depannage" className="relative isolate scroll-mt-20 overflow-hidden bg-rouge text-white">
          <Container className="grid items-center gap-8 py-14 md:py-16 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80">Jour et nuit, 7 jours sur 7</p>
              <h2 className="text-[44px] font-bold uppercase leading-[0.92] md:text-[64px]">En panne ? On vient vous chercher.</h2>
              <p className="max-w-[520px] text-[17px] leading-relaxed text-white/85">{depannage.accroche}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={appeler} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-[17px] font-bold text-rouge no-underline hover:bg-white/90"><Ico nom="telephone" taille={20} />{site.telephone}</a>
                <a href={depannage.chemin} className={btnClair}>Comment ça se passe</a>
              </div>
            </div>
            <Photo nom="depannage" alt="Voiture chargée sur une dépanneuse" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[16/10] rounded-lg" />
          </Container>
        </section>

        {/* ── Aussi au garage ── */}
        <section>
          <Container className="flex flex-col gap-10 py-16 md:py-24">
            <TitreSection label="Aussi au garage" titre="Lavage et occasions" />
            <div className="grid gap-5 md:grid-cols-2">
              {site.autresServices.map(([t, d, photo]) => (
                <div key={t} className="grid overflow-hidden rounded-lg border border-ligne sm:grid-cols-2">
                  <Photo nom={photo} alt={t} sizes="(min-width: 768px) 300px, 100vw" className="aspect-[4/3] sm:aspect-auto sm:h-full" />
                  <div className="flex flex-col justify-center gap-2 p-6">
                    <h3 className="text-[30px] font-bold uppercase leading-none">{t}</h3>
                    <p className="text-[15px] leading-relaxed text-gris">{d}</p>
                    <a href={appeler} className="mt-2 font-semibold text-rouge">Se renseigner →</a>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Comment ça se passe ── */}
        <section className="bg-fond">
          <Container className="flex flex-col gap-10 py-16 md:py-24">
            <TitreSection label="Simple et clair" titre="Comment ça se passe" />
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ETAPES.map(([t, d], i) => (
                <li key={t} className="flex flex-col gap-2 border-t-4 border-noir pt-4">
                  <span className="font-titre text-[56px] font-bold leading-none text-rouge">0{i + 1}</span>
                  <p className="font-titre text-[26px] font-bold uppercase leading-none">{t}</p>
                  <p className="text-[15px] leading-relaxed text-gris">{d}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* ── Le garage ── */}
        <section id="garage" className="scroll-mt-20">
          <Container className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
            <Photo nom="garage" alt="Véhicules en réparation dans un atelier" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/3] rounded-lg" />
            <div className="flex flex-col gap-6">
              <TitreSection label="Le garage" titre={site.nom} texte="[Présentation du garage : son histoire, l’équipe, les équipements de l’atelier, ce qui le distingue. Quelques phrases fournies par le client.]" />
              <dl className="grid gap-4 text-[15px] sm:grid-cols-2">
                <div className="sm:col-span-2"><dt className="font-semibold">Adresse</dt><dd className="text-gris">{adresseComplete}</dd></div>
                <div><dt className="font-semibold">Téléphone</dt><dd><a href={appeler} className="text-noir">{site.telephone}</a></dd></div>
                {site.horaires.map(([j, h]) => <div key={j}><dt className="font-semibold">{j}</dt><dd className="text-gris">{h}</dd></div>)}
              </dl>
              <a href={site.lienItineraire} target="_blank" rel="noopener noreferrer" className={`${btnRouge} self-start`}><Ico nom="lieu" taille={18} />Itinéraire</a>
            </div>
          </Container>
        </section>

        {/* ── Zone ── */}
        <section aria-labelledby="titre-zone" className="bg-noir text-white">
          <Container className="flex flex-col gap-5 py-12">
            <h2 id="titre-zone" className="text-[30px] font-bold uppercase leading-none md:text-[40px]">À deux pas de Dijon</h2>
            <p className="max-w-[720px] text-[16px] text-white/70">Le garage est à Chevigny-Saint-Sauveur, à l’est de Dijon. Il accueille les conducteurs de toute l’agglomération et des communes voisines :</p>
            <ul className="flex flex-wrap gap-2">
              {site.zone.map((v) => <li key={v} className="rounded-full border border-white/20 px-3 py-1.5 text-[14px] text-white/85">{v}</li>)}
            </ul>
          </Container>
        </section>

        {/* ── Avis ── */}
        <section id="avis" className="scroll-mt-20">
          <Container className="flex flex-col gap-10 py-16 md:py-24">
            <TitreSection label="Avis clients" titre="Ils nous ont confié leur voiture" texte="Les avis publiés ici sont de vrais avis de clients, repris de la fiche Google du garage avec leur accord." />
            <div className="grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <figure key={n} className="m-0 flex flex-col gap-4 rounded-lg border border-ligne p-6">
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
        <section className="border-t border-ligne">
          <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-12">
            <div className="lg:col-span-4"><TitreSection label="FAQ" titre="Questions fréquentes" /></div>
            <div className="flex flex-col divide-y divide-ligne border-y border-ligne lg:col-span-8">
              {FAQ.map(([q, r]) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold">
                    {q}<span className="text-[26px] text-rouge transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="pt-3 text-[16px] leading-relaxed text-gris">{r}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <Devis />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesGarage()) }} />
    </>
  )
}
