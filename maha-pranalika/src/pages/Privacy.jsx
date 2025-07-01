import React from 'react';
import { useLanguage } from '../components/LanguageContext';
import '../styles/privacy.css';

export default function PrivacyPolicy() {
  const { lang, translations } = useLanguage();
  const content = translations[`privacy-${lang}`];

  if (!content) return <p>Loading...</p>;

  return (
    <div className="privacy">
    <div className="privacy-container">
      <h1 className="privacy-title">{content.title}</h1>
      <p className="privacy-description">{content.intro}</p>

      {/* Section 1 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section1Title}</h2>
        <ul className="privacy-list">
          {content.section1.map((item, idx) => (
            <li key={idx} className="privacy-list-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 2 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section2Title}</h2>
        <ul className="privacy-list">
          {content.section2.map((item, idx) => (
            <li key={idx} className="privacy-list-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 3 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section3Title}</h2>
        <p className="privacy-description">{content.section3}</p>
      </div>

      {/* Section 4 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section4Title}</h2>
        <p className="privacy-description">{content.section4}</p>
      </div>

      {/* Section 5 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section5Title}</h2>
        <p className="privacy-description">{content.section5}</p>
      </div>

      {/* Section 6 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section6Title}</h2>
        <ul className="privacy-list">
          {content.section6.map((item, idx) => (
            <li key={idx} className="privacy-list-item">{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 7 */}
      <div className="privacy-section">
        <h2 className="privacy-heading">{content.section7Title}</h2>
        <p className="privacy-description">{content.section7}</p>
      </div>

      {/* Section 8 */}
      <div className="privacy-contact">
        <h2 className="privacy-heading">{content.section8Title}</h2>
        <p><strong>{content.section8.emailLabel}:</strong> {content.section8.email}</p>
        <p><strong>{content.section8.phoneLabel}:</strong> {content.section8.phone}</p>
        <p><strong>{content.section8.addressLabel}:</strong> {content.section8.address}</p>
      </div>
    </div>
    </div>
  );
}
