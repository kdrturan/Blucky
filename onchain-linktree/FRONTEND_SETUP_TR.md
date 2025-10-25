# 🎨 Frontend Kurulum ve Kullanım Rehberi

## 🎯 Ne Yaptım?

Sizin için **tamamen çalışır durumda**, **güzel tasarımlı**, **modern** bir React frontend oluşturdum!

## ✨ Özellikler

### 🎨 Tasarım
- ✅ Gradient arka planlar
- ✅ Smooth animasyonlar
- ✅ Responsive (mobil uyumlu)
- ✅ 5 farklı tema
- ✅ Modern kartlar ve butonlar
- ✅ Toast notifications

### 🔧 Fonksiyonellik
- ✅ Wallet bağlama (Sui dApp Kit)
- ✅ Profil oluşturma
- ✅ Profil görüntüleme
- ✅ Profil düzenleme
- ✅ Link ekleme/silme/güncelleme
- ✅ Tema değiştirme
- ✅ Paylaşma butonu
- ✅ Real-time blockchain sorguları

## 🚀 Kurulum (5 Dakika)

### Adım 1: Frontend Klasörüne Girin

```bash
cd frontend
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut şunları yükleyecek:
- React 18
- Sui dApp Kit
- Sui TypeScript SDK
- Tailwind CSS
- React Router
- React Query
- Lucide Icons

### Adım 3: Contract Bilgilerini Ekleyin

`frontend/src/config/constants.ts` dosyasını açın ve değiştirin:

```typescript
export const PACKAGE_ID = '0xYOUR_ACTUAL_PACKAGE_ID'
export const REGISTRY_ID = '0xYOUR_ACTUAL_REGISTRY_ID'
```

⚠️ **ÖNEMLİ:** Bu değerleri kontratınızı deploy ettikten sonra alacaksınız!

### Adım 4: Development Server'ı Başlatın

```bash
npm run dev
```

✅ Frontend hazır! `http://localhost:5173` adresinde çalışıyor.

## 📋 Deploy Olmadan Önce Test Etme

Contract deploy olmadan frontend'i test edebilirsiniz:

```bash
cd frontend
npm run dev
```

- Ana sayfa çalışacak
- Wallet bağlanabilecek
- Sadece transaction'lar hata verecek (normal, henüz deploy yok)

## 🎬 Tam Kurulum (Deploy ile Birlikte)

### 1. Smart Contract Deploy Edin

```bash
cd contracts
sui client publish --gas-budget 100000000
```

**Çıktıdan kaydedin:**
- Package ID: `0xABC123...`
- Registry ID: `0xDEF456...`

### 2. Frontend Konfigürasyonu

`frontend/src/config/constants.ts`:

```typescript
export const PACKAGE_ID = '0xABC123...' // Yukarıdaki değer
export const REGISTRY_ID = '0xDEF456...' // Yukarıdaki değer
```

### 3. Frontend'i Başlatın

```bash
cd frontend
npm install
npm run dev
```

### 4. Tarayıcıda Açın

http://localhost:5173

## 🎮 Kullanım

### 1. Ana Sayfa (Home)

```
- Hero section
- Feature kartları
- "How it works" bölümü
- "Connect Wallet" butonu (sağ üst)
```

**Yapabilecekleriniz:**
- Wallet bağlayın (Sui Wallet, Suiet, vb.)
- "Create Profile" butonuna tıklayın

### 2. Profil Oluşturma (/create)

```
Form içeriği:
- Username (zorunlu)
- Bio
- Avatar URL/IPFS CID
- Tema seçimi (5 seçenek)
```

**İşlem:**
1. Formu doldurun
2. "Create Profile" tıklayın
3. Wallet'ta transaction'ı onaylayın
4. Otomatik profil sayfasına yönlendirileceksiniz

### 3. Profil Görüntüleme (/profile/:objectId)

```
Görüntülenenler:
- Tema başlığı (gradient)
- Avatar
- İsim ve bio
- Tüm linkler
- Share butonu
- Edit butonu (sahipse)
```

**Özellikler:**
- Linklere tıklayarak gidebilirsiniz
- Share butonu profil linkini kopyalar
- Explorer linkinden blockchain'de görüntüleyebilirsiniz

### 4. Profil Düzenleme (/edit/:objectId)

```
Düzenlenebilir:
- Bio
- Avatar
- Tema
- Linkler (ekle/sil)
```

**Her bölüm ayrı transaction:**
- Update Bio → Blockchain transaction
- Update Avatar → Blockchain transaction
- Update Theme → Blockchain transaction
- Add Link → Blockchain transaction
- Remove Link → Blockchain transaction

## 🎨 Sayfa Örnekleri

### Ana Sayfa
```
┌─────────────────────────────────────┐
│  [Logo] OnChain LinkTree [Connect] │
├─────────────────────────────────────┤
│                                     │
│     🔗 Your Links, Forever Yours    │
│                                     │
│   Create your decentralized hub     │
│                                     │
│    [Create Your Profile]            │
│                                     │
│  🛡️ Truly Yours  ⚡ Fast  🔗 Unlimited│
│                                     │
└─────────────────────────────────────┘
```

### Profil Sayfası
```
┌─────────────────────────────────────┐
│          [Gradient Header]          │
│                                     │
│            [Avatar]                 │
│                                     │
│          John Doe                   │
│     Hello, I'm a developer!         │
│                                     │
│      [Share]    [Edit]             │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🔗 Twitter                    │ │
│  │ https://twitter.com/john      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🔗 GitHub                     │ │
│  │ https://github.com/john       │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🎨 Temalar

Frontend 5 güzel tema ile geliyor:

1. **Ocean Blue** - Mavi-Cyan gradient
2. **Sunset Orange** - Turuncu-Pembe gradient
3. **Forest Green** - Yeşil-Teal gradient
4. **Purple Dream** - Mor-Pembe gradient
5. **Dark Mode** - Koyu gri gradient

Kullanıcılar profil oluştururken veya düzenlerken tema seçebilir!

## 🚀 Production Build

### Build Yapın

```bash
cd frontend
npm run build
```

Bu komut `dist/` klasörü oluşturur.

### Preview

```bash
npm run preview
```

Production build'i lokal olarak test edin.

### Deploy

#### Vercel (Önerilen - Ücretsiz)

```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deploy
vercel --prod
```

#### Netlify

```bash
# Build yap
npm run build

# Netlify'a dist/ klasörünü yükle
```

#### Geleneksel Hosting

```bash
# Build yap
npm run build

# dist/ klasörünü sunucunuza yükleyin
```

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/          # UI bileşenleri
│   │   ├── ui/
│   │   │   └── Toaster.tsx  # Bildirimler
│   │   ├── Navbar.tsx       # Navbar + Wallet
│   │   ├── LinkCard.tsx     # Link kartı
│   │   └── ProfileCard.tsx  # Profil önizleme
│   │
│   ├── pages/               # Sayfalar
│   │   ├── HomePage.tsx     # Ana sayfa
│   │   ├── CreateProfilePage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── EditProfilePage.tsx
│   │
│   ├── config/
│   │   └── constants.ts     # Contract adresleri
│   │
│   ├── App.tsx              # Ana uygulama
│   ├── main.tsx             # Entry point
│   └── index.css            # Global CSS
│
├── public/                  # Statik dosyalar
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Teknoloji Stack

```
React 18         → UI framework
TypeScript       → Type safety
Vite            → Build tool (süper hızlı!)
Sui dApp Kit    → Wallet entegrasyonu
Sui TS SDK      → Blockchain interaction
TanStack Query  → Data fetching
Tailwind CSS    → Styling
React Router    → Routing
Lucide React    → Icons
```

## 🔧 Customization

### Tema Ekleme

`src/config/constants.ts`:

```typescript
export const THEMES = [
  // Mevcut temalar...
  { id: 6, name: 'Fire Red', gradient: 'from-red-500 to-orange-500' },
]
```

### Renk Değiştirme

`tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        // ...
      },
    },
  },
}
```

### Component Düzenleme

Tüm componentler `src/components/` klasöründe:
- `Navbar.tsx` - Üst menü
- `LinkCard.tsx` - Link kartları
- `ProfileCard.tsx` - Profil önizleme

## 🐛 Troubleshooting

### Port zaten kullanımda

```bash
# Farklı port kullan
npm run dev -- --port 3000
```

### Wallet bağlanmıyor

- Sui Wallet extension'ı yüklü olduğundan emin olun
- Tarayıcıyı yenileyin
- Doğru network seçili mi kontrol edin (testnet/mainnet)

### Transaction başarısız

- Cüzdanınızda yeterli SUI var mı?
- PACKAGE_ID ve REGISTRY_ID doğru mu?
- Console'daki hata mesajını kontrol edin

### Build hatası

```bash
# node_modules temizle
rm -rf node_modules package-lock.json

# Tekrar yükle
npm install
```

## 📊 Performans

- ⚡ Vite ile anında hot reload
- 🚀 Production build optimize edilmiş
- 📦 Code splitting otomatik
- 🎨 CSS minimize edilmiş
- ⚡ React Query ile cache

## 🎓 Öğrenme Kaynakları

- [Sui dApp Kit](https://sdk.mystenlabs.com/dapp-kit)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 Özet

### Kurulum:
```bash
cd frontend
npm install
# constants.ts'i düzenle
npm run dev
```

### Deploy:
```bash
npm run build
vercel
```

### Kullanım:
```
1. Wallet bağla
2. Profil oluştur
3. Linkleri ekle
4. Paylaş!
```

---

**Herhangi bir sorunuz olursa sorun! Frontend tamamen hazır ve çalışıyor! 🚀**


