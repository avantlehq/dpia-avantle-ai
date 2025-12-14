'use client'

import React, { type ReactNode } from 'react'

interface SimpleLayoutProps {
  children: ReactNode
}

function SafeTopbar() {
  return (
    <header style={{
      height: '64px',
      backgroundColor: '#192734',
      borderBottom: '1px solid #2F404E',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    }}>
      <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600' }}>
        DPIA.ai Privacy Platform
      </h1>
    </header>
  )
}

function SafeSidebar() {
  return (
    <aside style={{
      width: '256px',
      backgroundColor: '#1F2D3A',
      borderRight: '1px solid #2F404E',
      padding: '24px 16px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <nav style={{ color: '#ffffff' }}>
        <div style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>
          Navigation
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '8px' }}>
            <a href="/dashboard" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Dashboard
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <a href="/precheck" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Pre-check
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <a href="/assessments" style={{ color: '#9ca3af', textDecoration: 'none' }}>
              Assessments
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

function SafeFooter() {
  return (
    <footer style={{
      padding: '16px 24px',
      borderTop: '1px solid #2F404E',
      backgroundColor: '#1F2D3A',
      color: '#9ca3af',
      fontSize: '12px',
      textAlign: 'center'
    }}>
      DPIA.ai Privacy Platform - GDPR Compliance Tool
    </footer>
  )
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#192734', 
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Safe Topbar */}
      <SafeTopbar />
      
      {/* Main Layout */}
      <div style={{ display: 'flex' }}>
        {/* Safe Left Sidebar */}
        <SafeSidebar />
        
        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, padding: '24px' }}>
            {children}
          </main>
          
          {/* Safe Footer */}
          <SafeFooter />
        </div>
      </div>
    </div>
  )
}