'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { Briefcase, Clock, Users, MapPin, IndianRupee, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JobDetailHeader, ApplicationModal } from '@/components/jobs'
import { CardSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { useJob } from '@/lib/hooks/use-jobs'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = use(params)
  const { data: job, isLoading, error } = useJob(id)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const handleApplyClick = () => {
    setIsApplyModalOpen(true)
  }

  if (isLoading) {
    return <JobDetailSkeleton />
  }

  if (error || !job) {
    return (
      <ErrorState
        type="general"
        title="Job Not Found"
        message="The job you're looking for doesn't exist or has been removed."
        onRetry={() => window.location.reload()}
      />
    )
  }

  // Format salary range for display in info grid
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `${job.salaryCurrency || 'INR'} ${(job.salaryMin / 100000).toFixed(1)}L - ${(job.salaryMax / 100000).toFixed(1)}L per annum`
      : 'Not disclosed'

  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <JobDetailHeader job={job} onApplyClick={handleApplyClick} />

      {/* Main Content Area */}
      <div className="space-y-6">
          {/* Description Section */}
          <Card className="p-6">
            <h2 className="mb-4 border-b border-gray-200 pb-3 text-h3 font-semibold text-gray-900">
              Job Description
            </h2>
            <div className="prose prose-neutral max-w-none text-body leading-relaxed text-gray-700">
              <p>{job.description}</p>
            </div>
          </Card>

          {/* Responsibilities Section */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 border-b border-gray-200 pb-3 text-h3 font-semibold text-gray-900">
                Key Responsibilities
              </h2>
              <ul className="space-y-2 pl-6">
                {job.responsibilities.map((responsibility, index) => (
                  <li
                    key={index}
                    className="list-disc text-body leading-relaxed text-gray-700"
                  >
                    {responsibility}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements Section */}
          {job.requirements && job.requirements.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 border-b border-gray-200 pb-3 text-h3 font-semibold text-gray-900">
                Requirements
              </h2>
              <ul className="space-y-2 pl-6">
                {job.requirements.map((requirement, index) => (
                  <li
                    key={index}
                    className="list-disc text-body leading-relaxed text-gray-700"
                  >
                    {requirement}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Job Info Grid */}
          <Card className="p-6">
            <h2 className="mb-4 border-b border-gray-200 pb-3 text-h3 font-semibold text-gray-900">
              Job Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Briefcase className="h-5 w-5" />}
                label="Job Type"
                value={formatJobType(job.type)}
              />
              <InfoItem
                icon={<Users className="h-5 w-5" />}
                label="Experience Level"
                value={formatExperienceLevel(job.experienceLevel)}
              />
              <InfoItem
                icon={<Building2 className="h-5 w-5" />}
                label="Department"
                value={job.department}
              />
              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={job.location}
              />
              <InfoItem
                icon={<IndianRupee className="h-5 w-5" />}
                label="Salary Range"
                value={salaryRange}
              />
              <InfoItem
                icon={<Clock className="h-5 w-5" />}
                label="Function"
                value={job.function}
              />
            </div>
          </Card>

          {/* Skills/Tags Section */}
          {job.tags && job.tags.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 border-b border-gray-200 pb-3 text-h3 font-semibold text-gray-900">
                Skills & Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        job={job}
        open={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
      />
    </div>
  )
}

// Info Item component for the job info grid
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

// Loading skeleton
function JobDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="rounded-xl border border-gray-300 bg-white p-6 md:p-8">
        <div className="mb-6 h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

// Helper functions
function formatJobType(type: string): string {
  const typeLabels: Record<string, string> = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
  }
  return typeLabels[type] || type
}

function formatExperienceLevel(level: string): string {
  const levelLabels: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior',
    lead: 'Lead',
    executive: 'Executive',
  }
  return levelLabels[level] || level
}
