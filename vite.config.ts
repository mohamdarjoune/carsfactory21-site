/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // tests/ : tests du site complet, lancés par Playwright (npm run test:site), pas par Vitest
  test: { exclude: ['**/node_modules/**', 'tests/**'] },
})
