'use client'

import { Card } from '@/components/ui/card'
import { BarChart } from '@/components/charts'
import { BarChart2 } from 'lucide-react'

interface DepartmentBreakdownProps {
  data: Array<{
    department: string
    count: number
    percentage: number
  }>
  height?: number
  isLoading?: boolean
}

export function DepartmentBreakdown({
  data,
  height = 350,
  isLoading = false,
}: DepartmentBreakdownProps) {
  // Transform data for horizontal bar chart
  const chartData = data.map((dept) => ({
    name: dept.department.length > 12
      ? dept.department.substring(0, 12) + '...'
      : dept.department,
    'Open Positions': dept.count,
  }))

  const isEmpty = chartData.length === 0 || chartData.every((d) => d['Open Positions'] === 0)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-44 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
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
          Department Breakdown
        </h3>
        <p className="text-sm text-gray-500">
          Open positions by department
        </p>
      </div>

      {isEmpty ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ height }}
        >
          <BarChart2 className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No department data available</p>
        </div>
      ) : (
        <BarChart
          data={chartData}
          dataKeys={['Open Positions']}
          colors={['#7B61FF']}
          height={height}
          showLegend={false}
          showGrid={true}
          barSize={20}
        />
      )}
    </Card>
  )
}
