import type { Metadata } from 'next'
import AdminLayoutWrapper from './AdminLayoutWrapper'

export const metadata: Metadata = {
  title: { absolute: 'Yönetim Paneli | Gümüşoğlu Elektrik' },
  description: 'Gümüşoğlu Elektrik yönetim paneli.',
  robots: {
    index: false,
    follow: false,
  },
}

export default AdminLayoutWrapper
