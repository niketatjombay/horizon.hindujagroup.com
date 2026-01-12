'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Phone, MapPin, Calendar, Hash } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ApplicantProfileHeaderProps {
  name: string
  email: string
  phone?: string
  location?: string
  avatarUrl?: string
  appliedAt: string
  applicationId: string
  className?: string
}

export function ApplicantProfileHeader({
  name,
  email,
  phone,
  location,
  avatarUrl,
  appliedAt,
  applicationId,
  className,
}: ApplicantProfileHeaderProps) {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('flex flex-col sm:flex-row gap-6', className)}>
      {/* Avatar */}
      <Avatar className="h-24 w-24 shrink-0">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="text-2xl font-semibold bg-primary-100 text-primary-700">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {name}
        </h1>

        {/* Contact Info Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{email}</span>
          </a>

          {/* Phone */}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>{phone}</span>
            </a>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          {/* Applied Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Applied {format(new Date(appliedAt), 'MMMM d, yyyy')}</span>
          </div>

          {/* Application ID */}
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs">{applicationId}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
