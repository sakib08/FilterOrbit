import { createContext, useContext, useMemo } from "react";
import { resolveLanguageStrings } from "./defaults";

const LanguageContext = createContext(resolveLanguageStrings());

export function LanguageProvider({ strings, children }) {
  const value = useMemo(() => resolveLanguageStrings(strings), [strings]);
  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
