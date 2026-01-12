'use client'

import { useRouter } from 'next/navigation'
import { JobCardGrid } from '@/components/jobs'
import { NoSavedJobs } from '@/components/shared/empty-state'
import { CardSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { useSavedJobs, useSaveJob } from '@/lib/hooks'

export default function SavedJobsPage() {
  const router = useRouter()
  const { data: savedJobs, isLoading, error, refetch } = useSavedJobs()
  const saveMutation = useSaveJob()

  const handleSaveToggle = (jobId: string, _isSaved: boolean) => {
    saveMutation.mutate(jobId)
  }

  const handleBrowseJobs = () => {
    router.push('/jobs')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <div className="mb-8">
          <div className="mb-2 h-8 w-36 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-56 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <ErrorState
          type="network"
          title="Failed to load saved jobs"
          message="We couldn't load your saved jobs. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-gray-900">Saved Jobs</h1>
        <p className="mt-2 text-body text-gray-600">
          Jobs you&apos;ve bookmarked for later
        </p>
        {savedJobs && savedJobs.length > 0 && (
          <p className="mt-3 text-sm text-gray-500">
            {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Empty State or Job Grid */}
      {!savedJobs || savedJobs.length === 0 ? (
        <NoSavedJobs onAction={handleBrowseJobs} />
      ) : (
        <JobCardGrid jobs={savedJobs} onSaveToggle={handleSaveToggle} />
      )}
    </div>
  )
}
