'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/use-translation'
import { locales, languageNames, languageFlags, type Locale } from '@/lib/i18n/locales'

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-mono uppercase">{languageFlags[locale]}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
            <div className="py-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center space-x-3 ${
                    locale === loc ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-sm font-mono font-bold">{languageFlags[loc]}</span>
                  <div className="flex-1">
                    <div className="font-medium">{languageNames[loc]}</div>
                  </div>
                  {locale === loc && (
                    <div className="w-2 h-2 rounded-full bg-dpia-blue" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}