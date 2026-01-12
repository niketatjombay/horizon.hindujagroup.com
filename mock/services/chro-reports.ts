import {
  subDays,
  subMonths,
  format,
  parseISO,
  isAfter,
  isBefore,
  differenceInDays,
} from 'date-fns'
import { MOCK_APPLICATIONS } from '../data/applications'
import { MOCK_JOBS } from '../data/jobs'
import { MOCK_COMPANIES } from '../data/companies'
import type { Application, ApplicationStatus, Job } from '@/types'
import type {
  ReportFilters,
  DateRange,
  DateRangePreset,
  HiringOverviewData,
  CompanyComparisonData,
  DepartmentAnalysisData,
  TimeToHireData,
  PipelineAnalysisData,
  ReportFilterOptions,
  StatusDistribution,
  HiringOverviewTableRow,
  CompanyMetrics,
  DepartmentMetrics,
  TimeToHireByEntity,
  PipelineStage,
  PipelineTableRow,
} from '@/types/chro-reports'

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get date range from preset
 */
export function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const now = new Date()
  const endDate = format(now, 'yyyy-MM-dd')
  let startDate: string

  switch (preset) {
    case 'last-7-days':
      startDate = format(subDays(now, 7), 'yyyy-MM-dd')
      break
    case 'last-30-days':
      startDate = format(subDays(now, 30), 'yyyy-MM-dd')
      break
    case 'last-quarter':
      startDate = format(subMonths(now, 3), 'yyyy-MM-dd')
      break
    case 'last-6-months':
      startDate = format(subMonths(now, 6), 'yyyy-MM-dd')
      break
    case 'last-year':
      startDate = format(subMonths(now, 12), 'yyyy-MM-dd')
      break
    case 'custom':
    default:
      startDate = format(subDays(now, 30), 'yyyy-MM-dd')
  }

  return { startDate, endDate }
}

/**
 * Filter applications by date range
 */
function filterByDateRange(
  apps: Application[],
  range: DateRange
): Application[] {
  const start = parseISO(range.startDate)
  const end = parseISO(range.endDate)

  return apps.filter((app) => {
    const appDate = parseISO(app.appliedAt)
    return isAfter(appDate, start) && isBefore(appDate, end)
  })
}

/**
 * Filter applications by company IDs
 */
function filterByCompanies(
  apps: Application[],
  companyIds: string[]
): Application[] {
  if (companyIds.length === 0) return apps

  const jobIdsByCompany = new Set(
    MOCK_JOBS.filter((job) => companyIds.includes(job.companyId)).map(
      (job) => job.id
    )
  )

  return apps.filter((app) => jobIdsByCompany.has(app.jobId))
}

/**
 * Filter applications by departments
 */
function filterByDepartments(
  apps: Application[],
  departments: string[]
): Application[] {
  if (departments.length === 0) return apps

  const jobIdsByDept = new Set(
    MOCK_JOBS.filter((job) => departments.includes(job.department)).map(
      (job) => job.id
    )
  )

  return apps.filter((app) => jobIdsByDept.has(app.jobId))
}

/**
 * Filter applications by status
 */
function filterByStatuses(
  apps: Application[],
  statuses: ApplicationStatus[]
): Application[] {
  if (statuses.length === 0) return apps
  return apps.filter((app) => statuses.includes(app.status))
}

/**
 * Apply all filters to applications
 */
function applyFilters(
  apps: Application[],
  filters: ReportFilters
): Application[] {
  let filtered = [...apps]

  // Apply date range
  if (filters.dateRange.startDate && filters.dateRange.endDate) {
    filtered = filterByDateRange(filtered, filters.dateRange)
  }

  // Apply company filter
  filtered = filterByCompanies(filtered, filters.companyIds)

  // Apply department filter
  filtered = filterByDepartments(filtered, filters.departments)

  // Apply status filter
  filtered = filterByStatuses(filtered, filters.statuses)

  return filtered
}

/**
 * Get job details for an application
 */
function getJobForApp(app: Application): Job | undefined {
  return MOCK_JOBS.find((job) => job.id === app.jobId)
}

/**
 * Calculate time to hire in days (mock calculation)
 */
function calculateTimeToHire(app: Application): number {
  // For accepted/offered applications, calculate days from applied to current status
  const appliedDate = parseISO(app.appliedAt)
  const updatedDate = app.updatedAt ? parseISO(app.updatedAt) : new Date()
  return differenceInDays(updatedDate, appliedDate)
}

/**
 * Map status to pipeline stage
 */
function mapStatusToStage(status: ApplicationStatus): string {
  switch (status) {
    case 'submitted':
      return 'Applied'
    case 'under_review':
      return 'Reviewing'
    case 'shortlisted':
      return 'Shortlisted'
    case 'interview_scheduled':
      return 'Interview'
    case 'offered':
      return 'Offered'
    case 'accepted':
      return 'Accepted'
    case 'rejected':
      return 'Rejected'
    case 'withdrawn':
      return 'Withdrawn'
    default:
      return 'Unknown'
  }
}

/**
 * Check if status is "hired" (offered or accepted)
 */
function isHiredStatus(status: ApplicationStatus): boolean {
  return status === 'offered' || status === 'accepted'
}

/**
 * Check if status is active (not rejected/withdrawn)
 */
function isActiveStatus(status: ApplicationStatus): boolean {
  return status !== 'rejected' && status !== 'withdrawn'
}

// =============================================================================
// Filter Options
// =============================================================================

/**
 * Get all available filter options
 */
export async function getMockReportFilterOptions(): Promise<ReportFilterOptions> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const companies = MOCK_COMPANIES.map((c) => ({
    id: c.id,
    name: c.name,
  })).sort((a, b) => a.name.localeCompare(b.name))

  const departments = [
    ...new Set(MOCK_JOBS.map((j) => j.department).filter(Boolean)),
  ].sort()

  const statuses: ApplicationStatus[] = [
    'submitted',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'offered',
    'accepted',
    'rejected',
    'withdrawn',
  ]

  return { companies, departments, statuses }
}

// =============================================================================
// Hiring Overview Report
// =============================================================================

export async function getMockHiringOverviewReport(
  filters: ReportFilters
): Promise<HiringOverviewData> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const filtered = applyFilters(MOCK_APPLICATIONS, filters)

  // Calculate summary metrics
  const totalApplications = filtered.length
  const totalHired = filtered.filter((a) => isHiredStatus(a.status)).length
  const totalRejected = filtered.filter((a) => a.status === 'rejected').length
  const totalPending = filtered.filter(
    (a) => isActiveStatus(a.status) && !isHiredStatus(a.status)
  ).length
  const hireRate =
    totalApplications > 0
      ? Math.round((totalHired / totalApplications) * 100)
      : 0

  // Calculate avg time to hire for hired applications
  const hiredApps = filtered.filter((a) => isHiredStatus(a.status))
  const avgTimeToHire =
    hiredApps.length > 0
      ? Math.round(
          hiredApps.reduce((sum, a) => sum + calculateTimeToHire(a), 0) /
            hiredApps.length
        )
      : 0

  const openPositions = MOCK_JOBS.filter((j) => j.status === 'open').length
  const positionsFilled = MOCK_JOBS.filter((j) => j.status === 'filled').length

  // Generate trend data (monthly)
  const trendMonths = 6
  const trends = generateTrendData(trendMonths, filtered)

  // Calculate status distribution
  const statusCounts: Record<string, number> = {}
  filtered.forEach((app) => {
    const stage = mapStatusToStage(app.status)
    statusCounts[stage] = (statusCounts[stage] || 0) + 1
  })

  const statusDistribution: StatusDistribution[] = Object.entries(statusCounts)
    .map(([status, count]) => ({
      status,
      count,
      percentage:
        totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Generate table data (by job)
  const jobStats: Record<string, HiringOverviewTableRow> = {}
  filtered.forEach((app) => {
    const job = getJobForApp(app)
    if (!job) return

    if (!jobStats[job.id]) {
      jobStats[job.id] = {
        id: job.id,
        jobTitle: job.title,
        companyName: job.companyName,
        department: job.department,
        applications: 0,
        shortlisted: 0,
        interviewed: 0,
        offered: 0,
        hired: 0,
        avgTimeToHire: 0,
        status: job.status as 'open' | 'closed' | 'filled',
      }
    }

    jobStats[job.id].applications++
    if (app.status === 'shortlisted') jobStats[job.id].shortlisted++
    if (app.status === 'interview_scheduled') jobStats[job.id].interviewed++
    if (app.status === 'offered') jobStats[job.id].offered++
    if (isHiredStatus(app.status)) jobStats[job.id].hired++
  })

  // Calculate avg time to hire per job
  Object.keys(jobStats).forEach((jobId) => {
    const hiredForJob = filtered.filter(
      (a) => a.jobId === jobId && isHiredStatus(a.status)
    )
    if (hiredForJob.length > 0) {
      jobStats[jobId].avgTimeToHire = Math.round(
        hiredForJob.reduce((sum, a) => sum + calculateTimeToHire(a), 0) /
          hiredForJob.length
      )
    }
  })

  const tableData = Object.values(jobStats).sort(
    (a, b) => b.applications - a.applications
  )

  return {
    summary: {
      totalApplications,
      totalHired,
      totalRejected,
      totalPending,
      hireRate,
      avgTimeToHire,
      totalOpenPositions: openPositions,
      positionsFilled,
    },
    trends,
    statusDistribution,
    tableData,
  }
}

/**
 * Generate trend data for N months
 */
function generateTrendData(
  months: number,
  apps: Application[]
): { dates: string[]; applications: number[]; hired: number[]; rejected: number[] } {
  const dates: string[] = []
  const applications: number[] = []
  const hired: number[] = []
  const rejected: number[] = []

  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = subMonths(now, i + 1)
    const monthEnd = subMonths(now, i)
    const monthLabel = format(monthEnd, 'MMM yyyy')
    dates.push(monthLabel)

    // Count apps for this month
    const monthApps = apps.filter((app) => {
      const appDate = parseISO(app.appliedAt)
      return isAfter(appDate, monthStart) && isBefore(appDate, monthEnd)
    })

    applications.push(monthApps.length)
    hired.push(monthApps.filter((a) => isHiredStatus(a.status)).length)
    rejected.push(monthApps.filter((a) => a.status === 'rejected').length)
  }

  return { dates, applications, hired, rejected }
}

// =============================================================================
// Company Comparison Report
// =============================================================================

export async function getMockCompanyComparisonReport(
  filters: ReportFilters
): Promise<CompanyComparisonData> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const filtered = applyFilters(MOCK_APPLICATIONS, filters)

  // Get companies to compare (if specific companies selected, use those; otherwise all)
  const companyIdsToCompare =
    filters.companyIds.length > 0
      ? filters.companyIds
      : MOCK_COMPANIES.map((c) => c.id)

  const companies: CompanyMetrics[] = companyIdsToCompare.map((companyId) => {
    const company = MOCK_COMPANIES.find((c) => c.id === companyId)
    if (!company) {
      return {
        companyId,
        companyName: 'Unknown',
        industry: 'Unknown',
        totalApplications: 0,
        totalHired: 0,
        hireRate: 0,
        avgTimeToHire: 0,
        openPositions: 0,
        positionsFilled: 0,
        trend: 0,
      }
    }

    const companyJobs = MOCK_JOBS.filter((j) => j.companyId === companyId)
    const jobIds = new Set(companyJobs.map((j) => j.id))
    const companyApps = filtered.filter((a) => jobIds.has(a.jobId))

    const totalApplications = companyApps.length
    const hiredApps = companyApps.filter((a) => isHiredStatus(a.status))
    const totalHired = hiredApps.length
    const hireRate =
      totalApplications > 0
        ? Math.round((totalHired / totalApplications) * 100)
        : 0

    const avgTimeToHire =
      hiredApps.length > 0
        ? Math.round(
            hiredApps.reduce((sum, a) => sum + calculateTimeToHire(a), 0) /
              hiredApps.length
          )
        : 0

    const openPositions = companyJobs.filter((j) => j.status === 'open').length
    const positionsFilled = companyJobs.filter((j) => j.status === 'filled').length

    return {
      companyId,
      companyName: company.name,
      industry: company.industry,
      totalApplications,
      totalHired,
      hireRate,
      avgTimeToHire,
      openPositions,
      positionsFilled,
      trend: Math.round((Math.random() - 0.3) * 30), // Mock trend
    }
  })

  // Sort by total applications
  companies.sort((a, b) => b.totalApplications - a.totalApplications)

  // Chart data
  const chartData = companies.slice(0, 10).map((c) => ({
    companyName: c.companyName,
    applications: c.totalApplications,
    hired: c.totalHired,
    rejected: Math.round(c.totalApplications * 0.15),
    openPositions: c.openPositions,
  }))

  // Trend data (monthly comparison by company)
  const trendData = generateCompanyTrendData(
    6,
    companies.slice(0, 5).map((c) => c.companyName)
  )

  return {
    companies,
    chartData,
    trendData,
    tableData: companies,
  }
}

function generateCompanyTrendData(
  months: number,
  companyNames: string[]
): Array<{ date: string; [key: string]: number | string }> {
  const data: Array<{ date: string; [key: string]: number | string }> = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const monthEnd = subMonths(now, i)
    const entry: { date: string; [key: string]: number | string } = {
      date: format(monthEnd, 'MMM yyyy'),
    }

    companyNames.forEach((name) => {
      entry[name] = Math.floor(20 + Math.random() * 50)
    })

    data.push(entry)
  }

  return data
}

// =============================================================================
// Department Analysis Report
// =============================================================================

export async function getMockDepartmentAnalysisReport(
  filters: ReportFilters
): Promise<DepartmentAnalysisData> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const filtered = applyFilters(MOCK_APPLICATIONS, filters)

  // Get all unique departments
  const allDepartments = [...new Set(MOCK_JOBS.map((j) => j.department))].filter(
    Boolean
  )

  const departmentMetrics: DepartmentMetrics[] = allDepartments.map((dept) => {
    const deptJobs = MOCK_JOBS.filter((j) => j.department === dept)
    const jobIds = new Set(deptJobs.map((j) => j.id))
    const deptApps = filtered.filter((a) => jobIds.has(a.jobId))

    const totalApplications = deptApps.length
    const shortlisted = deptApps.filter((a) => a.status === 'shortlisted').length
    const interviewed = deptApps.filter(
      (a) => a.status === 'interview_scheduled'
    ).length
    const offered = deptApps.filter((a) => a.status === 'offered').length
    const hired = deptApps.filter((a) => isHiredStatus(a.status)).length
    const rejected = deptApps.filter((a) => a.status === 'rejected').length
    const hireRate =
      totalApplications > 0
        ? Math.round((hired / totalApplications) * 100)
        : 0

    const hiredApps = deptApps.filter((a) => isHiredStatus(a.status))
    const avgTimeToHire =
      hiredApps.length > 0
        ? Math.round(
            hiredApps.reduce((sum, a) => sum + calculateTimeToHire(a), 0) /
              hiredApps.length
          )
        : 0

    // Find top companies for this department
    const companyApps: Record<string, number> = {}
    deptApps.forEach((app) => {
      const job = getJobForApp(app)
      if (job) {
        companyApps[job.companyName] = (companyApps[job.companyName] || 0) + 1
      }
    })
    const topCompanies = Object.entries(companyApps)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name)

    return {
      department: dept,
      totalApplications,
      shortlisted,
      interviewed,
      offered,
      hired,
      rejected,
      hireRate,
      avgTimeToHire,
      topCompanies,
    }
  })

  // Sort by applications
  departmentMetrics.sort((a, b) => b.totalApplications - a.totalApplications)

  // Calculate summary
  const totalDepartments = departmentMetrics.length
  const mostActive = departmentMetrics[0] || {
    department: 'N/A',
    totalApplications: 0,
  }
  const highestHireRate = [...departmentMetrics].sort(
    (a, b) => b.hireRate - a.hireRate
  )[0] || { department: 'N/A', hireRate: 0 }
  const avgApplicationsPerDept =
    totalDepartments > 0
      ? Math.round(
          departmentMetrics.reduce((sum, d) => sum + d.totalApplications, 0) /
            totalDepartments
        )
      : 0

  // Distribution chart data
  const totalApps = departmentMetrics.reduce(
    (sum, d) => sum + d.totalApplications,
    0
  )
  const distributionChart = departmentMetrics.slice(0, 10).map((d) => ({
    department: d.department,
    applications: d.totalApplications,
    percentage:
      totalApps > 0
        ? Math.round((d.totalApplications / totalApps) * 100)
        : 0,
  }))

  // Comparison chart data
  const comparisonChart = departmentMetrics.slice(0, 8).map((d) => ({
    department: d.department,
    Applications: d.totalApplications,
    Hired: d.hired,
    Rejected: d.rejected,
  }))

  return {
    summary: {
      totalDepartments,
      mostActiveDepartment: mostActive.department,
      mostActiveCount: mostActive.totalApplications,
      highestHireRateDept: highestHireRate.department,
      highestHireRate: highestHireRate.hireRate,
      avgApplicationsPerDept,
    },
    departments: departmentMetrics,
    distributionChart,
    comparisonChart,
    tableData: departmentMetrics,
  }
}

// =============================================================================
// Time-to-Hire Report
// =============================================================================

export async function getMockTimeToHireReport(
  filters: ReportFilters
): Promise<TimeToHireData> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const filtered = applyFilters(MOCK_APPLICATIONS, filters)

  // Only consider hired applications
  const hiredApps = filtered.filter((a) => isHiredStatus(a.status))
  const timesToHire = hiredApps.map((a) => calculateTimeToHire(a))

  // Calculate summary statistics
  const sorted = [...timesToHire].sort((a, b) => a - b)
  const overallAvg =
    timesToHire.length > 0
      ? Math.round(timesToHire.reduce((a, b) => a + b, 0) / timesToHire.length)
      : 0
  const fastest = sorted[0] || 0
  const slowest = sorted[sorted.length - 1] || 0
  const median = sorted[Math.floor(sorted.length / 2)] || 0
  const percentile90 = sorted[Math.floor(sorted.length * 0.9)] || 0

  // By company
  const companyData: Record<string, number[]> = {}
  hiredApps.forEach((app) => {
    const job = getJobForApp(app)
    if (job) {
      if (!companyData[job.companyName]) companyData[job.companyName] = []
      companyData[job.companyName].push(calculateTimeToHire(app))
    }
  })

  const byCompany: TimeToHireByEntity[] = Object.entries(companyData)
    .map(([name, times]) => ({
      name,
      avgDays: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      minDays: Math.min(...times),
      maxDays: Math.max(...times),
      totalHires: times.length,
    }))
    .sort((a, b) => a.avgDays - b.avgDays)

  // By department
  const deptData: Record<string, number[]> = {}
  hiredApps.forEach((app) => {
    const job = getJobForApp(app)
    if (job) {
      if (!deptData[job.department]) deptData[job.department] = []
      deptData[job.department].push(calculateTimeToHire(app))
    }
  })

  const byDepartment: TimeToHireByEntity[] = Object.entries(deptData)
    .map(([name, times]) => ({
      name,
      avgDays: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      minDays: Math.min(...times),
      maxDays: Math.max(...times),
      totalHires: times.length,
    }))
    .sort((a, b) => a.avgDays - b.avgDays)

  // By experience level
  const expData: Record<string, number[]> = {}
  hiredApps.forEach((app) => {
    const level = app.userExperienceLevel
    if (!expData[level]) expData[level] = []
    expData[level].push(calculateTimeToHire(app))
  })

  const byExperienceLevel = Object.entries(expData).map(([level, times]) => ({
    level: level as Application['userExperienceLevel'],
    avgDays: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    totalHires: times.length,
  }))

  // Distribution (time ranges)
  const ranges = [
    { range: '0-7 days', min: 0, max: 7 },
    { range: '8-14 days', min: 8, max: 14 },
    { range: '15-30 days', min: 15, max: 30 },
    { range: '31-60 days', min: 31, max: 60 },
    { range: '60+ days', min: 61, max: Infinity },
  ]

  const distribution = ranges.map(({ range, min, max }) => {
    const count = timesToHire.filter((t) => t >= min && t <= max).length
    return {
      range,
      count,
      percentage:
        timesToHire.length > 0
          ? Math.round((count / timesToHire.length) * 100)
          : 0,
    }
  })

  // Trends (monthly average)
  const trends = generateTimeToHireTrends(6)

  // Table data
  const tableData = hiredApps.slice(0, 50).map((app) => {
    const job = getJobForApp(app)
    return {
      id: app.id,
      applicantName: app.userName,
      jobTitle: app.jobTitle,
      companyName: job?.companyName || 'Unknown',
      department: job?.department || 'Unknown',
      experienceLevel: app.userExperienceLevel,
      daysToHire: calculateTimeToHire(app),
      hiredDate: app.updatedAt || app.appliedAt,
    }
  })

  return {
    summary: { overallAvg, fastest, slowest, median, percentile90 },
    byCompany,
    byDepartment,
    byExperienceLevel,
    distribution,
    trends,
    tableData,
  }
}

function generateTimeToHireTrends(
  months: number
): Array<{ date: string; avgTimeToHire: number }> {
  const trends: Array<{ date: string; avgTimeToHire: number }> = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const monthEnd = subMonths(now, i)
    trends.push({
      date: format(monthEnd, 'MMM yyyy'),
      avgTimeToHire: Math.round(20 + Math.random() * 20),
    })
  }

  return trends
}

// =============================================================================
// Pipeline Analysis Report
// =============================================================================

export async function getMockPipelineAnalysisReport(
  filters: ReportFilters
): Promise<PipelineAnalysisData> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const filtered = applyFilters(MOCK_APPLICATIONS, filters)

  // Only consider active pipeline (not rejected/withdrawn)
  const activeApps = filtered.filter((a) => isActiveStatus(a.status))

  // Count by stage
  const stageCounts: Record<string, number> = {
    Applied: 0,
    Reviewing: 0,
    Shortlisted: 0,
    Interview: 0,
    Offered: 0,
    Accepted: 0,
  }

  activeApps.forEach((app) => {
    const stage = mapStatusToStage(app.status)
    if (stageCounts[stage] !== undefined) {
      stageCounts[stage]++
    }
  })

  const totalInPipeline = Object.values(stageCounts).reduce((a, b) => a + b, 0)

  // Calculate stages with conversion rates
  const stageOrder = [
    'Applied',
    'Reviewing',
    'Shortlisted',
    'Interview',
    'Offered',
    'Accepted',
  ]
  const stages: PipelineStage[] = stageOrder.map((stage, index) => {
    const count = stageCounts[stage]
    const nextStage = stageOrder[index + 1]
    const nextCount = nextStage ? stageCounts[nextStage] : 0
    const cumulative = stageOrder
      .slice(index)
      .reduce((sum, s) => sum + stageCounts[s], 0)

    return {
      stage,
      count,
      percentage:
        totalInPipeline > 0 ? Math.round((count / totalInPipeline) * 100) : 0,
      avgDaysInStage: Math.round(3 + Math.random() * 7),
      conversionToNext:
        cumulative > 0
          ? Math.round(
              ((cumulative - count) / Math.max(cumulative, 1)) * 100
            )
          : 0,
    }
  })

  // Funnel data
  const funnel = {
    applied: stageCounts.Applied + stageCounts.Reviewing,
    reviewing:
      stageCounts.Reviewing +
      stageCounts.Shortlisted +
      stageCounts.Interview +
      stageCounts.Offered +
      stageCounts.Accepted,
    shortlisted:
      stageCounts.Shortlisted +
      stageCounts.Interview +
      stageCounts.Offered +
      stageCounts.Accepted,
    interview:
      stageCounts.Interview + stageCounts.Offered + stageCounts.Accepted,
    offered: stageCounts.Offered + stageCounts.Accepted,
    accepted: stageCounts.Accepted,
    conversionRates: {
      appliedToReviewing: 65,
      reviewingToShortlisted: 45,
      shortlistedToInterview: 60,
      interviewToOffered: 40,
      offeredToAccepted: 85,
    },
  }

  // Find bottleneck (stage with lowest conversion)
  const conversionRates = Object.entries(funnel.conversionRates)
  const bottleneck = conversionRates.sort((a, b) => a[1] - b[1])[0]
  const bottleneckStage = bottleneck
    ? bottleneck[0]
        .replace('To', ' → ')
        .replace(/([A-Z])/g, ' $1')
        .trim()
    : 'N/A'

  // Summary
  const overallConversionRate =
    totalInPipeline > 0
      ? Math.round((stageCounts.Accepted / totalInPipeline) * 100)
      : 0
  const avgDaysInPipeline = Math.round(
    stages.reduce((sum, s) => sum + s.avgDaysInStage, 0)
  )

  // By company
  const companyPipeline: Record<string, Record<string, number>> = {}
  activeApps.forEach((app) => {
    const job = getJobForApp(app)
    if (job) {
      if (!companyPipeline[job.companyName]) {
        companyPipeline[job.companyName] = {}
      }
      const stage = mapStatusToStage(app.status)
      companyPipeline[job.companyName][stage] =
        (companyPipeline[job.companyName][stage] || 0) + 1
    }
  })

  const byCompany = Object.entries(companyPipeline)
    .map(([companyName, stages]) => {
      const inPipeline = Object.values(stages).reduce((a, b) => a + b, 0)
      const accepted = stages.Accepted || 0
      return {
        companyName,
        inPipeline,
        conversionRate:
          inPipeline > 0 ? Math.round((accepted / inPipeline) * 100) : 0,
        stages,
      }
    })
    .sort((a, b) => b.inPipeline - a.inPipeline)

  // Conversion chart
  const conversionChart = [
    { transition: 'Applied → Reviewing', rate: funnel.conversionRates.appliedToReviewing },
    { transition: 'Reviewing → Shortlisted', rate: funnel.conversionRates.reviewingToShortlisted },
    { transition: 'Shortlisted → Interview', rate: funnel.conversionRates.shortlistedToInterview },
    { transition: 'Interview → Offered', rate: funnel.conversionRates.interviewToOffered },
    { transition: 'Offered → Accepted', rate: funnel.conversionRates.offeredToAccepted },
  ]

  // Time in stage chart
  const timeInStageChart = stages.map((s) => ({
    stage: s.stage,
    avgDays: s.avgDaysInStage,
  }))

  // Table data
  const tableData: PipelineTableRow[] = activeApps.slice(0, 50).map((app) => {
    const job = getJobForApp(app)
    const daysInStage = Math.round(Math.random() * 14)
    const totalDays = calculateTimeToHire(app)

    return {
      id: app.id,
      applicantName: app.userName,
      jobTitle: app.jobTitle,
      companyName: job?.companyName || 'Unknown',
      currentStage: mapStatusToStage(app.status),
      daysInStage,
      totalDaysInPipeline: totalDays,
      appliedDate: app.appliedAt,
      lastActivity: app.updatedAt || app.appliedAt,
    }
  })

  return {
    summary: {
      totalInPipeline,
      overallConversionRate,
      bottleneckStage,
      avgDaysInPipeline,
    },
    stages,
    funnel,
    byCompany,
    conversionChart,
    timeInStageChart,
    tableData,
  }
}
