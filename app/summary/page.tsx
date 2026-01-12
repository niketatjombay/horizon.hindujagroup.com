'use client'

import Link from 'next/link'
import {
  User,
  Users,
  BarChart3,
  Shield,
  Briefcase,
  FileText,
  Search,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  Building2,
  TrendingUp,
  Settings,
  Database,
  PieChart,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  LayoutDashboard,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'

interface UserFlow {
  role: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  credentials: {
    username: string
    password: string
  }
  dashboardPath: string
  features: {
    category: string
    items: {
      name: string
      path: string
      description: string
      icon: React.ReactNode
    }[]
  }[]
}

const USER_FLOWS: UserFlow[] = [
  {
    role: 'employee',
    label: 'Employee',
    icon: <User className="h-6 w-6" />,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary',
    credentials: {
      username: 'employee@hinduja.com',
      password: 'employee123',
    },
    dashboardPath: '/dashboard',
    features: [
      {
        category: 'Dashboard',
        items: [
          {
            name: 'Employee Dashboard',
            path: '/dashboard',
            description: 'Overview of job recommendations, saved jobs, and application status',
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Job Search & Discovery',
        items: [
          {
            name: 'Browse All Jobs',
            path: '/jobs',
            description: 'View all available internal job postings with filters',
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            name: 'Search Jobs',
            path: '/jobs',
            description: 'Search by title, company, location, or keywords',
            icon: <Search className="h-4 w-4" />,
          },
          {
            name: 'Filter Jobs',
            path: '/jobs',
            description: 'Filter by company, department, job type, experience level',
            icon: <Filter className="h-4 w-4" />,
          },
          {
            name: 'View Job Details',
            path: '/jobs/[id]',
            description: 'See full job description, requirements, and company info',
            icon: <FileText className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Applications',
        items: [
          {
            name: 'Apply to Jobs',
            path: '/jobs/[id]',
            description: 'Submit application with resume and cover letter',
            icon: <Plus className="h-4 w-4" />,
          },
          {
            name: 'My Applications',
            path: '/applications',
            description: 'Track all submitted applications and their status',
            icon: <Clock className="h-4 w-4" />,
          },
          {
            name: 'Application Status',
            path: '/applications',
            description: 'View status: Pending, Shortlisted, Interview, Offered, etc.',
            icon: <CheckCircle className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Saved Items',
        items: [
          {
            name: 'Save Jobs',
            path: '/jobs',
            description: 'Bookmark jobs for later review',
            icon: <Heart className="h-4 w-4" />,
          },
          {
            name: 'Saved Jobs List',
            path: '/saved',
            description: 'View and manage saved job postings',
            icon: <Heart className="h-4 w-4" />,
          },
        ],
      },
    ],
  },
  {
    role: 'hr',
    label: 'HR Manager',
    icon: <Users className="h-6 w-6" />,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary',
    credentials: {
      username: 'hr@hinduja.com',
      password: 'hr123',
    },
    dashboardPath: '/hr/dashboard',
    features: [
      {
        category: 'Dashboard',
        items: [
          {
            name: 'HR Dashboard',
            path: '/hr/dashboard',
            description: 'Hiring metrics, pipeline overview, recent activity',
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Job Management',
        items: [
          {
            name: 'View Company Jobs',
            path: '/hr/jobs',
            description: 'See all job postings for your company',
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            name: 'Create New Job',
            path: '/hr/jobs/new',
            description: 'Post a new internal job opening',
            icon: <Plus className="h-4 w-4" />,
          },
          {
            name: 'Edit Job',
            path: '/hr/jobs/[id]/edit',
            description: 'Update job details, requirements, status',
            icon: <Edit className="h-4 w-4" />,
          },
          {
            name: 'Close/Archive Job',
            path: '/hr/jobs',
            description: 'Mark jobs as filled or archived',
            icon: <Trash2 className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Applicant Management',
        items: [
          {
            name: 'View All Applicants',
            path: '/hr/applicants',
            description: 'See all applications across company jobs',
            icon: <Users className="h-4 w-4" />,
          },
          {
            name: 'Filter by Job',
            path: '/hr/applicants?jobId=[id]',
            description: 'View applicants for a specific job posting',
            icon: <Filter className="h-4 w-4" />,
          },
          {
            name: 'View Applicant Details',
            path: '/hr/applicants/[id]',
            description: 'Full application, resume, notes, history',
            icon: <Eye className="h-4 w-4" />,
          },
          {
            name: 'Update Application Status',
            path: '/hr/applicants',
            description: 'Move through pipeline: Shortlist, Interview, Offer, Hire/Reject',
            icon: <CheckCircle className="h-4 w-4" />,
          },
          {
            name: 'Bulk Status Update',
            path: '/hr/applicants',
            description: 'Update multiple applications at once',
            icon: <CheckCircle className="h-4 w-4" />,
          },
          {
            name: 'Add Notes',
            path: '/hr/applicants/[id]',
            description: 'Add interview notes and feedback',
            icon: <FileText className="h-4 w-4" />,
          },
        ],
      },
    ],
  },
  {
    role: 'chro',
    label: 'CHRO',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success',
    credentials: {
      username: 'chro@hinduja.com',
      password: 'chro123',
    },
    dashboardPath: '/chro/dashboard',
    features: [
      {
        category: 'Dashboard',
        items: [
          {
            name: 'CHRO Dashboard',
            path: '/chro/dashboard',
            description: 'Group-wide hiring metrics, trends, company performance',
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Analytics & Insights',
        items: [
          {
            name: 'Group Metrics',
            path: '/chro/dashboard',
            description: 'Total applications, hires, time-to-hire across all companies',
            icon: <TrendingUp className="h-4 w-4" />,
          },
          {
            name: 'Company Comparison',
            path: '/chro/dashboard',
            description: 'Compare hiring performance across group companies',
            icon: <Building2 className="h-4 w-4" />,
          },
          {
            name: 'Trend Analysis',
            path: '/chro/dashboard',
            description: 'View hiring trends over time with charts',
            icon: <PieChart className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Reports',
        items: [
          {
            name: 'Hiring Overview Report',
            path: '/chro/reports',
            description: 'Comprehensive hiring metrics and status breakdown',
            icon: <FileText className="h-4 w-4" />,
          },
          {
            name: 'Company Comparison Report',
            path: '/chro/reports',
            description: 'Side-by-side company performance analysis',
            icon: <Building2 className="h-4 w-4" />,
          },
          {
            name: 'Department Analysis Report',
            path: '/chro/reports',
            description: 'Hiring metrics by department across group',
            icon: <Users className="h-4 w-4" />,
          },
          {
            name: 'Time-to-Hire Report',
            path: '/chro/reports',
            description: 'Analysis of hiring speed and bottlenecks',
            icon: <Clock className="h-4 w-4" />,
          },
          {
            name: 'Pipeline Analysis Report',
            path: '/chro/reports',
            description: 'Funnel analysis and conversion rates',
            icon: <Filter className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Export & Share',
        items: [
          {
            name: 'Export to PDF',
            path: '/chro/reports',
            description: 'Generate PDF reports for presentations',
            icon: <Download className="h-4 w-4" />,
          },
          {
            name: 'Export to Excel',
            path: '/chro/reports',
            description: 'Download data for further analysis',
            icon: <Download className="h-4 w-4" />,
          },
          {
            name: 'Export to CSV',
            path: '/chro/reports',
            description: 'Raw data export for custom processing',
            icon: <Download className="h-4 w-4" />,
          },
        ],
      },
    ],
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: <Shield className="h-6 w-6" />,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning',
    credentials: {
      username: 'admin@hinduja.com',
      password: 'admin123',
    },
    dashboardPath: '/admin/dashboard',
    features: [
      {
        category: 'Dashboard',
        items: [
          {
            name: 'Admin Dashboard',
            path: '/admin/dashboard',
            description: 'System overview, user stats, recent activity',
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'User Management',
        items: [
          {
            name: 'View All Users',
            path: '/admin/users',
            description: 'List all users with search and filters',
            icon: <Users className="h-4 w-4" />,
          },
          {
            name: 'Create User',
            path: '/admin/users',
            description: 'Add new user with role assignment',
            icon: <Plus className="h-4 w-4" />,
          },
          {
            name: 'Edit User',
            path: '/admin/users',
            description: 'Update user details, company, role',
            icon: <Edit className="h-4 w-4" />,
          },
          {
            name: 'Activate/Deactivate User',
            path: '/admin/users',
            description: 'Enable or disable user accounts',
            icon: <CheckCircle className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'Company Management',
        items: [
          {
            name: 'View All Companies',
            path: '/admin/companies',
            description: 'List all Hinduja Group companies',
            icon: <Building2 className="h-4 w-4" />,
          },
          {
            name: 'Add Company',
            path: '/admin/companies',
            description: 'Register new group company',
            icon: <Plus className="h-4 w-4" />,
          },
          {
            name: 'Edit Company',
            path: '/admin/companies',
            description: 'Update company details and settings',
            icon: <Edit className="h-4 w-4" />,
          },
          {
            name: 'Manage HR Mapping',
            path: '/admin/companies',
            description: 'Assign HR managers to companies',
            icon: <Users className="h-4 w-4" />,
          },
        ],
      },
      {
        category: 'System Settings',
        items: [
          {
            name: 'System Configuration',
            path: '/admin/settings',
            description: 'Application-wide settings and defaults',
            icon: <Settings className="h-4 w-4" />,
          },
          {
            name: 'Data Sync',
            path: '/admin/settings',
            description: 'Manual sync triggers and status',
            icon: <Database className="h-4 w-4" />,
          },
        ],
      },
    ],
  },
]

const TECH_STACK = [
  { name: 'Next.js 14', description: 'App Router, Server Components' },
  { name: 'React 18', description: 'Client Components, Hooks' },
  { name: 'TypeScript', description: 'Full type safety' },
  { name: 'Tailwind CSS', description: 'Utility-first styling' },
  { name: 'Shadcn/UI', description: 'Component library base' },
  { name: 'React Query', description: 'Data fetching & caching' },
  { name: 'Lucide Icons', description: 'Icon library' },
  { name: 'Recharts', description: 'Chart visualizations' },
]

const IMPLEMENTATION_HIGHLIGHTS = [
  'Role-based access control (Employee, HR, CHRO, Admin)',
  'Responsive design for desktop and mobile',
  'Mock data layer simulating real API responses',
  'Client-side filtering, sorting, and pagination',
  'Real-time status updates with optimistic UI',
  'Chart visualizations for analytics',
  'Export functionality (PDF, Excel, CSV)',
  'Bulk operations for HR workflows',
  'Drill-down analytics for CHRO reports',
  'Dark-themed header with company branding',
]

export default function SummaryPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Horizon Implementation Summary
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete reference for testing all user flows in the Internal Job Portal.
            Use this guide to navigate through each user role and verify functionality.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Start Testing
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {USER_FLOWS.map((flow) => (
              <div key={flow.role} className="text-center">
                <div className={`mx-auto h-12 w-12 rounded-xl ${flow.bgColor} ${flow.color} flex items-center justify-center mb-2`}>
                  {flow.icon}
                </div>
                <p className="font-medium text-gray-900">{flow.label}</p>
                <p className="text-xs text-gray-600 mb-2">{flow.credentials.username}</p>
                <Link href="/login">
                  <Button size="sm" variant="secondary" className="gap-1">
                    Login <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* User Flows */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            User Flows by Role
          </h2>

          {USER_FLOWS.map((flow) => (
            <Card key={flow.role} className={`overflow-hidden border-l-4 ${flow.borderColor}`}>
              {/* Role Header */}
              <div className="p-6 bg-white border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl ${flow.bgColor} ${flow.color} flex items-center justify-center`}>
                      {flow.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {flow.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Dashboard: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{flow.dashboardPath}</code>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Username:</span>{' '}
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{flow.credentials.username}</code>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Password:</span>{' '}
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{flow.credentials.password}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 bg-gray-50">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flow.features.map((category) => (
                    <div key={category.category}>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {category.category}
                      </h4>
                      <ul className="space-y-2">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className={`mt-0.5 ${flow.color}`}>{item.icon}</span>
                            <div>
                              <span className="font-medium text-gray-800">{item.name}</span>
                              <p className="text-gray-500 text-xs">{item.description}</p>
                              <code className="text-xs text-gray-400">{item.path}</code>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Implementation Highlights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Implementation Highlights
            </h2>
            <ul className="space-y-2">
              {IMPLEMENTATION_HIGHLIGHTS.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tech Stack
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {TECH_STACK.map((tech, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 text-sm">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Testing Checklist */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Testing Checklist
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <User className="h-4 w-4" /> Employee Tests
              </h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>[ ] View job listings</li>
                <li>[ ] Search and filter jobs</li>
                <li>[ ] View job details</li>
                <li>[ ] Apply to a job</li>
                <li>[ ] Save/unsave jobs</li>
                <li>[ ] View applications</li>
                <li>[ ] Check application status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> HR Manager Tests
              </h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>[ ] View HR dashboard</li>
                <li>[ ] View company jobs</li>
                <li>[ ] Create new job posting</li>
                <li>[ ] Edit existing job</li>
                <li>[ ] View applicants list</li>
                <li>[ ] Filter applicants</li>
                <li>[ ] Change application status</li>
                <li>[ ] Bulk status update</li>
                <li>[ ] View applicant details</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-success mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> CHRO Tests
              </h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>[ ] View CHRO dashboard</li>
                <li>[ ] Check group metrics</li>
                <li>[ ] View charts and trends</li>
                <li>[ ] Access reports page</li>
                <li>[ ] Switch report types</li>
                <li>[ ] Apply date filters</li>
                <li>[ ] Apply company filters</li>
                <li>[ ] Export to PDF</li>
                <li>[ ] Export to Excel/CSV</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-warning mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Admin Tests
              </h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>[ ] View admin dashboard</li>
                <li>[ ] View users list</li>
                <li>[ ] Filter users by role</li>
                <li>[ ] Create new user</li>
                <li>[ ] Edit user details</li>
                <li>[ ] Activate/deactivate user</li>
                <li>[ ] View companies list</li>
                <li>[ ] Add new company</li>
                <li>[ ] Edit company details</li>
              </ul>
            </div>
          </div>
        </Card>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
            <Link href="/login">
              <Button className="gap-2">
                Start Testing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
