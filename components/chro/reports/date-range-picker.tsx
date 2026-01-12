'use client'

import { useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { format, subDays, subMonths, startOfQuarter, subQuarters } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DateRange, DateRangePreset } from '@/types/chro-reports'
import { DATE_RANGE_PRESETS } from '@/types/chro-reports'

interface DateRangePickerProps {
  value: DateRange
  preset: DateRangePreset
  onPresetChange: (preset: DateRangePreset) => void
  onDateChange: (range: DateRange) => void
  className?: string
}

/**
 * Get date range for a preset
 */
function getDateRangeForPreset(preset: DateRangePreset): DateRange {
  const now = new Date()
  const endDate = format(now, 'yyyy-MM-dd')
  let startDate: string

  switch (preset) {
    case 'last-7-days':
      startDate = format(subDays(now, 7), 'yyyy-MM-dd')
      break
    case 'last-30-days':
      startDate = format(subDays(now, 30), 'yyyy-MM-dd')
      break
    case 'last-quarter':
      startDate = format(startOfQuarter(subQuarters(now, 1)), 'yyyy-MM-dd')
      break
    case 'last-6-months':
      startDate = format(subMonths(now, 6), 'yyyy-MM-dd')
      break
    case 'last-year':
      startDate = format(subMonths(now, 12), 'yyyy-MM-dd')
      break
    case 'custom':
    default:
      // Return empty for custom - user will fill in
      startDate = format(subDays(now, 30), 'yyyy-MM-dd')
  }

  return { startDate, endDate }
}

export function DateRangePicker({
  value,
  preset,
  onPresetChange,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const isCustom = preset === 'custom'

  // Format dates for display
  const displayRange = useMemo(() => {
    if (!value.startDate || !value.endDate) return 'Select date range'
    try {
      const start = format(new Date(value.startDate), 'MMM d, yyyy')
      const end = format(new Date(value.endDate), 'MMM d, yyyy')
      return `${start} - ${end}`
    } catch {
      return 'Select date range'
    }
  }, [value])

  const handlePresetChange = (newPreset: DateRangePreset) => {
    onPresetChange(newPreset)
    if (newPreset !== 'custom') {
      const range = getDateRangeForPreset(newPreset)
      onDateChange(range)
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({
      ...value,
      startDate: e.target.value,
    })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({
      ...value,
      endDate: e.target.value,
    })
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
        Date Range
      </Label>
      <div className="space-y-2">
        {/* Preset Selector */}
        <Select value={preset} onValueChange={(v) => handlePresetChange(v as DateRangePreset)}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Select period" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom Date Inputs */}
        {isCustom && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Start Date</Label>
              <Input
                type="date"
                value={value.startDate}
                onChange={handleStartDateChange}
                max={value.endDate || undefined}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">End Date</Label>
              <Input
                type="date"
                value={value.endDate}
                onChange={handleEndDateChange}
                min={value.startDate || undefined}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Current Range Display */}
        {!isCustom && (
          <p className="text-xs text-gray-500">{displayRange}</p>
        )}
      </div>
    </div>
  )
}
