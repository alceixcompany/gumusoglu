import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiCamera } from 'react-icons/fi';

const images = [
  { src: '/brand/enes-teknoloji-hero.webp', alt: 'Enes Teknoloji mağaza genel görünümü', label: 'Mağaza', className: 'md:col-span-7 md:row-span-2' },
  { src: '/brand/gallery-accessories.webp', alt: 'Telefon aksesuarları rafları', label: 'Aksesuar alanı', className: 'md:col-span-5' },
  { src: '/brand/gallery-repair.webp', alt: 'Telefon teknik servis masası', label: 'Teknik servis', className: 'md:col-span-5' },
];

export default function HomeGallery() {
  return (
    <section className="bg-[var(--ink)] px-5 py-24 text-white sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[.22em] text-[var(--taxi-yellow)]"><FiCamera /> Mağazadan kareler</p>
            <h2 className="mt-5 text-3xl font-black leading-[.98] tracking-[-.055em] sm:text-5xl">İşimizin içinden,<br />olduğu gibi.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/45">Düzenli bir mağaza, temiz bir çalışma alanı ve cihazınıza gösterdiğimiz özen.</p>
        </div>

        <div className="mt-14 grid auto-rows-[280px] gap-4 md:grid-cols-12 md:auto-rows-[260px]">
          {images.map((item, index) => (
            <figure key={item.src} className={`group relative overflow-hidden rounded-[28px] bg-white/5 ${item.className}`}>
              <Image src={item.src} alt={item.alt} fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes={index === 0 ? '(max-width:768px) 100vw, 60vw' : '(max-width:768px) 100vw, 40vw'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                <div><span className="block text-[10px] font-black uppercase tracking-[.2em] text-[var(--taxi-yellow)]">0{index + 1}</span><span className="mt-1 block text-lg font-black">{item.label}</span></div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur"><FiArrowUpRight /></span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex justify-end"><Link href="/hakkimizda" className="inline-flex items-center gap-3 border-b border-white/30 pb-2 text-sm font-black transition hover:border-[var(--taxi-yellow)] hover:text-[var(--taxi-yellow)]">Mağazayı daha yakından tanıyın <FiArrowUpRight /></Link></div>
      </div>
    </section>
  );
}
