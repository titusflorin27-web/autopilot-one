export type AppLanguage = "ro" | "en";

export function detectBrowserLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "ro";
  }

  const browserLanguages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  const primaryLanguage = browserLanguages.find(Boolean)?.toLowerCase() ?? "";

  return "ro";
}

export const authCopy = {
  en: {
    login: {
      eyebrow: "Secure access",
      title: "Login",
      subtitle: "Use your owner or team account to access the command center.",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      submitting: "Signing in...",
      submit: "Continue",
      error: "Login failed",
      switchPrefix: "New to Autopilot One?",
      switchLink: "Create an account",
    },
    register: {
      eyebrow: "Workspace setup",
      title: "Create account",
      subtitle: "Create the owner account and first organization workspace.",
      emailPlaceholder: "Work email",
      passwordPlaceholder: "Password",
      firstNamePlaceholder: "First name",
      lastNamePlaceholder: "Last name",
      organizationNamePlaceholder: "Company name",
      organizationSlugPlaceholder: "company-slug",
      submitting: "Creating...",
      submit: "Create workspace",
      error: "Registration failed",
    },
  },
  ro: {
    login: {
      eyebrow: "Acces securizat",
      title: "Intră în cont",
      subtitle: "Folosește contul de owner sau de membru al echipei pentru a accesa centrul de comandă.",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Parolă",
      submitting: "Se conectează...",
      submit: "Continuă",
      error: "Autentificarea a eșuat",
      switchPrefix: "Nou pe Autopilot One?",
      switchLink: "Creează cont",
    },
    register: {
      eyebrow: "Configurare workspace",
      title: "Creează cont",
      subtitle: "Creează contul de owner și primul spațiu de lucru pentru compania ta.",
      emailPlaceholder: "Email de lucru",
      passwordPlaceholder: "Parolă",
      firstNamePlaceholder: "Prenume",
      lastNamePlaceholder: "Nume",
      organizationNamePlaceholder: "Numele companiei",
      organizationSlugPlaceholder: "slug-companie",
      submitting: "Se creează...",
      submit: "Creează workspace",
      error: "Crearea contului a eșuat",
    },
  },
} as const;
