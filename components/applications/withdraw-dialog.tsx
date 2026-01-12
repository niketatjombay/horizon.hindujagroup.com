'use client'

import { AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Application } from '@/types'

interface WithdrawDialogProps {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (application: Application) => void
  isLoading?: boolean
}

export function WithdrawDialog({
  application,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: WithdrawDialogProps) {
  const handleConfirm = () => {
    if (application) {
      onConfirm(application)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Withdraw Application?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to withdraw your application for{' '}
            <span className="font-medium text-gray-900">
              {application?.jobTitle}
            </span>{' '}
            at{' '}
            <span className="font-medium text-gray-900">
              {application?.userCompanyName}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-row gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:flex-none"
          >
            {isLoading ? 'Withdrawing...' : 'Yes, Withdraw'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
