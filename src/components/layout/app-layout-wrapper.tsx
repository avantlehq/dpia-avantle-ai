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

function SimpleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="simple-layout avantle-gradient">
      {children}
    </div>
  )
}

function AppLayoutWithSidebar({ children }: { children: ReactNode }) {
  const { leftSidebarOpen, rightPanelOpen } = useLayoutState()
  
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

function AppLayoutContent({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname()
  
  // Determine if this route should use the app layout or simple layout
  const useAppLayout = pathname !== '/' && !pathname.includes('not-found')
  
  if (!useAppLayout) {
    return <SimpleLayout>{children}</SimpleLayout>
  }
  
  return <AppLayoutWithSidebar>{children}</AppLayoutWithSidebar>
}

export function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  return (
    <LayoutProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </LayoutProvider>
  )
}