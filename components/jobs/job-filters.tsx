'use client'

import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import type { JobFilters as JobFiltersType, ExperienceLevel, JobType } from '@/types'
import { MOCK_COMPANIES } from '@/mock'
import { FilterSection } from './filter-section'
import { ActiveFilterChips } from './active-filter-chips'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface JobFiltersProps {
  filters: JobFiltersType
  onFiltersChange: (filters: JobFiltersType) => void
  className?: string
}

const LOCATIONS = [
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Remote',
]

const FUNCTIONS = [
  'Engineering',
  'Product',
  'Data & Analytics',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'Legal',
]

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
]

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
]

const POSTED_DATE_OPTIONS = [
  { value: 'last24h', label: 'Last 24 hours' },
  { value: 'last7d', label: 'Last 7 days' },
  { value: 'last30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
]

export function JobFilters({
  filters,
  onFiltersChange,
  className,
}: JobFiltersProps) {
  const [companySearch, setCompanySearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Create company name lookup map
  const companyNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    MOCK_COMPANIES.forEach((company) => {
      map[company.id] = company.name
    })
    return map
  }, [])

  // Filter companies based on search
  const filteredCompanies = useMemo(
    () =>
      MOCK_COMPANIES.filter((company) =>
        company.name.toLowerCase().includes(companySearch.toLowerCase())
      ),
    [companySearch]
  )

  // Filter locations based on search
  const filteredLocations = useMemo(
    () =>
      LOCATIONS.filter((location) =>
        location.toLowerCase().includes(locationSearch.toLowerCase())
      ),
    [locationSearch]
  )

  // Toggle array filter value
  const toggleArrayFilter = <K extends keyof JobFiltersType>(
    filterType: K,
    value: string
  ) => {
    const currentValues = (filters[filterType] as string[] | undefined) || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    onFiltersChange({
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : undefined,
    })
  }

  // Set posted date filter
  const setPostedDateFilter = (value: string) => {
    if (value === 'all') {
      onFiltersChange({
        ...filters,
        postedAfter: undefined,
      })
      return
    }

    const now = new Date()
    let date: Date

    switch (value) {
      case 'last24h':
        date = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'last7d':
        date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'last30d':
        date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }

    onFiltersChange({
      ...filters,
      postedAfter: date.toISOString(),
    })
  }

  // Remove specific filter
  const removeFilter = (filterType: keyof JobFiltersType, value?: string) => {
    if (value !== undefined) {
      const currentValues = (filters[filterType] as string[] | undefined) || []
      const newValues = currentValues.filter((v) => v !== value)
      onFiltersChange({
        ...filters,
        [filterType]: newValues.length > 0 ? newValues : undefined,
      })
    } else {
      onFiltersChange({
        ...filters,
        [filterType]: undefined,
      })
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({})
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.company?.length) count += filters.company.length
    if (filters.location?.length) count += filters.location.length
    if (filters.function?.length) count += filters.function.length
    if (filters.experienceLevel?.length) count += filters.experienceLevel.length
    if (filters.type?.length) count += filters.type.length
    if (filters.postedAfter) count += 1
    return count
  }, [filters])

  // Determine which posted date option is selected
  const getSelectedPostedDate = () => {
    if (!filters.postedAfter) return 'all'
    const postedDate = new Date(filters.postedAfter)
    const now = new Date()
    const diffMs = now.getTime() - postedDate.getTime()
    const diffDays = diffMs / (24 * 60 * 60 * 1000)

    if (diffDays <= 1) return 'last24h'
    if (diffDays <= 7) return 'last7d'
    if (diffDays <= 30) return 'last30d'
    return 'all'
  }

  // Render filter content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-0">
      {/* Active Filters */}
      <ActiveFilterChips
        filters={filters}
        companyNames={companyNameMap}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
      />

      {/* Company Filter */}
      <FilterSection title="Company" activeCount={filters.company?.length || 0}>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
          <Input
            type="search"
            placeholder="Search companies..."
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            className="h-9 bg-gray-50 pl-9 text-sm"
          />
        </div>
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {filteredCompanies.map((company) => (
            <label
              key={company.id}
              className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
            >
              <Checkbox
                checked={filters.company?.includes(company.id)}
                onCheckedChange={() => toggleArrayFilter('company', company.id)}
              />
              <span className="text-sm">{company.name}</span>
            </label>
          ))}
          {filteredCompanies.length === 0 && (
            <p className="py-2 text-center text-sm text-gray-500">
              No companies found
            </p>
          )}
        </div>
      </FilterSection>

      {/* Location Filter */}
      <FilterSection title="Location" activeCount={filters.location?.length || 0}>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
          <Input
            type="search"
            placeholder="Search locations..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="h-9 bg-gray-50 pl-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          {filteredLocations.map((location) => (
            <label
              key={location}
              className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
            >
              <Checkbox
                checked={filters.location?.includes(location)}
                onCheckedChange={() => toggleArrayFilter('location', location)}
              />
              <span className="text-sm">{location}</span>
            </label>
          ))}
          {filteredLocations.length === 0 && (
            <p className="py-2 text-center text-sm text-gray-500">
              No locations found
            </p>
          )}
        </div>
      </FilterSection>

      {/* Function Filter */}
      <FilterSection title="Function" activeCount={filters.function?.length || 0}>
        <div className="space-y-1">
          {FUNCTIONS.map((func) => (
            <label
              key={func}
              className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
            >
              <Checkbox
                checked={filters.function?.includes(func)}
                onCheckedChange={() => toggleArrayFilter('function', func)}
              />
              <span className="text-sm">{func}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Experience Level */}
      <FilterSection title="Experience Level" activeCount={filters.experienceLevel?.length || 0}>
        <div className="space-y-1">
          {EXPERIENCE_LEVELS.map((level) => (
            <label
              key={level.value}
              className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
            >
              <Checkbox
                checked={filters.experienceLevel?.includes(level.value)}
                onCheckedChange={() =>
                  toggleArrayFilter('experienceLevel', level.value)
                }
              />
              <span className="text-sm">{level.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Job Type */}
      <FilterSection title="Job Type" activeCount={filters.type?.length || 0}>
        <div className="space-y-1">
          {JOB_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
            >
              <Checkbox
                checked={filters.type?.includes(type.value)}
                onCheckedChange={() => toggleArrayFilter('type', type.value)}
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Posted Date */}
      <FilterSection title="Posted Date" activeCount={filters.postedAfter ? 1 : 0}>
        <div className="space-y-1">
          {POSTED_DATE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50"
            >
              <Checkbox
                checked={getSelectedPostedDate() === option.value}
                onCheckedChange={() => setPostedDateFilter(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="mt-4 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn('hidden w-72 flex-shrink-0 md:block', className)}>
        <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="text-sm text-gray-500">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Bottom Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg btn-press md:hidden">
            <Filter className="h-6 w-6 text-white" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
