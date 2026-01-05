# 🚀 Context Module Integration Prompt

## 📋 **ÚLOHA PRE ZAJTRA**

Dokončiť integráciu Context modulu s dnešnou prácou a pripojiť UI v dpia.avantle.ai s API implementáciou z ../context-avantle-ai.

## 🎯 **KONTEXTUÁLNE INFORMÁCIE**

### **Aktuálny stav (5. január 2026, VERSION 3.21.140)**
- ✅ **DPIA platforma obnovená**: Krásna pôvodná architektúra s left sidebar + topbar + main content
- ✅ **Context API backup**: Kompletná implementácia uložená v `../context-avantle-ai/`  
- ✅ **Dokumentácia kompletná**: CLAUDE.md, docs/data-model.md, docs/architecture.md aktualizované
- ✅ **Mikroservices stratégia**: Jasná roadmap pre standalone produkty

### **Context API implementácia (dnes vytvorená)**
Lokácia: `C:\Users\rasti\Projects\avantlehq\context-avantle-ai\`

**Obsahuje:**
```
lib/api/context/
├── systems.ts              # IT Systems CRUD API  
├── processing.ts           # Processing Activities (ROPA) API
├── vendors.ts              # Vendors/Processors API
├── data-categories.ts      # Data Categories API
├── data-flows.ts           # Data Flows API
├── locations.ts            # Locations/Jurisdictions API
└── types.ts                # TypeScript definície

app/api/v1/context/
├── systems/route.ts        # REST endpoints pre systems
├── processing/route.ts     # REST endpoints pre processing activities  
├── vendors/route.ts        # REST endpoints pre vendors
├── data-categories/route.ts # REST endpoints pre data categories
├── data-flows/route.ts     # REST endpoints pre data flows
└── locations/route.ts      # REST endpoints pre locations

supabase/migrations/
└── 20260105_create_context_tables.sql  # Database schema
```

### **UI komponenty v dpia.avantle.ai**
Context modul má tieto stránky:
- `/context` - Overview dashboard
- `/context/systems` - IT Systems management  
- `/context/processing` - Processing Activities (ROPA)
- `/context/data-categories` - Data Categories
- `/context/data-flows` - Data Flows mapping
- `/context/vendors` - Vendors/Processors
- `/context/locations` - Locations/Jurisdictions

## 🎯 **CIELE PRE ZAJTRA**

### **FÁZA 1: Integrácia API (30 min)**
1. **Kopírovať Context API** z `../context-avantle-ai/` do `dpia-avantle-ai/`
2. **Integrovať database schema** - spustiť migrácie pre Context tables
3. **Verifikovať API endpoints** - otestovať `/api/v1/context/*` routes

### **FÁZA 2: UI Komponenty (90 min)**
4. **Systems Management UI** - CRUD interface pre IT systémy
5. **Processing Activities UI** - ROPA (Record of Processing Activities) formulár
6. **Vendors Management UI** - Vendors/Processors registrácia
7. **Data Categories UI** - Hierarchická klasifikácia osobných údajov

### **FÁZA 3: Advanced Features (60 min)**
8. **Data Flows Mapping** - Vizuálne mapovanie data flows medzi systémami  
9. **Locations Management** - Jurisdikcie a adequacy decisions
10. **Dashboard Integration** - Context overview s statistics

### **FÁZA 4: Production Ready (30 min)**
11. **Validácia a testing** - Otestovať celý workflow
12. **Version update** - Aktualizovať na VERSION 3.21.141
13. **Documentation** - Aktualizovať changelog a deployment

## 📝 **ŠPECIFICKÝ PROMPT PRE CLAUDE CODE**

```
Ahoj! Chcem dokončiť integráciu Context modulu do dpia.avantle.ai. 

KONTEXT:
- Včera sme obnovili krásnu DPIA platformu (VERSION 3.21.140)
- Dnes sme vytvorili kompletné Context API v ../context-avantle-ai/
- Potrebujem integrovať túto API implementáciu do dpia.avantle.ai
- Context modul má byť prvý krok k mikroservices architektúre

ÚLOHA:
1. Skopíruj Context API z ../context-avantle-ai/ do dpia.avantle.ai
2. Implementuj UI komponenty pre Context modul:
   - Systems management (IT systémy)
   - Processing activities (ROPA)  
   - Vendors management
   - Data categories
   - Data flows mapping
   - Locations/jurisdictions
3. Spoj UI s API endpoints
4. Vytvor funkčný Context module workflow

TECH STACK:
- Next.js 16.1.1 + React 19 + TypeScript
- Supabase database + RLS
- Tailwind CSS + Design token system  
- React Hook Form + Zod validation
- Locale routing (SK/EN support)

POUŽIJ:
- Existujúce design system komponenty z /components/ui/
- Database schema z ../context-avantle-ai/supabase/migrations/
- API implementáciu z ../context-avantle-ai/lib/api/context/
- Routing pattern podobný existujúcim modulom

OČAKÁVANÝ VÝSLEDOK:
- Funkčný Context modul v sidebar navigation
- CRUD operácie pre všetky Context entity
- Professional UI s validation  
- Database persistence
- SK/EN translations
- Ready for production deployment

Môžeme začať? Najprv skontroluj čo je v ../context-avantle-ai/ a potom začneme integráciou.
```

## 🗂️ **TECHNICKÉ DETAILY**

### **Database Schema Integration**
```sql
-- Spustí sa migrácia z context-avantle-ai:
supabase/migrations/20260105_create_context_tables.sql

-- Obsahuje:
- systems table (IT systémy)
- processing_activities table (ROPA) 
- vendors table (spracovateľia)
- data_categories table (kategórie údajov)
- data_flows table (data flow mapping)
- locations table (jurisdikcie)
- Všetky potrebné enums a indexes
```

### **API Endpoints Structure**
```typescript
// Všetky endpoints budú dostupné na:
POST   /api/v1/context/systems
GET    /api/v1/context/systems
PUT    /api/v1/context/systems/:id
DELETE /api/v1/context/systems/:id

// Rovnako pre: processing, vendors, data-categories, data-flows, locations
```

### **UI Component Pattern**
```typescript
// Každá Context stránka bude mať:
- Page component s listing (table/cards)
- Create/Edit modal alebo form
- Delete confirmation
- Search/filter functionality  
- Pagination pre veľké datasety
- Validation s error handling
- Loading states
- SK/EN translations
```

## 🎨 **DESIGN REQUIREMENTS**

### **Konzistencia s existujúcim UI**
- **Design tokens**: Používať CSS variables z design system
- **Button hierarchy**: Primary CTA + secondary actions pattern
- **Form layouts**: React Hook Form s professional validation
- **Card components**: Existujúce Card, CardHeader, CardContent pattern
- **Loading states**: Skeleton UI pre loading experience
- **Error handling**: User-friendly error messages a retry actions

### **Navigation Integration**  
- **Sidebar**: Context modul už existuje v navigation
- **Breadcrumbs**: Context > Systems, Context > Processing, atď.
- **Active states**: Proper highlighting active Context sub-pages
- **Mobile UX**: Drawer navigation s responsive design

## 🚀 **SUCCESS CRITERIA**

### **Funkčnosť**
- ✅ Všetky Context sub-pages funkčné
- ✅ CRUD operácie working end-to-end
- ✅ Database persistence s RLS security
- ✅ Form validation s error handling
- ✅ Slovak/English translations working

### **UX/UI**
- ✅ Professional design konzistentný s platformou
- ✅ Loading states a smooth interactions  
- ✅ Mobile responsive design
- ✅ Accessibility compliance (ARIA, keyboard navigation)
- ✅ Error handling s user-friendly messages

### **Technical**
- ✅ TypeScript bez errors/warnings
- ✅ ESLint compliance  
- ✅ Clean build pre production
- ✅ API endpoints tested a working
- ✅ Database schema deployed

## 📅 **TIMELINE EXPECTATION**

**Total time: ~3.5 hodiny**
- API Integration: 30 min
- Core UI Components: 90 min  
- Advanced Features: 60 min
- Polish & Deploy: 30 min

**Expected completion: Do obeda zajtra** 🕒

## 🎯 **POST-INTEGRATION GOALS**

Po dokončení Context modulu:
1. **Test s production data** - Vytvoriť sample systems, processing activities
2. **User feedback** - Pripraviť pre Slovak lawyer collaboration
3. **Next module planning** - Rozhodnúť či Risk alebo Controls module ďalší
4. **Microservices preparation** - Planning pre context.avantle.ai separation

---

**💡 TIP:** Začni s jednoduchým - Systems management, potom pridávaj complexity.
**🎯 FOCUS:** Working end-to-end workflow > perfect UI polish
**🚀 GOAL:** Business value - functional Context inventory pre GDPR compliance