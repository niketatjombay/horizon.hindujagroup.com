import type { Application, ApplicationStatus, ExperienceLevel } from '@/types'
import type { PaginatedResponse, Pagination, ApplicationFilters, ApplicationSubmission } from '@/types/api'
import { MOCK_APPLICATIONS, getCurrentUserApplications } from '../data/applications'
import { MOCK_JOBS } from '../data/jobs'
import { MOCK_USERS } from '../data/users'
import { parseISO, isAfter, isBefore } from 'date-fns'

export interface ExtendedApplicationFilters extends ApplicationFilters {
  userId?: string
  companyId?: string
  page?: number
  pageSize?: number
  sortBy?: 'newest' | 'oldest' | 'status'
}

// In-memory store for new applications created during the session
let sessionApplications: Application[] = []
let nextId = 1000

/**
 * Get mock applications with filtering and pagination
 */
export function getMockApplications(filters?: ExtendedApplicationFilters): PaginatedResponse<Application> {
  let filteredApplications = [...MOCK_APPLICATIONS, ...sessionApplications]

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
  return (
    MOCK_APPLICATIONS.find(app => app.id === id) ||
    sessionApplications.find(app => app.id === id) ||
    null
  )
}

/**
 * Get current user's applications
 */
export function getMockCurrentUserApplications(): Application[] {
  const currentUserApps = getCurrentUserApplications()
  const sessionCurrentUserApps = sessionApplications.filter(app => app.userId === '1')
  return [...currentUserApps, ...sessionCurrentUserApps]
}

/**
 * Get applications for a specific job
 */
export function getMockApplicationsByJob(jobId: string): Application[] {
  return [
    ...MOCK_APPLICATIONS.filter(app => app.jobId === jobId),
    ...sessionApplications.filter(app => app.jobId === jobId),
  ]
}

/**
 * Create a new application (async with simulated delay)
 */
export async function createMockApplication(data: ApplicationSubmission): Promise<Application> {
  // Simulate API delay (1 second as per spec)
  await new Promise(resolve => setTimeout(resolve, 1000))

  const job = MOCK_JOBS.find(j => j.id === data.jobId)
  if (!job) {
    throw new Error('Job not found')
  }

  const currentUser = MOCK_USERS[0]

  const newApplication: Application = {
    id: `session-${nextId++}`,
    uuid: `app-session-${nextId.toString().padStart(3, '0')}`,
    jobId: data.jobId,
    jobTitle: job.title,
    userId: currentUser.id,
    userName: `${currentUser.firstName} ${currentUser.lastName}`,
    userEmail: currentUser.email,
    userCompanyName: currentUser.companyName || 'Unknown Company',
    userExperienceLevel: 'senior' as ExperienceLevel,
    status: 'submitted',
    coverLetter: data.coverLetter,
    resumeUrl: URL.createObjectURL(data.resumeFile),
    appliedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  sessionApplications.push(newApplication)
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

  // Check in mock applications
  const mockIndex = MOCK_APPLICATIONS.findIndex(app => app.id === id)
  if (mockIndex !== -1) {
    MOCK_APPLICATIONS[mockIndex] = {
      ...MOCK_APPLICATIONS[mockIndex],
      status,
      notes: notes || MOCK_APPLICATIONS[mockIndex].notes,
      updatedAt: new Date().toISOString(),
    }
    return MOCK_APPLICATIONS[mockIndex]
  }

  // Check in session applications
  const sessionIndex = sessionApplications.findIndex(app => app.id === id)
  if (sessionIndex !== -1) {
    sessionApplications[sessionIndex] = {
      ...sessionApplications[sessionIndex],
      status,
      notes: notes || sessionApplications[sessionIndex].notes,
      updatedAt: new Date().toISOString(),
    }
    return sessionApplications[sessionIndex]
  }

  return null
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
  return (
    MOCK_APPLICATIONS.some(app => app.userId === userId && app.jobId === jobId) ||
    sessionApplications.some(app => app.userId === userId && app.jobId === jobId)
  )
}

/**
 * Get application count by status
 */
export function getMockApplicationCountByStatus(): Record<ApplicationStatus, number> {
  const allApplications = [...MOCK_APPLICATIONS, ...sessionApplications]
  return allApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>)
}

/**
 * Get total application count
 */
export function getMockApplicationCount(): number {
  return MOCK_APPLICATIONS.length + sessionApplications.length
}

/**
 * Reset session applications (for testing)
 */
export function resetSessionApplications(): void {
  sessionApplications = []
  nextId = 1000
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
  const allApplications = [...MOCK_APPLICATIONS, ...sessionApplications]
  return allApplications.filter(
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
  const user = MOCK_USERS.find(u => u.id === application.userId)

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
