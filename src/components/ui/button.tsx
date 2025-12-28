import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0] active:transform active:translate-y-px aria-busy:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-[--brand-primary] text-[--text-primary] font-semibold hover:bg-[--brand-primary-hover] active:bg-[--brand-primary-active] focus-visible:ring-[--border-focus]",
        secondary: "bg-[--surface-2] border border-[--border-default] text-[--text-primary] hover:bg-[--surface-3] focus-visible:ring-[--border-focus]",
        ghost: "bg-transparent hover:bg-[--interactive-hover] text-[--text-primary] focus-visible:ring-[--border-focus]",
        outline: "bg-transparent border border-[--border-default] text-[--text-primary] hover:bg-[--interactive-hover] focus-visible:ring-[--border-focus]",
        destructive: "bg-[--brand-destructive] text-[--text-primary] hover:bg-[--brand-destructive-hover] focus-visible:ring-[--brand-destructive] focus-visible:ring-offset-[--brand-destructive]/20",
      },
      size: {
        sm: "h-[30px] px-3 text-sm",
        md: "h-[38px] px-4 text-sm",
        lg: "h-[46px] px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    leftIcon,
    rightIcon,
    isLoading = false,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        data-button="true"
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {typeof children === 'string' ? 'Loading...' : children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
