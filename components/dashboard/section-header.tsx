import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  viewAllLabel?: string
}

export function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = 'View All',
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between pb-3 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          {viewAllLabel}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
