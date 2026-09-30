// Images-clés du film pour vérification (planche contact)
import { createRequire } from 'node:module'
import path from 'node:path'
const { chromium } = createRequire('C:/Users/ST/Projet_perso/carsfactory21-site/package.json')('@playwright/test')
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const instants = (process.argv[2] ?? '3,8.5,13,18,21,25,30,35,40.5,46').split(',').map(Number)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
const erreurs = []; p.on('pageerror', (e) => erreurs.push(e.message)); p.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()))
await p.goto('file:///' + path.join(ici, 'garage.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' })
await p.evaluate(() => document.fonts.ready)
const images = []
for (const t of instants) {
  await p.evaluate((t) => window.rendre(t), t)
  images.push((await p.screenshot({ type: 'jpeg', quality: 70 })).toString('base64'))
}
// planche : 2 colonnes
const planche = await b.newPage({ viewport: { width: 1920, height: 540 * Math.ceil(images.length / 2) } })
await planche.setContent(`<body style="margin:0;display:grid;grid-template-columns:960px 960px">${images.map((im, i) => `<div style="position:relative"><img src="data:image/jpeg;base64,${im}" style="width:960px;display:block"><span style="position:absolute;left:8px;top:6px;background:#000a;color:#fff;font:bold 22px sans-serif;padding:2px 8px">${instants[i]} s</span></div>`).join('')}</body>`)
await planche.screenshot({ path: path.join(ici, 'planche.jpg'), type: 'jpeg', quality: 75, fullPage: true })
console.log(erreurs.length ? 'ERREURS : ' + erreurs.join(' | ') : 'aucune erreur')
await b.close()
