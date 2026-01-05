/**
 * Context Module - Error Handler Middleware
 * 
 * Centralized error handling for Context API routes.
 * Formats errors consistently and logs appropriately.
 */

import { NextResponse } from 'next/server';
import { ValidationError } from './validation';

/**
 * Standard API error response format
 */
interface APIErrorResponse {
  error: string;
  message: string;
  details?: any;
  timestamp: string;
  path?: string;
}

/**
 * Known error types and their HTTP status codes
 */
const ERROR_STATUS_MAP = {
  // Client errors (4xx)
  VALIDATION_ERROR: 400,
  INVALID_REQUEST: 400,
  UNAUTHORIZED: 401,
  TOKEN_EXPIRED: 401,
  INVALID_TOKEN: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  RATE_LIMIT_EXCEEDED: 429,

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 500,
  DATABASE_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Main error handler function
 */
export function handleApiError(
  error: unknown,
  path?: string
): NextResponse<APIErrorResponse> {
  const timestamp = new Date().toISOString();

  // Handle validation errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: 'VALIDATION_ERROR',
        message: error.message,
        details: { fields: error.fields },
        timestamp,
        path,
      },
      { status: 400 }
    );
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    const errorResponse = handleStandardError(error, timestamp, path);
    return errorResponse;
  }

  // Handle string errors
  if (typeof error === 'string') {
    logError('STRING_ERROR', error, { path, timestamp });
    
    return NextResponse.json(
      {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp,
        path,
      },
      { status: 500 }
    );
  }

  // Handle unknown error types
  logError('UNKNOWN_ERROR', 'Unknown error type', { error, path, timestamp });
  
  return NextResponse.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp,
      path,
    },
    { status: 500 }
  );
}

/**
 * Handle standard Error instances
 */
function handleStandardError(
  error: Error,
  timestamp: string,
  path?: string
): NextResponse<APIErrorResponse> {
  const message = error.message;

  // Database/Supabase errors
  if (message.includes('database') || 
      message.includes('relation') || 
      message.includes('column') ||
      message.includes('constraint')) {
    return handleDatabaseError(error, timestamp, path);
  }

  // Authentication/Authorization errors
  if (message.includes('jwt') || 
      message.includes('token') || 
      message.includes('unauthorized') ||
      message.includes('permission')) {
    return handleAuthError(error, timestamp, path);
  }

  // Business logic errors (thrown by services)
  if (message.includes('not found')) {
    logError('NOT_FOUND', message, { path, timestamp });
    
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: message,
        timestamp,
        path,
      },
      { status: 404 }
    );
  }

  if (message.includes('already exists') || 
      message.includes('conflict') ||
      message.includes('duplicate')) {
    logError('CONFLICT', message, { path, timestamp });
    
    return NextResponse.json(
      {
        error: 'CONFLICT',
        message: message,
        timestamp,
        path,
      },
      { status: 409 }
    );
  }

  if (message.includes('cannot delete') || 
      message.includes('in use') ||
      message.includes('has dependencies')) {
    logError('CONFLICT', message, { path, timestamp });
    
    return NextResponse.json(
      {
        error: 'CONFLICT',
        message: message,
        timestamp,
        path,
      },
      { status: 409 }
    );
  }

  // Rate limiting errors
  if (message.includes('rate limit') || message.includes('too many requests')) {
    logError('RATE_LIMIT_EXCEEDED', message, { path, timestamp });
    
    return NextResponse.json(
      {
        error: 'RATE_LIMIT_EXCEEDED',
        message: message,
        timestamp,
        path,
      },
      { status: 429 }
    );
  }

  // Default to internal server error
  logError('INTERNAL_SERVER_ERROR', message, { 
    stack: error.stack, 
    path, 
    timestamp 
  });
  
  return NextResponse.json(
    {
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An internal error occurred',
      timestamp,
      path,
    },
    { status: 500 }
  );
}

/**
 * Handle database-related errors
 */
function handleDatabaseError(
  error: Error,
  timestamp: string,
  path?: string
): NextResponse<APIErrorResponse> {
  const message = error.message;

  // Log the full error for debugging
  logError('DATABASE_ERROR', message, { 
    stack: error.stack, 
    path, 
    timestamp 
  });

  // Foreign key constraint violations
  if (message.includes('foreign key constraint') || 
      message.includes('violates foreign key')) {
    return NextResponse.json(
      {
        error: 'INVALID_REQUEST',
        message: 'Referenced entity does not exist',
        timestamp,
        path,
      },
      { status: 400 }
    );
  }

  // Unique constraint violations
  if (message.includes('unique constraint') || 
      message.includes('already exists')) {
    return NextResponse.json(
      {
        error: 'CONFLICT',
        message: 'Resource already exists',
        timestamp,
        path,
      },
      { status: 409 }
    );
  }

  // Row Level Security violations
  if (message.includes('new row violates row-level security') ||
      message.includes('permission denied')) {
    return NextResponse.json(
      {
        error: 'FORBIDDEN',
        message: 'Access denied to this resource',
        timestamp,
        path,
      },
      { status: 403 }
    );
  }

  // Connection errors
  if (message.includes('connection') || 
      message.includes('timeout') ||
      message.includes('network')) {
    return NextResponse.json(
      {
        error: 'SERVICE_UNAVAILABLE',
        message: 'Database service temporarily unavailable',
        timestamp,
        path,
      },
      { status: 503 }
    );
  }

  // Generic database error
  return NextResponse.json(
    {
      error: 'DATABASE_ERROR',
      message: 'Database operation failed',
      timestamp,
      path,
    },
    { status: 500 }
  );
}

/**
 * Handle authentication/authorization errors
 */
function handleAuthError(
  error: Error,
  timestamp: string,
  path?: string
): NextResponse<APIErrorResponse> {
  const message = error.message;

  logError('AUTH_ERROR', message, { path, timestamp });

  if (message.includes('expired')) {
    return NextResponse.json(
      {
        error: 'TOKEN_EXPIRED',
        message: 'Authentication token has expired',
        timestamp,
        path,
      },
      { status: 401 }
    );
  }

  if (message.includes('malformed') || 
      message.includes('invalid token')) {
    return NextResponse.json(
      {
        error: 'INVALID_TOKEN',
        message: 'Authentication token is invalid',
        timestamp,
        path,
      },
      { status: 401 }
    );
  }

  if (message.includes('permission') || 
      message.includes('forbidden') ||
      message.includes('access denied')) {
    return NextResponse.json(
      {
        error: 'FORBIDDEN',
        message: 'Insufficient permissions',
        timestamp,
        path,
      },
      { status: 403 }
    );
  }

  // Generic auth error
  return NextResponse.json(
    {
      error: 'UNAUTHORIZED',
      message: 'Authentication failed',
      timestamp,
      path,
    },
    { status: 401 }
  );
}

/**
 * Log errors with appropriate level and context
 */
function logError(
  errorType: string, 
  message: string, 
  context: Record<string, any>
) {
  const logEntry = {
    type: errorType,
    message,
    ...context,
  };

  // In production, use structured logging
  if (process.env.NODE_ENV === 'production') {
    // Use your preferred logging service (e.g., Winston, Bunyan, etc.)
    console.error(JSON.stringify(logEntry));
  } else {
    // Development logging
    console.error(`[${errorType}] ${message}`, context);
  }
}

/**
 * Async error handler wrapper for route handlers
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Extract path from request if available
      const request = args[0] as any;
      const path = request && request.nextUrl ? request.nextUrl.pathname : undefined;
      
      return handleApiError(error, path);
    }
  };
}

/**
 * Error boundary for service layer operations
 */
export async function safeServiceCall<T>(
  operation: () => Promise<T>,
  errorContext?: Record<string, any>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Add context to error and re-throw
    if (error instanceof Error && errorContext) {
      error.message = `${error.message} (Context: ${JSON.stringify(errorContext)})`;
    }
    throw error;
  }
}

/**
 * Health check error formatter
 */
export function formatHealthCheckError(error: unknown): {
  healthy: false;
  error: string;
  message: string;
  timestamp: string;
} {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    return {
      healthy: false,
      error: 'HEALTH_CHECK_FAILED',
      message: error.message,
      timestamp,
    };
  }

  return {
    healthy: false,
    error: 'HEALTH_CHECK_FAILED',
    message: 'Unknown health check error',
    timestamp,
  };
}

/**
 * Development error details (only in dev mode)
 */
export function addDevelopmentErrorDetails(
  response: APIErrorResponse,
  error: Error
): APIErrorResponse {
  if (process.env.NODE_ENV === 'development') {
    return {
      ...response,
      details: {
        ...response.details,
        stack: error.stack,
        cause: (error as any).cause,
      },
    };
  }

  return response;
}