'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BulkStatusChange } from './status-change-dropdown'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
  onStatusChange: (newStatus: ApplicationStatus) => void
  className?: string
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  onStatusChange,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3',
        'bg-primary-50 border border-primary-200 rounded-lg',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-primary-700">
          {selectedCount} selected
        </span>
      </div>

      <div className="h-4 w-px bg-primary-200" />

      <div className="flex items-center gap-2">
        <BulkStatusChange
          selectedCount={selectedCount}
          onStatusChange={onStatusChange}
        />
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-primary-700 hover:text-primary-900 hover:bg-primary-100"
      >
        <X className="h-4 w-4 mr-1" />
        Clear selection
      </Button>
    </div>
  )
}
