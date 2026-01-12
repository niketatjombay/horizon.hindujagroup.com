'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type MetricVariant = 'default' | 'primary' | 'success' | 'warning' | 'secondary'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
  iconBg?: string
  iconColor?: string
  variant?: MetricVariant
}

const variantStyles: Record<MetricVariant, { border: string; iconBg: string; iconColor: string }> = {
  default: {
    border: 'border-l-gray-300',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
  primary: {
    border: 'border-l-primary',
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
  },
  success: {
    border: 'border-l-success',
    iconBg: 'bg-success-light',
    iconColor: 'text-success',
  },
  warning: {
    border: 'border-l-warning',
    iconBg: 'bg-warning-light',
    iconColor: 'text-warning-foreground',
  },
  secondary: {
    border: 'border-l-secondary',
    iconBg: 'bg-secondary-light',
    iconColor: 'text-secondary',
  },
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  onClick,
  iconBg,
  iconColor,
  variant = 'primary',
}: MetricCardProps) {
  const Component = onClick ? 'button' : 'div'
  const styles = variantStyles[variant]

  return (
    <Component
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left',
        'border-l-4 shadow-card card-hover',
        styles.border,
        onClick && 'cursor-pointer'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          iconBg || styles.iconBg
        )}
      >
        <Icon className={cn('h-5 w-5', iconColor || styles.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold leading-tight text-gray-900">
          {value}
        </p>
        {trend && (
          <div
            className={cn(
              'mt-2 inline-flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-gray-400 font-normal">from last week</span>
          </div>
        )}
      </div>
    </Component>
  )
}
