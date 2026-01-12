'use client'

import { format } from 'date-fns'
import { ExternalLink, Calendar, User, Globe, FileText, Tag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ActivityLogEntry, ActivityAction } from '@/lib/hooks/use-admin'

interface ActivityDetailModalProps {
  activity: ActivityLogEntry | null
  open: boolean
  onClose: () => void
}

const actionColors: Record<ActivityAction, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  login: 'success',
  logout: 'default',
  create: 'success',
  update: 'info',
  delete: 'error',
  apply: 'info',
  status_change: 'warning',
}

const actionLabels: Record<ActivityAction, string> = {
  login: 'Login',
  logout: 'Logout',
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  apply: 'Apply',
  status_change: 'Status Change',
}

const roleColors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  admin: 'error',
  chro: 'warning',
  hr: 'info',
  employee: 'default',
}

export function ActivityDetailModal({
  activity,
  open,
  onClose,
}: ActivityDetailModalProps) {
  if (!activity) return null

  const handleViewRelated = () => {
    // In production, this would navigate to the related resource
    const resourcePath = activity.resource.toLowerCase()
    const url = `/${resourcePath}s/${activity.resourceId}`
    // For now, just show an alert
    alert(`Would navigate to: ${url}`)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            Activity Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timestamp */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Timestamp</p>
              <p className="font-medium text-gray-900">
                {format(new Date(activity.timestamp), 'PPpp')}
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium text-gray-900">
                {activity.user.name}
              </p>
              <p className="text-sm text-gray-600">{activity.user.email}</p>
              <div className="mt-1">
                <Badge
                  variant={roleColors[activity.user.role] || 'default'}
                  size="sm"
                >
                  {activity.user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Tag className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Action</p>
              <Badge variant={actionColors[activity.action]} className="mt-1">
                {actionLabels[activity.action]}
              </Badge>
            </div>
          </div>

          {/* Resource */}
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Resource
              </p>
              <Badge variant="default" size="sm">
                {activity.resource}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              ID: <code className="font-mono">{activity.resourceId}</code>
            </p>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Details</p>
            <p className="text-gray-900">{activity.details}</p>
          </div>

          {/* IP Address */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Globe className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">IP Address</p>
              <code className="font-mono text-sm text-gray-900">
                {activity.ipAddress}
              </code>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleViewRelated}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Related
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
