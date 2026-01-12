'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronUp, RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { DateRangePicker } from './date-range-picker'
import { MultiSelectFilter } from './multi-select-filter'
import { useReportFilterOptions } from '@/lib/hooks/use-chro-reports'
import { getDateRangeFromPreset } from '@/lib/api/chro-reports'
import type { ReportFilters, DateRangePreset } from '@/types/chro-reports'
import { cn } from '@/lib/utils'

interface ReportFiltersProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  onApply?: () => void
  isLoading?: boolean
  className?: string
}

export function ReportFiltersPanel({
  filters,
  onChange,
  onApply,
  isLoading = false,
  className,
}: ReportFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { data: filterOptions, isLoading: optionsLoading } = useReportFilterOptions()

  // Initialize date range from preset on mount
  useEffect(() => {
    if (!filters.dateRange.startDate || !filters.dateRange.endDate) {
      const range = getDateRangeFromPreset(filters.preset)
      onChange({
        ...filters,
        dateRange: range,
      })
    }
  }, [])

  // Prepare options for multi-selects
  const companyOptions = useMemo(
    () =>
      filterOptions?.companies?.map((c) => ({ id: c.id, name: c.name })) || [],
    [filterOptions]
  )

  const departmentOptions = useMemo(
    () =>
      filterOptions?.departments?.map((d) => ({ id: d, name: d })) || [],
    [filterOptions]
  )

  const statusOptions = useMemo(
    () =>
      filterOptions?.statuses?.map((s) => ({
        id: s,
        name: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      })) || [],
    [filterOptions]
  )

  const handlePresetChange = (preset: DateRangePreset) => {
    onChange({
      ...filters,
      preset,
    })
  }

  const handleDateChange = (dateRange: ReportFilters['dateRange']) => {
    onChange({
      ...filters,
      dateRange,
    })
  }

  const handleCompaniesChange = (companyIds: string[]) => {
    onChange({
      ...filters,
      companyIds,
    })
  }

  const handleDepartmentsChange = (departments: string[]) => {
    onChange({
      ...filters,
      departments,
    })
  }

  const handleStatusesChange = (statuses: string[]) => {
    onChange({
      ...filters,
      statuses: statuses as ReportFilters['statuses'],
    })
  }

  const handleComparisonModeChange = (enabled: boolean) => {
    onChange({
      ...filters,
      comparisonMode: enabled ? 'period' : null,
      comparisonDateRange: enabled
        ? getDateRangeFromPreset('last-30-days')
        : undefined,
    })
  }

  const handleComparisonDateChange = (
    dateRange: ReportFilters['dateRange']
  ) => {
    onChange({
      ...filters,
      comparisonDateRange: dateRange,
    })
  }

  const handleReset = () => {
    const defaultRange = getDateRangeFromPreset('last-30-days')
    onChange({
      dateRange: defaultRange,
      preset: 'last-30-days',
      companyIds: [],
      departments: [],
      statuses: [],
      comparisonMode: null,
    })
  }

  const hasFilters =
    filters.companyIds.length > 0 ||
    filters.departments.length > 0 ||
    filters.statuses.length > 0 ||
    filters.comparisonMode !== null

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">Filters</span>
          {hasFilters && (
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              Active
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Primary Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <DateRangePicker
              value={filters.dateRange}
              preset={filters.preset}
              onPresetChange={handlePresetChange}
              onDateChange={handleDateChange}
            />

            {/* Companies */}
            <MultiSelectFilter
              label="Companies"
              placeholder="All companies"
              options={companyOptions}
              selectedIds={filters.companyIds}
              onChange={handleCompaniesChange}
              searchable
              showSelectAll
            />

            {/* Departments */}
            <MultiSelectFilter
              label="Departments"
              placeholder="All departments"
              options={departmentOptions}
              selectedIds={filters.departments}
              onChange={handleDepartmentsChange}
              searchable
              showSelectAll
            />

            {/* Statuses */}
            <MultiSelectFilter
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              selectedIds={filters.statuses}
              onChange={handleStatusesChange}
              showSelectAll
            />
          </div>

          {/* Comparison Mode */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Switch
                id="comparison-mode"
                checked={filters.comparisonMode !== null}
                onCheckedChange={handleComparisonModeChange}
              />
              <Label
                htmlFor="comparison-mode"
                className="text-sm font-medium cursor-pointer"
              >
                Comparison Mode
              </Label>
            </div>

            {filters.comparisonMode === 'period' && (
              <div className="flex-1 max-w-xs">
                <DateRangePicker
                  value={filters.comparisonDateRange || { startDate: '', endDate: '' }}
                  preset="custom"
                  onPresetChange={() => {}}
                  onDateChange={handleComparisonDateChange}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={handleReset}
              disabled={!hasFilters && filters.preset === 'last-30-days'}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {onApply && (
              <Button onClick={onApply} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Apply Filters'}
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
