'use client'

import { useCallback, useRef, useState } from 'react'

interface TouchPosition {
  x: number
  y: number
}

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  minDistance?: number
  maxVerticalDistance?: number
  velocityThreshold?: number
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  minDistance = 50,
  maxVerticalDistance = 100,
  velocityThreshold = 0.3
}: SwipeGestureOptions) {
  const startPos = useRef<TouchPosition | null>(null)
  const startTime = useRef<number>(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      startPos.current = { x: touch.clientX, y: touch.clientY }
      startTime.current = Date.now()
      setIsDragging(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startPos.current) return

    const touch = e.touches[0]
    if (!touch) return

    const deltaX = touch.clientX - startPos.current.x
    const deltaY = Math.abs(touch.clientY - startPos.current.y)

    // Prevent vertical scrolling if horizontal swipe is detected
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      e.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startPos.current || !isDragging) return

    const touch = e.changedTouches[0]
    if (!touch) return

    const endPos = { x: touch.clientX, y: touch.clientY }
    const deltaX = endPos.x - startPos.current.x
    const deltaY = Math.abs(endPos.y - startPos.current.y)
    const distance = Math.abs(deltaX)
    const duration = Date.now() - startTime.current
    const velocity = distance / duration

    // Check if gesture meets criteria
    if (
      distance >= minDistance &&
      deltaY <= maxVerticalDistance &&
      velocity >= velocityThreshold
    ) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    // Reset state
    startPos.current = null
    startTime.current = 0
    setIsDragging(false)
  }, [isDragging, minDistance, maxVerticalDistance, velocityThreshold, onSwipeLeft, onSwipeRight])

  const handleTouchCancel = useCallback(() => {
    startPos.current = null
    startTime.current = 0
    setIsDragging(false)
  }, [])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    isDragging
  }
}