'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { ExperienceLevel, JobType } from '@/types'

export interface JobFiltersState {
  search?: string
  company: string[]
  location: string[]
  function: string[]
  experienceLevel: ExperienceLevel[]
  jobType: JobType[]
  page: number
}

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse filters from URL
  const filters: JobFiltersState = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    company: searchParams.getAll('company'),
    location: searchParams.getAll('location'),
    function: searchParams.getAll('function'),
    experienceLevel: searchParams.getAll('experienceLevel') as ExperienceLevel[],
    jobType: searchParams.getAll('jobType') as JobType[],
    page: parseInt(searchParams.get('page') || '1', 10),
  }), [searchParams])

  // Update filters in URL
  const updateFilters = useCallback(
    (newFilters: Partial<JobFiltersState>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Process each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        // Remove old values for this key
        params.delete(key)

        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
          // Add each array value
          value.forEach((v) => {
            if (v) params.append(key, v)
          })
        } else if (value !== '') {
          params.set(key, String(value))
        }
      })

      // Reset to page 1 when filters change (except page itself)
      if (!('page' in newFilters)) {
        params.set('page', '1')
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return (
      (filters.company?.length || 0) +
      (filters.location?.length || 0) +
      (filters.function?.length || 0) +
      (filters.experienceLevel?.length || 0) +
      (filters.jobType?.length || 0) +
      (filters.search ? 1 : 0)
    )
  }, [filters])

  return {
    filters,
    updateFilters,
    clearFilters,
    activeFilterCount,
  }
}
