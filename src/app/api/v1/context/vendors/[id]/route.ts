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
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';
import { createContextClient } from '@/lib/api/context/supabase-client';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/context/vendors/[id]
 * Get vendor by ID
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
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

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
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    return await withOptionalAuth(async (context) => {
      const { id } = await params;

      // Validate request body
      const body = await request.json();
      const vendorData = validateBody(body, UpdateVendorRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001', 
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

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
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Delete vendor
      await contextService.vendors.deleteVendor(id);

      return NextResponse.json({ message: 'Vendor deleted successfully' });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}