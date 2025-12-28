import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-[8px] transition-all duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface-0] active:transform active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-transparent text-[--text-muted] hover:bg-[--surface-2] hover:text-[--text-primary] focus-visible:ring-[--border-focus]",
        ghost: "bg-transparent text-[--text-muted] hover:bg-[--interactive-hover] hover:text-[--text-primary] focus-visible:ring-[--border-focus]",
        primary: "bg-[--brand-primary] text-[--text-primary] hover:bg-[--brand-primary-hover] focus-visible:ring-[--border-focus]",
        destructive: "bg-transparent text-[--status-error] hover:bg-[--brand-destructive] hover:text-[--text-primary] focus-visible:ring-[--brand-destructive]",
      },
      size: {
        sm: "h-[32px] w-[32px]",
        md: "h-[40px] w-[40px]",
        lg: "h-[48px] w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  "aria-label": string // Required for accessibility
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    icon,
    children,
    disabled,
    "aria-label": ariaLabel,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Determine icon size based on button size
    const iconSize = size === "sm" ? "16" : size === "lg" ? "20" : "18"

    return (
      <Comp
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        disabled={disabled}
        aria-label={ariaLabel}
        data-button="true"
        {...props}
      >
        {children || (
          <span 
            className="inline-flex items-center justify-center"
            style={{ 
              width: `${iconSize}px`, 
              height: `${iconSize}px` 
            }}
          >
            {icon}
          </span>
        )}
      </Comp>
    )
  }
)

IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }