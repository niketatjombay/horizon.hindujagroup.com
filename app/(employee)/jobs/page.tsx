'use client'

import { Suspense } from 'react'
import { X, Filter } from 'lucide-react'
import { SearchBar } from '@/components/shared/search-bar'
import { Pagination } from '@/components/shared/pagination'
import { JobFilters } from '@/components/jobs/job-filters'
import { JobCardGrid } from '@/components/jobs/job-card-grid'
import { CardSkeleton } from '@/components/shared/loading-skeleton'
import { NoJobsFound } from '@/components/shared/empty-state'
import { useJobs, useSaveJob } from '@/lib/hooks/use-jobs'
import { useFilters } from '@/lib/hooks/use-filters'
import type { JobFilters as JobFiltersType } from '@/types'

const JOBS_PER_PAGE = 12

function BrowseJobsContent() {
  const { filters, updateFilters, clearFilters, activeFilterCount } = useFilters()
  const saveJobMutation = useSaveJob()

  // Convert our filter state to JobFilters type for the API
  const apiFilters = {
    search: filters.search,
    company: filters.company.length > 0 ? filters.company : undefined,
    location: filters.location.length > 0 ? filters.location : undefined,
    function: filters.function.length > 0 ? filters.function : undefined,
    experienceLevel: filters.experienceLevel.length > 0 ? filters.experienceLevel : undefined,
    type: filters.jobType.length > 0 ? filters.jobType : undefined,
    page: filters.page,
    pageSize: JOBS_PER_PAGE,
  }

  // Fetch jobs with filters
  const { data, isLoading } = useJobs(apiFilters)

  const jobs = data?.data || []
  const totalJobs = data?.pagination?.total || 0
  const totalPages = data?.pagination?.totalPages || 1
  const showingFrom = totalJobs > 0 ? (filters.page - 1) * JOBS_PER_PAGE + 1 : 0
  const showingTo = Math.min(filters.page * JOBS_PER_PAGE, totalJobs)

  const handleSearch = (query: string) => {
    updateFilters({ search: query || undefined })
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveToggle = (jobId: string, _isSaved: boolean) => {
    saveJobMutation.mutate(jobId)
  }

  // Convert filter state for JobFilters component
  const componentFilters: JobFiltersType = {
    search: filters.search,
    company: filters.company,
    location: filters.location,
    function: filters.function,
    experienceLevel: filters.experienceLevel,
    type: filters.jobType,
  }

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    updateFilters({
      search: newFilters.search,
      company: newFilters.company || [],
      location: newFilters.location || [],
      function: newFilters.function || [],
      experienceLevel: newFilters.experienceLevel || [],
      jobType: newFilters.type || [],
    })
  }

  return (
    <div className="flex gap-8">
      {/* Desktop Filters Sidebar */}
      <JobFilters
        filters={componentFilters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            placeholder="Search by job title, skills, or keywords..."
            onSearch={handleSearch}
            expandOnFocus={false}
            className="w-full"
          />
        </div>

        {/* Result Count and Active Filters */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            {!isLoading && (
              <p className="text-sm text-gray-600">
                {totalJobs > 0 ? (
                  <>
                    Showing {showingFrom}-{showingTo} of{' '}
                    <span className="font-semibold">{totalJobs}</span> jobs
                  </>
                ) : (
                  'No jobs found'
                )}
              </p>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <X className="h-4 w-4" />
              Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: JOBS_PER_PAGE }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <JobCardGrid jobs={jobs} onSaveToggle={handleSaveToggle} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-12"
              />
            )}
          </>
        ) : (
          <NoJobsFound onAction={clearFilters} />
        )}
      </main>
    </div>
  )
}

export default function BrowseJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-8">
          <div className="hidden w-72 flex-shrink-0 md:block">
            <div className="h-96 rounded-lg border border-gray-300 bg-white p-6 shadow-1 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BrowseJobsContent />
    </Suspense>
  )
}
