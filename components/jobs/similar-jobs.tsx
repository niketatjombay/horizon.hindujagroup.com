'use client'

import { JobCard } from './job-card'
import { JobCardGrid } from './job-card-grid'
import { CardSkeleton } from '@/components/shared/loading-skeleton'
import { useJobs, useSaveJob } from '@/lib/hooks/use-jobs'

interface SimilarJobsProps {
  currentJobId: string
  jobFunction: string
  companyName: string
}

export function SimilarJobs({
  currentJobId,
  jobFunction,
  companyName,
}: SimilarJobsProps) {
  // Fetch jobs with same function, excluding current job
  const { data, isLoading } = useJobs({
    function: [jobFunction],
    pageSize: 7, // Fetch one extra to account for current job
  })

  const saveJobMutation = useSaveJob()

  const handleSaveToggle = (jobId: string, _isSaved: boolean) => {
    saveJobMutation.mutate(jobId)
  }

  // Filter out current job and limit to 6
  const similarJobs = (data?.data || [])
    .filter((job) => job.id !== currentJobId)
    .slice(0, 6)

  if (isLoading) {
    return (
      <section className="mt-12">
        <h2 className="mb-6 text-h2 font-semibold text-gray-900">
          Similar Jobs
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (similarJobs.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-h2 font-semibold text-gray-900">
        Similar Jobs
      </h2>

      <JobCardGrid jobs={similarJobs} onSaveToggle={handleSaveToggle} />
    </section>
  )
}
