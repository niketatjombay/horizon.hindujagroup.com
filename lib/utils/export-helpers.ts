/**
 * Export helpers for generating PDF, Excel, and CSV files from report data
 */

import type { ColumnDef } from '@/components/shared/data-table'
import type { ExportFormat, ReportType } from '@/types/chro-reports'

// =============================================================================
// CSV Generation
// =============================================================================

/**
 * Escape a value for CSV format
 */
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // If the value contains commas, quotes, or newlines, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape any existing quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Generate CSV content from data and column definitions
 */
export function generateCSV<T>(
  data: T[],
  columns: Array<{ header: string; accessorKey?: string; id?: string }>
): string {
  if (data.length === 0) {
    return ''
  }

  // Build header row
  const headers = columns.map((col) => escapeCSVValue(col.header))

  // Build data rows
  const rows = data.map((row) => {
    return columns.map((col) => {
      const key = col.accessorKey || col.id || ''
      const value = (row as Record<string, unknown>)[key]
      return escapeCSVValue(value)
    })
  })

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  return csvContent
}

/**
 * Download a CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// =============================================================================
// Excel Export (CSV with .xlsx extension for MVP)
// =============================================================================

/**
 * Export data to Excel format (uses CSV format with .xlsx extension for MVP)
 * In production, consider using libraries like xlsx or exceljs
 */
export function exportToExcel<T>(
  data: T[],
  columns: Array<{ header: string; accessorKey?: string; id?: string }>,
  filename: string
): void {
  const csvContent = generateCSV(data, columns)

  // For MVP, we use CSV with xlsx extension
  // Most spreadsheet programs will open this correctly
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// =============================================================================
// PDF Export (using window.print())
// =============================================================================

/**
 * Export to PDF using browser's print functionality
 */
export function exportToPDF(): void {
  // Add print-specific class to body for styling
  document.body.classList.add('printing')

  // Trigger print dialog
  window.print()

  // Remove print class after print dialog closes
  setTimeout(() => {
    document.body.classList.remove('printing')
  }, 100)
}

// =============================================================================
// Combined Export Function
// =============================================================================

export interface ExportConfig<T> {
  format: ExportFormat
  reportType: ReportType
  data: T[]
  columns: Array<{ header: string; accessorKey?: string; id?: string }>
  filename?: string
}

/**
 * Export report data in the specified format
 */
export async function exportReport<T>(
  config: ExportConfig<T>
): Promise<void> {
  const { format, reportType, data, columns, filename } = config

  const baseFilename = filename || `${reportType}-report-${new Date().toISOString().split('T')[0]}`

  switch (format) {
    case 'csv':
      const csvContent = generateCSV(data, columns)
      downloadCSV(csvContent, baseFilename)
      break

    case 'excel':
      exportToExcel(data, columns, baseFilename)
      break

    case 'pdf':
      exportToPDF()
      break

    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

// =============================================================================
// Column Definition Helpers
// =============================================================================

/**
 * Convert DataTable column definitions to simple export columns
 */
export function getExportColumns<T>(
  columns: ColumnDef<T>[]
): Array<{ header: string; accessorKey?: string; id?: string }> {
  return columns
    .filter((col) => col.accessorKey || col.id) // Only include columns with data access
    .map((col) => ({
      header: col.header as string,
      accessorKey: col.accessorKey as string | undefined,
      id: col.id,
    }))
}

// =============================================================================
// Date Formatting Helpers for Export
// =============================================================================

/**
 * Format a date for export (YYYY-MM-DD format)
 */
export function formatDateForExport(date: Date | string): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) {
    return typeof date === 'string' ? date : ''
  }

  return d.toISOString().split('T')[0]
}

/**
 * Format a date range for filename
 */
export function formatDateRangeForFilename(startDate: string, endDate: string): string {
  return `${startDate.replace(/-/g, '')}-${endDate.replace(/-/g, '')}`
}
