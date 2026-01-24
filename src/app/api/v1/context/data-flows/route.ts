/**
 * Context Module API - Data Flows Routes
 *
 * Next.js API routes for data flow management.
 * GET /api/v1/context/data-flows - List data flows
 * POST /api/v1/context/data-flows - Create data flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { CreateDataFlowRequestSchema } from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';
import { createContextClient } from '@/lib/api/context/supabase-client';

/**
 * GET /api/v1/context/data-flows
 * List data flows with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Parse query parameters
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const flow_direction = searchParams.get('flow_direction') || undefined;
      const criticality = searchParams.get('criticality') || undefined;
      const status = searchParams.get('status') || undefined;
      const cross_border_transfer = searchParams.get('cross_border_transfer') === 'true' ? true :
                                     searchParams.get('cross_border_transfer') === 'false' ? false : undefined;

      // Get data flows with filters
      const result = await contextService.dataFlows.getDataFlows({
        page,
        limit,
        flow_direction: flow_direction as any,
        criticality: criticality as any,
        status: status as any,
        cross_border_transfer,
      });

      return NextResponse.json({
        success: true,
        data: result.data,
        meta: result.pagination,
      });

    })(request);
  } catch (error) {
    return handleApiError(error, 'data-flows GET');
  }
}

/**
 * POST /api/v1/context/data-flows
 * Create new data flow
 */
export async function POST(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate request body
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      const flowData = validateBody(body, CreateDataFlowRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Create data flow
      const dataFlow = await contextService.dataFlows.createDataFlow(flowData);

      return NextResponse.json(dataFlow, { status: 201 });

    })(request);
  } catch (error) {
    return handleApiError(error, 'data-flows POST');
  }
}
