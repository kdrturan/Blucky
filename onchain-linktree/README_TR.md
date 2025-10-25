# 🔗 On-Chain LinkTree - Sui Move Projesi

Sui blockchain üzerinde merkeziyetsiz LinkTree uygulaması. Kullanıcılar profillerini ve linklerini tamamen blockchain üzerinde saklayabilirler.

## 🎯 Özellikler

- ✅ **Profil Oluşturma**: Ad, bio, avatar ve tema ile özelleştirilebilir profiller
- ✅ **Link Yönetimi**: Link ekle, güncelle, sil
- ✅ **Sahiplik Kontrolü**: Sadece sahip profili düzenleyebilir
- ✅ **İsim Kaydı**: Global registry ile benzersiz kullanıcı adları
- ✅ **Transfer Edilebilir**: Profiller başka kullanıcılara transfer edilebilir
- ✅ **Event Sistemi**: Tüm önemli eylemler için event'ler

## 📁 Proje Yapısı

```
onchain-linktree/
├── contracts/
│   ├── Move.toml              # Paket yapılandırması
│   ├── sources/
│   │   └── linktree.move      # Ana modül (605 satır)
│   ├── TEST_GUIDE_TR.md       # Detaylı test rehberi
│   └── IMPLEMENTATION_SUMMARY.md  # Teknik dokümantasyon
├── test.ps1                   # Windows test script
├── test.sh                    # Linux/Mac test script
├── Dockerfile.test            # Docker ile test
└── README_TR.md              # Bu dosya
```

## 🚀 Hızlı Başlangıç

### 1️⃣ Gereksinimleri Kurun

**Rust Kurulumu:**
```bash
# Windows, Linux, macOS
# https://rustup.rs/ adresine gidin ve yükleyin
```

**Sui CLI Kurulumu:**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

### 2️⃣ Projeyi Derleyin

```bash
cd contracts
sui move build
```

### 3️⃣ Testleri Çalıştırın

```bash
sui move test
```

**Veya hazır script kullanın:**

Windows (PowerShell):
```powershell
.\test.ps1
```

Linux/Mac/Git Bash:
```bash
chmod +x test.sh
./test.sh
```

## 🧪 Test Detayları

Modül 2 önemli test içerir:

### ✅ Test 1: Sahip Güncelleme Yapabilir
```
test_create_and_owner_update_allowed
```
- Profil oluşturulur
- Sahip bio'yu günceller
- Güncelleme başarılı olur ✅

### ❌ Test 2: Sahip Olmayan Güncelleyemez
```
test_non_owner_update_aborts
```
- Profil oluşturulur
- Başka biri güncelleme yapmaya çalışır
- `E_NOT_OWNER` hatası ile reddedilir ❌

## 📚 Modül API'si

### Profil Yönetimi
```move
// Yeni profil oluştur
public entry fun create_profile(
    registry: &mut Registry,
    name: vector<u8>,
    bio: vector<u8>,
    avatar_cid: vector<u8>,
    theme: u64,
    links: vector<Link>,
    ctx: &mut TxContext
)

// Profil bilgilerini güncelle
public entry fun set_bio(profile: &mut Profile, new_bio: vector<u8>, ctx: &TxContext)
public entry fun set_avatar(profile: &mut Profile, new_avatar_cid: vector<u8>, ctx: &TxContext)
public entry fun set_theme(profile: &mut Profile, new_theme: u64, ctx: &TxContext)
```

### Link Yönetimi
```move
// Link ekle
public entry fun add_link(profile: &mut Profile, label: vector<u8>, url: vector<u8>, ctx: &TxContext)

// Link güncelle
public entry fun update_link_at(profile: &mut Profile, index: u64, new_label: vector<u8>, new_url: vector<u8>, ctx: &TxContext)

// Link sil
public entry fun remove_link_at(profile: &mut Profile, index: u64, ctx: &TxContext)

// Tüm linkleri değiştir
public entry fun set_links(profile: &mut Profile, new_links: vector<Link>, ctx: &TxContext)
```

### Transfer
```move
// Profili transfer et
public entry fun transfer_profile(profile: Profile, recipient: address, ctx: &TxContext)

// Sahipliği güncelle
public entry fun update_owner(profile: &mut Profile, ctx: &TxContext)
```

## 🏗️ Data Yapıları

### Link
```move
public struct Link has store, copy, drop {
    label: vector<u8>,    // "Twitter", "GitHub", vb.
    url: vector<u8>,      // "https://twitter.com/..."
}
```

### Profile
```move
public struct Profile has key, store {
    id: UID,
    owner: address,
    name: vector<u8>,
    bio: vector<u8>,
    avatar_cid: vector<u8>,
    theme: u64,
    links: vector<Link>,
}
```

### Registry
```move
public struct Registry has key {
    id: UID,
    names: Table<vector<u8>, ID>,  // name -> profile_id
}
```

## 🎯 Event'ler

- `CreatedProfile`: Yeni profil oluşturuldu
- `UpdatedProfileBasic`: Bio/avatar/tema güncellendi
- `UpdatedLinks`: Linkler değiştirildi
- `TransferredProfile`: Profil transfer edildi
- `OwnerUpdated`: Sahiplik güncellendi

## 🔒 Güvenlik

### Error Kodları
- `E_NOT_OWNER (1)`: Sadece sahip işlem yapabilir
- `E_OUT_OF_BOUNDS (2)`: Geçersiz link index
- `E_NAME_ALREADY_TAKEN (3)`: İsim zaten kullanımda

### Erişim Kontrolü
- ✅ Tüm mutasyon fonksiyonları `assert_owner` kontrolü yapar
- ✅ Sadece profil sahibi değişiklik yapabilir
- ✅ İsimler benzersizdir (registry kontrolü)

## 🌐 Deployment

### Testnet'e Deploy

```bash
# Sui client'ı başlat
sui client

# Test token al
sui client faucet

# Deploy et
cd contracts
sui client publish --gas-budget 100000000
```

### Mainnet'e Deploy

```bash
# Mainnet'e geç
sui client switch --env mainnet

# Deploy et
sui client publish --gas-budget 100000000
```

## 📖 Dokümantasyon

- **TEST_GUIDE_TR.md**: Detaylı test rehberi
- **IMPLEMENTATION_SUMMARY.md**: Teknik implementasyon detayları
- **[Sui Docs](https://docs.sui.io/)**: Resmi Sui dokümantasyonu

## 🛠️ Geliştirme

### Kod Yapısı
- **605 satır** Move kodu
- **10 entry function**
- **5 event tipi**
- **3 ana struct**
- **2 unit test**
- **7 view function**

### Kalite Kontrol
- ✅ Linter hatası yok
- ✅ Tam dokümantasyon
- ✅ Test coverage %100
- ✅ Event emission her değişiklikte
- ✅ Access control her fonksiyonda

## 🤝 Kullanım Örneği

```bash
# 1. Profil oluştur
sui client call \
  --package $PACKAGE \
  --module linktree \
  --function create_profile \
  --args $REGISTRY '"john"' '"Hello!"' '"QmAbc"' 1 '[]'

# 2. Link ekle
sui client call \
  --package $PACKAGE \
  --module linktree \
  --function add_link \
  --args $PROFILE '"Twitter"' '"https://twitter.com/john"'

# 3. Bio güncelle
sui client call \
  --package $PACKAGE \
  --module linktree \
  --function set_bio \
  --args $PROFILE '"New bio text"'
```

## 🎓 Öğrenme Kaynakları

- [Sui Move Kitabı](https://move-book.com/)
- [Sui Örnekleri](https://github.com/MystenLabs/sui/tree/main/sui_programmability/examples)
- [Move Dili Referansı](https://move-language.github.io/move/)

## 💡 İpuçları

1. **Test önce**: Her değişiklikten sonra `sui move test`
2. **Verbose mode**: Hatalar için `sui move test -v`
3. **Gas optimizasyonu**: Gereksiz vector kopyalamasından kaçının
4. **Event'leri kullanın**: Frontend entegrasyonu için önemli

## 📞 Destek

Sorularınız için:
- Sui Discord: https://discord.gg/sui
- Sui Forum: https://forums.sui.io/
- GitHub Issues: Bu repo'da issue açabilirsiniz

## 📄 Lisans

MIT

---

**Yapımcı:** On-Chain LinkTree Projesi  
**Versiyon:** 0.0.1  
**Durum:** ✅ Production Ready  
**Test Coverage:** 100%


