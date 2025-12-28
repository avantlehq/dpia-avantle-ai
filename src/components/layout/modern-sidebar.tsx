'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getActiveModule, getModuleConfig, type NavItem } from '@/lib/state/modules'
import { useSidebarToggle } from '@/hooks/useSidebarToggle'

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
      className="group relative flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 focus-within:outline-none"
      style={{
        backgroundColor: 'transparent', // Clean professional background
        borderLeft: isActive ? '2px solid var(--brand-primary)' : 'none', // Brand primary accent when active
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', // Design token colors
        paddingLeft: isActive ? '11px' : '12px', // Compensate for border width
        paddingRight: '20px' // Add right padding to prevent text touching border
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
        <span 
          className="text-xs font-semibold text-center w-full"
          style={{
            color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)'
          }}
          title={item.name} // Tooltip for accessibility
        >
          {item.name.charAt(0).toUpperCase()}
        </span>
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
    >
      {navRowContent}
    </Link>
  )
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const pathname = usePathname()
  const { 
    isCollapsed, 
    isMobileOpen, 
    showAsDrawer, 
    closeMobileDrawer,
    mounted,
    isDesktop
  } = useSidebarToggle()
  
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
    return (
      <aside 
        className={cn(
          "flex flex-col w-64 hidden lg:flex",
          className
        )}
        style={{ 
          backgroundColor: 'var(--surface-1)', 
          borderRight: `1px solid var(--border-subtle)`
        }}
      >
        <div className="px-4 py-4 border-b" style={{ 
          borderColor: 'var(--border-subtle)', 
          backgroundColor: 'var(--surface-2)'
        }}>
          <h2 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
            HOME
          </h2>
        </div>
        <div className="flex-1" />
      </aside>
    )
  }

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {/* Fixed HOME Header - Does not change with module switching */}
      <div className="px-4 py-4 border-b" style={{ 
        borderColor: 'var(--border-subtle)', 
        backgroundColor: 'var(--surface-2)'
      }}>
        <div className="flex items-center justify-between">
          {!(isDesktop && isCollapsed) && (
            <div className="flex items-center gap-3">
              <h2 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                HOME
              </h2>
            </div>
          )}
          
          {isDesktop && isCollapsed && (
            <div className="flex justify-center w-full">
              <span className="text-sm font-semibold" style={{ color: 'var(--brand-primary)' }}>H</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items - Increased vertical spacing */}
      <nav 
        className="flex-1 px-4 py-6 space-y-2" 
        role="navigation" 
        aria-label="Module navigation"
        id="main-sidebar"
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
            "fixed top-0 left-0 h-full w-64 flex flex-col transition-transform duration-300 z-50 lg:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
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

  // Desktop Mode (Expanded or Rail)
  return (
    <aside 
      className={cn(
        "flex flex-col transition-all duration-300 hidden lg:flex",
        isDesktop && isCollapsed ? "w-16" : "w-64",
        className
      )}
      style={{ 
        backgroundColor: 'var(--surface-1)', 
        borderRight: `1px solid var(--border-subtle)`
      }}
    >
      {sidebarContent}
    </aside>
  )
}