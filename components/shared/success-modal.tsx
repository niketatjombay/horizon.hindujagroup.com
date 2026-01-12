'use client'

import { CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  showCloseButton?: boolean
  className?: string
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  primaryAction,
  secondaryAction,
  showCloseButton = true,
  className,
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn('max-w-[400px] text-center', className)}
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </div>

        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-center text-xl">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {(primaryAction || secondaryAction) && (
          <DialogFooter className="flex-col gap-2 sm:flex-col sm:justify-center">
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className="w-full"
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="ghost"
                onClick={secondaryAction.onClick}
                className="w-full"
              >
                {secondaryAction.label}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Preset success modals
interface PresetSuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

export function ApplicationSubmittedModal({
  open,
  onOpenChange,
  onPrimaryAction,
  onSecondaryAction,
}: PresetSuccessModalProps) {
  return (
    <SuccessModal
      open={open}
      onOpenChange={onOpenChange}
      title="Application Submitted!"
      description="Your application has been successfully submitted. We'll notify you when there's an update."
      primaryAction={
        onPrimaryAction
          ? { label: 'View My Applications', onClick: onPrimaryAction }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? { label: 'Browse More Jobs', onClick: onSecondaryAction }
          : undefined
      }
    />
  )
}

export function ProfileUpdatedModal({
  open,
  onOpenChange,
  onPrimaryAction,
}: PresetSuccessModalProps) {
  return (
    <SuccessModal
      open={open}
      onOpenChange={onOpenChange}
      title="Profile Updated!"
      description="Your profile information has been saved successfully."
      primaryAction={
        onPrimaryAction
          ? { label: 'Continue', onClick: onPrimaryAction }
          : undefined
      }
    />
  )
}

export function JobSavedModal({
  open,
  onOpenChange,
  onPrimaryAction,
  onSecondaryAction,
}: PresetSuccessModalProps) {
  return (
    <SuccessModal
      open={open}
      onOpenChange={onOpenChange}
      title="Job Saved!"
      description="This job has been added to your saved jobs list."
      primaryAction={
        onPrimaryAction
          ? { label: 'View Saved Jobs', onClick: onPrimaryAction }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? { label: 'Continue Browsing', onClick: onSecondaryAction }
          : undefined
      }
    />
  )
}
