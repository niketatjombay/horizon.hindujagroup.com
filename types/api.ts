import type {
  JobType,
  ExperienceLevel,
  JobStatus,
  ApplicationStatus,
  UserRole,
  User,
} from './models'

// Generic API Response
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// API Error
export interface ApiError {
  code: string
  error: string
  message: string
  details?: Record<string, string[]>
  statusCode: number
}

// Job Filters
export interface JobFilters {
  search?: string
  company?: string[]
  department?: string
  location?: string[]
  function?: string[]
  type?: JobType[]
  experienceLevel?: ExperienceLevel[]
  status?: JobStatus
  salaryMin?: number
  salaryMax?: number
  postedAfter?: string
  postedBefore?: string
}

// Application Filters
export interface ApplicationFilters {
  jobId?: string
  status?: ApplicationStatus[]
  appliedAfter?: string
  appliedBefore?: string
}

// Sorting
export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// Pagination Params
export interface PaginationParams {
  page?: number
  pageSize?: number
  sort?: SortOptions
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  companyId?: string
  iat: number
  exp: number
}

// Job Request Types
export interface CreateJobRequest {
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
  closingDate?: string
  tags?: string[]
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: JobStatus
}

// Application Request Types
export interface CreateApplicationRequest {
  jobId: string
  coverLetter?: string
  resumeUrl?: string
}

export interface UpdateApplicationRequest {
  status?: ApplicationStatus
  notes?: string
}

// Application Submission (with file)
export interface ApplicationSubmission {
  jobId: string
  resumeFile: File
  coverLetter?: string
}
