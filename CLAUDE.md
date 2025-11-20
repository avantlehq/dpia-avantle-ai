# CLAUDE.md

Tento súbor poskytuje kontext pre Claude Code pri práci s DPIA Agent repozitárom.

## Kontext projektu DPIA Suite

**DPIA Suite** je produkt pozostávajúci z marketingovej vrstvy (dpia.ai) a aplikačnej vrstvy (DPIA Agent na dpia.avantle.ai).

### Vízia projektu

Cieľom je vytvoriť nástroj, ktorý pokrýva dve najdôležitejšie oblasti GDPR posudzovania rizík:

1. **DPIA Builder** – úplný proces vypracovania Data Protection Impact Assessment
2. **DPIA Assessment** ("Do I need a DPIA?") – krátky rozhodovací nástroj, ktorý identifikuje, či projekt vôbec potrebuje DPIA

DPIA Suite bude ako MVP existovať samostatne, bez potreby DPOvision platformy.
V budúcnosti bude možné doplniť ďalšie moduly (RoPA, LIA, Policy Kit), ale teraz je prioritou pevné jadro DPIA funkcií.

### Produktová architektúra (2 komponenty)

**A) dpia.ai — Marketing & Conversion Layer** 📍 HOTOVÉ
- Framework: Next.js 15, Tailwind, shadcn/ui, next-intl
- Obsah: landing, blog, SEO články, newsletter, CTA
- Primárne features:
  - DPIA Builder CTA → presmerovanie do agenta
  - DPIA Assessment / Pre-check Tool (krátky wizard)
  - Výsledok: "You need a DPIA / You likely don't need DPIA / Borderline case"
  - Voliteľne generovanie PDF pre-check summary
- Budúca expanzia: dpia.cz, dpia.sk, dpia.at, dpia.online (lokálne landing pages)

**B) dpia.avantle.ai — Application Runtime (DPIA Agent)** 📍 **TENTO REPOZITÁR**
- Framework: Next.js 15, App Router, TypeScript
- Backend: Supabase (Postgres, Auth, RLS, Storage)
- UI: Tailwind, shadcn/ui
- Funkcie po 1A: login, dashboard, wizard skeleton, mock export

### Databázová architektúra (Supabase)

**CORE TABUĽKY:**
- users
- tenants
- workspaces
- members
- assessments
- assessment_answers
- form_sections
- risk_evaluations
- export_history
- user_preferences
- (Phase 2A) tenant_branding

**Bezpečnosť:**
- Multi-tenant izolácia cez RLS
- Každý dotaz viazaný na workspace_id + tenant_id
- Supabase Storage pre PDF/DOCX

### Funkčné moduly DPIA Suite

**A) DPIA Builder (hlavný modul MVP):**
- Step-by-step wizard (context → legal → risks → measures → conclusion)
- Save/resume
- Risk scoring engine
- Export PDF/DOCX
- Assessment workflow: draft → submitted
- Audit logs
- Tenants + workspaces
- Onboarding (first workspace → first assessment)

**B) DPIA Assessment ("Do I need a DPIA?" Pre-check):**
- Krátky rozhodovací wizard (6–10 otázok)
- Výsledok: DPIA required / DPIA recommended / DPIA not required
- Voliteľný mini-export PDF
- Redirect do full DPIA Builder
- Tento modul beží na dpia.ai, ale môže volať API na dpia.avantle.ai

## Roadmap (8 týždňov)

### Week 1–4 (✔ HOTOVÉ)
- ✅ dpia.ai marketing web
- ✅ dpia.avantle.ai agent skeleton
- ✅ Supabase, Auth, DB, RLS
- ✅ DNS/SSL, CI/CD

### Week 5–6 — Phase 1B: DPIA Builder Core **← AKTUÁLNE FÁZA**
- Implementácia 10-krokového wizardu (context → legal → risks → measures → conclusion)
- Persistencia odpovedí (assessments + assessment_answers tabuľky)
- Zod validácie pre formuláre
- Risk scoring engine (impact × likelihood)
- Export PDF/DOCX funkcionality
- Onboarding workflow (first workspace → first assessment)
- Staging + closed beta

### Week 7–8 — Phase 2A: Whitelabel Engine
- tenant_branding tabuľka
- domain routing (CNAME)
- CSS theming
- branding v PDF exportoch
- whitelabel demo pre partnerov

## Aktuálny stav repozitára

### ✅ Hotové komponenty (Week 1-4)

**Infraštruktúra:**
- Next.js 15 + TypeScript + Tailwind CSS setup
- Supabase integrácia (auth, database, RLS)
- Multi-tenant architektúra pripravená
- Authentication flow implementovaný

**UI Components:**
- Dashboard layout s sidebar/topbar
- Wizard komponenty pripravené
- Auth komponenty (login/signup)
- shadcn/ui komponenty

**Database Schema:**
- Multi-tenant štruktúra s RLS
- Users, tenants, workspaces tabuľky
- Assessment základná štruktúra

### 🚀 Phase 1B - FINÁLNY IMPLEMENTATION PLAN

# DPIA Builder Core + DPIA Assessment Implementation (Phase 1B)

**Repo:** dpia-avantle-ai  
**Framework:** Next.js 15, Supabase, TypeScript

## Úloha
Implementuj jadro DPIA Suite funkcionality pozostávajúcej z:
- **DPIA Builder (Core)** - 3-sekciový wizard
- **DPIA Assessment** ("Do I need a DPIA?" pre-check wizard)  
- **Kompletný onboarding flow**
- **Risk scoring engine**
- **PDF/DOCX export**
- **Staging prostredie**

Cieľ je vytvoriť produkčný DPIA MVP, na ktorom môžu prebiehať reálne posúdenia dopadov (DPIA).

## Kontext
- DPIA Suite = dpia.ai (marketing) + dpia.avantle.ai (aplikácia) ← **TENTO PROJEKT**
- DPOvision.com sa nevyužíva
- **Produktové piliere:**
  1. **DPIA Builder** - komplexný nástroj
  2. **DPIA Assessment** - quick pre-check (lead generation)

## 1. DPIA Builder Core
**Implementuj 3 sekcie wizardu:**
1. **Context & Scope** - základné info o projekte/procese
2. **Legal Basis** - právny základ spracovania  
3. **Risk Factors** - identifikácia a hodnotenie rizík

**Funkcie:**
- Ukladanie odpovedí → `assessment_answers`
- Per-section progress → `form_sections` 
- Zod validácia
- Auto-save (30s + onBlur)
- Submit flow (draft → in_review → submitted)
- Step navigation + progress bar
- Validation UI
- Audit log events

## 2. Risk Scoring Engine
```typescript
score = likelihood × impact
level:
  1–5 = low
  6–15 = medium  
  16–20 = high
  21–25 = critical
```
Výpočet ukladať do `risk_evaluations`.

## 3. Export System
**Implementuj export:**
- **PDF:** `@react-pdf/renderer` alebo `jsPDF`
- **DOCX:** `docx` library

**Export obsahuje:**
- Meta (title, created_at, author)
- Všetky odpovede
- Risk evaluation výsledky
- Mitigation measures
- Legal compliance summary

**Branding:**
```
Generated by DPIA Builder – https://dpia.ai
Document ID: {assessment_id}
Generated on: {timestamp}
```

**Ukladanie a logovanie:**
- Upload → Supabase Storage
- Insert → `export_history`

## 4. Onboarding Flow (first-time user)
**Route:** `/onboarding` – 3 kroky:

**Krok 1: Tenant + Workspace creation**
- Organization name
- Country  
- Industry
- Workspace name

**Krok 2: User preferences**
- Jazyk: EN/SK/DE/CZ
- Email notifications: weekly/monthly/off
- Role

**Krok 3: First Assessment**
- Automaticky vytvor "My First DPIA Assessment"
- Redirect → `/[assessmentId]` (wizard start)

**Routing rules:**
```typescript
if user has 0 workspaces -> /onboarding
else -> /dashboard
```

## 5. DPIA Assessment ("Do I need a DPIA?" Pre-check Wizard)
**Mini-wizard s 8–10 otázkami, ktorý poskytne:**
- **DPIA Required**
- **DPIA Recommended** 
- **DPIA Not Required**

**Funkcie:**
- Route: `/precheck`
- Form with radio fields
- **Scoring logic:**
  - High-risk indicators → DPIA required
  - Medium → recommended
  - None → not required

**Po dokončení:**
- Uložiť pre-check do DB: `assessment_precheck`
- Zobraziť výsledok + odporúčanie
- **CTA:** "Start Full DPIA" → vytvoriť nový assessment + redirect do wizardu
- Voliteľne export mini-reportu (PDF)

## 6. Database Schema (Supabase)
**Doplň/uprav tabuľky:**
- `assessments`
- `assessment_answers` 
- `form_sections`
- `risk_evaluations`
- `export_history`
- `user_preferences`
- `assessment_precheck` ← **NOVÁ TABUĽKA**

**RLS:**
- Izolácia podľa tenant/workspace
- User vidí len svoje dáta

## 7. Súborová štruktúra
```
src/
  app/
    (auth)/onboarding/
    (dashboard)/precheck/
    (dashboard)/[assessmentId]/
    api/assessments/
    api/precheck/
  lib/
    templates/
    validation/
    risk/
    export/
    audit/
    db/
    utils/
  components/
    wizard/
    onboarding/
    precheck/
    export/
```

## 8. Server Actions
**Assessment Core:**
- `saveAssessmentAnswer()`
- `submitAssessment()`
- `calculateRiskScore()`
- `exportAssessment()`

**Onboarding:**
- `createWorkspace()`
- `setUserPreferences()`
- `createFirstAssessment()`

**Pre-check:**
- `savePrecheckAnswers()`
- `evaluatePrecheck()`
- `createAssessmentFromPrecheck()`

## 9. Staging Environment
- **Production:** dpia.avantle.ai
- **Staging:** dpia-staging.avantle.ai
- Samostatný Supabase projekt alebo naming prefix
- 5–10 beta test users

## 10. Success Criteria
**Po dokončení 1B:**
- ✅ Kompletný 3-sekciový DPIA builder
- ✅ Funkčný pre-check "Do I need a DPIA?" wizard
- ✅ Persistencia všetkých odpovedí
- ✅ Risk scoring
- ✅ Export PDF + DOCX  
- ✅ Onboarding od prvého loginu
- ✅ Audit trail
- ✅ Staging deployment
- ✅ Žiadne TS/ESLint chyby
- ✅ API pripravené na rozšírenie o ďalších 7 sekcií
- ✅ **Plne funkčný DPIA Suite MVP**

## Customer Journey
```
dpia.ai (marketing) 
→ "Do I need a DPIA?" 
→ dpia.avantle.ai/precheck 
→ "DPIA Required" 
→ "Start Full DPIA" 
→ /[assessmentId] wizard
```

**Pull Request názov:** `feat(1B): dpia-builder-core + precheck + risk-engine + export + onboarding`

## Lokálna cesta

**Projekt sa nachádza v:** `C:\Users\rasti\Projects\avantlehq\dpia-avantle-ai\`

## Development commands

```bash
# Development (z dpia-avantle-ai/)
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build           # Build for production
pnpm start           # Start production server  
pnpm lint            # Run ESLint

# Database
npx supabase status   # Check Supabase connection
npx supabase db reset # Reset local database

# Deployment
git push origin main  # Auto-deploy to Vercel
```

## Cieľový stav MVP

Po dokončení Phase 1B + 2A:
- ✅ DPIA Suite v produkčnom stave
- ✅ Marketing (dpia.ai) + aplikácia (dpia.avantle.ai)
- ✅ Plne funkčný DPIA Builder nástroj
- ✅ Pre-check "Do I need a DPIA?" pre akvizičné účely
- ✅ Whitelabel režim pre partnerov
- ✅ Pripravenosť na lokálne mutácie (dpia.cz, dpia.sk, dpia.at...)
- ✅ MVP schopné generovať reálne DPIA dokumenty pre firmy

## Technologická vízia

DPIA Agent má byť výpočtové a dátové jadro platformy s možnosťou:
- **Multi-tenant**: Plná izolácia klientskych dát
- **Whitelabel**: Prispôsobiteľný branding pre partnerov
- **GDPR compliant**: Built-in privacy by design
- **Scalable**: Pripravené na tisíce súbežných používateľov
- **Export ready**: Profesionálne DPIA dokumenty

Založené na Next.js 15 + Supabase technológii pre rapid development a škálovateľnosť.