# 🧪 Sui Move Modülü Test Rehberi

## 🚀 Kurulum (Windows)

### 1. Rust Kurulumu

1. **Rust'ı indirin ve kurun:**
   - https://rustup.rs/ adresine gidin
   - `rustup-init.exe` dosyasını indirin
   - Çalıştırın ve varsayılan ayarlarla kurulumu tamamlayın
   - Terminal/PowerShell'i kapatıp tekrar açın

2. **Rust kurulumunu kontrol edin:**
   ```bash
   cargo --version
   rustc --version
   ```

### 2. Sui CLI Kurulumu

**Seçenek A: Cargo ile kurulum (Önerilen)**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

Bu işlem 10-20 dakika sürebilir. ☕

**Seçenek B: Önceden derlenmiş binary (Daha hızlı)**
1. https://github.com/MystenLabs/sui/releases adresine gidin
2. En son release'i bulun
3. `sui-mainnet-windows-x86_64.zip` dosyasını indirin
4. ZIP'i açın ve `sui.exe` dosyasını PATH'inizdeki bir klasöre koyun

### 3. Kurulumu Doğrulama
```bash
sui --version
```

## 🧪 Testleri Çalıştırma

### Move Unit Testleri

```bash
cd contracts
sui move test
```

Bu komut şu testleri çalıştıracak:
- ✅ `test_create_and_owner_update_allowed` - Sahip profil güncelleyebilir
- ❌ `test_non_owner_update_aborts` - Sahip olmayan güncelleyemez

### Verbose Test Çıktısı
```bash
sui move test --verbose
```

### Belirli Bir Testi Çalıştırma
```bash
sui move test test_create_and_owner_update_allowed
```

### Test Coverage
```bash
sui move test --coverage
```

## 🏗️ Build (Derleme)

Modülü derlemek için:
```bash
cd contracts
sui move build
```

Başarılı olursa şunu göreceksiniz:
```
BUILDING onchain_linktree
```

## 🌐 Testnet'e Deploy Etme (Opsiyonel)

### 1. Sui Cüzdan Oluşturma
```bash
sui client
```

İlk çalıştırdığınızda bir cüzdan oluşturur.

### 2. Test Token Alma
```bash
sui client faucet
```

veya https://faucet.testnet.sui.io/ adresinden token isteyin

### 3. Deploy
```bash
cd contracts
sui client publish --gas-budget 100000000
```

## 🔍 Manuel Test Senaryoları

### Senaryo 1: Profil Oluşturma
```bash
# Modül deploy edildikten sonra
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function create_profile \
  --args <REGISTRY_ID> '"alice"' '"Hello World"' '"QmAvatar"' 1 '[]' \
  --gas-budget 10000000
```

### Senaryo 2: Bio Güncelleme
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function set_bio \
  --args <PROFILE_ID> '"New bio"' \
  --gas-budget 10000000
```

### Senaryo 3: Link Ekleme
```bash
sui client call \
  --package <PACKAGE_ID> \
  --module linktree \
  --function add_link \
  --args <PROFILE_ID> '"Twitter"' '"https://twitter.com/alice"' \
  --gas-budget 10000000
```

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata: "Unable to resolve packages"
**Çözüm:** Internet bağlantınızı kontrol edin ve tekrar deneyin
```bash
sui move build --skip-fetch-latest-git-deps
```

### Hata: "E_NOT_OWNER"
**Beklenen davranış:** Sadece profil sahibi değişiklik yapabilir

### Hata: "E_OUT_OF_BOUNDS"
**Çözüm:** Link index'i geçerli aralıkta olmalı (0 - links.length-1)

### Hata: "E_NAME_ALREADY_TAKEN"
**Çözüm:** Farklı bir kullanıcı adı seçin

## 📊 Test Sonuçlarını Anlama

Başarılı test çıktısı:
```
Running Move unit tests
[ PASS    ] 0x0::linktree_tests::test_create_and_owner_update_allowed
[ PASS    ] 0x0::linktree_tests::test_non_owner_update_aborts
Test result: OK. Total tests: 2; passed: 2; failed: 0
```

## 🎯 Hızlı Komutlar

```bash
# Tüm testleri çalıştır
sui move test

# Build yap
sui move build

# Test + Build
sui move build && sui move test

# Verbose test
sui move test -v

# Coverage raporu
sui move test --coverage
```

## 📝 Test Edilen Özellikler

Modülümüz şu özellikleri test eder:

### ✅ Pozitif Testler
- Profil oluşturma
- Sahip olarak bio güncelleme
- Link ekleme/güncelleme/silme
- Profil transfer etme

### ❌ Negatif Testler
- Sahip olmayan biri güncelleme yapmaya çalışırsa → E_NOT_OWNER
- Geçersiz index ile link işlemi → E_OUT_OF_BOUNDS
- Aynı isimle profil oluşturma → E_NAME_ALREADY_TAKEN

## 💡 İpuçları

1. **Her değişiklikten sonra test edin:**
   ```bash
   sui move test
   ```

2. **Detaylı hata mesajları için:**
   ```bash
   sui move test --verbose
   ```

3. **Sadece bir modülü test etmek için:**
   ```bash
   sui move test --filter linktree_tests
   ```

4. **Gas maliyetlerini görüntülemek için:**
   ```bash
   sui move build --with-unpublished-dependencies
   ```

## 🔗 Faydalı Linkler

- Sui Dokümantasyonu: https://docs.sui.io/
- Sui GitHub: https://github.com/MystenLabs/sui
- Sui Explorer (Testnet): https://suiexplorer.com/?network=testnet
- Sui Discord: https://discord.gg/sui

## ❓ Sorun mu Yaşıyorsunuz?

Eğer testler çalışmıyorsa:
1. `sui move build` komutunu çalıştırın ve hataları kontrol edin
2. `Move.toml` dosyasının doğru yapılandırıldığından emin olun
3. Sui CLI'nin en son versiyonunu kullandığınızdan emin olun
4. GitHub Issues'da benzer sorunları arayın

