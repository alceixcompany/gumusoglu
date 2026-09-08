'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiArrowUpRight, FiMenu, FiPhone, FiX } from 'react-icons/fi';
import BrandMark from './BrandMark';

const links = [
  { href: '/hizmetlerimiz', label: 'Hizmetler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  if (pathname?.startsWith('/admin')) return null;
  const active = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled || open ? 'border-neutral-200/80 bg-white/95 shadow-[0_8px_30px_rgba(17,17,17,.09)] backdrop-blur-lg' : 'border-neutral-200 bg-white'}`}>
      <div className="mx-auto flex h-[82px] max-w-[1540px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Gümüşoğlu Elektrik ana sayfa" className="shrink-0"><BrandMark dark /></Link>
        <nav className="hidden h-full items-center gap-7 lg:flex xl:gap-9" aria-label="Ana menü">
          {links.map((link) => {
            const isActive = active(link.href);
            return <Link key={link.href} href={link.href} aria-current={isActive ? 'page' : undefined} className={`relative flex h-full items-center text-xs font-extrabold transition ${isActive ? 'text-[#e30613]' : 'text-[#202020] hover:text-[#e30613]'}`}>
              {link.label}<span className={`absolute inset-x-0 bottom-0 h-[3px] origin-left rounded-full bg-[#e30613] transition-transform ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
            </Link>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:+905384682399" className="hidden items-center gap-3 rounded-xl bg-[#e30613] px-4 py-3 text-white shadow-[0_9px_24px_rgba(227,6,19,.22)] transition hover:-translate-y-0.5 hover:bg-[#b90913] sm:flex"><FiPhone className="h-4 w-4"/><span className="hidden text-xs font-black xl:block">0538 468 23 99</span><FiArrowUpRight className="hidden h-4 w-4 xl:block"/></a>
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-[#202020] transition hover:border-[#e30613]/30 hover:bg-[#fff3f3] hover:text-[#e30613] lg:hidden">{open ? <FiX className="h-5 w-5"/> : <FiMenu className="h-5 w-5"/>}</button>
        </div>
      </div>
      {open && <nav className="border-t border-neutral-200 bg-white px-5 pb-6 pt-3 lg:hidden" aria-label="Mobil menü">
        {links.map((link) => { const isActive = active(link.href); return <Link key={link.href} href={link.href} className={`flex items-center justify-between border-b border-neutral-100 px-2 py-4 text-sm font-extrabold transition hover:text-[#e30613] ${isActive ? 'text-[#e30613]' : 'text-[#202020]'}`}><span>{link.label}</span><FiArrowUpRight className={isActive ? 'opacity-100' : 'opacity-25'}/></Link>; })}
        <a href="tel:+905384682399" className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-[#e30613] px-5 py-4 text-sm font-black text-white shadow-[0_9px_24px_rgba(227,6,19,.18)] transition hover:bg-[#b90913]"><FiPhone/> 0538 468 23 99</a>
      </nav>}
    </header>
  );
}
