import React from 'react';
import Link from 'next/link';
import { FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi';

const Contact = () => {
  return (
    <section id="iletisim" className="lale-light-section py-24 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <div className="lale-kicker">İletişim</div>

          <h2 className="mt-6 font-serif text-3xl text-[var(--dream-dark)] sm:text-4xl">
            Bize kolayca
            <span className="block text-[var(--lale-gold)]">ulaşabilirsiniz</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--dream-text)] sm:text-base">
            Randevu, bilgi ve size uygun bakım planlaması için bizimle iletişime geçin.
          </p>
        </div>

        <div className="mb-12 overflow-hidden rounded-[34px] bg-[var(--brand-panel)] px-6 py-8 text-white shadow-[0_28px_90px_rgba(223,167,69,0.18)] sm:px-10 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm tracking-[0.14em] text-white/72">RANDEVU VE BİLGİ</p>
              <h3 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">
                Sunny Life ile solaryum seansınızı hızlıca planlayalım
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                Telefon, Instagram veya iletişim sayfası üzerinden bize ulaşıp
                size uygun işlem ve randevu saatini birlikte belirleyebilirsiniz.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="tel:+905312899969"
                className="rounded-[24px] bg-white/[0.88] px-5 py-5 text-[var(--dream-dark)] shadow-[0_16px_40px_rgba(95,89,108,0.12)] transition-transform duration-300 hover:-translate-y-1"
              >
                <FiPhone className="h-5 w-5 text-[var(--lale-gold)]" />
                <p className="mt-4 text-xs tracking-[0.14em] text-[var(--lale-gold)]">TELEFON</p>
                <p className="mt-2 text-base font-medium">0531 289 99 69</p>
              </a>

              <a
                href="https://www.instagram.com/sunnylifesolariumbeauty/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[24px] bg-white/[0.88] px-5 py-5 text-[var(--dream-dark)] shadow-[0_16px_40px_rgba(95,89,108,0.12)] transition-transform duration-300 hover:-translate-y-1"
              >
                <FiInstagram className="h-5 w-5 text-[var(--lale-gold)]" />
                <p className="mt-4 text-xs tracking-[0.14em] text-[var(--lale-gold)]">INSTAGRAM</p>
                <p className="mt-2 text-base font-medium">@sunnylifesolariumbeauty</p>
              </a>
            </div>
          </div>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-[rgba(223,167,69,0.16)] bg-white/[0.88] p-7 text-center shadow-[0_18px_50px_rgba(95,89,108,0.08)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(223,167,69,0.12)] text-[var(--lale-gold)] shadow-inner">
              <FiPhone className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-base font-semibold text-[var(--dream-dark)]">Telefon</h3>
            <a href="tel:+905312899969" className="text-lg font-medium text-[var(--lale-gold)] transition-colors hover:text-[var(--lale-gold-soft)]">
              0531 289 99 69
            </a>
            <p className="mt-3 text-sm text-[var(--dream-text)]">Randevu ve bilgi için hemen ulaşın</p>
          </div>

          <div className="rounded-[28px] border border-[rgba(223,167,69,0.16)] bg-white/[0.88] p-7 text-center shadow-[0_18px_50px_rgba(95,89,108,0.08)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(223,167,69,0.12)] text-[var(--lale-gold)] shadow-inner">
              <FiInstagram className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-base font-semibold text-[var(--dream-dark)]">Instagram</h3>
            <a
              href="https://www.instagram.com/sunnylifesolariumbeauty/"
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-base font-medium text-[var(--lale-gold)] transition-colors hover:text-[var(--lale-gold-soft)]"
            >
              @sunnylifesolariumbeauty
            </a>
            <p className="mt-3 text-sm text-[var(--dream-text)]">Güncel paylaşımlar ve hızlı iletişim</p>
          </div>

          <div className="rounded-[28px] border border-[rgba(223,167,69,0.16)] bg-white/[0.88] p-7 text-center shadow-[0_18px_50px_rgba(95,89,108,0.08)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(223,167,69,0.12)] text-[var(--lale-gold)] shadow-inner">
              <FiMapPin className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-base font-semibold text-[var(--dream-dark)]">Adres</h3>
            <p className="text-base text-[var(--dream-dark)]">Anadolu Hisarı / İstanbul</p>
            <p className="mt-3 text-sm text-[var(--dream-text)]">Randevu öncesi konum bilgisi için bize ulaşın</p>
          </div>
        </div>

        <div className="text-center">
          <div className="rounded-[30px] border border-[rgba(223,167,69,0.16)] bg-white/[0.88] p-8 shadow-[0_18px_50px_rgba(95,89,108,0.08)]">
            <h3 className="mb-4 text-xl font-serif text-[var(--dream-dark)]">Detaylı İletişim Formu</h3>
            <p className="mx-auto mb-6 max-w-2xl leading-7 text-[var(--dream-text)]">
              Beklentilerinizi bizimle paylaşın, size uygun bakım ve randevu
              planını birlikte oluşturalım.
            </p>
            <Link href="/iletisim" className="lale-gold-button">
              Formu Doldur
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
