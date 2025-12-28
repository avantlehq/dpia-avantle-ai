'use client'

import React, { type ReactNode } from 'react'
import { ModernTopbar } from '@/components/layout/modern-topbar'
import { ModernSidebar } from '@/components/layout/modern-sidebar'
import { VERSION } from '@/lib/version'

interface SimpleLayoutProps {
  children: ReactNode
}


export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-[--background] text-white font-sans">
      {/* Modern Topbar */}
      <ModernTopbar />
      
      {/* Main Layout with responsive grid */}
      <div className="flex h-[calc(100vh-4rem)]"> {/* Subtract topbar height */}
        {/* Modern Module-Aware Sidebar - Now self-managing visibility */}
        <ModernSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
          
          {/* Simple Footer */}
          <footer 
            className="px-6 py-4 border-t text-xs text-center flex-shrink-0"
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