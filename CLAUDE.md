# CLAUDE.md

Context for Claude Code working with Avantle.ai repository - Control Plane Frontend.

## 🚀 **PROJECT OVERVIEW: Avantle.ai Control Plane Frontend**

**Avantle.ai** - Frontend interface for the Avantle Privacy Platform with integrated admin console for multi-tenant partner and tenant management.

**Current Status: VERSION 1.0.2 - DPIA Color Alignment**

### Latest Achievements (January 4, 2026)
- ✅ **ADMIN CONSOLE COMPLETE**: Platform Admin Console (/admin) and Partner Portal (/partners)
- ✅ **PARTNER MANAGEMENT**: Full CRUD operations for partner organizations  
- ✅ **TENANT DASHBOARD**: System-wide tenant management with filtering and statistics
- ✅ **ROLE-BASED AUTH**: JWT authentication with Platform Admin and Partner Admin roles
- ✅ **MODERN UI**: Card-based layout with DPIA color scheme and responsive design
- ✅ **CORE API INTEGRATION**: Connected to deployed core-avantle-ai control plane
- ✅ **VERSION MANAGEMENT**: Complete version tracking system with changelog page
- ✅ **PRODUCTION DEPLOYMENT**: Live at avantle.ai with full admin functionality

### Foundation Achievements  
- ✅ **Multi-Tenant Architecture**: Partner → Tenant → DPIA Runtime hierarchy
- ✅ **Control Plane Frontend**: Web interface for core-avantle-ai API management
- ✅ **Enterprise Navigation**: Professional header with version display and admin access
- ✅ **Security Implementation**: Role-based access control with proper JWT handling
- ✅ **Responsive Design**: Mobile-friendly admin console with modern card layouts

### Production Status
**URL**: https://avantle.ai - **LIVE & FULLY FUNCTIONAL**

**Core Features Complete:**
- ✅ **Platform Admin Console**: Full system administration dashboard (/admin)
- ✅ **Partner Portal**: Partner management interface (/partners)
- ✅ **Authentication Flow**: Login with demo credentials and role-based routing
- ✅ **Partner CRUD**: Create, read, update partner organizations
- ✅ **Tenant Management**: System-wide tenant overview and filtering
- ✅ **Version Display**: Version tracking in navigation, footer, and changelog page

**Technical Stack:**
- Framework: Next.js 16.0.10 + React 18 + TypeScript
- Backend: Core API integration (https://core-avantle-ezuyyhjei-ramix24s-projects.vercel.app)
- Styling: Tailwind CSS + DPIA color scheme integration
- Theme: Dark theme with DPIA-compatible design tokens
- Authentication: JWT-based with localStorage persistence
- Deployment: Vercel with automated CI/CD from GitHub
- Version Management: Semantic versioning with changelog system

## Architecture Context

### **🏗️ PLATFORM RESPONSIBILITY SPLIT** 

#### **avantle.ai**
**Partner-facing Frontend + Admin Console (Control Plane Frontend)**
- **Marketing platform** - Public landing page and product information
- **Partner signup / onboarding** - New partner registration and setup
- **Partner Admin Panel** - Partner-specific management interface
- **Platform Admin Console** (len pre platform adminov) - Full system administration
- **Správa:**
  - partnerov (partners)
  - tenantov (tenants) 
  - domén (domains)
  - produktov (enable/disable)
  - usage (read-only)

**Backend**: core.avantle.ai
**Nikdy**: nepracuje s DPIA workflow ani dátami.

#### **core.avantle.ai**
**Control Plane API (Backend)**
- **Identity, roly, RBAC** - Authentication and authorization
- **Partners / Tenants** - Organization and tenant management
- **Domains → tenant resolution** - Custom domain routing
- **Product access** (opaque product_key) - Feature access control
- **Plans / quotas / usage counters** - Billing and limits
- **Audit log rozhodnutí** - Decision tracking and compliance

**Bez UI** - Pure API backend.
**Backend pre**: avantle.ai (Admin/Partner) aj pre runtime.

#### **dpia.avantle.ai**
**Execution / Runtime aplikácia**
- **DPIA / ROPA / LIA workflows** - Core business functionality
- **Klientské dáta, exporty** - Client data processing and exports
- **Whitelabel domény partnerov** - Partner-branded access
- **UI pre partnerov a tenantov** len v kontexte práce s klientmi

**Nikdy:**
- onboarding partnerov
- platform admin
- plány, produkty, globálne nastavenia

### **Prečo je toto správne (a prečo už to nemeníš)**
- **Čistý model control-plane vs execution-plane** - Clear architectural separation
- **Žiadne miešanie adminu do business runtime** - Admin isolated from business logic
- **dpia.avantle.ai ostáva „produkt", nie „platforma"** - Product focus maintained
- **avantle.ai je prirodzená konzola typu AWS / Shopify / Atlassian** - Standard platform pattern
- **Bezpečnosť: admin povrchy sú izolované** - Security through isolation

### Multi-Tier Platform Architecture
```
Partner Browser → avantle.ai (Frontend) → core.avantle.ai (Control Plane API) → dpia.avantle.ai (Runtime)
```

### Role-Based Access Control (RBAC)
- **Platform Admin** (`/admin`) - Full system administration across all partners
- **Partner Admin** (`/partners`) - Partner-specific management and tenant creation
- **Unauthorized handling** - Proper access denial with redirect to `/unauthorized`

### Core API Integration
- **Base URL**: https://core-avantle-ezuyyhjei-ramix24s-projects.vercel.app
- **Authentication**: JWT Bearer token with localStorage persistence
- **Endpoints**: Partners, Tenants, Admin stats, Activity monitoring
- **Error Handling**: Comprehensive API response handling with user feedback

## Component Architecture

### Admin Console Structure
- **AdminLayout**: Shared layout for all admin pages with sidebar navigation
- **Partner Components**: Partners list, detail view, creation form
- **Tenant Components**: System-wide tenant management and statistics
- **Dashboard Components**: Admin overview with stats cards and activity feeds

### Navigation System
- **SiteHeader**: Main navigation with version display and role-based links
- **SiteFooter**: Footer with version info, build date, and git commit details
- **Version Management**: Display current version in multiple locations

### Authentication Flow
- **Login Page** (`/login`) - Email/password with demo credentials
- **Auth Utils** (`lib/auth.ts`) - JWT handling, role validation, route protection
- **Protected Routes** - requireAuth() for admin pages with role checking

## UX & Design Principles

### Design System Integration
- **DPIA Color Scheme**: Consistent with existing DPIA platform design
- **Card-Based Layout**: Modern enterprise appearance with proper spacing
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Professional Typography**: Clean fonts with proper hierarchy

### Navigation Standards
- **Version Display**: Always visible in header and footer for transparency
- **Role-Based Menus**: Conditional navigation based on user permissions
- **Active States**: Proper highlighting for current page/section
- **Accessible Design**: Proper ARIA labels and keyboard navigation

### Form & Interaction Patterns
- **Loading States**: Skeleton loading and progress indicators
- **Error Handling**: User-friendly error messages with retry options
- **Form Validation**: Client-side validation with API error integration
- **Success Feedback**: Clear confirmation of successful operations

## Development Workflow

### Version Management Rules
**⚠️ MANDATORY: Always update version after EVERY deployment (including debug/fix deployments)!**

**STRICT VERSION POLICY:**
1. **Every Git Push = Version Bump** - No exceptions, even for small fixes
2. **Always Report Version** - Write the new version number in chat after every deployment
3. **Update Both Files** - `src/lib/version.ts` + `package.json` 
4. **Complete Changelog** - Add entry to CHANGELOG with date and changes
5. **Semantic Versioning** - Use x.y.z format (major.minor.patch)

**Version Update Process:**
1. Update `src/lib/version.ts` (VERSION, VERSION_NAME, CHANGELOG entry)
2. Update `package.json` version to match
3. Commit with detailed version bump message including new version number
4. Push to production (auto-deploys to Vercel)
5. **ALWAYS write in chat: "🚀 Deployed VERSION X.Y.Z - Description"**

**Version Numbering:**
- **Patch (x.y.Z++)** - Bug fixes, build fixes, small improvements
- **Minor (x.Y++.0)** - New features, significant enhancements  
- **Major (X++.0.0)** - Breaking changes, major architecture updates

### Development Commands
```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Build for production
npm run lint          # Run ESLint
git add . && git commit -m "message" && git push origin main
```

### File Structure
```
avantle-ai/
├── app/
│   ├── admin/                 # Platform Admin Console
│   ├── partners/              # Partner Portal  
│   ├── login/                 # Authentication
│   ├── unauthorized/          # Access denied
│   └── changelog/             # Version history
├── components/
│   ├── admin/                 # Admin-specific components
│   ├── site-header.tsx        # Main navigation
│   └── site-footer.tsx        # Footer with version
├── lib/
│   ├── api/core-client.ts     # Core API integration
│   └── auth.ts                # Authentication utilities
└── src/lib/version.ts         # Version management
```

## Technical Insights

### Security Implementation
- **JWT Authentication**: Secure token-based auth with automatic refresh
- **Role Validation**: Server-side role checking for admin routes
- **CORS Handling**: Proper cross-origin request configuration
- **Environment Variables**: Secure API endpoint configuration

### API Integration Strategy
- **Centralized Client**: Single CoreApiClient class for all API calls
- **Error Boundary**: Comprehensive error handling with user feedback
- **Loading States**: Proper async operation feedback
- **Type Safety**: Full TypeScript integration with API response types

### Production Deployment
- **Vercel Integration**: Automatic deployment from GitHub main branch
- **Environment Detection**: Build-time environment variable injection
- **Git Integration**: Automatic commit hash and branch detection
- **Performance**: Optimized Next.js build with static generation where possible

## Business Context

### Platform Ecosystem
- **avantle.ai**: Control plane frontend (this project)
- **core.avantle.ai**: Multi-tenant control plane API
- **dpia.avantle.ai**: GDPR assessment runtime platform
- **Partner domains**: Whitelabel CNAME routing (e.g., gdpr.havelka.sk)

### Target Users
- **Platform Administrators**: Full system management across all partners
- **Partner Administrators**: Partner-specific tenant and user management
- **End Clients**: Access DPIA runtime through partner-branded domains

### Business Value
- **Multi-Tenant SaaS**: Scalable partner and tenant management
- **White-Label Ready**: Partner-branded domain support
- **GDPR Compliance**: Privacy-first architecture with European data sovereignty
- **Enterprise Ready**: Professional admin interface for business operations

## 🎯 **DEVELOPMENT STATUS**

### **VERSION 1.0.0: ADMIN CONSOLE LAUNCH COMPLETE ✅**
- **PRODUCTION DEPLOYMENT**: Live at https://avantle.ai with full functionality
- **ADMIN CONSOLE**: Complete Platform Admin and Partner Portal interfaces
- **CORE INTEGRATION**: Fully connected to deployed core-avantle-ai API
- **VERSION SYSTEM**: Complete version management with changelog page
- **BUSINESS READY**: Full multi-tenant partner and tenant management capabilities

### **FUTURE ENHANCEMENT OPPORTUNITIES**

#### **Usage Analytics & Monitoring** 📊
- **Dashboard Metrics**: Advanced usage analytics and tenant monitoring
- **Performance Tracking**: API response times and system health metrics
- **User Activity**: Detailed audit logs and admin activity tracking

#### **Advanced Features** 🚀
- **Bulk Operations**: Mass partner/tenant creation and management
- **Email Notifications**: Automated alerts for partner and tenant events
- **Advanced Filtering**: Enhanced search and filtering across all entities
- **Export Functionality**: Data export capabilities for reporting

#### **Partner Experience** 💼
- **Partner Onboarding**: Guided setup process for new partners
- **Self-Service Portal**: Partner self-management capabilities
- **Billing Integration**: Usage-based billing and invoice generation
- **Custom Branding**: Partner-specific UI customization options

**Local Path**: `C:\Users\rasti\Projects\avantlehq\avantle-ai\`

## Version History

### v1.0.2 "DPIA Color Alignment" (2026-01-04)
- 🎨 **EXACT COLOR MATCH**: Updated all color variables to match dpia.avantle.ai exactly
- 🔵 **BLUE**: #4A90E2 → #3b82f6 (exact DPIA match)
- 🟢 **GREEN**: #7ED321 → #22c55e (exact DPIA match)
- 🔴 **RED**: #FF6B6B → #ef4444 (exact DPIA match)
- 🟣 **PURPLE**: #9B59B6 → #8b5cf6 (updated to Tailwind violet)
- 🟠 **ORANGE**: #F5A623 → #f97316 (updated to Tailwind orange)
- ⚪ **GRAY**: #A9A9A9 → #9ca3af (exact DPIA match)
- 🎯 **CONSISTENCY**: All gradients, borders, and hover states updated
- 🌐 **BOTH THEMES**: Dark and light mode colors aligned with DPIA standards

### v1.0.1 "Build Fixes & Stability" (2026-01-04)
- 🔧 **BUILD FIXES**: Resolved TypeScript compilation errors and import path issues
- 📁 **IMPORT PATHS**: Fixed version import paths from @/lib/version to @/src/lib/version
- 🔒 **TYPE SAFETY**: Added proper type assertions for User interface and API responses
- 📦 **INTERFACE UPDATES**: Added slug and custom_domain properties to Tenant interface
- 🌐 **HEADERS FIX**: Fixed HeadersInit type issues in API client
- 🎯 **CLIENT DIRECTIVES**: Added "use client" directive for SSR compatibility
- ⚡ **DEPLOYMENT**: Successful production deployment with all TypeScript errors resolved

### v1.0.0 "Admin Console Launch" (2026-01-04)
- 🚀 **ADMIN CONSOLE COMPLETE**: Platform Admin Console (/admin) and Partner Portal (/partners)
- 🏢 **PARTNER MANAGEMENT**: Full CRUD operations for partner organizations  
- 🏗️ **TENANT DASHBOARD**: System-wide tenant management with filtering and statistics
- 🔐 **ROLE-BASED AUTH**: JWT authentication with Platform Admin and Partner Admin roles
- 🎨 **MODERN UI**: Card-based layout with DPIA color scheme and responsive design
- 🔌 **CORE API INTEGRATION**: Connected to deployed core-avantle-ai control plane
- 📊 **ADMIN DASHBOARD**: System statistics, activity feed, and usage analytics
- 🛡️ **SECURITY**: Unauthorized access handling and proper role validation
- ⚡ **PRODUCTION READY**: Full deployment ready with error handling and loading states
- 📋 **VERSION MANAGEMENT**: Complete version tracking system with changelog page