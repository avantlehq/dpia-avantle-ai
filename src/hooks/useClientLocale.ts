'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { detectClientLocale, setClientLocale } from '@/i18n/client-utils'
import { type Locale, locales } from '@/i18n/config'

export function useClientLocale() {
  const [locale, setLocale] = useState<Locale>('en')
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // First, try to detect locale from URL pathname
    let detectedLocale: Locale = 'en'
    
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean)
      const firstSegment = pathSegments[0]
      
      // Check if first segment is a valid locale
      if (firstSegment && locales.includes(firstSegment as Locale)) {
        detectedLocale = firstSegment as Locale
      }
    }
    
    // If no locale in URL, fallback to client storage/browser detection
    if (detectedLocale === 'en' && pathname && !pathname.startsWith('/en/')) {
      detectedLocale = detectClientLocale()
    }
    
    setLocale(detectedLocale)
    setIsLoading(false)
  }, [pathname])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    setClientLocale(newLocale)
    
    // Navigate to new locale URL
    if (pathname && typeof window !== 'undefined') {
      const pathSegments = pathname.split('/').filter(Boolean)
      const firstSegment = pathSegments[0]
      
      let newPath
      if (locales.includes(firstSegment as Locale)) {
        // Replace existing locale in URL
        pathSegments[0] = newLocale
        newPath = '/' + pathSegments.join('/')
      } else {
        // Add locale prefix to URL
        newPath = `/${newLocale}${pathname}`
      }
      
      window.location.href = newPath
    }
  }

  return { locale, changeLocale, isLoading }
}