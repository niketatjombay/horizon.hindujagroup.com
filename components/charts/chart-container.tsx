'use client'

import { BarChart2, AlertCircle, RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  title: string
  subtitle?: string
  loading?: boolean
  error?: Error | string | null
  isEmpty?: boolean
  onRetry?: () => void
  actions?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  minHeight?: number
}

export function ChartContainer({
  title,
  subtitle,
  loading = false,
  error = null,
  isEmpty = false,
  onRetry,
  actions,
  footer,
  children,
  className,
  minHeight = 300,
}: ChartContainerProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-200 p-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Body */}
      <div
        className="relative overflow-visible p-6"
        style={{ minHeight: `${minHeight}px` }}
      >
        {loading ? (
          <LoadingState minHeight={minHeight} />
        ) : error ? (
          <ErrorState message={errorMessage} onRetry={onRetry} minHeight={minHeight} />
        ) : isEmpty ? (
          <EmptyState onRetry={onRetry} minHeight={minHeight} />
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4 text-xs text-gray-500">
          {footer}
        </div>
      )}
    </Card>
  )
}

function LoadingState({ minHeight }: { minHeight: number }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: `${minHeight - 48}px` }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-gray-500">Loading chart data...</p>
      </div>
    </div>
  )
}

function ErrorState({
  message,
  onRetry,
  minHeight,
}: {
  message?: string
  onRetry?: () => void
  minHeight: number
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-12"
      style={{ minHeight: `${minHeight - 48}px` }}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mb-4 h-16 w-16 text-error" />
      <p className="text-base font-medium text-error">
        Failed to load chart data
      </p>
      <p className="mt-2 max-w-xs text-center text-sm text-gray-600">
        {message || 'An error occurred while loading the data'}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}

function EmptyState({
  onRetry,
  minHeight,
}: {
  onRetry?: () => void
  minHeight: number
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-12"
      style={{ minHeight: `${minHeight - 48}px` }}
      role="status"
    >
      <BarChart2 className="mb-4 h-16 w-16 text-gray-400" />
      <p className="text-base font-medium text-gray-600">
        No data available
      </p>
      <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
        Data will appear here when available
      </p>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      )}
    </div>
  )
}
