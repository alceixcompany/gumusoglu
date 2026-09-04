'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMapPin, FiStar } from 'react-icons/fi';

const reviews = [
  {
    name: 'Elif K.',
    service: 'Solaryum',
    location: 'Beykoz',
    rating: 5,
    time: '2 hafta önce',
    comment:
      'İlk seans öncesinde süreç çok net anlatıldı. Ortam sıcak, düzenli ve tertemizdi; kendimi rahat hissettim.',
    image: '/img/ayşe.avif',
  },
  {
    name: 'Merve A.',
    service: 'Solaryum',
    location: 'Beykoz',
    rating: 5,
    time: '1 ay önce',
    comment:
      'Tenime uygun süreyi birlikte belirledik. Kademeli ilerlemeleri ve her ziyaret öncesi yeniden bilgi vermeleri güven verdi.',
    image: '/img/banu.avif',
  },
  {
    name: 'Seda T.',
    service: 'Bronzlaşma Planı',
    location: 'Kavacık',
    rating: 5,
    time: '3 hafta önce',
    comment:
      'Hedeflediğim doğal tonu anlattım, bana uygun bir seans planı hazırladılar. İlgili ve özenli bir ekip.',
    image: '/img/ahmet.avif',
  },
  {
    name: 'Gizem Y.',
    service: 'Beauty Bakımı',
    location: 'Beykoz',
    rating: 5,
    time: '5 gün önce',
    comment:
      'Bakım sonrası hem fiziksel olarak rahatladım hem de kendimi çok iyi hissettim. Ortam tertemiz ve ekip çok ilgiliydi.',
    image: '/img/ali.avif',
  },
] as const;

const References = () => {
  const [counts, setCounts] = useState({
    reviews: 0,
    customers: 0,
    years: 0,
    satisfaction: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = { reviews: 481, customers: 1633, years: 0, satisfaction: 0 };

    const animateCount = (
      start: number,
      end: number,
      duration: number,
      callback: (value: number) => void
    ) => {
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (end - start) * easeOutQuart);

        callback(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount(0, targets.reviews, 1800, (value) =>
              setCounts((prev) => ({ ...prev, reviews: value }))
            );
            animateCount(0, targets.customers, 1800, (value) =>
              setCounts((prev) => ({ ...prev, customers: value }))
            );
            animateCount(0, targets.years, 1800, (value) =>
              setCounts((prev) => ({ ...prev, years: value }))
            );
            animateCount(0, targets.satisfaction, 1800, (value) =>
              setCounts((prev) => ({ ...prev, satisfaction: value }))
            );
          }
        });
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="referanslar" className="lale-light-section py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="lale-kicker">Neden Bizi Seçmelisiniz?</div>
          <h2 className="mt-6 font-serif text-3xl leading-tight text-[var(--dream-dark)] sm:text-4xl">
            Güven, konfor ve uzmanlığı
            <span className="block text-[var(--lale-gold)]">aynı deneyimde buluşturuyoruz</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--dream-text)] sm:text-base">
            Ten tipine özel planlama, modern cihazlar ve özenli hijyen yaklaşımıyla
            kontrollü bir bronzlaşma deneyimi sunuyoruz.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-[32px] border border-[rgba(223,167,69,0.16)] bg-[rgba(255,255,255,0.84)] p-6 shadow-[0_26px_70px_rgba(95,89,108,0.08)] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(223,167,69,0.14)] text-[var(--lale-gold)]">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm tracking-[0.12em] text-[var(--lale-gold)]">SUNNY LIFE AVANTAJLARI</p>
                <h3 className="mt-1 text-xl font-medium text-[var(--dream-dark)]">Profesyonel ve kişisel yaklaşım</h3>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[var(--dream-text)]">
              Solaryum seanslarında hedefinize uygun süre planı, kontrollü ilerleme
              ve konforlu bir merkez deneyimi hedefliyoruz.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Son teknoloji cihazlarla planlanan seanslar',
                'Ten tipine özel süre planlaması ve süreç takibi',
                'Sakin, estetik ve temiz merkez atmosferi',
                'Dengeli bronzluğu öne alan uygulama yaklaşımı',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[20px] border border-[rgba(223,167,69,0.14)] bg-[rgba(247,240,242,0.72)] px-4 py-3"
                >
                  <FiCheckCircle className="h-5 w-5 shrink-0 text-[var(--lale-gold)]" />
                  <span className="text-sm text-[var(--dream-dark)]">{item}</span>
                </div>
              ))}
            </div>

            <div
              ref={statsRef}
              className="mt-8 grid gap-4 border-t border-[rgba(223,167,69,0.14)] pt-6 sm:grid-cols-2"
            >
              <div className="rounded-[22px] bg-white px-5 py-5 text-center">
                <div className="text-2xl font-semibold text-[var(--lale-gold)]">{counts.reviews}+</div>
                <p className="mt-2 text-sm text-[var(--dream-text)]">Instagram paylaşımı</p>
              </div>
              <div className="rounded-[22px] bg-white px-5 py-5 text-center">
                <div className="text-2xl font-semibold text-[var(--lale-gold)]">{counts.customers}+</div>
                <p className="mt-2 text-sm text-[var(--dream-text)]">Instagram takipçisi</p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review, index) => (
              <motion.article
                key={`${review.name}-${review.service}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.58, delay: index * 0.04, ease: 'easeOut' }}
                className="rounded-[28px] border border-[rgba(223,167,69,0.18)] bg-white/[0.88] p-6 shadow-[0_18px_50px_rgba(95,89,108,0.10)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={52}
                      height={52}
                      className="h-[52px] w-[52px] rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-base font-semibold text-[var(--dream-dark)]">{review.name}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--dream-text)]">
                        <FiMapPin className="h-3.5 w-3.5" />
                        <span>{review.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--dream-text)]">{review.time}</div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[var(--lale-gold)]">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <FiStar key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-[var(--dream-text)]">{review.comment}</p>

                <div className="mt-5 flex items-center justify-between border-t border-[rgba(223,167,69,0.12)] pt-4">
                  <span className="rounded-full border border-[rgba(223,167,69,0.18)] bg-[rgba(223,167,69,0.08)] px-3 py-1 text-xs text-[var(--lale-gold)]">
                    {review.service}
                  </span>
                  <span className="text-xs text-[var(--dream-text)]">Sunny Life misafir yorumu</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default References;
