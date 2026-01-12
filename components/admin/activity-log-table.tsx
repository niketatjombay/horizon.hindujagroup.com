'use client'

import { useState, useMemo } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { Download, Filter, Search } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ActivityLogEntry, ActivityAction } from '@/lib/hooks/use-admin'

interface ActivityLogTableProps {
  data: ActivityLogEntry[]
  maxHeight?: number
  onViewDetail: (activity: ActivityLogEntry) => void
  isLoading?: boolean
}

const actionColors: Record<ActivityAction, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  login: 'success',
  logout: 'default',
  create: 'success',
  update: 'info',
  delete: 'error',
  apply: 'info',
  status_change: 'warning',
}

const actionLabels: Record<ActivityAction, string> = {
  login: 'Login',
  logout: 'Logout',
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  apply: 'Apply',
  status_change: 'Status Change',
}

const roleColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  admin: 'error',
  chro: 'warning',
  hr: 'info',
  employee: 'default',
}

export function ActivityLogTable({
  data,
  maxHeight = 400,
  onViewDetail,
  isLoading = false,
}: ActivityLogTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')

  const filteredData = useMemo(() => {
    return data.filter((activity) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        activity.user.name.toLowerCase().includes(searchLower) ||
        activity.user.email.toLowerCase().includes(searchLower) ||
        activity.resource.toLowerCase().includes(searchLower) ||
        activity.details.toLowerCase().includes(searchLower)

      // Action filter
      const matchesAction = actionFilter === 'all' || activity.action === actionFilter

      return matchesSearch && matchesAction
    })
  }, [data, searchQuery, actionFilter])

  const columns: ColumnDef<ActivityLogEntry>[] = [
    {
      id: 'timestamp',
      header: 'Time',
      accessorFn: (row) => (
        <span className="text-gray-600 text-xs">
          {formatDistanceToNow(new Date(row.timestamp), { addSuffix: true })}
        </span>
      ),
      sortable: true,
      width: '120px',
    },
    {
      id: 'user',
      header: 'User',
      accessorFn: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{row.user.name}</span>
          <div className="flex items-center gap-1.5">
            <Badge variant={roleColors[row.user.role] || 'default'} size="sm">
              {row.user.role}
            </Badge>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'action',
      header: 'Action',
      accessorFn: (row) => (
        <Badge variant={actionColors[row.action]} size="sm">
          {actionLabels[row.action]}
        </Badge>
      ),
      width: '100px',
    },
    {
      id: 'resource',
      header: 'Resource',
      accessorFn: (row) => (
        <span className="font-medium">{row.resource}</span>
      ),
      width: '100px',
    },
    {
      id: 'details',
      header: 'Details',
      accessorFn: (row) => (
        <span className="text-gray-600 truncate max-w-[200px] block">
          {row.details}
        </span>
      ),
    },
    {
      id: 'ipAddress',
      header: 'IP Address',
      accessorFn: (row) => (
        <span className="text-gray-500 text-xs font-mono">
          {row.ipAddress}
        </span>
      ),
      width: '120px',
      hideOnMobile: true,
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Activity Log
          </h3>
          <p className="text-sm text-gray-500">
            Recent system activity and user actions
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by user, resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="apply">Apply</SelectItem>
            <SelectItem value="status_change">Status Change</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div style={{ maxHeight }} className="overflow-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          onRowClick={onViewDetail}
          emptyState={{
            title: 'No activity found',
            description: 'Try adjusting your search or filter criteria',
          }}
        />
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredData.length} of {data.length} activities
      </div>
    </Card>
  )
}
