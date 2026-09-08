'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutContentProps {
  children: React.ReactNode;
}

const AdminLayoutContent: React.FC<AdminLayoutContentProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="admin-theme min-h-screen">{children}</div>;
  }

  return (
    <div className="admin-theme flex h-screen bg-[#f7f7f7] text-[#202022]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutContent;
