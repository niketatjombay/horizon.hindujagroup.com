'use client'

import { Suspense, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, FileText, Bookmark, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { SearchBar } from '@/components/shared/search-bar'
import { Pagination } from '@/components/shared/pagination'
import { JobFilters } from '@/components/jobs/job-filters'
import { JobList } from '@/components/jobs/job-list-item'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { NoJobsFound, NoApplications, NoSavedJobs } from '@/components/shared/empty-state'
import { useJobs, useSaveJob, useSavedJobs } from '@/lib/hooks/use-jobs'
import { useApplications, useWithdrawApplication } from '@/lib/hooks/use-applications'
import { useFilters } from '@/lib/hooks/use-filters'
import {
  ApplicationCard,
  ApplicationFilters,
  WithdrawDialog,
} from '@/components/applications'
import type { FilterStatus, SortOption } from '@/components/applications'
import type { JobFilters as JobFiltersType, Application, ApplicationStatus } from '@/types'
import { cn } from '@/lib/utils'

const JOBS_PER_PAGE = 15

type TabType = 'jobs' | 'applications' | 'saved'

// Status order for sorting applications
const STATUS_ORDER: ApplicationStatus[] = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'offered',
  'accepted',
  'rejected',
  'withdrawn',
]

function JobsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Tab state from URL
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<TabType>(
    tabParam === 'applications' ? 'applications' : tabParam === 'saved' ? 'saved' : 'jobs'
  )

  // Jobs tab state
  const { filters, updateFilters, clearFilters, activeFilterCount } = useFilters()
  const saveJobMutation = useSaveJob()

  // Applications tab state
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<Application | null>(null)
  const withdrawMutation = useWithdrawApplication()

  // API filters for jobs (sorted by newest first)
  const apiFilters = {
    search: filters.search,
    company: filters.company.length > 0 ? filters.company : undefined,
    location: filters.location.length > 0 ? filters.location : undefined,
    function: filters.function.length > 0 ? filters.function : undefined,
    experienceLevel: filters.experienceLevel.length > 0 ? filters.experienceLevel : undefined,
    type: filters.jobType.length > 0 ? filters.jobType : undefined,
    page: filters.page,
    pageSize: JOBS_PER_PAGE,
    sortBy: 'newest' as const,
  }

  // Fetch data
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs(apiFilters)
  const { data: applicationsData, isLoading: isLoadingApplications } = useApplications()
  const { data: savedJobsData, isLoading: isLoadingSaved } = useSavedJobs()

  const jobs = jobsData?.data || []
  const totalJobs = jobsData?.pagination?.total || 0
  const totalPages = jobsData?.pagination?.totalPages || 1
  const applications = applicationsData || []
  const savedJobs = savedJobsData || []

  // Stats for banner
  const applicationsCount = applications.length
  const savedCount = savedJobs.length

  // Filter and sort applications
  const statusCounts = useMemo(() => {
    const counts: Record<FilterStatus, number> = {
      all: applications.length,
      submitted: 0, under_review: 0, shortlisted: 0,
      interview_scheduled: 0, offered: 0, accepted: 0, rejected: 0, withdrawn: 0,
    }
    applications.forEach((app) => {
      if (counts[app.status] !== undefined) counts[app.status]++
    })
    return Object.entries(counts)
      .filter(([status, count]) => status === 'all' || count > 0)
      .map(([status, count]) => ({ status: status as FilterStatus, count }))
  }, [applications])

  const filteredApplications = useMemo(() => {
    let filtered = [...applications]
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((app) => app.status === selectedStatus)
    }
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime())
        break
      case 'company':
        filtered.sort((a, b) => a.userCompanyName.localeCompare(b.userCompanyName))
        break
      case 'status':
        filtered.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
        break
    }
    return filtered
  }, [applications, selectedStatus, sortBy])

  // Handlers
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'jobs') {
      params.delete('tab')
    } else {
      params.set('tab', tab)
    }
    router.push(`/jobs?${params.toString()}`, { scroll: false })
  }

  const handleSearch = (query: string) => {
    updateFilters({ search: query || undefined })
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveToggle = (jobId: string) => {
    saveJobMutation.mutate(jobId)
  }

  const handleWithdrawClick = (application: Application) => {
    setApplicationToWithdraw(application)
    setWithdrawDialogOpen(true)
  }

  const handleWithdrawConfirm = async (application: Application) => {
    await withdrawMutation.mutateAsync(application.id)
    setWithdrawDialogOpen(false)
    setApplicationToWithdraw(null)
  }

  const handleViewDetails = (application: Application) => {
    router.push(`/jobs/${application.jobId}`)
  }

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

  const showingFrom = totalJobs > 0 ? (filters.page - 1) * JOBS_PER_PAGE + 1 : 0
  const showingTo = Math.min(filters.page * JOBS_PER_PAGE, totalJobs)

  const firstName = user?.firstName || 'there'

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Welcome back, {firstName}!
            </h1>
            <p className="text-sm text-gray-600">
              Explore opportunities across 17 Hinduja Group companies
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <JobFilters
          filters={componentFilters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Search Bar - Highlighted */}
          <div className="mb-4 rounded-lg border border-gray-300 bg-white shadow-sm">
            <SearchBar
              placeholder="Search by job title, skills, or keywords..."
              onSearch={handleSearch}
              expandOnFocus={false}
              className="w-full"
            />
          </div>

          {/* Tabs */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-200">
            <nav className="flex gap-6" aria-label="Tabs">
              {[
                { id: 'jobs', label: 'Jobs' },
                { id: 'applications', label: 'My Applications' },
                { id: 'saved', label: 'Saved Jobs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  className={cn(
                    'relative py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {applicationsCount} applied
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" />
                {savedCount} saved
              </span>
            </div>
          </div>

          {/* Jobs Tab Content */}
          {activeTab === 'jobs' && (
            <>
              {/* Result Count */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-gray-600">
                  {isLoadingJobs ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : totalJobs > 0 ? (
                    <>Showing {showingFrom}-{showingTo} of <span className="font-semibold">{totalJobs}</span> jobs</>
                  ) : (
                    'No jobs found'
                  )}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Job List */}
              {isLoadingJobs ? (
                <LoadingSkeleton type="card" count={8} />
              ) : jobs.length > 0 ? (
                <>
                  <JobList jobs={jobs} onSaveToggle={handleSaveToggle} />
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={filters.page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      className="mt-8"
                    />
                  )}
                </>
              ) : (
                <NoJobsFound onAction={clearFilters} />
              )}
            </>
          )}

          {/* Applications Tab Content */}
          {activeTab === 'applications' && (
            <div>
              {isLoadingApplications ? (
                <LoadingSkeleton type="card" count={5} />
              ) : applications.length === 0 ? (
                <NoApplications onAction={() => handleTabChange('jobs')} />
              ) : (
                <>
                  <ApplicationFilters
                    statusCounts={statusCounts}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                  />
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredApplications.length} of {applications.length} applications
                  </div>
                  {filteredApplications.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
                      <p className="text-gray-600">No applications match the selected filter</p>
                      <button
                        onClick={() => setSelectedStatus('all')}
                        className="mt-2 text-sm text-primary hover:underline"
                      >
                        Clear filter
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {filteredApplications.map((application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          onWithdraw={handleWithdrawClick}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
              <WithdrawDialog
                application={applicationToWithdraw}
                open={withdrawDialogOpen}
                onOpenChange={setWithdrawDialogOpen}
                onConfirm={handleWithdrawConfirm}
                isLoading={withdrawMutation.isPending}
              />
            </div>
          )}

          {/* Saved Jobs Tab Content */}
          {activeTab === 'saved' && (
            <div>
              {isLoadingSaved ? (
                <LoadingSkeleton type="card" count={6} />
              ) : savedJobs.length === 0 ? (
                <NoSavedJobs onAction={() => handleTabChange('jobs')} />
              ) : (
                <>
                  <p className="mb-4 text-sm text-gray-600">
                    {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
                  </p>
                  <JobList jobs={savedJobs} onSaveToggle={handleSaveToggle} />
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function JobsPageFallback() {
  return (
    <div>
      <div className="flex gap-6">
        <div className="hidden w-64 shrink-0 md:block">
          <div className="h-96 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="mb-4 h-12 animate-pulse rounded-lg bg-gray-100" />
          <div className="mb-4 h-10 animate-pulse rounded bg-gray-100" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BrowseJobsPage() {
  return (
    <Suspense fallback={<JobsPageFallback />}>
      <JobsPageContent />
    </Suspense>
  )
}
