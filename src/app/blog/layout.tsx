import type { Metadata } from 'next';
import { AssuranceList, ImageCta, TrustBand } from '@/components/PageExtras';
export const metadata:Metadata={title:'Blog',description:'Elektrik güvenliği, tesisat ve proje süreçleri hakkında faydalı bilgiler.',alternates:{canonical:'/blog'}};
export default function Layout({children}:{children:React.ReactNode}){return <>{children}<TrustBand/><AssuranceList/><ImageCta eyebrow="Uzman desteği" title="Bilginin yanında doğru uygulama da gerekir." text="Elektrik tesisatınız, projeniz veya malzeme seçiminiz için doğrudan uzman ekibimize danışın." image="/gumusoglu/service-materials-v1.webp" label="Hizmetleri inceleyin" href="/hizmetlerimiz"/></>}
