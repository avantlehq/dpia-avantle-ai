'use client'

import React, { type ReactNode } from 'react'
import { SidebarLeft } from './sidebar-left'
import { Topbar } from './topbar'
import { Footer } from './footer'

interface SimpleLayoutProps {
  children: ReactNode
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Topbar */}
      <Topbar />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Fixed Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <SidebarLeft />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}