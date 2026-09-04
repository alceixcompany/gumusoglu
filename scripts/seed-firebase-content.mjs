import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const localEnv = Object.fromEntries(envText.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  return match ? [[match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, '')]] : [];
}));
const env = (key) => process.env[key] || localEnv[key];
const adminEmail = env('ADMIN_EMAIL');
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error('ADMIN_EMAIL ve ADMIN_PASSWORD gerekli. Şifre yalnızca komut ortamından verilmelidir.');
}

const app = initializeApp({
  apiKey: env('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: env('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('NEXT_PUBLIC_FIREBASE_APP_ID'),
});
const auth = getAuth(app);
const db = getFirestore(app);
const credential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
const now = new Date().toISOString();

await setDoc(doc(db, 'admins', credential.user.uid), {
  email: adminEmail,
  displayName: 'Gümüşoğlu Elektrik Yönetici',
  isAdmin: true,
  createdAt: now,
  createdBy: 'firebase-bootstrap',
}, { merge: true });

const categories = [
  ['teknik-uygulama', { name: 'Teknik Uygulama', description: 'Tesisat, pano ve saha uygulamaları', icon: 'tool', color: '#347bb7', order: 1 }],
  ['muhendislik', { name: 'Mühendislik', description: 'Plan, proje, keşif ve metraj', icon: 'drafting-compass', color: '#45a0a0', order: 2 }],
  ['magaza', { name: 'Mağaza', description: 'Elektrik malzemeleri ve ürün tedariği', icon: 'store', color: '#776eb4', order: 3 }],
];

const gallery = [
  ['pano-kontrol', { title: 'Pano kontrol ve devreye alma', description: 'Dağıtım panolarında bağlantı, koruma ve çalışma kontrollerini tamamlıyor, sistemi güvenle devreye alıyoruz.', categoryId: 'teknik-uygulama', categoryName: 'Teknik Uygulama', tag: 'Teknik Uygulama', imageUrl: '/gumusoglu/hero-gumusoglu-light-v3.webp', thumbnailUrl: '/gumusoglu/hero-gumusoglu-light-v3.webp', tags: ['pano', 'kontrol', 'devreye alma'], isFeatured: true, order: 1 }],
  ['proje-planlama', { title: 'Planlama ve projelendirme', description: 'Saha ihtiyaçlarını keşif, metraj ve teknik hesaplarla uygulanabilir bir elektrik projesine dönüştürüyoruz.', categoryId: 'muhendislik', categoryName: 'Mühendislik', tag: 'Mühendislik', imageUrl: '/gumusoglu/project-planning.webp', thumbnailUrl: '/gumusoglu/project-planning.webp', tags: ['proje', 'keşif', 'metraj'], isFeatured: true, order: 2 }],
  ['malzeme-tedarigi', { title: 'Elektrik malzemeleri', description: 'Konut, ticarethane ve sanayi için projeye uygun, güvenilir elektrik ürünlerini temin ediyoruz.', categoryId: 'magaza', categoryName: 'Mağaza', tag: 'Mağaza', imageUrl: '/gumusoglu/electrical-store.webp', thumbnailUrl: '/gumusoglu/electrical-store.webp', tags: ['malzeme', 'mağaza', 'tedarik'], isFeatured: true, order: 3 }],
  ['tesisat-uygulama', { title: 'Tesisat ve saha uygulaması', description: 'Elektrik altyapısını iş güvenliği ve güncel standartlara bağlı kalarak düzenli biçimde uyguluyoruz.', categoryId: 'teknik-uygulama', categoryName: 'Teknik Uygulama', tag: 'Uygulama', imageUrl: '/gumusoglu/service-installation-v1.webp', thumbnailUrl: '/gumusoglu/service-installation-v1.webp', tags: ['tesisat', 'saha', 'uygulama'], isFeatured: false, order: 4 }],
  ['urun-secimi', { title: 'Projeye uygun ürün seçimi', description: 'Kapasite, kullanım alanı ve güvenlik gereksinimlerine göre doğru ürün seçimi için destek veriyoruz.', categoryId: 'magaza', categoryName: 'Mağaza', tag: 'Malzeme', imageUrl: '/gumusoglu/service-materials-v1.webp', thumbnailUrl: '/gumusoglu/service-materials-v1.webp', tags: ['ürün', 'danışmanlık', 'güvenlik'], isFeatured: false, order: 5 }],
];

const posts = [
  ['elektrik-tesisatinda-guvenlik', { category: 'Güvenlik', readTime: '4 dk', title: 'Elektrik tesisatında güvenlik neden planlamayla başlar?', excerpt: 'Güvenli bir elektrik sistemi; keşif, doğru yük hesabı, uygun malzeme ve kontrollü uygulamanın birlikte yürütülmesiyle kurulur.', image: '/gumusoglu/hero-gumusoglu-light-v3.webp', publishedAt: '3 Eylül 2026', publishedDate: '2026-09-03', paragraphs: ['Elektrik tesisatında güvenliğin ilk adımı, yapının kullanım amacı ve ihtiyaç duyduğu gücün doğru belirlenmesidir. Eksik kapasite hesabı ilerleyen dönemde aşırı yüklenmeye ve kesintilere neden olabilir.', 'Kablo kesitinden koruma elemanlarına kadar her ürün, sistemin gerçek yüküne ve uygulama koşullarına uygun seçilmelidir. Standartlara uygun malzeme kullanımı tesisin hem güvenliğini hem kullanım ömrünü artırır.', 'Uygulama tamamlandıktan sonra yapılan test ve kontroller, görünmeyen bağlantı hatalarının erken belirlenmesini sağlar. Bu nedenle planlama, uygulama ve kontrol birbirinden ayrı düşünülmemelidir.'], tips: ['Yük hesabını doğru yaptırın', 'Belgeli ürün tercih edin', 'Teslim öncesi test isteyin'], featured: true }],
  ['elektrik-projesinde-kesif-metraj', { category: 'Proje', readTime: '5 dk', title: 'Elektrik projesinde keşif ve metrajın önemi', excerpt: 'Doğru keşif ve metraj, projenin maliyetini, süresini ve uygulanabilirliğini daha işe başlamadan netleştirir.', image: '/gumusoglu/project-planning.webp', publishedAt: '28 Ağustos 2026', publishedDate: '2026-08-28', paragraphs: ['Keşif çalışması uygulama alanının fiziksel koşullarını, kullanım beklentilerini ve teknik ihtiyaçlarını birlikte değerlendirmeyi sağlar. Hazırlanan proje ancak bu veriler doğru olduğunda sahaya uyumlu olur.', 'Metraj; kullanılacak kablo, pano, armatür ve diğer ekipmanların miktarını belirler. Doğru metraj gereksiz alımı azaltırken uygulama sırasında malzeme eksikliğinden doğan gecikmelerin önüne geçer.', 'İyi hazırlanmış keşif ve metraj dosyası tekliflerin doğru karşılaştırılmasını, iş programının gerçekçi kurulmasını ve bütçenin kontrol altında tutulmasını kolaylaştırır.'], tips: ['Saha keşfini atlamayın', 'Malzeme listesini netleştirin', 'İş programını projeyle eşleştirin'], featured: true }],
  ['elektrik-malzemesi-secerken', { category: 'Malzeme', readTime: '4 dk', title: 'Elektrik malzemesi seçerken nelere dikkat edilmeli?', excerpt: 'Fiyat kadar ürünün standardı, kullanım alanına uygunluğu ve uzun vadeli güvenilirliği de değerlendirilmelidir.', image: '/gumusoglu/electrical-store.webp', publishedAt: '20 Ağustos 2026', publishedDate: '2026-08-20', paragraphs: ['Elektrik malzemeleri doğrudan sistem güvenliğini etkiler. Bu nedenle ürün seçimi yalnızca fiyat karşılaştırmasına dayanmamalı; teknik değerler ve kullanılacağı ortam birlikte değerlendirilmelidir.', 'Nemli alan, dış ortam veya yüksek yük gibi koşullar ürünün koruma sınıfını ve kapasitesini değiştirir. Projeye uymayan bir ürün ilk anda çalışsa bile zaman içinde arıza ve güvenlik riski oluşturabilir.', 'Ürünlerin belgeli, güvenilir üreticilere ait ve uygulamayla uyumlu olması önemlidir. Satın almadan önce bir uzmandan destek almak yanlış ürün ve tekrar işçilik maliyetini azaltır.'], tips: ['Teknik değerleri kontrol edin', 'Kullanım alanını dikkate alın', 'Uzman görüşü alın'], featured: false }],
];

await Promise.all(categories.map(([id, data]) => setDoc(doc(db, 'gallery_categories', id), { ...data, isActive: true, createdAt: now }, { merge: true })));
await Promise.all(gallery.map(([id, data]) => setDoc(doc(db, 'gallery_items', id), { ...data, isActive: true, createdAt: now, updatedAt: now }, { merge: true })));
await Promise.all(posts.map(([slug, data]) => setDoc(doc(db, 'haberler', slug), { ...data, slug, description: data.excerpt, content: data.paragraphs.join('\n\n'), imageUrl: data.image, tags: [], author: 'Gümüşoğlu Elektrik', isActive: true, createdAt: data.publishedDate, updatedAt: now }, { merge: true })));

console.log(`Firebase hazırlandı: ${posts.length} blog yazısı, ${gallery.length} galeri öğesi.`);
