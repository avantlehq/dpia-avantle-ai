import type { Locale } from './locales'

export interface Translation {
  // Navigation
  platform: string
  privacyByDesign: string
  dpiaSuite: string
  partners: string
  platformAdmin: string
  login: string
  
  // Homepage
  europeanPrivacyPlatform: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  
  // Features
  dpiaAutomation: string
  dpiaAutomationDesc: string
  multiTenantPlatform: string
  multiTenantPlatformDesc: string
  europeanFirst: string
  europeanFirstDesc: string
  
  // Buttons and actions
  launchPlatform: string
  platformAdministration: string
  or: string
  noTracking: string
  
  // Platform page
  platformPageTitle: string
  platformPageSubtitle: string
  multiTenantArchitecture: string
  platformArchitecture: string
  controlPlaneFrontend: string
  controlPlaneApi: string
  runtimePlatform: string
  partnerManagement: string
  adminConsole: string
  marketingPlatform: string
  rbacManagement: string
  partnerTenantMgmt: string
  usageAnalytics: string
  dpiaWorkflows: string
  clientDataProcessing: string
  whitelabelAccess: string
  
  // Features detailed
  multiTenantArchFeature: string
  multiTenantArchDesc: string
  gdprAutomation: string
  gdprAutomationDesc: string
  europeanDataSovereignty: string
  europeanDataSovereigntyDesc: string
  partnerEcosystem: string
  partnerEcosystemDesc: string
  usageAnalyticsFeature: string
  usageAnalyticsDesc: string
  apiFirstDesign: string
  apiFirstDesignDesc: string
  
  // Call to action
  readyToStart: string
  joinPlatform: string
  
  // Privacy page  
  privacyByDesignBadge: string
  privacyPageTitle: string
  privacyPageSubtitle: string
  
  // Privacy principles
  noTrackingEver: string
  noTrackingDesc: string
  whatWeDo: string
  whatWeDont: string
  functionalAnalytics: string
  anonymizedMetrics: string
  transparentData: string
  thirdPartyTracking: string
  crossSiteCookies: string
  behavioralProfiling: string
  
  europeanDataSov: string
  europeanDataSovDesc: string
  euHosting: string
  gdprNative: string
  dataProtection: string
  serversEu: string
  builtForEu: string
  encryptionTransit: string
  
  transparencyControl: string
  transparencyControlDesc: string
  completeTransparency: string
  completeTransparencyDesc: string
  userControl: string
  userControlDesc: string
  auditTrails: string
  auditTrailsDesc: string
  
  minimalDataCollection: string
  minimalDataCollectionDesc: string
  dataMinimization: string
  personalInfo: string
  usageAnalyticsMin: string
  sessionData: string
  thirdPartySharing: string
  onlyRequired: string
  anonymizedAggregated: string
  temporaryFunctional: string
  never: string
  
  // Experience section
  experiencePrivacy: string
  experiencePrivacyDesc: string
}

export const translations: Record<Locale, Translation> = {
  en: {
    // Navigation
    platform: 'Platform',
    privacyByDesign: 'Privacy by Design',
    dpiaSuite: 'Privacy Management',
    partners: 'Partners',
    platformAdmin: 'Platform Admin',
    login: 'Login',
    
    // Homepage
    europeanPrivacyPlatform: 'Privacy Management',
    heroTitle: 'Privacy Management',
    heroSubtitle: 'The platform for automated DPIA and GDPR compliance',
    heroDescription: '',
    
    // Features
    dpiaAutomation: 'DPIA Automation',
    dpiaAutomationDesc: 'Automated Data Protection Impact Assessments with expert guidance',
    multiTenantPlatform: 'Multi-Tenant Platform',
    multiTenantPlatformDesc: 'White-label solutions for partners and enterprise clients',
    europeanFirst: 'GDPR Compliant',
    europeanFirstDesc: 'Built for European data sovereignty and GDPR compliance',
    
    // Buttons and actions
    launchPlatform: 'Launch Platform',
    platformAdministration: 'Platform Administration',
    or: 'or',
    noTracking: 'No tracking. No telemetry. No compromises.',
    
    // Platform page
    platformPageTitle: 'Avantle Privacy Platform',
    platformPageSubtitle: 'Enterprise-grade privacy compliance platform built for European data sovereignty and GDPR automation.',
    multiTenantArchitecture: 'Multi-Tenant Architecture',
    platformArchitecture: 'Platform Architecture',
    controlPlaneFrontend: 'Control Plane Frontend',
    controlPlaneApi: 'Control Plane API',
    runtimePlatform: 'Runtime Platform',
    partnerManagement: 'Partner Management',
    adminConsole: 'Admin Console',
    marketingPlatform: 'Marketing Platform',
    rbacManagement: 'Multi-Tenant RBAC',
    partnerTenantMgmt: 'Partner/Tenant Mgmt',
    usageAnalytics: 'Usage Analytics',
    dpiaWorkflows: 'DPIA Workflows',
    clientDataProcessing: 'Client Data Processing',
    whitelabelAccess: 'Whitelabel Access',
    
    // Features detailed
    multiTenantArchFeature: 'Multi-Tenant Architecture',
    multiTenantArchDesc: 'Complete isolation between partners and tenants with enterprise-grade security and white-label customization.',
    gdprAutomation: 'GDPR Automation',
    gdprAutomationDesc: 'Automated Data Protection Impact Assessments with expert-guided workflows and compliance tracking.',
    europeanDataSovereignty: 'European Data Sovereignty',
    europeanDataSovereigntyDesc: 'Built specifically for EU regulations with data processing exclusively within European boundaries.',
    partnerEcosystem: 'Partner Ecosystem',
    partnerEcosystemDesc: 'Enable partners to offer privacy compliance services under their own brand with complete autonomy.',
    usageAnalyticsFeature: 'Usage Analytics',
    usageAnalyticsDesc: 'Comprehensive usage tracking and analytics for platform optimization and billing transparency.',
    apiFirstDesign: 'API-First Design',
    apiFirstDesignDesc: 'Headless architecture enabling multiple frontend experiences and third-party integrations.',
    
    // Call to action
    readyToStart: 'Ready to Get Started?',
    joinPlatform: 'Join the Avantle Privacy Platform and bring GDPR compliance automation to your organization.',
    
    // Privacy page
    privacyByDesignBadge: 'Privacy by Design',
    privacyPageTitle: 'Privacy by Design',
    privacyPageSubtitle: 'Our foundational approach to building privacy-first technology that respects user rights and European values.',
    
    // Privacy principles
    noTrackingEver: 'No Tracking, Ever',
    noTrackingDesc: 'We do not track users across websites, collect behavioral data, or build advertising profiles. Your privacy is not a commodity to be traded.',
    whatWeDo: '✓ What We Do',
    whatWeDont: '✗ What We Don\'t Do',
    functionalAnalytics: '• Functional analytics only',
    anonymizedMetrics: '• Anonymized usage metrics',
    transparentData: '• Transparent data practices',
    thirdPartyTracking: '• Third-party tracking pixels',
    crossSiteCookies: '• Cross-site cookies',
    behavioralProfiling: '• Behavioral profiling',
    
    europeanDataSov: 'European Data Sovereignty',
    europeanDataSovDesc: 'All data processing occurs within European Union boundaries. We maintain complete control over data location and ensure compliance with EU regulations.',
    euHosting: 'EU Hosting',
    gdprNative: 'GDPR Native',
    dataProtection: 'Data Protection',
    serversEu: 'Servers exclusively in EU',
    builtForEu: 'Built for EU regulations',
    encryptionTransit: 'Encryption at rest & transit',
    
    transparencyControl: 'Transparency & Control',
    transparencyControlDesc: 'We believe users should have complete visibility into how their data is processed and full control over their privacy preferences.',
    completeTransparency: '🔍 Complete Transparency',
    completeTransparencyDesc: 'Every data processing activity is documented and accessible. We provide clear explanations of why data is collected and how it\'s used.',
    userControl: '⚙️ User Control',
    userControlDesc: 'Granular privacy controls allow users to customize their experience while maintaining functionality and security.',
    auditTrails: '📋 Audit Trails',
    auditTrailsDesc: 'Complete audit logs of data processing activities are maintained and can be provided upon request for compliance verification.',
    
    minimalDataCollection: 'Minimal Data Collection',
    minimalDataCollectionDesc: 'We collect only the minimum data necessary for functionality. Every data point serves a specific purpose that benefits the user.',
    dataMinimization: 'Data Minimization in Practice',
    personalInfo: 'Personal Information',
    usageAnalyticsMin: 'Usage Analytics',
    sessionData: 'Session Data',
    thirdPartySharing: 'Third-party Sharing',
    onlyRequired: 'Only what\'s required',
    anonymizedAggregated: 'Anonymized & aggregated',
    temporaryFunctional: 'Temporary & functional',
    never: 'Never',
    
    // Experience section
    experiencePrivacy: 'Experience Privacy by Design',
    experiencePrivacyDesc: 'See how our privacy-first approach works in practice. Try the DPIA platform built on these principles.'
  },
  
  sk: {
    // Navigation
    platform: 'Platforma',
    privacyByDesign: 'Privacy by Design',
    dpiaSuite: 'Privacy Management',
    partners: 'Partneri',
    platformAdmin: 'Admin Platformy',
    login: 'Prihlásenie',
    
    // Homepage
    europeanPrivacyPlatform: 'Privacy Management',
    heroTitle: 'Privacy Management',
    heroSubtitle: 'Platforma pre automatizované DPIA a GDPR compliance',
    heroDescription: '',
    
    // Features
    dpiaAutomation: 'DPIA Automatizácia',
    dpiaAutomationDesc: 'Automatizované hodnotenie vplyvu na ochranu údajov s expertným vedením',
    multiTenantPlatform: 'Multi-Tenant Platforma',
    multiTenantPlatformDesc: 'White-label riešenia pre partnerov a enterprise klientov',
    europeanFirst: 'GDPR Kompatibilné',
    europeanFirstDesc: 'Postavené na európskej dátovej suverenite a GDPR compliance',
    
    // Buttons and actions
    launchPlatform: 'Spustiť Platformu',
    platformAdministration: 'Správa Platformy',
    or: 'alebo',
    noTracking: 'Žiadne sledovanie. Žiadna telemetria. Žiadne kompromisy.',
    
    // Platform page
    platformPageTitle: 'Avantle Privacy Platform',
    platformPageSubtitle: 'Enterprise privacy compliance platforma postavená na európskej dátovej suverenite a GDPR automatizácii.',
    multiTenantArchitecture: 'Multi-Tenant Architektúra',
    platformArchitecture: 'Architektúra Platformy',
    controlPlaneFrontend: 'Control Plane Frontend',
    controlPlaneApi: 'Control Plane API',
    runtimePlatform: 'Runtime Platforma',
    partnerManagement: 'Správa Partnerov',
    adminConsole: 'Admin Konzola',
    marketingPlatform: 'Marketing Platforma',
    rbacManagement: 'Multi-Tenant RBAC',
    partnerTenantMgmt: 'Partner/Tenant Správa',
    usageAnalytics: 'Analytika Používania',
    dpiaWorkflows: 'DPIA Workflows',
    clientDataProcessing: 'Spracovanie Klientských Dát',
    whitelabelAccess: 'Whitelabel Prístup',
    
    // Features detailed
    multiTenantArchFeature: 'Multi-Tenant Architektúra',
    multiTenantArchDesc: 'Kompletná izolácia medzi partnermi a tenantmi s enterprise-grade bezpečnosťou a white-label customizáciou.',
    gdprAutomation: 'GDPR Automatizácia',
    gdprAutomationDesc: 'Automatizované hodnotenie vplyvu na ochranu údajov s expertne vedenými workflows a compliance trackingom.',
    europeanDataSovereignty: 'Európska Dátová Suverenita',
    europeanDataSovereigntyDesc: 'Postavené špecificky pre EU regulácie so spracovaním dát výlučne v európskych hraniciach.',
    partnerEcosystem: 'Partnerský Ekosystém',
    partnerEcosystemDesc: 'Umožniť partnerom ponúkať privacy compliance služby pod vlastnou značkou s kompletnou autonómiou.',
    usageAnalyticsFeature: 'Analytika Používania',
    usageAnalyticsDesc: 'Komplexné sledovanie používania a analytiky pre optimalizáciu platformy a transparentnosť účtovania.',
    apiFirstDesign: 'API-First Dizajn',
    apiFirstDesignDesc: 'Headless architektúra umožňujúca viaceré frontend skúsenosti a third-party integrácie.',
    
    // Call to action
    readyToStart: 'Pripravení Začať?',
    joinPlatform: 'Pridajte sa k Avantle Privacy Platform a prineste GDPR compliance automatizáciu do vašej organizácie.',
    
    // Privacy page
    privacyByDesignBadge: 'Privacy by Design',
    privacyPageTitle: 'Privacy by Design',
    privacyPageSubtitle: 'Náš základný prístup k budovaniu privacy-first technológií, ktoré rešpektujú práva používateľov a európske hodnoty.',
    
    // Privacy principles
    noTrackingEver: 'Žiadne Sledovanie, Nikdy',
    noTrackingDesc: 'Nesledujeme používateľov naprieč webstránkami, nezberáme behaviorálne dáta ani nebudujeme reklamné profily. Vaše súkromie nie je komodita na obchodovanie.',
    whatWeDo: '✓ Čo Robíme',
    whatWeDont: '✗ Čo Nerobíme',
    functionalAnalytics: '• Len funkcionálne analytiky',
    anonymizedMetrics: '• Anonymizované metriky používania',
    transparentData: '• Transparentné dátové praktiky',
    thirdPartyTracking: '• Third-party tracking pixely',
    crossSiteCookies: '• Cross-site cookies',
    behavioralProfiling: '• Behaviorálne profilovanie',
    
    europeanDataSov: 'Európska Dátová Suverenita',
    europeanDataSovDesc: 'Všetko spracovanie dát prebieha v hraniciach Európskej únie. Udržujeme kompletú kontrolu nad lokáciou dát a zabezpečujeme compliance s EU reguláciami.',
    euHosting: 'EU Hosting',
    gdprNative: 'GDPR Native',
    dataProtection: 'Ochrana Dát',
    serversEu: 'Servery výlučne v EU',
    builtForEu: 'Postavené pre EU regulácie',
    encryptionTransit: 'Šifrovanie v pokoji a transporte',
    
    transparencyControl: 'Transparentnosť a Kontrola',
    transparencyControlDesc: 'Veríme, že používatelia by mali mať kompletný prehľad o tom, ako sú ich dáta spracovávané a plnú kontrolu nad svojimi privacy nastaveniami.',
    completeTransparency: '🔍 Kompletná Transparentnosť',
    completeTransparencyDesc: 'Každá aktivita spracovania dát je dokumentovaná a prístupná. Poskytujeme jasné vysvetlenia prečo sú dáta zbierané a ako sa používajú.',
    userControl: '⚙️ Kontrola Používateľa',
    userControlDesc: 'Granulárne privacy kontroly umožňujú používateľom prispôsobiť si skúsenosť pri zachovaní funkčnosti a bezpečnosti.',
    auditTrails: '📋 Audit Záznamy',
    auditTrailsDesc: 'Kompletné audit logy aktivít spracovania dát sú vedené a môžu byť poskytnuté na požiadanie pre compliance verifikáciu.',
    
    minimalDataCollection: 'Minimálne Zbieranie Dát',
    minimalDataCollectionDesc: 'Zbieráme len minimum dát potrebných pre funkčnosť. Každý dátový bod slúži špecifickému účelu, ktorý prospeje používateľovi.',
    dataMinimization: 'Minimalizácia Dát v Praxi',
    personalInfo: 'Osobné Informácie',
    usageAnalyticsMin: 'Analytiky Používania',
    sessionData: 'Session Dáta',
    thirdPartySharing: 'Third-party Zdieľanie',
    onlyRequired: 'Len čo je požadované',
    anonymizedAggregated: 'Anonymizované a agregované',
    temporaryFunctional: 'Dočasné a funkcionálne',
    never: 'Nikdy',
    
    // Experience section
    experiencePrivacy: 'Zažite Privacy by Design',
    experiencePrivacyDesc: 'Pozrite si ako náš privacy-first prístup funguje v praxi. Vyskúšajte DPIA platformu postavenú na týchto princípoch.'
  },
  
  de: {
    // Navigation
    platform: 'Plattform',
    privacyByDesign: 'Privacy by Design',
    dpiaSuite: 'Privacy Management',
    partners: 'Partner',
    platformAdmin: 'Plattform Admin',
    login: 'Anmeldung',
    
    // Homepage
    europeanPrivacyPlatform: 'Privacy Management',
    heroTitle: 'Privacy Management',
    heroSubtitle: 'Die Plattform für automatisierte DPIA und DSGVO-Compliance',
    heroDescription: '',
    
    // Features
    dpiaAutomation: 'DPIA Automatisierung',
    dpiaAutomationDesc: 'Automatisierte Datenschutz-Folgenabschätzungen mit Expertenberatung',
    multiTenantPlatform: 'Multi-Tenant Plattform',
    multiTenantPlatformDesc: 'White-Label-Lösungen für Partner und Unternehmenskunden',
    europeanFirst: 'DSGVO Konform',
    europeanFirstDesc: 'Gebaut für europäische Datensouveränität und DSGVO-Compliance',
    
    // Buttons and actions
    launchPlatform: 'Plattform Starten',
    platformAdministration: 'Plattform Administration',
    or: 'oder',
    noTracking: 'Kein Tracking. Keine Telemetrie. Keine Kompromisse.',
    
    // Platform page
    platformPageTitle: 'Avantle Privacy Platform',
    platformPageSubtitle: 'Enterprise-Grade Privacy-Compliance-Plattform für europäische Datensouveränität und DSGVO-Automatisierung.',
    multiTenantArchitecture: 'Multi-Tenant Architektur',
    platformArchitecture: 'Plattform Architektur',
    controlPlaneFrontend: 'Control Plane Frontend',
    controlPlaneApi: 'Control Plane API',
    runtimePlatform: 'Runtime Plattform',
    partnerManagement: 'Partner Management',
    adminConsole: 'Admin Konsole',
    marketingPlatform: 'Marketing Plattform',
    rbacManagement: 'Multi-Tenant RBAC',
    partnerTenantMgmt: 'Partner/Tenant Mgmt',
    usageAnalytics: 'Nutzungsanalyse',
    dpiaWorkflows: 'DPIA Workflows',
    clientDataProcessing: 'Client Datenverarbeitung',
    whitelabelAccess: 'Whitelabel Zugang',
    
    // Features detailed
    multiTenantArchFeature: 'Multi-Tenant Architektur',
    multiTenantArchDesc: 'Vollständige Isolation zwischen Partnern und Tenants mit Enterprise-Grade-Sicherheit und White-Label-Anpassung.',
    gdprAutomation: 'DSGVO Automatisierung',
    gdprAutomationDesc: 'Automatisierte Datenschutz-Folgenabschätzungen mit expertengeführten Workflows und Compliance-Tracking.',
    europeanDataSovereignty: 'Europäische Datensouveränität',
    europeanDataSovereigntyDesc: 'Speziell für EU-Vorschriften entwickelt, mit Datenverarbeitung ausschließlich innerhalb europäischer Grenzen.',
    partnerEcosystem: 'Partner Ökosystem',
    partnerEcosystemDesc: 'Ermöglicht Partnern, Privacy-Compliance-Services unter ihrer eigenen Marke mit vollständiger Autonomie anzubieten.',
    usageAnalyticsFeature: 'Nutzungsanalyse',
    usageAnalyticsDesc: 'Umfassende Nutzungsverfolgung und Analysen für Plattformoptimierung und Abrechnungstransparenz.',
    apiFirstDesign: 'API-First Design',
    apiFirstDesignDesc: 'Headless-Architektur ermöglicht mehrere Frontend-Erfahrungen und Drittanbieter-Integrationen.',
    
    // Call to action
    readyToStart: 'Bereit Anzufangen?',
    joinPlatform: 'Treten Sie der Avantle Privacy Platform bei und bringen Sie DSGVO-Compliance-Automatisierung in Ihr Unternehmen.',
    
    // Privacy page
    privacyByDesignBadge: 'Privacy by Design',
    privacyPageTitle: 'Privacy by Design',
    privacyPageSubtitle: 'Unser grundlegender Ansatz zum Aufbau datenschutzorientierter Technologie, die Nutzerrechte und europäische Werte respektiert.',
    
    // Privacy principles
    noTrackingEver: 'Kein Tracking, Niemals',
    noTrackingDesc: 'Wir verfolgen keine Nutzer über Websites hinweg, sammeln keine Verhaltensdaten und erstellen keine Werbeprofile. Ihr Datenschutz ist keine Handelsware.',
    whatWeDo: '✓ Was Wir Tun',
    whatWeDont: '✗ Was Wir Nicht Tun',
    functionalAnalytics: '• Nur funktionale Analytiken',
    anonymizedMetrics: '• Anonymisierte Nutzungsmetriken',
    transparentData: '• Transparente Datenpraktiken',
    thirdPartyTracking: '• Third-Party-Tracking-Pixel',
    crossSiteCookies: '• Cross-Site-Cookies',
    behavioralProfiling: '• Verhaltensprofilierung',
    
    europeanDataSov: 'Europäische Datensouveränität',
    europeanDataSovDesc: 'Alle Datenverarbeitung erfolgt innerhalb der Grenzen der Europäischen Union. Wir behalten vollständige Kontrolle über den Datenstandort und gewährleisten Compliance mit EU-Vorschriften.',
    euHosting: 'EU Hosting',
    gdprNative: 'DSGVO Native',
    dataProtection: 'Datenschutz',
    serversEu: 'Server ausschließlich in der EU',
    builtForEu: 'Für EU-Vorschriften gebaut',
    encryptionTransit: 'Verschlüsselung bei Ruhe & Transit',
    
    transparencyControl: 'Transparenz & Kontrolle',
    transparencyControlDesc: 'Wir glauben, dass Nutzer vollständige Einsicht in die Verarbeitung ihrer Daten haben und volle Kontrolle über ihre Datenschutzeinstellungen haben sollten.',
    completeTransparency: '🔍 Vollständige Transparenz',
    completeTransparencyDesc: 'Jede Datenverarbeitungsaktivität wird dokumentiert und ist zugänglich. Wir bieten klare Erklärungen, warum Daten gesammelt und wie sie verwendet werden.',
    userControl: '⚙️ Nutzerkontrolle',
    userControlDesc: 'Granulare Datenschutzkontrollen ermöglichen es Nutzern, ihre Erfahrung anzupassen, während Funktionalität und Sicherheit erhalten bleiben.',
    auditTrails: '📋 Audit-Pfade',
    auditTrailsDesc: 'Vollständige Audit-Logs der Datenverarbeitungsaktivitäten werden geführt und können auf Anfrage für Compliance-Verifizierung bereitgestellt werden.',
    
    minimalDataCollection: 'Minimale Datensammlung',
    minimalDataCollectionDesc: 'Wir sammeln nur die minimal notwendigen Daten für die Funktionalität. Jeder Datenpunkt dient einem spezifischen Zweck, der dem Nutzer zugute kommt.',
    dataMinimization: 'Datenminimierung in der Praxis',
    personalInfo: 'Persönliche Informationen',
    usageAnalyticsMin: 'Nutzungsanalysen',
    sessionData: 'Session Daten',
    thirdPartySharing: 'Third-Party Sharing',
    onlyRequired: 'Nur was erforderlich ist',
    anonymizedAggregated: 'Anonymisiert & aggregiert',
    temporaryFunctional: 'Temporär & funktional',
    never: 'Niemals',
    
    // Experience section
    experiencePrivacy: 'Privacy by Design Erleben',
    experiencePrivacyDesc: 'Sehen Sie, wie unser datenschutzorientierter Ansatz in der Praxis funktioniert. Testen Sie die DPIA-Plattform, die auf diesen Prinzipien aufbaut.'
  }
}