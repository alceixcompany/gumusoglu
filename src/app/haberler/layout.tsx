import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teknoloji Rehberi',
  description: 'Telefon kullanımı, cihaz bakımı, batarya sağlığı ve teknik servis hakkında faydalı bilgiler.',
  alternates: { canonical: '/haberler' },
  openGraph: {
    title: 'Teknoloji Rehberi | Enes Teknoloji',
    description: 'Telefon ve teknik servis hakkında pratik bilgiler.',
    url: '/haberler',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function HaberlerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
