'use client'

import { useRouter } from 'next/navigation'
import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuickActions() {
  const router = useRouter()

  return (
    <div className="rounded-xl bg-gray-100 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          onClick={() => router.push('/hr/jobs/new')}
        >
          <Plus className="mr-2 h-5 w-5" />
          Post New Job
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => router.push('/hr/applicants')}
        >
          <Users className="mr-2 h-5 w-5" />
          Review Applications
        </Button>
      </div>
    </div>
  )
}
