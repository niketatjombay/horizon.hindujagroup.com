'use client'

import { useMemo } from 'react'
import {
  Building2,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { ChartContainer } from '@/components/charts/chart-container'
import { BarChart } from '@/components/charts/bar-chart'
import { LineChart } from '@/components/charts/line-chart'
import { ChartMetricCard } from '@/components/charts/chart-metric-card'
import { DashboardGrid, DashboardGridItem } from '@/components/charts/dashboard-grid'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { CompanyComparisonData, CompanyMetrics } from '@/types/chro-reports'
import { formatChartNumber } from '@/lib/utils/chart-helpers'

interface CompanyComparisonProps {
  data: CompanyComparisonData | undefined
  isLoading: boolean
  onDrillDown?: (context: { type: string; id: string; name: string }) => void
}

export function CompanyComparison({
  data,
  isLoading,
  onDrillDown,
}: CompanyComparisonProps) {
  // Prepare chart data
  const performanceChartData = useMemo(() => {
    if (!data?.chartData) return []
    return data.chartData.map((c) => ({
      name: c.companyName.length > 15
        ? c.companyName.substring(0, 15) + '...'
        : c.companyName,
      Applications: c.applications,
      Hired: c.hired,
      'Open Positions': c.openPositions,
    }))
  }, [data?.chartData])

  const trendChartData = useMemo(() => {
    if (!data?.trendData) return []
    return data.trendData.map((t) => ({
      ...t,
      name: t.date,
    }))
  }, [data?.trendData])

  // Get unique company names for the line chart
  const trendDataKeys = useMemo(() => {
    if (!data?.trendData || data.trendData.length === 0) return []
    const firstEntry = data.trendData[0]
    return Object.keys(firstEntry).filter((key) => key !== 'date')
  }, [data?.trendData])

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    if (!data?.companies) {
      return { count: 0, totalApps: 0, bestHireRate: 0, fastestTime: 0 }
    }
    const companies = data.companies
    const totalApps = companies.reduce((sum, c) => sum + c.totalApplications, 0)
    const bestHireRate = Math.max(...companies.map((c) => c.hireRate))
    const fastestTime = Math.min(
      ...companies.filter((c) => c.avgTimeToHire > 0).map((c) => c.avgTimeToHire)
    )
    return {
      count: companies.length,
      totalApps,
      bestHireRate,
      fastestTime: fastestTime === Infinity ? 0 : fastestTime,
    }
  }, [data?.companies])

  // Table columns
  const columns: ColumnDef<CompanyMetrics & { id: string }>[] = useMemo(
    () => [
      {
        id: 'companyName',
        header: 'Company',
        accessorKey: 'companyName',
        sortable: true,
      },
      {
        id: 'industry',
        header: 'Industry',
        accessorKey: 'industry',
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: 'totalApplications',
        header: 'Apps',
        accessorKey: 'totalApplications',
        sortable: true,
        width: '80px',
      },
      {
        id: 'totalHired',
        header: 'Hired',
        accessorKey: 'totalHired',
        sortable: true,
        width: '80px',
      },
      {
        id: 'hireRate',
        header: 'Hire Rate',
        accessorFn: (row) => (
          <span className={row.hireRate > 15 ? 'text-success font-medium' : ''}>
            {row.hireRate}%
          </span>
        ),
        sortable: true,
        width: '100px',
      },
      {
        id: 'avgTimeToHire',
        header: 'Avg Days',
        accessorFn: (row) => row.avgTimeToHire || '-',
        sortable: true,
        width: '100px',
        hideOnMobile: true,
      },
      {
        id: 'openPositions',
        header: 'Open',
        accessorKey: 'openPositions',
        sortable: true,
        width: '80px',
        hideOnMobile: true,
      },
      {
        id: 'trend',
        header: 'Trend',
        accessorFn: (row) => (
          <Badge
            variant={row.trend > 0 ? 'success' : row.trend < 0 ? 'error' : 'default'}
            size="sm"
          >
            {row.trend > 0 ? '+' : ''}{row.trend}%
          </Badge>
        ),
        width: '80px',
      },
    ],
    []
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="metrics" count={4} />
        <LoadingSkeleton type="chart" />
        <LoadingSkeleton type="table" count={5} />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available for the selected filters.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChartMetricCard
          title="Companies Compared"
          value={summaryMetrics.count}
          icon={<Building2 className="h-5 w-5 text-primary" />}
          color="#0066FF"
        />
        <ChartMetricCard
          title="Total Applications"
          value={formatChartNumber(summaryMetrics.totalApps)}
          icon={<Users className="h-5 w-5 text-info" />}
          color="#00B8D4"
        />
        <ChartMetricCard
          title="Best Hire Rate"
          value={`${summaryMetrics.bestHireRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-success" />}
          color="#00B87C"
        />
        <ChartMetricCard
          title="Fastest Hire"
          value={`${summaryMetrics.fastestTime} days`}
          icon={<Clock className="h-5 w-5 text-warning" />}
          color="#FFA733"
        />
      </div>

      {/* Charts */}
      <DashboardGrid>
        {/* Performance Chart */}
        <DashboardGridItem span="full">
          <ChartContainer
            title="Company Performance"
            subtitle="Applications, hires, and open positions by company"
          >
            <BarChart
              data={performanceChartData}
              dataKeys={['Applications', 'Hired', 'Open Positions']}
              colors={['#0066FF', '#00B87C', '#FFA733']}
              height={350}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* Trend Comparison */}
        {trendDataKeys.length > 0 && (
          <DashboardGridItem span="full">
            <ChartContainer
              title="Application Trends by Company"
              subtitle="Monthly application volume comparison"
            >
              <LineChart
                data={trendChartData}
                dataKeys={trendDataKeys}
                height={300}
                showDots={false}
              />
            </ChartContainer>
          </DashboardGridItem>
        )}
      </DashboardGrid>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Company Details
          </h3>
          <p className="text-sm text-gray-500">
            Detailed metrics for {data.tableData.length} companies
          </p>
        </div>
        <DataTable
          columns={columns}
          data={data.tableData.map((row) => ({ ...row, id: row.companyId }))}
          onRowClick={(row) =>
            onDrillDown?.({
              type: 'company',
              id: row.companyId,
              name: row.companyName,
            })
          }
        />
      </div>
    </div>
  )
}
