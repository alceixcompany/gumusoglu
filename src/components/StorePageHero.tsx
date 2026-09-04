import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function StorePageHero({ eyebrow, title, description, image, imageAlt, index = '01' }: { eyebrow: string; title: string; description: string; image: string; imageAlt: string; index?: string }) {
  return (
    <section className="relative min-h-[650px] overflow-hidden bg-[var(--ink)] px-5 pb-16 pt-32 text-white sm:px-8 lg:min-h-[720px] lg:px-12 lg:pb-20 lg:pt-40">
      <Image src={image} alt={imageAlt} fill priority className="object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,10,11,.96)_0%,rgba(9,10,11,.87)_42%,rgba(9,10,11,.25)_72%,rgba(9,10,11,.08)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,11,.22),transparent_45%,rgba(9,10,11,.62)_100%)]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/40 transition hover:text-[var(--taxi-yellow)]"><FiArrowLeft /> Ana sayfa</Link><span className="text-xs font-black text-white/20">/{index}</span></div>
        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
          <div><p className="text-[11px] font-black uppercase tracking-[.24em] text-[var(--taxi-yellow)]">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-5xl font-black leading-[.94] tracking-[-.06em] sm:text-7xl lg:text-[76px]">{title}</h1></div>
          <div className="border-l border-white/15 pl-6 lg:justify-self-end"><p className="max-w-xl text-base leading-8 text-white/55">{description}</p><div className="mt-6 flex flex-wrap gap-5 text-[10px] font-black uppercase tracking-[.15em] text-white/35"><span className="flex items-center gap-2"><FiCheck className="text-[var(--taxi-yellow)]"/> Açık iletişim</span><span className="flex items-center gap-2"><FiCheck className="text-[var(--taxi-yellow)]"/> Güvenilir destek</span></div></div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-[var(--taxi-yellow)]" />
    </section>
  );
}

export function PageCta({ title, text, href = '/iletisim', label = 'Bize ulaşın' }: { title: string; text: string; href?: string; label?: string }) {
  return (
    <section className="bg-[var(--paper)] px-5 pb-24 sm:px-8 lg:px-12">
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-7 overflow-hidden rounded-[28px] border border-black/10 bg-[var(--ink)] p-8 text-white shadow-[0_18px_50px_rgba(23,24,25,.10)] sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <span className="absolute left-0 top-0 h-full w-1 bg-[var(--taxi-yellow)]" />
        <div><span className="text-[10px] font-black uppercase tracking-[.22em] text-[var(--taxi-yellow)]">Birlikte çözelim</span><h2 className="mt-3 text-2xl font-black tracking-[-.04em] sm:text-4xl">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">{text}</p></div>
        <Link href={href} className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-7 py-4 text-sm font-black text-[var(--ink)] transition hover:border-[var(--taxi-yellow)] hover:bg-[var(--taxi-yellow)]">{label}<FiArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
      </div>
    </section>
  );
}
