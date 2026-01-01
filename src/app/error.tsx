'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary:', error)
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>
          
          {isDevelopment && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Development Details</span>
              </div>
              <div className="text-xs font-mono text-muted-foreground space-y-1">
                <div><strong>Error:</strong> {error.message}</div>
                {error.digest && <div><strong>ID:</strong> {error.digest}</div>}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer hover:underline text-destructive">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={reset}
              variant="default"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Reload Page
            </Button>
          </div>
          
          <div className="text-center pt-4 border-t">
            <Link href="/">
              <Button variant="ghost" size="sm" leftIcon={<Home className="h-4 w-4" />}>
                Return to Homepage
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {error.digest && `Error ID: ${error.digest} • `}
              Privacy Platform v3.21.112
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}