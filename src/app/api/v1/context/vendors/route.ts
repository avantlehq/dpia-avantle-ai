/**
 * Context Module API - Vendors Routes
 * 
 * Next.js API routes for vendor management.
 * GET /api/v1/context/vendors - List vendors
 * POST /api/v1/context/vendors - Create vendor
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import {
  VendorQueryParamsSchema,
  CreateVendorRequestSchema
} from '@/lib/api/context/schemas';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';
import { validateQuery, validateBody } from '@/lib/api/context/middleware/validation';
import { handleApiError } from '@/lib/api/context/middleware/error-handler';
import { createContextClient } from '@/lib/api/context/supabase-client';

/**
 * GET /api/v1/context/vendors
 * List vendors with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate query parameters
      const url = new URL(request.url);
      const queryParams = validateQuery(url.searchParams, VendorQueryParamsSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Get vendors
      const result = await contextService.vendors.getVendors(queryParams);

      return NextResponse.json(result);
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/v1/context/vendors
 * Create new vendor
 */
export async function POST(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      // Validate request body
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();
      const vendorData = validateBody(body, CreateVendorRequestSchema);

      // Initialize context service with default anonymous context if null
      const effectiveContext = context || {
        tenant_id: '00000000-0000-0000-0000-000000000001',
        workspace_id: '00000000-0000-0000-0000-000000000001',
        sub: '00000000-0000-0000-0000-000000000001'
      };
      const client = createContextClient(effectiveContext);
      const contextService = new ContextService(effectiveContext, client);

      // Create vendor
      const vendor = await contextService.vendors.createVendor(vendorData);

      return NextResponse.json(vendor, { status: 201 });
    })(request);

  } catch (error) {
    return handleApiError(error);
  }
}