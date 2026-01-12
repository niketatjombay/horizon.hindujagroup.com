import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-gray-100 text-gray-900",
        success: "border border-success/30 bg-success/10 text-success",
        warning: "border border-warning/30 bg-warning/10 text-warning",
        error: "border border-destructive/30 bg-destructive/10 text-destructive",
        info: "border border-[#80CCFF] bg-[#E6F4FF] text-[#0099FF]",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
