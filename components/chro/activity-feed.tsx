'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FileText, Users, CheckCircle, XCircle } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'

interface Activity {
  id: string
  type: 'applied' | 'interview' | 'offered' | 'rejected'
  applicantName: string
  jobTitle: string
  companyName: string
  timestamp: string
  hrName: string
}

interface ActivityFeedProps {
  activities: Activity[]
  maxHeight?: number
  isLoading?: boolean
}

const ACTIVITY_CONFIG = {
  applied: {
    icon: FileText,
    label: 'Applied',
    variant: 'info' as const,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  interview: {
    icon: Users,
    label: 'Interview',
    variant: 'info' as const,
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
  },
  offered: {
    icon: CheckCircle,
    label: 'Offered',
    variant: 'success' as const,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  rejected: {
    icon: XCircle,
    label: 'Rejected',
    variant: 'error' as const,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
  },
}

function ActivityItem({ activity }: { activity: Activity }) {
  const config = ACTIVITY_CONFIG[activity.type]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
          config.bgColor
        )}
      >
        <Icon className={cn('h-5 w-5', config.iconColor)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.applicantName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {activity.jobTitle} at {activity.companyName}
            </p>
          </div>
          <Badge variant={config.variant} className="shrink-0 text-xs">
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
          </span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-400">by {activity.hrName}</span>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ActivityFeed({
  activities,
  maxHeight = 400,
  isLoading = false,
}: ActivityFeedProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activity
        </h3>
        <p className="text-sm text-gray-500">
          Latest updates across all companies
        </p>
      </div>

      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight }}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div>
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
