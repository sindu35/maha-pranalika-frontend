import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const navigate = useNavigate();

  const { lang,translations } = useLanguage();
  const navLabels = translations[`nav-${lang}`];   
  const [isLogin, setIsLogin] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [ showMobileMenu, setShowMobileMenu] =useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
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
            <span className="logo-text">{navLabels.logotext}</span>
          </div>
          <button className="menu-button" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            ☰
          </button>
        </div>

        {showMobileMenu &&  (
          <div className="mobile-menu">
            <ul>
              <li onClick={() => goTo("/")}>{navLabels.home}</li>

              <li onClick={() => setShowMobileDropdown((prev) => !prev)}>
                {navLabels.services} ▾
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
                    {navLabels.servicesList?.firm}
                  </li>
                  <li onClick={() => goTo("/services/cibil-repair")}>
                    {navLabels.servicesList?.cibilRepair}
                  </li>
                  <li onClick={() => {
                    if (!isLogin) {
                      alert("Please login to access this service.");
                      goTo("/login");
                    } else {
                      goTo("/services/cibil-training");
                    }
                  }}>
                    {navLabels.servicesList?.cibilTraining}
                  </li>
                  <li onClick={() => goTo("/services/visa")}>
                    {navLabels.servicesList?.visa}
                  </li>
                  
                  <li onClick={() => goTo("/services/msme")}>
                   MSME
                  </li>
                </ul>
              )}

              

              <li onClick={() => goTo("/privacy-policy")}>{navLabels.privacy}</li>
              <li onClick={() => goTo("/faq")}>{navLabels.faq}</li>
              <li onClick={() => goTo("/terms&conditions")}>{navLabels.terms}</li>
              {!isLogin && <li onClick={() => goTo("/signup")}>{navLabels.signup}</li>}
              {!isLogin && <li onClick={() => goTo("/login")}>{navLabels.login}</li>}
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
      <div>
      <div style={{ display: "flex"}}>
        <img src={logo} alt="logo" style={{ width: "4%" }} />
        <span className="logo-text" onClick={() => goTo("/")} style={{marginTop:"10px"}}>
          {navLabels.logotext}
        </span>
        </div>
      <div className="nav">
        <ul className="navbar-menu">
          <li>
            <span onClick={() => goTo("/")}>{navLabels.home}</span>
          </li>

          <li className="dropdown">
            <span>{navLabels.services} ▾</span>
            <ul className="dropdown-content">
              <li>
                <span
                  onClick={() => {
                    if (!isLogin) {
                      alert(
                        "Please login to access this service. Redirecting to login page."
                      );
                      goTo("/login");
                    } else {
                      goTo("/services/firm-registration");
                    }
                  }}
                >
                  {navLabels.servicesList?.firm}
        </span>
               
              </li>
              <li>
                <span onClick={() => goTo("/services/cibil-repair")}>
                  {navLabels.servicesList?.cibilRepair}
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
                  {navLabels.servicesList?.cibilTraining}
                </span>
              </li>
              <li>
                <span onClick={() => goTo("/services/visa")}>
                  {navLabels.servicesList?.visa}
                </span>
              </li>
              <li>
              <span onClick={() => goTo("/services/msme")}>
                   MSME
                   </span>
                  </li>
            </ul>
          </li>

        
          {!isLogin && (

            <li>
              <span onClick={() => goTo("/signup")}>{navLabels.signup}</span>
            </li>
          )}
          {!isLogin && (
            <li>
              <span onClick={() => goTo("/login")}>{navLabels.login}</span>
            </li>


          )}

          {isLogin && (
            <li><span onClick={handleLogout}>{navLabels.logout}</span></li>
          )}
          <li>
            <span onClick={() => goTo("/privacy-policy")}>
              {navLabels.privacy}
            </span>
          </li>
          <li>
            <span onClick={() => goTo("/faq")}>{navLabels.faq}</span>
          </li>
          <li>
            <span onClick={() => goTo("/terms&conditions")}>
              {navLabels.terms}
            </span>
          </li>

        </ul>
      </div>
    </div>
    </div>
  );
}
