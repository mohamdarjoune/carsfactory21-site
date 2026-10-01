import { useId } from 'react'

/*
 * Logo CF21, dessin au trait fin : un coupé fastback de la fin des années 60 vu de profil, fendant l'air.
 * Sur le flanc, l'écope en creux dessine le C, le montant et la bande de caisse dessinent le F ; « 21 » à côté.
 * Des filets d'air épousent le pavillon et le capot puis s'étirent et tourbillonnent derrière la voiture.
 * Animation : le vent s'écoule en continu, la voiture arrive en glissant, les roues tournent au survol
 * (tout est coupé si l'on préfère moins d'animations). Aucun nom ni emblème de constructeur : silhouette générique.
 */

const CONTOUR = 'M12,54 L12,42 Q13,37 22,36 L40,35 L150,15 Q160,13 168,14 L178,15 Q186,17 200,31 L276,32 Q290,33 293,38 L294,50 Q294,56 288,56 L266,56 A21,21 0 0 0 224,56 L92,56 A21,21 0 0 0 50,56 L18,56 Q12,56 12,54 Z'
const VITRE = 'M116,29 L150,19 L175,18.5 Q182,20 191,30 Z M160,19 L162,30'
const OUIES = 'M88,33 L96,31 M92,37 L101,35 M96,41 L106,39'
const DETAILS = 'M196,33 L200,55 M186,38 L194,38 M288,40 Q292,41 293,45 M280,51 L294,51 M12,48 L20,48 M14,40 L19,40 L19,45 L14,45'
const HACHURES = 'M100,56 L106,51 M112,56 L118,51 M124,56 L130,51 M136,56 L142,51 M148,56 L154,51 M172,56 L178,51 M184,56 L190,51 M204,56 L210,51'
const LETTRE_C = 'M150,40 L114,40 Q102,40 102,46.5 Q102,53 114,53 L148,53'
const LETTRE_F = 'M158,53 L158,40 L284,39 M158,46.5 L184,46.5'

// Filets d'air : [tracé, épaisseur, opacité]
const VENT: [string, number, number][] = [
  ['M296,30 C270,26 228,12 186,6 C150,1 100,12 40,24 C0,31 -30,29 -72,27', 0.9, 1],
  ['M292,21 C262,15 218,-2 170,-4 C120,-5 70,7 10,15 C-20,19 -45,18 -72,16', 0.7, 0.7],
  ['M10,44 C-10,43.5 -40,43 -72,43', 0.9, 0.9],
  ['M250,76 C200,77 120,77 40,72 C10,70 -30,68 -72,68', 0.7, 0.55],
]
// Petits tourbillons dans le sillage
const TOURBILLONS = ['M8,38 C-4,35 -14,40 -12,46 C-10,51 -2,50 -2,45 C-2,42 -6,42 -7,44', 'M4,54 C-8,52 -16,57 -12,61 C-9,64 -4,61 -6,58']

function Roue({ x }: { x: number }) {
  return (
    <g className="logo-roue" style={{ transformOrigin: `${x}px 57px` }}>
      <circle cx={x} cy="57" r="16" strokeWidth="1.6" />
      <circle cx={x} cy="57" r="10" strokeWidth="1" />
      <circle cx={x} cy="57" r="3" strokeWidth="0.9" />
      <path strokeWidth="0.9" d={`M${x},47 V54 M${x + 9.5},60 L${x + 2.8},58.4 M${x - 9.5},60 L${x - 2.8},58.4 M${x + 6},49 L${x + 2},54.5 M${x - 6},49 L${x - 2},54.5`} />
    </g>
  )
}

/** Dessin seul (voiture + vent + 21). clair = sur fond sombre (trait blanc). */
export function LogoDessin({ clair = true, className = '' }: { clair?: boolean; className?: string }) {
  const trait = clair ? '#FFFFFF' : '#121417'
  const rouge = clair ? '#FF4B36' : '#C8281A'
  const air = clair ? '#9FB3C8' : '#6B7C8F'
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="-75 -12 440 116" className={`logo-cf21 ${className}`} role="img" aria-label="Cars Factory 21">
      <defs>
        {/* léger tremblé, comme un trait de plume à main levée */}
        <filter id={`trait-${id}`} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="bruit" />
          <feDisplacementMap in="SourceGraphic" in2="bruit" scale="1.2" />
        </filter>
        {/* le vent apparaît juste derrière la voiture et se perd au loin */}
        <linearGradient id={`fondu-${id}`} gradientUnits="userSpaceOnUse" x1="300" y1="0" x2="-75" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`vent-${id}`} maskUnits="userSpaceOnUse" x="-80" y="-20" width="460" height="120">
          <rect x="-80" y="-20" width="460" height="120" fill={`url(#fondu-${id})`} />
        </mask>
      </defs>
      <g transform="skewX(-6)" style={{ transformOrigin: '160px 40px' }} filter={`url(#trait-${id})`}>
        <g className="logo-vent" mask={`url(#vent-${id})`} fill="none" stroke={air} strokeLinecap="round">
          {VENT.map(([d, e, o]) => <path key={d} d={d} strokeWidth={e} opacity={o} pathLength={100} />)}
          {TOURBILLONS.map((d) => <path key={d} d={d} strokeWidth="0.8" />)}
        </g>
        <g className="logo-voiture" fill="none" stroke={trait} strokeLinecap="round" strokeLinejoin="round">
          <path strokeWidth="1.6" d={CONTOUR} />
          <path strokeWidth="1.2" d={VITRE} />
          <path strokeWidth="1.1" d={OUIES} />
          <path strokeWidth="0.9" d={DETAILS} />
          <circle strokeWidth="1" cx="287" cy="42.5" r="2.6" />
          <path strokeWidth="0.7" opacity=".5" d={HACHURES} />
          <Roue x={71} />
          <Roue x={245} />
          <g stroke={rouge} strokeWidth="2.6">
            <path d={LETTRE_C} />
            <path d={LETTRE_F} />
          </g>
        </g>
        <text x="306" y="60" fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif" fontWeight="600" fontSize="54"
          fill={clair ? 'none' : rouge} stroke={rouge} strokeWidth={clair ? 1.5 : 0}>21</text>
      </g>
      {/* Le nom en toutes lettres, sous la voiture (droit, pour rester bien lisible) */}
      <text x="160" y="100" textAnchor="middle" fontFamily="'Barlow Condensed', 'Arial Narrow', sans-serif" fontWeight="600" fontSize="23"
        letterSpacing="6" fill={trait}>CARS <tspan fill={rouge}>FACTORY</tspan> 21</text>
    </svg>
  )
}

/** Logo complet de l'en-tête et du pied de page (le nom est dans le dessin, sous la voiture). */
export function Logo({ clair = true, grand = false }: { clair?: boolean; grand?: boolean }) {
  return <LogoDessin clair={clair} className={grand ? 'h-auto w-full max-w-[364px]' : 'h-[60px] w-auto md:h-[68px]'} />
}
