'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

// Status options with labels and colors
export const APPLICATION_STATUS_OPTIONS: {
  value: ApplicationStatus
  label: string
  color: string
  bgColor: string
}[] = [
  {
    value: 'submitted',
    label: 'Applied',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    value: 'under_review',
    label: 'Reviewing',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
  },
  {
    value: 'shortlisted',
    label: 'Shortlisted',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    value: 'interview_scheduled',
    label: 'Interview',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
  },
  {
    value: 'offered',
    label: 'Offered',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  {
    value: 'accepted',
    label: 'Accepted',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
]

export function getStatusOption(status: ApplicationStatus) {
  return (
    APPLICATION_STATUS_OPTIONS.find((opt) => opt.value === status) ||
    APPLICATION_STATUS_OPTIONS[0]
  )
}

interface StatusChangeDropdownProps {
  currentStatus: ApplicationStatus
  onStatusChange: (newStatus: ApplicationStatus) => void
  disabled?: boolean
  variant?: 'select' | 'dropdown'
  className?: string
}

export function StatusChangeDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
  variant = 'dropdown',
  className,
}: StatusChangeDropdownProps) {
  const currentOption = getStatusOption(currentStatus)

  if (variant === 'select') {
    return (
      <Select
        value={currentStatus}
        onValueChange={(value) => onStatusChange(value as ApplicationStatus)}
        disabled={disabled}
      >
        <SelectTrigger className={cn('w-[140px]', className)}>
          <SelectValue>
            <span className={cn('font-medium', currentOption.color)}>
              {currentOption.label}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {APPLICATION_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className={cn('font-medium', option.color)}>
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-7 px-2.5 gap-1 font-medium',
            currentOption.bgColor,
            currentOption.color,
            'hover:opacity-80',
            className
          )}
        >
          {currentOption.label}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        {APPLICATION_STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={cn('gap-2', option.value === currentStatus && 'bg-gray-50')}
          >
            <span className={cn('font-medium', option.color)}>{option.label}</span>
            {option.value === currentStatus && (
              <Check className="h-4 w-4 ml-auto text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Bulk status change component for multiple selections
interface BulkStatusChangeProps {
  selectedCount: number
  onStatusChange: (newStatus: ApplicationStatus) => void
  disabled?: boolean
  className?: string
}

export function BulkStatusChange({
  selectedCount,
  onStatusChange,
  disabled = false,
  className,
}: BulkStatusChangeProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="secondary" size="sm" className={cn('gap-1', className)}>
          Change Status
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        <div className="px-2 py-1.5 text-xs text-gray-500 border-b border-gray-100 mb-1">
          Apply to {selectedCount} selected
        </div>
        {APPLICATION_STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
          >
            <span className={cn('font-medium', option.color)}>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
