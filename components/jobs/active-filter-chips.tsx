'use client'

import { X } from 'lucide-react'
import type { JobFilters } from '@/types'
import { cn } from '@/lib/utils'

interface ActiveFilterChipsProps {
  filters: JobFilters
  companyNames?: Record<string, string>
  onRemoveFilter: (filterType: keyof JobFilters, value?: string) => void
  onClearAll: () => void
}

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
}

const JOB_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
}

export function ActiveFilterChips({
  filters,
  companyNames = {},
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) {
  const activeFilters: Array<{
    type: keyof JobFilters
    label: string
    value?: string
  }> = []

  // Company filters
  if (filters.company && filters.company.length > 0) {
    filters.company.forEach((companyId) => {
      activeFilters.push({
        type: 'company',
        label: companyNames[companyId] || `Company ${companyId}`,
        value: companyId,
      })
    })
  }

  // Location filters
  if (filters.location && filters.location.length > 0) {
    filters.location.forEach((loc) => {
      activeFilters.push({
        type: 'location',
        label: loc,
        value: loc,
      })
    })
  }

  // Function filters
  if (filters.function && filters.function.length > 0) {
    filters.function.forEach((func) => {
      activeFilters.push({
        type: 'function',
        label: func,
        value: func,
      })
    })
  }

  // Experience Level
  if (filters.experienceLevel && filters.experienceLevel.length > 0) {
    filters.experienceLevel.forEach((exp) => {
      activeFilters.push({
        type: 'experienceLevel',
        label: EXPERIENCE_LABELS[exp] || exp,
        value: exp,
      })
    })
  }

  // Job Type
  if (filters.type && filters.type.length > 0) {
    filters.type.forEach((type) => {
      activeFilters.push({
        type: 'type',
        label: JOB_TYPE_LABELS[type] || type,
        value: type,
      })
    })
  }

  // Posted After
  if (filters.postedAfter) {
    activeFilters.push({
      type: 'postedAfter',
      label: `Posted: ${filters.postedAfter}`,
    })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="mb-4 rounded-xl bg-primary-light/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          Active Filters
          <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-white">
            {activeFilters.length}
          </span>
        </span>
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-gray-500 transition-colors hover:text-destructive"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <button
            key={`${filter.type}-${filter.value || index}`}
            onClick={() => onRemoveFilter(filter.type, filter.value)}
            className={cn(
              'group inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-xs',
              'border border-gray-200 transition-all duration-[var(--duration-fast)]',
              'hover:border-destructive hover:bg-destructive-light btn-press'
            )}
            style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
          >
            <span className="text-gray-700 group-hover:text-destructive">{filter.label}</span>
            <X className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover:text-destructive" />
          </button>
        ))}
      </div>
    </div>
  )
}
