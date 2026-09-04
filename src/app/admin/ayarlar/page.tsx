'use client'
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { changePassword, user, error, successMessage } = useAuth();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (newPassword !== confirmPassword) {
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setIsLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: unknown) {
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--lale-ivory)] mb-2">Şifre Değiştir</h1>
        <p className="text-[rgba(251,250,246,0.68)]">Hesap güvenliğiniz için şifrenizi güncelleyin</p>
      </div>

      {/* Sunucu yöneticisi uyarısı */}
      {user?.isStaticAdmin && (
        <div className="mb-6 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.10)] p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-[var(--lale-gold)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm text-[rgba(251,250,246,0.74)]">
              <p className="font-medium">Sunucu Korumalı Yönetici Hesabı</p>
              <p>Bu hesabın bilgileri tarayıcı kodunda tutulmaz. Şifre değişikliği sunucu ortam ayarlarından yapılır.</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Display */}
      {(error || successMessage) && (
        <div className="mb-6 max-w-md">
          {/* Error Message */}
          {error && (
            <div className="bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.22)] text-red-200 px-4 py-3 rounded-md text-sm animate-pulse mb-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.22)] text-green-200 px-4 py-3 rounded-md text-sm animate-bounce">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{successMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Password Change Form */}
      <div className="max-w-md">
        <div className="lale-card-dark rounded-[24px] p-6">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {user?.isStaticAdmin && (
              <div className="p-4 bg-[rgba(251,250,246,0.06)] border border-[rgba(212,175,55,0.18)] rounded-lg text-center">
                <p className="text-[rgba(251,250,246,0.68)] text-sm">
                  Sunucu korumalı hesap için şifre değişikliği ortam ayarlarından yapılır.
                </p>
              </div>
            )}
            {!user?.isStaticAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Mevcut şifrenizi girin"
                  disabled={isLoading}
                />
              </div>
            )}
            
            {!user?.isStaticAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[rgba(251,250,246,0.72)] mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Yeni şifrenizi girin"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-[rgba(251,250,246,0.50)] mt-1">En az 6 karakter olmalıdır</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[rgba(251,250,246,0.72)] mb-2">
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Yeni şifrenizi tekrar girin"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {!user?.isStaticAdmin && (
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white font-medium`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Güncelleniyor...
                    </div>
                  ) : (
                    'Şifreyi Güncelle'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(251,250,246,0.06)] p-4">
          <h3 className="text-sm font-medium text-[var(--lale-gold)] mb-2">Güvenlik İpuçları</h3>
          <ul className="text-xs text-[rgba(251,250,246,0.68)] space-y-1">
            <li>• Güçlü bir şifre için büyük/küçük harf, rakam ve özel karakter kullanın</li>
            <li>• Şifrenizi kimseyle paylaşmayın</li>
            <li>• Düzenli olarak şifrenizi değiştirin</li>
            <li>• Farklı hesaplar için farklı şifreler kullanın</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
