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

/**
 * GET /api/v1/context/processing-activities
 * List processing activities with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate query parameters
      const url = new URL(request.url);
      const queryParams = validateQuery(url.searchParams, ProcessingActivityQueryParamsSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Get processing activities
      const result = await contextService.processingActivities.getProcessingActivities(queryParams);

      return NextResponse.json(result);
    })(request);

  } catch (error) {
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
      // Validate request body
      const body = await request.json();
      const activityData = validateBody(body, CreateProcessingActivityRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Create processing activity
      const activity = await contextService.processingActivities.createProcessingActivity(activityData);

      return NextResponse.json(activity, { status: 201 });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}