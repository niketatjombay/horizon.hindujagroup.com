'use client'

import { useState } from 'react'
import { Users, Briefcase, RefreshCw, AlertTriangle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartMetricCard,
  DashboardGrid,
  DashboardGridItem,
} from '@/components/charts'
import {
  ActivityLogTable,
  SyncStatusPanel,
  ErrorMonitoring,
  PerformanceMetrics,
  StorageUsageChart,
  UserActivityChart,
  QuickActionsPanel,
  ActivityDetailModal,
} from '@/components/admin'
import { useAuth } from '@/lib/hooks/use-auth'
import {
  useAdminDashboard,
  useTriggerSync,
  useResolveError,
  useTriggerFullSync,
  useClearCache,
  useExportData,
  useCreateBackup,
} from '@/lib/hooks/use-admin'
import type { AdminTimeRange, ActivityLogEntry } from '@/lib/hooks/use-admin'
import { getChartColor } from '@/lib/utils/chart-helpers'

const TIME_RANGE_OPTIONS: { value: AdminTimeRange; label: string }[] = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
]

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<AdminTimeRange>('24h')
  const [selectedActivity, setSelectedActivity] = useState<ActivityLogEntry | null>(null)
  const [activityDetailOpen, setActivityDetailOpen] = useState(false)

  const { data, isLoading, error } = useAdminDashboard(timeRange)
  const triggerSyncMutation = useTriggerSync()
  const resolveErrorMutation = useResolveError()
  const triggerFullSyncMutation = useTriggerFullSync()
  const clearCacheMutation = useClearCache()
  const exportDataMutation = useExportData()
  const createBackupMutation = useCreateBackup()

  const handleViewActivityDetail = (activity: ActivityLogEntry) => {
    setSelectedActivity(activity)
    setActivityDetailOpen(true)
  }

  const handleCloseActivityDetail = () => {
    setActivityDetailOpen(false)
    setSelectedActivity(null)
  }

  const handleTriggerSync = async (companyId: string) => {
    await triggerSyncMutation.mutateAsync(companyId)
  }

  const handleResolveError = async (errorId: string) => {
    await resolveErrorMutation.mutateAsync(errorId)
  }

  const handleTriggerFullSync = async () => {
    await triggerFullSyncMutation.mutateAsync()
  }

  const handleClearCache = async () => {
    await clearCacheMutation.mutateAsync()
  }

  const handleExportData = async () => {
    await exportDataMutation.mutateAsync()
  }

  const handleSystemBackup = async () => {
    await createBackupMutation.mutateAsync()
  }

  const handleExportActivityLog = () => {
    // For now just alert - would download CSV in production
    alert('Activity log export functionality coming soon!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Welcome back, {user?.firstName || 'Admin'}
          </h1>
          <p className="mt-1 text-gray-600">
            Platform monitoring and system administration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as AdminTimeRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="secondary" size="sm" onClick={handleExportActivityLog}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ChartMetricCard
          title="Total Users"
          value={data?.metrics.totalUsers || 0}
          trend={{
            value: data?.metrics.totalUsersTrend || 0,
            label: 'vs last period',
          }}
          color={getChartColor(0)}
          icon={<Users className="h-5 w-5" />}
          loading={isLoading}
        />

        <ChartMetricCard
          title="Active Jobs"
          value={data?.metrics.activeJobs || 0}
          trend={{
            value: data?.metrics.activeJobsTrend || 0,
            label: 'vs last period',
          }}
          color={getChartColor(2)}
          icon={<Briefcase className="h-5 w-5" />}
          loading={isLoading}
        />

        <ChartMetricCard
          title="Sync Success"
          value={data ? `${data.metrics.syncSuccess}%` : '0%'}
          trend={{
            value: data?.metrics.syncSuccessTrend || 0,
            label: 'vs last period',
          }}
          color={getChartColor(1)}
          icon={<RefreshCw className="h-5 w-5" />}
          loading={isLoading}
        />

        <ChartMetricCard
          title="Errors Today"
          value={data?.metrics.errorsToday || 0}
          trend={{
            value: data?.metrics.errorsTrend || 0,
            label: 'vs last period',
            isPositive: (data?.metrics.errorsTrend || 0) < 0, // Lower is better
          }}
          color={(data?.metrics.errorsToday || 0) > 10 ? '#E63946' : getChartColor(3)}
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Dashboard Grid */}
      <DashboardGrid>
        {/* Row 2: Activity Log Table (span 2) + Quick Actions (span 1) */}
        <DashboardGridItem span={2}>
          <ActivityLogTable
            data={data?.activityLog || []}
            maxHeight={400}
            onViewDetail={handleViewActivityDetail}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        <DashboardGridItem span={1}>
          <QuickActionsPanel
            onTriggerFullSync={handleTriggerFullSync}
            onClearCache={handleClearCache}
            onExportData={handleExportData}
            onSystemBackup={handleSystemBackup}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Row 3: Sync Status Panel (full width) */}
        <DashboardGridItem span="full">
          <SyncStatusPanel
            data={data?.syncStatus || []}
            onTriggerSync={handleTriggerSync}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Row 4: User Activity Chart (span 2) + Error Monitoring (span 1) */}
        <DashboardGridItem span={2}>
          <UserActivityChart
            data={data?.userActivity || { dates: [], employees: [], hr: [], chro: [], admin: [] }}
            height={300}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        <DashboardGridItem span={1}>
          <ErrorMonitoring
            errors={data?.errorLog || []}
            onResolve={handleResolveError}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        {/* Row 5: Performance Metrics (span 2) + Storage Usage (span 1) */}
        <DashboardGridItem span={2}>
          <PerformanceMetrics
            data={data?.performance || { timestamps: [], responseTime: [], throughput: [], errorRate: [] }}
            height={300}
            isLoading={isLoading}
          />
        </DashboardGridItem>

        <DashboardGridItem span={1}>
          <StorageUsageChart
            data={data?.storage || { used: 0, total: 100, breakdown: [] }}
            height={350}
            isLoading={isLoading}
          />
        </DashboardGridItem>
      </DashboardGrid>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        open={activityDetailOpen}
        onClose={handleCloseActivityDetail}
      />

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      )}
    </div>
  )
}
