'use client'

import React, { useState, type ReactNode } from 'react'
import { ModernTopbar } from '@/components/layout/modern-topbar'
import { ModernSidebar } from '@/components/layout/modern-sidebar'
import { VERSION } from '@/lib/version'

interface SimpleLayoutProps {
  children: ReactNode
}


export function SimpleLayout({ children }: SimpleLayoutProps) {
  const [sidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[--background] text-white font-sans">
      {/* Modern Topbar */}
      <ModernTopbar />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Modern Module-Aware Sidebar */}
        {sidebarOpen && <ModernSidebar />}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8 ml-4">
            {children}
          </main>
          
          {/* Simple Footer */}
          <footer className="px-6 py-4 border-t border-[--nav-border] bg-[--nav-bg] text-[--text-muted] text-xs text-center">
            Privacy Platform {VERSION} - GDPR Compliance Tool
          </footer>
        </div>
      </div>
    </div>
  )
}