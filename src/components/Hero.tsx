'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  FiArrowRight,
  FiArrowUpRight,
  FiClock,
  FiMapPin,
  FiPhone,
} from 'react-icons/fi';

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: 'easeOut' },
  },
};

const group: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.12 },
  },
};

const details = [
  { icon: FiMapPin, label: 'Konum', value: 'Anadolu Hisarı / İstanbul' },
  { icon: FiPhone, label: 'İletişim', value: '0531 289 99 69' },
  { icon: FiClock, label: 'Deneyim', value: 'Kişiye özel seans planı' },
] as const;

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--brand-panel-deep)]">
      <div className="relative min-h-screen w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative min-h-screen w-full overflow-hidden bg-[var(--brand-panel-deep)]"
        >
          <Image
            src="/banner/sunnylife-solarium-studio.webp"
            alt="Sunny Life Solarium & Beauty modern solaryum stüdyosu"
            fill
            priority
            className="object-cover object-[62%_center]"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,19,15,0.96)_0%,rgba(23,19,15,0.82)_42%,rgba(23,19,15,0.26)_72%,rgba(23,19,15,0.10)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,19,15,0.08)_48%,rgba(23,19,15,0.86)_100%)]" />

          <motion.div
            variants={group}
            initial="hidden"
            animate="visible"
            className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pb-52 pt-32 sm:px-10 sm:pb-44 lg:px-14 lg:pb-40"
          >
            <motion.p variants={reveal} className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--lale-gold-soft)] sm:text-sm">
              Solaryum &amp; Beauty
            </motion.p>

            <motion.h1
              variants={reveal}
              className="mt-5 max-w-[720px] font-serif text-[46px] font-normal leading-[0.98] tracking-[-0.035em] text-white sm:text-[66px] lg:text-[82px]"
            >
              Bronzluğun en zarif hali.
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-7 max-w-[590px] text-base leading-8 text-white/70 sm:text-lg"
            >
              Ten tipinize özel seans planı, modern cihazlar ve sakin bir atmosfer.
              Işığınızı kontrollü ve özenli bir deneyimle ortaya çıkarın.
            </motion.p>

            <motion.div variants={reveal} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--lale-gold-soft)] px-7 py-4 text-sm font-semibold text-[var(--brand-panel-deep)] shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Randevu Oluştur
                <FiArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hizmetlerimiz/solaryum"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/24 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[var(--dream-dark)]"
              >
                Solaryumu Keşfet
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/12 bg-[rgba(23,19,15,0.62)] px-5 py-5 backdrop-blur-xl sm:px-8 lg:px-12">
            <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3 sm:gap-0">
              {details.map((detail, index) => {
                const Icon = detail.icon;

                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.55 + index * 0.08 }}
                    className="flex items-center gap-3 sm:border-r sm:border-white/12 sm:px-5 sm:first:pl-0 sm:last:border-r-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--lale-gold-soft)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{detail.label}</p>
                      <p className="mt-1 text-sm text-white/80">{detail.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
