'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type SidebarMode = 'expanded' | 'collapsed'

const STORAGE_KEY = 'ui.sidebarMode'
const DESKTOP_BREAKPOINT = 1024

export function useSidebarToggle() {
  // Start with simple, working defaults
  const [mode, setMode] = useState<SidebarMode>('expanded')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // Focus management for drawer mode
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)

  // Track hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize screen size and localStorage - SSR safe
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const updateScreenSize = () => {
      const desktop = window.innerWidth >= DESKTOP_BREAKPOINT
      setIsDesktop(desktop)
      if (desktop) {
        setIsMobileOpen(false) // Close mobile drawer on desktop
      }
    }

    // Load from localStorage after mount only
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY) as SidebarMode
      if (savedMode === 'collapsed' || savedMode === 'expanded') {
        setMode(savedMode)
      } else {
        setMode('expanded')
        localStorage.setItem(STORAGE_KEY, 'expanded')
      }
    } catch {
      // Fallback for localStorage errors
      setMode('expanded')
    }

    // Set initial screen size
    updateScreenSize()

    // Listen for resize
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [mounted])

  // Toggle sidebar based on current context (desktop vs mobile)
  const toggle = useCallback(() => {
    if (isDesktop) {
      // Desktop: toggle expanded/collapsed mode
      const newMode = mode === 'expanded' ? 'collapsed' : 'expanded'
      setMode(newMode)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newMode)
      }
    } else {
      // Mobile: toggle drawer open/close
      if (!isMobileOpen) {
        // Opening drawer - store current focus
        lastFocusedElementRef.current = document.activeElement as HTMLElement
      }
      setIsMobileOpen(prev => !prev)
    }
  }, [isDesktop, mode, isMobileOpen])

  // Close mobile drawer (for backdrop click, ESC key)
  const closeMobileDrawer = useCallback(() => {
    setIsMobileOpen(false)
    
    // Restore focus to the element that opened the drawer
    if (lastFocusedElementRef.current) {
      // Small delay to ensure drawer is fully closed
      setTimeout(() => {
        lastFocusedElementRef.current?.focus()
        lastFocusedElementRef.current = null
      }, 100)
    }
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

      // ESC key closes mobile drawer OR collapses desktop sidebar
      if (event.key === 'Escape') {
        if (!isDesktop && isMobileOpen) {
          closeMobileDrawer()
        } else if (isDesktop && mode === 'expanded') {
          // Optional: ESC also collapses desktop sidebar
          setSidebarMode('collapsed')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle, closeMobileDrawer, isDesktop, isMobileOpen, mode, setSidebarMode])

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