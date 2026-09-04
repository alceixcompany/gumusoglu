'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  FiBarChart, 
  FiImage, 
  FiFileText, 
  FiMessageSquare, 
  FiSettings, 
  FiLogOut,
  FiX,
  FiMenu,
  FiUser
} from 'react-icons/fi';

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiBarChart },
    { name: 'Galeri', href: '/admin/galeri', icon: FiImage },
    { name: 'Haberler', href: '/admin/haberler', icon: FiFileText },
    { name: 'Mesajlar', href: '/admin/mesajlar', icon: FiMessageSquare },
    { name: 'Ayarlar', href: '/admin/ayarlar', icon: FiSettings },
  ];

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div className="relative z-40 lg:hidden">
        {isMobileOpen && (
          <div className="fixed inset-0 bg-[rgba(21,20,18,0.82)] backdrop-blur-sm" />
        )}
        
        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[rgba(212,175,55,0.18)] bg-[rgba(21,20,18,0.94)] shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between h-16 px-4 border-b border-[rgba(212,175,55,0.18)]">
            <h1 className="text-xl font-bold text-[var(--lale-ivory)]">Gümüşoğlu Elektrik</h1>
            <button
              onClick={toggleMobileMenu}
              className="text-[rgba(251,250,246,0.62)] hover:text-[var(--lale-gold)]"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Admin Info - Mobile */}
          {user && (
            <div className="mx-4 mt-4 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.10)] p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--lale-ivory)]">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-xs text-[rgba(251,250,246,0.60)]">
                    {user.isStaticAdmin ? 'Sunucu Yöneticisi' : 'Firebase Yöneticisi'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="mt-6 px-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      pathname === item.href
                        ? 'border border-[rgba(212,175,55,0.26)] bg-[rgba(212,175,55,0.10)] text-[var(--lale-gold)]'
                        : 'text-[rgba(251,250,246,0.68)] hover:bg-[rgba(251,250,246,0.05)]'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Logout button */}
            <div className="mt-8 pt-4 border-t border-[rgba(212,175,55,0.18)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-[rgba(239,68,68,0.10)] rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Çıkış Yap</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 border-r border-[rgba(212,175,55,0.18)] bg-[rgba(21,20,18,0.94)] shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur">
          <div className="flex items-center justify-center h-16 px-4 border-b border-[rgba(212,175,55,0.18)]">
            <h1 className="text-xl font-bold text-[var(--lale-ivory)]">Gümüşoğlu Elektrik</h1>
          </div>
          
          {/* Admin Info - Desktop */}
          {user && (
            <div className="mx-4 mt-4 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.10)] p-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--lale-ivory)]">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-xs text-[rgba(251,250,246,0.60)]">
                    {user.isStaticAdmin ? 'Sunucu Yöneticisi' : 'Firebase Yöneticisi'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="mt-6 px-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      pathname === item.href
                        ? 'border border-[rgba(212,175,55,0.26)] bg-[rgba(212,175,55,0.10)] text-[var(--lale-gold)]'
                        : 'text-[rgba(251,250,246,0.68)] hover:bg-[rgba(251,250,246,0.05)]'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Logout button */}
            <div className="mt-8 pt-4 border-t border-[rgba(212,175,55,0.18)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-[rgba(239,68,68,0.10)] rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Çıkış Yap</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden mobile-menu-container">
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 rounded-xl border border-[rgba(212,175,55,0.22)] bg-[rgba(21,20,18,0.9)] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur"
        >
          <FiMenu className="w-6 h-6 text-[var(--lale-gold)]" />
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;
