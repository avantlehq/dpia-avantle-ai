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
            trust: 'Trust Center',
            'trust-center': 'Trust Center',
            integrations: 'Integrations',
            'api-integrations': 'Integrations'
          },
          pages: {
            overview: 'Overview',
            dashboard: 'DPIA Assessments',
            'pre-check': 'DPIA Pre-Check',
            'dpia-precheck': 'DPIA Pre-Check',
            'dpia-assessments': 'DPIA Assessments',
            builder: 'DPIA Builder',
            assessments: 'Assessments',
            templates: 'Templates',
            exports: 'Exports',
            settings: 'Settings',
            'risk-overview': 'Risk Overview',
            'privacy-risks': 'Privacy Risks', 
            'risk-register': 'Risk Register',
            'controls-overview': 'Controls Overview',
            'training-overview': 'Training Overview',
            systems: 'Systems',
            processing: 'Processing Activities',
            'data-categories': 'Data Categories',
            'data-flows': 'Data Flows',
            vendors: 'Vendors / Processors',
            locations: 'Locations & Jurisdictions',
            lia: 'LIA',
            tia: 'TIA',
            policies: 'Privacy Policies',
            toms: 'TOMs',
            governance: 'Governance Overview',
            'audit-packages': 'Audit Packages',
            'integrations-overview': 'Integrations',
            'api-integrations-overview': 'Integrations'
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
          finish: 'Finish',
          // Empty States
          upcomingFeatures: 'Upcoming Features',
          notifyWhenReady: 'Notify When Ready',
          whyThisModule: 'Why This Module?',
          moduleImportance: 'This module will help you maintain GDPR compliance and streamline your privacy management workflow.',
          currentProgress: 'Current Progress',
          inDevelopment: 'Currently in development. Check back soon for updates on our progress.'
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
        },
        help: {
          title: 'Help & Support',
          description: 'Documentation, support, and resources for Avantle Privacy Platform',
          documentation: 'Documentation',
          documentationDescription: 'Comprehensive guides and API documentation',
          support: 'Contact Support',
          supportDescription: 'Get help from our privacy compliance experts',
          community: 'Community',
          communityDescription: 'Connect with other privacy professionals',
          status: 'System Status',
          statusDescription: 'Check platform availability and performance',
          comingSoon: 'Coming Soon',
          tempMessage: 'Help Center Under Development',
          tempDescription: 'We are building comprehensive help resources for privacy professionals. Check back soon for guides, tutorials, and support documentation.',
          backToDashboard: 'Back to Dashboard',
          contactSupport: 'Contact Support',
          sectionBeingPrepared: 'This section is being prepared',
          helpSystemOverview: 'Help System Overview',
          guidesAvailable: 'Guides Available',
          articles: 'Articles',
          languages: 'Languages',
          available: 'Available',
          inPreparation: 'In Preparation',
          browseGuides: 'Browse Guides',
          sections: {
            gettingStarted: 'Getting Started',
            documentation: 'Product Documentation',
            support: 'Support & Troubleshooting'
          },
          categories: {
            gettingStarted: {
              title: 'Getting Started',
              description: 'Learn the basics of the Avantle Privacy Platform'
            },
            compliance: {
              title: 'GDPR Compliance',
              description: 'Understanding GDPR requirements and how to meet them'
            },
            modules: {
              title: 'Platform Modules',
              description: 'Detailed guides for each module in the platform'
            },
            glossary: {
              title: 'Privacy Glossary',
              description: 'Key terms and definitions in privacy and data protection'
            },
            troubleshooting: {
              title: 'Troubleshooting',
              description: 'Common issues and how to resolve them'
            },
            api: {
              title: 'API Documentation',
              description: 'Integration guides and API reference'
            }
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
            trust: 'Centrum dôvery',
            'trust-center': 'Centrum dôvery',
            integrations: 'Integrácie',
            'api-integrations': 'Integrácie'
          },
          pages: {
            overview: 'Prehľad',
            dashboard: 'DPIA Hodnotenia',
            'pre-check': 'DPIA Kontrola',
            'dpia-precheck': 'DPIA Kontrola',
            'dpia-assessments': 'DPIA Hodnotenia',
            builder: 'DPIA Tvorca',
            assessments: 'Hodnotenia',
            templates: 'Šablóny',
            exports: 'Exporty',
            settings: 'Nastavenia',
            'risk-overview': 'Prehľad rizík',
            'privacy-risks': 'Riziká súkromia',
            'risk-register': 'Register rizík',
            systems: 'Systémy',
            processing: 'Spracovanie',
            'data-categories': 'Kategórie údajov',
            'data-flows': 'Toky údajov',
            vendors: 'Dodávatelia',
            locations: 'Lokality',
            register: 'Register',
            'controls-overview': 'Prehľad kontrol',
            toms: 'TOMs',
            'training-overview': 'Prehľad školení',
            governance: 'Správa',
            'audit-packages': 'Auditné balíky',
            lia: 'LIA',
            tia: 'TIA',
            policies: 'Zásady',
            'integrations-overview': 'Integrácie',
            'api-integrations-overview': 'Integrácie'
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
          finish: 'Dokončiť',
          // GDPR termíny
          gdpr: 'GDPR',
          dataController: 'Prevádzkovateľ',
          dataProcessor: 'Spracovateľ',
          dataSubject: 'Dotknutá osoba',
          personalData: 'Osobné údaje',
          sensitiveData: 'Citlivé údaje',
          processingActivity: 'Spracovateľská činnosť',
          legalBasis: 'Právny základ',
          consent: 'Súhlas',
          legitimateInterest: 'Oprávnený záujem',
          contractualNecessity: 'Zmluvná nevyhnutnosť',
          vitalInterests: 'Životne dôležité záujmy',
          publicTask: 'Verejný úložený úloha',
          dataRetention: 'Uchovávanie údajov',
          dataPortability: 'Prenosnosť údajov',
          rightToErasure: 'Právo na vymazanie',
          rightOfAccess: 'Právo prístupu',
          rightToRectification: 'Právo na opravu',
          rightToRestriction: 'Právo na obmedzenie',
          rightToObject: 'Právo namietať',
          dataBreach: 'Porušenie ochrany údajov',
          supervisoryAuthority: 'Dozorný orgán',
          dpo: 'Zodpovedná osoba',
          privacyByDesign: 'Ochrana súkromia od návrhu',
          privacyByDefault: 'Ochrana súkromia v základnom nastavení',
          // Empty States  
          upcomingFeatures: 'Pripravované funkcionaliny',
          notifyWhenReady: 'Upozorniť keď bude hotové',
          whyThisModule: 'Prečo tento modul?',
          moduleImportance: 'Tento modul vám pomôže udržať GDPR compliance a zefektívniť správu ochrany údajov.',
          currentProgress: 'Aktuálny stav',
          inDevelopment: 'Momentálne vo vývoji. Vráťte sa čoskoro pre aktualizácie pokroku.'
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
        help: {
          title: 'Pomoc a podpora',
          description: 'Dokumentácia, podpora a zdroje pre Avantle Privacy Platform',
          documentation: 'Dokumentácia',
          documentationDescription: 'Komplexné návody a API dokumentácia',
          support: 'Kontaktovať podporu',
          supportDescription: 'Získajte pomoc od našich expertov na compliance ochrany údajov',
          community: 'Komunita',
          communityDescription: 'Spojte sa s inými odborníkmi na ochranu súkromia',
          status: 'Stav systému',
          statusDescription: 'Skontrolujte dostupnosť a výkonnosť platformy',
          comingSoon: 'Pripravuje sa',
          tempMessage: 'Help centrum sa vyvíja',
          tempDescription: 'Budujeme komplexné zdroje pomoci pre odborníkov na ochranu súkromia. Čoskoro sa vráťte pre návody, tutoriály a dokumentáciu podpory.',
          backToDashboard: 'Späť na dashboard',
          contactSupport: 'Kontaktovať podporu',
          sectionBeingPrepared: 'Táto sekcia sa pripravuje',
          helpSystemOverview: 'Prehľad systému pomoci',
          guidesAvailable: 'Dostupné návody',
          articles: 'Články',
          languages: 'Jazyky',
          available: 'Dostupné',
          inPreparation: 'Pripravuje sa',
          browseGuides: 'Prehľadať návody',
          sections: {
            gettingStarted: 'Začíname',
            documentation: 'Produktová dokumentácia',
            support: 'Podpora a riešenie problémov'
          },
          categories: {
            gettingStarted: {
              title: 'Začíname',
              description: 'Naučte sa základy Avantle Privacy Platform'
            },
            compliance: {
              title: 'GDPR zhoda',
              description: 'Pochopenie GDPR požiadaviek a ako ich splniť'
            },
            modules: {
              title: 'Moduly platformy',
              description: 'Podrobné návody pre každý modul v platforme'
            },
            glossary: {
              title: 'Slovník ochrany údajov',
              description: 'Kľúčové pojmy a definície v ochrane súkromia a údajov'
            },
            troubleshooting: {
              title: 'Riešenie problémov',
              description: 'Bežné problémy a ako ich vyriešiť'
            },
            api: {
              title: 'API dokumentácia',
              description: 'Návody na integráciu a API referencia'
            }
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
          moduleDescription: 'Tento modul bude obsahovať pokročilé nástroje pre identifikáciu, hodnotenie a riadenie rizík súkromia.',
          riskAssessment: 'Hodnotenie rizika',
          riskLevel: 'Úroveň rizika',
          high: 'Vysoké',
          medium: 'Stredné', 
          low: 'Nízke',
          riskCategory: 'Kategória rizika',
          dataSubjectRights: 'Práva dotknutých osôb',
          dataTransfers: 'Prenosy údajov',
          dataRetention: 'Uchovávanie údajov',
          securityMeasures: 'Bezpečnostné opatrenia',
          likelihood: 'Pravdepodobnosť',
          impact: 'Dopad',
          riskTreatment: 'Riešenie rizika',
          mitigate: 'Znížiť',
          accept: 'Akceptovať',
          transfer: 'Preniesť',
          avoid: 'Vyhnúť sa'
        },
        controls: {
          title: 'Prehľad kontrol',
          description: 'Technické a organizačné opatrenia',
          controlsOverview: 'Prehľad kontrol',
          toms: 'TOMs',
          controlsDashboard: 'Dashboard kontrol',
          technicalMeasures: 'Technické a organizačné opatrenia',
          comingSoon: 'Pripravuje sa',
          moduleDescription: 'Tento modul bude obsahovať nástroje pre správu technických a organizačných opatrení (TOMs) podľa GDPR.',
          technicalControls: 'Technické kontroly',
          organizationalControls: 'Organizačné kontroly',
          accessControl: 'Kontrola prístupu',
          encryption: 'Šifrovanie',
          dataMinimization: 'Minimalizácia údajov',
          pseudonymization: 'Pseudonymizácia',
          backupProcedures: 'Zálohovacie procedúry',
          incidentResponse: 'Reakcia na incident',
          staffTraining: 'Školenie personálu',
          dataProtectionPolicies: 'Zásady ochrany údajov',
          contractualSafeguards: 'Zmluvné záruky',
          regularAudits: 'Pravidelné audity',
          controlType: 'Typ kontroly',
          controlStatus: 'Stav kontroly',
          implemented: 'Implementované',
          planned: 'Plánované',
          notImplemented: 'Neimplementované',
          effectiveness: 'Účinnosť',
          lastReviewed: 'Naposledy preverené'
        },
        training: {
          title: 'Prehľad školení',
          description: 'Povedomie o ochrane súkromia a školenia',
          trainingOverview: 'Prehľad školení',
          trainingDashboard: 'Dashboard školení',
          comingSoon: 'Pripravuje sa',
          moduleDescription: 'Tento modul bude obsahovať školenia a programy zvyšovania povedomia o ochrane údajov.',
          awarenessProgram: 'Program povedomia',
          gdprTraining: 'GDPR školenie',
          roleBasedTraining: 'Školenie podľa rolí',
          onboardingTraining: 'Nástupné školenie',
          refresherTraining: 'Obnovovacie školenie',
          specializedTraining: 'Špecializované školenie',
          trainingMaterials: 'Školiace materiály',
          trainingRecords: 'Záznamy o školení',
          completionStatus: 'Stav dokončenia',
          trainingCertificate: 'Certifikát školenia',
          trainingProgress: 'Pokrok v školení',
          nextTraining: 'Ďalšie školenie',
          trainingType: 'Typ školenia',
          mandatory: 'Povinné',
          optional: 'Voliteľné',
          inProgress: 'Prebieha',
          completed: 'Dokončené',
          overdue: 'Po termíne',
          scheduled: 'Naplánované'
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
          moduleDescription: 'Tento modul bude obsahovať nástroje pre tvorbu auditných balíkov a compliance reportovanie.',
          complianceStatus: 'Stav compliance',
          auditTrail: 'Auditná stopa',
          complianceReport: 'Compliance správa',
          certificationReports: 'Certifikačné správy',
          thirdPartyAssessments: 'Posudky tretích strán',
          regulatoryRequirements: 'Regulačné požiadavky',
          complianceGaps: 'Compliance medzery',
          improvementPlan: 'Plán zlepšenia',
          controlEffectiveness: 'Účinnosť kontrol',
          auditFindings: 'Auditné zistenia',
          remedialActions: 'Nápravné opatrenia',
          complianceMetrics: 'Compliance metriky',
          governanceFramework: 'Rámec správy',
          policyCompliance: 'Dodržiavanie zásad',
          dataGovernance: 'Správa údajov',
          privacyGovernance: 'Správa súkromia',
          auditSchedule: 'Harmonogram auditov',
          lastAudit: 'Posledný audit',
          nextAudit: 'Ďalší audit',
          auditScope: 'Rozsah auditu'
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