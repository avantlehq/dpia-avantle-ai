/**
 * Context Module API - Physical Location Detail Routes
 * 
 * Next.js API routes for individual physical location operations.
 * GET /api/v1/context/locations/[id] - Get location by ID
 * PUT /api/v1/context/locations/[id] - Update location
 * DELETE /api/v1/context/locations/[id] - Delete location
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { UpdatePhysicalLocationRequestSchema } from '@/lib/api/context/schemas';
import { withAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/v1/context/locations/[id]
 * Get physical location by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Get location
      const location = await contextService.physicalLocations.getLocationById(id);

      if (!location) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Physical location not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(location);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/v1/context/locations/[id]
 * Update physical location
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = params;

      // Validate request body
      const body = await request.json();
      const locationData = validateBody(body, UpdatePhysicalLocationRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Update location
      const location = await contextService.physicalLocations.updateLocation(id, locationData);

      return NextResponse.json(location);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/context/locations/[id]
 * Delete physical location
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Delete location
      await contextService.physicalLocations.deleteLocation(id);

      return NextResponse.json({ message: 'Physical location deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}