# 🏗️ Frontend Mimari - İyileştirilmiş Versiyon

## 📂 Yeni Yapı

```
frontend/src/
├── components/           # UI bileşenleri
├── pages/               # Sayfa bileşenleri
├── config/
│   └── constants.ts     # ⭐ Contract adresleri (BURADAN YÖNETİLİYOR)
├── hooks/
│   └── useContract.ts   # ⭐ Contract hooks ve helpers
├── utils/
│   └── transaction.ts   # ⭐ Transaction utilities
└── ...
```

---

## ⭐ Yeni Özellikler

### 1️⃣ Merkezi Contract Yönetimi

**`hooks/useContract.ts`**

```typescript
import { useContract } from '@/hooks/useContract'

function MyComponent() {
  const contract = useContract()
  
  // ✅ Package ID
  console.log(contract.packageId)
  
  // ✅ Registry ID
  console.log(contract.registryId)
  
  // ✅ Function target
  const target = contract.getTarget('create_profile_simple')
  // Output: "0x9d52...::linktree::create_profile_simple"
  
  // ✅ Config validation
  if (!contract.isConfigured()) {
    console.error('Contract not configured!')
  }
}
```

**Avantajları:**
- ✅ Tek bir yerden yönetim
- ✅ Otomatik validation
- ✅ Type-safe
- ✅ Kolay test edilebilir

---

### 2️⃣ Transaction Utilities

**`utils/transaction.ts`**

#### A) Profile ID Çıkarma

```typescript
import { extractProfileId } from '@/utils/transaction'

signAndExecute(
  { transaction: tx },
  {
    onSuccess: (result) => {
      const profileId = extractProfileId(result)
      console.log('Profile ID:', profileId)
      // Output: "0x7c3e4d2f..."
    }
  }
)
```

#### B) Transaction Logging

```typescript
import { logTransactionResult } from '@/utils/transaction'

onSuccess: (result) => {
  logTransactionResult(result, 'Create Profile')
}

// Console output:
// 🔗 Transaction: Create Profile
//   ✅ Status: Success
//   📋 Digest: 0x9d8f2a1b...
//   ⛽ Gas Used: 1234567
//   🆕 Created Objects: ["0x7c3e4d2f..."]
//   ✨ Profile ID: 0x7c3e4d2f...
//   🔗 View on Explorer: https://suiexplorer.com/...
```

#### C) Address Formatting

```typescript
import { formatAddress } from '@/utils/transaction'

const address = "0x9d529f55d5d33e608614a4027259662db5aa9b3199d753aab196f0c5385fc590"
console.log(formatAddress(address))
// Output: "0x9d52...c590"

console.log(formatAddress(address, 6))
// Output: "0x9d529f...5fc590"
```

#### D) Explorer Links

```typescript
import { getExplorerTxUrl, getExplorerObjectUrl } from '@/utils/transaction'

// Transaction link
const txUrl = getExplorerTxUrl(digest, 'testnet')
// https://suiexplorer.com/txblock/0x...?network=testnet

// Object link
const objUrl = getExplorerObjectUrl(profileId, 'testnet')
// https://suiexplorer.com/object/0x...?network=testnet
```

#### E) Gas Calculation

```typescript
import { getGasUsed } from '@/utils/transaction'

onSuccess: (result) => {
  const gas = getGasUsed(result)
  console.log(`Gas used: ${gas} MIST`)
}
```

---

### 3️⃣ İyileştirilmiş Toast Bildirimleri

**Önceki:**
```typescript
toast.success('Profile created!')
```

**Yeni:**
```typescript
toast.success(
  <div className="space-y-1">
    <p className="font-semibold">Profile Created! 🎉</p>
    <p className="text-xs">ID: {formatAddress(profileId)}</p>
    <a 
      href={getExplorerTxUrl(result.digest)}
      target="_blank"
      className="text-blue-500 hover:underline text-xs"
    >
      View on Explorer →
    </a>
  </div>
)
```

**Sonuç:**
```
┌────────────────────────────────┐
│ Profile Created! 🎉            │
│ ID: 0x7c3e...2f                │
│ View on Explorer →             │
└────────────────────────────────┘
```

---

## 🎯 Kullanım Örnekleri

### Örnek 1: Profile Oluşturma

```typescript
import { useContract, CONTRACT_FUNCTIONS } from '@/hooks/useContract'
import { logTransactionResult, extractProfileId } from '@/utils/transaction'

export default function CreateProfile() {
  const contract = useContract()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const handleCreate = async () => {
    // 1. Validate config
    if (!contract.isConfigured()) {
      toast.error('Contract not configured!')
      return
    }

    // 2. Build transaction
    const tx = new Transaction()
    tx.moveCall({
      target: contract.getTarget(CONTRACT_FUNCTIONS.CREATE_PROFILE_SIMPLE),
      arguments: [
        tx.object(contract.registryId),
        tx.pure.string('username'),
        tx.pure.string('bio'),
        tx.pure.string('avatar'),
        tx.pure.u64(1),
      ],
    })

    // 3. Execute
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          // Log transaction
          logTransactionResult(result, 'Create Profile')
          
          // Get profile ID
          const profileId = extractProfileId(result)
          
          // Navigate
          navigate(`/profile/${profileId}`)
        }
      }
    )
  }
}
```

### Örnek 2: Link Ekleme

```typescript
import { useContract } from '@/hooks/useContract'
import { formatAddress, getExplorerTxUrl } from '@/utils/transaction'

const handleAddLink = async () => {
  const tx = new Transaction()
  tx.moveCall({
    target: contract.getTarget('add_link'),
    arguments: [
      tx.object(profileId),
      tx.pure.string('Twitter'),
      tx.pure.string('https://twitter.com/user'),
    ],
  })

  signAndExecute(
    { transaction: tx },
    {
      onSuccess: (result) => {
        toast.success(
          `Link added! TX: ${formatAddress(result.digest)}`
        )
        
        console.log('View on Explorer:', getExplorerTxUrl(result.digest))
      }
    }
  )
}
```

---

## 📊 Karşılaştırma

### Önceki Yaklaşım

```typescript
// ❌ Hard-coded
const target = `${PACKAGE_ID}::${MODULE_NAME}::create_profile_simple`

// ❌ Manuel parsing
const profileObject = result.effects?.created?.find(...)
const profileId = profileObject.reference.objectId

// ❌ Basic toast
toast.success('Profile created!')

// ❌ No logging
```

### Yeni Yaklaşım

```typescript
// ✅ Merkezi yönetim
const target = contract.getTarget(CONTRACT_FUNCTIONS.CREATE_PROFILE_SIMPLE)

// ✅ Utility function
const profileId = extractProfileId(result)

// ✅ Rich toast with link
toast.success(<div>...</div>)

// ✅ Detailed logging
logTransactionResult(result, 'Create Profile')
```

---

## 🔧 Konfigürasyon

### 1. Contract Deploy

```bash
cd contracts
sui client publish --gas-budget 100000000
```

### 2. Config Güncelle

**`frontend/src/config/constants.ts`**

```typescript
export const PACKAGE_ID = '0x9d529f55...' // Deploy'dan
export const REGISTRY_ID = '0x1b63e950...' // Deploy'dan
```

### 3. Validation

```typescript
import { useContract } from '@/hooks/useContract'

const contract = useContract()
if (contract.isConfigured()) {
  console.log('✅ Contract configured!')
} else {
  console.error('❌ Contract NOT configured!')
}
```

---

## 🎯 Best Practices

### 1. Her Zaman Utility Kullanın

```typescript
// ❌ Kötü
const txId = result.digest

// ✅ İyi
const txId = getTransactionDigest(result)
```

### 2. Contract Hook Kullanın

```typescript
// ❌ Kötü
const target = `${PACKAGE_ID}::${MODULE_NAME}::function_name`

// ✅ İyi
const contract = useContract()
const target = contract.getTarget('function_name')
```

### 3. Transaction Loglayın

```typescript
// ❌ Kötü
onSuccess: (result) => {
  console.log(result)
}

// ✅ İyi
onSuccess: (result) => {
  logTransactionResult(result, 'Action Name')
}
```

### 4. Explorer Link Verin

```typescript
// ❌ Kötü
toast.success('Success!')

// ✅ İyi
toast.success(
  <div>
    Success!
    <a href={getExplorerTxUrl(result.digest)}>
      View on Explorer →
    </a>
  </div>
)
```

---

## 🚀 Sonuç

### Avantajlar:
- ✅ Daha temiz kod
- ✅ Merkezi yönetim
- ✅ Kolay debug
- ✅ Daha iyi UX
- ✅ Type-safe
- ✅ Maintainable

### Test Edin:
```bash
cd frontend
npm run dev
```

**F12 açın ve console'u kontrol edin - detaylı logları göreceksiniz! 🎉**


