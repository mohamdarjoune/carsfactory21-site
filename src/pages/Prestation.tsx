import Header from '../components/Header'
import Footer from '../components/Footer'
import Devis from '../components/Devis'
import { Container, Ico, Photo, TitreSection, btnClair, btnRouge, type NomPhoto } from '../components/ui'
import { site } from '../config'
import { prestation, type PagePrestation } from './services'

const aConfirmer = (t: string) => t.startsWith('[')

function donnees(p: PagePrestation) {
  const url = site.siteUrl + p.chemin
  const faq = p.faq.filter(([, r]) => !aConfirmer(r))
  return [
    { '@context': 'https://schema.org', '@type': 'Service', name: p.nom, description: p.description, url, serviceType: p.nom,
      provider: { '@id': `${site.siteUrl}/#garage` }, areaServed: { '@type': 'AdministrativeArea', name: site.adresse.departement } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${site.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: p.nom, item: url }] },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) }] : []),
  ]
}

export default function Prestation({ chemin }: { chemin: string }) {
  const p = prestation(chemin)!
  const appeler = `tel:${site.telephoneLien}`
  return (
    <>
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-noir text-white">
          <Photo nom={p.icone as NomPhoto} alt={p.nom} prioritaire mention={false} className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-noir via-noir/85 to-noir/35" />
          <Container className="flex min-h-[520px] flex-col justify-center gap-6 py-16">
            <nav aria-label="Fil d’Ariane" className="text-[14px] text-white/60"><a href="/" className="text-white/60 no-underline hover:text-white">Accueil</a> <span aria-hidden="true">/</span> {p.famille} <span aria-hidden="true">/</span> <span className="text-white">{p.nom}</span></nav>
            <h1 className="max-w-[760px] text-[52px] font-bold uppercase leading-[0.92] md:text-[80px]">{p.h1}</h1>
            <p className="max-w-[600px] text-[18px] leading-relaxed text-white/80">{p.accroche}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#devis" className={btnRouge}>Demander un devis</a>
              <a href={appeler} className={btnClair}><Ico nom="telephone" taille={18} />Appeler le garage</a>
            </div>
          </Container>
          <span className="absolute bottom-3 right-3 text-[11px] text-white/50">Photo non contractuelle</span>
        </section>

        <section>
          <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <TitreSection label="Ce que nous prenons en charge" titre={p.nom} />
              <ul className="flex flex-col gap-3">
                {p.interventions.map((i) => <li key={i} className="flex items-start gap-3 text-[17px]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rouge text-white"><Ico nom="coche" taille={14} /></span>{i}</li>)}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <TitreSection label="Déroulement" titre="Étape par étape" />
              <ol className="flex flex-col gap-5">
                {p.deroulement.map(([t, d], n) => (
                  <li key={t} className="flex gap-4">
                    <span className="font-titre text-[44px] font-bold leading-none text-rouge">0{n + 1}</span>
                    <div><p className="font-titre text-[24px] font-bold uppercase leading-tight">{t}</p><p className="text-[16px] leading-relaxed text-gris">{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        <section className="bg-fond">
          <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-12">
            <div className="lg:col-span-4"><TitreSection label="FAQ" titre="Vos questions" /></div>
            <div className="flex flex-col divide-y divide-ligne border-y border-ligne lg:col-span-8">
              {p.faq.map(([q, r]) => (
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

        <section>
          <Container className="flex flex-col gap-4 py-12 md:flex-row md:items-center">
            <p className="font-titre text-[24px] font-bold uppercase">Voir aussi</p>
            <div className="flex flex-wrap gap-3">
              {p.liees.map((c) => { const l = prestation(c)!; return <a key={c} href={c} className="flex items-center gap-2 rounded-md border border-ligne px-4 py-3 font-semibold text-noir no-underline hover:border-rouge"><Ico nom={l.icone} className="text-rouge" />{l.nom}</a> })}
            </div>
          </Container>
        </section>

        <Devis prestationParDefaut={p.nom} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees(p)) }} />
    </>
  )
}
