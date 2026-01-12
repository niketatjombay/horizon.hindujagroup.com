import { faker } from '@faker-js/faker'
import { subDays, subHours, subMinutes, format } from 'date-fns'
import { MOCK_COMPANIES } from '../data/companies'
import type { SyncStatus } from './admin'

// =============================================================================
// Types
// =============================================================================

export type SyncFrequency = 'manual' | 'hourly' | '6hours' | '12hours' | 'daily'
export type SyncStrategy = 'full' | 'incremental'
export type SyncLogStatus = 'success' | 'failed' | 'in_progress'
export type SyncTrigger = 'auto' | 'manual'

export interface SyncConfig {
  companyId: string
  companyName: string
  enabled: boolean
  frequency: SyncFrequency
  scheduledTime?: string // HH:mm format for daily syncs
  dataSources: string[]
  strategy: SyncStrategy
  apiEndpoint: string
  apiKey?: string
  timeout: number // in seconds
  lastSync?: string
  status: SyncStatus
}

export interface SyncLogError {
  code: string
  message: string
  timestamp: string
}

export interface SyncLog {
  id: string
  companyId: string
  companyName: string
  status: SyncLogStatus
  startTime: string
  endTime?: string
  duration?: number // in seconds
  triggeredBy: SyncTrigger
  recordsAdded: number
  recordsUpdated: number
  recordsDeleted: number
  errors: SyncLogError[]
}

export interface SyncLogDetail extends SyncLog {
  apiEndpoint: string
  strategy: SyncStrategy
  dataSources: string[]
  conflicts: Array<{
    field: string
    existingValue: string
    newValue: string
    resolution: 'kept_existing' | 'used_new' | 'manual'
  }>
}

export interface SyncLogsFilters {
  companyId?: string[]
  status?: SyncLogStatus[]
  startDate?: string
  endDate?: string
}

export interface SyncStats {
  totalSyncs: number
  successRate: number
  avgDuration: number // in seconds
  failedLast24h: number
}

// =============================================================================
// Constants
// =============================================================================

export const SYNC_DATA_SOURCES = [
  'Employees',
  'Jobs',
  'Applications',
  'Departments',
  'Locations',
] as const

export const SYNC_FREQUENCIES: { value: SyncFrequency; label: string }[] = [
  { value: 'manual', label: 'Manual Only' },
  { value: 'hourly', label: 'Every Hour' },
  { value: '6hours', label: 'Every 6 Hours' },
  { value: '12hours', label: 'Every 12 Hours' },
  { value: 'daily', label: 'Daily' },
]

// =============================================================================
// In-Memory State
// =============================================================================

// Generate initial sync configs for all companies
let syncConfigsState: SyncConfig[] = MOCK_COMPANIES.map((company, index) => {
  const frequencies: SyncFrequency[] = ['hourly', '6hours', '12hours', 'daily', 'manual']
  const strategies: SyncStrategy[] = ['full', 'incremental']
  const statuses: SyncStatus[] = ['success', 'success', 'success', 'pending', 'failed']

  return {
    companyId: company.id,
    companyName: company.name,
    enabled: index % 5 !== 4, // 80% enabled
    frequency: frequencies[index % frequencies.length],
    scheduledTime: frequencies[index % frequencies.length] === 'daily' ? '02:00' : undefined,
    dataSources: ['Employees', 'Jobs', 'Applications'],
    strategy: strategies[index % strategies.length],
    apiEndpoint: company.atsEndpoint || `https://api.${company.name.toLowerCase().replace(/\s+/g, '')}.com/v1/sync`,
    timeout: 120,
    lastSync: subHours(new Date(), Math.floor(Math.random() * 24)).toISOString(),
    status: statuses[index % statuses.length],
  }
})

// Generate mock sync logs
function generateSyncLogs(count: number): SyncLog[] {
  const logs: SyncLog[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const company = faker.helpers.arrayElement(MOCK_COMPANIES)
    const status: SyncLogStatus = faker.helpers.weightedArrayElement([
      { value: 'success', weight: 75 },
      { value: 'failed', weight: 20 },
      { value: 'in_progress', weight: 5 },
    ])

    const startTime = subMinutes(now, faker.number.int({ min: 30, max: 10000 }))
    const duration =
      status === 'in_progress'
        ? undefined
        : faker.number.int({ min: 30, max: 300 })
    const endTime =
      status === 'in_progress'
        ? undefined
        : new Date(startTime.getTime() + (duration || 0) * 1000).toISOString()

    const errors: SyncLogError[] =
      status === 'failed'
        ? [
            {
              code: faker.helpers.arrayElement(['TIMEOUT', 'AUTH_FAILED', 'API_ERROR', 'PARSE_ERROR']),
              message: faker.helpers.arrayElement([
                'Connection timeout after 120 seconds',
                'Invalid API credentials',
                'External API returned 500 error',
                'Failed to parse response data',
              ]),
              timestamp: new Date(
                startTime.getTime() + faker.number.int({ min: 1000, max: 60000 })
              ).toISOString(),
            },
          ]
        : []

    logs.push({
      id: `sync-log-${i + 1}`,
      companyId: company.id,
      companyName: company.name,
      status,
      startTime: startTime.toISOString(),
      endTime,
      duration,
      triggeredBy: faker.helpers.arrayElement(['auto', 'manual'] as SyncTrigger[]),
      recordsAdded:
        status === 'success' ? faker.number.int({ min: 0, max: 50 }) : 0,
      recordsUpdated:
        status === 'success' ? faker.number.int({ min: 0, max: 200 }) : 0,
      recordsDeleted:
        status === 'success' ? faker.number.int({ min: 0, max: 10 }) : 0,
      errors,
    })
  }

  return logs.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )
}

let syncLogsState: SyncLog[] = generateSyncLogs(100)

// =============================================================================
// Sync Config Operations
// =============================================================================

/**
 * Get all sync configurations
 */
export async function getMockSyncConfigs(): Promise<SyncConfig[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...syncConfigsState]
}

/**
 * Get a single sync configuration
 */
export async function getMockSyncConfig(companyId: string): Promise<SyncConfig | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return syncConfigsState.find((c) => c.companyId === companyId) || null
}

/**
 * Update sync configuration
 */
export async function updateMockSyncConfig(
  companyId: string,
  config: Partial<SyncConfig>
): Promise<SyncConfig | null> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = syncConfigsState.findIndex((c) => c.companyId === companyId)
  if (index === -1) return null

  const existing = syncConfigsState[index]
  const updated: SyncConfig = {
    ...existing,
    enabled: config.enabled ?? existing.enabled,
    frequency: config.frequency ?? existing.frequency,
    scheduledTime: config.scheduledTime ?? existing.scheduledTime,
    dataSources: config.dataSources ?? existing.dataSources,
    strategy: config.strategy ?? existing.strategy,
    apiEndpoint: config.apiEndpoint ?? existing.apiEndpoint,
    apiKey: config.apiKey ?? existing.apiKey,
    timeout: config.timeout ?? existing.timeout,
  }

  syncConfigsState[index] = updated
  return updated
}

/**
 * Test API connection for a company
 */
export async function testMockConnection(
  companyId: string
): Promise<{ success: boolean; message: string; latency?: number }> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const config = syncConfigsState.find((c) => c.companyId === companyId)
  if (!config) {
    return { success: false, message: 'Configuration not found' }
  }

  // Simulate 90% success rate
  const success = Math.random() > 0.1
  if (success) {
    return {
      success: true,
      message: 'Connection successful',
      latency: faker.number.int({ min: 50, max: 500 }),
    }
  }

  return {
    success: false,
    message: faker.helpers.arrayElement([
      'Connection timeout',
      'Invalid API key',
      'Endpoint not reachable',
    ]),
  }
}

/**
 * Trigger manual sync for a company
 */
export async function triggerMockManualSync(
  companyId: string
): Promise<{ success: boolean; logId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const config = syncConfigsState.find((c) => c.companyId === companyId)
  if (!config) {
    throw new Error('Company not found')
  }

  // Update config status
  config.status = 'success'
  config.lastSync = new Date().toISOString()

  // Create a new log entry
  const newLog: SyncLog = {
    id: `sync-log-${Date.now()}`,
    companyId: config.companyId,
    companyName: config.companyName,
    status: 'success',
    startTime: new Date(Date.now() - 45000).toISOString(),
    endTime: new Date().toISOString(),
    duration: 45,
    triggeredBy: 'manual',
    recordsAdded: faker.number.int({ min: 5, max: 30 }),
    recordsUpdated: faker.number.int({ min: 10, max: 100 }),
    recordsDeleted: faker.number.int({ min: 0, max: 5 }),
    errors: [],
  }

  syncLogsState.unshift(newLog)

  return { success: true, logId: newLog.id }
}

// =============================================================================
// Sync Log Operations
// =============================================================================

/**
 * Get sync logs with filters
 */
export async function getMockSyncLogs(filters?: SyncLogsFilters): Promise<SyncLog[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filtered = [...syncLogsState]

  if (filters?.companyId && filters.companyId.length > 0) {
    filtered = filtered.filter((l) => filters.companyId!.includes(l.companyId))
  }

  if (filters?.status && filters.status.length > 0) {
    filtered = filtered.filter((l) => filters.status!.includes(l.status))
  }

  if (filters?.startDate) {
    const startDate = new Date(filters.startDate)
    filtered = filtered.filter((l) => new Date(l.startTime) >= startDate)
  }

  if (filters?.endDate) {
    const endDate = new Date(filters.endDate)
    filtered = filtered.filter((l) => new Date(l.startTime) <= endDate)
  }

  return filtered
}

/**
 * Get a single sync log with full details
 */
export async function getMockSyncLogDetail(logId: string): Promise<SyncLogDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const log = syncLogsState.find((l) => l.id === logId)
  if (!log) return null

  const config = syncConfigsState.find((c) => c.companyId === log.companyId)

  // Generate mock conflicts for the detail view
  const conflicts =
    log.status === 'success' && Math.random() > 0.7
      ? [
          {
            field: 'employee_email',
            existingValue: 'old.email@company.com',
            newValue: 'new.email@company.com',
            resolution: 'used_new' as const,
          },
          {
            field: 'job_title',
            existingValue: 'Senior Engineer',
            newValue: 'Staff Engineer',
            resolution: 'used_new' as const,
          },
        ]
      : []

  return {
    ...log,
    apiEndpoint: config?.apiEndpoint || 'Unknown',
    strategy: config?.strategy || 'incremental',
    dataSources: config?.dataSources || [],
    conflicts,
  }
}

/**
 * Get sync statistics
 */
export async function getMockSyncStats(): Promise<SyncStats> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const last24h = subDays(new Date(), 1)
  const recentLogs = syncLogsState.filter(
    (l) => new Date(l.startTime) >= last24h
  )

  const successfulLogs = syncLogsState.filter((l) => l.status === 'success')
  const avgDuration =
    successfulLogs.length > 0
      ? successfulLogs.reduce((sum, l) => sum + (l.duration || 0), 0) /
        successfulLogs.length
      : 0

  const failedLast24h = recentLogs.filter((l) => l.status === 'failed').length

  return {
    totalSyncs: syncLogsState.length,
    successRate: Math.round(
      (successfulLogs.length / syncLogsState.length) * 100
    ),
    avgDuration: Math.round(avgDuration),
    failedLast24h,
  }
}

// =============================================================================
// Reset Functions
// =============================================================================

/**
 * Reset sync configs state (for testing)
 */
export function resetSyncConfigsState(): void {
  syncConfigsState = MOCK_COMPANIES.map((company, index) => {
    const frequencies: SyncFrequency[] = ['hourly', '6hours', '12hours', 'daily', 'manual']
    const strategies: SyncStrategy[] = ['full', 'incremental']
    const statuses: SyncStatus[] = ['success', 'success', 'success', 'pending', 'failed']

    return {
      companyId: company.id,
      companyName: company.name,
      enabled: index % 5 !== 4,
      frequency: frequencies[index % frequencies.length],
      scheduledTime: frequencies[index % frequencies.length] === 'daily' ? '02:00' : undefined,
      dataSources: ['Employees', 'Jobs', 'Applications'],
      strategy: strategies[index % strategies.length],
      apiEndpoint: company.atsEndpoint || `https://api.${company.name.toLowerCase().replace(/\s+/g, '')}.com/v1/sync`,
      timeout: 120,
      lastSync: subHours(new Date(), Math.floor(Math.random() * 24)).toISOString(),
      status: statuses[index % statuses.length],
    }
  })
}

/**
 * Reset sync logs state (for testing)
 */
export function resetSyncLogsState(): void {
  syncLogsState = generateSyncLogs(100)
}
