'use client'

import { Card } from '@/components/ui/card'
import { BarChart } from '@/components/charts'
import { BarChart2 } from 'lucide-react'

interface PipelineChartProps {
  data: {
    applied: number
    reviewing: number
    interview: number
    offered: number
    rejected: number
  }
  height?: number
  isLoading?: boolean
}

export function PipelineChart({
  data,
  height = 300,
  isLoading = false,
}: PipelineChartProps) {
  // Transform data for horizontal bar chart
  const chartData = [
    { name: 'Applied', count: data.applied },
    { name: 'Reviewing', count: data.reviewing },
    { name: 'Interview', count: data.interview },
    { name: 'Offered', count: data.offered },
    { name: 'Rejected', count: data.rejected },
  ]

  const isEmpty = chartData.every((item) => item.count === 0)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <div
          className="bg-gray-100 rounded animate-pulse"
          style={{ height }}
        />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Applications Pipeline
        </h3>
        <p className="text-sm text-gray-500">
          Current status distribution
        </p>
      </div>

      {isEmpty ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ height }}
        >
          <BarChart2 className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No applications in pipeline</p>
        </div>
      ) : (
        <BarChart
          data={chartData}
          dataKeys={['count']}
          colors={['#3B82F6']}
          height={height}
          showLegend={false}
          showGrid={true}
          barSize={32}
        />
      )}
    </Card>
  )
}
