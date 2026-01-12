import { subDays, subMonths, format, parseISO, isAfter } from 'date-fns'
import { MOCK_APPLICATIONS } from '../data/applications'
import { MOCK_JOBS } from '../data/jobs'
import { MOCK_COMPANIES } from '../data/companies'
import { MOCK_USERS } from '../data/users'
import type { ApplicationStatus } from '@/types'

// =============================================================================
// CHRO Dashboard Types
// =============================================================================

export type TimeRange = '7d' | '30d' | '3m' | '6m' | '1y' | 'all'

export interface CHRODashboardData {
  metrics: {
    totalEmployees: number
    totalEmployeesTrend: number // % change
    openPositions: number
    openPositionsTrend: number
    applicationsThisMonth: number
    applicationsTrend: number
    avgTimeToHire: number // days
    timeToHireTrend: number
  }

  trends: {
    dates: string[] // ISO dates
    applications: number[]
    hired: number[]
    rejected: number[]
  }

  pipeline: {
    applied: number
    reviewing: number
    interview: number
    offered: number
    rejected: number
  }

  companiesPerformance: Array<{
    companyName: string
    applicationCount: number
  }>

  funnel: {
    applied: number
    reviewing: number
    interview: number
    offered: number
    conversionRates: {
      appliedToReviewing: number
      reviewingToInterview: number
      interviewToOffered: number
    }
  }

  departmentBreakdown: Array<{
    department: string
    count: number
    percentage: number
  }>

  recentActivities: Array<{
    id: string
    type: 'applied' | 'interview' | 'offered' | 'rejected'
    applicantName: string
    jobTitle: string
    companyName: string
    timestamp: string
    hrName: string
  }>
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the start date for a time range
 */
function getTimeRangeStartDate(timeRange: TimeRange): Date {
  const now = new Date()
  switch (timeRange) {
    case '7d':
      return subDays(now, 7)
    case '30d':
      return subDays(now, 30)
    case '3m':
      return subMonths(now, 3)
    case '6m':
      return subMonths(now, 6)
    case '1y':
      return subMonths(now, 12)
    case 'all':
      return new Date('2020-01-01')
  }
}

/**
 * Map application status to pipeline category
 */
function mapStatusToPipeline(
  status: ApplicationStatus
): 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected' | null {
  switch (status) {
    case 'submitted':
      return 'applied'
    case 'under_review':
    case 'shortlisted':
      return 'reviewing'
    case 'interview_scheduled':
      return 'interview'
    case 'offered':
    case 'accepted':
      return 'offered'
    case 'rejected':
      return 'rejected'
    case 'withdrawn':
      return null
  }
}

/**
 * Map application status to activity type
 */
function mapStatusToActivityType(
  status: ApplicationStatus
): 'applied' | 'interview' | 'offered' | 'rejected' {
  switch (status) {
    case 'interview_scheduled':
      return 'interview'
    case 'offered':
    case 'accepted':
      return 'offered'
    case 'rejected':
      return 'rejected'
    default:
      return 'applied'
  }
}

/**
 * Get random HR name from HR users
 */
function getRandomHRName(): string {
  const hrUsers = MOCK_USERS.filter((u) => u.role === 'hr')
  if (hrUsers.length === 0) return 'HR Team'
  const randomHR = hrUsers[Math.floor(Math.random() * hrUsers.length)]
  return `${randomHR.firstName} ${randomHR.lastName}`
}

/**
 * Generate trend data for the specified number of months
 */
function generateTrendData(months: number): CHRODashboardData['trends'] {
  const dates: string[] = []
  const applications: number[] = []
  const hired: number[] = []
  const rejected: number[] = []

  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i)
    dates.push(format(date, 'yyyy-MM-dd'))

    // Generate realistic trending data
    const baseApplications = 50 + Math.floor(Math.random() * 30)
    const baseHired = Math.floor(baseApplications * (0.1 + Math.random() * 0.1))
    const baseRejected = Math.floor(baseApplications * (0.15 + Math.random() * 0.1))

    // Add some growth trend
    const growthFactor = 1 + (months - i) * 0.02
    applications.push(Math.floor(baseApplications * growthFactor))
    hired.push(Math.floor(baseHired * growthFactor))
    rejected.push(Math.floor(baseRejected * growthFactor))
  }

  return { dates, applications, hired, rejected }
}

// =============================================================================
// Main CHRO Dashboard Data Generator
// =============================================================================

/**
 * Get mock CHRO dashboard data for a given time range
 */
export function getMockCHRODashboard(timeRange: TimeRange): CHRODashboardData {
  const startDate = getTimeRangeStartDate(timeRange)

  // Filter applications by time range
  const filteredApplications = MOCK_APPLICATIONS.filter((app) =>
    isAfter(parseISO(app.appliedAt), startDate)
  )

  // Calculate pipeline counts
  const pipelineCounts = {
    applied: 0,
    reviewing: 0,
    interview: 0,
    offered: 0,
    rejected: 0,
  }

  filteredApplications.forEach((app) => {
    const category = mapStatusToPipeline(app.status)
    if (category) {
      pipelineCounts[category]++
    }
  })

  // Calculate company performance
  const companyAppCounts: Record<string, number> = {}
  MOCK_JOBS.forEach((job) => {
    if (!companyAppCounts[job.companyName]) {
      companyAppCounts[job.companyName] = 0
    }
  })

  filteredApplications.forEach((app) => {
    const job = MOCK_JOBS.find((j) => j.id === app.jobId)
    if (job) {
      companyAppCounts[job.companyName] = (companyAppCounts[job.companyName] || 0) + 1
    }
  })

  const companiesPerformance = Object.entries(companyAppCounts)
    .map(([companyName, applicationCount]) => ({ companyName, applicationCount }))
    .sort((a, b) => b.applicationCount - a.applicationCount)

  // Calculate department breakdown
  const departmentCounts: Record<string, number> = {}
  MOCK_JOBS.forEach((job) => {
    if (job.department) {
      departmentCounts[job.department] = (departmentCounts[job.department] || 0) + 1
    }
  })

  const totalDeptJobs = Object.values(departmentCounts).reduce((a, b) => a + b, 0)
  const departmentBreakdown = Object.entries(departmentCounts)
    .map(([department, count]) => ({
      department,
      count,
      percentage: totalDeptJobs > 0 ? Math.round((count / totalDeptJobs) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Calculate funnel with conversion rates
  const funnelTotal = pipelineCounts.applied + pipelineCounts.reviewing +
                      pipelineCounts.interview + pipelineCounts.offered
  const funnel = {
    applied: funnelTotal,
    reviewing: pipelineCounts.reviewing + pipelineCounts.interview + pipelineCounts.offered,
    interview: pipelineCounts.interview + pipelineCounts.offered,
    offered: pipelineCounts.offered,
    conversionRates: {
      appliedToReviewing: funnelTotal > 0
        ? Math.round(((pipelineCounts.reviewing + pipelineCounts.interview + pipelineCounts.offered) / funnelTotal) * 100)
        : 0,
      reviewingToInterview: (pipelineCounts.reviewing + pipelineCounts.interview + pipelineCounts.offered) > 0
        ? Math.round(((pipelineCounts.interview + pipelineCounts.offered) / (pipelineCounts.reviewing + pipelineCounts.interview + pipelineCounts.offered)) * 100)
        : 0,
      interviewToOffered: (pipelineCounts.interview + pipelineCounts.offered) > 0
        ? Math.round((pipelineCounts.offered / (pipelineCounts.interview + pipelineCounts.offered)) * 100)
        : 0,
    },
  }

  // Generate recent activities
  const recentActivities = filteredApplications
    .slice(0, 20)
    .map((app, index) => {
      const job = MOCK_JOBS.find((j) => j.id === app.jobId)
      return {
        id: `activity-${index}`,
        type: mapStatusToActivityType(app.status),
        applicantName: app.userName,
        jobTitle: app.jobTitle,
        companyName: job?.companyName || 'Unknown Company',
        timestamp: app.updatedAt || app.appliedAt,
        hrName: getRandomHRName(),
      }
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Calculate metrics
  const totalEmployees = MOCK_USERS.filter((u) => u.role === 'employee').length * 100 // Scale up for realism
  const openPositions = MOCK_JOBS.filter((j) => j.status === 'open').length
  const applicationsThisMonth = filteredApplications.length

  // Generate trend data based on time range
  const trendMonths = timeRange === '7d' ? 1 :
                      timeRange === '30d' ? 1 :
                      timeRange === '3m' ? 3 :
                      timeRange === '6m' ? 6 : 12

  return {
    metrics: {
      totalEmployees,
      totalEmployeesTrend: 5.2, // Mock positive trend
      openPositions,
      openPositionsTrend: 12.5, // Mock trend
      applicationsThisMonth,
      applicationsTrend: 8.3, // Mock trend
      avgTimeToHire: 28, // Mock average days
      timeToHireTrend: -4.2, // Negative is good for time to hire
    },
    trends: generateTrendData(Math.max(trendMonths, 6)),
    pipeline: pipelineCounts,
    companiesPerformance,
    funnel,
    departmentBreakdown,
    recentActivities,
  }
}

/**
 * Get all companies count for display
 */
export function getTotalCompaniesCount(): number {
  return MOCK_COMPANIES.length
}
