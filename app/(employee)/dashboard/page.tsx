'use client'

import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { SearchBar } from '@/components/shared/search-bar'
import { QuickStats, SectionHeader } from '@/components/dashboard'
import { JobCardGrid } from '@/components/jobs/job-card-grid'
import { CardSkeleton } from '@/components/shared/loading-skeleton'
import { EmptyState } from '@/components/shared/empty-state'
import { useJobs, useSaveJob } from '@/lib/hooks/use-jobs'

export default function EmployeeDashboardPage() {
  const router = useRouter()

  // Fetch recommended jobs (first 6)
  const { data: recommendedData, isLoading: isLoadingRecommended } = useJobs({
    pageSize: 6,
  })

  // Fetch recent jobs (first 6, sorted by date)
  const { data: recentData, isLoading: isLoadingRecent } = useJobs({
    pageSize: 6,
  })

  const saveJobMutation = useSaveJob()

  // Mock stats - in real app, these would come from API
  const stats = {
    applications: 3,
    savedJobs: 8,
    profileCompletion: 85,
  }

  const recommendedJobs = recommendedData?.data || []
  const recentJobs = recentData?.data || []

  const handleSaveToggle = (jobId: string, _isSaved: boolean) => {
    saveJobMutation.mutate(jobId)
  }

  const handleSearch = (query: string) => {
    router.push(`/jobs?search=${encodeURIComponent(query)}`)
  }

  return (
    <div className="space-y-10">
      {/* Hero Section with Search */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-8 text-center shadow-lg md:p-12">
        <h1 className="mb-3 text-h1 font-bold text-white">
          Find Your Next Opportunity
        </h1>
        <p className="mb-8 text-body text-white/90">
          Explore exciting roles across 17 companies in the Hinduja Group
        </p>

        {/* Search Bar */}
        <div className="mx-auto max-w-2xl">
          <SearchBar
            placeholder="Search for jobs, skills, or companies..."
            className="w-full"
            onSearch={handleSearch}
            expandOnFocus={false}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats
        applicationsCount={stats.applications}
        savedJobsCount={stats.savedJobs}
        profileCompletion={stats.profileCompletion}
      />

      {/* Recommended Jobs Section */}
      <section>
        <SectionHeader
          title="Recommended for You"
          viewAllHref="/jobs"
          viewAllLabel="Browse All Jobs"
        />

        {isLoadingRecommended ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : recommendedJobs.length > 0 ? (
          <JobCardGrid jobs={recommendedJobs} onSaveToggle={handleSaveToggle} />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No recommendations yet"
            description="Complete your profile to get personalized job recommendations."
            actionLabel="Complete Profile"
            onAction={() => router.push('/profile')}
            size="small"
          />
        )}
      </section>

      {/* Recent Jobs Section */}
      <section>
        <SectionHeader title="Recently Posted" viewAllHref="/jobs" />

        {isLoadingRecent ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <JobCardGrid jobs={recentJobs} onSaveToggle={handleSaveToggle} />
        ) : (
          <EmptyState
            title="No recent jobs"
            description="Check back soon for new opportunities."
            size="small"
          />
        )}
      </section>
    </div>
  )
}
