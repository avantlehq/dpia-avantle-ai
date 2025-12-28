'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, type NavItem } from '@/lib/state/modules'
import { useSidebarContext } from '@/contexts/SidebarContext'

interface ModernSidebarProps {
  className?: string
}

// Fixed sidebar nav row - no link styling, proper nav appearance
interface SidebarLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

function SidebarLink({ item, isActive, collapsed }: SidebarLinkProps) {
  const isDisabled = item.disabled
  
  const navRowContent = (
    <div 
      className="group relative flex items-center text-sm transition-all duration-200 focus-within:outline-none"
      style={{
        backgroundColor: isActive ? 'rgba(96,165,250,0.15)' : 'transparent', // Light blue background when active
        borderLeft: isActive ? '3px solid var(--brand-primary)' : 'none', // Brand primary accent when active
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', // Design token colors
        paddingLeft: isActive ? '9px' : '12px', // Compensate for border width
        paddingRight: '8px', // Controlled right padding
        paddingTop: '10px',
        paddingBottom: '10px',
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
        >{item.name}</span>
      )}
      
      {/* When collapsed/rail mode, show first letter as icon replacement */}
      {collapsed && (
        <div 
          className="flex items-center justify-center w-full h-8 rounded transition-colors"
          style={{
            color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
            backgroundColor: isActive ? 'rgba(96,165,250,0.2)' : 'transparent'
          }}
          title={item.name} // Tooltip for accessibility
        >
          <span className="text-sm font-semibold">
            {item.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return (
      <div className="group relative" title={`${item.name} - Coming soon`}>
        {navRowContent}
      </div>
    )
  }

  return (
    <Link 
      href={item.href}
      className="group relative block modern-nav-link"
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? item.name : undefined} // Show tooltip in rail mode
      onMouseEnter={(e) => {
        if (!isActive) {
          const target = e.currentTarget.querySelector('div')
          if (target) {
            target.style.backgroundColor = 'rgba(255,255,255,0.05)'
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          const target = e.currentTarget.querySelector('div')
          if (target) {
            target.style.backgroundColor = 'transparent'
          }
        }
      }}
    >
      {navRowContent}
    </Link>
  )
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const pathname = usePathname()
  const { 
    mode,
    isCollapsed, 
    isMobileOpen, 
    showAsDrawer, 
    closeMobileDrawer,
    mounted,
    isDesktop
  } = useSidebarContext()
  
  const activeModuleId = getActiveModule(pathname)
  const moduleConfig = getModuleConfig(activeModuleId || 'privacy')
  
  // Find active item within current module
  const activeItemId = moduleConfig?.items.find(item => 
    pathname === item.href || pathname.startsWith(item.href + '/')
  )?.id

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
        className={cn(
          "flex flex-col transition-all duration-300",
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
        className="flex-1 pt-6 pb-6 space-y-2" 
        role="navigation" 
        aria-label="Module navigation"
        id="main-sidebar"
        style={{
          paddingLeft: '12px',
          paddingRight: '4px', // Reduced to ensure highlights don't exceed bounds
          overflow: 'hidden' // Prevent any overflow
        }}
      >
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
          className={cn(
            "fixed top-0 left-0 h-full w-64 flex flex-col transition-transform duration-300 z-50",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            showAsDrawer ? "block" : "hidden", // Show only when mobile drawer mode
            className
          )}
          style={{ 
            backgroundColor: 'var(--surface-1)', 
            borderRight: `1px solid var(--border-subtle)`
          }}
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
      className={cn(
        "flex flex-col transition-all duration-300 flex-shrink-0",
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
}