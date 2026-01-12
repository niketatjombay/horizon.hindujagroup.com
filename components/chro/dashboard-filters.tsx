'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download } from 'lucide-react'
import type { TimeRange } from '@/lib/hooks'

interface DashboardFiltersProps {
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  onExport: () => void
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
]

export function DashboardFilters({
  timeRange,
  onTimeRangeChange,
  onExport,
}: DashboardFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <Select value={timeRange} onValueChange={(value) => onTimeRangeChange(value as TimeRange)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {TIME_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="secondary" size="sm" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  )
}
