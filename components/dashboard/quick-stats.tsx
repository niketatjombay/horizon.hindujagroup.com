'use client'

import { useRouter } from 'next/navigation'
import { FileText, Bookmark, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  href?: string
  iconBg: string
  iconColor: string
}

function StatCard({
  icon,
  label,
  value,
  href,
  iconBg,
  iconColor,
}: StatCardProps) {
  const router = useRouter()
  const isClickable = !!href

  const handleClick = () => {
    if (href) {
      router.push(href)
    }
  }

  return (
    <Card
      hoverable={isClickable}
      className={cn(
        'flex flex-col p-6 shadow-card card-hover',
        isClickable && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
          iconBg
        )}
      >
        <div className={iconColor}>{icon}</div>
      </div>

      {/* Value */}
      <p className="mb-1 text-3xl font-bold text-gray-900">{value}</p>

      {/* Label */}
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </Card>
  )
}

interface QuickStatsProps {
  applicationsCount: number
  savedJobsCount: number
  profileCompletion: number
}

export function QuickStats({
  applicationsCount,
  savedJobsCount,
  profileCompletion,
}: QuickStatsProps) {
  return (
    <div className="mb-12 grid gap-6 md:grid-cols-3">
      <StatCard
        icon={<FileText className="h-6 w-6" />}
        label="My Applications"
        value={applicationsCount}
        href="/applications"
        iconBg="bg-primary-light"
        iconColor="text-primary"
      />

      <StatCard
        icon={<Bookmark className="h-6 w-6" />}
        label="Saved Jobs"
        value={savedJobsCount}
        href="/saved"
        iconBg="bg-warning-light"
        iconColor="text-warning-foreground"
      />

      <StatCard
        icon={<User className="h-6 w-6" />}
        label="Profile Completion"
        value={`${profileCompletion}%`}
        href="/profile"
        iconBg="bg-success-light"
        iconColor="text-success"
      />
    </div>
  )
}
