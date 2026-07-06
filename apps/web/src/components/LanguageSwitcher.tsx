"use client";

import { useEffect, useState } from "react";
import {
  type AppLanguage,
  detectBrowserLanguage,
  languageLabels,
  setPreferredLanguage,
  subscribeToLanguageChanges,
} from "../lib/i18n";

const switcherAria: Record<AppLanguage, string> = {
  ro: "Selector de limbă",
  en: "Language selector",
};

function applyDocumentLanguage(language: AppLanguage) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language;
}

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<AppLanguage>("ro");

  useEffect(() => {
    const detectedLanguage = detectBrowserLanguage();
    setLanguage(detectedLanguage);
    applyDocumentLanguage(detectedLanguage);

    return subscribeToLanguageChanges((nextLanguage) => {
      setLanguage(nextLanguage);
      applyDocumentLanguage(nextLanguage);
    });
  }, []);

  function changeLanguage(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    applyDocumentLanguage(nextLanguage);
    setPreferredLanguage(nextLanguage);
  }

  return (
    <div className="language-switcher" aria-label={switcherAria[language]}>
      <button
        className={language === "ro" ? "active" : undefined}
        type="button"
        onClick={() => changeLanguage("ro")}
        aria-pressed={language === "ro"}
        title={languageLabels.ro}
      >
        RO
      </button>
      <button
        className={language === "en" ? "active" : undefined}
        type="button"
        onClick={() => changeLanguage("en")}
        aria-pressed={language === "en"}
        title={languageLabels.en}
      >
        EN
      </button>
    </div>
  );
}
