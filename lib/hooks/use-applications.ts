import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApplicationSubmission, ApplicationStatus } from '@/types'
import type { ExtendedApplicationFilters } from '@/mock'
import {
  fetchApplications,
  fetchApplicationsPaginated,
  fetchApplicationById,
  submitApplication,
  withdrawApplication,
  updateApplicationStatus,
  bulkUpdateApplicationStatus,
  fetchApplicantDetail,
  fetchAdjacentApplicationIds,
} from '@/lib/api/applications'

/**
 * Fetch user's applications with optional filters
 */
export function useApplications(filters?: ExtendedApplicationFilters) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
  })
}

/**
 * Fetch single application by ID
 */
export function useApplication(applicationId: string | undefined) {
  return useQuery({
    queryKey: ['applications', applicationId],
    queryFn: () => fetchApplicationById(applicationId!),
    // Only run query if applicationId is provided
    enabled: !!applicationId,
  })
}

/**
 * Submit job application mutation
 */
export function useSubmitApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ApplicationSubmission) => submitApplication(data),
    onSuccess: () => {
      // Invalidate applications list to refetch
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      // Also invalidate jobs (applicantsCount may have updated)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

/**
 * Withdraw application mutation
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

/**
 * Fetch applications with pagination (for HR/Admin views)
 */
export function useApplicationsPaginated(filters?: ExtendedApplicationFilters) {
  return useQuery({
    queryKey: ['applications', 'paginated', filters],
    queryFn: () => fetchApplicationsPaginated(filters),
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Update application status mutation (HR/Admin)
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
      notes,
    }: {
      applicationId: string
      status: ApplicationStatus
      notes?: string
    }) => updateApplicationStatus(applicationId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/**
 * Bulk update application status mutation (HR/Admin)
 */
export function useBulkUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationIds,
      status,
    }: {
      applicationIds: string[]
      status: ApplicationStatus
    }) => bulkUpdateApplicationStatus(applicationIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/**
 * Fetch enhanced applicant detail by application ID
 */
export function useApplicantDetail(applicationId: string | undefined) {
  return useQuery({
    queryKey: ['applications', 'detail', applicationId],
    queryFn: () => fetchApplicantDetail(applicationId!),
    enabled: !!applicationId,
  })
}

/**
 * Fetch adjacent application IDs for navigation
 */
export function useAdjacentApplicationIds(
  currentId: string | undefined,
  filters?: ExtendedApplicationFilters
) {
  return useQuery({
    queryKey: ['applications', 'adjacent', currentId, filters],
    queryFn: () => fetchAdjacentApplicationIds(currentId!, filters),
    enabled: !!currentId,
  })
}
