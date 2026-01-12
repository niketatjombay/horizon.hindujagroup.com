'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ApplicationCard,
  ApplicationFilters,
  WithdrawDialog,
} from '@/components/applications'
import type { FilterStatus, SortOption } from '@/components/applications'
import { NoApplications } from '@/components/shared/empty-state'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { useApplications, useWithdrawApplication } from '@/lib/hooks/use-applications'
import type { Application, ApplicationStatus } from '@/types'

// All possible statuses for filtering
const ALL_STATUSES: ApplicationStatus[] = [
  'submitted',
  'under_review',
  'shortlisted',
  'interview_scheduled',
  'offered',
  'accepted',
  'rejected',
  'withdrawn',
]

// Status order for sorting
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

export default function ApplicationsPage() {
  const router = useRouter()
  const { data: applications, isLoading, error, refetch } = useApplications()
  const withdrawMutation = useWithdrawApplication()

  // Filter and sort state
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  // Withdraw dialog state
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<Application | null>(null)

  // Calculate status counts
  const statusCounts = useMemo(() => {
    if (!applications) return []

    const counts: Record<FilterStatus, number> = {
      all: applications.length,
      submitted: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      offered: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
    }

    applications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++
      }
    })

    // Return counts for statuses that have applications or are 'all'
    return Object.entries(counts)
      .filter(([status, count]) => status === 'all' || count > 0)
      .map(([status, count]) => ({
        status: status as FilterStatus,
        count,
      }))
  }, [applications])

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    if (!applications) return []

    let filtered = [...applications]

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((app) => app.status === selectedStatus)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        )
        break
      case 'oldest':
        filtered.sort(
          (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        )
        break
      case 'company':
        filtered.sort((a, b) => a.userCompanyName.localeCompare(b.userCompanyName))
        break
      case 'status':
        filtered.sort(
          (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
        )
        break
    }

    return filtered
  }, [applications, selectedStatus, sortBy])

  // Handlers
  const handleWithdrawClick = (application: Application) => {
    setApplicationToWithdraw(application)
    setWithdrawDialogOpen(true)
  }

  const handleWithdrawConfirm = async (application: Application) => {
    try {
      await withdrawMutation.mutateAsync(application.id)
      setWithdrawDialogOpen(false)
      setApplicationToWithdraw(null)
    } catch (error) {
      console.error('Failed to withdraw application:', error)
    }
  }

  const handleViewDetails = (application: Application) => {
    router.push(`/jobs/${application.jobId}`)
  }

  const handleBrowseJobs = () => {
    router.push('/jobs')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        <div className="mb-8">
          <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <LoadingSkeleton type="card" count={5} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        <ErrorState
          type="network"
          title="Failed to load applications"
          message="We couldn't load your applications. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-body text-gray-600">
          Track and manage your job applications
        </p>
      </div>

      {/* Empty State */}
      {applications && applications.length === 0 ? (
        <NoApplications onAction={handleBrowseJobs} />
      ) : (
        <>
          {/* Filters */}
          <ApplicationFilters
            statusCounts={statusCounts}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Result Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications?.length || 0} applications
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
              <p className="text-gray-600">
                No applications match the selected filter
              </p>
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

      {/* Withdraw Dialog */}
      <WithdrawDialog
        application={applicationToWithdraw}
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        onConfirm={handleWithdrawConfirm}
        isLoading={withdrawMutation.isPending}
      />
    </div>
  )
}
