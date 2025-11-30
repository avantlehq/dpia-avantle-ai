'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function OnboardingBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if onboarding is completed and banner hasn't been dismissed
    const onboardingCompleted = localStorage.getItem('dpia-agent-onboarding')
    const bannerDismissed = localStorage.getItem('dpia-agent-banner-dismissed')
    
    if (!onboardingCompleted && !bannerDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('dpia-agent-banner-dismissed', 'true')
  }

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <Card className="avantle-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">New to DPIA.ai?</h3>
                <Badge variant="secondary" className="text-xs">
                  2 minutes
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Take our quick onboarding to get personalized recommendations for your GDPR compliance needs.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="whitespace-nowrap inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 px-8 py-4 font-semibold rounded-lg cursor-pointer" 
              style={{
                backgroundColor: '#2563eb',
                borderColor: '#3b82f6',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600'
              }}
              asChild
            >
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 hover:bg-destructive/10 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl border border-blue-500 hover:border-blue-400 transform hover:scale-102 transition-all duration-300 font-semibold rounded-lg cursor-pointer"
              style={{
                backgroundColor: '#2563eb',
                borderColor: '#3b82f6',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}