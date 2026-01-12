import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border bg-white px-4 py-3 text-base transition-colors",
          "placeholder:text-gray-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opacity-20",
          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
          "resize-y",
          error
            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
            : "border-gray-300 focus-visible:border-primary focus-visible:ring-primary",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
