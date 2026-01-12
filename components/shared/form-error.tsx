import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormErrorProps {
  errors: string[]
  className?: string
}

export function FormError({ errors, className }: FormErrorProps) {
  if (errors.length === 0) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3',
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />

      {errors.length === 1 ? (
        <p className="text-sm text-destructive">{errors[0]}</p>
      ) : (
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-destructive">
            Please fix the following errors:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
