'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface OnboardingData {
  completed: boolean
  answers: Record<string, string>
  completedAt: string
}

export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user has completed onboarding
    const storedOnboarding = localStorage.getItem('dpia-agent-onboarding')
    
    if (storedOnboarding) {
      try {
        const data: OnboardingData = JSON.parse(storedOnboarding)
        setOnboardingData(data)
        setIsOnboardingCompleted(data.completed)
      } catch (error) {
        console.error('Error parsing onboarding data:', error)
        setIsOnboardingCompleted(false)
      }
    } else {
      setIsOnboardingCompleted(false)
    }
  }, [])

  useEffect(() => {
    // Only redirect if onboarding is not completed and we're not already on onboarding page
    if (isOnboardingCompleted === false && pathname !== '/onboarding' && pathname !== '/') {
      // Check if this is the user's first visit to the app (excluding API routes and static files)
      if (!pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
        setShouldRedirect(true)
      }
    }
  }, [isOnboardingCompleted, pathname])

  const completeOnboarding = (answers: Record<string, string>) => {
    const data: OnboardingData = {
      completed: true,
      answers,
      completedAt: new Date().toISOString()
    }
    
    localStorage.setItem('dpia-agent-onboarding', JSON.stringify(data))
    setOnboardingData(data)
    setIsOnboardingCompleted(true)
    setShouldRedirect(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem('dpia-agent-onboarding')
    setOnboardingData(null)
    setIsOnboardingCompleted(false)
  }

  const redirectToOnboarding = () => {
    if (shouldRedirect) {
      router.push('/onboarding')
      setShouldRedirect(false)
    }
  }

  return {
    isOnboardingCompleted,
    onboardingData,
    shouldRedirect,
    completeOnboarding,
    resetOnboarding,
    redirectToOnboarding,
    isLoading: isOnboardingCompleted === null
  }
}