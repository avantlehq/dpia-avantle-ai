/**
 * Context Module API - Processing Activity Detail Routes
 * 
 * Next.js API routes for individual processing activity operations.
 * GET /api/v1/context/processing-activities/[id] - Get processing activity by ID
 * PUT /api/v1/context/processing-activities/[id] - Update processing activity
 * DELETE /api/v1/context/processing-activities/[id] - Delete processing activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { UpdateProcessingActivityRequestSchema } from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/processing-activities/[id]
 * Get processing activity by ID
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Get processing activity
      const activity = await contextService.processingActivities.getProcessingActivityById(id);

      if (!activity) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Processing activity not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(activity);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/v1/context/processing-activities/[id]
 * Update processing activity
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Validate request body
      const body = await request.json();
      const activityData = validateBody(body, UpdateProcessingActivityRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Update processing activity
      const activity = await contextService.processingActivities.updateProcessingActivity(id, activityData);

      return NextResponse.json(activity);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/context/processing-activities/[id]
 * Delete processing activity
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Delete processing activity
      await contextService.processingActivities.deleteProcessingActivity(id);

      return NextResponse.json({ message: 'Processing activity deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}