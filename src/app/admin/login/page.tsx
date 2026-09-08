'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, loginUser } from '@/store/slices/authSlice';
import BrandMark from '@/components/BrandMark';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { user, isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated && user) router.push('/admin'); }, [isAuthenticated, user, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push('/admin');
    } catch { /* Hata Redux üzerinden kullanıcıya gösterilir. */ }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1320px] overflow-hidden rounded-[32px] bg-white shadow-[0_30px_90px_rgba(50,18,22,.14)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.06fr_.94fr]">
        <section className="relative hidden min-h-[760px] overflow-hidden lg:block">
          <Image src="/gumusoglu/hero-gumusoglu-light-v3.webp" alt="Gümüşoğlu Elektrik yönetim paneli" fill priority className="object-cover" sizes="55vw"/>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,47,69,.04)_0%,rgba(20,47,69,.18)_44%,rgba(20,47,69,.92)_100%)]"/>
          <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.18em] backdrop-blur"><FiShield/> Güvenli yönetim alanı</div>
            <h1 className="mt-6 max-w-xl text-5xl font-black leading-[1.02] tracking-[-.05em]">İçeriğiniz her zaman kontrolünüzde.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/68">Blog yazılarını, galeri çalışmalarını ve ziyaretçi mesajlarını tek panelden yönetin.</p>
          </div>
        </section>

        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#69696e] transition hover:text-[#e30613]"><FiArrowLeft/> Siteye dön</Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f7f7] px-3 py-2 text-[9px] font-black uppercase tracking-[.16em] text-[#e30613]"><FiShield/> Korumalı</span>
          </div>
          <div className="mt-14"><BrandMark dark/><p className="mt-10 text-[10px] font-black uppercase tracking-[.2em] text-[#ef1b18]">Yönetici girişi</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-[#202022]">Tekrar hoş geldiniz.</h2><p className="mt-3 text-sm leading-7 text-[#747479]">Gümüşoğlu Elektrik içerik yönetimine devam etmek için bilgilerinizi girin.</p></div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[#59595e]">E-posta</span><span className="relative block"><FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#e30613]"/><input type="email" required autoComplete="username" value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="admin@gumusogluelektrik.com" disabled={isLoading} className="w-full rounded-2xl border border-[#e5dede] bg-[#fafafa] py-4 pl-12 pr-5 text-sm text-[#202022] outline-none transition placeholder:text-[#aaaaaf] focus:border-[#e30613] focus:bg-white focus:ring-4 focus:ring-[#e30613]/10"/></span></label>
            <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[#59595e]">Şifre</span><span className="relative block"><FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#e30613]"/><input type={showPassword?'text':'password'} required autoComplete="current-password" value={password} onChange={(event)=>setPassword(event.target.value)} placeholder="••••••••••••" disabled={isLoading} className="w-full rounded-2xl border border-[#e5dede] bg-[#fafafa] py-4 pl-12 pr-12 text-sm text-[#202022] outline-none transition placeholder:text-[#aaaaaf] focus:border-[#e30613] focus:bg-white focus:ring-4 focus:ring-[#e30613]/10"/><button type="button" onClick={()=>setShowPassword((value)=>!value)} aria-label={showPassword?'Şifreyi gizle':'Şifreyi göster'} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7d7d82] hover:text-[#e30613]">{showPassword?<FiEyeOff/>:<FiEye/>}</button></span></label>
            {error&&<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-700">{error}</div>}
            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#e30613] px-6 py-4 text-sm font-black text-white shadow-[0_14px_30px_rgba(227,6,19,.22)] transition hover:-translate-y-0.5 hover:bg-[#b90913] disabled:cursor-not-allowed disabled:opacity-55">{isLoading?<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/> Giriş yapılıyor...</>:<>Panele giriş yap <FiArrowRight/></>}</button>
          </form>
          <p className="mt-10 text-center text-[9px] font-bold uppercase tracking-[.17em] text-[#a0a0a5]">Gümüşoğlu Elektrik · {new Date().getFullYear()}</p>
        </section>
      </div>
    </main>
  );
}
