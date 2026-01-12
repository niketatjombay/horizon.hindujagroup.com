'use client'

import { Briefcase, FileText, Bookmark, Search, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateSize = 'small' | 'large'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  size?: EmptyStateSize
  className?: string
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  onAction,
  size = 'large',
  className,
}: EmptyStateProps) {
  const isLarge = size === 'large'

  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        isLarge ? 'py-16' : 'py-10',
        'mx-auto max-w-[480px]',
        className
      )}
    >
      {/* Illustrated Icon Container */}
      <div
        className={cn(
          'relative mb-6 flex items-center justify-center',
          isLarge ? 'h-40 w-40' : 'h-28 w-28'
        )}
      >
        {/* Background circles for depth */}
        <div
          className={cn(
            'absolute rounded-full bg-gradient-hero',
            isLarge ? 'h-40 w-40' : 'h-28 w-28'
          )}
        />
        <div
          className={cn(
            'absolute rounded-full bg-white/60',
            isLarge ? 'h-32 w-32' : 'h-22 w-22'
          )}
        />
        <Icon
          className={cn(
            'relative text-gray-400',
            isLarge ? 'h-16 w-16' : 'h-12 w-12'
          )}
          strokeWidth={1.5}
        />
      </div>

      <h3
        className={cn(
          'mb-2 font-semibold text-gray-900',
          isLarge ? 'text-xl' : 'text-lg'
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'mb-6 text-gray-500 max-w-sm',
            isLarge ? 'text-base' : 'text-sm'
          )}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size={isLarge ? 'lg' : 'md'}
          className="btn-press"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Preset empty states
interface PresetEmptyStateProps {
  onAction?: () => void
  size?: EmptyStateSize
  className?: string
}

export function NoJobsFound({ onAction, size, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={Briefcase}
      title="No jobs found"
      description="We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms."
      actionLabel={onAction ? 'Clear Filters' : undefined}
      onAction={onAction}
      size={size}
      className={className}
    />
  )
}

export function NoApplications({ onAction, size, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={FileText}
      title="No applications yet"
      description="You haven't applied to any jobs yet. Browse available positions and start your career journey."
      actionLabel={onAction ? 'Browse Jobs' : undefined}
      onAction={onAction}
      size={size}
      className={className}
    />
  )
}

export function NoSavedJobs({ onAction, size, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={Bookmark}
      title="No saved jobs"
      description="You haven't saved any jobs yet. Save jobs you're interested in to apply later."
      actionLabel={onAction ? 'Explore Jobs' : undefined}
      onAction={onAction}
      size={size}
      className={className}
    />
  )
}

export function NoSearchResults({ onAction, size, className }: PresetEmptyStateProps) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="We couldn't find anything matching your search. Try different keywords or browse all jobs."
      actionLabel={onAction ? 'Clear Search' : undefined}
      onAction={onAction}
      size={size}
      className={className}
    />
  )
}
