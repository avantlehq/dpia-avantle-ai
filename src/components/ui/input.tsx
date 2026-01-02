import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Enhanced input variants with design tokens
const inputVariants = cva(
  "flex w-full rounded-[10px] border text-sm transition-all duration-150 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--text-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[--border-default] bg-[--surface-1] text-[--text-primary] focus-visible:border-[--border-focus]",
        error: "border-[--brand-destructive] bg-[--surface-1] text-[--text-primary] focus-visible:ring-[--brand-destructive]",
        success: "border-[--color-green] bg-[--surface-1] text-[--text-primary] focus-visible:ring-[--color-green]"
      },
      size: {
        sm: "h-8 px-3 py-2 text-xs",
        md: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base"
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
