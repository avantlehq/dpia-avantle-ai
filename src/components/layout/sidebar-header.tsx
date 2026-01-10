'use client'

import React, { memo, useCallback } from 'react'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSidebarContext } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'

interface SidebarHeaderProps {
  className?: string
}

export const SidebarHeader = memo(function SidebarHeader({ className }: SidebarHeaderProps) {
  const pathname = usePathname()
  const { 
    isCollapsed, 
    showAsDrawer, 
    isMobileOpen, 
    closeMobileDrawer, 
    toggle,
    isDesktop 
  } = useSidebarContext()

  // Extract locale from pathname and navigate to central dashboard
  const pathSegments = pathname.split('/').filter(Boolean)
  const locale = pathSegments[0] || 'en'
  const homeHref = `/${locale}/dashboard`

  // Close button handler
  const handleClose = useCallback(() => {
    closeMobileDrawer()
  }, [closeMobileDrawer])

  // Collapse toggle handler  
  const handleToggle = useCallback(() => {
    toggle()
  }, [toggle])

  // Show close button only in mobile drawer mode
  const showCloseButton = showAsDrawer && isMobileOpen

  return (
    <header 
      className={cn("flex items-center justify-between border-b", className)}
      style={{ 
        height: '56px',
        paddingLeft: '12px',
        paddingRight: '12px',
        borderColor: 'var(--border-subtle)'
      }}
    >
      {/* Left: HOME/Brand area */}
      <div className="flex items-center flex-1">
        {!isCollapsed && (
          <Link 
            href={homeHref}
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            <span>HOME</span>
          </Link>
        )}

        {/* Collapse toggle - desktop only, positioned after HOME */}
        {isDesktop && !showAsDrawer && (
          <button
            onClick={handleToggle}
            className="ml-auto p-1 rounded transition-colors"
            style={{
              color: 'var(--text-muted)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Right: Close button (mobile drawer only) */}
      {showCloseButton && (
        <button
          onClick={handleClose}
          className="flex items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)'
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--brand-primary)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </header>
  )
})