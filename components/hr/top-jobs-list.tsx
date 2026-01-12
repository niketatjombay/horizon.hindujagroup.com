'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Users } from 'lucide-react'
import type { Job } from '@/types'

interface TopJob {
  job: Job
  applicantsCount: number
  newToday?: number
}

interface TopJobsListProps {
  jobs: TopJob[]
  isLoading?: boolean
}

export function TopJobsList({ jobs, isLoading }: TopJobsListProps) {
  const router = useRouter()

  const handleJobClick = (jobId: string) => {
    router.push(`/hr/jobs/${jobId}`)
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No active job postings</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="divide-y divide-gray-100">
        {jobs.map((item, index) => (
          <button
            key={item.job.id}
            onClick={() => handleJobClick(item.job.id)}
            className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {item.job.title}
                </p>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.job.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1 font-semibold text-gray-900">
                <Users className="h-4 w-4 text-gray-400" />
                {item.applicantsCount}
              </span>
              {item.newToday && item.newToday > 0 && (
                <span className="text-xs text-success">
                  +{item.newToday} today
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
