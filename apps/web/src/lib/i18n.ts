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


export const billingLaunchCopy = {
  en: {
    common: {
      authTitle: "Authentication required.",
      loginCta: "Go to login",
      organizationMissing: "No organization was found for this account.",
    },
    billing: {
      loginRequired: "Sign in before viewing billing.",
      loadBillingError: "Could not load billing",
      updatePlanError: "Could not update plan",
      loadSessionError: "Could not load session",
      loading: "Loading billing...",
      eyebrow: "Billing",
      title: "Plans and usage.",
      noBilling: "No billing data loaded.",
      planPrefix: "plan",
      statusPrefix: "status",
      widgetMessages: "Widget messages",
      knowledgeSources: "Knowledge sources",
      teamMembers: "Team members",
      widgetMessagesPerPeriod: "widget messages / period",
      knowledgeSourcesUnit: "knowledge sources",
      teamMembersUnit: "team members",
      currentPlan: "Current plan",
      switchTo: "Switch to",
      limit: "Limit",
      remaining: "Remaining",
      overLimit: "The limit has been reached.",
    },
    launch: {
      loginRequired: "Sign in before viewing the launch checklist.",
      loadChecklistError: "Could not load launch checklist",
      loadSessionError: "Could not load session",
      loading: "Loading launch checklist...",
      eyebrow: "Pilot launch",
      title: "MVP launch checklist.",
      noChecklist: "No checklist loaded.",
      stepsComplete: "steps complete",
      progress: "Progress",
      readyForPilot: "Ready for pilot",
      publicConversations: "Public conversations",
      yes: "Yes",
      notYet: "Not yet",
      guidedFlowTitle: "Guided demo flow",
      complete: "Complete",
      needsAction: "Needs action",
      scriptTitle: "Demo script",
      script: [
        { title: "Register and open dashboard", body: "Show identity, workspace and protected app shell." },
        { title: "Complete the business profile", body: "Show how company context becomes AI operating context." },
        { title: "Add the knowledge base", body: "Upload or paste content the AI receptionist can use." },
        { title: "Install the widget", body: "Copy the snippet and explain token/origin controls." },
        { title: "Send a website message", body: "Create a public conversation and a lead." },
        { title: "Resolve in inbox", body: "Open the handoff, answer as an operator and close the conversation." },
      ],
    },
  },
  ro: {
    common: {
      authTitle: "Autentificare necesară.",
      loginCta: "Mergi la login",
      organizationMissing: "Nu a fost găsită nicio organizație pentru acest cont.",
    },
    billing: {
      loginRequired: "Autentifică-te înainte să vezi facturarea.",
      loadBillingError: "Nu am putut încărca facturarea",
      updatePlanError: "Nu am putut actualiza planul",
      loadSessionError: "Nu am putut încărca sesiunea",
      loading: "Se încarcă facturarea...",
      eyebrow: "Facturare",
      title: "Planuri și utilizare.",
      noBilling: "Nu există date de facturare încărcate.",
      planPrefix: "plan",
      statusPrefix: "status",
      widgetMessages: "Mesaje widget",
      knowledgeSources: "Surse de cunoștințe",
      teamMembers: "Membri echipă",
      widgetMessagesPerPeriod: "mesaje widget / perioadă",
      knowledgeSourcesUnit: "surse de cunoștințe",
      teamMembersUnit: "membri echipă",
      currentPlan: "Plan curent",
      switchTo: "Schimbă la",
      limit: "Limită",
      remaining: "Rămas",
      overLimit: "Limita a fost atinsă.",
    },
    launch: {
      loginRequired: "Autentifică-te înainte să vezi checklistul de lansare.",
      loadChecklistError: "Nu am putut încărca checklistul de lansare",
      loadSessionError: "Nu am putut încărca sesiunea",
      loading: "Se încarcă checklistul de lansare...",
      eyebrow: "Lansare pilot",
      title: "Checklist de lansare MVP.",
      noChecklist: "Nu există checklist încărcat.",
      stepsComplete: "pași finalizați",
      progress: "Progres",
      readyForPilot: "Pregătit pentru pilot",
      publicConversations: "Conversații publice",
      yes: "Da",
      notYet: "Nu încă",
      guidedFlowTitle: "Flux ghidat pentru demo",
      complete: "Finalizat",
      needsAction: "Necesită acțiune",
      scriptTitle: "Script demo",
      script: [
        { title: "Creează cont și deschide dashboardul", body: "Arată identitatea, workspace-ul și zona protejată a aplicației." },
        { title: "Completează profilul companiei", body: "Arată cum informațiile companiei devin context operațional pentru AI." },
        { title: "Adaugă baza de cunoștințe", body: "Încarcă sau lipește conținut pe care recepționerul AI îl poate folosi." },
        { title: "Instalează widgetul", body: "Copiază fragmentul și explică tokenul și controalele de origine." },
        { title: "Trimite mesaj de pe website", body: "Creează o conversație publică și un lead." },
        { title: "Rezolvă în inbox", body: "Deschide transferul, răspunde ca operator și închide conversația." },
      ],
    },
  },
} satisfies Record<AppLanguage, {
  common: {
    authTitle: string;
    loginCta: string;
    organizationMissing: string;
  };
  billing: {
    loginRequired: string;
    loadBillingError: string;
    updatePlanError: string;
    loadSessionError: string;
    loading: string;
    eyebrow: string;
    title: string;
    noBilling: string;
    planPrefix: string;
    statusPrefix: string;
    widgetMessages: string;
    knowledgeSources: string;
    teamMembers: string;
    widgetMessagesPerPeriod: string;
    knowledgeSourcesUnit: string;
    teamMembersUnit: string;
    currentPlan: string;
    switchTo: string;
    limit: string;
    remaining: string;
    overLimit: string;
  };
  launch: {
    loginRequired: string;
    loadChecklistError: string;
    loadSessionError: string;
    loading: string;
    eyebrow: string;
    title: string;
    noChecklist: string;
    stepsComplete: string;
    progress: string;
    readyForPilot: string;
    publicConversations: string;
    yes: string;
    notYet: string;
    guidedFlowTitle: string;
    complete: string;
    needsAction: string;
    scriptTitle: string;
    script: Array<{ title: string; body: string }>;
  };
}>;


export const notificationsInboxCopy = {
  en: {
    common: {
      authTitle: "Authentication required.",
      loginCta: "Go to login",
    },
    notifications: {
      loginRequired: "Sign in before viewing notifications.",
      loadNotificationsError: "Could not load notifications",
      loadSessionError: "Could not load session",
      loading: "Loading notifications...",
      eyebrow: "Notifications",
      title: "Notification center.",
      workspacePrefix: "Workspace",
      organizationMissing: "No organization was found.",
      total: "Total",
      highPriority: "High priority",
      emailReady: "Ready for email",
      activeNotifications: "Active notifications",
      noActiveNotifications: "No active notifications.",
      emailPayloadsTitle: "Ready for email",
      noEmailPayloads: "No email payloads ready.",
      dateUnavailable: "Date unavailable",
    },
    inbox: {
      loginRequired: "Sign in before using Inbox.",
      loadInboxError: "Could not load inbox",
      loadConversationError: "Could not load conversation",
      updateConversationError: "Could not update conversation",
      sendReplyError: "Could not send reply",
      loadSessionError: "Could not load session",
      loading: "Loading inbox...",
      eyebrow: "Operator inbox",
      title: "Inbox for conversations and human handoffs.",
      description: "Review website conversations, AI escalations, leads and human replies in one place.",
      allStatuses: "All statuses",
      open: "Open",
      waitingForHuman: "Waiting for human",
      closed: "Closed",
      allSources: "All sources",
      websiteWidget: "Website widget",
      internalWeb: "Internal web",
      noMessages: "No messages yet.",
      noConversations: "No conversations found.",
      anonymousVisitor: "Anonymous visitor",
      escalation: "Escalation",
      lead: "Lead",
      score: "score",
      humanTransfer: "Human transfer",
      close: "Close",
      replyPlaceholder: "Write a human reply...",
      send: "Send",
      selectConversation: "Select a conversation.",
      dateUnavailable: "Date unavailable",
      senderCustomer: "Customer",
      senderAi: "AI",
      senderHuman: "Operator",
      senderSystem: "System",
    },
  },
  ro: {
    common: {
      authTitle: "Autentificare necesară.",
      loginCta: "Mergi la login",
    },
    notifications: {
      loginRequired: "Autentifică-te înainte să vezi notificările.",
      loadNotificationsError: "Nu am putut încărca notificările",
      loadSessionError: "Nu am putut încărca sesiunea",
      loading: "Se încarcă notificările...",
      eyebrow: "Notificări",
      title: "Centru de notificări.",
      workspacePrefix: "Spațiu de lucru",
      organizationMissing: "Nu a fost găsită nicio organizație.",
      total: "Total",
      highPriority: "Prioritate mare",
      emailReady: "Pregătite pentru email",
      activeNotifications: "Notificări active",
      noActiveNotifications: "Nu există notificări active.",
      emailPayloadsTitle: "Mesaje pregătite pentru email",
      noEmailPayloads: "Nu există mesaje email pregătite.",
      dateUnavailable: "Dată indisponibilă",
    },
    inbox: {
      loginRequired: "Autentifică-te înainte să folosești inboxul.",
      loadInboxError: "Nu am putut încărca inboxul",
      loadConversationError: "Nu am putut încărca conversația",
      updateConversationError: "Nu am putut actualiza conversația",
      sendReplyError: "Nu am putut trimite răspunsul",
      loadSessionError: "Nu am putut încărca sesiunea",
      loading: "Se încarcă inboxul...",
      eyebrow: "Inbox operator",
      title: "Inbox pentru conversații și transferuri umane.",
      description: "Revizuiești conversațiile din website, escaladările AI, leadurile și răspunsurile umane într-un singur loc.",
      allStatuses: "Toate statusurile",
      open: "Deschis",
      waitingForHuman: "Așteaptă operator",
      closed: "Închis",
      allSources: "Toate sursele",
      websiteWidget: "Widget website",
      internalWeb: "Web intern",
      noMessages: "Nu există mesaje încă.",
      noConversations: "Nu există conversații.",
      anonymousVisitor: "Vizitator anonim",
      escalation: "Escaladare",
      lead: "Lead",
      score: "scor",
      humanTransfer: "Transfer uman",
      close: "Închide",
      replyPlaceholder: "Scrie un răspuns uman...",
      send: "Trimite",
      selectConversation: "Selectează o conversație.",
      dateUnavailable: "Dată indisponibilă",
      senderCustomer: "Client",
      senderAi: "AI",
      senderHuman: "Operator",
      senderSystem: "Sistem",
    },
  },
} satisfies Record<AppLanguage, {
  common: {
    authTitle: string;
    loginCta: string;
  };
  notifications: {
    loginRequired: string;
    loadNotificationsError: string;
    loadSessionError: string;
    loading: string;
    eyebrow: string;
    title: string;
    workspacePrefix: string;
    organizationMissing: string;
    total: string;
    highPriority: string;
    emailReady: string;
    activeNotifications: string;
    noActiveNotifications: string;
    emailPayloadsTitle: string;
    noEmailPayloads: string;
    dateUnavailable: string;
  };
  inbox: {
    loginRequired: string;
    loadInboxError: string;
    loadConversationError: string;
    updateConversationError: string;
    sendReplyError: string;
    loadSessionError: string;
    loading: string;
    eyebrow: string;
    title: string;
    description: string;
    allStatuses: string;
    open: string;
    waitingForHuman: string;
    closed: string;
    allSources: string;
    websiteWidget: string;
    internalWeb: string;
    noMessages: string;
    noConversations: string;
    anonymousVisitor: string;
    escalation: string;
    lead: string;
    score: string;
    humanTransfer: string;
    close: string;
    replyPlaceholder: string;
    send: string;
    selectConversation: string;
    dateUnavailable: string;
    senderCustomer: string;
    senderAi: string;
    senderHuman: string;
    senderSystem: string;
  };
}>;


export const onboardingCopy = {
  en: {
    authTitle: "Authentication required.",
    loginCta: "Go to login",
    organizationMissing: "No organization was found for this account.",
    validOrganizationRequired: "A valid organization session is required.",
    workspacePrefix: "Workspace",
    backToDashboard: "Back to dashboard",
    fallbackAnswer: "To be defined.",
    loginRequired: "Sign in before creating the business profile.",
    loadSessionError: "Could not load user session",
    loadBusinessDnaError: "Could not load business profile",
    saveBusinessDnaError: "Could not save business profile",
    loading: "Loading business profile...",
    saved: "Business profile saved. The AI receptionist will use it as context.",
    eyebrow: "Business profile",
    title: "Describe the company once.",
    summaryTitle: "Company summary",
    summaryPlaceholder: "What does the company do, who is it for and what makes it different?",
    productsTitle: "Products",
    productsHelper: "One per line: Product - description",
    productsPlaceholder: "Start Plan - For small teams getting started",
    servicesTitle: "Services",
    servicesHelper: "One per line: Service - description",
    servicesPlaceholder: "Implementation - Setup and launch support",
    rulesTitle: "Rules",
    rulesHelper: "One per line: Rule - explanation",
    rulesPlaceholder: "Refunds - Transfer refund requests to an operator",
    toneTitle: "Tone",
    toneHelper: "How should AI employees communicate?",
    tonePlaceholder: "Professional, warm, concise, safe.",
    faqTitle: "FAQ",
    faqHelper: "One per line: Question ? Answer",
    faqPlaceholder: "How fast do you reply? ? Usually within one business day.",
    objectivesTitle: "Objectives",
    objectivesHelper: "One per line: Objective | metric | target",
    objectivesPlaceholder: "Increase qualified leads | leads/month | 100",
    saving: "Saving...",
    save: "Save business profile",
  },
  ro: {
    authTitle: "Autentificare necesară.",
    loginCta: "Mergi la login",
    organizationMissing: "Nu a fost găsită nicio organizație pentru acest cont.",
    validOrganizationRequired: "Este necesară o sesiune validă de organizație.",
    workspacePrefix: "Spațiu de lucru",
    backToDashboard: "Înapoi la dashboard",
    fallbackAnswer: "De definit.",
    loginRequired: "Autentifică-te înainte să completezi profilul companiei.",
    loadSessionError: "Nu am putut încărca sesiunea utilizatorului",
    loadBusinessDnaError: "Nu am putut încărca profilul companiei",
    saveBusinessDnaError: "Nu am putut salva profilul companiei",
    loading: "Se încarcă profilul companiei...",
    saved: "Profilul companiei a fost salvat. Recepționerul AI îl va folosi ca informație de context.",
    eyebrow: "Profil companie",
    title: "Descrie compania o singură dată.",
    summaryTitle: "Rezumat companie",
    summaryPlaceholder: "Ce face compania, cui se adresează și ce o diferențiază?",
    productsTitle: "Produse",
    productsHelper: "Câte unul pe linie: Produs - descriere",
    productsPlaceholder: "Plan Start - Pentru echipe mici la început",
    servicesTitle: "Servicii",
    servicesHelper: "Câte unul pe linie: Serviciu - descriere",
    servicesPlaceholder: "Implementare - Setup și suport la pornire",
    rulesTitle: "Reguli",
    rulesHelper: "Câte una pe linie: Regulă - explicație",
    rulesPlaceholder: "Rambursări - Transferă cererile de rambursare către un operator",
    toneTitle: "Ton",
    toneHelper: "Cum ar trebui să comunice angajații AI?",
    tonePlaceholder: "Profesional, cald, concis, sigur.",
    faqTitle: "FAQ",
    faqHelper: "Câte una pe linie: Întrebare ? Răspuns",
    faqPlaceholder: "Cât de repede răspundeți? ? De obicei într-o zi lucrătoare.",
    objectivesTitle: "Obiective",
    objectivesHelper: "Câte unul pe linie: Obiectiv | metrică | țintă",
    objectivesPlaceholder: "Creștere leaduri calificate | leaduri/lună | 100",
    saving: "Se salvează...",
    save: "Salvează profilul companiei",
  },
} satisfies Record<AppLanguage, Record<string, string>>;
