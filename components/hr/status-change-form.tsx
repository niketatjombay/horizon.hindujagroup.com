'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APPLICATION_STATUS_OPTIONS, getStatusOption } from './status-change-dropdown'
import type { ApplicationStatus } from '@/types'

interface StatusChangeFormProps {
  currentStatus: ApplicationStatus
  onStatusChange: (newStatus: ApplicationStatus, notes?: string) => Promise<void>
  disabled?: boolean
  className?: string
}

// Statuses that require confirmation
const CONFIRMATION_REQUIRED_STATUSES: ApplicationStatus[] = ['rejected', 'offered']

export function StatusChangeForm({
  currentStatus,
  onStatusChange,
  disabled = false,
  className,
}: StatusChangeFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(currentStatus)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const currentOption = getStatusOption(currentStatus)
  const selectedOption = getStatusOption(selectedStatus)
  const hasChanges = selectedStatus !== currentStatus
  const needsConfirmation = CONFIRMATION_REQUIRED_STATUSES.includes(selectedStatus)

  const handleUpdate = async () => {
    if (!hasChanges) return

    // Check if confirmation is needed
    if (needsConfirmation && !showConfirmDialog) {
      setShowConfirmDialog(true)
      return
    }

    setIsLoading(true)
    try {
      await onStatusChange(selectedStatus, notes || undefined)
      setNotes('')
      setShowConfirmDialog(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setSelectedStatus(currentStatus)
    setNotes('')
    setShowConfirmDialog(false)
  }

  return (
    <>
      <Card className={cn('p-6', className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Update Status
        </h3>

        {/* Current Status Badge */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Current Status
          </label>
          <div
            className={cn(
              'inline-flex items-center px-4 py-2 rounded-lg text-base font-semibold',
              currentOption.bgColor,
              currentOption.color
            )}
          >
            {currentOption.label}
          </div>
        </div>

        {/* Status Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            New Status
          </label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as ApplicationStatus)}
            disabled={disabled || isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <span className={cn('font-medium', selectedOption.color)}>
                  {selectedOption.label}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {APPLICATION_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className={cn('font-medium', option.color)}>
                    {option.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Notes (Optional)
          </label>
          <Textarea
            placeholder="Add a note about this status change..."
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 500))}
            disabled={disabled || isLoading}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {notes.length}/500
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleUpdate}
            disabled={disabled || isLoading || !hasChanges}
            className="flex-1"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Status
          </Button>
          {hasChanges && (
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              You are about to change the status to{' '}
              <span className={cn('font-semibold', selectedOption.color)}>
                {selectedOption.label}
              </span>
              . This action will be recorded in the application timeline and may
              notify the applicant.
            </DialogDescription>
          </DialogHeader>

          {notes && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="text-gray-600 mb-1">Note:</p>
              <p className="text-gray-900">{notes}</p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isLoading}
              className={cn(
                selectedStatus === 'rejected' && 'bg-error hover:bg-error/90',
                selectedStatus === 'offered' && 'bg-success hover:bg-success/90'
              )}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
