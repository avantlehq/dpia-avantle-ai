/**
 * Context Module API - IT Systems Routes
 * 
 * Next.js API routes for IT system management.
 * GET /api/v1/context/systems - List IT systems
 * POST /api/v1/context/systems - Create IT system
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { 
  SystemQueryParamsSchema,
  CreateSystemRequestSchema 
} from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateQuery, validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

/**
 * GET /api/v1/context/systems
 * List IT systems with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate query parameters
      const url = new URL(request.url);
      const queryParams = validateQuery(url.searchParams, SystemQueryParamsSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Get systems
      const result = await contextService.systems.getSystems(queryParams);

      return NextResponse.json(result);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/context/systems
 * Create new IT system
 */
export async function POST(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate request body
      const body = await request.json();
      const systemData = validateBody(body, CreateSystemRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Create system
      const system = await contextService.systems.createSystem(systemData);

      return NextResponse.json(system, { status: 201 });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}