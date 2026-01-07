/**
 * Context Module API - Data Categories Routes
 * 
 * Next.js API routes for GDPR data category management.
 * GET /api/v1/context/data-categories - List data categories
 * POST /api/v1/context/data-categories - Create data category
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { 
  DataCategoryQueryParamsSchema,
  CreateDataCategoryRequestSchema 
} from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateQuery, validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

/**
 * GET /api/v1/context/data-categories
 * List data categories with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate query parameters
      const url = new URL(request.url);
      const queryParams = validateQuery(url.searchParams, DataCategoryQueryParamsSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Get data categories
      const result = await contextService.dataCategories.getDataCategories(queryParams);

      return NextResponse.json(result);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/context/data-categories
 * Create new data category
 */
export async function POST(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate request body
      const body = await request.json();
      const categoryData = validateBody(body, CreateDataCategoryRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Create data category
      const category = await contextService.dataCategories.createDataCategory(categoryData);

      return NextResponse.json(category, { status: 201 });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}