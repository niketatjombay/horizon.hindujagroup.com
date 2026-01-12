'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Briefcase, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPostedDate } from '@/lib/utils/format-date'
import { Badge } from '@/components/ui/badge'
import type { Job, ExperienceLevel } from '@/types'

interface JobCardProps {
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

const MAX_VISIBLE_TAGS = 3

export function JobCard({ job, onSaveToggle }: JobCardProps) {
  const visibleTags = job.tags.slice(0, MAX_VISIBLE_TAGS)
  const remainingTagsCount = job.tags.length - MAX_VISIBLE_TAGS

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSaveToggle?.(job.id, !job.isSaved)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSaveToggle?.(job.id, !job.isSaved)
    }
  }

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        'group relative block rounded-xl border border-gray-200 bg-white p-5',
        'shadow-card card-hover',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      )}
      aria-label={`${job.title} at ${job.companyName}, ${job.location}`}
    >
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
          <Image
            src={job.companyLogo}
            alt={`${job.companyName} logo`}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>

        {/* Job Details */}
        <div className="min-w-0 flex-1">
          {/* Title and Save Button Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              {/* Company Name */}
              <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">
                {job.companyName}
              </p>
            </div>
            <button
              onClick={handleSaveClick}
              onKeyDown={handleKeyDown}
              className={cn(
                'flex-shrink-0 p-2 rounded-lg transition-all btn-press',
                'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                job.isSaved ? 'text-destructive bg-destructive-light' : 'text-gray-400 hover:text-gray-600'
              )}
              aria-label={job.isSaved ? 'Remove from saved jobs' : 'Save job'}
            >
              <Heart
                className="h-5 w-5"
                fill={job.isSaved ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Location and Experience */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-gray-400" />
              {EXPERIENCE_LABELS[job.experienceLevel]}
            </span>
          </div>

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {visibleTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  size="sm"
                  className="bg-gray-100 text-gray-700 border-0 font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {remainingTagsCount > 0 && (
                <Badge variant="default" size="sm" className="bg-gray-50 text-gray-500 border-0">
                  +{remainingTagsCount} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer with Posted Date */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {formatPostedDate(job.postedDate)}
        </p>
      </div>
    </Link>
  )
}
