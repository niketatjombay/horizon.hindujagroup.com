'use client'

import { Card } from '@/components/ui/card'
import { BarChart } from '@/components/charts'
import { BarChart2 } from 'lucide-react'

interface CompanyPerformanceChartProps {
  data: Array<{
    companyName: string
    applicationCount: number
  }>
  totalCompanies?: number
  height?: number
  isLoading?: boolean
}

export function CompanyPerformanceChart({
  data,
  totalCompanies = 17,
  height = 350,
  isLoading = false,
}: CompanyPerformanceChartProps) {
  // Take top 10 companies sorted by application count
  const topCompanies = data
    .slice(0, 10)
    .map((company) => ({
      name: company.companyName.length > 15
        ? company.companyName.substring(0, 15) + '...'
        : company.companyName,
      Applications: company.applicationCount,
    }))

  const isEmpty = topCompanies.length === 0 || topCompanies.every((c) => c.Applications === 0)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
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
          Company Performance
        </h3>
        <p className="text-sm text-gray-500">
          Showing top {Math.min(10, data.length)} of {totalCompanies} companies by applications
        </p>
      </div>

      {isEmpty ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ height }}
        >
          <BarChart2 className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No application data available</p>
        </div>
      ) : (
        <BarChart
          data={topCompanies}
          dataKeys={['Applications']}
          colors={['#0066FF']}
          height={height}
          showLegend={false}
          showGrid={true}
          barSize={24}
        />
      )}
    </Card>
  )
}
