/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dossier de publication : « / » sur le vrai domaine, « /carsfactory21-site/ » pour la démonstration GitHub Pages
  base: process.env.BASE_SITE ?? '/',
  // tests/ : tests du site complet, lancés par Playwright (npm run test:site), pas par Vitest
  test: { exclude: ['**/node_modules/**', 'tests/**'] },
})
