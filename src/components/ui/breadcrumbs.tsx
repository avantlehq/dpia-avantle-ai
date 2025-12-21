'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getActiveModule, getActiveNavItem, getModuleConfig } from '@/lib/state/modules'

interface BreadcrumbsProps {
  className?: string
  showHome?: boolean
}

export function Breadcrumbs({ className, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname()
  const activeModule = getActiveModule(pathname)
  const activeNavItem = getActiveNavItem(pathname)
  const moduleConfig = getModuleConfig(activeModule || '')

  // Don't show breadcrumbs on homepage/dashboard
  if (pathname === '/' || pathname === '/dashboard') {
    return null
  }

  const breadcrumbItems: Array<{
    label: string
    href?: string
    color?: string
    active?: boolean
  }> = []

  // Start with module name instead of generic HOME
  if (moduleConfig) {
    breadcrumbItems.push({
      label: moduleConfig.name,
      href: moduleConfig.href,
      color: moduleConfig.color
    })
  } else if (showHome) {
    // Fallback to HOME only if no module context
    breadcrumbItems.push({
      label: 'HOME',
      href: '/dashboard'
    })
  }

  // Add current page
  if (activeNavItem) {
    // Handle special cases for nested routes
    let pageLabel = activeNavItem.name
    
    // Special handling for DPIA routes
    if (pathname.includes('/precheck')) {
      pageLabel = 'DPIA Pre-Check'
    } else if (pathname.includes('/assessments')) {
      pageLabel = 'DPIA Assessments'
    } else if (pathname.includes('/assessment?id=')) {
      pageLabel = 'Assessment Details'
    }

    breadcrumbItems.push({
      label: pageLabel,
      active: true
    })
  } else {
    // Fallback: extract from URL
    const pathParts = pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    
    if (lastPart) {
      breadcrumbItems.push({
        label: lastPart.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        active: true
      })
    }
  }

  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          
          {item.href && !item.active ? (
            <Link
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                item.color ? "text-muted-foreground" : "text-muted-foreground"
              )}
              style={item.color ? { color: item.color } : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                item.active 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              )}
              style={item.color && !item.active ? { color: item.color } : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Simple breadcrumb for custom paths
export function SimpleBreadcrumbs({ 
  items, 
  className 
}: { 
  items: string[]
  className?: string 
}) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <span 
            className={cn(
              index === items.length - 1 && "text-foreground font-medium"
            )}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}