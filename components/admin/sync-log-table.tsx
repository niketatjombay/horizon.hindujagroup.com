'use client'

import { format, formatDuration, intervalToDuration } from 'date-fns'
import { Eye, Loader2 } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SyncLog, SyncLogStatus, SyncTrigger } from '@/lib/hooks/use-sync-admin'

interface SyncLogTableProps {
  data: SyncLog[]
  loading?: boolean
  onViewDetail?: (log: SyncLog) => void
  sortColumn?: string | null
  sortDirection?: 'asc' | 'desc' | null
  onSort?: (column: string, direction: 'asc' | 'desc' | null) => void
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

const triggerColors: Record<SyncTrigger, 'default' | 'info'> = {
  auto: 'default',
  manual: 'info',
}

function formatDurationString(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  return formatDuration(duration, {
    format: ['minutes', 'seconds'],
    delimiter: ' ',
  })
}

export function SyncLogTable({
  data,
  loading = false,
  onViewDetail,
  sortColumn,
  sortDirection,
  onSort,
}: SyncLogTableProps) {
  const columns: ColumnDef<SyncLog>[] = [
    {
      id: 'startTime',
      header: 'Timestamp',
      sortable: true,
      accessorFn: (row) => (
        <span className="text-sm font-medium">
          {format(new Date(row.startTime), 'MMM d, yyyy HH:mm:ss')}
        </span>
      ),
    },
    {
      id: 'company',
      header: 'Company',
      sortable: true,
      accessorFn: (row) => (
        <span className="text-sm">{row.companyName}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      width: '120px',
      accessorFn: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant={statusColors[row.status]} size="sm">
            {statusLabels[row.status]}
          </Badge>
          {row.status === 'in_progress' && (
            <Loader2 className="h-3 w-3 animate-spin text-warning" />
          )}
        </div>
      ),
    },
    {
      id: 'triggeredBy',
      header: 'Trigger',
      width: '100px',
      accessorFn: (row) => (
        <Badge variant={triggerColors[row.triggeredBy]} size="sm">
          {row.triggeredBy === 'auto' ? 'Scheduled' : 'Manual'}
        </Badge>
      ),
    },
    {
      id: 'duration',
      header: 'Duration',
      sortable: true,
      width: '120px',
      accessorFn: (row) => (
        <span className="text-sm tabular-nums">
          {row.duration ? formatDurationString(row.duration) : '—'}
        </span>
      ),
    },
    {
      id: 'records',
      header: 'Records',
      width: '180px',
      accessorFn: (row) => (
        <div className="text-sm">
          {row.status === 'success' ? (
            <span className="tabular-nums">
              <span className="text-success">+{row.recordsAdded}</span>
              {' / '}
              <span className="text-info">~{row.recordsUpdated}</span>
              {row.recordsDeleted > 0 && (
                <>
                  {' / '}
                  <span className="text-error">-{row.recordsDeleted}</span>
                </>
              )}
            </span>
          ) : row.status === 'in_progress' ? (
            <span className="text-gray-500">Processing...</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      id: 'message',
      header: 'Message',
      accessorFn: (row) => (
        <span className="text-sm text-gray-600 truncate max-w-[200px] block">
          {row.errors.length > 0 ? row.errors[0].message : 'Completed successfully'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      width: '80px',
      accessorFn: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetail?.(row)
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
      onRowClick={onViewDetail}
      emptyState={{
        title: 'No sync logs found',
        description: 'Sync logs will appear here once synchronization runs',
      }}
    />
  )
}
