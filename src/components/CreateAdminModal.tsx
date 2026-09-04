'use client'
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createAdmin, clearError } from '@/store/slices/authSlice';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    try {
      await dispatch(createAdmin({ email, password, displayName })).unwrap();
      // Başarılı olursa formu temizle ve modalı kapat
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
      onClose();
    } catch (err) {
      console.error('Admin creation error:', err);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-[#dce6ed] bg-white shadow-[0_30px_80px_rgba(15,42,67,.24)]">
        <div className="flex items-center justify-between border-b border-[#e4ebf0] p-6">
          <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#45a0a0]">Yetkilendirme</p><h3 className="mt-1 text-xl font-black text-[#173b59]">Yeni Admin Oluştur</h3></div>
          <button
            onClick={handleClose}
            className="rounded-xl p-2 text-[#8b98a7] transition hover:bg-[#eef4f8] hover:text-[#347bb7]"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label htmlFor="displayName" className="mb-2 block text-xs font-bold text-[#536477]">
              Ad Soyad
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2e9] bg-[#f8fafc] px-4 py-3 text-sm text-[#173b59] outline-none transition focus:border-[#347bb7] focus:bg-white focus:ring-4 focus:ring-[#347bb7]/10"
              placeholder="Admin adı"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold text-[#536477]">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2e9] bg-[#f8fafc] px-4 py-3 text-sm text-[#173b59] outline-none transition focus:border-[#347bb7] focus:bg-white focus:ring-4 focus:ring-[#347bb7]/10"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-bold text-[#536477]">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#d8e2e9] bg-[#f8fafc] px-4 py-3 pr-11 text-sm text-[#173b59] outline-none transition focus:border-[#347bb7] focus:bg-white focus:ring-4 focus:ring-[#347bb7]/10"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#8b98a7] hover:text-[#347bb7]"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.645 11.645 0 013.77-4.65M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold text-[#536477]">
              Şifre Tekrar
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-[#d8e2e9] bg-[#f8fafc] px-4 py-3 pr-11 text-sm text-[#173b59] outline-none transition focus:border-[#347bb7] focus:bg-white focus:ring-4 focus:ring-[#347bb7]/10"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-[#8b98a7] hover:text-[#347bb7]"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.645 11.645 0 013.77-4.65M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {password !== confirmPassword && confirmPassword && (
            <div className="text-red-600 text-sm">
              Şifreler eşleşmiyor
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-[#d8e2e9] px-4 py-2.5 text-sm font-bold text-[#536477] transition hover:bg-[#f3f7fa]"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-colors ${
                isLoading || password !== confirmPassword
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#347bb7] hover:bg-[#286796]'
              }`}
            >
              {isLoading ? 'Oluşturuluyor...' : 'Admin Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
