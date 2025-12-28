'use client'

import { useState, useEffect, useCallback } from 'react'

type SidebarMode = 'expanded' | 'collapsed'

const STORAGE_KEY = 'ui.sidebarMode'
const DESKTOP_BREAKPOINT = 1024

export function useSidebarToggle() {
  // Start with simple, working defaults
  const [mode, setMode] = useState<SidebarMode>('expanded')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Track hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize screen size and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScreenSize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT
      setIsDesktop(desktop)
      if (desktop) {
        setIsMobileOpen(false) // Close mobile drawer on desktop
      }
    }

    // Load from localStorage - start fresh for debugging
    localStorage.removeItem(STORAGE_KEY) // TEMP: Clear any stuck state
    const savedMode = localStorage.getItem(STORAGE_KEY) as SidebarMode
    if (savedMode === 'collapsed' || savedMode === 'expanded') {
      setMode(savedMode)
    } else {
      // Ensure we start expanded
      setMode('expanded')
      localStorage.setItem(STORAGE_KEY, 'expanded')
    }

    // Set initial screen size
    updateScreenSize()

    // Listen for resize
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  // Toggle sidebar based on current context (desktop vs mobile)
  const toggle = useCallback(() => {
    console.log('Toggle called!', { isDesktop, mode, currentState: { mode, isDesktop, isMobileOpen } })
    if (isDesktop) {
      // Desktop: toggle expanded/collapsed mode
      const newMode = mode === 'expanded' ? 'collapsed' : 'expanded'
      console.log('Desktop toggle:', mode, '->', newMode)
      setMode(newMode)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newMode)
      }
    } else {
      // Mobile: toggle drawer open/close
      console.log('Mobile toggle:', isMobileOpen, '->', !isMobileOpen)
      setIsMobileOpen(prev => !prev)
    }
  }, [isDesktop, mode, isMobileOpen])

  // Close mobile drawer (for backdrop click, ESC key)
  const closeMobileDrawer = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  // Set specific mode (for programmatic control)
  const setSidebarMode = useCallback((newMode: SidebarMode) => {
    if (isDesktop) {
      setMode(newMode)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newMode)
      }
    }
  }, [isDesktop])

  // Keyboard shortcut handler (Cmd/Ctrl + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Cmd/Ctrl + B and not typing in input fields
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        const target = event.target as HTMLElement
        const isTyping = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.isContentEditable

        if (!isTyping) {
          event.preventDefault()
          toggle()
        }
      }

      // ESC key closes mobile drawer
      if (event.key === 'Escape' && !isDesktop && isMobileOpen) {
        closeMobileDrawer()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle, closeMobileDrawer, isDesktop, isMobileOpen])

  return {
    // State
    mode,
    isMobileOpen,
    isDesktop,
    mounted,
    // Functions  
    toggle,
    closeMobileDrawer,
    setMode: setSidebarMode,
    // Computed states for easier component usage
    isExpanded: mode === 'expanded',
    isCollapsed: mode === 'collapsed',
    showAsDrawer: !isDesktop,
    showAsRail: isDesktop && mode === 'collapsed',
  }
}