'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, FileDown, Printer, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ExportFormat, ReportType } from '@/types/chro-reports'

interface ReportExportMenuProps {
  reportType: ReportType
  onExport: (format: ExportFormat) => Promise<void>
  onPrint: () => void
  disabled?: boolean
}

export function ReportExportMenu({
  reportType,
  onExport,
  onPrint,
  disabled = false,
}: ReportExportMenuProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting(format)
      await onExport(format)
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Print Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrint}
        disabled={disabled}
        className="hidden sm:flex"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>

      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" disabled={disabled}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null}
          >
            <FileText className="h-4 w-4 mr-2 text-red-500" />
            Export as PDF
            {isExporting === 'pdf' && (
              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('excel')}
            disabled={isExporting !== null}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
            Export as Excel
            {isExporting === 'excel' && (
              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExport('csv')}
            disabled={isExporting !== null}
          >
            <FileDown className="h-4 w-4 mr-2 text-blue-500" />
            Export as CSV
            {isExporting === 'csv' && (
              <Loader2 className="h-3 w-3 ml-auto animate-spin" />
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onPrint} className="sm:hidden">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
