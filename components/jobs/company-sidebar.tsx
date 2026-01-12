import Image from 'next/image'
import { Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CompanySidebarProps {
  company: {
    name: string
    logo: string
    description?: string
    employeeCount?: string
    activeJobs?: number
  }
}

export function CompanySidebar({ company }: CompanySidebarProps) {
  return (
    <aside className="lg:sticky lg:top-20">
      <Card className="p-6">
        {/* Company Logo */}
        <div className="mb-4 flex h-30 items-center justify-center rounded-lg bg-gray-50 p-4">
          <div className="relative h-full w-full">
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-contain"
              sizes="(max-width: 360px) 100vw, 360px"
            />
          </div>
        </div>

        {/* Company Name */}
        <h3 className="mb-2 text-h3 font-semibold text-gray-900">
          {company.name}
        </h3>

        {/* Description */}
        {company.description && (
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {company.description}
          </p>
        )}

        {/* Stats */}
        {(company.employeeCount || company.activeJobs) && (
          <div className="mb-4 grid grid-cols-2 gap-3">
            {company.employeeCount && (
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <Users className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-h4 font-bold text-primary">
                  {company.employeeCount}
                </p>
                <p className="text-xs text-gray-600">Employees</p>
              </div>
            )}

            {typeof company.activeJobs === 'number' && (
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <Briefcase className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-h4 font-bold text-primary">
                  {company.activeJobs}
                </p>
                <p className="text-xs text-gray-600">Open Jobs</p>
              </div>
            )}
          </div>
        )}

        {/* View Company Button */}
        <Button variant="ghost" size="md" className="w-full">
          View Company Profile
        </Button>
      </Card>
    </aside>
  )
}
