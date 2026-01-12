import type { User, PaginatedResponse } from '@/types'
import type { UserFilters } from '@/mock'
import { getMockCurrentUser, getMockUsers, getMockUserById } from '@/mock'

/**
 * Fetch current authenticated user
 */
export async function fetchCurrentUser(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getMockCurrentUser()
}

/**
 * Fetch users with filters (for HR view)
 */
export async function fetchUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getMockUsers(filters)
}

/**
 * Fetch user by ID
 */
export async function fetchUserById(id: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const user = getMockUserById(id)

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
