"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Enhanced select trigger variants with design tokens
const selectTriggerVariants = cva(
  "flex w-full items-center justify-between whitespace-nowrap border file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[--text-muted] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
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
        sm: "h-[--height-sm] px-[--space-3] py-[--space-1] text-[--text-sm] rounded-[--radius-md] gap-[--space-2]",
        default: "h-[--height-md] px-[--space-3] py-[--space-2] text-[--text-base] rounded-[--radius-default] gap-[--space-2]",
        lg: "h-[--height-lg] px-[--space-4] py-[--space-3] text-[--text-lg] rounded-[--radius-lg] gap-[--space-3]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  isLoading?: boolean
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, size, isLoading, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      selectTriggerVariants({ variant, size }),
      isLoading && "cursor-wait",
      className
    )}
    disabled={isLoading || props.disabled}
    aria-busy={isLoading}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

SelectTrigger.displayName = "SelectTrigger"

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative max-h-96 min-w-[8rem] overflow-hidden border border-[--border-default] bg-[--surface-2] text-[--text-primary] rounded-[--radius-lg] shadow-[--shadow-lg] z-[--z-dropdown]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-[--space-1]",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("py-[--space-1-5] pl-[--space-8] pr-[--space-2] text-[--text-sm] font-semibold text-[--text-muted]", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center outline-none py-[--space-2] pl-[--space-8] pr-[--space-2] text-[--text-sm] rounded-[--radius-md] transition-[--transition-colors] hover:bg-[--interactive-hover] focus:bg-[--interactive-hover] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-[--space-2] flex h-[--space-3-5] w-[--space-3-5] items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-[--space-1] my-[--space-1] h-px bg-[--border-default]", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-[--space-1]",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-[--space-1]",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
}
