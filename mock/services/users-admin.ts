import {
  getUsers,
  setUsers,
  getUserById as getUserFromStore,
  createUser as createUserInStore,
  updateUser as updateUserInStore,
  deleteUser as deleteUserFromStore,
  getCompanies,
  generateId,
} from '@/lib/stores/data-store'
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
// Helper Functions
// =============================================================================

// Color palette for avatars
const AVATAR_COLORS = ['0066FF', '7B61FF', '00B87C', 'FFA733']

function generateAvatarUrl(firstName: string, lastName: string): string {
  const name = encodeURIComponent(`${firstName} ${lastName}`)
  // Use a hash of the name to get consistent color
  let hash = 0
  const fullName = `${firstName}${lastName}`
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length
  const bgColor = AVATAR_COLORS[colorIndex]
  return `https://ui-avatars.com/api/?name=${name}&size=96&background=${bgColor}&color=fff`
}

function getCompanyName(companyId: string | undefined): string {
  if (!companyId) return 'N/A'
  const company = getCompanies().find((c) => c.id === companyId)
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

  let filtered = [...getUsers()]

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

  const user = getUserFromStore(userId)
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
  const users = getUsers()
  const existing = users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  )
  if (existing) {
    throw new Error('A user with this email already exists')
  }

  const maxId = Math.max(...users.map((u) => parseInt(u.id) || 0), 0)
  const newId = (maxId + 1).toString()
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

  createUserInStore(newUser)

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

  const existing = getUserFromStore(userId)
  if (!existing) return null

  const updates: Partial<User> = {}

  if (data.firstName !== undefined) updates.firstName = data.firstName
  if (data.lastName !== undefined) updates.lastName = data.lastName
  if (data.phone !== undefined) updates.phone = data.phone
  if (data.role !== undefined) updates.role = data.role
  if (data.companyId !== undefined) updates.companyId = data.companyId
  if (data.department !== undefined) updates.department = data.department
  if (data.status !== undefined) updates.status = data.status

  // Update avatar if name changed
  if (data.firstName || data.lastName) {
    updates.avatarUrl = generateAvatarUrl(
      data.firstName ?? existing.firstName,
      data.lastName ?? existing.lastName
    )
  }

  const updated = updateUserInStore(userId, updates)
  if (!updated) return null

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

  const success = deleteUserFromStore(userId)
  return { success }
}

/**
 * Reset a user's password (mock)
 */
export async function resetMockUserPassword(
  userId: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const user = getUserFromStore(userId)
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

  for (const userId of userIds) {
    const result = updateUserInStore(userId, { role: newRole })
    if (result) updated++
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

  for (const userId of userIds) {
    const result = updateUserInStore(userId, { status })
    if (result) updated++
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

  const users = getUsers()
  const validUsers = users.filter((u) => userIds.includes(u.id))
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

  const users = getUsers()
  return {
    employee: users.filter((u) => u.role === 'employee').length,
    hr: users.filter((u) => u.role === 'hr').length,
    chro: users.filter((u) => u.role === 'chro').length,
    admin: users.filter((u) => u.role === 'admin').length,
  }
}

/**
 * Get companies list for dropdown
 */
export function getCompaniesForDropdown(): { id: string; name: string }[] {
  return getCompanies().map((c) => ({ id: c.id, name: c.name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

/**
 * Reset users state (now handled by resetDataStore)
 */
export function resetUsersState(): void {
  console.log('[Users] Use resetDataStore() to reset all data')
}
