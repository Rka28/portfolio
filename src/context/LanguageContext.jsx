import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '../translations/en';
import esTranslations from '../translations/es';
import frTranslations from '../translations/fr';

// Create the language context
const LanguageContext = createContext();

// Available languages
const languages = {
  en: {
    code: 'en',
    name: 'English',
    translations: enTranslations,
  },
  es: {
    code: 'es',
    name: 'Español',
    translations: esTranslations,
  },
  fr: {
    code: 'fr',
    name: 'Français',
    translations: frTranslations,
  },
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Try to get the language from localStorage, default to English
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'en';
  });
  
  // State to track if language selection has been made
  const [languageSelected, setLanguageSelected] = useState(() => {
    return localStorage.getItem('languageSelected') === 'true';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to change the language
  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setLanguage(langCode);
      setLanguageSelected(true);
      localStorage.setItem('languageSelected', 'true');
      
      // Dispatch a custom event to notify App component
      const event = new Event('languageSelected');
      window.dispatchEvent(event);
    }
  };

  // Get translation function
  const t = (key) => {
    const keys = key.split('.');
    let translation = languages[language].translations;
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languages,
        changeLanguage,
        t,
        languageSelected,
        setLanguageSelected,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};