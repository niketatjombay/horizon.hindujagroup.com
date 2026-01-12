'use client'

import { useState, useMemo, useCallback, ReactNode } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  Search,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingSkeleton } from './loading-skeleton'
import { EmptyState } from './empty-state'

export type SortDirection = 'asc' | 'desc' | null

export interface ColumnDef<T> {
  id: string
  header: string | ReactNode
  accessorKey?: keyof T
  accessorFn?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
  className?: string
  // For mobile card view
  hideOnMobile?: boolean
  mobileLabel?: string
}

export interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[]
  data: T[]
  loading?: boolean
  selectable?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  sortColumn?: string | null
  sortDirection?: SortDirection
  onSort?: (column: string, direction: SortDirection) => void
  onRowClick?: (row: T) => void
  emptyState?: {
    title: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  // For mobile card rendering
  mobileCardRenderer?: (row: T, isSelected: boolean) => ReactNode
  className?: string
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyState,
  mobileCardRenderer,
  className,
}: DataTableProps<T>) {
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return

    if (selectedRows.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map((row) => row.id))
    }
  }, [data, selectedRows.length, onSelectionChange])

  const handleSelectRow = useCallback(
    (rowId: string) => {
      if (!onSelectionChange) return

      if (selectedRows.includes(rowId)) {
        onSelectionChange(selectedRows.filter((id) => id !== rowId))
      } else {
        onSelectionChange([...selectedRows, rowId])
      }
    },
    [selectedRows, onSelectionChange]
  )

  const handleSort = useCallback(
    (columnId: string) => {
      if (!onSort) return

      let newDirection: SortDirection = 'asc'
      if (sortColumn === columnId) {
        if (sortDirection === 'asc') {
          newDirection = 'desc'
        } else if (sortDirection === 'desc') {
          newDirection = null
        }
      }
      onSort(columnId, newDirection)
    },
    [sortColumn, sortDirection, onSort]
  )

  const getCellValue = (row: T, column: ColumnDef<T>): ReactNode => {
    if (column.accessorFn) {
      return column.accessorFn(row)
    }
    if (column.accessorKey) {
      return row[column.accessorKey] as ReactNode
    }
    return null
  }

  const getSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-primary" />
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-primary" />
    }
    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
  }

  const isAllSelected = data.length > 0 && selectedRows.length === data.length
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < data.length

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Desktop skeleton */}
        <div className="hidden md:block">
          <LoadingSkeleton type="table" count={5} />
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (data.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={emptyState?.title || 'No data found'}
        description={emptyState?.description}
        actionLabel={emptyState?.action?.label}
        onAction={emptyState?.action?.onClick}
      />
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    {isSomeSelected ? (
                      <button
                        onClick={handleSelectAll}
                        className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-primary bg-primary text-primary-foreground shadow-xs"
                        aria-label="Select all rows"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    ) : (
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    )}
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-semibold text-gray-700',
                      column.width && `w-[${column.width}]`,
                      column.className
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.sortable && onSort ? (
                      <button
                        onClick={() => handleSort(column.id)}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        {column.header}
                        {getSortIcon(column.id)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isSelected = selectedRows.includes(row.id)
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-b border-gray-100 last:border-0',
                      'transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-gray-50',
                      isSelected && 'bg-primary-50'
                    )}
                  >
                    {selectable && (
                      <td
                        className="w-12 px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectRow(row.id)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'px-4 py-4 text-sm text-gray-900',
                          column.className
                        )}
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row) => {
          const isSelected = selectedRows.includes(row.id)

          // Custom mobile card renderer
          if (mobileCardRenderer) {
            return (
              <div key={row.id} className="relative">
                {selectable && (
                  <div className="absolute top-4 right-4 z-10">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelectRow(row.id)}
                      aria-label={`Select row ${row.id}`}
                    />
                  </div>
                )}
                <div
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {mobileCardRenderer(row, isSelected)}
                </div>
              </div>
            )
          }

          // Default mobile card
          return (
            <Card
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'p-4 transition-colors',
                onRowClick && 'cursor-pointer hover:shadow-md',
                isSelected && 'ring-2 ring-primary bg-primary-50'
              )}
            >
              {selectable && (
                <div
                  className="flex justify-end mb-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectRow(row.id)}
                    aria-label={`Select row ${row.id}`}
                  />
                </div>
              )}
              <div className="space-y-2">
                {columns
                  .filter((col) => !col.hideOnMobile)
                  .map((column) => (
                    <div key={column.id} className="flex justify-between gap-2">
                      <span className="text-sm text-gray-600">
                        {column.mobileLabel || column.header}:
                      </span>
                      <span className="text-sm font-medium text-gray-900 text-right">
                        {getCellValue(row, column)}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
