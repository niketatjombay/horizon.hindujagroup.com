import {
  getMockAdminDashboard,
  triggerCompanySync,
  resolveError as resolveErrorMock,
  triggerFullSync as triggerFullSyncMock,
  clearSystemCache as clearSystemCacheMock,
  exportSystemData as exportSystemDataMock,
  createSystemBackup as createSystemBackupMock,
  type AdminTimeRange,
  type AdminDashboardData,
  type ActivityLogEntry,
  type CompanySyncStatus,
  type ErrorLogEntry,
  type ActivityAction,
  type ErrorSeverity,
  type SyncStatus,
} from '@/mock/services/admin'

/**
 * Fetch Admin dashboard data for a given time range
 */
export async function fetchAdminDashboard(timeRange: AdminTimeRange): Promise<AdminDashboardData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return getMockAdminDashboard(timeRange)
}

/**
 * Trigger sync for a specific company
 */
export async function triggerSync(companyId: string): Promise<{ success: boolean }> {
  return triggerCompanySync(companyId)
}

/**
 * Resolve an error in the error log
 */
export async function resolveError(errorId: string): Promise<{ success: boolean }> {
  return resolveErrorMock(errorId)
}

/**
 * Trigger a full sync for all companies
 */
export async function triggerFullSync(): Promise<{ success: boolean; synced: number }> {
  return triggerFullSyncMock()
}

/**
 * Clear the system cache
 */
export async function clearCache(): Promise<{ success: boolean }> {
  return clearSystemCacheMock()
}

/**
 * Export all system data
 */
export async function exportData(): Promise<Blob> {
  return exportSystemDataMock()
}

/**
 * Create a system backup
 */
export async function createBackup(): Promise<{ success: boolean; backupId: string }> {
  return createSystemBackupMock()
}

// Re-export types for convenience
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
