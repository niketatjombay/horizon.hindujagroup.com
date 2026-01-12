'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { CompanyWithStats, CompanyStatus } from '@/lib/hooks/use-companies-admin'
import { cn } from '@/lib/utils'

interface CompanyTableProps {
  data: CompanyWithStats[]
  loading?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  onEdit?: (company: CompanyWithStats) => void
  onToggleStatus?: (company: CompanyWithStats) => void
  onDelete?: (company: CompanyWithStats) => void
  sortColumn?: string | null
  sortDirection?: 'asc' | 'desc' | null
  onSort?: (column: string, direction: 'asc' | 'desc' | null) => void
}

const statusColors: Record<CompanyStatus, 'success' | 'error'> = {
  active: 'success',
  inactive: 'error',
}

const industryColors: Record<string, string> = {
  'Automotive': 'bg-blue-100 text-blue-800',
  'Banking & Financial Services': 'bg-green-100 text-green-800',
  'BPO & IT Services': 'bg-purple-100 text-purple-800',
  'Conglomerate': 'bg-gray-100 text-gray-800',
  'Energy & Utilities': 'bg-yellow-100 text-yellow-800',
  'Financial Services': 'bg-emerald-100 text-emerald-800',
  'Healthcare': 'bg-red-100 text-red-800',
  'Information Technology': 'bg-indigo-100 text-indigo-800',
  'Investment': 'bg-cyan-100 text-cyan-800',
  'Manufacturing': 'bg-orange-100 text-orange-800',
  'Media & Entertainment': 'bg-pink-100 text-pink-800',
  'Oil & Gas': 'bg-amber-100 text-amber-800',
  'Real Estate': 'bg-teal-100 text-teal-800',
}

export function CompanyTable({
  data,
  loading = false,
  selectedRows = [],
  onSelectionChange,
  onEdit,
  onToggleStatus,
  onDelete,
  sortColumn,
  sortDirection,
  onSort,
}: CompanyTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<CompanyWithStats | null>(null)

  const handleDeleteClick = (company: CompanyWithStats) => {
    setCompanyToDelete(company)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (companyToDelete && onDelete) {
      onDelete(companyToDelete)
    }
    setDeleteDialogOpen(false)
    setCompanyToDelete(null)
  }

  const columns: ColumnDef<CompanyWithStats>[] = [
    {
      id: 'logo',
      header: '',
      width: '60px',
      accessorFn: (row) => (
        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={row.logo}
            alt={`${row.name} logo`}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Company Name',
      sortable: true,
      accessorFn: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(row)
          }}
          className="font-medium text-primary hover:underline text-left"
        >
          {row.name}
        </button>
      ),
    },
    {
      id: 'industry',
      header: 'Industry',
      sortable: true,
      accessorFn: (row) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            industryColors[row.industry] || 'bg-gray-100 text-gray-800'
          )}
        >
          {row.industry}
        </span>
      ),
    },
    {
      id: 'totalUsers',
      header: 'Users',
      sortable: true,
      width: '100px',
      accessorFn: (row) => (
        <span className="tabular-nums">{row.totalUsers.toLocaleString()}</span>
      ),
    },
    {
      id: 'openJobs',
      header: 'Open Jobs',
      sortable: true,
      width: '100px',
      accessorFn: (row) => (
        <span className="tabular-nums">{row.openJobs.toLocaleString()}</span>
      ),
    },
    {
      id: 'totalApplications',
      header: 'Applications',
      sortable: true,
      width: '100px',
      accessorFn: (row) => (
        <span className="tabular-nums">{row.totalApplications.toLocaleString()}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      width: '100px',
      accessorFn: (row) => (
        <Badge variant={statusColors[row.status]} size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      width: '60px',
      accessorFn: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(row)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus?.(row)
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {row.status === 'active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(row)
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={onSelectionChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
        emptyState={{
          title: 'No companies found',
          description: 'Try adjusting your search or filters',
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{companyToDelete?.name}</strong>?
              This action cannot be undone. All associated data will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
