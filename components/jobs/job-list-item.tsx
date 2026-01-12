'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Briefcase, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPostedDate } from '@/lib/utils/format-date'
import { Badge } from '@/components/ui/badge'
import type { Job, ExperienceLevel } from '@/types'

interface JobListItemProps {
  job: Job
  onSaveToggle?: (jobId: string, isSaved: boolean) => void
}

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
}

export function JobListItem({ job, onSaveToggle }: JobListItemProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSaveToggle?.(job.id, !job.isSaved)
  }

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        'group flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3',
        'transition-all hover:border-gray-300 hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
      )}
    >
      {/* Company Logo */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
        <Image
          src={job.companyLogo}
          alt={`${job.companyName} logo`}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
            {job.title}
          </h3>
          {job.tags.length > 0 && (
            <Badge
              variant="default"
              size="sm"
              className="hidden sm:inline-flex bg-gray-100 text-gray-600 border-0 text-xs"
            >
              {job.tags[0]}
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{job.companyName}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {EXPERIENCE_LABELS[job.experienceLevel]}
          </span>
        </div>
      </div>

      {/* Right Side: Posted Date + Save */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden md:flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {formatPostedDate(job.postedDate)}
        </span>
        <button
          onClick={handleSaveClick}
          className={cn(
            'p-2 rounded-lg transition-all',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
            job.isSaved ? 'text-destructive' : 'text-gray-400 hover:text-gray-600'
          )}
          aria-label={job.isSaved ? 'Remove from saved jobs' : 'Save job'}
        >
          <Heart
            className="h-4 w-4"
            fill={job.isSaved ? 'currentColor' : 'none'}
          />
        </button>
      </div>
    </Link>
  )
}

interface JobListProps {
  jobs: Job[]
  onSaveToggle?: (jobId: string, isSaved: boolean) => void
  className?: string
}

export function JobList({ jobs, onSaveToggle, className }: JobListProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} onSaveToggle={onSaveToggle} />
      ))}
    </div>
  )
}
