/**
 * Context Module API - IT System Detail Routes
 * 
 * Next.js API routes for individual IT system operations.
 * GET /api/v1/context/systems/[id] - Get system by ID
 * PUT /api/v1/context/systems/[id] - Update system
 * DELETE /api/v1/context/systems/[id] - Delete system
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { UpdateSystemRequestSchema } from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';
import { createContextClient } from '@/lib/api/context/supabase-client';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/systems/[id]
 * Get IT system by ID
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Get system
      const system = await contextService.systems.getSystemById(id);

      if (!system) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'IT system not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(system);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/v1/context/systems/[id]
 * Update IT system
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Validate request body
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      const systemData = validateBody(body, UpdateSystemRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Update system
      const system = await contextService.systems.updateSystem(id, systemData);

      return NextResponse.json(system);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/context/systems/[id]
 * Delete IT system
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      console.log('[DELETE /api/v1/context/systems/[id]] Deleting system:', id);
      console.log('[DELETE /api/v1/context/systems/[id]] Auth context:', context);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };

      console.log('[DELETE /api/v1/context/systems/[id]] Effective context:', effectiveContext);

      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Delete system
      await contextService.systems.deleteSystem(id);

      console.log('[DELETE /api/v1/context/systems/[id]] Delete successful');
      return NextResponse.json({ message: 'IT system deleted successfully' });
    })(request);

  } catch (error) {
    console.error('[DELETE /api/v1/context/systems/[id]] Error:', error);
    return handleApiError(error);
  }
}