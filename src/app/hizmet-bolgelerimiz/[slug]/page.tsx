'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
  maps?: Array<{
    id: string;
    url: string;
    title: string;
  }>;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

const ServiceAreaDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [serviceArea, setServiceArea] = useState<ServiceArea | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceArea = async () => {
      try {
        // Fetch service area by slug
        const q = query(
          collection(db, 'hizmet_bolgeleri'),
          where('slug', '==', slug),
          where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const areaData = { id: doc.id, ...doc.data() } as ServiceArea;
          
          
          setServiceArea(areaData);
          
          // Fetch some gallery images for this area
          const galleryQuery = query(
            collection(db, 'galeri'),
            where('isActive', '==', true),
            limit(6)
          );
          const gallerySnapshot = await getDocs(galleryQuery);
          const images = gallerySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as GalleryImage[];
          setGalleryImages(images);
        }
      } catch (error) {
        console.error('Error fetching service area:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchServiceArea();
    }
  }, [slug]);

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

  if (!serviceArea) {
    return (
      <div className="lale-dark-section min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-[var(--lale-gold)] mb-2">Hizmet Bölgesi Bulunamadı</h1>
          <p className="text-[var(--lale-gold)] opacity-70">Aradığınız hizmet bölgesi mevcut değil veya aktif değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-flow min-h-screen bg-[var(--lale-emerald-deep)]">
      <PageHero
        eyebrow="Hizmet Bölgesi"
        title={<>{serviceArea.name}</>}
        description={serviceArea.description}
        image={serviceArea.imageUrl || '/img/sayfa1.jpg'}
        imageAlt={serviceArea.name}
        align="center"
      />

      <section className="lale-dark-section py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-[var(--lale-gold)] opacity-75 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: serviceArea.content }}
            />
          </div>
          
          {/* Maps Section - İçeriğin altında */}
          {serviceArea.maps && serviceArea.maps.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--lale-gold)] mb-4">
                  {serviceArea.name} Bölgesi Konumu
                </h2>
                <p className="text-lg text-[var(--lale-gold)] opacity-70">
                  Hizmet verdiğimiz bölgenin detaylı haritası
                </p>
              </div>

              <div className={`grid gap-6 ${
                serviceArea.maps?.length === 1 
                  ? 'grid-cols-1' 
                  : serviceArea.maps?.length === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {serviceArea.maps?.map((map) => (
                  <div key={map.id} className="lale-card-dark rounded-xl shadow-lg overflow-hidden border">
                    <div className="p-4">
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <iframe
                          src={map.url}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={map.title}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section className="lale-dark-section py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--lale-gold)] mb-4">
                {serviceArea.name} Bölgesi Çalışmalarımızdan
              </h2>
              <p className="text-lg text-[var(--lale-gold)] opacity-70">
                Bu bölgede gerçekleştirdiğimiz projelerden örnekler
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group cursor-pointer overflow-hidden rounded-xl lale-card-dark hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="lale-dark-section py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--lale-gold)] mb-6">
            {serviceArea.name} Bölgesinde Hizmet mi Arıyorsunuz?
          </h2>
          <p className="text-xl text-[var(--lale-gold)] opacity-75 mb-8">
            Hemen arayın, en kısa sürede yanınızdayız!
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

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Gallery Image"
              width={800}
              height={600}
              className="object-contain max-h-full"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreaDetailPage;
