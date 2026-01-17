/**
 * Context Module API - Processing Activities Routes
 * 
 * Next.js API routes for GDPR Article 30 processing activity management.
 * GET /api/v1/context/processing-activities - List processing activities
 * POST /api/v1/context/processing-activities - Create processing activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import {
  ProcessingActivityQueryParamsSchema,
  CreateProcessingActivityRequestSchema
} from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateQuery, validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';
import { createContextClient } from '@/lib/api/context/supabase-client';

/**
 * GET /api/v1/context/processing-activities
 * List processing activities with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      console.log('[GET /api/v1/context/processing-activities] Fetching processing activities');

      // Validate query parameters
      const url = new URL(request.url);
      const queryParams = validateQuery(url.searchParams, ProcessingActivityQueryParamsSchema);
      console.log('[GET /api/v1/context/processing-activities] Query params validated:', queryParams);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      console.log('[GET /api/v1/context/processing-activities] Client created');

      const contextService = new ContextService(effectiveContext, client);
      console.log('[GET /api/v1/context/processing-activities] ContextService initialized');

      // Get processing activities
      const result = await contextService.processingActivities.getProcessingActivities(queryParams);
      console.log('[GET /api/v1/context/processing-activities] Found', result.data.length, 'activities');

      return NextResponse.json(result);
    })(request);

  } catch (error) {
    console.error('[GET /api/v1/context/processing-activities] Error:', error);
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/context/processing-activities
 * Create new processing activity
 */
export async function POST(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      console.log('[POST /api/v1/context/processing-activities] Creating processing activity');

      // Clone request to avoid body consumption issues in Next.js 16
      const clonedRequest = request.clone();

      // Validate request body
      const body = await clonedRequest.json();
      const activityData = validateBody(body, CreateProcessingActivityRequestSchema);
      console.log('[POST /api/v1/context/processing-activities] Validation passed');

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      console.log('[POST /api/v1/context/processing-activities] Client initialized');

      const contextService = new ContextService(effectiveContext, client);
      console.log('[POST /api/v1/context/processing-activities] ContextService initialized');

      // Create processing activity
      const activity = await contextService.processingActivities.createProcessingActivity(activityData);
      console.log('[POST /api/v1/context/processing-activities] Activity created:', activity.id);

      return NextResponse.json(activity, { status: 201 });
    })(request);

  } catch (error) {
    console.error('[POST /api/v1/context/processing-activities] Error:', error);
    return handleApiError(error);
  }
}