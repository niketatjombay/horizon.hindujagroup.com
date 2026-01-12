'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, Phone, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactActionsProps {
  email: string
  phone?: string
  onScheduleInterview?: () => void
  className?: string
}

export function ContactActions({
  email,
  phone,
  onScheduleInterview,
  className,
}: ContactActionsProps) {
  return (
    <Card className={cn('p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contact Applicant
      </h3>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        {/* Send Email */}
        <Button
          variant="secondary"
          className="w-full justify-start gap-3"
          asChild
        >
          <a href={`mailto:${email}`}>
            <Mail className="h-4 w-4" />
            Send Email
          </a>
        </Button>

        {/* Call */}
        {phone && (
          <Button
            variant="secondary"
            className="w-full justify-start gap-3"
            asChild
          >
            <a href={`tel:${phone}`}>
              <Phone className="h-4 w-4" />
              Call Applicant
            </a>
          </Button>
        )}

        {/* Schedule Interview */}
        <Button
          variant="secondary"
          className="w-full justify-start gap-3"
          onClick={onScheduleInterview}
        >
          <Calendar className="h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Contact Details */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3">
          Contact Details
        </h4>
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <a
                href={`mailto:${email}`}
                className="text-sm text-gray-900 hover:text-primary transition-colors"
              >
                {email}
              </a>
            </div>
          </div>

          {/* Phone */}
          {phone && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <a
                  href={`tel:${phone}`}
                  className="text-sm text-gray-900 hover:text-primary transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
