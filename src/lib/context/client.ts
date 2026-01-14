/**
 * Context Module Client - Shared fetch utilities
 *
 * Provides type-safe fetch helpers for Context API endpoints
 * with error handling and cache management.
 */

export class ContextApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ContextApiError'
  }
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  cache?: RequestCache
  revalidate?: number
}

/**
 * Internal fetch helper with error handling
 */
export async function contextFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, cache = 'no-store' } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    cache,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(endpoint, config)

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    let errorCode: string | undefined

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorCode = errorData.code
    } catch {
      // If JSON parsing fails, use default error message
    }

    throw new ContextApiError(errorMessage, response.status, errorCode)
  }

  return response.json()
}
