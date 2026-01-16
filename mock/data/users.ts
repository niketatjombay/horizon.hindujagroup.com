import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'
import type { User, UserRole, ExperienceLevel } from '@/types'
import { MOCK_COMPANIES } from './companies'

// Indian first names (common in corporate settings)
const INDIAN_FIRST_NAMES = [
  'Aarav', 'Aditya', 'Amit', 'Ananya', 'Anjali', 'Arjun', 'Deepak',
  'Divya', 'Gaurav', 'Harsh', 'Isha', 'Kavya', 'Kiran', 'Krishna',
  'Lakshmi', 'Manish', 'Meera', 'Neeraj', 'Neha', 'Nikhil', 'Pallavi',
  'Pooja', 'Priya', 'Rahul', 'Rajesh', 'Ravi', 'Ritika', 'Rohit',
  'Sandeep', 'Sanjay', 'Shivani', 'Shreya', 'Sneha', 'Suresh', 'Swati',
  'Tanvi', 'Varun', 'Vikram', 'Vinay', 'Vivek', 'Yash', 'Zara',
]

// Indian last names
const INDIAN_LAST_NAMES = [
  'Agarwal', 'Bansal', 'Bhatt', 'Choudhary', 'Das', 'Desai', 'Ghosh',
  'Gupta', 'Iyer', 'Jain', 'Joshi', 'Kapoor', 'Khan', 'Kumar', 'Malhotra',
  'Mehta', 'Menon', 'Mishra', 'Nair', 'Patel', 'Prasad', 'Rao', 'Reddy',
  'Sharma', 'Singh', 'Sinha', 'Subramanian', 'Thakur', 'Trivedi', 'Verma',
]

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Product Manager',
  'Senior Product Manager',
  'Data Analyst',
  'Business Analyst',
  'Marketing Manager',
  'Sales Executive',
  'HR Business Partner',
  'Financial Analyst',
  'Operations Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'Project Manager',
  'Quality Analyst',
  'Content Writer',
  'Customer Success Manager',
]

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'IT',
  'Legal',
  'Corporate Strategy',
]

const LOCATIONS = [
  'Mumbai',
  'Bangalore',
  'Delhi',
  'Pune',
  'Hyderabad',
  'Chennai',
]

/**
 * Generate a valid Indian phone number
 */
function generateIndianPhone(): string {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '91', '90', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70']
  const prefix = faker.helpers.arrayElement(prefixes)
  const suffix = faker.string.numeric(8)
  return `+91 ${prefix}${suffix.slice(0, 4)} ${suffix.slice(4)}`
}

/**
 * Generate email from name and company
 */
function generateEmail(firstName: string, lastName: string, companyName: string): string {
  const companyDomain = companyName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z]/g, '')
    .slice(0, 15)
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyDomain}.com`
}

/**
 * Generate avatar URL using ui-avatars
 */
function generateAvatarUrl(firstName: string, lastName: string): string {
  const name = encodeURIComponent(`${firstName} ${lastName}`)
  const bgColor = faker.helpers.arrayElement(['0066FF', '7B61FF', '00B87C', 'FFA733'])
  return `https://ui-avatars.com/api/?name=${name}&size=96&background=${bgColor}&color=fff`
}

/**
 * Generate a single mock user
 */
function generateUser(id: number, role: UserRole = 'employee'): User {
  const firstName = faker.helpers.arrayElement(INDIAN_FIRST_NAMES)
  const lastName = faker.helpers.arrayElement(INDIAN_LAST_NAMES)
  const company = faker.helpers.arrayElement(MOCK_COMPANIES)
  const createdDaysAgo = faker.number.int({ min: 30, max: 365 })

  return {
    id: id.toString(),
    email: generateEmail(firstName, lastName, company.name),
    firstName,
    lastName,
    role,
    department: faker.helpers.arrayElement(DEPARTMENTS),
    companyId: company.id,
    companyName: company.name,
    currentJobTitle: faker.helpers.arrayElement(JOB_TITLES),
    location: faker.helpers.arrayElement(LOCATIONS),
    phone: generateIndianPhone(),
    avatarUrl: generateAvatarUrl(firstName, lastName),
    status: 'active',
    emailVerified: true,
    lastLoginAt: subDays(new Date(), faker.number.int({ min: 0, max: 7 })).toISOString(),
    createdAt: subDays(new Date(), createdDaysAgo).toISOString(),
    updatedAt: subDays(new Date(), faker.number.int({ min: 0, max: 14 })).toISOString(),
  }
}

/**
 * Demo users for login page
 */
const DEMO_USERS: User[] = [
  {
    id: 'demo-employee',
    email: 'rahul.sharma@hinduja.com',
    firstName: 'Rahul',
    lastName: 'Sharma',
    role: 'employee',
    department: 'Engineering',
    companyId: '1',
    companyName: 'Ashok Leyland',
    currentJobTitle: 'Senior Software Engineer',
    location: 'Chennai',
    phone: '+91 9876 543210',
    avatarUrl: 'https://ui-avatars.com/api/?name=Rahul+Sharma&size=96&background=0066FF&color=fff',
    status: 'active',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: subDays(new Date(), 180).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-hr',
    email: 'priya.mehta@hinduja.com',
    firstName: 'Priya',
    lastName: 'Mehta',
    role: 'hr',
    department: 'Human Resources',
    companyId: '1',
    companyName: 'Ashok Leyland',
    currentJobTitle: 'HR Business Partner',
    location: 'Mumbai',
    phone: '+91 9876 543211',
    avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Mehta&size=96&background=7B61FF&color=fff',
    status: 'active',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: subDays(new Date(), 365).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-chro',
    email: 'vikram.singh@hinduja.com',
    firstName: 'Vikram',
    lastName: 'Singh',
    role: 'chro',
    department: 'Human Resources',
    companyId: '1',
    companyName: 'Hinduja Group',
    currentJobTitle: 'Chief Human Resources Officer',
    location: 'Mumbai',
    phone: '+91 9876 543212',
    avatarUrl: 'https://ui-avatars.com/api/?name=Vikram+Singh&size=96&background=00B87C&color=fff',
    status: 'active',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: subDays(new Date(), 500).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-admin',
    email: 'anita.desai@hinduja.com',
    firstName: 'Anita',
    lastName: 'Desai',
    role: 'admin',
    department: 'IT',
    companyId: '1',
    companyName: 'Hinduja Group',
    currentJobTitle: 'System Administrator',
    location: 'Mumbai',
    phone: '+91 9876 543213',
    avatarUrl: 'https://ui-avatars.com/api/?name=Anita+Desai&size=96&background=FFA733&color=fff',
    status: 'active',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: subDays(new Date(), 400).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Generate mock users with distribution of roles
 */
function generateMockUsers(count: number): User[] {
  // Start with demo users
  const users: User[] = [...DEMO_USERS]

  // Add more HR users (5)
  for (let i = 0; i < 5; i++) {
    users.push(generateUser(users.length + 1, 'hr'))
  }

  // Add more CHRO users (2)
  for (let i = 0; i < 2; i++) {
    users.push(generateUser(users.length + 1, 'chro'))
  }

  // Add more Admin users (2)
  for (let i = 0; i < 2; i++) {
    users.push(generateUser(users.length + 1, 'admin'))
  }

  // Rest are regular employees
  while (users.length < count) {
    users.push(generateUser(users.length + 1, 'employee'))
  }

  return users
}

/**
 * 50 mock users with various roles
 */
export const MOCK_USERS: User[] = generateMockUsers(50)

/**
 * Get the current authenticated user (first user in the list)
 */
export function getCurrentUser(): User {
  return MOCK_USERS[0]
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find(user => user.id === id)
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find(user => user.email.toLowerCase() === email.toLowerCase())
}

/**
 * Get users by role
 */
export function getUsersByRole(role: UserRole): User[] {
  return MOCK_USERS.filter(user => user.role === role)
}

/**
 * Get users by company
 */
export function getUsersByCompany(companyId: string): User[] {
  return MOCK_USERS.filter(user => user.companyId === companyId)
}
