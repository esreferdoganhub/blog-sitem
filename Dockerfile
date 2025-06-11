# Dinamik Next.js uygulaması için Dockerfile
FROM node:20-alpine

# Çalışma dizini oluştur
WORKDIR /app

# Bağımlılık dosyalarını kopyala ve yükle
COPY package*.json ./
RUN npm install

# Tüm dosyaları kopyala
COPY . .

# Build işlemi
RUN npm run build

# Uygulamayı başlat
EXPOSE 8080
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"
CMD ["npm", "start"]
