import {
  getMockSyncConfigs,
  getMockSyncConfig,
  updateMockSyncConfig,
  testMockConnection,
  triggerMockManualSync,
  getMockSyncLogs,
  getMockSyncLogDetail,
  getMockSyncStats,
  type SyncConfig,
  type SyncLog,
  type SyncLogDetail,
  type SyncLogsFilters,
  type SyncStats,
  type SyncFrequency,
  type SyncStrategy,
  type SyncLogStatus,
  type SyncTrigger,
} from '@/mock/services/sync-admin'

/**
 * Fetch all sync configurations
 */
export async function fetchSyncConfigs(): Promise<SyncConfig[]> {
  return getMockSyncConfigs()
}

/**
 * Fetch a single sync configuration
 */
export async function fetchSyncConfig(companyId: string): Promise<SyncConfig | null> {
  return getMockSyncConfig(companyId)
}

/**
 * Update sync configuration
 */
export async function updateSyncConfig(
  companyId: string,
  config: Partial<SyncConfig>
): Promise<SyncConfig | null> {
  return updateMockSyncConfig(companyId, config)
}

/**
 * Test API connection for a company
 */
export async function testConnection(
  companyId: string
): Promise<{ success: boolean; message: string; latency?: number }> {
  return testMockConnection(companyId)
}

/**
 * Trigger manual sync for a company
 */
export async function triggerManualSync(
  companyId: string
): Promise<{ success: boolean; logId: string }> {
  return triggerMockManualSync(companyId)
}

/**
 * Fetch sync logs with filters
 */
export async function fetchSyncLogs(filters?: SyncLogsFilters): Promise<SyncLog[]> {
  return getMockSyncLogs(filters)
}

/**
 * Fetch a single sync log with full details
 */
export async function fetchSyncLogDetail(logId: string): Promise<SyncLogDetail | null> {
  return getMockSyncLogDetail(logId)
}

/**
 * Fetch sync statistics
 */
export async function fetchSyncStats(): Promise<SyncStats> {
  return getMockSyncStats()
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
