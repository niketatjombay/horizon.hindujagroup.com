'use client'

import { Card } from '@/components/ui/card'
import { LineChart } from '@/components/charts'
import { format, parseISO } from 'date-fns'
import { BarChart2 } from 'lucide-react'

interface HiringTrendsChartProps {
  data: {
    dates: string[]
    applications: number[]
    hired: number[]
    rejected: number[]
  }
  height?: number
  isLoading?: boolean
}

export function HiringTrendsChart({
  data,
  height = 400,
  isLoading = false,
}: HiringTrendsChartProps) {
  // Transform data for the chart
  const chartData = data.dates.map((date, index) => ({
    name: format(parseISO(date), 'MMM yyyy'),
    Applications: data.applications[index],
    Hired: data.hired[index],
    Rejected: data.rejected[index],
  }))

  const isEmpty = chartData.length === 0

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
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
          Hiring Trends
        </h3>
        <p className="text-sm text-gray-500">
          Application volume and outcomes over time
        </p>
      </div>

      {isEmpty ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ height }}
        >
          <BarChart2 className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No trend data available for this period</p>
        </div>
      ) : (
        <LineChart
          data={chartData}
          dataKeys={['Applications', 'Hired', 'Rejected']}
          colors={['#0066FF', '#00B87C', '#E63946']}
          height={height}
          showArea={true}
          showDots={true}
          showLegend={true}
          showGrid={true}
          curved={true}
        />
      )}
    </Card>
  )
}
