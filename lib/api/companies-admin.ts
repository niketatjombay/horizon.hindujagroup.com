import {
  getMockCompaniesWithStats,
  getMockCompanyWithStats,
  createMockCompany,
  updateMockCompany,
  deleteMockCompany,
  toggleMockCompanyStatus,
  bulkUpdateMockCompanyStatus,
  getCompanyIndustries,
  type CompanyFormData,
  type CompanyWithStats,
  type CompanyFiltersAdmin,
  type CompanyStatus,
} from '@/mock/services/companies-admin'

/**
 * Fetch all companies with stats for admin management
 */
export async function fetchCompaniesAdmin(
  filters?: CompanyFiltersAdmin
): Promise<CompanyWithStats[]> {
  return getMockCompaniesWithStats(filters)
}

/**
 * Fetch a single company with stats
 */
export async function fetchCompanyAdmin(
  companyId: string
): Promise<CompanyWithStats | null> {
  return getMockCompanyWithStats(companyId)
}

/**
 * Create a new company
 */
export async function createCompany(data: CompanyFormData): Promise<CompanyWithStats> {
  return createMockCompany(data)
}

/**
 * Update an existing company
 */
export async function updateCompany(
  companyId: string,
  data: Partial<CompanyFormData>
): Promise<CompanyWithStats | null> {
  return updateMockCompany(companyId, data)
}

/**
 * Delete a company
 */
export async function deleteCompany(
  companyId: string
): Promise<{ success: boolean }> {
  return deleteMockCompany(companyId)
}

/**
 * Toggle company status (active/inactive)
 */
export async function toggleCompanyStatus(
  companyId: string
): Promise<CompanyWithStats | null> {
  return toggleMockCompanyStatus(companyId)
}

/**
 * Bulk update company status
 */
export async function bulkUpdateCompanyStatus(
  companyIds: string[],
  status: CompanyStatus
): Promise<{ success: boolean; updated: number }> {
  return bulkUpdateMockCompanyStatus(companyIds, status)
}

/**
 * Get available industries
 */
export function getIndustries(): string[] {
  return getCompanyIndustries()
}

// Re-export types for convenience
export type {
  CompanyFormData,
  CompanyWithStats,
  CompanyFiltersAdmin,
  CompanyStatus,
}
