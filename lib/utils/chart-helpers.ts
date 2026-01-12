/**
 * Chart helper utilities for formatting and colors
 */

// Chart color palette from design system
export const CHART_COLORS = [
  '#0066FF', // Primary blue
  '#7B61FF', // Secondary purple
  '#00B87C', // Success green
  '#FFA733', // Warning orange
  '#E63946', // Error red
  '#00B8D4', // Info cyan
] as const

// Neutral colors for chart elements
export const CHART_NEUTRAL = {
  gridLine: '#E8EAED',
  axisLabel: '#6F767E',
  background: '#FFFFFF',
  chartArea: '#FAFBFC',
  hoverOverlay: 'rgba(0, 102, 255, 0.05)',
} as const

/**
 * Get chart color by index (cycles through palette)
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}

/**
 * Format large numbers for chart display
 * 1234 → "1.2K", 1000000 → "1M", 1000000000 → "1B"
 */
export function formatChartNumber(value: number): string {
  if (value === 0) return '0'

  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }

  return `${sign}${absValue}`
}

/**
 * Format number with commas
 * 1234567 → "1,234,567"
 */
export function formatNumberWithCommas(value: number): string {
  return value.toLocaleString('en-US')
}

/**
 * Format currency value
 * 1234.56 → "$1,234.56"
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format percentage value
 * 0.4523 → "45.2%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  const percentage = value * 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Format date for chart labels
 * "2024-01-15" → "Jan 15"
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Create gradient ID for charts
 */
export function createGradientId(color: string, index: number = 0): string {
  return `gradient-${color.replace('#', '')}-${index}`
}

/**
 * Get gradient definition for area charts
 */
export function getGradientDefinition(color: string) {
  return {
    top: `${color}1A`, // 10% opacity
    bottom: `${color}0D`, // 5% opacity
  }
}

export type ChartDataPoint = {
  name: string
  [key: string]: string | number
}

export type TrendDirection = 'up' | 'down' | 'neutral'

/**
 * Determine trend direction from value
 */
export function getTrendDirection(value: number): TrendDirection {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'neutral'
}
