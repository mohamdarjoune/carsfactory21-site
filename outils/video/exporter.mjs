// Exporte garage.html en MP4 (1920×1080, 30 images/s).
// 1. les images sont calculées (window.rendre(t)) et enregistrées en JPEG, en plusieurs parties en parallèle ;
// 2. ffmpeg les assemble en H.264. Une image déjà faite n'est pas refaite (on peut relancer après une coupure).
// Utilisation : node exporter.mjs <sortie.mp4> [parties=3]
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
const requireLocal = createRequire(import.meta.url)
const { chromium } = createRequire('C:/Users/ST/Projet_perso/carsfactory21-site/package.json')('@playwright/test')
const ffmpeg = requireLocal('ffmpeg-static')
const ici = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const [sortie, partiesTexte = '3'] = process.argv.slice(2)
const IPS = 30, PARTIES = Number(partiesTexte)
const dossier = path.join(ici, 'images')
fs.mkdirSync(dossier, { recursive: true })
fs.mkdirSync(path.dirname(sortie), { recursive: true })
const nom = (i) => path.join(dossier, `img-${String(i).padStart(5, '0')}.jpg`)

const b = await chromium.launch()
async function ouvrir() {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
  await p.goto('file:///' + path.join(ici, 'garage.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  return p
}
const essai = await ouvrir()
const total = Math.round((await essai.evaluate(() => window.DUREE)) * IPS)
await essai.close()

let faites = 0
const debut = Date.now()
async function partie(k) {
  const p = await ouvrir()
  for (let i = k; i < total; i += PARTIES) {           // images entrelacées : les parties avancent au même rythme
    if (fs.existsSync(nom(i))) { faites++; continue }
    for (let tentative = 1; ; tentative++) {
      try {
        await p.evaluate((t) => window.rendre(t), i / IPS)
        fs.writeFileSync(nom(i), await p.screenshot({ type: 'jpeg', quality: 94, timeout: 120_000 }))
        break
      } catch (e) {
        if (tentative >= 3) throw e
        console.log(`image ${i} : nouvel essai (${tentative})`)
      }
    }
    if (++faites % 120 === 0) console.log(`${faites}/${total} images · ${Math.round((Date.now() - debut) / 1000)} s`)
  }
  await p.close()
}
await Promise.all(Array.from({ length: PARTIES }, (_, k) => partie(k)))
await b.close()

console.log('Assemblage de la vidéo…')
const f = spawn(ffmpeg, ['-y', '-framerate', String(IPS), '-i', path.join(dossier, 'img-%05d.jpg'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', sortie], { stdio: ['ignore', 'ignore', 'pipe'] })
let journal = ''; f.stderr.on('data', (d) => { journal = (journal + d).slice(-2000) })
const code = await new Promise((r) => f.on('close', r))
console.log(code === 0 ? `✓ ${sortie} (${(fs.statSync(sortie).size / 1024 / 1024).toFixed(1)} Mo, ${total} images)` : 'échec ffmpeg : ' + journal)
