'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, LogIn, Home } from 'lucide-react'
import Link from 'next/link'

interface UnauthorizedStateProps {
  title?: string
  message?: string
  showLoginButton?: boolean
  showHomeButton?: boolean
}

export function UnauthorizedState({
  title = "Access Denied", 
  message = "You don't have permission to access this resource",
  showLoginButton = true,
  showHomeButton = true
}: UnauthorizedStateProps) {
  return (
    <div className="min-h-screen avantle-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md avantle-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-orange-500/10">
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <CardTitle className="text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {showLoginButton && (
            <Button 
              className="w-full avantle-glow"
              asChild
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
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