// src/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import languageData from '../../language.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('english');
  const [translations, setTranslations] = useState(languageData['nav-english']);

  useEffect(() => {
    const newTranslations = languageData[`nav-${lang}`] || {};
    setTranslations(newTranslations);

  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
