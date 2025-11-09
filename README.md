# DPIA Agent

Core application for automated GDPR Data Protection Impact Assessments with AI assistance.

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Multi-language support** (English, Slovak, German) with next-intl
- **Authentication** with Supabase (email magic links)
- **Dashboard** with assessment management
- **DPIA Wizard** with 10-step guided process
- **Export functionality** (PDF/DOCX mock)
- **Event logging** for audit trails
- **Dark/light theme** support
- **E2EE preparation** for future security enhancements

## 🏗️ Project Structure

```
src/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main application
│   │   └── auth/callback/     # OAuth callback
│   └── api/                   # API endpoints
├── components/
│   ├── dashboard/             # Dashboard components
│   ├── wizard/                # DPIA wizard components
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── services/              # Business logic services
│   ├── supabase/              # Database client
│   ├── validations/           # Zod schemas
│   └── types.ts               # TypeScript definitions
├── stores/                    # Zustand state management
└── i18n/                      # Internationalization config
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 9+
- Supabase project (optional for development)

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/avantlehq/dpia-avantle-ai.git
cd dpia-avantle-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Start development server:
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main tables:

- `users` - User authentication (managed by Supabase)
- `tenants` - Organization-level grouping
- `workspaces` - Project workspaces within tenants
- `members` - User-workspace relationships
- `assessments` - DPIA assessment data
- `domain_events` - Event logging for audit trails

See `database/schema.sql` for the complete schema with RLS policies.

## 🔐 Authentication & Authorization

- **Authentication**: Supabase Auth with magic link emails
- **Authorization**: Row Level Security (RLS) policies
- **Multi-tenancy**: Workspace-based data isolation
- **E2EE Ready**: Prepared for client-side encryption

## 🌐 Internationalization

Supported languages:
- **English** (default)
- **Slovak** 
- **German**

Language files are located in `messages/[locale].json`.

## 📦 Deployment

### Environment Variables

Required environment variables for production:

```bash
NEXT_PUBLIC_BASE_URL=https://dpia.avantle.ai
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The application is configured for deployment on `dpia.avantle.ai`.

## 🔗 Related Projects

- **DPIA Marketing Site** (`dpia-ai`) - Marketing website and lead generation
- **DPO Studio** (`dpo-studio-ai`) - Full GDPR compliance platform (future)

## 🚧 Development Status

**Phase 1A Complete** ✅

- [x] Core infrastructure setup
- [x] Authentication system
- [x] Dashboard UI
- [x] DPIA wizard skeleton (10 steps)
- [x] Mock export functionality
- [x] Event logging system
- [x] Database schema with RLS
- [x] Multi-language support

**Next Phase (1B)**:
- [ ] Implement actual DPIA form logic
- [ ] Connect to Supabase backend
- [ ] Add real PDF/DOCX export
- [ ] Implement risk assessment algorithms
- [ ] Add assessment validation

## 📝 License

Private - All rights reserved by Avantle

---

*Built with ❤️ by the Avantle team*
