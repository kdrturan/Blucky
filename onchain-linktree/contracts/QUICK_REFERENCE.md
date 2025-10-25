# ⚡ Hızlı Referans - Test Komutları

## 🎯 En Çok Kullanılan Komutlar

```bash
# Test et
sui move test

# Derle
sui move build

# Her ikisi
sui move build && sui move test

# Detaylı çıktı
sui move test -v
```

## 🧪 Test Komutları

```bash
# Tüm testleri çalıştır
sui move test

# Verbose mode (detaylı)
sui move test --verbose

# Belirli bir test
sui move test test_create_and_owner_update_allowed

# Test coverage
sui move test --coverage

# Filter ile test (isim içeren)
sui move test --filter linktree
```

## 🏗️ Build Komutları

```bash
# Normal build
sui move build

# Bağımlılıkları atlayarak
sui move build --skip-fetch-latest-git-deps

# Yayınlanmamış bağımlılıklarla
sui move build --with-unpublished-dependencies

# Temiz build (cache temizle)
sui move clean && sui move build
```

## 🌐 Deployment Komutları

```bash
# Client'ı başlat
sui client

# Active address'i göster
sui client active-address

# Test token al (testnet)
sui client faucet

# Publish et
sui client publish --gas-budget 100000000

# Testnet'e geç
sui client switch --env testnet

# Mainnet'e geç
sui client switch --env mainnet

# Devnet'e geç
sui client switch --env devnet
```

## 🔍 Sorgulama Komutları

```bash
# Object'leri listele
sui client objects

# Belirli bir object'i göster
sui client object <OBJECT_ID>

# Gas objelerini göster
sui client gas

# Transaction geçmişi
sui client transactions
```

## 📞 Fonksiyon Çağırma

### Profil Oluşturma
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function create_profile \
  --args <REGISTRY_ID> '"alice"' '"Bio text"' '"QmAvatar"' 1 '[]' \
  --gas-budget 10000000
```

### Bio Güncelleme
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function set_bio \
  --args <PROFILE_ID> '"New bio"' \
  --gas-budget 5000000
```

### Link Ekleme
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function add_link \
  --args <PROFILE_ID> '"Twitter"' '"https://twitter.com/alice"' \
  --gas-budget 5000000
```

### Link Güncelleme (index 0)
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function update_link_at \
  --args <PROFILE_ID> 0 '"GitHub"' '"https://github.com/alice"' \
  --gas-budget 5000000
```

### Link Silme (index 0)
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function remove_link_at \
  --args <PROFILE_ID> 0 \
  --gas-budget 5000000
```

### Tema Değiştirme
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function set_theme \
  --args <PROFILE_ID> 2 \
  --gas-budget 5000000
```

### Avatar Güncelleme
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function set_avatar \
  --args <PROFILE_ID> '"QmNewAvatar"' \
  --gas-budget 5000000
```

### Profil Transfer
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function transfer_profile \
  --args <PROFILE_ID> <NEW_OWNER_ADDRESS> \
  --gas-budget 5000000
```

## 🔧 Utility Komutları

```bash
# Sui versiyonu
sui --version

# Yardım
sui --help
sui move --help
sui client --help

# Cüzdan adresleri
sui client addresses

# Yeni adres oluştur
sui client new-address ed25519

# Active environment'ı göster
sui client active-env

# Enviroment'ları listele
sui client envs
```

## 📊 Explorer Linkleri

```bash
# Testnet Explorer
https://suiexplorer.com/?network=testnet

# Mainnet Explorer
https://suiexplorer.com/?network=mainnet

# Devnet Explorer
https://suiexplorer.com/?network=devnet
```

## 🐛 Debug Komutları

```bash
# Move analyzer çalıştır
sui move build --lint

# Bytecode'u göster
sui move build --dump-bytecode-as-base64

# Dependency graph
sui move build --print-diags-to-stderr
```

## 💰 Gas Budget Önerileri

| İşlem | Gas Budget |
|-------|------------|
| `create_profile` | 10,000,000 |
| `set_bio` / `set_avatar` / `set_theme` | 5,000,000 |
| `add_link` | 5,000,000 |
| `update_link_at` | 5,000,000 |
| `remove_link_at` | 5,000,000 |
| `set_links` | 7,000,000 |
| `transfer_profile` | 5,000,000 |
| `update_owner` | 3,000,000 |
| **Publish** | 100,000,000 |

## 🎨 Test Çıktısı Renk Kodları

```
✅ [ PASS    ] - Test başarılı
❌ [ FAIL    ] - Test başarısız
⏭️  [ SKIP    ] - Test atlandı
🔄 [ TIMEOUT ] - Zaman aşımı
```

## 📝 Örnek Test Senaryosu

```bash
# 1. Build
sui move build

# 2. Test
sui move test -v

# 3. Deploy (testnet)
sui client switch --env testnet
sui client faucet
sui client publish --gas-budget 100000000

# 4. Registry ID'yi al
sui client objects

# 5. Profil oluştur
sui client call --package $PKG --module linktree \
  --function create_profile \
  --args $REGISTRY '"test"' '"Hello"' '"QmTest"' 1 '[]' \
  --gas-budget 10000000

# 6. Profile ID'yi al
sui client objects

# 7. Link ekle
sui client call --package $PKG --module linktree \
  --function add_link \
  --args $PROFILE '"Twitter"' '"https://twitter.com"' \
  --gas-budget 5000000

# 8. Explorer'da kontrol et
# https://suiexplorer.com/object/$PROFILE_ID?network=testnet
```

## 🚨 Yaygın Hatalar

| Hata | Çözüm |
|------|-------|
| `E_NOT_OWNER` | Sadece sahip işlem yapabilir |
| `E_OUT_OF_BOUNDS` | Geçersiz link index |
| `E_NAME_ALREADY_TAKEN` | İsim kullanımda, farklı isim seç |
| `InsufficientGas` | Gas budget artır |
| `ObjectNotFound` | Object ID'yi kontrol et |
| `PackageNotFound` | Package ID'yi kontrol et |

## 🔗 Hızlı Linkler

- Faucet: https://faucet.testnet.sui.io/
- Docs: https://docs.sui.io/
- Discord: https://discord.gg/sui
- GitHub: https://github.com/MystenLabs/sui

---

💡 **İpucu:** Bu dosyayı yer imi olarak kaydedin ve sık sık referans olarak kullanın!


