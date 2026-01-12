import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-4 py-3 text-base transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-gray-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opacity-20",
          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
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
Input.displayName = "Input"

export { Input }
