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
import { createContextClient } from '@/lib/api/context/supabase-client';

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

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Get systems
      const result = await contextService.systems.getSystems(queryParams);

      console.log('[GET /api/v1/context/systems] Total systems:', result.data.length);
      console.log('[GET /api/v1/context/systems] Systems with deleted_at:', result.data.filter((s: { deleted_at: string | null }) => s.deleted_at).length);

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
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      const systemData = validateBody(body, CreateSystemRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Create system
      const system = await contextService.systems.createSystem(systemData);

      return NextResponse.json(system, { status: 201 });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}