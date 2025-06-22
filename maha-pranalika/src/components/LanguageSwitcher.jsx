// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { setLang } = useLanguage();

  const changeLanguage = (value) => {
    setLang(value === 'te' ? 'telugu' : 'english');
  };

  return (
    <select onChange={(e) => changeLanguage(e.target.value)} style={{ float: 'right' }}>
      <option value="en">English (IN)</option>
      <option value="te">తెలుగు (IN)</option>
      <p>lang:{setLang}</p>
    </select>
  );
}
