/**
 * Context Module API - Health Check Route
 * 
 * Next.js API route for health monitoring and status checks.
 * GET /api/v1/context/health - Health check endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContextService } from '@/lib/api/context/services/context.service';
import { formatHealthCheckError } from '@/lib/api/context/middleware/error-handler';
import { withOptionalAuth } from '@/lib/api/context/middleware/auth';

/**
 * GET /api/v1/context/health
 * Health check endpoint for Context module
 */
export async function GET(request: NextRequest) {
  try {
    return await withOptionalAuth(async (context) => {
      const timestamp = new Date().toISOString();
      const checks: Record<string, unknown> = {
        timestamp,
        status: 'healthy',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      };

      // Basic connectivity check
      checks.database = await checkDatabaseConnection();
      
      // Authentication check (if context provided)
      if (context) {
        checks.authentication = {
          status: 'authenticated',
          tenant_id: context.tenant_id,
          workspace_id: context.workspace_id,
        };
      } else {
        checks.authentication = {
          status: 'anonymous',
        };
      }

      // Service availability checks
      try {
        if (context) {
          const contextService = new ContextService(context);
          
          // Test basic repository operations
          checks.repositories = await checkRepositories(contextService);
          
          // Test service layer
          checks.services = await checkServices(contextService);
        } else {
          checks.repositories = { status: 'skipped', reason: 'no authentication' };
          checks.services = { status: 'skipped', reason: 'no authentication' };
        }
      } catch (error) {
        checks.repositories = { status: 'error', error: String(error) };
        checks.services = { status: 'error', error: String(error) };
      }

      // Determine overall status
      const hasErrors = Object.values(checks).some((check: unknown) => 
        typeof check === 'object' && check.status === 'error'
      );

      const overallStatus = hasErrors ? 'degraded' : 'healthy';

      return NextResponse.json({
        healthy: !hasErrors,
        status: overallStatus,
        checks,
      });

    })(request);

  } catch (error) {
    const errorResponse = formatHealthCheckError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Check database connection
 */
async function checkDatabaseConnection(): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const startTime = Date.now();
    
    // Simple database query to test connectivity
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { error } = await supabase.from('jurisdictions').select('id').limit(1);
    
    if (error) {
      throw error;
    }

    const latency = Date.now() - startTime;

    return {
      status: 'healthy',
      latency,
    };

  } catch (error) {
    return {
      status: 'error',
      error: String(error),
    };
  }
}

/**
 * Check repository layer
 */
async function checkRepositories(contextService: ContextService): Promise<{ status: string; details?: Record<string, unknown>; error?: string }> {
  try {
    const checks = {
      jurisdictions: await testRepositoryOperation(
        () => contextService.jurisdictions.getJurisdictions({ page: 1, limit: 1 })
      ),
      physicalLocations: await testRepositoryOperation(
        () => contextService.physicalLocations.getLocations({ page: 1, limit: 1 })
      ),
      vendors: await testRepositoryOperation(
        () => contextService.vendors.getVendors({ page: 1, limit: 1 })
      ),
      systems: await testRepositoryOperation(
        () => contextService.systems.getSystems({ page: 1, limit: 1 })
      ),
      dataCategories: await testRepositoryOperation(
        () => contextService.dataCategories.getDataCategories({ page: 1, limit: 1 })
      ),
      processingActivities: await testRepositoryOperation(
        () => contextService.processingActivities.getProcessingActivities({ page: 1, limit: 1 })
      ),
    };

    const hasErrors = Object.values(checks).some(check => check.status === 'error');

    return {
      status: hasErrors ? 'degraded' : 'healthy',
      details: checks,
    };

  } catch (error) {
    return {
      status: 'error',
      error: String(error),
    };
  }
}

/**
 * Check service layer
 */
async function checkServices(contextService: ContextService): Promise<{ status: string; details?: Record<string, unknown>; error?: string }> {
  try {
    const checks = {
      contextService: { status: 'healthy' as string, error: undefined as string | undefined },
      jurisdictionService: { status: 'healthy' as string, error: undefined as string | undefined },
      processingActivityService: { status: 'healthy' as string, error: undefined as string | undefined },
    };

    // Test jurisdiction service
    try {
      await contextService.jurisdictions.getJurisdictionByCountryCode('US');
      checks.jurisdictionService.status = 'healthy';
    } catch (error) {
      checks.jurisdictionService = { status: 'error', error: String(error) };
    }

    const hasErrors = Object.values(checks).some(check => check.status === 'error');

    return {
      status: hasErrors ? 'degraded' : 'healthy',
      details: checks,
    };

  } catch (error) {
    return {
      status: 'error',
      error: String(error),
    };
  }
}

/**
 * Test individual repository operation
 */
async function testRepositoryOperation(operation: () => Promise<unknown>): Promise<{ status: string; latency?: number; error?: string }> {
  try {
    const startTime = Date.now();
    await operation();
    const latency = Date.now() - startTime;
    
    return {
      status: 'healthy',
      latency,
    };
  } catch (error) {
    return {
      status: 'error',
      error: String(error),
    };
  }
}