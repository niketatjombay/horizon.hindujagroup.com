import type { Application, ApplicationStatus, ApiResponse, ApplicationSubmission } from '@/types'
import type { PaginatedResponse } from '@/types/api'
import type { ExtendedApplicationFilters, ApplicantDetail } from '@/mock'
import {
  getMockApplications,
  getMockApplicationById,
  getMockCurrentUserApplications,
  createMockApplication,
  withdrawMockApplication,
  updateMockApplicationStatus,
  getMockApplicantDetail,
  getAdjacentApplicationIds,
} from '@/mock'

/**
 * Fetch user's applications with filters
 */
export async function fetchApplications(filters?: ExtendedApplicationFilters): Promise<Application[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (filters) {
    const result = getMockApplications(filters)
    return result.data
  }

  return getMockCurrentUserApplications()
}

/**
 * Fetch applications with pagination (for HR/Admin views)
 */
export async function fetchApplicationsPaginated(
  filters?: ExtendedApplicationFilters
): Promise<PaginatedResponse<Application>> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getMockApplications(filters)
}

/**
 * Fetch single application by ID
 */
export async function fetchApplicationById(id: string): Promise<Application> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const application = getMockApplicationById(id)

  if (!application) {
    throw new Error('Application not found')
  }

  return application
}

/**
 * Submit job application
 */
export async function submitApplication(
  data: ApplicationSubmission
): Promise<ApiResponse<Application>> {
  const application = await createMockApplication(data)

  return {
    data: application,
    success: true,
    message: 'Application submitted successfully',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Withdraw application
 */
export async function withdrawApplication(
  applicationId: string
): Promise<ApiResponse<{ withdrawn: boolean }>> {
  const result = await withdrawMockApplication(applicationId)

  if (!result) {
    throw new Error('Application not found')
  }

  return {
    data: { withdrawn: true },
    success: true,
    message: 'Application withdrawn successfully',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Update application status (HR/Admin)
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  notes?: string
): Promise<ApiResponse<Application>> {
  const result = await updateMockApplicationStatus(applicationId, status, notes)

  if (!result) {
    throw new Error('Application not found')
  }

  return {
    data: result,
    success: true,
    message: 'Application status updated successfully',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Bulk update application status (HR/Admin)
 */
export async function bulkUpdateApplicationStatus(
  applicationIds: string[],
  status: ApplicationStatus
): Promise<ApiResponse<{ updated: number }>> {
  // Update each application
  const results = await Promise.all(
    applicationIds.map((id) => updateMockApplicationStatus(id, status))
  )

  const successCount = results.filter(Boolean).length

  return {
    data: { updated: successCount },
    success: true,
    message: `${successCount} applications updated successfully`,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Fetch enhanced applicant detail by application ID
 */
export async function fetchApplicantDetail(id: string): Promise<ApplicantDetail> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const detail = getMockApplicantDetail(id)

  if (!detail) {
    throw new Error('Application not found')
  }

  return detail
}

/**
 * Fetch adjacent application IDs for navigation
 */
export async function fetchAdjacentApplicationIds(
  currentId: string,
  filters?: ExtendedApplicationFilters
): Promise<{ prevId: string | null; nextId: string | null }> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return getAdjacentApplicationIds(currentId, filters)
}
