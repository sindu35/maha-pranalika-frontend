// src/components/LanguageSwitcher.jsx
import React from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const handleChange = (e) => {
    const selected = e.target.value;
    if (selected === "en") setLang("english");
    else if (selected === "te") setLang("telugu");
  };

  return (
    <select
      onChange={handleChange}
      value={lang === "telugu" ? "te" : "en"}
      style={{
        backgroundColor: "#2d2a8e",
        color: "white",
        border: "1px solid white",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <option value="en">English (IN)</option>
      <option value="te">తెలుగు (IN)</option>
    </select>
  );
}
