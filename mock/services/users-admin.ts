import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'
import { MOCK_USERS } from '../data/users'
import { MOCK_COMPANIES } from '../data/companies'
import type { User, UserRole } from '@/types'

// =============================================================================
// Types
// =============================================================================

export type UserStatus = 'active' | 'inactive'

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  companyId?: string
  department?: string
  status: UserStatus
  password?: string // Only on create
}

export interface UserFiltersAdmin {
  search?: string
  role?: UserRole[]
  companyId?: string[]
  status?: UserStatus[]
}

export interface UserWithCompany extends User {
  companyName: string
}

// =============================================================================
// Constants
// =============================================================================

export const USER_DEPARTMENTS = [
  'Engineering',
  'Product',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'IT',
  'Legal',
  'Corporate Strategy',
] as const

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR' },
  { value: 'chro', label: 'CHRO' },
  { value: 'admin', label: 'Super Admin' },
]

// =============================================================================
// In-Memory State
// =============================================================================

// Clone the users data to allow modifications
let usersState: User[] = [...MOCK_USERS]

// =============================================================================
// Helper Functions
// =============================================================================

function generateAvatarUrl(firstName: string, lastName: string): string {
  const name = encodeURIComponent(`${firstName} ${lastName}`)
  const bgColor = faker.helpers.arrayElement(['0066FF', '7B61FF', '00B87C', 'FFA733'])
  return `https://ui-avatars.com/api/?name=${name}&size=96&background=${bgColor}&color=fff`
}

function getCompanyName(companyId: string | undefined): string {
  if (!companyId) return 'N/A'
  const company = MOCK_COMPANIES.find((c) => c.id === companyId)
  return company?.name ?? 'Unknown'
}

// =============================================================================
// CRUD Operations
// =============================================================================

/**
 * Get all users with filters for admin management
 */
export async function getMockUsersFiltered(
  filters?: UserFiltersAdmin
): Promise<UserWithCompany[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filtered = [...usersState]

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchLower) ||
        u.lastName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
    )
  }

  // Apply role filter
  if (filters?.role && filters.role.length > 0) {
    filtered = filtered.filter((u) => filters.role!.includes(u.role))
  }

  // Apply company filter
  if (filters?.companyId && filters.companyId.length > 0) {
    filtered = filtered.filter(
      (u) => u.companyId && filters.companyId!.includes(u.companyId)
    )
  }

  // Apply status filter
  if (filters?.status && filters.status.length > 0) {
    filtered = filtered.filter((u) => filters.status!.includes(u.status))
  }

  // Add company name to each user
  return filtered.map((user) => ({
    ...user,
    companyName: getCompanyName(user.companyId),
  }))
}

/**
 * Get a single user by ID
 */
export async function getMockUserAdmin(userId: string): Promise<UserWithCompany | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const user = usersState.find((u) => u.id === userId)
  if (!user) return null

  return {
    ...user,
    companyName: getCompanyName(user.companyId),
  }
}

/**
 * Create a new user
 */
export async function createMockUserAdmin(data: UserFormData): Promise<UserWithCompany> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check for duplicate email
  const existing = usersState.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  )
  if (existing) {
    throw new Error('A user with this email already exists')
  }

  const newId = (Math.max(...usersState.map((u) => parseInt(u.id))) + 1).toString()
  const now = new Date().toISOString()

  const newUser: User = {
    id: newId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    department: data.department || '',
    companyId: data.companyId || '',
    companyName: getCompanyName(data.companyId),
    currentJobTitle: data.role === 'admin' ? 'System Administrator' : '',
    location: '',
    phone: data.phone || '',
    avatarUrl: generateAvatarUrl(data.firstName, data.lastName),
    status: data.status,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  }

  usersState.push(newUser)

  return {
    ...newUser,
    companyName: getCompanyName(newUser.companyId),
  }
}

/**
 * Update an existing user
 */
export async function updateMockUserAdmin(
  userId: string,
  data: Partial<UserFormData>
): Promise<UserWithCompany | null> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = usersState.findIndex((u) => u.id === userId)
  if (index === -1) return null

  const existing = usersState[index]

  // Don't allow email changes (email is readonly on edit)
  const updated: User = {
    ...existing,
    firstName: data.firstName ?? existing.firstName,
    lastName: data.lastName ?? existing.lastName,
    phone: data.phone ?? existing.phone,
    role: data.role ?? existing.role,
    companyId: data.companyId ?? existing.companyId,
    department: data.department ?? existing.department,
    status: data.status ?? existing.status,
    avatarUrl:
      data.firstName || data.lastName
        ? generateAvatarUrl(
            data.firstName ?? existing.firstName,
            data.lastName ?? existing.lastName
          )
        : existing.avatarUrl,
    updatedAt: new Date().toISOString(),
  }

  usersState[index] = updated

  return {
    ...updated,
    companyName: getCompanyName(updated.companyId),
  }
}

/**
 * Delete a user
 */
export async function deleteMockUserAdmin(userId: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = usersState.findIndex((u) => u.id === userId)
  if (index === -1) return { success: false }

  usersState.splice(index, 1)
  return { success: true }
}

/**
 * Reset a user's password (mock)
 */
export async function resetMockUserPassword(
  userId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const user = usersState.find((u) => u.id === userId)
  if (!user) {
    return { success: false, message: 'User not found' }
  }

  // In a real app, this would send an email
  return {
    success: true,
    message: `Password reset email sent to ${user.email}`,
  }
}

/**
 * Bulk update user roles
 */
export async function bulkUpdateMockUserRole(
  userIds: string[],
  newRole: UserRole
): Promise<{ success: boolean; updated: number }> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let updated = 0
  const now = new Date().toISOString()

  for (const userId of userIds) {
    const user = usersState.find((u) => u.id === userId)
    if (user) {
      user.role = newRole
      user.updatedAt = now
      updated++
    }
  }

  return { success: true, updated }
}

/**
 * Bulk update user status
 */
export async function bulkUpdateMockUserStatus(
  userIds: string[],
  status: UserStatus
): Promise<{ success: boolean; updated: number }> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let updated = 0
  const now = new Date().toISOString()

  for (const userId of userIds) {
    const user = usersState.find((u) => u.id === userId)
    if (user) {
      user.status = status
      user.updatedAt = now
      updated++
    }
  }

  return { success: true, updated }
}

/**
 * Bulk reset passwords
 */
export async function bulkResetMockUserPasswords(
  userIds: string[]
): Promise<{ success: boolean; sent: number }> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const validUsers = usersState.filter((u) => userIds.includes(u.id))
  return {
    success: true,
    sent: validUsers.length,
  }
}

/**
 * Get user counts by role
 */
export async function getMockUserCountsByRole(): Promise<Record<UserRole, number>> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    employee: usersState.filter((u) => u.role === 'employee').length,
    hr: usersState.filter((u) => u.role === 'hr').length,
    chro: usersState.filter((u) => u.role === 'chro').length,
    admin: usersState.filter((u) => u.role === 'admin').length,
  }
}

/**
 * Get companies list for dropdown
 */
export function getCompaniesForDropdown(): { id: string; name: string }[] {
  return MOCK_COMPANIES.map((c) => ({ id: c.id, name: c.name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

/**
 * Reset users state (for testing)
 */
export function resetUsersState(): void {
  usersState = [...MOCK_USERS]
}
