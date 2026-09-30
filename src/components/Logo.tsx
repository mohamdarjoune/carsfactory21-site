import { useId } from 'react'

/*
 * Logo CF21, style dessin à l'encre : un coupé fastback de la fin des années 60 vu de profil, tracé à main levée.
 * Sur le flanc, l'écope en creux dessine le C, le montant et la bande de caisse dessinent le F ; « 21 » roule à côté.
 * Animation : la voiture arrive en glissant au chargement, les roues tournent au survol (désactivé si l'on préfère moins d'animations).
 * Aucun nom ni emblème de constructeur : silhouette générique.
 */

const CONTOUR = 'M12,54 L12,42 Q13,37 22,36 L40,35 L150,15 Q160,13 168,14 L178,15 Q186,17 200,31 L276,32 Q290,33 293,38 L294,50 Q294,56 288,56 L266,56 A21,21 0 0 0 224,56 L92,56 A21,21 0 0 0 50,56 L18,56 Q12,56 12,54 Z'
const VITRE = 'M116,29 L150,19 L175,18.5 Q182,20 191,30 Z M160,19 L162,30'
const OUIES = 'M88,33 L96,31 M92,37 L101,35 M96,41 L106,39'
const DETAILS = 'M196,33 L200,55 M186,38 L194,38 M288,40 Q292,41 293,45 M280,51 L294,51 M12,48 L20,48 M14,40 L19,40 L19,45 L14,45'
const HACHURES = 'M100,56 L106,51 M110,56 L116,51 M120,56 L126,51 M130,56 L136,51 M140,56 L146,51 M150,56 L156,51 M170,56 L176,51 M180,56 L186,51 M190,56 L196,51 M204,56 L210,51 M214,56 L218,52.5'
const LETTRE_C = 'M150,40 L114,40 Q102,40 102,46.5 Q102,53 114,53 L148,53'
const LETTRE_F = 'M158,53 L158,40 L284,39 M158,46.5 L184,46.5'

function Roue({ x }: { x: number }) {
  return (
    <g className="logo-roue" style={{ transformOrigin: `${x}px 57px` }}>
      <circle cx={x} cy="57" r="16" strokeWidth="3" />
      <circle cx={x} cy="57" r="10" strokeWidth="1.8" />
      <circle cx={x} cy="57" r="3" strokeWidth="1.6" />
      <path strokeWidth="1.4" d={`M${x},47 V54 M${x + 9.5},60 L${x + 2.8},58.4 M${x - 9.5},60 L${x - 2.8},58.4 M${x + 6},49 L${x + 2},54.5 M${x - 6},49 L${x - 2},54.5`} />
    </g>
  )
}

/** Dessin seul (voiture + 21). clair = sur fond sombre (trait blanc). */
export function LogoDessin({ clair = true, className = '' }: { clair?: boolean; className?: string }) {
  const trait = clair ? '#FFFFFF' : '#121417'
  const rouge = clair ? '#FF4B36' : '#C8281A'
  const filtre = `trait-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="-40 0 400 80" className={`logo-cf21 ${className}`} role="img" aria-label="CF21">
      <defs>
        {/* léger tremblé, comme un trait d'encre à main levée */}
        <filter id={filtre} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="bruit" />
          <feDisplacementMap in="SourceGraphic" in2="bruit" scale="2.2" />
        </filter>
      </defs>
      <g transform="skewX(-6)" style={{ transformOrigin: '160px 40px' }} filter={`url(#${filtre})`}>
        <g className="logo-vitesse" fill="none" stroke={rouge} strokeLinecap="round">
          <path strokeWidth="3" d="M-34,30 Q-16,29 2,30" /><path strokeWidth="2.4" opacity=".6" d="M-26,42 Q-11,41 4,42" /><path strokeWidth="2" opacity=".35" d="M-18,54 Q-6,53 6,54" />
        </g>
        <g className="logo-voiture" fill="none" stroke={trait} strokeLinecap="round" strokeLinejoin="round">
          <path strokeWidth="3.2" d={CONTOUR} />
          <path strokeWidth="2.2" d={VITRE} />
          <path strokeWidth="2" d={OUIES} />
          <path strokeWidth="1.6" d={DETAILS} />
          <circle strokeWidth="1.8" cx="287" cy="42.5" r="2.6" />
          <path strokeWidth="1.1" opacity=".55" d={HACHURES} />
          <Roue x={71} />
          <Roue x={245} />
          <path strokeWidth="1.4" opacity=".5" d="M34,74 L112,74 M200,74 L286,74" />
          <g stroke={rouge} strokeWidth="5">
            <path d={LETTRE_C} />
            <path d={LETTRE_F} />
          </g>
        </g>
        <text x="304" y="60" fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif" fontWeight="700" fontSize="58" fill={rouge}>21</text>
      </g>
    </svg>
  )
}

/** Logo complet de l'en-tête et du pied de page. */
export function Logo({ clair = true }: { clair?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoDessin clair={clair} className="h-10 w-auto md:h-11" />
      {/* Nom en toutes lettres : masqué quand le menu d'ordinateur manque de place (1024–1279 px) */}
      <span className="hidden flex-col leading-none sm:flex lg:hidden xl:flex">
        <span className={`font-titre text-[20px] font-bold uppercase tracking-wide ${clair ? 'text-white' : 'text-noir'}`}>Cars Factory 21</span>
        <span className={`whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] ${clair ? 'text-white/60' : 'text-gris'}`}>Carrosserie · Mécanique</span>
      </span>
    </span>
  )
}
