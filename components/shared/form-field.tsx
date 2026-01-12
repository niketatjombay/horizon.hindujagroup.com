'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  description?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children,
  className,
  description,
}: FormFieldProps) {
  const errorId = `${htmlFor}-error`
  const descriptionId = `${htmlFor}-description`

  // Clone child element to add accessibility props
  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{
        id?: string
        'aria-required'?: boolean
        'aria-invalid'?: boolean
        'aria-describedby'?: string
      }>, {
        id: htmlFor,
        'aria-required': required || undefined,
        'aria-invalid': !!error || undefined,
        'aria-describedby': error
          ? errorId
          : description
            ? descriptionId
            : undefined,
      })
    : children

  return (
    <div className={cn('mb-5 flex flex-col gap-2', className)}>
      {/* Label */}
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-gray-900"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {/* Description (optional) */}
      {description && (
        <p
          id={descriptionId}
          className="text-xs text-gray-600"
        >
          {description}
        </p>
      )}

      {/* Input/Control (passed as children) */}
      {childWithProps}

      {/* Error Message */}
      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className="flex items-center gap-1.5 text-xs text-destructive animate-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
