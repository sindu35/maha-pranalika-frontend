import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [isLogin, setIsLogin] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goTo = (path) => {
    setShowMobileMenu(false);
    setShowMobileDropdown(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    goTo("/");
  };

  if (isMobile) {
    // MOBILE NAVBAR
    return (
      <div className="mobile-nav">
        <div className="nav-header-container">
          <div className="logo-container" onClick={() => goTo("/")}>
            <img src={logo} alt="logo" />
            <span className="logo-text">{translations.logotext}</span>
          </div>
          <button className="menu-button" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            ☰
          </button>
        </div>

        {showMobileMenu &&  (
          <div className="mobile-menu">
            <ul>
              <li onClick={() => goTo("/")}>{translations.home}</li>

              <li onClick={() => setShowMobileDropdown((prev) => !prev)}>
                {translations.services} ▾
              </li>
              {showMobileDropdown && (
                <ul className="mobile-dropdown">
                  <li onClick={() => {
                    if (!isLogin) {
                      alert("Please login to access this service.");
                      goTo("/login");
                    } else {
                      goTo("/services/firm-registration");
                    }
                  }}>
                    {translations.servicesList?.firm}
                  </li>
                  <li onClick={() => goTo("/services/cibil-repair")}>
                    {translations.servicesList?.cibilRepair}
                  </li>
                  <li onClick={() => {
                    if (!isLogin) {
                      alert("Please login to access this service.");
                      goTo("/login");
                    } else {
                      goTo("/services/cibil-training");
                    }
                  }}>
                    {translations.servicesList?.cibilTraining}
                  </li>
                  <li onClick={() => goTo("/services/visa")}>
                    {translations.servicesList?.visa}
                  </li>
                </ul>
              )}

              

              <li onClick={() => goTo("/privacy-policy")}>{translations.privacy}</li>
              <li onClick={() => goTo("/faq")}>{translations.faq}</li>
              <li onClick={() => goTo("/terms&conditions")}>{translations.terms}</li>
              {!isLogin && <li onClick={() => goTo("/signup")}>{translations.signup}</li>}
              {!isLogin && <li onClick={() => goTo("/login")}>{translations.login}</li>}
              {isLogin && <li onClick={handleLogout}>Logout</li>}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // DESKTOP NAVBAR
  return (
    <div className="nav-bar">
      <div className="nav-header-container">
        <div className="logo-container" onClick={() => goTo("/")}>
          <img src={logo} alt="logo" />
          <span className="logo-text">{translations.logotext}</span>
        </div>
      </div>

      <div className="nav">
        <ul className="navbar-menu">
          <li>
            <span onClick={() => goTo("/")}>{translations.home}</span>
          </li>

          <li className="dropdown">
            <span>{translations.services} ▾</span>
            <ul className="dropdown-content">
              <li>
                <span onClick={() => {
                  if (!isLogin) {
                    alert("Please login to access this service.");
                    goTo("/login");
                  } else {
                    goTo("/services/firm-registration");
                  }
                }}>
                  {translations.servicesList?.firm}
                </span>
              </li>
              <li>
                <span onClick={() => goTo("/services/cibil-repair")}>
                  {translations.servicesList?.cibilRepair}
                </span>
              </li>
              <li>
                <span onClick={() => {
                  if (!isLogin) {
                    alert("Please login to access this service.");
                    goTo("/login");
                  } else {
                    goTo("/services/cibil-training");
                  }
                }}>
                  {translations.servicesList?.cibilTraining}
                </span>
              </li>
              <li>
                <span onClick={() => goTo("/services/visa")}>
                  {translations.servicesList?.visa}
                </span>
              </li>
            </ul>
          </li>

          

          <li><span onClick={() => goTo("/privacy-policy")}>{translations.privacy}</span></li>
          <li><span onClick={() => goTo("/faq")}>{translations.faq}</span></li>
          <li><span onClick={() => goTo("/terms&conditions")}>{translations.terms}</span></li>
          {!isLogin && (
            <>
              <li><span onClick={() => goTo("/signup")}>{translations.signup}</span></li>
              <li><span onClick={() => goTo("/login")}>{translations.login}</span></li>
            </>
          )}

          {isLogin && (
            <li><span onClick={handleLogout}>Logout</span></li>
          )}
        </ul>
      </div>
    </div>
  );
}
