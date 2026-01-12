import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSyncConfigs,
  fetchSyncConfig,
  updateSyncConfig,
  testConnection,
  triggerManualSync,
  fetchSyncLogs,
  fetchSyncLogDetail,
  fetchSyncStats,
  type SyncConfig,
  type SyncLog,
  type SyncLogDetail,
  type SyncLogsFilters,
  type SyncStats,
  type SyncFrequency,
  type SyncStrategy,
  type SyncLogStatus,
  type SyncTrigger,
} from '@/lib/api/sync-admin'

/**
 * Hook to fetch all sync configurations
 */
export function useSyncConfigs() {
  return useQuery({
    queryKey: ['sync-configs'],
    queryFn: () => fetchSyncConfigs(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })
}

/**
 * Hook to fetch a single sync configuration
 */
export function useSyncConfig(companyId: string | null) {
  return useQuery({
    queryKey: ['sync-config', companyId],
    queryFn: () => (companyId ? fetchSyncConfig(companyId) : null),
    enabled: !!companyId,
  })
}

/**
 * Hook to fetch sync statistics
 */
export function useSyncStats() {
  return useQuery({
    queryKey: ['sync-stats'],
    queryFn: () => fetchSyncStats(),
    refetchInterval: 60000, // Auto-refresh every minute
  })
}

/**
 * Hook to fetch sync logs with filters
 */
export function useSyncLogs(filters?: SyncLogsFilters) {
  return useQuery({
    queryKey: ['sync-logs', filters],
    queryFn: () => fetchSyncLogs(filters),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })
}

/**
 * Hook to fetch a single sync log with full details
 */
export function useSyncLogDetail(logId: string | null) {
  return useQuery({
    queryKey: ['sync-log-detail', logId],
    queryFn: () => (logId ? fetchSyncLogDetail(logId) : null),
    enabled: !!logId,
  })
}

/**
 * Hook to update sync configuration
 */
export function useUpdateSyncConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      companyId,
      config,
    }: {
      companyId: string
      config: Partial<SyncConfig>
    }) => updateSyncConfig(companyId, config),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['sync-configs'] })
      queryClient.invalidateQueries({ queryKey: ['sync-config', companyId] })
    },
  })
}

/**
 * Hook to test API connection
 */
export function useTestConnection() {
  return useMutation({
    mutationFn: (companyId: string) => testConnection(companyId),
  })
}

/**
 * Hook to trigger manual sync
 */
export function useTriggerManualSync() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => triggerManualSync(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-configs'] })
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] })
      queryClient.invalidateQueries({ queryKey: ['sync-stats'] })
    },
  })
}

// Re-export types for convenience
export type {
  SyncConfig,
  SyncLog,
  SyncLogDetail,
  SyncLogsFilters,
  SyncStats,
  SyncFrequency,
  SyncStrategy,
  SyncLogStatus,
  SyncTrigger,
}
