// Sert dist/ comme OVH avec public/.htaccess : même politique de sécurité (CSP), pages pré-rendues sans extension,
// adresses inconnues → 404.html avec le code 404. Le PHP ne tourne pas ici (réponse 404) : les tests le simulent.
// Utilisation : node scripts/serveur-local.mjs [port]
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(racine, 'dist')
const port = Number(process.argv[2] ?? 5181)
const htaccess = fs.readFileSync(path.join(racine, 'public', '.htaccess'), 'utf8')
const csp = htaccess.match(/Content-Security-Policy "([^"]+)"/)[1].replace(/; upgrade-insecure-requests/, '')
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.xml': 'application/xml', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.txt': 'text/plain', '.woff2': 'font/woff2',
}
const fichier = (p) => { const f = path.join(dist, p); return f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile() ? f : null }

http.createServer((req, res) => {
  // BASE_SITE=/carsfactory21-site/ : sert le site comme GitHub Pages, dans un sous-dossier
  const base = (process.env.BASE_SITE ?? '/').replace(/\/$/, '')
  let url = decodeURIComponent(req.url.split('?')[0])
  if (base && url.startsWith(base)) url = url.slice(base.length) || '/'
  if (url.startsWith('/api/')) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"erreur":"PHP non disponible en local"}'); return }
  let statut = 200
  let f = url === '/' ? fichier('index.html') : fichier(url) || (url.length > 1 && fichier(url + '.html'))
  if (!f) { f = fichier('404.html'); statut = 404 }
  res.writeHead(statut, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Content-Security-Policy': csp, 'X-Frame-Options': 'DENY' })
  fs.createReadStream(f).pipe(res)
}).listen(port, () => console.log(`Site construit, règles OVH : http://localhost:${port}`))
