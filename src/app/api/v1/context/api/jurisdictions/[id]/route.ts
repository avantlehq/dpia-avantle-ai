/**
 * Context Module API - Jurisdiction Detail Routes
 * 
 * Next.js API routes for individual jurisdiction operations.
 * GET /api/v1/context/jurisdictions/[id] - Get jurisdiction by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/jurisdictions/[id]
 * Get jurisdiction by ID
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Get jurisdiction
      const jurisdiction = await contextService.jurisdictions.getJurisdictionById(id);

      if (!jurisdiction) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Jurisdiction not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(jurisdiction);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}