'use client'
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import AdminAuth from '@/components/AdminAuth'
import AdminLayoutContent from '@/components/AdminLayoutContent'

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Eğer localStorage'dan kullanıcı yüklendiyse ve admin sayfasındaysa, 
    // login sayfasına yönlendirme yapma
    if (isAuthenticated && user) {
      // Kullanıcı zaten giriş yapmış, admin panelinde kalabilir
      return;
    }
  }, [isAuthenticated, user]);

  return (
    <AdminAuth>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuth>
  );
};

export default AdminLayoutWrapper;
