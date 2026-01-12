'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Search, Download, CheckCircle, XCircle } from 'lucide-react'
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
import { CompanyTable } from '@/components/admin/company-table'
import { CompanyFormModal } from '@/components/admin/company-form-modal'
import { BulkActionsBar } from '@/components/admin/bulk-actions-bar'
import {
  useCompaniesAdmin,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
  useToggleCompanyStatus,
  useBulkCompanyStatus,
  type CompanyWithStats,
  type CompanyFormData,
  type CompanyFiltersAdmin,
  type CompanyStatus,
} from '@/lib/hooks/use-companies-admin'
import { COMPANY_INDUSTRIES } from '@/mock/services/companies-admin'
import { useDebounce } from '@/lib/hooks/use-debounce'

export default function CompaniesPage() {
  const { toast } = useToast()

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Selection state
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyWithStats | null>(null)

  // Build filters object
  const filters: CompanyFiltersAdmin = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      industry: industryFilter !== 'all' ? [industryFilter] : undefined,
      status: statusFilter !== 'all' ? [statusFilter as CompanyStatus] : undefined,
    }),
    [debouncedSearch, industryFilter, statusFilter]
  )

  // Query
  const { data: companies = [], isLoading } = useCompaniesAdmin(filters)

  // Mutations
  const createMutation = useCreateCompany()
  const updateMutation = useUpdateCompany()
  const deleteMutation = useDeleteCompany()
  const toggleStatusMutation = useToggleCompanyStatus()
  const bulkStatusMutation = useBulkCompanyStatus()

  // Sort data client-side
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return companies

    return [...companies].sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortColumn) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'industry':
          aVal = a.industry.toLowerCase()
          bVal = b.industry.toLowerCase()
          break
        case 'totalUsers':
          aVal = a.totalUsers
          bVal = b.totalUsers
          break
        case 'openJobs':
          aVal = a.openJobs
          bVal = b.openJobs
          break
        case 'totalApplications':
          aVal = a.totalApplications
          bVal = b.totalApplications
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
  }, [companies, sortColumn, sortDirection])

  const handleSort = useCallback(
    (column: string, direction: 'asc' | 'desc' | null) => {
      setSortColumn(direction ? column : null)
      setSortDirection(direction)
    },
    []
  )

  const handleOpenAddModal = () => {
    setEditingCompany(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (company: CompanyWithStats) => {
    setEditingCompany(company)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCompany(null)
  }

  const handleSubmit = async (data: CompanyFormData) => {
    try {
      if (editingCompany) {
        await updateMutation.mutateAsync({
          companyId: editingCompany.id,
          data,
        })
        toast({
          title: 'Company Updated',
          description: `${data.name} has been updated successfully.`,
        })
      } else {
        await createMutation.mutateAsync(data)
        toast({
          title: 'Company Created',
          description: `${data.name} has been added successfully.`,
        })
      }
      handleCloseModal()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save company. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleStatus = async (company: CompanyWithStats) => {
    try {
      await toggleStatusMutation.mutateAsync(company.id)
      toast({
        title: 'Status Updated',
        description: `${company.name} has been ${company.status === 'active' ? 'deactivated' : 'activated'}.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (company: CompanyWithStats) => {
    try {
      await deleteMutation.mutateAsync(company.id)
      setSelectedRows((prev) => prev.filter((id) => id !== company.id))
      toast({
        title: 'Company Deleted',
        description: `${company.name} has been removed.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete company. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkActivate = async () => {
    try {
      const result = await bulkStatusMutation.mutateAsync({
        companyIds: selectedRows,
        status: 'active',
      })
      toast({
        title: 'Companies Activated',
        description: `${result.updated} companies have been activated.`,
      })
      setSelectedRows([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate companies. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkDeactivate = async () => {
    try {
      const result = await bulkStatusMutation.mutateAsync({
        companyIds: selectedRows,
        status: 'inactive',
      })
      toast({
        title: 'Companies Deactivated',
        description: `${result.updated} companies have been deactivated.`,
      })
      setSelectedRows([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to deactivate companies. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleExport = () => {
    // Mock export functionality
    const data = sortedData.map((c) => ({
      name: c.name,
      industry: c.industry,
      location: c.location,
      users: c.totalUsers,
      jobs: c.openJobs,
      applications: c.totalApplications,
      status: c.status,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `companies-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: 'Export Complete',
      description: 'Companies data has been exported.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Companies Management
          </h1>
          <p className="mt-1 text-gray-600">
            Manage {companies.length} Hinduja Group companies
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {COMPANY_INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
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
      </BulkActionsBar>

      {/* Company Table */}
      <CompanyTable
        data={sortedData}
        loading={isLoading}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Company Form Modal */}
      <CompanyFormModal
        company={editingCompany}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
