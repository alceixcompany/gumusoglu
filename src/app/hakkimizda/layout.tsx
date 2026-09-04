import type { Metadata } from 'next';
import { AssuranceList, ImageCta, PrinciplesBand, TrustBand } from '@/components/PageExtras';
export const metadata:Metadata={title:'Hakkımızda',description:'1974’ten bugüne Gümüşoğlu Elektrik’in hikâyesi, misyonu ve vizyonu.',alternates:{canonical:'/hakkimizda'}};
export default function Layout({children}:{children:React.ReactNode}){return <>{children}<TrustBand/><AssuranceList/><PrinciplesBand/><ImageCta eyebrow="Yarım asırlık güven" title="Geleceğin projelerine birlikte ışık tutalım." text="1974’ten gelen tecrübemizle projenizin her aşamasında güvenilir çözüm ortağınız olalım." image="/gumusoglu/service-installation-v1.webp"/></>}
