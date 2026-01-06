# Context Module Database Setup - Comprehensive Prompt

## 🎯 **Mission: Complete Context Module Database Integration**

You are working on the Avantle Privacy Platform (dpia-avantle-ai) version 3.21.150. The Context module is **functionally complete** but missing the database layer. Your task is to establish full database connectivity and data persistence for the Context module within the existing dpia.avantle.ai Supabase database.

## 📊 **Current Status Assessment**

### ✅ **What's Working:**
- Context UI: Complete interface at `/[locale]/context/*` with all sub-pages
- Context API: Full REST endpoints at `/api/v1/context/*` with withDevAuth middleware
- Context Services: TypeScript services and middleware (authentication resolved)
- Build Pipeline: All compilation errors fixed, CI/CD working
- Mock Data: Context API returns fallback data when database fails

### ❌ **What's Missing:**
- **Database Tables**: Context module tables not created in Supabase
- **Real Data Persistence**: All Context operations use mock fallback data
- **API Database Integration**: Database connection errors in production

### 🔍 **Evidence of Missing Database:**
```json
// API health check shows database error:
{
  "healthy": false,
  "status": "degraded", 
  "database": {"status": "error", "error": "[object Object]"}
}
```

## 🗃️ **Database Architecture Target**

### **Current Implementation (Monolith):**
```
dpia.avantle.ai Supabase Database:
├── DPIA Tables (existing):
│   ├── assessments
│   ├── assessment_answers  
│   ├── form_sections
│   └── users, tenants, workspaces
└── Context Tables (MISSING):
    ├── systems                    🎯 TARGET
    ├── processing_activities      🎯 TARGET
    ├── vendors                    🎯 TARGET  
    ├── data_categories           🎯 TARGET
    ├── data_flows                🎯 TARGET
    ├── physical_locations        🎯 TARGET
    └── global_jurisdictions      🎯 TARGET
```

### **Future Architecture (Post-Setup):**
```
Current Session Goal: ✅ All Context tables in dpia.avantle.ai
Future Evolution: 🔄 Context tables → migrate to context.avantle.ai microservice
```

## 📁 **Available Migration Assets**

### **Migration Files Location:**
```
supabase/
├── migrations/                           🎯 MAIN MIGRATIONS
│   ├── 00001_context_module_enums_functions.sql
│   ├── 00002_global_jurisdictions.sql
│   ├── 00003_physical_locations.sql
│   ├── 00004_vendors_contracts_locations.sql
│   ├── 00005_systems_endpoints_locations.sql
│   ├── 00006_data_categories_seed.sql
│   ├── 00007_processing_activities_retention.sql
│   ├── 00008_data_flows_transfers.sql
│   └── 00009_seed_jurisdictions.sql
└── context-migrations/                   📁 BACKUP COPY
    └── migrations/ (identical files)
```

### **Migration Content Overview:**
- **Enums**: lawful_basis, special_category_basis, data_category_type, etc.
- **Core Tables**: systems, processing_activities, vendors, data_categories
- **Relationships**: Foreign keys and tenant-scoped RLS
- **Seed Data**: Initial jurisdictions, data categories for GDPR compliance

## 🎯 **Step-by-Step Action Plan**

### **Phase 1: Database Assessment**
1. **Connect to Supabase**: Access dpia.avantle.ai project database
2. **Inventory Current Tables**: List existing tables and identify missing Context tables
3. **Check Migration History**: Verify which migrations have been applied
4. **Review Schema**: Understand current database structure and constraints

### **Phase 2: Migration Execution** 
5. **Validate Migration Files**: Review SQL syntax and dependencies in migration files
6. **Apply Migrations Sequentially**: Execute 00001 through 00009 in order
7. **Verify Table Creation**: Confirm all Context tables exist with proper schema
8. **Check RLS Policies**: Ensure Row Level Security is properly configured
9. **Validate Seed Data**: Confirm global_jurisdictions and data_categories are populated

### **Phase 3: API Integration Testing**
10. **Test Database Connectivity**: Verify Context API can connect to new tables
11. **CRUD Operations Testing**: Test Create, Read, Update, Delete for all entities
12. **Authentication Integration**: Ensure tenant_id/workspace_id scoping works
13. **Error Handling**: Verify graceful handling of database errors
14. **Performance Validation**: Check query performance and indexing

### **Phase 4: Production Validation**
15. **Health Check Verification**: Confirm `/api/v1/context/health` returns healthy
16. **UI Integration Testing**: Test Context module UI with real database data
17. **End-to-End Workflow**: Complete flow from Systems → Processing → DPIA assessment
18. **Slovak Localization**: Test Context module functionality in Slovak language
19. **Export Integration**: Verify Context data integration with DPIA PDF exports

## ⚠️ **Critical Success Criteria**

### **Database Layer:**
- [ ] All Context tables created with proper schema
- [ ] RLS policies active for multi-tenant security
- [ ] Seed data loaded (jurisdictions, data categories)
- [ ] Indexes created for performance

### **API Integration:**
- [ ] Context API returns real data instead of mock fallbacks
- [ ] All CRUD operations working with proper validation
- [ ] Authentication and authorization working correctly
- [ ] Error handling graceful and informative

### **User Experience:**
- [ ] Context dashboard shows real-time statistics
- [ ] Systems, Processing, Vendors management fully functional
- [ ] Data flows mapping operational
- [ ] Slovak/English localization working with real data

### **Production Readiness:**
- [ ] Health check returns "healthy" status
- [ ] No 401 authentication errors in browser console
- [ ] TypeScript compilation passing
- [ ] CI/CD pipeline deploying successfully

## 🔧 **Technical Implementation Notes**

### **Supabase Connection:**
```typescript
// Current working connection in src/lib/database/supabase.ts
const supabase = createClient(url, serviceKey)
// Service role key bypasses RLS for Context API operations
```

### **Authentication Context:**
```typescript
// Context API uses withDevAuth for development compatibility
// Each operation requires: tenant_id, workspace_id, user context
```

### **Data Model Relationships:**
```sql
-- Key relationships to verify:
systems.tenant_id → tenants.id
processing_activities.tenant_id → tenants.id  
vendors.tenant_id → tenants.id
data_flows.from_system_id → systems.id
processing_activities.data_categories → data_categories.id[]
```

## 📋 **Validation Checklist**

### **Pre-Migration:**
- [ ] Supabase project access confirmed
- [ ] Current schema documented
- [ ] Backup strategy in place
- [ ] Migration files reviewed and validated

### **Post-Migration:**
- [ ] All tables present with correct schema
- [ ] RLS policies active and functional
- [ ] Seed data properly loaded
- [ ] Indexes created for performance
- [ ] Foreign key relationships established

### **Integration Testing:**
- [ ] Context API health check passes
- [ ] Real data CRUD operations working
- [ ] UI displays actual database content
- [ ] Slovak localization functional
- [ ] Export functionality includes Context data

### **Production Deployment:**
- [ ] Version updated to 3.21.151
- [ ] Documentation updated with database completion
- [ ] Browser console errors resolved
- [ ] End-user testing completed

## 🎯 **Expected Outcome**

Upon completion, the Context module will be **fully production-ready** with:

1. **Complete Database Layer**: All Context tables operational in dpia.avantle.ai
2. **Real Data Operations**: Context API serving actual data instead of mocks
3. **Full GDPR Compliance**: Proper data inventory, processing records, vendor management
4. **Slovak Legal Readiness**: Platform ready for Slovak lawyer demonstration
5. **Microservice Foundation**: Database structure prepared for future context.avantle.ai separation

## 🔄 **Next Steps After Completion**

1. **Business Validation**: Slovak lawyer demo and feedback
2. **Performance Optimization**: Query optimization and caching
3. **Microservice Planning**: Strategy for context.avantle.ai separation
4. **Advanced Features**: Bulk operations, advanced filtering, API integrations

---

**Priority: HIGH** | **Complexity: MEDIUM** | **Impact: BUSINESS CRITICAL**

This database setup completion will transform the Context module from a functional prototype to a production-ready business tool suitable for Slovak GDPR compliance operations.