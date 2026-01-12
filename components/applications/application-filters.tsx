'use client'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApplicationStatus } from '@/types'

export type FilterStatus = 'all' | ApplicationStatus
export type SortOption = 'newest' | 'oldest' | 'company' | 'status'

interface StatusCount {
  status: FilterStatus
  count: number
}

interface ApplicationFiltersProps {
  statusCounts: StatusCount[]
  selectedStatus: FilterStatus
  onStatusChange: (status: FilterStatus) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

// Status display configuration
const STATUS_CONFIG: Record<FilterStatus, { label: string; displayLabel: string }> = {
  all: { label: 'All', displayLabel: 'All' },
  submitted: { label: 'Applied', displayLabel: 'Applied' },
  under_review: { label: 'Reviewing', displayLabel: 'Reviewing' },
  shortlisted: { label: 'Shortlisted', displayLabel: 'Shortlisted' },
  interview_scheduled: { label: 'Interview', displayLabel: 'Interview' },
  offered: { label: 'Offered', displayLabel: 'Offered' },
  accepted: { label: 'Accepted', displayLabel: 'Accepted' },
  rejected: { label: 'Rejected', displayLabel: 'Rejected' },
  withdrawn: { label: 'Withdrawn', displayLabel: 'Withdrawn' },
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'company', label: 'Company A-Z' },
  { value: 'status', label: 'Status' },
]

export function ApplicationFilters({
  statusCounts,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}: ApplicationFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusCounts.map(({ status, count }) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={cn(
              'rounded-md border px-4 py-2 text-sm font-medium transition-all duration-150',
              selectedStatus === status
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            {STATUS_CONFIG[status].label}
            <span
              className={cn(
                'ml-2',
                selectedStatus === status ? 'text-primary/70' : 'text-gray-400'
              )}
            >
              ({count})
            </span>
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { STATUS_CONFIG }
