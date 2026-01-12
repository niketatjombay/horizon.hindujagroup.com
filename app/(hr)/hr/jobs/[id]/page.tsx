'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Clock,
  Users,
  MapPin,
  IndianRupee,
  Building2,
  ArrowLeft,
  Edit,
  Eye,
  UserPlus,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSkeleton } from '@/components/shared/loading-skeleton'
import { ErrorState } from '@/components/shared/error-state'
import { useJob } from '@/lib/hooks/use-jobs'
import { getApplicationsByJob } from '@/mock/data/applications'
import { formatPostedDate } from '@/lib/utils/format-date'

interface HRJobDetailPageProps {
  params: Promise<{ id: string }>
}

export default function HRJobDetailPage({ params }: HRJobDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: job, isLoading, error } = useJob(id)

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

  // Get applications for this job
  const applications = getApplicationsByJob(job.id)
  const applicationStats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    interview: applications.filter((a) => a.status === 'interview_scheduled').length,
  }

  // Format salary range for display
  const salaryRange =
    job.salaryMin && job.salaryMax
      ? `${job.salaryCurrency || 'INR'} ${(job.salaryMin / 100000).toFixed(1)}L - ${(job.salaryMax / 100000).toFixed(1)}L per annum`
      : 'Not disclosed'

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      {/* Header Card */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Job Info */}
          <div className="flex gap-5">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
              <Image
                src={job.companyLogo}
                alt={`${job.companyName} logo`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-1 text-gray-600">{job.companyName}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="default" className="gap-1 bg-white border border-gray-200 text-gray-700">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </Badge>
                <Badge variant="default" className="gap-1 bg-white border border-gray-200 text-gray-700">
                  <Briefcase className="h-3 w-3" />
                  {formatJobType(job.type)}
                </Badge>
                <Badge
                  variant={job.status === 'open' ? 'success' : 'default'}
                >
                  {job.status === 'open' ? 'Active' : 'Closed'}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Posted {formatPostedDate(job.postedDate)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Job
            </Button>
            <Button
              onClick={() => router.push(`/hr/applicants?jobId=${job.id}`)}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              View Applicants ({applicationStats.total})
            </Button>
          </div>
        </div>

        {/* Application Stats */}
        <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              <p className="text-sm text-gray-500">Total Applications</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-light">
              <Eye className="h-5 w-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{applicationStats.shortlisted}</p>
              <p className="text-sm text-gray-500">Shortlisted</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{applicationStats.interview}</p>
              <p className="text-sm text-gray-500">In Interview</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Job Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description Section */}
          <Card className="p-6">
            <h2 className="mb-4 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
              Job Description
            </h2>
            <div className="prose prose-neutral max-w-none text-gray-700">
              <p>{job.description}</p>
            </div>
          </Card>

          {/* Responsibilities Section */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
                Key Responsibilities
              </h2>
              <ul className="space-y-2 pl-6">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="list-disc text-gray-700">
                    {responsibility}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements Section */}
          {job.requirements && job.requirements.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
                Requirements
              </h2>
              <ul className="space-y-2 pl-6">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="list-disc text-gray-700">
                    {requirement}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right: Job Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
              Job Information
            </h2>
            <div className="space-y-4">
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
              <h2 className="mb-4 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
                Skills & Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="default" className="bg-gray-100 text-gray-700 border-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Info Item component
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
    <div className="flex items-start gap-3">
      <div className="text-gray-400">{icon}</div>
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
      <div className="h-9 w-32 rounded bg-gray-200 animate-shimmer" />
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <div className="h-16 w-16 rounded-xl bg-gray-200 animate-shimmer" />
            <div className="space-y-3">
              <div className="h-8 w-64 rounded bg-gray-200 animate-shimmer" />
              <div className="h-4 w-48 rounded bg-gray-200 animate-shimmer" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded bg-gray-200 animate-shimmer" />
                <div className="h-6 w-20 rounded bg-gray-200 animate-shimmer" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-32 rounded-lg bg-gray-200 animate-shimmer" />
            <div className="h-12 w-40 rounded-lg bg-gray-200 animate-shimmer" />
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div>
          <CardSkeleton />
        </div>
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
