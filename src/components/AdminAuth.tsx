'use client'
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { checkAuthState } from '@/store/slices/authSlice';

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const { loading, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isLoginPage) {
        // Not authenticated and not on login page, redirect to login
        router.replace('/admin/login');
      } else if (isAuthenticated && isLoginPage) {
        // Already authenticated and on login page, redirect to admin dashboard
        router.replace('/admin');
      }
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-[#f7f7f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e30613] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#68686d]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show children if authenticated or on login page
  if (isAuthenticated || isLoginPage) {
    return <>{children}</>;
  }

  // This should not be reached due to useEffect redirect, but just in case
  return null;
};

export default AdminAuth;
