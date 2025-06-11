/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  images: { unoptimized: true },
  
  // Cloud Run için port konfigürasyonu
  serverExternalPackages: [],
  
  // URL rewrites for static files
  async rewrites() {
    return [
      {
        source: '/karno/karno',
        destination: '/karno/karno.html'
      },
      {
        source: '/karno/karno-en',
        destination: '/karno/karno-en.html'
      }
    ]
  },
  
  // Chrome uyumluluğu için ek ayarlar
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // Webpack yapılandırması
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  
  // Eğer alt klasörde yayınlayacaksanız (ör: /blog-sitem), aşağıya ekleyin:
  // basePath: '/REPO_ADINIZ',
  // assetPrefix: '/REPO_ADINIZ/',
};

export default nextConfig;
