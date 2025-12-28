# DPIA Avantle.ai Changelog

Complete version history for the Privacy Platform.

## VERSION 3.21.51 - 2025-12-28
**Consistent Button System - Enterprise UX Components**

- **UNIFIED BUTTON COMPONENT**: Created reusable Button with 5 variants (primary, secondary, ghost, outline, destructive)
- **LOADING STATES**: Built-in spinner support with isLoading prop and aria-busy accessibility
- **ICON SUPPORT**: leftIcon/rightIcon props with proper spacing and shrink handling
- **DESIGN CONSISTENCY**: 10px radius, proper heights (sm:30px, md:38px, lg:46px), brand blue primary
- **SINGLE CTA RULE**: Enforced one primary button per screen across Privacy, Context, Dashboard
- **ACCESSIBILITY**: Focus rings, disabled states, keyboard navigation support
- **REFACTORED COMPONENTS**: Privacy Overview, Context module, Dashboard refresh buttons migrated

## VERSION 3.21.50 - 2025-12-21
**Fix Missing Footer & Rebrand to Privacy Platform**

- **FOOTER CONSISTENCY**: Fixed missing footer on DPIA assessment pages
- **PRIVACY PLATFORM BRANDING**: Updated topbar and footer to show "Privacy Platform" instead of mixed Avantle/DPIA.ai references
- **LAYOUT INHERITANCE**: Ensured all pages properly inherit shared layout components
- **PROFESSIONAL SPACING**: Fixed content touching borders with proper ml-4 margins
- **UNIFIED NAVIGATION**: Consistent footer appearance across all platform modules

## VERSION 3.21.49 - 2025-12-21
**Center Dashboard Buttons - Fix Right Alignment Issue**

- **BUTTON CENTERING**: Fixed primary CTA buttons that were incorrectly aligned to right edge
- **RESPONSIVE LAYOUT**: Proper center alignment using `justify-center` on flex containers
- **VISUAL HIERARCHY**: Maintained proper spacing while ensuring centered button placement
- **CROSS-BROWSER CONSISTENT**: Button positioning now works correctly across all screen sizes
- **UX IMPROVEMENT**: Better visual balance in dashboard empty states and CTAs

---

*For complete historical changelog, see src/lib/version.ts (archived versions)*