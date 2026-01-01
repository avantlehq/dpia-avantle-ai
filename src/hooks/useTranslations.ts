'use client'

import { useClientLocale } from './useClientLocale'

// Simple translation hook using our existing dictionaries
export function useTranslations(namespace?: string) {
  const { locale } = useClientLocale()
  
  const t = (key: string, variables?: Record<string, string | number>): string => {
    // Import our existing translation dictionaries
    const translations: Record<string, Record<string, unknown>> = {
      en: {
        nav: {
          home: 'Home',
          workspace: 'Workspace',
          more: '...',
          modules: {
            privacy: 'Privacy',
            context: 'Context', 
            risk: 'Risk',
            controls: 'Controls',
            training: 'Training',
            trust: 'Trust Center'
          },
          pages: {
            overview: 'Overview',
            dashboard: 'DPIA Assessments',
            'pre-check': 'DPIA Pre-Check',
            builder: 'DPIA Builder',
            assessments: 'Assessments',
            templates: 'Templates',
            exports: 'Exports',
            settings: 'Settings'
          }
        },
        common: {
          loading: 'Loading...',
          saving: 'Saving...',
          saved: 'Saved',
          error: 'Error',
          success: 'Success',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          view: 'View',
          export: 'Export',
          search: 'Search',
          back: 'Back',
          next: 'Next',
          finish: 'Finish'
        },
        dpia: {
          dashboard: {
            title: 'DPIA Assessments',
            newAssessment: 'New Assessment',
            recentAssessments: 'Recent Assessments'
          },
          precheck: {
            title: 'DPIA Pre-Check',
            description: 'Quick assessment to determine if a full DPIA is required'
          }
        },
        privacy: {
          title: 'Privacy Overview',
          description: 'Manage your DPIA assessments and compliance activities',
          assessments: 'Privacy Assessments',
          viewAll: 'View All',
          newAssessment: 'New Assessment',
          startPrecheck: 'Start Pre-check',
          ready: 'Ready to assess privacy impact',
          readyDescription: 'Start with a pre-check to determine if you need a full DPIA, or create a comprehensive assessment directly.',
          stats: {
            completed: 'Completed',
            inProgress: 'In Progress', 
            drafts: 'Drafts',
            overdue: 'Overdue'
          }
        }
      },
      sk: {
        nav: {
          home: 'Domov',
          workspace: 'Pracovný priestor',
          more: '...',
          modules: {
            privacy: 'Ochrana údajov',
            context: 'Kontext',
            risk: 'Riziko',
            controls: 'Kontroly',
            training: 'Školenia',
            trust: 'Centrum dôvery'
          },
          pages: {
            overview: 'Prehľad',
            dashboard: 'DPIA Hodnotenia',
            'pre-check': 'DPIA Kontrola',
            builder: 'DPIA Tvorca',
            assessments: 'Hodnotenia',
            templates: 'Šablóny',
            exports: 'Exporty',
            settings: 'Nastavenia',
            systems: 'Systémy',
            processing: 'Spracovanie',
            'data-categories': 'Kategórie údajov',
            'data-flows': 'Toky údajov',
            vendors: 'Dodávatelia',
            locations: 'Lokality',
            'privacy-risks': 'Riziká súkromia',
            register: 'Register',
            toms: 'TOMs',
            governance: 'Správa',
            'audit-packages': 'Auditné balíky',
            lia: 'LIA',
            tia: 'TIA',
            policies: 'Zásady'
          }
        },
        common: {
          loading: 'Načítava sa...',
          saving: 'Ukladá sa...',
          saved: 'Uložené',
          error: 'Chyba',
          success: 'Úspech',
          cancel: 'Zrušiť',
          save: 'Uložiť',
          delete: 'Odstrániť',
          edit: 'Upraviť',
          view: 'Zobraziť',
          export: 'Exportovať',
          search: 'Hľadať',
          back: 'Späť',
          next: 'Ďalej',
          finish: 'Dokončiť'
        },
        dpia: {
          dashboard: {
            title: 'DPIA Hodnotenia',
            newAssessment: 'Nové hodnotenie',
            recentAssessments: 'Nedávne hodnotenia',
            description: 'Spravujte vaše hodnotenia vplyvu na ochranu údajov',
            noAssessments: 'Žiadne hodnotenia',
            noAssessmentsDescription: 'Začnite vytvorením vášho prvého DPIA hodnotenia alebo spustite rýchlu kontrolu.',
            createFirst: 'Vytvoriť prvé hodnotenie',
            total: 'Celkom',
            pending: 'Čakajúce',
            completed: 'Dokončené',
            highRisk: 'Vysoké riziko'
          },
          precheck: {
            title: 'DPIA Kontrola',
            description: 'Rýchle hodnotenie na určenie, či je potrebná úplná DPIA',
            subtitle: 'Zodpovedajte na 8 otázok a zistite, či potrebujete vykonať úplné DPIA hodnotenie podľa článku 35 GDPR.',
            startAssessment: 'Začať hodnotenie',
            questions: {
              q1: 'Zahŕňa spracovanie systematické a rozsiahle hodnotenie osobných aspektov fyzických osôb?',
              q2: 'Spracováva systém osobné údaje vo veľkom rozsahu?',
              q3: 'Zahŕňa spracovanie sledovanie údajov subjektov vo verejne prístupnom priestore?',
              q4: 'Zahŕňa spracovanie citlivé osobné údaje alebo údaje osobnej povahy?',
              q5: 'Zahŕňa spracovanie nové technológie alebo inovačné riešenia?',
              q6: 'Môže spracovanie zabrániť subjektom údajov v uplatnení ich práv alebo využívaní služieb?',
              q7: 'Zahŕňa spracovanie automatizované rozhodovanie s právnymi účinkami?',
              q8: 'Predstavuje spracovanie vysoké riziko pre práva a slobody fyzických osôb?'
            },
            results: {
              required: 'DPIA je povinné',
              recommended: 'DPIA je odporúčané', 
              notRequired: 'DPIA nie je potrebné'
            }
          },
          builder: {
            title: 'DPIA Tvorca',
            description: 'Vytvorte komplexné hodnotenie vplyvu na ochranu údajov',
            sections: {
              overview: 'Prehľad',
              dataProcessing: 'Spracovanie údajov',
              riskAssessment: 'Hodnotenie rizík',
              mitigation: 'Zmierňovanie rizík'
            },
            steps: {
              step1: 'Základné informácie',
              step2: 'Opis spracovania',
              step3: 'Identifikácia rizík', 
              step4: 'Opatrenia na zmierňovanie'
            }
          }
        },
        privacy: {
          title: 'Prehľad ochrany údajov',
          description: 'Spravujte vaše DPIA hodnotenia a compliance aktivity',
          assessments: 'Hodnotenia ochrany údajov',
          viewAll: 'Zobraziť všetko',
          newAssessment: 'Nové hodnotenie', 
          startPrecheck: 'Začať kontrolu',
          ready: 'Pripravené na hodnotenie vplyvu na súkromie',
          readyDescription: 'Začnite kontrolou na určenie, či potrebujete úplnú DPIA, alebo vytvorte komplexné hodnotenie priamo.',
          stats: {
            completed: 'Dokončené',
            inProgress: 'Prebieha',
            drafts: 'Návrhy',
            overdue: 'Po termíne'
          }
        },
        context: {
          title: 'Prehľad kontextu',
          description: 'Základné údaje a kontext spracovania pre compliance ochrany údajov',
          registerSystem: 'Registrovať systém',
          addProcessing: 'Pridať spracovanie',
          manageSystem: 'Spravovať systémy',
          viewProcessing: 'Zobraziť spracovanie',
          foundationData: 'Prehľad základných údajov',
          foundationComponents: 'Komponenty základných údajov',
          foundationReady: 'Základné údaje pripravené',
          foundationDescription: 'Vaše kontextové komponenty są správne nakonfigurované. Spravujte systémy, spracovateľské aktivity a vzťahy s dodávateľmi.',
          addComponent: 'Pridať komponent',
          systems: 'Systémy',
          processingActivities: 'Spracovateľské aktivity',
          dataCategories: 'Kategórie údajov',
          vendors: 'Dodávatelia',
          dataFlows: 'Toky údajov',
          locations: 'Lokality',
          systemsDescription: 'IT systémy a infraštruktúra',
          processingDescription: 'ROPA - Záznam spracovateľských činností',
          dataCategoriesDescription: 'Klasifikácia osobných údajov',
          dataFlowsDescription: 'Pohyb a prenos údajov',
          vendorsDescription: 'Dodávatelia spracovávajúci údaje',
          locationsDescription: 'Geografické umiestnenie údajov'
        },
        risk: {
          title: 'Prehľad rizík',
          description: 'Identifikácia a riadenie rizík ochrany súkromia',
          riskOverview: 'Prehľad rizík',
          privacyRisks: 'Riziká súkromia',
          riskRegister: 'Register rizík',
          riskDashboard: 'Dashboard rizík a metriky',
          identifiedRisks: 'Identifikované riziká súkromia',
          centralizedRegistry: 'Centralizovaný register rizík',
          comingSoon: 'Pripravuje sa',
          moduleDescription: 'Tento modul bude obsahovať pokročilé nástroje pre identifikáciu, hodnotenie a riadenie rizík súkromia.'
        },
        controls: {
          title: 'Prehľad kontrol',
          description: 'Technické a organizačné opatrenia',
          controlsOverview: 'Prehľad kontrol',
          toms: 'TOMs',
          controlsDashboard: 'Dashboard kontrol',
          technicalMeasures: 'Technické a organizačné opatrenia',
          comingSoon: 'Pripravuje sa',
          moduleDescription: 'Tento modul bude obsahovať nástroje pre správu technických a organizačných opatrení (TOMs) podľa GDPR.'
        },
        training: {
          title: 'Prehľad školení',
          description: 'Povedomie o ochrane súkromia a školenia',
          trainingOverview: 'Prehľad školení',
          trainingDashboard: 'Dashboard školení',
          comingSoon: 'Pripravuje sa',
          moduleDescription: 'Tento modul bude obsahovať školenia a programy zvyšovania povedomia o ochrane údajov.'
        },
        trustCenter: {
          title: 'Centrum dôvery',
          description: 'Auditné balíky a compliance reportovanie',
          governance: 'Prehľad správy',
          auditPackages: 'Auditné balíky',
          governanceOverview: 'Prehľad správy',
          crossModuleCompliance: 'Compliance stav naprieč modulmi',
          complianceAuditBundles: 'Balíky compliance auditov',
          comingSoon: 'Pripravuje sa',
          moduleDescription: 'Tento modul bude obsahovať nástroje pre tvorbu auditných balíkov a compliance reportovanie.'
        }
      }
    }
    
    // Get value from translations
    const dict = translations[locale] || translations.en
    const namespacedDict = namespace ? dict[namespace] : dict
    
    if (!namespacedDict) return key
    
    // Navigate to nested value using dot notation
    const value = key.split('.').reduce((obj: Record<string, unknown>, k) => 
      obj?.[k] as Record<string, unknown>, namespacedDict as Record<string, unknown>)
    
    if (typeof value !== 'string') return key
    
    // Simple variable replacement
    if (variables) {
      return Object.entries(variables).reduce((text: string, [varKey, varValue]) => {
        return text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue))
      }, value as string)
    }
    
    return value
  }
  
  return { t, locale }
}