import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import './index.css'
import { Pages } from './routes'

const racine = document.getElementById('root')!
const site = (
  <StrictMode>
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  </StrictMode>
)

// Page pré-rendue à la construction : React reprend le HTML déjà affiché ; sinon (développement) rendu classique
if (racine.hasChildNodes()) hydrateRoot(racine, site)
else createRoot(racine).render(site)
