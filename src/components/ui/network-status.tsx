'use client'

import { useState, useEffect } from 'react'
import { WifiOff, Wifi, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'

interface NetworkStatusProps {
  onRetry?: () => void
  showOfflineMessage?: boolean
}

export function NetworkStatus({ onRetry, showOfflineMessage = true }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineAlert(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      if (showOfflineMessage) {
        setShowOfflineAlert(true)
      }
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [showOfflineMessage])

  if (!showOfflineAlert) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <ErrorMessage
        type="warning"
        title="No Internet Connection"
        message="You're currently offline. Some features may not work properly."
        dismissible
        onDismiss={() => setShowOfflineAlert(false)}
        actions={onRetry ? [
          {
            label: 'Retry',
            action: onRetry
          }
        ] : undefined}
      />
    </div>
  )
}

// Hook to detect online status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Network status indicator component
export function NetworkIndicator() {
  const isOnline = useNetworkStatus()

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <Wifi className="h-4 w-4 text-green-500" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}

// Retry mechanism with exponential backoff
export class RetryManager {
  private retryCount = 0
  private maxRetries = 3
  private baseDelay = 1000 // 1 second

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        this.retryCount = attempt
        return await operation()
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries
        
        if (isLastAttempt) {
          throw error
        }

        const delay = this.baseDelay * Math.pow(2, attempt)
        
        if (onRetry) {
          onRetry(attempt + 1, error as Error)
        }

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new Error('Max retries exceeded')
  }

  getRetryCount(): number {
    return this.retryCount
  }

  reset(): void {
    this.retryCount = 0
  }
}

// Hook for API calls with retry logic
export function useApiWithRetry() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const isOnline = useNetworkStatus()

  const retryManager = new RetryManager()

  const execute = async <T>(
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
      showNetworkError?: boolean
    }
  ): Promise<T | null> => {
    if (!isOnline) {
      const offlineError = new Error('No internet connection')
      setError(offlineError)
      options?.onError?.(offlineError)
      return null
    }

    setIsLoading(true)
    setError(null)
    setRetryCount(0)

    try {
      const result = await retryManager.executeWithRetry(
        operation,
        (attempt, error) => {
          setRetryCount(attempt)
          console.warn(`API call failed, attempt ${attempt}:`, error)
        }
      )

      options?.onSuccess?.(result)
      retryManager.reset()
      setRetryCount(0)
      return result
    } catch (error) {
      const apiError = error as Error
      setError(apiError)
      options?.onError?.(apiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const retry = () => {
    setError(null)
    retryManager.reset()
    setRetryCount(0)
  }

  return {
    execute,
    retry,
    isLoading,
    error,
    retryCount,
    isOnline
  }
}