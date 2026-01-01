'use client'

import React from 'react'
import { AlertTriangle, XCircle, Info, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type MessageType = 'error' | 'warning' | 'info' | 'success'

interface ErrorMessageProps {
  type?: MessageType
  title?: string
  message: string
  details?: string
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }>
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const messageConfig = {
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-900/30',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800 dark:text-red-200',
    textColor: 'text-red-700 dark:text-red-300'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-900/30',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800 dark:text-yellow-200',
    textColor: 'text-yellow-700 dark:text-yellow-300'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-900/30',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800 dark:text-blue-200',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-900/30',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800 dark:text-green-200',
    textColor: 'text-green-700 dark:text-green-300'
  }
}

export function ErrorMessage({
  type = 'error',
  title,
  message,
  details,
  actions,
  dismissible = false,
  onDismiss,
  className
}: ErrorMessageProps) {
  const config = messageConfig[type]
  const Icon = config.icon

  return (
    <div 
      className={cn(
        'rounded-lg border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </div>
        
        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', config.titleColor)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', title ? 'mt-2' : '', config.textColor)}>
            <p>{message}</p>
            {details && (
              <details className="mt-2">
                <summary className="cursor-pointer hover:underline">
                  Show details
                </summary>
                <div className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded text-xs font-mono">
                  {details}
                </div>
              </details>
            )}
          </div>
          
          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="mt-4 flex gap-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.action}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Dismiss button */}
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={cn(
                  'inline-flex rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  config.iconColor
                )}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Common error message patterns
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      type="error"
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      actions={onRetry ? [
        { label: 'Retry', action: onRetry }
      ] : undefined}
    />
  )
}

export function ValidationError({ errors }: { errors: string[] }) {
  return (
    <ErrorMessage
      type="error"
      title="Validation Error"
      message="Please fix the following issues:"
      details={errors.join('\n')}
    />
  )
}

export function SaveError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      type="error"
      title="Save Failed"
      message="Your changes could not be saved. Please try again or refresh the page."
      actions={onRetry ? [
        { label: 'Try Again', action: onRetry },
        { label: 'Refresh Page', action: () => window.location.reload(), variant: 'outline' }
      ] : undefined}
    />
  )
}

export function PermissionError() {
  return (
    <ErrorMessage
      type="warning"
      title="Permission Required"
      message="You don't have permission to perform this action. Please contact your administrator."
    />
  )
}

export function NotFoundError() {
  return (
    <ErrorMessage
      type="info"
      title="Not Found"
      message="The requested resource could not be found. It may have been moved or deleted."
      actions={[
        { label: 'Go Back', action: () => window.history.back() },
        { label: 'Go Home', action: () => window.location.href = '/', variant: 'outline' }
      ]}
    />
  )
}