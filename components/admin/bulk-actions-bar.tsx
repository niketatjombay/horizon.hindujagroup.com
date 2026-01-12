'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
  children: React.ReactNode
  className?: string
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  children,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between gap-4 rounded-lg bg-primary-50 px-4 py-3 shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-primary">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
        <div className="flex items-center gap-2">{children}</div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-gray-600 hover:text-gray-900"
      >
        <X className="mr-1 h-4 w-4" />
        Clear selection
      </Button>
    </div>
  )
}
