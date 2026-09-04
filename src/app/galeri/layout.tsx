import type { Metadata } from 'next';
import { AssuranceList, ImageCta, TrustBand } from '@/components/PageExtras';
export const metadata:Metadata={title:'Galeri',description:'Gümüşoğlu Elektrik çalışma alanları ve proje görselleri.',alternates:{canonical:'/galeri'}};
export default function Layout({children}:{children:React.ReactNode}){return <>{children}<TrustBand/><AssuranceList/><ImageCta eyebrow="Sıradaki proje" title="Bir sonraki karede sizin projeniz olsun." text="Keşif ve ön değerlendirme için ekibimizle iletişime geçin." image="/gumusoglu/hero-gumusoglu-light-v3.webp"/></>}
