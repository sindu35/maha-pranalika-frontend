import React from 'react';
import { useLanguage } from '../components/LanguageContext';
import '../styles/terms.css';

export default function TermsAndGuidelines() {
  const { lang, translations } = useLanguage();
  const content = translations[`terms-${lang}`];

  return (
    <div className="terms-wrapper">
      <div className="terms-header">
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </div>

      <div className="terms-content">
        {content.terms.map((item, idx) => (
          <div key={idx} className="term-section">
            <h2>{item.heading}</h2>
            {item.description && <p>{item.description}</p>}
            {item.points && (
              <ul>
                {item.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="guidelines-section">
          <h2>{content.firmGuidelines.title}</h2>
          <hr className="guideline-separator" />
          <p>{content.firmGuidelines.intro}</p>
          <p className="note"><strong>Note:</strong> {content.firmGuidelines.note}</p>

          <h3>{content.firmGuidelines.stepTitle}</h3>
          <ul>
            {content.firmGuidelines.steps.map((step, idx) => (
              <li key={idx}>
                <strong>{step.label}:</strong> {step.description}
                {step.subpoints && (
                  <ul>
                    {step.subpoints.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <h3>{content.firmGuidelines.timelinesTitle}</h3>
          <ul>
            {content.firmGuidelines.timelines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>

          <h3>{content.firmGuidelines.assistanceTitle}</h3>
          <p>{content.firmGuidelines.assistanceText}</p>
          <p>{content.firmGuidelines.contactNote}</p>
        </div>
      </div>
    </div>
  );
}
