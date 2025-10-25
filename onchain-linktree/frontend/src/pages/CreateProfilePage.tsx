import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { toast } from '@/components/ui/Toaster'
import { THEMES } from '@/config/constants'
import { useContract, CONTRACT_FUNCTIONS } from '@/hooks/useContract'
import {
	extractProfileId,
	logTransactionResult,
	formatAddress,
	getExplorerTxUrl
} from '@/utils/transaction'

interface LinkInput {
	id: string
	label: string
	url: string
}

export default function CreateProfilePage() {
	const account = useCurrentAccount()
	const navigate = useNavigate()
	const { mutate: signAndExecute } = useSignAndExecuteTransaction()
	const client = useSuiClient()
	const contract = useContract()

	const [name, setName] = useState('')
	const [bio, setBio] = useState('')
	const [avatarCid, setAvatarCid] = useState('')
	const [theme, setTheme] = useState(1)
	const [links, setLinks] = useState<LinkInput[]>([])
	const [loading, setLoading] = useState(false)

	const addLink = () => {
		setLinks([...links, { id: Math.random().toString(), label: '', url: '' }])
	}

	const updateLink = (id: string, field: 'label' | 'url', value: string) => {
		setLinks(links.map(link =>
			link.id === id ? { ...link, [field]: value } : link
		))
	}

	const removeLink = (id: string) => {
		setLinks(links.filter(link => link.id !== id))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!account) {
			toast.error('Please connect your wallet first')
			return
		}

		if (!name.trim()) {
			toast.error('Please enter a username')
			return
		}

		setLoading(true)

		try {
			// Validate contract configuration
			if (!contract.isConfigured()) {
				toast.error('Contract not configured. Please check constants.ts')
				return
			}

			const tx = new Transaction()

			// Use create_profile_simple instead (no links parameter)
			tx.moveCall({
				target: contract.getTarget(CONTRACT_FUNCTIONS.CREATE_PROFILE_SIMPLE),
				arguments: [
					tx.object(contract.registryId),
					tx.pure.string(name),
					tx.pure.string(bio),
					tx.pure.string(avatarCid),
					tx.pure.u64(theme),
				],
			})

			signAndExecute(
				{
					transaction: tx,
				},
				{
					onSuccess: async (result) => {
						// Log detailed transaction info
						logTransactionResult(result, 'Create Profile')

						// Extract profile ID from transaction
						const profileId = extractProfileId(result)

						if (profileId) {
							// Success with profile ID
							toast.success(
								<div className="space-y-1">
									<p className="font-semibold">Profile Created! 🎉</p>
									<p className="text-xs">ID: {formatAddress(profileId)}</p>
									<a
										href={getExplorerTxUrl(result.digest)}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 hover:underline text-xs"
									>
										View on Explorer →
									</a>
								</div>
							)

							// Navigate to profile page
							setTimeout(() => {
								navigate(`/profile/${profileId}`)
							}, 1500)
						} else {
							// Fallback: profile created but ID not found immediately
							console.warn('⚠️ Profile object not found in transaction results')
							toast.success(`Profile created! TX: ${formatAddress(result.digest)}`)

							// Fallback: wait and fetch objects
							setTimeout(async () => {
								const objects = await client.getOwnedObjects({
									owner: account.address,
									options: {
										showType: true,
										showContent: true,
									},
								})

								const profile = objects.data.find(obj =>
									obj.data?.type?.includes(`${contract.packageId}::${contract.moduleName}::Profile`)
								)

								if (profile) {
									navigate(`/profile/${profile.data?.objectId}`)
								} else {
									navigate('/')
								}
							}, 2000)
						}
					},
					onError: (error) => {
						console.error('Transaction failed:', error)
						toast.error(error.message || 'Failed to create profile')
					},
				}
			)
		} catch (error: any) {
			console.error('Error:', error)
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	if (!account) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-md mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Wallet Required</h2>
						<p className="text-gray-600 mb-6">
							Please connect your wallet to create a profile
						</p>
						<Link to="/" className="btn btn-primary">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<Navbar />

			<div className="container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
							<ArrowLeft className="w-4 h-4" />
							Back to Home
						</Link>
						<h1 className="text-4xl font-bold gradient-text mb-2">
							Create Your Profile
						</h1>
						<p className="text-gray-600">
							Set up your decentralized link hub on Sui blockchain
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Info Card */}
						<div className="card space-y-6">
							<h2 className="text-xl font-bold">Basic Information</h2>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Username *
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="johndoe"
									className="input"
									required
								/>
								<p className="text-sm text-gray-500 mt-1">
									This will be your unique identifier
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Bio
								</label>
								<textarea
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									placeholder="Tell the world about yourself..."
									className="input min-h-[100px]"
									rows={4}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Avatar URL (optional)
								</label>
								<input
									type="text"
									value={avatarCid}
									onChange={(e) => setAvatarCid(e.target.value)}
									placeholder="https://... or IPFS CID"
									className="input"
								/>
								<p className="text-sm text-gray-500 mt-1">
									IPFS CID or any image URL
								</p>
							</div>
						</div>

						{/* Theme Selection */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Choose Theme</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{THEMES.map((t) => (
									<button
										key={t.id}
										type="button"
										onClick={() => setTheme(t.id)}
										className={`p-4 rounded-xl border-2 transition-all ${theme === t.id
											? 'border-blue-500 ring-2 ring-blue-500/20'
											: 'border-gray-200 hover:border-gray-300'
											}`}
									>
										<div className={`h-16 rounded-lg bg-gradient-to-r ${t.gradient} mb-2`} />
										<p className="text-sm font-medium">{t.name}</p>
									</button>
								))}
							</div>
						</div>

						{/* Links Section */}
						<div className="card space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold">Links (Add after creation)</h2>
							</div>
							<p className="text-sm text-gray-600">
								Note: Links will be added after profile creation due to blockchain transaction limitations.
								You'll be able to add links on the edit page.
							</p>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading || !name.trim()}
							className="w-full btn btn-primary text-lg py-4"
						>
							{loading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
									Creating Profile...
								</>
							) : (
								'Create Profile'
							)}
						</button>
					</form>

					{/* Info Box */}
					<div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
						<p className="text-sm text-blue-900">
							<strong>💡 Tip:</strong> Creating a profile requires a small gas fee (≈0.01 SUI).
							Make sure you have enough SUI in your wallet.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

