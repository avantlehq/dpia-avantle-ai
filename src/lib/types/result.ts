// Result pattern for consistent error handling
export type Result<T> = 
  | { success: true; data: T }
  | { 
      success: false; 
      error: 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'VALIDATION_ERROR';
      message: string;
      details?: string;
    }

// Helper functions for creating results
export const createSuccess = <T>(data: T): Result<T> => ({
  success: true,
  data
})

export const createError = <T>(
  error: 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'VALIDATION_ERROR',
  message: string,
  details?: string
): Result<T> => ({
  success: false,
  error,
  message,
  details
})

// Type guards
export const isSuccess = <T>(result: Result<T>): result is { success: true; data: T } => {
  return result.success
}

export const isError = <T>(result: Result<T>): result is { 
  success: false; 
  error: 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'VALIDATION_ERROR'; 
  message: string; 
  details?: string 
} => {
  return !result.success
}