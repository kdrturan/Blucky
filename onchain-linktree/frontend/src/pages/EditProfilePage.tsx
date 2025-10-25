import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import Navbar from '@/components/Navbar'
import LinkCard from '@/components/LinkCard'
import { toast } from '@/components/ui/Toaster'
import { PACKAGE_ID, MODULE_NAME, THEMES } from '@/config/constants'

interface LinkInput {
	id: string
	label: string
	url: string
	index?: number
}

export default function EditProfilePage() {
	const { objectId } = useParams<{ objectId: string }>()
	const account = useCurrentAccount()
	const navigate = useNavigate()
	const { mutate: signAndExecute } = useSignAndExecuteTransaction()

	const [bio, setBio] = useState('')
	const [avatarCid, setAvatarCid] = useState('')
	const [theme, setTheme] = useState(1)
	const [links, setLinks] = useState<LinkInput[]>([])
	const [loading, setLoading] = useState(false)

	// Fetch profile object
	const { data: profileData, isLoading } = useSuiClientQuery(
		'getObject',
		{
			id: objectId!,
			options: {
				showContent: true,
				showOwner: true,
			},
		},
		{
			enabled: !!objectId,
		}
	)

	// Load profile data
	useEffect(() => {
		if (profileData?.data?.content) {
			// @ts-ignore
			const content = profileData.data.content.fields
			setBio(content.bio || '')
			setAvatarCid(content.avatar_cid || '')
			setTheme(Number(content.theme || 1))

			const existingLinks = content.links || []
			setLinks(
				existingLinks.map((link: any, index: number) => ({
					id: Math.random().toString(),
					label: link.fields?.label || link.label || '',
					url: link.fields?.url || link.url || '',
					index,
				}))
			)
		}
	}, [profileData])

	const addLink = () => {
		setLinks([...links, { id: Math.random().toString(), label: '', url: '' }])
	}

	const updateLink = (id: string, field: 'label' | 'url', value: string) => {
		setLinks(links.map(link =>
			link.id === id ? { ...link, [field]: value } : link
		))
	}

	const removeLink = (id: string, index?: number) => {
		if (index !== undefined) {
			// Existing link - call blockchain to remove
			handleRemoveLink(index)
		}
		setLinks(links.filter(link => link.id !== id))
	}

	const handleUpdateBio = async () => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: `${PACKAGE_ID}::${MODULE_NAME}::set_bio`,
				arguments: [
					tx.object(objectId),
					tx.pure.string(bio),
				],
			})

			signAndExecute(
				{ transaction: tx },
				{
					onSuccess: (result) => {
						console.log('✅ Bio updated! TX:', result.digest)
						toast.success(`Bio updated! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Bio update failed:', error)
						toast.error(error.message || 'Failed to update bio')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateAvatar = async () => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: `${PACKAGE_ID}::${MODULE_NAME}::set_avatar`,
				arguments: [
					tx.object(objectId),
					tx.pure.string(avatarCid),
				],
			})

			signAndExecute(
				{ transaction: tx },
				{
					onSuccess: (result) => {
						console.log('✅ Avatar updated! TX:', result.digest)
						toast.success(`Avatar updated! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Avatar update failed:', error)
						toast.error(error.message || 'Failed to update avatar')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateTheme = async () => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: `${PACKAGE_ID}::${MODULE_NAME}::set_theme`,
				arguments: [
					tx.object(objectId),
					tx.pure.u64(theme),
				],
			})

			signAndExecute(
				{ transaction: tx },
				{
					onSuccess: (result) => {
						console.log('✅ Theme updated! TX:', result.digest)
						toast.success(`Theme updated! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Theme update failed:', error)
						toast.error(error.message || 'Failed to update theme')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleAddLink = async (label: string, url: string) => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: `${PACKAGE_ID}::${MODULE_NAME}::add_link`,
				arguments: [
					tx.object(objectId),
					tx.pure.string(label),
					tx.pure.string(url),
				],
			})

			signAndExecute(
				{ transaction: tx },
				{
					onSuccess: (result) => {
						console.log('✅ Link added! TX:', result.digest)
						toast.success(`Link added! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Add link failed:', error)
						toast.error(error.message || 'Failed to add link')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleRemoveLink = async (index: number) => {
		if (!account || !objectId) return
		setLoading(true)

		try {
			const tx = new Transaction()
			tx.moveCall({
				target: `${PACKAGE_ID}::${MODULE_NAME}::remove_link_at`,
				arguments: [
					tx.object(objectId),
					tx.pure.u64(index),
				],
			})

			signAndExecute(
				{ transaction: tx },
				{
					onSuccess: (result) => {
						console.log('✅ Link removed! TX:', result.digest)
						toast.success(`Link removed! TX: ${result.digest.slice(0, 8)}...`)
						setTimeout(() => window.location.reload(), 1500)
					},
					onError: (error) => {
						console.error('❌ Remove link failed:', error)
						toast.error(error.message || 'Failed to remove link')
					},
				}
			)
		} catch (error: any) {
			toast.error(error.message || 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20 text-center">
					<div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		)
	}

	if (!profileData?.data) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
						<Link to="/" className="btn btn-primary">Go Home</Link>
					</div>
				</div>
			</div>
		)
	}

	// @ts-ignore
	const owner = profileData.data.owner
	// @ts-ignore
	const isOwner = account?.address === (typeof owner === 'object' && owner.AddressOwner ? owner.AddressOwner : owner)

	if (!isOwner) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Access Denied</h2>
						<p className="text-gray-600 mb-6">You don't own this profile</p>
						<Link to={`/profile/${objectId}`} className="btn btn-primary">
							View Profile
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
					<div className="mb-8">
						<Link
							to={`/profile/${objectId}`}
							className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Profile
						</Link>
						<h1 className="text-4xl font-bold gradient-text">Edit Profile</h1>
					</div>

					<div className="space-y-6">
						{/* Bio Section */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Bio</h2>
							<textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder="Tell the world about yourself..."
								className="input min-h-[100px]"
								rows={4}
							/>
							<button
								onClick={handleUpdateBio}
								disabled={loading}
								className="btn btn-primary"
							>
								<Save className="w-4 h-4" />
								Update Bio
							</button>
						</div>

						{/* Avatar Section */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Avatar</h2>
							<input
								type="text"
								value={avatarCid}
								onChange={(e) => setAvatarCid(e.target.value)}
								placeholder="https://... or IPFS CID"
								className="input"
							/>
							<button
								onClick={handleUpdateAvatar}
								disabled={loading}
								className="btn btn-primary"
							>
								<Save className="w-4 h-4" />
								Update Avatar
							</button>
						</div>

						{/* Theme Section */}
						<div className="card space-y-4">
							<h2 className="text-xl font-bold">Theme</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
								{THEMES.map((t) => (
									<button
										key={t.id}
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
							<button
								onClick={handleUpdateTheme}
								disabled={loading}
								className="btn btn-primary"
							>
								<Save className="w-4 h-4" />
								Update Theme
							</button>
						</div>

						{/* Links Section */}
						<div className="card space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold">Links</h2>
								<button
									onClick={addLink}
									className="btn btn-secondary"
								>
									<Plus className="w-4 h-4" />
									Add Link
								</button>
							</div>

							<div className="space-y-3">
								{links.map((link) => (
									<div key={link.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
										<input
											type="text"
											value={link.label}
											onChange={(e) => updateLink(link.id, 'label', e.target.value)}
											placeholder="Label (e.g., Twitter)"
											className="input"
										/>
										<input
											type="text"
											value={link.url}
											onChange={(e) => updateLink(link.id, 'url', e.target.value)}
											placeholder="URL (e.g., https://twitter.com/username)"
											className="input"
										/>
										<div className="flex gap-2">
											{link.index === undefined ? (
												<button
													onClick={() => handleAddLink(link.label, link.url)}
													disabled={!link.label || !link.url || loading}
													className="btn btn-primary flex-1"
												>
													Save Link
												</button>
											) : null}
											<button
												onClick={() => removeLink(link.id, link.index)}
												disabled={loading}
												className="btn btn-secondary text-red-600"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								))}

								{links.length === 0 && (
									<p className="text-center text-gray-500 py-8">
										No links yet. Click "Add Link" to get started!
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

