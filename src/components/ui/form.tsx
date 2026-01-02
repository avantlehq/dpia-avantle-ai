"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-[--brand-destructive]", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-[--text-muted] text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-[--brand-destructive] text-sm flex items-center gap-2", className)}
      {...props}
    >
      {body}
    </p>
  )
}

// Additional form layout components
function FormHeader({ 
  className, 
  title, 
  description, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
}) {
  return (
    <div
      className={cn("space-y-2 pb-6 border-b border-[--border-default]", className)}
      {...props}
    >
      {title && (
        <h2 className="text-xl font-semibold text-[--text-primary]">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-[--text-muted]">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

function FormFooter({ 
  className, 
  align = "right", 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "left" | "center" | "right" | "between"
}) {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center", 
    right: "justify-end",
    between: "justify-between"
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-6 border-t border-[--border-default]",
        alignmentClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function FormSection({ 
  className, 
  title, 
  description, 
  variant = "default",
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  variant?: "default" | "bordered" | "card"
}) {
  const variantClasses = {
    default: "",
    bordered: "p-6 border border-[--border-default] rounded-[10px]",
    card: "p-6 bg-[--surface-1] border border-[--border-default] rounded-[10px] shadow-sm"
  }

  return (
    <div
      className={cn("space-y-4", variantClasses[variant], className)}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-1 pb-4">
          {title && (
            <h3 className="text-base font-medium text-[--text-primary]">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-[--text-muted]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

function FormGrid({ 
  className, 
  columns = 1, 
  gap = "md", 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: "sm" | "md" | "lg"
}) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2", 
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    12: "grid-cols-12"
  }

  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6"
  }

  return (
    <div
      className={cn(
        "grid",
        gridClasses[columns],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormHeader,
  FormFooter,
  FormSection,
  FormGrid,
}
