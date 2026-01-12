'use client'

import { useMemo } from 'react'
import {
  Filter,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import { ChartContainer } from '@/components/charts/chart-container'
import { BarChart } from '@/components/charts/bar-chart'
import { ChartMetricCard } from '@/components/charts/chart-metric-card'
import { DashboardGrid, DashboardGridItem } from '@/components/charts/dashboard-grid'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import type { PipelineAnalysisData, PipelineTableRow } from '@/types/chro-reports'

interface PipelineAnalysisProps {
  data: PipelineAnalysisData | undefined
  isLoading: boolean
  onDrillDown?: (context: { type: string; id: string; name: string }) => void
}

const stageColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  applied: 'default',
  reviewing: 'info',
  shortlisted: 'warning',
  interview: 'warning',
  offered: 'success',
  accepted: 'success',
  rejected: 'error',
}

const stageLabels: Record<string, string> = {
  applied: 'Applied',
  reviewing: 'Under Review',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offered: 'Offer Extended',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

export function PipelineAnalysis({
  data,
  isLoading,
  onDrillDown,
}: PipelineAnalysisProps) {
  // Prepare funnel chart data
  const funnelChartData = useMemo(() => {
    if (!data?.funnel) return []
    return [
      { name: 'Applied', Count: data.funnel.applied },
      { name: 'Reviewing', Count: data.funnel.reviewing },
      { name: 'Shortlisted', Count: data.funnel.shortlisted },
      { name: 'Interview', Count: data.funnel.interview },
      { name: 'Offered', Count: data.funnel.offered },
      { name: 'Accepted', Count: data.funnel.accepted },
    ]
  }, [data?.funnel])

  // Prepare conversion rates chart data
  const conversionChartData = useMemo(() => {
    if (!data?.conversionChart) return []
    return data.conversionChart.map((c) => ({
      name: c.transition,
      'Conversion %': c.rate,
    }))
  }, [data?.conversionChart])

  // Prepare time in stage chart data
  const timeInStageChartData = useMemo(() => {
    if (!data?.timeInStageChart) return []
    return data.timeInStageChart.map((t) => ({
      name: t.stage,
      'Avg Days': t.avgDays,
    }))
  }, [data?.timeInStageChart])

  // Prepare by company chart data
  const byCompanyChartData = useMemo(() => {
    if (!data?.byCompany) return []
    return data.byCompany.slice(0, 8).map((c) => ({
      name: c.companyName.length > 15 ? c.companyName.substring(0, 15) + '...' : c.companyName,
      'In Pipeline': c.inPipeline,
      'Conv. Rate': c.conversionRate,
    }))
  }, [data?.byCompany])

  // Table columns
  const columns: ColumnDef<PipelineTableRow>[] = useMemo(
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
        id: 'currentStage',
        header: 'Current Stage',
        accessorFn: (row) => (
          <Badge variant={stageColors[row.currentStage] || 'default'} size="sm">
            {stageLabels[row.currentStage] || row.currentStage}
          </Badge>
        ),
        sortable: true,
        width: '140px',
      },
      {
        id: 'daysInStage',
        header: 'Days in Stage',
        accessorFn: (row) => (
          <span
            className={
              row.daysInStage > 14
                ? 'text-destructive font-medium'
                : row.daysInStage > 7
                ? 'text-warning font-medium'
                : ''
            }
          >
            {row.daysInStage} days
          </span>
        ),
        sortable: true,
        width: '120px',
      },
      {
        id: 'totalDaysInPipeline',
        header: 'Total Days',
        accessorFn: (row) => `${row.totalDaysInPipeline} days`,
        sortable: true,
        width: '100px',
        hideOnMobile: true,
      },
      {
        id: 'appliedDate',
        header: 'Applied',
        accessorFn: (row) => {
          try {
            return format(new Date(row.appliedDate), 'MMM d, yyyy')
          } catch {
            return row.appliedDate
          }
        },
        sortable: true,
        width: '110px',
        hideOnMobile: true,
      },
      {
        id: 'lastActivity',
        header: 'Last Activity',
        accessorFn: (row) => {
          try {
            return format(new Date(row.lastActivity), 'MMM d, yyyy')
          } catch {
            return row.lastActivity
          }
        },
        sortable: true,
        width: '110px',
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
          title="Total in Pipeline"
          value={data.summary.totalInPipeline}
          icon={<Filter className="h-5 w-5 text-primary" />}
          color="#0066FF"
        />
        <ChartMetricCard
          title="Conversion Rate"
          value={`${data.summary.overallConversionRate}%`}
          icon={<TrendingUp className="h-5 w-5 text-success" />}
          color="#00B87C"
        />
        <ChartMetricCard
          title="Bottleneck Stage"
          value={stageLabels[data.summary.bottleneckStage] || data.summary.bottleneckStage}
          icon={<AlertCircle className="h-5 w-5 text-warning" />}
          color="#FFA733"
        />
        <ChartMetricCard
          title="Avg Time in Pipeline"
          value={`${data.summary.avgDaysInPipeline} days`}
          icon={<Clock className="h-5 w-5 text-info" />}
          color="#00B8D4"
        />
      </div>

      {/* Charts */}
      <DashboardGrid>
        {/* Funnel Chart */}
        <DashboardGridItem span={2}>
          <ChartContainer
            title="Pipeline Funnel"
            subtitle="Applicants at each stage"
          >
            <BarChart
              data={funnelChartData}
              dataKeys={['Count']}
              colors={['#0066FF']}
              height={300}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* Conversion Rates Chart */}
        <DashboardGridItem span={1}>
          <ChartContainer
            title="Conversion Rates"
            subtitle="Stage-to-stage conversion"
          >
            <BarChart
              data={conversionChartData}
              dataKeys={['Conversion %']}
              colors={['#00B87C']}
              height={300}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* Time in Stage Chart */}
        <DashboardGridItem span={1}>
          <ChartContainer
            title="Average Time per Stage"
            subtitle="Days spent in each stage"
          >
            <BarChart
              data={timeInStageChartData}
              dataKeys={['Avg Days']}
              colors={['#7B61FF']}
              height={300}
            />
          </ChartContainer>
        </DashboardGridItem>

        {/* By Company Chart */}
        <DashboardGridItem span={2}>
          <ChartContainer
            title="Pipeline by Company"
            subtitle="Active applicants and conversion rates"
          >
            <BarChart
              data={byCompanyChartData}
              dataKeys={['In Pipeline', 'Conv. Rate']}
              colors={['#0066FF', '#00B87C']}
              height={300}
            />
          </ChartContainer>
        </DashboardGridItem>
      </DashboardGrid>

      {/* Stage Breakdown */}
      {data.stages && data.stages.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Stage Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.stages.map((stage) => (
              <div
                key={stage.stage}
                className="p-3 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() =>
                  onDrillDown?.({
                    type: 'stage',
                    id: stage.stage,
                    name: stageLabels[stage.stage] || stage.stage,
                  })
                }
              >
                <p className="text-xs text-gray-500 mb-1">
                  {stageLabels[stage.stage] || stage.stage}
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stage.count}
                </p>
                <p className="text-xs text-gray-500">
                  {stage.percentage}% of total
                </p>
                <p className="text-xs text-info mt-1">
                  Avg: {stage.avgDaysInStage} days
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
            Active Pipeline
          </h3>
          <p className="text-sm text-gray-500">
            {data.tableData.length} applicants in pipeline
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
