'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Search,
  MapPin,
  Calendar,
  Users,
  MoreVertical,
  Eye,
  Edit,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, DataTablePagination } from '@/components/shared'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useJobs } from '@/lib/hooks/use-jobs'
import { useAuth } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'
import type { Job, JobStatus } from '@/types'
import type { ColumnDef, SortDirection } from '@/components/shared/data-table'

type StatusFilter = 'all' | 'open' | 'closed'
type SortOption = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'applicants'

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Jobs' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title (A-Z)' },
  { value: 'title_desc', label: 'Title (Z-A)' },
  { value: 'applicants', label: 'Most Applicants' },
]

function getStatusBadgeVariant(status: JobStatus): 'success' | 'warning' | 'error' | 'default' {
  switch (status) {
    case 'open':
      return 'success'
    case 'closed':
      return 'error'
    case 'filled':
      return 'warning'
    case 'draft':
    default:
      return 'default'
  }
}

function getStatusLabel(status: JobStatus): string {
  switch (status) {
    case 'open':
      return 'Open'
    case 'closed':
      return 'Closed'
    case 'filled':
      return 'Filled'
    case 'draft':
      return 'Draft'
    default:
      return status
  }
}

export default function HRJobsPage() {
  const router = useRouter()
  const { user } = useAuth()

  // State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Fetch jobs for the user's company
  const { data: jobsData, isLoading, error } = useJobs({
    company: user?.companyId ? [user.companyId] : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
    sortBy: sortBy === 'applicants' ? 'newest' : sortBy,
    page,
    pageSize,
  })

  // Sort by applicants locally if needed (since mock doesn't support it)
  const sortedJobs = useMemo(() => {
    if (!jobsData?.data) return []
    if (sortBy === 'applicants') {
      return [...jobsData.data].sort((a, b) => b.applicationsCount - a.applicationsCount)
    }
    return jobsData.data
  }, [jobsData?.data, sortBy])

  // Handle row click
  const handleRowClick = useCallback((job: Job) => {
    router.push(`/hr/applicants?jobId=${job.id}`)
  }, [router])

  // Handle job status toggle
  const handleToggleStatus = useCallback((job: Job) => {
    // In a real app, this would call an API to update the job status
    console.log('Toggle status for job:', job.id, 'Current:', job.status)
    // TODO: Implement job status update mutation
  }, [])

  // Table columns
  const columns: ColumnDef<Job>[] = useMemo(
    () => [
      {
        id: 'title',
        header: 'Job Title',
        accessorFn: (row) => (
          <div>
            <p className="font-medium text-gray-900">{row.title}</p>
            <p className="text-xs text-gray-500">{row.department}</p>
          </div>
        ),
        sortable: true,
      },
      {
        id: 'location',
        header: 'Location',
        accessorFn: (row) => (
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-3.5 w-3.5" />
            <span>{row.location}</span>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => (
          <Badge variant={getStatusBadgeVariant(row.status)} size="sm">
            {getStatusLabel(row.status)}
          </Badge>
        ),
      },
      {
        id: 'postedDate',
        header: 'Posted Date',
        accessorFn: (row) => (
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(row.postedDate), 'MMM d, yyyy')}</span>
          </div>
        ),
        sortable: true,
      },
      {
        id: 'applicants',
        header: 'Applicants',
        accessorFn: (row) => (
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-gray-500" />
            <span className="font-medium">{row.applicationsCount}</span>
          </div>
        ),
        sortable: true,
        width: '100px',
      },
      {
        id: 'actions',
        header: '',
        accessorFn: (row) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem onClick={() => router.push(`/hr/applicants?jobId=${row.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Applicants
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleToggleStatus(row)}
                  className={row.status === 'open' ? 'text-error' : 'text-success'}
                >
                  {row.status === 'open' ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Close Job
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reopen Job
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        width: '60px',
        hideOnMobile: true,
      },
    ],
    [router, handleToggleStatus]
  )

  // Mobile card renderer
  const mobileCardRenderer = useCallback(
    (job: Job) => (
      <Card className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.department}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(job.status)} size="sm">
            {getStatusLabel(job.status)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(job.postedDate), 'MMM d')}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{job.applicationsCount}</span>
            <span className="text-gray-500">applicants</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={() => router.push(`/hr/applicants?jobId=${job.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View Applicants
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleToggleStatus(job)}
                className={job.status === 'open' ? 'text-error' : 'text-success'}
              >
                {job.status === 'open' ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Close Job
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reopen Job
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    ),
    [router, handleToggleStatus]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Company Jobs
        </h1>
        <p className="mt-1 text-gray-600">
          Manage job postings and view applicants
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatusFilter(filter.value)
                setPage(1)
              }}
              className={cn(
                statusFilter !== filter.value && 'text-gray-600'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>

      {/* Results count */}
      {jobsData && (
        <div className="text-sm text-gray-600">
          {jobsData.pagination.total} job{jobsData.pagination.total !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedJobs}
        loading={isLoading}
        onRowClick={handleRowClick}
        mobileCardRenderer={mobileCardRenderer}
        emptyState={{
          title: 'No jobs found',
          description: search || statusFilter !== 'all'
            ? 'Try adjusting your filters'
            : 'No job postings yet for your company',
        }}
      />

      {/* Pagination */}
      {jobsData && jobsData.pagination.totalPages > 1 && (
        <DataTablePagination
          currentPage={page}
          totalPages={jobsData.pagination.totalPages}
          totalItems={jobsData.pagination.total}
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
