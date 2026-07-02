"use client";

import { useEffect, useState } from "react";
import { type AppLanguage, detectBrowserLanguage, subscribeToLanguageChanges } from "./i18n";

export function useAppLanguage() {
  const [language, setLanguage] = useState<AppLanguage>("ro");

  useEffect(() => {
    setLanguage(detectBrowserLanguage());
    return subscribeToLanguageChanges(setLanguage);
  }, []);

  return language;
}
