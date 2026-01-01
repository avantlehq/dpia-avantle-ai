'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
          errorInfo={this.state.errorInfo}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We encountered an unexpected error while loading this page. Our team has been notified and is working on a fix.
          </p>
          
          {isDevelopment && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-mono text-destructive mb-2">
                Development Error Details:
              </p>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <Button
              onClick={resetError}
              variant="default"
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized error fallbacks for different contexts
export function DashboardErrorFallback({ resetError }: ErrorFallbackProps) {
  return (
    <Card className="avantle-border bg-card backdrop-blur-sm">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Failed to load dashboard
        </h3>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t load your assessment dashboard. This might be a temporary issue.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={resetError} variant="default">
            Retry
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function FormErrorFallback({ resetError }: ErrorFallbackProps) {
  return (
    <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-foreground">Form Error</h4>
          <p className="text-sm text-muted-foreground mt-1">
            There was a problem with this form. Please try refreshing or contact support if the issue persists.
          </p>
          <Button
            onClick={resetError}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Retry Form
          </Button>
        </div>
      </div>
    </div>
  )
}