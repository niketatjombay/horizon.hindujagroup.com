'use client'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { getStatusOption } from './status-change-dropdown'
import type { ApplicationStatus } from '@/types'

export interface TimelineEvent {
  id: string
  status: ApplicationStatus
  timestamp: string
  changedBy?: string
  notes?: string
}

interface ApplicationTimelineProps {
  events: TimelineEvent[]
  className?: string
}

export function ApplicationTimeline({
  events,
  className,
}: ApplicationTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        No timeline events available
      </div>
    )
  }

  // Sort events by timestamp (most recent first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className={cn('relative', className)}>
      {sortedEvents.map((event, index) => {
        const statusOption = getStatusOption(event.status)
        const isLast = index === sortedEvents.length - 1

        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connecting Line */}
            {!isLast && (
              <div
                className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-200"
                aria-hidden="true"
              />
            )}

            {/* Status Dot */}
            <div
              className={cn(
                'relative z-10 h-6 w-6 rounded-full flex items-center justify-center shrink-0',
                statusOption.bgColor
              )}
            >
              <div
                className={cn(
                  'h-3 w-3 rounded-full',
                  statusOption.color.replace('text-', 'bg-')
                )}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              {/* Status and Time Row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                <span className={cn('font-semibold', statusOption.color)}>
                  {statusOption.label}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(event.timestamp), 'MMM d, yyyy')} at{' '}
                  {format(new Date(event.timestamp), 'h:mm a')}
                </span>
              </div>

              {/* Changed By */}
              {event.changedBy && (
                <p className="text-sm text-gray-600 mb-1">
                  Changed by {event.changedBy}
                </p>
              )}

              {/* Notes */}
              {event.notes && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                  {event.notes}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
