import { faker } from '@faker-js/faker'
import { subDays, subHours } from 'date-fns'
import type { Application, ApplicationStatus, ExperienceLevel } from '@/types'
import { MOCK_JOBS } from './jobs'
import { MOCK_USERS } from './users'

/**
 * Weighted application statuses - more applications should be in early stages
 */
function generateApplicationStatus(): ApplicationStatus {
  return faker.helpers.weightedArrayElement([
    { weight: 30, value: 'submitted' as ApplicationStatus },
    { weight: 25, value: 'under_review' as ApplicationStatus },
    { weight: 15, value: 'shortlisted' as ApplicationStatus },
    { weight: 10, value: 'interview_scheduled' as ApplicationStatus },
    { weight: 8, value: 'offered' as ApplicationStatus },
    { weight: 5, value: 'accepted' as ApplicationStatus },
    { weight: 5, value: 'rejected' as ApplicationStatus },
    { weight: 2, value: 'withdrawn' as ApplicationStatus },
  ])
}

/**
 * Generate cover letter snippets
 */
function generateCoverLetter(userName: string, jobTitle: string, companyName: string): string {
  const openings = [
    `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}.`,
    `I am excited to apply for the ${jobTitle} role at ${companyName}.`,
    `I would like to submit my application for the ${jobTitle} position with ${companyName}.`,
  ]

  const middles = [
    `With my background and experience, I believe I would be a valuable addition to your team.`,
    `I am confident that my skills and experience align well with the requirements of this role.`,
    `My experience and passion for this field make me an ideal candidate for this position.`,
  ]

  const closings = [
    `I look forward to the opportunity to discuss how I can contribute to ${companyName}.`,
    `Thank you for considering my application. I am eager to learn more about this opportunity.`,
    `I would welcome the chance to speak with you about this exciting opportunity.`,
  ]

  return `Dear Hiring Manager,

${faker.helpers.arrayElement(openings)}

${faker.helpers.arrayElement(middles)}

${faker.helpers.arrayElement(closings)}

Best regards,
${userName}`
}

/**
 * Generate experience level for a user
 */
function getUserExperienceLevel(): ExperienceLevel {
  return faker.helpers.weightedArrayElement([
    { weight: 15, value: 'entry' as ExperienceLevel },
    { weight: 35, value: 'mid' as ExperienceLevel },
    { weight: 30, value: 'senior' as ExperienceLevel },
    { weight: 15, value: 'lead' as ExperienceLevel },
    { weight: 5, value: 'executive' as ExperienceLevel },
  ])
}

/**
 * Generate a single mock application
 */
function generateApplication(id: number): Application {
  // Pick a random job and user
  const job = faker.helpers.arrayElement(MOCK_JOBS)
  const user = faker.helpers.arrayElement(MOCK_USERS.filter(u => u.role === 'employee'))

  const appliedDaysAgo = faker.number.int({ min: 0, max: 7 })
  const appliedHoursAgo = faker.number.int({ min: 0, max: 23 })
  const appliedAt = subHours(subDays(new Date(), appliedDaysAgo), appliedHoursAgo)

  const status = generateApplicationStatus()
  const userName = `${user.firstName} ${user.lastName}`

  return {
    id: id.toString(),
    uuid: `app-${id.toString().padStart(3, '0')}`,
    jobId: job.id,
    jobTitle: job.title,
    userId: user.id,
    userName,
    userEmail: user.email,
    userCompanyName: user.companyName || 'Unknown Company',
    userExperienceLevel: getUserExperienceLevel(),
    status,
    coverLetter: faker.datatype.boolean(0.7)
      ? generateCoverLetter(userName, job.title, job.companyName)
      : undefined,
    resumeUrl: `/documents/resume.pdf`,
    atsLink: status !== 'submitted' && status !== 'withdrawn'
      ? `https://ats.${job.companyName.toLowerCase().replace(/\s+/g, '')}.com/applications/${id}`
      : undefined,
    appliedAt: appliedAt.toISOString(),
    notes: status === 'rejected'
      ? 'Does not meet minimum experience requirements'
      : status === 'interview_scheduled'
        ? 'Interview scheduled for next week'
        : undefined,
    createdAt: appliedAt.toISOString(),
    updatedAt: subHours(new Date(), faker.number.int({ min: 0, max: 48 })).toISOString(),
  }
}

/**
 * Generate mock applications for the current user
 */
function generateCurrentUserApplications(): Application[] {
  const currentUser = MOCK_USERS[0]
  const applications: Application[] = []

  // Current user has 5-8 applications
  const applicationCount = faker.number.int({ min: 5, max: 8 })
  const appliedJobs = faker.helpers.arrayElements(MOCK_JOBS, applicationCount)

  appliedJobs.forEach((job, index) => {
    const appliedDaysAgo = faker.number.int({ min: 1, max: 14 })
    const appliedAt = subDays(new Date(), appliedDaysAgo)
    const status = generateApplicationStatus()
    const userName = `${currentUser.firstName} ${currentUser.lastName}`

    applications.push({
      id: `current-${index + 1}`,
      uuid: `app-current-${(index + 1).toString().padStart(3, '0')}`,
      jobId: job.id,
      jobTitle: job.title,
      userId: currentUser.id,
      userName,
      userEmail: currentUser.email,
      userCompanyName: currentUser.companyName || 'Ashok Leyland',
      userExperienceLevel: 'senior',
      status,
      coverLetter: faker.datatype.boolean(0.8)
        ? generateCoverLetter(userName, job.title, job.companyName)
        : undefined,
      resumeUrl: `/documents/resume.pdf`,
      atsLink: status !== 'submitted' && status !== 'withdrawn'
        ? `https://ats.${job.companyName.toLowerCase().replace(/\s+/g, '')}.com/applications/current-${index + 1}`
        : undefined,
      appliedAt: appliedAt.toISOString(),
      notes: undefined,
      createdAt: appliedAt.toISOString(),
      updatedAt: new Date().toISOString(),
    })
  })

  return applications
}

/**
 * Generate 80 mock applications
 */
function generateAllApplications(): Application[] {
  const currentUserApps = generateCurrentUserApplications()
  const otherApps: Application[] = []

  // Generate remaining applications (80 - current user's apps)
  const remainingCount = 80 - currentUserApps.length
  for (let i = 0; i < remainingCount; i++) {
    otherApps.push(generateApplication(i + 1))
  }

  return [...currentUserApps, ...otherApps]
}

export const MOCK_APPLICATIONS: Application[] = generateAllApplications()

/**
 * Get application by ID
 */
export function getApplicationById(id: string): Application | undefined {
  return MOCK_APPLICATIONS.find(app => app.id === id)
}

/**
 * Get applications by user ID
 */
export function getApplicationsByUser(userId: string): Application[] {
  return MOCK_APPLICATIONS.filter(app => app.userId === userId)
}

/**
 * Get applications by job ID
 */
export function getApplicationsByJob(jobId: string): Application[] {
  return MOCK_APPLICATIONS.filter(app => app.jobId === jobId)
}

/**
 * Get applications by status
 */
export function getApplicationsByStatus(status: ApplicationStatus): Application[] {
  return MOCK_APPLICATIONS.filter(app => app.status === status)
}

/**
 * Get current user's applications
 */
export function getCurrentUserApplications(): Application[] {
  return MOCK_APPLICATIONS.filter(app => app.userId === '1')
}
