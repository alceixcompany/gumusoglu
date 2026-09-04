import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiBatteryCharging, FiCheck, FiClock, FiCpu, FiGrid, FiShield, FiSmartphone, FiTool, FiZap } from 'react-icons/fi';
import StorePageHero, { PageCta } from '@/components/StorePageHero';

const repairs = [
  { icon: FiSmartphone, title: 'Ekran değişimi', text: 'Kırık ekran, görüntü kaybı ve dokunmatik problemleri için hızlı ve kontrollü parça değişimi.' },
  { icon: FiZap, title: 'Soket değişimi', text: 'Şarj almama, yavaş şarj ve temassızlık sorunları için kontrollü soket değişimi.' },
  { icon: FiCpu, title: 'Anakart tamiri', text: 'Anakart kaynaklı açılmama ve işlev sorunları için detaylı arıza tespiti ve onarım.' },
  { icon: FiBatteryCharging, title: 'Batarya değişimi', text: 'Hızlı tükenme ve ani kapanma sorunları için hızlı batarya değişimi ve kontrol.' },
  { icon: FiGrid, title: 'Kasa değişimi', text: 'Darbe, eğilme ve deformasyon yaşayan cihazlar için uyumlu kasa değişimi.' },
  { icon: FiTool, title: 'Ön cam değişimi', text: 'Görüntü ve dokunmatik çalışırken kırılan ön cam için hassas değişim işlemi.' },
];

const process = [
  ['01', 'Cihaz kabulü', 'Şikâyetinizi dinler, cihazın mevcut durumunu birlikte kontrol ederiz.'],
  ['02', 'Arıza tespiti', 'Sorunun kaynağını belirler, uygulanabilecek çözümü netleştiririz.'],
  ['03', 'Onay & onarım', 'Fiyat ve işlem onayınızdan sonra teknik müdahaleyi gerçekleştiririz.'],
  ['04', 'Kontrol & teslim', 'Temel fonksiyonları test eder, yapılan işlemi anlatarak teslim ederiz.'],
];

export const metadata = {
  title: 'Telefon Teknik Servis',
  description: 'Türkiye’nin 81 iline hizmet veren Enes Teknoloji ile 30 dakikada ekran ve batarya değişimi, kontrollü arıza tespiti ve güvenilir teknik servis.',
  alternates: { canonical: '/teknik-servis' },
  openGraph: {
    title: 'Telefon Teknik Servis | Enes Teknoloji',
    description: '81 ile hizmet, 30 dakikada ekran ve batarya değişimi; şeffaf ve kontrollü teknik servis süreci.',
    url: '/teknik-servis',
    images: ['/brand/hero-service.webp'],
  },
};

export default function ServicePage() {
  return <main className="bg-[var(--paper)] text-[var(--ink)]">
    <StorePageHero index="01" eyebrow="81 İle Hizmet" title="30 dakikada ekran ve batarya değişimi." description="Türkiye'nin 81 iline hizmet veriyor; arızayı doğru tespit edip seçenekleri açıkça anlatarak onayınızla kontrollü bir servis süreci yürütüyoruz." image="/brand/hero-service.webp" imageAlt="Enes Teknoloji profesyonel telefon teknik servis atölyesi" />

    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:gap-20">
      <div className="relative pb-10 pr-0 sm:pr-12">
        <div className="relative min-h-[520px] overflow-hidden rounded-[34px]"><Image src="/brand/gallery-repair.webp" alt="Enes Teknoloji teknik servis çalışma alanı" fill className="object-cover" sizes="(max-width:1024px) 100vw, 45vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/><div className="absolute bottom-7 left-7 text-white"><span className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--taxi-yellow)]">Çalışma alanımız</span><p className="mt-2 text-2xl font-black">Düzenli. Kontrollü. Şeffaf.</p></div></div>
        <div className="absolute bottom-0 right-0 hidden rounded-[24px] border-[8px] border-[var(--paper)] bg-[var(--taxi-yellow)] p-6 sm:block"><FiShield className="h-7 w-7"/><b className="mt-5 block text-xl">Teslim öncesi</b><span className="mt-1 block text-xs text-black/50">fonksiyon kontrolü</span></div>
      </div>
      <div><p className="section-tag">Servis kapsamı</p><h2 className="mt-5 text-3xl font-black leading-[1.02] tracking-[-.05em] sm:text-5xl">En sık çözdüğümüz sorunlar.</h2><p className="mt-6 max-w-xl text-sm leading-7 text-black/50">Her arıza aynı değildir. Cihazı görerek değerlendirir, gereksiz parça değişiminden kaçınırız.</p>
        <div className="mt-9 divide-y divide-black/10 border-y border-black/10">{repairs.map(({icon:Icon,title,text})=><article key={title} className="grid grid-cols-[48px_1fr] gap-4 py-6"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--taxi-deep)] shadow-sm"><Icon/></span><div><h3 className="text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-black/45">{text}</p></div></article>)}</div>
      </div>
    </div></section>

    <section className="bg-[var(--ink)] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1440px]">
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[11px] font-black uppercase tracking-[.22em] text-[var(--taxi-yellow)]">Servis süreci</p><h2 className="mt-5 text-3xl font-black tracking-[-.05em] sm:text-5xl">Başından sonuna kontrollü.</h2></div><p className="max-w-xl text-sm leading-7 text-white/45 lg:justify-self-end">Cihazınızın hangi aşamada olduğunu bilirsiniz. İşlem değişirse önce sizi bilgilendiririz.</p></div>
      <div className="relative mt-14 grid gap-4 lg:grid-cols-4 before:absolute before:left-[12%] before:right-[12%] before:top-7 before:hidden before:h-px before:bg-white/15 lg:before:block">{process.map(([no,title,text])=><article key={no} className="relative rounded-[24px] border border-white/10 bg-white/[.035] p-6"><span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--taxi-yellow)] text-sm font-black text-black">{no}</span><h3 className="mt-9 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-white/42">{text}</p></article>)}</div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-[22px] bg-white/10 sm:grid-cols-3">{[[FiClock,'30 dakikada değişim','Ekran ve batarya işlemleri'],[FiCheck,'Kontrollü teslim','Temel fonksiyon kontrolleri'],[FiTool,'81 ile hizmet','Türkiye genelinde ulaşılabilirlik']].map(([Icon,title,text]) => { const ItemIcon = Icon as typeof FiClock; return <div key={title as string} className="flex items-center gap-4 bg-[#1d1e20] p-5"><ItemIcon className="h-5 w-5 text-[var(--taxi-yellow)]"/><div><b className="block text-sm">{title as string}</b><span className="text-xs text-white/35">{text as string}</span></div></div>})}</div>
    </div></section>

    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24"><div className="mx-auto grid max-w-[1440px] gap-10 rounded-[32px] bg-white p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="section-tag">Servis notu</p><h2 className="mt-4 text-2xl font-black tracking-[-.04em] sm:text-3xl">Sıvı teması veya ağır darbe varsa cihazı zorlamayın.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-black/45">Cihazı şarja takmadan ve tekrar açmayı denemeden teknik değerlendirme için getirin.</p></div><Link href="/iletisim" className="inline-flex items-center justify-center gap-3 rounded-xl bg-[var(--ink)] px-7 py-4 text-sm font-black text-white">Bize ulaşın <FiArrowRight/></Link></div></section>
    <PageCta title="Cihazınızı birlikte değerlendirelim." text="Arızayı kısaca anlatın; uygun servis süreci için sizi bilgilendirelim." href="/iletisim" label="Servis talebi oluştur" />
  </main>;
}
