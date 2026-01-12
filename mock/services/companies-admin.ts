import { MOCK_COMPANIES } from '../data/companies'
import { MOCK_USERS } from '../data/users'
import { MOCK_JOBS } from '../data/jobs'
import { MOCK_APPLICATIONS } from '../data/applications'
import type { Company } from '@/types'

// =============================================================================
// Types
// =============================================================================

export type CompanyStatus = 'active' | 'inactive'

export interface CompanyFormData {
  name: string
  industry: string
  website?: string
  description?: string
  headquarters: string
  employeeCount?: number
  logo?: string
  status: CompanyStatus
}

export interface CompanyWithStats extends Company {
  totalUsers: number
  openJobs: number
  totalApplications: number
  status: CompanyStatus
}

export interface CompanyFiltersAdmin {
  search?: string
  industry?: string[]
  status?: CompanyStatus[]
}

// =============================================================================
// Industries List
// =============================================================================

export const COMPANY_INDUSTRIES = [
  'Automotive',
  'Banking & Financial Services',
  'BPO & IT Services',
  'Conglomerate',
  'Energy & Utilities',
  'Financial Services',
  'Healthcare',
  'Information Technology',
  'Investment',
  'Manufacturing',
  'Media & Entertainment',
  'Oil & Gas',
  'Real Estate',
] as const

// =============================================================================
// In-Memory State
// =============================================================================

// Clone the companies data to allow modifications
let companiesState: (Company & { status: CompanyStatus })[] = MOCK_COMPANIES.map((c) => ({
  ...c,
  status: 'active' as CompanyStatus,
}))

// =============================================================================
// Helper Functions
// =============================================================================

function generateLogoUrl(companyName: string): string {
  const encodedName = encodeURIComponent(companyName)
  return `https://ui-avatars.com/api/?name=${encodedName}&size=48&background=0066FF&color=fff&bold=true`
}

function calculateCompanyStats(companyId: string): {
  totalUsers: number
  openJobs: number
  totalApplications: number
} {
  const totalUsers = MOCK_USERS.filter((u) => u.companyId === companyId).length
  const companyJobs = MOCK_JOBS.filter((j) => j.companyId === companyId)
  const openJobs = companyJobs.filter((j) => j.status === 'open').length
  const jobIds = companyJobs.map((j) => j.id)
  const totalApplications = MOCK_APPLICATIONS.filter((a) =>
    jobIds.includes(a.jobId)
  ).length

  return { totalUsers, openJobs, totalApplications }
}

// =============================================================================
// CRUD Operations
// =============================================================================

/**
 * Get all companies with stats for admin management
 */
export async function getMockCompaniesWithStats(
  filters?: CompanyFiltersAdmin
): Promise<CompanyWithStats[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filtered = [...companiesState]

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.industry.toLowerCase().includes(searchLower)
    )
  }

  // Apply industry filter
  if (filters?.industry && filters.industry.length > 0) {
    filtered = filtered.filter((c) => filters.industry!.includes(c.industry))
  }

  // Apply status filter
  if (filters?.status && filters.status.length > 0) {
    filtered = filtered.filter((c) => filters.status!.includes(c.status))
  }

  // Add stats to each company
  return filtered.map((company) => ({
    ...company,
    ...calculateCompanyStats(company.id),
  }))
}

/**
 * Get a single company by ID with stats
 */
export async function getMockCompanyWithStats(
  companyId: string
): Promise<CompanyWithStats | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const company = companiesState.find((c) => c.id === companyId)
  if (!company) return null

  return {
    ...company,
    ...calculateCompanyStats(companyId),
  }
}

/**
 * Create a new company
 */
export async function createMockCompany(
  data: CompanyFormData
): Promise<CompanyWithStats> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newId = (Math.max(...companiesState.map((c) => parseInt(c.id))) + 1).toString()
  const now = new Date().toISOString()

  const newCompany: Company & { status: CompanyStatus } = {
    id: newId,
    uuid: `comp-${newId.padStart(3, '0')}`,
    name: data.name,
    description: data.description || '',
    logo: data.logo || generateLogoUrl(data.name),
    industry: data.industry,
    size: data.employeeCount
      ? data.employeeCount > 5000
        ? 'enterprise'
        : data.employeeCount > 1000
          ? 'large'
          : data.employeeCount > 100
            ? 'medium'
            : 'small'
      : 'medium',
    location: data.headquarters,
    atsType: 'workday',
    atsEndpoint: `https://${data.name.toLowerCase().replace(/\s+/g, '')}.workday.com/api`,
    lastSyncAt: now,
    syncStatus: 'pending',
    createdAt: now,
    updatedAt: now,
    status: data.status,
  }

  companiesState.push(newCompany)

  return {
    ...newCompany,
    totalUsers: 0,
    openJobs: 0,
    totalApplications: 0,
  }
}

/**
 * Update an existing company
 */
export async function updateMockCompany(
  companyId: string,
  data: Partial<CompanyFormData>
): Promise<CompanyWithStats | null> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = companiesState.findIndex((c) => c.id === companyId)
  if (index === -1) return null

  const existing = companiesState[index]
  const updated: Company & { status: CompanyStatus } = {
    ...existing,
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    industry: data.industry ?? existing.industry,
    location: data.headquarters ?? existing.location,
    logo: data.logo ?? existing.logo,
    status: data.status ?? existing.status,
    size:
      data.employeeCount !== undefined
        ? data.employeeCount > 5000
          ? 'enterprise'
          : data.employeeCount > 1000
            ? 'large'
            : data.employeeCount > 100
              ? 'medium'
              : 'small'
        : existing.size,
    updatedAt: new Date().toISOString(),
  }

  companiesState[index] = updated

  return {
    ...updated,
    ...calculateCompanyStats(companyId),
  }
}

/**
 * Delete a company
 */
export async function deleteMockCompany(
  companyId: string
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = companiesState.findIndex((c) => c.id === companyId)
  if (index === -1) return { success: false }

  companiesState.splice(index, 1)
  return { success: true }
}

/**
 * Toggle company active/inactive status
 */
export async function toggleMockCompanyStatus(
  companyId: string
): Promise<CompanyWithStats | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const company = companiesState.find((c) => c.id === companyId)
  if (!company) return null

  company.status = company.status === 'active' ? 'inactive' : 'active'
  company.updatedAt = new Date().toISOString()

  return {
    ...company,
    ...calculateCompanyStats(companyId),
  }
}

/**
 * Bulk update company status
 */
export async function bulkUpdateMockCompanyStatus(
  companyIds: string[],
  status: CompanyStatus
): Promise<{ success: boolean; updated: number }> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let updated = 0
  const now = new Date().toISOString()

  for (const companyId of companyIds) {
    const company = companiesState.find((c) => c.id === companyId)
    if (company) {
      company.status = status
      company.updatedAt = now
      updated++
    }
  }

  return { success: true, updated }
}

/**
 * Get unique industries from companies
 */
export function getCompanyIndustries(): string[] {
  return [...new Set(companiesState.map((c) => c.industry))].sort()
}

/**
 * Reset companies state (for testing)
 */
export function resetCompaniesState(): void {
  companiesState = MOCK_COMPANIES.map((c) => ({
    ...c,
    status: 'active' as CompanyStatus,
  }))
}
