import { Link } from 'react-router-dom'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { Sparkles, Link as LinkIcon, Shield, Zap, ExternalLink, Edit } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useContract } from '@/hooks/useContract'

export default function HomePage() {
	const account = useCurrentAccount()
	const contract = useContract()

	// Fetch user's profiles
	const { data: ownedObjects } = useSuiClientQuery(
		'getOwnedObjects',
		{
			owner: account?.address as string,
			options: {
				showType: true,
				showContent: true,
				showDisplay: true,
			},
		},
		{
			enabled: !!account,
		}
	)

	// Filter Profile objects
	const profiles = ownedObjects?.data?.filter((obj) =>
		obj.data?.type?.includes(`${contract.packageId}::${contract.moduleName}::Profile`)
	) || []

	return (
		<div className="min-h-screen">
			<Navbar />

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-20">
				<div className="text-center max-w-4xl mx-auto space-y-8">
					{/* Animated Icon */}
					<div className="flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
							<div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center animate-float shadow-2xl">
								<LinkIcon className="w-12 h-12 text-white" />
							</div>
						</div>
					</div>

					{/* Title */}
					<div className="space-y-4">
						<h1 className="text-5xl md:text-6xl font-bold text-gray-900">
							Your Links,{' '}
							<span className="gradient-text">Forever Yours</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Create your decentralized link hub on Sui blockchain.
							No subscriptions, no middleman, complete ownership.
						</p>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						{account ? (
							<>
								<Link
									to="/create"
									className="btn btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-3xl"
								>
									<Sparkles className="w-5 h-5" />
									Create Your Profile
								</Link>
								{profiles.length > 0 && (
									<a
										href="#my-profiles"
										className="btn btn-secondary text-lg px-8 py-4"
									>
										View My Profiles ({profiles.length})
									</a>
								)}
							</>
						) : (
							<div className="card max-w-md">
								<p className="text-gray-600 mb-4">
									Connect your wallet to get started
								</p>
								<div className="flex justify-center">
									{/* ConnectButton is in Navbar */}
									<p className="text-sm text-gray-500">
										Click "Connect Wallet" in the top right
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Features */}
					<div className="grid md:grid-cols-3 gap-6 pt-16">
						<div className="card text-center space-y-4 hover:shadow-2xl transition-all">
							<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
								<Shield className="w-7 h-7 text-blue-600" />
							</div>
							<h3 className="font-bold text-xl">Truly Yours</h3>
							<p className="text-gray-600">
								Your profile is an NFT. You own it, control it, and can transfer it.
							</p>
						</div>

						<div className="card text-center space-y-4 hover:shadow-2xl transition-all">
							<div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
								<Zap className="w-7 h-7 text-purple-600" />
							</div>
							<h3 className="font-bold text-xl">Lightning Fast</h3>
							<p className="text-gray-600">
								Built on Sui blockchain for instant transactions and updates.
							</p>
						</div>

						<div className="card text-center space-y-4 hover:shadow-2xl transition-all">
							<div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
								<LinkIcon className="w-7 h-7 text-green-600" />
							</div>
							<h3 className="font-bold text-xl">Unlimited Links</h3>
							<p className="text-gray-600">
								Add as many links as you want. No premium plans, no limits.
							</p>
						</div>
					</div>

					{/* My Profiles Section */}
					{account && profiles.length > 0 && (
						<div id="my-profiles" className="pt-16 space-y-8">
							<div className="flex items-center justify-between">
								<h2 className="text-3xl font-bold">My Profiles</h2>
								<Link
									to="/create"
									className="btn btn-primary"
								>
									<Sparkles className="w-4 h-4" />
									Create New
								</Link>
							</div>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{profiles.map((profile) => {
									const content = profile.data?.content as any
									const fields = content?.fields || {}
									const objectId = profile.data?.objectId || ''

									return (
										<div key={objectId} className="card hover:shadow-2xl transition-all">
											<div className="space-y-4">
												{/* Profile Header */}
												<div className="flex items-start justify-between">
													<div className="flex items-center gap-3">
														<img
															src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fields.name || 'default'}`}
															alt={fields.name}
															className="w-12 h-12 rounded-full"
														/>
														<div>
															<h3 className="font-bold text-lg">
																{new TextDecoder().decode(
																	new Uint8Array(fields.name || [])
																) || 'Unnamed'}
															</h3>
															<p className="text-sm text-gray-500">
																{fields.links?.length || 0} links
															</p>
														</div>
													</div>
												</div>

												{/* Bio */}
												{fields.bio && (
													<p className="text-gray-600 text-sm line-clamp-2">
														{new TextDecoder().decode(
															new Uint8Array(fields.bio || [])
														)}
													</p>
												)}

												{/* Actions */}
												<div className="flex gap-2 pt-2">
													<Link
														to={`/profile/${objectId}`}
														className="btn btn-secondary flex-1"
													>
														<ExternalLink className="w-4 h-4" />
														View
													</Link>
													<Link
														to={`/edit/${objectId}`}
														className="btn btn-primary flex-1"
													>
														<Edit className="w-4 h-4" />
														Edit
													</Link>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					)}

					{/* How it works */}
					<div className="pt-16 space-y-8">
						<h2 className="text-3xl font-bold">How It Works</h2>
						<div className="grid md:grid-cols-3 gap-6">
							<div className="text-center space-y-3">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
									1
								</div>
								<h3 className="font-semibold text-lg">Connect Wallet</h3>
								<p className="text-gray-600 text-sm">
									Use Sui Wallet or any compatible wallet
								</p>
							</div>

							<div className="text-center space-y-3">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
									2
								</div>
								<h3 className="font-semibold text-lg">Create Profile</h3>
								<p className="text-gray-600 text-sm">
									Add your name, bio, avatar, and links
								</p>
							</div>

							<div className="text-center space-y-3">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
									3
								</div>
								<h3 className="font-semibold text-lg">Share & Own</h3>
								<p className="text-gray-600 text-sm">
									Share your profile link everywhere
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-gray-200 py-8 mt-20">
				<div className="container mx-auto px-4 text-center text-gray-600">
					<p>Built on Sui • Powered by Move • Open Source</p>
				</div>
			</footer>
		</div>
	)
}


