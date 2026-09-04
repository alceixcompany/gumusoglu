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
          <div className="fixed inset-0 bg-[#102a43]/60 backdrop-blur-sm" />
        )}
        
        {/* Mobile sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#102a43] shadow-[0_28px_80px_rgba(15,42,67,0.34)] transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
            <div><h1 className="text-base font-black tracking-[-.02em] text-white">Gümüşoğlu Elektrik</h1><p className="mt-1 text-[9px] font-bold uppercase tracking-[.2em] text-[#8fc9c6]">Yönetim paneli</p></div>
            <button
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Admin Info - Mobile */}
          {user && (
            <div className="mx-4 mt-5 rounded-2xl border border-white/10 bg-white/[.06] p-3">
              <div className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#347bb7]">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="max-w-[175px] truncate text-sm font-bold text-white">
                    {user.displayName || user.email}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/50">
                    {user.isStaticAdmin ? 'Sunucu Yöneticisi' : 'Firebase Yöneticisi'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="mt-6 px-4">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-white/35">Menü</p>
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                      pathname === item.href
                        ? 'bg-[#347bb7] text-white shadow-[0_10px_24px_rgba(52,123,183,.3)]'
                        : 'text-white/65 hover:bg-white/[.07] hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Logout button */}
            <div className="mt-8 border-t border-white/10 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-300 transition-colors hover:bg-rose-400/10"
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
        <div className="flex h-screen w-72 flex-col border-r border-[#153957] bg-[#102a43] shadow-[16px_0_40px_rgba(23,59,89,.08)]">
          <div className="flex h-24 items-center border-b border-white/10 px-7">
            <div><h1 className="text-lg font-black tracking-[-.025em] text-white">Gümüşoğlu Elektrik</h1><p className="mt-1.5 text-[9px] font-bold uppercase tracking-[.22em] text-[#8fc9c6]">Yönetim paneli</p></div>
          </div>
          
          {/* Admin Info - Desktop */}
          {user && (
            <div className="mx-5 mt-6 rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#347bb7] shadow-[0_8px_20px_rgba(52,123,183,.3)]">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="max-w-[170px] truncate text-sm font-bold text-white">
                    {user.displayName || user.email}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/50">
                    {user.isStaticAdmin ? 'Sunucu Yöneticisi' : 'Firebase Yöneticisi'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="mt-7 flex flex-1 flex-col px-5">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.2em] text-white/35">Menü</p>
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
                      pathname === item.href
                        ? 'bg-[#347bb7] text-white shadow-[0_10px_24px_rgba(52,123,183,.3)]'
                        : 'text-white/65 hover:bg-white/[.07] hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Logout button */}
            <div className="mt-auto border-t border-white/10 pb-6 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-300 transition-colors hover:bg-rose-400/10"
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
          className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-[#102a43] p-2.5 shadow-[0_18px_48px_rgba(15,42,67,.24)]"
        >
          <FiMenu className="h-5 w-5 text-white" />
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;
