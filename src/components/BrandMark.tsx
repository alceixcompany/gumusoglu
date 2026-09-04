import { FiZap } from 'react-icons/fi';

export default function BrandMark({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return <div className="flex items-center gap-3" aria-label="Gümüşoğlu Elektrik">
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 ${dark ? 'border-[#2f6fa9] bg-[#2f6fa9] text-white' : 'border-white/30 bg-white text-[#2f6fa9]'}`}><FiZap className="h-6 w-6 fill-current" /></span>
    {!compact && <span className="leading-none"><span className="block text-[20px] font-black tracking-[-.045em]">GÜMÜŞOĞLU</span><span className={`mt-1 block text-[9px] font-extrabold uppercase tracking-[.36em] ${dark ? 'text-[var(--navy)]/50' : 'text-white/50'}`}>Elektrik • 1974</span></span>}
  </div>;
}
