import type { Job, ApiResponse, PaginatedResponse, JobFilters } from '@/types'
import { getMockJobs, getMockJobById, getMockRecommendedJobs, getMockRecentJobs, getMockSavedJobs } from '@/mock'
import type { ExtendedJobFilters } from '@/mock'

/**
 * Fetch paginated jobs with filters
 */
export async function fetchJobs(filters?: ExtendedJobFilters): Promise<PaginatedResponse<Job>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Use mock service
  return getMockJobs(filters)
}

/**
 * Fetch single job by ID
 */
export async function fetchJobById(id: string): Promise<Job> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const job = getMockJobById(id)

  if (!job) {
    throw new Error('Job not found')
  }

  return job
}

/**
 * Fetch recommended jobs for user
 */
export async function fetchRecommendedJobs(limit?: number): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getMockRecommendedJobs(limit)
}

/**
 * Fetch recently posted jobs
 */
export async function fetchRecentJobs(limit?: number): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getMockRecentJobs(limit)
}

/**
 * Fetch saved jobs for user
 */
export async function fetchSavedJobs(): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getMockSavedJobs()
}

/**
 * Toggle save job (bookmark)
 */
export async function toggleSaveJob(jobId: string): Promise<ApiResponse<{ saved: boolean }>> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock implementation - in real app, this would call API
  return {
    data: { saved: true },
    success: true,
    message: 'Job saved successfully',
    timestamp: new Date().toISOString(),
  }
}
