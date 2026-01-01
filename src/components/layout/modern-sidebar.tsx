'use client'

import React, { useEffect, memo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, type NavItem } from '@/lib/state/modules'
import { useSidebarContext } from '@/contexts/SidebarContext'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { useTranslations } from '@/hooks/useTranslations'

interface ModernSidebarProps {
  className?: string
}

// Fixed sidebar nav row - no link styling, proper nav appearance
interface SidebarLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

const SidebarLink = memo(function SidebarLink({ item, isActive, collapsed }: SidebarLinkProps) {
  const isDisabled = item.disabled
  const { t } = useTranslations('nav')
  
  // Optimized hover handlers with useCallback
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!isActive) {
      const target = e.currentTarget.querySelector('div')
      if (target) {
        target.style.backgroundColor = 'rgba(255,255,255,0.05)'
      }
    }
  }, [isActive])
  
  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (!isActive) {
      const target = e.currentTarget.querySelector('div')
      if (target) {
        target.style.backgroundColor = 'transparent'
      }
    }
  }, [isActive])
  
  const navRowContent = (
    <div 
      className="group relative flex items-center text-sm transition-all duration-200 focus-within:outline-none"
      style={{
        backgroundColor: isActive ? 'rgba(96,165,250,0.15)' : 'transparent', // Light blue background when active
        borderLeft: isActive ? '3px solid var(--brand-primary)' : 'none', // Brand primary accent when active
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', // Design token colors
        paddingLeft: isActive ? '9px' : '12px', // Compensate for border width
        paddingRight: '8px', // Controlled right padding
        paddingTop: '14px', // Increased for 48px touch target
        paddingBottom: '14px',
        marginLeft: '0px', // No left margin - let border be the left edge
        marginRight: '12px', // Right margin to stay within sidebar bounds
        borderRadius: '6px', // Rounded corners to contain the highlight
        maxWidth: collapsed ? '40px' : '220px', // Explicit max width constraints
        width: collapsed ? '40px' : 'auto' // Fixed width in collapsed mode
      }}
    >
      {/* Clean text-only navigation - NO ICONS anywhere */}
      {!collapsed && (
        <span 
          className="truncate select-none"
          style={{
            fontWeight: isActive ? '600' : '400', // Semibold if active
            color: 'inherit' // Inherit from parent div
          }}
        >{t(`pages.${item.id}`)}</span>
      )}
      
      {/* When collapsed/rail mode, show first letter as icon replacement */}
      {collapsed && (
        <div 
          className="flex items-center justify-center w-full h-12 rounded transition-colors"
          style={{
            color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
            backgroundColor: isActive ? 'rgba(96,165,250,0.2)' : 'transparent'
          }}
          title={t(`pages.${item.id}`)} // Tooltip for accessibility
        >
          <span className="text-sm font-semibold">
            {t(`pages.${item.id}`).charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return (
      <div className="group relative" title={`${t(`pages.${item.id}`)} - Coming soon`}>
        {navRowContent}
      </div>
    )
  }

  return (
    <Link 
      href={item.href}
      className="group relative block modern-nav-link"
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? t(`pages.${item.id}`) : undefined} // Show tooltip in rail mode
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {navRowContent}
    </Link>
  )
})

export const ModernSidebar = memo(function ModernSidebar({ className }: ModernSidebarProps) {
  const pathname = usePathname()
  const { 
    mode,
    isCollapsed, 
    isMobileOpen, 
    showAsDrawer, 
    closeMobileDrawer,
    toggle,
    mounted,
    isDesktop
  } = useSidebarContext()
  
  const activeModuleId = getActiveModule(pathname)
  const moduleConfig = getModuleConfig(activeModuleId || 'privacy')
  
  // Memoize active item calculation
  const activeItemId = React.useMemo(() => {
    if (!moduleConfig?.items) return undefined
    
    // Debug logging to understand the issue
    if (process.env.NODE_ENV === 'development') {
      console.log('Sidebar Debug:', {
        pathname,
        moduleId: activeModuleId,
        items: moduleConfig.items.map(item => ({ id: item.id, href: item.href }))
      })
    }
    
    // First try to find exact matches to avoid prefix collision issues
    let activeItem = moduleConfig.items.find(item => pathname === item.href)
    
    // If no exact match, then check for sub-path matches, but sort by specificity (longest href first)
    if (!activeItem) {
      const subPathMatches = moduleConfig.items
        .filter(item => pathname.startsWith(item.href + '/'))
        .sort((a, b) => b.href.length - a.href.length) // Longest (most specific) first
        
      activeItem = subPathMatches[0] // Take the most specific match
    }
    
    if (process.env.NODE_ENV === 'development' && activeItem) {
      console.log(`Active item found:`, { 
        itemId: activeItem.id, 
        itemHref: activeItem.href, 
        pathname, 
        matchType: pathname === activeItem.href ? 'exact' : 'subpath'
      })
    }
    
    return activeItem?.id
  }, [moduleConfig?.items, pathname, activeModuleId])

  // Swipe gesture handlers for mobile drawer
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: closeMobileDrawer, // Swipe left to close drawer
    onSwipeRight: showAsDrawer && !isMobileOpen ? toggle : undefined, // Swipe right from edge to open
    minDistance: 50,
    maxVerticalDistance: 100,
    velocityThreshold: 0.3
  })

  // Lock body scroll when mobile drawer is open - ALWAYS call hooks in same order
  useEffect(() => {
    if (showAsDrawer && isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [showAsDrawer, isMobileOpen])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    // During SSR, render with the same logic as client-side for consistency
    const ssrWidth = isDesktop && isCollapsed ? '64px' : '256px'
    return (
      <aside 
        data-sidebar="true"
        className={cn(
          "flex flex-col prevent-layout-shift",
          className
        )}
        style={{ 
          width: ssrWidth,
          backgroundColor: 'var(--surface-1)', 
          borderRight: `1px solid var(--border-subtle)`
        }}
      >
        {/* Empty sidebar for SSR - will be hydrated with navigation items */}
        <div className="flex-1" />
      </aside>
    )
  }

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {/* Navigation Items - Clean start from top, no header */}
      <nav 
        className="flex-1 pt-6 pb-6 space-y-2 scroll-smooth" 
        role="navigation" 
        aria-label="Module navigation"
        id="main-sidebar"
        style={{
          paddingLeft: '12px',
          paddingRight: '4px', // Reduced to ensure highlights don't exceed bounds
          overflow: 'hidden' // Prevent any overflow
        }}
      >
        {/* Virtual scrolling container - Future enhancement ready */}
        <div className="navigation-items-container">
          {moduleConfig?.items.map((item) => {
            const isActive = activeItemId === item.id
            return (
              <SidebarLink
                key={item.id}
                item={item}
                isActive={isActive}
                collapsed={isDesktop && isCollapsed}
              />
            )
          })}
        </div>
      </nav>
    </>
  )

  // Mobile Drawer Mode
  if (showAsDrawer) {
    return (
      <>
        {/* Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileDrawer}
            aria-hidden="true"
          />
        )}
        
        {/* Mobile Drawer */}
        <aside 
          data-mobile-drawer="true"
          data-open={isMobileOpen}
          className={cn(
            "fixed top-0 left-0 h-full w-64 flex flex-col z-50",
            showAsDrawer ? "block" : "hidden", // Show only when mobile drawer mode
            className
          )}
          style={{ 
            backgroundColor: 'var(--surface-1)', 
            borderRight: `1px solid var(--border-subtle)`
          }}
          {...swipeHandlers}
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  // Desktop Mode (Expanded or Rail) - Use explicit width for reliability
  const currentWidth = isDesktop && isCollapsed ? '64px' : '256px'
  
  return (
    <aside 
      key={`sidebar-${mode}-${mounted}`}
      data-sidebar="true"
      className={cn(
        "flex flex-col flex-shrink-0 prevent-layout-shift",
        // Remove hidden lg:flex - always show on desktop, use showAsDrawer for mobile logic
        className
      )}
      style={{ 
        width: currentWidth,
        minWidth: currentWidth,
        maxWidth: currentWidth,
        backgroundColor: 'var(--surface-1)', 
        borderRight: `1px solid var(--border-subtle)`
      }}
    >
      {sidebarContent}
    </aside>
  )
})