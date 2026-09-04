'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
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

const HaberDetay = () => {
  const params = useParams();
  const router = useRouter();
  const haberSlug = params.slug as string; // Artık slug
  const [haber, setHaber] = useState<Haber | null>(null);
  const [relatedHaberler, setRelatedHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Slug oluşturma fonksiyonu
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

  useEffect(() => {
    const fetchHaber = async () => {
      try {
        setLoading(true);
        
        // Fetch all news to find by slug
        const allNewsSnapshot = await getDocs(collection(db, 'haberler'));
        const allNews = allNewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Haber[];
        
        // Find news by matching slug
        const foundHaber = allNews.find(h => {
          const newsSlug = createSlug(h.title);
          return newsSlug === haberSlug && h.isActive;
        });
        
        if (foundHaber) {
          setHaber(foundHaber);
          
          // Fetch related news (same tags, current news excluded)
          const activeNews = allNews.filter(h => h.isActive && h.id !== foundHaber.id);
          const related = activeNews
            .filter(h => h.tags && foundHaber.tags && 
              h.tags.some(tag => foundHaber.tags.includes(tag)))
            .slice(0, 3);
          
          setRelatedHaberler(related);
        } else {
          // News not found
          router.push('/haberler');
        }
      } catch (error) {
        console.error('Haber verisi yüklenirken hata:', error);
        router.push('/haberler');
      } finally {
        setLoading(false);
      }
    };

    if (haberSlug) {
      fetchHaber();
    }
  }, [haberSlug, router]);

  // Sosyal medya paylaşım fonksiyonları
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = haber?.title || '';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const text = `${haber?.title || ''} ${window.location.href}`;
    const url = `https://wa.me/905312899969/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    } catch (err) {
      console.error('Link kopyalanamadı:', err);
    }
  };

  // Haber bulunamadıysa 404
  if (!haber && !loading) {
    return (
      <div className="lale-dark-section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--lale-ivory)] mb-4">Haber Bulunamadı</h1>
          <p className="text-[rgba(251,250,246,0.68)] mb-8">Aradığınız haber mevcut değil.</p>
          <Link 
            href="/haberler"
            className="lale-gold-button"
          >
            Haberlere Dön
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lale-dark-section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--lale-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[rgba(251,250,246,0.68)]">Haber yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-flow min-h-screen bg-[var(--lale-emerald-deep)]">
      <PageHero
        eyebrow="Blog Yazısı"
        title={<>{haber?.title}</>}
        description={haber?.subtitle || 'Sunny Life Solarium & Beauty editöryel notları ve bakım dünyasından güncel içerikler.'}
        image={haber?.imageUrl || '/banner/sunnylife-solarium-studio.webp'}
        imageAlt="Sunny Life Solarium & Beauty haber detayı"
        heightClassName="min-h-[320px] py-16 sm:min-h-[380px] sm:py-20"
      />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-[rgba(212,175,55,0.12)] bg-[rgba(6,35,31,0.92)]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[rgba(251,250,246,0.52)] hover:text-[var(--lale-gold)] transition-colors">
              Ana Sayfa
            </Link>
            <span className="text-[rgba(251,250,246,0.32)]">/</span>
            <Link href="/haberler" className="text-[rgba(251,250,246,0.52)] hover:text-[var(--lale-gold)] transition-colors">
              Haberler
            </Link>
            <span className="text-[rgba(251,250,246,0.32)]">/</span>
            <span className="text-[var(--lale-ivory)] font-semibold truncate max-w-xs">
              {haber?.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-12">
          {/* Featured Badge */}
          {haber?.featured && (
            <div className="mb-6">
              <span className="inline-block bg-[var(--lale-gold)] text-[var(--lale-emerald-deep)] px-4 py-2 rounded-full text-sm font-medium">
                ⭐ Öne Çıkan Haber
              </span>
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--lale-gold)] mb-6 leading-tight">
            {haber?.title}
          </h1>

          {/* Subtitle */}
          {haber?.subtitle && (
            <p className="text-lg md:text-xl text-[var(--lale-gold)] opacity-70 mb-6 leading-relaxed max-w-3xl">
              {haber.subtitle}
            </p>
          )}

          {/* Description */}
          <div 
            className="text-lg text-[var(--lale-gold)] opacity-70 mb-8 leading-relaxed max-w-3xl prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: haber?.description || '' }}
          />

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--lale-gold)] opacity-60 mb-8">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(haber?.createdAt || '').toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sıra: {haber?.order}</span>
            </div>
            {haber?.tags && haber.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{haber.tags.length} etiket</span>
              </div>
            )}
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-[rgba(251,250,246,0.68)]">Paylaş:</span>
            <button
              onClick={shareOnFacebook}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              title="Facebook'ta Paylaş"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button
              onClick={shareOnTwitter}
              className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors"
              title="Twitter'da Paylaş"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              title="WhatsApp'ta Paylaş"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
              </svg>
            </button>
            <button
              onClick={copyLink}
              className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              title="Linki Kopyala"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {haber?.imageUrl && (
          <div className="mb-12">
            <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
              <Image 
                src={haber.imageUrl} 
                alt={haber.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="mb-16">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-[var(--lale-gold)] prose-headings:opacity-90 prose-p:text-[var(--lale-gold)] prose-p:opacity-75 prose-li:text-[var(--lale-gold)] prose-li:opacity-75 prose-strong:text-[var(--lale-gold)] prose-strong:opacity-100 prose-a:text-[var(--lale-gold)] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: haber?.content || '' }}
            />
          </div>
        </article>

        {/* Article Footer */}
        <footer className="border-t border-[rgba(212,175,55,0.12)] pt-8 mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {haber?.tags && haber.tags.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--lale-gold)] opacity-60">Etiketler:</span>
                <div className="flex flex-wrap gap-2">
                  {haber.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-[rgba(212,175,55,0.10)] text-[var(--lale-gold)] text-sm rounded-full border border-[rgba(212,175,55,0.18)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--lale-gold)] opacity-60">Oluşturulma:</span>
              <span className="text-sm font-medium text-[var(--lale-gold)] opacity-85">
                {new Date(haber?.createdAt || '').toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </footer>

        {/* Divider */}
        <div className="border-t border-[rgba(212,175,55,0.12)] my-16"></div>

        {/* Related Articles */}
        {relatedHaberler.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-[var(--lale-gold)] rounded-full"></div>
              <h3 className="text-2xl font-bold text-[var(--lale-ivory)]">
                İlgili Haberler
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedHaberler.map((relatedHaber) => (
                <Link 
                  key={relatedHaber.id}
                  href={`/haberler/${createSlug(relatedHaber.title)}`}
                  className="group block"
                >
                  <article className="lale-card-dark rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-[rgba(212,175,55,0.28)]">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {relatedHaber.imageUrl ? (
                        <Image 
                          src={relatedHaber.imageUrl}
                          alt={relatedHaber.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-4xl text-gray-400">📰</span>
                        </div>
                      )}
                      {relatedHaber.featured && (
                        <div className="absolute top-4 left-4 bg-[var(--lale-gold)] text-[var(--lale-emerald-deep)] text-xs font-medium px-2 py-1 rounded-full">
                          ⭐ Öne Çıkan
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-[rgba(251,250,246,0.52)] mb-3">
                        <span>{new Date(relatedHaber.createdAt).toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <span>Sıra: {relatedHaber.order}</span>
                      </div>
                      <h4 className="font-semibold text-[var(--lale-ivory)] mb-2 group-hover:text-[var(--lale-gold)] transition-colors line-clamp-2">
                        {relatedHaber.title}
                      </h4>
                      {relatedHaber.subtitle && (
                        <p className="text-sm text-[rgba(251,250,246,0.66)] mb-2 font-medium">{relatedHaber.subtitle}</p>
                      )}
                      <p className="text-[rgba(251,250,246,0.66)] text-sm line-clamp-3">
                        {relatedHaber.description}
                      </p>
                      
                      {/* Tags */}
                      {relatedHaber.tags && relatedHaber.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {relatedHaber.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-[rgba(212,175,55,0.10)] text-[var(--lale-gold)] text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to News */}
        <div className="text-center">
          <Link 
            href="/haberler"
            className="inline-flex items-center gap-2 text-[var(--lale-gold)] opacity-70 hover:opacity-100 font-medium transition-all group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tüm Haberlere Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HaberDetay;
