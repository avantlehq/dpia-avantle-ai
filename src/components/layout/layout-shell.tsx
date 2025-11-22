'use client'

import React, { type ReactNode } from 'react'
import { SidebarLeft } from './sidebar-left'
import { Topbar } from './topbar'
import { RightPanel } from './right-panel'
import { LayoutProvider, useLayoutState } from '@/lib/state/layout'
import { cn } from '@/lib/utils'

interface LayoutShellProps {
  children: ReactNode
  rightPanel?: ReactNode
  className?: string
  showSidebar?: boolean
  showTopbar?: boolean
}

function LayoutShellContent({ 
  children, 
  rightPanel, 
  className,
  showSidebar = true,
  showTopbar = true 
}: LayoutShellProps) {
  const { leftSidebarOpen, rightPanelOpen } = useLayoutState()

  return (
    <div className={cn("min-h-screen w-full avantle-gradient flex flex-col", className)}>
      {/* Topbar spans full width at top */}
      {showTopbar && <Topbar />}
      
      {/* Main layout below topbar - Simple Flexbox */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        {showSidebar && (
          <div className={cn(
            "transition-all duration-300 flex-shrink-0",
            leftSidebarOpen ? "w-60" : "w-16"
          )}>
            <SidebarLeft />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Right Panel */}
        {rightPanel && rightPanelOpen && (
          <div className="w-80 flex-shrink-0">
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  )
}

export function LayoutShell(props: LayoutShellProps) {
  return (
    <LayoutProvider>
      <LayoutShellContent {...props} />
    </LayoutProvider>
  )
}

// Specialized layouts
interface WizardLayoutProps extends LayoutShellProps {
  steps?: ReactNode
}

export function WizardLayout({ steps, children, rightPanel, ...props }: WizardLayoutProps) {
  return (
    <LayoutShell rightPanel={rightPanel} {...props}>
      <div className="flex gap-6">
        {/* Wizard Steps Sidebar */}
        {steps && (
          <div className="w-full lg:w-48 lg:flex-shrink-0">
            {steps}
          </div>
        )}

        {/* Main Wizard Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </LayoutShell>
  )
}

// Simple layout without sidebar
export function SimpleLayout({ children, className, ...props }: LayoutShellProps) {
  return (
    <LayoutShell 
      showSidebar={false} 
      className={className} 
      {...props}
    >
      {children}
    </LayoutShell>
  )
}