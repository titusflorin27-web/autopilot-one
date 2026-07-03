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
    return "ro";
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
    cookies: "Cookies",
    terms: "Terms",
    refunds: "Refunds",
    consumers: "Consumers",
    footerDescription: "AI platform for small businesses that want faster replies, better lead capture and a clear operational follow-up flow.",
    footerPilot: "Guided implementation. Setup, CRM Lite tracking and controlled validation before scaling AI conversations.",
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
    cookies: "Cookie-uri",
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
      currentPlanHelp: "This is your active package.",
      switchTo: "Switch to",
      limit: "Limit",
      remaining: "Remaining",
      overLimit: "The limit has been reached.",
      startCheckout: "Start checkout",
      requestPlan: "Request plan",
      manageBilling: "Manage billing",
      paymentProviderReady: "Stripe checkout is configured.",
      paymentProviderPending: "Stripe checkout is not configured yet.",
      checkoutUnavailable: "Checkout is not configured yet. Request a demo to activate this package.",
      checkoutError: "Could not start checkout",
      portalUnavailable: "Billing portal is available after a Stripe customer is linked.",
      portalError: "Could not open billing portal",
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
      readyForPilot: "Ready for implementation",
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
      currentPlanHelp: "Acesta este pachetul activ.",
      switchTo: "Schimbă la",
      limit: "Limită",
      remaining: "Rămas",
      overLimit: "Limita a fost atinsă.",
      startCheckout: "Pornește checkout",
      requestPlan: "Solicită planul",
      manageBilling: "Gestionează facturarea",
      paymentProviderReady: "Checkoutul Stripe este configurat.",
      paymentProviderPending: "Checkoutul Stripe nu este configurat încă.",
      checkoutUnavailable: "Checkoutul nu este configurat încă. Cere un demo pentru activarea acestui pachet.",
      checkoutError: "Nu am putut porni checkoutul",
      portalUnavailable: "Portalul de facturare este disponibil după legarea unui client Stripe.",
      portalError: "Nu am putut deschide portalul de facturare",
    },
    launch: {
      loginRequired: "Autentifică-te înainte să vezi checklistul de lansare.",
      loadChecklistError: "Nu am putut încărca checklistul de lansare",
      loadSessionError: "Nu am putut încărca sesiunea",
      loading: "Se încarcă checklistul de lansare...",
      eyebrow: "Lansare controlată",
      title: "Checklist de lansare MVP.",
      noChecklist: "Nu există checklist încărcat.",
      stepsComplete: "pași finalizați",
      progress: "Progres",
      readyForPilot: "Pregătit pentru implementare",
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
    currentPlanHelp: string;
    switchTo: string;
    limit: string;
    remaining: string;
    overLimit: string;
    startCheckout: string;
    requestPlan: string;
    manageBilling: string;
    paymentProviderReady: string;
    paymentProviderPending: string;
    checkoutUnavailable: string;
    checkoutError: string;
    portalUnavailable: string;
    portalError: string;
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


export const knowledgeBaseCopy = {
  en: {
    authTitle: "Authentication required.",
    loginCta: "Go to login",
    workspacePrefix: "Workspace",
    organizationMissing: "No organization was found for this account.",
    loginRequired: "Sign in before using Knowledge Base.",
    loadSourcesError: "Could not load knowledge sources",
    loadSessionError: "Could not load user session",
    loadKnowledgeBaseError: "Could not load Knowledge Base",
    indexTextError: "Could not index text source",
    indexWebsiteError: "Could not index website",
    uploadFileError: "Could not upload file",
    searchError: "Search failed",
    textIndexed: "Text source indexed.",
    websiteIndexed: "Website indexed.",
    fileIndexed: "File uploaded and indexed.",
    loading: "Loading Knowledge Base...",
    eyebrow: "Knowledge Base",
    title: "Train the AI receptionist with trusted sources.",
    description: "Add text, websites or files that the AI can cite and use when answering customers.",
    textSourceTitle: "Add text source",
    websiteSourceTitle: "Index website",
    fileSourceTitle: "Upload file",
    searchTitle: "Search knowledge",
    sourcesTitle: "Sources",
    resultsTitle: "Search results",
    titleLabel: "Title",
    contentLabel: "Content",
    urlLabel: "Website URL",
    fileLabel: "File",
    sourceTitlePlaceholder: "Pricing FAQ",
    contentPlaceholder: "Paste the trusted source content here...",
    websiteTitlePlaceholder: "Website pricing page",
    urlPlaceholder: "https://example.com/pricing",
    fileTitlePlaceholder: "Product guide",
    searchPlaceholder: "Search your indexed sources...",
    addTextButton: "Index text",
    addWebsiteButton: "Index website",
    uploadButton: "Upload and index",
    searchButton: "Search",
    saving: "Saving...",
    noSources: "No knowledge sources yet.",
    noResults: "No search results yet.",
    chunks: "chunks",
    status: "Status",
    created: "Created",
    score: "score",
    dateUnavailable: "Date unavailable",
  },
  ro: {
    authTitle: "Autentificare necesară.",
    loginCta: "Mergi la login",
    workspacePrefix: "Spațiu de lucru",
    organizationMissing: "Nu a fost găsită nicio organizație pentru acest cont.",
    loginRequired: "Autentifică-te înainte să folosești baza de cunoștințe.",
    loadSourcesError: "Nu am putut încărca sursele de cunoștințe",
    loadSessionError: "Nu am putut încărca sesiunea utilizatorului",
    loadKnowledgeBaseError: "Nu am putut încărca baza de cunoștințe",
    indexTextError: "Nu am putut indexa sursa text",
    indexWebsiteError: "Nu am putut indexa website-ul",
    uploadFileError: "Nu am putut încărca fișierul",
    searchError: "Căutarea a eșuat",
    textIndexed: "Sursa text a fost indexată.",
    websiteIndexed: "Website-ul a fost indexat.",
    fileIndexed: "Fișierul a fost încărcat și indexat.",
    loading: "Se încarcă baza de cunoștințe...",
    eyebrow: "Bază de cunoștințe",
    title: "Antrenează recepționerul AI cu surse verificate.",
    description: "Adaugă texte, website-uri sau fișiere pe care AI-ul le poate cita și folosi când răspunde clienților.",
    textSourceTitle: "Adaugă sursă text",
    websiteSourceTitle: "Indexează website",
    fileSourceTitle: "Încarcă fișier",
    searchTitle: "Caută în cunoștințe",
    sourcesTitle: "Surse",
    resultsTitle: "Rezultate căutare",
    titleLabel: "Titlu",
    contentLabel: "Conținut",
    urlLabel: "URL website",
    fileLabel: "Fișier",
    sourceTitlePlaceholder: "FAQ prețuri",
    contentPlaceholder: "Lipește aici conținutul sursei verificate...",
    websiteTitlePlaceholder: "Pagina de prețuri",
    urlPlaceholder: "https://exemplu.ro/preturi",
    fileTitlePlaceholder: "Ghid produs",
    searchPlaceholder: "Caută în sursele indexate...",
    addTextButton: "Indexează text",
    addWebsiteButton: "Indexează website",
    uploadButton: "Încarcă și indexează",
    searchButton: "Caută",
    saving: "Se salvează...",
    noSources: "Nu există surse de cunoștințe încă.",
    noResults: "Nu există rezultate de căutare încă.",
    chunks: "fragmente",
    status: "Status",
    created: "Creat",
    score: "scor",
    dateUnavailable: "Dată indisponibilă",
  },
} satisfies Record<AppLanguage, Record<string, string>>;


export const receptionAiCopy = {
  en: {
    authTitle: "Authentication required.",
    loginCta: "Go to login",
    workspacePrefix: "Workspace",
    organizationMissing: "No organization was found for this account.",
    loginRequired: "Sign in before using the AI Receptionist.",
    loadSummaryError: "Could not load operations summary",
    loadConversationsError: "Could not load conversations",
    loadTasksError: "Could not load tasks",
    loadLeadsError: "Could not load leads",
    loadSessionError: "Could not load user session",
    loadReceptionError: "Could not load AI Receptionist",
    aiReplyError: "The AI Receptionist could not reply",
    operationFailed: "Operation failed",
    updateConversationError: "Could not update conversation",
    updateTaskError: "Could not update task",
    updateLeadError: "Could not update lead",
    addHumanReplyError: "Could not add human reply",
    selectConversationBeforeReply: "Select a conversation before adding a human reply.",
    loading: "Loading AI Receptionist...",
    eyebrow: "AI Receptionist",
    title: "The AI Receptionist is connected to the model gateway.",
    waitingForHuman: "Waiting for human",
    openTasks: "Open tasks",
    lastAiMode: "Last AI mode",
    none: "None",
    fallback: "Fallback",
    simulateTitle: "Simulate customer message",
    customerNamePlaceholder: "Customer name",
    customerEmailPlaceholder: "Customer email",
    messagePlaceholder: "Example: I want pricing and a demo for my company next week.",
    thinking: "The AI Receptionist is thinking...",
    sendToAi: "Send to AI Receptionist",
    aiResponseTitle: "AI response",
    reply: "Reply",
    confidence: "Confidence",
    escalation: "Escalation",
    reason: "Reason",
    lead: "Lead",
    task: "Task",
    provider: "Provider",
    model: "Model",
    knowledgeScore: "Knowledge score",
    emptyAiResponse: "Send a message to test model-backed output or deterministic fallback.",
    conversationsTitle: "Conversations",
    messages: "messages",
    leadScore: "Lead score",
    score: "score",
    noConversations: "No conversations yet.",
    humanReplyTitle: "Human reply",
    selectedConversation: "Selected conversation",
    selectConversationFirst: "Select a conversation first.",
    humanReplyPlaceholder: "Write a human reply or handoff note.",
    internalNotePlaceholder: "Internal note, optional",
    addHumanReply: "Add human reply",
    tasksTitle: "Tasks",
    noTasks: "No tasks yet.",
    leadsTitle: "Leads",
    noLeads: "No leads yet.",
    open: "Open",
    humanTransfer: "Human transfer",
    close: "Close",
    done: "Done",
    cancel: "Cancel",
    qualify: "Qualify",
    won: "Won",
    lost: "Lost",
    yes: "yes",
    no: "no",
    statusOpen: "Open",
    statusWaitingForHuman: "Waiting for human",
    statusClosed: "Closed",
    statusDone: "Done",
    statusCancelled: "Cancelled",
    statusNew: "New",
    statusQualified: "Qualified",
    statusWon: "Won",
    statusLost: "Lost",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
  },
  ro: {
    authTitle: "Autentificare necesară.",
    loginCta: "Mergi la login",
    workspacePrefix: "Spațiu de lucru",
    organizationMissing: "Nu a fost găsită nicio organizație pentru acest cont.",
    loginRequired: "Autentifică-te înainte să folosești Recepționerul AI.",
    loadSummaryError: "Nu am putut încărca sumarul operațional",
    loadConversationsError: "Nu am putut încărca conversațiile",
    loadTasksError: "Nu am putut încărca sarcinile",
    loadLeadsError: "Nu am putut încărca leadurile",
    loadSessionError: "Nu am putut încărca sesiunea utilizatorului",
    loadReceptionError: "Nu am putut încărca Recepționerul AI",
    aiReplyError: "Recepționerul AI nu a putut răspunde",
    operationFailed: "Operațiunea a eșuat",
    updateConversationError: "Nu am putut actualiza conversația",
    updateTaskError: "Nu am putut actualiza sarcina",
    updateLeadError: "Nu am putut actualiza leadul",
    addHumanReplyError: "Nu am putut adăuga răspunsul uman",
    selectConversationBeforeReply: "Selectează o conversație înainte să adaugi un răspuns uman.",
    loading: "Se încarcă Recepționerul AI...",
    eyebrow: "Recepționer AI",
    title: "Recepționerul AI este conectat la gateway-ul de model.",
    waitingForHuman: "Așteaptă operator",
    openTasks: "Sarcini deschise",
    lastAiMode: "Ultimul mod AI",
    none: "Niciunul",
    fallback: "Fallback",
    simulateTitle: "Simulează mesaj client",
    customerNamePlaceholder: "Nume client",
    customerEmailPlaceholder: "Email client",
    messagePlaceholder: "Ex: vreau prețuri și un demo pentru compania mea săptămâna viitoare.",
    thinking: "Recepționerul AI gândește...",
    sendToAi: "Trimite către Recepționerul AI",
    aiResponseTitle: "Răspuns AI",
    reply: "Răspuns",
    confidence: "Încredere",
    escalation: "Escaladare",
    reason: "Motiv",
    lead: "Lead",
    task: "Sarcină",
    provider: "Provider",
    model: "Model",
    knowledgeScore: "Scor cunoștințe",
    emptyAiResponse: "Trimite un mesaj pentru a testa răspunsul prin model sau fallback determinist.",
    conversationsTitle: "Conversații",
    messages: "mesaje",
    leadScore: "Scor lead",
    score: "scor",
    noConversations: "Nu există conversații încă.",
    humanReplyTitle: "Răspuns uman",
    selectedConversation: "Conversație selectată",
    selectConversationFirst: "Selectează mai întâi o conversație.",
    humanReplyPlaceholder: "Scrie un răspuns uman sau o notă de transfer.",
    internalNotePlaceholder: "Notă internă, opțional",
    addHumanReply: "Adaugă răspuns uman",
    tasksTitle: "Sarcini",
    noTasks: "Nu există sarcini încă.",
    leadsTitle: "Leaduri",
    noLeads: "Nu există leaduri încă.",
    open: "Deschide",
    humanTransfer: "Transfer uman",
    close: "Închide",
    done: "Finalizează",
    cancel: "Anulează",
    qualify: "Califică",
    won: "Câștigat",
    lost: "Pierdut",
    yes: "da",
    no: "nu",
    statusOpen: "Deschis",
    statusWaitingForHuman: "Așteaptă operator",
    statusClosed: "Închis",
    statusDone: "Finalizat",
    statusCancelled: "Anulat",
    statusNew: "Nou",
    statusQualified: "Calificat",
    statusWon: "Câștigat",
    statusLost: "Pierdut",
    priorityLow: "Scăzută",
    priorityMedium: "Medie",
    priorityHigh: "Ridicată",
  },
} satisfies Record<AppLanguage, Record<string, string>>;


export const widgetPagesCopy = {
  en: {
    demo: {
      widgetTitle: "AI Receptionist",
      messageRequired: "Message is required.",
      replyError: "The AI Receptionist could not reply.",
      eyebrow: "Widget demo",
      title: "Install the AI Receptionist on any website.",
      description: "This page shows the public endpoint and the real script for the floating website widget.",
      configurationTitle: "Widget configuration",
      organizationSlugPlaceholder: "Organization slug",
      customerNamePlaceholder: "Customer name",
      customerEmailPlaceholder: "Customer email",
      widgetTokenPlaceholder: "Widget token required when token protection is active",
      visitorId: "Visitor ID",
      creating: "creating...",
      installHint: "Paste the snippet below before the closing body tag on the customer's website.",
      fallbackMode: "Fallback mode",
      publicIntake: "Public intake",
      emptyChat: "Ask about services, pricing, bookings or support.",
      messagePlaceholder: "Write your message...",
      send: "Send",
      confidence: "Confidence",
      escalation: "Escalation",
      conversation: "Conversation",
      limit: "Limit",
      yes: "yes",
      no: "no",
      snippetTitle: "Installation snippet",
      snippetDescription: "Copy this snippet into the target website.",
      publicApiTitle: "Public API contract",
      sampleConversationId: "Optional follow-up conversation ID",
      sampleVisitorId: "Stable anonymous visitor ID",
      sampleCustomerName: "Optional customer name",
      sampleCustomerEmail: "Optional customer email",
      sampleWidgetToken: "Required when token protection is active",
    },
    settings: {
      authTitle: "Authentication required.",
      loginCta: "Go to login",
      loginRequired: "Sign in before managing widget settings.",
      loadSettingsError: "Could not load widget settings",
      loadSessionError: "Could not load user session",
      saveSettingsError: "Could not save widget settings",
      regenerateTokenError: "Could not regenerate widget token",
      organizationMissing: "No organization was found for this account.",
      saved: "Widget settings were saved.",
      tokenRegenerated: "The widget token was regenerated. Copy the installation snippet again.",
      snippetCopied: "The installation snippet was copied. It contains the real token, even if the screen shows a masked value.",
      loading: "Loading widget settings...",
      eyebrow: "Widget settings",
      title: "Control the widget installation.",
      workspacePrefix: "Workspace",
      noSettings: "No settings loaded.",
      settingsTitle: "Widget settings",
      enableWidget: "Enable widget",
      widgetTitleLabel: "Widget title",
      widgetTitlePlaceholder: "Widget title",
      primaryColorLabel: "Primary color",
      positionLabel: "Widget position",
      positionRight: "Right",
      positionLeft: "Left",
      widgetTokenLabel: "Widget token",
      widgetTokenPlaceholder: "Widget token",
      currentToken: "Current token",
      allowedOriginsLabel: "Allowed domains",
      saving: "Saving...",
      save: "Save settings",
      regenerateToken: "Regenerate token",
      productionInstallTitle: "Production installation",
      productionInstallDescription: "The widget loads the live configuration before rendering.",
      maskedTokenHelper: "The token is masked for safety. The copied snippet contains the real token.",
      publicConfig: "Public configuration",
      copySnippet: "Copy snippet",
    },
    analytics: {
      authTitle: "Authentication required.",
      loginCta: "Go to login",
      loginRequired: "Sign in before viewing widget analytics.",
      loadAnalyticsError: "Could not load widget analytics",
      loadSessionError: "Could not load user session",
      loading: "Loading widget analytics...",
      eyebrow: "Widget analytics",
      title: "Widget installation health.",
      workspacePrefix: "Workspace",
      organizationMissing: "No organization was found for this account.",
      configLoaded: "Config loaded",
      widgetOpened: "Widget opened",
      messagesSent: "Messages sent",
      publicConversations: "Public conversations",
      publicLeads: "Public leads",
      followUpTasks: "Follow-up tasks",
      eventCounts: "Event counts",
      domains: "Domains",
      events: "events",
      noDomains: "No domains detected yet.",
      recentEvents: "Recent widget events",
      origin: "Origin",
      visitor: "Visitor",
      conversation: "Conversation",
      noRecentEvents: "No widget events yet.",
      yes: "Yes",
      no: "No",
      dateUnavailable: "Date unavailable",
    },
  },
  ro: {
    demo: {
      widgetTitle: "Recepționer AI",
      messageRequired: "Mesajul este obligatoriu.",
      replyError: "Recepționerul AI nu a putut răspunde.",
      eyebrow: "Demo widget",
      title: "Instalează Recepționerul AI pe orice website.",
      description: "Această pagină arată endpointul public și scriptul real pentru widgetul flotant de website.",
      configurationTitle: "Configurare widget",
      organizationSlugPlaceholder: "Slug organizație",
      customerNamePlaceholder: "Nume client",
      customerEmailPlaceholder: "Email client",
      widgetTokenPlaceholder: "Jeton widget necesar când protecția cu jeton este activă",
      visitorId: "ID vizitator",
      creating: "se creează...",
      installHint: "Lipește fragmentul de mai jos înainte de tagul de închidere body pe website-ul clientului.",
      fallbackMode: "Mod fallback",
      publicIntake: "Captare publică",
      emptyChat: "Întreabă despre servicii, prețuri, programări sau suport.",
      messagePlaceholder: "Scrie mesajul...",
      send: "Trimite",
      confidence: "Încredere",
      escalation: "Escaladare",
      conversation: "Conversație",
      limit: "Limită",
      yes: "da",
      no: "nu",
      snippetTitle: "Fragment de instalare",
      snippetDescription: "Copiază acest fragment în website-ul țintă.",
      publicApiTitle: "Contract API public",
      sampleConversationId: "ID opțional pentru conversația de follow-up",
      sampleVisitorId: "ID stabil pentru vizitator anonim",
      sampleCustomerName: "Nume client opțional",
      sampleCustomerEmail: "Email client opțional",
      sampleWidgetToken: "Necesar când protecția cu jeton este activă",
    },
    settings: {
      authTitle: "Autentificare necesară.",
      loginCta: "Mergi la login",
      loginRequired: "Autentifică-te înainte să gestionezi setările widgetului.",
      loadSettingsError: "Nu am putut încărca setările widgetului",
      loadSessionError: "Nu am putut încărca sesiunea utilizatorului",
      saveSettingsError: "Nu am putut salva setările widgetului",
      regenerateTokenError: "Nu am putut regenera jetonul",
      organizationMissing: "Nu există organizație pentru acest cont.",
      saved: "Setările widgetului au fost salvate.",
      tokenRegenerated: "Jetonul widgetului a fost regenerat. Copiază din nou fragmentul de instalare.",
      snippetCopied: "Fragmentul de instalare a fost copiat. Conține jetonul real, chiar dacă pe ecran este mascat.",
      loading: "Se încarcă setările widgetului...",
      eyebrow: "Setări widget",
      title: "Controlează instalarea widgetului.",
      workspacePrefix: "Spațiu de lucru",
      noSettings: "Nu există setări încărcate.",
      settingsTitle: "Setări widget",
      enableWidget: "Activează widgetul",
      widgetTitleLabel: "Titlu widget",
      widgetTitlePlaceholder: "Titlu widget",
      primaryColorLabel: "Culoare principală",
      positionLabel: "Poziție widget",
      positionRight: "Dreapta",
      positionLeft: "Stânga",
      widgetTokenLabel: "Jeton widget",
      widgetTokenPlaceholder: "Jeton widget",
      currentToken: "Jeton curent",
      allowedOriginsLabel: "Domenii permise",
      saving: "Se salvează...",
      save: "Salvează setările",
      regenerateToken: "Regenerează jetonul",
      productionInstallTitle: "Instalare în producție",
      productionInstallDescription: "Widgetul încarcă configurația live înainte de randare.",
      maskedTokenHelper: "Jetonul este mascat pentru siguranță. Fragmentul copiat conține jetonul real.",
      publicConfig: "Configurație publică",
      copySnippet: "Copiază fragmentul",
    },
    analytics: {
      authTitle: "Autentificare necesară.",
      loginCta: "Mergi la login",
      loginRequired: "Autentifică-te înainte să vezi analiticele widgetului.",
      loadAnalyticsError: "Nu am putut încărca analiticele widgetului",
      loadSessionError: "Nu am putut încărca sesiunea utilizatorului",
      loading: "Se încarcă analiticele widgetului...",
      eyebrow: "Analitice widget",
      title: "Starea instalării widgetului.",
      workspacePrefix: "Spațiu de lucru",
      organizationMissing: "Nu a fost găsită nicio organizație.",
      configLoaded: "Config încărcată",
      widgetOpened: "Widget deschis",
      messagesSent: "Mesaje trimise",
      publicConversations: "Conversații publice",
      publicLeads: "Leaduri publice",
      followUpTasks: "Sarcini follow-up",
      eventCounts: "Număr evenimente",
      domains: "Domenii",
      events: "evenimente",
      noDomains: "Nu există domenii detectate încă.",
      recentEvents: "Evenimente recente widget",
      origin: "Origine",
      visitor: "Vizitator",
      conversation: "Conversație",
      noRecentEvents: "Nu există evenimente widget încă.",
      yes: "Da",
      no: "Nu",
      dateUnavailable: "Dată indisponibilă",
    },
  },
} satisfies Record<AppLanguage, {
  demo: Record<string, string>;
  settings: Record<string, string>;
  analytics: Record<string, string>;
}>;


export const packagePricingCopy = {
  en: {
    heroEyebrow: "Pricing",
    heroTitlePrefix: "Clear packages for",
    heroTitleHighlight: "your first AI employee.",
    heroDescription: "Start with a measurable implementation, track usage from the dashboard and move to paid checkout only after the payment provider is connected.",
    requestDemo: "Request demo",
    viewTerms: "View terms",
    badges: ["Demo without card", "Guided setup", "Checkout-ready packages"],
    recommended: "Recommended",
    monthly: "/month",
    discussPlan: "Discuss this plan",
    requestPlan: "Request plan",
    included: "Included",
    planSectionTitle: "Available packages",
    billingNoticeEyebrow: "Payment readiness",
    billingNoticeTitle: "Online payments are being prepared.",
    billingNoticeDescription: "Plan switching is intentionally routed through demo/contact until checkout, subscription status and webhooks are connected.",
    billingNoticeCta: "Discuss billing setup",
    principles: [
      { title: "No surprises", description: "The commercial plan is confirmed before activation or payment collection." },
      { title: "Measured implementation", description: "Conversations, leads, usage and follow-up work are tracked in one operational workspace." },
      { title: "Safe rollout", description: "Checkout and subscriptions will be added through a controlled payment provider integration." },
    ],
    ctaEyebrow: "Not sure which package fits?",
    ctaTitle: "Start with the package that proves value fastest.",
    ctaDescription: "Send a demo request and we will decide whether your first use case should be AI reception, lead capture or conversation follow-up.",
    ctaButton: "Request recommendation",
    plans: [
      {
        plan: "FREE",
        name: "Free",
        price: "0 €",
        period: "/month",
        note: "For validation and initial configuration.",
        features: ["100 widget messages / period", "5 knowledge sources", "1 team member", "Basic AI receptionist flow", "No-card validation"],
      },
      {
        plan: "STARTER",
        name: "Starter",
        price: "49 €",
        period: "/month",
        note: "For the first real website flow.",
        features: ["1,000 widget messages / period", "50 knowledge sources", "3 team members", "Website widget and lead capture", "Guided setup for launch"],
      },
      {
        plan: "PRO",
        name: "Pro",
        price: "99 €",
        period: "/month",
        featured: true,
        note: "For active teams that need higher volume and follow-up.",
        features: ["10,000 widget messages / period", "500 knowledge sources", "10 team members", "Inbox, analytics and handoff workflow", "Operational dashboard for implementation"],
      },
      {
        plan: "BUSINESS",
        name: "Business",
        price: "Custom",
        period: "",
        note: "For higher volume, dedicated rollout or custom operations.",
        features: ["50,000 widget messages / period", "2,000 knowledge sources", "50 team members", "Custom onboarding and operating model", "Commercial terms agreed separately"],
      },
    ],
  },
  ro: {
    heroEyebrow: "Prețuri",
    heroTitlePrefix: "Pachete clare pentru",
    heroTitleHighlight: "primul tău angajat AI.",
    heroDescription: "Începe cu o implementare măsurabilă, urmărește utilizarea în dashboard și treci la plata online doar după ce providerul de plăți este conectat.",
    requestDemo: "Cere demo",
    viewTerms: "Vezi termenii",
    badges: ["Demo fără card", "Setup ghidat", "Pachete pregătite pentru checkout"],
    recommended: "Recomandat",
    monthly: "/lună",
    discussPlan: "Discută planul",
    requestPlan: "Solicită planul",
    included: "Inclus",
    planSectionTitle: "Pachete disponibile",
    billingNoticeEyebrow: "Pregătire plăți",
    billingNoticeTitle: "Plățile online sunt în pregătire.",
    billingNoticeDescription: "Schimbarea planului este direcționată intenționat prin demo/contact până când checkoutul, statusul abonamentului și webhookurile sunt conectate.",
    billingNoticeCta: "Discută configurarea facturării",
    principles: [
      { title: "Fără surprize", description: "Planul comercial este confirmat înainte de activare sau colectarea plății." },
      { title: "Implementare măsurabilă", description: "Conversațiile, leadurile, utilizarea și follow-up-ul sunt urmărite înainte de scalare." },
      { title: "Lansare sigură", description: "Checkoutul și abonamentele vor fi adăugate printr-o integrare controlată cu providerul de plăți." },
    ],
    ctaEyebrow: "Nu știi ce pachet ți se potrivește?",
    ctaTitle: "Începem cu pachetul care dovedește valoare cel mai rapid.",
    ctaDescription: "Trimite o cerere demo și stabilim împreună dacă primul caz de utilizare ar trebui să fie recepția AI, captarea leadurilor sau urmărirea conversațiilor.",
    ctaButton: "Cere recomandare",
    plans: [
      {
        plan: "FREE",
        name: "Free",
        price: "0 €",
        period: "/lună",
        note: "Pentru validare și configurarea inițială.",
        features: ["100 mesaje widget / perioadă", "5 surse de cunoștințe", "1 membru echipă", "Flux de bază pentru recepționerul AI", "Validare fără card"],
      },
      {
        plan: "STARTER",
        name: "Starter",
        price: "49 €",
        period: "/lună",
        note: "Pentru primul flux real pe website.",
        features: ["1.000 mesaje widget / perioadă", "50 surse de cunoștințe", "3 membri echipă", "Widget pe website și captare leaduri", "Setup ghidat pentru lansare"],
      },
      {
        plan: "PRO",
        name: "Pro",
        price: "99 €",
        period: "/lună",
        featured: true,
        note: "Pentru echipe active care au nevoie de volum și follow-up.",
        features: ["10.000 mesaje widget / perioadă", "500 surse de cunoștințe", "10 membri echipă", "Inbox, analytics și flux de transfer uman", "Dashboard operațional pentru implementare"],
      },
      {
        plan: "BUSINESS",
        name: "Business",
        price: "Personalizat",
        period: "",
        note: "Pentru volum mare, lansare dedicată sau operațiuni custom.",
        features: ["50.000 mesaje widget / perioadă", "2.000 surse de cunoștințe", "50 membri echipă", "Onboarding și model operațional custom", "Condiții comerciale stabilite separat"],
      },
    ],
  },
} satisfies Record<AppLanguage, {
  heroEyebrow: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroDescription: string;
  requestDemo: string;
  viewTerms: string;
  badges: string[];
  recommended: string;
  monthly: string;
  discussPlan: string;
  requestPlan: string;
  included: string;
  planSectionTitle: string;
  billingNoticeEyebrow: string;
  billingNoticeTitle: string;
  billingNoticeDescription: string;
  billingNoticeCta: string;
  principles: Array<{ title: string; description: string }>;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  plans: Array<{
    plan: "FREE" | "STARTER" | "PRO" | "BUSINESS";
    name: string;
    price: string;
    period: string;
    note: string;
    featured?: boolean;
    features: string[];
  }>;
}>;
