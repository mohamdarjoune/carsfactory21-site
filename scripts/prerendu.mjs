// Pré-rendu : après la construction, écrit une page HTML complète par adresse dans dist/,
// avec son titre, sa description et sa balise canonical (référencement), plus dist/404.html et le plan du site.
process.env.NODE_ENV = 'production'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(racine, 'dist')
const serveur = path.join(racine, 'dist-serveur', 'entree-serveur.js')
const SITE = 'https://www.cars-factory-21.fr'   // même valeur que siteUrl dans src/config.ts

const echapper = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const { rendre, PAGES_PRERENDUES } = await import(pathToFileURL(serveur).href)
const modele = await readFile(path.join(dist, 'index.html'), 'utf8')

for (const page of PAGES_PRERENDUES) {
  const url = page.chemin === '/' ? `${SITE}/` : `${SITE}${page.chemin}`
  const titre = echapper(page.titre)
  const description = echapper(page.description)
  let html = modele
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${titre}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${titre}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace('<div id="root"></div>', `<div id="root">${rendre(page.chemin)}</div>`)
  // Démonstration : jamais indexée par Google
  if (process.env.VITE_DEMO === '1') html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, nofollow" />')
  html = page.introuvable
    ? html.replace(/\s*<link rel="canonical"[^>]*>/, '\n    <meta name="robots" content="noindex" />').replace(/\s*<meta property="og:url"[^>]*>/, '')
    : html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`).replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  if (!html.includes(`<title>${titre}</title>`) || html.includes('<div id="root"></div>')) throw new Error(`Pré-rendu incomplet pour ${page.chemin}`)
  await writeFile(path.join(dist, page.fichier), html)
  console.log(`✓ ${page.fichier.padEnd(30)} ${Math.round(html.length / 1024)} Ko`)
}

const aujourdhui = new Date().toISOString().slice(0, 10)
const urls = PAGES_PRERENDUES.filter((p) => !p.introuvable).map((p) =>
  `  <url>\n    <loc>${SITE}${p.chemin === '/' ? '/' : p.chemin}</loc>\n    <lastmod>${aujourdhui}</lastmod>\n    <priority>${p.priorite}</priority>\n  </url>`)
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`✓ sitemap.xml (${urls.length} pages)`)
if (process.env.VITE_DEMO === '1') {
  await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
  console.log('✓ démonstration : pages non indexées par Google')
}

await rm(path.join(racine, 'dist-serveur'), { recursive: true, force: true })
