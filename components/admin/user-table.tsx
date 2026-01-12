'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Pencil, Key, Trash2 } from 'lucide-react'
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
import type { UserWithCompany, UserStatus } from '@/lib/hooks/use-users-admin'
import type { UserRole } from '@/types'

interface UserTableProps {
  data: UserWithCompany[]
  loading?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  onEdit?: (user: UserWithCompany) => void
  onResetPassword?: (user: UserWithCompany) => void
  onDelete?: (user: UserWithCompany) => void
  sortColumn?: string | null
  sortDirection?: 'asc' | 'desc' | null
  onSort?: (column: string, direction: 'asc' | 'desc' | null) => void
}

const roleColors: Record<UserRole, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  employee: 'default',
  hr: 'info',
  chro: 'warning',
  admin: 'error',
}

const roleLabels: Record<UserRole, string> = {
  employee: 'Employee',
  hr: 'HR',
  chro: 'CHRO',
  admin: 'Super Admin',
}

const statusColors: Record<UserStatus, 'success' | 'error'> = {
  active: 'success',
  inactive: 'error',
}

export function UserTable({
  data,
  loading = false,
  selectedRows = [],
  onSelectionChange,
  onEdit,
  onResetPassword,
  onDelete,
  sortColumn,
  sortDirection,
  onSort,
}: UserTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserWithCompany | null>(null)

  const handleDeleteClick = (user: UserWithCompany) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete && onDelete) {
      onDelete(userToDelete)
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const columns: ColumnDef<UserWithCompany>[] = [
    {
      id: 'user',
      header: 'User',
      sortable: true,
      accessorFn: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {row.avatarUrl ? (
              <Image
                src={row.avatarUrl}
                alt={`${row.firstName} ${row.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm font-medium text-gray-600">
                {row.firstName[0]}
                {row.lastName[0]}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(row)
              }}
              className="font-medium text-gray-900 hover:text-primary hover:underline text-left"
            >
              {row.firstName} {row.lastName}
            </button>
            <p className="text-sm text-gray-600">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      sortable: true,
      width: '120px',
      accessorFn: (row) => (
        <Badge variant={roleColors[row.role]} size="sm">
          {roleLabels[row.role]}
        </Badge>
      ),
    },
    {
      id: 'company',
      header: 'Company',
      sortable: true,
      accessorFn: (row) => (
        <span className="text-sm">{row.companyName || 'N/A'}</span>
      ),
    },
    {
      id: 'department',
      header: 'Department',
      sortable: true,
      accessorFn: (row) => (
        <span className="text-sm">{row.department || 'N/A'}</span>
      ),
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      width: '140px',
      accessorFn: (row) => (
        <span className="text-sm text-gray-600">
          {row.lastLoginAt
            ? formatDistanceToNow(new Date(row.lastLoginAt), { addSuffix: true })
            : 'Never'}
        </span>
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
                onResetPassword?.(row)
              }}
            >
              <Key className="mr-2 h-4 w-4" />
              Reset Password
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
          title: 'No users found',
          description: 'Try adjusting your search or filters',
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>
              ? This action cannot be undone. All user data and applications will be
              permanently removed.
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
