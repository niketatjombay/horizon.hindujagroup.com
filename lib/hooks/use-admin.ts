import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminDashboard,
  triggerSync,
  resolveError,
  triggerFullSync,
  clearCache,
  exportData,
  createBackup,
  type AdminTimeRange,
  type AdminDashboardData,
  type ActivityLogEntry,
  type CompanySyncStatus,
  type ErrorLogEntry,
  type ActivityAction,
  type ErrorSeverity,
  type SyncStatus,
} from '@/lib/api/admin'

/**
 * Hook to fetch Admin dashboard data with auto-refresh
 */
export function useAdminDashboard(timeRange: AdminTimeRange) {
  return useQuery({
    queryKey: ['admin-dashboard', timeRange],
    queryFn: () => fetchAdminDashboard(timeRange),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })
}

/**
 * Hook to trigger sync for a specific company
 */
export function useTriggerSync() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => triggerSync(companyId),
    onSuccess: () => {
      // Invalidate admin dashboard to refresh sync status
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

/**
 * Hook to resolve an error
 */
export function useResolveError() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (errorId: string) => resolveError(errorId),
    onSuccess: () => {
      // Invalidate admin dashboard to refresh error log
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

/**
 * Hook to trigger full sync for all companies
 */
export function useTriggerFullSync() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => triggerFullSync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

/**
 * Hook to clear system cache
 */
export function useClearCache() {
  return useMutation({
    mutationFn: () => clearCache(),
  })
}

/**
 * Hook to export system data
 */
export function useExportData() {
  return useMutation({
    mutationFn: () => exportData(),
    onSuccess: (blob) => {
      // Trigger download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `horizon-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
  })
}

/**
 * Hook to create system backup
 */
export function useCreateBackup() {
  return useMutation({
    mutationFn: () => createBackup(),
  })
}

// Re-export types
export type {
  AdminTimeRange,
  AdminDashboardData,
  ActivityLogEntry,
  CompanySyncStatus,
  ErrorLogEntry,
  ActivityAction,
  ErrorSeverity,
  SyncStatus,
}
