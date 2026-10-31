import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lang, translations, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: (key) => translations.en[key],
  toggleLang: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: TranslationKey): string => translations[lang][key];
  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
