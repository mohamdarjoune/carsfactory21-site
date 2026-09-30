import { defineConfig, devices } from '@playwright/test'

/* Tests du site complet dans un vrai navigateur, sur le site construit (dist/) servi avec les règles d'OVH.
   En local : npm run build puis npm run test:site */
export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5189', locale: 'fr-FR', trace: 'retain-on-failure' },
  projects: [
    { name: 'ordinateur', use: { ...devices['Desktop Chrome'] } },
    { name: 'telephone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'node scripts/serveur-local.mjs 5189', url: 'http://localhost:5189', reuseExistingServer: true },
})
