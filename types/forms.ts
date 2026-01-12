import { z } from 'zod'

// Login Form
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Registration Form
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  department: z.string().min(1, 'Please select a department'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Job Form
export const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  responsibilities: z.array(z.string()).min(1, 'At least one responsibility is needed'),
  department: z.string().min(1, 'Please select a department'),
  function: z.string().min(1, 'Please select a function'),
  location: z.string().min(1, 'Please enter a location'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  salaryCurrency: z.string().optional(),
  closingDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type JobFormData = z.infer<typeof jobSchema>

// Application Form
export const applicationSchema = z.object({
  coverLetter: z.string().max(2000, 'Cover letter must be under 2000 characters').optional(),
  resumeUrl: z.string().url('Please provide a valid URL').optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>

// Application with file upload
export const applicationWithFileSchema = z.object({
  jobId: z.string(),
  resumeFile: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type),
      'Only PDF, DOC, and DOCX files are allowed'
    ),
  coverLetter: z.string().max(500, 'Cover letter must be 500 characters or less').optional(),
})

export type ApplicationWithFileFormData = z.infer<typeof applicationWithFileSchema>

// Profile Form
export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number').optional().or(z.literal('')),
  location: z.string().optional(),
  currentJobTitle: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  skills: z.array(z.string()),
  linkedinUrl: z.string().url('Please provide a valid URL').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// Search Form
export const searchSchema = z.object({
  query: z.string().min(1, 'Please enter a search term'),
})

export type SearchFormData = z.infer<typeof searchSchema>
