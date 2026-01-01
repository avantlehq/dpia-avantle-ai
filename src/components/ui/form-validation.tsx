'use client'

import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldErrorProps {
  error?: string | string[]
  touched?: boolean
  className?: string
}

export function FormFieldError({ error, touched, className }: FormFieldErrorProps) {
  const errors = Array.isArray(error) ? error : error ? [error] : []
  const hasError = touched && errors.length > 0

  if (!hasError) return null

  return (
    <div className={cn('mt-1', className)}>
      {errors.map((err, index) => (
        <div key={index} className="flex items-start gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{err}</span>
        </div>
      ))}
    </div>
  )
}

interface FormFieldWrapperProps {
  children: React.ReactNode
  error?: string | string[]
  touched?: boolean
  required?: boolean
  label?: string
  description?: string
  success?: boolean
  successMessage?: string
  className?: string
}

export function FormFieldWrapper({
  children,
  error,
  touched,
  required,
  label,
  description,
  success,
  successMessage,
  className
}: FormFieldWrapperProps) {
  const hasError = touched && error
  const hasSuccess = success && !hasError

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      {description && !hasError && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      <div className="relative">
        {children}
        
        {/* Success indicator */}
        {hasSuccess && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      <FormFieldError error={error} touched={touched} />
      
      {/* Success message */}
      {hasSuccess && successMessage && (
        <div className="flex items-center gap-1.5 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  )
}

interface FormErrorSummaryProps {
  errors: Record<string, string | string[]>
  touched: Record<string, boolean>
  fieldLabels?: Record<string, string>
  className?: string
  onFieldFocus?: (fieldName: string) => void
}

export function FormErrorSummary({
  errors,
  touched,
  fieldLabels = {},
  className,
  onFieldFocus
}: FormErrorSummaryProps) {
  const touchedErrors = Object.entries(errors).filter(([field]) => touched[field])
  
  if (touchedErrors.length === 0) return null

  return (
    <div className={cn('p-4 bg-destructive/5 border border-destructive/20 rounded-lg', className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-destructive mb-2">
            Please fix the following errors:
          </h4>
          <ul className="space-y-1">
            {touchedErrors.map(([field, error]) => {
              const fieldLabel = fieldLabels[field] || field
              const errorMessages = Array.isArray(error) ? error : [error]
              
              return errorMessages.map((message, index) => (
                <li key={`${field}-${index}`} className="text-sm">
                  <button
                    type="button"
                    onClick={() => onFieldFocus?.(field)}
                    className="text-left hover:underline focus:underline focus:outline-none"
                  >
                    <span className="font-medium">{fieldLabel}:</span> {message}
                  </button>
                </li>
              ))
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Validation helpers
export function validateRequired(value: any, fieldName: string = 'This field'): string | undefined {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`
  }
  return undefined
}

export function validateEmail(email: string): string | undefined {
  if (!email) return undefined
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return undefined
}

export function validateMinLength(value: string, minLength: number, fieldName: string = 'This field'): string | undefined {
  if (!value) return undefined
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`
  }
  return undefined
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string = 'This field'): string | undefined {
  if (!value) return undefined
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`
  }
  return undefined
}

export function validateUrl(url: string): string | undefined {
  if (!url) return undefined
  try {
    new URL(url)
    return undefined
  } catch {
    return 'Please enter a valid URL'
  }
}

// Compose multiple validators
export function validateField(value: any, validators: ((value: any) => string | undefined)[]): string[] {
  return validators
    .map(validator => validator(value))
    .filter((error): error is string => error !== undefined)
}