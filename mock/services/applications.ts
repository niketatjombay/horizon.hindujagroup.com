import type { Application, ApplicationStatus, ExperienceLevel } from '@/types'
import type { PaginatedResponse, Pagination, ApplicationFilters, ApplicationSubmission } from '@/types/api'
import {
  getApplications,
  setApplications,
  getApplicationById as getAppFromStore,
  createApplication as createAppInStore,
  updateApplication as updateAppInStore,
  getJobs,
  getUsers,
  generateId,
} from '@/lib/stores/data-store'
import { parseISO, isAfter, isBefore } from 'date-fns'

export interface ExtendedApplicationFilters extends ApplicationFilters {
  userId?: string
  companyId?: string
  page?: number
  pageSize?: number
  sortBy?: 'newest' | 'oldest' | 'status'
}

/**
 * Get mock applications with filtering and pagination
 */
export function getMockApplications(filters?: ExtendedApplicationFilters): PaginatedResponse<Application> {
  let filteredApplications = [...getApplications()]

  // Apply user ID filter
  if (filters?.userId) {
    filteredApplications = filteredApplications.filter(app =>
      app.userId === filters.userId
    )
  }

  // Apply job ID filter
  if (filters?.jobId) {
    filteredApplications = filteredApplications.filter(app =>
      app.jobId === filters.jobId
    )
  }

  // Apply status filter
  if (filters?.status && filters.status.length > 0) {
    filteredApplications = filteredApplications.filter(app =>
      filters.status!.includes(app.status)
    )
  }

  // Apply applied after filter
  if (filters?.appliedAfter) {
    const afterDate = parseISO(filters.appliedAfter)
    filteredApplications = filteredApplications.filter(app =>
      isAfter(parseISO(app.appliedAt), afterDate)
    )
  }

  // Apply applied before filter
  if (filters?.appliedBefore) {
    const beforeDate = parseISO(filters.appliedBefore)
    filteredApplications = filteredApplications.filter(app =>
      isBefore(parseISO(app.appliedAt), beforeDate)
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'newest'
  switch (sortBy) {
    case 'newest':
      filteredApplications.sort((a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      )
      break
    case 'oldest':
      filteredApplications.sort((a, b) =>
        new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
      )
      break
    case 'status':
      const statusOrder: ApplicationStatus[] = [
        'submitted',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'offered',
        'accepted',
        'rejected',
        'withdrawn',
      ]
      filteredApplications.sort((a, b) =>
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
      )
      break
  }

  // Pagination
  const page = filters?.page || 1
  const pageSize = filters?.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex)

  const pagination: Pagination = {
    page,
    pageSize,
    total: filteredApplications.length,
    totalPages: Math.ceil(filteredApplications.length / pageSize),
    hasNextPage: endIndex < filteredApplications.length,
    hasPreviousPage: page > 1,
  }

  return {
    data: paginatedApplications,
    pagination,
  }
}

/**
 * Get application by ID
 */
export function getMockApplicationById(id: string): Application | null {
  return getAppFromStore(id) || null
}

/**
 * Get current user's applications
 */
export function getMockCurrentUserApplications(): Application[] {
  const currentUser = getUsers()[0]
  if (!currentUser) return []
  return getApplications().filter(app => app.userId === currentUser.id)
}

/**
 * Get applications for a specific job
 */
export function getMockApplicationsByJob(jobId: string): Application[] {
  return getApplications().filter(app => app.jobId === jobId)
}

/**
 * Create a new application (async with simulated delay)
 */
export async function createMockApplication(data: ApplicationSubmission): Promise<Application> {
  // Simulate API delay (1 second as per spec)
  await new Promise(resolve => setTimeout(resolve, 1000))

  const job = getJobs().find(j => j.id === data.jobId)
  if (!job) {
    throw new Error('Job not found')
  }

  const currentUser = getUsers()[0]
  if (!currentUser) {
    throw new Error('User not found')
  }

  const newApplication: Application = {
    id: generateId(),
    uuid: `app-${generateId()}`,
    jobId: data.jobId,
    jobTitle: job.title,
    userId: currentUser.id,
    userName: `${currentUser.firstName} ${currentUser.lastName}`,
    userEmail: currentUser.email,
    userCompanyName: currentUser.companyName || 'Unknown Company',
    userExperienceLevel: 'senior' as ExperienceLevel,
    status: 'submitted',
    coverLetter: data.coverLetter,
    resumeUrl: data.resumeFile ? URL.createObjectURL(data.resumeFile) : '/documents/resume.pdf',
    appliedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  createAppInStore(newApplication)
  return newApplication
}

/**
 * Update application status (for HR/Admin)
 */
export async function updateMockApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string
): Promise<Application | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const updates: Partial<Application> = { status }
  if (notes) {
    updates.notes = notes
  }

  const updated = updateAppInStore(id, updates)
  return updated || null
}

/**
 * Withdraw application
 */
export async function withdrawMockApplication(id: string): Promise<Application | null> {
  return updateMockApplicationStatus(id, 'withdrawn', 'Withdrawn by applicant')
}

/**
 * Check if user has already applied to a job
 */
export function hasUserAppliedToJob(userId: string, jobId: string): boolean {
  return getApplications().some(app => app.userId === userId && app.jobId === jobId)
}

/**
 * Get application count by status
 */
export function getMockApplicationCountByStatus(): Record<ApplicationStatus, number> {
  return getApplications().reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>)
}

/**
 * Get total application count
 */
export function getMockApplicationCount(): number {
  return getApplications().length
}

/**
 * Reset session applications (now resets to initial data)
 */
export function resetSessionApplications(): void {
  // This is now handled by resetDataStore in data-store.ts
  console.log('[Applications] Use resetDataStore() to reset all data')
}

// Timeline event type
export interface TimelineEvent {
  id: string
  status: ApplicationStatus
  timestamp: string
  changedBy?: string
  notes?: string
}

// Enhanced applicant detail type
export interface ApplicantDetail extends Application {
  phone?: string
  location?: string
  timeline: TimelineEvent[]
  relatedApplications: Application[]
}

/**
 * Generate mock timeline events for an application
 */
function generateMockTimeline(application: Application): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const hrNames = ['Sarah Johnson', 'Mike Chen', 'Priya Patel', 'Raj Kumar']

  // Always start with submitted status
  events.push({
    id: `${application.id}-1`,
    status: 'submitted',
    timestamp: application.appliedAt,
    notes: 'Application received',
  })

  // Add more events based on current status
  const statusProgression: ApplicationStatus[] = [
    'submitted',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'offered',
    'accepted',
  ]

  const currentIndex = statusProgression.indexOf(application.status)

  // If status is rejected or withdrawn, handle specially
  if (application.status === 'rejected') {
    // Add some progression before rejection
    const baseDate = new Date(application.appliedAt)
    events.push({
      id: `${application.id}-2`,
      status: 'under_review',
      timestamp: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      changedBy: hrNames[Math.floor(Math.random() * hrNames.length)],
    })
    events.push({
      id: `${application.id}-3`,
      status: 'rejected',
      timestamp: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      changedBy: hrNames[Math.floor(Math.random() * hrNames.length)],
      notes: 'Not a match for current requirements',
    })
  } else if (application.status === 'withdrawn') {
    events.push({
      id: `${application.id}-2`,
      status: 'withdrawn',
      timestamp: new Date(new Date(application.appliedAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Withdrawn by applicant',
    })
  } else if (currentIndex > 0) {
    // Add events for each status change
    const baseDate = new Date(application.appliedAt)
    for (let i = 1; i <= currentIndex; i++) {
      events.push({
        id: `${application.id}-${i + 1}`,
        status: statusProgression[i],
        timestamp: new Date(baseDate.getTime() + i * 2 * 24 * 60 * 60 * 1000).toISOString(),
        changedBy: hrNames[Math.floor(Math.random() * hrNames.length)],
        notes: i === currentIndex && application.notes ? application.notes : undefined,
      })
    }
  }

  return events
}

/**
 * Get related applications (same applicant email, different jobs)
 */
function getRelatedApplications(application: Application): Application[] {
  return getApplications().filter(
    app => app.userEmail === application.userEmail && app.id !== application.id
  )
}

/**
 * Get enhanced applicant detail by application ID
 */
export function getMockApplicantDetail(id: string): ApplicantDetail | null {
  const application = getMockApplicationById(id)
  if (!application) return null

  // Find the user to get phone and location
  const user = getUsers().find(u => u.id === application.userId)

  return {
    ...application,
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Mumbai, India',
    timeline: generateMockTimeline(application),
    relatedApplications: getRelatedApplications(application),
  }
}

/**
 * Get previous and next application IDs for navigation
 */
export function getAdjacentApplicationIds(
  currentId: string,
  filters?: ExtendedApplicationFilters
): { prevId: string | null; nextId: string | null } {
  const { data: applications } = getMockApplications(filters)
  const currentIndex = applications.findIndex(app => app.id === currentId)

  return {
    prevId: currentIndex > 0 ? applications[currentIndex - 1].id : null,
    nextId: currentIndex < applications.length - 1 ? applications[currentIndex + 1].id : null,
  }
}
