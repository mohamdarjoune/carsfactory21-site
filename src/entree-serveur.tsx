import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Pages, PAGES_PRERENDUES } from './routes'
import { BASE } from './vers'

/** Pré-rendu à la construction : le HTML complet d'une page, pour Google et un premier affichage immédiat. */
export function rendre(chemin: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter basename={BASE} location={BASE.replace(/\/$/, '') + chemin}>
        <Pages />
      </StaticRouter>
    </StrictMode>,
  )
}

export { PAGES_PRERENDUES }
