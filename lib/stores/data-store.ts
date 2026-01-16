/**
 * LocalStorage-based data store for persistence
 *
 * This module provides a centralized way to manage application data in localStorage.
 * It initializes with mock data on first load and persists all changes.
 *
 * When real APIs are ready, this can be replaced with actual API calls
 * without changing the consuming code.
 */

import type { Job, Application, User, Company } from '@/types'

// Storage keys for each entity
export const STORAGE_KEYS = {
  JOBS: 'horizon-jobs',
  APPLICATIONS: 'horizon-applications',
  USERS: 'horizon-users',
  COMPANIES: 'horizon-companies',
  INITIALIZED: 'horizon-data-initialized',
} as const

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

/**
 * Initialize localStorage with mock data if not already done
 * This should be called once when the app starts
 */
export async function initializeDataStore(): Promise<void> {
  if (!isBrowser) return

  // Check if already initialized
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    return
  }

  // Dynamically import mock data to avoid circular dependencies
  const { MOCK_JOBS } = await import('@/mock/data/jobs')
  const { MOCK_APPLICATIONS } = await import('@/mock/data/applications')
  const { MOCK_USERS } = await import('@/mock/data/users')
  const { MOCK_COMPANIES } = await import('@/mock/data/companies')

  // Store initial data
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(MOCK_JOBS))
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS))
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS))
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(MOCK_COMPANIES))
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')

  console.log('[DataStore] Initialized with mock data')
}

/**
 * Reset all data to initial mock state
 * Useful for testing or clearing user modifications
 */
export async function resetDataStore(): Promise<void> {
  if (!isBrowser) return

  localStorage.removeItem(STORAGE_KEYS.JOBS)
  localStorage.removeItem(STORAGE_KEYS.APPLICATIONS)
  localStorage.removeItem(STORAGE_KEYS.USERS)
  localStorage.removeItem(STORAGE_KEYS.COMPANIES)
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED)

  await initializeDataStore()
  console.log('[DataStore] Reset to initial mock data')
}

// =============================================================================
// JOBS
// =============================================================================

export function getJobs(): Job[] {
  if (!isBrowser) return []

  const data = localStorage.getItem(STORAGE_KEYS.JOBS)
  if (!data) return []

  try {
    return JSON.parse(data) as Job[]
  } catch {
    console.error('[DataStore] Failed to parse jobs data')
    return []
  }
}

export function setJobs(jobs: Job[]): void {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs))
}

export function getJobById(id: string): Job | undefined {
  return getJobs().find(job => job.id === id)
}

export function updateJob(id: string, updates: Partial<Job>): Job | undefined {
  const jobs = getJobs()
  const index = jobs.findIndex(job => job.id === id)
  if (index === -1) return undefined

  jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() }
  setJobs(jobs)
  return jobs[index]
}

export function createJob(job: Job): Job {
  const jobs = getJobs()
  jobs.unshift(job)
  setJobs(jobs)
  return job
}

export function deleteJob(id: string): boolean {
  const jobs = getJobs()
  const filtered = jobs.filter(job => job.id !== id)
  if (filtered.length === jobs.length) return false
  setJobs(filtered)
  return true
}

// =============================================================================
// APPLICATIONS
// =============================================================================

export function getApplications(): Application[] {
  if (!isBrowser) return []

  const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS)
  if (!data) return []

  try {
    return JSON.parse(data) as Application[]
  } catch {
    console.error('[DataStore] Failed to parse applications data')
    return []
  }
}

export function setApplications(applications: Application[]): void {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications))
}

export function getApplicationById(id: string): Application | undefined {
  return getApplications().find(app => app.id === id)
}

export function createApplication(application: Application): Application {
  const applications = getApplications()
  applications.unshift(application)
  setApplications(applications)

  // Also update the job's application count
  const job = getJobById(application.jobId)
  if (job) {
    updateJob(application.jobId, {
      applicationsCount: (job.applicationsCount || 0) + 1
    })
  }

  return application
}

export function updateApplication(id: string, updates: Partial<Application>): Application | undefined {
  const applications = getApplications()
  const index = applications.findIndex(app => app.id === id)
  if (index === -1) return undefined

  applications[index] = { ...applications[index], ...updates, updatedAt: new Date().toISOString() }
  setApplications(applications)
  return applications[index]
}

export function deleteApplication(id: string): boolean {
  const applications = getApplications()
  const filtered = applications.filter(app => app.id !== id)
  if (filtered.length === applications.length) return false
  setApplications(filtered)
  return true
}

// =============================================================================
// USERS
// =============================================================================

export function getUsers(): User[] {
  if (!isBrowser) return []

  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  if (!data) return []

  try {
    return JSON.parse(data) as User[]
  } catch {
    console.error('[DataStore] Failed to parse users data')
    return []
  }
}

export function setUsers(users: User[]): void {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(user => user.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(user => user.email.toLowerCase() === email.toLowerCase())
}

export function createUser(user: User): User {
  const users = getUsers()
  users.push(user)
  setUsers(users)
  return user
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers()
  const index = users.findIndex(user => user.id === id)
  if (index === -1) return undefined

  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
  setUsers(users)
  return users[index]
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filtered = users.filter(user => user.id !== id)
  if (filtered.length === users.length) return false
  setUsers(filtered)
  return true
}

// =============================================================================
// COMPANIES
// =============================================================================

export function getCompanies(): Company[] {
  if (!isBrowser) return []

  const data = localStorage.getItem(STORAGE_KEYS.COMPANIES)
  if (!data) return []

  try {
    return JSON.parse(data) as Company[]
  } catch {
    console.error('[DataStore] Failed to parse companies data')
    return []
  }
}

export function setCompanies(companies: Company[]): void {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies))
}

export function getCompanyById(id: string): Company | undefined {
  return getCompanies().find(company => company.id === id)
}

export function createCompany(company: Company): Company {
  const companies = getCompanies()
  companies.push(company)
  setCompanies(companies)
  return company
}

export function updateCompany(id: string, updates: Partial<Company>): Company | undefined {
  const companies = getCompanies()
  const index = companies.findIndex(company => company.id === id)
  if (index === -1) return undefined

  companies[index] = { ...companies[index], ...updates, updatedAt: new Date().toISOString() }
  setCompanies(companies)
  return companies[index]
}

export function deleteCompany(id: string): boolean {
  const companies = getCompanies()
  const filtered = companies.filter(company => company.id !== id)
  if (filtered.length === companies.length) return false
  setCompanies(filtered)
  return true
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate a unique ID for new entities
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Check if data store is initialized
 */
export function isDataStoreInitialized(): boolean {
  if (!isBrowser) return false
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true'
}
