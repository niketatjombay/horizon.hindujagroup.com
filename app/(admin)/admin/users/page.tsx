'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Plus,
  Search,
  Download,
  CheckCircle,
  XCircle,
  UserCog,
  Key,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { UserTable } from '@/components/admin/user-table'
import { UserFormModal } from '@/components/admin/user-form-modal'
import { BulkActionsBar } from '@/components/admin/bulk-actions-bar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useUsersAdmin,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetUserPassword,
  useBulkUpdateRole,
  useBulkUpdateStatus,
  useBulkResetPasswords,
  type UserWithCompany,
  type UserFormData,
  type UserFiltersAdmin,
  type UserStatus,
} from '@/lib/hooks/use-users-admin'
import type { UserRole } from '@/types'
import { USER_ROLES, getCompaniesForDropdown } from '@/mock/services/users-admin'
import { useDebounce } from '@/lib/hooks/use-debounce'

export default function UsersPage() {
  const { toast } = useToast()

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Selection state
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithCompany | null>(null)

  const companies = getCompaniesForDropdown()

  // Build filters object
  const filters: UserFiltersAdmin = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      role: roleFilter !== 'all' ? [roleFilter as UserRole] : undefined,
      companyId: companyFilter !== 'all' ? [companyFilter] : undefined,
      status: statusFilter !== 'all' ? [statusFilter as UserStatus] : undefined,
    }),
    [debouncedSearch, roleFilter, companyFilter, statusFilter]
  )

  // Query
  const { data: users = [], isLoading } = useUsersAdmin(filters)

  // Mutations
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const resetPasswordMutation = useResetUserPassword()
  const bulkRoleMutation = useBulkUpdateRole()
  const bulkStatusMutation = useBulkUpdateStatus()
  const bulkResetPasswordsMutation = useBulkResetPasswords()

  // Sort data client-side
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return users

    return [...users].sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortColumn) {
        case 'user':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase()
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'role':
          aVal = a.role
          bVal = b.role
          break
        case 'company':
          aVal = (a.companyName || '').toLowerCase()
          bVal = (b.companyName || '').toLowerCase()
          break
        case 'department':
          aVal = (a.department || '').toLowerCase()
          bVal = (b.department || '').toLowerCase()
          break
        case 'lastLogin':
          aVal = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0
          bVal = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [users, sortColumn, sortDirection])

  const handleSort = useCallback(
    (column: string, direction: 'asc' | 'desc' | null) => {
      setSortColumn(direction ? column : null)
      setSortDirection(direction)
    },
    []
  )

  const handleOpenAddModal = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (user: UserWithCompany) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await updateMutation.mutateAsync({
          userId: editingUser.id,
          data,
        })
        toast({
          title: 'User Updated',
          description: `${data.firstName} ${data.lastName} has been updated successfully.`,
        })
      } else {
        await createMutation.mutateAsync(data)
        toast({
          title: 'User Created',
          description: `${data.firstName} ${data.lastName} has been added successfully.`,
        })
      }
      handleCloseModal()
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleResetPassword = async (user: UserWithCompany) => {
    try {
      const result = await resetPasswordMutation.mutateAsync(user.id)
      toast({
        title: 'Password Reset',
        description: result.message,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (user: UserWithCompany) => {
    try {
      await deleteMutation.mutateAsync(user.id)
      setSelectedRows((prev) => prev.filter((id) => id !== user.id))
      toast({
        title: 'User Deleted',
        description: `${user.firstName} ${user.lastName} has been removed.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkActivate = async () => {
    try {
      const result = await bulkStatusMutation.mutateAsync({
        userIds: selectedRows,
        status: 'active',
      })
      toast({
        title: 'Users Activated',
        description: `${result.updated} users have been activated.`,
      })
      setSelectedRows([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate users. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkDeactivate = async () => {
    try {
      const result = await bulkStatusMutation.mutateAsync({
        userIds: selectedRows,
        status: 'inactive',
      })
      toast({
        title: 'Users Deactivated',
        description: `${result.updated} users have been deactivated.`,
      })
      setSelectedRows([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to deactivate users. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkChangeRole = async (newRole: UserRole) => {
    try {
      const result = await bulkRoleMutation.mutateAsync({
        userIds: selectedRows,
        newRole,
      })
      toast({
        title: 'Roles Updated',
        description: `${result.updated} users have been updated to ${newRole}.`,
      })
      setSelectedRows([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update roles. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkResetPasswords = async () => {
    try {
      const result = await bulkResetPasswordsMutation.mutateAsync(selectedRows)
      toast({
        title: 'Password Reset',
        description: `Password reset emails sent to ${result.sent} users.`,
      })
      setSelectedRows([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset passwords. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleExport = () => {
    // Mock export functionality
    const data = sortedData.map((u) => ({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      company: u.companyName,
      department: u.department,
      status: u.status,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `users-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: 'Export Complete',
      description: 'Users data has been exported.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Users Management
          </h1>
          <p className="mt-1 text-gray-600">
            Manage {users.length} users across all companies
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {USER_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="secondary" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedRows.length}
        onClear={() => setSelectedRows([])}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              <UserCog className="mr-1 h-4 w-4" />
              Change Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {USER_ROLES.map((role) => (
              <DropdownMenuItem
                key={role.value}
                onClick={() => handleBulkChangeRole(role.value)}
              >
                {role.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkActivate}
          disabled={bulkStatusMutation.isPending}
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Activate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkDeactivate}
          disabled={bulkStatusMutation.isPending}
        >
          <XCircle className="mr-1 h-4 w-4" />
          Deactivate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkResetPasswords}
          disabled={bulkResetPasswordsMutation.isPending}
        >
          <Key className="mr-1 h-4 w-4" />
          Reset Passwords
        </Button>
      </BulkActionsBar>

      {/* User Table */}
      <UserTable
        data={sortedData}
        loading={isLoading}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={handleOpenEditModal}
        onResetPassword={handleResetPassword}
        onDelete={handleDelete}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* User Form Modal */}
      <UserFormModal
        user={editingUser}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
