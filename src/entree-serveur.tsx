import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Pages, PAGES_PRERENDUES } from './routes'

/** Pré-rendu à la construction : le HTML complet d'une page, pour Google et un premier affichage immédiat. */
export function rendre(chemin: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={chemin}>
        <Pages />
      </StaticRouter>
    </StrictMode>,
  )
}

export { PAGES_PRERENDUES }
