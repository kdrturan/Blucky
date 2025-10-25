# 🔧 Byte Array Decode Sorunu Düzeltildi

## ❌ Sorun

Profil sayfasında veriler şu şekilde görünüyordu:
```
68,195,182,110,101,114
```

Bu sayılar aslında **UTF-8 byte array** formatındaydı ve decode edilmiyordu.

---

## 🔍 Neden Böyle Oluyor?

### Move (Smart Contract) Tarafı

Move'da string'ler `vector<u8>` (byte array) olarak saklanır:

```move
public struct Profile has key {
    id: UID,
    name: vector<u8>,      // ← Byte array!
    bio: vector<u8>,       // ← Byte array!
    avatar_cid: vector<u8>, // ← Byte array!
    // ...
}
```

### Blockchain'den Gelen Data

JavaScript'te bu data şöyle gelir:

```javascript
{
  name: [68, 195, 182, 110, 101, 114],  // Byte array
  bio: [72, 101, 108, 108, 111],        // Byte array
  // ...
}
```

### Decode Gerekli

Bu byte array'leri **TextDecoder** ile string'e çevirmemiz gerekiyor:

```javascript
const decoder = new TextDecoder()
const name = decoder.decode(new Uint8Array([68, 195, 182, 110, 101, 114]))
// Result: "Döner" (UTF-8 decoded)
```

---

## ✅ Çözüm

### 1. ProfilePage.tsx - Güncellendi

**Önce (❌ Yanlış):**
```typescript
const name = content.name || 'Unknown'
const bio = content.bio || ''
```

**Sonra (✅ Doğru):**
```typescript
const decoder = new TextDecoder()
const name = content.name 
  ? decoder.decode(new Uint8Array(content.name)) 
  : 'Unknown'
const bio = content.bio 
  ? decoder.decode(new Uint8Array(content.bio)) 
  : ''
```

### 2. EditProfilePage.tsx - Güncellendi

**Önce (❌ Yanlış):**
```typescript
setBio(content.bio || '')
setAvatarCid(content.avatar_cid || '')
```

**Sonra (✅ Doğru):**
```typescript
const decoder = new TextDecoder()
const decodedBio = content.bio 
  ? decoder.decode(new Uint8Array(content.bio)) 
  : ''
const decodedAvatar = content.avatar_cid 
  ? decoder.decode(new Uint8Array(content.avatar_cid)) 
  : ''

setBio(decodedBio)
setAvatarCid(decodedAvatar)
```

### 3. HomePage.tsx - Zaten Doğruydu ✅

HomePage'de decode zaten yapılıyordu:

```typescript
const name = new TextDecoder().decode(
  new Uint8Array(fields.name || [])
)
```

---

## 📋 Düzeltilen Yerler

### ProfilePage.tsx

**Satır 90-96:**
```typescript
// Decode byte arrays to strings
const decoder = new TextDecoder()
const name = content.name ? decoder.decode(new Uint8Array(content.name)) : 'Unknown'
const bio = content.bio ? decoder.decode(new Uint8Array(content.bio)) : ''
const avatarCid = content.avatar_cid ? decoder.decode(new Uint8Array(content.avatar_cid)) : ''
const theme = Number(content.theme || 1)
const links = content.links || []
```

**Satır 174-193 (Link Decode):**
```typescript
links.map((link: any, index: number) => {
  // Decode link label and url
  const linkLabel = link.fields?.label || link.label
  const linkUrl = link.fields?.url || link.url
  
  const decodedLabel = linkLabel 
    ? decoder.decode(new Uint8Array(linkLabel)) 
    : 'Untitled'
  const decodedUrl = linkUrl 
    ? decoder.decode(new Uint8Array(linkUrl)) 
    : '#'
  
  return (
    <LinkCard
      key={index}
      label={decodedLabel}
      url={decodedUrl}
    />
  )
})
```

### EditProfilePage.tsx

**Satır 48-82 (useEffect):**
```typescript
useEffect(() => {
  if (profileData?.data?.content) {
    const content = profileData.data.content.fields
    const decoder = new TextDecoder()
    
    // Decode byte arrays
    const decodedBio = content.bio 
      ? decoder.decode(new Uint8Array(content.bio)) 
      : ''
    const decodedAvatar = content.avatar_cid 
      ? decoder.decode(new Uint8Array(content.avatar_cid)) 
      : ''
    
    setBio(decodedBio)
    setAvatarCid(decodedAvatar)
    setTheme(Number(content.theme || 1))

    const existingLinks = content.links || []
    setLinks(
      existingLinks.map((link: any, index: number) => {
        const linkLabel = link.fields?.label || link.label
        const linkUrl = link.fields?.url || link.url
        
        return {
          id: Math.random().toString(),
          label: linkLabel ? decoder.decode(new Uint8Array(linkLabel)) : '',
          url: linkUrl ? decoder.decode(new Uint8Array(linkUrl)) : '',
          index,
        }
      })
    )
  }
}, [profileData])
```

---

## 🎯 TextDecoder Nedir?

### JavaScript TextDecoder API

```typescript
const decoder = new TextDecoder('utf-8')  // UTF-8 encoding
const bytes = new Uint8Array([68, 195, 182, 110, 101, 114])
const text = decoder.decode(bytes)
console.log(text)  // Output: "Döner"
```

### Uint8Array Nedir?

```typescript
// Byte array'i typed array'e çevir
const byteArray = [72, 101, 108, 108, 111]
const uint8Array = new Uint8Array(byteArray)
// uint8Array şimdi TextDecoder tarafından decode edilebilir
```

### UTF-8 Encoding

```
Character: D     ö     n     e     r
Byte:      68    195   182   110   101   114
           (1)   (2 bytes)  (1)   (1)   (1)
```

**Türkçe karakterler (ö, ü, ş, etc.) 2 byte kullanır!**

---

## 📊 Örnek Data Flow

### 1. Smart Contract'tan Veri Gelişi

```javascript
// Blockchain response
{
  data: {
    content: {
      fields: {
        name: [68, 195, 182, 110, 101, 114],  // "Döner"
        bio: [84, 117, 114, 107],              // "Turk"
        links: [
          {
            label: [84, 119, 105, 116, 116, 101, 114],  // "Twitter"
            url: [104, 116, 116, 112, 115, ...]          // "https://..."
          }
        ]
      }
    }
  }
}
```

### 2. Decode İşlemi

```typescript
const decoder = new TextDecoder()

// Name decode
const nameBytes = [68, 195, 182, 110, 101, 114]
const name = decoder.decode(new Uint8Array(nameBytes))
// Result: "Döner" ✅

// Bio decode
const bioBytes = [84, 117, 114, 107]
const bio = decoder.decode(new Uint8Array(bioBytes))
// Result: "Turk" ✅
```

### 3. UI'da Görüntüleme

```jsx
<h1>{name}</h1>        {/* "Döner" gösterilir */}
<p>{bio}</p>           {/* "Turk" gösterilir */}
```

---

## 🔍 Debug İpuçları

### Byte Array mı String mi Kontrol Et

```typescript
console.log('Type:', typeof data)
console.log('Is Array:', Array.isArray(data))
console.log('First element:', data[0])

// Eğer:
// Type: object
// Is Array: true
// First element: 68 (number)
// → Bu bir byte array! Decode et!
```

### Decode Sonucunu Kontrol Et

```typescript
const decoder = new TextDecoder()
const decoded = decoder.decode(new Uint8Array(data))
console.log('Decoded:', decoded)
console.log('Length:', decoded.length)
```

### Türkçe Karakter Testi

```typescript
// Türkçe karakter içeren string
const text = "Döner"
const encoder = new TextEncoder()
const bytes = encoder.encode(text)
console.log('Bytes:', Array.from(bytes))
// Output: [68, 195, 182, 110, 101, 114]

const decoded = new TextDecoder().decode(bytes)
console.log('Decoded:', decoded)
// Output: "Döner" ✅
```

---

## ✅ Test Etme

### 1. Profile Oluştur

```
1. Create Profile
2. Name: "Döner" (Türkçe karakter kullan)
3. Bio: "Merhaba dünya" (Türkçe karakterler)
4. Submit
```

### 2. Profile Görüntüle

```
1. View Profile
2. ✅ Name doğru görünmeli: "Döner"
3. ✅ Bio doğru görünmeli: "Merhaba dünya"
4. ❌ Byte array görünmemeli: [68,195,182...]
```

### 3. Profile Düzenle

```
1. Edit Profile
2. ✅ Form'da mevcut değerler doğru yüklenmeli
3. ✅ Türkçe karakterler korunmalı
4. Güncelle ve kaydet
```

---

## 🎯 Best Practices

### 1. Her Zaman Decode Et

```typescript
// ✅ Doğru
const name = content.name 
  ? decoder.decode(new Uint8Array(content.name)) 
  : 'Default'

// ❌ Yanlış
const name = content.name || 'Default'  // Byte array kalır!
```

### 2. Null/Undefined Check

```typescript
// ✅ Doğru - Önce kontrol et
if (content.name) {
  const decoded = decoder.decode(new Uint8Array(content.name))
}

// ❌ Yanlış - Hata verir!
const decoded = decoder.decode(new Uint8Array(content.name))
```

### 3. Reusable Decoder

```typescript
// ✅ Doğru - Bir kere oluştur, çok kere kullan
const decoder = new TextDecoder()
const name = decoder.decode(...)
const bio = decoder.decode(...)
const avatar = decoder.decode(...)

// ⚠️ Gereksiz - Her seferinde yeni decoder
const name = new TextDecoder().decode(...)
const bio = new TextDecoder().decode(...)
```

### 4. Helper Function

```typescript
// Reusable decode helper
function decodeBytes(bytes: number[] | undefined, fallback: string = ''): string {
  if (!bytes || bytes.length === 0) return fallback
  return new TextDecoder().decode(new Uint8Array(bytes))
}

// Kullanım
const name = decodeBytes(content.name, 'Unknown')
const bio = decodeBytes(content.bio, '')
```

---

## 📚 Referanslar

### TextDecoder API
- [MDN TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
- [MDN Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

### Sui Move Strings
- Move'da string'ler `vector<u8>` olarak saklanır
- UTF-8 encoding kullanılır
- Blockchain'den byte array olarak gelir

---

## ✅ Sonuç

- [x] ProfilePage.tsx düzeltildi
- [x] EditProfilePage.tsx düzeltildi
- [x] Link decode eklendi
- [x] Türkçe karakter desteği ✅
- [x] Lint hatasız
- [x] Production ready!

**Artık tüm string'ler düzgün görünüyor! 🎉**

