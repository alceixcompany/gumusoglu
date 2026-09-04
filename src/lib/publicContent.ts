import { blogPosts, type BlogPost } from '@/data/blogPosts';

export type GalleryContent = {
  id: string;
  src: string;
  title: string;
  tag: string;
  description: string;
  order: number;
  featured: boolean;
};

const fallbackGallery: GalleryContent[] = [
  { id: 'pano-kontrol', src: '/gumusoglu/hero-gumusoglu-light-v3.webp', title: 'Pano kontrol ve devreye alma', tag: 'Teknik Uygulama', description: 'Dağıtım panolarında bağlantı, koruma ve çalışma kontrolleri.', order: 1, featured: true },
  { id: 'proje-planlama', src: '/gumusoglu/project-planning.webp', title: 'Planlama ve projelendirme', tag: 'Mühendislik', description: 'İhtiyaca uygun keşif, metraj ve elektrik proje hazırlığı.', order: 2, featured: true },
  { id: 'malzeme-tedarigi', src: '/gumusoglu/electrical-store.webp', title: 'Elektrik malzemeleri', tag: 'Mağaza', description: 'Konut, ticarethane ve sanayi için güvenilir ürün tedariği.', order: 3, featured: true },
  { id: 'tesisat-uygulama', src: '/gumusoglu/service-installation-v1.webp', title: 'Tesisat ve saha uygulaması', tag: 'Uygulama', description: 'Standartlara uygun, düzenli ve güvenli saha uygulamaları.', order: 4, featured: false },
  { id: 'malzeme-secimi', src: '/gumusoglu/service-materials-v1.webp', title: 'Projeye uygun ürün seçimi', tag: 'Malzeme', description: 'Doğru kapasite ve kullanım alanına göre ürün danışmanlığı.', order: 5, featured: false },
];

type FirestoreValue = {
  stringValue?: string;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  nullValue?: null;
};

const unpack = (value?: FirestoreValue): unknown => {
  if (!value) return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) return (value.arrayValue?.values ?? []).map(unpack);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue?.fields ?? {}).map(([key, item]) => [key, unpack(item)]));
  return null;
};

const readCollection = async (collectionId: string): Promise<Array<Record<string, unknown> & { id: string }>> => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return [];

  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: { fieldFilter: { field: { fieldPath: 'isActive' }, op: 'EQUAL', value: { booleanValue: true } } },
      },
    }),
    next: { revalidate: 60 },
  });

  if (!response.ok) throw new Error(`Firestore ${collectionId} sorgusu başarısız: ${response.status}`);
  const rows = await response.json() as Array<{ document?: { name: string; fields?: Record<string, FirestoreValue> } }>;
  return rows.flatMap(({ document }) => {
    if (!document) return [];
    const data = Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, value]) => [key, unpack(value)])) as Record<string, unknown>;
    return [{ id: document.name.split('/').pop() ?? '', ...data }];
  });
};

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const items = await readCollection('haberler');
    if (!items.length) return blogPosts;
    return items.map((item) => ({
      slug: String(item.slug || item.id),
      category: String(item.category || 'Bilgi'),
      readTime: String(item.readTime || '4 dk'),
      title: String(item.title || ''),
      excerpt: String(item.excerpt || item.description || ''),
      image: String(item.image || item.imageUrl || '/gumusoglu/project-planning.webp'),
      publishedAt: String(item.publishedAt || ''),
      publishedDate: String(item.publishedDate || item.createdAt || ''),
      paragraphs: Array.isArray(item.paragraphs) ? item.paragraphs.map(String) : [String(item.content || item.description || '')],
      tips: Array.isArray(item.tips) ? item.tips.map(String) : [],
    })).filter((item) => item.title).sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
  } catch {
    return blogPosts;
  }
}

export async function getPublishedPost(slug: string) {
  return (await getPublishedPosts()).find((post) => post.slug === slug);
}

export async function getPublishedGallery(): Promise<GalleryContent[]> {
  try {
    const items = await readCollection('gallery_items');
    if (!items.length) return fallbackGallery;
    return items.map((item) => ({
      id: String(item.id),
      src: String(item.imageUrl || item.src || '/gumusoglu/hero-gumusoglu-light-v3.webp'),
      title: String(item.title || 'Gümüşoğlu Elektrik'),
      tag: String(item.tag || item.categoryName || item.categoryId || 'Uygulama'),
      description: String(item.description || ''),
      order: Number(item.order || 0),
      featured: Boolean(item.isFeatured),
    })).sort((a, b) => a.order - b.order);
  } catch {
    return fallbackGallery;
  }
}
