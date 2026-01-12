'use client'

import { useState, useCallback } from 'react'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'
import {
  ReportTypeSelector,
  ReportFiltersSidebar,
  ReportExportMenu,
  DrillDownModal,
  HiringOverview,
  CompanyComparison,
  DepartmentAnalysis,
  TimeToHire,
  PipelineAnalysis,
} from '@/components/chro/reports'
import type {
  ReportType,
  ReportFilters as ReportFiltersType,
  DrillDownContext,
  ExportFormat,
} from '@/types/chro-reports'
import { DEFAULT_REPORT_FILTERS, REPORT_TYPES } from '@/types/chro-reports'
import {
  useHiringOverviewReport,
  useCompanyComparisonReport,
  useDepartmentAnalysisReport,
  useTimeToHireReport,
  usePipelineAnalysisReport,
} from '@/lib/hooks/use-chro-reports'
import { exportReport, getExportColumns } from '@/lib/utils/export-helpers'

export default function ReportsPage() {
  // State
  const [reportType, setReportType] = useState<ReportType>('hiring-overview')
  const [filters, setFilters] = useState<ReportFiltersType>(DEFAULT_REPORT_FILTERS)
  const [drillDownContext, setDrillDownContext] = useState<DrillDownContext | null>(null)
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false)

  // Fetch data for each report type
  const hiringOverview = useHiringOverviewReport(filters)
  const companyComparison = useCompanyComparisonReport(filters)
  const departmentAnalysis = useDepartmentAnalysisReport(filters)
  const timeToHire = useTimeToHireReport(filters)
  const pipelineAnalysis = usePipelineAnalysisReport(filters)

  // Get current report data based on selected type
  const getCurrentReportState = () => {
    switch (reportType) {
      case 'hiring-overview':
        return hiringOverview
      case 'company-comparison':
        return companyComparison
      case 'department-analysis':
        return departmentAnalysis
      case 'time-to-hire':
        return timeToHire
      case 'pipeline-analysis':
        return pipelineAnalysis
      default:
        return hiringOverview
    }
  }

  const currentReport = getCurrentReportState()

  // Handle drill-down
  const handleDrillDown = useCallback((context: { type: string; id: string; name: string }) => {
    setDrillDownContext({
      type: context.type as DrillDownContext['type'],
      id: context.id,
      name: context.name,
    })
    setIsDrillDownOpen(true)
  }, [])

  // Handle apply as filter from drill-down
  const handleApplyAsFilter = useCallback((context: DrillDownContext) => {
    // Apply the drill-down context as a filter
    if (context.type === 'company') {
      setFilters((prev) => ({
        ...prev,
        companyIds: [...prev.companyIds, context.id],
      }))
    } else if (context.type === 'department') {
      setFilters((prev) => ({
        ...prev,
        departments: [...prev.departments, context.id],
      }))
    }
  }, [])

  // Handle export
  const handleExport = useCallback(async (format: ExportFormat) => {
    const data = currentReport.data
    if (!data) return

    // Get table data based on report type
    let tableData: unknown[] = []
    let columns: Array<{ header: string; accessorKey?: string; id?: string }> = []

    switch (reportType) {
      case 'hiring-overview':
        tableData = (data as typeof hiringOverview.data)?.tableData || []
        columns = [
          { header: 'Job Title', accessorKey: 'jobTitle' },
          { header: 'Company', accessorKey: 'companyName' },
          { header: 'Department', accessorKey: 'department' },
          { header: 'Applications', accessorKey: 'applications' },
          { header: 'Hired', accessorKey: 'hired' },
          { header: 'Avg Days', accessorKey: 'avgTimeToHire' },
          { header: 'Status', accessorKey: 'status' },
        ]
        break
      case 'company-comparison':
        tableData = (data as typeof companyComparison.data)?.tableData || []
        columns = [
          { header: 'Company', accessorKey: 'companyName' },
          { header: 'Industry', accessorKey: 'industry' },
          { header: 'Applications', accessorKey: 'totalApplications' },
          { header: 'Hired', accessorKey: 'totalHired' },
          { header: 'Hire Rate', accessorKey: 'hireRate' },
          { header: 'Avg Days', accessorKey: 'avgTimeToHire' },
        ]
        break
      case 'department-analysis':
        tableData = (data as typeof departmentAnalysis.data)?.tableData || []
        columns = [
          { header: 'Department', accessorKey: 'department' },
          { header: 'Applications', accessorKey: 'totalApplications' },
          { header: 'Hired', accessorKey: 'hired' },
          { header: 'Rejected', accessorKey: 'rejected' },
          { header: 'Hire Rate', accessorKey: 'hireRate' },
        ]
        break
      case 'time-to-hire':
        tableData = (data as typeof timeToHire.data)?.tableData || []
        columns = [
          { header: 'Applicant', accessorKey: 'applicantName' },
          { header: 'Job Title', accessorKey: 'jobTitle' },
          { header: 'Company', accessorKey: 'companyName' },
          { header: 'Department', accessorKey: 'department' },
          { header: 'Days to Hire', accessorKey: 'daysToHire' },
          { header: 'Hired Date', accessorKey: 'hiredDate' },
        ]
        break
      case 'pipeline-analysis':
        tableData = (data as typeof pipelineAnalysis.data)?.tableData || []
        columns = [
          { header: 'Applicant', accessorKey: 'applicantName' },
          { header: 'Job Title', accessorKey: 'jobTitle' },
          { header: 'Company', accessorKey: 'companyName' },
          { header: 'Current Stage', accessorKey: 'currentStage' },
          { header: 'Days in Stage', accessorKey: 'daysInStage' },
          { header: 'Applied Date', accessorKey: 'appliedDate' },
        ]
        break
    }

    await exportReport({
      format,
      reportType,
      data: tableData,
      columns,
      filename: `${reportType}-report-${filters.dateRange.startDate}-to-${filters.dateRange.endDate}`,
    })
  }, [currentReport.data, reportType, filters])

  // Handle print
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Get current report title
  const currentReportInfo = REPORT_TYPES.find((r) => r.value === reportType)

  return (
    <div className="-mx-5 -my-8 md:-mx-8 flex min-h-[calc(100vh-64px)]">
      {/* Sidebar Filters */}
      <ReportFiltersSidebar
        filters={filters}
        onChange={setFilters}
        className="hidden lg:block"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-5 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Reports
              </h1>
              <p className="mt-1 text-gray-600">
                Generate detailed analytics and insights for strategic planning
              </p>
            </div>
            <ReportExportMenu
              reportType={reportType}
              onExport={handleExport}
              onPrint={handlePrint}
              disabled={currentReport.isLoading || !currentReport.data}
            />
          </div>

          {/* Report Type Selector */}
          <ReportTypeSelector
            selectedType={reportType}
            onChange={setReportType}
          />

          {/* Current Report Info */}
          {currentReportInfo && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <FileText className="h-4 w-4" />
              <span>
                Viewing: <strong>{currentReportInfo.label}</strong> — {currentReportInfo.description}
              </span>
            </div>
          )}

          {/* Report Content */}
          <div className="print:pt-4">
            {reportType === 'hiring-overview' && (
              <HiringOverview
                data={hiringOverview.data}
                isLoading={hiringOverview.isLoading}
                onDrillDown={handleDrillDown}
              />
            )}

            {reportType === 'company-comparison' && (
              <CompanyComparison
                data={companyComparison.data}
                isLoading={companyComparison.isLoading}
                onDrillDown={handleDrillDown}
              />
            )}

            {reportType === 'department-analysis' && (
              <DepartmentAnalysis
                data={departmentAnalysis.data}
                isLoading={departmentAnalysis.isLoading}
                onDrillDown={handleDrillDown}
              />
            )}

            {reportType === 'time-to-hire' && (
              <TimeToHire
                data={timeToHire.data}
                isLoading={timeToHire.isLoading}
                onDrillDown={handleDrillDown}
              />
            )}

            {reportType === 'pipeline-analysis' && (
              <PipelineAnalysis
                data={pipelineAnalysis.data}
                isLoading={pipelineAnalysis.isLoading}
                onDrillDown={handleDrillDown}
              />
            )}
          </div>
        </div>
      </div>

      {/* Drill-Down Modal */}
      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        context={drillDownContext}
        onApplyAsFilter={handleApplyAsFilter}
      />
    </div>
  )
}
