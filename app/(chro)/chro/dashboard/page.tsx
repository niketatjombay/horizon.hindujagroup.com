'use client'

import { useState } from 'react'
import { Users, Briefcase, FileText, Clock } from 'lucide-react'
import {
  ChartMetricCard,
  DashboardGrid,
  DashboardGridItem,
} from '@/components/charts'
import {
  HiringTrendsChart,
  PipelineChart,
  CompanyPerformanceChart,
  HiringFunnel,
  DepartmentBreakdown,
  ActivityFeed,
  DashboardFilters,
} from '@/components/chro'
import { useAuth } from '@/lib/hooks/use-auth'
import { useCHRODashboard, type TimeRange } from '@/lib/hooks/use-chro'
import { getChartColor } from '@/lib/utils/chart-helpers'
import { getTotalCompaniesCount } from '@/mock'

export default function CHRODashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const { data, isLoading, error } = useCHRODashboard(timeRange)

  const totalCompanies = getTotalCompaniesCount()

  const handleExport = () => {
    alert('Export functionality coming soon!')
  }

  // Generate sparkline data from trends
  const generateSparklineData = (values: number[]): Array<{ value: number }> => {
    return values.map((value) => ({ value }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Welcome back, {user?.firstName || 'CHRO'}
          </h1>
          <p className="mt-1 text-gray-600">
            Strategic talent insights across the Hinduja Group
          </p>
        </div>

        <DashboardFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onExport={handleExport}
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ChartMetricCard
          title="Total Employees"
          value={data?.metrics.totalEmployees || 0}
          trend={{
            value: data?.metrics.totalEmployeesTrend || 0,
            label: 'vs last period',
          }}
          chartData={data ? generateSparklineData(data.trends.applications.slice(-6)) : []}
          color={getChartColor(0)}
          icon={<Users className="h-5 w-5" />}
          loading={isLoading}
        />

        <ChartMetricCard
          title="Open Positions"
          value={data?.metrics.openPositions || 0}
          trend={{
            value: data?.metrics.openPositionsTrend || 0,
            label: 'vs last period',
          }}
          color={getChartColor(3)}
          icon={<Briefcase className="h-5 w-5" />}
          loading={isLoading}
        />

        <ChartMetricCard
          title="Applications This Month"
          value={data?.metrics.applicationsThisMonth || 0}
          trend={{
            value: data?.metrics.applicationsTrend || 0,
            label: 'vs last period',
          }}
          chartData={data ? generateSparklineData(data.trends.applications.slice(-6)) : []}
          color={getChartColor(2)}
          icon={<FileText className="h-5 w-5" />}
          loading={isLoading}
        />

        <ChartMetricCard
          title="Avg Time to Hire"
          value={data ? `${data.metrics.avgTimeToHire} days` : '0 days'}
          trend={{
            value: data?.metrics.timeToHireTrend || 0,
            label: 'vs last period',
            isPositive: (data?.metrics.timeToHireTrend || 0) < 0, // Lower is better
          }}
          color={getChartColor(5)}
          icon={<Clock className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <DashboardGrid>
        {/* Hiring Trends - Spans 2 columns */}
        <DashboardGridItem span={2}>
          <HiringTrendsChart
            data={data?.trends || { dates: [], applications: [], hired: [], rejected: [] }}
            height={400}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Pipeline Chart */}
        <DashboardGridItem span={1}>
          <PipelineChart
            data={data?.pipeline || { applied: 0, reviewing: 0, interview: 0, offered: 0, rejected: 0 }}
            height={400}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Company Performance - Full Width */}
        <DashboardGridItem span="full">
          <CompanyPerformanceChart
            data={data?.companiesPerformance || []}
            totalCompanies={totalCompanies}
            height={350}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Hiring Funnel */}
        <DashboardGridItem span={1}>
          <HiringFunnel
            data={data?.funnel || {
              applied: 0,
              reviewing: 0,
              interview: 0,
              offered: 0,
              conversionRates: {
                appliedToReviewing: 0,
                reviewingToInterview: 0,
                interviewToOffered: 0,
              },
            }}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Department Breakdown */}
        <DashboardGridItem span={2}>
          <DepartmentBreakdown
            data={data?.departmentBreakdown || []}
            height={350}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Activity Feed - Full Width */}
        <DashboardGridItem span="full">
          <ActivityFeed
            activities={data?.recentActivities || []}
            maxHeight={400}
            isLoading={isLoading}
          />
        </DashboardGridItem>
      </DashboardGrid>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      )}
    </div>
  )
}
