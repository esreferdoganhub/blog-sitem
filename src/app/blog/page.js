import Link from 'next/link';

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Blog yakında geliyor!</h2>
          <p className="text-gray-700 mb-4">
            Teknoloji, programlama ve kişisel deneyimlerimle ilgili yazılarımı burada paylaşacağım.
          </p>
          <p className="text-gray-600">
            Şu anda blog sayfası geliştiriliyor. Yakında harika içerikler ile karşınızda olacağım!
          </p>
        </div>
        
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
