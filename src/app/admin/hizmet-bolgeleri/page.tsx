'use client'
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchServiceAreas, 
  addServiceArea, 
  updateServiceArea, 
  deleteServiceArea 
} from '@/store/slices/serviceAreasSlice';
import CKEditorComponent from '@/components/CKEditorComponent';

interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  maps?: Array<{id: string, url: string, title: string}>;
}

const AdminServiceAreas = () => {
  const dispatch = useAppDispatch();
  const { items: serviceAreas, isLoading: loading } = useAppSelector((state) => state.serviceAreas);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [areaForm, setAreaForm] = useState({
    name: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    isActive: true,
    order: 0,
    maps: [] as Array<{id: string, url: string, title: string}>
  });

  useEffect(() => {
    dispatch(fetchServiceAreas({}));
  }, [dispatch]);



  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!areaForm.name || !areaForm.description || !areaForm.content) {
      alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    setIsUploading(true);
    try {
      const areaData = {
        ...areaForm,
        slug: areaForm.slug || generateSlug(areaForm.name),
        createdAt: editingArea ? editingArea.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingArea) {
        await dispatch(updateServiceArea({ id: editingArea.id, ...areaData })).unwrap();
      } else {
        await dispatch(addServiceArea(areaData)).unwrap();
      }

      setShowAddModal(false);
      setEditingArea(null);
      setAreaForm({ name: '', slug: '', description: '', content: '', imageUrl: '', isActive: true, order: 0, maps: [] });
      dispatch(fetchServiceAreas({}));
    } catch (error) {
      console.error('Error saving service area:', error);
      alert('Hizmet bölgesi kaydedilirken hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (area: ServiceArea) => {
    setEditingArea(area);
    setAreaForm({
      name: area.name,
      slug: area.slug,
      description: area.description,
      content: area.content,
      imageUrl: area.imageUrl,
      isActive: area.isActive,
      order: area.order,
      maps: area.maps || []
    });
    setShowAddModal(true);
  };

  const handleDelete = async (areaId: string) => {
    if (confirm('Bu hizmet bölgesini silmek istediğinizden emin misiniz?')) {
      try {
        await dispatch(deleteServiceArea(areaId)).unwrap();
        dispatch(fetchServiceAreas({}));
      } catch (error) {
        console.error('Error deleting service area:', error);
      }
    }
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
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-xl text-white">🏗️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hizmet Bölgeleri Yönetimi</h1>
              <p className="text-gray-600 mt-1">Hizmet bölgelerini yönetin ve yeni bölgeler ekleyin</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Toplam Bölge</p>
                  <p className="text-2xl font-bold text-gray-900">{serviceAreas.length}</p>
                </div>
                <span className="text-2xl">🏗️</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{serviceAreas.filter(h => h.isActive).length}</p>
                </div>
                <span className="text-2xl">✅</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pasif</p>
                  <p className="text-2xl font-bold text-gray-900">{serviceAreas.filter(h => !h.isActive).length}</p>
                </div>
                <span className="text-2xl">❌</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Bu Ay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serviceAreas.filter(h => new Date(h.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
                  </p>
                </div>
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddModal(true);
              setEditingArea(null);
              setAreaForm({ name: '', slug: '', description: '', content: '', imageUrl: '', isActive: true, order: 0, maps: [] });
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
          >
            <span>+</span>
            Yeni Hizmet Bölgesi Ekle
          </button>
        </div>

        {/* Service Areas List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Hizmet Bölgeleri</h2>
          </div>
          
          {serviceAreas.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Hizmet Bölgesi Eklenmemiş</h3>
              <p className="text-gray-500">İlk hizmet bölgenizi ekleyerek başlayın.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bölge Adı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sıra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oluşturulma
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceAreas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                            <span className="text-amber-600 font-semibold text-sm">
                              {area.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{area.name}</div>
                            <div className="text-sm text-gray-500">{area.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {area.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {area.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          area.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {area.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(area.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(area)}
                            className="text-amber-600 hover:text-amber-900 transition-colors duration-300"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(area.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-300"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full h-[95vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingArea ? 'Hizmet Bölgesi Düzenle' : 'Yeni Hizmet Bölgesi Ekle'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Temel Bilgiler - Üstte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bölge Adı *</label>
                  <input
                    type="text"
                    value={areaForm.name}
                    onChange={(e) => setAreaForm({...areaForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Örn: Kadıköy, Beşiktaş, Şişli"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={areaForm.slug}
                    onChange={(e) => setAreaForm({...areaForm, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Boş bırakılırsa otomatik oluşturulur"
                  />
                </div>
              </div>
              
              {/* Kısa Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama *</label>
                <textarea
                  value={areaForm.description}
                  onChange={(e) => setAreaForm({...areaForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Bölge hakkında kısa açıklama..."
                />
              </div>
              
              {/* Resim ve Sıra - Üstte */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL&apos;si</label>
                  <input
                    type="url"
                    value={areaForm.imageUrl}
                    onChange={(e) => setAreaForm({...areaForm, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://example.com/resim.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                  <input
                    type="number"
                    value={areaForm.order}
                    onChange={(e) => setAreaForm({...areaForm, order: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              {/* Aktif Durumu */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={areaForm.isActive}
                  onChange={(e) => setAreaForm({...areaForm, isActive: e.target.checked})}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Aktif</label>
              </div>
              
              {/* Detaylı İçerik - En Altta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı İçerik *</label>
                <div className="border border-gray-300 rounded-lg">
                  <CKEditorComponent
                    value={areaForm.content}
                    onChange={(data) => setAreaForm({...areaForm, content: data})}
                    onMapsChange={(maps) => setAreaForm({...areaForm, maps})}
                    initialMaps={areaForm.maps}
                    placeholder="Bölge hakkında detaylı bilgi..."
                    height="250px"
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
                      setShowAddModal(false);
                      setEditingArea(null);
                      setAreaForm({ name: '', slug: '', description: '', content: '', imageUrl: '', isActive: true, order: 0, maps: [] });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {editingArea ? 'Güncelleniyor...' : 'Ekleniyor...'}
                      </>
                    ) : (
                      editingArea ? 'Güncelle' : 'Ekle'
                    )}
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

export default AdminServiceAreas;
