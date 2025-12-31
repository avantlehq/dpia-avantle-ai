'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'
import { locales, languageNames, type Locale } from '@/i18n/config'
import { useClientLocale } from '@/hooks/useClientLocale'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale: currentLocale, changeLocale, isLoading } = useClientLocale()

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale || isLoading) return
    changeLocale(newLocale)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-12 w-12 p-0 border-none"
          style={{ 
            backgroundColor: 'transparent',
            color: '#9ca3af',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)'
            const icon = e.currentTarget.querySelector('svg')
            if (icon) icon.style.color = '#60a5fa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            const icon = e.currentTarget.querySelector('svg')
            if (icon) icon.style.color = '#9ca3af'
          }}
          title={currentLocale === 'sk' ? 'Jazyk' : 'Language'}
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" style={{ 
            color: '#9ca3af', 
            transition: 'color 0.2s ease',
            opacity: isLoading ? 0.5 : 1
          }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((locale) => {
          const isActive = locale === currentLocale
          const displayName = languageNames[locale]
          
          return (
            <DropdownMenuItem 
              key={locale}
              onClick={() => switchLanguage(locale)}
              className="flex items-center justify-between cursor-pointer"
              disabled={isLoading}
            >
              <span className={isActive ? 'font-medium' : ''}>{displayName}</span>
              {isActive && <Check className="h-4 w-4 text-[--brand-primary]" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}