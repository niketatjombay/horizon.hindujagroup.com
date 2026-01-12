'use client'

import { useState, useMemo, useCallback } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import {
  RefreshCw,
  Search,
  Settings2,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { ChartMetricCard } from '@/components/charts'
import { SyncLogTable } from '@/components/admin/sync-log-table'
import { SyncConfigModal } from '@/components/admin/sync-config-modal'
import { SyncLogDetailModal } from '@/components/admin/sync-log-detail-modal'
import {
  useSyncConfigs,
  useSyncLogs,
  useSyncStats,
  useSyncLogDetail,
  useUpdateSyncConfig,
  useTestConnection,
  useTriggerManualSync,
  type SyncConfig,
  type SyncLog,
  type SyncLogStatus,
  type SyncLogsFilters,
} from '@/lib/hooks/use-sync-admin'
import { getCompaniesForDropdown } from '@/mock/services/users-admin'
import { useDebounce } from '@/lib/hooks/use-debounce'

const statusColors: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  success: 'success',
  failed: 'error',
  pending: 'warning',
  syncing: 'warning',
}

export default function SyncPage() {
  const { toast } = useToast()

  // Filter state for logs
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  // Modal state
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<SyncConfig | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)

  const companies = getCompaniesForDropdown()

  // Build filters for logs
  const logFilters: SyncLogsFilters = useMemo(
    () => ({
      companyId: companyFilter !== 'all' ? [companyFilter] : undefined,
      status: statusFilter !== 'all' ? [statusFilter as SyncLogStatus] : undefined,
    }),
    [companyFilter, statusFilter]
  )

  // Queries
  const { data: configs = [], isLoading: configsLoading } = useSyncConfigs()
  const { data: logs = [], isLoading: logsLoading } = useSyncLogs(logFilters)
  const { data: stats, isLoading: statsLoading } = useSyncStats()
  const { data: logDetail, isLoading: detailLoading } = useSyncLogDetail(selectedLogId)

  // Mutations
  const updateConfigMutation = useUpdateSyncConfig()
  const testConnectionMutation = useTestConnection()
  const triggerSyncMutation = useTriggerManualSync()

  // Sort logs client-side
  const sortedLogs = useMemo(() => {
    if (!sortColumn || !sortDirection) return logs

    return [...logs].sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortColumn) {
        case 'startTime':
          aVal = new Date(a.startTime).getTime()
          bVal = new Date(b.startTime).getTime()
          break
        case 'company':
          aVal = a.companyName.toLowerCase()
          bVal = b.companyName.toLowerCase()
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'duration':
          aVal = a.duration || 0
          bVal = b.duration || 0
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [logs, sortColumn, sortDirection])

  const handleSort = useCallback(
    (column: string, direction: 'asc' | 'desc' | null) => {
      setSortColumn(direction ? column : null)
      setSortDirection(direction)
    },
    []
  )

  const handleOpenConfigModal = (config: SyncConfig) => {
    setSelectedConfig(config)
    setConfigModalOpen(true)
  }

  const handleCloseConfigModal = () => {
    setConfigModalOpen(false)
    setSelectedConfig(null)
  }

  const handleConfigSubmit = async (data: Partial<SyncConfig>) => {
    if (!selectedConfig) return

    try {
      await updateConfigMutation.mutateAsync({
        companyId: selectedConfig.companyId,
        config: data,
      })
      toast({
        title: 'Configuration Updated',
        description: `Sync settings for ${selectedConfig.companyName} have been saved.`,
      })
      handleCloseConfigModal()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleTestConnection = async () => {
    if (!selectedConfig) {
      return { success: false, message: 'No config selected' }
    }
    return testConnectionMutation.mutateAsync(selectedConfig.companyId)
  }

  const handleTriggerSync = async (companyId: string, companyName: string) => {
    try {
      await triggerSyncMutation.mutateAsync(companyId)
      toast({
        title: 'Sync Started',
        description: `Manual sync triggered for ${companyName}.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to trigger sync. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleViewLogDetail = (log: SyncLog) => {
    setSelectedLogId(log.id)
    setDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false)
    setSelectedLogId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Sync Management
          </h1>
          <p className="mt-1 text-gray-600">
            Monitor and manage ATS synchronization across all companies
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <ChartMetricCard
          title="Total Syncs"
          value={stats?.totalSyncs || 0}
          color="#0066FF"
          icon={<RefreshCw className="h-5 w-5" />}
          loading={statsLoading}
        />
        <ChartMetricCard
          title="Success Rate"
          value={stats ? `${stats.successRate}%` : '0%'}
          color="#00B87C"
          icon={<CheckCircle className="h-5 w-5" />}
          loading={statsLoading}
        />
        <ChartMetricCard
          title="Avg Duration"
          value={stats ? `${Math.floor(stats.avgDuration / 60)}m ${stats.avgDuration % 60}s` : '0s'}
          color="#7B61FF"
          icon={<Clock className="h-5 w-5" />}
          loading={statsLoading}
        />
        <ChartMetricCard
          title="Failed (24h)"
          value={stats?.failedLast24h || 0}
          color={stats?.failedLast24h && stats.failedLast24h > 5 ? '#E63946' : '#FFA733'}
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={statsLoading}
        />
      </div>

      {/* Sync Configuration Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sync Configuration
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Company
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Frequency
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Last Sync
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Enabled
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {configsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading configurations...
                  </td>
                </tr>
              ) : (
                configs.map((config) => (
                  <tr
                    key={config.companyId}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {config.companyName}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusColors[config.status]} size="sm">
                        {config.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 capitalize">
                      {config.frequency === '6hours'
                        ? 'Every 6 hours'
                        : config.frequency === '12hours'
                          ? 'Every 12 hours'
                          : config.frequency}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {config.lastSync
                        ? formatDistanceToNow(new Date(config.lastSync), {
                            addSuffix: true,
                          })
                        : 'Never'}
                    </td>
                    <td className="py-4 px-4">
                      {config.enabled ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenConfigModal(config)}
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleTriggerSync(config.companyId, config.companyName)
                          }
                          disabled={
                            triggerSyncMutation.isPending ||
                            config.status === 'syncing'
                          }
                        >
                          {config.status === 'syncing' ||
                          (triggerSyncMutation.isPending &&
                            triggerSyncMutation.variables === config.companyId) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sync Logs Section */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sync Logs</h2>

          <div className="flex items-center gap-3">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SyncLogTable
          data={sortedLogs.slice(0, 20)}
          loading={logsLoading}
          onViewDetail={handleViewLogDetail}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </Card>

      {/* Config Modal */}
      <SyncConfigModal
        config={selectedConfig}
        open={configModalOpen}
        onClose={handleCloseConfigModal}
        onSubmit={handleConfigSubmit}
        onTestConnection={handleTestConnection}
        isSubmitting={updateConfigMutation.isPending}
      />

      {/* Log Detail Modal */}
      <SyncLogDetailModal
        log={logDetail || null}
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        isLoading={detailLoading}
      />
    </div>
  )
}
