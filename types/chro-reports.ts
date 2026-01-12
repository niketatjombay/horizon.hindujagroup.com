import type { ApplicationStatus, ExperienceLevel } from './models'

// =============================================================================
// Report Type Enum
// =============================================================================

export type ReportType =
  | 'hiring-overview'
  | 'company-comparison'
  | 'department-analysis'
  | 'time-to-hire'
  | 'pipeline-analysis'

export const REPORT_TYPES: Array<{
  value: ReportType
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'hiring-overview',
    label: 'Hiring Overview',
    description: 'Overall hiring trends and metrics',
    icon: 'TrendingUp',
  },
  {
    value: 'company-comparison',
    label: 'Company Comparison',
    description: 'Compare performance across companies',
    icon: 'GitCompare',
  },
  {
    value: 'department-analysis',
    label: 'Department Analysis',
    description: 'Hiring by department and function',
    icon: 'Users',
  },
  {
    value: 'time-to-hire',
    label: 'Time-to-Hire Analysis',
    description: 'Analyze hiring speed and efficiency',
    icon: 'Clock',
  },
  {
    value: 'pipeline-analysis',
    label: 'Pipeline Analysis',
    description: 'Application funnel and conversion rates',
    icon: 'Filter',
  },
]

// =============================================================================
// Date Range Types
// =============================================================================

export interface DateRange {
  startDate: string // ISO date string
  endDate: string // ISO date string
}

export type DateRangePreset =
  | 'last-7-days'
  | 'last-30-days'
  | 'last-quarter'
  | 'last-6-months'
  | 'last-year'
  | 'custom'

export const DATE_RANGE_PRESETS: Array<{
  value: DateRangePreset
  label: string
}> = [
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'last-quarter', label: 'Last Quarter' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'last-year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
]

// =============================================================================
// Report Filters
// =============================================================================

export interface ReportFilters {
  dateRange: DateRange
  preset: DateRangePreset
  companyIds: string[] // empty = all companies
  departments: string[] // empty = all departments
  statuses: ApplicationStatus[] // empty = all statuses
  comparisonMode: 'period' | 'company' | null
  comparisonDateRange?: DateRange // for period comparison
  comparisonCompanyIds?: string[] // for company comparison (max 2)
}

export const DEFAULT_REPORT_FILTERS: ReportFilters = {
  dateRange: {
    startDate: '', // Will be set dynamically
    endDate: '', // Will be set dynamically
  },
  preset: 'last-30-days',
  companyIds: [],
  departments: [],
  statuses: [],
  comparisonMode: null,
}

// =============================================================================
// Export Types
// =============================================================================

export type ExportFormat = 'pdf' | 'excel' | 'csv'

export interface ExportOptions {
  format: ExportFormat
  reportType: ReportType
  filters: ReportFilters
  includeCharts: boolean
  includeSummary: boolean
  includeTableData: boolean
}

// =============================================================================
// Hiring Overview Report Types
// =============================================================================

export interface HiringOverviewSummary {
  totalApplications: number
  totalHired: number
  totalRejected: number
  totalPending: number
  hireRate: number // percentage
  avgTimeToHire: number // days
  totalOpenPositions: number
  positionsFilled: number
}

export interface HiringOverviewTrends {
  dates: string[]
  applications: number[]
  hired: number[]
  rejected: number[]
}

export interface StatusDistribution {
  status: string
  count: number
  percentage: number
}

export interface HiringOverviewTableRow {
  id: string
  jobTitle: string
  companyName: string
  department: string
  applications: number
  shortlisted: number
  interviewed: number
  offered: number
  hired: number
  avgTimeToHire: number
  status: 'open' | 'closed' | 'filled'
}

export interface HiringOverviewData {
  summary: HiringOverviewSummary
  trends: HiringOverviewTrends
  statusDistribution: StatusDistribution[]
  tableData: HiringOverviewTableRow[]
}

// =============================================================================
// Company Comparison Report Types
// =============================================================================

export interface CompanyMetrics {
  companyId: string
  companyName: string
  industry: string
  totalApplications: number
  totalHired: number
  hireRate: number
  avgTimeToHire: number
  openPositions: number
  positionsFilled: number
  trend: number // percentage change
}

export interface CompanyComparisonChartData {
  companyName: string
  applications: number
  hired: number
  rejected: number
  openPositions: number
}

export interface CompanyTrendData {
  date: string
  [companyName: string]: number | string
}

export interface CompanyComparisonData {
  companies: CompanyMetrics[]
  chartData: CompanyComparisonChartData[]
  trendData: CompanyTrendData[]
  tableData: CompanyMetrics[]
}

// =============================================================================
// Department Analysis Report Types
// =============================================================================

export interface DepartmentSummary {
  totalDepartments: number
  mostActiveDepartment: string
  mostActiveCount: number
  highestHireRateDept: string
  highestHireRate: number
  avgApplicationsPerDept: number
}

export interface DepartmentMetrics {
  department: string
  totalApplications: number
  shortlisted: number
  interviewed: number
  offered: number
  hired: number
  rejected: number
  hireRate: number
  avgTimeToHire: number
  topCompanies: string[]
}

export interface DepartmentChartData {
  department: string
  Applications: number
  Hired: number
  Rejected: number
}

export interface DepartmentAnalysisData {
  summary: DepartmentSummary
  departments: DepartmentMetrics[]
  distributionChart: Array<{ department: string; applications: number; percentage: number }>
  comparisonChart: DepartmentChartData[]
  tableData: DepartmentMetrics[]
}

// =============================================================================
// Time-to-Hire Report Types
// =============================================================================

export interface TimeToHireSummary {
  overallAvg: number // days
  fastest: number // days
  slowest: number // days
  median: number // days
  percentile90: number // days
}

export interface TimeToHireByEntity {
  name: string
  avgDays: number
  minDays: number
  maxDays: number
  totalHires: number
}

export interface TimeToHireDistribution {
  range: string
  count: number
  percentage: number
}

export interface TimeToHireTrend {
  date: string
  avgTimeToHire: number
}

export interface TimeToHireTableRow {
  id: string
  applicantName: string
  jobTitle: string
  companyName: string
  department: string
  experienceLevel: ExperienceLevel
  daysToHire: number
  hiredDate: string
}

export interface TimeToHireData {
  summary: TimeToHireSummary
  byCompany: TimeToHireByEntity[]
  byDepartment: TimeToHireByEntity[]
  byExperienceLevel: Array<{
    level: ExperienceLevel
    avgDays: number
    totalHires: number
  }>
  distribution: TimeToHireDistribution[]
  trends: TimeToHireTrend[]
  tableData: TimeToHireTableRow[]
}

// =============================================================================
// Pipeline Analysis Report Types
// =============================================================================

export interface PipelineSummary {
  totalInPipeline: number
  overallConversionRate: number
  bottleneckStage: string
  avgDaysInPipeline: number
}

export interface PipelineStage {
  stage: string
  count: number
  percentage: number
  avgDaysInStage: number
  conversionToNext: number
}

export interface PipelineFunnel {
  applied: number
  reviewing: number
  shortlisted: number
  interview: number
  offered: number
  accepted: number
  conversionRates: {
    appliedToReviewing: number
    reviewingToShortlisted: number
    shortlistedToInterview: number
    interviewToOffered: number
    offeredToAccepted: number
  }
}

export interface PipelineByCompany {
  companyName: string
  inPipeline: number
  conversionRate: number
  stages: Record<string, number>
}

export interface PipelineTableRow {
  id: string
  applicantName: string
  jobTitle: string
  companyName: string
  currentStage: string
  daysInStage: number
  totalDaysInPipeline: number
  appliedDate: string
  lastActivity: string
}

export interface PipelineAnalysisData {
  summary: PipelineSummary
  stages: PipelineStage[]
  funnel: PipelineFunnel
  byCompany: PipelineByCompany[]
  conversionChart: Array<{ transition: string; rate: number }>
  timeInStageChart: Array<{ stage: string; avgDays: number }>
  tableData: PipelineTableRow[]
}

// =============================================================================
// Drill-Down Context
// =============================================================================

export interface DrillDownContext {
  type: 'company' | 'department' | 'stage' | 'job' | 'date'
  id: string
  name: string
  data?: Record<string, unknown>
}

// =============================================================================
// Filter Options (for dropdowns)
// =============================================================================

export interface ReportFilterOptions {
  companies: Array<{ id: string; name: string }>
  departments: string[]
  statuses: ApplicationStatus[]
}
