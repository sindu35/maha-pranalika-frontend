import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [isLogin, setIsLogin] = React.useState(false);

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
          {translations.logotext}
        </span>
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
                      alert(
                        "Please login to access this service. Redirecting to login page."
                      );
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

          {!isLogin && (
            <li>
              <span onClick={() => goTo("/signup")}>{translations.signup}</span>
            </li>
          )}
          {!isLogin && (
            <li>
              <span onClick={() => goTo("/login")}>{translations.login}</span>
            </li>
          )}

          {isLogin && (
            <li>
              <span onClick={handleLogout}>Logout</span>
            </li>
          )}
          <li>
            <span onClick={() => goTo("/privacy-policy")}>
              {translations.privacy}
            </span>
          </li>
          <li>
            <span onClick={() => goTo("/faq")}>{translations.faq}</span>
          </li>
          <li>
            <span onClick={() => goTo("/terms&conditions")}>
              {translations.terms}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}