'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Building2, MapPin, Calendar, ExternalLink, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Application, ApplicationStatus } from '@/types'

interface ApplicationCardProps {
  application: Application
  onWithdraw?: (application: Application) => void
  onViewDetails?: (application: Application) => void
}

// Map status to display label
const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Applied',
  under_review: 'Reviewing',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview',
  offered: 'Offered',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

// Map status to badge variant
const STATUS_VARIANTS: Record<ApplicationStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  submitted: 'default',
  under_review: 'warning',
  shortlisted: 'info',
  interview_scheduled: 'info',
  offered: 'success',
  accepted: 'success',
  rejected: 'error',
  withdrawn: 'error',
}

// Statuses that can be withdrawn
const WITHDRAWABLE_STATUSES: ApplicationStatus[] = ['submitted', 'under_review']

export function ApplicationCard({
  application,
  onWithdraw,
  onViewDetails,
}: ApplicationCardProps) {
  const canWithdraw = WITHDRAWABLE_STATUSES.includes(application.status)

  const handleWithdrawClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWithdraw?.(application)
  }

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onViewDetails?.(application)
  }

  // Get job info from application (assuming we have company info in the mock data)
  const companyLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(application.userCompanyName)}&background=random&size=96`

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-gray-200 bg-white p-6',
        'transition-all duration-200',
        'hover:border-gray-300 hover:shadow-2',
        'cursor-pointer'
      )}
    >
      <Link
        href={`/jobs/${application.jobId}`}
        className="absolute inset-0 z-0"
        aria-label={`View ${application.jobTitle} at ${application.userCompanyName}`}
      />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Left Section - Company Logo + Info */}
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Image
              src={companyLogo}
              alt={`${application.userCompanyName} logo`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          {/* Job Info */}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
              {application.jobTitle}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {application.userCompanyName}
              </span>
              {/* Note: Location not available in Application type, using placeholder */}
            </div>

            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Applied on {format(parseISO(application.appliedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Status + Actions */}
        <div className="flex flex-col items-start gap-3 md:items-end">
          {/* Status Badge */}
          <Badge
            variant={STATUS_VARIANTS[application.status]}
            size="md"
            className="font-semibold"
          >
            {STATUS_LABELS[application.status]}
          </Badge>

          {/* Actions */}
          <div className="flex gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetailsClick}
              className="text-gray-600 hover:text-primary"
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              View Details
            </Button>

            {canWithdraw && onWithdraw && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWithdrawClick}
                className="text-gray-600 hover:text-destructive"
              >
                <X className="mr-1 h-4 w-4" />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { STATUS_LABELS, STATUS_VARIANTS, WITHDRAWABLE_STATUSES }
