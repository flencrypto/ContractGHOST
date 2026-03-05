import * as React from "react"
import { cn } from "../../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "neutral" | "live"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary/20 text-primary": variant === "default",
          "border-transparent bg-success/20 text-success": variant === "success",
          "border-transparent bg-warning/20 text-warning": variant === "warning",
          "border-transparent bg-danger/20 text-danger": variant === "danger",
          "border-transparent bg-surface text-text-muted": variant === "neutral",
          "border-transparent bg-transparent text-primary pl-1 pr-2": variant === "live",
        },
        className
      )}
      {...props}
    >
      {variant === "live" && (
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      )}
      {props.children}
    </div>
  )
}

export { Badge }
