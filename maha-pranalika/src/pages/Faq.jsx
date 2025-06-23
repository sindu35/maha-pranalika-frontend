import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext'; // Import the hook

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { lang, translations } = useLanguage(); // Get selected language context

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  // Access the correct FAQ list based on selected language
  const faqList = translations[`faq-${lang}`] || [];

  return (
    <div
      className="faqq"
      style={{
        border: '2px solid #ccc',
        padding: '30px',
        maxWidth: '900px',
        margin: '50px auto',
        borderRadius: '12px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '36px',
          marginBottom: '10px',
          color: '#2c3e50'
        }}
      >
        {lang === 'telugu' ? 'తరచుగా అడిగే ప్రశ్నలు ' : 'Frequently Asked Questions (FAQs)'}
      </h1>

      {faqList.map((item, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div
            onClick={() => toggleAnswer(index)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#e9eff2',
              padding: '15px 20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Segoe UI'
            }}
          >
            <span>{item.question}</span>
            <span style={{ fontSize: '20px' }}>
              {activeIndex === index ? '−' : '+'}
            </span>
          </div>

          {activeIndex === index && (
            <div
              style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderTop: 'none',
                padding: '15px 20px',
                borderRadius: '0 0 8px 8px'
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
