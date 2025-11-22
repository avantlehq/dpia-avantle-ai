# Prompt for Tomorrow — DPIA Builder Implementation (Corrected Version)

## Context

The DPIA Agent platform (v3.1.4) contains a complete DPIA Pre-check Assessment at /precheck.
The core DPIA Builder at /assessments/[id] is still a skeleton.

Your task is to implement the full DPIA Builder Wizard, based on GDPR Article 35, using the EXISTING platform architecture.

## Objective

Implement a complete DPIA Builder / DPIA Wizard that:
- uses the existing layout (AppLayoutWrapper, SidebarSteps, etc.)
- saves all form data to Supabase
- supports multi-step navigation
- includes auto-save + manual save
- generates final PDF/DOCX documents
- complies with GDPR Article 35 structure

## Section 1 — Use the Existing Architecture

You must use the infrastructure that already exists:

**Existing data model:**
- assessments
- assessment_answers
- form_sections
- risk_evaluations
- export_history

**Existing components:**
- AppLayoutWrapper
- SidebarSteps
- Wizard container
- PageHeader
- Breadcrumbs
- Result<T> pattern
- AuthGuard
- WorkspaceGuard
- AssessmentGuard
- server actions
- Supabase integration

**Do NOT create new tables unless absolutely required.**

## Section 2 — DPIA Sections to Implement (GDPR Article 35)

### Section 1: Context & Scope
- processing description
- categories of personal data
- categories of data subjects
- processing purpose
- data sources
- retention

### Section 2: Data Flow & Processing
- collection methods
- storage locations
- transfers
- processors
- security measures
- sharing arrangements

### Section 3: Risk Assessment
- likelihood (1–5)
- impact (1–5)
- risk score (existing risk engine)
- affected rights
- scenarios

### Section 4: Mitigation Measures
- technical safeguards
- organisational measures
- privacy-by-design controls
- monitoring & review
- residual risk

Each section must be fully functional before moving to the next.

## Section 3 — Technical Implementation Requirements

### Form Engine
Use:
- React Hook Form
- Zod validation
- Existing wizard structure
- assessment_answers for storing values
- form_sections for tracking progress

### Saving & Progress
- Auto-save every 30 sec
- Manual Save button
- Section-level validation
- Navigation only allowed when current section is valid

### Server Actions
Implement:
- saveSection(assessmentId, sectionId, data)
- getSection(assessmentId, sectionId)
- validateSection(assessmentId, sectionId)

Use the existing Result<T> pattern.

## Section 4 — Export

Use existing structure:
- PDF with @react-pdf/renderer
- DOCX with docx library
- export stored in Supabase Storage
- entry added to export_history

Document content must include:
- assessment metadata
- all section answers
- risk evaluation results
- mitigation measures
- compliance summary

## Section 5 — Success Criteria

The DPIA Builder is complete when:
- All 4 sections exist and function
- All answers persist to Supabase
- Auto-save + manual save work
- Section validation works
- Wizard navigation works
- PDF + DOCX export works
- Assessment can be created → edited → exported
- Implementation uses ONLY the existing architecture

## Section 6 — Start Here

Start with:
**Section 1: Context & Scope**
1. Build form
2. Implement validation
3. Save answers
4. Show saved values on reload
5. Update section progress

When Section 1 is complete, proceed to Section 2.

---

✔ This corrected prompt is safe, precise, and Claude Code will execute it cleanly.