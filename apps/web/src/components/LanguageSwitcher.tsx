"use client";

import { useEffect, useState } from "react";
import {
  type AppLanguage,
  detectBrowserLanguage,
  languageLabels,
  setPreferredLanguage,
  subscribeToLanguageChanges,
} from "../lib/i18n";

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<AppLanguage>("en");

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
    return subscribeToLanguageChanges(setLanguage);
  }, []);

  function changeLanguage(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    setPreferredLanguage(nextLanguage);
  }

  return (
    <div className="language-switcher" aria-label="Language selector">
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
