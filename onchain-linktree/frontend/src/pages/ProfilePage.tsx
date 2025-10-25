import { useParams, Link } from 'react-router-dom'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { ArrowLeft, Edit, Share2, Copy } from 'lucide-react'
import Navbar from '@/components/Navbar'
import LinkCard from '@/components/LinkCard'
import { toast } from '@/components/ui/Toaster'
import { THEMES, DEFAULT_AVATAR } from '@/config/constants'

export default function ProfilePage() {
	const { objectId } = useParams<{ objectId: string }>()
	const account = useCurrentAccount()

	// Fetch profile object from blockchain
	const { data: profileData, isLoading, error } = useSuiClientQuery(
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

	const handleShare = () => {
		const url = window.location.href
		navigator.clipboard.writeText(url)
		toast.success('Profile link copied to clipboard!')
	}

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto text-center">
						<div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
						<p className="mt-4 text-gray-600">Loading profile...</p>
					</div>
				</div>
			</div>
		)
	}

	if (error || !profileData) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4 text-red-600">Profile Not Found</h2>
						<p className="text-gray-600 mb-6">
							This profile doesn't exist or couldn't be loaded.
						</p>
						<Link to="/" className="btn btn-primary">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// @ts-ignore - Sui object structure
	const content = profileData.data?.content?.fields
	const owner = profileData.data?.owner

	if (!content) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="container mx-auto px-4 py-20">
					<div className="max-w-2xl mx-auto card text-center">
						<h2 className="text-2xl font-bold mb-4">Invalid Profile</h2>
						<p className="text-gray-600 mb-6">
							This object is not a valid profile.
						</p>
						<Link to="/" className="btn btn-primary">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// Decode byte arrays to strings
	const decoder = new TextDecoder()
	const name = content.name ? decoder.decode(new Uint8Array(content.name)) : 'Unknown'
	const bio = content.bio ? decoder.decode(new Uint8Array(content.bio)) : ''
	const avatarCid = content.avatar_cid ? decoder.decode(new Uint8Array(content.avatar_cid)) : ''
	const theme = Number(content.theme || 1)
	const links = content.links || []

	const themeData = THEMES.find((t) => t.id === theme) || THEMES[0]
	const avatarUrl = avatarCid || `${DEFAULT_AVATAR}${name}`

	// @ts-ignore
	const isOwner = account?.address === (typeof owner === 'object' && owner.AddressOwner ? owner.AddressOwner : owner)

	return (
		<div className="min-h-screen">
			<Navbar />

			<div className="container mx-auto px-4 py-12">
				<div className="max-w-2xl mx-auto">
					{/* Back Button */}
					<Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
						<ArrowLeft className="w-4 h-4" />
						Back to Home
					</Link>

					{/* Profile Card */}
					<div className="card relative overflow-hidden">
						{/* Theme Header */}
						<div className={`h-32 bg-gradient-to-r ${themeData.gradient} -mx-6 -mt-6 mb-4`} />

						{/* Avatar */}
						<div className="relative -mt-20 mb-6">
							<img
								src={avatarUrl}
								alt={name}
								className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto bg-white"
								onError={(e) => {
									e.currentTarget.src = `${DEFAULT_AVATAR}${name}`
								}}
							/>
						</div>

						{/* Profile Info */}
						<div className="text-center space-y-4 mb-6">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
								{bio && <p className="text-gray-600 max-w-md mx-auto">{bio}</p>}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 justify-center">
								<button
									onClick={handleShare}
									className="btn btn-secondary"
								>
									<Share2 className="w-4 h-4" />
									Share
								</button>

								{isOwner && (
									<Link
										to={`/edit/${objectId}`}
										className="btn btn-primary"
									>
										<Edit className="w-4 h-4" />
										Edit Profile
									</Link>
								)}
							</div>
						</div>

						{/* Links */}
						<div className="space-y-3">
							{links.length === 0 ? (
								<div className="text-center py-12 text-gray-500">
									<p>No links added yet</p>
									{isOwner && (
										<Link to={`/edit/${objectId}`} className="text-blue-600 hover:underline mt-2 inline-block">
											Add your first link →
										</Link>
									)}
								</div>
							) : (
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
							)}
						</div>

						{/* Owner Badge */}
						{isOwner && (
							<div className="mt-6 pt-6 border-t border-gray-200">
								<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
									You own this profile
								</div>
							</div>
						)}
					</div>

					{/* Object Info (for developers) */}
					<div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 font-mono">
						<div className="flex items-center gap-2 mb-2">
							<span className="font-semibold">Object ID:</span>
							<button
								onClick={() => {
									navigator.clipboard.writeText(objectId!)
									toast.success('Object ID copied!')
								}}
								className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
							>
								{objectId}
								<Copy className="w-3 h-3" />
							</button>
						</div>
						<a
							href={`https://suiexplorer.com/object/${objectId}?network=testnet`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							View on Explorer →
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}


