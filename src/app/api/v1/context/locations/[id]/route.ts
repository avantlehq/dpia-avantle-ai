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
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/locations/[id]
 * Get physical location by ID
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
      const contextService = new ContextService(effectiveContext);

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
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Validate request body
      const body = await request.json();
      const locationData = validateBody(body, UpdatePhysicalLocationRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001', 
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const contextService = new ContextService(effectiveContext);

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
      const contextService = new ContextService(effectiveContext);

      // Delete location
      await contextService.physicalLocations.deleteLocation(id);

      return NextResponse.json({ message: 'Physical location deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}