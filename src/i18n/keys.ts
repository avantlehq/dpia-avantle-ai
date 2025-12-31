// Translation keys for DPIA Privacy Platform
// Structured for next-intl compatibility

export const TranslationKeys = {
  // Navigation
  nav: {
    home: 'nav.home',
    workspace: 'nav.workspace',
    more: 'nav.more',
    
    // Module navigation
    modules: {
      privacy: 'nav.modules.privacy',
      context: 'nav.modules.context',
      risk: 'nav.modules.risk',
      controls: 'nav.modules.controls',
      training: 'nav.modules.training',
      trust: 'nav.modules.trust'
    },
    
    // Page navigation
    pages: {
      // Privacy module pages
      overview: 'nav.pages.overview',
      dashboard: 'nav.pages.dashboard',
      'pre-check': 'nav.pages.pre-check',
      builder: 'nav.pages.builder',
      assessments: 'nav.pages.assessments',
      templates: 'nav.pages.templates',
      exports: 'nav.pages.exports',
      settings: 'nav.pages.settings',
      
      // Context module pages (future)
      'data-mapping': 'nav.pages.data-mapping',
      'asset-inventory': 'nav.pages.asset-inventory',
      'process-mapping': 'nav.pages.process-mapping',
      
      // Risk module pages (future)
      'risk-assessment': 'nav.pages.risk-assessment',
      'threat-modeling': 'nav.pages.threat-modeling',
      'vulnerability-scan': 'nav.pages.vulnerability-scan',
      
      // Controls module pages (future)
      'control-catalog': 'nav.pages.control-catalog',
      'compliance-mapping': 'nav.pages.compliance-mapping',
      'audit-trails': 'nav.pages.audit-trails',
      
      // Training module pages (future)
      'privacy-training': 'nav.pages.privacy-training',
      'certification': 'nav.pages.certification',
      'awareness': 'nav.pages.awareness',
      
      // Trust Center module pages (future)
      'trust-center': 'nav.pages.trust-center',
      'certifications': 'nav.pages.certifications',
      'reports': 'nav.pages.reports'
    }
  },
  
  // Common UI elements
  common: {
    loading: 'common.loading',
    saving: 'common.saving',
    saved: 'common.saved',
    error: 'common.error',
    success: 'common.success',
    warning: 'common.warning',
    info: 'common.info',
    cancel: 'common.cancel',
    save: 'common.save',
    delete: 'common.delete',
    edit: 'common.edit',
    view: 'common.view',
    export: 'common.export',
    import: 'common.import',
    search: 'common.search',
    filter: 'common.filter',
    sort: 'common.sort',
    back: 'common.back',
    next: 'common.next',
    previous: 'common.previous',
    finish: 'common.finish'
  },
  
  // DPIA Assessment specific
  dpia: {
    // Pre-check form
    precheck: {
      title: 'dpia.precheck.title',
      description: 'dpia.precheck.description',
      questions: {
        q1: 'dpia.precheck.questions.q1',
        q2: 'dpia.precheck.questions.q2',
        q3: 'dpia.precheck.questions.q3',
        q4: 'dpia.precheck.questions.q4',
        q5: 'dpia.precheck.questions.q5',
        q6: 'dpia.precheck.questions.q6',
        q7: 'dpia.precheck.questions.q7',
        q8: 'dpia.precheck.questions.q8'
      },
      results: {
        required: 'dpia.precheck.results.required',
        recommended: 'dpia.precheck.results.recommended',
        notRequired: 'dpia.precheck.results.notRequired'
      }
    },
    
    // Full DPIA builder
    builder: {
      title: 'dpia.builder.title',
      sections: {
        overview: 'dpia.builder.sections.overview',
        dataProcessing: 'dpia.builder.sections.dataProcessing',
        riskAssessment: 'dpia.builder.sections.riskAssessment',
        mitigation: 'dpia.builder.sections.mitigation'
      }
    },
    
    // Dashboard
    dashboard: {
      title: 'dpia.dashboard.title',
      newAssessment: 'dpia.dashboard.newAssessment',
      recentAssessments: 'dpia.dashboard.recentAssessments',
      stats: {
        total: 'dpia.dashboard.stats.total',
        pending: 'dpia.dashboard.stats.pending',
        completed: 'dpia.dashboard.stats.completed',
        highRisk: 'dpia.dashboard.stats.highRisk'
      }
    }
  },
  
  // Language selector
  language: {
    current: 'language.current',
    select: 'language.select',
    english: 'language.english',
    slovak: 'language.slovak'
  },
  
  // Footer
  footer: {
    platform: 'footer.platform',
    version: 'footer.version',
    rights: 'footer.rights'
  }
} as const

// Type helper for translation keys
export type TranslationKey = typeof TranslationKeys[keyof typeof TranslationKeys]

// Utility function to get nested translation keys
export function getTranslationKey(path: string): string {
  return path
}

// Utility to extract all translation keys for dictionary creation
export function extractAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'string') {
      keys.push(value)
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...extractAllKeys(value as Record<string, unknown>, currentPath))
    }
  }
  
  return keys
}

// Generate complete key list for translation files
export const ALL_TRANSLATION_KEYS = extractAllKeys(TranslationKeys)