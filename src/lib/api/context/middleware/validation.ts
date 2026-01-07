/**
 * Context Module - Validation Middleware
 * 
 * Zod-based validation middleware for request/response validation.
 * Handles query parameters, request bodies, and response formatting.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { ZodSchema } from 'zod';

/**
 * Validate request body against Zod schema
 */
export function validateBody<T>(body: unknown, schema: ZodSchema<T>): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = formatZodError(error);
      throw new ValidationError('Request body validation failed', validationError.fields);
    }
    throw new Error('Invalid request body format');
  }
}

/**
 * Validate query parameters against Zod schema
 */
export function validateQuery<T>(searchParams: URLSearchParams, schema: ZodSchema<T>): T {
  try {
    // Convert URLSearchParams to object
    const queryObject: Record<string, unknown> = {};
    
    for (const [key, value] of searchParams.entries()) {
      // Handle array parameters (e.g., ?tags=a&tags=b)
      if (queryObject[key]) {
        if (Array.isArray(queryObject[key])) {
          queryObject[key].push(value);
        } else {
          queryObject[key] = [queryObject[key], value];
        }
      } else {
        queryObject[key] = value;
      }
    }

    return schema.parse(queryObject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = formatZodError(error);
      throw new ValidationError('Query parameter validation failed', validationError.fields);
    }
    throw new Error('Invalid query parameters');
  }
}

/**
 * Validate response data against Zod schema
 */
export function validateResponse<T>(data: unknown, schema: ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Response validation failed:', error);
    if (error instanceof z.ZodError) {
      const validationError = formatZodError(error);
      throw new ValidationError('Response validation failed', validationError.fields);
    }
    throw new Error('Invalid response data format');
  }
}

/**
 * Format Zod validation errors for API responses
 */
function formatZodError(error: z.ZodError): {
  fields: Record<string, string[]>;
  summary: string;
} {
  const fields: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    const field = path || 'root';
    
    if (!fields[field]) {
      fields[field] = [];
    }
    
    fields[field].push(issue.message);
  }

  const fieldCount = Object.keys(fields).length;
  const totalIssues = error.issues.length;
  const summary = `Validation failed for ${fieldCount} field${fieldCount !== 1 ? 's' : ''} (${totalIssues} issue${totalIssues !== 1 ? 's' : ''})`;

  return { fields, summary };
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  public readonly fields: Record<string, string[]>;

  constructor(message: string, fields: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/**
 * Middleware wrapper for request validation
 */
export function withValidation<TBody, TQuery>(options: {
  body?: ZodSchema<TBody>;
  query?: ZodSchema<TQuery>;
}) {
  return function<T extends unknown[]>(
    handler: (validated: { body?: TBody; query?: TQuery }, ...args: T) => Promise<NextResponse>
  ) {
    return async (...args: T): Promise<NextResponse> => {
      try {
        const validated: { body?: TBody; query?: TQuery } = {};

        // Extract request from args (assuming first arg is NextRequest)
        const request = args[0] as { nextUrl?: { searchParams: URLSearchParams }; json?: () => Promise<unknown> };

        // Validate query parameters if schema provided
        if (options.query && request && typeof request.nextUrl === 'object') {
          validated.query = validateQuery(request.nextUrl.searchParams, options.query);
        }

        // Validate request body if schema provided
        if (options.body && request && typeof request.json === 'function') {
          const body = await request.json();
          validated.body = validateBody(body, options.body);
        }

        return await handler(validated, ...args);

      } catch (error) {
        if (error instanceof ValidationError) {
          return NextResponse.json(
            {
              error: 'VALIDATION_ERROR',
              message: error.message,
              fields: error.fields,
            },
            { status: 400 }
          );
        }

        // Re-throw non-validation errors
        throw error;
      }
    };
  };
}

/**
 * Validate UUIDs in path parameters
 */
export function validateUUIDs(params: Record<string, string>): Record<string, string> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  for (const [key, value] of Object.entries(params)) {
    if (!uuidRegex.test(value)) {
      throw new ValidationError(`Invalid UUID format for parameter: ${key}`, {
        [key]: [`Must be a valid UUID format`],
      });
    }
  }

  return params;
}

/**
 * Sanitize and validate pagination parameters
 */
export function validatePagination(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Validate and sanitize search terms
 */
export function validateSearch(searchParams: URLSearchParams): {
  search?: string;
  searchFields?: string[];
} {
  const search = searchParams.get('search')?.trim();
  const searchFieldsParam = searchParams.get('search_fields');
  
  let searchFields: string[] | undefined;
  if (searchFieldsParam) {
    searchFields = searchFieldsParam.split(',').map(field => field.trim()).filter(Boolean);
  }

  // Sanitize search term
  if (search && search.length > 0) {
    // Remove potentially dangerous characters
    const sanitized = search.replace(/[<>'"&]/g, '');
    
    if (sanitized.length < 2) {
      throw new ValidationError('Search term validation failed', {
        search: ['Search term must be at least 2 characters long'],
      });
    }

    if (sanitized.length > 100) {
      throw new ValidationError('Search term validation failed', {
        search: ['Search term must be less than 100 characters'],
      });
    }

    return { search: sanitized, searchFields };
  }

  return {};
}

/**
 * Validate date ranges
 */
export function validateDateRange(searchParams: URLSearchParams): {
  startDate?: Date;
  endDate?: Date;
} {
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (startDateParam) {
    startDate = new Date(startDateParam);
    if (isNaN(startDate.getTime())) {
      throw new ValidationError('Date validation failed', {
        start_date: ['Invalid date format. Use YYYY-MM-DD or ISO 8601 format'],
      });
    }
  }

  if (endDateParam) {
    endDate = new Date(endDateParam);
    if (isNaN(endDate.getTime())) {
      throw new ValidationError('Date validation failed', {
        end_date: ['Invalid date format. Use YYYY-MM-DD or ISO 8601 format'],
      });
    }
  }

  // Validate date range logic
  if (startDate && endDate && startDate > endDate) {
    throw new ValidationError('Date range validation failed', {
      date_range: ['Start date must be before end date'],
    });
  }

  // Validate reasonable date range (e.g., not more than 10 years)
  if (startDate && endDate) {
    const maxRangeMs = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years
    if (endDate.getTime() - startDate.getTime() > maxRangeMs) {
      throw new ValidationError('Date range validation failed', {
        date_range: ['Date range cannot exceed 10 years'],
      });
    }
  }

  return { startDate, endDate };
}

/**
 * Validate file upload parameters
 */
export function validateFileUpload(file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}): void {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    throw new ValidationError('File validation failed', {
      file_size: [`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`],
    });
  }

  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new ValidationError('File validation failed', {
      file_type: [`File type must be one of: ${allowedTypes.join(', ')}`],
    });
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new ValidationError('File validation failed', {
        file_extension: [`File extension must be one of: ${allowedExtensions.join(', ')}`],
      });
    }
  }
}

/**
 * Validation schema for common parameters
 */
export const CommonValidationSchemas = {
  UUID: z.string().uuid(),
  
  Pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),

  Search: z.object({
    search: z.string().min(2).max(100).optional(),
    search_fields: z.array(z.string()).optional(),
  }),

  DateRange: z.object({
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
  }).refine(
    (data) => !data.start_date || !data.end_date || new Date(data.start_date) <= new Date(data.end_date),
    { message: 'Start date must be before end date' }
  ),

  Status: z.enum(['active', 'inactive']).optional(),
};