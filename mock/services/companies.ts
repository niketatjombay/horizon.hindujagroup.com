import type { Company } from '@/types'
import type { PaginatedResponse, Pagination } from '@/types/api'
import { MOCK_COMPANIES } from '../data/companies'

export interface CompanyFilters {
  search?: string
  industry?: string[]
  size?: string[]
  location?: string[]
  page?: number
  pageSize?: number
}

/**
 * Get all mock companies with optional filtering
 */
export function getMockCompanies(filters?: CompanyFilters): PaginatedResponse<Company> {
  let filteredCompanies = [...MOCK_COMPANIES]

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filteredCompanies = filteredCompanies.filter(company =>
      company.name.toLowerCase().includes(searchLower) ||
      company.industry.toLowerCase().includes(searchLower) ||
      company.description?.toLowerCase().includes(searchLower)
    )
  }

  // Apply industry filter
  if (filters?.industry && filters.industry.length > 0) {
    filteredCompanies = filteredCompanies.filter(company =>
      filters.industry!.some(ind =>
        company.industry.toLowerCase().includes(ind.toLowerCase())
      )
    )
  }

  // Apply size filter
  if (filters?.size && filters.size.length > 0) {
    filteredCompanies = filteredCompanies.filter(company =>
      filters.size!.includes(company.size)
    )
  }

  // Apply location filter
  if (filters?.location && filters.location.length > 0) {
    filteredCompanies = filteredCompanies.filter(company =>
      filters.location!.some(loc =>
        company.location.toLowerCase().includes(loc.toLowerCase())
      )
    )
  }

  // Pagination
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

  const pagination: Pagination = {
    page,
    pageSize,
    total: filteredCompanies.length,
    totalPages: Math.ceil(filteredCompanies.length / pageSize),
    hasNextPage: endIndex < filteredCompanies.length,
    hasPreviousPage: page > 1,
  }

  return {
    data: paginatedCompanies,
    pagination,
  }
}

/**
 * Get a single company by ID
 */
export function getMockCompanyById(id: string): Company | null {
  return MOCK_COMPANIES.find(company => company.id === id) || null
}

/**
 * Get all companies (no pagination)
 */
export function getAllMockCompanies(): Company[] {
  return MOCK_COMPANIES
}

/**
 * Get company count
 */
export function getMockCompanyCount(): number {
  return MOCK_COMPANIES.length
}
