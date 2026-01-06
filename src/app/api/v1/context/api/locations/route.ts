/**
 * Context Module API - Physical Locations Routes
 * 
 * Next.js API routes for physical location management.
 * GET /api/v1/context/locations - List locations
 * POST /api/v1/context/locations - Create location
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { 
  PhysicalLocationQueryParamsSchema,
  CreatePhysicalLocationRequestSchema 
} from '@/lib/api/context/schemas';
import { withAuth } from '@/lib/api/context/middleware/auth';
import { validateQuery, validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

/**
 * GET /api/v1/context/locations
 * List physical locations with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    return await withAuth(async (context) => {
      // Validate query parameters
      const url = new URL(request.url);
      const queryParams = validateQuery(url.searchParams, PhysicalLocationQueryParamsSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Get locations
      const result = await contextService.physicalLocations.getLocations(queryParams);

      return NextResponse.json(result);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/context/locations
 * Create new physical location
 */
export async function POST(request: NextRequest) {
  try {
    return await withAuth(async (context) => {
      // Validate request body
      const body = await request.json();
      const locationData = validateBody(body, CreatePhysicalLocationRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Create location
      const location = await contextService.physicalLocations.createLocation(locationData);

      return NextResponse.json(location, { status: 201 });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}