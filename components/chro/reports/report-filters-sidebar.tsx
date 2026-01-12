'use client'

import { useState, useEffect, useMemo } from 'react'
import { Filter, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from './date-range-picker'
import { MultiSelectFilter } from './multi-select-filter'
import { useReportFilterOptions } from '@/lib/hooks/use-chro-reports'
import { getDateRangeFromPreset } from '@/lib/api/chro-reports'
import type { ReportFilters, DateRangePreset } from '@/types/chro-reports'
import { cn } from '@/lib/utils'

interface ReportFiltersSidebarProps {
  filters: ReportFilters
  onChange: (filters: ReportFilters) => void
  className?: string
}

export function ReportFiltersSidebar({
  filters,
  onChange,
  className,
}: ReportFiltersSidebarProps) {
  const { data: filterOptions } = useReportFilterOptions()

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

  const activeFilterCount =
    filters.companyIds.length +
    filters.departments.length +
    filters.statuses.length +
    (filters.comparisonMode ? 1 : 0)

  return (
    <aside
      className={cn(
        'w-72 shrink-0 border-r border-gray-200 bg-gray-50/50',
        className
      )}
    >
      <div className="sticky top-0 h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-900">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Filter Sections */}
        <div className="p-4 space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Date Range
            </Label>
            <DateRangePicker
              value={filters.dateRange}
              preset={filters.preset}
              onPresetChange={handlePresetChange}
              onDateChange={handleDateChange}
            />
          </div>

          {/* Companies */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Companies
            </Label>
            <MultiSelectFilter
              label="Companies"
              placeholder="All companies"
              options={companyOptions}
              selectedIds={filters.companyIds}
              onChange={handleCompaniesChange}
              searchable
              showSelectAll
            />
            {filters.companyIds.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.companyIds.slice(0, 3).map((id) => {
                  const company = companyOptions.find((c) => c.id === id)
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {company?.name || id}
                      <button
                        onClick={() =>
                          handleCompaniesChange(
                            filters.companyIds.filter((cid) => cid !== id)
                          )
                        }
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
                {filters.companyIds.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{filters.companyIds.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Departments
            </Label>
            <MultiSelectFilter
              label="Departments"
              placeholder="All departments"
              options={departmentOptions}
              selectedIds={filters.departments}
              onChange={handleDepartmentsChange}
              searchable
              showSelectAll
            />
            {filters.departments.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.departments.slice(0, 3).map((dept) => (
                  <span
                    key={dept}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-secondary/10 text-secondary rounded-full"
                  >
                    {dept}
                    <button
                      onClick={() =>
                        handleDepartmentsChange(
                          filters.departments.filter((d) => d !== dept)
                        )
                      }
                      className="hover:bg-secondary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {filters.departments.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{filters.departments.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Status
            </Label>
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
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="comparison-mode-sidebar"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Comparison Mode
              </Label>
              <Switch
                id="comparison-mode-sidebar"
                checked={filters.comparisonMode !== null}
                onCheckedChange={handleComparisonModeChange}
              />
            </div>

            {filters.comparisonMode === 'period' && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">
                  Compare with period
                </Label>
                <DateRangePicker
                  value={
                    filters.comparisonDateRange || {
                      startDate: '',
                      endDate: '',
                    }
                  }
                  preset="custom"
                  onPresetChange={() => {}}
                  onDateChange={handleComparisonDateChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
