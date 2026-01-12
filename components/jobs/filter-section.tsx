'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  activeCount?: number
}

export function FilterSection({
  title,
  children,
  defaultExpanded = true,
  activeCount = 0,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between text-left rounded-lg p-2 -mx-2 transition-all',
          'hover:bg-gray-50',
          isExpanded && 'bg-gray-50/50'
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform duration-[var(--duration-normal)]',
            isExpanded && 'rotate-180'
          )}
          style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
        />
      </button>

      {/* Section Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-[var(--duration-normal)]',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
      >
        <div className="pt-3">{children}</div>
      </div>
    </div>
  )
}
