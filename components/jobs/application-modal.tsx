'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared/form-field'
import { FileUpload } from '@/components/shared/file-upload'
import { FormError } from '@/components/shared/form-error'
import { ApplicationSubmittedModal } from '@/components/shared/success-modal'
import { useAuth } from '@/lib/hooks/use-auth'
import { useSubmitApplication } from '@/lib/hooks/use-applications'
import type { Job } from '@/types'

interface ApplicationModalProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Validation schema
const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      'Please enter a valid phone number (e.g., +919876543210)'
    ),
  coverLetter: z
    .string()
    .max(500, 'Cover letter must be 500 characters or less')
    .optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

const MAX_COVER_LETTER_LENGTH = 500

export function ApplicationModal({
  job,
  open,
  onOpenChange,
}: ApplicationModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const submitMutation = useSubmitApplication()

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
    },
  })

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (open && user) {
      setValue('fullName', `${user.firstName} ${user.lastName}`)
      setValue('email', user.email)
      setValue('phone', user.phone || '')
    }
  }, [open, user, setValue])

  // Watch cover letter for character count
  const coverLetter = watch('coverLetter') || ''

  const handleFileSelect = (file: File) => {
    setResumeFile(file)
    setResumeError('')
  }

  const handleFileRemove = () => {
    setResumeFile(null)
  }

  const onSubmit = async (data: ApplicationFormData) => {
    // Validate resume
    if (!resumeFile) {
      setResumeError('Please upload your resume')
      return
    }

    try {
      await submitMutation.mutateAsync({
        jobId: job.id,
        resumeFile: resumeFile,
        coverLetter: data.coverLetter,
      })

      // Show success modal
      setShowSuccess(true)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit application:', error)
    }
  }

  const handleClose = () => {
    if (!submitMutation.isPending) {
      onOpenChange(false)
      // Reset form when closed
      reset()
      setResumeFile(null)
      setResumeError('')
    }
  }

  const handleViewApplications = () => {
    setShowSuccess(false)
    router.push('/applications')
  }

  const handleBrowseJobs = () => {
    setShowSuccess(false)
    router.push('/jobs')
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[600px]"
          showCloseButton={!submitMutation.isPending}
        >
          {/* Header */}
          <DialogHeader className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
            <DialogTitle className="text-h2 font-semibold text-gray-900">
              Apply for {job.title}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {job.companyName} • {job.location}
            </p>
          </DialogHeader>

          {/* Form */}
          <form
            id="application-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            {/* Form Errors Summary */}
            {Object.keys(errors).length > 0 && (
              <FormError
                errors={
                  Object.values(errors)
                    .map((e) => e?.message)
                    .filter(Boolean) as string[]
                }
                className="mb-6"
              />
            )}

            {/* Full Name */}
            <FormField
              label="Full Name"
              htmlFor="fullName"
              required
              error={errors.fullName?.message}
            >
              <Input
                {...register('fullName')}
                placeholder="Enter your full name"
                error={!!errors.fullName}
                disabled={submitMutation.isPending}
              />
            </FormField>

            {/* Email */}
            <FormField
              label="Email Address"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <Input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
                disabled={submitMutation.isPending}
              />
            </FormField>

            {/* Phone */}
            <FormField
              label="Phone Number"
              htmlFor="phone"
              required
              error={errors.phone?.message}
              description="Include country code (e.g., +91 for India)"
            >
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+919876543210"
                error={!!errors.phone}
                disabled={submitMutation.isPending}
              />
            </FormField>

            {/* Resume Upload */}
            <FormField
              label="Resume"
              htmlFor="resume"
              required
              error={resumeError}
            >
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                value={resumeFile}
                error={resumeError}
                disabled={submitMutation.isPending}
              />
            </FormField>

            {/* Cover Letter */}
            <FormField
              label="Cover Letter"
              htmlFor="coverLetter"
              error={errors.coverLetter?.message}
              description="Optional - Tell us why you're a great fit for this role"
            >
              <div className="relative">
                <Textarea
                  {...register('coverLetter')}
                  placeholder="Write a brief cover letter explaining your interest in this position..."
                  rows={5}
                  maxLength={MAX_COVER_LETTER_LENGTH}
                  error={!!errors.coverLetter}
                  disabled={submitMutation.isPending}
                  className="resize-none"
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {coverLetter.length}/{MAX_COVER_LETTER_LENGTH} characters
                </div>
              </div>
            </FormField>
          </form>

          {/* Footer */}
          <DialogFooter className="mt-auto shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleClose}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="application-form"
              size="lg"
              disabled={submitMutation.isPending}
              loading={submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <ApplicationSubmittedModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        onPrimaryAction={handleViewApplications}
        onSecondaryAction={handleBrowseJobs}
      />
    </>
  )
}
