import {
  getCompanies,
  setCompanies,
  getCompanyById as getCompanyFromStore,
  createCompany as createCompanyInStore,
  updateCompany as updateCompanyInStore,
  deleteCompany as deleteCompanyFromStore,
  getUsers,
  getJobs,
  getApplications,
  generateId,
} from '@/lib/stores/data-store'
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
// Helper Functions
// =============================================================================

// Color palette for company logos
const COMPANY_COLORS = [
  '0066FF', // Primary blue
  '7B61FF', // Purple
  '00B87C', // Green
  'FFA733', // Orange
  'E63946', // Red
  '2EC4B6', // Teal
  '9B5DE5', // Violet
  'F15BB5', // Pink
  '00BBF9', // Sky blue
  '8338EC', // Deep purple
]

function getCompanyColor(companyName: string): string {
  let hash = 0
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COMPANY_COLORS.length
  return COMPANY_COLORS[index]
}

function generateLogoUrl(companyName: string): string {
  const encodedName = encodeURIComponent(companyName)
  const bgColor = getCompanyColor(companyName)
  return `https://ui-avatars.com/api/?name=${encodedName}&size=48&background=${bgColor}&color=fff&bold=true`
}

function calculateCompanyStats(companyId: string): {
  totalUsers: number
  openJobs: number
  totalApplications: number
} {
  const users = getUsers()
  const jobs = getJobs()
  const applications = getApplications()

  const totalUsers = users.filter((u) => u.companyId === companyId).length
  const companyJobs = jobs.filter((j) => j.companyId === companyId)
  const openJobs = companyJobs.filter((j) => j.status === 'open').length
  const jobIds = companyJobs.map((j) => j.id)
  const totalApplications = applications.filter((a) =>
    jobIds.includes(a.jobId)
  ).length

  return { totalUsers, openJobs, totalApplications }
}

// Helper to get companies with status (adds status field if missing)
function getCompaniesWithStatus(): (Company & { status: CompanyStatus })[] {
  return getCompanies().map((c) => ({
    ...c,
    status: (c as Company & { status?: CompanyStatus }).status || 'active',
  }))
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

  let filtered = getCompaniesWithStatus()

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

  const company = getCompanyFromStore(companyId)
  if (!company) return null

  return {
    ...company,
    status: (company as Company & { status?: CompanyStatus }).status || 'active',
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

  const companies = getCompanies()
  const maxId = Math.max(...companies.map((c) => parseInt(c.id) || 0), 0)
  const newId = (maxId + 1).toString()
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

  createCompanyInStore(newCompany as Company)

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

  const existing = getCompanyFromStore(companyId)
  if (!existing) return null

  const updates: Partial<Company & { status: CompanyStatus }> = {}

  if (data.name !== undefined) updates.name = data.name
  if (data.description !== undefined) updates.description = data.description
  if (data.industry !== undefined) updates.industry = data.industry
  if (data.headquarters !== undefined) updates.location = data.headquarters
  if (data.logo !== undefined) updates.logo = data.logo
  if (data.status !== undefined) (updates as { status: CompanyStatus }).status = data.status
  if (data.employeeCount !== undefined) {
    updates.size = data.employeeCount > 5000
      ? 'enterprise'
      : data.employeeCount > 1000
        ? 'large'
        : data.employeeCount > 100
          ? 'medium'
          : 'small'
  }

  const updated = updateCompanyInStore(companyId, updates)
  if (!updated) return null

  return {
    ...updated,
    status: (updated as Company & { status?: CompanyStatus }).status || 'active',
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

  const success = deleteCompanyFromStore(companyId)
  return { success }
}

/**
 * Toggle company active/inactive status
 */
export async function toggleMockCompanyStatus(
  companyId: string
): Promise<CompanyWithStats | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const company = getCompanyFromStore(companyId)
  if (!company) return null

  const currentStatus = (company as Company & { status?: CompanyStatus }).status || 'active'
  const newStatus: CompanyStatus = currentStatus === 'active' ? 'inactive' : 'active'

  const updated = updateCompanyInStore(companyId, { status: newStatus } as Partial<Company>)
  if (!updated) return null

  return {
    ...updated,
    status: newStatus,
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

  for (const companyId of companyIds) {
    const result = updateCompanyInStore(companyId, { status } as Partial<Company>)
    if (result) updated++
  }

  return { success: true, updated }
}

/**
 * Get unique industries from companies
 */
export function getCompanyIndustries(): string[] {
  return [...new Set(getCompanies().map((c) => c.industry))].sort()
}

/**
 * Reset companies state (now handled by resetDataStore)
 */
export function resetCompaniesState(): void {
  console.log('[Companies] Use resetDataStore() to reset all data')
}
