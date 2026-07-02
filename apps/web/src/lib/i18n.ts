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
