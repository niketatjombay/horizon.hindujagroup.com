'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  getChartColor,
  getTrendDirection,
  formatNumberWithCommas,
  getGradientDefinition,
} from '@/lib/utils/chart-helpers'

interface ChartMetricCardProps {
  title: string
  value: number | string
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  chartData?: Array<{ value: number }>
  color?: string
  icon?: React.ReactNode
  onClick?: () => void
  loading?: boolean
}

export function ChartMetricCard({
  title,
  value,
  trend,
  chartData,
  color = getChartColor(0),
  icon,
  onClick,
  loading = false,
}: ChartMetricCardProps) {
  const trendDirection = trend
    ? trend.isPositive !== undefined
      ? trend.isPositive
        ? 'up'
        : 'down'
      : getTrendDirection(trend.value)
    : null

  const TrendIcon =
    trendDirection === 'up'
      ? TrendingUp
      : trendDirection === 'down'
        ? TrendingDown
        : Minus

  const trendColorClass =
    trendDirection === 'up'
      ? 'text-success'
      : trendDirection === 'down'
        ? 'text-error'
        : 'text-gray-600'

  const formattedValue =
    typeof value === 'number' ? formatNumberWithCommas(value) : value

  const gradient = getGradientDefinition(color)

  if (loading) {
    return (
      <Card className="min-h-[140px] p-5 shadow-card">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded bg-gray-200 animate-shimmer" />
          <div className="h-8 w-24 rounded bg-gray-200 animate-shimmer" />
          <div className="h-3 w-16 rounded bg-gray-200 animate-shimmer" />
          <div className="mt-4 h-[60px] rounded bg-gray-200 animate-shimmer" />
        </div>
      </Card>
    )
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Card
      className={cn(
        'min-h-[140px] overflow-hidden shadow-card card-hover',
        onClick && 'cursor-pointer'
      )}
    >
      <Component
        onClick={onClick}
        className="flex h-full w-full flex-col p-5 text-left"
      >
        {/* Top Section */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="mt-1 text-[32px] font-bold leading-tight text-gray-900">
              {formattedValue}
            </p>
          </div>

          {trend && (
            <div className="flex flex-col items-end">
              <span className={cn('flex items-center gap-1 text-sm font-semibold', trendColorClass)}>
                <TrendIcon className="h-4 w-4" />
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">
                {trend.label || 'vs last month'}
              </span>
            </div>
          )}

          {icon && !trend && (
            <div className="text-gray-400">{icon}</div>
          )}
        </div>

        {/* Mini Chart */}
        {chartData && chartData.length > 0 && (
          <div className="mt-auto h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`mini-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradient.top} stopOpacity={1} />
                    <stop offset="95%" stopColor={gradient.bottom} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#mini-gradient-${color.replace('#', '')})`}
                  dot={false}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Component>
    </Card>
  )
}
