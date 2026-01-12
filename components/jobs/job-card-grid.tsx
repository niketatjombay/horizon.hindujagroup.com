import { JobCard } from './job-card'
import type { Job } from '@/types'

interface JobCardGridProps {
  jobs: Job[]
  onSaveToggle?: (jobId: string, isSaved: boolean) => void
  emptyMessage?: string
}

export function JobCardGrid({ jobs, onSaveToggle, emptyMessage = 'No jobs found' }: JobCardGridProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onSaveToggle={onSaveToggle} />
      ))}
    </div>
  )
}
