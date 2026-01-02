import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Enhanced input variants with design tokens
const inputVariants = cva(
  "flex w-full border file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--text-muted] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[--border-default] bg-[--surface-1] text-[--text-primary] transition-[--transition-colors] focus-visible:ring-2 focus-visible:ring-[--focus-ring-color] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0] focus-visible:border-[--border-focus]",
        error: "border-[--status-error-border] bg-[--surface-1] text-[--text-primary] transition-[--transition-colors] focus-visible:ring-2 focus-visible:ring-[--status-error] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0]",
        success: "border-[--status-success-border] bg-[--surface-1] text-[--text-primary] transition-[--transition-colors] focus-visible:ring-2 focus-visible:ring-[--status-success] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0]",
        warning: "border-[--status-warning-border] bg-[--surface-1] text-[--text-primary] transition-[--transition-colors] focus-visible:ring-2 focus-visible:ring-[--status-warning] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0]",
        info: "border-[--status-info-border] bg-[--surface-1] text-[--text-primary] transition-[--transition-colors] focus-visible:ring-2 focus-visible:ring-[--status-info] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0]"
      },
      size: {
        sm: "h-[--height-sm] px-[--space-3] py-[--space-1] text-[--text-sm] rounded-[--radius-md]",
        md: "h-[--height-md] px-[--space-3] py-[--space-2] text-[--text-base] rounded-[--radius-default]",
        lg: "h-[--height-lg] px-[--space-4] py-[--space-3] text-[--text-lg] rounded-[--radius-lg]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  isLoading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, isLoading, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(inputVariants({ variant, size }), isLoading && "cursor-wait", className)}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

// Textarea component
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  isLoading?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, isLoading, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          inputVariants({ variant }),
          "min-h-[80px] resize-vertical py-2",
          isLoading && "cursor-wait",
          className
        )}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Input, Textarea, inputVariants }
