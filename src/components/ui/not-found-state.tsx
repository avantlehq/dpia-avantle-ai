'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchX, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NotFoundStateProps {
  title?: string
  message?: string
  showBackButton?: boolean
  showHomeButton?: boolean
}

export function NotFoundState({
  title = "Not Found",
  message = "The resource you're looking for doesn't exist or has been moved",
  showBackButton = true,
  showHomeButton = true
}: NotFoundStateProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen avantle-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md avantle-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-muted/50">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {showBackButton && (
            <Button 
              onClick={() => router.back()}
              className="w-full avantle-glow"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
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