import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

// Form field variants with design tokens
const formFieldVariants = cva(
  "space-y-2",
  {
    variants: {
      variant: {
        default: "",
        error: "",
        success: "",
        warning: ""
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

// Label variants
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-[--text-primary]",
        error: "text-[--brand-destructive]",
        success: "text-[--color-green]",
        warning: "text-[--color-orange]"
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-[--brand-destructive]",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      required: false
    }
  }
)

// Helper text variants
const helperTextVariants = cva(
  "text-sm flex items-center gap-2",
  {
    variants: {
      variant: {
        default: "text-[--text-muted]",
        error: "text-[--brand-destructive]",
        success: "text-[--color-green]",
        warning: "text-[--color-orange]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface FormFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  successMessage?: string
  warningMessage?: string
  required?: boolean
  disabled?: boolean
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ 
    className, 
    variant, 
    label, 
    helperText, 
    errorMessage, 
    successMessage,
    warningMessage,
    required = false,
    disabled = false,
    children, 
    ...props 
  }, ref) => {
    // Determine the actual variant based on messages
    const actualVariant = errorMessage ? "error" : 
                          successMessage ? "success" : 
                          warningMessage ? "warning" : 
                          variant || "default"

    // Get the helper message to display
    const displayMessage = errorMessage || successMessage || warningMessage || helperText

    // Get the appropriate icon
    const getMessageIcon = () => {
      if (errorMessage) return <AlertCircle className="h-4 w-4 flex-shrink-0" />
      if (successMessage) return <CheckCircle className="h-4 w-4 flex-shrink-0" />
      if (warningMessage) return <Info className="h-4 w-4 flex-shrink-0" />
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(formFieldVariants({ variant: actualVariant }), className)}
        {...props}
      >
        {label && (
          <label
            className={cn(
              labelVariants({ 
                variant: actualVariant, 
                required: required 
              }),
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {children}
        </div>
        
        {displayMessage && (
          <div
            className={cn(
              helperTextVariants({ variant: actualVariant }),
              disabled && "opacity-50"
            )}
          >
            {getMessageIcon()}
            <span>{displayMessage}</span>
          </div>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField, formFieldVariants, labelVariants, helperTextVariants }