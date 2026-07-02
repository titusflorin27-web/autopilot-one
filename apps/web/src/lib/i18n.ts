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
    loginEyebrow: "Secure access",
    loginTitle: "Login",
    loginBody: "Use your owner or team member account to access the command center.",
    emailPlaceholder: "Work email",
    passwordPlaceholder: "Password",
    loginButton: "Continue",
    loginLoading: "Signing in...",
    switchPrefix: "New to Autopilot One?",
    switchLink: "Create an account",
    registerEyebrow: "Workspace setup",
    registerTitle: "Create account",
    registerBody: "Create the owner account and first workspace for your company.",
    firstNamePlaceholder: "First name",
    lastNamePlaceholder: "Last name",
    organizationNamePlaceholder: "Company name",
    organizationSlugPlaceholder: "company-slug",
    registerButton: "Create workspace",
    registerLoading: "Creating workspace...",
  },
  ro: {
    loginEyebrow: "Acces securizat",
    loginTitle: "Intră în cont",
    loginBody: "Folosește contul de owner sau de membru al echipei pentru a accesa centrul de comandă.",
    emailPlaceholder: "Email de lucru",
    passwordPlaceholder: "Parolă",
    loginButton: "Continuă",
    loginLoading: "Se conectează...",
    switchPrefix: "Nou pe Autopilot One?",
    switchLink: "Creează cont",
    registerEyebrow: "Configurare workspace",
    registerTitle: "Creează cont",
    registerBody: "Creează contul de owner și primul spațiu de lucru pentru compania ta.",
    firstNamePlaceholder: "Prenume",
    lastNamePlaceholder: "Nume",
    organizationNamePlaceholder: "Numele companiei",
    organizationSlugPlaceholder: "slug-companie",
    registerButton: "Creează workspace",
    registerLoading: "Se creează workspace-ul...",
  },
} satisfies Record<AppLanguage, Record<string, string>>;

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
