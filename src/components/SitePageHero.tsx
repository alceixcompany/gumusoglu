import Image from 'next/image';
import Link from 'next/link';
import { FiArrowDown, FiChevronRight } from 'react-icons/fi';

export default function SitePageHero({eyebrow,title,description,image}:{eyebrow:string;title:string;description:string;image:string}){
  return <section className="relative flex min-h-[650px] items-end overflow-hidden bg-[#18181a] px-5 pb-16 pt-28 text-white sm:px-8 lg:min-h-[720px] lg:px-14 lg:pb-20">
    <Image src={image} alt={title} fill priority className="object-cover object-center" sizes="100vw"/>
    <div className="absolute inset-0 bg-black/25"/><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,15,16,.72)_0%,rgba(15,15,16,.48)_48%,rgba(15,15,16,.08)_88%)]"/><div className="absolute inset-0 bg-gradient-to-t from-[#171719]/60 via-transparent to-transparent"/>
    <div className="relative mx-auto w-full max-w-[1500px]"><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.17em] text-white/65"><Link href="/">Ana Sayfa</Link><FiChevronRight/><span className="text-[#ff8a8f]">{eyebrow}</span></div><h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[84px]">{title}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{description}</p><div className="mt-9 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.17em] text-white/50"><FiArrowDown/> Sayfayı keşfedin</div></div>
  </section>
}
