'use client'

import { format, formatDuration, intervalToDuration } from 'date-fns'
import {
  Clock,
  Building2,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SyncLogDetail, SyncLogStatus } from '@/lib/hooks/use-sync-admin'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'

interface SyncLogDetailModalProps {
  log: SyncLogDetail | null
  open: boolean
  onClose: () => void
  isLoading?: boolean
}

const statusColors: Record<SyncLogStatus, 'success' | 'error' | 'warning'> = {
  success: 'success',
  failed: 'error',
  in_progress: 'warning',
}

const statusLabels: Record<SyncLogStatus, string> = {
  success: 'Success',
  failed: 'Failed',
  in_progress: 'In Progress',
}

const statusIcons: Record<SyncLogStatus, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-success" />,
  failed: <XCircle className="h-5 w-5 text-destructive" />,
  in_progress: <Loader2 className="h-5 w-5 text-warning animate-spin" />,
}

function formatDurationString(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    delimiter: ' ',
  })
}

export function SyncLogDetailModal({
  log,
  open,
  onClose,
  isLoading = false,
}: SyncLogDetailModalProps) {
  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-gray-400" />
            Sync Log Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <LoadingSkeleton type="card" />
            <LoadingSkeleton type="table" count={3} />
          </div>
        ) : log ? (
          <div className="space-y-6 py-4">
            {/* Status Header */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                {statusIcons[log.status]}
                <div>
                  <Badge variant={statusColors[log.status]} size="md">
                    {statusLabels[log.status]}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">
                  {log.duration ? formatDurationString(log.duration) : '—'}
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Building2 className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{log.companyName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Started</p>
                  <p className="font-medium">
                    {format(new Date(log.startTime), 'PPpp')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <Database className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Strategy</p>
                  <p className="font-medium capitalize">{log.strategy}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Triggered By</p>
                  <p className="font-medium capitalize">
                    {log.triggeredBy === 'auto' ? 'Scheduled' : 'Manual'}
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Data Sources
              </h3>
              <div className="flex flex-wrap gap-2">
                {log.dataSources.map((source) => (
                  <Badge key={source} variant="default" size="sm">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Statistics */}
            {log.status === 'success' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-2xl font-bold text-success">
                      {log.recordsAdded}
                    </p>
                    <p className="text-sm text-success/80">Records Added</p>
                  </div>
                  <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                    <p className="text-2xl font-bold text-info">
                      {log.recordsUpdated}
                    </p>
                    <p className="text-sm text-info/80">Records Updated</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                    <p className="text-2xl font-bold text-gray-600">
                      {log.recordsDeleted}
                    </p>
                    <p className="text-sm text-gray-500">Records Deleted</p>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {log.errors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Errors ({log.errors.length})
                </h3>
                <div className="space-y-2">
                  {log.errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="error" size="sm">
                          {error.code}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(error.timestamp), 'HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm text-destructive">{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {log.conflicts && log.conflicts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Data Conflicts ({log.conflicts.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3">Field</th>
                        <th className="text-left py-2 px-3">Existing Value</th>
                        <th className="text-left py-2 px-3">New Value</th>
                        <th className="text-left py-2 px-3">Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {log.conflicts.map((conflict, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-2 px-3 font-medium">
                            {conflict.field}
                          </td>
                          <td className="py-2 px-3 text-gray-600">
                            {conflict.existingValue}
                          </td>
                          <td className="py-2 px-3">{conflict.newValue}</td>
                          <td className="py-2 px-3">
                            <Badge
                              variant={
                                conflict.resolution === 'used_new'
                                  ? 'success'
                                  : conflict.resolution === 'kept_existing'
                                    ? 'default'
                                    : 'warning'
                              }
                              size="sm"
                            >
                              {conflict.resolution === 'used_new'
                                ? 'Used New'
                                : conflict.resolution === 'kept_existing'
                                  ? 'Kept Existing'
                                  : 'Manual'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
