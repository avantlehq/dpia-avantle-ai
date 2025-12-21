'use client'

import React, { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { VERSION } from '@/lib/version'
import { Topbar } from '@/components/layout/topbar'
import { ModuleSidebar } from '@/components/navigation/module-sidebar'
import { getActiveModule } from '@/lib/state/modules'

interface SimpleLayoutProps {
  children: ReactNode
}

interface SafeTopbarProps {
  toggleSidebar: () => void
  toggleTheme: () => void
  isDarkMode: boolean
}

function SafeTopbar({ toggleSidebar, toggleTheme, isDarkMode }: SafeTopbarProps) {
  return (
    <header style={{
      height: '64px',
      backgroundColor: '#192734',
      borderBottom: '1px solid #2F404E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Sidebar Toggle */}
        <button 
          onClick={toggleSidebar}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #4A90E2',
            borderRadius: '6px',
            padding: '8px',
            color: '#4A90E2',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ☰
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a 
            href="/dashboard"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              padding: '8px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>🛡️</div>
            </div>
            <span style={{ 
              color: '#ffffff', 
              fontSize: '18px', 
              fontWeight: '700'
            }}>
              DPIA.ai
            </span>
          </a>
        </div>
        <span style={{ 
          color: '#9ca3af', 
          fontSize: '14px', 
          fontWeight: '500',
          marginLeft: '24px'
        }}>
          Privacy Platform {VERSION}
        </span>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Language Button */}
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid #4A90E2',
          borderRadius: '6px',
          padding: '6px 12px',
          color: '#4A90E2',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          🌐 EN
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #9B59B6',
            borderRadius: '6px',
            padding: '8px',
            color: '#9B59B6',
            fontSize: '14px',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>

        {/* Help Button */}
        <button 
          onClick={() => window.location.href = '/help'}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #F5A623',
            borderRadius: '6px',
            padding: '8px',
            color: '#F5A623',
            fontSize: '14px',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ❓
        </button>

        {/* User Menu */}
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid #7ED321',
          borderRadius: '6px',
          padding: '6px 12px',
          color: '#7ED321',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7ED321 0%, #5CB85C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '12px'
          }}>
            👤
          </div>
          Demo User
        </button>
      </div>
    </header>
  )
}

function DynamicSidebar() {
  const pathname = usePathname()
  const activeModuleId = getActiveModule(pathname)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? '80px' : '256px',
      backgroundColor: '#1F2D3A',
      borderRight: '1px solid #2F404E', 
      padding: '24px 16px',
      minHeight: 'calc(100vh - 64px)',
      transition: 'width 0.3s ease'
    }}>
      <div style={{ color: '#ffffff' }}>
        <div style={{ 
          marginBottom: '16px', 
          fontSize: '14px', 
          fontWeight: '600', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          color: '#9ca3af'
        }}>
          {!collapsed && 'Workspace'}
        </div>
        
        <ModuleSidebar 
          activeModule={activeModuleId || 'privacy'} 
          collapsed={collapsed}
        />
        
        {/* Collapse Toggle */}
        <div style={{ marginTop: '24px', borderTop: '1px solid #2F404E', paddingTop: '16px' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #4A90E2',
              borderRadius: '6px',
              padding: '8px',
              color: '#4A90E2',
              cursor: 'pointer',
              width: '100%',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {collapsed ? '→' : '←'} {!collapsed && 'Collapse'}
          </button>
        </div>
      </div>
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
      DPIA.ai Privacy Platform {VERSION} - GDPR Compliance Tool
    </footer>
  )
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#192734', 
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* New Module-Enabled Topbar */}
      <Topbar />
      
      {/* Main Layout */}
      <div style={{ display: 'flex' }}>
        {/* Dynamic Module-Aware Sidebar */}
        {sidebarOpen && <DynamicSidebar />}
        
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