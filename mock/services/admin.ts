import { subDays, subHours, format, parseISO, isAfter } from 'date-fns'
import { MOCK_APPLICATIONS } from '../data/applications'
import { MOCK_JOBS } from '../data/jobs'
import { MOCK_COMPANIES } from '../data/companies'
import { MOCK_USERS } from '../data/users'
import { TimeRange } from './chro'

// =============================================================================
// Admin Dashboard Types
// =============================================================================

export type AdminTimeRange = '24h' | '7d' | '30d' | '3m' | '6m' | '1y' | 'all'

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'apply'
  | 'status_change'

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export type SyncStatus = 'success' | 'failed' | 'pending' | 'syncing'

export interface ActivityLogEntry {
  id: string
  timestamp: string
  user: { name: string; email: string; role: string }
  action: ActivityAction
  resource: string
  resourceId: string
  details: string
  ipAddress: string
}

export interface CompanySyncStatus {
  companyId: string
  companyName: string
  lastSync: string
  status: SyncStatus
  recordsProcessed: number
  errorMessage?: string
}

export interface ErrorLogEntry {
  id: string
  timestamp: string
  severity: ErrorSeverity
  type: string
  message: string
  stackTrace?: string
  resolved: boolean
  resolvedAt?: string
}

export interface AdminDashboardData {
  metrics: {
    totalUsers: number
    totalUsersTrend: number
    activeJobs: number
    activeJobsTrend: number
    syncSuccess: number
    syncSuccessTrend: number
    errorsToday: number
    errorsTrend: number
  }

  activityLog: ActivityLogEntry[]

  syncStatus: CompanySyncStatus[]

  userActivity: {
    dates: string[]
    employees: number[]
    hr: number[]
    chro: number[]
    admin: number[]
  }

  errorLog: ErrorLogEntry[]

  performance: {
    timestamps: string[]
    responseTime: number[]
    throughput: number[]
    errorRate: number[]
  }

  storage: {
    used: number
    total: number
    breakdown: Array<{
      category: string
      size: number
      percentage: number
    }>
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

function getAdminTimeRangeStartDate(timeRange: AdminTimeRange): Date {
  const now = new Date()
  switch (timeRange) {
    case '24h':
      return subDays(now, 1)
    case '7d':
      return subDays(now, 7)
    case '30d':
      return subDays(now, 30)
    case '3m':
      return subDays(now, 90)
    case '6m':
      return subDays(now, 180)
    case '1y':
      return subDays(now, 365)
    case 'all':
      return new Date('2020-01-01')
  }
}

function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

function generateActivityLog(count: number): ActivityLogEntry[] {
  const activities: ActivityLogEntry[] = []
  const actions: ActivityAction[] = [
    'login',
    'logout',
    'create',
    'update',
    'delete',
    'apply',
    'status_change',
  ]
  const resources = ['Job', 'Application', 'User', 'Company', 'Profile', 'Settings']
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const resource = resources[Math.floor(Math.random() * resources.length)]
    const hoursAgo = Math.floor(Math.random() * 168) // Up to 7 days

    let details = ''
    switch (action) {
      case 'login':
        details = 'User logged in successfully'
        break
      case 'logout':
        details = 'User logged out'
        break
      case 'create':
        details = `Created new ${resource.toLowerCase()}`
        break
      case 'update':
        details = `Updated ${resource.toLowerCase()} details`
        break
      case 'delete':
        details = `Deleted ${resource.toLowerCase()}`
        break
      case 'apply':
        details = 'Applied for a new position'
        break
      case 'status_change':
        details = 'Changed status from Applied to Interview'
        break
    }

    activities.push({
      id: `activity-${i + 1}`,
      timestamp: subHours(now, hoursAgo).toISOString(),
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
      action,
      resource,
      resourceId: `${resource.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      details,
      ipAddress: generateRandomIP(),
    })
  }

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

function generateSyncStatus(): CompanySyncStatus[] {
  const now = new Date()
  const statuses: SyncStatus[] = ['success', 'success', 'success', 'success', 'failed', 'pending']

  return MOCK_COMPANIES.map((company, index) => {
    const status = statuses[index % statuses.length]
    const hoursAgo = Math.floor(Math.random() * 24)

    return {
      companyId: company.id,
      companyName: company.name,
      lastSync: subHours(now, hoursAgo).toISOString(),
      status,
      recordsProcessed: status === 'success' ? Math.floor(Math.random() * 500) + 100 : 0,
      errorMessage:
        status === 'failed' ? 'Connection timeout: Unable to reach company API endpoint' : undefined,
    }
  })
}

function generateErrorLog(count: number): ErrorLogEntry[] {
  const errors: ErrorLogEntry[] = []
  const severities: ErrorSeverity[] = ['low', 'low', 'medium', 'medium', 'high', 'critical']
  const types = [
    'API Error',
    'Sync Failure',
    'Auth Error',
    'Database Error',
    'Network Error',
    'Validation Error',
  ]
  const messages = [
    'Failed to fetch data from external API',
    'Connection timeout during sync operation',
    'Invalid authentication token',
    'Database query execution failed',
    'Network request failed after 3 retries',
    'Invalid request payload structure',
  ]
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const typeIndex = Math.floor(Math.random() * types.length)
    const hoursAgo = Math.floor(Math.random() * 48)
    const resolved = Math.random() > 0.6

    errors.push({
      id: `error-${i + 1}`,
      timestamp: subHours(now, hoursAgo).toISOString(),
      severity,
      type: types[typeIndex],
      message: messages[typeIndex],
      stackTrace:
        severity === 'high' || severity === 'critical'
          ? `Error: ${messages[typeIndex]}\n    at handleRequest (/app/api/handler.ts:45:12)\n    at processRequest (/app/middleware.ts:23:8)\n    at async Server.handleConnection (/app/server.ts:156:5)`
          : undefined,
      resolved,
      resolvedAt: resolved ? subHours(now, Math.floor(hoursAgo / 2)).toISOString() : undefined,
    })
  }

  return errors.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

function generateUserActivityData(days: number): AdminDashboardData['userActivity'] {
  const dates: string[] = []
  const employees: number[] = []
  const hr: number[] = []
  const chro: number[] = []
  const admin: number[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i)
    dates.push(format(date, 'yyyy-MM-dd'))

    // Generate realistic activity numbers
    employees.push(Math.floor(Math.random() * 100) + 150) // 150-250
    hr.push(Math.floor(Math.random() * 30) + 20) // 20-50
    chro.push(Math.floor(Math.random() * 5) + 3) // 3-8
    admin.push(Math.floor(Math.random() * 3) + 1) // 1-4
  }

  return { dates, employees, hr, chro, admin }
}

function generatePerformanceData(hours: number): AdminDashboardData['performance'] {
  const timestamps: string[] = []
  const responseTime: number[] = []
  const throughput: number[] = []
  const errorRate: number[] = []
  const now = new Date()

  for (let i = hours - 1; i >= 0; i--) {
    const time = subHours(now, i)
    timestamps.push(time.toISOString())

    // Generate realistic performance data
    responseTime.push(Math.floor(Math.random() * 100) + 120) // 120-220ms
    throughput.push(Math.floor(Math.random() * 200) + 300) // 300-500 req/min
    errorRate.push(Math.random() * 1.5) // 0-1.5%
  }

  return { timestamps, responseTime, throughput, errorRate }
}

function generateStorageData(): AdminDashboardData['storage'] {
  const used = 45 // GB
  const total = 100 // GB

  const breakdown = [
    { category: 'Resumes', size: 18, percentage: 40 },
    { category: 'Documents', size: 12, percentage: 27 },
    { category: 'Database', size: 10, percentage: 22 },
    { category: 'Logs', size: 5, percentage: 11 },
  ]

  return { used, total, breakdown }
}

// =============================================================================
// Main Admin Dashboard Data Generator
// =============================================================================

export function getMockAdminDashboard(timeRange: AdminTimeRange): AdminDashboardData {
  const startDate = getAdminTimeRangeStartDate(timeRange)

  // Filter applications by time range for relevant metrics
  const filteredApplications = MOCK_APPLICATIONS.filter((app) =>
    isAfter(parseISO(app.appliedAt), startDate)
  )

  // Calculate basic metrics
  const totalUsers = MOCK_USERS.length * 10 // Scale for realism
  const activeJobs = MOCK_JOBS.filter((j) => j.status === 'open').length

  // Generate sync status
  const syncStatus = generateSyncStatus()
  const successfulSyncs = syncStatus.filter((s) => s.status === 'success').length
  const syncSuccessRate = Math.round((successfulSyncs / syncStatus.length) * 100)

  // Generate error log
  const errorLog = generateErrorLog(20)
  const errorsToday = errorLog.filter((e) => {
    const errorDate = parseISO(e.timestamp)
    return isAfter(errorDate, subDays(new Date(), 1))
  }).length

  // Determine days for user activity based on time range
  const activityDays =
    timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 30

  return {
    metrics: {
      totalUsers,
      totalUsersTrend: 3.5,
      activeJobs,
      activeJobsTrend: 8.2,
      syncSuccess: syncSuccessRate,
      syncSuccessTrend: -2.1, // Slightly down from last period
      errorsToday,
      errorsTrend: errorsToday > 5 ? 15.3 : -8.4, // Based on error count
    },
    activityLog: generateActivityLog(50),
    syncStatus,
    userActivity: generateUserActivityData(activityDays),
    errorLog,
    performance: generatePerformanceData(24),
    storage: generateStorageData(),
  }
}

// =============================================================================
// Admin Action Functions
// =============================================================================

export async function triggerCompanySync(companyId: string): Promise<{ success: boolean }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate 90% success rate
  const success = Math.random() > 0.1
  return { success }
}

export async function resolveError(errorId: string): Promise<{ success: boolean }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

export async function triggerFullSync(): Promise<{ success: boolean; synced: number }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return { success: true, synced: MOCK_COMPANIES.length }
}

export async function clearSystemCache(): Promise<{ success: boolean }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

export async function exportSystemData(): Promise<Blob> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Create a mock export blob
  const data = {
    exportedAt: new Date().toISOString(),
    users: MOCK_USERS.length,
    jobs: MOCK_JOBS.length,
    applications: MOCK_APPLICATIONS.length,
    companies: MOCK_COMPANIES.length,
  }

  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}

export async function createSystemBackup(): Promise<{ success: boolean; backupId: string }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return {
    success: true,
    backupId: `backup-${Date.now()}`,
  }
}
