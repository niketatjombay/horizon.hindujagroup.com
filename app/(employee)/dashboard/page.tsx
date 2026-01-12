'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, FileText, Bookmark, User } from 'lucide-react'
import { SearchBar } from '@/components/shared/search-bar'
import { SectionHeader } from '@/components/dashboard'
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
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 md:p-8">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold text-primary md:text-3xl">
            Find Your Next Opportunity
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            Explore roles across 17 companies in the Hinduja Group
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-xl rounded-full border border-gray-300 bg-white shadow-sm">
            <SearchBar
              placeholder="Search jobs, skills, or companies..."
              className="w-full"
              onSearch={handleSearch}
              expandOnFocus={false}
            />
          </div>

          {/* Inline Stats */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/jobs?tab=applications"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <FileText className="h-3.5 w-3.5 text-gray-500" />
              <span>{stats.applications} Applications</span>
            </Link>
            <Link
              href="/jobs?tab=saved"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <Bookmark className="h-3.5 w-3.5 text-gray-500" />
              <span>{stats.savedJobs} Saved</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span>{stats.profileCompletion}% Profile</span>
            </Link>
          </div>
        </div>
      </div>

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
