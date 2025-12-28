'use client'

import { useState, useEffect, useCallback } from 'react'

type SidebarMode = 'expanded' | 'collapsed'

interface SidebarState {
  mode: SidebarMode
  isMobileOpen: boolean
  isDesktop: boolean
}

const STORAGE_KEY = 'ui.sidebarMode'
const DESKTOP_BREAKPOINT = 1024

export function useSidebarToggle() {
  const [state, setState] = useState<SidebarState>({
    mode: 'expanded',
    isMobileOpen: false,
    isDesktop: true,
  })
  const [mounted, setMounted] = useState(false)

  // Track hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize state from localStorage and detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT
      setState(prev => ({
        ...prev,
        isDesktop,
        isMobileOpen: isDesktop ? false : prev.isMobileOpen, // Reset mobile drawer when switching to desktop
      }))
    }

    // Load persisted sidebar mode (only in browser)
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(STORAGE_KEY) as SidebarMode
      if (savedMode && (savedMode === 'expanded' || savedMode === 'collapsed')) {
        setState(prev => ({ ...prev, mode: savedMode }))
      }
    }

    // Set initial screen size
    updateScreenSize()

    // Listen for resize events
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  // Toggle sidebar based on current context (desktop vs mobile)
  const toggle = useCallback(() => {
    setState(prev => {
      if (prev.isDesktop) {
        // Desktop: toggle expanded/collapsed mode
        const newMode = prev.mode === 'expanded' ? 'collapsed' : 'expanded'
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newMode)
        }
        return { ...prev, mode: newMode }
      } else {
        // Mobile: toggle drawer open/close
        return { ...prev, isMobileOpen: !prev.isMobileOpen }
      }
    })
  }, [])

  // Close mobile drawer (for backdrop click, ESC key)
  const closeMobileDrawer = useCallback(() => {
    setState(prev => ({ ...prev, isMobileOpen: false }))
  }, [])

  // Set specific mode (for programmatic control)
  const setMode = useCallback((mode: SidebarMode) => {
    setState(prev => {
      if (prev.isDesktop) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, mode)
        }
        return { ...prev, mode }
      }
      return prev // Don't change mode on mobile
    })
  }, [])

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
      if (event.key === 'Escape' && !state.isDesktop && state.isMobileOpen) {
        closeMobileDrawer()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle, closeMobileDrawer, state.isDesktop, state.isMobileOpen])

  return {
    ...state,
    toggle,
    closeMobileDrawer,
    setMode,
    mounted,
    // Computed states for easier component usage
    isExpanded: state.mode === 'expanded',
    isCollapsed: state.mode === 'collapsed',
    showAsDrawer: !state.isDesktop,
    showAsRail: state.isDesktop && state.mode === 'collapsed',
  }
}