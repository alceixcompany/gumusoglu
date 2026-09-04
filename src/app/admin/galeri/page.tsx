'use client'
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Image from 'next/image';
import CKEditorComponent from '@/components/CKEditorComponent';

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const AdminGallery = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
  
  // Category states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '📷',
    color: 'blue',
    isActive: true
  });

  // Gallery item states
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    imageUrl: '',
    thumbnailUrl: '',
    tags: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories - index hatası olmaması için orderBy kaldırıldı
      const categoriesSnapshot = await getDocs(collection(db, 'gallery_categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryCategory[];
      
      // Client-side sıralama
      categoriesData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(categoriesData);

      // Fetch gallery items - index hatası olmaması için orderBy kaldırıldı
      const itemsSnapshot = await getDocs(collection(db, 'gallery_items'));
      const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryItem[];
      
      // Client-side sıralama
      itemsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setGalleryItems(itemsData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Category functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        await updateDoc(doc(db, 'gallery_categories', editingCategory.id), {
          ...categoryForm,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Add new category
        await addDoc(collection(db, 'gallery_categories'), {
          ...categoryForm,
          createdAt: new Date().toISOString()
        });
      }
      
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', icon: '📷', color: 'blue', isActive: true });
      fetchData();
    } catch (error) {
      console.error('Kategori kaydedilirken hata:', error);
    }
  };

  const handleCategoryEdit = (category: GalleryCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive
    });
    setShowCategoryModal(true);
  };

  const handleCategoryDelete = async (categoryId: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'gallery_categories', categoryId));
        fetchData();
      } catch (error) {
        console.error('Kategori silinirken hata:', error);
      }
    }
  };

  // Gallery item functions
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = {
        ...itemForm,
        tags: itemForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'gallery_items', editingItem.id), itemData);
      } else {
        // Add new item
        await addDoc(collection(db, 'gallery_items'), {
          ...itemData,
          createdAt: new Date().toISOString()
        });
      }
      
      setShowItemModal(false);
      setEditingItem(null);
      setItemForm({ title: '', description: '', categoryId: '', imageUrl: '', thumbnailUrl: '', tags: '', isActive: true, isFeatured: false });
      fetchData();
    } catch (error) {
      console.error('Galeri resmi kaydedilirken hata:', error);
    }
  };

  const handleItemEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setItemForm({
      title: item.title,
      description: item.description,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl,
      tags: item.tags.join(', '),
      isActive: item.isActive,
      isFeatured: item.isFeatured
    });
    setShowItemModal(true);
  };

  const handleItemDelete = async (itemId: string) => {
    if (confirm('Bu galeri resmini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'gallery_items', itemId));
        fetchData();
      } catch (error) {
        console.error('Galeri resmi silinirken hata:', error);
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Kategori Yok';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-lg text-white">🖼️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Galeri Yönetimi</h1>
              <p className="text-sm text-gray-600 mt-1">Kategorileri ve resimleri yönetin</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Kategoriler</p>
                  <p className="text-xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <span className="text-xl">📁</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Resimler</p>
                  <p className="text-xl font-bold text-gray-900">{galleryItems.length}</p>
                </div>
                <span className="text-xl">🖼️</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Aktif</p>
                  <p className="text-xl font-bold text-gray-900">{categories.filter(c => c.isActive).length}</p>
                </div>
                <span className="text-xl">✅</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Öne Çıkan</p>
                  <p className="text-xl font-bold text-gray-900">{galleryItems.filter(i => i.isFeatured).length}</p>
                </div>
                <span className="text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>📁</span>
              <span className="text-sm">Kategoriler ({categories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium transition-colors ${
                activeTab === 'items'
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>🖼️</span>
              <span className="text-sm">Resimler ({galleryItems.length})</span>
            </button>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
                <p className="text-sm text-gray-600 mt-1">Galeri kategorilerini yönetin</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                + Yeni Kategori
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-amber-300 transition-all duration-200">
                  {/* Header with Icon */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-${category.color}-500 text-white`}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            category.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {category.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {/* Image Count */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {galleryItems.filter(item => item.categoryId === category.id).length} resim
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCategoryEdit(category)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-blue-200"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleCategoryDelete(category.id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-red-200"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {categories.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-gray-400">📁</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Henüz kategori yok</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Galeri kategorileri oluşturarak resimlerinizi organize etmeye başlayın</p>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  + Kategori Oluştur
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gallery Items Tab */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Galeri Resimleri</h2>
                <p className="text-sm text-gray-600 mt-1">Resimleri kategorilere göre yönetin</p>
              </div>
              <button
                onClick={() => setShowItemModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                + Yeni Resim
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl text-gray-300 mb-1 block">🖼️</span>
                        <p className="text-xs text-gray-500">Resim yok</p>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700">
                        {getCategoryName(item.categoryId)}
                      </span>
                    </div>
                    
                    {/* Featured Badge */}
                    {item.isFeatured && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
                          ⭐
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">{item.title}</h3>
                    
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleItemEdit(item)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleItemDelete(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h3>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Örn: Kanalizasyon"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Kategori açıklaması..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İkon</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="📷"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                  <select
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="blue">Mavi</option>
                    <option value="red">Kırmızı</option>
                    <option value="green">Yeşil</option>
                    <option value="yellow">Sarı</option>
                    <option value="purple">Mor</option>
                    <option value="pink">Pembe</option>
                    <option value="gray">Gri</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({...categoryForm, isActive: e.target.checked})}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Aktif</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: '', description: '', icon: '📷', color: 'blue', isActive: true });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full h-[95vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Galeri Resmi Düzenle' : 'Yeni Galeri Resmi Ekle'}
              </h2>
            </div>
            
            <form onSubmit={handleItemSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sol taraf - Form alanları */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                        <input
                          type="text"
                          value={itemForm.title}
                          onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Örn: Modern Kanalizasyon"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                        <select
                          value={itemForm.categoryId}
                          onChange={(e) => setItemForm({...itemForm, categoryId: e.target.value})}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Kategori Seçin</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ana Resim URL *</label>
                      <input
                        type="url"
                        value={itemForm.imageUrl}
                        onChange={(e) => setItemForm({...itemForm, imageUrl: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://example.com/resim.jpg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Küçük Resim URL</label>
                      <input
                        type="url"
                        value={itemForm.thumbnailUrl}
                        onChange={(e) => setItemForm({...itemForm, thumbnailUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://example.com/resim-kucuk.jpg (opsiyonel)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={itemForm.tags}
                        onChange={(e) => setItemForm({...itemForm, tags: e.target.value})}
                        placeholder="cilt bakimi, lazer, merkez, isilti"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={itemForm.isActive}
                          onChange={(e) => setItemForm({...itemForm, isActive: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Aktif</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={itemForm.isFeatured}
                          onChange={(e) => setItemForm({...itemForm, isFeatured: e.target.checked})}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">Öne Çıkan</label>
                      </div>
                    </div>
                  </div>

                  {/* Sağ taraf - Resim önizleme */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resim Önizleme</h4>
                    
                    {/* Ana resim önizleme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Ana Resim</label>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                        {itemForm.imageUrl ? (
                          <Image
                            src={itemForm.imageUrl}
                            alt="Önizleme"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              (target.nextElementSibling as HTMLElement)!.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex items-center justify-center ${itemForm.imageUrl ? 'hidden' : 'flex'}`}
                          style={{ display: itemForm.imageUrl ? 'none' : 'flex' } as React.CSSProperties}
                        >
                          <div className="text-center">
                            <span className="text-4xl text-gray-400 mb-2 block">🖼️</span>
                            <p className="text-sm text-gray-500">Resim URL&apos;si girin</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Küçük resim önizleme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Küçük Resim</label>
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                        {itemForm.thumbnailUrl ? (
                          <Image
                            src={itemForm.thumbnailUrl}
                            alt="Küçük önizleme"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              (target.nextElementSibling as HTMLElement)!.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full flex items-center justify-center ${itemForm.thumbnailUrl ? 'hidden' : 'flex'}`}
                          style={{ display: itemForm.thumbnailUrl ? 'none' : 'flex' } as React.CSSProperties}
                        >
                          <div className="text-center">
                            <span className="text-4xl text-gray-400 mb-1 block">🖼️</span>
                            <p className="text-xs text-gray-500">Opsiyonel</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hızlı URL örnekleri */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Hızlı URL Örnekleri:</h5>
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => setItemForm({...itemForm, imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop'})}
                          className="block text-xs text-blue-600 hover:text-blue-800 text-left w-full"
                        >
                          ✨ Cilt bakimi ornegi
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemForm({...itemForm, imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'})}
                          className="block text-xs text-blue-600 hover:text-blue-800 text-left w-full"
                        >
                          🌿 Lazer epilasyon ornegi
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemForm({...itemForm, imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'})}
                          className="block text-xs text-blue-600 hover:text-blue-800 text-left w-full"
                        >
                          💆 Vucut bakimi ornegi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Açıklama - En Altta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                  <div className="border border-gray-300 rounded-lg">
                    <CKEditorComponent
                      value={itemForm.description}
                      onChange={(data: string) => setItemForm({...itemForm, description: data})}
                      placeholder="Resim açıklaması..."
                      height="200px"
                      label=""
                    />
                  </div>
                </div>
              </div>
              
              {/* Fixed Bottom Buttons */}
              <div className="flex-shrink-0 border-t border-gray-200 p-6">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowItemModal(false);
                      setEditingItem(null);
                      setItemForm({ title: '', description: '', categoryId: '', imageUrl: '', thumbnailUrl: '', tags: '', isActive: true, isFeatured: false });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    {editingItem ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
