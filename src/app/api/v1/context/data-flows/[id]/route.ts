/**
 * Context Module API - Data Flow Detail Routes
 *
 * Next.js API routes for individual data flow operations.
 * GET /api/v1/context/data-flows/[id] - Get data flow by ID
 * PUT /api/v1/context/data-flows/[id] - Update data flow
 * DELETE /api/v1/context/data-flows/[id] - Delete data flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { UpdateDataFlowRequestSchema } from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';
import { createContextClient } from '@/lib/api/context/supabase-client';

// Next.js 16 route context interface
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/data-flows/[id]
 * Get data flow by ID
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

      // Get data flow
      const dataFlow = await contextService.dataFlows.getDataFlowById(id);

      if (!dataFlow) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Data flow not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(dataFlow);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/v1/context/data-flows/[id]
 * Update data flow
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Validate request body
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      const flowData = validateBody(body, UpdateDataFlowRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Update data flow
      const dataFlow = await contextService.dataFlows.updateDataFlow(id, flowData);

      return NextResponse.json(dataFlow);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/context/data-flows/[id]
 * Delete data flow (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
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

      // Delete data flow
      await contextService.dataFlows.deleteDataFlow(id);

      return NextResponse.json({ message: 'Data flow deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}
