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
            settings: 'Nastavenia'
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
            recentAssessments: 'Nedávne hodnotenia'
          },
          precheck: {
            title: 'DPIA Kontrola',
            description: 'Rýchle hodnotenie na určenie, či je potrebná úplná DPIA'
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
        }
      }
    }
    
    // Get value from translations
    const dict = translations[locale] || translations.en
    const namespacedDict = namespace ? dict[namespace] : dict
    
    if (!namespacedDict) return key
    
    // Navigate to nested value using dot notation
    const value = key.split('.').reduce((obj, k) => obj?.[k], namespacedDict)
    
    if (typeof value !== 'string') return key
    
    // Simple variable replacement
    if (variables) {
      return Object.entries(variables).reduce((text, [varKey, varValue]) => {
        return text.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue))
      }, value)
    }
    
    return value
  }
  
  return { t, locale }
}