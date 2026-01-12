import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ExtendedJobFilters } from '@/mock'
import {
  fetchJobs,
  fetchJobById,
  fetchRecommendedJobs,
  fetchRecentJobs,
  fetchSavedJobs,
  toggleSaveJob,
} from '@/lib/api/jobs'

/**
 * Fetch jobs with filters and pagination
 */
export function useJobs(filters?: ExtendedJobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    // Keep previous data while fetching new (smoother UX)
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Fetch single job by ID
 */
export function useJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => fetchJobById(jobId!),
    // Only run query if jobId is provided
    enabled: !!jobId,
    // Don't refetch if data already exists
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Fetch recommended jobs
 */
export function useRecommendedJobs(limit?: number) {
  return useQuery({
    queryKey: ['jobs', 'recommended', limit],
    queryFn: () => fetchRecommendedJobs(limit),
  })
}

/**
 * Fetch recent jobs
 */
export function useRecentJobs(limit?: number) {
  return useQuery({
    queryKey: ['jobs', 'recent', limit],
    queryFn: () => fetchRecentJobs(limit),
  })
}

/**
 * Fetch saved jobs
 */
export function useSavedJobs() {
  return useQuery({
    queryKey: ['jobs', 'saved'],
    queryFn: fetchSavedJobs,
  })
}

/**
 * Save/unsave job mutation
 */
export function useSaveJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleSaveJob,
    // Optimistic update
    onMutate: async (jobId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['jobs'] })

      // Snapshot previous value
      const previousJobs = queryClient.getQueryData(['jobs'])

      // Optimistically update job
      queryClient.setQueryData(['jobs', jobId], (old: unknown) => {
        if (old && typeof old === 'object' && 'isSaved' in old) {
          return {
            ...old,
            isSaved: !(old as { isSaved: boolean }).isSaved,
          }
        }
        return old
      })

      return { previousJobs }
    },
    // On error, rollback
    onError: (_err, _jobId, context) => {
      queryClient.setQueryData(['jobs'], context?.previousJobs)
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
