'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorStateProps {
  title?: string
  message?: string
  details?: string
  onRetry?: () => void
  showHomeButton?: boolean
}

export function ErrorState({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this page", 
  details,
  onRetry,
  showHomeButton = true 
}: ErrorStateProps) {
  return (
    <div className="min-h-screen avantle-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md avantle-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {message}
          </CardDescription>
          {details && (
            <details className="mt-4 text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Show technical details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {details}
              </pre>
            </details>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="w-full avantle-glow"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showHomeButton && (
            <Button 
              variant="outline" 
              className="w-full avantle-border"
              asChild
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}