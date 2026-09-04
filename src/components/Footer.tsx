'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiArrowUpRight, FiFacebook, FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi';

const footerLinks = [
  { href: '/hizmetlerimiz', label: 'Hizmetlerimiz' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative overflow-hidden border-t-4 border-[#ef1b18] bg-[#111315] px-5 text-white sm:px-8 lg:px-14">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#ef1b18]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.025),transparent_42%)]" />
      <div className="relative mx-auto max-w-[1500px]">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_.65fr_.9fr] lg:gap-20 lg:py-16">
          <div>
            <div className="relative h-[62px] w-[264px] max-w-full sm:h-[68px] sm:w-[290px]" aria-label="Gümüşoğlu Elektrik">
              <Image src="/gumusoglu/gumusoglu-logo.png" alt="Gümüşoğlu Elektrik" fill className="object-contain object-left brightness-0 invert" sizes="(max-width: 640px) 264px, 290px" />
            </div>
            <p className="mt-7 max-w-lg text-sm leading-7 text-white/65">1974&apos;ten bu yana Akkuş ve çevresine güvenli, kesintisiz ve kaliteli enerji çözümleri sunuyoruz.</p>
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.18em] text-white/45">
              <span className="h-px w-8 bg-[#e52220]" />
              Gerçek Elektrik&apos;ten bugüne
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[.2em] text-[#ff5a57]">Hızlı erişim</h3>
            <nav className="mt-6 grid gap-3" aria-label="Footer menüsü">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group flex w-fit items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
                  {link.label}
                  <FiArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[.2em] text-[#ff5a57]">Bize ulaşın</h3>
            <div className="mt-6 space-y-5">
              <a href="tel:+905384682399" className="flex items-center gap-3 font-black transition hover:text-[#ff5a57]">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ef1b18]/10 text-[#ff5a57]"><FiPhone /></span>
                0538 468 23 99
              </a>
              <p className="flex items-start gap-3 text-sm leading-7 text-white/65">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ef1b18]/10 text-[#ff5a57]"><FiMapPin /></span>
                <span>İstiklal Cad. Merkez Mah.<br />No: 43/A Akkuş / Ordu</span>
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <a className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/75 transition hover:border-[#ef1b18] hover:bg-[#ef1b18] hover:text-white" aria-label="Instagram" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/gumusogluelektrik?igsi=bmMyYTVqZ2E4aW1u"><FiInstagram /></a>
              <a className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/75 transition hover:border-[#ef1b18] hover:bg-[#ef1b18] hover:text-white" aria-label="Facebook" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/share/19JMbqnJZk/"><FiFacebook /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-5 pr-20 text-[10px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Gümüşoğlu Elektrik. Tüm hakları saklıdır.</p>
          <p className="sm:pr-4">1974&apos;ten bugüne güvenle.</p>
        </div>
      </div>
    </footer>
  );
}
