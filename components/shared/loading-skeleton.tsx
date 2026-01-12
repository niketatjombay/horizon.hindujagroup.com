'use client'

import { cn } from '@/lib/utils'

type SkeletonType = 'card' | 'table' | 'text' | 'avatar' | 'custom' | 'metrics' | 'chart'

interface LoadingSkeletonProps {
  type?: SkeletonType
  count?: number
  className?: string
  children?: React.ReactNode
}

// Base skeleton block with shimmer animation
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded bg-gray-200 animate-shimmer',
        className
      )}
    />
  )
}

// Card skeleton matching JobCard layout
function CardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading job card"
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-card"
    >
      <div className="flex gap-4">
        {/* Logo skeleton */}
        <SkeletonBlock className="h-14 w-14 flex-shrink-0 rounded-xl" />

        <div className="min-w-0 flex-1">
          {/* Title and save button row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* Title */}
              <SkeletonBlock className="mb-1.5 h-5 w-3/4" />
              {/* Company name */}
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            {/* Save button placeholder */}
            <SkeletonBlock className="h-9 w-9 flex-shrink-0 rounded-lg" />
          </div>

          {/* Location and experience */}
          <div className="mt-3 flex gap-4">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-20" />
          </div>

          {/* Tags */}
          <div className="mt-3 flex gap-2">
            <SkeletonBlock className="h-6 w-16 rounded-md" />
            <SkeletonBlock className="h-6 w-20 rounded-md" />
            <SkeletonBlock className="h-6 w-14 rounded-md" />
          </div>
        </div>
      </div>

      {/* Footer with posted date */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <SkeletonBlock className="h-3 w-28" />
      </div>
    </div>
  )
}

// Table row skeleton
function TableSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading table row"
      className="flex items-center gap-4 border-b border-gray-200 py-4"
    >
      <SkeletonBlock className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-1/3" />
        <SkeletonBlock className="h-3 w-1/4" />
      </div>
      <SkeletonBlock className="h-4 w-20" />
      <SkeletonBlock className="h-6 w-16 rounded-sm" />
      <SkeletonBlock className="h-8 w-8 rounded" />
    </div>
  )
}

// Text skeleton (for paragraphs)
function TextSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading text"
      className="space-y-3"
    >
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-4 w-4/6" />
    </div>
  )
}

// Avatar skeleton
function AvatarSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading avatar"
      className="flex items-center gap-3"
    >
      <SkeletonBlock className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  )
}

// Metrics card skeleton (for KPI cards in dashboards)
function MetricsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading metric card"
      className="rounded-xl border border-gray-200 border-l-4 border-l-gray-300 bg-white p-6 shadow-card"
    >
      <div className="flex items-start gap-4">
        <SkeletonBlock className="h-12 w-12 rounded-xl" />
        <div className="flex-1 min-w-0 space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-20" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}

// Chart skeleton (for chart containers)
function ChartSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading chart"
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-card"
    >
      <div className="mb-5 space-y-2">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-3 w-48" />
      </div>
      <div className="flex items-end gap-2 h-64">
        <SkeletonBlock className="flex-1 h-3/4 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-1/2 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-2/3 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-4/5 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-1/3 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-3/5 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-2/5 rounded-t-md" />
        <SkeletonBlock className="flex-1 h-3/4 rounded-t-md" />
      </div>
    </div>
  )
}

export function LoadingSkeleton({
  type = 'card',
  count = 1,
  className,
  children,
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />
      case 'table':
        return <TableSkeleton />
      case 'text':
        return <TextSkeleton />
      case 'avatar':
        return <AvatarSkeleton />
      case 'metrics':
        return <MetricsSkeleton />
      case 'chart':
        return <ChartSkeleton />
      case 'custom':
        return children
      default:
        return <CardSkeleton />
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

// Export individual skeleton components for custom compositions
export { SkeletonBlock, CardSkeleton, TableSkeleton, TextSkeleton, AvatarSkeleton, MetricsSkeleton, ChartSkeleton }
