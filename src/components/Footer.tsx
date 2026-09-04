'use client';
import { usePathname } from 'next/navigation';
import { FiFacebook, FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi';
import BrandMark from './BrandMark';

export default function Footer(){
  const p=usePathname(); if(p?.startsWith('/admin'))return null;
  return <footer className="border-t border-white/15 bg-[#285f8f] px-5 text-white sm:px-8 lg:px-14"><div className="mx-auto max-w-[1500px]">
    <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.8fr]">
      <div><BrandMark/><p className="mt-5 max-w-md text-sm leading-7 text-white/65">1974&apos;ten bu yana Akkuş ve çevresine güvenli, kesintisiz ve kaliteli enerji çözümleri sunuyoruz.</p></div>
      <div><h3 className="footer-title">Hızlı erişim</h3><div className="mt-5 grid gap-3 text-sm text-white/70"><a href="/hizmetlerimiz">Hizmetlerimiz</a><a href="/hakkimizda">Hakkımızda</a><a href="/galeri">Galeri</a><a href="/blog">Blog</a><a href="/iletisim">İletişim</a></div></div>
      <div><h3 className="footer-title">Bize ulaşın</h3><a href="tel:+905384682399" className="mt-5 flex items-center gap-3 font-black"><FiPhone/>0538 468 23 99</a><p className="mt-4 flex gap-3 text-sm leading-6 text-white/65"><FiMapPin className="mt-1 shrink-0"/>İstiklal Cad. Merkez Mah.<br/>No: 43/A Akkuş / Ordu</p><div className="mt-5 flex gap-2"><a className="social" aria-label="Instagram" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/gumusogluelektrik?igsi=bmMyYTVqZ2E4aW1u"><FiInstagram/></a><a className="social" aria-label="Facebook" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/share/19JMbqnJZk/"><FiFacebook/></a></div></div>
    </div><div className="flex flex-col gap-2 border-t border-white/15 py-5 text-[10px] text-white/50 sm:flex-row sm:justify-between"><p>© 2026 Gümüşoğlu Elektrik. Tüm hakları saklıdır.</p><p>1974&apos;ten bugüne güvenle.</p></div>
  </div></footer>
}
