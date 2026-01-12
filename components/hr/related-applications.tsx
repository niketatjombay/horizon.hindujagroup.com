'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Briefcase, Calendar, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusOption } from './status-change-dropdown'
import type { Application } from '@/types'

interface RelatedApplicationsProps {
  applications: Application[]
  currentApplicationId: string
  className?: string
}

export function RelatedApplications({
  applications,
  currentApplicationId,
  className,
}: RelatedApplicationsProps) {
  const router = useRouter()

  // Filter out current application
  const otherApplications = applications.filter(
    (app) => app.id !== currentApplicationId
  )

  if (otherApplications.length === 0) {
    return null
  }

  return (
    <Card className={cn('p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Other Applications
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        This applicant has applied to {otherApplications.length} other{' '}
        {otherApplications.length === 1 ? 'position' : 'positions'}
      </p>

      <div className="space-y-3">
        {otherApplications.map((app) => {
          const statusOption = getStatusOption(app.status)

          return (
            <button
              key={app.id}
              onClick={() => router.push(`/hr/applicants/${app.id}`)}
              className="w-full p-4 rounded-lg border border-gray-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all text-left group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-900 truncate">
                    {app.jobTitle}
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(app.appliedAt), 'MMM d, yyyy')}</span>
                </div>
                <Badge
                  className={cn(
                    'text-xs',
                    statusOption.bgColor,
                    statusOption.color
                  )}
                >
                  {statusOption.label}
                </Badge>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
