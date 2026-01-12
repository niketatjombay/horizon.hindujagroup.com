'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton, ErrorState } from '@/components/shared'
import {
  ApplicantProfileHeader,
  ResumeViewer,
  ApplicationTimeline,
  StatusChangeForm,
  getStatusOption,
} from '@/components/hr'
import {
  useApplicantDetail,
  useAdjacentApplicationIds,
  useUpdateApplicationStatus,
} from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types'

export default function ApplicantDetailPage() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string

  // Fetch applicant detail
  const {
    data: applicant,
    isLoading,
    error,
    refetch,
  } = useApplicantDetail(applicationId)

  // Fetch adjacent application IDs for navigation
  const { data: adjacentIds } = useAdjacentApplicationIds(applicationId)

  // Status update mutation
  const updateStatus = useUpdateApplicationStatus()

  // Handle status change
  const handleStatusChange = useCallback(
    async (newStatus: ApplicationStatus, notes?: string) => {
      await updateStatus.mutateAsync({
        applicationId,
        status: newStatus,
        notes,
      })
      refetch()
    },
    [applicationId, updateStatus, refetch]
  )

  // Navigate to previous/next applicant
  const navigateToPrev = useCallback(() => {
    if (adjacentIds?.prevId) {
      router.push(`/hr/applicants/${adjacentIds.prevId}`)
    }
  }, [adjacentIds?.prevId, router])

  const navigateToNext = useCallback(() => {
    if (adjacentIds?.nextId) {
      router.push(`/hr/applicants/${adjacentIds.nextId}`)
    }
  }, [adjacentIds?.nextId, router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === 'ArrowLeft' && adjacentIds?.prevId) {
        navigateToPrev()
      } else if (e.key === 'ArrowRight' && adjacentIds?.nextId) {
        navigateToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [adjacentIds, navigateToPrev, navigateToNext])

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <LoadingSkeleton type="avatar" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton type="text" className="h-8 w-48" />
            <LoadingSkeleton type="text" className="h-4 w-64" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <LoadingSkeleton type="card" className="h-[300px]" />
            <LoadingSkeleton type="card" className="h-[200px]" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton type="card" className="h-[300px]" />
            <LoadingSkeleton type="card" className="h-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !applicant) {
    return (
      <ErrorState
        title="Application Not Found"
        message="The application you're looking for doesn't exist or has been removed."
        onRetry={refetch}
        onGoBack={() => router.push('/hr/applicants')}
      />
    )
  }

  const statusOption = getStatusOption(applicant.status)

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/hr/applicants"
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Link>
        </nav>

        {/* Previous/Next Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToPrev}
            disabled={!adjacentIds?.prevId}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToNext}
            disabled={!adjacentIds?.nextId}
            className="gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <ApplicantProfileHeader
              name={applicant.userName}
              email={applicant.userEmail}
              phone={applicant.phone}
              location={applicant.location}
              appliedAt={applicant.appliedAt}
              applicationId={applicant.id}
            />
          </Card>

          {/* Job Applied For */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Applied Position
            </h2>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {applicant.jobTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span>{applicant.userCompanyName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Applied {format(new Date(applicant.appliedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge
                    className={cn(
                      'text-sm',
                      statusOption.bgColor,
                      statusOption.color
                    )}
                  >
                    {statusOption.label}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Resume */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resume
            </h2>
            <ResumeViewer
              resumeUrl={applicant.resumeUrl}
              fileName={`${applicant.userName.replace(/\s+/g, '_')}_Resume.pdf`}
            />
          </div>

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Cover Letter
                </h2>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{applicant.coverLetter}</p>
              </div>
            </Card>
          )}

          {/* Application Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Application Timeline
            </h2>
            <ApplicationTimeline events={applicant.timeline} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {/* Status Change Form */}
          <StatusChangeForm
            currentStatus={applicant.status}
            onStatusChange={handleStatusChange}
            disabled={updateStatus.isPending}
          />
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="hidden lg:flex items-center justify-center gap-2 text-xs text-gray-400">
        <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">
          ←
        </kbd>
        <span>Previous</span>
        <span className="mx-2">|</span>
        <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">
          →
        </kbd>
        <span>Next</span>
      </div>
    </div>
  )
}
