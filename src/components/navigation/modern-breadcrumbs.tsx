'use client'

import React, { memo, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, privacyModulesConfig } from '@/lib/state/modules'
import { useTranslations } from '@/hooks/useTranslations'

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

const ModernBreadcrumbs = memo(function ModernBreadcrumbs({ 
  className, 
  maxItems = 4,
  mobileMaxItems = 2 
}: ModernBreadcrumbsProps) {
  const pathname = usePathname()
  const { t } = useTranslations('nav')
  
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
  }, [pathname, t])
  
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
  }, [breadcrumbs, maxItems, mobileMaxItems, t])
  
  if (breadcrumbs.length <= 1) {
    return null // Don't show breadcrumbs for simple single-level pages
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