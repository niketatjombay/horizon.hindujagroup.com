// User & Authentication Types
export type UserRole = 'employee' | 'hr' | 'chro' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department: string
  companyId: string
  companyName?: string
  currentJobTitle?: string
  location?: string
  phone?: string
  avatarUrl?: string
  status: 'active' | 'inactive'
  emailVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface Profile extends User {
  bio?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  resumeUrl?: string
  linkedinUrl?: string
  experienceYears?: number
}

export interface Experience {
  id: string
  title: string
  company: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  graduationDate: string
  field?: string
}

// Company Types
export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise'
export type SyncStatus = 'success' | 'pending' | 'failed'

export interface Company {
  id: string
  uuid: string
  name: string
  description?: string
  logo: string
  industry: string
  size: CompanySize
  location: string
  atsType: string
  atsEndpoint?: string
  lastSyncAt?: string
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
}

// Job Types
export type JobStatus = 'draft' | 'open' | 'closed' | 'filled'
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive'

export interface Job {
  id: string
  uuid: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  department: string
  function: string
  location: string
  type: JobType
  experienceLevel: ExperienceLevel
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  status: JobStatus
  companyId: string
  companyName: string
  companyLogo: string
  externalId: string
  postedBy: string
  postedDate: string
  closingDate?: string
  applicationsCount: number
  viewsCount: number
  isSaved?: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Application Types
export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offered'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: string
  uuid: string
  jobId: string
  jobTitle: string
  userId: string
  userName: string
  userEmail: string
  userCompanyName: string
  userExperienceLevel: ExperienceLevel
  status: ApplicationStatus
  coverLetter?: string
  resumeUrl?: string
  atsLink?: string
  appliedAt: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Dashboard Metrics Types
export interface EmployeeDashboardMetrics {
  recommendedJobs: Job[]
  recentJobs: Job[]
  applicationCount: number
  savedJobsCount: number
}

export interface HRDashboardMetrics {
  totalActiveJobs: number
  newApplicationsToday: number
  pendingReviews: number
  totalApplicationsThisMonth: number
  topJobs: Array<{
    job: Job
    applicantsCount: number
    newToday: number
  }>
  recentApplications: Application[]
}

export interface CHRODashboardMetrics {
  totalInternalHires: number
  activeJobPostings: number
  totalApplications: number
  hiresByCompany: Array<{ companyName: string; count: number }>
  hiresByFunction: Array<{ functionName: string; count: number }>
  talentFlow: Array<{ from: string; to: string; count: number }>
}

// Sync Log
export interface SyncLog {
  id: string
  companyId: string
  companyName: string
  status: SyncStatus
  jobsSynced: number
  errorMessage?: string
  syncedAt: string
}
