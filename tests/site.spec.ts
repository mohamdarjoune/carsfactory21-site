import { test, expect } from '@playwright/test'

const PAGES = ['/', '/carrosserie', '/peinture-automobile', '/reparation-apres-sinistre', '/covering', '/mecanique-generale',
  '/entretien-vidange', '/diagnostic-automobile', '/depannage-auto', '/mentions-legales', '/confidentialite']

for (const chemin of PAGES) {
  test(`page ${chemin} : s’affiche sans erreur`, async ({ page, isMobile }) => {
    const erreurs: string[] = []
    page.on('pageerror', (e) => erreurs.push(e.message))
    page.on('console', (m) => { if (m.type() === 'error') erreurs.push(m.text()) })
    const reponse = await page.goto(chemin)
    expect(reponse?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(erreurs).toEqual([])
    // rien ne dépasse à droite de l'écran, même sur un petit téléphone (360 px)
    for (const l of isMobile ? [360, 412] : [1280]) {
      await page.setViewportSize({ width: l, height: 800 })
      const contenu = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(contenu, `largeur ${l} px`).toBeLessThanOrEqual(l)
    }
  })
}

test('aucun texte « [à compléter] » montré aux visiteurs du vrai site', async ({ page }) => {
  for (const chemin of PAGES.filter((c) => !['/mentions-legales', '/confidentialite'].includes(c))) {
    await page.goto(chemin)
    await page.locator('details').evaluateAll((d) => d.forEach((x) => ((x as HTMLDetailsElement).open = true)))
    expect(await page.locator('main').innerText(), chemin).not.toMatch(/\[[^\]]{3,}\]/)
  }
})

test('plans : le doigt fait défiler la page, le plan s’active au toucher', async ({ page }) => {
  await page.goto('/#acces')
  const bouton = page.getByRole('button', { name: /Utiliser le plan : Accueil/ })
  await expect(bouton).toBeVisible()
  await bouton.click()
  await expect(bouton).toBeHidden()
  await expect(page.locator('#acces iframe').first()).toHaveAttribute('tabindex', '0')
})

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

test('accès : les deux adresses avec leur plan et leur itinéraire', async ({ page }) => {
  await page.goto('/#acces')
  const acces = page.locator('#acces')
  await expect(acces.getByText('6 rue de Bastogne, 21850 Saint-Apollinaire')).toBeVisible()
  await expect(acces.getByText('1 bis rue de la Fonderie, 21800 Chevigny-Saint-Sauveur')).toBeVisible()
  const plans = acces.locator('iframe')
  await expect(plans).toHaveCount(2)
  await expect(plans.first()).toHaveAttribute('src', /openstreetmap\.org\/export\/embed\.html.*marker=47\.339/)
  await expect(plans.nth(1)).toHaveAttribute('src', /marker=47\.293/)
  await expect(acces.getByRole('link', { name: 'Itinéraire' })).toHaveCount(2)
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

test('barre des prestations : mène à la bonne page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Prestations' }).getByRole('link', { name: 'Covering' }).click()
  await expect(page).toHaveURL(/\/covering$/)
  await expect(page.getByRole('navigation', { name: 'Prestations' }).getByRole('link', { name: 'Covering' })).toHaveAttribute('aria-current', 'page')
})

test('téléphone : barre d’actions en bas de l’écran (appeler, rendez-vous, itinéraire, devis)', async ({ page, isMobile }) => {
  await page.goto('/carrosserie')
  const barre = page.getByRole('navigation', { name: 'Actions rapides' })
  if (!isMobile) { await expect(barre).toBeHidden(); return }
  await expect(barre).toBeVisible()
  await expect(barre.getByRole('link', { name: 'Appeler' })).toHaveAttribute('href', 'tel:+33759563839')
  await expect(barre.getByRole('link', { name: 'Itinéraire' })).toHaveAttribute('href', /google\.com\/maps\/dir.*47\.339/)
  // la barre ne cache pas le bas de page
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight))
  await expect(page.locator('footer').getByRole('link', { name: 'Confidentialité' })).toBeInViewport()
})

test('recherche : « voyant » propose le diagnostic', async ({ page, isMobile }) => {
  await page.goto('/')
  const champ = page.getByRole('combobox', { name: 'Que recherchez-vous ?' }).filter({ visible: true })
  await champ.fill('voyant allumé')
  await expect(page.getByRole('option', { name: /Diagnostic électronique/ }).first()).toBeVisible()
  await champ.press('Enter')
  await expect(page).toHaveURL(/\/diagnostic-automobile$/)
  void isMobile
})

test('mon véhicule : enregistré puis repris dans le devis', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Indiquer mon véhicule' }).click()
  const fenetre = page.getByRole('dialog', { name: 'Mon véhicule' })
  await fenetre.getByLabel('Marque et modèle').fill('Peugeot 208')
  await fenetre.getByLabel('Année').fill('2018')
  await fenetre.getByRole('button', { name: 'Enregistrer mon véhicule' }).click()
  await expect(page.getByText('Votre véhicule : Peugeot 208 (2018)')).toBeVisible()
  await expect(page.locator('#devis form').getByLabel('Véhicule')).toHaveValue('Peugeot 208 (2018)')
})

test('rendez-vous : jour, heure puis confirmation (démonstration)', async ({ page }) => {
  await page.goto('/#rdv')
  const rdv = page.locator('#rdv')
  await rdv.getByRole('button', { name: /, disponible$/ }).first().click()
  await rdv.getByRole('button', { name: /^\d{2} h \d{2}$/ }).first().click()
  await rdv.getByLabel('Nom').fill('Test')
  await rdv.getByLabel('Téléphone').fill('0600000000')
  await rdv.getByLabel('Véhicule').fill('Clio 4')
  await rdv.getByRole('button', { name: 'Confirmer le rendez-vous' }).click()
  await expect(rdv.getByText('Rendez-vous demandé')).toBeVisible()
  await expect(rdv.getByText('ce rendez-vous n’est pas enregistré')).toBeVisible()
})
