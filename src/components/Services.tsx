'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiCheck } from 'react-icons/fi';

const services = [
  {
    title: 'Solaryum',
    description: 'Ten tipinize ve bronzluk hedefinize göre planlanan kontrollü, hijyenik solaryum seansları.',
    category: 'Bronzlaşma',
    image: '/banner/sunnylife-solarium-studio.webp',
    href: '/hizmetlerimiz/solaryum',
  },
  {
    title: 'Cilt Bakımı',
    description: 'Cilt ihtiyacınıza göre belirlenen, temizlik ve bakım adımlarıyla planlanan kişisel uygulamalar.',
    category: 'Cilt & Bakım',
    image: '/hizmetler/sunnylife-cilt-nem-bakimi.webp',
    href: '/hizmetlerimiz/cilt-bakimi',
  },
  {
    title: 'Epilasyon',
    description: 'Uygulama bölgesi ve kıl yapısı değerlendirilerek kişiye özel planlanan epilasyon seansları.',
    category: 'Pürüzsüzlük',
    image: '/hizmetler/lazer-epilasyon.png',
    href: '/hizmetlerimiz/lazer-epilasyon',
  },
  {
    title: 'G5 / G8 Masaj',
    description: 'Ritmik mekanik masajla vücut bakımını ve daha pürüzsüz bir görünümü destekleyen uygulama.',
    category: 'Vücut Bakımı',
    image: '/hizmetler/masaj.png',
    href: '/iletisim?service=g5-g8-masaj',
  },
  {
    title: 'Rasping',
    description: 'Hedeflenen bölgeye göre planlanan, vücut konturunu ve sıkı görünümü destekleyen bakım.',
    category: 'Vücut Bakımı',
    image: '/hizmetler/bolgesel-zayiflama.png',
    href: '/iletisim?service=rasping',
  },
  {
    title: 'Dipotens',
    description: 'Mikro ve galvanik akım teknolojisiyle bölgesel toparlanma görünümünü destekleyen uygulama.',
    category: 'Vücut Bakımı',
    image: '/hizmetler/vucut-bakimi.png',
    href: '/iletisim?service=dipotens',
  },
] as const;

const Services = () => {
  return (
    <section id="hizmetler" className="relative overflow-hidden bg-[var(--lale-cream)] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-20 top-16 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-32 h-72 w-72 rounded-full bg-[rgba(184,121,56,0.10)] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="lale-kicker">Hizmetlerimiz</div>
          <h2 className="mt-5 font-serif text-3xl font-normal leading-[1.12] tracking-[-0.02em] text-[var(--lale-emerald-deep)] sm:text-4xl lg:text-5xl">
            Kendiniz için ayırdığınız zaman, iyi hissettirsin
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--dream-text)] sm:text-base">
            İhtiyacınıza göre planlanan solaryum, cilt, epilasyon ve cihaz destekli
            vücut bakımlarımızı keşfedin.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.62, delay: index * 0.06, ease: 'easeOut' }}
              className="group overflow-hidden rounded-[26px] border border-[rgba(42,33,27,0.08)] bg-[var(--lale-ivory)] shadow-[0_16px_45px_rgba(42,33,27,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(42,33,27,0.14)]"
            >
              <Link href={service.href} className="block h-full" aria-label={`${service.title} detayları`}>
                <div className="relative h-[220px] overflow-hidden sm:h-[260px] lg:h-[240px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-black/20 px-3.5 py-2 text-xs font-medium tracking-[0.12em] text-white backdrop-blur-md">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="relative px-5 pb-6 pt-6 sm:px-6 sm:pb-7">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--lale-gold)]">
                    {service.category}
                  </span>
                  <h3 className="mt-2 font-serif text-[26px] font-normal leading-tight text-[var(--lale-emerald-deep)] sm:text-[28px]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--dream-text)] sm:min-h-[72px]">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[rgba(42,33,27,0.10)] pt-4">
                    <span className="text-sm font-medium text-[var(--lale-emerald-deep)]">İncele</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lale-emerald-deep)] text-white transition-transform duration-300 group-hover:translate-x-1">
                      <FiArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[26px] bg-[var(--lale-emerald-deep)] px-5 py-6 text-white sm:px-7 md:flex md:items-center md:justify-between md:gap-8 lg:px-9">
          <div>
            <p className="font-serif text-xl leading-snug text-white sm:text-2xl">Hangi uygulamanın size uygun olduğundan emin değil misiniz?</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {['Kişiye özel plan', 'Hijyenik ortam', 'Uzman yönlendirmesi'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-xs text-white/70 sm:text-sm">
                  <FiCheck className="h-4 w-4 text-[var(--lale-gold-soft)]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <Link href="/iletisim" className="lale-gold-button mt-6 shrink-0 gap-3 md:mt-0">
            Randevu Al
            <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
