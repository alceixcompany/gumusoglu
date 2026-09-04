'use client'
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

const Gallery = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);

        const categoriesSnapshot = await getDocs(collection(db, 'gallery_categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as GalleryCategory[];
        categoriesData.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(categoriesData);

        const itemsSnapshot = await getDocs(collection(db, 'gallery_items'));
        const itemsData = itemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as GalleryItem[];
        const activeItems = itemsData.filter((item) => item.isActive);
        activeItems.sort((a, b) => (a.order || 0) - (b.order || 0));
        setGalleryItems(activeItems.slice(0, 3));
      } catch (error) {
        console.error('Galeri verisi yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Kategori Yok';
  };

  if (loading) {
    return (
      <section className="lale-light-section py-20">
        <div className="mx-auto max-w-6xl px-4 pt-[10px]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--lale-gold)] border-t-transparent" />
            <p className="text-[var(--dream-text)]">Galeri yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  if (galleryItems.length === 0) {
    return null;
  }

  return (
    <section className="lale-light-section py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="mb-16 pt-[10px] text-center">
          <div className="lale-kicker mb-8">Galeri</div>

          <h2 className="font-serif text-3xl leading-tight text-[var(--dream-dark)] sm:text-4xl">
            Sunny Life atmosferinden
            <span className="block text-[var(--lale-gold)]">seçilmiş sıcak kareler</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--dream-text)] sm:text-base">
            Solaryum alanlarımızı, seans hazırlığını ve tamamlayıcı beauty ritüellerini keşfedin.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-[30px] border border-[rgba(223,167,69,0.16)] bg-white/[0.88] shadow-[0_20px_60px_rgba(95,89,108,0.10)] transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(95,89,108,0.16)]"
            >
              <div className="relative h-[340px] overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#f0dfc2,#e1ab49)]">
                    <span className="text-6xl text-white/80">✦</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(95,89,108,0.04),rgba(95,89,108,0.42))]" />
                <div className="absolute left-6 top-6 rounded-full border border-[rgba(223,167,69,0.24)] bg-white/[0.84] px-4 py-2 text-xs font-medium tracking-[0.14em] text-[var(--dream-dark)] backdrop-blur">
                  {getCategoryName(item.categoryId)}
                </div>
              </div>

              <div className="p-8">
                <h3 className="mb-3 font-serif text-xl text-[var(--dream-dark)] transition-colors duration-300 group-hover:text-[var(--lale-gold)]">
                  {item.title}
                </h3>

                {item.description && (
                  <div
                    className="line-clamp-2 text-sm leading-7 text-[var(--dream-text)]"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}

                <Link
                  href="/galeri"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--lale-gold)] transition-colors hover:text-[var(--lale-gold-soft)]"
                >
                  Detayları Görüntüle
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/galeri"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(95,89,108,0.18)] px-6 py-3 text-sm font-medium text-[var(--dream-dark)] transition-all duration-300 hover:bg-white/70"
          >
            Tüm Galeriyi Keşfedin
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
