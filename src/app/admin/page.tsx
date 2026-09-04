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
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FiFileText className="w-4 h-4 text-blue-600" />
          </div>
        );
      case 'gallery':
        return (
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <FiImage className="w-4 h-4 text-amber-600" />
          </div>
        );
      case 'message':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <FiMessageSquare className="w-4 h-4 text-green-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <FiClock className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Dashboard yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--lale-ivory)] mb-2">Admin Dashboard</h1>
            <p className="text-[rgba(251,250,246,0.72)]">Site içeriğinizi ve verilerinizi yönetin</p>
          </div>
          
          {/* Firebase yöneticileri yeni Firebase hesabı oluşturabilir. */}
          {user?.isDatabaseAdmin && (
            <button
              onClick={() => setShowCreateAdminModal(true)}
              className="rounded-full bg-[var(--lale-gold)] px-5 py-3 text-sm font-medium text-[var(--lale-emerald-deep)] shadow-[0_18px_38px_rgba(212,175,55,0.22)] transition-all hover:bg-[var(--lale-gold-soft)] flex items-center gap-2"
            >
              <FiUsers className="w-4 h-4" />
              Yeni Admin Oluştur
            </button>
          )}
        </div>

        {/* Admin Bilgi Kartı */}
        {user && (
          <div className="rounded-[28px] border border-[rgba(212,175,55,0.24)] bg-[linear-gradient(135deg,rgba(212,175,55,0.16),rgba(6,35,31,0.78))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.26)] backdrop-blur">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[var(--lale-gold)] rounded-full flex items-center justify-center shadow-[0_14px_30px_rgba(212,175,55,0.22)]">
                <FiUsers className="w-6 h-6 text-[var(--lale-emerald-deep)]" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-[var(--lale-ivory)]">
                  Hoş geldiniz, {user.displayName || user.email}
                </h3>
                <p className="text-sm text-[rgba(251,250,246,0.68)]">
                  {user.isStaticAdmin ? 'Sunucu Yöneticisi' : 'Firebase Yöneticisi'} • {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FiImage className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Galeri</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGalleryItems}</p>
              <p className="text-xs text-gray-500">{stats.featuredGalleryItems} öne çıkan</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Haber</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNews}</p>
              <p className="text-xs text-gray-500">{stats.activeNews} aktif, {stats.featuredNews} öne çıkan</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiFolder className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kategoriler</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              <p className="text-xs text-gray-500">{stats.activeCategories} aktif</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiMessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mesajlar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
              <p className="text-xs text-gray-500">Toplam iletişim</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Telefon Aramaları</p>
              <p className="text-2xl font-bold text-gray-900">{stats.callCounter}</p>
              <p className="text-xs text-gray-500">Toplam arama</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Gallery Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FiImage className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Galeri Yönetimi</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Galeri resimlerini ekleyin, düzenleyin ve kategorilere ayırın.
          </p>
          <div className="flex gap-2">
            <Link
              href="/admin/galeri"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Galeri Yönet
            </Link>
            <Link
              href="/admin/galeri"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Yeni Resim Ekle
            </Link>
          </div>
        </div>

        {/* News Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Haber Yönetimi</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Haberleri ekleyin, düzenleyin ve organize edin.
          </p>
          <div className="flex gap-2">
            <Link
              href="/admin/haberler"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Haber Yönet
            </Link>
            <Link
              href="/admin/haberler"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
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
          <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
          <button 
            onClick={fetchDashboardData}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Yenile
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border">
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
