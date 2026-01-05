/**
 * Context Module API - Vendor Detail Routes
 * 
 * Next.js API routes for individual vendor operations.
 * GET /api/v1/context/vendors/[id] - Get vendor by ID
 * PUT /api/v1/context/vendors/[id] - Update vendor
 * DELETE /api/v1/context/vendors/[id] - Delete vendor
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { UpdateVendorRequestSchema } from '@/lib/api/context/schemas';
import { withAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/v1/context/vendors/[id]
 * Get vendor by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Get vendor
      const vendor = await contextService.vendors.getVendorById(id);

      if (!vendor) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Vendor not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(vendor);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/v1/context/vendors/[id]
 * Update vendor
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = params;

      // Validate request body
      const body = await request.json();
      const vendorData = validateBody(body, UpdateVendorRequestSchema);

      // Initialize context service
      const contextService = new ContextService(context);

      // Update vendor
      const vendor = await contextService.vendors.updateVendor(id, vendorData);

      return NextResponse.json(vendor);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/v1/context/vendors/[id]
 * Delete vendor
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    return await withAuth(async (context) => {
      const { id } = params;

      // Initialize context service
      const contextService = new ContextService(context);

      // Delete vendor
      await contextService.vendors.deleteVendor(id);

      return NextResponse.json({ message: 'Vendor deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}