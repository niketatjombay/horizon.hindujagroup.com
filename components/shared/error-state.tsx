'use client'

import { useState } from 'react'
import { AlertTriangle, WifiOff, ServerCrash, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorType = 'general' | 'network' | 'server'

interface ErrorStateProps {
  type?: ErrorType
  title?: string
  message?: string
  technicalDetails?: string
  onRetry?: () => void
  onGoBack?: () => void
  className?: string
}

const ERROR_CONFIG = {
  general: {
    icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    defaultMessage: 'An unexpected error occurred. Please try again.',
  },
  network: {
    icon: WifiOff,
    defaultTitle: 'Connection error',
    defaultMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
  },
  server: {
    icon: ServerCrash,
    defaultTitle: 'Server error',
    defaultMessage: 'Our servers are experiencing issues. Please try again later.',
  },
}

export function ErrorState({
  type = 'general',
  title,
  message,
  technicalDetails,
  onRetry,
  onGoBack,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false)

  const config = ERROR_CONFIG[type]
  const Icon = config.icon

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'mx-auto max-w-lg rounded-lg border border-destructive/30 bg-destructive/5 p-6',
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Icon className="h-8 w-8 text-destructive" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {title || config.defaultTitle}
        </h3>

        {/* Message */}
        <p className="mb-6 text-sm text-gray-600">
          {message || config.defaultMessage}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {onGoBack && (
            <Button variant="ghost" onClick={onGoBack}>
              Go Back
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>

        {/* Technical Details (expandable) */}
        {technicalDetails && (
          <div className="mt-6 w-full">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              {showDetails ? (
                <>
                  <span>Hide technical details</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Show technical details</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>

            {showDetails && (
              <div className="mt-3 rounded-md bg-gray-100 p-4 text-left">
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-gray-700">
                  {technicalDetails}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Preset error states
interface PresetErrorStateProps {
  onRetry?: () => void
  onGoBack?: () => void
  technicalDetails?: string
  className?: string
}

export function NetworkError({
  onRetry,
  onGoBack,
  technicalDetails,
  className,
}: PresetErrorStateProps) {
  return (
    <ErrorState
      type="network"
      onRetry={onRetry}
      onGoBack={onGoBack}
      technicalDetails={technicalDetails}
      className={className}
    />
  )
}

export function ServerError({
  onRetry,
  onGoBack,
  technicalDetails,
  className,
}: PresetErrorStateProps) {
  return (
    <ErrorState
      type="server"
      onRetry={onRetry}
      onGoBack={onGoBack}
      technicalDetails={technicalDetails}
      className={className}
    />
  )
}

export function GeneralError({
  onRetry,
  onGoBack,
  technicalDetails,
  className,
}: PresetErrorStateProps) {
  return (
    <ErrorState
      type="general"
      onRetry={onRetry}
      onGoBack={onGoBack}
      technicalDetails={technicalDetails}
      className={className}
    />
  )
}
