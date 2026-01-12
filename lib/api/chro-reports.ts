import {
  getMockHiringOverviewReport,
  getMockCompanyComparisonReport,
  getMockDepartmentAnalysisReport,
  getMockTimeToHireReport,
  getMockPipelineAnalysisReport,
  getMockReportFilterOptions,
  getDateRangeFromPreset,
} from '@/mock/services/chro-reports'
import type {
  ReportFilters,
  HiringOverviewData,
  CompanyComparisonData,
  DepartmentAnalysisData,
  TimeToHireData,
  PipelineAnalysisData,
  ReportFilterOptions,
  DateRange,
  DateRangePreset,
} from '@/types/chro-reports'

// Re-export types for convenience
export type {
  ReportFilters,
  HiringOverviewData,
  CompanyComparisonData,
  DepartmentAnalysisData,
  TimeToHireData,
  PipelineAnalysisData,
  ReportFilterOptions,
  DateRange,
  DateRangePreset,
}

// Re-export utility function
export { getDateRangeFromPreset }

/**
 * Fetch Hiring Overview Report
 */
export async function fetchHiringOverviewReport(
  filters: ReportFilters
): Promise<HiringOverviewData> {
  // In production, this would be an API call
  return getMockHiringOverviewReport(filters)
}

/**
 * Fetch Company Comparison Report
 */
export async function fetchCompanyComparisonReport(
  filters: ReportFilters
): Promise<CompanyComparisonData> {
  return getMockCompanyComparisonReport(filters)
}

/**
 * Fetch Department Analysis Report
 */
export async function fetchDepartmentAnalysisReport(
  filters: ReportFilters
): Promise<DepartmentAnalysisData> {
  return getMockDepartmentAnalysisReport(filters)
}

/**
 * Fetch Time-to-Hire Report
 */
export async function fetchTimeToHireReport(
  filters: ReportFilters
): Promise<TimeToHireData> {
  return getMockTimeToHireReport(filters)
}

/**
 * Fetch Pipeline Analysis Report
 */
export async function fetchPipelineAnalysisReport(
  filters: ReportFilters
): Promise<PipelineAnalysisData> {
  return getMockPipelineAnalysisReport(filters)
}

/**
 * Fetch report filter options (companies, departments, statuses)
 */
export async function fetchReportFilterOptions(): Promise<ReportFilterOptions> {
  return getMockReportFilterOptions()
}
