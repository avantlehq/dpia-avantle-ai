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
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>
        <span style={{ 
          color: '#9ca3af', 
          fontSize: '14px', 
          fontWeight: '500',
          marginLeft: '24px'
        }}>
          Privacy Platform v3.19.20
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
        <button style={{
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
        }}>
          🌙
        </button>

        {/* Help Button */}
        <button style={{
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
        }}>
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