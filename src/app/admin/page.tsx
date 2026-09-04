'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { 
  FiImage, 
  FiFileText, 
  FiFolder, 
  FiMessageSquare, 
  FiPlus,
  FiRefreshCw,
  FiTrendingUp,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import CreateAdminModal from '@/components/CreateAdminModal';
import { useAppSelector } from '@/store/hooks';

interface DashboardStats {
  totalGalleryItems: number;
  totalCategories: number;
  totalNews: number;
  totalMessages: number;
  callCounter: number;
  activeNews: number;
  featuredNews: number;
  activeCategories: number;
  featuredGalleryItems: number;
}

interface RecentActivity {
  id: string;
  type: 'news' | 'gallery' | 'message' | 'category';
  title: string;
  description: string;
  timestamp: Timestamp;
  action: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Timestamp;
}

interface GalleryCategory {
  id: string;
  name: string;
  isActive: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  isActive: boolean;
  featured: boolean;
  createdAt: Timestamp;
}

interface ContactMessage {
  id: string;
  name: string;
  message: string;
  status: string;
  createdAt: Timestamp;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGalleryItems: 0,
    totalCategories: 0,
    totalNews: 0,
    totalMessages: 0,
    callCounter: 0,
    activeNews: 0,
    featuredNews: 0,
    activeCategories: 0,
    featuredGalleryItems: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Call counter'ı Redux'tan al
  useEffect(() => {
    const fetchCallCounter = async () => {
      try {
        const counterSnapshot = await getDocs(collection(db, 'call_counter'));
        if (!counterSnapshot.empty) {
          const currentCount = counterSnapshot.docs[0].data().count || 0;
          setStats(prev => ({ ...prev, callCounter: currentCount }));
        }
      } catch (error) {
        console.error('Call counter fetch error:', error);
      }
    };

    fetchCallCounter();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all collections
      const [galleryItemsSnapshot, categoriesSnapshot, newsSnapshot, messagesSnapshot, callCounterSnapshot] = await Promise.all([
        getDocs(collection(db, 'gallery_items')),
        getDocs(collection(db, 'gallery_categories')),
        getDocs(collection(db, 'haberler')),
        getDocs(collection(db, 'contact_messages')),
        getDocs(collection(db, 'call_counter'))
      ]);

      // Process gallery items
      const galleryItems = galleryItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryItem[];
      
      // Process categories
      const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryCategory[];
      
      // Process news
      const news = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsItem[];
      
      // Process messages
      const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactMessage[];
      
      // Process call counter
      const callCounter = callCounterSnapshot.empty ? 0 : callCounterSnapshot.docs[0].data().count || 0;

      // Calculate stats
      const newStats: DashboardStats = {
        totalGalleryItems: galleryItems.length,
        totalCategories: categories.length,
        totalNews: news.length,
        totalMessages: messages.length,
        callCounter: callCounter,
        activeNews: news.filter(item => item.isActive).length,
        featuredNews: news.filter(item => item.featured).length,
        activeCategories: categories.filter(item => item.isActive).length,
        featuredGalleryItems: galleryItems.filter(item => item.isFeatured).length
      };

      setStats(newStats);

      // Generate recent activities
      const activities: RecentActivity[] = [];
      
      // Helper function to safely get timestamp
      const getTimestamp = (timestamp: unknown): number => {
        if (!timestamp) return 0;
        if (typeof (timestamp as { toDate?: () => Date }).toDate === 'function') {
          return (timestamp as { toDate: () => Date }).toDate().getTime();
        }
        if (timestamp instanceof Date) {
          return timestamp.getTime();
        }
        if (typeof timestamp === 'string' || typeof timestamp === 'number') {
          return new Date(timestamp).getTime();
        }
        return 0;
      };
      
      // Add recent news
      const recentNews = news
        .filter(item => item.isActive && item.createdAt)
        .sort((a, b) => {
          const aTime = getTimestamp(a.createdAt);
          const bTime = getTimestamp(b.createdAt);
          return bTime - aTime;
        })
        .slice(0, 3);
      
      recentNews.forEach(item => {
        if (item.createdAt) {
          activities.push({
            id: item.id,
            type: 'news',
            title: item.title,
            description: item.subtitle || item.description,
            timestamp: item.createdAt,
            action: 'Yeni haber eklendi'
          });
        }
      });

      // Add recent gallery items
      const recentGalleryItems = galleryItems
        .filter(item => item.isActive && item.createdAt)
        .sort((a, b) => {
          const aTime = getTimestamp(a.createdAt);
          const bTime = getTimestamp(b.createdAt);
          return bTime - aTime;
        })
        .slice(0, 2);
      
      recentGalleryItems.forEach(item => {
        if (item.createdAt) {
          activities.push({
            id: item.id,
            type: 'gallery',
            title: item.title,
            description: item.description,
            timestamp: item.createdAt,
            action: 'Yeni galeri resmi eklendi'
          });
        }
      });

      // Add recent messages
      const recentMessages = messages
        .filter(item => item.status === 'new' && item.createdAt)
        .sort((a, b) => {
          const aTime = getTimestamp(a.createdAt);
          const bTime = getTimestamp(b.createdAt);
          return bTime - aTime;
        })
        .slice(0, 2);
      
      recentMessages.forEach(item => {
        if (item.createdAt) {
          activities.push({
            id: item.id,
            type: 'message',
            title: item.name,
            description: item.message.substring(0, 50) + '...',
            timestamp: item.createdAt,
            action: 'Yeni mesaj'
          });
        }
      });

      // Sort activities by timestamp
      activities.sort((a, b) => getTimestamp(b.timestamp) - getTimestamp(a.timestamp));
      
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: unknown) => {
    if (!timestamp) return 'Bilinmiyor';
    
    try {
      const now = new Date();
      let time: Date;
      
      if (typeof (timestamp as { toDate?: () => Date }).toDate === 'function') {
        time = (timestamp as { toDate: () => Date }).toDate();
      } else if (timestamp instanceof Date) {
        time = timestamp;
      } else {
        time = new Date(timestamp as string | number);
      }
      
      const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Az önce';
      if (diffInHours < 24) return `${diffInHours} saat önce`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} gün önce`;
      
      return time.toLocaleDateString('tr-TR');
    } catch (error) {
      console.error('Timestamp format error:', error);
      return 'Bilinmiyor';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'news':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f2fa]">
            <FiFileText className="h-4 w-4 text-[#347bb7]" />
          </div>
        );
      case 'gallery':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f5f4]">
            <FiImage className="h-4 w-4 text-[#378a8a]" />
          </div>
        );
      case 'message':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf0f8]">
            <FiMessageSquare className="h-4 w-4 text-[#596b91]" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
            <FiClock className="h-4 w-4 text-slate-500" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 pt-24 lg:p-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-[#347bb7] border-t-transparent"></div>
            <p className="text-sm font-semibold text-[#667386]">Dashboard yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1680px] p-5 pt-24 sm:p-7 sm:pt-24 lg:p-10">
      {/* Page Header */}
      <div className="mb-7">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-[#45a0a0]">Yönetim paneli</p>
            <h1 className="text-3xl font-black tracking-[-.04em] text-[#173b59]">Dashboard</h1>
            <p className="mt-2 text-sm text-[#718094]">Site içeriğinizi ve verilerinizi tek yerden yönetin.</p>
          </div>
          
          {/* Firebase yöneticileri yeni Firebase hesabı oluşturabilir. */}
          {user?.isDatabaseAdmin && (
            <button
              onClick={() => setShowCreateAdminModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#347bb7] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(52,123,183,.2)] transition hover:-translate-y-0.5 hover:bg-[#286796]"
            >
              <FiUsers className="w-4 h-4" />
              Yeni Admin Oluştur
            </button>
          )}
        </div>

        {/* Admin Bilgi Kartı */}
        {user && (
          <div className="relative overflow-hidden rounded-3xl border border-[#dce8f1] bg-[linear-gradient(120deg,#ffffff_0%,#f0f7fb_55%,#e8f5f4_100%)] p-5 shadow-[0_16px_44px_rgba(23,59,89,.07)] sm:p-6">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#347bb7]/[.07]" />
            <div className="flex items-center">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#173b59] shadow-[0_12px_28px_rgba(23,59,89,.18)]">
                <FiUsers className="h-5 w-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-extrabold text-[#173b59] sm:text-lg">
                  Hoş geldiniz, {user.displayName || user.email}
                </h3>
                <p className="mt-1 text-xs text-[#718094] sm:text-sm">
                  {user.isStaticAdmin ? 'Sunucu Yöneticisi' : 'Firebase Yöneticisi'} • {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_10px_30px_rgba(23,59,89,.05)]">
          <div className="flex items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e7f5f4]">
              <FiImage className="h-5 w-5 text-[#378a8a]" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-[#667386]">Toplam Galeri</p>
              <p className="mt-1 text-2xl font-black text-[#173b59]">{stats.totalGalleryItems}</p>
              <p className="mt-1 text-[11px] text-[#8b98a7]">{stats.featuredGalleryItems} öne çıkan</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_10px_30px_rgba(23,59,89,.05)]">
          <div className="flex items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f2fa]">
              <FiFileText className="h-5 w-5 text-[#347bb7]" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-[#667386]">Toplam Haber</p>
              <p className="mt-1 text-2xl font-black text-[#173b59]">{stats.totalNews}</p>
              <p className="mt-1 text-[11px] text-[#8b98a7]">{stats.activeNews} aktif, {stats.featuredNews} öne çıkan</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_10px_30px_rgba(23,59,89,.05)]">
          <div className="flex items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf0f8]">
              <FiFolder className="h-5 w-5 text-[#596b91]" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-[#667386]">Kategoriler</p>
              <p className="mt-1 text-2xl font-black text-[#173b59]">{stats.totalCategories}</p>
              <p className="mt-1 text-[11px] text-[#8b98a7]">{stats.activeCategories} aktif</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_10px_30px_rgba(23,59,89,.05)]">
          <div className="flex items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4f8]">
              <FiMessageSquare className="h-5 w-5 text-[#2f779b]" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-[#667386]">Mesajlar</p>
              <p className="mt-1 text-2xl font-black text-[#173b59]">{stats.totalMessages}</p>
              <p className="mt-1 text-[11px] text-[#8b98a7]">Toplam iletişim</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe8ef] bg-white p-5 shadow-[0_10px_30px_rgba(23,59,89,.05)] sm:col-span-2 xl:col-span-1">
          <div className="flex items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef3f7]">
              <FiClock className="h-5 w-5 text-[#536c82]" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-bold text-[#667386]">Telefon Aramaları</p>
              <p className="mt-1 text-2xl font-black text-[#173b59]">{stats.callCounter}</p>
              <p className="mt-1 text-[11px] text-[#8b98a7]">Toplam arama</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Gallery Management */}
        <div className="rounded-3xl border border-[#dfe8ef] bg-white p-6 shadow-[0_10px_30px_rgba(23,59,89,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(23,59,89,.09)]">
          <div className="flex items-center mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f5f4]">
              <FiImage className="h-5 w-5 text-[#378a8a]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Galeri Yönetimi</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Galeri resimlerini ekleyin, düzenleyin ve kategorilere ayırın.
          </p>
          <div className="flex gap-2">
            <Link
              href="/admin/galeri"
              className="rounded-xl bg-[#347bb7] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#286796]"
            >
              Galeri Yönet
            </Link>
            <Link
              href="/admin/galeri"
              className="flex items-center gap-2 rounded-xl border border-[#d4e0e8] px-4 py-2.5 text-sm font-bold text-[#536477] transition hover:bg-[#f4f8fb]"
            >
              <FiPlus className="w-4 h-4" />
              Yeni Resim Ekle
            </Link>
          </div>
        </div>

        {/* News Management */}
        <div className="rounded-3xl border border-[#dfe8ef] bg-white p-6 shadow-[0_10px_30px_rgba(23,59,89,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(23,59,89,.09)]">
          <div className="flex items-center mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2fa]">
              <FiFileText className="h-5 w-5 text-[#347bb7]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Haber Yönetimi</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Haberleri ekleyin, düzenleyin ve organize edin.
          </p>
          <div className="flex gap-2">
            <Link
              href="/admin/haberler"
              className="rounded-xl bg-[#347bb7] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#286796]"
            >
              Haber Yönet
            </Link>
            <Link
              href="/admin/haberler"
              className="flex items-center gap-2 rounded-xl border border-[#d4e0e8] px-4 py-2.5 text-sm font-bold text-[#536477] transition hover:bg-[#f4f8fb]"
            >
              <FiPlus className="w-4 h-4" />
              Yeni Haber Ekle
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-[#173b59]">Son Aktiviteler</h3>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 text-sm font-bold text-[#347bb7] transition hover:text-[#286796]"
          >
            <FiRefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
        <div className="rounded-3xl border border-[#dfe8ef] bg-white shadow-[0_10px_30px_rgba(23,59,89,.05)]">
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center">
                      {getActivityIcon(activity.type)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">
                          {activity.type === 'message' ? `${activity.title}: ${activity.description}` : activity.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz aktivite yok</h3>
                <p className="text-gray-500">İçerik eklemeye başlayın ve aktiviteleri burada görün</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal 
        isOpen={showCreateAdminModal} 
        onClose={() => setShowCreateAdminModal(false)} 
      />
    </div>
  );
};

export default AdminDashboard;
