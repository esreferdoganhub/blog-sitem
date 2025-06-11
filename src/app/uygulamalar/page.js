export default function Uygulamalar() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-900">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Uygulamalarım</h1>
      <div className="w-full max-w-2xl space-y-8">
        {/* Karno Haritası Uygulaması */}
        <div className="bg-purple-100 dark:bg-purple-900 rounded-lg shadow p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Karno Haritası</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">Boolean fonksiyonları görselleştirme ve sadeleştirme aracı. Dijital mantık devreleri için interaktif Karno haritası çözücü.</p>
            <a href="/karno/karno.html" className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Uygulamayı Aç</a>
          </div>
        </div>
        {/* Speedmeter Uygulaması */}
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg shadow p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">SpeedMeter</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">macOS menü çubuğunda anlık internet indirme ve yükleme hızlarını gösteren hafif uygulama. Gerçek zamanlı grafik görünümü ve detaylı istatistikler.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">macOS</span>
              <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">SwiftUI</span>
              <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">Açık Kaynak</span>
            </div>
            <a href="https://github.com/esreferdoganhub/speedmeter" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">GitHub&apos;da Görüntüle</a>
          </div>
        </div>
        {/* Downloader Uygulaması */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Downloader</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">Açık kaynak kodlu dosya indirme yöneticisi. Hızlı, basit ve ücretsiz. Şimdilik macOS için mevcut.</p>
            <a href="https://github.com/esreferdoganhub/Downloader" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">GitHub&#39;da Görüntüle</a>
          </div>
        </div>
        {/* Mezuniyet Belgesi Şablonu */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Mezuniyet Belgesi Şablonu</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">Mezuniyet belgesi hazırlamak için kullanabileceğiniz şablon dosyası. Açık kaynak ve ücretsizdir.</p>
            <a href="https://github.com/esreferdoganhub/mezuniyet_belgesi" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">GitHub&#39;da Görüntüle</a>
          </div>
        </div>
      </div>
    </div>
  );
}
