import { Link } from 'react-router-dom'
import { ConnectButton } from '@mysten/dapp-kit'
import { Link as LinkIcon, Plus, Home } from 'lucide-react'

export default function Navbar() {
	return (
		<nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2 group">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
							<LinkIcon className="w-6 h-6 text-white" />
						</div>
						<span className="font-bold text-xl gradient-text">
							OnChain LinkTree
						</span>
					</Link>

					{/* Navigation */}
					<div className="flex items-center gap-4">
						<Link
							to="/"
							className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<Home className="w-4 h-4" />
							<span className="font-medium">Home</span>
						</Link>

						<Link
							to="/create"
							className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
						>
							<Plus className="w-4 h-4" />
							<span className="font-medium">Create Profile</span>
						</Link>

						<ConnectButton />
					</div>
				</div>
			</div>
		</nav>
	)
}


