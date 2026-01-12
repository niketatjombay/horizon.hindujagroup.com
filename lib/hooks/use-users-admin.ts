import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchUsersAdmin,
  fetchUserAdmin,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  bulkUpdateUserRole,
  bulkUpdateUserStatus,
  bulkResetPasswords,
  getUserCountsByRole,
  type UserFormData,
  type UserFiltersAdmin,
  type UserWithCompany,
  type UserStatus,
} from '@/lib/api/users-admin'
import type { UserRole } from '@/types'

/**
 * Hook to fetch all users with filters for admin management
 */
export function useUsersAdmin(filters?: UserFiltersAdmin) {
  return useQuery({
    queryKey: ['users-admin', filters],
    queryFn: () => fetchUsersAdmin(filters),
  })
}

/**
 * Hook to fetch a single user by ID
 */
export function useUserAdmin(userId: string | null) {
  return useQuery({
    queryKey: ['user-admin', userId],
    queryFn: () => (userId ? fetchUserAdmin(userId) : null),
    enabled: !!userId,
  })
}

/**
 * Hook to get user counts by role
 */
export function useUserCountsByRole() {
  return useQuery({
    queryKey: ['user-counts-by-role'],
    queryFn: () => getUserCountsByRole(),
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] })
      queryClient.invalidateQueries({ queryKey: ['user-counts-by-role'] })
    },
  })
}

/**
 * Hook to update an existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: Partial<UserFormData>
    }) => updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] })
      queryClient.invalidateQueries({ queryKey: ['user-admin', userId] })
      queryClient.invalidateQueries({ queryKey: ['user-counts-by-role'] })
    },
  })
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] })
      queryClient.invalidateQueries({ queryKey: ['user-counts-by-role'] })
    },
  })
}

/**
 * Hook to reset a user's password
 */
export function useResetUserPassword() {
  return useMutation({
    mutationFn: (userId: string) => resetUserPassword(userId),
  })
}

/**
 * Hook to bulk update user roles
 */
export function useBulkUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userIds,
      newRole,
    }: {
      userIds: string[]
      newRole: UserRole
    }) => bulkUpdateUserRole(userIds, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] })
      queryClient.invalidateQueries({ queryKey: ['user-counts-by-role'] })
    },
  })
}

/**
 * Hook to bulk update user status
 */
export function useBulkUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userIds,
      status,
    }: {
      userIds: string[]
      status: UserStatus
    }) => bulkUpdateUserStatus(userIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] })
    },
  })
}

/**
 * Hook to bulk reset user passwords
 */
export function useBulkResetPasswords() {
  return useMutation({
    mutationFn: (userIds: string[]) => bulkResetPasswords(userIds),
  })
}

// Re-export types for convenience
export type {
  UserFormData,
  UserFiltersAdmin,
  UserWithCompany,
  UserStatus,
}
