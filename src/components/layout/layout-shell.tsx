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

  // Calculate layout variables
  const sidebarWidth = showSidebar ? (leftSidebarOpen ? 240 : 64) : 0
  const rightPanelWidth = rightPanel && rightPanelOpen ? 320 : 0

  return (
    <div 
      className={cn("min-h-screen w-full avantle-gradient", className)}
      style={{
        '--sidebar-width': `${sidebarWidth}px`,
        '--right-panel-width': `${rightPanelWidth}px`,
      } as React.CSSProperties}
    >
      {/* Topbar spans full width at top */}
      {showTopbar && <Topbar />}
      
      {/* Main layout below topbar with CSS Grid */}
      <div 
        className="grid transition-all duration-300"
        style={{
          height: showTopbar ? 'calc(100vh - 4rem)' : '100vh',
          gridTemplateColumns: (() => {
            const cols = []
            if (showSidebar) cols.push(`${sidebarWidth}px`)
            cols.push('1fr')
            if (rightPanel && rightPanelOpen) cols.push('320px')
            return cols.join(' ')
          })()
        }}
      >
        {/* Left Sidebar */}
        {showSidebar && <SidebarLeft />}

        {/* Main Content Area */}
        <div className="flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Right Panel */}
        {rightPanel && rightPanelOpen && <RightPanel />}
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