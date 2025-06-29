import React, { useEffect, useRef, useState } from 'react';
import '../styles/home.css';
import firmImage from '../assets/firm.jpg';
import msmeImage from '../assets/MSME.jpg';
import cibilImage from '../assets/cibil.jpg';
import visaImage from '../assets/visa.jpg';
import { FaPaperPlane, FaDesktop, FaFlag } from 'react-icons/fa';
import CurvedArrow from '../components/CurvedArrow';
import { useLanguage } from '../components/LanguageContext';

export default function Home() {
  const { lang, translations } = useLanguage();
  const content = translations[`home-${lang}`];
 console.log("trans:",translations['home-english']);

  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const [showMission, setShowMission] = useState(false);
  const [showVision, setShowVision] = useState(false);

  const iconComponents = [<FaPaperPlane />, <FaDesktop />, <FaFlag />, <FaFlag />];
  const serviceImages = [firmImage, msmeImage, cibilImage, visaImage];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target === missionRef.current && entry.isIntersecting) {
            setShowMission(true);
          }
          if (entry.target === visionRef.current && entry.isIntersecting) {
            setShowVision(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (missionRef.current) observer.observe(missionRef.current);
    if (visionRef.current) observer.observe(visionRef.current);

    return () => {
      if (missionRef.current) observer.unobserve(missionRef.current);
      if (visionRef.current) observer.unobserve(visionRef.current);
    };
  }, []);

  return (
    <>
      <div className="home-banner">
        <div className="home-content">
          <h1 className="home-heading1">{content.bannerHeading1}</h1>
          <h1 className="home-heading2">{content.bannerHeading2}</h1>
        </div>
      </div>

      <div>
        <h1 className="home-company">{content.companyName}</h1>
      </div>

      <div className="mission-vision">
        <div
          ref={missionRef}
          className={`mission scroll-fade ${showMission ? 'visible' : ''}`}
        >
          <h1>{content.missionTitle}</h1>
          <p>{content.missionText}</p>
        </div>
        <div
          ref={visionRef}
          className={`vision scroll-fade ${showVision ? 'visible' : ''}`}
        >
          <h1>{content.visionTitle}</h1>
          <p>{content.visionText}</p>
        </div>
      </div>

      <div className="para">{content.introText}</div>

      <div className="blue-banner">
        <h2>{content.blueBanner}</h2>
      </div>

      <div className="envisions">{content.envisions}</div>

      <div className="services-section">
        {content.services.map((service, index) => (
          <div key={index} className="service-card">
            <h3>{service.title}</h3>
            <img src={serviceImages[index]} alt={service.title} />
            <p>{service.description}</p>
          </div>
        ))}
      </div>

      <div className="team-section">
        <h2>Our Team</h2>
        <div className="team-members">
          {content.team.map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-photo" />
              <h3>{member.name}</h3>
              <p>{member.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="why-choose-us">
        <h1>{content.whyChooseUs}</h1>
        <div className="features-section">
          {content.features.map((feature, index) => (
            <div className="feature-box" key={index}>
              <div className="icon-left">{iconComponents[index]}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-it-works">
        <h1>{content.howItWorks}</h1>
        <div className="steps-row">
          {content.steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step">
                <div className="circle">{index + 1}</div>
                <p>{step}</p>
              </div>
              {index < content.steps.length - 1 && (
                <div className={`arrow-wrapper ${index % 2 === 0 ? 'up' : 'down'}`}>
                  <CurvedArrow direction={index % 2 === 0 ? 'up' : 'down'} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
