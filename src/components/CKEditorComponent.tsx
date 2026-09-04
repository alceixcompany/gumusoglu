'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKEditorComponentProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  onMapsChange?: (maps: Array<{id: string, url: string, title: string}>) => void;
  initialMaps?: Array<{id: string, url: string, title: string}>;
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  value,
  onChange,
  placeholder = 'İçerik girin...',
  height = '300px',
  label,
  onMapsChange,
  initialMaps = []
}) => {
  const editorRef = useRef<unknown>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [mapsUrl, setMapsUrl] = useState('');
  const [maps, setMaps] = useState<Array<{id: string, url: string, title: string}>>(initialMaps);

  // Resim ekleme fonksiyonu
  const handleAddImage = () => {
    if (imageUrl.trim()) {
      const editor = editorRef.current as any;
      if (editor) {
        // Resim HTML'ini oluştur
        const imageHtml = `<img src="${imageUrl.trim()}" alt="Resim" style="max-width: 100%; height: auto;" />`;
        
        // Mevcut içeriğe resmi ekle
        const currentData = editor.getData();
        const newData = currentData + imageHtml;
        editor.setData(newData);
        
        // Değişikliği parent component'e bildir
        onChange(newData);
        
        // Modal'ı kapat ve input'u temizle
        setShowImageModal(false);
        setImageUrl('');
      }
    }
  };


  // Harita ekleme fonksiyonu - Sadece iframe src URL'si
  const handleAddMaps = () => {
    if (mapsUrl.trim()) {
      let finalUrl = mapsUrl.trim();
      
      // Eğer direkt iframe HTML'i ise, src'yi çıkar
      if (finalUrl.includes('<iframe')) {
        const srcMatch = finalUrl.match(/src="([^"]+)"/);
        if (srcMatch) {
          finalUrl = srcMatch[1];
        }
      }
      
      // Yeni harita objesi oluştur
      const newMap = {
        id: Date.now().toString(),
        url: finalUrl,
        title: `Harita ${maps.length + 1}`
      };
      
      // Haritalar listesine ekle
      const updatedMaps = [...maps, newMap];
      setMaps(updatedMaps);
      
      // Parent component'e bildir
      if (onMapsChange) {
        onMapsChange(updatedMaps);
      }
      
      // Modal'ı kapat ve input'u temizle
      setShowMapsModal(false);
      setMapsUrl('');
    }
  };

  // Harita silme fonksiyonu
  const handleRemoveMap = (mapId: string) => {
    const updatedMaps = maps.filter(map => map.id !== mapId);
    setMaps(updatedMaps);
    
    // Parent component'e bildir
    if (onMapsChange) {
      onMapsChange(updatedMaps);
    }
  };

  // Gelişmiş CKEditor konfigürasyonu
  const editorConfig = {
    placeholder: placeholder,
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'fontSize',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'alignment',
      '|',
      'numberedList',
      'bulletedList',
      '|',
      'outdent',
      'indent',
      '|',
      'link',
      'blockQuote',
      'insertTable',
      '|',
      'image',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
      '|',
      'findAndReplace',
      'selectAll'
    ],
    // Sadece URL ile resim ekleme için gerekli eklentileri kaldır
    removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'ImageUpload', 'Base64UploadAdapter', 'SimpleUploadAdapter'],
    // Güvenlik kısıtlamalarını tamamen kaldır
    allowedContent: true,
    // Tüm HTML elementlerine izin ver
    extraAllowedContent: '*[*](*)',
    // Resim konfigürasyonu - URL ile ekleme
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageResize'
      ],
      resizeOptions: [
        {
          name: 'imageResize:original',
          label: 'Orijinal',
          value: null
        },
        {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
        }
      ],
      // URL doğrulama kısıtlamalarını kaldır
      upload: {
        types: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'],
        allowExternalImages: true
      }
    },
    // URL doğrulama kısıtlamalarını kaldır
    disallowedContent: '',
    // Iframe'lerin görünmesi için gerekli ayarlar
    mediaEmbed: {
      previewsInData: true
    },
    // Link konfigürasyonu
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://'
    },
    // Tablo konfigürasyonu
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ]
    },
    language: 'tr'
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Resim ve Harita Ekleme Butonları */}
      <div className="mb-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.10)] px-3 py-2 text-sm font-medium text-[var(--lale-gold)] transition-colors hover:bg-[rgba(212,175,55,0.16)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Resim Ekle
        </button>
        
        <button
          type="button"
          onClick={() => setShowMapsModal(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[rgba(212,175,55,0.28)] bg-[rgba(251,250,246,0.08)] px-3 py-2 text-sm font-medium text-[var(--lale-ivory)] transition-colors hover:bg-[rgba(251,250,246,0.12)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Harita Ekle
        </button>
        
      </div>

      <div 
        className="admin-editor-shell border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500"
        style={{ height }}
      >
        <CKEditor
          editor={ClassicEditor as any}
          config={editorConfig}
          data={value}
          onChange={(event: unknown, editor: unknown) => {
            const data = (editor as any).getData();
            onChange(data);
          }}
          onReady={(editor: unknown) => {
            editorRef.current = editor;
            // Editör hazır olduğunda placeholder'ı ayarla
            if (placeholder) {
              (editor as any).editing.view.document.on('focus', () => {
                if ((editor as any).getData() === '') {
                  (editor as any).setData(placeholder);
                }
              });
            }
          }}
        />
      </div>

      {/* Eklenen Haritalar */}
      {maps.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Eklenen Haritalar:</h4>
          <div className="space-y-3">
            {maps.map((map) => (
              <div key={map.id} className="rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(251,250,246,0.05)] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{map.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMap(map.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="w-full">
                  <iframe
                    src={map.url}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={map.title}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resim Ekleme Modal */}
      {showImageModal && (
        <div className="admin-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="admin-modal-panel max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resim Ekle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resim URL&apos;si
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/resim.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowImageModal(false);
                    setImageUrl('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={!imageUrl.trim()}
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Ekleme Modal */}
      {showMapsModal && (
        <div className="admin-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="admin-modal-panel max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Maps Ekle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  iframe URL&apos;si
                </label>
                <textarea
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="iframe src URL'sini veya tam iframe HTML'ini yapıştırın..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Desteklenen Formatlar:</strong><br/>
                  • <span className="text-green-600">maps/embed</span> URL&apos;leri<br/>
                  • <span className="text-purple-600">&lt;iframe&gt;</span> HTML kodu<br/>
                  <span className="text-green-600 font-medium">✅ Direkt iframe src URL&apos;si veya tam iframe HTML&apos;i yapıştırın</span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMapsModal(false);
                    setMapsUrl('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleAddMaps}
                  disabled={!mapsUrl.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CKEditorComponent;
