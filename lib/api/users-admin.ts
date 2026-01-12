import {
  getMockUsersFiltered,
  getMockUserAdmin,
  createMockUserAdmin,
  updateMockUserAdmin,
  deleteMockUserAdmin,
  resetMockUserPassword,
  bulkUpdateMockUserRole,
  bulkUpdateMockUserStatus,
  bulkResetMockUserPasswords,
  getMockUserCountsByRole,
  getCompaniesForDropdown,
  type UserFormData,
  type UserFiltersAdmin,
  type UserWithCompany,
  type UserStatus,
} from '@/mock/services/users-admin'
import type { UserRole } from '@/types'

/**
 * Fetch all users with filters for admin management
 */
export async function fetchUsersAdmin(
  filters?: UserFiltersAdmin
): Promise<UserWithCompany[]> {
  return getMockUsersFiltered(filters)
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserAdmin(userId: string): Promise<UserWithCompany | null> {
  return getMockUserAdmin(userId)
}

/**
 * Create a new user
 */
export async function createUser(data: UserFormData): Promise<UserWithCompany> {
  return createMockUserAdmin(data)
}

/**
 * Update an existing user
 */
export async function updateUser(
  userId: string,
  data: Partial<UserFormData>
): Promise<UserWithCompany | null> {
  return updateMockUserAdmin(userId, data)
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  return deleteMockUserAdmin(userId)
}

/**
 * Reset a user's password
 */
export async function resetUserPassword(
  userId: string
): Promise<{ success: boolean; message: string }> {
  return resetMockUserPassword(userId)
}

/**
 * Bulk update user roles
 */
export async function bulkUpdateUserRole(
  userIds: string[],
  newRole: UserRole
): Promise<{ success: boolean; updated: number }> {
  return bulkUpdateMockUserRole(userIds, newRole)
}

/**
 * Bulk update user status
 */
export async function bulkUpdateUserStatus(
  userIds: string[],
  status: UserStatus
): Promise<{ success: boolean; updated: number }> {
  return bulkUpdateMockUserStatus(userIds, status)
}

/**
 * Bulk reset user passwords
 */
export async function bulkResetPasswords(
  userIds: string[]
): Promise<{ success: boolean; sent: number }> {
  return bulkResetMockUserPasswords(userIds)
}

/**
 * Get user counts by role
 */
export async function getUserCountsByRole(): Promise<Record<UserRole, number>> {
  return getMockUserCountsByRole()
}

/**
 * Get companies list for dropdown
 */
export function getCompaniesDropdown(): { id: string; name: string }[] {
  return getCompaniesForDropdown()
}

// Re-export types for convenience
export type {
  UserFormData,
  UserFiltersAdmin,
  UserWithCompany,
  UserStatus,
}
