import type React from "react";
import { createContext, useContext, useState } from "react";
import type { Language } from "../backend.d";
import { getTranslations } from "./translations";
import type { Translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "English" as Language,
  setLanguage: () => {},
  t: getTranslations("English"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    "English" as Language,
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = getTranslations(language as string);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
