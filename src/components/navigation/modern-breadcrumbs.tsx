'use client'

import React, { memo, useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, privacyModulesConfig } from '@/lib/state/modules'
import { detectClientLocale } from '@/i18n/utils'

interface BreadcrumbItem {
  id: string
  name: string
  href: string
  translationKey: string // For future i18n support
  isLast?: boolean
}

interface ModernBreadcrumbsProps {
  className?: string
  maxItems?: number // For responsive collapse
  mobileMaxItems?: number // Separate limit for mobile screens
}

// SSR-safe translation function
function getTranslation(locale: string, key: string): string {
  const translations: Record<string, Record<string, string>> = {
    en: {
      'home': 'Home',
      'more': '...',
      'modules.context': 'Context',
      'modules.privacy': 'Privacy',
      'modules.risk': 'Risk',
      'modules.controls': 'Controls',
      'modules.training': 'Training',
      'modules.trust-center': 'Trust Center',
      'pages.overview': 'Overview',
      'pages.systems': 'Systems',
      'pages.processing': 'Processing Activities',
      'pages.data-categories': 'Data Categories',
      'pages.data-flows': 'Data Flows',
      'pages.vendors': 'Vendors / Processors',
      'pages.locations': 'Locations & Jurisdictions',
      'pages.dpia-precheck': 'DPIA Pre-Check',
      'pages.dpia-assessments': 'DPIA Assessments',
      'pages.lia': 'LIA',
      'pages.tia': 'TIA',
      'pages.policies': 'Privacy Policies'
    },
    sk: {
      'home': 'Domov',
      'more': '...',
      'modules.context': 'Kontext',
      'modules.privacy': 'Ochrana údajov',
      'modules.risk': 'Riziko',
      'modules.controls': 'Kontroly',
      'modules.training': 'Školenia',
      'modules.trust-center': 'Centrum dôvery',
      'pages.overview': 'Prehľad',
      'pages.systems': 'Systémy',
      'pages.processing': 'Spracovanie',
      'pages.data-categories': 'Kategórie údajov',
      'pages.data-flows': 'Toky údajov',
      'pages.vendors': 'Dodávatelia',
      'pages.locations': 'Lokality',
      'pages.dpia-precheck': 'DPIA Kontrola',
      'pages.dpia-assessments': 'DPIA Hodnotenia',
      'pages.lia': 'LIA',
      'pages.tia': 'TIA',
      'pages.policies': 'Zásady'
    }
  }
  
  return translations[locale]?.[key] || translations['en']?.[key] || key
}

const ModernBreadcrumbs = memo(function ModernBreadcrumbs({ 
  className, 
  maxItems = 4,
  mobileMaxItems = 2 
}: ModernBreadcrumbsProps) {
  const pathname = usePathname()
  const [locale, setLocale] = useState('en')
  const [mounted, setMounted] = useState(false)

  // SSR-safe locale detection
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean)
      const firstSegment = pathSegments[0]
      
      if (firstSegment === 'sk' || firstSegment === 'en') {
        setLocale(firstSegment)
      } else {
        setLocale(detectClientLocale())
      }
    }
    setMounted(true)
  }, [pathname])
  
  const t = (key: string) => getTranslation(locale, key)
  
  // Generate breadcrumb trail based on current route - synced with sidebar navigation
  const breadcrumbs = useMemo(() => {
    const items: BreadcrumbItem[] = []
    
    // Always start with Home (matches sidebar navigation pattern)
    items.push({
      id: 'home',
      name: t('home'),
      href: '/dashboard',
      translationKey: 'home'
    })
    
    // Get active module (same logic as sidebar)
    const activeModuleId = getActiveModule(pathname)
    if (activeModuleId) {
      const moduleConfig = privacyModulesConfig.find(m => m.id === activeModuleId)
      if (moduleConfig) {
        items.push({
          id: moduleConfig.id,
          name: t(`modules.${moduleConfig.id}`),
          href: moduleConfig.href,
          translationKey: `modules.${moduleConfig.id}`
        })
        
        // Get active page within module (exact same logic as sidebar)
        const modulePages = getModuleConfig(activeModuleId)
        if (modulePages?.items) {
          const activePage = modulePages.items.find(item => 
            pathname === item.href || pathname.startsWith(item.href + '/')
          )
          
          // Only add if it's different from module root and matches sidebar active logic
          if (activePage && activePage.href !== moduleConfig.href) {
            items.push({
              id: activePage.id,
              name: t(`pages.${activePage.id}`),
              href: activePage.href,
              translationKey: `pages.${activePage.id}`
            })
          }
        }
      }
    }
    
    // Mark last item for styling consistency
    if (items.length > 0) {
      items[items.length - 1].isLast = true
    }
    
    return items
  }, [pathname, locale, mounted])
  
  // Smart responsive collapse with mobile optimization
  const visibleBreadcrumbs = useMemo(() => {
    // Use different limits for desktop vs mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const currentMaxItems = isMobile ? mobileMaxItems : maxItems
    
    if (breadcrumbs.length <= currentMaxItems) {
      return breadcrumbs
    }
    
    // Mobile-optimized collapse: Show only first and last on small screens
    if (isMobile && currentMaxItems === 2) {
      const first = breadcrumbs[0]
      const last = breadcrumbs[breadcrumbs.length - 1]
      
      if (breadcrumbs.length === 2) {
        return breadcrumbs
      }
      
      return [
        first,
        {
          id: 'ellipsis',
          name: t('more'),
          href: '#',
          translationKey: 'more',
          isEllipsis: true
        } as BreadcrumbItem & { isEllipsis: boolean },
        last
      ].filter(Boolean)
    }
    
    // Desktop collapse: Keep first, last, and most recent items
    const first = breadcrumbs[0]
    const last = breadcrumbs[breadcrumbs.length - 1]
    const beforeLast = breadcrumbs[breadcrumbs.length - 2]
    
    return [
      first,
      {
        id: 'ellipsis',
        name: t('more'),
        href: '#',
        translationKey: 'more',
        isEllipsis: true
      } as BreadcrumbItem & { isEllipsis: boolean },
      ...(beforeLast ? [beforeLast] : []),
      last
    ].filter(Boolean)
  }, [breadcrumbs, maxItems, mobileMaxItems, locale])
  
  if (breadcrumbs.length <= 1 || !mounted) {
    return null // Don't show breadcrumbs for simple single-level pages or during SSR
  }
  
  return (
    <nav 
      className={cn(
        "flex items-center space-x-1 text-sm py-3 px-6 border-b md:py-3 md:px-6 py-2 px-4",
        "touch-optimized", // Mobile touch optimization
        className
      )}
      style={{
        borderColor: 'var(--border-subtle)',
        backgroundColor: 'var(--surface-0)'
      }}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-1">
        {visibleBreadcrumbs.map((item, index) => {
          const isEllipsis = 'isEllipsis' in item && item.isEllipsis
          
          return (
            <li key={item.id} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="h-3 w-3 mx-2 flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                />
              )}
              
              {isEllipsis ? (
                <span 
                  className="px-2 py-1 text-xs font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.name}
                </span>
              ) : item.isLast ? (
                <span 
                  className="px-2 py-1 text-xs font-semibold rounded"
                  style={{ 
                    color: 'var(--text-primary)',
                    backgroundColor: 'rgba(96,165,250,0.1)'
                  }}
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="px-2 py-1 md:px-2 md:py-1 px-3 py-2 text-xs font-medium rounded transition-colors hover:bg-[--interactive-hover] focus:outline-none focus:ring-2 focus:ring-[--focus-ring] min-h-[48px] md:min-h-auto flex items-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

export default ModernBreadcrumbs