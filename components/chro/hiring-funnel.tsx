'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDown } from 'lucide-react'

interface HiringFunnelProps {
  data: {
    applied: number
    reviewing: number
    interview: number
    offered: number
    conversionRates: {
      appliedToReviewing: number
      reviewingToInterview: number
      interviewToOffered: number
    }
  }
  isLoading?: boolean
}

interface FunnelStageProps {
  label: string
  count: number
  percentage: number
  color: string
  widthPercent: number
}

function FunnelStage({ label, count, percentage, color, widthPercent }: FunnelStageProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          'h-14 rounded-lg flex items-center justify-between px-4 transition-all duration-300',
          color
        )}
        style={{ width: `${widthPercent}%` }}
      >
        <span className="font-medium text-white truncate">{label}</span>
        <div className="flex items-center gap-2 text-white">
          <span className="font-bold">{count.toLocaleString()}</span>
          <span className="text-sm opacity-80">({percentage}%)</span>
        </div>
      </div>
    </div>
  )
}

interface ConversionArrowProps {
  rate: number
}

function ConversionArrow({ rate }: ConversionArrowProps) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-2 text-gray-500">
        <ArrowDown className="h-4 w-4" />
        <span className="text-sm font-medium">{rate}% conversion</span>
      </div>
    </div>
  )
}

export function HiringFunnel({ data, isLoading = false }: HiringFunnelProps) {
  const totalApplied = data.applied
  const stages = [
    {
      label: 'Applied',
      count: data.applied,
      percentage: 100,
      color: 'bg-blue-500',
      widthPercent: 100,
    },
    {
      label: 'Reviewing',
      count: data.reviewing,
      percentage: totalApplied > 0 ? Math.round((data.reviewing / totalApplied) * 100) : 0,
      color: 'bg-blue-600',
      widthPercent: totalApplied > 0 ? Math.max(30, (data.reviewing / totalApplied) * 100) : 70,
    },
    {
      label: 'Interview',
      count: data.interview,
      percentage: totalApplied > 0 ? Math.round((data.interview / totalApplied) * 100) : 0,
      color: 'bg-emerald-500',
      widthPercent: totalApplied > 0 ? Math.max(25, (data.interview / totalApplied) * 100) : 50,
    },
    {
      label: 'Offered',
      count: data.offered,
      percentage: totalApplied > 0 ? Math.round((data.offered / totalApplied) * 100) : 0,
      color: 'bg-emerald-600',
      widthPercent: totalApplied > 0 ? Math.max(20, (data.offered / totalApplied) * 100) : 30,
    },
  ]

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[100, 70, 50, 30].map((width, i) => (
            <div key={i} className="flex flex-col items-start">
              <div
                className="h-14 bg-gray-200 rounded-lg animate-pulse"
                style={{ width: `${width}%` }}
              />
              {i < 3 && (
                <div className="h-6 w-24 mx-auto mt-2 bg-gray-100 rounded animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Hiring Funnel
        </h3>
        <p className="text-sm text-gray-500">
          Conversion rates through stages
        </p>
      </div>

      <div className="space-y-1">
        {stages.map((stage, index) => (
          <div key={stage.label}>
            <FunnelStage {...stage} />
            {index < stages.length - 1 && (
              <ConversionArrow
                rate={
                  index === 0
                    ? data.conversionRates.appliedToReviewing
                    : index === 1
                    ? data.conversionRates.reviewingToInterview
                    : data.conversionRates.interviewToOffered
                }
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
