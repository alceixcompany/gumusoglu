import React from 'react';

const TestComponent = () => {
  return (
    <div className="responsive-container py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Responsive Tasarım Test
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          Bu bileşen responsive tasarım özelliklerini test etmek için kullanılır.
        </p>
      </div>

      {/* Responsive Grid Demo */}
      <div className="responsive-grid mb-8">
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">📱</div>
          <h3 className="font-semibold text-sm sm:text-base">Mobil</h3>
          <p className="text-xs sm:text-sm text-gray-600">Küçük ekranlar için optimize</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">📱</div>
          <h3 className="font-semibold text-sm sm:text-base">Tablet</h3>
          <p className="text-xs sm:text-sm text-gray-600">Orta boy ekranlar</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">💻</div>
          <h3 className="font-semibold text-sm sm:text-base">Desktop</h3>
          <p className="text-xs sm:text-sm text-gray-600">Büyük ekranlar</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🖥️</div>
          <h3 className="font-semibold text-sm sm:text-base">Wide</h3>
          <p className="text-xs sm:text-sm text-gray-600">Geniş ekranlar</p>
        </div>
      </div>

      {/* Responsive Text Demo */}
      <div className="responsive-spacing">
        <div className="text-responsive">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
            Responsive Metin Hizalama
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Bu metin farklı ekran boyutlarında farklı şekilde hizalanır.
          </p>
        </div>
      </div>

      {/* Responsive Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8">
        <button className="btn-primary">
          Responsive Buton
        </button>
        <button className="btn-secondary">
          İkincil Buton
        </button>
      </div>

      {/* Responsive Visibility */}
      <div className="mt-8 text-center">
        <div className="hide-mobile bg-red-100 p-4 rounded-lg mb-4">
          <p className="text-sm">Bu sadece mobil olmayan cihazlarda görünür</p>
        </div>
        <div className="hide-desktop bg-green-100 p-4 rounded-lg mb-4">
          <p className="text-sm">Bu sadece mobil cihazlarda görünür</p>
        </div>
        <div className="hide-tablet bg-purple-100 p-4 rounded-lg">
          <p className="text-sm">Bu sadece tablet olmayan cihazlarda görünür</p>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;

