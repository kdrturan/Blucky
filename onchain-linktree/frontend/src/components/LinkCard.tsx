import { ExternalLink } from 'lucide-react'

interface LinkCardProps {
	label: string
	url: string
	onEdit?: () => void
	onDelete?: () => void
	editable?: boolean
}

export default function LinkCard({ label, url, onEdit, onDelete, editable }: LinkCardProps) {
	const handleClick = () => {
		if (!editable) {
			window.open(url, '_blank', 'noopener,noreferrer')
		}
	}

	return (
		<div
			className="link-card relative group"
			onClick={handleClick}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
						<ExternalLink className="w-5 h-5 text-blue-600" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-gray-900 truncate">{label}</h3>
						<p className="text-sm text-gray-500 truncate">{url}</p>
					</div>
				</div>

				{editable && (
					<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							onClick={(e) => {
								e.stopPropagation()
								onEdit?.()
							}}
							className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
						>
							Edit
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								onDelete?.()
							}}
							className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

