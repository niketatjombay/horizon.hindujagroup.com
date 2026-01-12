'use client'

import { cn } from '@/lib/utils'

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
}

/**
 * Responsive dashboard grid layout
 * - Desktop (≥1200px): 3 columns
 * - Tablet (768-1199px): 2 columns
 * - Mobile (<768px): 1 column
 */
export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}

interface DashboardGridItemProps {
  children: React.ReactNode
  span?: 1 | 2 | 3 | 'full'
  className?: string
}

/**
 * Grid item with optional column span
 * - span=1: 1 column (default)
 * - span=2: 2 columns
 * - span=3: 3 columns
 * - span="full": All columns
 */
export function DashboardGridItem({
  children,
  span = 1,
  className,
}: DashboardGridItemProps) {
  const spanClass =
    span === 'full'
      ? 'col-span-1 md:col-span-2 lg:col-span-3'
      : span === 3
        ? 'col-span-1 md:col-span-2 lg:col-span-3'
        : span === 2
          ? 'col-span-1 md:col-span-2'
          : 'col-span-1'

  return <div className={cn(spanClass, className)}>{children}</div>
}
