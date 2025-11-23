'use client'

import React, { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarLeft } from './sidebar-left'
import { Topbar } from './topbar'
import { RightPanel } from './right-panel'
import { Footer } from './footer'
import { LayoutProvider, useLayoutState } from '@/lib/state/layout'
import { cn } from '@/lib/utils'

interface AppLayoutWrapperProps {
  children: ReactNode
}

function AppLayoutContent({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname()
  
  // Always call hooks at top level (React rules)
  const { leftSidebarOpen, rightPanelOpen } = useLayoutState()
  
  // Determine if this route should use the app layout or simple layout
  const useAppLayout = pathname !== '/' // Homepage uses simple layout
  
  if (!useAppLayout) {
    // Simple layout for homepage
    return (
      <div className="simple-layout avantle-gradient">
        {children}
      </div>
    )
  }
  
  // App layout with sidebar/topbar/right panel
  return (
    <div className={cn(
      "app-layout avantle-gradient",
      !leftSidebarOpen && "sidebar-collapsed",
      rightPanelOpen && "right-panel-open"
    )}>
      {/* Topbar */}
      <div className="app-topbar">
        <Topbar />
      </div>
      
      {/* Sidebar */}
      <div className="app-sidebar">
        <SidebarLeft />
      </div>
      
      {/* Main Content */}
      <div className="app-main bg-background">
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </div>
        <Footer />
      </div>
      
      {/* Right Panel */}
      {rightPanelOpen && (
        <div className="app-right">
          <RightPanel />
        </div>
      )}
    </div>
  )
}

export function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  )
}