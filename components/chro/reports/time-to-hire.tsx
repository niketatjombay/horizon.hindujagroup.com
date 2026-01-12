'use client'

import { useMemo } from 'react'
import {
  Clock,
  Zap,
  TrendingDown,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'
import { ChartContainer } from '@/components/charts/chart-container'
import { BarChart } from '@/components/charts/bar-chart'
import { LineChart } from '@/components/charts/line-chart'
import { ChartMetricCard } from '@/components/charts/chart-metric-card'
import { DashboardGrid, DashboardGridItem } from '@/components/charts/dashboard-grid'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { TimeToHireData, TimeToHireTableRow } from '@/types/chro-reports'

interface TimeToHireProps {
  data: TimeToHireData | undefined
  isLoading: boolean
  onDrillDown?: (context: { type: string; id: string; name: string }) => void
}

const experienceLevelLabels: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
}

export function TimeToHire({
  data,
  isLoading,
  onDrillDown,
}: TimeToHireProps) {
  // Prepare chart data
  const distributionChartData = useMemo(() => {
    if (!data?.distribution) return []
    return data.distribution.map((d) => ({
      name: d.range,
      Count: d.count,
    }))
  }, [data?.distribution])

  const trendChartData = useMemo(() => {
    if (!data?.trends) return []
    return data.trends.map((t) => ({
      name: t.date,
      'Avg Days': t.avgTimeToHire,
    }))
  }, [data?.trends])

  const byCompanyChartData = useMemo(() => {
    if (!data?.byCompany) return []
    return data.byCompany.slice(0, 10).map((c) => ({
      name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
      'Avg Days': c.avgDays,
    }))
  }, [data?.byCompany])

  // Table columns
  const columns: ColumnDef<TimeToHireTableRow>[] = useMemo(
    () => [
      {
        id: 'applicantName',
        header: 'Applicant',
        accessorKey: 'applicantName',
        sortable: true,
      },
      {
        id: 'jobTitle',
        header: 'Job Title',
        accessorKey: 'jobTitle',
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: 'companyName',
        header: 'Company',
        accessorKey: 'companyName',
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: 'department',
        header: 'Department',
        accessorKey: 'department',
        sortable: true,
        hideOnMobile: true,
      },
      {
        id: 'experienceLevel',
        header: 'Level',
        accessorFn: (row) => (
          <Badge variant="default" size="sm">
            {experienceLevelLabels[row.experienceLevel] || row.experienceLevel}
          </Badge>
        ),
        sortable: true,
        width: '120px',
      },
      {
        id: 'daysToHire',
        header: 'Days to Hire',
        accessorFn: (row) => (
          <span
            className={
              row.daysToHire > 45
                ? 'text-destructive font-medium'
                : row.daysToHire < 14
                ? 'text-success font-medium'
                : ''
            }
          >
            {row.daysToHire} days
          </span>
        ),
        sortable: true,
        width: '120px',
      },
      {
        id: 'hiredDate',
        header: 'Hired Date',
        accessorFn: (row) => {
          try {
            return format(new Date(row.hiredDate), 'MMM d, yyyy')
          } catch {
            return row.hiredDate
          }
        },
        sortable: true,
        width: '120px',
        hideOnMobile: true,
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
          title="Overall Average"
          value={`${data.summary.overallAvg} days`}
          icon={<Clock className="h-5 w-5 text-primary" />}
          color="#0066FF"
        />
        <ChartMetricCard
          title="Fastest Hire"
          value={`${data.summary.fastest} days`}
          icon={<Zap className="h-5 w-5 text-success" />}
          color="#00B87C"
        />
        <ChartMetricCard
          title="Slowest Hire"
          value={`${data.summary.slowest} days`}
          icon={<TrendingDown className="h-5 w-5 text-destructive" />}
          color="#E63946"
        />
        <ChartMetricCard
          title="Median"
          value={`${data.summary.median} days`}
          icon={<Activity className="h-5 w-5 text-info" />}
          color="#00B8D4"
        />
      </div>

      {/* Charts */}
      <DashboardGrid>
        {/* Distribution Chart */}
        <DashboardGridItem span={1}>
          <ChartContainer
            title="Time Distribution"
            subtitle="Hires by time range"
          >
            <BarChart
              data={distributionChartData}
              dataKeys={['Count']}
              colors={['#00B87C']}
              height={300}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* Trend Chart */}
        <DashboardGridItem span={1}>
          <ChartContainer
            title="Time-to-Hire Trend"
            subtitle="Average days over time"
          >
            <LineChart
              data={trendChartData}
              dataKeys={['Avg Days']}
              colors={['#0066FF']}
              height={300}
              showArea
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* By Company Chart */}
        <DashboardGridItem span="full">
          <ChartContainer
            title="Time-to-Hire by Company"
            subtitle="Fastest to slowest companies"
          >
            <BarChart
              data={byCompanyChartData}
              dataKeys={['Avg Days']}
              colors={['#7B61FF']}
              height={300}
            />
          </ChartContainer>
        </DashboardGridItem>
      </DashboardGrid>

      {/* Experience Level Summary */}
      {data.byExperienceLevel && data.byExperienceLevel.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            By Experience Level
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.byExperienceLevel.map((exp) => (
              <div
                key={exp.level}
                className="p-3 bg-gray-50 rounded-lg text-center"
              >
                <p className="text-xs text-gray-500 mb-1">
                  {experienceLevelLabels[exp.level] || exp.level}
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {exp.avgDays} days
                </p>
                <p className="text-xs text-gray-500">
                  {exp.totalHires} hires
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Hires
          </h3>
          <p className="text-sm text-gray-500">
            {data.tableData.length} hires with time-to-hire data
          </p>
        </div>
        <DataTable
          columns={columns}
          data={data.tableData}
          onRowClick={(row) =>
            onDrillDown?.({
              type: 'job',
              id: row.id,
              name: row.applicantName,
            })
          }
        />
      </div>
    </div>
  )
}
