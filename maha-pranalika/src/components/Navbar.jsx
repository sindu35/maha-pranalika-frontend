import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import './Navbar.css';
import { useLanguage } from './LanguageContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="nav-bar">
      <img src={logo} alt="logo" style={{ width: '4%' }} />
      <div className="nav">
        <ul className="navbar-menu">
          <li><span onClick={() => goTo("/")}>{translations.home}</span></li>

          <li className="dropdown">
            <span>{translations.services} ▾</span>
            <ul className="dropdown-content">
            <li><span onClick={() => goTo("/services/firm-registration")}>{translations.servicesList?.firm}</span></li>
            <li><span onClick={() => goTo("/services/cibil-repair")}>{translations.servicesList?.cibilRepair}</span></li>
            <li><span onClick={() => goTo("/services/cibil-training")}>{translations.servicesList?.cibilTraining}</span></li>
            <li><span onClick={() => goTo("/services/visa")}>{translations.servicesList?.visa}</span></li>

            </ul>
          </li>

          <li><span onClick={() => goTo("/signup")}>{translations.signup}</span></li>
          <li><span onClick={() => goTo("/privacy-policy")}>{translations.privacy}</span></li>
          <li><span onClick={() => goTo("/faq")}>{translations.faq}</span></li>
          <li><span onClick={() => goTo("/terms&conditions")}>{translations.terms}</span></li>
        </ul>
      </div>
    </div>
  );
}
