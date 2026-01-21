# i18n Refactoring Plan: Consolidate to Single System

**STATUS: ✅ COMPLETED IN v3.31.15 (2026-01-21)**

## Refactoring Results

### What Was Accomplished
- **Consolidated dual i18n systems** into single root `/i18n/` location
- **Deleted 144KB of dead code** (~2000 lines) from `src/i18n/` directory
- **Created clean architecture** with single source of truth for translations
- **Fixed middleware imports** from relative to absolute paths
- **Updated tsconfig.json** with `@/i18n/*` path mapping
- **Zero regressions** - all functionality preserved, build passes

### Files Deleted
- `src/i18n/keys.ts` (150+ lines) - hardcoded translation keys, never used
- `src/i18n/request.ts` (20 lines) - old next-intl loader, never called
- `src/i18n/utils.ts` (200+ lines) - removed dead functions, kept 2 active ones
- `src/i18n/dictionaries/en-v2.json` (1117 lines) - never loaded by next-intl
- `src/i18n/dictionaries/sk-v2.json` (1000+ lines) - never loaded by next-intl
- `src/i18n/config.ts` - moved to `/i18n/config.ts`

### Files Created
- `/i18n/config.ts` - centralized locale configuration
- `/i18n/client-utils.ts` - extracted 2 active functions (detectClientLocale, setClientLocale)

### Files Updated
- `tsconfig.json` - added `@/i18n/*` path mapping
- `src/hooks/useClientLocale.ts` - updated import from `@/i18n/utils` to `@/i18n/client-utils`
- `src/lib/state/modules.ts` - updated import from `@/i18n/utils` to `@/i18n/client-utils`
- `src/middleware.ts` - changed from `./i18n/config` to `@/i18n/config`

### Lessons Learned

**Lesson 1: Always Verify Import Paths**
- Problem: Developers edited `src/i18n/dictionaries/*.json` for 7+ versions
- Reality: next-intl loads from `/messages/*.json` only
- Solution: Trace imports to verify actual file usage before editing

**Lesson 2: Dead Code Accumulates Quickly**
- Problem: 2000 lines of dead code created confusion
- Reality: Incomplete migration left orphaned files
- Solution: Delete unused code immediately after migration

**Lesson 3: Single Source of Truth Prevents Errors**
- Problem: Two dictionary locations → developers edited wrong one
- Reality: Confusion led to repeated mistakes (v3.31.8, v3.31.13)
- Solution: Consolidate to one clear location

**Lesson 4: Document Architecture Clearly**
- Problem: No documentation of which files next-intl actually loads
- Reality: Developers guessed and got it wrong repeatedly
- Solution: Add architecture diagrams and critical rules to CLAUDE.md and docs/

**Lesson 5: Test Both Language URLs**
- Problem: Fixed English but broke Slovak (or vice versa)
- Reality: Need to test `/en/` AND `/sk/` URLs after changes
- Solution: Always test both locales before deployment

### Git Commits
- `39d43cd` - v3.31.15: i18n consolidation refactoring
- `24fde6b` - v3.31.16: Added privacy.assessments namespace
- `bb4a233` - v3.31.17: Added remaining privacy.assessments keys
- `e9482c9` - v3.31.18: Removed debug console logs

---

## Original State Analysis (v3.31.14)

### Two i18n Systems Exist

#### 1. **ROOT SYSTEM** `/i18n/` - ✅ ACTIVE (Used by next-intl)
**Files:**
- `request.ts` - Loads messages from `../messages/${locale}.json`
- `routing.ts` - Defines next-intl routing config

**Message Files:**
- `/messages/en.json` (581 lines)
- `/messages/sk.json` (similar size)

**Status:** Working correctly, used in production
**Configured in:** `next.config.ts` line 6: `createNextIntlPlugin('./i18n/request.ts')`

---

#### 2. **SRC SYSTEM** `/src/i18n/` - ⚠️ PARTIALLY DEAD

**Files:**

| File | Lines | Status | Usage |
|------|-------|--------|-------|
| `config.ts` | 150+ | ✅ USED | `locales`, `Locale`, `languageNames`, `defaultLocale` |
| `utils.ts` | 218 | ⚠️ MIXED | Only `detectClientLocale()` and `setClientLocale()` used |
| `keys.ts` | 150+ | ❌ DEAD | Hardcoded translation keys, never imported |
| `request.ts` | 20 | ❌ DEAD | Never loaded by next-intl |
| `dictionaries/en-v2.json` | 1117 | ❌ DEAD | Never loaded (2x larger than active dictionary!) |
| `dictionaries/sk-v2.json` | 1000+ | ❌ DEAD | Never loaded |

**Import Usage:**
- 4 files import from `@/i18n/config` (locales, languageNames)
- 2 files import from `@/i18n/utils` (detectClientLocale, setClientLocale)

---

### Root Cause: Historical Migration

The dual system exists because:
1. Project originally used custom i18n system (`src/i18n/`)
2. Migrated to next-intl library (created `/i18n/`)
3. Migration incomplete - kept `config.ts` and `utils.ts` for client-side helpers
4. Dead code (`dictionaries/`, `keys.ts`, old `request.ts`) never cleaned up
5. Over 10 versions (v3.28-v3.31) accidentally added translations to dead dictionaries

---

## Refactoring Strategy

### Goals
1. Single source of truth for i18n configuration
2. Remove dead code (~2000+ lines)
3. Clarify which system handles what
4. Prevent future mistakes (editing wrong files)

### Option A: Merge into Root `/i18n/` (RECOMMENDED)

**Action Plan:**
1. Move `config.ts` from `src/i18n/` to `/i18n/config.ts`
2. Extract client utils from `src/i18n/utils.ts` to `/i18n/client-utils.ts`
   - Keep only: `detectClientLocale()`, `setClientLocale()`
   - Remove: `loadDictionary()`, `translate()`, etc. (dead code)
3. Delete entire `src/i18n/` directory
4. Update 6 imports:
   - `@/i18n/config` → `@/../i18n/config` (or adjust tsconfig paths)
   - `@/i18n/utils` → `@/../i18n/client-utils`

**Result:**
```
/i18n/
├── request.ts         (next-intl message loader)
├── routing.ts         (next-intl routing config)
├── config.ts          (locales, languageNames) [MOVED FROM src/]
└── client-utils.ts    (detectClientLocale, setClientLocale) [EXTRACTED]

/messages/
├── en.json            (active translations)
└── sk.json            (active translations)

/src/i18n/             [DELETED - 2000+ lines removed]
```

**Benefits:**
- Single `/i18n/` directory for all i18n concerns
- Clear separation: `/i18n/` (config) vs `/messages/` (content)
- No confusion about which files are active
- ~2000 lines of dead code removed

**Risks:**
- Need to update tsconfig.json path mapping for imports
- 6 files need import path updates

---

### Option B: Keep Both, Clarify Roles (MINIMAL CHANGE)

**Action Plan:**
1. Rename `src/i18n/` → `src/i18n-client/` (clarify it's client-side only)
2. Delete dead files from `src/i18n-client/`:
   - `request.ts`, `keys.ts`, `dictionaries/` folder
3. Keep only: `config.ts`, `utils.ts` (with dead code removed from utils)
4. Add README.md to both directories explaining roles

**Result:**
```
/i18n/                 [next-intl server-side]
├── request.ts         (message loader)
└── routing.ts         (routing config)

/messages/             [translations]
├── en.json
└── sk.json

/src/i18n-client/      [client-side helpers only]
├── config.ts          (locales, languageNames)
└── utils.ts           (detectClientLocale, setClientLocale)
```

**Benefits:**
- Minimal code changes (just deletions + rename)
- No import path updates needed
- Clear naming: i18n vs i18n-client

**Risks:**
- Still two directories (confusion remains)
- Future developers may still add to wrong location

---

## Recommendation: OPTION A

Merge into root `/i18n/` for single source of truth.

**Implementation Steps:**

1. **Preparation** (5 minutes)
   - Verify no other files use dead functions from utils.ts
   - Document current import locations

2. **Create new files in /i18n/** (10 minutes)
   ```bash
   # Copy config
   cp src/i18n/config.ts i18n/config.ts

   # Extract only client functions to new file
   # Manually create i18n/client-utils.ts with:
   # - detectClientLocale()
   # - setClientLocale()
   # - isValidLocale() helper
   ```

3. **Update tsconfig.json** (2 minutes)
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/i18n/*": ["./i18n/*"]  // Add this mapping
       }
     }
   }
   ```

4. **Update imports** (5 minutes)
   6 files need updates:
   - `src/app/[locale]/layout.tsx`
   - `src/components/ui/language-switcher.tsx`
   - `src/hooks/useClientLocale.ts` (2 imports)
   - `src/lib/state/modules.ts`

   Change:
   ```typescript
   // FROM:
   import { locales } from '@/i18n/config'
   import { detectClientLocale } from '@/i18n/utils'

   // TO:
   import { locales } from '@/i18n/config'
   import { detectClientLocale } from '@/i18n/client-utils'
   ```

5. **Delete dead code** (1 minute)
   ```bash
   rm -rf src/i18n/
   ```

6. **Test** (5 minutes)
   - Run `pnpm build` - should compile with zero errors
   - Test language switcher - should work
   - Test locale detection - should work

7. **Commit** (2 minutes)
   ```bash
   git add -A
   git commit -m "refactor: Consolidate i18n to single /i18n/ directory

   - Moved config.ts to /i18n/config.ts
   - Extracted client utils to /i18n/client-utils.ts
   - Deleted dead code: src/i18n/ directory (2000+ lines)
   - Removed dead dictionaries, unused translation functions
   - Updated 6 import paths

   Result: Single source of truth for i18n configuration"
   ```

**Total Time:** ~30 minutes
**Lines Removed:** ~2000 (dead dictionaries, unused functions)
**Risk Level:** Low (only active code is being moved)

---

## Alternative: Deferred Refactoring

If immediate refactoring is not desired, add this to prevent future mistakes:

### Quick Fix: Add Warning Signs

Create `/src/i18n/README.md`:
```markdown
# ⚠️ WARNING: This directory contains LEGACY CODE

## DO NOT ADD TRANSLATIONS HERE

This directory is PARTIALLY DEPRECATED:
- ✅ `config.ts` - Still used (locales, languageNames)
- ✅ `utils.ts` - Partially used (detectClientLocale, setClientLocale only)
- ❌ `request.ts` - DEAD CODE (never loaded)
- ❌ `dictionaries/` - DEAD CODE (never loaded)
- ❌ `keys.ts` - DEAD CODE (never imported)

## WHERE TO ADD TRANSLATIONS:
1. `/messages/en.json` - English translations
2. `/messages/sk.json` - Slovak translations

These files are loaded by `/i18n/request.ts` via next-intl.

## PLANNED REFACTORING:
See `/docs/i18n-refactoring-plan.md` for consolidation strategy.
```

This prevents repeating the v3.28-v3.31 mistake (adding translations to dead files).

---

## Summary

**Current Issue:** Two i18n systems with significant dead code (~2000 lines)

**Recommended Fix:** Option A - Merge into single `/i18n/` directory

**Effort:** ~30 minutes, low risk

**Benefit:**
- Remove 2000+ lines of dead code
- Single source of truth
- Prevent future confusion
- Cleaner architecture

**Decision:** Your choice whether to refactor now or defer with warning signs.
