'use client'

import React, { useState, type ReactNode } from 'react'
import { VERSION } from '@/lib/version'

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
          Privacy Platform v3.19.33
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
        <div style={{ marginBottom: '16px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Workspace
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '8px' }}>
            <a href="/dashboard" style={{ 
              color: '#9ca3af', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 0'
            }}>
              <span style={{ fontSize: '16px' }}>📊</span>
              Overview
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <a href="/precheck" style={{ 
              color: '#9ca3af', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 0'
            }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              DPIA Pre-Check
            </a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <a href="/assessments" style={{ 
              color: '#9ca3af', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 0'
            }}>
              <span style={{ fontSize: '16px' }}>🎯</span>
              DPIA Assessments
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
      DPIA.ai Privacy Platform v3.19.33 - GDPR Compliance Tool
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
      {/* Safe Topbar */}
      <SafeTopbar 
        toggleSidebar={toggleSidebar}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      {/* Main Layout */}
      <div style={{ display: 'flex' }}>
        {/* Safe Left Sidebar */}
        {sidebarOpen && <SafeSidebar />}
        
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