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
  const goTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    console.log(isLogin);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    goTo("/");
  };

  return (
    <div className="nav-bar">
      <div>
        <img src={logo} alt="logo" style={{ width: "4%" }} />
        <span className="logo-text" onClick={() => goTo("/")}>
          {navLabels.logotext}
        </span>
      </div>
      <div className="nav-header">
        
        <button className="menu-button" onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>
    
      <div className={`nav ${isMobileMenuOpen ? "open" : ""}`}>
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
                      alert(
                        "Please login to access this service. Redirecting to login page."
                      );
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
            <li>
              <span onClick={handleLogout}>Logout</span>
            </li>
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
   
    
  );
}