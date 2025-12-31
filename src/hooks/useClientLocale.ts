'use client'

import { useState, useEffect } from 'react'
import { detectClientLocale, setClientLocale, type Locale } from '@/i18n/utils'

export function useClientLocale() {
  const [locale, setLocale] = useState<Locale>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial locale from client storage/browser
    const clientLocale = detectClientLocale()
    setLocale(clientLocale)
    setIsLoading(false)
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    setClientLocale(newLocale)
    // Force page reload to update all strings
    window.location.reload()
  }

  return { locale, changeLocale, isLoading }
}