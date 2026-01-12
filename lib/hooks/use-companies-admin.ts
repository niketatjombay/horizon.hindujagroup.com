import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCompaniesAdmin,
  fetchCompanyAdmin,
  createCompany,
  updateCompany,
  deleteCompany,
  toggleCompanyStatus,
  bulkUpdateCompanyStatus,
  type CompanyFormData,
  type CompanyWithStats,
  type CompanyFiltersAdmin,
  type CompanyStatus,
} from '@/lib/api/companies-admin'

/**
 * Hook to fetch all companies with stats for admin management
 */
export function useCompaniesAdmin(filters?: CompanyFiltersAdmin) {
  return useQuery({
    queryKey: ['companies-admin', filters],
    queryFn: () => fetchCompaniesAdmin(filters),
  })
}

/**
 * Hook to fetch a single company with stats
 */
export function useCompanyAdmin(companyId: string | null) {
  return useQuery({
    queryKey: ['company-admin', companyId],
    queryFn: () => (companyId ? fetchCompanyAdmin(companyId) : null),
    enabled: !!companyId,
  })
}

/**
 * Hook to create a new company
 */
export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CompanyFormData) => createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-admin'] })
    },
  })
}

/**
 * Hook to update an existing company
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      companyId,
      data,
    }: {
      companyId: string
      data: Partial<CompanyFormData>
    }) => updateCompany(companyId, data),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['companies-admin'] })
      queryClient.invalidateQueries({ queryKey: ['company-admin', companyId] })
    },
  })
}

/**
 * Hook to delete a company
 */
export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-admin'] })
    },
  })
}

/**
 * Hook to toggle company status (active/inactive)
 */
export function useToggleCompanyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (companyId: string) => toggleCompanyStatus(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['companies-admin'] })
      queryClient.invalidateQueries({ queryKey: ['company-admin', companyId] })
    },
  })
}

/**
 * Hook to bulk update company status
 */
export function useBulkCompanyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      companyIds,
      status,
    }: {
      companyIds: string[]
      status: CompanyStatus
    }) => bulkUpdateCompanyStatus(companyIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-admin'] })
    },
  })
}

// Re-export types for convenience
export type {
  CompanyFormData,
  CompanyWithStats,
  CompanyFiltersAdmin,
  CompanyStatus,
}
