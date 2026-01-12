import type { ReactNode } from 'react'
import type { Job, Application, User, Company, ApplicationStatus } from './models'
import type { JobFilters } from './api'

// Common Props
export interface BaseProps {
  className?: string
  children?: ReactNode
}

export interface LoadingProps {
  isLoading?: boolean
  loadingText?: string
}

export interface ErrorProps {
  error?: Error | null
  onRetry?: () => void
}

// Layout Props
export interface LayoutProps extends BaseProps {
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

export interface HeaderProps extends BaseProps {
  user?: User
  onLogout?: () => void
}

export interface SidebarProps extends BaseProps {
  isOpen?: boolean
  onClose?: () => void
  navigation: NavigationItem[]
}

export interface NavigationItem {
  label: string
  href: string
  icon?: ReactNode
  badge?: string | number
  children?: NavigationItem[]
}

// Job Components
export interface JobCardProps extends BaseProps {
  job: Job
  company?: Company
  showApplyButton?: boolean
  showSaveButton?: boolean
  onApply?: (jobId: string) => void
  onSave?: (jobId: string) => void
  variant?: 'default' | 'compact' | 'detailed'
}

export interface JobListProps extends BaseProps, LoadingProps, ErrorProps {
  jobs: Job[]
  emptyMessage?: string
  onJobClick?: (job: Job) => void
  variant?: 'grid' | 'list'
}

export interface JobFiltersProps extends BaseProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  onReset?: () => void
  companies?: Array<{ id: string; name: string }>
  locations?: string[]
  functions?: string[]
}

export interface JobDetailsProps extends BaseProps {
  job: Job
  company?: Company
  onApply?: () => void
  onSave?: () => void
  isSaved?: boolean
}

// Application Components
export interface ApplicationCardProps extends BaseProps {
  application: Application
  job?: Job
  showActions?: boolean
  onStatusChange?: (status: ApplicationStatus) => void
}

export interface ApplicationListProps extends BaseProps, LoadingProps, ErrorProps {
  applications: Application[]
  emptyMessage?: string
  onApplicationClick?: (application: Application) => void
}

export interface ApplicationModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { resumeFile: File; coverLetter?: string }) => Promise<void>
  isSubmitting?: boolean
}

// User Components
export interface UserAvatarProps extends BaseProps {
  user: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

// Empty State
export interface EmptyStateProps extends BaseProps {
  title: string
  description: string
  illustration?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

// Loading Skeleton
export interface LoadingSkeletonProps extends BaseProps {
  type: 'card' | 'table' | 'text' | 'avatar'
  count?: number
}

// Chart Props
export interface BarChartProps extends BaseProps {
  data: Array<{ label: string; value: number }>
  color?: string
  title?: string
  height?: number
}

export interface LineChartProps extends BaseProps {
  data: Array<{ label: string; value: number }>
  color?: string
  title?: string
  height?: number
}

// Badge Props
export interface StatusBadgeProps extends BaseProps {
  status: ApplicationStatus | 'active' | 'inactive' | 'pending'
  size?: 'sm' | 'md'
}
