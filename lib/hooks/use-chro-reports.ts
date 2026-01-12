import { useQuery } from '@tanstack/react-query'
import {
  fetchHiringOverviewReport,
  fetchCompanyComparisonReport,
  fetchDepartmentAnalysisReport,
  fetchTimeToHireReport,
  fetchPipelineAnalysisReport,
  fetchReportFilterOptions,
} from '@/lib/api/chro-reports'
import type {
  ReportFilters,
  HiringOverviewData,
  CompanyComparisonData,
  DepartmentAnalysisData,
  TimeToHireData,
  PipelineAnalysisData,
  ReportFilterOptions,
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
}

// Re-export all types from the types file
export * from '@/types/chro-reports'

/**
 * Hook for fetching Hiring Overview Report
 */
export function useHiringOverviewReport(filters: ReportFilters) {
  return useQuery<HiringOverviewData, Error>({
    queryKey: ['chro-report', 'hiring-overview', filters],
    queryFn: () => fetchHiringOverviewReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(filters.dateRange.startDate && filters.dateRange.endDate),
  })
}

/**
 * Hook for fetching Company Comparison Report
 */
export function useCompanyComparisonReport(filters: ReportFilters) {
  return useQuery<CompanyComparisonData, Error>({
    queryKey: ['chro-report', 'company-comparison', filters],
    queryFn: () => fetchCompanyComparisonReport(filters),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(filters.dateRange.startDate && filters.dateRange.endDate),
  })
}

/**
 * Hook for fetching Department Analysis Report
 */
export function useDepartmentAnalysisReport(filters: ReportFilters) {
  return useQuery<DepartmentAnalysisData, Error>({
    queryKey: ['chro-report', 'department-analysis', filters],
    queryFn: () => fetchDepartmentAnalysisReport(filters),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(filters.dateRange.startDate && filters.dateRange.endDate),
  })
}

/**
 * Hook for fetching Time-to-Hire Report
 */
export function useTimeToHireReport(filters: ReportFilters) {
  return useQuery<TimeToHireData, Error>({
    queryKey: ['chro-report', 'time-to-hire', filters],
    queryFn: () => fetchTimeToHireReport(filters),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(filters.dateRange.startDate && filters.dateRange.endDate),
  })
}

/**
 * Hook for fetching Pipeline Analysis Report
 */
export function usePipelineAnalysisReport(filters: ReportFilters) {
  return useQuery<PipelineAnalysisData, Error>({
    queryKey: ['chro-report', 'pipeline-analysis', filters],
    queryFn: () => fetchPipelineAnalysisReport(filters),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(filters.dateRange.startDate && filters.dateRange.endDate),
  })
}

/**
 * Hook for fetching report filter options (companies, departments, statuses)
 */
export function useReportFilterOptions() {
  return useQuery<ReportFilterOptions, Error>({
    queryKey: ['chro-report', 'filter-options'],
    queryFn: fetchReportFilterOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes - these don't change often
  })
}
