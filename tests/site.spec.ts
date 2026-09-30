import { test, expect } from '@playwright/test'

const PAGES = ['/', '/carrosserie', '/peinture-automobile', '/reparation-apres-sinistre', '/covering', '/mecanique-generale',
  '/entretien-vidange', '/diagnostic-automobile', '/depannage-auto', '/mentions-legales', '/confidentialite']

for (const chemin of PAGES) {
  test(`page ${chemin} : s’affiche sans erreur`, async ({ page }) => {
    const erreurs: string[] = []
    page.on('pageerror', (e) => erreurs.push(e.message))
    page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()) })
    const reponse = await page.goto(chemin)
    expect(reponse?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(erreurs).toEqual([])
  })
}

test('adresse inconnue : vraie page 404', async ({ page }) => {
  const reponse = await page.goto('/cette-page-nexiste-pas')
  expect(reponse?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Page introuvable' })).toBeVisible()
})

test('accueil : bouton d’appel et données pour Google', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[href="tel:+33759563839"]').filter({ visible: true }).first()).toBeVisible()
  const donnees = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() ?? '{}')
  expect(donnees['@type']).toBe('AutoRepair')
  expect(donnees.address.postalCode).toBe('21800')
})

test('photos : version adaptée à l’écran, pas le 4K sur téléphone', async ({ page, isMobile }) => {
  await page.goto('/')
  const src = await page.locator('main img').first().evaluate((i: HTMLImageElement) => i.currentSrc)
  expect(src).toMatch(isMobile ? /-(960|1920)\.webp$/ : /\.webp$/)
})

test('vidéo : image de couverture, chargée seulement au clic, fichier servi', async ({ page, request }) => {
  await page.goto('/')
  const video = page.locator('#video video')
  await expect(video).toBeVisible()
  await expect(video).toHaveAttribute('preload', 'none')
  await expect(video).toHaveAttribute('poster', '/videos/presentation-garage.webp')
  const fichier = await request.get('/videos/presentation-garage.mp4')
  expect(fichier.status()).toBe(200)
  expect(fichier.headers()['content-type']).toBe('video/mp4')
})

test('devis : envoi avec prestation et message de confirmation', async ({ page }) => {
  let corps = ''
  await page.route('**/api/devis.php', async (r) => { corps = r.request().postData() ?? ''; await r.fulfill({ json: { ok: true } }) })
  await page.goto('/carrosserie')
  const form = page.locator('#devis form')
  await form.getByLabel('Nom').fill('Test')
  await form.getByLabel('Téléphone').fill('0600000000')
  await form.getByLabel('Véhicule').fill('Clio 4, 2017')
  await form.getByLabel('Votre demande').fill('Rayure sur la portière avant.')
  await form.getByRole('checkbox').check()
  await form.getByRole('button', { name: /Envoyer/ }).click()
  await expect(page.getByText('Demande envoyée')).toBeVisible()
  expect(corps).toContain('Carrosserie')
})

test('menu mobile : ouvre et mène aux prestations', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'menu du téléphone')
  await page.goto('/')
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click()
  await page.locator('#menu-mobile').getByRole('link', { name: 'Covering' }).click()
  await expect(page).toHaveURL(/\/covering$/)
})
