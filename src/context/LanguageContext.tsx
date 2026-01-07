"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en, pt } from '@/translations';
import { translateText } from '@/lib/utils';

type Language = 'en' | 'pt';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dt: (text: string) => Promise<string>; // Dynamic Translate function
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from local storage
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = language === 'en' ? en : pt;

  // Dynamic translate helper
  const dt = useCallback(async (text: string) => {
    if (language === 'en' || !text) return text;
    return await translateText(text, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dt }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
