import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'
import type { Job, ExperienceLevel, JobType, JobStatus } from '@/types'
import { MOCK_COMPANIES, getCompanyById } from './companies'

// Realistic job titles by function
const JOB_TITLES_BY_FUNCTION: Record<string, string[]> = {
  'Engineering': [
    'Senior Software Engineer',
    'Staff Engineer',
    'Principal Engineer',
    'DevOps Engineer',
    'Cloud Architect',
    'Full Stack Developer',
    'Backend Engineer',
    'Frontend Engineer',
    'Mobile Developer',
    'Data Engineer',
    'Machine Learning Engineer',
    'QA Engineer',
    'Site Reliability Engineer',
    'Security Engineer',
    'Embedded Systems Engineer',
  ],
  'Product': [
    'Product Manager',
    'Senior Product Manager',
    'Director of Product',
    'Product Owner',
    'Technical Product Manager',
    'Product Analyst',
  ],
  'Data & Analytics': [
    'Data Analyst',
    'Senior Data Analyst',
    'Business Intelligence Analyst',
    'Data Scientist',
    'Analytics Manager',
    'Reporting Analyst',
  ],
  'Marketing': [
    'Marketing Manager',
    'Digital Marketing Specialist',
    'Brand Manager',
    'Content Marketing Manager',
    'Marketing Director',
    'Growth Marketing Manager',
    'SEO Specialist',
    'Social Media Manager',
  ],
  'Sales': [
    'Sales Executive',
    'Senior Sales Manager',
    'Account Executive',
    'Business Development Manager',
    'Regional Sales Head',
    'Key Account Manager',
    'Sales Director',
    'Inside Sales Representative',
  ],
  'Human Resources': [
    'HR Business Partner',
    'HR Manager',
    'Talent Acquisition Specialist',
    'Compensation & Benefits Manager',
    'HR Director',
    'Learning & Development Manager',
    'Employee Relations Specialist',
  ],
  'Finance': [
    'Financial Analyst',
    'Senior Accountant',
    'Finance Manager',
    'Controller',
    'Treasury Analyst',
    'FP&A Manager',
    'Tax Specialist',
    'Audit Manager',
  ],
  'Operations': [
    'Operations Manager',
    'Supply Chain Manager',
    'Logistics Coordinator',
    'Procurement Manager',
    'Operations Director',
    'Process Improvement Specialist',
    'Facilities Manager',
  ],
  'Legal': [
    'Legal Counsel',
    'Corporate Lawyer',
    'Compliance Officer',
    'Contract Manager',
    'Legal Manager',
    'General Counsel',
  ],
  'IT': [
    'IT Manager',
    'System Administrator',
    'Network Engineer',
    'IT Support Specialist',
    'Infrastructure Manager',
    'IT Director',
    'Database Administrator',
  ],
}

const FUNCTIONS = Object.keys(JOB_TITLES_BY_FUNCTION)

const LOCATIONS = [
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Remote',
]

const DEPARTMENTS = [
  'Technology',
  'Product',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Legal',
  'Corporate Strategy',
  'Customer Success',
]

const SKILLS_BY_FUNCTION: Record<string, string[]> = {
  'Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Go', 'Java', 'SQL', 'GraphQL', 'REST APIs'],
  'Product': ['Product Strategy', 'Agile', 'Scrum', 'Roadmapping', 'User Research', 'A/B Testing', 'JIRA', 'Confluence'],
  'Data & Analytics': ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Statistical Analysis', 'Machine Learning', 'Data Visualization'],
  'Marketing': ['Digital Marketing', 'SEO', 'SEM', 'Content Strategy', 'Google Analytics', 'Social Media', 'Brand Management', 'Campaign Management'],
  'Sales': ['Salesforce', 'CRM', 'Negotiation', 'Account Management', 'Lead Generation', 'Sales Strategy', 'Client Relations'],
  'Human Resources': ['Recruitment', 'HRIS', 'Employee Relations', 'Performance Management', 'Compensation', 'Training & Development'],
  'Finance': ['Financial Modeling', 'Excel', 'SAP', 'Budgeting', 'Forecasting', 'GAAP', 'Audit', 'Treasury'],
  'Operations': ['Process Optimization', 'Six Sigma', 'Lean', 'Supply Chain', 'Logistics', 'Inventory Management', 'ERP'],
  'Legal': ['Contract Law', 'Corporate Governance', 'Compliance', 'M&A', 'IP Law', 'Litigation'],
  'IT': ['Active Directory', 'Networking', 'Security', 'Cloud Infrastructure', 'ITIL', 'ServiceNow'],
}

/**
 * Generate job requirements based on experience level
 */
function generateRequirements(experienceLevel: ExperienceLevel, func: string): string[] {
  const baseSkills = SKILLS_BY_FUNCTION[func] || SKILLS_BY_FUNCTION['Engineering']
  const skills = faker.helpers.arrayElements(baseSkills, faker.number.int({ min: 3, max: 6 }))

  const yearsRequired = {
    'entry': '0-2',
    'mid': '3-5',
    'senior': '6-10',
    'lead': '8-12',
    'executive': '12+',
  }

  return [
    `${yearsRequired[experienceLevel]} years of relevant experience`,
    `Strong proficiency in ${skills.slice(0, 3).join(', ')}`,
    `Experience with ${skills.slice(3).join(', ') || 'industry best practices'}`,
    `Excellent communication and collaboration skills`,
    `Bachelor's degree in relevant field or equivalent experience`,
    experienceLevel === 'lead' || experienceLevel === 'executive'
      ? 'Proven leadership and team management experience'
      : 'Ability to work independently and in a team',
  ]
}

/**
 * Generate job responsibilities based on role
 */
function generateResponsibilities(title: string, experienceLevel: ExperienceLevel): string[] {
  const isLeadership = experienceLevel === 'lead' || experienceLevel === 'executive'

  const baseResponsibilities = [
    `Deliver high-quality work aligned with organizational goals`,
    `Collaborate with cross-functional teams`,
    `Participate in planning and review meetings`,
    `Document processes and maintain best practices`,
  ]

  if (isLeadership) {
    return [
      `Lead and mentor a team of professionals`,
      `Define strategy and roadmap for the department`,
      `Drive organizational objectives and KPIs`,
      `Report to senior leadership and present updates`,
      `Build and develop high-performing teams`,
      `Manage stakeholder relationships`,
    ]
  }

  return [
    ...baseResponsibilities,
    `Contribute to continuous improvement initiatives`,
    `Support team objectives and timelines`,
  ]
}

/**
 * Generate salary range based on experience level
 */
function generateSalaryRange(experienceLevel: ExperienceLevel): { min: number; max: number } {
  const ranges = {
    'entry': { min: 400000, max: 800000 },
    'mid': { min: 800000, max: 1500000 },
    'senior': { min: 1500000, max: 2500000 },
    'lead': { min: 2500000, max: 4000000 },
    'executive': { min: 4000000, max: 8000000 },
  }
  return ranges[experienceLevel]
}

/**
 * Generate a single mock job
 */
function generateJob(id: number): Job {
  const company = faker.helpers.arrayElement(MOCK_COMPANIES)
  const func = faker.helpers.arrayElement(FUNCTIONS)
  const titles = JOB_TITLES_BY_FUNCTION[func]
  const title = faker.helpers.arrayElement(titles)

  // Weight experience levels with more mid and senior roles
  const experienceLevel = faker.helpers.weightedArrayElement([
    { weight: 15, value: 'entry' as ExperienceLevel },
    { weight: 35, value: 'mid' as ExperienceLevel },
    { weight: 30, value: 'senior' as ExperienceLevel },
    { weight: 15, value: 'lead' as ExperienceLevel },
    { weight: 5, value: 'executive' as ExperienceLevel },
  ])

  const jobType = faker.helpers.weightedArrayElement([
    { weight: 80, value: 'full-time' as JobType },
    { weight: 10, value: 'contract' as JobType },
    { weight: 7, value: 'part-time' as JobType },
    { weight: 3, value: 'internship' as JobType },
  ])

  const salaryRange = generateSalaryRange(experienceLevel)
  const postedDaysAgo = faker.number.int({ min: 1, max: 30 })
  const postedDate = subDays(new Date(), postedDaysAgo)

  return {
    id: id.toString(),
    uuid: `job-${id.toString().padStart(3, '0')}`,
    title,
    description: generateJobDescription(title, company.name, func),
    requirements: generateRequirements(experienceLevel, func),
    responsibilities: generateResponsibilities(title, experienceLevel),
    department: faker.helpers.arrayElement(DEPARTMENTS),
    function: func,
    location: faker.helpers.arrayElement(LOCATIONS),
    type: jobType,
    experienceLevel,
    salaryMin: salaryRange.min,
    salaryMax: salaryRange.max,
    salaryCurrency: 'INR',
    status: 'open' as JobStatus,
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo,
    externalId: `ext-${faker.string.alphanumeric(10).toUpperCase()}`,
    postedBy: faker.person.fullName(),
    postedDate: postedDate.toISOString(),
    closingDate: subDays(new Date(), -30).toISOString(), // 30 days from now
    applicationsCount: faker.number.int({ min: 0, max: 75 }),
    viewsCount: faker.number.int({ min: 50, max: 500 }),
    isSaved: false,
    tags: faker.helpers.arrayElements(
      SKILLS_BY_FUNCTION[func] || ['General', 'Professional'],
      faker.number.int({ min: 2, max: 5 })
    ),
    createdAt: subDays(new Date(), postedDaysAgo + faker.number.int({ min: 0, max: 5 })).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Generate job description
 */
function generateJobDescription(title: string, companyName: string, func: string): string {
  return `
## About the Role

We are looking for a talented ${title} to join our ${func} team at ${companyName}. This is an exciting opportunity to make a significant impact and grow your career with one of India's leading conglomerates.

## About ${companyName}

${companyName} is part of the Hinduja Group, a diversified conglomerate with presence across automotive, banking, IT services, and more. We are committed to innovation, excellence, and creating value for all stakeholders.

## What You'll Do

As a ${title}, you will be responsible for driving key initiatives within our ${func} function. You will work closely with cross-functional teams to deliver exceptional results and contribute to our organizational goals.

## Why Join Us

- Competitive compensation and benefits
- Opportunities for professional growth and development
- Work with talented professionals across the Hinduja Group
- Be part of a company with a strong legacy and exciting future
- Collaborative and inclusive work environment
`.trim()
}

/**
 * Generate 120+ mock jobs
 */
export const MOCK_JOBS: Job[] = Array.from({ length: 125 }, (_, i) => generateJob(i + 1))

/**
 * Get job by ID
 */
export function getJobById(id: string): Job | undefined {
  return MOCK_JOBS.find(job => job.id === id)
}

/**
 * Get jobs by company
 */
export function getJobsByCompany(companyId: string): Job[] {
  return MOCK_JOBS.filter(job => job.companyId === companyId)
}

/**
 * Get jobs by location
 */
export function getJobsByLocation(location: string): Job[] {
  return MOCK_JOBS.filter(job => job.location.toLowerCase() === location.toLowerCase())
}

/**
 * Get jobs by function
 */
export function getJobsByFunction(func: string): Job[] {
  return MOCK_JOBS.filter(job => job.function.toLowerCase() === func.toLowerCase())
}
