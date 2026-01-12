'use client'

import { AlertTriangle, HardDrive } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StorageUsageChartProps {
  data: {
    used: number
    total: number
    breakdown: Array<{
      category: string
      size: number
      percentage: number
    }>
  }
  height?: number
  isLoading?: boolean
}

const categoryColors: Record<string, string> = {
  Resumes: '#0066FF',
  Documents: '#7B61FF',
  Database: '#00B87C',
  Logs: '#FFA733',
}

export function StorageUsageChart({
  data,
  height = 250,
  isLoading = false,
}: StorageUsageChartProps) {
  const usagePercentage = Math.round((data.used / data.total) * 100)
  const isWarning = usagePercentage >= 80
  const isCritical = usagePercentage >= 90

  // Get color based on usage
  const getProgressColor = () => {
    if (isCritical) return 'bg-destructive'
    if (isWarning) return 'bg-warning'
    return 'bg-success'
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-8 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-100 rounded animate-pulse"
            />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6" style={{ minHeight: height }}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Storage Usage
            </h3>
            <p className="text-sm text-gray-500">
              System storage allocation
            </p>
          </div>
          {isWarning && (
            <div
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium',
                isCritical
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-warning/10 text-warning'
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              {isCritical ? 'Critical' : 'Warning'}
            </div>
          )}
        </div>
      </div>

      {/* Main progress bar */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">
              {data.used}
              <span className="text-lg font-normal text-gray-500">
                /{data.total} GB
              </span>
            </span>
          </div>
          <span
            className={cn(
              'text-sm font-medium',
              isCritical
                ? 'text-destructive'
                : isWarning
                  ? 'text-warning'
                  : 'text-success'
            )}
          >
            {usagePercentage}% used
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', getProgressColor())}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Breakdown</p>
        {data.breakdown.map((item) => (
          <div key={item.category} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: categoryColors[item.category] || '#9CA3AF',
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">
                  {item.category}
                </span>
                <span className="text-sm text-gray-500">
                  {item.size} GB ({item.percentage}%)
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: categoryColors[item.category] || '#9CA3AF',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free space */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Free space available</span>
          <span className="font-medium text-gray-900">
            {data.total - data.used} GB
          </span>
        </div>
      </div>
    </Card>
  )
}
