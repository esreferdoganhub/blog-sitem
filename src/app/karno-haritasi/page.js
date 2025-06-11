import Link from 'next/link';

export default function KarnoHaritasi() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-4xl font-bold mb-6 text-center text-purple-600">
            🗺️ Karno Haritası
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center">
            Boolean fonksiyonlarını görselleştirin ve sadeleştirin
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-800">Özellikler:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>2, 3 ve 4 değişkenli Boolean fonksiyonları</li>
              <li>İnteraktif Karno haritası</li>
              <li>Otomatik sadeleştirme</li>
              <li>Görsel grup belirleme</li>
              <li>Adım adım çözüm</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600 mb-4">
              Karno Haritası uygulaması geliştirme aşamasındadır.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/karno/karno.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                🇹🇷 Türkçe Versiyonu Aç
              </a>
              <a 
                href="/karno/karno-en.html" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                🇺🇸 English Version
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
