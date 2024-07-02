# Kullanmak istediğiniz Node.js sürümünü belirleyin
FROM node:14

# Docker imajındaki çalışma dizinini belirleyin
WORKDIR /usr/src/app

# Gerekli dosyaları projenin içine kopyalayın
COPY package*.json ./

# npm install komutunu çalıştırın
RUN npm install

# bcrypt modülünü yeniden derleyin
RUN npm rebuild bcrypt --build-from-source

# Projedeki tüm dosyaları imaj içine kopyalayın
COPY . .

# Uygulamanızın hangi portta çalıştığını belirtin (örneğin, 3005)
EXPOSE 3005

# Uygulamanızı başlatmak için kullanılacak komut
CMD ["node", "app.js"]

