export type AppLanguage = "ro" | "en";

export const LANGUAGE_STORAGE_KEY = "autopilot.language";
export const LANGUAGE_CHANGE_EVENT = "autopilot-language-change";

export const languageLabels: Record<AppLanguage, string> = {
  ro: "Română",
  en: "English",
};

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === "ro" || value === "en";
}

export function detectBrowserLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isAppLanguage(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage =
    window.navigator.languages?.[0] ??
    window.navigator.language ??
    "en";

  return browserLanguage.toLowerCase().startsWith("ro") ? "ro" : "en";
}

export function setPreferredLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(new CustomEvent<AppLanguage>(LANGUAGE_CHANGE_EVENT, { detail: language }));
}

export function subscribeToLanguageChanges(callback: (language: AppLanguage) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<AppLanguage>;

    if (isAppLanguage(customEvent.detail)) {
      callback(customEvent.detail);
      return;
    }

    callback(detectBrowserLanguage());
  };

  window.addEventListener(LANGUAGE_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export const authCopy = {
  en: {
    login: {
      eyebrow: "Secure access",
      title: "Login",
      body: "Use your owner or team member account to access the command center.",
      subtitle: "Use your owner or team member account to access the command center.",
      emailPlaceholder: "Work email",
      passwordPlaceholder: "Password",
      submit: "Continue",
      loading: "Signing in...",
      submitting: "Signing in...",
      switchPrefix: "New to Autopilot One?",
      switchLink: "Create an account",
      error: "Could not sign in. Check your email and password.",
    },
    register: {
      eyebrow: "Workspace setup",
      title: "Create account",
      body: "Create the owner account and first workspace for your company.",
      subtitle: "Create the owner account and first workspace for your company.",
      emailPlaceholder: "Work email",
      passwordPlaceholder: "Password",
      firstNamePlaceholder: "First name",
      lastNamePlaceholder: "Last name",
      organizationNamePlaceholder: "Company name",
      organizationSlugPlaceholder: "company-slug",
      submit: "Create workspace",
      loading: "Creating workspace...",
      submitting: "Creating workspace...",
      error: "Could not create the workspace. Please check the details and try again.",
    },
  },
  ro: {
    login: {
      eyebrow: "Acces securizat",
      title: "Intră în cont",
      body: "Folosește contul de owner sau de membru al echipei pentru a accesa centrul de comandă.",
      subtitle: "Folosește contul de owner sau de membru al echipei pentru a accesa centrul de comandă.",
      emailPlaceholder: "Email de lucru",
      passwordPlaceholder: "Parolă",
      submit: "Continuă",
      loading: "Se conectează...",
      submitting: "Se conectează...",
      switchPrefix: "Nou pe Autopilot One?",
      switchLink: "Creează cont",
      error: "Nu am putut conecta contul. Verifică emailul și parola.",
    },
    register: {
      eyebrow: "Configurare workspace",
      title: "Creează cont",
      body: "Creează contul de owner și primul spațiu de lucru pentru compania ta.",
      subtitle: "Creează contul de owner și primul spațiu de lucru pentru compania ta.",
      emailPlaceholder: "Email de lucru",
      passwordPlaceholder: "Parolă",
      firstNamePlaceholder: "Prenume",
      lastNamePlaceholder: "Nume",
      organizationNamePlaceholder: "Numele companiei",
      organizationSlugPlaceholder: "slug-companie",
      submit: "Creează workspace",
      loading: "Se creează workspace-ul...",
      submitting: "Se creează workspace-ul...",
      error: "Nu am putut crea workspace-ul. Verifică datele și încearcă din nou.",
    },
  },
} satisfies Record<AppLanguage, {
  login: Record<string, string>;
  register: Record<string, string>;
}>;

export const authPageCopy = {
  login: {
    en: {
      title: "Enter your AI command center",
      body: "Track leads, messages and widget activity from one simple workspace built for small teams that need fast replies and clear follow-up.",
      proofs: ["AI Receptionist 24/7", "CRM Lite included", "Secure access"],
    },
    ro: {
      title: "Intră în centrul tău de comandă AI",
      body: "Urmărește leadurile, mesajele și activitatea widgetului dintr-un spațiu simplu, creat pentru IMM-uri care vor răspuns rapid și organizare.",
      proofs: ["Recepționer AI 24/7", "CRM Lite inclus", "Acces securizat"],
    },
  },
  register: {
    en: {
      title: "Create your Autopilot One workspace",
      body: "Set up the owner account and first workspace for your company. After registration, you go straight to the dashboard.",
      proofs: ["Fast setup", "Dashboard included", "No code"],
    },
    ro: {
      title: "Creează workspace-ul Autopilot One",
      body: "Configurează contul de owner și primul spațiu de lucru pentru compania ta. După creare, intri direct în dashboard.",
      proofs: ["Setup rapid", "Dashboard inclus", "Fără cod"],
    },
  },
} satisfies Record<"login" | "register", Record<AppLanguage, { title: string; body: string; proofs: string[] }>>;


export const shellCopy = {
  en: {
    homeAria: "Autopilot One home",
    navAria: "Main navigation",
    home: "Home",
    pricing: "Pricing",
    demo: "Request demo",
    createAccount: "Create account",
    login: "Login",
    widgetDemo: "Widget demo",
    product: "Product",
    legal: "Legal",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    refunds: "Refunds",
    consumers: "Consumers",
    footerDescription: "AI platform for small businesses that want faster replies, better lead capture and a clear operational follow-up flow.",
    footerPilot: "Controlled pilot. Guided setup, CRM Lite tracking and validation before using AI with real customers.",
    contactNote: "For a demo, pilot or offer, send a request and we will suggest the first AI flow that fits your business.",
  },
  ro: {
    homeAria: "Autopilot One acasă",
    navAria: "Navigație principală",
    home: "Acasă",
    pricing: "Prețuri",
    demo: "Cere demo",
    createAccount: "Creează cont",
    login: "Intră în cont",
    widgetDemo: "Demo widget",
    product: "Produs",
    legal: "Legal",
    contact: "Contact",
    privacy: "Confidențialitate",
    terms: "Termeni",
    refunds: "Rambursări",
    consumers: "Consumatori",
    footerDescription: "Platformă AI pentru IMM-uri care vor să răspundă rapid, să capteze lead-uri și să urmărească cererile într-un flux operațional clar.",
    footerPilot: "Pilot controlat. Configurare ghidată, date urmărite în CRM Lite și validare înainte de folosirea cu clienți reali.",
    contactNote: "Pentru demo, pilot sau ofertă, trimite o cerere și îți propunem primul flux AI potrivit pentru afacerea ta.",
  },
} satisfies Record<AppLanguage, Record<string, string>>;

export const dashboardShellCopy = {
  en: {
    commandCenter: "Command center",
    dashboard: "Dashboard",
    demoRequests: "Demo requests",
    launch: "Launch",
    billing: "Billing",
    notifications: "Notifications",
    inbox: "Inbox",
    onboarding: "Business profile",
    knowledgeBase: "Knowledge Base",
    receptionAi: "AI Receptionist",
    widgetDemo: "Widget demo",
    widgetSettings: "Widget settings",
    widgetAnalytics: "Widget analytics",
  },
  ro: {
    commandCenter: "Centrul de comandă",
    dashboard: "Panou",
    demoRequests: "Cereri demo",
    launch: "Lansare",
    billing: "Facturare",
    notifications: "Notificări",
    inbox: "Inbox",
    onboarding: "Profil companie",
    knowledgeBase: "Bază de cunoștințe",
    receptionAi: "Recepționer AI",
    widgetDemo: "Demo widget",
    widgetSettings: "Setări widget",
    widgetAnalytics: "Analitice widget",
  },
} satisfies Record<AppLanguage, Record<string, string>>;


export const dashboardContentCopy = {
  en: {
    dateUnavailable: "Date unavailable",
    memberRole: "Member",
    ownerRole: "Owner",
    adminRole: "Admin",
    openDetails: "Open details →",
    loadingEyebrow: "Dashboard",
    loadingTitle: "Loading command center...",
    loadingBody: "Preparing workspace data and recent events.",
    authEyebrow: "Secure access",
    authTitle: "Authentication required.",
    authError: "Sign in to access the command center.",
    sessionExpired: "Session expired",
    metricsError: "Could not load dashboard metrics",
    loginCta: "Go to login",
    heroEyebrow: "Operational dashboard",
    heroTitle: "The command center is active.",
    connectedAs: "Signed in as",
    statusAria: "Workspace status",
    workspaceLabel: "Workspace",
    activeFallback: "Active",
    sessionLabel: "Session",
    connectedLabel: "Connected",
    roleLabel: "Role",
    recommendedStep: "Recommended step",
    openCta: "Open →",
    recentEyebrow: "Recent activity",
    recentTitle: "Latest events",
    emptyTitle: "No recent events yet.",
    emptyBody: "After demo requests, conversations or important updates appear, they will be listed here.",
    launchEyebrow: "Launch",
    checklistTitle: "Minimum checklist",
    checklistBody: "Essential steps to prepare Autopilot One for customers.",
    fullChecklistCta: "View full checklist",
    quickActions: [
      {
        title: "Configure the widget",
        description: "Prepare the widget for your website and verify the welcome message.",
        href: "/widget-settings",
      },
      {
        title: "Complete the business profile",
        description: "Add the base information the AI receptionist uses in replies.",
        href: "/onboarding",
      },
      {
        title: "Review demo requests",
        description: "Track captured leads and next steps for every conversation.",
        href: "/demo-requests",
      },
    ],
    launchSteps: [
      "Complete the business profile",
      "Add the knowledge base",
      "Configure the widget",
      "Test the flow from the customer perspective",
    ],
  },
  ro: {
    dateUnavailable: "Dată indisponibilă",
    memberRole: "Membru",
    ownerRole: "Owner",
    adminRole: "Admin",
    openDetails: "Deschide detalii →",
    loadingEyebrow: "Panou",
    loadingTitle: "Se încarcă centrul de comandă...",
    loadingBody: "Pregătim datele workspace-ului și ultimele evenimente.",
    authEyebrow: "Acces securizat",
    authTitle: "Autentificare necesară.",
    authError: "Autentifică-te pentru a accesa centrul de comandă.",
    sessionExpired: "Sesiunea a expirat",
    metricsError: "Nu am putut încărca metricile dashboardului",
    loginCta: "Mergi la login",
    heroEyebrow: "Dashboard operațional",
    heroTitle: "Centrul de comandă este activ.",
    connectedAs: "Conectat ca",
    statusAria: "Stare workspace",
    workspaceLabel: "Spațiu de lucru",
    activeFallback: "Activ",
    sessionLabel: "Sesiune",
    connectedLabel: "Conectată",
    roleLabel: "Rol",
    recommendedStep: "Pas recomandat",
    openCta: "Deschide →",
    recentEyebrow: "Activitate recentă",
    recentTitle: "Ultimele evenimente",
    emptyTitle: "Nu există evenimente recente încă.",
    emptyBody: "După ce apar cereri demo, conversații sau actualizări importante, acestea vor fi listate aici.",
    launchEyebrow: "Lansare",
    checklistTitle: "Checklist minim",
    checklistBody: "Pașii esențiali pentru ca Autopilot One să fie pregătit pentru clienți.",
    fullChecklistCta: "Vezi checklistul complet",
    quickActions: [
      {
        title: "Configurează widgetul",
        description: "Pregătește widgetul pentru site și verifică mesajul de întâmpinare.",
        href: "/widget-settings",
      },
      {
        title: "Completează profilul companiei",
        description: "Adaugă informațiile de bază pe care recepționerul AI le folosește în răspunsuri.",
        href: "/onboarding",
      },
      {
        title: "Verifică cererile demo",
        description: "Urmărește leadurile captate și pașii următori pentru fiecare conversație.",
        href: "/demo-requests",
      },
    ],
    launchSteps: [
      "Completează profilul companiei",
      "Adaugă baza de cunoștințe",
      "Configurează widgetul",
      "Testează fluxul din perspectiva clientului",
    ],
  },
} satisfies Record<AppLanguage, {
  dateUnavailable: string;
  memberRole: string;
  ownerRole: string;
  adminRole: string;
  openDetails: string;
  loadingEyebrow: string;
  loadingTitle: string;
  loadingBody: string;
  authEyebrow: string;
  authTitle: string;
  authError: string;
  sessionExpired: string;
  metricsError: string;
  loginCta: string;
  heroEyebrow: string;
  heroTitle: string;
  connectedAs: string;
  statusAria: string;
  workspaceLabel: string;
  activeFallback: string;
  sessionLabel: string;
  connectedLabel: string;
  roleLabel: string;
  recommendedStep: string;
  openCta: string;
  recentEyebrow: string;
  recentTitle: string;
  emptyTitle: string;
  emptyBody: string;
  launchEyebrow: string;
  checklistTitle: string;
  checklistBody: string;
  fullChecklistCta: string;
  quickActions: Array<{ title: string; description: string; href: string }>;
  launchSteps: string[];
}>;
