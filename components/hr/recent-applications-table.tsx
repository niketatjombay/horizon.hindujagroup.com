'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Application, ApplicationStatus } from '@/types'

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Applied',
  under_review: 'Reviewing',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview',
  offered: 'Offered',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

const STATUS_VARIANTS: Record<
  ApplicationStatus,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  submitted: 'info',
  under_review: 'warning',
  shortlisted: 'success',
  interview_scheduled: 'info',
  offered: 'success',
  accepted: 'success',
  rejected: 'error',
  withdrawn: 'default',
}

interface RecentApplicationsTableProps {
  applications: Application[]
  isLoading?: boolean
}

export function RecentApplicationsTable({
  applications,
  isLoading,
}: RecentApplicationsTableProps) {
  const router = useRouter()

  const handleRowClick = (applicationId: string) => {
    router.push(`/hr/applicants/${applicationId}`)
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Applied
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No recent applications</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Applicant
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Job Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Applied
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => {
              const initials = application.userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()

              return (
                <tr
                  key={application.id}
                  onClick={() => handleRowClick(application.id)}
                  className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(application.userName)}&background=random`}
                          alt={application.userName}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {application.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {application.jobTitle}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(application.appliedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS_VARIANTS[application.status]} size="sm">
                      {STATUS_LABELS[application.status]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="inline-block h-5 w-5 text-gray-400" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
