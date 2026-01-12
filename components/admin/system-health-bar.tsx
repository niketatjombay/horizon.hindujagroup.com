'use client'

import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type HealthStatus = 'healthy' | 'warning' | 'error'

interface SystemHealth {
  apiUptime: number
  syncStatus: { successful: number; total: number }
  errorCount: number
  status: HealthStatus
}

interface SystemHealthBarProps {
  className?: string
}

// Mock health data - in production, this would be fetched from an API
function getSystemHealth(): SystemHealth {
  return {
    apiUptime: 99.9,
    syncStatus: { successful: 16, total: 17 },
    errorCount: 2,
    status: 'warning',
  }
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    textColor: 'text-success',
    message: 'All systems operational',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    textColor: 'text-warning',
    message: 'Some issues detected',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    textColor: 'text-destructive',
    message: 'System experiencing issues',
  },
}

export function SystemHealthBar({ className }: SystemHealthBarProps) {
  const health = getSystemHealth()
  const config = statusConfig[health.status]
  const Icon = config.icon

  const failedSyncs = health.syncStatus.total - health.syncStatus.successful
  const statusMessage =
    failedSyncs > 0
      ? `${failedSyncs} sync failure${failedSyncs > 1 ? 's' : ''}`
      : config.message

  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      {/* Status Message */}
      <div className="flex items-center gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0', config.textColor)} />
        <span className={cn('font-medium', config.textColor)}>
          {statusMessage}
        </span>
      </div>

      {/* Metrics */}
      <div className="flex flex-wrap gap-4 text-sm sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">API Uptime:</span>
          <span className={cn('font-semibold', config.textColor)}>
            {health.apiUptime}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Syncs:</span>
          <span className={cn('font-semibold', config.textColor)}>
            {health.syncStatus.successful}/{health.syncStatus.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Errors (24h):</span>
          <span className={cn('font-semibold', config.textColor)}>
            {health.errorCount}
          </span>
        </div>
      </div>
    </div>
  )
}
