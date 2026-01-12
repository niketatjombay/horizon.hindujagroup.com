'use client'

import { formatNumberWithCommas } from '@/lib/utils/chart-helpers'

interface TooltipPayloadItem {
  value?: number | string
  name?: string
  dataKey?: string
  color?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
  formatter?: (value: number, name: string) => [string, string]
  labelFormatter?: (label: string) => string
}

export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const formattedLabel = labelFormatter ? labelFormatter(String(label)) : label

  return (
    <div className="max-w-[200px] rounded-md border border-gray-200 bg-white p-3 shadow-lg">
      {/* Header */}
      <div className="mb-2 border-b border-gray-100 pb-1.5">
        <p className="text-sm font-semibold text-gray-900">
          {formattedLabel}
        </p>
      </div>

      {/* Data Items */}
      <div className="space-y-1">
        {payload.map((entry: TooltipPayloadItem, index: number) => {
          const value = typeof entry.value === 'number' ? entry.value : 0
          const name = String(entry.name || entry.dataKey || '')

          let displayValue: string
          let displayName: string

          if (formatter) {
            const [fValue, fName] = formatter(value, name)
            displayValue = fValue
            displayName = fName
          } else {
            displayValue = formatNumberWithCommas(value)
            displayName = formatDataKeyName(name)
          }

          return (
            <div
              key={`tooltip-item-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600">
                  {displayName}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {displayValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Convert camelCase or snake_case to Title Case
 */
function formatDataKeyName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase
    .replace(/_/g, ' ') // snake_case
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first
    .trim()
}
