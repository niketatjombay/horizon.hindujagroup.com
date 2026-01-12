'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { Filter, X } from 'lucide-react'
import type { DrillDownContext } from '@/types/chro-reports'

interface DataRowWithId {
  id: string
  [key: string]: unknown
}

interface DrillDownModalProps {
  isOpen: boolean
  onClose: () => void
  context: DrillDownContext | null
  data?: DataRowWithId[]
  columns?: ColumnDef<DataRowWithId>[]
  isLoading?: boolean
  onApplyAsFilter?: (context: DrillDownContext) => void
}

export function DrillDownModal({
  isOpen,
  onClose,
  context,
  data = [],
  columns = [],
  isLoading = false,
  onApplyAsFilter,
}: DrillDownModalProps) {
  if (!context) return null

  const getTitle = () => {
    switch (context.type) {
      case 'company':
        return `Company: ${context.name}`
      case 'department':
        return `Department: ${context.name}`
      case 'stage':
        return `Pipeline Stage: ${context.name}`
      case 'job':
        return `Job Details: ${context.name}`
      case 'date':
        return `Date: ${context.name}`
      default:
        return `Details: ${context.name}`
    }
  }

  const getDescription = () => {
    switch (context.type) {
      case 'company':
        return 'View all applications and hiring metrics for this company'
      case 'department':
        return 'View all applications and hiring metrics for this department'
      case 'stage':
        return 'View all applicants currently at this pipeline stage'
      case 'job':
        return 'View job posting details and application statistics'
      case 'date':
        return 'View activity and metrics for this date range'
      default:
        return 'Detailed view of selected data'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0">
          {isLoading ? (
            <LoadingSkeleton type="table" count={5} />
          ) : data.length > 0 && columns.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <DataTable
                columns={columns}
                data={data}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No detailed data available for this selection.</p>
              {context.data && (
                <div className="mt-4 text-left bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Summary
                  </h4>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(context.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </dt>
                        <dd className="font-medium text-gray-900">
                          {String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
          {onApplyAsFilter && (
            <Button
              variant="secondary"
              onClick={() => {
                onApplyAsFilter(context)
                onClose()
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply as Filter
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
