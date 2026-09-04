import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Enes Teknoloji gizlilik politikası ve kişisel verilerin korunması hakkında bilgi edinin.',
  alternates: { canonical: '/gizlilik-politikasi' },
  openGraph: {
    title: 'Gizlilik Politikası | Enes Teknoloji',
    description: 'Enes Teknoloji kişisel verilerin korunması ve gizlilik politikası.',
    url: '/gizlilik-politikasi',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function GizlilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
