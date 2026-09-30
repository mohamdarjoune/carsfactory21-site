/** Logo provisoire (en attendant celui du garage) : un écrou stylisé et le nom. */
export function Logo({ clair = true }: { clair?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 2l15.6 9v18L20 38 4.4 29V11z" fill="#C8281A" />
        <path d="M20 9l9.5 5.5v11L20 31l-9.5-5.5v-11z" fill="none" stroke="#fff" strokeWidth="2.4" />
        <text x="20" y="24.5" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="12" fill="#fff">21</text>
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-titre text-[22px] font-bold uppercase tracking-wide ${clair ? 'text-white' : 'text-noir'}`}>Cars Factory 21</span>
        <span className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.2em] ${clair ? 'text-white/60' : 'text-gris'}`}>Carrosserie · Mécanique</span>
      </span>
    </span>
  )
}
