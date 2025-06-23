// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useLanguage } from './LanguageContext';


export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const handleChange = (e) => {
    const selected = e.target.value;
    if (selected === 'en') setLang('english');
    else if (selected === 'te') setLang('telugu');
  };

  return (
    <select
      onChange={handleChange}
      value={lang === 'telugu' ? 'te' : 'en'}
      style={{ float: 'right' }}
    >
      <option value="en">English (IN)</option>
      <option value="te">తెలుగు (IN)</option>
    </select>
  );
}
