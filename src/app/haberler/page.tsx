'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { FiArrowRight, FiCalendar, FiTag, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

interface Haber {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const NewsPage = () => {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const newsSnapshot = await getDocs(collection(db, 'haberler'));
        const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Haber[];
        const activeNews = newsData.filter(haber => haber.isActive);
        activeNews.sort((a, b) => (a.order || 0) - (b.order || 0));
        setHaberler(activeNews);
      } catch (error) {
        console.error('Haber verisi yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(haberler.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = haberler.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    try {
      setIsSubscribing(true);
      await addDoc(collection(db, 'newsletter_subscriptions'), {
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        isActive: true,
        source: 'haberler_sayfasi'
      });
      setSubscriptionStatus('success');
      setSubscriptionMessage('E-posta adresiniz başarıyla kaydedildi! Teşekkürler.');
      setEmail('');
      setTimeout(() => {
        setSubscriptionStatus('idle');
        setSubscriptionMessage('');
      }, 5000);
    } catch (error) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="lale-dark-section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--lale-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[rgba(251,250,246,0.72)] font-medium tracking-widest uppercase text-xs">Icerikler Yukleniyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-flow min-h-screen bg-[var(--lale-emerald-deep)]">
      <PageHero
        eyebrow="Sunny Life Rehberi"
        title={<>Solaryum<br />& bakım notları</>}
        description="İlk seans hazırlığı, cihaz seçenekleri ve bronzluk sonrası bakım hakkında sade, güvenli ve uygulanabilir içerikleri keşfedin."
        image="/haberler/ilk-solaryum-seansi.webp"
        imageAlt="Sunny Life Solarium & Beauty haberler"
      />

      <section className="lale-dark-section py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
          {haberler.length === 0 ? (
            <div className="text-center py-20 lale-card-dark rounded-[24px]">
              <span className="text-6xl block mb-6">✦</span>
              <h3 className="font-serif text-2xl text-[var(--lale-ivory)] mb-2">Henüz yazı bulunmuyor</h3>
              <p className="text-[rgba(251,250,246,0.68)]">Yakında sizin için harika içerikler hazırlayacağız.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-10 gap-y-16">
              {currentNews.map((haber, index) => (
                <motion.article
                  key={haber.id}
                  className="group flex flex-col gap-8"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-[rgba(212,175,55,0.22)] bg-[rgba(251,250,246,0.06)] shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    {haber.imageUrl ? (
                      <Image
                        src={haber.imageUrl}
                        alt={haber.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[linear-gradient(135deg,#06231f,#0d4d3f)] flex items-center justify-center text-5xl text-[var(--lale-gold)]">
                        ✦
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="border border-[rgba(212,175,55,0.28)] bg-[rgba(6,35,31,0.78)] backdrop-blur-md text-[var(--lale-gold)] text-[11px] font-bold tracking-[0.15em] px-4 py-2 rounded-full shadow-sm uppercase">
                        {haber.tags?.[0] || 'Güzellik'}
                      </span>
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="flex items-center gap-4 text-xs tracking-widest text-[var(--lale-gold)] mb-4 uppercase">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-3.5 h-3.5" />
                        <span>{new Date(haber.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    <Link href={`/haberler/${createSlug(haber.title)}`}>
                      <h2 className="font-serif text-3xl sm:text-4xl text-[var(--lale-gold)] opacity-75 hover:opacity-100 transition-all duration-300 leading-tight mb-4">
                        {haber.title}
                      </h2>
                    </Link>

                    <p className="text-[var(--lale-gold)] opacity-55 leading-[1.8] line-clamp-3 mb-8 text-[17px]">
                      {haber.description}
                    </p>

                    <Link 
                      href={`/haberler/${createSlug(haber.title)}`}
                      className="inline-flex items-center gap-3 text-[var(--lale-gold)] font-semibold tracking-widest uppercase text-xs group/link"
                    >
                      Devamını Oku 
                      <span className="h-px w-8 bg-[var(--lale-gold)] transition-all group-hover/link:w-12" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-24 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-full border border-[rgba(212,175,55,0.28)] flex items-center justify-center text-[var(--lale-gold)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[rgba(212,175,55,0.10)] transition-all"
              >
                <FiArrowRight className="rotate-180" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-full font-medium transition-all ${
                      currentPage === page
                        ? 'bg-[var(--lale-gold)] text-[var(--lale-emerald-deep)] shadow-lg'
                        : 'border border-[rgba(212,175,55,0.28)] text-[var(--lale-gold)] hover:bg-[rgba(212,175,55,0.10)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-full border border-[rgba(212,175,55,0.28)] flex items-center justify-center text-[var(--lale-gold)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[rgba(212,175,55,0.10)] transition-all"
              >
                <FiArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="lale-dark-section pb-24 px-5">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-[28px] lale-card-dark">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[rgba(212,175,55,0.08)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative grid lg:grid-cols-2 gap-8 p-8 sm:p-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[rgba(212,175,55,0.10)] rounded-xl text-[var(--lale-gold)] mb-6">
                <FiMail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[var(--lale-ivory)] mb-3">
                Bültenimize Abone Olun
              </h3>
              <p className="text-[rgba(251,250,246,0.68)] leading-relaxed text-sm sm:text-base">
                Size özel tekliflerden, yeni hizmetlerimizden ve güzellik ipuçlarından ilk siz haberdar olun.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubscription} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  required
                  className="w-full px-6 py-4 bg-[rgba(251,250,246,0.06)] border border-[rgba(212,175,55,0.18)] rounded-full focus:outline-none focus:border-[var(--lale-gold)] transition-all text-[var(--lale-ivory)] text-sm"
                  disabled={isSubscribing}
                />
              </div>
              <button 
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-[var(--lale-gold)] text-[var(--lale-emerald-deep)] py-4 rounded-full font-bold tracking-[0.15em] text-xs hover:bg-[var(--lale-gold-soft)] transition-all shadow-[0_15px_30px_rgba(212,175,55,0.12)] active:scale-[0.98]"
              >
                {isSubscribing ? 'KAYDEDİLİYOR...' : 'ŞİMDİ KAYDOL'}
              </button>
              
              {subscriptionMessage && (
                <p className={`text-center text-xs font-medium mt-1 ${
                  subscriptionStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscriptionMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
