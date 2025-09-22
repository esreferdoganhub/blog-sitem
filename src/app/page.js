
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Paralaks Arka Plan */}
      <div className="parallax-bg"></div>
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] gap-10 px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">Hoş Geldiniz!</h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto drop-shadow">Kendi uygulamalarımı, bilgisayar dünyasıyla ilgili yazılarımı ve daha fazlasını burada bulabilirsiniz.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a href="/blog-sitem/uygulamalar" className="rounded-full bg-blue-600 text-white px-6 py-3 font-semibold shadow hover:bg-blue-700 transition">Uygulamalarım</a>
          <a href="/blog-sitem/karno/karno.html" className="rounded-full bg-purple-600 text-white px-6 py-3 font-semibold shadow hover:bg-purple-700 transition">Karno Haritası</a>
          <a href="/blog-sitem/blog" className="rounded-full bg-green-600 text-white px-6 py-3 font-semibold shadow hover:bg-green-700 transition">Blog</a>
        </div>
        
        {/* Basit Gazze/Doğu Türkistan Hatırlatması */}
        <div className="mt-12 bg-gray-100 p-6 rounded-lg shadow max-w-xl mx-auto">
          <Image src="/blog-sitem/gtrdt.jpg" alt="Gazze ve Doğu Türkistan" width={600} height={256} className="w-full max-h-64 object-contain rounded-lg mb-4" />
          <h2 className="text-xl font-bold mb-2">Gazze ve Doğu Türkistan - Unutma!</h2>
          <p className="text-gray-700">Filistin halkının ve Doğu Türkistanlıların yanında olduğumuzu asla unutmayalım.</p>
          <div className="text-center mt-4">
            <span className="inline-block px-4 py-2 bg-gray-600 text-white rounded text-sm">
              #GazzeUnuttmaz #DoğuTürkistanUnuttmaz
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
