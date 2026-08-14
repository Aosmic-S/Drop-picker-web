import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning' | 'info'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        {
          'bg-gray-100 text-gray-900': variant === 'default',
          'bg-gray-800 text-gray-100': variant === 'secondary',
          'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20': variant === 'success',
          'text-red-400 bg-red-400/10 border border-red-400/20': variant === 'destructive',
          'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20': variant === 'warning',
          'text-blue-400 bg-blue-400/10 border border-blue-400/20': variant === 'info',
          'border border-gray-700 text-gray-100': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
