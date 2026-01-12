'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Building2,
  MapPin,
  Calendar,
  Send,
  Heart,
  Share2,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSaveJob } from '@/lib/hooks/use-jobs'
import { formatPostedDate } from '@/lib/utils/format-date'
import type { Job, ExperienceLevel } from '@/types'
import { cn } from '@/lib/utils'

interface JobDetailHeaderProps {
  job: Job
  onApplyClick: () => void
}

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
}

export function JobDetailHeader({ job, onApplyClick }: JobDetailHeaderProps) {
  const router = useRouter()
  const saveJobMutation = useSaveJob()
  const [isSaved, setIsSaved] = useState(job.isSaved || false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    saveJobMutation.mutate(job.id)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job at ${job.companyName}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Format salary range
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `${job.salaryCurrency || 'INR'} ${(job.salaryMin / 100000).toFixed(1)}L - ${(job.salaryMax / 100000).toFixed(1)}L`
      : null

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      {/* Header Content */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Company Logo + Info */}
        <div className="flex gap-5">
          {/* Logo */}
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-300">
            <Image
              src={job.companyLogo}
              alt={job.companyName}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          {/* Title and Company */}
          <div className="flex-1">
            <h1 className="mb-2 text-h1 font-bold text-gray-900">
              {job.title}
            </h1>

            <div className="mb-3 flex flex-wrap items-center gap-4 text-body text-gray-600">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {job.companyName}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatPostedDate(job.postedDate)}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">
                {EXPERIENCE_LABELS[job.experienceLevel]}
              </Badge>
              <Badge variant="info">{job.type}</Badge>
              <Badge variant="default">{job.function}</Badge>
              {salaryRange && <Badge variant="success">{salaryRange}</Badge>}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onApplyClick} size="lg" className="gap-2">
            <Send className="h-4 w-4" />
            Apply Now
          </Button>

          <Button onClick={handleSave} variant="secondary" size="lg">
            <Heart
              className={cn('h-5 w-5', isSaved && 'fill-current text-destructive')}
              strokeWidth={isSaved ? 0 : 2}
            />
          </Button>

          <Button onClick={handleShare} variant="ghost" size="lg">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
