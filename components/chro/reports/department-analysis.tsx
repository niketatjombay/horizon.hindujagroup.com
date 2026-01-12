'use client'

import { useMemo } from 'react'
import {
  Layers,
  TrendingUp,
  Target,
  BarChart2,
} from 'lucide-react'
import { ChartContainer } from '@/components/charts/chart-container'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartMetricCard } from '@/components/charts/chart-metric-card'
import { DashboardGrid, DashboardGridItem } from '@/components/charts/dashboard-grid'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { DepartmentAnalysisData, DepartmentMetrics } from '@/types/chro-reports'
import { formatChartNumber } from '@/lib/utils/chart-helpers'

interface DepartmentAnalysisProps {
  data: DepartmentAnalysisData | undefined
  isLoading: boolean
  onDrillDown?: (context: { type: string; id: string; name: string }) => void
}

export function DepartmentAnalysis({
  data,
  isLoading,
  onDrillDown,
}: DepartmentAnalysisProps) {
  // Prepare chart data
  const distributionChartData = useMemo(() => {
    if (!data?.distributionChart) return []
    return data.distributionChart.map((d) => ({
      name: d.department.length > 20 ? d.department.substring(0, 20) + '...' : d.department,
      Applications: d.applications,
    }))
  }, [data?.distributionChart])

  const comparisonChartData = useMemo(() => {
    if (!data?.comparisonChart) return []
    return data.comparisonChart.map((d) => ({
      name: d.department.length > 15 ? d.department.substring(0, 15) + '...' : d.department,
      Applications: d.Applications,
      Hired: d.Hired,
      Rejected: d.Rejected,
    }))
  }, [data?.comparisonChart])

  // Table columns
  const columns: ColumnDef<DepartmentMetrics & { id: string }>[] = useMemo(
    () => [
      {
        id: 'department',
        header: 'Department',
        accessorKey: 'department',
        sortable: true,
      },
      {
        id: 'totalApplications',
        header: 'Apps',
        accessorKey: 'totalApplications',
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
        id: 'rejected',
        header: 'Rejected',
        accessorKey: 'rejected',
        sortable: true,
        width: '80px',
        hideOnMobile: true,
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
          title="Total Departments"
          value={data.summary.totalDepartments}
          icon={<Layers className="h-5 w-5 text-primary" />}
          color="#0066FF"
        />
        <ChartMetricCard
          title="Most Active"
          value={data.summary.mostActiveDepartment}
          icon={<TrendingUp className="h-5 w-5 text-success" />}
          trend={{
            value: data.summary.mostActiveCount,
            label: 'applications',
          }}
          color="#00B87C"
        />
        <ChartMetricCard
          title="Highest Hire Rate"
          value={`${data.summary.highestHireRate}%`}
          icon={<Target className="h-5 w-5 text-info" />}
          trend={{
            value: 0,
            label: data.summary.highestHireRateDept,
          }}
          color="#00B8D4"
        />
        <ChartMetricCard
          title="Avg Apps/Dept"
          value={formatChartNumber(data.summary.avgApplicationsPerDept)}
          icon={<BarChart2 className="h-5 w-5 text-warning" />}
          color="#FFA733"
        />
      </div>

      {/* Charts */}
      <DashboardGrid>
        {/* Distribution Chart */}
        <DashboardGridItem span={1}>
          <ChartContainer
            title="Applications by Department"
            subtitle="Distribution of applications"
          >
            <BarChart
              data={distributionChartData}
              dataKeys={['Applications']}
              colors={['#0066FF']}
              height={350}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* Comparison Chart */}
        <DashboardGridItem span={2}>
          <ChartContainer
            title="Department Performance"
            subtitle="Applications, hires, and rejections by department"
          >
            <BarChart
              data={comparisonChartData}
              dataKeys={['Applications', 'Hired', 'Rejected']}
              colors={['#0066FF', '#00B87C', '#E63946']}
              height={350}
            />
          </ChartContainer>
        </DashboardGridItem>
      </DashboardGrid>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Details
          </h3>
          <p className="text-sm text-gray-500">
            Metrics for {data.tableData.length} departments
          </p>
        </div>
        <DataTable
          columns={columns}
          data={data.tableData.map((row) => ({ ...row, id: row.department }))}
          onRowClick={(row) =>
            onDrillDown?.({
              type: 'department',
              id: row.department,
              name: row.department,
            })
          }
        />
      </div>
    </div>
  )
}
