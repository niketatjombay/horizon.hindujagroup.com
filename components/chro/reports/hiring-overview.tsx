'use client'

import { useMemo } from 'react'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Briefcase,
  Target,
} from 'lucide-react'
import { ChartContainer } from '@/components/charts/chart-container'
import { LineChart } from '@/components/charts/line-chart'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartMetricCard } from '@/components/charts/chart-metric-card'
import { DashboardGrid, DashboardGridItem } from '@/components/charts/dashboard-grid'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { DataTablePagination } from '@/components/shared/data-table-pagination'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { HiringOverviewData, HiringOverviewTableRow } from '@/types/chro-reports'
import { formatChartNumber } from '@/lib/utils/chart-helpers'

interface HiringOverviewProps {
  data: HiringOverviewData | undefined
  isLoading: boolean
  onDrillDown?: (context: { type: string; id: string; name: string }) => void
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  open: 'success',
  closed: 'default',
  filled: 'info',
}

export function HiringOverview({
  data,
  isLoading,
  onDrillDown,
}: HiringOverviewProps) {
  // Prepare chart data
  const trendsChartData = useMemo(() => {
    if (!data?.trends) return []
    return data.trends.dates.map((date, i) => ({
      name: date,
      Applications: data.trends.applications[i],
      Hired: data.trends.hired[i],
      Rejected: data.trends.rejected[i],
    }))
  }, [data?.trends])

  const statusChartData = useMemo(() => {
    if (!data?.statusDistribution) return []
    return data.statusDistribution.map((s) => ({
      name: s.status,
      Count: s.count,
    }))
  }, [data?.statusDistribution])

  // Table columns
  const columns: ColumnDef<HiringOverviewTableRow>[] = useMemo(
    () => [
      {
        id: 'jobTitle',
        header: 'Job Title',
        accessorKey: 'jobTitle',
        sortable: true,
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
        id: 'applications',
        header: 'Apps',
        accessorKey: 'applications',
        sortable: true,
        width: '80px',
      },
      {
        id: 'shortlisted',
        header: 'Shortlisted',
        accessorKey: 'shortlisted',
        sortable: true,
        width: '100px',
        hideOnMobile: true,
      },
      {
        id: 'interviewed',
        header: 'Interviewed',
        accessorKey: 'interviewed',
        sortable: true,
        width: '100px',
        hideOnMobile: true,
      },
      {
        id: 'hired',
        header: 'Hired',
        accessorKey: 'hired',
        sortable: true,
        width: '80px',
      },
      {
        id: 'avgTimeToHire',
        header: 'Avg Days',
        accessorFn: (row) => (
          <span className={row.avgTimeToHire > 30 ? 'text-warning' : ''}>
            {row.avgTimeToHire || '-'}
          </span>
        ),
        sortable: true,
        width: '100px',
        hideOnMobile: true,
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => (
          <Badge variant={statusColors[row.status]} size="sm">
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        ),
        width: '100px',
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
          title="Total Applications"
          value={formatChartNumber(data.summary.totalApplications)}
          icon={<Users className="h-5 w-5 text-primary" />}
          color="#0066FF"
        />
        <ChartMetricCard
          title="Total Hired"
          value={formatChartNumber(data.summary.totalHired)}
          icon={<UserCheck className="h-5 w-5 text-success" />}
          trend={{
            value: data.summary.hireRate,
            label: 'hire rate',
            isPositive: data.summary.hireRate > 10,
          }}
          color="#00B87C"
        />
        <ChartMetricCard
          title="Rejected"
          value={formatChartNumber(data.summary.totalRejected)}
          icon={<UserX className="h-5 w-5 text-destructive" />}
          color="#E63946"
        />
        <ChartMetricCard
          title="Avg Time to Hire"
          value={`${data.summary.avgTimeToHire} days`}
          icon={<Clock className="h-5 w-5 text-warning" />}
          color="#FFA733"
        />
      </div>

      {/* Charts */}
      <DashboardGrid>
        {/* Trends Chart */}
        <DashboardGridItem span={2}>
          <ChartContainer title="Hiring Trends" subtitle="Applications and outcomes over time">
            <LineChart
              data={trendsChartData}
              dataKeys={['Applications', 'Hired', 'Rejected']}
              colors={['#0066FF', '#00B87C', '#E63946']}
              height={350}
              showArea
              showDots={false}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* Status Distribution */}
        <DashboardGridItem span={1}>
          <ChartContainer
            title="Status Distribution"
            subtitle="Applications by current status"
          >
            <BarChart
              data={statusChartData}
              dataKeys={['Count']}
              colors={['#0066FF']}
              height={350}
            />
          </ChartContainer>
        </DashboardGridItem>
      </DashboardGrid>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Job Details
          </h3>
          <p className="text-sm text-gray-500">
            {data.tableData.length} jobs with application data
          </p>
        </div>
        <DataTable
          columns={columns}
          data={data.tableData}
          onRowClick={(row) =>
            onDrillDown?.({ type: 'job', id: row.id, name: row.jobTitle })
          }
        />
        {data.tableData.length > 20 && (
          <div className="p-4 border-t border-gray-100">
            <DataTablePagination
              currentPage={1}
              totalPages={Math.ceil(data.tableData.length / 20)}
              totalItems={data.tableData.length}
              pageSize={20}
              onPageChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
