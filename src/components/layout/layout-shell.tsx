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
    <div className={cn(
      "flex min-h-screen w-full avantle-gradient",
      className
    )}>
      {/* Left Sidebar */}
      {showSidebar && (
        <SidebarLeft />
      )}

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300",
        showSidebar && leftSidebarOpen ? "lg:ml-0" : ""
      )}>
        {/* Topbar */}
        {showTopbar && <Topbar />}

        {/* Main Content + Right Panel */}
        <main className="flex flex-1 overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </div>

          {/* Right Panel */}
          {rightPanel && rightPanelOpen && (
            <RightPanel>{rightPanel}</RightPanel>
          )}
        </main>
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