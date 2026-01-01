'use client'

import React, { type ReactNode } from 'react'
import { ModernTopbar } from '@/components/layout/modern-topbar'
import { ModernSidebar } from '@/components/layout/modern-sidebar'
import { VERSION } from '@/lib/version'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { useSidebarContext } from '@/contexts/SidebarContext'

interface SimpleLayoutProps {
  children: ReactNode
}

// Inner layout component with access to sidebar context
function LayoutContent({ children }: SimpleLayoutProps) {
  const { toggle, showAsDrawer, isMobileOpen } = useSidebarContext()
  
  // Edge swipe detection for opening drawer from screen edge
  const edgeSwipeHandlers = useSwipeGesture({
    onSwipeRight: showAsDrawer && !isMobileOpen ? toggle : undefined,
    minDistance: 30, // Smaller distance for edge swipe
    maxVerticalDistance: 150,
    velocityThreshold: 0.2 // Lower threshold for edge detection
  })

  return (
    <div className="min-h-screen bg-[--background] text-white font-sans">
      {/* Modern Topbar */}
      <ModernTopbar />
      
      {/* Main Layout with responsive grid and edge swipe detection */}
      <div 
        className="flex h-[calc(100vh-4rem)] touch-optimized" 
        {...(showAsDrawer ? edgeSwipeHandlers : {})}
      > 
        {/* Modern Module-Aware Sidebar - Now self-managing visibility */}
        <ModernSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto touch-optimized" style={{ padding: '32px 32px 32px 0px', backgroundColor: 'rgba(255,0,0,0.1)' }}>
            {children}
          </main>
          
          {/* Simple Footer with mobile safe area */}
          <footer 
            className="px-6 py-4 border-t text-xs text-center flex-shrink-0 mobile-safe-area"
            style={{ 
              borderColor: 'var(--border-subtle)', 
              backgroundColor: 'var(--surface-1)', 
              color: 'var(--text-muted)' 
            }}
          >
            Privacy Platform {VERSION}
          </footer>
        </div>
      </div>
    </div>
  )
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}