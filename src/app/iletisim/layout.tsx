import type { Metadata } from 'next';
import { AssuranceList, PrinciplesBand, TrustBand } from '@/components/PageExtras';
export const metadata:Metadata={title:'İletişim',description:'Gümüşoğlu Elektrik telefon, e-posta, WhatsApp ve adres bilgileri.',alternates:{canonical:'/iletisim'}};
export default function Layout({children}:{children:React.ReactNode}){return <>{children}<TrustBand/><AssuranceList/><PrinciplesBand/></>}
