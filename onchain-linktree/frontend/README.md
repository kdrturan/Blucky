# 🔗 OnChain LinkTree Frontend

Modern, beautiful frontend for your decentralized LinkTree on Sui blockchain.

## 🎨 Features

- ✅ **Wallet Integration**: Connect with Sui wallets using dApp Kit
- ✅ **Profile Management**: Create, view, and edit profiles
- ✅ **Link Management**: Add, update, and remove links
- ✅ **Theme Customization**: 5 beautiful themes to choose from
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Real-time Updates**: Using Sui RPC and React Query
- ✅ **Beautiful UI**: Gradient backgrounds, smooth animations, modern design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Deployed smart contract (see `/contracts` folder)

### Installation

```bash
# Install dependencies
npm install

# Configure your contract
# Edit src/config/constants.ts and add your PACKAGE_ID and REGISTRY_ID

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Configuration

Update `src/config/constants.ts` with your deployed contract details:

```typescript
export const PACKAGE_ID = '0xYOUR_PACKAGE_ID_HERE'
export const REGISTRY_ID = '0xYOUR_REGISTRY_ID_HERE'
```

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Sui dApp Kit** - Wallet connection & blockchain interaction
- **Sui TypeScript SDK** - Transaction building
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Routing

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── Toaster.tsx       # Toast notifications
│   │   ├── Navbar.tsx            # Navigation bar with wallet
│   │   ├── LinkCard.tsx          # Link display component
│   │   └── ProfileCard.tsx       # Profile preview card
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page
│   │   ├── CreateProfilePage.tsx # Create profile form
│   │   ├── ProfilePage.tsx       # View profile
│   │   └── EditProfilePage.tsx   # Edit profile & links
│   ├── config/
│   │   └── constants.ts          # Contract addresses & config
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎯 Features Breakdown

### 1. Home Page
- Hero section with call-to-action
- Feature highlights
- "How it works" section
- Wallet connection prompt

### 2. Create Profile
- Username input
- Bio textarea
- Avatar URL/IPFS CID input
- Theme selection (5 themes)
- Transaction submission
- Automatic redirect to profile

### 3. View Profile
- Display profile information
- Show all links
- Share button (copy link)
- Edit button (for owners)
- Theme-based header
- Explorer link

### 4. Edit Profile
- Update bio
- Update avatar
- Change theme
- Add new links
- Edit existing links
- Delete links
- All operations as separate transactions

## 🎨 Customization

### Themes

Edit `src/config/constants.ts` to add more themes:

```typescript
export const THEMES = [
  { id: 1, name: 'Ocean Blue', gradient: 'from-blue-400 to-cyan-300' },
  { id: 2, name: 'Sunset Orange', gradient: 'from-orange-400 to-pink-400' },
  // Add more themes...
]
```

### Styling

The app uses Tailwind CSS. Customize in:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Custom CSS & utilities

### Components

All components are in `src/components/` and can be customized:
- `Navbar.tsx` - Navigation & wallet
- `LinkCard.tsx` - Link display
- `ProfileCard.tsx` - Profile preview

## 🔗 Blockchain Integration

### Using dApp Kit

```typescript
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit'

const { mutate: signAndExecute } = useSignAndExecuteTransaction()

signAndExecute(
  { transaction: tx },
  {
    onSuccess: (result) => console.log('Success!', result),
    onError: (error) => console.error('Error:', error),
  }
)
```

### Building Transactions

```typescript
import { Transaction } from '@mysten/sui/transactions'

const tx = new Transaction()
tx.moveCall({
  target: `${PACKAGE_ID}::${MODULE_NAME}::create_profile`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.pure.string(name),
    tx.pure.string(bio),
    tx.pure.string(avatarCid),
    tx.pure.u64(theme),
    tx.pure(new Uint8Array(0)), // Empty array
  ],
})
```

### Querying Data

```typescript
import { useSuiClientQuery } from '@mysten/dapp-kit'

const { data, isLoading, error } = useSuiClientQuery(
  'getObject',
  {
    id: objectId,
    options: {
      showContent: true,
      showOwner: true,
    },
  }
)
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Traditional Hosting

```bash
# Build
npm run build

# Upload dist/ folder to your server
```

## 🔧 Environment Variables

Create `.env` file (optional):

```env
VITE_PACKAGE_ID=0x...
VITE_REGISTRY_ID=0x...
VITE_NETWORK=testnet
```

Use in code:

```typescript
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '0x...'
```

## 📝 Development Tips

### Hot Reload

Vite provides instant hot module replacement. Edit any file and see changes immediately.

### TypeScript

The project uses strict TypeScript. Add proper types for better development experience.

### React Query DevTools

Add React Query DevTools for debugging:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>
```

### Console Logging

All blockchain interactions are logged to console. Check browser DevTools for debugging.

## 🐛 Troubleshooting

### Wallet Not Connecting

- Make sure you have Sui Wallet installed
- Check if you're on the correct network (testnet/mainnet)
- Try refreshing the page

### Transaction Failing

- Check if you have enough SUI for gas
- Verify PACKAGE_ID and REGISTRY_ID are correct
- Check console for error messages

### Profile Not Loading

- Verify the object ID is correct
- Check if the object exists on blockchain
- Try viewing on Sui Explorer

## 📚 Resources

- [Sui dApp Kit Docs](https://sdk.mystenlabs.com/dapp-kit)
- [Sui TypeScript SDK](https://sdk.mystenlabs.com/typescript)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT

---

Built with ❤️ on Sui

