import type { Job, JobType, ExperienceLevel, JobStatus } from '@/types'
import type { PaginatedResponse, Pagination, JobFilters } from '@/types/api'
import { getJobs, updateJob as updateJobInStore } from '@/lib/stores/data-store'
import { parseISO, isAfter, isBefore } from 'date-fns'

export interface ExtendedJobFilters extends JobFilters {
  page?: number
  pageSize?: number
  sortBy?: 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'salary_high' | 'salary_low'
}

/**
 * Get mock jobs with comprehensive filtering and pagination
 */
export function getMockJobs(filters?: ExtendedJobFilters): PaginatedResponse<Job> {
  let filteredJobs = [...getJobs()]

  // Apply search filter
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(searchLower) ||
      job.companyName.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // Apply company filter
  if (filters?.company && filters.company.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.company!.includes(job.companyId)
    )
  }

  // Apply location filter
  if (filters?.location && filters.location.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.location!.some(loc =>
        job.location.toLowerCase() === loc.toLowerCase()
      )
    )
  }

  // Apply function filter
  if (filters?.function && filters.function.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.function!.some(func =>
        job.function.toLowerCase() === func.toLowerCase()
      )
    )
  }

  // Apply type filter
  if (filters?.type && filters.type.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.type!.includes(job.type)
    )
  }

  // Apply experience level filter
  if (filters?.experienceLevel && filters.experienceLevel.length > 0) {
    filteredJobs = filteredJobs.filter(job =>
      filters.experienceLevel!.includes(job.experienceLevel)
    )
  }

  // Apply status filter
  if (filters?.status) {
    filteredJobs = filteredJobs.filter(job =>
      job.status === filters.status
    )
  }

  // Apply salary min filter
  if (filters?.salaryMin !== undefined) {
    filteredJobs = filteredJobs.filter(job =>
      job.salaryMax && job.salaryMax >= filters.salaryMin!
    )
  }

  // Apply salary max filter
  if (filters?.salaryMax !== undefined) {
    filteredJobs = filteredJobs.filter(job =>
      job.salaryMin && job.salaryMin <= filters.salaryMax!
    )
  }

  // Apply posted after filter
  if (filters?.postedAfter) {
    const afterDate = parseISO(filters.postedAfter)
    filteredJobs = filteredJobs.filter(job =>
      isAfter(parseISO(job.postedDate), afterDate)
    )
  }

  // Apply posted before filter
  if (filters?.postedBefore) {
    const beforeDate = parseISO(filters.postedBefore)
    filteredJobs = filteredJobs.filter(job =>
      isBefore(parseISO(job.postedDate), beforeDate)
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'newest'
  switch (sortBy) {
    case 'newest':
      filteredJobs.sort((a, b) =>
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      )
      break
    case 'oldest':
      filteredJobs.sort((a, b) =>
        new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      )
      break
    case 'title_asc':
      filteredJobs.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title_desc':
      filteredJobs.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'salary_high':
      filteredJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
      break
    case 'salary_low':
      filteredJobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0))
      break
  }

  // Pagination
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  const pagination: Pagination = {
    page,
    pageSize,
    total: filteredJobs.length,
    totalPages: Math.ceil(filteredJobs.length / pageSize),
    hasNextPage: endIndex < filteredJobs.length,
    hasPreviousPage: page > 1,
  }

  return {
    data: paginatedJobs,
    pagination,
  }
}

/**
 * Get a single job by ID
 */
export function getMockJobById(id: string): Job | null {
  return getJobs().find(job => job.id === id) || null
}

/**
 * Get recommended jobs for the current user
 */
export function getMockRecommendedJobs(limit: number = 6): Job[] {
  // Simple recommendation: return jobs with most views from different companies
  const recommendedJobs = [...getJobs()]
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, limit)

  return recommendedJobs
}

/**
 * Get recently posted jobs
 */
export function getMockRecentJobs(limit: number = 6): Job[] {
  return [...getJobs()]
    .sort((a, b) =>
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    )
    .slice(0, limit)
}

/**
 * Get jobs by company
 */
export function getMockJobsByCompany(companyId: string): Job[] {
  return getJobs().filter(job => job.companyId === companyId)
}

/**
 * Get saved jobs for user (mock - just returns first 5 jobs)
 */
export function getMockSavedJobs(): Job[] {
  return getJobs().filter(job => job.isSaved)
}

/**
 * Get unique locations from all jobs
 */
export function getMockJobLocations(): string[] {
  const locations = new Set(getJobs().map(job => job.location))
  return Array.from(locations).sort()
}

/**
 * Get unique functions from all jobs
 */
export function getMockJobFunctions(): string[] {
  const functions = new Set(getJobs().map(job => job.function))
  return Array.from(functions).sort()
}

/**
 * Get job count by status
 */
export function getMockJobCountByStatus(): Record<JobStatus, number> {
  return getJobs().reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<JobStatus, number>)
}

/**
 * Get total job count
 */
export function getMockJobCount(): number {
  return getJobs().length
}

/**
 * Toggle save status for a job
 */
export function toggleMockJobSave(jobId: string): Job | null {
  const job = getJobs().find(j => j.id === jobId)
  if (!job) return null

  const updated = updateJobInStore(jobId, { isSaved: !job.isSaved })
  return updated || null
}
