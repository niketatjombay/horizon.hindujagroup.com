import type { User, UserRole } from '@/types'
import type { PaginatedResponse, Pagination } from '@/types/api'
import { MOCK_USERS, getCurrentUser as getUser } from '../data/users'

export interface UserFilters {
  search?: string
  role?: UserRole[]
  companyId?: string[]
  department?: string[]
  location?: string[]
  status?: 'active' | 'inactive'
  page?: number
  pageSize?: number
}

/**
 * Get the current authenticated user
 */
export function getMockCurrentUser(): User {
  return getUser()
}

/**
 * Get mock users with filtering and pagination
 */
export function getMockUsers(filters?: UserFilters): PaginatedResponse<User> {
  let filteredUsers = [...MOCK_USERS]

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filteredUsers = filteredUsers.filter(user =>
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.currentJobTitle?.toLowerCase().includes(searchLower)
    )
  }

  // Apply role filter
  if (filters?.role && filters.role.length > 0) {
    filteredUsers = filteredUsers.filter(user =>
      filters.role!.includes(user.role)
    )
  }

  // Apply company filter
  if (filters?.companyId && filters.companyId.length > 0) {
    filteredUsers = filteredUsers.filter(user =>
      filters.companyId!.includes(user.companyId)
    )
  }

  // Apply department filter
  if (filters?.department && filters.department.length > 0) {
    filteredUsers = filteredUsers.filter(user =>
      filters.department!.some(dept =>
        user.department.toLowerCase() === dept.toLowerCase()
      )
    )
  }

  // Apply location filter
  if (filters?.location && filters.location.length > 0) {
    filteredUsers = filteredUsers.filter(user =>
      filters.location!.some(loc =>
        user.location?.toLowerCase() === loc.toLowerCase()
      )
    )
  }

  // Apply status filter
  if (filters?.status) {
    filteredUsers = filteredUsers.filter(user =>
      user.status === filters.status
    )
  }

  // Pagination
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const pagination: Pagination = {
    page,
    pageSize,
    total: filteredUsers.length,
    totalPages: Math.ceil(filteredUsers.length / pageSize),
    hasNextPage: endIndex < filteredUsers.length,
    hasPreviousPage: page > 1,
  }

  return {
    data: paginatedUsers,
    pagination,
  }
}

/**
 * Get user by ID
 */
export function getMockUserById(id: string): User | null {
  return MOCK_USERS.find(user => user.id === id) || null
}

/**
 * Get user by email
 */
export function getMockUserByEmail(email: string): User | null {
  return MOCK_USERS.find(user =>
    user.email.toLowerCase() === email.toLowerCase()
  ) || null
}

/**
 * Get users by role
 */
export function getMockUsersByRole(role: UserRole): User[] {
  return MOCK_USERS.filter(user => user.role === role)
}

/**
 * Get users by company
 */
export function getMockUsersByCompany(companyId: string): User[] {
  return MOCK_USERS.filter(user => user.companyId === companyId)
}

/**
 * Get unique departments
 */
export function getMockDepartments(): string[] {
  const departments = new Set(MOCK_USERS.map(user => user.department))
  return Array.from(departments).sort()
}

/**
 * Get user count
 */
export function getMockUserCount(): number {
  return MOCK_USERS.length
}

/**
 * Get user count by role
 */
export function getMockUserCountByRole(): Record<UserRole, number> {
  return MOCK_USERS.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<UserRole, number>)
}

/**
 * Simulate login - returns user if credentials match
 */
export async function mockLogin(email: string, _password: string): Promise<User | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // For mock purposes, any password works if email exists
  return getMockUserByEmail(email)
}
