/**
 * Context Module - Authentication Middleware
 * 
 * JWT authentication middleware for Context API routes.
 * Validates tokens and extracts tenant/workspace context.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import type { ContextClaims } from '../types';

/**
 * Authentication middleware for Context API routes
 */
export function withAuth<T extends unknown[]>(
  handler: (context: ContextClaims, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Extract JWT token from Authorization header
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { 
            error: 'UNAUTHORIZED', 
            message: 'Missing or invalid Authorization header' 
          },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify and decode JWT token
      const context = await verifyJwtToken(token);

      // Validate required context claims
      if (!context.tenant_id || !context.workspace_id || !context.sub) {
        return NextResponse.json(
          { 
            error: 'UNAUTHORIZED', 
            message: 'Invalid token claims: missing tenant_id, workspace_id, or sub' 
          },
          { status: 401 }
        );
      }

      // Call the handler with authenticated context
      return await handler(context, ...args);

    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error instanceof Error) {
        // Handle specific JWT errors
        if (error.message.includes('jwt expired')) {
          return NextResponse.json(
            { error: 'TOKEN_EXPIRED', message: 'JWT token has expired' },
            { status: 401 }
          );
        }
        
        if (error.message.includes('jwt malformed') || error.message.includes('invalid token')) {
          return NextResponse.json(
            { error: 'INVALID_TOKEN', message: 'JWT token is malformed or invalid' },
            { status: 401 }
          );
        }
      }

      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Verify JWT token and extract context claims
 */
async function verifyJwtToken(token: string): Promise<ContextClaims> {
  // Get JWT secret from environment
  const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT secret not configured');
  }

  try {
    // Verify token
    const decoded = verify(token, jwtSecret) as { [key: string]: unknown };

    // Validate required JWT claims
    if (typeof decoded.tenant_id !== 'string' || 
        typeof decoded.workspace_id !== 'string' || 
        typeof decoded.sub !== 'string') {
      throw new Error('Token missing required claims: tenant_id, workspace_id, or sub must be strings');
    }

    // Extract context claims - TypeScript now knows these are strings after validation
    const context: ContextClaims = {
      tenant_id: decoded.tenant_id as string,
      workspace_id: decoded.workspace_id as string,
      sub: decoded.sub as string,
    };

    // Validate UUID format for context IDs
    if (!isValidUUID(context.tenant_id) || 
        !isValidUUID(context.workspace_id) || 
        !isValidUUID(context.sub)) {
      throw new Error('Invalid UUID format in token claims');
    }

    return context;

  } catch (error) {
    console.error('JWT verification failed:', error);
    throw error;
  }
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Extract context from request headers (alternative method)
 */
export function extractContextFromHeaders(request: NextRequest): ContextClaims | null {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    const workspaceId = request.headers.get('x-workspace-id');
    const userId = request.headers.get('x-user-id');

    if (!tenantId || !workspaceId || !userId) {
      return null;
    }

    if (!isValidUUID(tenantId) || !isValidUUID(workspaceId) || !isValidUUID(userId)) {
      return null;
    }

    return {
      tenant_id: tenantId,
      workspace_id: workspaceId,
      sub: userId,
    };

  } catch (error) {
    console.error('Failed to extract context from headers:', error);
    return null;
  }
}

/**
 * Development-only authentication bypass
 */
export function withDevAuth<T extends unknown[]>(
  handler: (context: ContextClaims, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Development auth not allowed in production' },
        { status: 403 }
      );
    }

    // Try to extract context from headers first
    const headerContext = extractContextFromHeaders(request);
    
    if (headerContext) {
      return await handler(headerContext, ...args);
    }

    // Use default development context
    const devContext: ContextClaims = {
      tenant_id: process.env.DEV_TENANT_ID || '00000000-0000-0000-0000-000000000001',
      workspace_id: process.env.DEV_WORKSPACE_ID || '00000000-0000-0000-0000-000000000001',
      sub: process.env.DEV_USER_ID || '00000000-0000-0000-0000-000000000001',
    };

    return await handler(devContext, ...args);
  };
}

/**
 * Optional authentication middleware (allows both authenticated and anonymous access)
 */
export function withOptionalAuth<T extends unknown[]>(
  handler: (context: ContextClaims | null, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Try to extract JWT token
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No authentication provided - continue with null context
        return await handler(null, ...args);
      }

      const token = authHeader.substring(7);
      const context = await verifyJwtToken(token);

      return await handler(context, ...args);

    } catch (error) {
      // Authentication failed - continue with null context
      console.warn('Optional authentication failed:', error);
      return await handler(null, ...args);
    }
  };
}

/**
 * Role-based authorization middleware
 */
export function withRole<T extends any[]>(
  requiredRoles: string[],
  handler: (context: ContextClaims, ...args: T) => Promise<NextResponse>
) {
  return withAuth<T>(async (context: ContextClaims, ...args: T) => {
    try {
      // Extract roles from JWT token (assuming they're included)
      const authHeader = args[0] && typeof args[0] === 'object' && 'headers' in args[0] 
        ? (args[0] as NextRequest).headers.get('authorization')
        : null;

      if (!authHeader) {
        return NextResponse.json(
          { error: 'FORBIDDEN', message: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const token = authHeader.substring(7);
      const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
      
      if (!jwtSecret) {
        throw new Error('JWT secret not configured');
      }

      const decoded = verify(token, jwtSecret) as { [key: string]: unknown };
      const userRoles = Array.isArray(decoded.roles) ? decoded.roles as string[] : [];

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        return NextResponse.json(
          { 
            error: 'FORBIDDEN', 
            message: `Access denied. Required roles: ${requiredRoles.join(', ')}` 
          },
          { status: 403 }
        );
      }

      return await handler(context, ...args);

    } catch (error) {
      console.error('Role authorization error:', error);
      return NextResponse.json(
        { error: 'FORBIDDEN', message: 'Authorization failed' },
        { status: 403 }
      );
    }
  });
}

/**
 * Rate limiting middleware (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit<T extends unknown[]>(
  maxRequests: number = 100,
  windowMs: number = 60000, // 1 minute
  handler: (context: ContextClaims, ...args: T) => Promise<NextResponse>
) {
  return withAuth<T>(async (context: ContextClaims, ...args: T) => {
    const key = `${context.tenant_id}:${context.workspace_id}`;
    const now = Date.now();
    
    // Clean up expired entries
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) {
        rateLimitMap.delete(k);
      }
    }

    // Get current rate limit state
    const current = rateLimitMap.get(key);
    
    if (!current || now > current.resetTime) {
      // Initialize or reset rate limit
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      // Increment counter
      current.count += 1;
      
      if (current.count > maxRequests) {
        return NextResponse.json(
          { 
            error: 'RATE_LIMIT_EXCEEDED', 
            message: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs}ms` 
          },
          { status: 429 }
        );
      }
    }

    return await handler(context, ...args);
  });
}