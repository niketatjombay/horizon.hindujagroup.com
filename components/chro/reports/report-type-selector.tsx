'use client'

import {
  TrendingUp,
  GitCompare,
  Users,
  Clock,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportType } from '@/types/chro-reports'
import { REPORT_TYPES } from '@/types/chro-reports'

interface ReportTypeSelectorProps {
  selectedType: ReportType
  onChange: (type: ReportType) => void
  className?: string
}

const iconMap = {
  TrendingUp,
  GitCompare,
  Users,
  Clock,
  Filter,
}

export function ReportTypeSelector({
  selectedType,
  onChange,
  className,
}: ReportTypeSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {REPORT_TYPES.map((report) => {
        const Icon = iconMap[report.icon as keyof typeof iconMap]
        const isSelected = selectedType === report.value

        return (
          <button
            key={report.value}
            onClick={() => onChange(report.value)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all',
              'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
              isSelected
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 flex-shrink-0',
                isSelected ? 'text-primary' : 'text-gray-400'
              )}
            />
            <div className="text-left">
              <p
                className={cn(
                  'font-medium text-sm',
                  isSelected ? 'text-primary' : 'text-gray-900'
                )}
              >
                {report.label}
              </p>
              <p className="text-xs text-gray-500 hidden sm:block">
                {report.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
