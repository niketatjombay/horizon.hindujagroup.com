'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Clock, Briefcase } from 'lucide-react'
import {
  MetricCard,
  RecentApplicationsTable,
  TopJobsList,
} from '@/components/hr'
import { useAuth } from '@/lib/hooks'
import { useApplications } from '@/lib/hooks/use-applications'
import { useJobs } from '@/lib/hooks/use-jobs'
import { cn } from '@/lib/utils'
import type { Job, ApplicationStatus } from '@/types'

type QuickFilter = 'all' | 'submitted' | 'under_review' | 'shortlisted'

const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'submitted', label: 'New' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
]

export default function HRDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')

  // Fetch recent applications
  const {
    data: applications = [],
    isLoading: isLoadingApplications,
  } = useApplications({ sortBy: 'newest', pageSize: 10 })

  // Fetch jobs for top jobs list
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs({
    status: 'open',
    pageSize: 100,
  })

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalApplications = applications.length
    const pendingReview = applications.filter(
      (app) => app.status === 'submitted' || app.status === 'under_review'
    ).length
    const openPositions = jobsData?.data.filter((job) => job.status === 'open').length || 0

    return {
      totalApplications,
      pendingReview,
      openPositions,
    }
  }, [applications, jobsData])

  // Filter applications based on quick filter
  const filteredApplications = useMemo(() => {
    if (quickFilter === 'all') return applications.slice(0, 10)
    return applications
      .filter((app) => app.status === quickFilter)
      .slice(0, 10)
  }, [applications, quickFilter])

  // Calculate top jobs by application count
  const topJobs = useMemo(() => {
    if (!jobsData?.data) return []

    const jobs = [...jobsData.data]
      .sort((a, b) => b.applicationsCount - a.applicationsCount)
      .slice(0, 5)
      .map((job: Job) => ({
        job,
        applicantsCount: job.applicationsCount,
        newToday: Math.floor(Math.random() * 3), // Mock new today value
      }))

    return jobs
  }, [jobsData])

  const isLoading = isLoadingApplications || isLoadingJobs
  const firstName = user?.firstName || 'there'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Welcome, {firstName}!
        </h1>
        <p className="mt-1 text-gray-600">
          Here&apos;s what&apos;s happening with your job postings today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={FileText}
          label="Total Applications"
          value={isLoading ? '-' : metrics.totalApplications}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() => router.push('/hr/applicants')}
        />
        <MetricCard
          icon={Clock}
          label="Pending Review"
          value={isLoading ? '-' : metrics.pendingReview}
          iconBg="bg-warning/10"
          iconColor="text-warning"
          onClick={() => router.push('/hr/applicants?status=under_review')}
        />
        <MetricCard
          icon={Briefcase}
          label="Open Positions"
          value={isLoading ? '-' : metrics.openPositions}
          iconBg="bg-success/10"
          iconColor="text-success"
          onClick={() => router.push('/hr/jobs?status=open')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Applications
            </h2>
            {/* Quick Filters */}
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setQuickFilter(filter.id)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-full border transition-colors',
                    quickFilter === filter.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <RecentApplicationsTable
            applications={filteredApplications}
            isLoading={isLoadingApplications}
          />
        </div>

        {/* Top Jobs Sidebar */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Top Jobs
          </h2>
          <TopJobsList jobs={topJobs} isLoading={isLoadingJobs} />
        </div>
      </div>
    </div>
  )
}
