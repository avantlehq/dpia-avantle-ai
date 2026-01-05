/**
 * Context Module API - Data Category Detail Routes
 * 
 * Next.js API routes for individual data category operations.
 * GET /api/v1/context/data-categories/[id] - Get data category by ID
 * PUT /api/v1/context/data-categories/[id] - Update data category
 * DELETE /api/v1/context/data-categories/[id] - Delete data category
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { UpdateDataCategoryRequestSchema } from '@/lib/api/context/schemas';
import { withAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/data-categories/[id]
 * Get data category by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = await params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Get data category
      const category = await contextService.dataCategories.getDataCategoryById(id);

      if (!category) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Data category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(category);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/v1/context/data-categories/[id]
 * Update data category
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = await params;

      // Validate request body
      const body = await request.json();
      const categoryData = validateBody(body, UpdateDataCategoryRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Update data category
      const category = await contextService.dataCategories.updateDataCategory(id, categoryData);

      return NextResponse.json(category);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/context/data-categories/[id]
 * Delete data category
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = await params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Delete data category
      await contextService.dataCategories.deleteDataCategory(id);

      return NextResponse.json({ message: 'Data category deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}