'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import PageHero from '@/components/PageHero';

interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

const ServiceAreasPage = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch service areas from Firestore
        const areasSnapshot = await getDocs(collection(db, 'hizmet_bolgeleri'));
        const areasData = areasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ServiceArea[];
        
        // Filter active areas and sort by order
        const activeAreas = areasData.filter(area => area.isActive);
        activeAreas.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setServiceAreas(activeAreas);

        // Fetch gallery items from Firestore and get last 3
        try {
          const gallerySnapshot = await getDocs(collection(db, 'gallery_items'));
          const galleryData = gallerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryItem[];
          
          // Filter active items and get last 3
          const activeItems = galleryData.filter(item => item.isActive);
          
          // Sort by creation date (newest first) and get last 3
          const sortedItems = activeItems.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          // Get last 3 items (most recent)
          setGalleryItems(sortedItems.slice(-3));
        } catch (galleryError) {
          console.error('Galeri verisi yüklenirken hata:', galleryError);
          // Continue without gallery data
          setGalleryItems([]);
        }
        
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError('Veri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="lale-dark-section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--lale-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[rgba(251,250,246,0.72)]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lale-dark-section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-[var(--lale-ivory)] mb-2">Hata Oluştu</h3>
          <p className="text-[rgba(251,250,246,0.68)] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="lale-gold-button"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-flow min-h-screen bg-[var(--lale-emerald-deep)]">
      <PageHero
        eyebrow="Hizmet Alanlarımız"
        title={<>Hizmet<br />bölgelerimiz</>}
        description="İstanbul’un farklı bölgelerinde güzellik ve bakım hizmetlerimizi sizinle daha güçlü bir deneyim standardıyla buluşturuyoruz."
        image="/banner/sunnylife-solarium-hero.webp"
        imageAlt="Sunny Life Solarium & Beauty hizmet bölgeleri"
        align="center"
      />

      <section className="lale-dark-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--lale-gold)] mb-4">
              Hizmet Verdiğimiz Bölgeler
            </h2>
            <p className="text-lg text-[var(--lale-gold)] opacity-70 max-w-2xl mx-auto">
              Size en yakın hizmet alanlarını inceleyin ve uygun randevu planlaması için bizimle iletişime geçin.
            </p>
          </div>

          {serviceAreas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-[var(--lale-ivory)] mb-2">Henüz Hizmet Bölgesi Eklenmemiş</h3>
              <p className="text-[rgba(251,250,246,0.68)]">Admin panelinden hizmet bölgeleri ekleyebilirsiniz.</p>
              
              {/* Debug Info */}
              <div className="mt-6 p-4 bg-[rgba(251,250,246,0.06)] rounded-lg text-left max-w-2xl mx-auto border border-[rgba(212,175,55,0.14)]">
                <h4 className="font-semibold text-[var(--lale-gold)] mb-2">Debug Bilgisi:</h4>
                <p className="text-sm text-[rgba(251,250,246,0.68)]">Loading: {loading.toString()}</p>
                <p className="text-sm text-[rgba(251,250,246,0.68)]">Service Areas Count: {serviceAreas.length}</p>
                <p className="text-sm text-[rgba(251,250,246,0.68)]">Error: {error || 'None'}</p>
                
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceAreas.map((area) => (
                <Link
                  key={area.id}
                  href={`/hizmet-bolgelerimiz/${area.slug}`}
                  className="group lale-card-dark rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={area.imageUrl || '/img/sayfa1.jpg'}
                      alt={area.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--lale-ivory)] mb-2 group-hover:text-[var(--lale-gold)] transition-colors duration-300">
                      {area.name}
                    </h3>
                    <p className="text-[rgba(251,250,246,0.68)] text-sm leading-relaxed">
                      {area.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-[var(--lale-gold)] font-medium text-sm">
                      Detayları Gör
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="lale-dark-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--lale-gold)] mb-4">
              Çalışmalarımızdan Örnekler
            </h2>
            <p className="text-lg text-[var(--lale-gold)] opacity-70 max-w-2xl mx-auto">
              Hizmet verdiğimiz bölgelerdeki bakım deneyimlerinden seçilen kareler
            </p>
          </div>

          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {galleryItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="group lale-card-dark rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-square bg-[rgba(251,250,246,0.06)] relative overflow-hidden max-w-xs mx-auto">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-gray-300">🖼️</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay - Sadece göz simgesi */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-[rgba(6,35,31,0.82)] rounded-full p-3 cursor-pointer transform scale-90 group-hover:scale-100 transition-transform duration-200 shadow-lg border border-[rgba(212,175,55,0.18)]">
                        <svg className="w-6 h-6 text-[var(--lale-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold text-[var(--lale-ivory)] mb-2">Henüz Galeri Resmi Eklenmemiş</h3>
              <p className="text-[rgba(251,250,246,0.68)]">Admin panelinden galeri resimleri ekleyebilirsiniz.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/galeri"
              className="lale-gold-button gap-2"
            >
              Tüm Galeriyi Gör
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="lale-dark-section py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--lale-gold)] mb-6">
            Size En Yakın Randevu Noktasını Mı Arıyorsunuz?
          </h2>
          <p className="text-xl text-[var(--lale-gold)] opacity-75 mb-8">
            Ekibimizle iletişime geçin, size uygun hizmet bölgesini ve randevu saatini birlikte planlayalım.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+905312899969"
              className="lale-gold-button gap-2"
            >
              📞 Hemen Ara
            </a>
            <a
              href="https://wa.me/905312899969/"
              target="_blank"
              rel="noopener noreferrer"
              className="lale-outline-button gap-2"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceAreasPage;
