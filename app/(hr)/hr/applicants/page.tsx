'use client'

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import {
  Search,
  Mail,
  Building2,
  Calendar,
  FileText,
  ExternalLink,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, DataTablePagination } from '@/components/shared'
import {
  StatusChangeDropdown,
  BulkActionsBar,
  APPLICATION_STATUS_OPTIONS,
  getStatusOption,
} from '@/components/hr'
import {
  useApplicationsPaginated,
  useUpdateApplicationStatus,
  useBulkUpdateApplicationStatus,
} from '@/lib/hooks/use-applications'
import { useJobs } from '@/lib/hooks/use-jobs'
import { useAuth } from '@/lib/hooks/use-auth'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { cn } from '@/lib/utils'
import type { Application, ApplicationStatus } from '@/types'
import type { ColumnDef } from '@/components/shared/data-table'

type SortOption = 'newest' | 'oldest' | 'status'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'status', label: 'By Status' },
]

function HRApplicantsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Get jobId from URL if present
  const urlJobId = searchParams.get('jobId')

  // State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [jobFilter, setJobFilter] = useState<string>(urlJobId || 'all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Debounced search
  const debouncedSearch = useDebounce(search, 300)

  // Sync jobFilter with URL changes
  useEffect(() => {
    if (urlJobId && urlJobId !== jobFilter) {
      setJobFilter(urlJobId)
    }
  }, [urlJobId])

  // Fetch jobs for the filter dropdown (user's company jobs)
  const { data: jobsData } = useJobs({
    company: user?.companyId ? [user.companyId] : undefined,
    pageSize: 100,
  })

  // Fetch applications
  const { data: applicationsData, isLoading, refetch } = useApplicationsPaginated({
    jobId: jobFilter !== 'all' ? jobFilter : undefined,
    status: statusFilter !== 'all' ? [statusFilter] : undefined,
    sortBy,
    page,
    pageSize,
  })

  // Mutations
  const updateStatus = useUpdateApplicationStatus()
  const bulkUpdateStatus = useBulkUpdateApplicationStatus()

  // Filter by search (client-side for name/email)
  const filteredApplications = useMemo(() => {
    if (!applicationsData?.data) return []
    if (!debouncedSearch) return applicationsData.data

    const searchLower = debouncedSearch.toLowerCase()
    return applicationsData.data.filter(
      (app) =>
        app.userName.toLowerCase().includes(searchLower) ||
        app.userEmail.toLowerCase().includes(searchLower)
    )
  }, [applicationsData?.data, debouncedSearch])

  // Handle single status change
  const handleStatusChange = useCallback(
    async (applicationId: string, newStatus: ApplicationStatus) => {
      await updateStatus.mutateAsync({ applicationId, status: newStatus })
    },
    [updateStatus]
  )

  // Handle bulk status change
  const handleBulkStatusChange = useCallback(
    async (newStatus: ApplicationStatus) => {
      await bulkUpdateStatus.mutateAsync({
        applicationIds: selectedRows,
        status: newStatus,
      })
      setSelectedRows([])
    },
    [bulkUpdateStatus, selectedRows]
  )

  // Clear job filter
  const clearJobFilter = useCallback(() => {
    setJobFilter('all')
    // Also update URL
    router.push('/hr/applicants')
  }, [router])

  // Get job title for display
  const selectedJobTitle = useMemo(() => {
    if (jobFilter === 'all' || !jobsData?.data) return null
    const job = jobsData.data.find((j) => j.id === jobFilter)
    return job?.title
  }, [jobFilter, jobsData?.data])

  // Table columns
  const columns: ColumnDef<Application>[] = useMemo(
    () => [
      {
        id: 'applicant',
        header: 'Applicant',
        accessorFn: (row) => (
          <div>
            <p className="font-medium text-gray-900">{row.userName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Mail className="h-3 w-3" />
              {row.userEmail}
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        id: 'job',
        header: 'Applied For',
        accessorFn: (row) => (
          <div>
            <p className="font-medium text-gray-800">{row.jobTitle}</p>
          </div>
        ),
      },
      {
        id: 'company',
        header: 'Current Company',
        accessorFn: (row) => (
          <div className="flex items-center gap-1 text-gray-600">
            <Building2 className="h-3.5 w-3.5" />
            <span>{row.userCompanyName}</span>
          </div>
        ),
        hideOnMobile: true,
      },
      {
        id: 'appliedAt',
        header: 'Applied Date',
        accessorFn: (row) => (
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(row.appliedAt), 'MMM d, yyyy')}</span>
          </div>
        ),
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusChangeDropdown
              currentStatus={row.status}
              onStatusChange={(newStatus) => handleStatusChange(row.id, newStatus)}
              disabled={updateStatus.isPending}
            />
          </div>
        ),
        width: '140px',
      },
      {
        id: 'resume',
        header: '',
        accessorFn: (row) =>
          row.resumeUrl ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1"
              onClick={(e) => {
                e.stopPropagation()
                window.open(row.resumeUrl, '_blank')
              }}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </Button>
          ) : null,
        width: '100px',
        hideOnMobile: true,
      },
    ],
    [handleStatusChange, updateStatus.isPending]
  )

  // Mobile card renderer
  const mobileCardRenderer = useCallback(
    (app: Application, isSelected: boolean) => {
      const statusOption = getStatusOption(app.status)
      return (
        <Card
          className={cn(
            'p-4',
            isSelected && 'ring-2 ring-primary bg-primary-50'
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-gray-900">{app.userName}</h3>
              <p className="text-xs text-gray-500">{app.userEmail}</p>
            </div>
            <StatusChangeDropdown
              currentStatus={app.status}
              onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus)}
              disabled={updateStatus.isPending}
            />
          </div>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Applied for:</span>
              <span className="font-medium">{app.jobTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Current company:</span>
              <span>{app.userCompanyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Applied:</span>
              <span>{format(new Date(app.appliedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {app.resumeUrl && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full gap-2"
              onClick={() => window.open(app.resumeUrl, '_blank')}
            >
              <FileText className="h-4 w-4" />
              View Resume
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </Card>
      )
    },
    [handleStatusChange, updateStatus.isPending]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Total Applications
        </h1>
        <p className="mt-1 text-gray-600">
          Review and manage applications for your company's jobs
        </p>
      </div>

      {/* Job Filter Banner (when filtering by specific job) */}
      {selectedJobTitle && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing applicants for:
            </span>
            <span className="font-medium text-primary-700">{selectedJobTitle}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearJobFilter}
            className="text-primary-700 hover:text-primary-900"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filter
          </Button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedRows.length}
        onClear={() => setSelectedRows([])}
        onStatusChange={handleBulkStatusChange}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as ApplicationStatus | 'all')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {APPLICATION_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Job Filter */}
        <Select
          value={jobFilter}
          onValueChange={(value) => {
            setJobFilter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobsData?.data.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
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

      {/* Results count */}
      {applicationsData && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredApplications.length === applicationsData.pagination.total ? (
              <>
                {applicationsData.pagination.total} applicant
                {applicationsData.pagination.total !== 1 ? 's' : ''} found
              </>
            ) : (
              <>
                Showing {filteredApplications.length} of{' '}
                {applicationsData.pagination.total} applicants
              </>
            )}
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredApplications}
        loading={isLoading}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        mobileCardRenderer={mobileCardRenderer}
        emptyState={{
          title: 'No applicants found',
          description:
            search || statusFilter !== 'all' || jobFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No applications received yet',
        }}
      />

      {/* Pagination */}
      {applicationsData && applicationsData.pagination.totalPages > 1 && (
        <DataTablePagination
          currentPage={page}
          totalPages={applicationsData.pagination.totalPages}
          totalItems={applicationsData.pagination.total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      )}
    </div>
  )
}

function ApplicantsPageFallback() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="mt-2 h-5 w-64 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="flex gap-4">
        <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-40 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    </div>
  )
}

export default function HRApplicantsPage() {
  return (
    <Suspense fallback={<ApplicantsPageFallback />}>
      <HRApplicantsPageContent />
    </Suspense>
  )
}
