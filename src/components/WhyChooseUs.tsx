'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiStar } from 'react-icons/fi';

const highlights = [
  'Ten tipine göre planlanan seans süresi',
  'Modern solaryum cihazları',
  'Her seans öncesi hijyenik hazırlık',
  'Kontrollü ve eşit bronzluk yaklaşımı',
];

const stats = [
  { value: '481', label: 'Instagram paylaşımı' },
  { value: '1.6K+', label: 'Instagram takipçisi' },
  { value: 'Beykoz', label: 'İstanbul lokasyonu' },
];

const WhyChooseUs = () => {
  return (
    <section id="hakkimizda" className="lale-light-section py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="relative min-h-[520px]"
          >
            <div className="absolute left-0 top-10 h-[360px] w-[72%] overflow-hidden rounded-[34px] bg-white shadow-[0_24px_70px_rgba(95,89,108,0.12)]">
              <Image
                src="/banner/sunnylife-solarium-studio.webp"
                alt="Sunny Life modern solaryum stüdyosu"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <div className="absolute bottom-0 right-0 h-[300px] w-[58%] overflow-hidden rounded-[30px] border border-white/60 bg-[#f1d7b7] p-4 shadow-[0_24px_70px_rgba(223,167,69,0.16)]">
              <div className="relative h-full overflow-hidden rounded-[24px]">
                <Image
                  src="/banner/sunnylife-solarium-hero.webp"
                  alt="Sunny Life sıcak bronzluk deneyimi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 24vw"
                />
              </div>
            </div>

            <div className="absolute left-[8%] top-[60%] rounded-[24px] bg-white px-5 py-4 shadow-[0_18px_48px_rgba(95,89,108,0.14)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(223,167,69,0.14)] text-[var(--lale-gold)]">
                  <FiStar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--dream-dark)]">Kontrollü deneyim</p>
                  <p className="mt-1 text-xs text-[var(--dream-text)]">Sıcak, temiz ve modern solaryum alanı</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}
          >
            <div className="lale-kicker">Hakkımızda</div>

            <h2 className="mt-5 max-w-2xl font-serif text-3xl font-normal leading-tight text-[var(--dream-dark)] sm:text-4xl lg:text-5xl">
              Sunny Life&apos;ta bronzlaşma, size özel planlanan bir ritüel
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--dream-text)] sm:text-base">
              Ten tipiniz, bronzluk hedefiniz ve seans geçmişiniz birlikte değerlendirilir.
              Modern cihazlar, özenli hijyen ve sıcak bir atmosferle her ziyareti
              rahat ve dengeli bir deneyime dönüştürüyoruz.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[24px] border border-[rgba(223,167,69,0.18)] bg-white/80 px-4 py-4 shadow-[0_16px_36px_rgba(95,89,108,0.08)]"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(223,167,69,0.14)] text-[var(--lale-gold)]">
                    <FiCheck className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-[var(--dream-dark)]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-[rgba(223,167,69,0.16)] bg-[rgba(255,255,255,0.7)] px-5 py-5"
                >
                  <p className="font-serif text-3xl text-[var(--lale-gold)]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[var(--dream-text)]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/hakkimizda" className="lale-gold-button gap-3">
                Daha Fazla
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/iletisim"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(95,89,108,0.18)] px-6 py-3 text-sm font-medium text-[var(--dream-dark)] transition-all duration-300 hover:bg-white/70"
              >
                Randevu Planla
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
